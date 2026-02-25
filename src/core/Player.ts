import type { InventoryItem } from '../data/types';
import { EquipmentSlot } from '../data/equipmentTypes';
import { EquipmentInstance, CalculatedStats, equipmentSystem } from './EquipmentSystem';

export interface PlayerData {
  name: string;
  level: number;
  exp: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  attackSpeed: number;
  weapon: InventoryItem | null;
  armor: InventoryItem | null;
  accessory: InventoryItem | null;
  equipment: EquipmentInstance[];
  stageLevel: number;
  waveNumber: number;
}

export class Player {
  name: string;
  level: number;
  exp: number;
  expToNext: number;

  // 基础属性
  hp: number;
  maxHp: number;
  spirit: number;
  maxSpirit: number;

  stageLevel: number = 1;
  waveNumber: number = 1;

  // 战斗属性（基础值）
  baseAttack: number;
  baseDefense: number;
  baseAgility: number; // 敏捷
  baseAttackSpeed: number;
  baseHit: number;
  baseDodge: number;
  baseCrit: number; // 会心
  baseCritDamage: number;
  basePenetration: number; // 穿透固定值
  basePenetrationPercent: number; // 穿透百分比
  baseTrueDamage: number;
  baseGuard: number; // 护心
  baseLuck: number; // 幸运

  // 装备系统（6槽位）
  equipment: Map<EquipmentSlot, EquipmentInstance>;

  // 基因属性加成（由GameManager注入）
  geneStats: Record<string, number> = {};
  lifeStealPercent: number = 0;

  constructor(data?: Partial<PlayerData>) {
    this.name = data?.name || '幸存者';
    this.level = data?.level || 1;
    this.exp = data?.exp || 0;
    this.expToNext = this.calculateExpToNext();

    const attrs = this.levelAttributes;

    this.maxHp = data?.maxHp || attrs.maxHp;
    this.hp = data?.hp || this.maxHp;
    this.maxSpirit = 100;
    this.spirit = this.maxSpirit;

    this.stageLevel = data?.stageLevel || 1;
    this.waveNumber = data?.waveNumber || 1;

    this.baseAttack = data?.attack || attrs.baseAttack;
    this.baseDefense = data?.defense || attrs.baseDefense;
    this.baseAgility = attrs.baseAgility || 10;
    this.baseAttackSpeed = data?.attackSpeed || 1.0;
    this.baseHit = attrs.baseHit;
    this.baseDodge = attrs.baseDodge;
    this.baseCrit = attrs.baseCrit;
    this.baseCritDamage = 50;
    this.basePenetration = 0;
    this.basePenetrationPercent = 0;
    this.baseTrueDamage = 0;
    this.baseGuard = attrs.baseGuard;
    this.baseLuck = attrs.baseLuck;

    this.equipment = new Map();
    if (data?.equipment) {
      data.equipment.forEach(item => {
        if (item.equipped) {
          this.equipment.set(item.slot, item);
        }
      });
    }
  }

  // 计算升级所需经验 - 分段式指数成长
  private calculateExpToNext(): number {
    if (this.level <= 10) {
      // 1-10级：线性增长
      return Math.floor(100 * this.level * 1.2);
    } else if (this.level <= 50) {
      // 11-50级：指数增长
      const baseExp = 100 * 10 * 1.2;
      return Math.floor(baseExp * Math.pow(1.15, this.level - 10));
    } else {
      // 51级以上：对数增长
      const baseExp = 100 * 10 * 1.2 * Math.pow(1.15, 40);
      return Math.floor(baseExp * (1 + Math.log(this.level - 49) * 0.1));
    }
  }

  // 计算属性值 - 每级提升10%（基于初始数值，叠乘）
  private calculateAttribute(baseValue: number, level: number): number {
    // 每级提升10%，基于初始数值叠乘
    return baseValue * Math.pow(1.1, level - 1);
  }

