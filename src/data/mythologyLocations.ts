import { LocationCategory, MythologyType, DeityStatus, CoreItemEffectType, LocationType } from './types';
import type { MythologyLocation } from './types';

// 神话站台数据
export const MYTHOLOGY_LOCATIONS: MythologyLocation[] = [
  // ========== 第一批：现有8个站台 ==========

  // 站台1：锈蚀赫利俄斯站（希腊神话·太阳神）
  {
    id: 'myth_greek_001',
    name: '锈蚀赫利俄斯站',
    description: '太阳神赫利俄斯夺权失败后的首个藏身之处，站台被黯淡的金光笼罩，深埋着太阳神战车碎片。',
    type: LocationType.STATION,
    dangerLevel: 3,
    resourceRichness: 4,
    icon: '☀️',
    category: LocationCategory.MYTHOLOGY,
    mythology: MythologyType.GREEK,
    stationNumber: 1,
    deity: {
      id: 'deity_helios',
      name: '赫利俄斯',
      title: '太阳神',
      mythology: MythologyType.GREEK,
      description: '第一批玩家中的太阳神，凭借太阳神力迅速崛起，夺权失败后利用残留权限封印自身在青铜站台内。',
      status: DeityStatus.HIDDEN,
      hostilityLevel: 60,
      isUnlocked: false,
      storyFragments: [],
    },
    coreItem: {
      id: 'core_sun_chariot',
      name: '太阳神战车碎片',
      description: '蕴含光能源与微弱系统权限残留的碎片，可提升列车基础速度。',
      effectType: CoreItemEffectType.SPEED_BOOST,
      effectValue: 1.2,
      effectDescription: '列车基础速度提升至1.2倍',
      icon: '🌅',
    },
    backgroundStory: '这里曾是第一批玩家初入荒原时的临时补给驿站，赫利俄斯作为第一批玩家，凭借太阳神力迅速崛起，却在联合其他神明抢夺系统权限时惨败，无奈之下利用残留权限将自身封印在这座青铜站台内。站台被黯淡的金光笼罩，下方深埋着赫利俄斯当年使用的太阳神战车碎片。',
    wildMonster: {
      name: '噬光蠕虫',
      description: '通体漆黑，以光和权限残留为食，被站台气息吸引',
      speedRequirement: 1.2,
      icon: '🐛',
    },
    stationMonster: {
      name: '锈蚀青铜守卫',
      description: '由赫利俄斯的神力与战车碎片残骸操控，攻击时释放微弱强光',
      loot: ['bronze_fragment', 'light_shard', 'mat_001'],
      icon: '🛡️',
    },
    interferenceEffects: [
      {
        name: '强光眩晕',
        description: '赫利俄斯释放残留神力，玩家陷入短暂眩晕',
        triggerChance: 0.15,
      },
      {
        name: '光能干扰',
        description: '太阳神力波动干扰探索设备',
        triggerChance: 0.1,
      },
    ],
    isUnlocked: false,  // 需要完成站台5"岩石峭壁中继站"后解锁
    isCompleted: false,
    explorationProgress: 0,
    // 探索系统配置
    enemyTypes: ['锈蚀傀儡', '光能幽灵', '青铜守卫'],
    eliteEnemyTypes: ['强化青铜守卫', '光能猎手'],
    bossName: '赫利俄斯残影',
    enemyTier: 'T3',
    eliteEnemyTier: 'T3+',
    bossTier: 'T4',
    baseEnemyLevel: 25,
  },

  // 站台2：雾隐瓦尔哈拉补给站（北欧神话）
  {
    id: 'myth_nordic_001',
    name: '雾隐瓦尔哈拉补给站',
    description: '洛基负责管控的临时据点，浓雾遮蔽站台气息，留存着英灵遗留的武器与补给。',
    type: LocationType.STATION,
    dangerLevel: 4,
    resourceRichness: 5,
    icon: '🌫️',
    category: LocationCategory.MYTHOLOGY,
    mythology: MythologyType.NORDIC,
    stationNumber: 2,
    deity: {
      id: 'deity_loki',
      name: '洛基',
      title: '诡计之神',
      mythology: MythologyType.NORDIC,
      description: '第一批玩家中的核心谋划者，主导抢夺系统权限的计划，失败后利用诡计天赋用浓雾遮蔽站台。',
      status: DeityStatus.HIDDEN,
      hostilityLevel: 75,
      isUnlocked: false,
      storyFragments: [],
    },
    coreItem: {
      id: 'core_valhalla_oath',
      name: '英灵之誓',
      description: '附着早期系统赋予的威慑权限，可暂时震慑荒原怪物',
      effectType: CoreItemEffectType.SPECIAL,
      effectValue: 1.5,
      effectDescription: '延长探索时间50%',
      icon: '⚔️',
    },
    backgroundStory: '并非真正的瓦尔哈拉英灵殿，而是第一批玩家夺权失败后为囤积力量搭建的临时据点，由洛基负责暗中管控。洛基主导了抢夺系统权限的计划，失败后利用自身诡计天赋，用浓雾遮蔽站台气息。',
    wildMonster: {
      name: '雾牙狼',
      description: '群居，适应浓雾环境，被站台的权限气息吸引',
      speedRequirement: 1.5,
      icon: '🐺',
    },
    stationMonster: {
      name: '怨怒英灵',
      description: '手持残破长剑，攻击迅猛，由洛基权限与英灵残魂操控',
      loot: ['oath_fragment', 'spirit_essence', 'mat_002'],
      icon: '👻',
    },
    interferenceEffects: [
      {
        name: '浓雾迷障',
        description: '洛基释放浓雾干扰玩家判断',
        triggerChance: 0.2,
      },
      {
        name: '声音误导',
        description: '伪装成英灵声音误导玩家方向',
        triggerChance: 0.15,
      },
    ],
    isUnlocked: false,  // 需要完成站台5后解锁
    isCompleted: false,
    explorationProgress: 0,
    // 探索系统配置
    enemyTypes: ['雾灵', '英灵残影', '诡计幻象'],
    eliteEnemyTypes: ['英灵战士', '诡计分身'],
    bossName: '洛基幻影',
    enemyTier: 'T3+',
    eliteEnemyTier: 'T4',
    bossTier: 'T4+',
    baseEnemyLevel: 30,
  },

  // 站台3：断裂彩虹桥枢纽（北欧神话）
  {
    id: 'myth_nordic_002',
    name: '断裂彩虹桥枢纽',
    description: '托尔亲手击碎彩虹桥搭建的枢纽站台，留存着微弱的空间神力。',
    type: LocationType.STATION,
    dangerLevel: 5,
    resourceRichness: 4,
    icon: '🌈',
    category: LocationCategory.MYTHOLOGY,
    mythology: MythologyType.NORDIC,
    stationNumber: 3,
    deity: {
      id: 'deity_thor',
      name: '托尔',
      title: '雷神',
      mythology: MythologyType.NORDIC,
      description: '第一批玩家中的战力核心，夺权大战中损耗惨重，利用彩虹桥碎片的空间神力封印自身。',
      status: DeityStatus.HIDDEN,
      hostilityLevel: 70,
      isUnlocked: false,
      storyFragments: [],
    },
    coreItem: {
      id: 'core_space_crystal',
      name: '空间结晶',
      description: '可解锁列车的快速跃迁能力，缩短站点间的跃迁时间',
      effectType: CoreItemEffectType.JUMP_BOOST,
      effectValue: 1.3,
      effectDescription: '跃迁时间缩短30%',
      icon: '💎',
    },
    backgroundStory: '彩虹桥并非自然断裂，而是托尔为阻挡系统追查、隐藏自身藏身之处，亲手击碎彩虹桥，用碎片搭建了这座枢纽站台。托尔利用彩虹桥碎片的空间神力，将自身封印在站台的水晶深处。',
    wildMonster: {
      name: '雷翼狮鹫',
      description: '被托尔雷电神力影响，翅膀带有雷电，速度快、攻击力强',
      speedRequirement: 1.8,
      icon: '🦅',
    },
    stationMonster: {
      name: '水晶傀儡',
      description: '由彩虹桥碎片与托尔残留神力凝聚而成，攻击时释放冲击波',
      loot: ['crystal_shard', 'thunder_essence', 'mat_004'],
      icon: '💠',
    },
    interferenceEffects: [
      {
        name: '空间扭曲',
        description: '托尔干扰空间，将玩家传送到危险区域',
        triggerChance: 0.18,
      },
      {
        name: '雷电轰击',
        description: '随机触发雷电攻击',
        triggerChance: 0.12,
      },
    ],
    isUnlocked: false,
    isCompleted: false,
    explorationProgress: 0,
    // 探索系统配置
    enemyTypes: ['雷电元素', '空间裂隙', '水晶守卫'],
    eliteEnemyTypes: ['雷电巨人', '空间猎手'],
    bossName: '托尔之影',
    enemyTier: 'T4',
    eliteEnemyTier: 'T4+',
    bossTier: 'T5',
    baseEnemyLevel: 35,
  },

  // 站台4：枯寂奥林匹斯中继站（希腊神话·宙斯）
  {
    id: 'myth_greek_002',
    name: '枯寂奥林匹斯中继站',
    description: '宙斯当年统筹夺权计划的地方，诸神雕像均已残破，核心目标是获取奥林匹斯火种。',
    type: LocationType.STATION,
    dangerLevel: 6,
    resourceRichness: 5,
    icon: '⛰️',
    category: LocationCategory.MYTHOLOGY,
    mythology: MythologyType.GREEK,
    stationNumber: 4,
    deity: {
      id: 'deity_zeus',
      name: '宙斯',
      title: '众神之王',
      mythology: MythologyType.GREEK,
      description: '第一批玩家的首领，夺权失败后极度敌视后续玩家，用残留闪电神力设置陷阱。',
      status: DeityStatus.HOSTILE,
      hostilityLevel: 90,
      isUnlocked: false,
      storyFragments: [],
    },
    coreItem: {
      id: 'core_olympus_flame',
      name: '奥林匹斯火种',
      description: '蕴含宙斯觉醒的火焰神力与微量系统权限',
      effectType: CoreItemEffectType.SPEED_BOOST,
      effectValue: 2.2,
      effectDescription: '列车基础速度提升至2.2倍，解锁火焰防御',
      icon: '🔥',
    },
    backgroundStory: '曾是第一批玩家夺权前的核心据点，宙斯当年统筹夺权计划的地方。夺权失败后，宙斯被迫躲进这座中继站，利用奥林匹斯诸神的残留神力与系统权限碎片，将自身封印在残破的雕像群中。',
    wildMonster: {
      name: '暗焰巨蟒',
      description: '被黑暗力量与火种权限气息侵蚀，以火焰为食，速度极快',
      speedRequirement: 2.2,
      icon: '🐍',
    },
    stationMonster: {
      name: '闪电侍从',
      description: '通体包裹微弱闪电，被宙斯残留神力操控',
      loot: ['flame_fragment', 'lightning_core', 'mat_006'],
      icon: '⚡',
    },
    interferenceEffects: [
      {
        name: '闪电陷阱',
        description: '宙斯设置闪电陷阱，触碰后陷入眩晕',
        triggerChance: 0.25,
      },
      {
        name: '神威压制',
        description: '宙斯释放神威，降低玩家属性',
        triggerChance: 0.15,
      },
    ],
    isUnlocked: false,
    isCompleted: false,
    explorationProgress: 0,
    // 探索系统配置
    enemyTypes: ['闪电元素', '神威仆从', '黑暗火种'],
    eliteEnemyTypes: ['闪电使者', '神威卫士'],
    bossName: '宙斯残魂',
    enemyTier: 'T4+',
    eliteEnemyTier: 'T5',
    bossTier: 'T5+',
    baseEnemyLevel: 40,
  },

  // 站台5：残破德尔斐预言站（希腊神话·阿波罗）
  {
    id: 'myth_greek_003',
    name: '残破德尔斐预言站',
    description: '阿波罗夺权失败后的藏身之处，曾是古希腊的泛希腊圣地，可获取预言碎片。',
    type: LocationType.STATION,
    dangerLevel: 5,
    resourceRichness: 4,
    icon: '🔮',
    category: LocationCategory.MYTHOLOGY,
    mythology: MythologyType.GREEK,
    stationNumber: 5,
    deity: {
      id: 'deity_apollo',
      name: '阿波罗',
      title: '光明与预言之神',
      mythology: MythologyType.GREEK,
      description: '最早觉醒预言神力的玩家，试图通过预言预判系统动作，因预言偏差导致计划败露。',
      status: DeityStatus.HIDDEN,
      hostilityLevel: 55,
      isUnlocked: false,
      storyFragments: [],
    },
    coreItem: {
      id: 'core_prophecy_shard',
      name: '预言碎片',
      description: '蕴含阿波罗的预言神力，可提前预判荒原怪物的动向',
      effectType: CoreItemEffectType.SPECIAL,
      effectValue: 1.0,
      effectDescription: '提前预警怪物出现，解锁夺权真相片段',
      icon: '🔯',
    },
    backgroundStory: '这里曾是古希腊的泛希腊圣地，阿波罗作为最早觉醒预言神力的玩家，曾试图通过预言预判系统动作，却因预言偏差导致计划败露。夺权失败后，他利用德尔斐圣地的神谕力量，将自身封印在站台深处的神谕祭坛下。',
    wildMonster: {
      name: '预言蠕虫',
      description: '被预言气息与权限残留吸引，可感知玩家动向',
      speedRequirement: 2.3,
      icon: '🐛',
    },
    stationMonster: {
      name: '神谕守卫',
      description: '由阿波罗的神力与祭祀纹路操控，攻击时释放迷惑性预言',
      loot: ['prophecy_fragment', 'oracle_scroll', 'mat_003'],
      icon: '📜',
    },
    interferenceEffects: [
      {
        name: '模糊预言',
        description: '阿波罗传递模糊的预言，一半真实一半误导',
        triggerChance: 0.2,
      },
      {
        name: '预言反噬',
        description: '错误的预言导致玩家陷入混乱',
        triggerChance: 0.1,
      },
    ],
    isUnlocked: false,
    isCompleted: false,
    explorationProgress: 0,
    // 探索系统配置
    enemyTypes: ['预言幻象', '神谕灵体', '光明残影'],
    eliteEnemyTypes: ['预言守护者', '神谕使者'],
    bossName: '阿波罗化身',
    enemyTier: 'T5',
    eliteEnemyTier: 'T5+',
    bossTier: 'T6',
    baseEnemyLevel: 45,
  },

  // 站台6：冰封密米尔智库站（北欧神话·密米尔）
  {
    id: 'myth_nordic_003',
    name: '冰封密米尔智库站',
    description: '智慧巨人密米尔的藏身之处，站台被永恒寒冰覆盖，陈列着破解系统权限的记录。',
    type: LocationType.STATION,
    dangerLevel: 6,
    resourceRichness: 6,
    icon: '🧊',
    category: LocationCategory.MYTHOLOGY,
    mythology: MythologyType.NORDIC,
    stationNumber: 6,
    deity: {
      id: 'deity_mimir',
      name: '密米尔',
      title: '智慧巨人',
      mythology: MythologyType.NORDIC,
      description: '第一批玩家中的智囊，负责破解系统权限的核心密码，被系统重创后躲进智库站台。',
      status: DeityStatus.NEUTRAL,
      hostilityLevel: 30,
      isUnlocked: false,
      storyFragments: [],
    },
    coreItem: {
      id: 'core_mimir_tear',
      name: '密米尔之泪',
      description: '蕴含密米尔的智慧神力，可提升探索效率',
      effectType: CoreItemEffectType.SPECIAL,
      effectValue: 1.4,
      effectDescription: '探索效率提升40%，解锁系统权限破解日志',
      icon: '💧',
    },
    backgroundStory: '智慧巨人密米尔夺权失败后的藏身之处，当年密米尔作为第一批玩家中的智囊，负责破解系统权限的核心密码，却在夺权大战中被系统重创，无奈之下躲进这座智库站台，利用自身的智慧神力与残留权限，将整个站台冰封。',
    wildMonster: {
      name: '冰齿巨熊',
      description: '适应冰封环境，被智库的权限气息吸引，防御力极强',
      speedRequirement: 2.4,
      icon: '🐻',
    },
    stationMonster: {
      name: '冰封卷轴傀儡',
      description: '由密米尔的神力与残破卷轴凝聚而成，攻击时释放寒气冻结玩家行动',
      loot: ['tear_fragment', 'wisdom_scroll', 'mat_007'],
      icon: '📚',
    },
    interferenceEffects: [
      {
        name: '智慧谜题',
        description: '密米尔设置智慧谜题，破解失败触发冰封陷阱',
        triggerChance: 0.25,
      },
      {
        name: '知识反噬',
        description: '过多知识涌入导致玩家短暂失神',
        triggerChance: 0.1,
      },
    ],
    isUnlocked: false,
    isCompleted: false,
    explorationProgress: 0,
    // 探索系统配置
    enemyTypes: ['冰封卷轴', '智慧幻象', '寒气精灵'],
    eliteEnemyTypes: ['冰封守护者', '智慧化身'],
    bossName: '密米尔之影',
    enemyTier: 'T5+',
    eliteEnemyTier: 'T6',
    bossTier: 'T6+',
    baseEnemyLevel: 50,
  },

  // 站台7：深渊赫尔驿站（北欧神话·赫尔）
  {
    id: 'myth_nordic_004',
    name: '深渊赫尔驿站',
    description: '冥界女王赫尔搭建的驿站，一半光明一半深渊，收纳着战死的第一批玩家残魂。',
    type: LocationType.STATION,
    dangerLevel: 7,
    resourceRichness: 5,
    icon: '💀',
    category: LocationCategory.MYTHOLOGY,
    mythology: MythologyType.NORDIC,
    stationNumber: 7,
    deity: {
      id: 'deity_hel',
      name: '赫尔',
      title: '冥界女王',
      mythology: MythologyType.NORDIC,
      description: '第一批玩家中的辅助型战力，负责操控残魂协助诸神夺权，被系统限制只能躲在站台内。',
      status: DeityStatus.NEUTRAL,
      hostilityLevel: 45,
      isUnlocked: false,
      storyFragments: [],
    },
    coreItem: {
      id: 'core_hel_core',
      name: '赫尔之核',
      description: '蕴含赫尔的冥界神力，可让列车无视低级怪物的撞击',
      effectType: CoreItemEffectType.DEFENSE_BOOST,
      effectValue: 2.5,
      effectDescription: '无视低级怪物撞击，提升跃迁稳定性',
      icon: '⚫',
    },
    backgroundStory: '冥界女王赫尔夺权失败后，利用自身的冥界神力与残留系统权限，在荒原边缘搭建了这座驿站，一方面用于收纳当年战死的第一批玩家残魂，另一方面作为自己的藏身之处。站台一半处于光明，一半陷入深渊。',
    wildMonster: {
      name: '深渊巨怪',
      description: '体型庞大，防御力极强，被赫尔之核的权限气息吸引',
      speedRequirement: 2.5,
      icon: '👹',
    },
    stationMonster: {
      name: '灵魂守卫',
      description: '由强大的怪物灵魂与赫尔的权限操控凝聚而成，免疫物理攻击',
      loot: ['core_fragment', 'soul_essence', 'mat_008'],
      icon: '👻',
    },
    interferenceEffects: [
      {
        name: '灵魂低语',
        description: '战死残魂的低语干扰玩家心神',
        triggerChance: 0.2,
      },
      {
        name: '冥界侵蚀',
        description: '深渊一侧的冥界力量侵蚀玩家',
        triggerChance: 0.15,
      },
    ],
    isUnlocked: false,
    isCompleted: false,
    explorationProgress: 0,
    // 探索系统配置
    enemyTypes: ['深渊幽灵', '冥界仆从', '灵魂残片'],
    eliteEnemyTypes: ['深渊领主', '冥界使者'],
    bossName: '赫尔真身',
    enemyTier: 'T6',
    eliteEnemyTier: 'T6+',
    bossTier: 'T7',
    baseEnemyLevel: 55,
  },

  // 站台8：无神之境枢纽（终极站台）
  {
    id: 'myth_ultimate_001',
    name: '无神之境枢纽',
    description: '荒原的核心站台，当年夺权大战的主战场，系统设置的权限封印之地。',
    type: LocationType.STATION,
    dangerLevel: 10,
    resourceRichness: 8,
    icon: '🌌',
    category: LocationCategory.MYTHOLOGY,
    mythology: MythologyType.GREEK, // 希腊+北欧混合
    stationNumber: 8,
    deity: {
      id: 'deity_council',
      name: '诸神议会',
      title: '宙斯、托尔、洛基等',
      mythology: MythologyType.GREEK,
      description: '实力较强的神明联手躲进枢纽的隐秘区域，试图抢夺被封印的权限碎片。',
      status: DeityStatus.HOSTILE,
      hostilityLevel: 100,
      isUnlocked: false,
      storyFragments: [],
    },
    coreItem: {
      id: 'core_godless_heart',
      name: '无神之心',
      description: '解锁列车的终极速度，解锁通往终极站点的通道',
      effectType: CoreItemEffectType.SPEED_BOOST,
      effectValue: 3.0,
      effectDescription: '列车基础速度提升至3倍，解锁终极剧情',
      icon: '💙',
    },
    backgroundStory: '荒原的核心站台，也是当年第一批玩家发动夺权大战的主战场，更是系统设置的权限封印之地。当年诸神夺权失败后，系统将所有参与夺权的神明权限碎片封印于此，而部分实力较强的神明利用最后的权限，躲进了这座枢纽的隐秘区域。',
    wildMonster: {
      name: '混沌巨兽',
      description: '由当年夺权大战的混沌力量与系统压制残留凝聚而成，体型庞大，速度攻击力均为顶级',
      speedRequirement: 3.0,
      icon: '🐉',
    },
    stationMonster: {
      name: '神仆残躯',
      description: '曾是诸神作为玩家时的核心随从，死后被诸神的权限与混沌力量操控',
      loot: ['heart_fragment', 'chaos_essence', 'ultimate_key'],
      icon: '👤',
    },
    interferenceEffects: [
      {
        name: '神威乱流',
        description: '希腊与北欧神力碰撞形成能量乱流，造成大量伤害',
        triggerChance: 0.3,
      },
      {
        name: '权限封印',
        description: '系统封印压制玩家能力',
        triggerChance: 0.2,
      },
      {
        name: '诸神联手',
        description: '多个神明同时释放神力干扰',
        triggerChance: 0.25,
      },
    ],
    isUnlocked: false,
    isCompleted: false,
    explorationProgress: 0,
    // 探索系统配置
    enemyTypes: ['混沌仆从', '神威残片', '封印守卫'],
    eliteEnemyTypes: ['混沌领主', '神威化身'],
    bossName: '诸神议会',
    enemyTier: 'T7',
    eliteEnemyTier: 'T7+',
    bossTier: 'T8',
    baseEnemyLevel: 60,
  },
];

// 获取所有神话站台
export function getAllMythologyLocations(): MythologyLocation[] {
  return MYTHOLOGY_LOCATIONS;
}

// 根据ID获取神话站台
export function getMythologyLocationById(id: string): MythologyLocation | undefined {
  return MYTHOLOGY_LOCATIONS.find(loc => loc.id === id);
}

// 获取已解锁的神话站台
export function getUnlockedMythologyLocations(): MythologyLocation[] {
  return MYTHOLOGY_LOCATIONS.filter(loc => loc.isUnlocked);
}

// 获取指定神话体系的站台
export function getMythologyLocationsByType(type: MythologyType): MythologyLocation[] {
  return MYTHOLOGY_LOCATIONS.filter(loc => loc.mythology === type);
}

// 获取下一个待解锁的站台
export function getNextMythologyLocation(): MythologyLocation | undefined {
  return MYTHOLOGY_LOCATIONS.find(loc => loc.isUnlocked && !loc.isCompleted);
}

// 按站台编号排序
export function getMythologyLocationsByOrder(): MythologyLocation[] {
  return [...MYTHOLOGY_LOCATIONS].sort((a, b) => a.stationNumber - b.stationNumber);
}
