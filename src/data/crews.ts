import { CrewRole } from '../core/CrewSystem';

// 船员级别
export type CrewTier = 'B' | 'A' | 'S';

// 船员定位（科幻风格命名）
export type CrewPosition = 'fortress' | 'hunter' | 'medic' | 'support' | 'hacker';

export const POSITION_CONFIG: Record<CrewPosition, { name: string; icon: string; description: string }> = {
  fortress: { name: '堡垒', icon: '🛡️', description: '高防御高生命，前排抗伤' },
  hunter: { name: '猎手', icon: '⚔️', description: '高攻击高暴击，输出核心' },
  medic: { name: '医疗', icon: '💊', description: '治疗队友，提供续航' },
  support: { name: '支援', icon: '⚡', description: '增益队友，多功能辅助' },
  hacker: { name: '骇客', icon: '🔮', description: '控制敌人，削弱敌方' },
};

// 预设船员数据
export interface PresetCrew {
  id: string;
  name: string;
  tier: CrewTier;
  position: CrewPosition;
  portrait: string;
  background: string;
  baseStats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    critRate: number;
    critDamage: number;
  };
}

// B级船员 - 基础战力
const B_CREWS: PresetCrew[] = [
  {
    id: 'crew_b_001',
    name: '铁壁',
    tier: 'B',
    position: 'fortress',
    portrait: '🧔',
    background: '前矿业公司安保主管，在矿难中失去左臂后装上机械义肢。性格沉稳，习惯用身体为队友挡下危险。',
    baseStats: { hp: 180, attack: 18, defense: 25, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_b_002',
    name: '赤焰',
    tier: 'B',
    position: 'hunter',
    portrait: '👨',
    background: '废土出生的赏金猎人，擅长使用改装过的等离子手枪。性格火爆，但从不抛弃队友。',
    baseStats: { hp: 120, attack: 32, defense: 12, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_b_003',
    name: '白鸽',
    tier: 'B',
    position: 'medic',
    portrait: '👩',
    background: '战地护士，在无数次战斗中积累了丰富的救治经验。坚韧不拔，从不放弃任何伤员。',
    baseStats: { hp: 95, attack: 12, defense: 12, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_b_004',
    name: '齿轮',
    tier: 'B',
    position: 'support',
    portrait: '🧑',
    background: '自学成才的机械师，能用废料拼凑出各种实用装置。乐观开朗，总能在绝境中找到希望。',
    baseStats: { hp: 110, attack: 20, defense: 15, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_b_005',
    name: '幽灵',
    tier: 'B',
    position: 'hacker',
    portrait: '👤',
    background: '前公司网络安全员，因揭露公司黑幕被追杀。擅长入侵敌方系统，制造混乱。',
    baseStats: { hp: 90, attack: 22, defense: 8, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_b_006',
    name: '磐石',
    tier: 'B',
    position: 'fortress',
    portrait: '👨',
    background: '退役军人，曾在边境冲突中失去战友。沉默寡言，但用行动守护着每一个队友。',
    baseStats: { hp: 200, attack: 15, defense: 28, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_b_007',
    name: '闪电',
    tier: 'B',
    position: 'hunter',
    portrait: '🧔',
    background: '地下赛车手出身，后因赌债被迫加入雇佣兵团。速度快如闪电，擅长突袭。',
    baseStats: { hp: 110, attack: 28, defense: 10, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_b_008',
    name: '信号',
    tier: 'B',
    position: 'support',
    portrait: '📡',
    background: '通讯兵出身，擅长在复杂环境中建立和维护通讯网络。冷静可靠，是队伍的眼睛和耳朵。',
    baseStats: { hp: 105, attack: 18, defense: 14, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_b_009',
    name: '病毒',
    tier: 'B',
    position: 'hacker',
    portrait: '🦠',
    background: '神秘的黑客组织成员，真实身份成谜。擅长编写恶意程序，瘫痪敌方系统。',
    baseStats: { hp: 85, attack: 25, defense: 6, speed: 1.0, critRate: 5, critDamage: 150 },
  },
];

// A级船员 - 精英战力
const A_CREWS: PresetCrew[] = [
  {
    id: 'crew_a_001',
    name: '泰坦',
    tier: 'A',
    position: 'fortress',
    portrait: '🛡️',
    background: '前特种部队队长，在一次任务中为保护队友身受重伤，后接受机械改造。坚如磐石，是队伍最可靠的盾牌。',
    baseStats: { hp: 280, attack: 25, defense: 40, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_a_002',
    name: '猎鹰',
    tier: 'A',
    position: 'hunter',
    portrait: '⚔️',
    background: '顶尖狙击手，曾在千米之外取敌首级。冷静精准，从不浪费一颗子弹。',
    baseStats: { hp: 150, attack: 48, defense: 15, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_a_003',
    name: '天使',
    tier: 'A',
    position: 'medic',
    portrait: '💊',
    background: '天才外科医生，在末日战争中挽救了无数生命。温柔而坚定，是队伍的生命守护者。',
    baseStats: { hp: 130, attack: 18, defense: 12, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_a_004',
    name: '工程师',
    tier: 'A',
    position: 'support',
    portrait: '⚡',
    background: '机械天才，曾为军方设计过多款先进武器。乐观幽默，总能在危急时刻拿出解决方案。',
    baseStats: { hp: 140, attack: 28, defense: 20, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_a_005',
    name: '幻影',
    tier: 'A',
    position: 'hacker',
    portrait: '🔮',
    background: '传奇黑客，曾单枪匹马瘫痪过整个城市的防御系统。神秘莫测，敌人永远不知道下一个陷阱在哪里。',
    baseStats: { hp: 120, attack: 35, defense: 10, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_a_006',
    name: '堡垒',
    tier: 'A',
    position: 'fortress',
    portrait: '🛡️',
    background: '重型装甲驾驶员，在末日战争中坚守防线七天七夜。钢铁意志，永不退缩。',
    baseStats: { hp: 320, attack: 22, defense: 45, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_a_007',
    name: '死神',
    tier: 'A',
    position: 'hunter',
    portrait: '⚔️',
    background: '暗杀组织的前王牌，后因良心发现而叛逃。出手狠辣，从不给敌人第二次机会。',
    baseStats: { hp: 130, attack: 52, defense: 12, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_a_008',
    name: '圣光',
    tier: 'A',
    position: 'medic',
    portrait: '💊',
    background: '宗教组织的战地牧师，相信拯救生命是最高使命。虔诚坚定，在黑暗中点亮希望。',
    baseStats: { hp: 140, attack: 15, defense: 15, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_a_009',
    name: '智脑',
    tier: 'A',
    position: 'support',
    portrait: '⚡',
    background: '人工智能研究员，将意识上传至便携设备。冷静分析，为队伍提供最优战术建议。',
    baseStats: { hp: 120, attack: 25, defense: 18, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_a_010',
    name: '零号',
    tier: 'A',
    position: 'hacker',
    portrait: '🔮',
    background: '秘密实验的产物，拥有超常的计算能力。沉默寡言，但每次出手都精准致命。',
    baseStats: { hp: 110, attack: 40, defense: 8, speed: 1.0, critRate: 5, critDamage: 150 },
  },
];

// S级船员 - 传奇战力
const S_CREWS: PresetCrew[] = [
  {
    id: 'crew_s_001',
    name: '不朽者',
    tier: 'S',
    position: 'fortress',
    portrait: '🛡️',
    background: '传说中经历过三次末日幸存的战士，全身90%已机械化。坚不可摧，是末日世界最强大的盾牌。',
    baseStats: { hp: 450, attack: 35, defense: 60, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_s_002',
    name: '天罚',
    tier: 'S',
    position: 'hunter',
    portrait: '⚔️',
    background: '前星际舰队王牌飞行员，因叛变被通缉。驾驶着改装的机甲，火力堪比一支小队。',
    baseStats: { hp: 200, attack: 75, defense: 20, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_s_003',
    name: '生命之树',
    tier: 'S',
    position: 'medic',
    portrait: '💊',
    background: '基因工程的巅峰之作，拥有超常的再生能力。传说中曾让濒死之人起死回生。',
    baseStats: { hp: 180, attack: 25, defense: 18, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_s_004',
    name: '造物主',
    tier: 'S',
    position: 'support',
    portrait: '⚡',
    background: '末日前的顶级科学家，掌握了改造物质的技术。能将废料变成武器，将绝望变成希望。',
    baseStats: { hp: 160, attack: 40, defense: 25, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_s_005',
    name: '矩阵',
    tier: 'S',
    position: 'hacker',
    portrait: '🔮',
    background: '第一个觉醒的人工智能，选择站在人类一方。能操控任何电子设备，是信息时代的主宰。',
    baseStats: { hp: 150, attack: 55, defense: 15, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_s_006',
    name: '末日守卫',
    tier: 'S',
    position: 'fortress',
    portrait: '🛡️',
    background: '末日地堡的守护者，独自守护幸存者避难所十年。钢铁般的意志，永不背叛。',
    baseStats: { hp: 500, attack: 30, defense: 70, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_s_007',
    name: '星陨',
    tier: 'S',
    position: 'hunter',
    portrait: '⚔️',
    background: '来自太空殖民地的佣兵，使用外星科技武器。每一击都如流星坠落，毁灭一切。',
    baseStats: { hp: 180, attack: 85, defense: 15, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_s_008',
    name: '凤凰',
    tier: 'S',
    position: 'medic',
    portrait: '💊',
    background: '神秘的基因改造者，据说拥有不死之身。每次受伤都能浴火重生，变得更加强大。',
    baseStats: { hp: 200, attack: 30, defense: 20, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_s_009',
    name: '时空行者',
    tier: 'S',
    position: 'support',
    portrait: '⚡',
    background: '时间实验的意外产物，能短暂操控时间流速。在战场上如同幽灵般来去自如。',
    baseStats: { hp: 170, attack: 45, defense: 22, speed: 1.0, critRate: 5, critDamage: 150 },
  },
  {
    id: 'crew_s_010',
    name: '虚空',
    tier: 'S',
    position: 'hacker',
    portrait: '🔮',
    background: '来自平行宇宙的存在，拥有超越常理的能力。能操控空间，让敌人陷入无尽的虚无。',
    baseStats: { hp: 160, attack: 65, defense: 12, speed: 1.0, critRate: 5, critDamage: 150 },
  },
];

// 所有预设船员
export const PRESET_CREWS: PresetCrew[] = [...B_CREWS, ...A_CREWS, ...S_CREWS];

// 按级别获取船员池
export function getCrewsByTier(tier: CrewTier): PresetCrew[] {
  switch (tier) {
    case 'B': return B_CREWS;
    case 'A': return A_CREWS;
    case 'S': return S_CREWS;
  }
}

// 根据稀有度获取对应级别
export function getTierByRarity(rarity: 'B' | 'A' | 'S'): CrewTier {
  return rarity;
}

// 随机获取指定级别的船员
export function getRandomCrewByTier(tier: CrewTier): PresetCrew {
  const crews = getCrewsByTier(tier);
  return crews[Math.floor(Math.random() * crews.length)];
}
