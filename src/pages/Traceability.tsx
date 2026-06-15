import { useState } from 'react';
import { Search, FileText, BookOpen, User, QrCode, Package, FlaskConical, Layers, Sun, ClipboardCheck, ShoppingCart, Tag, Users, Hash, AlertCircle, ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useBatchDrawer } from '@/contexts/BatchDrawerContext';
import { SaleRecord } from '@/data/mockData';

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
  const [matchedSales, setMatchedSales] = useState<SaleRecord[]>([]);
  const [searchMeta, setSearchMeta] = useState<{ type: 'batch' | 'trace' | 'customer' | 'none'; label?: string } | null>(null);

  const handleSearch = () => {
    const term = searchTerm.trim();
    if (!term) return;

    setNodes(null);
    setSearchedBatch('');
    setMatchedSales([]);
    setSearchMeta(null);

    const byTraceCode = sales.find((s) => s.traceCode.toUpperCase() === term.toUpperCase() || s.traceCode.includes(term));
    if (byTraceCode) {
      const batch = pulpingBatches.find((b) => b.batchNo === byTraceCode.batchNo);
      setSearchedBatch(byTraceCode.batchNo);
      setNodes(batch ? getTraceabilityByBatch(byTraceCode.batchNo) : []);
      setMatchedSales([byTraceCode]);
      setSearchMeta({ type: 'trace', label: `溯源码 ${byTraceCode.traceCode} 对应批次 ${byTraceCode.batchNo}` });
      return;
    }

    const byBatch = pulpingBatches.find(
      (b) => b.batchNo === term || b.batchNo.toLowerCase().includes(term.toLowerCase()),
    );
    if (byBatch) {
      setSearchedBatch(byBatch.batchNo);
      setNodes(getTraceabilityByBatch(byBatch.batchNo));
      setMatchedSales(sales.filter((s) => s.batchNo === byBatch.batchNo));
      setSearchMeta({ type: 'batch', label: `批次 ${byBatch.batchNo} 全链路溯源` });
      return;
    }

    const byCustomer = sales.filter((s) => s.customer.includes(term));
    if (byCustomer.length > 0) {
      setMatchedSales(byCustomer);
      setSearchedBatch('');
      setNodes(null);
      setSearchMeta({ type: 'customer', label: `客户「${term}」相关出库记录 ${byCustomer.length} 条` });
      return;
    }

    const partialBatch = sales.filter((s) => s.batchNo.includes(term) || s.traceCode.includes(term));
    if (partialBatch.length > 0) {
      setMatchedSales(partialBatch);
      setSearchedBatch('');
      setNodes(null);
      setSearchMeta({ type: 'customer', label: `模糊匹配到 ${partialBatch.length} 条出库记录` });
      return;
    }

    setSearchMeta({ type: 'none', label: `未找到「${term}」相关的批次、溯源码或客户` });
  };

  const handleBatchClick = (batchNo: string) => {
    setSearchTerm(batchNo);
    setSearchedBatch(batchNo);
    setNodes(getTraceabilityByBatch(batchNo));
    setMatchedSales(sales.filter((s) => s.batchNo === batchNo));
    setSearchMeta({ type: 'batch', label: `批次 ${batchNo} 全链路溯源` });
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
          输入批次号（ZJ-...）、溯源码（TR-...）或客户名称，查询完整链路
        </p>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-xuan-inkLight" />
            <input
              className="xuan-input w-full pl-9"
              placeholder="批次号 / 溯源码 / 客户名称，如 ZJ-2026-001"
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
          {pulpingBatches.slice(0, 3).map((b) => (
            <button
              key={b.id}
              className="text-xs px-2 py-0.5 rounded-md bg-xuan-paperDark/30 text-xuan-inkLight hover:bg-xuan-ochre/20 hover:text-xuan-ochre transition flex items-center gap-1"
              onClick={() => handleBatchClick(b.batchNo)}
            >
              <Hash className="w-3 h-3" />
              {b.batchNo}
            </button>
          ))}
          {sales.slice(0, 2).map((s) => (
            <button
              key={s.traceCode}
              className="text-xs px-2 py-0.5 rounded-md bg-xuan-paperDark/30 text-xuan-inkLight hover:bg-xuan-moss/20 hover:text-xuan-moss transition flex items-center gap-1"
              onClick={() => {
                setSearchTerm(s.traceCode);
                setSearchedBatch(s.batchNo);
                setNodes(getTraceabilityByBatch(s.batchNo));
                setMatchedSales([s]);
                setSearchMeta({ type: 'trace', label: `溯源码 ${s.traceCode} 对应批次 ${s.batchNo}` });
              }}
            >
              <Tag className="w-3 h-3" />
              {s.traceCode}
            </button>
          ))}
          {sales.slice(0, 1).map((s) => (
            <button
              key={`c${s.id}`}
              className="text-xs px-2 py-0.5 rounded-md bg-xuan-paperDark/30 text-xuan-inkLight hover:bg-xuan-indigo/20 hover:text-xuan-indigo transition flex items-center gap-1"
              onClick={() => {
                const related = sales.filter((x) => x.customer === s.customer);
                setSearchTerm(s.customer);
                setMatchedSales(related);
                setSearchedBatch('');
                setNodes(null);
                setSearchMeta({ type: 'customer', label: `客户「${s.customer}」相关出库记录 ${related.length} 条` });
              }}
            >
              <Users className="w-3 h-3" />
              {s.customer}
            </button>
          ))}
        </div>
      </div>

      {searchMeta && (
        <div className={`xuan-card p-3 flex items-center gap-2 text-sm animate-fade-in ${
          searchMeta.type === 'none'
            ? 'text-xuan-cinnabar border border-xuan-cinnabar/30 bg-xuan-cinnabar/5'
            : searchMeta.type === 'trace'
            ? 'text-xuan-moss border border-xuan-moss/30 bg-xuan-moss/5'
            : searchMeta.type === 'customer'
            ? 'text-xuan-indigo border border-xuan-indigo/30 bg-xuan-indigo/5'
            : 'text-xuan-ochre border border-xuan-ochre/30 bg-xuan-ochre/5'
        }`}>
          {searchMeta.type === 'none' ? <AlertCircle className="w-4 h-4 shrink-0" /> : searchMeta.type === 'trace' ? <Tag className="w-4 h-4 shrink-0" /> : searchMeta.type === 'customer' ? <Users className="w-4 h-4 shrink-0" /> : <Hash className="w-4 h-4 shrink-0" />}
          <span>{searchMeta.label}</span>
        </div>
      )}

      {matchedSales.length > 0 && !nodes && (
        <div className="xuan-card overflow-hidden animate-fade-in-up">
          <div className="p-4 border-b border-xuan-paperDark/30 flex items-center justify-between">
            <h3 className="font-serif font-semibold text-xuan-ink flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-xuan-ochre" />匹配的销售记录</h3>
            <span className="text-xs text-xuan-inkLight">共 {matchedSales.length} 条 · 点击批次号查看详情</span>
          </div>
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
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {matchedSales.map((s) => (
                <tr key={s.id}>
                  <td className="font-mono text-xs text-xuan-moss">{s.traceCode}</td>
                  <td className="font-medium text-xuan-ink">{s.batchNo}</td>
                  <td>{s.customer}</td>
                  <td>{s.product}</td>
                  <td>{s.quantity}</td>
                  <td className="text-xuan-ochre font-medium">¥{s.amount.toLocaleString()}</td>
                  <td>
                    <span className={`xuan-badge border text-xs ${paymentBadge[s.paymentStatus] || ''}`}>
                      {s.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <button
                      className="text-xs text-xuan-ochre hover:underline flex items-center gap-0.5"
                      onClick={() => handleBatchClick(s.batchNo)}
                    >
                      溯源 <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {matchedSales.length > 0 && nodes && nodes.length > 0 && (
        <div className="xuan-card p-4 animate-fade-in border border-xuan-moss/20">
          <div className="flex items-center gap-2 text-xs text-xuan-moss mb-2">
            <ShoppingCart className="w-3.5 h-3.5" />
            匹配到对应的销售出库记录：
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {matchedSales.map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-xuan-moss/5 border border-xuan-moss/15 rounded-lg px-3 py-2">
                <div className="text-xs">
                  <span className="font-mono text-xuan-moss mr-2">{s.traceCode}</span>
                  <span className="text-xuan-ink">{s.customer}</span>
                  <span className="text-xuan-inkLight"> · {s.product} × {s.quantity}</span>
                </div>
                <span className="text-sm font-medium text-xuan-ochre">¥{s.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
