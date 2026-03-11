export enum CommEventType {
  TRADER = 'trader',
  DISTRESS = 'distress',
  MYSTERY = 'mystery',
  BOUNTY = 'bounty',
  TREASURE = 'treasure',
  CHIP_SUPPLY = 'chip_supply',
}

export interface CommEvent {
  id: string;
  type: CommEventType;
  title: string;
  description: string;
  expireTime: number;
  rewards: {
    credits?: number;
    items?: { itemId: string; count: number }[];
    exp?: number;
  };
  requirements?: {
    minLevel?: number;
    stamina?: number;
  };
  responded: boolean;
}

export interface CommEventData {
  id: string;
  type: CommEventType;
  title: string;
  description: string;
  expireTime: number;
  rewards: {
    credits?: number;
    items?: { itemId: string; count: number }[];
    exp?: number;
  };
  requirements?: {
    minLevel?: number;
    stamina?: number;
  };
  responded: boolean;
}

export const COMM_EVENT_CONFIG: Record<CommEventType, {
  name: string;
  icon: string;
  color: string;
  description: string;
}> = {
  [CommEventType.TRADER]: {
    name: '星际商队',
    icon: '🚚',
    color: '#3b82f6',
    description: '路过的商队，可进行交易',
  },
  [CommEventType.DISTRESS]: {
    name: '求救信号',
    icon: '🆘',
    color: '#ef4444',
    description: '收到求救信号，救援可获得奖励',
  },
  [CommEventType.MYSTERY]: {
    name: '神秘信号',
    icon: '❓',
    color: '#a855f7',
    description: '来源不明的神秘信号',
  },
  [CommEventType.BOUNTY]: {
    name: '悬赏任务',
    icon: '🎯',
    color: '#f59e0b',
    description: '星际悬赏，完成可获得丰厚奖励',
  },
  [CommEventType.TREASURE]: {
    name: '宝藏信号',
    icon: '💎',
    color: '#10b981',
    description: '探测到宝藏信号',
  },
  [CommEventType.CHIP_SUPPLY]: {
    name: '芯片补给',
    icon: '💾',
    color: '#06b6d4',
    description: '芯片研发材料的补给信号',
  },
};

