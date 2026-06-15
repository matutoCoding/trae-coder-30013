import { useState } from 'react';
import { ShoppingCart, Package, Truck, Plus, Clock, Gift } from 'lucide-react';
import { Order, OrderItem } from '@/data/mockData';
import { useStore } from '@/store/useStore';

const statusConfig: Record<Order['status'], { color: string; bg: string }> = {
  '待排产': { color: 'text-xuan-gold', bg: 'bg-xuan-gold/15' },
  '生产中': { color: 'text-xuan-ochre', bg: 'bg-xuan-ochre/15' },
  '已完成': { color: 'text-xuan-moss', bg: 'bg-xuan-moss/15' },
  '已发货': { color: 'text-xuan-indigo', bg: 'bg-xuan-indigo/15' },
};

const combos = [
  { name: '书画入门套装', price: 368, items: ['4尺棉料×50张', '毛笔1支', '墨1锭'], desc: '初学者首选' },
  { name: '名家精品套装', price: 1280, items: ['6尺净皮×30张', '湖笔1支', '徽墨1锭', '歙砚1方'], desc: '进阶创作之选' },
  { name: '大师典藏套装', price: 3680, items: ['丈二特皮×10张', '狼毫1支', '松烟墨1锭', '端砚1方'], desc: '传世珍藏' },
];

function getCountdown(deliveryDate: string) {
  const diff = new Date(deliveryDate).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
}

const emptyItem = (): OrderItem => ({ specification: '四尺', grade: '棉料', quantity: 100, unitPrice: 15 });

