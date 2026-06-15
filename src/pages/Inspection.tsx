import { useState } from 'react';
import { ClipboardCheck, Award, AlertCircle, Plus } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { InspectionRecord } from '@/data/mockData';
import { useStore } from '@/store/useStore';

const gradeStyle: Record<string, string> = {
  '特皮': 'bg-xuan-gold/20 text-xuan-gold border border-xuan-gold/50',
  '净皮': 'bg-xuan-indigo/20 text-xuan-indigo border border-xuan-indigo/30',
  '棉料': 'bg-xuan-bronze/20 text-xuan-bronze border border-xuan-bronze/30',
};

const resultStyle: Record<string, string> = {
  '合格': 'bg-xuan-moss/20 text-xuan-moss border border-xuan-moss/30',
  '不合格': 'bg-xuan-cinnabar/20 text-xuan-cinnabar border border-xuan-cinnabar/30',
};

const specs: InspectionRecord['specification'][] = ['四尺', '六尺', '八尺', '丈二'];
const grades: InspectionRecord['grade'][] = ['特皮', '净皮', '棉料'];

const emptyForm: Omit<InspectionRecord, 'id'> = {
  batchNo: '', tensileStrength: 0, thicknessUniformity: 0, lightTransmittance: 0,
  inkAbsorption: 0, grade: '净皮', specification: '四尺', result: '合格', inspector: '', date: new Date().toISOString().slice(0, 10),
};

