import { useState, useMemo } from 'react';
import { ShoppingCart, Package, Truck, Plus, Clock, Gift, ChevronRight, AlertTriangle, X, PackageCheck, Warehouse, AlertCircle } from 'lucide-react';
import { Order, OrderItem } from '@/data/mockData';
import { useStore } from '@/store/useStore';
import { useBatchDrawer } from '@/contexts/BatchDrawerContext';

interface BundleExtra {
  name: string;
  quantity: number;
  unitPrice: number;
}

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
    paperItems: [
      { specification: '四尺', grade: '棉料', quantity: 100, unitPrice: 15 },
    ],
    extras: [
      { name: '兼毫毛笔', quantity: 2, unitPrice: 48 },
      { name: '练习墨汁', quantity: 2, unitPrice: 32 },
    ],
    badge: '入门之选',
    badgeColor: 'bg-xuan-indigo/20 text-xuan-indigo',
  },
  {
    id: 'combo2',
    name: '名家精品套装',
    price: 1280,
    desc: '专业书画家常用款',
    paperItems: [
      { specification: '六尺', grade: '净皮', quantity: 50, unitPrice: 45 },
    ],
    extras: [
      { name: '湖笔精选', quantity: 4, unitPrice: 128 },
      { name: '徽墨二两', quantity: 2, unitPrice: 168 },
      { name: '歙砚一方', quantity: 1, unitPrice: 280 },
    ],
    badge: '畅销爆款',
    badgeColor: 'bg-xuan-ochre/20 text-xuan-ochre',
  },
  {
    id: 'combo3',
    name: '大师典藏套装',
    price: 3680,
    desc: '收藏级品质礼盒装',
    paperItems: [
      { specification: '丈二', grade: '特皮', quantity: 20, unitPrice: 180 },
    ],
    extras: [
      { name: '精品狼毫', quantity: 4, unitPrice: 380 },
      { name: '松烟墨条', quantity: 4, unitPrice: 280 },
      { name: '端砚精品', quantity: 1, unitPrice: 1200 },
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
  batchNo: undefined,
};

export default function Orders() {
  const { orders, addOrder, updateOrder, shipOrder, finishedStocks, getAvailableStock } = useStore();
  const { openBatch } = useBatchDrawer();
  const [showForm, setShowForm] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [formCustomer, setFormCustomer] = useState('');
  const [formDelivery, setFormDelivery] = useState('');
  const [formStatus, setFormStatus] = useState<Order['status']>('待排产');
  const [formItems, setFormItems] = useState<OrderItem[]>([{ ...emptyItem }]);
  const [formExtras, setFormExtras] = useState<BundleExtra[]>([]);
  const [formIsBundle, setFormIsBundle] = useState(false);
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; msg: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'stock'>('orders');

  const totalAmount = orders.reduce((s, o) => s + o.totalAmount, 0);
  const pending = orders.filter((o) => o.status === '待排产').length;
  const producing = orders.filter((o) => o.status === '生产中').length;
  const shipped = orders.filter((o) => o.status === '已发货').length;

  const paperTotal = formItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const extrasTotal = formExtras.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const itemsTotal = paperTotal + extrasTotal;

  const stockStats = useMemo(() => {
    const totalQty = finishedStocks.reduce((s, f) => s + f.quantity, 0);
    const lowStock = finishedStocks.filter((f) => f.quantity < 100).length;
    const skuCount = finishedStocks.filter((f) => f.quantity > 0).length;
    return { totalQty, lowStock, skuCount };
  }, [finishedStocks]);

  const addItem = () => setFormItems((prev) => [...prev, { ...emptyItem }]);
  const removeItem = (idx: number) => setFormItems((prev) => prev.filter((_, i) => i !== idx));
  const updateItem = (idx: number, key: keyof OrderItem, val: string | number | undefined) => {
    setFormItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [key]: val } : it)));
  };

  const addExtra = () => setFormExtras((prev) => [...prev, { name: '', quantity: 1, unitPrice: 0 }]);
  const removeExtra = (idx: number) => setFormExtras((prev) => prev.filter((_, i) => i !== idx));
  const updateExtra = (idx: number, key: keyof BundleExtra, val: string | number) => {
    setFormExtras((prev) => prev.map((it, i) => (i === idx ? { ...it, [key]: val } : it)));
  };

  const resetForm = () => {
    setEditingOrderId(null);
    setFormCustomer('');
    setFormDelivery('');
    setFormStatus('待排产');
    setFormItems([{ ...emptyItem }]);
    setFormExtras([]);
    setFormIsBundle(false);
  };

  const handleSubmit = () => {
    if (!formCustomer || !formDelivery || formItems.some((i) => !i.quantity)) {
      setNotice({ type: 'error', msg: '请填写完整的订单信息（客户、交货日期、数量）' });
      setTimeout(() => setNotice(null), 3000);
      return;
    }
    const total = itemsTotal;

    if (editingOrderId) {
      updateOrder(editingOrderId, {
        customer: formCustomer,
        deliveryDate: formDelivery,
        status: formStatus,
        items: formItems,
        totalAmount: total,
        isBundle: formIsBundle,
      });
      setNotice({ type: 'success', msg: '订单已更新' });
    } else {
      addOrder({
        id: `OD${Date.now()}`,
        orderNo: `DD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
        customer: formCustomer,
        items: formItems,
        status: formStatus,
        deliveryDate: formDelivery,
        totalAmount: total,
        createDate: new Date().toISOString().slice(0, 10),
        isBundle: formIsBundle,
      });
      setNotice({ type: 'success', msg: '订单创建成功' });
    }

    setTimeout(() => setNotice(null), 2500);
    resetForm();
    setShowForm(false);
  };

  const handleNextStatus = (id: string, current: Order['status']) => {
    const nextIdx = statusFlow.indexOf(current) + 1;
    if (nextIdx < statusFlow.length) {
      const nextStatus = statusFlow[nextIdx];
      if (nextStatus === '已发货') {
        const r = shipOrder(id);
        if (!r.ok) {
          setNotice({ type: 'error', msg: r.msg || '发货失败' });
          setTimeout(() => setNotice(null), 3500);
          return;
        }
        setNotice({ type: 'success', msg: '已发货！库存已扣减，销售记录已自动生成' });
      } else {
        updateOrder(id, { status: nextStatus });
      }
      setTimeout(() => setNotice(null), 2500);
    }
  };

  const editOrder = (order: Order) => {
    setEditingOrderId(order.id);
    setFormCustomer(order.customer);
    setFormDelivery(order.deliveryDate);
    setFormStatus(order.status);
    setFormItems(order.items.map((i) => ({ ...i })));
    setFormIsBundle(!!order.isBundle);
    setFormExtras([]);
    setShowForm(true);
  };

  const daysRemaining = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const quickBundleOrder = (combo: typeof combos[0], confirmFirst: boolean) => {
    const extrasTotal = combo.extras.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const paperTotal = combo.paperItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const total = paperTotal + extrasTotal;

    if (!confirmFirst) {
      addOrder({
        id: `OD${Date.now()}`,
        orderNo: `DD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
        customer: `${combo.name} - 散客`,
        items: combo.paperItems.map((i) => ({ ...i })),
        status: '待排产',
        deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        totalAmount: total,
        createDate: new Date().toISOString().slice(0, 10),
        isBundle: true,
      });
      setNotice({ type: 'success', msg: `${combo.name} 订单已直接生成` });
      setTimeout(() => setNotice(null), 2500);
      return;
    }

    resetForm();
    setFormCustomer(`${combo.name} - 散客`);
    setFormDelivery(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
    setFormItems(combo.paperItems.map((i) => ({ ...i })));
    setFormExtras(combo.extras.map((e) => ({ ...e })));
    setFormIsBundle(true);
    setShowForm(true);
  };

  const BatchSelectForItem = ({ item, idx }: { item: OrderItem; idx: number }) => {
    const available = getAvailableStock(item.specification, item.grade);
    return (
      <select
        className="xuan-select w-full text-sm"
        value={item.batchNo || ''}
        onChange={(e) => updateItem(idx, 'batchNo', e.target.value || undefined)}
      >
        <option value="">未指定批次</option>
        {available.batches.length === 0 && (
          <option value="" disabled>（无可用库存）</option>
        )}
        {available.batches.map((b) => (
          <option key={b.id} value={b.batchNo}>
            {b.batchNo} · 库存 {b.quantity} 张
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="xuan-section-title font-serif">订单生产</h2>
        <div className="flex items-center gap-1 p-1 bg-xuan-paperDark/30 rounded-lg">
          <button
            className={`px-4 py-1.5 rounded-md text-sm transition ${activeTab === 'orders' ? 'bg-xuan-paperLight text-xuan-ink shadow' : 'text-xuan-inkLight'}`}
            onClick={() => setActiveTab('orders')}
          >
            订单管理
          </button>
          <button
            className={`px-4 py-1.5 rounded-md text-sm transition ${activeTab === 'stock' ? 'bg-xuan-paperLight text-xuan-ink shadow' : 'text-xuan-inkLight'}`}
            onClick={() => setActiveTab('stock')}
          >
            <span className="flex items-center gap-1.5"><Warehouse className="w-4 h-4" />成品库存</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className={`flex items-center gap-2 p-3 rounded-lg xuan-card text-sm animate-fade-in ${
          notice.type === 'error' ? 'text-xuan-cinnabar border border-xuan-cinnabar/30 bg-xuan-cinnabar/5' : 'text-xuan-moss border border-xuan-moss/30 bg-xuan-moss/5'
        }`}>
          {notice.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <PackageCheck className="w-4 h-4 shrink-0" />}
          {notice.msg}
          <button onClick={() => setNotice(null)} className="ml-auto"><X className="w-4 h-4 opacity-60" /></button>
        </div>
      )}

      {activeTab === 'stock' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="xuan-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-xuan-moss/15 flex items-center justify-center">
                <Package className="w-6 h-6 text-xuan-moss" />
              </div>
              <div>
                <p className="text-sm text-xuan-inkLight">总库存</p>
                <p className="text-2xl font-bold text-xuan-ink">{stockStats.totalQty.toLocaleString()} 张</p>
              </div>
            </div>
            <div className="xuan-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-xuan-indigo/15 flex items-center justify-center">
                <Warehouse className="w-6 h-6 text-xuan-indigo" />
              </div>
              <div>
                <p className="text-sm text-xuan-inkLight">在售 SKU</p>
                <p className="text-2xl font-bold text-xuan-ink">{stockStats.skuCount}</p>
              </div>
            </div>
            <div className="xuan-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-xuan-cinnabar/15 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-xuan-cinnabar" />
              </div>
              <div>
                <p className="text-sm text-xuan-inkLight">低库存预警</p>
                <p className="text-2xl font-bold text-xuan-cinnabar">{stockStats.lowStock}</p>
              </div>
            </div>
          </div>

          <div className="xuan-card overflow-hidden">
            <div className="p-4 border-b border-xuan-paperDark/40 flex items-center justify-between">
              <h3 className="font-serif font-semibold text-xuan-ink">成品库存台账</h3>
              <span className="text-xs text-xuan-inkLight">检验合格后自动入库，发货后自动扣减</span>
            </div>
            <table className="xuan-table text-sm">
              <thead>
                <tr>
                  <th>批次号</th>
                  <th>规格</th>
                  <th>等级</th>
                  <th>当前库存</th>
                  <th>单位</th>
                  <th>入库日期</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                {finishedStocks.length === 0 && (
                  <tr><td colSpan={7} className="text-center text-xuan-inkLight py-8">暂无库存数据</td></tr>
                )}
                {finishedStocks.map((fs) => (
                  <tr key={fs.id} className="hover:bg-xuan-paperDark/15">
                    <td className="font-mono text-xuan-ochre cursor-pointer hover:underline" onClick={() => openBatch(fs.batchNo)}>
                      {fs.batchNo}
                    </td>
                    <td>{fs.specification}</td>
                    <td>
                      <span className={`xuan-badge text-xs ${
                        fs.grade === '特皮' ? 'bg-xuan-gold/20 text-xuan-gold border border-xuan-gold/40' :
                        fs.grade === '净皮' ? 'bg-xuan-indigo/20 text-xuan-indigo border border-xuan-indigo/30' :
                        'bg-xuan-bronze/20 text-xuan-bronze border border-xuan-bronze/30'
                      }`}>{fs.grade}</span>
                    </td>
                    <td className={`font-semibold ${fs.quantity < 100 ? 'text-xuan-cinnabar' : fs.quantity < 300 ? 'text-xuan-gold' : 'text-xuan-moss'}`}>
                      {fs.quantity}
                    </td>
                    <td>{fs.unit}</td>
                    <td className="text-xs text-xuan-inkLight">{fs.warehouseDate}</td>
                    <td className="text-xs text-xuan-inkLight">{fs.remark || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
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
              <button className="xuan-btn-primary flex items-center gap-2 text-sm" onClick={() => { resetForm(); setShowForm(!showForm); }}>
                <Plus className="w-4 h-4" />
                新增订单
              </button>
            </div>

            {showForm && (
              <div className="xuan-card p-5 animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-semibold text-xuan-ink">
                    {editingOrderId ? '编辑订单' : '新增订单'}
                    {formIsBundle && <span className="xuan-badge text-xs ml-2 bg-xuan-gold/20 text-xuan-gold border border-xuan-gold/40">文房套装</span>}
                  </h3>
                  <button onClick={() => { setShowForm(false); resetForm(); }} className="text-xuan-inkLight hover:text-xuan-ink">
                    <X className="w-5 h-5" />
                  </button>
                </div>
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
                    <select className="xuan-select w-full" value={formStatus} onChange={(e) => setFormStatus(e.target.value as Order['status'])}>
                      <option value="待排产">待排产</option>
                      <option value="生产中">生产中</option>
                      <option value="已完成">已完成</option>
                      <option value="已发货">已发货</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-xuan-inkLight">宣纸产品明细（需选择规格/等级/批次）</label>
                    <button className="text-xs text-xuan-ochre hover:underline" onClick={addItem}>+ 添加纸类</button>
                  </div>
                  {formItems.map((item, idx) => {
                    const avail = getAvailableStock(item.specification, item.grade);
                    const hasShortage = item.batchNo && item.quantity > (avail.batches.find(b => b.batchNo === item.batchNo)?.quantity ?? 0);
                    return (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-2">
                          <select className="xuan-select w-full text-sm" value={item.specification} onChange={(e) => updateItem(idx, 'specification', e.target.value)}>
                            <option value="四尺">四尺</option>
                            <option value="六尺">六尺</option>
                            <option value="八尺">八尺</option>
                            <option value="丈二">丈二</option>
                          </select>
                        </div>
                        <div className="col-span-1">
                          <select className="xuan-select w-full text-sm" value={item.grade} onChange={(e) => updateItem(idx, 'grade', e.target.value)}>
                            <option value="特皮">特皮</option>
                            <option value="净皮">净皮</option>
                            <option value="棉料">棉料</option>
                          </select>
                        </div>
                        <div className="col-span-3">
                          <label className="text-[10px] text-xuan-inkLight block mb-0.5">选择批次（可用 {avail.total} 张）</label>
                          <BatchSelectForItem item={item} idx={idx} />
                        </div>
                        <div className="col-span-1">
                          <input className={`xuan-input w-full text-sm ${hasShortage ? 'border-xuan-cinnabar' : ''}`} type="number" placeholder="数量" value={item.quantity || ''} onChange={(e) => updateItem(idx, 'quantity', +e.target.value)} />
                        </div>
                        <div className="col-span-1">
                          <input className="xuan-input w-full text-sm" type="number" placeholder="单价" value={item.unitPrice || ''} onChange={(e) => updateItem(idx, 'unitPrice', +e.target.value)} />
                        </div>
                        <div className="col-span-3 text-sm text-xuan-ink text-right font-medium">
                          {hasShortage && <span className="block text-xuan-cinnabar text-[10px]">超库存</span>}
                          ¥{(item.quantity * item.unitPrice).toLocaleString()}
                        </div>
                        <div className="col-span-1">
                          {formItems.length > 1 && (
                            <button className="w-full py-2 text-xs text-xuan-cinnabar hover:bg-xuan-cinnabar/10 rounded-lg transition" onClick={() => removeItem(idx)}>删除</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {(formIsBundle || formExtras.length > 0) && (
                  <div className="space-y-2 mb-4 p-3 rounded-lg bg-xuan-gold/5 border border-xuan-gold/20">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-xuan-inkLight flex items-center gap-1"><Gift className="w-3.5 h-3.5" />文房配件（笔、墨、砚等，不计入库存和批次）</label>
                      <div className="flex items-center gap-2">
                        {!formIsBundle && (
                          <button className="text-xs text-xuan-inkLight hover:text-xuan-ink" onClick={() => setFormExtras([])}>清空配件</button>
                        )}
                        <button className="text-xs text-xuan-ochre hover:underline" onClick={addExtra}>+ 添加配件</button>
                      </div>
                    </div>
                    {formExtras.length === 0 ? (
                      <p className="text-xs text-xuan-inkLight py-2 text-center">暂无配件，可点右上角添加</p>
                    ) : (
                      formExtras.map((ex, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                          <div className="col-span-6">
                            <input className="xuan-input w-full text-sm" placeholder="配件名称，如：狼毫毛笔" value={ex.name} onChange={(e) => updateExtra(idx, 'name', e.target.value)} />
                          </div>
                          <div className="col-span-2">
                            <input className="xuan-input w-full text-sm" type="number" placeholder="数量" value={ex.quantity || ''} onChange={(e) => updateExtra(idx, 'quantity', +e.target.value)} />
                          </div>
                          <div className="col-span-2">
                            <input className="xuan-input w-full text-sm" type="number" placeholder="单价" value={ex.unitPrice || ''} onChange={(e) => updateExtra(idx, 'unitPrice', +e.target.value)} />
                          </div>
                          <div className="col-span-1 text-sm text-xuan-ink text-right font-medium">¥{(ex.quantity * ex.unitPrice).toLocaleString()}</div>
                          <div className="col-span-1">
                            <button className="w-full py-2 text-xs text-xuan-cinnabar hover:bg-xuan-cinnabar/10 rounded-lg transition" onClick={() => removeExtra(idx)}>删除</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-xuan-paperDark/40">
                  <span className="text-sm text-xuan-inkLight">
                    宣纸 {formItems.reduce((s, i) => s + i.quantity, 0)} 张
                    {formExtras.length > 0 && ` · 配件 ${formExtras.length} 项`}
                  </span>
                  <div className="flex items-center gap-3">
                    {extrasTotal > 0 && (
                      <span className="text-sm text-xuan-inkLight">配件 ¥{extrasTotal.toLocaleString()}</span>
                    )}
                    <span className="text-lg font-bold text-xuan-ochre">¥{itemsTotal.toLocaleString()}</span>
                    <button className="px-4 py-2 rounded-lg border border-xuan-paperDark text-xuan-inkLight hover:bg-xuan-paperDark/30 transition" onClick={() => { setShowForm(false); resetForm(); }}>取消</button>
                    <button className="xuan-btn-primary" onClick={handleSubmit}>{editingOrderId ? '保存修改' : '确认提交'}</button>
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
                          {order.isBundle && <span className="xuan-badge text-xs bg-xuan-gold/20 text-xuan-gold border border-xuan-gold/40 flex items-center gap-1"><Gift className="w-3 h-3" />文房套装</span>}
                          <span className={`xuan-badge border ${statusBadge[order.status]}`}>{order.status}</span>
                        </div>
                        <p className="text-sm text-xuan-inkLight">{order.customer} · {order.createDate}</p>
                      </div>
                      <div className="text-right flex items-start gap-3">
                        <div>
                          <p className="text-xl font-bold text-xuan-ochre">¥{order.totalAmount.toLocaleString()}</p>
                          <p className={`text-xs ${isOverdue ? 'text-xuan-cinnabar' : 'text-xuan-inkLight'}`}>
                            {order.status === '已发货' ? '已发货' : `距交货 ${days} 天`}
                          </p>
                        </div>
                        <button onClick={() => editOrder(order)} className="text-xs text-xuan-inkLight hover:text-xuan-ochre hover:underline">编辑</button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {order.items.map((item, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-xuan-paperDark/30 text-xs">
                          <span className="text-xuan-ink">{item.specification} {item.grade}</span>
                          <span className="text-xuan-inkLight">× {item.quantity}张</span>
                          {item.batchNo && (
                            <span
                              className="text-xuan-ochre font-mono cursor-pointer hover:underline ml-0.5"
                              onClick={() => openBatch(item.batchNo)}
                            >
                              [{item.batchNo}]
                            </span>
                          )}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-xuan-paperDark/30">
                      <span className="text-xs text-xuan-inkLight">交货日期：{order.deliveryDate}</span>
                      {order.status !== '已发货' && (
                        <button
                          className={`text-xs px-3 py-1.5 rounded-md transition font-medium flex items-center gap-1 ${
                            statusFlow[statusFlow.indexOf(order.status) + 1] === '已发货'
                              ? 'bg-xuan-indigo/15 text-xuan-indigo hover:bg-xuan-indigo/25'
                              : 'bg-xuan-ochre/10 text-xuan-ochre hover:bg-xuan-ochre/20'
                          }`}
                          onClick={() => handleNextStatus(order.id, order.status)}
                        >
                          {statusFlow[statusFlow.indexOf(order.status) + 1] === '已发货' ? <Truck className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          {statusFlow[statusFlow.indexOf(order.status) + 1] || '已完成'}
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
                    {combo.paperItems.map((item, idx) => (
                      <div key={`p${idx}`} className="flex items-center justify-between text-xs">
                        <span className="text-xuan-ochre">{item.specification} {item.grade} 宣纸</span>
                        <span className="text-xuan-ink">×{item.quantity}</span>
                      </div>
                    ))}
                    {combo.extras.map((item, idx) => (
                      <div key={`e${idx}`} className="flex items-center justify-between text-xs">
                        <span className="text-xuan-inkLight">{item.name}</span>
                        <span className="text-xuan-ink">×{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-xuan-paperDark/30 flex items-center justify-between">
                    <p className="text-xl font-bold text-xuan-ochre">¥{combo.price.toLocaleString()}</p>
                    <div className="flex items-center gap-1.5">
                      <button className="text-xs px-3 py-1.5 rounded-md border border-xuan-paperDark text-xuan-inkLight hover:bg-xuan-paperDark/30 transition" onClick={() => quickBundleOrder(combo, true)}>
                        带入表单
                      </button>
                      <button className="xuan-btn-secondary text-xs px-3 py-1.5" onClick={() => quickBundleOrder(combo, false)}>
                        直接下单
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
