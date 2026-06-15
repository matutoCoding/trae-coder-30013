import { useState } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ClipboardCheck, Award, AlertCircle, Plus, ChevronRight } from 'lucide-react';
import { InspectionRecord } from '@/data/mockData';
import { useStore } from '@/store/useStore';
import { useBatchDrawer } from '@/contexts/BatchDrawerContext';

const emptyForm: Omit<InspectionRecord, 'id'> = {
  batchNo: '',
  tensileStrength: 3.5,
  thicknessUniformity: 90,
  lightTransmittance: 85,
  inkAbsorption: 88,
  grade: '净皮',
  specification: '四尺',
  result: '合格',
  inspector: '',
  date: new Date().toISOString().slice(0, 10),
};

const gradeBadge: Record<string, string> = {
  '特皮': 'bg-xuan-gold/20 text-xuan-gold border border-xuan-gold/40',
  '净皮': 'bg-xuan-indigo/20 text-xuan-indigo border border-xuan-indigo/30',
  '棉料': 'bg-xuan-bronze/20 text-xuan-bronze border border-xuan-bronze/30',
};

export default function Inspection() {
  const { inspections, pulpingBatches, addInspection } = useStore();
  const { openBatch } = useBatchDrawer();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const passRate = inspections.length
    ? ((inspections.filter((i) => i.result === '合格').length / inspections.length) * 100).toFixed(1)
    : '0';
  const thisMonth = inspections.filter((i) => i.date.startsWith('2026-06')).length;
  const failCount = inspections.filter((i) => i.result === '不合格').length;
  const premiumRate = inspections.length
    ? ((inspections.filter((i) => i.grade === '特皮').length / inspections.length) * 100).toFixed(1)
    : '0';

  const specs = ['四尺', '六尺', '八尺', '丈二'] as const;
  const specCounts = specs.map((s) => ({
    spec: s,
    total: inspections.filter((i) => i.specification === s).length,
    premium: inspections.filter((i) => i.specification === s && i.grade === '特皮').length,
    refined: inspections.filter((i) => i.specification === s && i.grade === '净皮').length,
    cotton: inspections.filter((i) => i.specification === s && i.grade === '棉料').length,
  }));

  const getAvgByGrade = (grade: string) => {
    const records = inspections.filter((i) => i.grade === grade);
    if (!records.length) return [];
    return [
      { subject: '拉力强度', A: (records.reduce((s, r) => s + r.tensileStrength, 0) / records.length).toFixed(2) },
      { subject: '厚度均匀', A: (records.reduce((s, r) => s + r.thicknessUniformity, 0) / records.length).toFixed(1) },
      { subject: '透光率', A: (records.reduce((s, r) => s + r.lightTransmittance, 0) / records.length).toFixed(1) },
      { subject: '吸墨性', A: (records.reduce((s, r) => s + r.inkAbsorption, 0) / records.length).toFixed(1) },
    ];
  };

  const radarData = [
    { subject: '拉力强度', 特皮: 3.8, 净皮: 3.2, 棉料: 2.8, fullMark: 5 },
    { subject: '厚度均匀', 特皮: 95, 净皮: 88, 棉料: 80, fullMark: 100 },
    { subject: '透光率', 特皮: 88, 净皮: 82, 棉料: 75, fullMark: 100 },
    { subject: '吸墨性', 特皮: 92, 净皮: 88, 棉料: 85, fullMark: 100 },
  ];

  const updateForm = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.batchNo || !form.inspector) return;
    addInspection({ ...form, id: `IR${Date.now()}` });
    setForm(emptyForm);
    setShowForm(false);
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <h2 className="xuan-section-title font-serif">检验分级</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-moss/15 flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6 text-xuan-moss" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">合格率</p>
            <p className="text-2xl font-bold text-xuan-ink">{passRate}%</p>
          </div>
        </div>
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-indigo/15 flex items-center justify-center">
            <Award className="w-6 h-6 text-xuan-indigo" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">本月检验</p>
            <p className="text-2xl font-bold text-xuan-ink">{thisMonth} 批</p>
          </div>
        </div>
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-cinnabar/15 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-xuan-cinnabar" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">不合格</p>
            <p className="text-2xl font-bold text-xuan-ink">{failCount} 批</p>
          </div>
        </div>
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-gold/15 flex items-center justify-center">
            <Award className="w-6 h-6 text-xuan-gold" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">特皮占比</p>
            <p className="text-2xl font-bold text-xuan-ink">{premiumRate}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold text-xuan-ink">规格分级</h3>
            <button className="xuan-btn-primary flex items-center gap-2 text-sm" onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4" />
              新增检验
            </button>
          </div>

          {showForm && (
            <div className="xuan-card p-5 animate-fade-in-up">
              <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-4">新增检验记录</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-sm text-xuan-inkLight mb-1">制浆批次</label>
                  <select
                    className="xuan-select w-full"
                    value={form.batchNo}
                    onChange={(e) => updateForm('batchNo', e.target.value)}
                  >
                    <option value="">选择批次...</option>
                    {pulpingBatches.map((b) => (
                      <option key={b.id} value={b.batchNo}>{b.batchNo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-xuan-inkLight mb-1">规格</label>
                  <select
                    className="xuan-select w-full"
                    value={form.specification}
                    onChange={(e) => updateForm('specification', e.target.value as InspectionRecord['specification'])}
                  >
                    <option value="四尺">四尺</option>
                    <option value="六尺">六尺</option>
                    <option value="八尺">八尺</option>
                    <option value="丈二">丈二</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-xuan-inkLight mb-1">等级</label>
                  <select
                    className="xuan-select w-full"
                    value={form.grade}
                    onChange={(e) => updateForm('grade', e.target.value as InspectionRecord['grade'])}
                  >
                    <option value="特皮">特皮</option>
                    <option value="净皮">净皮</option>
                    <option value="棉料">棉料</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-xuan-inkLight mb-1">结果</label>
                  <select
                    className="xuan-select w-full"
                    value={form.result}
                    onChange={(e) => updateForm('result', e.target.value as InspectionRecord['result'])}
                  >
                    <option value="合格">合格</option>
                    <option value="不合格">不合格</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-xuan-inkLight mb-1">拉力强度(N)</label>
                  <input className="xuan-input w-full" type="number" step="0.1" value={form.tensileStrength} onChange={(e) => updateForm('tensileStrength', +e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-xuan-inkLight mb-1">厚度均匀度(%)</label>
                  <input className="xuan-input w-full" type="number" value={form.thicknessUniformity} onChange={(e) => updateForm('thicknessUniformity', +e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-xuan-inkLight mb-1">透光率(%)</label>
                  <input className="xuan-input w-full" type="number" value={form.lightTransmittance} onChange={(e) => updateForm('lightTransmittance', +e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-xuan-inkLight mb-1">吸墨性(%)</label>
                  <input className="xuan-input w-full" type="number" value={form.inkAbsorption} onChange={(e) => updateForm('inkAbsorption', +e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-xuan-inkLight mb-1">检验员</label>
                  <input className="xuan-input w-full" value={form.inspector} onChange={(e) => updateForm('inspector', e.target.value)} />
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {specCounts.map((s) => (
              <div key={s.spec} className="xuan-card p-4">
                <h4 className="font-serif font-semibold text-xuan-ink mb-2">{s.spec}</h4>
                <p className="text-2xl font-bold text-xuan-ochre mb-3">{s.total} <span className="text-sm font-normal text-xuan-inkLight">批</span></p>
                <div className="space-y-1.5">
                  {s.premium > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-xuan-gold" />特皮
                      </span>
                      <span className="font-medium text-xuan-gold">{s.premium}</span>
                    </div>
                  )}
                  {s.refined > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-xuan-indigo" />净皮
                      </span>
                      <span className="font-medium text-xuan-indigo">{s.refined}</span>
                    </div>
                  )}
                  {s.cotton > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-xuan-bronze" />棉料
                      </span>
                      <span className="font-medium text-xuan-bronze">{s.cotton}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="xuan-card p-5">
            <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-4">检验记录</h3>
            <div className="overflow-x-auto">
              <table className="xuan-table w-full">
                <thead>
                  <tr>
                    <th>批次号</th>
                    <th>拉力</th>
                    <th>厚度</th>
                    <th>透光</th>
                    <th>吸墨</th>
                    <th>等级</th>
                    <th>规格</th>
                    <th>结果</th>
                    <th>检验员</th>
                    <th>日期</th>
                  </tr>
                </thead>
                <tbody>
                  {inspections.map((i) => (
                    <tr key={i.id}>
                      <td
                        className="font-medium text-xuan-ink cursor-pointer hover:text-xuan-ochre hover:underline underline-offset-2"
                        onClick={() => openBatch(i.batchNo)}
                      >
                        <div className="flex items-center gap-1">
                          {i.batchNo}
                          <ChevronRight className="w-3 h-3 opacity-50" />
                        </div>
                      </td>
                      <td>{i.tensileStrength}N</td>
                      <td>{i.thicknessUniformity}%</td>
                      <td>{i.lightTransmittance}%</td>
                      <td>{i.inkAbsorption}%</td>
                      <td><span className={`xuan-badge ${gradeBadge[i.grade]}`}>{i.grade}</span></td>
                      <td>{i.specification}</td>
                      <td>
                        <span className={`xuan-badge border ${
                          i.result === '合格'
                            ? 'bg-xuan-moss/20 text-xuan-moss border-xuan-moss/30'
                            : 'bg-xuan-cinnabar/20 text-xuan-cinnabar border-xuan-cinnabar/30'
                        }`}>{i.result}</span>
                      </td>
                      <td>{i.inspector}</td>
                      <td>{i.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="xuan-card p-5">
            <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-3">品质雷达图</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E8E0D0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#5A5A5A', fontSize: 11 }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar name="特皮" dataKey="特皮" stroke="#C9A84C" fill="#C9A84C" fillOpacity={0.3} strokeWidth={1.5} />
                <Radar name="净皮" dataKey="净皮" stroke="#4A6FA5" fill="#4A6FA5" fillOpacity={0.25} strokeWidth={1.5} />
                <Radar name="棉料" dataKey="棉料" stroke="#CD7F32" fill="#CD7F32" fillOpacity={0.2} strokeWidth={1.5} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="xuan-card p-5">
            <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-3">等级说明</h3>
            <div className="space-y-3">
              <div className="flex gap-3 p-3 rounded-lg bg-xuan-gold/10 border border-xuan-gold/20">
                <div className="w-8 h-8 rounded-full bg-xuan-gold/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-xuan-gold">特</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-xuan-ink">特皮</p>
                  <p className="text-xs text-xuan-inkLight">80%以上青檀皮，拉力强，润墨性极佳，适用于书法精品</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-lg bg-xuan-indigo/10 border border-xuan-indigo/20">
                <div className="w-8 h-8 rounded-full bg-xuan-indigo/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-xuan-indigo">净</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-xuan-ink">净皮</p>
                  <p className="text-xs text-xuan-inkLight">50-70%青檀皮，韧性好，吸墨均匀，常用书画纸</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-lg bg-xuan-bronze/10 border border-xuan-bronze/20">
                <div className="w-8 h-8 rounded-full bg-xuan-bronze/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-xuan-bronze">棉</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-xuan-ink">棉料</p>
                  <p className="text-xs text-xuan-inkLight">30%以下青檀皮，柔软轻薄，适合练习与临摹</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
