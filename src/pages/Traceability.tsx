import { useState } from 'react';
import { Search, FileText, BookOpen, User, QrCode } from 'lucide-react';
import { TraceabilityRecord, SaleRecord, CraftArchive } from '@/data/mockData';
import { useStore } from '@/store/useStore';

const paymentBadge: Record<SaleRecord['paymentStatus'], string> = {
  '已收款': 'bg-xuan-moss/20 text-xuan-moss border-xuan-moss/30',
  '待收款': 'bg-xuan-cinnabar/20 text-xuan-cinnabar border-xuan-cinnabar/30',
  '部分收款': 'bg-xuan-gold/20 text-xuan-gold border-xuan-gold/30',
};

const categoryBadge: Record<CraftArchive['category'], string> = {
  '制浆工艺': 'bg-xuan-ochre/20 text-xuan-ochre border-xuan-ochre/30',
  '捞纸技法': 'bg-xuan-indigo/20 text-xuan-indigo border-xuan-indigo/30',
  '晒纸技艺': 'bg-xuan-moss/20 text-xuan-moss border-xuan-moss/30',
  '配料秘方': 'bg-xuan-gold/20 text-xuan-gold border-xuan-gold/30',
};

export default function Traceability() {
  const { traceability, sales, archives } = useStore();
  const [searchVal, setSearchVal] = useState('');
  const [selected, setSelected] = useState<TraceabilityRecord | null>(null);

  const handleSearch = () => {
    if (!searchVal.trim()) { setSelected(null); return; }
    const found = traceability.find(
      (r) => r.traceCode === searchVal.trim() || r.batchNo === searchVal.trim()
    );
    setSelected(found ?? null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <QrCode className="w-7 h-7 text-xuan-ochre" />
        <h1 className="text-2xl font-serif font-bold text-xuan-ink">销售溯源</h1>
      </div>

      <div className="xuan-card p-6">
        <div className="flex gap-3">
          <input
            className="xuan-input flex-1"
            placeholder="输入溯源码或批次号查询..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="xuan-btn-primary flex items-center gap-2" onClick={handleSearch}>
            <Search className="w-4 h-4" />
            扫码溯源
          </button>
        </div>
      </div>

      {selected && (
        <div className="xuan-card p-6 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-xuan-ochre" />
            <h2 className="text-lg font-serif font-bold text-xuan-ink">溯源时间线</h2>
            <span className="xuan-badge bg-xuan-ochre/15 text-xuan-ochre border-xuan-ochre/30 ml-2">
              {selected.traceCode}
            </span>
            <span className="xuan-badge bg-xuan-indigo/15 text-xuan-indigo border-xuan-indigo/30">
              {selected.batchNo}
            </span>
          </div>

          <div className="relative pl-8">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-xuan-ochre/30" />
            {selected.nodes.map((node, i) => (
              <div key={i} className="relative pb-6 last:pb-0">
                <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-xuan-ochre border-2 border-white shadow flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <div className="xuan-card-hover p-4 ml-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-xuan-ink">{node.stage}</span>
                    <span className="text-sm text-xuan-ink/50">{node.date}</span>
                  </div>
                  <p className="text-sm text-xuan-ink/70 mb-1">{node.detail}</p>
                  <div className="flex items-center gap-1 text-xs text-xuan-ink/50">
                    <User className="w-3 h-3" />
                    {node.operator}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!selected && traceability.length > 0 && (
        <div className="xuan-card p-6 text-center text-xuan-ink/40 py-12">
          <QrCode className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-serif">请输入溯源码或批次号查询产品溯源信息</p>
          <p className="text-sm mt-1">可查询的溯源码：{traceability.map((t) => t.traceCode).join('、')}</p>
        </div>
      )}

      <div className="xuan-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-xuan-indigo" />
          <h2 className="text-lg font-serif font-bold text-xuan-ink">销售台账</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="xuan-table">
            <thead>
              <tr>
                <th>客户</th>
                <th>产品</th>
                <th>数量</th>
                <th>金额</th>
                <th>销售日期</th>
                <th>收款状态</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id}>
                  <td className="font-medium">{s.customer}</td>
                  <td>{s.product}</td>
                  <td>{s.quantity}张</td>
                  <td className="text-xuan-ochre font-medium">¥{s.amount.toLocaleString()}</td>
                  <td>{s.saleDate}</td>
                  <td>
                    <span className={`xuan-badge ${paymentBadge[s.paymentStatus]}`}>
                      {s.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="xuan-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-xuan-gold" />
          <h2 className="text-lg font-serif font-bold text-xuan-ink">工艺传承档案</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {archives.map((a) => (
            <div key={a.id} className="xuan-card-hover p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-xuan-ink">{a.title}</h3>
                <span className={`xuan-badge ${categoryBadge[a.category]}`}>
                  {a.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-xuan-ink/60">
                <User className="w-4 h-4" />
                <span>传承人：{a.master}</span>
                <span className="mx-1">·</span>
                <span>{a.createDate}</span>
              </div>
              <p className="text-sm text-xuan-ink/70 leading-relaxed">{a.description}</p>
              <table className="xuan-table text-sm">
                <tbody>
                  {Object.entries(a.parameters).map(([key, val]) => (
                    <tr key={key}>
                      <td className="font-medium text-xuan-ink/60 w-28">{key}</td>
                      <td>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