  get levelAttributes() {
    return {
      maxHp: Math.floor(this.calculateAttribute(100, this.level)),
      baseAttack: Math.floor(this.calculateAttribute(10, this.level)),
      baseDefense: Math.floor(this.calculateAttribute(5, this.level)),
      baseAgility: Math.floor(10 * (1 + this.level * 0.1)),
      baseHit: Math.floor(this.calculateAttribute(50, this.level)),
      baseDodge: 5,
      baseCrit: 5,
      baseCritDamage: 50,
      basePenetration: 0,
      basePenetrationPercent: 0,
      baseTrueDamage: 0,
      baseGuard: 5,
      baseLuck: 0,
    };
  }

  // 获取装备列表
  get equippedItems(): EquipmentInstance[] {
    return Array.from(this.equipment.values());
  }

  // 获取装备属性加成
  get equipmentStats(): CalculatedStats {
    return equipmentSystem.calculateEquipmentStats(this.equippedItems);
  }

  // 获取总攻击力（基础+装备+强化+基因）
  get totalAttack(): number {
    const equipmentAttack = this.equipmentStats.attack;
    const genePercent = this.geneStats['attackPercent'] || 0;
    return Math.floor((this.baseAttack + equipmentAttack) * (1 + genePercent / 100));
  }

  // 获取总防御力
  get totalDefense(): number {
    const equipmentDefense = this.equipmentStats.defense;
    const genePercent = this.geneStats['defensePercent'] || 0;
    return Math.floor((this.baseDefense + equipmentDefense) * (1 + genePercent / 100));
  }

  // 获取总敏捷
  get totalAgility(): number {
    const geneAgility = this.geneStats['speedPercent'] || 0;
    return this.baseAgility + this.equipmentStats.agility + geneAgility;
  }

  // 获取总攻速
  get totalAttackSpeed(): number {
    const equipmentSpeed = this.equipmentStats.speed;
    const geneSpeed = this.geneStats['speedPercent'] || 0;
    return this.baseAttackSpeed + equipmentSpeed + (geneSpeed / 100);
  }

  // 获取总命中值
  get totalHit(): number {
    return this.baseHit + this.equipmentStats.hit + (this.geneStats['hit'] || 0);
  }

  // 获取总闪避值
  get totalDodge(): number {
    const geneDodge = this.geneStats['dodgeRate'] || 0;
    return this.baseDodge + this.equipmentStats.dodge + geneDodge;
  }

  // 获取总暴击率
  get totalCrit(): number {
    const geneCrit = this.geneStats['critRate'] || 0;
    return this.baseCrit + this.equipmentStats.crit + geneCrit;
  }

  // 获取总暴击伤害
  get totalCritDamage(): number {
    const geneCritDamage = this.geneStats['critDamage'] || 0;
    return this.baseCritDamage + this.equipmentStats.critDamage + geneCritDamage;
  }

  // 获取总穿透固定值
  get totalPenetration(): number {
    return this.basePenetration + this.equipmentStats.penetration + (this.geneStats['penetration'] || 0);
  }

  // 获取总穿透百分比
  get totalPenetrationPercent(): number {
    return this.basePenetrationPercent + this.equipmentStats.penetrationPercent + (this.geneStats['penetrationPercent'] || 0);
  }

  // 获取总真实伤害倍率
  get totalTrueDamage(): number {
    return this.baseTrueDamage + this.equipmentStats.trueDamage + (this.geneStats['trueDamage'] || 0);
  }

  // 获取总护心
  get totalGuard(): number {
    return this.baseGuard + this.equipmentStats.guard + (this.geneStats['guard'] || 0);
  }

  // 获取总幸运
  get totalLuck(): number {
    return this.baseLuck + this.equipmentStats.luck + (this.geneStats['luck'] || 0);
  }

  // 获取总生命值
  get totalMaxHp(): number {
    const equipmentHp = this.equipmentStats.hp;
    const genePercent = this.geneStats['maxHpPercent'] || 0;
    return Math.floor((this.maxHp + equipmentHp) * (1 + genePercent / 100));
  }

