export enum TrainUpgradeType {
  CAPACITY = 'capacity',
  ARMOR = 'armor',
  SPEED = 'speed',
  FACILITY = 'facility',
}

export interface TrainData {
  durability: number;
  maxDurability: number;
  carriages: number;
  maxCarriages: number;
  fuel: number;
  maxFuel: number;
  speed: number;
  level: number;
  // 新属性
  capacityLevel: number;
  capacityBonus: number;
  armorLevel: number;
  armorBonus: number;
  speedLevel: number;
  facilityLevel: number;
}

export class Train {
  durability: number;
  maxDurability: number;
  carriages: number;
  maxCarriages: number;
  fuel: number;
  maxFuel: number;
  speed: number;
  level: number;
  // 新属性
  capacityLevel: number;
  capacityBonus: number;
  armorLevel: number;
  armorBonus: number;
  speedLevel: number;
  facilityLevel: number;

  constructor(data?: Partial<TrainData>) {
    this.durability = data?.durability ?? 100;
    this.maxDurability = data?.maxDurability ?? 100;
    this.carriages = data?.carriages ?? 1;
    this.maxCarriages = data?.maxCarriages ?? 3;
    this.fuel = data?.fuel ?? 100;
    this.maxFuel = data?.maxFuel ?? 100;
    this.speed = data?.speed ?? 50;
    this.level = data?.level ?? 1;
    // 新属性初始化
    this.capacityLevel = data?.capacityLevel ?? 0;
    this.capacityBonus = data?.capacityBonus ?? 0;
    this.armorLevel = data?.armorLevel ?? 0;
    this.armorBonus = data?.armorBonus ?? 0;
    this.speedLevel = data?.speedLevel ?? 0;
    this.facilityLevel = data?.facilityLevel ?? 0;
  }

  // 消耗耐久
  consumeDurability(amount: number): boolean {
    if (this.durability < amount) return false;
    this.durability = Math.max(0, this.durability - amount);
    return true;
  }

  // 修复耐久
  repair(amount: number): void {
    this.durability = Math.min(this.maxDurability, this.durability + amount);
  }

  // 消耗燃料
  consumeFuel(amount: number): boolean {
    if (this.fuel < amount) return false;
    this.fuel = Math.max(0, this.fuel - amount);
    return true;
  }

  // 添加燃料
  refuel(amount: number): void {
    this.fuel = Math.min(this.maxFuel, this.fuel + amount);
  }

  // 添加车厢
  addCarriage(): boolean {
    if (this.carriages >= this.maxCarriages) return false;
    this.carriages++;
    return true;
  }

  // 升级列车
  upgrade(type: string): void {
    switch (type) {
      case 'capacity':
        this.capacityLevel++;
        this.capacityBonus += 5;
        break;
      case 'armor':
        this.armorLevel++;
        this.armorBonus += 20;
        this.maxDurability += 20;
        this.durability += 20;
        break;
      case 'speed':
        this.speedLevel++;
        this.speed += 10;
        break;
      case 'facility':
        this.facilityLevel++;
        break;
    }
    this.level++;
  }

  // 序列化
  serialize(): TrainData {
    return {
      durability: this.durability,
      maxDurability: this.maxDurability,
      carriages: this.carriages,
      maxCarriages: this.maxCarriages,
      fuel: this.fuel,
      maxFuel: this.maxFuel,
      speed: this.speed,
      level: this.level,
      capacityLevel: this.capacityLevel,
      capacityBonus: this.capacityBonus,
      armorLevel: this.armorLevel,
      armorBonus: this.armorBonus,
      speedLevel: this.speedLevel,
      facilityLevel: this.facilityLevel,
    };
  }
}