const EVENT_TEMPLATES: Array<{
  type: CommEventType;
  title: string;
  description: string;
  minCredits: number;
  maxCredits: number;
  possibleItems: { itemId: string; minCount: number; maxCount: number }[];
  minExp: number;
  maxExp: number;
  staminaCost: number;
  rarity: number;
  minFacilityLevel: number;
}> = [
  {
    type: CommEventType.TRADER,
    title: '星际商队',
    description: '一支星际商队路过，愿意进行交易',
    minCredits: 200,
    maxCredits: 500,
    possibleItems: [
      { itemId: 'recruit_ticket_normal', minCount: 1, maxCount: 1 },
      { itemId: 'enhance_stone', minCount: 3, maxCount: 5 },
    ],
    minExp: 20,
    maxExp: 50,
    staminaCost: 0,
    rarity: 1,
    minFacilityLevel: 1,
  },
  {
    type: CommEventType.TRADER,
    title: '稀有商队',
    description: '一支携带稀有物资的商队',
    minCredits: 500,
    maxCredits: 1000,
    possibleItems: [
      { itemId: 'recruit_ticket_limited', minCount: 1, maxCount: 1 },
      { itemId: 'mat_001_alloy', minCount: 5, maxCount: 10 },
    ],
    minExp: 50,
    maxExp: 100,
    staminaCost: 0,
    rarity: 3,
    minFacilityLevel: 2,
  },
  {
    type: CommEventType.DISTRESS,
    title: '求救信号',
    description: '收到一艘受损飞船的求救信号',
    minCredits: 100,
    maxCredits: 300,
    possibleItems: [
      { itemId: 'mat_001_stardust', minCount: 3, maxCount: 8 },
    ],
    minExp: 30,
    maxExp: 60,
    staminaCost: 10,
    rarity: 1,
    minFacilityLevel: 1,
  },
  {
    type: CommEventType.DISTRESS,
    title: '紧急求救',
    description: '一支探险队遭遇危险，急需救援',
    minCredits: 300,
    maxCredits: 600,
    possibleItems: [
      { itemId: 'mat_001_alloy', minCount: 3, maxCount: 6 },
      { itemId: 'recruit_ticket_normal', minCount: 1, maxCount: 2 },
    ],
    minExp: 50,
    maxExp: 100,
    staminaCost: 20,
    rarity: 2,
    minFacilityLevel: 2,
  },
  {
    type: CommEventType.MYSTERY,
    title: '神秘信号',
    description: '接收到一段加密的神秘信号',
    minCredits: 0,
    maxCredits: 200,
    possibleItems: [
      { itemId: 'mat_003_crystal', minCount: 1, maxCount: 3 },
    ],
    minExp: 40,
    maxExp: 80,
    staminaCost: 15,
    rarity: 2,
    minFacilityLevel: 1,
  },
  {
    type: CommEventType.MYSTERY,
    title: '远古信号',
    description: '探测到来自远古文明的信号',
    minCredits: 500,
    maxCredits: 1500,
    possibleItems: [
      { itemId: 'mat_004_quantum', minCount: 1, maxCount: 2 },
      { itemId: 'recruit_ticket_limited', minCount: 1, maxCount: 1 },
    ],
    minExp: 100,
    maxExp: 200,
    staminaCost: 30,
    rarity: 4,
    minFacilityLevel: 3,
  },
  {
    type: CommEventType.BOUNTY,
    title: '悬赏任务',
    description: '星际联盟发布悬赏任务',
    minCredits: 400,
    maxCredits: 800,
    possibleItems: [
      { itemId: 'enhance_stone', minCount: 5, maxCount: 10 },
    ],
    minExp: 60,
    maxExp: 120,
    staminaCost: 25,
    rarity: 2,
    minFacilityLevel: 1,
  },
  {
    type: CommEventType.BOUNTY,
    title: '高级悬赏',
    description: '高难度悬赏任务，奖励丰厚',
    minCredits: 1000,
    maxCredits: 2000,
    possibleItems: [
      { itemId: 'mat_003_crystal', minCount: 3, maxCount: 5 },
      { itemId: 'recruit_ticket_limited', minCount: 1, maxCount: 1 },
    ],
    minExp: 150,
    maxExp: 300,
    staminaCost: 40,
    rarity: 4,
    minFacilityLevel: 3,
  },
  {
    type: CommEventType.TREASURE,
    title: '宝藏信号',
    description: '探测到附近有宝藏信号',
    minCredits: 200,
    maxCredits: 500,
    possibleItems: [
      { itemId: 'mat_001_stardust', minCount: 5, maxCount: 10 },
      { itemId: 'mat_003_stardust', minCount: 3, maxCount: 6 },
    ],
    minExp: 30,
    maxExp: 60,
    staminaCost: 15,
    rarity: 2,
    minFacilityLevel: 1,
  },
  {
    type: CommEventType.TREASURE,
    title: '远古宝藏',
    description: '发现远古文明遗留的宝藏信号',
    minCredits: 800,
    maxCredits: 1500,
    possibleItems: [
      { itemId: 'mat_004_quantum', minCount: 2, maxCount: 4 },
      { itemId: 'mat_005_void', minCount: 1, maxCount: 2 },
    ],
    minExp: 100,
    maxExp: 200,
    staminaCost: 35,
    rarity: 5,
    minFacilityLevel: 4,
  },
  {
    type: CommEventType.CHIP_SUPPLY,
    title: '芯片补给站',
    description: '发现一个芯片材料补给站',
    minCredits: 300,
    maxCredits: 600,
    possibleItems: [
      { itemId: 'chip_material', minCount: 5, maxCount: 10 },
      { itemId: 'mineral_titanium', minCount: 3, maxCount: 5 },
    ],
    minExp: 50,
    maxExp: 100,
    staminaCost: 20,
    rarity: 2,
    minFacilityLevel: 2,
  },
  {
    type: CommEventType.CHIP_SUPPLY,
    title: '高级芯片补给',
    description: '探测到高级芯片研发材料的信号',
    minCredits: 800,
    maxCredits: 1500,
    possibleItems: [
      { itemId: 'chip_material', minCount: 15, maxCount: 25 },
      { itemId: 'gene_material', minCount: 5, maxCount: 10 },
      { itemId: 'mineral_crystal', minCount: 3, maxCount: 5 },
    ],
    minExp: 150,
    maxExp: 250,
    staminaCost: 35,
    rarity: 4,
    minFacilityLevel: 3,
  },
  {
    type: CommEventType.CHIP_SUPPLY,
    title: '神经核心信号',
    description: '探测到稀有神经核心的信号源',
    minCredits: 2000,
    maxCredits: 4000,
    possibleItems: [
      { itemId: 'cyber_core', minCount: 1, maxCount: 2 },
      { itemId: 'chip_material', minCount: 20, maxCount: 35 },
      { itemId: 'mineral_quantum', minCount: 1, maxCount: 3 },
    ],
    minExp: 300,
    maxExp: 500,
    staminaCost: 50,
    rarity: 5,
    minFacilityLevel: 5,
  },
];

