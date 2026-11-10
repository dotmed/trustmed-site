// Unbranded editorial illustration inspired by the ETHICON 4000's form.
// Reference: https://www.jnjmedtech.com/en-US/products/surgery/surgical-staplers/ethicon-4000-stapler-system/
// This depicts a potential device category, not a validated integration or endorsement.
module.exports=`<svg viewBox="0 0 600 160" role="img" aria-label="Powered surgical stapler illustration with articulated blue jaws and a molded handle">
<defs>
<linearGradient id="stapler-shell" x1="0" y1="0" x2="1" y2=".7"><stop stop-color="#fff"/><stop offset=".42" stop-color="#eff2f4"/><stop offset=".75" stop-color="#c6cfd5"/><stop offset="1" stop-color="#f7f9fa"/></linearGradient>
<linearGradient id="stapler-shaft" x2="0" y2="1"><stop stop-color="#707c85"/><stop offset=".3" stop-color="#edf3f7"/><stop offset=".5" stop-color="#a5b0b9"/><stop offset=".8" stop-color="#63707b"/><stop offset="1" stop-color="#d8e0e5"/></linearGradient>
<linearGradient id="stapler-blue" x2="0" y2="1"><stop stop-color="#99c2ec"/><stop offset=".45" stop-color="#6399d5"/><stop offset="1" stop-color="#2b5e99"/></linearGradient>
<linearGradient id="stapler-collar" x2="0" y2="1"><stop stop-color="#747f87"/><stop offset=".45" stop-color="#34404b"/><stop offset="1" stop-color="#697681"/></linearGradient>
<filter id="stapler-shadow" x="-20%" y="-40%" width="150%" height="190%"><feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#233749" flood-opacity=".2"/></filter>
</defs>
<g filter="url(#stapler-shadow)">
<!-- Shaft meets an articulated, open cartridge at the left. -->
<path d="M151 100 427 50l4 17-278 49Z" fill="url(#stapler-shaft)" stroke="#7d8994" stroke-width=".7"/>
<path d="m161 102 263-47" stroke="#f3f8fc" stroke-width="1.5"/>
<path d="m137 99 19-3 7 19-19 4-10-9Z" fill="url(#stapler-collar)" stroke="#5f6d79"/>
<path d="m140 101-24-12-89-9q-6 0-8 7l99 12 21 14Z" fill="url(#stapler-shaft)" stroke="#87939c"/>
<path d="m139 112-24 12-94 10q-8 2-6 8l10 4 96-12 24-15Z" fill="url(#stapler-blue)" stroke="#4675a9"/>
<path d="m27 137 92-11" stroke="#c8e1fb" stroke-width="1.5"/>
${Array.from({length:17},(_,i)=>`<path d="m${29+i*5} ${134-i*.58} 1.5 3m1-5 1.5 3" stroke="#285282" stroke-width="1.2"/>`).join('')}
<path d="m126 101 11 3 5 10-12 7-7-6Z" fill="#35434f"/>
<!-- Sculpted drive body, rotation collar, trigger and powered hand grip. -->
<path d="M424 46q12-25 39-29l61 1q24 5 25 26l-2 24q-4 17-30 18l-55-4-29-12Z" fill="url(#stapler-shell)" stroke="#b4bfc7"/>
<path d="m478 76 47 3-8 61q-1 13-17 13l-15-3q-9-3-8-15Z" fill="url(#stapler-shell)" stroke="#b4bfc7"/>
<path d="m477 77-12 8-13 49q-2 8 6 9l10-2 13-48Z" fill="#d8e0e5" stroke="#aab8c2"/>
<path d="m477 88-10 39" stroke="#f9fbfc" stroke-width="3"/>
<path d="m416 40 12 1 8-10 10 7 12-2 5 11 11 5-3 12 2 12-13 5-7 11-12-4-12 1-5-12-11-5 4-13Z" fill="url(#stapler-collar)" stroke="#64717b"/>
<ellipse cx="426" cy="61" rx="14" ry="20" fill="url(#stapler-collar)" stroke="#8a969f"/>
<ellipse cx="423" cy="61" rx="8" ry="13" fill="#566570" stroke="#a0adb6"/>
<path d="m481 25 39 1q15 1 17 13" fill="none" stroke="#fff" stroke-width="3"/>
<rect x="501" y="44" width="24" height="9" rx="4" fill="#617788"/>
<circle cx="518" cy="48" r="2" fill="#d2e2eb"/>
<path d="m525 61 11-1m-12 5 11-1m-12 5 10-1" stroke="#83939f" stroke-width="2"/>
<path d="m486 96-2 36q0 8 10 9" fill="none" stroke="#fff" stroke-width="2" opacity=".75"/>
<rect x="52" y="133" width="6" height="6" rx="1" fill="#5e6870"/><circle class="device-mark-pulse" cx="55" cy="136" r="9" fill="none" stroke="#ac7741" stroke-width="2"/><circle class="device-mark-dot" cx="55" cy="136" r="3.5" fill="#ac7741"/><circle cx="55" cy="136" r="14" fill="none" stroke="#aa835b" stroke-width="1.2"/>
</g></svg>`;