  // 获取生命偷取率（基因专属属性）
  get totalLifeSteal(): number {
    return this.lifeStealPercent;
  }

  // 更新基因属性
  updateGeneStats(stats: Record<string, number>, lifeSteal: number): void {
    this.geneStats = stats;
    this.lifeStealPercent = lifeSteal;
  }

  // 计算减伤比 = 防御力 / (防御力 + 600) * 100%
  get damageReduction(): number {
    const defense = this.totalDefense;
    return (defense / (defense + 600)) * 100;
  }

  // 计算最终减伤比（考虑穿透）= (防御力 - 穿透固定值) / (防御力 + 600) * 100% - 穿透百分比
  get finalDamageReduction(): number {
    const defense = Math.max(0, this.totalDefense - this.totalPenetration);
    const reduction = (defense / (defense + 600)) * 100;
    return Math.max(0, reduction - this.totalPenetrationPercent);
  }

  // 获取战力
  get power(): number {
    const basePower = equipmentSystem.calculatePower({
      attack: this.totalAttack,
      defense: this.totalDefense,
      hp: this.totalMaxHp,
      hit: this.totalHit,
      dodge: this.totalDodge,
      speed: this.totalAttackSpeed,
      crit: this.totalCrit,
      critDamage: this.totalCritDamage,
      penetration: this.totalPenetration,
      trueDamage: this.totalTrueDamage,
    });
    return Math.floor(basePower);
  }

  // 受到伤害
  takeDamage(amount: number): void {
    // 伤害已经在战斗系统中计算完成，直接扣除
    this.hp = Math.max(0, this.hp - amount);
  }

  // 治疗
  heal(amount: number): void {
    this.hp = Math.min(this.totalMaxHp, this.hp + amount);
  }

  // 消耗神能
  consumeSpirit(amount: number): boolean {
    if (this.spirit < amount) {
      return false;
    }
    this.spirit -= amount;
    return true;
  }

  addExp(amount: number): string[] {
    const logs: string[] = [];
    this.exp += amount;

    while (this.exp >= this.expToNext) {
      this.exp -= this.expToNext;
      this.levelUp();
      logs.push(`升级！达到 ${this.level} 级`);
    }

    return logs;
  }

  private levelUp(): void {
    this.level++;
    this.expToNext = this.calculateExpToNext();

    const attrs = this.levelAttributes;
    this.maxHp = attrs.maxHp;
    this.hp = this.maxHp;
    this.baseAttack = attrs.baseAttack;
    this.baseDefense = attrs.baseDefense;
    this.baseHit = attrs.baseHit;
    this.baseDodge = attrs.baseDodge;
    this.baseCrit = attrs.baseCrit;
  }

  // 装备普通物品（来自制造系统）
  equipInventoryItem(item: InventoryItem): boolean {
    // 计算装备前的总生命值
    const oldMaxHp = this.totalMaxHp;

    // 获取槽位
    const slot = item.slot as EquipmentSlot;
    if (!slot) {
      return false;
    }

    // 卸下该槽位已有装备
    const existing = this.equipment.get(slot);
    if (existing) {
      existing.equipped = false;
    }

    // 将 InventoryItem 转换为 EquipmentInstance
    const equipmentInstance: EquipmentInstance = {
      id: item.id,
      instanceId: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: item.name,
      slot: slot,
      rarity: item.rarity,
      level: 1,
      stationId: 'crafted',
      stationNumber: 0,
      description: item.description,
      stats: {
        attack: item.attack || 0,
        defense: item.defense || 0,
        hp: item.maxHp || 0,
        speed: item.speed || 0,
        crit: item.critRate || 0,
        critDamage: item.critDamage || 0,
        dodge: item.dodgeRate || 0,
        hit: item.hitRate || 0,
        penetration: 0,
      },
      effects: [],
      quantity: 1,
      equipped: true,
      enhanceLevel: item.enhanceLevel || 0,
      sublimationLevel: item.sublimationLevel || 0,
    };

    // 装备新物品
    this.equipment.set(slot, equipmentInstance);
    item.equipped = true;

    // 计算装备后的总生命值，并相应调整当前生命值
    const newMaxHp = this.totalMaxHp;
    const hpDiff = newMaxHp - oldMaxHp;
    this.hp = Math.min(newMaxHp, this.hp + hpDiff);

    return true;
  }

