import { useState } from 'react';
import { Search, FileText, BookOpen, User, QrCode, Package, FlaskConical, Layers, Sun, ClipboardCheck, ShoppingCart } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useBatchDrawer } from '@/contexts/BatchDrawerContext';

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

const categoryBadge: Record<string, string> = {
  '制浆工艺': 'bg-xuan-ochre/20 text-xuan-ochre border-xuan-ochre/30',
  '捞纸技法': 'bg-xuan-indigo/20 text-xuan-indigo border-xuan-indigo/30',
  '晒纸技艺': 'bg-xuan-moss/20 text-xuan-moss border-xuan-moss/30',
  '配料秘方': 'bg-xuan-gold/20 text-xuan-gold border-xuan-gold/30',
};

const paymentBadge: Record<string, string> = {
  '已收款': 'bg-xuan-moss/20 text-xuan-moss border-xuan-moss/30',
  '待收款': 'bg-xuan-cinnabar/20 text-xuan-cinnabar border-xuan-cinnabar/30',
  '部分收款': 'bg-xuan-gold/20 text-xuan-gold border-xuan-gold/30',
};

export default function Traceability() {
  const { sales, archives, getTraceabilityByBatch, pulpingBatches } = useStore();
  const { openBatch } = useBatchDrawer();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedBatch, setSearchedBatch] = useState<string>('');
  const [nodes, setNodes] = useState<ReturnType<typeof getTraceabilityByBatch> | null>(null);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    const term = searchTerm.trim();
    const found = pulpingBatches.find(
      (b) => b.batchNo === term || b.batchNo.includes(term)
    );
    if (found) {
      setSearchedBatch(found.batchNo);
      setNodes(getTraceabilityByBatch(found.batchNo));
    } else {
      setSearchedBatch(term);
      setNodes([]);
    }
  };

  const handleBatchClick = (batchNo: string) => {
    setSearchTerm(batchNo);
    setSearchedBatch(batchNo);
    setNodes(getTraceabilityByBatch(batchNo));
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <h2 className="xuan-section-title font-serif">销售溯源</h2>

      <div className="xuan-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <QrCode className="w-5 h-5 text-xuan-ochre" />
          <h3 className="font-serif text-lg font-semibold text-xuan-ink">批次溯源查询</h3>
        </div>
        <p className="text-sm text-xuan-inkLight mb-4">
          输入批次号或溯源码，查询宣纸从原料到销售的完整生产链路
        </p>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-xuan-inkLight" />
            <input
              className="xuan-input w-full pl-9"
              placeholder="输入批次号，如 ZJ-2026-001"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button className="xuan-btn-primary flex items-center gap-2" onClick={handleSearch}>
            <Search className="w-4 h-4" />
            扫码溯源
          </button>
          <button
            className="xuan-btn-outline flex items-center gap-2"
            onClick={() => openBatch(searchedBatch || 'ZJ-2026-001')}
          >
            <FileText className="w-4 h-4" />
            批次详情
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-xuan-inkLight">快速查询：</span>
          {pulpingBatches.slice(0, 4).map((b) => (
            <button
              key={b.id}
              className="text-xs px-2 py-0.5 rounded-md bg-xuan-paperDark/30 text-xuan-inkLight hover:bg-xuan-ochre/20 hover:text-xuan-ochre transition"
              onClick={() => handleBatchClick(b.batchNo)}
            >
              {b.batchNo}
            </button>
          ))}
        </div>
      </div>

      {nodes && nodes.length > 0 && (
        <div className="xuan-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-lg font-semibold text-xuan-ink">溯源时间线</h3>
              <p className="text-sm text-xuan-inkLight mt-0.5">批次号：{searchedBatch}</p>
            </div>
            <button
              className="text-sm text-xuan-ochre hover:underline"
              onClick={() => openBatch(searchedBatch)}
            >
              查看完整详情 →
            </button>
          </div>
          <div className="relative pl-8">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-xuan-paperDark/40" />
            {nodes.map((node, i) => {
              const Icon = (stageIcons as any)[node.stage] || FileText;
              return (
                <div key={i} className="relative pb-6 last:pb-0">
                  <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-xuan-paperLight border-2 border-xuan-ochre flex items-center justify-center shadow-sm">
                    <Icon className="w-3 h-3 text-xuan-ochre" />
                  </div>
                  <div className="ml-2">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-serif font-semibold text-xuan-ink text-base">{node.stage}</span>
                      <span className={`xuan-badge text-[10px] border ${stageColors[node.stage] || ''}`}>
                        {node.date}
                      </span>
                    </div>
                    <p className="text-sm text-xuan-inkLight leading-relaxed">{node.detail}</p>
                    <div className="flex items-center gap-1.5 text-xs text-xuan-inkLight/70 mt-1.5">
                      <User className="w-3.5 h-3.5" />
                      {node.operator}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {nodes && nodes.length === 0 && searchedBatch && (
        <div className="xuan-card p-10 text-center">
          <FileText className="w-12 h-12 text-xuan-inkLight/30 mx-auto mb-3" />
          <p className="text-xuan-inkLight">未找到批次 <span className="font-semibold text-xuan-ink">{searchedBatch}</span> 的溯源信息</p>
          <p className="text-xs text-xuan-inkLight/60 mt-1">请检查批次号是否正确</p>
        </div>
      )}

      {!nodes && (
        <div className="xuan-card p-10 text-center">
          <QrCode className="w-14 h-14 text-xuan-ochre/30 mx-auto mb-4" />
          <p className="text-xuan-inkLight">扫码或输入批次号开始溯源查询</p>
          <p className="text-xs text-xuan-inkLight/60 mt-2">
            示例：尝试查询 ZJ-2026-001 查看完整生产链路
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-xuan-ochre" />
            <h3 className="font-serif text-lg font-semibold text-xuan-ink">销售台账</h3>
          </div>
          <div className="xuan-card overflow-hidden">
            <table className="xuan-table w-full">
              <thead>
                <tr>
                  <th>溯源码</th>
                  <th>批次号</th>
                  <th>客户</th>
                  <th>产品</th>
                  <th>数量</th>
                  <th>金额</th>
                  <th>状态</th>
                  <th>日期</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => (
                  <tr key={s.id} className="cursor-pointer" onClick={() => handleBatchClick(s.batchNo)}>
                    <td className="font-mono text-xs text-xuan-inkLight">{s.traceCode}</td>
                    <td
                      className="font-medium text-xuan-ink cursor-pointer hover:text-xuan-ochre hover:underline underline-offset-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        openBatch(s.batchNo);
                      }}
                    >
                      {s.batchNo}
                    </td>
                    <td>{s.customer}</td>
                    <td>{s.product}</td>
                    <td>{s.quantity}</td>
                    <td className="text-xuan-ochre font-medium">¥{s.amount.toLocaleString()}</td>
                    <td>
                      <span className={`xuan-badge border text-xs ${paymentBadge[s.paymentStatus] || ''}`}>
                        {s.paymentStatus}
                      </span>
                    </td>
                    <td>{s.saleDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-xuan-gold" />
            <h3 className="font-serif text-lg font-semibold text-xuan-ink">工艺传承档案</h3>
          </div>
          <div className="space-y-3">
            {archives.map((a) => (
              <div key={a.id} className="xuan-card-hover p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-serif font-semibold text-xuan-ink">{a.title}</h4>
                  <span className={`xuan-badge text-[10px] border ${categoryBadge[a.category] || ''}`}>
                    {a.category}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-xuan-inkLight mb-2">
                  <User className="w-3 h-3" />
                  {a.master} · {a.createDate}
                </div>
                <p className="text-xs text-xuan-inkLight leading-relaxed mb-3">{a.description}</p>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  {Object.entries(a.parameters).slice(0, 4).map(([k, v]) => (
                    <div key={k} className="flex justify-between bg-xuan-paperDark/20 px-2 py-1 rounded">
                      <span className="text-xuan-inkLight">{k}</span>
                      <span className="text-xuan-ink font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
