// Purpose-built vector illustration; not a validated marking application.
module.exports = `<svg viewBox="0 0 600 160" role="img" aria-label="Stainless steel surgical scalpel illustration">
<defs><linearGradient id="scalpel-steel" x2="0" y2="1"><stop stop-color="#a1a9af"/><stop offset=".22" stop-color="#eef1f2"/><stop offset=".48" stop-color="#c5cbd0"/><stop offset=".6" stop-color="#f8fafb"/><stop offset="1" stop-color="#7f8992"/></linearGradient><linearGradient id="scalpel-blade" x2=".2" y2="1"><stop stop-color="#f9fbfc"/><stop offset=".5" stop-color="#d4dce0"/><stop offset="1" stop-color="#929fa7"/></linearGradient><filter id="scalpel-shadow" x="-20%" y="-100%" width="150%" height="300%"><feDropShadow dx="0" dy="9" stdDeviation="6" flood-color="#273442" flood-opacity=".2"/></filter></defs>
<g transform="translate(17 8) rotate(-10 280 75)" filter="url(#scalpel-shadow)">
<path d="M30 66 Q9 67 9 80 Q9 94 30 95 L350 91 L405 83 L405 70 L350 65 Z" fill="url(#scalpel-steel)" stroke="#929ba3" stroke-width="1"/>
<path d="M352 68 L408 68 L418 54 L560 54 Q533 80 490 86 L401 85 L350 85 Z" fill="url(#scalpel-blade)" stroke="#9ca6ad"/>
<path d="M416 58 L552 58 Q524 78 486 82 L414 82" fill="none" stroke="#ffffff" stroke-width="1.5"/>
<rect x="394" y="69" width="50" height="7" rx="3.5" fill="#7f8b94"/><path d="M401 70 H439" stroke="#e8edf0"/>
${Array.from({length:19},(_,i)=>`<path d="M${211+i*6} 68 l-4 21" stroke="#818c95" stroke-opacity=".65"/><path d="M${213+i*6} 68 l-4 21" stroke="#f3f6f7"/>`).join('')}
<path d="M26 71 L195 71 M26 89 L195 89" stroke="#fff" stroke-opacity=".6"/>
<text x="51" y="83" font-family="Arial,sans-serif" font-size="7" letter-spacing="2" fill="#78848d">STAINLESS · No. 3</text>
<rect x="170" y="76" width="6" height="6" rx="1" fill="#5e6870"/>
<circle class="device-mark-pulse" cx="173" cy="79" r="9" fill="none" stroke="#ac7741" stroke-width="2"/><circle class="device-mark-dot" cx="173" cy="79" r="3.5" fill="#ac7741"/><circle cx="173" cy="79" r="14" fill="none" stroke="#aa835b" stroke-width="1.2"/>
</g></svg>`;
