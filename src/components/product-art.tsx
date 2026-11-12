import type { AccessoryId, ChairId, DeskId } from '@/lib/catalog';

/** Small, consistent product studies — not misleading stock product photography. */
export function ProductArt({ id }: { id: DeskId | ChairId | AccessoryId }) {
  const isDesk = id === 'electric' || id === 'dual';
  const isChair = id === 'mesh' || id === 'comfort';
  const isScreen = id === 'monitor' || id === 'ultrawide';
  const wide = id === 'ultrawide';
  return (
    <svg viewBox="0 0 220 150" aria-hidden="true" focusable="false" className="product-art">
      <defs>
        <linearGradient id={`metal-${id}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#697174"/><stop offset="1" stopColor="#252d30"/></linearGradient>
        <linearGradient id={`glass-${id}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#32647a"/><stop offset="1" stopColor="#111e29"/></linearGradient>
      </defs>
      <ellipse cx="110" cy="133" rx="82" ry="9" fill="#091b23" opacity=".09"/>
      {isDesk && <g>
        <path d="M42 62L56 64L55 126L43 126Z" fill={`url(#metal-${id})`}/>
        <path d="M164 62L177 65L177 126L165 127Z" fill={`url(#metal-${id})`}/>
        <path d="M49 104L168 102" stroke="#5b6769" strokeWidth="5"/>
        <path d="M23 52L159 47L197 64L59 73Z" fill={id === 'dual' ? '#937b68' : '#c6a98e'}/>
        <path d="M59 73L197 64V70L59 79Z" fill={id === 'dual' ? '#634c3e' : '#a98c72'}/>
        <path d="M23 52L59 73V79L23 58Z" fill={id === 'dual' ? '#806654' : '#b89b80'}/>
        <path d="M42 72v13m135-17v15" stroke="#aeb5b0" strokeWidth="2"/>
      </g>}
      {isChair && <g>
        <path d="M109 104V130M109 126L63 138M109 126L153 138M109 126L107 144" stroke="#4f5b5f" strokeWidth="6" strokeLinecap="round"/>
        <path d="M79 28Q109 12 143 28L139 97Q108 113 83 96Z" fill={id === 'mesh' ? '#374148' : '#a2a09a'} stroke="#343d3f" strokeWidth="4"/>
        <path d="M89 35Q108 25 133 35L129 93Q109 102 92 90Z" fill={id === 'mesh' ? '#69767a' : '#cac8c1'} opacity=".82"/>
        {id === 'mesh' && <path d="M92 37v50m11-53v60m11-58v61m10-60v53" stroke="#9da9a9" opacity=".18" strokeWidth="1"/>}
        <path d="M77 92Q104 104 146 90L157 108Q114 128 67 107Z" fill={id === 'mesh' ? '#414a4b' : '#aaa49a'} stroke="#414749" strokeWidth="3"/>
        <path d="M73 76L56 98L71 112M145 76L166 96L151 109" fill="none" stroke="#505b5e" strokeWidth="6" strokeLinecap="round"/>
      </g>}
      {isScreen && <g>
        <path d="M110 91v30m-29 4h58" stroke="#4b5458" strokeWidth="7" strokeLinecap="round"/>
        <rect x={wide ? 28 : 49} y="24" width={wide ? 164 : 122} height="84" rx="6" fill="#242e32"/>
        <rect x={wide ? 34 : 55} y="30" width={wide ? 152 : 110} height="72" rx="2" fill={`url(#glass-${id})`}/>
        <path d={wide ? 'M34 92Q79 30 123 72T186 48V102H34Z' : 'M55 88Q90 39 116 74T165 50V102H55Z'} fill="#3f829b" opacity=".72"/>
        <path d={wide ? 'M34 90Q94 45 132 70T186 49' : 'M55 88Q104 47 133 72T165 52'} fill="none" stroke="#c0e3e4" strokeWidth="2" opacity=".55"/>
      </g>}
      {id === 'lamp' && <g>
        <path d="M103 126L111 55L144 24" fill="none" stroke="#394448" strokeWidth="8" strokeLinecap="round"/>
        <circle cx="111" cy="55" r="7" fill="#6c7678"/>
        <path d="M131 20Q149 12 163 31L167 43L128 48Z" fill="#6b7979" stroke="#374345" strokeWidth="2"/>
        <path d="M83 129L110 121L135 129L109 138Z" fill="#394448"/>
        <path d="M136 48L166 42L178 91L119 93Z" fill="#f4d787" opacity=".25"/>
      </g>}
      {id === 'keyboard' && <g>
        <path d="M22 92L153 83L181 116L49 128Z" fill="#c7cecc" stroke="#5a6668" strokeWidth="3"/>
        {Array.from({ length: 4 }, (_, row) => Array.from({ length: 10 }, (_, col) => <path key={`${row}-${col}`} d={`M${36 + col * 12 + row * 3} ${95 + row * 6 - col * .75}l7 -0.5`} stroke="#6b7878" strokeWidth="2.3" strokeLinecap="round"/>))}
        <ellipse cx="193" cy="101" rx="12" ry="17" transform="rotate(-12 193 101)" fill="#5f7070"/>
        <path d="M192 88v10" stroke="#b4c3c0" strokeWidth="2"/>
      </g>}
      {id === 'plant' && <g>
        <path d="M80 91H143L135 137H89Z" fill="#ad7c65"/><path d="M83 94H141" stroke="#dba98a" strokeWidth="5"/>
        <path d="M111 97Q90 55 71 35M111 99Q122 56 149 39M110 95Q110 44 111 22" fill="none" stroke="#476c56" strokeWidth="4"/>
        <ellipse cx="77" cy="48" rx="14" ry="32" transform="rotate(-39 77 48)" fill="#4b8161"/>
        <ellipse cx="143" cy="52" rx="14" ry="33" transform="rotate(38 143 52)" fill="#649a73"/>
        <ellipse cx="112" cy="33" rx="14" ry="31" fill="#376e57"/>
        <ellipse cx="94" cy="79" rx="13" ry="23" transform="rotate(-58 94 79)" fill="#91ae79"/>
        <ellipse cx="131" cy="79" rx="12" ry="24" transform="rotate(54 131 79)" fill="#5d9574"/>
      </g>}
    </svg>
  );
}
