import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Layers, Users, Grid3x3, Plus, Trophy } from 'lucide-react';
import { ScreenBed, LiftingRecord, dailyOutput } from '@/data/mockData';
import { useStore } from '@/store/useStore';

const statusStyle: Record<ScreenBed['status'], string> = {
  '空闲': 'bg-xuan-moss/20 text-xuan-moss border-xuan-moss/30',
  '使用中': 'bg-xuan-ochre/20 text-xuan-ochre border-xuan-ochre/30',
  '维护中': 'bg-xuan-cinnabar/20 text-xuan-cinnabar border-xuan-cinnabar/30',
};

const emptyForm: Omit<LiftingRecord, 'id'> = {
  screenNo: '',
  operator: '',
  sheetCount: 0,
  thickness: 0.08,
  date: new Date().toISOString().slice(0, 10),
};

export default function Lifting() {
  const { screenBeds, liftingRecords, addLiftingRecord } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todaySheets = liftingRecords
    .filter((r) => r.date === todayStr)
    .reduce((s, r) => s + r.sheetCount, 0);
  const activeBeds = screenBeds.filter((b) => b.status === '使用中').length;
  const operatorSet = new Set(liftingRecords.map((r) => r.operator));

  const operatorTotals = liftingRecords.reduce<Record<string, number>>((acc, r) => {
    acc[r.operator] = (acc[r.operator] || 0) + r.sheetCount;
    return acc;
  }, {});
  const sortedOperators = Object.entries(operatorTotals)
    .sort(([, a], [, b]) => b - a)
    .map(([name, total]) => ({ name, total }));

  const updateForm = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    addLiftingRecord({ ...form, id: `LR${Date.now()}` });
    setForm(emptyForm);
    setShowForm(false);
  };

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
            <p className="text-sm text-xuan-inkLight">活跃帘床数</p>
            <p className="text-2xl font-bold text-xuan-ink">{activeBeds} 床</p>
          </div>
        </div>
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-indigo/15 flex items-center justify-center">
            <Users className="w-6 h-6 text-xuan-indigo" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">操作员人数</p>
            <p className="text-2xl font-bold text-xuan-ink">{operatorSet.size} 人</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-3">帘床状态</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {screenBeds.map((bed) => (
            <div key={bed.id} className="xuan-card-hover p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-serif font-semibold text-xuan-ink">{bed.screenNo}</span>
                <span className={`xuan-badge border ${statusStyle[bed.status]}`}>{bed.status}</span>
              </div>
              <div className="space-y-1.5 text-sm text-xuan-inkLight">
                <div className="flex justify-between">
                  <span>网目规格</span>
                  <span className="text-xuan-ink font-medium">{bed.meshSpec}</span>
                </div>
                <div className="flex justify-between">
                  <span>操作员</span>
                  <span className="text-xuan-ink font-medium">{bed.operator ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span>上次维护</span>
                  <span className="text-xuan-ink font-medium">{bed.lastMaintenance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="xuan-card p-5">
            <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-3">近期捞纸记录</h3>
            <table className="xuan-table w-full">
              <thead>
                <tr>
                  <th>帘床</th>
                  <th>操作员</th>
                  <th>张数</th>
                  <th>厚度(mm)</th>
                  <th>日期</th>
                </tr>
              </thead>
              <tbody>
                {liftingRecords.map((r) => (
                  <tr key={r.id}>
                    <td className="font-medium text-xuan-ink">{r.screenNo}</td>
                    <td>{r.operator}</td>
                    <td>{r.sheetCount}</td>
                    <td>{r.thickness}</td>
                    <td>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="xuan-card p-5">
            <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-3">日产量趋势</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dailyOutput}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D0" />
                <XAxis dataKey="day" tick={{ fill: '#5A5A5A', fontSize: 12 }} />
                <YAxis tick={{ fill: '#5A5A5A', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#FAF7F0', border: '1px solid #E8E0D0', borderRadius: 8 }} />
                <Bar dataKey="sheets" fill="#8B4513" radius={[4, 4, 0, 0]} name="张数" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="xuan-card p-5">
            <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-xuan-gold" />
              操作员排行
            </h3>
            <div className="space-y-3">
              {sortedOperators.map((op, i) => (
                <div key={op.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-xuan-gold/20 text-xuan-gold' :
                      i === 1 ? 'bg-xuan-silver/20 text-xuan-silver' :
                      i === 2 ? 'bg-xuan-bronze/20 text-xuan-bronze' :
                      'bg-xuan-paperDark/40 text-xuan-inkLight'
                    }`}>
                      {i + 1}
                    </span>
                    <span className="text-sm text-xuan-ink font-medium">{op.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-xuan-ochre">{op.total} 张</span>
                </div>
              ))}
            </div>
          </div>

          <div className="xuan-card p-4 flex items-center gap-4">
            <div className="flex-1" />
            <button className="xuan-btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4" />
              新增捞纸记录
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="xuan-card p-6 animate-fade-in-up">
          <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-4">新增捞纸记录</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">帘床编号</label>
              <select className="xuan-select w-full" value={form.screenNo} onChange={(e) => updateForm('screenNo', e.target.value)}>
                <option value="">请选择</option>
                {screenBeds.map((b) => (
                  <option key={b.id} value={b.screenNo}>{b.screenNo}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">操作员</label>
              <input className="xuan-input w-full" value={form.operator} onChange={(e) => updateForm('operator', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">张数</label>
              <input className="xuan-input w-full" type="number" value={form.sheetCount} onChange={(e) => updateForm('sheetCount', +e.target.value)} />
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
            <button className="xuan-btn-primary" onClick={handleSubmit}>确认记录</button>
          </div>
        </div>
      )}
    </div>
  );
}