  // 卸下指定槽位的装备
  unequipSlot(slot: EquipmentSlot): void {
    // 计算卸下前的总生命值
    const oldMaxHp = this.totalMaxHp;

    const item = this.equipment.get(slot);
    if (item) {
      item.equipped = false;
      this.equipment.delete(slot);

      // 计算卸下后的总生命值，并相应调整当前生命值
      const newMaxHp = this.totalMaxHp;
      const hpDiff = newMaxHp - oldMaxHp;
      this.hp = Math.min(newMaxHp, Math.max(1, this.hp + hpDiff));
    }
  }

  // 装备新系统装备
  equipMythologyItem(item: EquipmentInstance): boolean {
    // 计算装备前的总生命值
    const oldMaxHp = this.totalMaxHp;

    // 卸下该槽位已有装备
    const existing = this.equipment.get(item.slot);
    if (existing) {
      existing.equipped = false;
    }

    // 装备新物品
    item.equipped = true;
    this.equipment.set(item.slot, item);

    // 计算装备后的总生命值，并相应调整当前生命值
    const newMaxHp = this.totalMaxHp;
    const hpDiff = newMaxHp - oldMaxHp;
    this.hp = Math.min(newMaxHp, this.hp + hpDiff);

    return true;
  }

  // 卸下新系统装备
  unequipMythologyItem(slot: EquipmentSlot): EquipmentInstance | null {
    // 计算卸下前的总生命值
    const oldMaxHp = this.totalMaxHp;

    const item = this.equipment.get(slot);
    if (item) {
      item.equipped = false;
      this.equipment.delete(slot);

      // 计算卸下后的总生命值，并相应调整当前生命值
      const newMaxHp = this.totalMaxHp;
      const hpDiff = newMaxHp - oldMaxHp;
      this.hp = Math.min(newMaxHp, Math.max(1, this.hp + hpDiff));

      return item;
    }
    return null;
  }

  // 获取指定槽位的装备
  getEquipmentBySlot(slot: EquipmentSlot): EquipmentInstance | undefined {
    return this.equipment.get(slot);
  }

  // 检查是否装备了某个套装的指定数量
  getSetPieceCount(stationNumber: number): number {
    return Array.from(this.equipment.values()).filter(
      item => item.stationNumber === stationNumber
    ).length;
  }

  // 获取所有套装效果
  getSetBonuses(): { description: string; effects: { stat: string; value: number }[] }[] {
    const stats = equipmentSystem.calculateEquipmentStats(this.equippedItems);
    return [{
      description: '装备属性加成',
      effects: [
        { stat: 'attack', value: stats.attack },
        { stat: 'defense', value: stats.defense },
        { stat: 'hp', value: stats.hp },
        { stat: 'agility', value: stats.agility },
        { stat: 'speed', value: stats.speed },
        { stat: 'crit', value: stats.crit },
        { stat: 'critDamage', value: stats.critDamage },
        { stat: 'penetration', value: stats.penetration },
        { stat: 'trueDamage', value: stats.trueDamage },
        { stat: 'guard', value: stats.guard },
        { stat: 'luck', value: stats.luck },
      ].filter(e => e.value > 0)
    }];
  }

  get isDead(): boolean {
    return this.hp <= 0;
  }

  serialize(): PlayerData {
    return {
      name: this.name,
      level: this.level,
      exp: this.exp,
      hp: this.hp,
      maxHp: this.maxHp,
      attack: this.baseAttack,
      defense: this.baseDefense,
      attackSpeed: this.baseAttackSpeed,
      weapon: null,
      armor: null,
      accessory: null,
      equipment: this.equippedItems,
      stageLevel: this.stageLevel,
      waveNumber: this.waveNumber,
    };
  }
}
