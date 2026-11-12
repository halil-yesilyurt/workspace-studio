'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft, ArrowRight, Check, ChevronRight, Copy, Download,
  ExternalLink, Info, Link2, Moon, RotateCcw,
  Sun, X,
} from 'lucide-react';
import {
  accessories, accessoryIds, applyPreset, chairIds, chairs, deskIds, desks,
  formatPrice, initialSetup, isSetup, parseSetupParams, presets, selectedProducts,
  serializeSetup, totalFor, withAccessory,
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

      <header className="site-header" id="top">
        <a className="brand" href="#top" aria-label="Workspace Builder home"><strong>monis<span>.</span></strong><span className="brand-separator"/><span className="brand-product">Workspace builder</span></a>
        <div className="header-actions"><span className="demo-flag">Independent concept</span><button className="header-review" onClick={() => setDialog('review')}>My setup <span className="header-count">{products.length}</span></button></div>
      </header>
      <main>
        <div className="page-intro"><h1 id="page-title">Build a workspace in Bali</h1><span>Choose your desk, chair and extras</span></div>
        <section id="builder" className="builder-layout" aria-label="Interactive workspace builder">
          <div className="preview-column">
            <div className="preview-heading"><h2>Your workspace</h2><button className="reset-link" onClick={reset}><RotateCcw size={16}/> Reset</button></div>
            <div className={`workspace-stage ${lighting === 'evening' ? 'is-evening' : ''}`}>
              <WorkspaceScene setup={setup} height={height} lighting={lighting}/>
              <button className="hotspot hotspot-desk" onClick={() => setStep('desk')} aria-label="Choose a desk">Desk <ChevronRight size={14}/></button>
              <button className="hotspot hotspot-chair" onClick={() => setStep('chair')} aria-label="Choose a chair">Chair <ChevronRight size={14}/></button>
            </div>
            <div className="scene-toolbar">
              <div className="control-group"><span>Desk</span><div className="mini-toggle" role="group" aria-label="Preview desk height"><button className={height === 'sit' ? 'active' : ''} aria-pressed={height === 'sit'} onClick={() => setHeight('sit')}>Sit</button><button className={height === 'stand' ? 'active' : ''} aria-pressed={height === 'stand'} onClick={() => setHeight('stand')}>Stand</button></div></div>
              <div className="control-group"><span>Lighting</span><div className="mini-toggle icon-toggle" role="group" aria-label="Preview lighting"><button className={lighting === 'day' ? 'active' : ''} aria-label="Daylight" aria-pressed={lighting === 'day'} onClick={() => setLighting('day')}><Sun size={17}/></button><button className={lighting === 'evening' ? 'active' : ''} aria-label="Evening" aria-pressed={lighting === 'evening'} onClick={() => setLighting('evening')}><Moon size={17}/></button></div></div>
              <span className="preview-caption">Illustrated preview</span>
            </div>
            <div className="quick-start">
              <div className="quick-start-title"><strong>Starting points</strong><button className="finder-link" onClick={() => setDialog('finder')}>Not sure where to start? <ArrowRight size={16}/></button></div>
              <div className="preset-list">{(Object.keys(presets) as PresetId[]).map((id) => <button key={id} className={`preset-card ${preset === id ? 'active' : ''}`} onClick={() => pickPreset(id)} aria-pressed={preset === id}><span className="preset-radio">{preset === id && <Check size={13}/>}</span><span>{presets[id].label}</span></button>)}</div>
            </div>
          </div>
          <div className="config-column">
            <div className="config-heading"><h2>Choose equipment</h2><span className="step-count">{activeIndex + 1} of 3</span></div>
            <div className="step-nav" role="tablist" aria-label="Configure your workspace">{steps.map((item) => <button key={item.id} role="tab" id={`tab-${item.id}`} aria-selected={step === item.id} aria-controls="selection-panel" className={`step-tab ${step === item.id ? 'active' : ''}`} onClick={() => setStep(item.id)}>{item.label}</button>)}</div>
            <div id="selection-panel" role="tabpanel" aria-labelledby={`tab-${step}`} className="selection-area">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step} initial={{opacity:0,y:reduced?0:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduced?0:-6}} transition={{duration:reduced?0:.16}}>
                  <div className="selection-heading"><span>{step === 'desk' ? 'Select a desk' : step === 'chair' ? 'Select a chair' : 'Add accessories'}</span><span>{step === 'extras' ? `${setup.accessories.length} selected` : 'Choose one'}</span></div>
                  <div className="product-grid">
                    {step === 'desk' && deskIds.map((id) => <ProductCard key={id} id={id} selected={setup.desk === id} period={period} onClick={() => update({...setup,desk:id as DeskId})}/>)}
                    {step === 'chair' && chairIds.map((id) => <ProductCard key={id} id={id} selected={setup.chair === id} period={period} onClick={() => update({...setup,chair:id as ChairId})}/>)}
                    {step === 'extras' && accessoryIds.map((id) => <ProductCard key={id} id={id} selected={setup.accessories.includes(id)} period={period} onClick={() => update(withAccessory(setup,id as AccessoryId))} multiple/>)}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="next-step-row"><span>{step === 'extras' ? 'Add or remove any item' : 'You can change this later'}</span>{activeIndex < 2 ? <button onClick={() => setStep(steps[activeIndex + 1].id)}>Next: {steps[activeIndex + 1].label} <ArrowRight size={16}/></button> : <button onClick={() => setDialog('review')}>Review selection <ArrowRight size={16}/></button>}</div>
            <div className="config-total">
              <div className="rental-row"><strong>Rental period</strong><div className="billing-switch" role="group" aria-label="Rental period"><button aria-pressed={setup.plan === 'week'} className={setup.plan === 'week' ? 'active' : ''} onClick={() => update({...setup,plan:'week'})}>Weekly</button><button aria-pressed={setup.plan === 'month'} className={setup.plan === 'month' ? 'active' : ''} onClick={() => update({...setup,plan:'month'})}>Monthly</button></div></div>
              <div className="total-row"><div><span className="total-caption">Estimated total</span><div className="total-amount">{formatPrice(total)} <small>/ {period}</small></div><span className="total-pieces">{products.length} items</span></div><button className="review-cta" onClick={() => setDialog('review')}>Review my setup <ArrowRight size={18}/></button></div>
              <p className="quote-note">Illustrative prices, not a Monis quote</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer"><span>Independent design concept for Desent Solutions · Not an official Monis checkout</span><div><a href="https://www.monis.rent" target="_blank" rel="noopener noreferrer">monis.rent <ExternalLink size={14}/></a><button onClick={() => setDialog('about')}>About this project</button></div></footer>

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
    <span className="product-image"><ProductArt id={id}/><span className={`card-select ${selected ? 'chosen' : ''}`}>{selected ? <Check size={16}/> : multiple ? '+' : <span className="radio-center"/>}</span></span>
    <span className="card-details"><strong>{item.name}</strong><small>{item.detail}</small><span className="card-bottom"><span><b>{formatPrice(period === 'week' ? item.weekly : item.monthly)}</b><em>/{period}</em></span><span className={`card-action ${selected ? 'selected' : ''}`}>{selected ? 'Selected' : multiple ? 'Add' : 'Choose'}</span></span></span>
  </button>;
}
