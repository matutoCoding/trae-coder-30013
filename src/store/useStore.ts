import { create } from 'zustand';
import {
  RawMaterial,
  PulpingBatch,
  ScreenBed,
  LiftingRecord,
  DryingRecord,
  InspectionRecord,
  Order,
  SaleRecord,
  CraftArchive,
  TraceNode,
  FinishedStock,
  rawMaterials,
  pulpingBatches,
  screenBeds,
  liftingRecords,
  dryingRecords,
  inspectionRecords,
  orders,
  saleRecords,
  craftArchives,
  finishedStocks,
} from '@/data/mockData';

const STORAGE_KEY = 'xuanzhi-paper-factory-data';

interface PersistState {
  materials: RawMaterial[];
  pulpingBatches: PulpingBatch[];
  liftingRecords: LiftingRecord[];
  dryingRecords: DryingRecord[];
  inspections: InspectionRecord[];
  orders: Order[];
  sales: SaleRecord[];
  finishedStocks: FinishedStock[];
}

function loadPersisted(): PersistState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function savePersisted(state: PersistState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

const persisted = loadPersisted();

interface AppState {
  materials: RawMaterial[];
  pulpingBatches: PulpingBatch[];
  screenBeds: ScreenBed[];
  liftingRecords: LiftingRecord[];
  dryingRecords: DryingRecord[];
  inspections: InspectionRecord[];
  orders: Order[];
  sales: SaleRecord[];
  archives: CraftArchive[];
  finishedStocks: FinishedStock[];

  addMaterial: (m: RawMaterial) => void;
  updateMaterial: (id: string, m: Partial<RawMaterial>) => void;
  deleteMaterial: (id: string) => void;

  addPulpingBatch: (b: PulpingBatch) => void;
  updatePulpingBatch: (id: string, b: Partial<PulpingBatch>) => void;
  deletePulpingBatch: (id: string) => void;

  addLiftingRecord: (r: LiftingRecord) => void;
  updateLiftingRecord: (id: string, r: Partial<LiftingRecord>) => void;
  deleteLiftingRecord: (id: string) => void;

  addDryingRecord: (r: DryingRecord) => void;
  updateDryingRecord: (id: string, r: Partial<DryingRecord>) => void;
  deleteDryingRecord: (id: string) => void;

  addInspection: (r: InspectionRecord) => void;
  updateInspection: (id: string, r: Partial<InspectionRecord>) => void;
  deleteInspection: (id: string) => void;

  addOrder: (o: Order) => void;
  updateOrder: (id: string, o: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  shipOrder: (id: string) => { ok: boolean; msg?: string };

  addSale: (s: SaleRecord) => void;
  updateSale: (id: string, s: Partial<SaleRecord>) => void;

  addFinishedStock: (s: FinishedStock) => void;
  updateFinishedStock: (id: string, s: Partial<FinishedStock>) => void;
  deleteFinishedStock: (id: string) => void;
  getAvailableStock: (specification: string, grade: string) => { total: number; batches: FinishedStock[] };

  resetAllData: () => void;
  getTraceabilityByBatch: (batchNo: string) => TraceNode[];
}

function persistSlice(state: AppState): PersistState {
  return {
    materials: state.materials,
    pulpingBatches: state.pulpingBatches,
    liftingRecords: state.liftingRecords,
    dryingRecords: state.dryingRecords,
    inspections: state.inspections,
    orders: state.orders,
    sales: state.sales,
    finishedStocks: state.finishedStocks,
  };
}

export const useStore = create<AppState>((set, get) => ({
  materials: persisted?.materials ?? rawMaterials,
  pulpingBatches: persisted?.pulpingBatches ?? pulpingBatches,
  screenBeds: screenBeds,
  liftingRecords: persisted?.liftingRecords ?? liftingRecords,
  dryingRecords: persisted?.dryingRecords ?? dryingRecords,
  inspections: persisted?.inspections ?? inspectionRecords,
  orders: persisted?.orders ?? orders,
  sales: persisted?.sales ?? saleRecords,
  archives: craftArchives,
  finishedStocks: persisted?.finishedStocks ?? finishedStocks,

  addMaterial: (m) =>
    set((s) => {
      const materials = [...s.materials, m];
      savePersisted(persistSlice({ ...s, materials }));
      return { materials };
    }),
  updateMaterial: (id, m) =>
    set((s) => {
      const materials = s.materials.map((item) => (item.id === id ? { ...item, ...m } : item));
      savePersisted(persistSlice({ ...s, materials }));
      return { materials };
    }),
  deleteMaterial: (id) =>
    set((s) => {
      const materials = s.materials.filter((item) => item.id !== id);
      savePersisted(persistSlice({ ...s, materials }));
      return { materials };
    }),

  addPulpingBatch: (b) =>
    set((s) => {
      const pulpingBatches = [...s.pulpingBatches, b];
      savePersisted(persistSlice({ ...s, pulpingBatches }));
      return { pulpingBatches };
    }),
  updatePulpingBatch: (id, b) =>
    set((s) => {
      const pulpingBatches = s.pulpingBatches.map((item) => (item.id === id ? { ...item, ...b } : item));
      savePersisted(persistSlice({ ...s, pulpingBatches }));
      return { pulpingBatches };
    }),
  deletePulpingBatch: (id) =>
    set((s) => {
      const pulpingBatches = s.pulpingBatches.filter((item) => item.id !== id);
      savePersisted(persistSlice({ ...s, pulpingBatches }));
      return { pulpingBatches };
    }),

  addLiftingRecord: (r) =>
    set((s) => {
      const liftingRecords = [...s.liftingRecords, r];
      savePersisted(persistSlice({ ...s, liftingRecords }));
      return { liftingRecords };
    }),
  updateLiftingRecord: (id, r) =>
    set((s) => {
      const liftingRecords = s.liftingRecords.map((item) => (item.id === id ? { ...item, ...r } : item));
      savePersisted(persistSlice({ ...s, liftingRecords }));
      return { liftingRecords };
    }),
  deleteLiftingRecord: (id) =>
    set((s) => {
      const liftingRecords = s.liftingRecords.filter((item) => item.id !== id);
      savePersisted(persistSlice({ ...s, liftingRecords }));
      return { liftingRecords };
    }),

  addDryingRecord: (r) =>
    set((s) => {
      const dryingRecords = [...s.dryingRecords, r];
      savePersisted(persistSlice({ ...s, dryingRecords }));
      return { dryingRecords };
    }),
  updateDryingRecord: (id, r) =>
    set((s) => {
      const dryingRecords = s.dryingRecords.map((item) => (item.id === id ? { ...item, ...r } : item));
      savePersisted(persistSlice({ ...s, dryingRecords }));
      return { dryingRecords };
    }),
  deleteDryingRecord: (id) =>
    set((s) => {
      const dryingRecords = s.dryingRecords.filter((item) => item.id !== id);
      savePersisted(persistSlice({ ...s, dryingRecords }));
      return { dryingRecords };
    }),

  addInspection: (r) =>
    set((s) => {
      const inspections = [...s.inspections, r];
      let finishedStocks = s.finishedStocks;
      if (r.result === '合格') {
        const exists = finishedStocks.find(
          (fs) => fs.batchNo === r.batchNo && fs.specification === r.specification && fs.grade === r.grade,
        );
        const defaultCount: Record<string, number> = { '四尺': 800, '六尺': 500, '八尺': 300, '丈二': 100 };
        const qty = r.qualifiedCount && r.qualifiedCount > 0 ? r.qualifiedCount : defaultCount[r.specification] ?? 500;
        if (!exists) {
          finishedStocks = [
            ...finishedStocks,
            {
              id: `FS${Date.now()}`,
              batchNo: r.batchNo,
              specification: r.specification,
              grade: r.grade,
              quantity: qty,
              unit: '张',
              warehouseDate: r.date,
              remark: `检验合格入库${r.qualifiedCount ? '（手动填数）' : '（默认估算）'}`,
            },
          ];
        } else {
          finishedStocks = finishedStocks.map((fs) =>
            fs.batchNo === r.batchNo && fs.specification === r.specification && fs.grade === r.grade
              ? { ...fs, quantity: fs.quantity + qty, remark: (fs.remark || '') + ` 追加${qty}张` }
              : fs,
          );
        }
      }
      savePersisted(persistSlice({ ...s, inspections, finishedStocks }));
      return { inspections, finishedStocks };
    }),
  updateInspection: (id, r) =>
    set((s) => {
      const inspections = s.inspections.map((item) => (item.id === id ? { ...item, ...r } : item));
      savePersisted(persistSlice({ ...s, inspections }));
      return { inspections };
    }),
  deleteInspection: (id) =>
    set((s) => {
      const inspections = s.inspections.filter((item) => item.id !== id);
      savePersisted(persistSlice({ ...s, inspections }));
      return { inspections };
    }),

  addOrder: (o) =>
    set((s) => {
      const orders = [...s.orders, o];
      savePersisted(persistSlice({ ...s, orders }));
      return { orders };
    }),
  updateOrder: (id, o) =>
    set((s) => {
      const orders = s.orders.map((item) => (item.id === id ? { ...item, ...o } : item));
      savePersisted(persistSlice({ ...s, orders }));
      return { orders };
    }),
  deleteOrder: (id) =>
    set((s) => {
      const orders = s.orders.filter((item) => item.id !== id);
      savePersisted(persistSlice({ ...s, orders }));
      return { orders };
    }),
  shipOrder: (id) => {
    const state = get();
    const order = state.orders.find((o) => o.id === id);
    if (!order) return { ok: false, msg: '订单不存在' };
    if (order.status === '已发货') return { ok: false, msg: '订单已发货' };

    const paperItems = order.items.filter((it) => it.batchNo);
    for (const item of paperItems) {
      if (!item.batchNo) continue;
      const stock = state.getAvailableStock(item.specification, item.grade);
      const batchStock = stock.batches.find((b) => b.batchNo === item.batchNo);
      if (!batchStock || batchStock.quantity < item.quantity) {
        return {
          ok: false,
          msg: `${item.specification} ${item.grade} 批次 ${item.batchNo} 库存不足（剩 ${batchStock?.quantity ?? 0}，需 ${item.quantity}）`,
        };
      }
    }

    set((s) => {
      let finishedStocks = s.finishedStocks.map((fs) => ({ ...fs }));
      for (const item of paperItems) {
        if (!item.batchNo) continue;
        const idx = finishedStocks.findIndex(
          (fs) => fs.batchNo === item.batchNo && fs.specification === item.specification && fs.grade === item.grade,
        );
        if (idx >= 0) {
          finishedStocks[idx].quantity = Math.max(0, finishedStocks[idx].quantity - item.quantity);
        }
      }

      let sales = [...s.sales];
      const today = new Date().toISOString().slice(0, 10);
      for (const item of paperItems) {
        if (!item.batchNo) continue;
        sales.push({
          id: `SL${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          traceCode: `TR-${today.replace(/-/g, '')}-${sales.length + 1}`,
          batchNo: item.batchNo,
          customer: order.customer,
          product: `${item.specification}${item.grade}`,
          quantity: item.quantity,
          amount: item.quantity * item.unitPrice,
          saleDate: today,
          paymentStatus: '待收款',
        });
      }

      const orders = s.orders.map((o) => (o.id === id ? { ...o, status: '已发货' as const } : o));
      savePersisted(persistSlice({ ...s, orders, sales, finishedStocks }));
      return { orders, sales, finishedStocks };
    });

    return { ok: true };
  },

  addSale: (s2) =>
    set((s) => {
      const sales = [...s.sales, s2];
      savePersisted(persistSlice({ ...s, sales }));
      return { sales };
    }),
  updateSale: (id, s2) =>
    set((s) => {
      const sales = s.sales.map((item) => (item.id === id ? { ...item, ...s2 } : item));
      savePersisted(persistSlice({ ...s, sales }));
      return { sales };
    }),

  addFinishedStock: (f) =>
    set((s) => {
      const finishedStocks = [...s.finishedStocks, f];
      savePersisted(persistSlice({ ...s, finishedStocks }));
      return { finishedStocks };
    }),
  updateFinishedStock: (id, f) =>
    set((s) => {
      const finishedStocks = s.finishedStocks.map((item) => (item.id === id ? { ...item, ...f } : item));
      savePersisted(persistSlice({ ...s, finishedStocks }));
      return { finishedStocks };
    }),
  deleteFinishedStock: (id) =>
    set((s) => {
      const finishedStocks = s.finishedStocks.filter((item) => item.id !== id);
      savePersisted(persistSlice({ ...s, finishedStocks }));
      return { finishedStocks };
    }),
  getAvailableStock: (specification, grade) => {
    const state = get();
    const batches = state.finishedStocks.filter(
      (fs) => fs.specification === specification && fs.grade === grade && fs.quantity > 0,
    );
    const total = batches.reduce((s, b) => s + b.quantity, 0);
    return { total, batches };
  },

  resetAllData: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      materials: rawMaterials,
      pulpingBatches: pulpingBatches,
      liftingRecords: liftingRecords,
      dryingRecords: dryingRecords,
      inspections: inspectionRecords,
      orders: orders,
      sales: saleRecords,
      finishedStocks: finishedStocks,
    });
  },

  getTraceabilityByBatch: (batchNo: string): TraceNode[] => {
    const state = get();
    const nodes: TraceNode[] = [];

    const pulping = state.pulpingBatches.find((p) => p.batchNo === batchNo);
    if (pulping) {
      const matNames = pulping.materialIds
        .map((mid) => state.materials.find((m) => m.id === mid)?.batchNo)
        .filter(Boolean)
        .join('、');
      nodes.push({
        stage: '原料入库',
        detail: `原料批次：${matNames || '未关联'}`,
        date: state.materials
          .filter((m) => pulping.materialIds.includes(m.id))
          .map((m) => m.entryDate)
          .sort()[0] || pulping.startDate,
        operator: '仓管部',
      });
      nodes.push({
        stage: '燎草制浆',
        detail: `皮草比 ${pulping.barkRatio}:${pulping.strawRatio}，蒸煮 ${pulping.cookingTemp}°C/${pulping.cookingTime}h，打浆度 ${pulping.beatingDegree}°SR`,
        date: pulping.startDate,
        operator: pulping.operator,
      });
    }

    const liftings = state.liftingRecords.filter((r) => r.pulpingBatchNo === batchNo);
    if (liftings.length) {
      const totalSheets = liftings.reduce((s, r) => s + r.sheetCount, 0);
      const operators = Array.from(new Set(liftings.map((r) => r.operator))).join('、');
      nodes.push({
        stage: '捞纸成型',
        detail: `${liftings.length}次捞纸，共 ${totalSheets} 张，厚度约 ${liftings[0].thickness}mm`,
        date: liftings[0].date,
        operator: operators,
      });
    }

    const dryings = state.dryingRecords.filter((r) => r.batchNo === batchNo);
    if (dryings.length) {
      const avgMoisture = (dryings.reduce((s, r) => s + r.moistureAfter, 0) / dryings.length).toFixed(1);
      const operators = Array.from(new Set(dryings.map((r) => r.operator))).join('、');
      nodes.push({
        stage: '晒纸焙干',
        detail: `${dryings.length}次焙干，平均终含水率 ${avgMoisture}%`,
        date: dryings[0].startDate,
        operator: operators,
      });
    }

    const inspections = state.inspections.filter((r) => r.batchNo === batchNo);
    if (inspections.length) {
      const passCount = inspections.filter((i) => i.result === '合格').length;
      const grades = Array.from(new Set(inspections.map((i) => i.grade))).join('、');
      const specs = Array.from(new Set(inspections.map((i) => i.specification))).join('、');
      nodes.push({
        stage: '检验分级',
        detail: `${inspections.length}次检验，合格 ${passCount} 次，等级 ${grades || '-'}，规格 ${specs || '-'}`,
        date: inspections[0].date,
        operator: inspections[0].inspector,
      });
    }

    const sales = state.sales.filter((s) => s.batchNo === batchNo);
    if (sales.length) {
      const totalAmount = sales.reduce((s, r) => s + r.amount, 0);
      const customers = Array.from(new Set(sales.map((s) => s.customer))).join('、');
      nodes.push({
        stage: '销售出库',
        detail: `${sales.length}笔销售，总额 ¥${totalAmount.toLocaleString()}，客户：${customers}`,
        date: sales[0].saleDate,
        operator: '销售部',
      });
    }

    if (nodes.length === 0) {
      nodes.push({
        stage: '无数据',
        detail: `未找到批次 ${batchNo} 的相关记录`,
        date: '-',
        operator: '-',
      });
    }

    return nodes;
  },
}));
