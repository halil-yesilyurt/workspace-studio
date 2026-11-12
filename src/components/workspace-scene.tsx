'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { Setup } from '@/lib/catalog';

const animated = { initial: { opacity: 0, y: 7 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 7 }, transition: { duration: 0.3 } };

export function WorkspaceScene({ setup }: { setup: Setup }) {
  const reduceMotion = useReducedMotion();
  const has = (id: string) => setup.accessories.includes(id as Setup['accessories'][number]);
  const darkDesk = setup.desk === 'walnut';
  const darkChair = setup.chair === 'graphite';
  const woodTop = darkDesk ? '#755541' : '#d3b18d';
  const woodEdge = darkDesk ? '#523b2f' : '#b38b68';
  const chairMain = darkChair ? '#53605b' : '#b7a797';
  const chairLight = darkChair ? '#75817b' : '#d3c5b5';
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.42, ease: 'easeInOut' as const };

  return (
    <svg className="workspace-svg" viewBox="0 0 900 650" role="img" aria-label={`Illustrated workspace with ${setup.desk} desk, ${setup.chair} chair and ${setup.accessories.join(', ') || 'no accessories'}`}>
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#eeeadf"/><stop offset="1" stopColor="#e2dfd1"/></linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d8d3c4"/><stop offset="1" stopColor="#c7c3b4"/></linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#3c514b"/><stop offset="1" stopColor="#1c302e"/></linearGradient>
        <filter id="softShadow" x="-40%" y="-60%" width="180%" height="220%"><feGaussianBlur stdDeviation="16"/></filter>
        <pattern id="grain" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="1" cy="2" r="0.45" fill="#fff" opacity=".28"/></pattern>
      </defs>
      <path d="M0 0H900V441L0 496Z" fill="url(#wall)"/>
      <path d="M0 496L900 441V650H0Z" fill="url(#floor)"/>
      <path d="M0 496L900 441" stroke="#c3bfb1" strokeWidth="3"/>
      <path d="M70 550L845 497M0 613L900 553" stroke="#c0bbaa" strokeWidth="1" opacity=".32"/>
      <path d="M240 491L155 650M550 461L610 650M790 451L900 615" stroke="#bcb7a9" strokeWidth="1" opacity=".22"/>
      {/* Light falling in from the window */}
      <path d="M120 0H510L390 444L35 465Z" fill="#fffef5" opacity=".13"/>
      <g opacity=".78"><rect x="637" y="72" width="162" height="194" rx="3" fill="#c7c5b6"/><rect x="646" y="81" width="144" height="176" fill="#e4e7dc"/><path d="M718 81V257M646 169H790" stroke="#c8cfc5" strokeWidth="8"/><path d="M648 230Q688 205 721 235T789 229V257H648" fill="#a7b6a6" opacity=".5"/><path d="M648 234Q680 223 715 245T789 223V257H648" fill="#8c9d8d" opacity=".45"/></g>
      {/* Wall art */}
      <g><rect x="112" y="101" width="144" height="172" fill="#aea99a" opacity=".25"/><rect x="119" y="94" width="144" height="172" fill="#f8f4e9" stroke="#a59a84" strokeWidth="6"/><circle cx="187" cy="162" r="32" fill="#d4b693"/><path d="M136 246L169 178L197 207L219 167L246 246Z" fill="#829281"/><path d="M136 246L186 207L212 225L246 194V246Z" fill="#5f7569"/></g>
      <ellipse cx="468" cy="554" rx="307" ry="48" fill="#4b493f" opacity=".13" filter="url(#softShadow)"/>
      {/* Desk lower frame */}
      <motion.g animate={{ opacity: 1 }} transition={transition}>
        <path d="M192 340L226 347L216 556L184 559Z" fill="#777871"/><path d="M211 367L226 365L216 556L205 559Z" fill="#585e59"/>
        <path d="M696 318L726 327L748 525L716 530Z" fill="#6b706a"/><path d="M715 349L728 354L748 525L735 529Z" fill="#555b56"/>
        <path d="M218 469L721 444" stroke="#787d76" strokeWidth="12"/>
      </motion.g>
      {/* Desk surface */}
      <motion.g animate={{ fill: woodTop }} transition={transition}>
        <path d="M137 323L638 275L783 339L275 397Z" fill={woodTop} stroke={woodEdge} strokeWidth="2"/>
      </motion.g>
      <motion.path d="M275 397L783 339V354L275 412Z" animate={{ fill: woodEdge }} transition={transition}/>
      <motion.path d="M137 323L275 397V412L137 336Z" animate={{ fill: darkDesk ? '#694833' : '#c49c76' }} transition={transition}/>
      <path d="M166 327L641 283" stroke="#fff9ed" strokeWidth="2" opacity=".35"/>
      {/* Desk items behind chair */}
      {has('monitor') && <motion.g {...animated} transition={transition}>
        <ellipse cx="473" cy="333" rx="66" ry="12" fill="#292e2b" opacity=".13"/>
        <path d="M469 282L481 279L485 333L471 334Z" fill="#5d6562"/><path d="M432 330L511 321L527 333L448 342Z" fill="#646a66"/>
        <path d="M330 151L614 132Q623 132 624 141L632 299Q632 306 622 307L339 329Q329 329 328 319L320 162Q320 153 330 151Z" fill="#303b38"/>
        <path d="M336 163L607 145L615 293L344 314Z" fill="url(#glass)"/>
        <path d="M344 314L615 293" stroke="#8c9690" strokeWidth="2"/>
        <path d="M337 161L608 144L608 152L337 170Z" fill="#71847a" opacity=".3"/>
        <path d="M361 281Q426 192 488 238T608 175V292L349 307Z" fill="#537b70" opacity=".65"/>
        <path d="M346 280Q409 214 462 249T612 191" stroke="#d2d7bd" strokeWidth="3" fill="none" opacity=".45"/>
        <circle cx="478" cy="305" r="2" fill="#abb2a9"/>
      </motion.g>}
      {has('lamp') && <motion.g {...animated} transition={transition}>
        <ellipse cx="685" cy="337" rx="28" ry="8" fill="#6d6b5d" opacity=".3"/>
        <path d="M681 327L681 223L724 178" stroke="#676962" strokeWidth="9" fill="none" strokeLinecap="round"/>
        <circle cx="681" cy="222" r="8" fill="#8f9389"/>
        <path d="M710 162Q734 151 751 174L755 189L709 194Z" fill="#e9ddc4" stroke="#a99f8a" strokeWidth="2"/>
        <path d="M688 329L710 321L728 330L705 340Z" fill="#696f69"/>
        <path d="M712 195L759 188L782 290L673 304Z" fill="#fff4c8" opacity=".18"/>
      </motion.g>}
      {has('plant') && <motion.g {...animated} transition={transition}>
        <ellipse cx="251" cy="345" rx="31" ry="9" fill="#5a554c" opacity=".13"/>
        <path d="M226 302L277 298L270 349Q251 359 235 347Z" fill="#b77355"/>
        <path d="M229 307L275 302" stroke="#e5a083" strokeWidth="3"/>
        <path d="M250 304Q232 261 213 240M250 305Q266 267 291 239M251 299Q250 250 250 227" stroke="#526d4e" strokeWidth="4" fill="none"/>
        <ellipse cx="218" cy="253" rx="12" ry="28" transform="rotate(-42 218 253)" fill="#567b5e"/>
        <ellipse cx="280" cy="256" rx="12" ry="29" transform="rotate(38 280 256)" fill="#739375"/>
        <ellipse cx="251" cy="238" rx="12" ry="32" fill="#486e58"/>
        <ellipse cx="232" cy="277" rx="10" ry="23" transform="rotate(-58 232 277)" fill="#8a9c73"/>
        <ellipse cx="268" cy="279" rx="10" ry="22" transform="rotate(48 268 279)" fill="#5e8163"/>
      </motion.g>}
      {has('keyboard') && <motion.g {...animated} transition={transition}>
        <path d="M368 347L536 328L563 348L388 371Z" fill="#eae7dc" stroke="#b5b8ad" strokeWidth="2"/>
        {Array.from({ length: 4 }, (_, row) => Array.from({ length: 12 }, (_, col) => <path key={`${row}-${col}`} d={`M${383 + col * 13 + row * 2} ${349 + row * 5 - col * 1.32}l8 -1`} stroke="#9aa49c" strokeWidth="2.2" strokeLinecap="round"/>))}
        <ellipse cx="600" cy="350" rx="13" ry="7" transform="rotate(-10 600 350)" fill="#e5e2d9"/>
      </motion.g>}
      {/* Chair in foreground */}
      <ellipse cx="475" cy="566" rx="116" ry="22" fill="#514f43" opacity=".13"/>
      <path d="M463 470L471 554" stroke="#626660" strokeWidth="17" strokeLinecap="round"/>
      <path d="M470 551L390 579M470 551L549 567M470 551L474 594" stroke="#656b65" strokeWidth="12" strokeLinecap="round"/>
      <circle cx="387" cy="580" r="8" fill="#4c524e"/><circle cx="550" cy="567" r="8" fill="#4c524e"/><circle cx="474" cy="596" r="8" fill="#4c524e"/>
      <motion.path d="M363 324Q355 300 378 291Q422 271 472 290Q509 302 509 335L518 459Q520 483 495 492Q438 509 393 482Q378 477 376 457Z" animate={{ fill: chairMain }} transition={transition} stroke="#424c47" strokeWidth="3"/>
      <motion.path d="M380 324Q385 304 418 300Q461 294 488 317L498 459Q447 479 394 461Z" animate={{ fill: chairLight }} transition={transition} opacity=".75"/>
      <path d="M422 307Q433 361 433 466" stroke="#fff" strokeWidth="2" opacity=".12" fill="none"/>
      <motion.path d="M368 457Q421 476 505 455L540 490Q495 523 412 514L359 482Q348 472 368 457Z" animate={{ fill: chairMain }} transition={transition} stroke="#424c47" strokeWidth="3"/>
      <motion.path d="M374 468Q443 491 505 467L521 489Q472 507 417 500Z" animate={{ fill: chairLight }} transition={transition} opacity=".65"/>
      <path d="M375 397L345 435L362 470M505 398L544 431L527 481" stroke="#545d56" strokeWidth="12" fill="none" strokeLinecap="round"/>
      <path d="M331 436L369 443M524 432L559 441" stroke="#737c74" strokeWidth="10" strokeLinecap="round"/>
      <rect width="900" height="650" fill="url(#grain)" opacity=".16" pointerEvents="none"/>
    </svg>
  );
}