let eventIdCounter = 0;

function generateEventId(): string {
  eventIdCounter++;
  return `comm_event_${Date.now()}_${eventIdCounter}`;
}

export function generateCommEvent(facilityLevel: number): CommEvent | null {
  const availableTemplates = EVENT_TEMPLATES.filter(t => t.minFacilityLevel <= facilityLevel);
  
  if (availableTemplates.length === 0) {
    return null;
  }
  
  const weights = availableTemplates.map(t => Math.max(1, 6 - t.rarity + facilityLevel));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * totalWeight;
  
  let selectedTemplate = availableTemplates[0];
  for (let i = 0; i < availableTemplates.length; i++) {
    roll -= weights[i];
    if (roll <= 0) {
      selectedTemplate = availableTemplates[i];
      break;
    }
  }
  
  const credits = Math.floor(
    selectedTemplate.minCredits + Math.random() * (selectedTemplate.maxCredits - selectedTemplate.minCredits)
  );
  
  const items: { itemId: string; count: number }[] = [];
  if (selectedTemplate.possibleItems.length > 0) {
    const numItems = Math.min(selectedTemplate.possibleItems.length, 1 + Math.floor(Math.random() * 2));
    const shuffled = [...selectedTemplate.possibleItems].sort(() => Math.random() - 0.5);
    for (let i = 0; i < numItems; i++) {
      const item = shuffled[i];
      const count = Math.floor(item.minCount + Math.random() * (item.maxCount - item.minCount + 1));
      items.push({ itemId: item.itemId, count });
    }
  }
  
  const exp = Math.floor(
    selectedTemplate.minExp + Math.random() * (selectedTemplate.maxExp - selectedTemplate.minExp)
  );
  
  const baseExpireMinutes = 30;
  const levelBonus = facilityLevel * 10;
  const expireMinutes = baseExpireMinutes + Math.floor(Math.random() * 90) + levelBonus;
  const expireTime = Date.now() + expireMinutes * 60 * 1000;
  
  return {
    id: generateEventId(),
    type: selectedTemplate.type,
    title: selectedTemplate.title,
    description: selectedTemplate.description,
    expireTime,
    rewards: {
      credits: credits > 0 ? credits : undefined,
      items: items.length > 0 ? items : undefined,
      exp: exp > 0 ? exp : undefined,
    },
    requirements: selectedTemplate.staminaCost > 0 ? { stamina: selectedTemplate.staminaCost } : undefined,
    responded: false,
  };
}

export function getMaxEvents(facilityLevel: number): number {
  return 2 + facilityLevel;
}

export function getScanCooldown(facilityLevel: number): number {
  return Math.max(5, 30 - facilityLevel * 5);
}

export function getRareEventChance(facilityLevel: number): number {
  return 5 + facilityLevel * 3;
}

export function getEventDurationBonus(facilityLevel: number): number {
  return facilityLevel * 10;
}

export function serializeCommEvent(event: CommEvent): CommEventData {
  return { ...event };
}

export function deserializeCommEvent(data: CommEventData): CommEvent {
  return { ...data };
}

export function isEventExpired(event: CommEvent): boolean {
  return Date.now() > event.expireTime;
}

export function getRemainingTime(event: CommEvent): number {
  return Math.max(0, event.expireTime - Date.now());
}

export function formatRemainingTime(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  
  if (minutes > 0) {
    return `${minutes}分${seconds}秒`;
  }
  return `${seconds}秒`;
}
