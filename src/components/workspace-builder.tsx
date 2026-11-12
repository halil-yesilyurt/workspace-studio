'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronRight, Clock3, Copy, Download,
  ExternalLink, Info, Lightbulb, Link2, Moon, PackageCheck, RotateCcw,
  Sun, Truck, X, SlidersHorizontal,
} from 'lucide-react';
import {
  accessories, accessoryIds, applyPreset, chairIds, chairs, deskIds, desks,
  formatPrice, initialSetup, isSetup, parseSetupParams, presets, selectedProducts,
  serializeSetup, setupInsight, totalFor, withAccessory,
  type AccessoryId, type CategoryId, type ChairId, type DeskId, type PresetId,
  type Setup,
} from '@/lib/catalog';
import { ProductArt } from './product-art';
import { WorkspaceFinder } from './workspace-finder';
import { downloadSetupCard } from '@/lib/export-setup';
import { WorkspaceScene, type DeskHeight, type Lighting } from './workspace-scene';

const STORAGE_KEY = 'workspace-studio:config-v2';
const steps: { id: CategoryId; label: string; detail: string }[] = [
  { id: 'desk', label: 'Desk', detail: 'Choose your foundation' },
  { id: 'chair', label: 'Chair', detail: 'Make it comfortable' },
  { id: 'extras', label: 'Accessories', detail: 'Make it yours' },
];

