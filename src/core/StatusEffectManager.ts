export type StatusEffectType =
  | 'burn'        // 灼烧 - 持续伤害
  | 'armorBreak'  // 破甲 - 防御降低
  | 'stun'        // 眩晕 - 停止行动
  | 'attackReduce' // 攻击降低
  | 'trojan'      // 木马 - 攻击力降低
  | 'invincible'  // 无敌
  | 'vitality'    // 活力 - 治疗效果提升
  | 'shieldAngel' // 守护天使 - 致命伤害保护
  | 'damageShare' // 伤害分担
  | 'armorPiercingAmmo' // 穿甲弹
  | 'speedBoost'  // 攻速提升
  | 'attackBoost' // 攻击力提升;

export interface StatusEffect {
  id: string;
  type: StatusEffectType;
  targetId: string;
  sourceId: string;
  sourceName: string;

  // 效果数值
  value: number;

  // 持续时间（秒）
  duration: number;
  remainingTime: number;

  // 叠加上限
  maxStacks?: number;
  currentStacks: number;

  // 额外数据
  extra?: {
    damagePerSecond?: number;    // 灼烧：每秒伤害百分比（基于攻击力）
    defensePercent?: number;     // 破甲：防御降低百分比
    attackPercent?: number;      // 攻击降低百分比
    critDamageBonus?: number;   // 穿甲弹：暴击伤害加成
    armorPierce?: number;       // 穿甲弹：防御穿透
    damageSharePercent?: number; // 伤害分担百分比
  };

  // 来源攻击力（用于灼烧等基于攻击力的效果）
  sourceAttack?: number;

  // 创建时间
  createdAt: number;

  // 上次tick时间（用于灼烧等持续伤害）
  lastTickTime?: number;
}

let effectIdCounter = 0;

export function generateEffectId(): string {
  return `effect_${Date.now()}_${++effectIdCounter}`;
}

export function createStatusEffect(
  type: StatusEffectType,
  targetId: string,
  sourceId: string,
  sourceName: string,
  value: number,
  duration: number,
  options?: {
    maxStacks?: number;
    extra?: StatusEffect['extra'];
    sourceAttack?: number;
  }
): StatusEffect {
  const now = Date.now();
  return {
    id: generateEffectId(),
    type,
    targetId,
    sourceId,
    sourceName,
    value,
    duration,
    remainingTime: duration,
    maxStacks: options?.maxStacks,
    currentStacks: 1,
    extra: options?.extra,
    sourceAttack: options?.sourceAttack,
    createdAt: now,
    lastTickTime: now,
  };
}

export function updateStatusEffects(
  effects: StatusEffect[],
  deltaTime: number
): {
  updatedEffects: StatusEffect[];
  expiredEffects: StatusEffect[];
  tickEffects: StatusEffect[];
} {
  const expiredEffects: StatusEffect[] = [];
  const tickEffects: StatusEffect[] = [];

  const updatedEffects: StatusEffect[] = [];

  effects.forEach(effect => {
    // 永久持续的效果（duration为Infinity）不会被移除
    if (effect.remainingTime === Infinity) {
      updatedEffects.push(effect);
      return;
    }

    const newRemainingTime = effect.remainingTime - deltaTime;

    if (newRemainingTime <= 0) {
      // 效果过期，添加到过期列表，不保留在更新列表中
      expiredEffects.push(effect);
      return;
    }

    // 灼烧效果每秒触发一次
    if (effect.type === 'burn' && effect.extra?.damagePerSecond) {
      const now = Date.now();
      const timeSinceLastTick = (now - (effect.lastTickTime || effect.createdAt)) / 1000;

      if (timeSinceLastTick >= 1) {
        tickEffects.push(effect);
        // 更新lastTickTime，保留所有属性包括sourceAttack
        updatedEffects.push({
          ...effect,
          remainingTime: newRemainingTime,
          lastTickTime: now,
        });
        return;
      }
    }

    updatedEffects.push({
      ...effect,
      remainingTime: newRemainingTime,
    });
  });

  return { updatedEffects, expiredEffects, tickEffects };
}

export function applyStatusEffect(
  effects: StatusEffect[],
  newEffect: StatusEffect
): StatusEffect[] {
  const existingIndex = effects.findIndex(
    e => e.type === newEffect.type && e.targetId === newEffect.targetId
  );

  if (existingIndex >= 0) {
    const existing = effects[existingIndex];
    const maxStacks = existing.maxStacks || newEffect.maxStacks;

    // 检查是否可以叠加
    if (maxStacks && existing.currentStacks >= maxStacks) {
      return effects;
    }

    // 叠加效果
    const updated = [...effects];
    updated[existingIndex] = {
      ...existing,
      maxStacks: maxStacks,
      currentStacks: existing.currentStacks + 1,
      remainingTime: existing.remainingTime === Infinity ? Infinity : Math.max(existing.remainingTime, newEffect.duration),
      value: existing.value + newEffect.value,
      sourceAttack: existing.sourceAttack || newEffect.sourceAttack,
    };
    return updated;
  }

  return [...effects, newEffect];
}

