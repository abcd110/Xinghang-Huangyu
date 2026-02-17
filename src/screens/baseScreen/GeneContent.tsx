import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { GeneType, GENE_TYPE_CONFIG, GENE_RARITY_CONFIG } from '../../core/GeneSystem';
import { MessageToast, type MessageState } from './shared';
import { styles, colors } from './styles';

export function GeneContent() {
  const { gameManager, saveGame, upgradeGeneNode, getGeneTotalStats } = useGameStore();
  const [selectedType, setSelectedType] = useState<GeneType | 'all'>('all');
  const [message, setMessage] = useState<MessageState | null>(null);

  const nodes = gameManager.getGeneNodes();
  const totalStats = getGeneTotalStats();
  const filteredNodes = selectedType === 'all' ? nodes : nodes.filter(n => n.type === selectedType);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleUpgrade = async (nodeId: string) => {
    const result = upgradeGeneNode(nodeId);
    if (result.success) { showMessage(`升级成功，属性+${result.newValue}`, 'success'); await saveGame(); }
    else { showMessage(result.message, 'error'); }
  };

  const geneTypes = [
    { id: 'all' as const, name: '全部', icon: '🧬' },
    { id: GeneType.ATTACK, name: '攻击', icon: '⚔️' },
    { id: GeneType.DEFENSE, name: '防御', icon: '🛡️' },
    { id: GeneType.HP, name: '生命', icon: '❤️' },
    { id: GeneType.SPEED, name: '速度', icon: '⚡' },
    { id: GeneType.CRIT_RATE, name: '暴击', icon: '🎯' },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <MessageToast message={message} />

      <div style={styles.statsBox(colors.gene)}>
        <div style={{ color: colors.gene, fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>当前属性加成</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {Object.entries(totalStats).map(([type, value]) => {
            if (value <= 0) return null;
            const config = GENE_TYPE_CONFIG[type as GeneType];
            return (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                <span>{config.icon}</span>
                <span style={{ color: config.color }}>{config.name}</span>
                <span style={{ color: '#fff' }}>+{value}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
        {geneTypes.map(type => (
          <button key={type.id} onClick={() => setSelectedType(type.id)} style={{ padding: '6px 12px', background: selectedType === type.id ? `${colors.gene}40` : 'rgba(255, 255, 255, 0.05)', border: selectedType === type.id ? `1px solid ${colors.gene}80` : '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', color: selectedType === type.id ? colors.gene : '#a1a1aa', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {type.icon} {type.name}
          </button>
        ))}
      </div>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {filteredNodes.map(node => {
          const typeConfig = GENE_TYPE_CONFIG[node.type];
          const rarityConfig = GENE_RARITY_CONFIG[node.rarity];

          return (
            <div key={node.id} style={{ ...styles.cardBox(rarityConfig.color, false), padding: '12px', background: node.unlocked ? 'rgba(255, 255, 255, 0.03)' : 'rgba(100, 100, 100, 0.1)', opacity: node.unlocked ? 1 : 0.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{typeConfig.icon}</span>
                  <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '13px' }}>{typeConfig.name}基因</span>
                  <span style={{ color: rarityConfig.color, fontSize: '10px', padding: '2px 6px', background: `${rarityConfig.color}20`, borderRadius: '4px' }}>{rarityConfig.name}</span>
                </div>
                <span style={{ color: colors.gene, fontSize: '11px' }}>Lv.{node.level}/{node.maxLevel}</span>
              </div>

              <div style={{ ...styles.label, fontSize: '11px', marginBottom: '8px' }}>当前加成: <span style={{ color: typeConfig.color }}>+{node.currentValue}</span> {typeConfig.name}</div>

              <div style={{ marginBottom: '8px' }}>
                <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(node.level / node.maxLevel) * 100}%`, background: `linear-gradient(90deg, ${typeConfig.color}, ${rarityConfig.color})`, borderRadius: '2px' }} />
                </div>
              </div>

              {node.unlocked ? (
                node.level < node.maxLevel ? (
                  <button onClick={() => handleUpgrade(node.id)} style={{ ...styles.primaryButton(typeConfig.color), padding: '8px', fontSize: '11px' }}>升级</button>
                ) : (
                  <div style={{ textAlign: 'center', color: colors.success, fontSize: '11px', padding: '8px', background: `${colors.success}15`, borderRadius: '6px' }}>✅ 已满级</div>
                )
              ) : (
                <div style={{ textAlign: 'center', color: '#666', fontSize: '11px', padding: '8px', background: 'rgba(100, 100, 100, 0.1)', borderRadius: '6px' }}>🔒 未解锁</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
