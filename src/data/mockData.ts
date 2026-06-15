export interface RawMaterial {
  id: string;
  type: '青檀皮' | '稻草';
  batchNo: string;
  weight: number;
  origin: string;
  harvestYear: number;
  qualityGrade: '特级' | '一级' | '二级';
  stock: number;
  entryDate: string;
  supplier: string;
  fiberLength?: number;
  moistureContent?: number;
  impurityRate?: number;
}

export interface PulpingBatch {
  id: string;
  batchNo: string;
  materialIds: string[];
  barkRatio: number;
  strawRatio: number;
  cookingTemp: number;
  cookingTime: number;
  cookingPressure: number;
  beatingDegree: number;
  status: '制浆中' | '已完成' | '质检中';
  operator: string;
  startDate: string;
  endDate?: string;
}

export interface ScreenBed {
  id: string;
  screenNo: string;
  meshSpec: string;
  status: '空闲' | '使用中' | '维护中';
  lastMaintenance: string;
  operator?: string;
}

export interface LiftingRecord {
  id: string;
  pulpingBatchId: string;
  pulpingBatchNo: string;
  screenNo: string;
  operator: string;
  sheetCount: number;
  thickness: number;
  date: string;
}

export interface DryingRecord {
  id: string;
  wallNo: string;
  batchNo: string;
  temperature: number;
  humidity: number;
  duration: number;
  moistureAfter: number;
  operator: string;
  startDate: string;
  endDate: string;
  appearance?: string;
  warpRecord?: string;
}

export interface InspectionRecord {
  id: string;
  batchNo: string;
  tensileStrength: number;
  thicknessUniformity: number;
  lightTransmittance: number;
  inkAbsorption: number;
  grade: '特皮' | '净皮' | '棉料';
  specification: '四尺' | '六尺' | '八尺' | '丈二';
  result: '合格' | '不合格';
  qualifiedCount?: number;
  inspector: string;
  date: string;
}

export interface OrderItem {
  specification: string;
  grade: string;
  quantity: number;
  unitPrice: number;
  batchNo?: string;
}

export interface FinishedStock {
  id: string;
  batchNo: string;
  specification: '四尺' | '六尺' | '八尺' | '丈二';
  grade: '特皮' | '净皮' | '棉料';
  quantity: number;
  unit: string;
  warehouseDate: string;
  remark?: string;
}

export interface BundleExtra {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNo: string;
  customer: string;
  items: OrderItem[];
  extras?: BundleExtra[];
  status: '待排产' | '生产中' | '已完成' | '已发货';
  deliveryDate: string;
  totalAmount: number;
  createDate: string;
  isBundle?: boolean;
}

export interface SaleRecord {
  id: string;
  traceCode: string;
  batchNo: string;
  customer: string;
  product: string;
  quantity: number;
  amount: number;
  saleDate: string;
  paymentStatus: '已收款' | '待收款' | '部分收款';
}

export interface CraftArchive {
  id: string;
  title: string;
  category: '制浆工艺' | '捞纸技法' | '晒纸技艺' | '配料秘方';
  master: string;
  description: string;
  parameters: Record<string, string | number>;
  createDate: string;
}

export interface TraceNode {
  stage: string;
  detail: string;
  date: string;
  operator: string;
}

export interface TraceabilityRecord {
  id: string;
  traceCode: string;
  batchNo: string;
  nodes: TraceNode[];
}

export const rawMaterials: RawMaterial[] = [
  { id: 'RM001', type: '青檀皮', batchNo: 'TP-2026-001', weight: 5000, origin: '安徽泾县', harvestYear: 2025, qualityGrade: '特级', stock: 3200, entryDate: '2026-01-15', supplier: '泾县青檀种植基地', fiberLength: 2.8, moistureContent: 12.5, impurityRate: 1.2 },
  { id: 'RM002', type: '青檀皮', batchNo: 'TP-2026-002', weight: 3800, origin: '安徽泾县', harvestYear: 2025, qualityGrade: '一级', stock: 2100, entryDate: '2026-02-08', supplier: '泾县青檀种植基地', fiberLength: 2.5, moistureContent: 13.1, impurityRate: 2.0 },
  { id: 'RM003', type: '稻草', batchNo: 'DC-2026-001', weight: 8000, origin: '安徽宣城', harvestYear: 2025, qualityGrade: '特级', stock: 5500, entryDate: '2026-01-20', supplier: '宣城优质稻草供应站', fiberLength: 1.5, moistureContent: 14.2, impurityRate: 1.8 },
  { id: 'RM004', type: '稻草', batchNo: 'DC-2026-002', weight: 6000, origin: '安徽宣城', harvestYear: 2024, qualityGrade: '二级', stock: 1800, entryDate: '2026-03-05', supplier: '宣城优质稻草供应站', fiberLength: 1.2, moistureContent: 15.0, impurityRate: 3.5 },
  { id: 'RM005', type: '青檀皮', batchNo: 'TP-2026-003', weight: 4200, origin: '安徽泾县', harvestYear: 2024, qualityGrade: '二级', stock: 900, entryDate: '2026-03-12', supplier: '云岭青檀合作社', fiberLength: 2.1, moistureContent: 14.8, impurityRate: 3.2 },
  { id: 'RM006', type: '稻草', batchNo: 'DC-2026-003', weight: 7000, origin: '安徽宁国', harvestYear: 2025, qualityGrade: '一级', stock: 4200, entryDate: '2026-02-25', supplier: '宁国农产供应中心', fiberLength: 1.4, moistureContent: 13.8, impurityRate: 2.1 },
];

