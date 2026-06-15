import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Sun, Thermometer, AlertTriangle, Plus, Clock } from 'lucide-react';
import { DryingRecord, temperatureData } from '@/data/mockData';
import { useStore } from '@/store/useStore';

const wallStatuses = [
  { wallNo: '火墙-A1', status: '焙干中' as const, temp: 85 },
  { wallNo: '火墙-A2', status: '焙干中' as const, temp: 82 },
  { wallNo: '火墙-B1', status: '预热中' as const, temp: 68 },
  { wallNo: '火墙-B2', status: '冷却中' as const, temp: 45 },
];

const statusStyle: Record<string, string> = {
  '焙干中': 'bg-xuan-ochre/20 text-xuan-ochre border-xuan-ochre/30',
  '预热中': 'bg-xuan-gold/20 text-xuan-gold border-xuan-gold/30',
  '冷却中': 'bg-xuan-indigo/20 text-xuan-indigo border-xuan-indigo/30',
};

const statusDot: Record<string, string> = {
  '焙干中': 'bg-xuan-ochre',
  '预热中': 'bg-xuan-gold',
  '冷却中': 'bg-xuan-indigo',
};

const moistureBadge = (v: number) => {
  if (v < 7) return 'bg-xuan-moss/15 text-xuan-moss border-xuan-moss/30';
  if (v <= 8) return 'bg-xuan-gold/15 text-xuan-gold border-xuan-gold/30';
  return 'bg-xuan-cinnabar/15 text-xuan-cinnabar border-xuan-cinnabar/30';
};

const moistureLabel = (v: number) => {
  if (v < 7) return '达标';
  if (v <= 8) return '偏高';
  return '超标';
};

const emptyForm: Omit<DryingRecord, 'id'> = {
  wallNo: '',
  batchNo: '',
  temperature: 85,
  humidity: 35,
  duration: 240,
  moistureAfter: 6.0,
  operator: '',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  appearance: '',
  warpRecord: '',
};

