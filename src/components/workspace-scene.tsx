'use client';

import { useId } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Setup } from '@/lib/catalog';

export type DeskHeight = 'sit' | 'stand';
export type Lighting = 'day' | 'evening';

/** One vector stage keeps the visual preview fast, coherent and completely responsive. */
export function WorkspaceScene({ setup, height = 'sit', lighting = 'day' }: {
  setup: Setup;
  height?: DeskHeight;
  lighting?: Lighting;
}) {
  const reduced = useReducedMotion();
  // Multiple previews (e.g. side-by-side comparisons) must not share SVG paint IDs.
  const prefix = useId().replaceAll(':', '');
  const paint = (name: string) => `url(#${prefix}-${name})`;
  const stand = height === 'stand';
  const evening = lighting === 'evening';
  const has = (id: Setup['accessories'][number]) => setup.accessories.includes(id);
  const display = has('ultrawide') ? 'ultrawide' : has('monitor') ? 'monitor' : null;
  const pro = setup.desk === 'dual';
  const mesh = setup.chair === 'mesh';
  const lift = stand ? -58 : 0;
  const transition = { duration: reduced ? 0 : .48, ease: 'easeInOut' as const };
  const entry = { initial: { opacity: 0, y: reduced ? 0 : 9 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: reduced ? 0 : 9 }, transition: { duration: reduced ? 0 : .25 } };

  return (
    <svg viewBox="0 0 900 630" className="workspace-svg" role="img"
      aria-label={`Workspace preview: ${pro ? 'dual motor' : 'electric'} desk at ${height} height, ${mesh ? 'mesh' : 'comfort'} chair, ${setup.accessories.join(', ') || 'no accessories'}, ${lighting} lighting`}>
      <defs>
        <linearGradient id={`${prefix}-studio-wall`} x1="0" x2="0" y1="0" y2="1"><stop stopColor="#fafafa"/><stop offset="1" stopColor="#f0f2f2"/></linearGradient>
        <linearGradient id={`${prefix}-studio-floor`} x1="0" x2=".5" y1="0" y2="1"><stop stopColor="#e9ebec"/><stop offset="1" stopColor="#d9dfe1"/></linearGradient>
        <linearGradient id={`${prefix}-screen-color`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#254f69"/><stop offset=".6" stopColor="#143342"/><stop offset="1" stopColor="#131b2d"/></linearGradient>
        <linearGradient id={`${prefix}-chair-color`} x1="0" x2=".8" y1="0" y2="1"><stop stopColor={mesh ? '#657275' : '#bdc0bc'}/><stop offset="1" stopColor={mesh ? '#323d42' : '#8e9799'}/></linearGradient>
        <linearGradient id={`${prefix}-desktop`} x1="0" x2="1" y1="0" y2="0"><stop stopColor={pro ? '#9c8069' : '#c7b098'}/><stop offset="1" stopColor={pro ? '#705744' : '#aa8b71'}/></linearGradient>
        <filter id={`${prefix}-floor-shadow`} x="-40%" y="-100%" width="180%" height="300%"><feGaussianBlur stdDeviation="20"/></filter>
        <pattern id={`${prefix}-floor-grid`} width="72" height="72" patternUnits="userSpaceOnUse"><path d="M72 0H0V72" fill="none" stroke="#aeb9bb" strokeWidth=".8" opacity=".2"/></pattern>
      </defs>

      <rect width="900" height="630" fill={paint('studio-wall')}/>
      <path d="M0 467L900 425V630H0Z" fill={paint('studio-floor')}/>
      <path d="M0 467L900 425V630H0Z" fill={paint('floor-grid')}/>
      <path d="M0 467L900 425" stroke="#cbd1d3" strokeWidth="2"/>
      <path d="M65 0H300L95 456H0Z" fill="#fff" opacity=".45"/>
      <path d="M672 0H900V345Z" fill="#fff" opacity=".2"/>
      <ellipse cx="456" cy="523" rx="326" ry="45" fill="#243034" opacity=".18" filter={paint('floor-shadow')}/>
      <motion.rect initial={false} width="900" height="630" animate={{ fill: evening ? '#172333' : '#101820', opacity: evening ? .19 : 0 }} transition={transition} pointerEvents="none"/>

      {/* Telescoping legs stay anchored while the desktop lifts. */}
      <path d="M198 484L190 552L220 551L226 484Z" fill="#2e383c"/>
      <path d="M709 462L729 543L756 541L742 458Z" fill="#303a3d"/>
      <motion.path initial={false} data-testid="desk-left-leg" animate={{ d: stand ? 'M195 283L223 287L218 494L194 493Z' : 'M195 341L223 345L218 494L194 493Z' }} transition={transition} fill="#525d61"/>
      <motion.path initial={false} animate={{ d: stand ? 'M698 263L727 276L741 474L716 476Z' : 'M698 321L727 334L741 474L716 476Z' }} transition={transition} fill="#4a565b"/>
      <path d="M222 482L714 462" fill="none" stroke="#495357" strokeWidth="12"/>
      <path d="M190 551h37m502-8h37" stroke="#252d31" strokeWidth="8" strokeLinecap="round"/>

      <motion.g initial={false} animate={{ y: lift }} transition={transition}>
        {/* Desk surfaces share one perspective — switching variant changes proportions and finish. */}
        <motion.path initial={false} animate={{ fill: pro ? '#846a55' : '#b89b81' }} transition={transition}
          d={pro ? 'M103 307L640 260L802 324L257 390Z' : 'M124 310L629 267L779 329L270 390Z'} stroke="#75665d" strokeWidth="1.5"/>
        <path d={pro ? 'M257 390L802 324V342L257 409Z' : 'M270 390L779 329V344L270 407Z'} fill={pro ? '#604e3f' : '#9b806c'}/>
        <path d={pro ? 'M103 307L257 390V409L103 326Z' : 'M124 310L270 390V407L124 325Z'} fill={pro ? '#8f7661' : '#ad927d'}/>
        <path d="M164 310L625 275" stroke="#fff" strokeWidth="2.2" opacity=".28"/>
        <path d="M293 385L741 330" stroke="#f1d8b9" strokeWidth="1.3" opacity=".22"/>

        <AnimatePresence initial={false}>
          {display && <motion.g key={display} {...entry}>
            <ellipse cx="473" cy="319" rx="57" ry="11" fill="#1b292c" opacity=".16"/>
            <path d="M468 268l9 -3l8 58l-13 2Z" fill="#4a555c"/>
            <path d="M433 322L501 312L522 326L445 335Z" fill="#3c474c"/>
            {display === 'ultrawide' ? <>
              <path d="M284 143Q454 125 640 134Q651 135 651 148L656 271Q655 283 641 290L294 308Q280 310 279 296L271 158Q271 146 284 143Z" fill="#1e282e"/>
              <path d="M286 155Q461 139 636 147L641 275L293 295Z" fill={paint('screen-color')}/>
              <path d="M294 282Q365 177 454 233T637 169V277L294 295Z" fill="#317390" opacity=".72"/>
              <path d="M298 270Q405 180 468 224T636 175" stroke="#a7d5e4" strokeWidth="3" opacity=".6" fill="none"/>
            </> : <>
              <path d="M329 145L608 130Q620 129 620 141L627 290Q627 302 613 304L339 322Q327 323 326 311L317 160Q317 149 329 145Z" fill="#202b30"/>
              <path d="M331 158L608 143L615 290L342 308Z" fill={paint('screen-color')}/>
              <path d="M340 287Q416 192 472 236T610 181V290L343 306Z" fill="#276a87" opacity=".74"/>
              <path d="M344 281Q417 214 474 244T611 182" stroke="#afd8e1" strokeWidth="3" opacity=".56" fill="none"/>
            </>}
            <circle cx="480" cy="302" r="2" fill="#a4b0ad"/>
          </motion.g>}
          {has('lamp') && <motion.g key="lamp" {...entry}>
            <ellipse cx="683" cy="335" rx="36" ry="9" fill="#3a4342" opacity=".17"/>
            <path d="M685 328L683 215L726 169" stroke="#3d474a" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <circle cx="683" cy="216" r="8" fill="#758285"/>
            <path d="M707 162Q731 150 752 174L756 190L704 198Z" fill="#69777b" stroke="#333d40" strokeWidth="2"/>
            <path d="M660 332L704 322L733 334L690 342Z" fill="#3f4c4f"/>
            <path d="M710 199L757 190L786 291L671 307Z" fill="#ffe0a0" opacity={evening ? '.3' : '.13'}/>
          </motion.g>}
          {has('plant') && <motion.g key="plant" {...entry}>
            <ellipse cx="243" cy="349" rx="35" ry="8" fill="#55564c" opacity=".14"/>
            <path d="M219 304L275 300L267 351Q246 362 228 348Z" fill="#ad8069"/>
            <path d="M222 306L273 302" stroke="#dfb095" strokeWidth="3"/>
            <path d="M246 305Q227 259 207 242M246 305Q262 260 288 239M246 305Q248 247 246 226" stroke="#44684d" strokeWidth="4" fill="none"/>
            <ellipse cx="214" cy="250" rx="12" ry="29" transform="rotate(-40 214 250)" fill="#548465"/>
            <ellipse cx="277" cy="254" rx="12" ry="29" transform="rotate(40 277 254)" fill="#6b9874"/>
            <ellipse cx="247" cy="237" rx="12" ry="33" fill="#3d7659"/>
            <ellipse cx="227" cy="277" rx="10" ry="22" transform="rotate(-54 227 277)" fill="#8fac7b"/>
            <ellipse cx="266" cy="277" rx="10" ry="22" transform="rotate(55 266 277)" fill="#649574"/>
          </motion.g>}
          {has('keyboard') && <motion.g key="keyboard" {...entry}>
            <path d="M376 347L530 329L557 349L393 371Z" fill="#c8cfce" stroke="#838d8f" strokeWidth="2"/>
            {Array.from({ length: 3 }, (_, row) => Array.from({ length: 11 }, (_, col) => <path key={`${row}-${col}`} d={`M${390 + col * 12 + row * 2} ${349 + row * 6 - col * 1.18}l7 -.9`} stroke="#69777a" strokeWidth="2" strokeLinecap="round"/>))}
            <ellipse cx="593" cy="345" rx="15" ry="8" transform="rotate(-12 593 345)" fill="#a8b3b1"/>
          </motion.g>}
        </AnimatePresence>
      </motion.g>

      {/* Chair stays grounded independently of sit / stand controls. */}
      <ellipse cx="458" cy="572" rx="107" ry="20" fill="#1b252b" opacity=".12"/>
      <path d="M457 473L466 556" stroke="#465156" strokeWidth="16" strokeLinecap="round"/>
      <path d="M465 554L390 577M465 554L543 571M465 554L470 591" stroke="#414c50" strokeWidth="12" strokeLinecap="round"/>
      <circle cx="390" cy="577" r="7" fill="#30383b"/><circle cx="543" cy="571" r="7" fill="#30383b"/><circle cx="470" cy="591" r="7" fill="#30383b"/>
      <motion.path initial={false} d="M363 324Q352 294 379 284Q428 262 477 289Q502 302 507 338L517 459Q520 480 494 494Q442 506 394 482Q379 475 375 459Z"
        animate={{ fill: mesh ? '#354146' : '#a7aaa5' }} transition={transition} stroke="#374247" strokeWidth="4"/>
      <motion.path initial={false} d="M382 323Q390 306 418 297Q461 293 482 320L494 459Q447 477 394 460Z" animate={{ fill: mesh ? '#677679' : '#caccc6' }} transition={transition} opacity=".72"/>
      {mesh && <g stroke="#b4c2c0" opacity=".16" strokeWidth="1.1"><path d="M405 306v158M424 301v166M444 301v169M462 308v156"/></g>}
      <motion.path initial={false} d="M369 459Q425 476 503 458L541 487Q496 517 412 513L361 482Q347 469 369 459Z" animate={{ fill: mesh ? '#3b484d' : '#a1a6a1' }} transition={transition} stroke="#313c41" strokeWidth="3"/>
      <motion.path initial={false} d="M375 467Q442 490 501 469L520 489Q467 501 418 497Z" animate={{ fill: mesh ? '#657276' : '#c1c4bd' }} transition={transition}/>
      <path d="M374 396L344 435L361 469M504 396L544 432L525 481" stroke="#485357" strokeWidth="11" fill="none" strokeLinecap="round"/>
      <path d="M332 438L368 443M525 431L560 441" stroke="#657378" strokeWidth="10" strokeLinecap="round"/>
      <motion.rect initial={false} width="900" height="630" animate={{ fill: '#0b1d36', opacity: evening ? .13 : 0 }} transition={transition} pointerEvents="none"/>
    </svg>
  );
}