export function WorkspaceBuilder() {
  const [setup, setSetup] = useState<Setup>(initialSetup);
  const [step, setStep] = useState<CategoryId>('desk');
  const [preset, setPreset] = useState<PresetId | null>('essentials');
  const [height, setHeight] = useState<DeskHeight>('sit');
  const [lighting, setLighting] = useState<Lighting>('day');
  const [dialog, setDialog] = useState<'review' | 'about' | 'finder' | null>(null);
  const [message, setMessage] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [exportBusy, setExportBusy] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const exportSceneRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    try {
      const fromLink = parseSetupParams(window.location.search);
      const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
      if (fromLink) { setSetup(fromLink); setPreset(null); }
      else if (isSetup(saved)) { setSetup(saved); setPreset(null); }
    } catch { /* Invalid or blocked storage should never stop the demo. */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(setup)); } catch { /* Storage is optional. */ }
  }, [setup, hydrated]);

  useEffect(() => {
    if (!dialog) return;
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDialog(null);
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled])'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      returnFocus?.focus();
    };
  }, [dialog]);

  const update = (next: Setup) => { setSetup(next); setPreset(null); setMessage(''); };
  const pickPreset = (id: PresetId) => { setSetup((current) => applyPreset(current, id)); setPreset(id); setStep('desk'); setMessage(''); };
  const reset = () => { setSetup(initialSetup); setStep('desk'); setHeight('sit'); setLighting('day'); setPreset('essentials'); setMessage(''); };
  const period = setup.plan === 'week' ? 'week' : 'month';
  const products = selectedProducts(setup);
  const total = totalFor(setup);
  const activeIndex = steps.findIndex((item) => item.id === step);
  const insight = setupInsight(setup);

  async function copyText(text: string, success: string) {
    try { await navigator.clipboard.writeText(text); setMessage(success); }
    catch { setMessage('Copy unavailable in this browser. You can still use the official site link below.'); }
  }
  function share() {
    const url = new URL(window.location.href);
    url.search = serializeSetup(setup);
    url.hash = '';
    void copyText(url.toString(), 'Setup link copied. Anyone can open your exact configuration.');
  }
  function copySummary() {
    const lines = [
      'My workspace setup',
      ...products.map((item) => `${item.name} — ${formatPrice(setup.plan === 'week' ? item.weekly : item.monthly)}/${period}`),
      `Estimated total: ${formatPrice(total)}/${period}`,
      'Illustrative prices. Independent prototype, not an order or quote from Monis.',
    ];
    void copyText(lines.join('\n'), 'Setup summary copied.');
  }
  async function saveSetupImage() {
    const svg = exportSceneRef.current?.querySelector('svg');
    if (!(svg instanceof SVGSVGElement)) { setMessage('The preview could not be found.'); return; }
    setExportBusy(true);
    setMessage('');
    try { await downloadSetupCard(svg, setup); setMessage('Your workspace image has been downloaded.'); }
    catch { setMessage('Image export failed in this browser. Try the share link instead.'); }
    finally { setExportBusy(false); }
  }

  return (
    <div className="site-shell">
      <div className="announcement"><span>YOUR BALI WORKSPACE, SORTED.</span><span className="announcement-right">Interactive rental planner <span className="announcement-divider">/</span> Independent concept</span></div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Workspace Builder home"><strong>monis<span>.</span></strong><span className="brand-separator"/><span className="brand-product">workspace<br/>builder</span></a>
        <nav className="header-links" aria-label="Primary navigation">
          <a href="#builder">Build a setup</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <div className="header-actions"><span className="demo-flag">DESIGN CONCEPT</span><button className="header-review" onClick={() => setDialog('review')}>My setup <span className="header-count">{products.length}</span></button></div>
      </header>

      <main id="top">
        <section className="intro-band" aria-labelledby="page-title">
          <div className="breadcrumb">BALI / EQUIPMENT RENTAL <ChevronRight size={13}/> WORKSPACE BUILDER</div>
          <div className="intro-row"><div><div className="intro-kicker"><span className="kicker-dot"/> YOUR SETUP STARTS HERE</div><h1 id="page-title">Build a workspace<br/><span>that works for you.</span></h1><p>From the first desk to the final detail. Pick your gear, see it together, and plan your Bali setup in minutes.</p></div><div className="intro-stats"><div><Truck size={19}/><span>Inspired by Bali-wide delivery</span></div><div><Clock3 size={19}/><span>Flexible weekly & monthly rentals</span></div><div><CheckCircle2 size={19}/><span>No account needed to explore</span></div></div></div>
        </section>

        <section id="builder" className="builder-layout" aria-label="Interactive workspace builder">
          <div className="preview-column">
            <div className="preview-heading"><div><span className="section-label">01 / LIVE WORKSPACE PREVIEW</span><h2>Your space, in real time<span className="blue-dot">.</span></h2></div><button className="reset-link" onClick={reset}><RotateCcw size={15}/> Start over</button></div>
            <div className={`workspace-stage ${lighting === 'evening' ? 'is-evening' : ''}`}>
              <div className="stage-top"><span className="live-pill"><span/> LIVE PREVIEW</span><span className="stage-view">FRONT / 3D-STYLE</span></div>
              <WorkspaceScene setup={setup} height={height} lighting={lighting}/>
              <button className="hotspot hotspot-desk" onClick={() => setStep('desk')} aria-label="Choose a desk"><span>+</span> Desk</button>
              <button className="hotspot hotspot-chair" onClick={() => setStep('chair')} aria-label="Choose a chair"><span>+</span> Chair</button>
              <div className="scene-controls"><div className="control-group"><span className="control-caption">DESK HEIGHT</span><div className="mini-toggle" role="group" aria-label="Preview desk height"><button className={height === 'sit' ? 'active' : ''} aria-pressed={height === 'sit'} onClick={() => setHeight('sit')}>Sit</button><button className={height === 'stand' ? 'active' : ''} aria-pressed={height === 'stand'} onClick={() => setHeight('stand')}>Stand</button></div></div><div className="control-group"><span className="control-caption">LIGHTING</span><div className="mini-toggle icon-toggle" role="group" aria-label="Preview lighting"><button className={lighting === 'day' ? 'active' : ''} aria-label="Daylight" title="Daylight" aria-pressed={lighting === 'day'} onClick={() => setLighting('day')}><Sun size={15}/></button><button className={lighting === 'evening' ? 'active' : ''} aria-label="Evening" title="Evening" aria-pressed={lighting === 'evening'} onClick={() => setLighting('evening')}><Moon size={15}/></button></div></div></div>
            </div>
            <div className="preview-caption"><span><span className="caption-check">✓</span> Visual changes appear instantly</span><span>Illustrated preview · Not to scale</span></div>
            <button className="finder-callout" onClick={() => setDialog('finder')}>
              <span className="finder-callout-icon"><SlidersHorizontal size={20}/></span>
              <span className="finder-callout-copy"><strong>Not sure where to start?</strong><small>Find your perfect setup in 3 quick questions.</small></span>
              <span className="finder-callout-action">Find my fit <ArrowRight size={17}/></span>
            </button>
            <div className="preset-box"><div className="preset-header"><span className="section-label">QUICK START</span><strong>Or start with a curated setup</strong></div><div className="preset-list">{(Object.keys(presets) as PresetId[]).map((id) => <button key={id} className={`preset-card ${preset === id ? 'active' : ''}`} onClick={() => pickPreset(id)} aria-pressed={preset === id}><span className="preset-radio">{preset === id && <Check size={12}/>}</span><strong>{presets[id].label}</strong><small>{presets[id].subtitle}</small></button>)}</div></div>
          </div>

          <div className="config-column">
            <div className="config-heading"><div><span className="section-label">02 / BUILD YOUR SETUP</span><h2>Choose your gear.</h2><p>Pick the pieces. We’ll put them together.</p></div><span className="step-count">{String(activeIndex + 1).padStart(2, '0')} <span>/ 03</span></span></div>
            <div className="step-nav" role="tablist" aria-label="Configure your workspace">
              {steps.map((item, index) => <button key={item.id} role="tab" id={`tab-${item.id}`} aria-selected={step === item.id} aria-controls="selection-panel" className={`step-tab ${step === item.id ? 'active' : ''}`} onClick={() => setStep(item.id)}><span>{String(index + 1).padStart(2, '0')}</span>{item.label}</button>)}
            </div>
            <div id="selection-panel" role="tabpanel" aria-labelledby={`tab-${step}`} className="selection-area">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step} initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -8 }} transition={{ duration: reduced ? 0 : .18 }}>
                  <div className="selection-heading"><div><h3>{steps[activeIndex].detail}</h3><p>{step === 'desk' ? 'Every great setup begins with a good desk.' : step === 'chair' ? 'Stay comfortable from first call to last.' : 'Choose as many extras as you like.'}</p></div><span className="selection-counter">{step === 'desk' ? '2 options' : step === 'chair' ? '2 options' : '5 options'}</span></div>
                  <div className="product-grid">
                    {step === 'desk' && deskIds.map((id) => <ProductCard key={id} id={id} selected={setup.desk === id} period={period} onClick={() => update({ ...setup, desk: id as DeskId })}/>)}
                    {step === 'chair' && chairIds.map((id) => <ProductCard key={id} id={id} selected={setup.chair === id} period={period} onClick={() => update({ ...setup, chair: id as ChairId })}/>)}
                    {step === 'extras' && accessoryIds.map((id) => <ProductCard key={id} id={id} selected={setup.accessories.includes(id)} period={period} onClick={() => update(withAccessory(setup, id as AccessoryId))} multiple/>)}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="next-step-row"><span>{step === 'extras' ? `${setup.accessories.length} accessories selected` : 'You can change this anytime'}</span>{activeIndex < 2 ? <button onClick={() => setStep(steps[activeIndex + 1].id)}>Next: {steps[activeIndex + 1].label} <ArrowRight size={16}/></button> : <button onClick={() => setDialog('review')}>Review setup <ArrowRight size={16}/></button>}</div>
            <div className="insight-panel"><Lightbulb size={18}/><div><strong>{insight.title}</strong><p>{insight.detail}</p></div>{insight.add && <button onClick={() => { update(withAccessory(setup, insight.add!)); setStep('extras'); }}>Add <ChevronRight size={14}/></button>}</div>
            <div className="config-total"><div className="rental-row"><div><strong>Rental period</strong><span>Switch any time while building</span></div><div className="billing-switch" role="group" aria-label="Rental period"><button aria-pressed={setup.plan === 'week'} className={setup.plan === 'week' ? 'active' : ''} onClick={() => update({ ...setup, plan: 'week' })}>Weekly</button><button aria-pressed={setup.plan === 'month'} className={setup.plan === 'month' ? 'active' : ''} onClick={() => update({ ...setup, plan: 'month' })}>Monthly</button></div></div><div className="total-row"><div><span className="total-caption">ESTIMATED RENTAL TOTAL <Info size={13}/></span><div className="total-amount">{formatPrice(total)}<small> / {period}</small></div><span className="total-pieces">{products.length} items in your workspace</span></div><button className="review-cta" onClick={() => setDialog('review')}>Review my setup <ArrowRight size={18}/></button></div><p className="quote-note">Sample USD pricing for this demo. Final prices and availability are confirmed at monis.rent.</p></div>
          </div>
        </section>

        <section className="how-strip" id="how-it-works"><div className="how-intro"><span className="section-label">GOOD TO KNOW</span><h2>A workspace without the commitment.</h2></div><div className="how-item"><span><PackageCheck size={20}/></span><strong>Pick your setup</strong><p>Mix and match gear that fits your work.</p></div><div className="how-item"><span><Truck size={20}/></span><strong>Explore local rental</strong><p>Check real availability on the official Monis site.</p></div><div className="how-item"><span><Clock3 size={20}/></span><strong>Stay flexible</strong><p>Weekly or monthly. Your stay, your pace.</p></div></section>
      </main>
      <footer className="footer"><span><strong>workspace builder</strong> / independent design exercise for Desent Solutions</span><span>Not an official Monis store or checkout. <a href="https://www.monis.rent" target="_blank" rel="noopener noreferrer">Visit monis.rent <ExternalLink size={12}/></a></span><button onClick={() => setDialog('about')}>About this project <Info size={14}/></button></footer>

      <AnimatePresence>
        {dialog && <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .18 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}>
          <motion.div ref={dialogRef} className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title" initial={{ opacity: 0, y: reduced ? 0 : 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduced ? 0 : 16, scale: .99 }} transition={{ duration: reduced ? 0 : .24 }}>
            <div className="modal-top"><span className="section-label">{dialog === 'review' ? 'YOUR WORKSPACE / ORDER SUMMARY' : dialog === 'finder' ? 'FIND YOUR WORKSPACE' : 'ABOUT THIS CONCEPT'}</span><button ref={closeRef} onClick={() => setDialog(null)} className="modal-close" aria-label="Close dialog"><X size={20}/></button></div>
            {dialog === 'review' ? <>
              <h2 id="modal-title">Here’s your setup.</h2><p className="modal-subtitle">Your picks, together in one place. Review the details before exploring the real Monis catalog.</p>
              <div className="review-art" ref={exportSceneRef}><WorkspaceScene setup={setup} height={height} lighting={lighting}/></div>
              <div className="review-items">{products.map((item) => <div className="review-item" key={item.id}><div className="review-item-art"><ProductArt id={item.id}/></div><div><strong>{item.name}</strong><span>{item.detail}</span></div><strong>{formatPrice(setup.plan === 'week' ? item.weekly : item.monthly)}</strong></div>)}</div>
              <div className="review-grand"><span>Estimated {period === 'week' ? 'weekly' : 'monthly'} total <small>Sample prices · USD</small></span><strong>{formatPrice(total)}<small>/{period}</small></strong></div>
              <div className="review-disclaimer"><Info size={18}/><p><strong>This is a design prototype, not a real checkout.</strong> No reservation, payment, delivery or product availability is confirmed here. Official Monis orders happen only at <a href="https://www.monis.rent" target="_blank" rel="noopener noreferrer">monis.rent</a>.</p></div>
              <div className="review-actions"><button onClick={share} className="secondary-action"><Link2 size={17}/> Share link</button><button onClick={copySummary} className="secondary-action"><Copy size={17}/> Copy list</button><button onClick={() => {void saveSetupImage();}} disabled={exportBusy} className="secondary-action"><Download size={17}/> {exportBusy ? 'Creating…' : 'Save image'}</button></div>
              {message && <p role="status" className="copy-feedback">{message}</p>}
              <a href="https://www.monis.rent" target="_blank" rel="noopener noreferrer" className="official-action">Browse rentals at monis.rent <ExternalLink size={17}/></a>
              <button className="modal-back" onClick={() => setDialog(null)}><ArrowLeft size={15}/> Keep customizing</button>
            </> : dialog === 'finder' ? <WorkspaceFinder current={setup} onApply={(next) => { update(next); setStep('extras'); setDialog(null); }} onClose={() => setDialog(null)}/> : <>
              <h2 id="modal-title">A better way to choose your work gear.</h2><p className="modal-subtitle">An independent developer challenge concept inspired by the equipment rental experience at monis.rent.</p><div className="about-copy"><p>We replaced a long product list with a live workspace preview. Choose a desk and chair, add useful accessories, and watch your setup come together instantly.</p><p>Preset configurations, a guided workspace finder with explainable recommendations, side-by-side comparison, sit/stand and lighting previews, shareable setup links and images, rental estimates, and keyboard-friendly controls make the experience easier to explore.</p><p>This demo uses handcrafted product illustrations and illustrative prices. It is not an official Monis website and never processes an order or payment.</p></div><button className="official-action" onClick={() => setDialog(null)}>Back to the builder <ArrowRight size={17}/></button>
            </>}
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}

