import { useState } from 'react';
import { Package, AlertTriangle, Plus, Filter, Leaf, Wheat } from 'lucide-react';
import { RawMaterial } from '@/data/mockData';
import { useStore } from '@/store/useStore';

const gradeBadge: Record<string, string> = {
  '特级': 'bg-xuan-gold/20 text-xuan-gold border-xuan-gold/30',
  '一级': 'bg-xuan-indigo/20 text-xuan-indigo border-xuan-indigo/30',
  '二级': 'bg-gray-400/20 text-gray-500 border-gray-400/30',
};

const emptyMaterial: Omit<RawMaterial, 'id'> = {
  type: '青檀皮',
  batchNo: '',
  weight: 0,
  stock: 0,
  origin: '',
  harvestYear: new Date().getFullYear(),
  qualityGrade: '一级',
  entryDate: new Date().toISOString().slice(0, 10),
  supplier: '',
  fiberLength: 0,
  moistureContent: 0,
  impurityRate: 0,
};

export default function Materials() {
  const { materials, addMaterial } = useStore();
  const [typeFilter, setTypeFilter] = useState<'全部' | '青檀皮' | '稻草'>('全部');
  const [gradeFilter, setGradeFilter] = useState<string>('全部');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyMaterial);

  const barkStock = materials.filter((m) => m.type === '青檀皮').reduce((s, m) => s + m.stock, 0);
  const strawStock = materials.filter((m) => m.type === '稻草').reduce((s, m) => s + m.stock, 0);
  const lowStockCount = materials.filter((m) => m.stock < 1500).length;

  const filtered = materials.filter((m) => {
    if (typeFilter !== '全部' && m.type !== typeFilter) return false;
    if (gradeFilter !== '全部' && m.qualityGrade !== gradeFilter) return false;
    return true;
  });

  const handleSubmit = () => {
    addMaterial({ ...form, id: `RM${Date.now()}` });
    setForm(emptyMaterial);
    setShowForm(false);
  };

  const updateForm = (key: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <h2 className="xuan-section-title font-serif">原料管理</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-moss/15 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-xuan-moss" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">青檀皮库存</p>
            <p className="text-2xl font-bold text-xuan-ink">{barkStock.toLocaleString()} kg</p>
          </div>
        </div>
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-gold/15 flex items-center justify-center">
            <Wheat className="w-6 h-6 text-xuan-gold" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">稻草库存</p>
            <p className="text-2xl font-bold text-xuan-ink">{strawStock.toLocaleString()} kg</p>
          </div>
        </div>
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-cinnabar/15 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-xuan-cinnabar" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">库存预警</p>
            <p className="text-2xl font-bold text-xuan-cinnabar">{lowStockCount} 项</p>
          </div>
        </div>
      </div>

      <div className="xuan-card p-4 flex flex-wrap items-center gap-4">
        <Filter className="w-4 h-4 text-xuan-inkLight" />
        <select className="xuan-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}>
          <option value="全部">全部类型</option>
          <option value="青檀皮">青檀皮</option>
          <option value="稻草">稻草</option>
        </select>
        <select className="xuan-select" value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
          <option value="全部">全部等级</option>
          <option value="特级">特级</option>
          <option value="一级">一级</option>
          <option value="二级">二级</option>
        </select>
        <div className="flex-1" />
        <button className="xuan-btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" />
          新增入库
        </button>
      </div>

      {showForm && (
        <div className="xuan-card p-6 animate-fade-in-up">
          <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-4">新增原料入库</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">类型</label>
              <select className="xuan-select w-full" value={form.type} onChange={(e) => updateForm('type', e.target.value)}>
                <option value="青檀皮">青檀皮</option>
                <option value="稻草">稻草</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">批次号</label>
              <input className="xuan-input w-full" value={form.batchNo} onChange={(e) => updateForm('batchNo', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">重量(kg)</label>
              <input className="xuan-input w-full" type="number" value={form.weight} onChange={(e) => updateForm('weight', +e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">库存(kg)</label>
              <input className="xuan-input w-full" type="number" value={form.stock} onChange={(e) => updateForm('stock', +e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">产地</label>
              <input className="xuan-input w-full" value={form.origin} onChange={(e) => updateForm('origin', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">采收年份</label>
              <input className="xuan-input w-full" type="number" value={form.harvestYear} onChange={(e) => updateForm('harvestYear', +e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">质量等级</label>
              <select className="xuan-select w-full" value={form.qualityGrade} onChange={(e) => updateForm('qualityGrade', e.target.value)}>
                <option value="特级">特级</option>
                <option value="一级">一级</option>
                <option value="二级">二级</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">入库日期</label>
              <input className="xuan-input w-full" type="date" value={form.entryDate} onChange={(e) => updateForm('entryDate', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">供应商</label>
              <input className="xuan-input w-full" value={form.supplier} onChange={(e) => updateForm('supplier', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">纤维长度(mm)</label>
              <input className="xuan-input w-full" type="number" step="0.1" value={form.fiberLength ?? 0} onChange={(e) => updateForm('fiberLength', +e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">含水率(%)</label>
              <input className="xuan-input w-full" type="number" step="0.1" value={form.moistureContent ?? 0} onChange={(e) => updateForm('moistureContent', +e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">杂质率(%)</label>
              <input className="xuan-input w-full" type="number" step="0.1" value={form.impurityRate ?? 0} onChange={(e) => updateForm('impurityRate', +e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button className="xuan-btn-secondary" onClick={() => setShowForm(false)}>取消</button>
            <button className="xuan-btn-primary" onClick={handleSubmit}>确认入库</button>
          </div>
        </div>
      )}

      <div className="xuan-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="xuan-table w-full">
            <thead>
              <tr>
                <th>批次号</th>
                <th>类型</th>
                <th>重量(kg)</th>
                <th>库存(kg)</th>
                <th>产地</th>
                <th>采收年份</th>
                <th>质量等级</th>
                <th>入库日期</th>
                <th>供应商</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td className="font-medium text-xuan-ink">{m.batchNo}</td>
                  <td>
                    <span className="inline-flex items-center gap-1">
                      {m.type === '青檀皮' ? <Leaf className="w-3.5 h-3.5 text-xuan-moss" /> : <Wheat className="w-3.5 h-3.5 text-xuan-gold" />}
                      {m.type}
                    </span>
                  </td>
                  <td>{m.weight.toLocaleString()}</td>
                  <td>
                    <span className="inline-flex items-center gap-1.5">
                      {m.stock.toLocaleString()}
                      {m.stock < 1500 && (
                        <span className="xuan-badge bg-xuan-cinnabar/15 text-xuan-cinnabar border border-xuan-cinnabar/30 text-xs">
                          <AlertTriangle className="w-3 h-3" />预警
                        </span>
                      )}
                    </span>
                  </td>
                  <td>{m.origin}</td>
                  <td>{m.harvestYear}</td>
                  <td>
                    <span className={`xuan-badge border ${gradeBadge[m.qualityGrade]}`}>
                      {m.qualityGrade}
                    </span>
                  </td>
                  <td>{m.entryDate}</td>
                  <td className="text-sm">{m.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