export const pulpingBatches: PulpingBatch[] = [
  { id: 'PB001', batchNo: 'ZJ-2026-001', materialIds: ['RM001', 'RM003'], barkRatio: 60, strawRatio: 40, cookingTemp: 95, cookingTime: 8, cookingPressure: 1.2, beatingDegree: 45, status: '已完成', operator: '王师傅', startDate: '2026-03-01', endDate: '2026-03-02' },
  { id: 'PB002', batchNo: 'ZJ-2026-002', materialIds: ['RM002', 'RM006'], barkRatio: 50, strawRatio: 50, cookingTemp: 92, cookingTime: 7, cookingPressure: 1.1, beatingDegree: 42, status: '已完成', operator: '李师傅', startDate: '2026-03-05', endDate: '2026-03-06' },
  { id: 'PB003', batchNo: 'ZJ-2026-003', materialIds: ['RM001', 'RM003'], barkRatio: 70, strawRatio: 30, cookingTemp: 98, cookingTime: 9, cookingPressure: 1.3, beatingDegree: 48, status: '制浆中', operator: '王师傅', startDate: '2026-06-14' },
  { id: 'PB004', batchNo: 'ZJ-2026-004', materialIds: ['RM005', 'RM004'], barkRatio: 40, strawRatio: 60, cookingTemp: 90, cookingTime: 7, cookingPressure: 1.0, beatingDegree: 38, status: '质检中', operator: '张师傅', startDate: '2026-06-12', endDate: '2026-06-13' },
];

export const screenBeds: ScreenBed[] = [
  { id: 'SB001', screenNo: '帘床-01', meshSpec: '80目', status: '使用中', lastMaintenance: '2026-05-20', operator: '陈师傅' },
  { id: 'SB002', screenNo: '帘床-02', meshSpec: '80目', status: '空闲', lastMaintenance: '2026-05-18' },
  { id: 'SB003', screenNo: '帘床-03', meshSpec: '100目', status: '使用中', lastMaintenance: '2026-05-15', operator: '刘师傅' },
  { id: 'SB004', screenNo: '帘床-04', meshSpec: '100目', status: '维护中', lastMaintenance: '2026-06-10' },
  { id: 'SB005', screenNo: '帘床-05', meshSpec: '60目', status: '空闲', lastMaintenance: '2026-04-28' },
  { id: 'SB006', screenNo: '帘床-06', meshSpec: '60目', status: '使用中', lastMaintenance: '2026-05-22', operator: '赵师傅' },
];

export const liftingRecords: LiftingRecord[] = [
  { id: 'LR001', pulpingBatchId: 'PB003', pulpingBatchNo: 'ZJ-2026-003', screenNo: '帘床-01', operator: '陈师傅', sheetCount: 120, thickness: 0.08, date: '2026-06-14' },
  { id: 'LR002', pulpingBatchId: 'PB003', pulpingBatchNo: 'ZJ-2026-003', screenNo: '帘床-03', operator: '刘师傅', sheetCount: 95, thickness: 0.10, date: '2026-06-14' },
  { id: 'LR003', pulpingBatchId: 'PB004', pulpingBatchNo: 'ZJ-2026-004', screenNo: '帘床-06', operator: '赵师傅', sheetCount: 110, thickness: 0.09, date: '2026-06-14' },
  { id: 'LR004', pulpingBatchId: 'PB001', pulpingBatchNo: 'ZJ-2026-001', screenNo: '帘床-01', operator: '陈师傅', sheetCount: 130, thickness: 0.08, date: '2026-03-02' },
  { id: 'LR005', pulpingBatchId: 'PB001', pulpingBatchNo: 'ZJ-2026-001', screenNo: '帘床-02', operator: '陈师傅', sheetCount: 105, thickness: 0.09, date: '2026-03-02' },
  { id: 'LR006', pulpingBatchId: 'PB002', pulpingBatchNo: 'ZJ-2026-002', screenNo: '帘床-03', operator: '刘师傅', sheetCount: 88, thickness: 0.10, date: '2026-03-06' },
];

