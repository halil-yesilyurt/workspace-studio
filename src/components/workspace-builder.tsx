'use client';

import { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, CircleHelp, Plus, RotateCcw, X } from 'lucide-react';
import { accessories, chairs, desks, formatPrice, initialSetup, selectedProducts, totalFor, type AccessoryId, type CategoryId, type ChairId, type DeskId, type PlanId, type Setup } from '@/lib/catalog';
import { WorkspaceScene } from './workspace-scene';

const STORAGE = 'workspace-studio:v1';
const categories: { id: CategoryId; number: string; label: string }[] = [
  { id: 'desk', number: '01', label: 'Desk' },
  { id: 'chair', number: '02', label: 'Chair' },
  { id: 'extras', number: '03', label: 'Finishing touches' },
];

function isSetup(value: unknown): value is Setup {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<Setup>;
  return typeof candidate.desk === 'string' && candidate.desk in desks && typeof candidate.chair === 'string' && candidate.chair in chairs && Array.isArray(candidate.accessories) && candidate.accessories.every((id) => id in accessories) && (candidate.plan === 'week' || candidate.plan === 'month');
}

export function WorkspaceBuilder() {
  const [setup, setSetup] = useState<Setup>(initialSetup);
  const [category, setCategory] = useState<CategoryId>('desk');
  const [showReview, setShowReview] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const reduced = useReducedMotion();
  const id = useId();

  useEffect(() => {
    try { const saved = localStorage.getItem(STORAGE); if (saved) { const parsed: unknown = JSON.parse(saved); if (isSetup(parsed)) setSetup(parsed); } } catch { /* Ignore malformed local storage. */ }
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(STORAGE, JSON.stringify(setup)); }, [setup, loaded]);
  useEffect(() => {
    if (!showReview && !showInfo) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') { setShowReview(false); setShowInfo(false); } };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [showReview, showInfo]);

  const changeDesk = (desk: DeskId) => setSetup((current) => ({ ...current, desk }));
  const changeChair = (chair: ChairId) => setSetup((current) => ({ ...current, chair }));
  const toggleExtra = (id: AccessoryId) => setSetup((current) => ({ ...current, accessories: current.accessories.includes(id) ? current.accessories.filter((item) => item !== id) : [...current.accessories, id] }));
  const reset = () => { setSetup(initialSetup); setCategory('desk'); };
  const period = setup.plan === 'month' ? 'month' : 'week';
  const products = selectedProducts(setup);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a href="#top" className="wordmark" aria-label="Workspace Studio, home"><span className="brand-icon"><span/><span/><span/></span><span>workspace<span className="brand-muted">studio.</span></span></a>
        <span className="topbar-note"><span className="availability-dot"/> Made for wherever work takes you</span>
        <button className="text-button about-button" onClick={() => setShowInfo(true)}>About this concept <CircleHelp size={16}/></button>
      </header>

      <main id="top" className="main-layout">
        <section className="visual-side" aria-labelledby="hero-title">
          <div className="editorial-intro"><div className="eyebrow"><span className="small-line"/> THE WORKSPACE EDITION <span className="eyebrow-index">/ 001</span></div><h1 id="hero-title">Good work starts<br/>with a <em>good space.</em></h1><p>Build a little corner of the world that feels like yours. Pick the pieces, find your flow, and settle in.</p></div>
          <div className="scene-container">
            <div className="scene-topline"><span><span className="scene-indicator"/> YOUR SPACE, IN THE MAKING</span><span className="scene-counter">01 — 03</span></div>
            <WorkspaceScene setup={setup}/>
            <div className="scene-bottomline"><span>Thoughtfully put together, by you.</span><button onClick={reset} className="reset-button" title="Reset your setup"><RotateCcw size={14}/> Start fresh</button></div>
          </div>
          <div className="bottom-proof"><div className="proof-symbol">✳</div><span>Work from Bali. Feel at home anywhere.</span><span className="proof-right">An independent concept inspired by <a href="https://monis.rent" target="_blank" rel="noopener noreferrer">monis.rent ↗</a></span></div>
        </section>

        <section className="config-side" aria-labelledby="config-title">
          <div className="panel-heading"><div><div className="eyebrow panel-eyebrow">THE PERSONAL SETUP</div><h2 id="config-title">Make it yours<span className="period">.</span></h2><p>Every detail counts. Let’s find your perfect fit.</p></div><span className="panel-number">01 / 03</span></div>
          <nav className="category-nav" aria-label="Workspace components">{categories.map((item) => <button key={item.id} onClick={() => setCategory(item.id)} className={`category-button ${category === item.id ? 'active' : ''}`} aria-current={category === item.id ? 'step' : undefined}><span className="category-index">{item.number}</span><span>{item.label}</span></button>)}</nav>
          <div className="option-area"><AnimatePresence mode="wait" initial={false}>
            {category === 'desk' && <motion.div key="desk" className="options-panel" initial={{opacity:0,y:reduced?0:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduced?0:-8}} transition={{duration:reduced?0:0.22}}><div className="option-intro"><h3>First, your foundation.</h3><p>A desk that makes room for everything ahead.</p></div><div className="option-list">{(Object.keys(desks) as DeskId[]).map((id) => <button key={id} className={`product-option ${setup.desk === id ? 'selected' : ''}`} onClick={() => changeDesk(id)} aria-pressed={setup.desk === id}><span className={`product-thumb desk-thumb ${id}`}><span className="mini-desk"/></span><span className="product-copy"><strong>{desks[id].name}</strong><small>{desks[id].detail}</small><small className="product-tag">{desks[id].tag}</small></span><span className="option-edge"><span className="product-price">{formatPrice(setup.plan === 'month' ? desks[id].monthly : desks[id].weekly)}<small>/{period}</small></span><span className="choose-circle">{setup.desk === id && <Check size={14}/>}</span></span></button>)}</div></motion.div>}
            {category === 'chair' && <motion.div key="chair" className="options-panel" initial={{opacity:0,y:reduced?0:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduced?0:-8}} transition={{duration:reduced?0:0.22}}><div className="option-intro"><h3>Take a good seat.</h3><p>Comfort that keeps up with your best ideas.</p></div><div className="option-list">{(Object.keys(chairs) as ChairId[]).map((id) => <button key={id} className={`product-option ${setup.chair === id ? 'selected' : ''}`} onClick={() => changeChair(id)} aria-pressed={setup.chair === id}><span className={`product-thumb chair-thumb ${id}`}><span className="mini-chair"><span/></span></span><span className="product-copy"><strong>{chairs[id].name}</strong><small>{chairs[id].detail}</small><small className="product-tag">{chairs[id].tag}</small></span><span className="option-edge"><span className="product-price">{formatPrice(setup.plan === 'month' ? chairs[id].monthly : chairs[id].weekly)}<small>/{period}</small></span><span className="choose-circle">{setup.chair === id && <Check size={14}/>}</span></span></button>)}</div></motion.div>}
            {category === 'extras' && <motion.div key="extras" className="options-panel" initial={{opacity:0,y:reduced?0:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduced?0:-8}} transition={{duration:reduced?0:0.22}}><div className="option-intro"><h3>It's the little things.</h3><p>Personal touches that make your space feel right.</p></div><div className="option-list extras-list">{(Object.keys(accessories) as AccessoryId[]).map((id) => { const selected = setup.accessories.includes(id); return <button key={id} className={`product-option extra-option ${selected ? 'selected' : ''}`} onClick={() => toggleExtra(id)} aria-pressed={selected}><span className={`product-thumb accessory-thumb ${id}`}><AccessoryGlyph id={id}/></span><span className="product-copy"><strong>{accessories[id].name}</strong><small>{accessories[id].detail}</small></span><span className="option-edge"><span className="product-price">{formatPrice(setup.plan === 'month' ? accessories[id].monthly : accessories[id].weekly)}<small>/{period}</small></span><span className="choose-circle">{selected ? <Check size={14}/> : <Plus size={14}/>}</span></span></button>; })}</div></motion.div>}
          </AnimatePresence></div>
          <div className="config-footer"><div className="period-row"><div><span className="period-heading">Rental duration</span><span className="period-description">Stay as long as you like.</span></div><div className="segment" role="group" aria-label="Rental period"><button className={setup.plan === 'week' ? 'chosen' : ''} onClick={() => setSetup((s) => ({...s, plan:'week'}))} aria-pressed={setup.plan === 'week'}>Weekly</button><button className={setup.plan === 'month' ? 'chosen' : ''} onClick={() => setSetup((s) => ({...s, plan:'month'}))} aria-pressed={setup.plan === 'month'}>Monthly</button></div></div><div className="summary-bar"><div><span className="summary-label">Your estimated total <span className="estimate-info" title="Illustrative prices, not a live Monis quote">ⓘ</span></span><div className="total-price">{formatPrice(totalFor(setup))}<span> / {period}</span></div><small>{products.length} pieces in your setup</small></div><button className="primary-button" onClick={() => setShowReview(true)}>Review my space <ArrowRight size={18}/></button></div><div className="fine-print">Concept pricing only. No payment is collected here.</div></div>
        </section>
      </main>

      <AnimatePresence>{(showReview || showInfo) && <motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.2}} onMouseDown={(event) => { if (event.target === event.currentTarget) {setShowReview(false);setShowInfo(false);} }}>
        <motion.section role="dialog" aria-modal="true" aria-labelledby={`${id}-dialog-title`} className="review-modal" initial={{opacity:0,y:reduced?0:30,scale:reduced?1:0.985}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:reduced?0:15}} transition={{duration:reduced?0:0.3}}>
          <button className="close-button" onClick={() => {setShowReview(false);setShowInfo(false);}} aria-label="Close dialog"><X size={20}/></button>
          {showReview ? <><div className="modal-eyebrow">YOUR SPACE, ALL TOGETHER</div><h2 id={`${id}-dialog-title`}>Looks like you<span className="period">.</span></h2><p className="modal-lede">Here’s the setup you’ve put together. Just right for getting things done.</p><div className="review-preview"><WorkspaceScene setup={setup}/></div><div className="review-list">{products.map((product) => <div className="review-line" key={product.id}><span><CheckCircle2 size={16}/> {product.name}</span><strong>{formatPrice(setup.plan === 'month' ? product.monthly : product.weekly)}</strong></div>)}</div><div className="review-total"><span>Estimated {period}ly total</span><strong>{formatPrice(totalFor(setup))}<small> / {period}</small></strong></div><div className="checkout-disclaimer">This is a design concept, not a live rental service. Prices are illustrative. To browse actual equipment and place a real order, use the official Monis website.</div><a className="primary-button modal-cta" href="https://monis.rent" target="_blank" rel="noopener noreferrer">Explore Monis rentals <ArrowRight size={18}/></a><button className="return-link" onClick={() => setShowReview(false)}><ArrowLeft size={15}/> Keep designing</button></> : <><div className="modal-eyebrow">THE IDEA BEHIND THE SPACE</div><h2 id={`${id}-dialog-title`}>A better way to build your workspace.</h2><p className="modal-lede">No endless product grids. Just a space that takes shape as you choose what feels right.</p><div className="about-details"><p>Workspace Studio is an independent interactive prototype made for a frontend development challenge at Desent Solutions. It takes inspiration from Monis, a Bali-based equipment rental service.</p><p>Every piece is rendered in one handcrafted illustration, so you can see the full setup evolve as you explore. The prices are sample figures, not live quotes, and this demo never takes orders or payments.</p></div><button className="primary-button modal-cta" onClick={() => setShowInfo(false)}>Back to my workspace <ArrowRight size={18}/></button></>}
        </motion.section>
      </motion.div>}</AnimatePresence>
    </div>
  );
}

function AccessoryGlyph({ id }: { id: AccessoryId }) {
  if (id === 'monitor') return <span className="mini-monitor"/>;
  if (id === 'lamp') return <span className="mini-lamp"/>;
  if (id === 'plant') return <span className="mini-plant">✳</span>;
  return <span className="mini-keyboard"/>;
}
