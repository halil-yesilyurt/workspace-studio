export type DeskId = 'oak' | 'walnut';
export type ChairId = 'graphite' | 'sand';
export type AccessoryId = 'monitor' | 'lamp' | 'plant' | 'keyboard';
export type PlanId = 'week' | 'month';
export type CategoryId = 'desk' | 'chair' | 'extras';
export type Setup = { desk: DeskId; chair: ChairId; accessories: AccessoryId[]; plan: PlanId };
export type Product = { id: string; name: string; detail: string; weekly: number; monthly: number; tag?: string };

// Illustrative prices only. These are not quotes from monis.rent.
export const desks: Record<DeskId, Product> = {
  oak: { id: 'oak', name: 'Everyday Oak', detail: 'Electric sit–stand · natural oak', weekly: 12, monthly: 39, tag: 'A timeless classic' },
  walnut: { id: 'walnut', name: 'Studio Walnut', detail: 'Electric sit–stand · dark walnut', weekly: 15, monthly: 49, tag: 'A little more character' },
};
export const chairs: Record<ChairId, Product> = {
  graphite: { id: 'graphite', name: 'Ergo Graphite', detail: 'Breathable mesh · all-day support', weekly: 9, monthly: 29, tag: 'Made for the long haul' },
  sand: { id: 'sand', name: 'Ergo Sand', detail: 'Soft upholstery · adjustable height', weekly: 10, monthly: 32, tag: 'Comfort, considered' },
};
export const accessories: Record<AccessoryId, Product> = {
  monitor: { id: 'monitor', name: '27” 4K Display', detail: 'More room for big ideas', weekly: 8, monthly: 26 },
  lamp: { id: 'lamp', name: 'Task Light', detail: 'A softer kind of focus', weekly: 3, monthly: 9 },
  plant: { id: 'plant', name: 'Little Greenery', detail: 'A touch of the outdoors', weekly: 2, monthly: 6 },
  keyboard: { id: 'keyboard', name: 'Keyboard & Mouse', detail: 'The finishing touch', weekly: 3, monthly: 10 },
};
export const initialSetup: Setup = { desk: 'oak', chair: 'graphite', accessories: ['monitor', 'plant'], plan: 'month' };
export const selectedProducts = (setup: Setup): Product[] => [desks[setup.desk], chairs[setup.chair], ...setup.accessories.map((id) => accessories[id])];
export const totalFor = (setup: Setup) => selectedProducts(setup).reduce((total, item) => total + (setup.plan === 'week' ? item.weekly : item.monthly), 0);
export const formatPrice = (amount: number) => `$${amount}`;
