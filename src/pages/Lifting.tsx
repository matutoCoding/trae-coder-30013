import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Layers, Users, Grid3x3, Plus, Trophy, ChevronRight } from 'lucide-react';
import { LiftingRecord, dailyOutput } from '@/data/mockData';
import { useStore } from '@/store/useStore';
import { useBatchDrawer } from '@/contexts/BatchDrawerContext';

const statusBadge: Record<string, string> = {
  '空闲': 'bg-xuan-moss/20 text-xuan-moss border-xuan-moss/30',
  '使用中': 'bg-xuan-ochre/20 text-xuan-ochre border-xuan-ochre/30',
  '维护中': 'bg-xuan-cinnabar/20 text-xuan-cinnabar border-xuan-cinnabar/30',
};

const emptyForm: Omit<LiftingRecord, 'id'> = {
  pulpingBatchId: '',
  pulpingBatchNo: '',
  screenNo: '',
  operator: '',
  sheetCount: 0,
  thickness: 0.08,
  date: new Date().toISOString().slice(0, 10),
};

export default function Lifting() {
  const { screenBeds, liftingRecords, pulpingBatches, addLiftingRecord } = useStore();
  const { openBatch } = useBatchDrawer();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const todaySheets = liftingRecords
    .filter((r) => r.date === new Date().toISOString().slice(0, 10))
    .reduce((s, r) => s + r.sheetCount, 0);

  const activeScreens = screenBeds.filter((s) => s.status === '使用中').length;
  const operators = Array.from(new Set(liftingRecords.map((r) => r.operator))).length;

  const operatorStats = liftingRecords.reduce((acc, r) => {
    acc[r.operator] = (acc[r.operator] || 0) + r.sheetCount;
    return acc;
  }, {} as Record<string, number>);

  const sortedOperators = Object.entries(operatorStats)
    .sort((a, b) => b[1] - a[1]);

  const updateForm = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleBatchSelect = (batchId: string) => {
    const batch = pulpingBatches.find((b) => b.id === batchId);
    updateForm('pulpingBatchId', batchId);
    updateForm('pulpingBatchNo', batch?.batchNo || '');
  };

  const handleSubmit = () => {
    if (!form.screenNo || !form.operator || !form.pulpingBatchId) return;
    addLiftingRecord({ ...form, id: `LR${Date.now()}` });
    setForm(emptyForm);
    setShowForm(false);
  };

  const medalColor = [
    'text-xuan-gold',
    'text-xuan-silver',
    'text-xuan-bronze',
  ];

  return (
    <div className="animate-fade-in-up space-y-6">
      <h2 className="xuan-section-title font-serif">捞纸生产</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-ochre/15 flex items-center justify-center">
            <Layers className="w-6 h-6 text-xuan-ochre" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">今日捞纸张数</p>
            <p className="text-2xl font-bold text-xuan-ink">{todaySheets} 张</p>
          </div>
        </div>
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-moss/15 flex items-center justify-center">
            <Grid3x3 className="w-6 h-6 text-xuan-moss" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">活跃帘床</p>
            <p className="text-2xl font-bold text-xuan-ink">{activeScreens} 张</p>
          </div>
        </div>
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-indigo/15 flex items-center justify-center">
            <Users className="w-6 h-6 text-xuan-indigo" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">操作员</p>
            <p className="text-2xl font-bold text-xuan-ink">{operators} 人</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold text-xuan-ink">帘床状态</h3>
            <button className="xuan-btn-primary flex items-center gap-2 text-sm" onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4" />
              新增捞纸记录
            </button>
          </div>

          {showForm && (
            <div className="xuan-card p-5 animate-fade-in-up">
              <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-4">新增捞纸记录</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-sm text-xuan-inkLight mb-1">关联制浆批次</label>
                  <select
                    className="xuan-select w-full"
                    value={form.pulpingBatchId}
                    onChange={(e) => handleBatchSelect(e.target.value)}
                  >
                    <option value="">选择制浆批次...</option>
                    {pulpingBatches.map((b) => (
                      <option key={b.id} value={b.id}>{b.batchNo} - {b.status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-xuan-inkLight mb-1">帘床编号</label>
                  <select
                    className="xuan-select w-full"
                    value={form.screenNo}
                    onChange={(e) => updateForm('screenNo', e.target.value)}
                  >
                    <option value="">选择帘床...</option>
                    {screenBeds.filter((s) => s.status !== '维护中').map((s) => (
                      <option key={s.id} value={s.screenNo}>{s.screenNo} ({s.meshSpec})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-xuan-inkLight mb-1">操作员</label>
                  <input className="xuan-input w-full" value={form.operator} onChange={(e) => updateForm('operator', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-xuan-inkLight mb-1">张数</label>
                  <input className="xuan-input w-full" type="number" value={form.sheetCount || ''} onChange={(e) => updateForm('sheetCount', +e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-xuan-inkLight mb-1">厚度(mm)</label>
                  <input className="xuan-input w-full" type="number" step="0.01" value={form.thickness} onChange={(e) => updateForm('thickness', +e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-xuan-inkLight mb-1">日期</label>
                  <input className="xuan-input w-full" type="date" value={form.date} onChange={(e) => updateForm('date', e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button className="px-4 py-2 rounded-lg border border-xuan-paperDark text-xuan-inkLight hover:bg-xuan-paperDark/30 transition" onClick={() => setShowForm(false)}>取消</button>
                <button className="xuan-btn-primary" onClick={handleSubmit}>确认提交</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {screenBeds.map((bed) => (
              <div key={bed.id} className="xuan-card-hover p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-serif font-semibold text-xuan-ink">{bed.screenNo}</span>
                  <span className={`xuan-badge border text-xs ${statusBadge[bed.status]}`}>{bed.status}</span>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-xuan-inkLight">帘目</span>
                    <span className="text-xuan-ink">{bed.meshSpec}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xuan-inkLight">操作员</span>
                    <span className="text-xuan-ink">{bed.operator || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xuan-inkLight">上次维护</span>
                    <span className="text-xuan-ink">{bed.lastMaintenance}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="xuan-card p-5">
            <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-4">近期捞纸记录</h3>
            <table className="xuan-table w-full">
              <thead>
                <tr>
                  <th>制浆批次</th>
                  <th>帘床</th>
                  <th>操作员</th>
                  <th>张数</th>
                  <th>厚度</th>
                  <th>日期</th>
                </tr>
              </thead>
              <tbody>
                {liftingRecords.slice(0, 8).map((r) => (
                  <tr key={r.id}>
                    <td
                      className="font-medium text-xuan-ink cursor-pointer hover:text-xuan-ochre hover:underline underline-offset-2"
                      onClick={() => openBatch(r.pulpingBatchNo)}
                    >
                      <div className="flex items-center gap-1">
                        {r.pulpingBatchNo}
                        <ChevronRight className="w-3 h-3 opacity-50" />
                      </div>
                    </td>
                    <td>{r.screenNo}</td>
                    <td>{r.operator}</td>
                    <td>{r.sheetCount}</td>
                    <td>{r.thickness}mm</td>
                    <td>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="xuan-card p-5">
            <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-3">日产量趋势</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dailyOutput}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D0" />
                <XAxis dataKey="day" stroke="#5A5A5A" fontSize={11} tickLine={false} />
                <YAxis stroke="#5A5A5A" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#FAF7F0', border: '1px solid #E8E0D0', borderRadius: 8 }} />
                <Bar dataKey="sheets" fill="#8B4513" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="xuan-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-xuan-gold" />
              <h3 className="font-serif text-lg font-semibold text-xuan-ink">操作员排行</h3>
            </div>
            <div className="space-y-3">
              {sortedOperators.map(([name, count], i) => (
                <div key={name} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full bg-xuan-paperDark/30 flex items-center justify-center text-xs font-bold ${medalColor[i] || 'text-xuan-inkLight'}`}>
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm text-xuan-ink">{name}</span>
                  <span className="text-sm font-medium text-xuan-ochre">{count} 张</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
