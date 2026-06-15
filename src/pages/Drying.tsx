import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Sun, Thermometer, AlertTriangle, Plus, Clock, ChevronRight } from 'lucide-react';
import { DryingRecord, temperatureData } from '@/data/mockData';
import { useStore } from '@/store/useStore';
import { useBatchDrawer } from '@/contexts/BatchDrawerContext';

const firewalls = [
  { no: '火墙-A1', status: '运行中' },
  { no: '火墙-A2', status: '运行中' },
  { no: '火墙-B1', status: '运行中' },
  { no: '火墙-B2', status: '空闲' },
];

const emptyForm: Omit<DryingRecord, 'id'> = {
  wallNo: '',
  batchNo: '',
  temperature: 85,
  humidity: 35,
  duration: 240,
  moistureAfter: 6.5,
  operator: '',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  appearance: '平整光滑',
  warpRecord: '无',
};

export default function Drying() {
  const { dryingRecords, pulpingBatches, addDryingRecord } = useStore();
  const { openBatch } = useBatchDrawer();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const activeCount = dryingRecords.filter((r) => r.endDate >= new Date().toISOString().slice(0, 10)).length;
  const avgTemp = dryingRecords.length
    ? (dryingRecords.reduce((s, r) => s + r.temperature, 0) / dryingRecords.length).toFixed(0)
    : '0';
  const avgMoisture = dryingRecords.length
    ? (dryingRecords.reduce((s, r) => s + r.moistureAfter, 0) / dryingRecords.length).toFixed(1)
    : '0';
  const abnormalCount = dryingRecords.filter((r) => r.moistureAfter > 7).length;

  const updateForm = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.wallNo || !form.batchNo || !form.operator) return;
    addDryingRecord({ ...form, id: `DR${Date.now()}` });
    setForm(emptyForm);
    setShowForm(false);
  };

  const moistureBadge = (val: number) => {
    if (val < 7) return 'bg-xuan-moss/20 text-xuan-moss border-xuan-moss/30';
    if (val <= 8) return 'bg-xuan-gold/20 text-xuan-gold border-xuan-gold/30';
    return 'bg-xuan-cinnabar/20 text-xuan-cinnabar border-xuan-cinnabar/30';
  };

  const moistureLabel = (val: number) => {
    if (val < 7) return '达标';
    if (val <= 8) return '偏高';
    return '超标';
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <h2 className="xuan-section-title font-serif">晒纸焙干</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-ochre/15 flex items-center justify-center">
            <Sun className="w-6 h-6 text-xuan-ochre" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">焙干进行中</p>
            <p className="text-2xl font-bold text-xuan-ink">{activeCount} 批</p>
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
          <div className="w-12 h-12 rounded-xl bg-xuan-gold/15 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-xuan-gold" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">异常预警</p>
            <p className="text-2xl font-bold text-xuan-ink">{abnormalCount} 条</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold text-xuan-ink">温度监控</h3>
            <button className="xuan-btn-primary flex items-center gap-2 text-sm" onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4" />
              新增焙干记录
            </button>
          </div>

          {showForm && (
            <div className="xuan-card p-5 animate-fade-in-up">
              <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-4">新增焙干记录</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-xuan-inkLight mb-1">制浆批次</label>
                  <select
                    className="xuan-select w-full"
                    value={form.batchNo}
                    onChange={(e) => updateForm('batchNo', e.target.value)}
                  >
                    <option value="">选择批次...</option>
                    {pulpingBatches.map((b) => (
                      <option key={b.id} value={b.batchNo}>{b.batchNo} ({b.status})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-xuan-inkLight mb-1">火墙编号</label>
                  <select
                    className="xuan-select w-full"
                    value={form.wallNo}
                    onChange={(e) => updateForm('wallNo', e.target.value)}
                  >
                    <option value="">选择火墙...</option>
                    {firewalls.filter((w) => w.status === '运行中').map((w) => (
                      <option key={w.no} value={w.no}>{w.no}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-xuan-inkLight mb-1">操作员</label>
                  <input className="xuan-input w-full" value={form.operator} onChange={(e) => updateForm('operator', e.target.value)} />
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
                  <label className="block text-sm text-xuan-inkLight mb-1">时长(分)</label>
                  <input className="xuan-input w-full" type="number" value={form.duration} onChange={(e) => updateForm('duration', +e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-xuan-inkLight mb-1">终含水率(%)</label>
                  <input className="xuan-input w-full" type="number" step="0.1" value={form.moistureAfter} onChange={(e) => updateForm('moistureAfter', +e.target.value)} />
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
                <div className="md:col-span-2">
                  <label className="block text-sm text-xuan-inkLight mb-1">翘曲记录</label>
                  <input className="xuan-input w-full" value={form.warpRecord} onChange={(e) => updateForm('warpRecord', e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button className="px-4 py-2 rounded-lg border border-xuan-paperDark text-xuan-inkLight hover:bg-xuan-paperDark/30 transition" onClick={() => setShowForm(false)}>取消</button>
                <button className="xuan-btn-primary" onClick={handleSubmit}>确认提交</button>
              </div>
            </div>
          )}

          <div className="xuan-card p-5">
            <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-4">火墙温度曲线</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D0" />
                <XAxis dataKey="time" stroke="#5A5A5A" fontSize={11} tickLine={false} />
                <YAxis stroke="#5A5A5A" fontSize={11} tickLine={false} axisLine={false} domain={[60, 100]} />
                <Tooltip contentStyle={{ background: '#FAF7F0', border: '1px solid #E8E0D0', borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="temp" name="实际温度" stroke="#8B4513" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="target" name="目标温度" stroke="#C9A84C" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {firewalls.map((fw) => (
              <div key={fw.no} className="xuan-card-hover p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif font-semibold text-xuan-ink text-sm">{fw.no}</span>
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${fw.status === '运行中' ? 'bg-xuan-moss animate-pulse' : 'bg-xuan-inkLight/40'}`} />
                    <span className="text-[10px] text-xuan-inkLight">{fw.status}</span>
                  </div>
                </div>
                <p className="text-xl font-bold text-xuan-ochre">
                  {fw.status === '运行中' ? '85°' : '--'}
                </p>
                <p className="text-xs text-xuan-inkLight">当前温度</p>
              </div>
            ))}
          </div>

          <div className="xuan-card p-5">
            <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-4">焙干记录</h3>
            <div className="overflow-x-auto">
              <table className="xuan-table w-full">
                <thead>
                  <tr>
                    <th>批次号</th>
                    <th>火墙</th>
                    <th>温度</th>
                    <th>湿度</th>
                    <th>时长</th>
                    <th>含水率</th>
                    <th>操作员</th>
                    <th>日期</th>
                  </tr>
                </thead>
                <tbody>
                  {dryingRecords.map((r) => (
                    <tr key={r.id}>
                      <td
                        className="font-medium text-xuan-ink cursor-pointer hover:text-xuan-ochre hover:underline underline-offset-2"
                        onClick={() => openBatch(r.batchNo)}
                      >
                        <div className="flex items-center gap-1">
                          {r.batchNo}
                          <ChevronRight className="w-3 h-3 opacity-50" />
                        </div>
                      </td>
                      <td>{r.wallNo}</td>
                      <td>{r.temperature}°C</td>
                      <td>{r.humidity}%</td>
                      <td>{r.duration}分</td>
                      <td>
                        <span className={`xuan-badge border ${moistureBadge(r.moistureAfter)}`}>
                          {r.moistureAfter}% · {moistureLabel(r.moistureAfter)}
                        </span>
                      </td>
                      <td>{r.operator}</td>
                      <td>{r.startDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="xuan-card p-5">
            <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-3">近期质量</h3>
            <div className="space-y-3">
              {dryingRecords.slice(0, 5).map((r) => (
                <div key={r.id} className="p-3 rounded-lg bg-xuan-paperDark/20">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-sm font-medium text-xuan-ink cursor-pointer hover:text-xuan-ochre"
                      onClick={() => openBatch(r.batchNo)}
                    >
                      {r.batchNo}
                    </span>
                    <span className={`xuan-badge border text-xs ${moistureBadge(r.moistureAfter)}`}>
                      {r.moistureAfter}%
                    </span>
                  </div>
                  <p className="text-xs text-xuan-inkLight">{r.appearance} · {r.warpRecord}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
