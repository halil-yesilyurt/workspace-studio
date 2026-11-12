import {
  accessories, accessoryIds, chairs, desks, formatPrice, totalFor,
  type AccessoryId, type PlanId, type Setup,
} from './catalog';

export type WorkStyle = 'engineering' | 'creative' | 'everyday';
export type Footprint = 'compact' | 'roomy';
export type Priority = 'value' | 'screens' | 'comfort';

export type FinderAnswers = {
  work: WorkStyle;
  space: Footprint;
  priority: Priority;
};

export type MatchResult = {
  setup: Setup;
  title: string;
  rationale: string[];
};

/**
 * An explainable, deterministic recommendation, not a pretend AI score.
 * The questions directly affect actual product choices and the live price.
 */
export function matchWorkspace(answers: FinderAnswers, plan: PlanId): MatchResult {
  const { work, space, priority } = answers;
  const desk = space === 'roomy' && priority !== 'value' ? 'dual' : 'electric';
  const chair = priority === 'comfort' ? 'comfort' : 'mesh';
  const picks: AccessoryId[] = work === 'creative'
    ? ['ultrawide', 'lamp', 'keyboard']
    : work === 'engineering'
      ? ['monitor', 'keyboard']
      : ['monitor'];

  if (priority === 'screens') {
    const target = space === 'roomy' ? 'ultrawide' : 'monitor';
    const display = picks.indexOf('monitor');
    if (display !== -1) picks.splice(display, 1);
    const ultrawide = picks.indexOf('ultrawide');
    if (ultrawide !== -1) picks.splice(ultrawide, 1);
    picks.push(target);
    if (!picks.includes('keyboard')) picks.push('keyboard');
  }
  if (priority === 'value') {
    for (const id of ['lamp', 'plant', 'ultrawide'] as AccessoryId[]) {
      const index = picks.indexOf(id);
      if (index !== -1) picks.splice(index, 1);
    }
    if (!picks.includes('monitor')) picks.push('monitor');
  }
  if (priority === 'comfort' && !picks.includes('lamp')) picks.push('lamp');
  if (work === 'creative' && priority !== 'value' && !picks.includes('plant')) picks.push('plant');

  const setup: Setup = {
    desk, chair,
    accessories: accessoryIds.filter((id) => picks.includes(id)),
    plan,
  };
  const rationale = [
    space === 'compact'
      ? 'A compact standing desk keeps the footprint manageable without giving up height adjustment.'
      : priority === 'value'
        ? 'The standard electric desk keeps the larger room flexible without raising the base cost.'
        : 'The wider dual-motor desk gives your equipment and workday extra room.',
    priority === 'value'
      ? 'The essentials-first selection focuses the budget on the desk, chair and a useful display.'
      : priority === 'screens'
        ? space === 'compact'
          ? 'A 27-inch display fits a smaller desk, with a keyboard for a complete work zone.'
          : 'An ultrawide display adds the screen room your work calls for.'
        : 'A comfortable chair and adjustable task light support longer sessions.',
    work === 'creative'
      ? 'Extra details make this setup adaptable for visual work and long editing sessions.'
      : work === 'engineering'
        ? 'A dedicated display and keyboard are picked for productive coding sessions.'
        : 'A streamlined setup gets the essentials ready without unnecessary extras.',
  ];

  return {
    setup,
    title: work === 'creative' ? 'The Creative Flow' : work === 'engineering' ? 'The Deep Work Desk' : 'The Everyday Edit',
    rationale,
  };
}

export function comparisonCopy(current: Setup, recommended: Setup): string {
  const delta = totalFor(recommended) - totalFor(current);
  if (delta === 0) return 'Same estimated rental total as your current setup.';
  return delta > 0
    ? `${formatPrice(delta)} more per ${current.plan} for the recommended setup.`
    : `${formatPrice(-delta)} less per ${current.plan} than your current setup.`;
}

// Used to make the match screen easy to scan without inventing a score.
export function matchItems(setup: Setup): string {
  const products = [desks[setup.desk], chairs[setup.chair], ...setup.accessories.map((id) => accessories[id])];
  return products.map((item) => item.name).join(' · ');
}
