import { X, FileText, Package, FlaskConical, Layers, Sun, ClipboardCheck, ShoppingCart, User, Leaf, Wheat, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useBatchDrawer } from '@/contexts/BatchDrawerContext';

interface BatchDetailDrawerProps {
  open: boolean;
  batchNo: string;
  type: 'pulping' | 'material';
  onClose: () => void;
}

const stageIcons = {
  '原料入库': Package,
  '燎草制浆': FlaskConical,
  '捞纸成型': Layers,
  '晒纸焙干': Sun,
  '检验分级': ClipboardCheck,
  '销售出库': ShoppingCart,
  '无数据': FileText,
};

const stageColors: Record<string, string> = {
  '原料入库': 'bg-xuan-moss/20 text-xuan-moss border-xuan-moss/30',
  '燎草制浆': 'bg-xuan-ochre/20 text-xuan-ochre border-xuan-ochre/30',
  '捞纸成型': 'bg-xuan-indigo/20 text-xuan-indigo border-xuan-indigo/30',
  '晒纸焙干': 'bg-xuan-gold/20 text-xuan-gold border-xuan-gold/30',
  '检验分级': 'bg-xuan-ochre/20 text-xuan-ochre border-xuan-ochre/30',
  '销售出库': 'bg-xuan-moss/20 text-xuan-moss border-xuan-moss/30',
  '无数据': 'bg-gray-200/50 text-gray-500 border-gray-300',
};

const gradeBadge: Record<string, string> = {
  '特级': 'bg-xuan-gold/20 text-xuan-gold border-xuan-gold/30',
  '一级': 'bg-xuan-indigo/20 text-xuan-indigo border-xuan-indigo/30',
  '二级': 'bg-gray-400/20 text-gray-500 border-gray-400/30',
};

