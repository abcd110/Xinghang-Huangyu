import { MYTHOLOGY_EQUIPMENT as EQUIPMENT_1_8 } from './mythologyEquipment';
import { MYTHOLOGY_EQUIPMENT as EQUIPMENT_9_16 } from './mythologyEquipment2';
import { MYTHOLOGY_EQUIPMENT as EQUIPMENT_17_24 } from './mythologyEquipment3';
import { MYTHOLOGY_EQUIPMENT as EQUIPMENT_25_32 } from './mythologyEquipment4';
import { MythologyEquipment, EquipmentSlot, EffectTrigger, EffectType } from './equipmentTypes';

export { EquipmentSlot, EffectTrigger, EffectType };
export type { MythologyEquipment, EquipmentEffect, EquipmentStats } from './equipmentTypes';

export const ALL_MYTHOLOGY_EQUIPMENT: Record<string, MythologyEquipment> = {
  ...EQUIPMENT_1_8,
  ...EQUIPMENT_9_16,
  ...EQUIPMENT_17_24,
  ...EQUIPMENT_25_32,
};

export const EQUIPMENT_BY_STATION: Record<number, MythologyEquipment[]> = {};

for (let i = 1; i <= 32; i++) {
  EQUIPMENT_BY_STATION[i] = [];
}

Object.values(ALL_MYTHOLOGY_EQUIPMENT).forEach(equipment => {
  if (EQUIPMENT_BY_STATION[equipment.stationNumber]) {
    EQUIPMENT_BY_STATION[equipment.stationNumber].push(equipment);
  }
});

export function getEquipmentById(equipmentId: string): MythologyEquipment | undefined {
  return ALL_MYTHOLOGY_EQUIPMENT[equipmentId];
}

export function getEquipmentByStation(stationNumber: number): MythologyEquipment[] {
  return EQUIPMENT_BY_STATION[stationNumber] || [];
}

export function getEquipmentBySlot(slot: EquipmentSlot): MythologyEquipment[] {
  return Object.values(ALL_MYTHOLOGY_EQUIPMENT).filter(e => e.slot === slot);
}

export function getEquipmentByStationAndSlot(stationNumber: number, slot: EquipmentSlot): MythologyEquipment | undefined {
  return Object.values(ALL_MYTHOLOGY_EQUIPMENT).find(
    e => e.stationNumber === stationNumber && e.slot === slot
  );
}

export function getSetBonus(equipmentIds: string[]): { description: string; effects: any[] }[] {
  const equipment = equipmentIds.map(id => getEquipmentById(id)).filter(Boolean) as MythologyEquipment[];
  const byStation: Record<number, MythologyEquipment[]> = {};
  
  equipment.forEach(e => {
    if (!byStation[e.stationNumber]) {
      byStation[e.stationNumber] = [];
    }
    byStation[e.stationNumber].push(e);
  });
  
  const bonuses: { description: string; effects: any[] }[] = [];
  
  Object.entries(byStation).forEach(([stationNum, items]) => {
    const count = items.length;
    const stationId = parseInt(stationNum);
    
    if (stationId <= 8 && count >= 2) {
      bonuses.push({
        description: '2件套：攻击+5%',
        effects: [{ type: 'attack_percent', value: 0.05 }]
      });
    } else if (stationId <= 16 && count >= 3) {
      bonuses.push({
        description: '3件套：防御+10%',
        effects: [{ type: 'defense_percent', value: 0.1 }]
      });
    } else if (stationId <= 24 && count >= 4) {
      bonuses.push({
        description: '4件套：生命值+15%',
        effects: [{ type: 'hp_percent', value: 0.15 }]
      });
    } else if (stationId <= 32 && count >= 6) {
      bonuses.push({
        description: '6件套：全属性+20%',
        effects: [{ type: 'all_stats_percent', value: 0.2 }]
      });
    }
  });
  
  return bonuses;
}

export function createEquipmentInstance(equipmentId: string, quantity: number = 1) {
  const template = getEquipmentById(equipmentId);
  if (!template) return null;
  
  return {
    ...template,
    instanceId: `${equipmentId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    quantity,
    equipped: false,
    enhanceLevel: 0,
    sublimationLevel: 0,
  };
}

export function getEquipmentDropForStation(stationNumber: number): MythologyEquipment[] {
  const stationEquipment = getEquipmentByStation(stationNumber);
  return stationEquipment.filter(e => Math.random() < 0.3);
}

export function getRandomEquipmentFromStation(stationNumber: number): MythologyEquipment | null {
  const stationEquipment = getEquipmentByStation(stationNumber);
  if (stationEquipment.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * stationEquipment.length);
  return stationEquipment[randomIndex];
}

export const TOTAL_EQUIPMENT_COUNT = Object.keys(ALL_MYTHOLOGY_EQUIPMENT).length;
export const EQUIPMENT_COUNT_BY_STATION = Object.fromEntries(
  Object.entries(EQUIPMENT_BY_STATION).map(([k, v]) => [k, v.length])
);
