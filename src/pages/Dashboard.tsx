import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import { ScrollText, Layers, Package, ClipboardList, Flame, Droplets, Wind, CheckSquare, Activity } from 'lucide-react';
import { monthlyProduction, dailyOutput } from '@/data/mockData';
import { useStore } from '@/store/useStore';
import { useBatchDrawer } from '@/contexts/BatchDrawerContext';

export default function Dashboard() {
  const { pulpingBatches, liftingRecords, dryingRecords, inspections, materials, orders } = useStore();
  const { openBatch } = useBatchDrawer();

  const totalStock = materials.reduce((s, m) => s + m.stock, 0);
  const activeBatches = pulpingBatches.filter(b => b.status === '制浆中').length;
  const pendingOrders = orders.filter(o => o.status === '待排产' || o.status === '生产中').length;
  const todaySheets = liftingRecords
    .filter(r => r.date === new Date().toISOString().slice(0, 10))
    .reduce((s, r) => s + r.sheetCount, 0);

  const stats = [
    { label: '今日产量', value: todaySheets || 325, unit: '张', icon: ScrollText, color: 'text-xuan-ochre', bg: 'bg-xuan-ochre/10', border: 'border-xuan-ochre/20' },
    { label: '在制批次', value: activeBatches, unit: '批', icon: Layers, color: 'text-xuan-indigo', bg: 'bg-xuan-indigo/10', border: 'border-xuan-indigo/20' },
    { label: '原料库存', value: totalStock.toLocaleString(), unit: 'kg', icon: Package, color: 'text-xuan-moss', bg: 'bg-xuan-moss/10', border: 'border-xuan-moss/20' },
    { label: '待交订单', value: pendingOrders, unit: '单', icon: ClipboardList, color: 'text-xuan-cinnabar', bg: 'bg-xuan-cinnabar/10', border: 'border-xuan-cinnabar/20' },
  ];

  const stages = [
    { name: '燎草制浆', icon: Flame, active: activeBatches, total: pulpingBatches.length, color: 'text-xuan-ochre', bg: 'bg-xuan-ochre/10' },
    { name: '捞纸成型', icon: Droplets, active: liftingRecords.filter(r => r.date === new Date().toISOString().slice(0, 10)).length, total: 6, color: 'text-xuan-indigo', bg: 'bg-xuan-indigo/10' },
    { name: '晒纸焙干', icon: Wind, active: dryingRecords.filter(r => r.endDate === new Date().toISOString().slice(0, 10)).length, total: 4, color: 'text-xuan-gold', bg: 'bg-xuan-gold/10' },
    { name: '检验分级', icon: CheckSquare, active: inspections.filter(r => r.date === new Date().toISOString().slice(0, 10)).length, total: inspections.length, color: 'text-xuan-moss', bg: 'bg-xuan-moss/10' },
  ];

  const timeline = [
    ...pulpingBatches.filter(b => b.status === '制浆中').map(b => ({ time: b.startDate, text: `制浆批次 ${b.batchNo} 正在蒸煮`, tag: '制浆', tagColor: 'bg-xuan-ochre/15 text-xuan-ochre', batchNo: b.batchNo })),
    ...liftingRecords.slice(0, 3).map(r => ({ time: r.date, text: `${r.operator} 使用 ${r.screenNo} 捞纸 ${r.sheetCount} 张`, tag: '捞纸', tagColor: 'bg-xuan-indigo/15 text-xuan-indigo', batchNo: r.pulpingBatchNo })),
    ...dryingRecords.slice(0, 3).map(r => ({ time: r.startDate, text: `${r.wallNo} 焙干批次 ${r.batchNo}，含水率 ${r.moistureAfter}%`, tag: '焙干', tagColor: 'bg-xuan-gold/15 text-xuan-gold', batchNo: r.batchNo })),
    ...inspections.slice(0, 3).map(r => ({ time: r.date, text: `${r.batchNo} 检验结果：${r.grade}/${r.specification} ${r.result}`, tag: '检验', tagColor: 'bg-xuan-moss/15 text-xuan-moss', batchNo: r.batchNo })),
  ].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 6);

  return (
    <div className="p-6 space-y-6 ink-wash-bg min-h-screen">
      <div className="flex items-center gap-3 mb-2 animate-fade-in-up">
        <Activity className="w-5 h-5 text-xuan-ochre" />
        <h1 className="text-2xl font-serif font-bold text-xuan-ink">生产总览</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`xuan-card-hover p-5 animate-fade-in-up border ${s.border}`} style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-xuan-inkLight font-sans">{s.label}</p>
                <p className={`text-3xl font-serif font-bold mt-1 ${s.color}`}>
                  {s.value}<span className="text-sm font-sans font-normal text-xuan-inkLight ml-1">{s.unit}</span>
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="xuan-card p-5 animate-fade-in-up" style={{ animationDelay: '320ms' }}>
          <h2 className="xuan-section-title mb-4">月度产量构成</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyProduction} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D0" />
              <XAxis dataKey="month" tick={{ fill: '#5A5A5A', fontSize: 13 }} axisLine={{ stroke: '#E8E0D0' }} />
              <YAxis tick={{ fill: '#5A5A5A', fontSize: 12 }} axisLine={{ stroke: '#E8E0D0' }} />
              <Tooltip
                contentStyle={{ background: '#FAF7F0', border: '1px solid #E8E0D0', borderRadius: 8, fontFamily: 'Noto Sans SC' }}
                labelStyle={{ color: '#2C2C2C', fontFamily: 'Noto Serif SC' }}
              />
              <Bar dataKey="bark" name="青檀皮" fill="#8B4513" radius={[4, 4, 0, 0]} />
              <Bar dataKey="straw" name="稻草" fill="#C9A84C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="xuan-card p-5 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <h2 className="xuan-section-title mb-4">日产量趋势</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={dailyOutput}>
              <defs>
                <linearGradient id="sheetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A6FA5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4A6FA5" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D0" />
              <XAxis dataKey="day" tick={{ fill: '#5A5A5A', fontSize: 13 }} axisLine={{ stroke: '#E8E0D0' }} />
              <YAxis tick={{ fill: '#5A5A5A', fontSize: 12 }} axisLine={{ stroke: '#E8E0D0' }} />
              <Tooltip
                contentStyle={{ background: '#FAF7F0', border: '1px solid #E8E0D0', borderRadius: 8, fontFamily: 'Noto Sans SC' }}
                labelStyle={{ color: '#2C2C2C', fontFamily: 'Noto Serif SC' }}
              />
              <Area type="monotone" dataKey="sheets" name="产量(张)" stroke="#4A6FA5" fill="url(#sheetGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="xuan-card p-5 animate-fade-in-up" style={{ animationDelay: '480ms' }}>
          <h2 className="xuan-section-title mb-4">生产动态</h2>
          <div className="space-y-3">
            {timeline.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 animate-slide-in cursor-pointer hover:bg-xuan-paperDark/30 -mx-2 px-2 py-1.5 rounded-lg transition-colors"
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => item.batchNo && openBatch(item.batchNo)}
              >
                <div className="w-2 h-2 rounded-full bg-xuan-ochre mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-xuan-ink leading-relaxed">{item.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`xuan-badge ${item.tagColor}`}>{item.tag}</span>
                    <span className="text-xs text-xuan-inkLight">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="xuan-card p-5 animate-fade-in-up" style={{ animationDelay: '560ms' }}>
          <h2 className="xuan-section-title mb-4">工序速览</h2>
          <div className="grid grid-cols-2 gap-4">
            {stages.map((s) => (
              <div key={s.name} className="xuan-card-hover p-4 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <span className="font-serif text-sm font-semibold text-xuan-ink">{s.name}</span>
                <div className="w-full bg-xuan-paperDark/30 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-xuan-ochre/70 transition-all duration-700"
                    style={{ width: `${(s.active / s.total) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-xuan-inkLight">{s.active}/{s.total} 运行中</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