export default function Orders() {
  const { orders, addOrder, updateOrder } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    customer: '',
    deliveryDate: '',
    items: [emptyItem()],
    status: '待排产' as Order['status'],
  });

  const totalAmount = orders.reduce((s, o) => s + o.totalAmount, 0);
  const pendingCount = orders.filter(o => o.status === '待排产').length;
  const producingCount = orders.filter(o => o.status === '生产中').length;
  const shippedCount = orders.filter(o => o.status === '已发货').length;

  const summaryCards = [
    { label: '总订单额', value: `¥${totalAmount.toLocaleString()}`, icon: ShoppingCart, color: 'text-xuan-ochre', bg: 'bg-xuan-ochre/10', border: 'border-xuan-ochre/20' },
    { label: '待排产', value: pendingCount, unit: '单', icon: Clock, color: 'text-xuan-gold', bg: 'bg-xuan-gold/10', border: 'border-xuan-gold/20' },
    { label: '生产中', value: producingCount, unit: '单', icon: Package, color: 'text-xuan-ochre', bg: 'bg-xuan-ochre/10', border: 'border-xuan-ochre/20' },
    { label: '已发货', value: shippedCount, unit: '单', icon: Truck, color: 'text-xuan-indigo', bg: 'bg-xuan-indigo/10', border: 'border-xuan-indigo/20' },
  ];

  const handleSubmit = () => {
    if (!form.customer || !form.deliveryDate) return;
    const total = form.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const newOrder: Order = {
      id: `OD${Date.now()}`,
      orderNo: `DD-2026-${String(orders.length + 1).padStart(3, '0')}`,
      customer: form.customer,
      items: form.items,
      status: form.status,
      deliveryDate: form.deliveryDate,
      totalAmount: total,
      createDate: new Date().toISOString().slice(0, 10),
    };
    addOrder(newOrder);
    setForm({ customer: '', deliveryDate: '', items: [emptyItem()], status: '待排产' });
    setShowForm(false);
  };

  const updateItem = (idx: number, field: keyof OrderItem, val: string | number) => {
    const items = [...form.items];
    items[idx] = { ...items[idx], [field]: val };
    setForm(f => ({ ...f, items }));
  };

  return (
    <div className="p-6 space-y-6 ink-wash-bg min-h-screen">
      <div className="flex items-center gap-3 mb-2 animate-fade-in-up">
        <ShoppingCart className="w-5 h-5 text-xuan-ochre" />
        <h1 className="text-2xl font-serif font-bold text-xuan-ink">订单生产</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((s, i) => (
          <div key={s.label} className={`xuan-card-hover p-5 animate-fade-in-up border ${s.border}`} style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-xuan-inkLight font-sans">{s.label}</p>
                <p className={`text-3xl font-serif font-bold mt-1 ${s.color}`}>
                  {s.value}{'unit' in s && <span className="text-sm font-sans font-normal text-xuan-inkLight ml-1">{s.unit}</span>}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '320ms' }}>
        <h2 className="xuan-section-title">订单列表</h2>
        <button onClick={() => setShowForm(v => !v)} className="xuan-btn-primary flex items-center gap-1.5 text-sm">
          <Plus className="w-4 h-4" />新增订单
        </button>
      </div>

      {showForm && (
        <div className="xuan-card p-5 animate-fade-in-up space-y-4">
          <h3 className="font-serif font-semibold text-xuan-ink">新增订单</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input className="xuan-input" placeholder="客户名称" value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))} />
            <input className="xuan-input" type="date" value={form.deliveryDate} onChange={e => setForm(f => ({ ...f, deliveryDate: e.target.value }))} />
            <select className="xuan-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Order['status'] }))}>
              <option value="待排产">待排产</option>
              <option value="生产中">生产中</option>
            </select>
          </div>
          {form.items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
              <select className="xuan-select" value={item.specification} onChange={e => updateItem(idx, 'specification', e.target.value)}>
                {['四尺', '六尺', '八尺', '丈二'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="xuan-select" value={item.grade} onChange={e => updateItem(idx, 'grade', e.target.value)}>
                {['特皮', '净皮', '棉料'].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <input className="xuan-input" type="number" placeholder="数量" value={item.quantity} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))} />
              <input className="xuan-input" type="number" placeholder="单价" value={item.unitPrice} onChange={e => updateItem(idx, 'unitPrice', Number(e.target.value))} />
              <div className="flex gap-2">
                <span className="text-sm text-xuan-inkLight self-center">小计: ¥{item.quantity * item.unitPrice}</span>
                {form.items.length > 1 && (
                  <button onClick={() => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }))} className="text-xuan-cinnabar text-sm">删除</button>
                )}
              </div>
            </div>
          ))}
          <div className="flex gap-3">
            <button onClick={() => setForm(f => ({ ...f, items: [...f.items, emptyItem()] }))} className="xuan-btn-secondary text-sm">添加明细</button>
            <button onClick={handleSubmit} className="xuan-btn-primary text-sm">提交订单</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order, i) => {
          const cfg = statusConfig[order.status];
          const days = getCountdown(order.deliveryDate);
          const overdue = days < 0;
          return (
            <div key={order.id} className="xuan-card-hover p-5 animate-fade-in-up" style={{ animationDelay: `${(i + 4) * 60}ms` }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-serif font-bold text-xuan-ink">{order.orderNo}</span>
                    <span className={`xuan-badge ${cfg.bg} ${cfg.color}`}>{order.status}</span>
                    <span className={`text-xs ${overdue ? 'text-xuan-cinnabar font-semibold' : 'text-xuan-inkLight'}`}>
                      <Clock className="w-3 h-3 inline mr-1" />
                      {overdue ? `逾期${Math.abs(days)}天` : `${days}天后交货`}
                    </span>
                  </div>
                  <p className="text-sm text-xuan-inkLight mt-1">{order.customer} · 创建于 {order.createDate} · 交期 {order.deliveryDate}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {order.items.map((it, j) => (
                      <span key={j} className="text-xs bg-xuan-paperDark/40 px-2 py-1 rounded text-xuan-ink">
                        {it.specification}{it.grade} × {it.quantity}张 @ ¥{it.unitPrice}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-serif text-xl font-bold text-xuan-ochre">¥{order.totalAmount.toLocaleString()}</p>
                  {order.status === '待排产' && (
                    <button onClick={() => updateOrder(order.id, { status: '生产中' })} className="xuan-btn-primary text-xs">排产</button>
                  )}
                  {order.status === '生产中' && (
                    <button onClick={() => updateOrder(order.id, { status: '已完成' })} className="xuan-btn-primary text-xs">完成</button>
                  )}
                  {order.status === '已完成' && (
                    <button onClick={() => updateOrder(order.id, { status: '已发货' })} className="xuan-btn-primary text-xs">发货</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <Gift className="w-5 h-5 text-xuan-cinnabar" />
          <h2 className="xuan-section-title">文房四宝套装</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {combos.map((c, i) => (
            <div key={c.name} className="xuan-card-hover p-5 flex flex-col animate-fade-in-up" style={{ animationDelay: `${(i + 8) * 80}ms` }}>
              <h3 className="font-serif text-lg font-bold text-xuan-ink">{c.name}</h3>
              <p className="text-xs text-xuan-inkLight mt-1">{c.desc}</p>
              <ul className="mt-3 space-y-1.5 flex-1">
                {c.items.map(it => (
                  <li key={it} className="text-sm text-xuan-ink flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-xuan-ochre/60" />{it}
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-3 border-t border-xuan-paperDark/40 flex items-center justify-between">
                <span className="font-serif text-xl font-bold text-xuan-cinnabar">¥{c.price}</span>
                <button className="xuan-btn-primary text-xs">立即下单</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