export const dryingRecords: DryingRecord[] = [
  { id: 'DR001', wallNo: '火墙-A1', batchNo: 'ZJ-2026-001', temperature: 85, humidity: 35, duration: 240, moistureAfter: 6.2, operator: '周师傅', startDate: '2026-03-03', endDate: '2026-03-03', appearance: '平整光滑', warpRecord: '无' },
  { id: 'DR002', wallNo: '火墙-A2', batchNo: 'ZJ-2026-002', temperature: 82, humidity: 38, duration: 260, moistureAfter: 6.5, operator: '周师傅', startDate: '2026-03-07', endDate: '2026-03-07', appearance: '平整光滑', warpRecord: '无' },
  { id: 'DR003', wallNo: '火墙-B1', batchNo: 'ZJ-2026-004', temperature: 80, humidity: 40, duration: 280, moistureAfter: 7.1, operator: '吴师傅', startDate: '2026-06-14', endDate: '2026-06-14', appearance: '轻微毛边', warpRecord: '轻微翘曲' },
  { id: 'DR004', wallNo: '火墙-B2', batchNo: 'ZJ-2026-001', temperature: 88, humidity: 32, duration: 220, moistureAfter: 5.8, operator: '吴师傅', startDate: '2026-03-04', endDate: '2026-03-04', appearance: '平整光滑', warpRecord: '无' },
];

export const inspectionRecords: InspectionRecord[] = [
  { id: 'IR001', batchNo: 'ZJ-2026-001', tensileStrength: 3.8, thicknessUniformity: 95, lightTransmittance: 88, inkAbsorption: 92, grade: '特皮', specification: '四尺', result: '合格', inspector: '孙质检', date: '2026-03-05' },
  { id: 'IR002', batchNo: 'ZJ-2026-001', tensileStrength: 3.5, thicknessUniformity: 92, lightTransmittance: 85, inkAbsorption: 90, grade: '净皮', specification: '六尺', result: '合格', inspector: '孙质检', date: '2026-03-05' },
  { id: 'IR003', batchNo: 'ZJ-2026-002', tensileStrength: 3.2, thicknessUniformity: 88, lightTransmittance: 82, inkAbsorption: 88, grade: '净皮', specification: '四尺', result: '合格', inspector: '孙质检', date: '2026-03-08' },
  { id: 'IR004', batchNo: 'ZJ-2026-002', tensileStrength: 2.8, thicknessUniformity: 80, lightTransmittance: 75, inkAbsorption: 85, grade: '棉料', specification: '八尺', result: '合格', inspector: '钱质检', date: '2026-03-08' },
  { id: 'IR005', batchNo: 'ZJ-2026-004', tensileStrength: 2.2, thicknessUniformity: 68, lightTransmittance: 60, inkAbsorption: 72, grade: '棉料', specification: '四尺', result: '不合格', inspector: '钱质检', date: '2026-06-15' },
];

export const orders: Order[] = [
  { id: 'OD001', orderNo: 'DD-2026-001', customer: '北京荣宝斋', items: [{ specification: '四尺', grade: '特皮', quantity: 500, unitPrice: 28 }, { specification: '六尺', grade: '净皮', quantity: 300, unitPrice: 45 }], status: '生产中', deliveryDate: '2026-07-15', totalAmount: 27500, createDate: '2026-05-20' },
  { id: 'OD002', orderNo: 'DD-2026-002', customer: '上海朵云轩', items: [{ specification: '八尺', grade: '特皮', quantity: 200, unitPrice: 85 }], status: '待排产', deliveryDate: '2026-08-01', totalAmount: 17000, createDate: '2026-06-01' },
  { id: 'OD003', orderNo: 'DD-2026-003', customer: '杭州西泠印社', items: [{ specification: '四尺', grade: '净皮', quantity: 800, unitPrice: 22 }, { specification: '四尺', grade: '棉料', quantity: 1000, unitPrice: 15 }], status: '已完成', deliveryDate: '2026-05-30', totalAmount: 32600, createDate: '2026-04-10' },
  { id: 'OD004', orderNo: 'DD-2026-004', customer: '中国美术学院', items: [{ specification: '丈二', grade: '特皮', quantity: 50, unitPrice: 180 }], status: '生产中', deliveryDate: '2026-07-20', totalAmount: 9000, createDate: '2026-06-05' },
  { id: 'OD005', orderNo: 'DD-2026-005', customer: '南京十竹斋', items: [{ specification: '六尺', grade: '特皮', quantity: 400, unitPrice: 48 }, { specification: '四尺', grade: '净皮', quantity: 600, unitPrice: 22 }], status: '已发货', deliveryDate: '2026-06-10', totalAmount: 32400, createDate: '2026-04-15' },
];

