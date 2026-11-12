/** Product data in this challenge is representative, not a live Monis feed. */
export const deskIds = ['electric', 'dual'] as const;
export const chairIds = ['mesh', 'comfort'] as const;
export const accessoryIds = ['monitor', 'ultrawide', 'lamp', 'keyboard', 'plant'] as const;
export const planIds = ['week', 'month'] as const;
export type DeskId = (typeof deskIds)[number];
export type ChairId = (typeof chairIds)[number];
export type AccessoryId = (typeof accessoryIds)[number];
export type PlanId = (typeof planIds)[number];
export type CategoryId = 'desk' | 'chair' | 'extras';
export type PresetId = 'essentials' | 'creator' | 'minimal';

export type Product = {
  id: DeskId | ChairId | AccessoryId;
  name: string;
  description: string;
  detail: string;
  weekly: number;
  monthly: number;
  badge?: string;
};
export type Setup = {
  desk: DeskId;
  chair: ChairId;
  accessories: AccessoryId[];
  plan: PlanId;
};

export const desks: Record<DeskId, Product> = {
  electric: {
    id: 'electric', name: 'Electric Standing Desk', description: 'The everyday upgrade',
    detail: 'Motorized height adjustment · 120 × 70 cm', weekly: 12, monthly: 39, badge: 'ESSENTIAL',
  },
  dual: {
    id: 'dual', name: 'Dual-Motor Pro Desk', description: 'Extra space, extra steady',
    detail: 'Dual motor · 160 × 70 cm', weekly: 16, monthly: 52, badge: 'UPGRADE',
  },
};
export const chairs: Record<ChairId, Product> = {
  mesh: {
    id: 'mesh', name: 'Ergonomic Mesh Chair', description: 'Support for long sessions',
    detail: 'Breathable mesh · adjustable lumbar', weekly: 9, monthly: 29, badge: 'ESSENTIAL',
  },
  comfort: {
    id: 'comfort', name: 'Comfort Office Chair', description: 'A softer way to sit',
    detail: 'Padded seat · adjustable height', weekly: 10, monthly: 32,
  },
};
export const accessories: Record<AccessoryId, Product> = {
  monitor: {
    id: 'monitor', name: '27” 4K Monitor', description: 'Sharper everyday work',
    detail: '4K resolution · USB-C ready', weekly: 8, monthly: 26, badge: '4K',
  },
  ultrawide: {
    id: 'ultrawide', name: '34” Curved Monitor', description: 'Space for every window',
    detail: 'Ultra-wide · immersive display', weekly: 13, monthly: 42, badge: 'UPGRADE',
  },
  lamp: {
    id: 'lamp', name: 'Smart Desk Lamp', description: 'The right light, any hour',
    detail: 'Adjustable temperature · dimmable', weekly: 3, monthly: 9,
  },
  keyboard: {
    id: 'keyboard', name: 'Keyboard & Mouse', description: 'The everyday essentials',
    detail: 'Wireless desktop accessories', weekly: 3, monthly: 10,
  },
  plant: {
    id: 'plant', name: 'Desk Plant', description: 'A little more life',
    detail: 'Decorative greenery · concept item', weekly: 2, monthly: 6,
  },
};

export const presets: Record<PresetId, { label: string; subtitle: string; setup: Omit<Setup, 'plan'> }> = {
  essentials: { label: 'The Essentials', subtitle: 'A solid place to start', setup: { desk: 'electric', chair: 'mesh', accessories: ['monitor', 'keyboard'] } },
  creator: { label: 'The Creator', subtitle: 'Room for the big ideas', setup: { desk: 'dual', chair: 'mesh', accessories: ['ultrawide', 'lamp', 'keyboard', 'plant'] } },
  minimal: { label: 'The Minimalist', subtitle: 'Just the good stuff', setup: { desk: 'electric', chair: 'comfort', accessories: ['lamp'] } },
};

export const initialSetup: Setup = { ...presets.essentials.setup, plan: 'month' };

export function isSetup(value: unknown): value is Setup {
  if (!value || typeof value !== 'object') return false;
  const setup = value as Partial<Setup>;
  return deskIds.some((id) => id === setup.desk) &&
    chairIds.some((id) => id === setup.chair) &&
    planIds.some((id) => id === setup.plan) &&
    Array.isArray(setup.accessories) &&
    setup.accessories.every((id) => accessoryIds.some((valid) => id === valid)) &&
    new Set(setup.accessories).size === setup.accessories.length &&
    !(setup.accessories.includes('monitor') && setup.accessories.includes('ultrawide'));
}

export function withAccessory(setup: Setup, id: AccessoryId): Setup {
  const current = setup.accessories;
  const next = current.includes(id) ? current.filter((value) => value !== id) : [...current, id];
  // A single monitor position in the preview; selecting another display swaps it.
  const extras = id === 'monitor' || id === 'ultrawide'
    ? next.filter((value) => value === id || (value !== 'monitor' && value !== 'ultrawide'))
    : next;
  return { ...setup, accessories: accessoryIds.filter((value) => extras.includes(value)) };
}

export function applyPreset(setup: Setup, preset: PresetId): Setup {
  return { ...presets[preset].setup, accessories: [...presets[preset].setup.accessories], plan: setup.plan };
}

export function selectedProducts(setup: Setup): Product[] {
  return [desks[setup.desk], chairs[setup.chair], ...accessoryIds.filter((id) => setup.accessories.includes(id)).map((id) => accessories[id])];
}

export function totalFor(setup: Setup): number {
  return selectedProducts(setup).reduce((total, item) => total + (setup.plan === 'week' ? item.weekly : item.monthly), 0);
}

export function formatPrice(amount: number): string {
  return `$${amount}`;
}

/** Short, readable, editable URLs with strict validation; no encoded arbitrary JSON. */
export function serializeSetup(setup: Setup): string {
  const params = new URLSearchParams();
  params.set('desk', setup.desk);
  params.set('chair', setup.chair);
  params.set('extras', accessoryIds.filter((id) => setup.accessories.includes(id)).join(','));
  params.set('plan', setup.plan);
  return params.toString();
}

export function parseSetupParams(search: string): Setup | null {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  if (!['desk', 'chair', 'extras', 'plan'].some((field) => params.has(field))) return null;
  const extras = params.get('extras')?.split(',').filter(Boolean) ?? [];
  const candidate = {
    desk: params.get('desk'), chair: params.get('chair'),
    accessories: extras, plan: params.get('plan'),
  };
  return isSetup(candidate) ? candidate : null;
}

export function setupInsight(setup: Setup): { title: string; detail: string; add?: AccessoryId } {
  if (!setup.accessories.includes('monitor') && !setup.accessories.includes('ultrawide')) {
    return { title: 'Need more screen space?', detail: 'Add a monitor to complete your workstation.', add: 'monitor' };
  }
  if (!setup.accessories.includes('lamp')) {
    return { title: 'Work past sunset?', detail: 'A dimmable desk lamp makes evening sessions easier.', add: 'lamp' };
  }
  return { title: 'Looking good.', detail: 'Your workspace is ready for long, focused days.' };
}
