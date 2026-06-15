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
  TraceabilityRecord,
  rawMaterials,
  pulpingBatches,
  screenBeds,
  liftingRecords,
  dryingRecords,
  inspectionRecords,
  orders,
  saleRecords,
  craftArchives,
  traceabilityRecords,
} from '@/data/mockData';

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
  traceability: TraceabilityRecord[];

  addMaterial: (m: RawMaterial) => void;
  updateMaterial: (id: string, m: Partial<RawMaterial>) => void;
  addPulpingBatch: (b: PulpingBatch) => void;
  updatePulpingBatch: (id: string, b: Partial<PulpingBatch>) => void;
  addLiftingRecord: (r: LiftingRecord) => void;
  addDryingRecord: (r: DryingRecord) => void;
  addInspection: (r: InspectionRecord) => void;
  addOrder: (o: Order) => void;
  updateOrder: (id: string, o: Partial<Order>) => void;
  addSale: (s: SaleRecord) => void;
}

export const useStore = create<AppState>((set) => ({
  materials: rawMaterials,
  pulpingBatches: pulpingBatches,
  screenBeds: screenBeds,
  liftingRecords: liftingRecords,
  dryingRecords: dryingRecords,
  inspections: inspectionRecords,
  orders: orders,
  sales: saleRecords,
  archives: craftArchives,
  traceability: traceabilityRecords,

  addMaterial: (m) => set((s) => ({ materials: [...s.materials, m] })),
  updateMaterial: (id, m) => set((s) => ({ materials: s.materials.map((item) => item.id === id ? { ...item, ...m } : item) })),
  addPulpingBatch: (b) => set((s) => ({ pulpingBatches: [...s.pulpingBatches, b] })),
  updatePulpingBatch: (id, b) => set((s) => ({ pulpingBatches: s.pulpingBatches.map((item) => item.id === id ? { ...item, ...b } : item) })),
  addLiftingRecord: (r) => set((s) => ({ liftingRecords: [...s.liftingRecords, r] })),
  addDryingRecord: (r) => set((s) => ({ dryingRecords: [...s.dryingRecords, r] })),
  addInspection: (r) => set((s) => ({ inspections: [...s.inspections, r] })),
  addOrder: (o) => set((s) => ({ orders: [...s.orders, o] })),
  updateOrder: (id, o) => set((s) => ({ orders: s.orders.map((item) => item.id === id ? { ...item, ...o } : item) })),
  addSale: (s2) => set((s) => ({ sales: [...s.sales, s2] })),
}));