export const saleRecords: SaleRecord[] = [
  { id: 'SL001', traceCode: 'TR-2026-001', batchNo: 'ZJ-2026-001', customer: '北京荣宝斋', product: '四尺特皮', quantity: 300, amount: 8400, saleDate: '2026-04-20', paymentStatus: '已收款' },
  { id: 'SL002', traceCode: 'TR-2026-002', batchNo: 'ZJ-2026-001', customer: '杭州西泠印社', product: '四尺净皮', quantity: 800, amount: 17600, saleDate: '2026-05-15', paymentStatus: '已收款' },
  { id: 'SL003', traceCode: 'TR-2026-003', batchNo: 'ZJ-2026-002', customer: '南京十竹斋', product: '六尺特皮', quantity: 400, amount: 19200, saleDate: '2026-05-28', paymentStatus: '部分收款' },
  { id: 'SL004', traceCode: 'TR-2026-004', batchNo: 'ZJ-2026-002', customer: '上海朵云轩', product: '四尺棉料', quantity: 1000, amount: 15000, saleDate: '2026-06-05', paymentStatus: '待收款' },
  { id: 'SL005', traceCode: 'TR-2026-005', batchNo: 'ZJ-2026-001', customer: '中国美术学院', product: '八尺净皮', quantity: 100, amount: 6500, saleDate: '2026-06-12', paymentStatus: '已收款' },
];

export const craftArchives: CraftArchive[] = [
  { id: 'CA001', title: '传统燎草制浆法', category: '制浆工艺', master: '王师傅', description: '采用三次蒸煮、两次漂洗的传统燎草制浆工艺，确保纤维充分分离又不过度损伤，是泾县宣纸千年传承的核心技艺。', parameters: { 蒸煮温度: '95°C', 蒸煮时间: '8小时', 蒸煮压力: '1.2atm', 漂洗次数: '2次', 打浆度: '45°SR' }, createDate: '2026-01-10' },
  { id: 'CA002', title: '六捞六晒技法', category: '捞纸技法', master: '陈师傅', description: '经典六捞六晒法，每次捞纸后均匀晾晒，反复六次使纸张纤维交织致密，形成宣纸特有的润墨性。', parameters: { 捞纸次数: '6次', 帘床目数: '80目', 厚度控制: '0.08mm', 翻帘角度: '45°' }, createDate: '2026-01-15' },
  { id: 'CA003', title: '火墙恒温焙干术', category: '晒纸技艺', master: '周师傅', description: '利用火墙恒温焙干技术，温度控制在80-88°C之间，配合适宜湿度，确保纸张干燥均匀不翘曲。', parameters: { 焙干温度: '85°C', 相对湿度: '35%', 焙干时长: '240分钟', 终含水率: '6.2%' }, createDate: '2026-02-01' },
  { id: 'CA004', title: '三七配浆秘方', category: '配料秘方', master: '王师傅', description: '青檀皮与稻草按7:3配比，檀皮赋予纸张强度与韧性，稻草提供柔软与吸墨性，此为特皮宣纸的黄金配比。', parameters: { 青檀皮比例: '70%', 稻草比例: '30%', 纤维长度比: '2:1', 成纸厚度: '0.08mm' }, createDate: '2026-02-10' },
];