export default function Drying() {
  const { dryingRecords, addDryingRecord } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const activeCount = wallStatuses.filter((w) => w.status === '焙干中').length;
  const avgTemp = dryingRecords.length
    ? (dryingRecords.reduce((s, r) => s + r.temperature, 0) / dryingRecords.length).toFixed(1)
    : '0';
  const avgMoisture = dryingRecords.length
    ? (dryingRecords.reduce((s, r) => s + r.moistureAfter, 0) / dryingRecords.length).toFixed(1)
    : '0';
  const warnings = dryingRecords.filter((r) => r.moistureAfter > 8).length;

  const updateForm = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    addDryingRecord({ ...form, id: `DR${Date.now()}` });
    setForm(emptyForm);
    setShowForm(false);
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <h2 className="xuan-section-title font-serif">晒纸焙干</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-ochre/15 flex items-center justify-center">
            <Sun className="w-6 h-6 text-xuan-ochre" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">当前焙干中</p>
            <p className="text-2xl font-bold text-xuan-ink">{activeCount} 面</p>
          </div>
        </div>
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-cinnabar/15 flex items-center justify-center">
            <Thermometer className="w-6 h-6 text-xuan-cinnabar" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">平均温度</p>
            <p className="text-2xl font-bold text-xuan-ink">{avgTemp}°C</p>
          </div>
        </div>
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-moss/15 flex items-center justify-center">
            <Clock className="w-6 h-6 text-xuan-moss" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">平均含水率</p>
            <p className="text-2xl font-bold text-xuan-ink">{avgMoisture}%</p>
          </div>
        </div>
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-cinnabar/15 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-xuan-cinnabar" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">异常预警</p>
            <p className="text-2xl font-bold text-xuan-ink">{warnings} 条</p>
          </div>
        </div>
      </div>

      <div className="xuan-card p-5">
        <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-3">温度监控</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={temperatureData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D0" />
            <XAxis dataKey="time" tick={{ fill: '#5A5A5A', fontSize: 12 }} />
            <YAxis tick={{ fill: '#5A5A5A', fontSize: 12 }} domain={[60, 95]} />
            <Tooltip contentStyle={{ background: '#FAF7F0', border: '1px solid #E8E0D0', borderRadius: 8 }} />
            <Legend />
            <Line type="monotone" dataKey="temp" stroke="#8B4513" strokeWidth={2} dot={{ r: 3 }} name="实际温度" />
            <Line type="monotone" dataKey="target" stroke="#C9A84C" strokeWidth={2} strokeDasharray="6 3" dot={false} name="目标温度" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-3">火墙状态</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {wallStatuses.map((w) => (
            <div key={w.wallNo} className="xuan-card-hover p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-serif font-semibold text-xuan-ink">{w.wallNo}</span>
                <span className={`xuan-badge border ${statusStyle[w.status]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot[w.status]} mr-1.5`} />
                  {w.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-xuan-inkLight" />
                <span className="text-2xl font-bold text-xuan-ink">{w.temp}°C</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="xuan-card p-5">
            <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-3">焙干记录</h3>
            <table className="xuan-table w-full">
              <thead>
                <tr>
                  <th>火墙</th>
                  <th>批次</th>
                  <th>温度</th>
                  <th>湿度</th>
                  <th>时长</th>
                  <th>终含水率</th>
                  <th>操作员</th>
                  <th>开始日期</th>
                  <th>外观</th>
                </tr>
              </thead>
              <tbody>
                {dryingRecords.map((r) => (
                  <tr key={r.id}>
                    <td className="font-medium text-xuan-ink">{r.wallNo}</td>
                    <td>{r.batchNo}</td>
                    <td>{r.temperature}°C</td>
                    <td>{r.humidity}%</td>
                    <td>{r.duration}分</td>
                    <td>
                      <span className={`xuan-badge border ${moistureBadge(r.moistureAfter)}`}>
                        {r.moistureAfter}% {moistureLabel(r.moistureAfter)}
                      </span>
                    </td>
                    <td>{r.operator}</td>
                    <td>{r.startDate}</td>
                    <td>{r.appearance ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="xuan-card p-4 flex items-center gap-4">
            <div className="flex-1" />
            <button className="xuan-btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4" />
              新增焙干记录
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="xuan-card p-6 animate-fade-in-up">
          <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-4">新增焙干记录</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">火墙编号</label>
              <select className="xuan-select w-full" value={form.wallNo} onChange={(e) => updateForm('wallNo', e.target.value)}>
                <option value="">请选择</option>
                {wallStatuses.map((w) => (
                  <option key={w.wallNo} value={w.wallNo}>{w.wallNo}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">批次号</label>
              <input className="xuan-input w-full" value={form.batchNo} onChange={(e) => updateForm('batchNo', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">温度(°C)</label>
              <input className="xuan-input w-full" type="number" value={form.temperature} onChange={(e) => updateForm('temperature', +e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">湿度(%)</label>
              <input className="xuan-input w-full" type="number" value={form.humidity} onChange={(e) => updateForm('humidity', +e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">时长(分钟)</label>
              <input className="xuan-input w-full" type="number" value={form.duration} onChange={(e) => updateForm('duration', +e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">终含水率(%)</label>
              <input className="xuan-input w-full" type="number" step="0.1" value={form.moistureAfter} onChange={(e) => updateForm('moistureAfter', +e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">操作员</label>
              <input className="xuan-input w-full" value={form.operator} onChange={(e) => updateForm('operator', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">开始日期</label>
              <input className="xuan-input w-full" type="date" value={form.startDate} onChange={(e) => updateForm('startDate', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">结束日期</label>
              <input className="xuan-input w-full" type="date" value={form.endDate} onChange={(e) => updateForm('endDate', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">外观</label>
              <input className="xuan-input w-full" value={form.appearance} onChange={(e) => updateForm('appearance', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-xuan-inkLight mb-1">翘曲记录</label>
              <input className="xuan-input w-full" value={form.warpRecord} onChange={(e) => updateForm('warpRecord', e.target.value)} />
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
