'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft, ArrowRight, Check, Code2, LaptopMinimal, Maximize2, Minimize2,
  Monitor, Palette, SlidersHorizontal, Sofa, Wallet,
  type LucideIcon,
} from 'lucide-react';
import { formatPrice, selectedProducts, totalFor, type Setup } from '@/lib/catalog';
import {
  comparisonCopy, matchWorkspace, type FinderAnswers, type Footprint,
  type Priority, type WorkStyle,
} from '@/lib/workspace-finder';
import { WorkspaceScene } from './workspace-scene';

type Choice = { value: string; label: string; description: string; Icon: LucideIcon };
const questions: { eyebrow: string; title: string; subtitle: string; choices: Choice[] }[] = [
  {
    eyebrow: '01 / YOUR WORK',
    title: 'What does your day look like?',
    subtitle: 'We’ll start with the work you do most.',
    choices: [
      { value: 'engineering', label: 'Code & build', description: 'Development, analysis, lots of open tabs', Icon: Code2 },
      { value: 'creative', label: 'Design & create', description: 'Editing, visual work, the big canvas', Icon: Palette },
      { value: 'everyday', label: 'Everyday work', description: 'Calls, planning, documents, and more', Icon: LaptopMinimal },
    ],
  },
  {
    eyebrow: '02 / YOUR SPACE',
    title: 'How much room do you have?',
    subtitle: 'The best desk is the one that fits.',
    choices: [
      { value: 'compact', label: 'A cozy corner', description: 'Apartment, bedroom, smaller studio', Icon: Minimize2 },
      { value: 'roomy', label: 'Room to spread out', description: 'Dedicated workspace, larger surface', Icon: Maximize2 },
    ],
  },
  {
    eyebrow: '03 / YOUR PRIORITY',
    title: 'What matters most?',
    subtitle: 'There’s no wrong choice. We’ll shape the setup around it.',
    choices: [
      { value: 'value', label: 'Keep it practical', description: 'The essentials at a lower total', Icon: Wallet },
      { value: 'screens', label: 'More screen space', description: 'An easier time with multiple windows', Icon: Monitor },
      { value: 'comfort', label: 'All-day comfort', description: 'A more comfortable chair and lighting', Icon: Sofa },
    ],
  },
];

export function WorkspaceFinder({
  current, onApply, onClose,
}: {
  current: Setup;
  onApply: (setup: Setup) => void;
  onClose: () => void;
}) {
  const [stage, setStage] = useState(0);
  const [answers, setAnswers] = useState<FinderAnswers>({ work: 'engineering', space: 'compact', priority: 'value' });
  const heading = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();
  const match = matchWorkspace(answers, current.plan);
  const recommendation = match.setup;
  const question = questions[stage];

  useEffect(() => {
    if (stage > 0) heading.current?.focus();
  }, [stage]);

  function choose(value: string) {
    if (stage === 0) setAnswers((prev) => ({ ...prev, work: value as WorkStyle }));
    if (stage === 1) setAnswers((prev) => ({ ...prev, space: value as Footprint }));
    if (stage === 2) setAnswers((prev) => ({ ...prev, priority: value as Priority }));
    setStage((prev) => Math.min(3, prev + 1));
  }

  return <div className="finder">
    <div className="finder-topline">
      <div className="finder-intro-icon"><SlidersHorizontal size={18}/></div>
      <div><strong>Workspace Finder</strong><span>Three thoughtful questions. Your kind of setup.</span></div>
    </div>
    <div className="finder-progress" aria-label={stage === 3 ? 'Complete' : `Question ${stage + 1} of 3`}>
      <div style={{ width: `${stage === 3 ? 100 : (stage / 3) * 100}%` }}/>
    </div>

    <div className="finder-stage-frame">
      {stage < 3 ? <motion.div key={stage} className="finder-step"
        initial={{ opacity: 1, x: reduceMotion ? 0 : 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
        transition={{ duration: reduceMotion ? 0 : .22 }}>
        <span className="section-label">{question.eyebrow}</span>
        <h2 id="modal-title" tabIndex={-1} ref={heading}>{question.title}</h2>
        <p className="modal-subtitle">{question.subtitle}</p>
        <div className="finder-choices" role="group" aria-label={question.title}>
          {question.choices.map((item) => {
            const Icon = item.Icon;
            return <button type="button" className="finder-choice" key={item.value} onClick={() => choose(item.value)}>
              <span className="finder-choice-icon"><Icon size={23} strokeWidth={1.6}/></span>
              <span><strong>{item.label}</strong><small>{item.description}</small></span>
              <ArrowRight size={18} className="finder-choice-arrow"/>
            </button>;
          })}
        </div>
      </motion.div> : <motion.div key="result" className="finder-result"
        initial={{ opacity: 1, y: reduceMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : .3 }}>
        <span className="section-label">CURATED FOR YOUR WORKDAY</span>
        <h2 id="modal-title" tabIndex={-1} ref={heading}>Meet {match.title}.</h2>
        <p className="modal-subtitle">Not a random bundle. Each choice comes from what you told us.</p>
        <div className="finder-compare">
          <div className="finder-compare-card">
            <span className="finder-card-label">YOUR CURRENT SETUP</span>
            <div className="finder-scene"><WorkspaceScene setup={current}/></div>
            <div className="finder-compare-total"><strong>{formatPrice(totalFor(current))}</strong><small>/{current.plan}</small></div>
          </div>
          <div className="finder-compare-card recommended">
            <span className="finder-card-label"><Check size={12}/> RECOMMENDED</span>
            <div className="finder-scene"><WorkspaceScene setup={recommendation}/></div>
            <div className="finder-compare-total"><strong>{formatPrice(totalFor(recommendation))}</strong><small>/{current.plan}</small></div>
          </div>
        </div>
        <p className="finder-difference">{comparisonCopy(current, recommendation)}</p>
        <h3 className="finder-why-title">Why this fits</h3>
        <div className="finder-reasons">{match.rationale.map((reason) => <div key={reason}><span><Check size={13}/></span><p>{reason}</p></div>)}</div>
        <div className="finder-includes"><span>IN YOUR SETUP</span><p>{selectedProducts(recommendation).map((item) => item.name).join(' · ')}</p></div>
        <button className="official-action finder-apply" onClick={() => onApply(recommendation)}>Build this workspace <ArrowRight size={17}/></button>
        <p className="finder-disclosure">The match is rule-based and transparent. All rental prices are illustrative.</p>
      </motion.div>}
    </div>
    <div className="finder-navigation">
      <button onClick={() => stage ? setStage((prev) => prev - 1) : onClose()}><ArrowLeft size={15}/>{stage === 0 ? 'Back to builder' : stage === 3 ? 'Adjust my answers' : 'Previous question'}</button>
      {stage < 3 && <span>{stage + 1} OF 3</span>}
    </div>
  </div>;
}