export default function BatchDetailDrawer({ open, batchNo, type, onClose }: BatchDetailDrawerProps) {
  const getTraceabilityByBatch = useStore((s) => s.getTraceabilityByBatch);
  const { pulpingBatches, materials, liftingRecords, dryingRecords, inspections, sales, finishedStocks } = useStore();
  const { openBatch } = useBatchDrawer();

  if (!batchNo) return null;

  if (type === 'material') {
    const material = materials.find((m) => m.batchNo === batchNo);
    if (!material) {
      return (
        <>
          {open && <div className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm animate-fade-in" onClick={onClose} />}
          <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-xuan-paperLight border-l border-xuan-paperDark/40 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-xuan-paperDark/40">
                <h2 className="font-serif text-lg font-bold text-xuan-ink">未找到该原料批次</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-xuan-paperDark/30 flex items-center justify-center text-xuan-inkLight transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </>
      );
    }

    const usedByBatches = pulpingBatches.filter((p) => p.materialIds.includes(material.id));
    const usedByStocks = finishedStocks.filter((fs) => {
      const p = pulpingBatches.find((pb) => pb.batchNo === fs.batchNo);
      return p?.materialIds.includes(material.id);
    });

    return (
      <>
        {open && <div className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm animate-fade-in" onClick={onClose} />}
        <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-xuan-paperLight border-l border-xuan-paperDark/40 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-xuan-paperDark/40">
              <div>
                <h2 className="font-serif text-lg font-bold text-xuan-ink flex items-center gap-2">
                  {material.type === '青檀皮' ? <Leaf className="w-5 h-5 text-xuan-moss" /> : <Wheat className="w-5 h-5 text-xuan-gold" />}
                  原料批次详情
                </h2>
                <p className="text-sm text-xuan-inkLight mt-0.5 font-mono">{material.batchNo}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-xuan-paperDark/30 flex items-center justify-center text-xuan-inkLight transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div className="xuan-card p-4">
                <h3 className="font-serif font-semibold text-xuan-ink text-sm mb-3">基本信息</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xuan-inkLight">品类</span>
                    <p className="text-xuan-ink font-medium mt-1">{material.type}</p>
                  </div>
                  <div>
                    <span className="text-xuan-inkLight">等级</span>
                    <p className="mt-1"><span className={`xuan-badge border ${gradeBadge[material.qualityGrade] || ''}`}>{material.qualityGrade}</span></p>
                  </div>
                  <div>
                    <span className="text-xuan-inkLight">产地</span>
                    <p className="text-xuan-ink font-medium mt-1">{material.origin}</p>
                  </div>
                  <div>
                    <span className="text-xuan-inkLight">收割年份</span>
                    <p className="text-xuan-ink font-medium mt-1">{material.harvestYear}</p>
                  </div>
                  <div>
                    <span className="text-xuan-inkLight">入库重量</span>
                    <p className="text-xuan-ink font-medium mt-1">{material.weight} kg</p>
                  </div>
                  <div>
                    <span className="text-xuan-inkLight">当前库存</span>
                    <p className={`font-medium mt-1 ${material.stock < 1500 ? 'text-xuan-cinnabar' : 'text-xuan-moss'}`}>{material.stock} kg</p>
                  </div>
                  <div>
                    <span className="text-xuan-inkLight">入库日期</span>
                    <p className="text-xuan-ink font-medium mt-1">{material.entryDate}</p>
                  </div>
                  <div>
                    <span className="text-xuan-inkLight">供应商</span>
                    <p className="text-xuan-ink font-medium mt-1 truncate">{material.supplier}</p>
                  </div>
                </div>
                {material.fiberLength !== undefined && (
                  <div className="grid grid-cols-3 gap-3 text-xs mt-4 pt-3 border-t border-xuan-paperDark/30">
                    <div>
                      <span className="text-xuan-inkLight">纤维长度</span>
                      <p className="text-xuan-ink font-medium mt-1">{material.fiberLength}mm</p>
                    </div>
                    <div>
                      <span className="text-xuan-inkLight">含水率</span>
                      <p className="text-xuan-ink font-medium mt-1">{material.moistureContent}%</p>
                    </div>
                    <div>
                      <span className="text-xuan-inkLight">杂质率</span>
                      <p className="text-xuan-ink font-medium mt-1">{material.impurityRate}%</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-serif font-semibold text-xuan-ink text-sm mb-2">使用此原料的制浆批次 ({usedByBatches.length})</h3>
                {usedByBatches.length === 0 ? (
                  <p className="text-sm text-xuan-inkLight xuan-card p-4 text-center">暂无关联的制浆批次</p>
                ) : (
                  <div className="space-y-2">
                    {usedByBatches.map((p) => (
                      <div
                        key={p.id}
                        className="xuan-card p-3 cursor-pointer hover:shadow-md transition-all"
                        onClick={() => openBatch(p.batchNo, 'pulping')}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-xuan-ink text-sm font-mono">{p.batchNo}</p>
                            <p className="text-xs text-xuan-inkLight mt-1">
                              皮草比 {p.barkRatio}:{p.strawRatio} · {p.operator}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`xuan-badge text-xs border ${
                              p.status === '已完成' ? 'bg-xuan-moss/20 text-xuan-moss border-xuan-moss/30' :
                              p.status === '制浆中' ? 'bg-xuan-ochre/20 text-xuan-ochre border-xuan-ochre/30' :
                              'bg-xuan-indigo/20 text-xuan-indigo border-xuan-indigo/30'
                            }`}>{p.status}</span>
                            <ArrowRight className="w-4 h-4 text-xuan-inkLight" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-serif font-semibold text-xuan-ink text-sm mb-2">最终形成的成品库存 ({usedByStocks.length})</h3>
                {usedByStocks.length === 0 ? (
                  <p className="text-sm text-xuan-inkLight xuan-card p-4 text-center">暂无关联成品</p>
                ) : (
                  <div className="xuan-card overflow-hidden">
                    <table className="xuan-table text-sm">
                      <thead>
                        <tr><th>批次</th><th>规格</th><th>等级</th><th>数量</th></tr>
                      </thead>
                      <tbody>
                        {usedByStocks.map((fs) => (
                          <tr key={fs.id} className="cursor-pointer hover:bg-xuan-paperDark/20" onClick={() => openBatch(fs.batchNo, 'pulping')}>
                            <td className="font-mono text-xuan-ochre">{fs.batchNo}</td>
                            <td>{fs.specification}</td>
                            <td>{fs.grade}</td>
                            <td className={fs.quantity < 50 ? 'text-xuan-cinnabar' : 'text-xuan-moss'}>{fs.quantity} 张</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const nodes = getTraceabilityByBatch(batchNo);
  const pulping = pulpingBatches.find((p) => p.batchNo === batchNo);
  const relatedMats = pulping ? materials.filter((m) => pulping.materialIds.includes(m.id)) : [];
  const relatedLiftings = liftingRecords.filter((r) => r.pulpingBatchNo === batchNo);
  const relatedDryings = dryingRecords.filter((r) => r.batchNo === batchNo);
  const relatedInspections = inspections.filter((r) => r.batchNo === batchNo);
  const relatedSales = sales.filter((s) => s.batchNo === batchNo);
  const relatedStocks = finishedStocks.filter((fs) => fs.batchNo === batchNo);

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm animate-fade-in" onClick={onClose} />}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-xuan-paperLight border-l border-xuan-paperDark/40 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-5 border-b border-xuan-paperDark/40">
            <div>
              <h2 className="font-serif text-lg font-bold text-xuan-ink flex items-center gap-2">
                <FileText className="w-5 h-5 text-xuan-ochre" />
                批次详情
              </h2>
              <p className="text-sm text-xuan-inkLight mt-0.5 font-mono">{batchNo}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-xuan-paperDark/30 flex items-center justify-center text-xuan-inkLight transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {pulping && (
              <div className="xuan-card p-4">
                <h3 className="font-serif font-semibold text-xuan-ink text-sm mb-3">制浆基本信息</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xuan-inkLight">状态</span>
                    <p className={`xuan-badge mt-1 border ${
                      pulping.status === '已完成' ? 'bg-xuan-moss/20 text-xuan-moss border-xuan-moss/30' :
                      pulping.status === '制浆中' ? 'bg-xuan-ochre/20 text-xuan-ochre border-xuan-ochre/30' :
                      'bg-xuan-indigo/20 text-xuan-indigo border-xuan-indigo/30'
                    }`}>{pulping.status}</p>
                  </div>
                  <div>
                    <span className="text-xuan-inkLight">操作员</span>
                    <p className="text-xuan-ink font-medium mt-1">{pulping.operator}</p>
                  </div>
                  <div>
                    <span className="text-xuan-inkLight">皮草比</span>
                    <p className="text-xuan-ink font-medium mt-1">{pulping.barkRatio} : {pulping.strawRatio}</p>
                  </div>
                  <div>
                    <span className="text-xuan-inkLight">打浆度</span>
                    <p className="text-xuan-ink font-medium mt-1">{pulping.beatingDegree}°SR</p>
                  </div>
                  <div>
                    <span className="text-xuan-inkLight">蒸煮温度</span>
                    <p className="text-xuan-ink font-medium mt-1">{pulping.cookingTemp}°C</p>
                  </div>
                  <div>
                    <span className="text-xuan-inkLight">蒸煮时间</span>
                    <p className="text-xuan-ink font-medium mt-1">{pulping.cookingTime}h</p>
                  </div>
                </div>
              </div>
            )}

            {relatedMats.length > 0 && (
              <div>
                <h3 className="font-serif font-semibold text-xuan-ink text-sm mb-2">原料批次 ({relatedMats.length})</h3>
                <div className="space-y-2">
                  {relatedMats.map((m) => (
                    <div
                      key={m.id}
                      className="xuan-card p-3 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
                      onClick={() => openBatch(m.batchNo, 'material')}
                    >
                      <div>
                        <p className="font-medium text-xuan-ink text-sm font-mono">{m.batchNo}</p>
                        <p className="text-xs text-xuan-inkLight">{m.type} · {m.origin} · {m.qualityGrade}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-xuan-ochre font-medium">{m.stock} kg</span>
                        <ArrowRight className="w-4 h-4 text-xuan-inkLight" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {relatedStocks.length > 0 && (
              <div>
                <h3 className="font-serif font-semibold text-xuan-ink text-sm mb-2">成品库存 ({relatedStocks.length})</h3>
                <div className="xuan-card overflow-hidden">
                  <table className="xuan-table text-sm">
                    <thead>
                      <tr><th>规格</th><th>等级</th><th>数量</th><th>入库</th></tr>
                    </thead>
                    <tbody>
                      {relatedStocks.map((fs) => (
                        <tr key={fs.id}>
                          <td>{fs.specification}</td>
                          <td>{fs.grade}</td>
                          <td className={fs.quantity < 50 ? 'text-xuan-cinnabar' : 'text-xuan-moss'}>{fs.quantity} 张</td>
                          <td className="text-xs text-xuan-inkLight">{fs.warehouseDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {relatedLiftings.length > 0 && (
              <div>
                <h3 className="font-serif font-semibold text-xuan-ink text-sm mb-2">捞纸记录 ({relatedLiftings.length})</h3>
                <div className="xuan-card overflow-hidden">
                  <table className="xuan-table text-sm">
                    <thead>
                      <tr><th>帘床</th><th>张数</th><th>厚度</th><th>操作员</th></tr>
                    </thead>
                    <tbody>
                      {relatedLiftings.map((r) => (
                        <tr key={r.id}>
                          <td>{r.screenNo}</td>
                          <td>{r.sheetCount}</td>
                          <td>{r.thickness}mm</td>
                          <td>{r.operator}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {relatedDryings.length > 0 && (
              <div>
                <h3 className="font-serif font-semibold text-xuan-ink text-sm mb-2">焙干记录 ({relatedDryings.length})</h3>
                <div className="space-y-2">
                  {relatedDryings.map((r) => (
                    <div key={r.id} className="xuan-card p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-xuan-ink text-sm">{r.wallNo}</span>
                        <span className={`xuan-badge text-xs border ${
                          r.moistureAfter < 7 ? 'bg-xuan-moss/20 text-xuan-moss border-xuan-moss/30' :
                          r.moistureAfter <= 8 ? 'bg-xuan-gold/20 text-xuan-gold border-xuan-gold/30' :
                          'bg-xuan-cinnabar/20 text-xuan-cinnabar border-xuan-cinnabar/30'
                        }`}>{r.moistureAfter}%</span>
                      </div>
                      <p className="text-xs text-xuan-inkLight">{r.temperature}°C · {r.duration}分 · {r.operator}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {relatedInspections.length > 0 && (
              <div>
                <h3 className="font-serif font-semibold text-xuan-ink text-sm mb-2">检验记录 ({relatedInspections.length})</h3>
                <div className="space-y-2">
                  {relatedInspections.map((r) => (
                    <div key={r.id} className="xuan-card p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className={`xuan-badge text-xs mr-2 ${
                            r.grade === '特皮' ? 'bg-xuan-gold/20 text-xuan-gold border border-xuan-gold/50' :
                            r.grade === '净皮' ? 'bg-xuan-indigo/20 text-xuan-indigo border border-xuan-indigo/30' :
                            'bg-xuan-bronze/20 text-xuan-bronze border border-xuan-bronze/30'
                          }`}>{r.grade}</span>
                          <span className="text-sm text-xuan-ink">{r.specification}</span>
                        </div>
                        <span className={`xuan-badge text-xs border ${
                          r.result === '合格' ? 'bg-xuan-moss/20 text-xuan-moss border-xuan-moss/30' :
                          'bg-xuan-cinnabar/20 text-xuan-cinnabar border-xuan-cinnabar/30'
                        }`}>{r.result}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-xuan-inkLight">
                        <span>拉力: {r.tensileStrength}N</span>
                        <span>厚度均匀: {r.thicknessUniformity}%</span>
                        <span>透光率: {r.lightTransmittance}%</span>
                        <span>吸墨性: {r.inkAbsorption}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {relatedSales.length > 0 && (
              <div>
                <h3 className="font-serif font-semibold text-xuan-ink text-sm mb-2">销售去向 ({relatedSales.length})</h3>
                <div className="space-y-2">
                  {relatedSales.map((s) => (
                    <div key={s.id} className="xuan-card p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-xuan-ink text-sm">{s.customer}</span>
                        <span className="text-xuan-ochre font-medium">¥{s.amount.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-xuan-inkLight">{s.product} × {s.quantity}张</p>
                      <p className="text-xs text-xuan-inkLight mt-1">{s.saleDate} · {s.paymentStatus}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-serif font-semibold text-xuan-ink text-sm mb-3">生产溯源时间线</h3>
              <div className="relative pl-8">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-xuan-paperDark/40" />
                {nodes.map((node, i) => {
                  const Icon = stageIcons[node.stage as keyof typeof stageIcons] || FileText;
                  return (
                    <div key={i} className="relative pb-5 last:pb-0">
                      <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-xuan-paperLight border-2 border-xuan-ochre flex items-center justify-center">
                        <Icon className="w-3 h-3 text-xuan-ochre" />
                      </div>
                      <div className="ml-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-serif font-semibold text-xuan-ink text-sm">{node.stage}</span>
                          <span className={`xuan-badge text-[10px] border ${stageColors[node.stage] || ''}`}>{node.date}</span>
                        </div>
                        <p className="text-xs text-xuan-inkLight leading-relaxed">{node.detail}</p>
                        <div className="flex items-center gap-1 text-[11px] text-xuan-inkLight/70 mt-1">
                          <User className="w-3 h-3" />
                          {node.operator}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
