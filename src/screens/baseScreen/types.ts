export interface BaseFacility {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  level?: number;
  maxLevel?: number;
  status: 'active' | 'locked' | 'building';
}

export const FACILITIES: BaseFacility[] = [
  { id: 'crew', name: '船员舱', icon: '👥', description: '招募与管理船员', color: '#00d4ff', status: 'active' },
  { id: 'energy', name: '能源核心', icon: '⚡', description: '升级星舰能源系统', color: '#f59e0b', level: 1, maxLevel: 10, status: 'active' },
  { id: 'warehouse', name: '星际仓库', icon: '📦', description: '扩展存储容量', color: '#10b981', level: 1, maxLevel: 10, status: 'active' },
  { id: 'research', name: '科研实验室', icon: '🔬', description: '解锁新配方', color: '#c084fc', status: 'active' },
  { id: 'mining', name: '采矿平台', icon: '⛏️', description: '自动采集矿物资源', color: '#f59e0b', level: 1, maxLevel: 5, status: 'active' },
  { id: 'chip', name: '芯片研发', icon: '💾', description: '解锁芯片品质和槽位', color: '#00d4ff', level: 1, maxLevel: 3, status: 'active' },
  { id: 'alliance', name: '基因工程', icon: '🧬', description: '基因改造与强化', color: '#22c55e', status: 'active' },
  { id: 'arena', name: '机械飞升', icon: '🦾', description: '解锁义体品质和槽位', color: '#a855f7', level: 1, maxLevel: 3, status: 'active' },
  { id: 'market', name: '星际市场', icon: '🏪', description: '玩家间交易', color: '#ec4899', status: 'active' },
  { id: 'relic', name: '遗迹探索', icon: '🏛️', description: '探索古代遗迹', color: '#f97316', status: 'active' },
];
