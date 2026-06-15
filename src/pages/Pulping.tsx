import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FlaskConical, Plus, Clock, Thermometer, Gauge, User } from 'lucide-react';
import { PulpingBatch } from '@/data/mockData';
import { useStore } from '@/store/useStore';

const statusBadge: Record<PulpingBatch['status'], string> = {
  '制浆中': 'bg-xuan-ochre/20 text-xuan-ochre border-xuan-ochre/30',
  '已完成': 'bg-xuan-moss/20 text-xuan-moss border-xuan-moss/30',
  '质检中': 'bg-xuan-indigo/20 text-xuan-indigo border-xuan-indigo/30',
};

const PIE_COLORS = ['#8B4513', '#C9A84C'];

const emptyForm: Omit<PulpingBatch, 'id'> = {
  batchNo: '',
  materialIds: [],
  barkRatio: 60,
  strawRatio: 40,
  cookingTemp: 95,
  cookingTime: 8,
  cookingPressure: 1.2,
  beatingDegree: 45,
  status: '制浆中',
  operator: '',
  startDate: new Date().toISOString().slice(0, 10),
};

export default function Pulping() {
  const { pulpingBatches, addPulpingBatch } = useStore();
  const [selectedId, setSelectedId] = useState<string>(pulpingBatches[0]?.id ?? '');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [barkRatio, setBarkRatio] = useState(60);

  const active = pulpingBatches.filter((b) => b.status === '制浆中').length;
  const done = pulpingBatches.filter((b) => b.status === '已完成').length;
  const avgBeating = pulpingBatches.length
    ? (pulpingBatches.reduce((s, b) => s + b.beatingDegree, 0) / pulpingBatches.length).toFixed(1)
    : '0';

  const selected = pulpingBatches.find((b) => b.id === selectedId);
  const pieData = selected
    ? [{ name: '青檀皮', value: selected.barkRatio }, { name: '稻草', value: selected.strawRatio }]
    : [];

  const updateForm = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    addPulpingBatch({ ...form, id: `PB${Date.now()}`, barkRatio, strawRatio: 100 - barkRatio });
    setForm(emptyForm);
    setBarkRatio(60);
    setShowForm(false);
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <h2 className="xuan-section-title font-serif">制浆工序</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-ochre/15 flex items-center justify-center">
            <FlaskConical className="w-6 h-6 text-xuan-ochre" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">当前制浆中</p>
            <p className="text-2xl font-bold text-xuan-ink">{active} 批</p>
          </div>
        </div>
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-moss/15 flex items-center justify-center">
            <Clock className="w-6 h-6 text-xuan-moss" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">已完成</p>
            <p className="text-2xl font-bold text-xuan-ink">{done} 批</p>
          </div>
        </div>
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-indigo/15 flex items-center justify-center">
            <Gauge className="w-6 h-6 text-xuan-indigo" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">平均打浆度</p>
            <p className="text-2xl font-bold text-xuan-ink">{avgBeating}°SR</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pulpingBatches.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedId(b.id)}
                className={`xuan-card-hover p-4 cursor-pointer transition-all ${
                  selectedId === b.id ? 'ring-2 ring-xuan-ochre/50' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-serif font-semibold text-xuan-ink">{b.batchNo}</span>
                  <span className={`xuan-badge border ${statusBadge[b.status]}`}>{b.status}</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden bg-xuan-paperDark/30 mb-3">
                  <div className="h-full rounded-l-full bg-xuan-ochre/70" style={{ width: `${b.barkRatio}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-xuan-inkLight mb-3">
                  <span>青檀皮 {b.barkRatio}%</span>
                  <span>稻草 {b.strawRatio}%</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-xuan-inkLight">
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-xuan-cinnabar" />
                    {b.cookingTemp}°C
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-xuan-gold" />
                    {b.cookingTime}h
                  </div>
                  <div className="flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-xuan-indigo" />
                    {b.cookingPressure}atm
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-xuan-paperDark/40 flex items-center justify-between text-xs text-xuan-inkLight">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{b.operator}</span>
                  <span>打浆度 {b.beatingDegree}°SR</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-xuan-inkLight/60">
                  <span>{b.startDate}</span>
                  <span>{b.endDate ?? '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="xuan-card p-5">
            <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-3">配浆比例</h3>
            {selected && (
              <div className="mb-4">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={40} strokeWidth={2}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#FAF7F0', border: '1px solid #E8E0D0', borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 text-xs text-xuan-inkLight">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-xuan-ochre/70" />青檀皮</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-xuan-gold" />稻草</span>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm text-xuan-inkLight">青檀皮比例: {barkRatio}%</label>
              <input
                type="range"
                min={0}
                max={100}
                value={barkRatio}
                onChange={(e) => setBarkRatio(+e.target.value)}
                className="w-full accent-xuan-ochre"
              />
              <div className="w-full h-4 rounded-full overflow-hidden bg-xuan-paperDark/30 flex">
                <div className="h-full bg-xuan-ochre/70 transition-all" style={{ width: `${barkRatio}%` }} />
                <div className="h-full bg-xuan-gold/70 transition-all" style={{ width: `${100 - barkRatio}%` }} />
              </div>
              <div className="flex justify-between text-xs text-xuan-inkLight">
                <span>青檀皮 {barkRatio}%</span>
                <span>稻草 {100 - barkRatio}%</span>
              </div>
            </div>
          </div>

          <div className="xuan-card p-5">
            <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-3">历史配比</h3>
            <table className="xuan-table w-full text-sm">
              <thead>
                <tr>
                  <th>批次号</th>
                  <th>皮:草</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {pulpingBatches.map((b) => (
                  <tr key={b.id}>
                    <td className="font-medium text-xuan-ink">{b.batchNo}</td>
                    <td>{b.barkRatio}:{b.strawRatio}</td>
                    <td><span className={`xuan-badge border text-xs ${statusBadge[b.status]}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="xuan-card p-4 flex items-center gap-4">
        <div className="flex-1" />
        <button className="xuan-btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" />
          新增制浆
        </button>
      </div>

      {showForm && (
        <div className="xuan-card p-6 animate-fade-in-up">
          <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-4">新增制浆批次</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">批次号</label>
              <input className="xuan-input w-full" value={form.batchNo} onChange={(e) => updateForm('batchNo', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">青檀皮比例(%)</label>
              <input className="xuan-input w-full" type="number" value={form.barkRatio} onChange={(e) => updateForm('barkRatio', +e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">稻草比例(%)</label>
              <input className="xuan-input w-full" type="number" value={form.strawRatio} onChange={(e) => updateForm('strawRatio', +e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">蒸煮温度(°C)</label>
              <input className="xuan-input w-full" type="number" value={form.cookingTemp} onChange={(e) => updateForm('cookingTemp', +e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">蒸煮时间(h)</label>
              <input className="xuan-input w-full" type="number" value={form.cookingTime} onChange={(e) => updateForm('cookingTime', +e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">蒸煮压力(atm)</label>
              <input className="xuan-input w-full" type="number" step="0.1" value={form.cookingPressure} onChange={(e) => updateForm('cookingPressure', +e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">打浆度(°SR)</label>
              <input className="xuan-input w-full" type="number" value={form.beatingDegree} onChange={(e) => updateForm('beatingDegree', +e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">状态</label>
              <select className="xuan-select w-full" value={form.status} onChange={(e) => updateForm('status', e.target.value as PulpingBatch['status'])}>
                <option value="制浆中">制浆中</option>
                <option value="质检中">质检中</option>
                <option value="已完成">已完成</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">操作员</label>
              <input className="xuan-input w-full" value={form.operator} onChange={(e) => updateForm('operator', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">开始日期</label>
              <input className="xuan-input w-full" type="date" value={form.startDate} onChange={(e) => updateForm('startDate', e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button className="px-4 py-2 rounded-lg border border-xuan-paperDark text-xuan-inkLight hover:bg-xuan-paperDark/30 transition" onClick={() => setShowForm(false)}>取消</button>
            <button className="xuan-btn-primary" onClick={handleSubmit}>确认制浆</button>
          </div>
        </div>
      )}
    </div>
  );
}