export function removeStatusEffects(
  effects: StatusEffect[],
  targetId: string,
  type?: StatusEffectType
): StatusEffect[] {
  if (type) {
    return effects.filter(e => !(e.targetId === targetId && e.type === type));
  }
  return effects.filter(e => e.targetId !== targetId);
}

export function getTargetEffects(
  effects: StatusEffect[],
  targetId: string
): StatusEffect[] {
  return effects.filter(e => e.targetId === targetId);
}

export function hasEffect(
  effects: StatusEffect[],
  targetId: string,
  type: StatusEffectType
): boolean {
  return effects.some(e => e.targetId === targetId && e.type === type && e.remainingTime > 0);
}

export function getEffectValue(
  effects: StatusEffect[],
  targetId: string,
  type: StatusEffectType
): number {
  const targetEffects = effects.filter(e => e.targetId === targetId && e.type === type && e.remainingTime > 0);
  return targetEffects.reduce((sum, e) => sum + e.value * e.currentStacks, 0);
}

export function getEffectStacks(
  effects: StatusEffect[],
  targetId: string,
  type: StatusEffectType
): number {
  const targetEffects = effects.filter(e => e.targetId === targetId && e.type === type && e.remainingTime > 0);
  return targetEffects.reduce((sum, e) => sum + e.currentStacks, 0);
}

export function calculateStatusEffectBonuses(
  effects: StatusEffect[],
  targetId: string,
  baseDefense: number,
  baseAttack: number,
  baseCritDamage: number,
  baseArmorPierce: number,
  baseHealEffectiveness: number,
  baseSpeed: number = 0
): {
  defense: number;
  attack: number;
  critDamage: number;
  armorPierce: number;
  healEffectiveness: number;
  speedBoost: number;
  isInvincible: boolean;
  isStunned: boolean;
  isSharingDamage: boolean;
  damageSharePercent: number;
} {
  const targetEffects = effects.filter(e => e.targetId === targetId && e.remainingTime > 0);

  let defenseReduction = 0;
  let attackReduction = 0;
  let critDamageBonus = 0;
  let armorPierceBonus = 0;
  let healEffectivenessBonus = 0;
  let speedBoostPercent = 0;
  let isInvincible = false;
  let isStunned = false;
  let damageSharePercent = 0;

  targetEffects.forEach(effect => {
    switch (effect.type) {
      case 'armorBreak':
        defenseReduction += (effect.extra?.defensePercent || effect.value) * effect.currentStacks;
        break;
      case 'trojan':
      case 'attackReduce':
        attackReduction += (effect.extra?.attackPercent || effect.value) * effect.currentStacks;
        break;
      case 'armorPiercingAmmo':
        critDamageBonus += (effect.extra?.critDamageBonus || 0) * effect.currentStacks;
        armorPierceBonus += (effect.extra?.armorPierce || 0) * effect.currentStacks;
        break;
      case 'vitality':
        healEffectivenessBonus += effect.value * effect.currentStacks;
        break;
      case 'speedBoost':
        speedBoostPercent += effect.value * effect.currentStacks;
        break;
      case 'invincible':
        isInvincible = true;
        break;
      case 'stun':
        isStunned = true;
        break;
      case 'damageShare':
        damageSharePercent += (effect.extra?.damageSharePercent || effect.value) * effect.currentStacks;
        break;
    }
  });

  return {
    defense: Math.max(0, baseDefense * (1 - defenseReduction / 100)),
    attack: Math.max(0, baseAttack * (1 - attackReduction / 100)),
    critDamage: baseCritDamage + critDamageBonus,
    armorPierce: baseArmorPierce + armorPierceBonus,
    healEffectiveness: baseHealEffectiveness + healEffectivenessBonus,
    speedBoost: baseSpeed + (baseSpeed * speedBoostPercent / 100),
    isInvincible,
    isStunned,
    isSharingDamage: damageSharePercent > 0,
    damageSharePercent,
  };
}

export function calculateBurnDamage(
  effects: StatusEffect[],
  targetId: string
): number {
  const burnEffects = effects.filter(
    e => e.targetId === targetId && e.type === 'burn' && e.remainingTime > 0
  );

  let totalDamage = 0;
  burnEffects.forEach(effect => {
    const damagePercent = effect.extra?.damagePerSecond || 0;
    const attack = effect.sourceAttack || 0;
    const baseDamage = Math.floor(attack * (damagePercent / 100));
    const stackDamage = baseDamage * effect.currentStacks;
    totalDamage += stackDamage;
  });

  return totalDamage;
}

export function applyShieldWithCap(
  currentShield: number,
  newShield: number,
  maxShield: number
): number {
  return Math.min(currentShield + newShield, maxShield);
}

export function calculateShieldCap(
  baseStat: number,
  shieldCapPercent: number
): number {
  return Math.floor(baseStat * (shieldCapPercent / 100));
}