export default function Inspection() {
  const { inspections, addInspection } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const passCount = inspections.filter((i) => i.result === '合格').length;
  const failCount = inspections.filter((i) => i.result === '不合格').length;
  const tePiCount = inspections.filter((i) => i.grade === '特皮').length;
  const passRate = inspections.length ? ((passCount / inspections.length) * 100).toFixed(1) : '0.0';
  const tePiRate = inspections.length ? ((tePiCount / inspections.length) * 100).toFixed(1) : '0.0';

  const specGradeMap = specs.map((spec) => {
    const filtered = inspections.filter((i) => i.specification === spec);
    return { spec, count: filtered.length, grades: Object.fromEntries(grades.map((g) => [g, filtered.filter((i) => i.grade === g).length])) };
  });

  const avgByGrade = grades.map((g) => {
    const items = inspections.filter((i) => i.grade === g);
    if (!items.length) return { grade: g, tensileStrength: 0, thicknessUniformity: 0, lightTransmittance: 0, inkAbsorption: 0 };
    const avg = (key: keyof Pick<InspectionRecord, 'tensileStrength' | 'thicknessUniformity' | 'lightTransmittance' | 'inkAbsorption'>) =>
      items.reduce((s, i) => s + i[key], 0) / items.length;
    return { grade: g, tensileStrength: +avg('tensileStrength').toFixed(1), thicknessUniformity: +avg('thicknessUniformity').toFixed(1), lightTransmittance: +avg('lightTransmittance').toFixed(1), inkAbsorption: +avg('inkAbsorption').toFixed(1) };
  });

  const radarData = [
    { metric: '拉力强度', ...Object.fromEntries(avgByGrade.map((d) => [d.grade, d.tensileStrength])) },
    { metric: '厚度均匀', ...Object.fromEntries(avgByGrade.map((d) => [d.grade, d.thicknessUniformity])) },
    { metric: '透光率', ...Object.fromEntries(avgByGrade.map((d) => [d.grade, d.lightTransmittance])) },
    { metric: '吸墨性', ...Object.fromEntries(avgByGrade.map((d) => [d.grade, d.inkAbsorption])) },
  ];

  const handleSubmit = () => {
    addInspection({ ...form, id: `IR${Date.now()}` });
    setForm(emptyForm);
    setShowForm(false);
  };

  const u = (k: keyof typeof form, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="animate-fade-in-up space-y-6">
      <h2 className="xuan-section-title font-serif">检验分级</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <p className="text-sm text-xuan-inkLight">本月检验数</p>
            <p className="text-2xl font-bold text-xuan-ink">{inspections.length}</p>
          </div>
        </div>
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-cinnabar/15 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-xuan-cinnabar" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">不合格数</p>
            <p className="text-2xl font-bold text-xuan-cinnabar">{failCount}</p>
          </div>
        </div>
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-gold/15 flex items-center justify-center">
            <Award className="w-6 h-6 text-xuan-gold" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">特皮占比</p>
            <p className="text-2xl font-bold text-xuan-gold">{tePiRate}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {specGradeMap.map(({ spec, count, grades: g }) => (
          <div key={spec} className="xuan-card-hover p-4">
            <p className="font-serif font-semibold text-xuan-ink text-lg">{spec}</p>
            <p className="text-xs text-xuan-inkLight mb-2">共 {count} 批</p>
            <div className="space-y-1">
              {grades.map((gr) => (
                <div key={gr} className="flex items-center justify-between text-sm">
                  <span className={`xuan-badge ${gradeStyle[gr]}`}>{gr}</span>
                  <span className="text-xuan-inkLight">{g[gr]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="xuan-card p-6">
        <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-4">品质雷达图</h3>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#E8E0D0" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: '#5A5A5A', fontSize: 13 }} />
            <PolarRadiusAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <Radar name="特皮" dataKey="特皮" stroke="#C9A84C" fill="#C9A84C" fillOpacity={0.2} />
            <Radar name="净皮" dataKey="净皮" stroke="#4A6FA5" fill="#4A6FA5" fillOpacity={0.2} />
            <Radar name="棉料" dataKey="棉料" stroke="#CD7F32" fill="#CD7F32" fillOpacity={0.2} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-2">
          {[['特皮', 'bg-xuan-gold'], ['净皮', 'bg-xuan-indigo'], ['棉料', 'bg-xuan-bronze']].map(([label, color]) => (
            <span key={label} className="flex items-center gap-2 text-sm text-xuan-inkLight">
              <span className={`w-3 h-3 rounded-full ${color}`} />{label}
            </span>
          ))}
        </div>
      </div>

      <div className="xuan-card p-4 flex items-center gap-4">
        <div className="flex-1" />
        <button className="xuan-btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" />新增检验
        </button>
      </div>

      {showForm && (
        <div className="xuan-card p-6 animate-fade-in-up">
          <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-4">新增检验</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm text-xuan-inkLight mb-1">批次号</label><input className="xuan-input" value={form.batchNo} onChange={(e) => u('batchNo', e.target.value)} /></div>
            <div><label className="block text-sm text-xuan-inkLight mb-1">拉力强度(N)</label><input className="xuan-input" type="number" step="0.1" value={form.tensileStrength} onChange={(e) => u('tensileStrength', +e.target.value)} /></div>
            <div><label className="block text-sm text-xuan-inkLight mb-1">厚度均匀度(%)</label><input className="xuan-input" type="number" value={form.thicknessUniformity} onChange={(e) => u('thicknessUniformity', +e.target.value)} /></div>
            <div><label className="block text-sm text-xuan-inkLight mb-1">透光率(%)</label><input className="xuan-input" type="number" value={form.lightTransmittance} onChange={(e) => u('lightTransmittance', +e.target.value)} /></div>
            <div><label className="block text-sm text-xuan-inkLight mb-1">吸墨性(%)</label><input className="xuan-input" type="number" value={form.inkAbsorption} onChange={(e) => u('inkAbsorption', +e.target.value)} /></div>
            <div><label className="block text-sm text-xuan-inkLight mb-1">等级</label><select className="xuan-select" value={form.grade} onChange={(e) => u('grade', e.target.value)}>{grades.map((g) => <option key={g}>{g}</option>)}</select></div>
            <div><label className="block text-sm text-xuan-inkLight mb-1">规格</label><select className="xuan-select" value={form.specification} onChange={(e) => u('specification', e.target.value)}>{specs.map((s) => <option key={s}>{s}</option>)}</select></div>
            <div><label className="block text-sm text-xuan-inkLight mb-1">检验结果</label><select className="xuan-select" value={form.result} onChange={(e) => u('result', e.target.value as InspectionRecord['result'])}><option>合格</option><option>不合格</option></select></div>
            <div><label className="block text-sm text-xuan-inkLight mb-1">检验员</label><input className="xuan-input" value={form.inspector} onChange={(e) => u('inspector', e.target.value)} /></div>
            <div><label className="block text-sm text-xuan-inkLight mb-1">检验日期</label><input className="xuan-input" type="date" value={form.date} onChange={(e) => u('date', e.target.value)} /></div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button className="xuan-btn-secondary" onClick={() => setShowForm(false)}>取消</button>
            <button className="xuan-btn-primary" onClick={handleSubmit}>确认提交</button>
          </div>
        </div>
      )}

      <div className="xuan-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="xuan-table w-full">
            <thead>
              <tr>
                <th>批次号</th><th>拉力强度</th><th>厚度均匀</th><th>透光率</th><th>吸墨性</th><th>等级</th><th>规格</th><th>结果</th><th>检验员</th><th>日期</th>
              </tr>
            </thead>
            <tbody>
              {inspections.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium text-xuan-ink">{r.batchNo}</td>
                  <td>{r.tensileStrength} N</td>
                  <td>{r.thicknessUniformity}%</td>
                  <td>{r.lightTransmittance}%</td>
                  <td>{r.inkAbsorption}%</td>
                  <td><span className={`xuan-badge ${gradeStyle[r.grade]}`}>{r.grade}</span></td>
                  <td>{r.specification}</td>
                  <td><span className={`xuan-badge ${resultStyle[r.result]}`}>{r.result}</span></td>
                  <td>{r.inspector}</td>
                  <td>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
