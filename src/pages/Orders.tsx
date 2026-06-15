import { useState } from 'react';
import { ShoppingCart, Package, Truck, Plus, Clock, Gift, ChevronRight } from 'lucide-react';
import { Order, OrderItem } from '@/data/mockData';
import { useStore } from '@/store/useStore';

const statusBadge: Record<Order['status'], string> = {
  '待排产': 'bg-xuan-gold/20 text-xuan-gold border-xuan-gold/30',
  '生产中': 'bg-xuan-ochre/20 text-xuan-ochre border-xuan-ochre/30',
  '已完成': 'bg-xuan-moss/20 text-xuan-moss border-xuan-moss/30',
  '已发货': 'bg-xuan-indigo/20 text-xuan-indigo border-xuan-indigo/30',
};

const statusFlow: Order['status'][] = ['待排产', '生产中', '已完成', '已发货'];

const combos = [
  {
    id: 'combo1',
    name: '书画入门套装',
    price: 368,
    desc: '适合初学者练习使用',
    items: [
      { spec: '四尺', grade: '棉料', qty: 100, price: 15 },
      { name: '兼毫毛笔', qty: 2, price: 48 },
      { name: '练习墨汁', qty: 2, price: 32 },
    ],
    badge: '入门之选',
    badgeColor: 'bg-xuan-indigo/20 text-xuan-indigo',
  },
  {
    id: 'combo2',
    name: '名家精品套装',
    price: 1280,
    desc: '专业书画家常用款',
    items: [
      { spec: '六尺', grade: '净皮', qty: 50, price: 45 },
      { name: '湖笔精选', qty: 4, price: 128 },
      { name: '徽墨二两', qty: 2, price: 168 },
      { name: '歙砚一方', qty: 1, price: 280 },
    ],
    badge: '畅销爆款',
    badgeColor: 'bg-xuan-ochre/20 text-xuan-ochre',
  },
  {
    id: 'combo3',
    name: '大师典藏套装',
    price: 3680,
    desc: '收藏级品质礼盒装',
    items: [
      { spec: '丈二', grade: '特皮', qty: 20, price: 180 },
      { name: '精品狼毫', qty: 4, price: 380 },
      { name: '松烟墨条', qty: 4, price: 280 },
      { name: '端砚精品', qty: 1, price: 1200 },
    ],
    badge: '典藏臻品',
    badgeColor: 'bg-xuan-gold/20 text-xuan-gold',
  },
];

const emptyItem: OrderItem = {
  specification: '四尺',
  grade: '净皮',
  quantity: 0,
  unitPrice: 25,
};