function ProductCard({ id, selected, period, onClick, multiple = false }: {
  id: DeskId | ChairId | AccessoryId;
  selected: boolean;
  period: 'week' | 'month';
  onClick: () => void;
  multiple?: boolean;
}) {
  const item = (id in desks ? desks[id as DeskId] : id in chairs ? chairs[id as ChairId] : accessories[id as AccessoryId]);
  return <button type="button" className={`product-card ${selected ? 'is-selected' : ''}`} onClick={onClick} aria-pressed={selected} aria-label={`${item.name}, ${formatPrice(period === 'week' ? item.weekly : item.monthly)} per ${period}, ${selected ? 'selected' : multiple ? 'add to setup' : 'select'}`}>
    <span className="product-image"><ProductArt id={id}/>{item.badge && <span className={`badge ${item.badge === '4K' ? 'badge-green' : ''}`}>{item.badge}</span>}<span className={`card-select ${selected ? 'chosen' : ''}`}>{selected ? <Check size={15}/> : multiple ? '+' : <span className="radio-center"/>}</span></span>
    <span className="card-details"><strong>{item.name}</strong><small>{item.detail}</small><span className="card-bottom"><span><b>{formatPrice(period === 'week' ? item.weekly : item.monthly)}</b><em>/{period}</em></span><span className={`card-action ${selected ? 'selected' : ''}`}>{selected ? 'Selected' : multiple ? 'Add item' : 'Choose'} <ChevronRight size={13}/></span></span></span>
  </button>;
}