export const traceabilityRecords: TraceabilityRecord[] = [
  { id: 'TR001', traceCode: 'TR-2026-001', batchNo: 'ZJ-2026-001', nodes: [
    { stage: '原料入库', detail: '青檀皮 TP-2026-001 特级 / 稻草 DC-2026-001 特级', date: '2026-01-15', operator: '仓管部' },
    { stage: '燎草制浆', detail: '皮草比6:4，蒸煮95°C/8h，打浆度45°SR', date: '2026-03-01', operator: '王师傅' },
    { stage: '捞纸成型', detail: '帘床-01，80目，厚度0.08mm，120张/日', date: '2026-03-02', operator: '陈师傅' },
    { stage: '晒纸焙干', detail: '火墙-A1，85°C，含水率6.2%', date: '2026-03-03', operator: '周师傅' },
    { stage: '检验分级', detail: '特皮/四尺，拉力3.8N，合格', date: '2026-03-05', operator: '孙质检' },
    { stage: '销售出库', detail: '北京荣宝斋，300张，已收款', date: '2026-04-20', operator: '销售部' },
  ]},
  { id: 'TR002', traceCode: 'TR-2026-002', batchNo: 'ZJ-2026-001', nodes: [
    { stage: '原料入库', detail: '青檀皮 TP-2026-001 特级 / 稻草 DC-2026-001 特级', date: '2026-01-15', operator: '仓管部' },
    { stage: '燎草制浆', detail: '皮草比6:4，蒸煮95°C/8h，打浆度45°SR', date: '2026-03-01', operator: '王师傅' },
    { stage: '捞纸成型', detail: '帘床-02，80目，厚度0.09mm', date: '2026-03-02', operator: '刘师傅' },
    { stage: '晒纸焙干', detail: '火墙-B2，88°C，含水率5.8%', date: '2026-03-04', operator: '吴师傅' },
    { stage: '检验分级', detail: '净皮/六尺，拉力3.5N，合格', date: '2026-03-05', operator: '孙质检' },
    { stage: '销售出库', detail: '杭州西泠印社，800张，已收款', date: '2026-05-15', operator: '销售部' },
  ]},
];

export const monthlyProduction = [
  { month: '1月', sheets: 12000, bark: 4800, straw: 7200 },
  { month: '2月', sheets: 9800, bark: 3920, straw: 5880 },
  { month: '3月', sheets: 14500, bark: 5800, straw: 8700 },
  { month: '4月', sheets: 13200, bark: 5280, straw: 7920 },
  { month: '5月', sheets: 15800, bark: 6320, straw: 9480 },
  { month: '6月', sheets: 11000, bark: 4400, straw: 6600 },
];

export const dailyOutput = [
  { day: '6/10', sheets: 420, weight: 168 },
  { day: '6/11', sheets: 385, weight: 154 },
  { day: '6/12', sheets: 510, weight: 204 },
  { day: '6/13', sheets: 465, weight: 186 },
  { day: '6/14', sheets: 490, weight: 196 },
  { day: '6/15', sheets: 430, weight: 172 },
  { day: '6/16', sheets: 325, weight: 130 },
];

export const temperatureData = [
  { time: '06:00', temp: 65, target: 85 },
  { time: '08:00', temp: 75, target: 85 },
  { time: '10:00', temp: 82, target: 85 },
  { time: '12:00', temp: 86, target: 85 },
  { time: '14:00', temp: 88, target: 85 },
  { time: '16:00', temp: 85, target: 85 },
  { time: '18:00', temp: 83, target: 85 },
  { time: '20:00', temp: 80, target: 85 },
  { time: '22:00', temp: 78, target: 85 },
];

export const finishedStocks: FinishedStock[] = [
  { id: 'FS001', batchNo: 'ZJ-2026-001', specification: '四尺', grade: '特皮', quantity: 800, unit: '张', warehouseDate: '2026-03-05', remark: '检验合格入库' },
  { id: 'FS002', batchNo: 'ZJ-2026-001', specification: '六尺', grade: '净皮', quantity: 500, unit: '张', warehouseDate: '2026-03-05', remark: '检验合格入库' },
  { id: 'FS003', batchNo: 'ZJ-2026-002', specification: '四尺', grade: '净皮', quantity: 1200, unit: '张', warehouseDate: '2026-03-08', remark: '检验合格入库' },
  { id: 'FS004', batchNo: 'ZJ-2026-002', specification: '八尺', grade: '棉料', quantity: 400, unit: '张', warehouseDate: '2026-03-08', remark: '检验合格入库' },
  { id: 'FS005', batchNo: 'ZJ-2026-001', specification: '四尺', grade: '棉料', quantity: 600, unit: '张', warehouseDate: '2026-03-06', remark: '补检合格入库' },
];

export const BUNDLE_ITEMS = [
  { name: '四尺净皮宣纸', specification: '四尺', grade: '净皮', quantity: 100, unitPrice: 22, isPaper: true },
  { name: '狼毫毛笔', specification: '-', grade: '-', quantity: 2, unitPrice: 68, isPaper: false },
  { name: '徽墨（二两）', specification: '-', grade: '-', quantity: 2, unitPrice: 45, isPaper: false },
  { name: '端砚', specification: '-', grade: '-', quantity: 1, unitPrice: 280, isPaper: false },
];