export default function Orders() {
  const { orders, addOrder, updateOrder } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [formCustomer, setFormCustomer] = useState('');
  const [formDelivery, setFormDelivery] = useState('');
  const [formStatus, setFormStatus] = useState<Order['status']>('待排产');
  const [formItems, setFormItems] = useState<OrderItem[]>([{ ...emptyItem }]);

  const totalAmount = orders.reduce((s, o) => s + o.totalAmount, 0);
  const pending = orders.filter((o) => o.status === '待排产').length;
  const producing = orders.filter((o) => o.status === '生产中').length;
  const shipped = orders.filter((o) => o.status === '已发货').length;

  const itemsTotal = formItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);

  const addItem = () => setFormItems((prev) => [...prev, { ...emptyItem }]);
  const removeItem = (idx: number) => setFormItems((prev) => prev.filter((_, i) => i !== idx));
  const updateItem = (idx: number, key: keyof OrderItem, val: string | number) => {
    setFormItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [key]: val } : it)));
  };

  const handleSubmit = () => {
    if (!formCustomer || !formDelivery || formItems.some((i) => !i.quantity)) return;
    const total = formItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    addOrder({
      id: `OD${Date.now()}`,
      orderNo: `DD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
      customer: formCustomer,
      items: formItems,
      status: formStatus,
      deliveryDate: formDelivery,
      totalAmount: total,
      createDate: new Date().toISOString().slice(0, 10),
    });
    setFormCustomer('');
    setFormDelivery('');
    setFormStatus('待排产');
    setFormItems([{ ...emptyItem }]);
    setShowForm(false);
  };

  const handleNextStatus = (id: string, current: Order['status']) => {
    const nextIdx = statusFlow.indexOf(current) + 1;
    if (nextIdx < statusFlow.length) {
      updateOrder(id, { status: statusFlow[nextIdx] });
    }
  };

  const daysRemaining = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const orderFromCombo = (combo: typeof combos[0]) => {
    const paperItems = combo.items.filter((i: any) => i.spec);
    const total = combo.items.reduce((s: number, i: any) => s + (i.qty || i.quantity) * (i.price || i.unitPrice), 0);
    const order: Order = {
      id: `OD${Date.now()}`,
      orderNo: `DD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
      customer: `${combo.name} - 散客`,
      items: paperItems.map((i: any) => ({
        specification: i.spec,
        grade: i.grade,
        quantity: i.qty,
        unitPrice: i.price,
      })),
      status: '待排产',
      deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      totalAmount: total,
      createDate: new Date().toISOString().slice(0, 10),
    };
    addOrder(order);
    setShowForm(true);
    setFormCustomer(order.customer);
    setFormDelivery(order.deliveryDate);
    setFormItems(order.items);
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <h2 className="xuan-section-title font-serif">订单生产</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-ochre/15 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-xuan-ochre" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">总订单额</p>
            <p className="text-xl font-bold text-xuan-ink">¥{totalAmount.toLocaleString()}</p>
          </div>
        </div>
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-gold/15 flex items-center justify-center">
            <Clock className="w-6 h-6 text-xuan-gold" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">待排产</p>
            <p className="text-2xl font-bold text-xuan-ink">{pending}</p>
          </div>
        </div>
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-moss/15 flex items-center justify-center">
            <Package className="w-6 h-6 text-xuan-moss" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">生产中</p>
            <p className="text-2xl font-bold text-xuan-ink">{producing}</p>
          </div>
        </div>
        <div className="xuan-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-xuan-indigo/15 flex items-center justify-center">
            <Truck className="w-6 h-6 text-xuan-indigo" />
          </div>
          <div>
            <p className="text-sm text-xuan-inkLight">已发货</p>
            <p className="text-2xl font-bold text-xuan-ink">{shipped}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-xuan-ink">订单列表</h3>
          <button className="xuan-btn-primary flex items-center gap-2 text-sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4" />
            新增订单
          </button>
        </div>

        {showForm && (
          <div className="xuan-card p-5 animate-fade-in-up">
            <h3 className="font-serif text-lg font-semibold text-xuan-ink mb-4">新增订单</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-xuan-inkLight mb-1">客户名称</label>
                <input className="xuan-input w-full" value={formCustomer} onChange={(e) => setFormCustomer(e.target.value)} placeholder="如：北京荣宝斋" />
              </div>
              <div>
                <label className="block text-sm text-xuan-inkLight mb-1">交货日期</label>
                <input className="xuan-input w-full" type="date" value={formDelivery} onChange={(e) => setFormDelivery(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-xuan-inkLight mb-1">状态</label>
                <select
                  className="xuan-select w-full"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as Order['status'])}
                >
                  <option value="待排产">待排产</option>
                  <option value="生产中">生产中</option>
                  <option value="已完成">已完成</option>
                  <option value="已发货">已发货</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-xuan-inkLight">订单项</label>
                <button className="text-xs text-xuan-ochre hover:underline" onClick={addItem}>+ 添加项</button>
              </div>
              {formItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-3">
                    <select
                      className="xuan-select w-full text-sm"
                      value={item.specification}
                      onChange={(e) => updateItem(idx, 'specification', e.target.value)}
                    >
                      <option value="四尺">四尺</option>
                      <option value="六尺">六尺</option>
                      <option value="八尺">八尺</option>
                      <option value="丈二">丈二</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <select
                      className="xuan-select w-full text-sm"
                      value={item.grade}
                      onChange={(e) => updateItem(idx, 'grade', e.target.value)}
                    >
                      <option value="特皮">特皮</option>
                      <option value="净皮">净皮</option>
                      <option value="棉料">棉料</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input className="xuan-input w-full text-sm" type="number" placeholder="数量" value={item.quantity || ''} onChange={(e) => updateItem(idx, 'quantity', +e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <input className="xuan-input w-full text-sm" type="number" placeholder="单价" value={item.unitPrice || ''} onChange={(e) => updateItem(idx, 'unitPrice', +e.target.value)} />
                  </div>
                  <div className="col-span-2 text-sm text-xuan-ink text-right font-medium">
                    ¥{(item.quantity * item.unitPrice).toLocaleString()}
                  </div>
                  <div className="col-span-1">
                    {formItems.length > 1 && (
                      <button
                        className="w-full py-2 text-xs text-xuan-cinnabar hover:bg-xuan-cinnabar/10 rounded-lg transition"
                        onClick={() => removeItem(idx)}
                      >
                        删除
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-xuan-paperDark/40">
              <span className="text-sm text-xuan-inkLight">
                共 {formItems.reduce((s, i) => s + i.quantity, 0)} 张
              </span>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-xuan-ochre">¥{itemsTotal.toLocaleString()}</span>
                <button className="px-4 py-2 rounded-lg border border-xuan-paperDark text-xuan-inkLight hover:bg-xuan-paperDark/30 transition" onClick={() => setShowForm(false)}>取消</button>
                <button className="xuan-btn-primary" onClick={handleSubmit}>确认提交</button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {orders.map((order) => {
            const days = daysRemaining(order.deliveryDate);
            const isOverdue = days < 0 && order.status !== '已发货';
            return (
              <div key={order.id} className="xuan-card-hover p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-serif font-semibold text-xuan-ink text-lg">{order.orderNo}</span>
                      <span className={`xuan-badge border ${statusBadge[order.status]}`}>{order.status}</span>
                    </div>
                    <p className="text-sm text-xuan-inkLight">{order.customer} · {order.createDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-xuan-ochre">¥{order.totalAmount.toLocaleString()}</p>
                    <p className={`text-xs ${isOverdue ? 'text-xuan-cinnabar' : 'text-xuan-inkLight'}`}>
                      {order.status === '已发货' ? '已发货' : `距交货 ${days} 天`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {order.items.map((item, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-md bg-xuan-paperDark/30 text-xs text-xuan-inkLight">
                      {item.specification} {item.grade} × {item.quantity}张
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-xuan-paperDark/30">
                  <span className="text-xs text-xuan-inkLight">
                    交货日期：{order.deliveryDate}
                  </span>
                  {order.status !== '已发货' && (
                    <button
                      className="text-xs px-3 py-1.5 rounded-md bg-xuan-ochre/10 text-xuan-ochre hover:bg-xuan-ochre/20 transition font-medium"
                      onClick={() => handleNextStatus(order.id, order.status)}
                    >
                      {statusFlow[statusFlow.indexOf(order.status) + 1] || '已完成'} →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-serif text-lg font-semibold text-xuan-ink flex items-center gap-2">
          <Gift className="w-5 h-5 text-xuan-gold" />
          文房四宝套装
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {combos.map((combo) => (
            <div key={combo.id} className="xuan-card-hover p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-serif font-semibold text-xuan-ink text-lg">{combo.name}</h4>
                <span className={`xuan-badge text-xs ${combo.badgeColor}`}>{combo.badge}</span>
              </div>
              <p className="text-sm text-xuan-inkLight mb-4">{combo.desc}</p>
              <div className="flex-1 space-y-1.5 mb-4">
                {combo.items.map((item: any, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-xuan-inkLight">
                      {item.spec || item.name}
                      {item.grade && ` · ${item.grade}`}
                    </span>
                    <span className="text-xuan-ink">×{(item.qty || item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-xuan-paperDark/30 flex items-center justify-between">
                <p className="text-xl font-bold text-xuan-ochre">¥{combo.price.toLocaleString()}</p>
                <button
                  className="xuan-btn-secondary text-xs px-3 py-1.5"
                  onClick={() => orderFromCombo(combo)}
                >
                  立即下单
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
