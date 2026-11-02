// Progressive enhancement: all three stories are available without JavaScript.
(() => {
  const root = document.querySelector('[data-atlas-journey]');
  if (!root) return;
  const list = root.querySelector('[role="tablist"]');
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  function select(index, focus = false) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, index) => {
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      const next = {ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1}[event.key];
      if (next === undefined) return;
      event.preventDefault();
      select(next, true);
    });
  });
  function fromHash() {
    const hash = location.hash === '#atlas-connect' ? '#atlas-data' : location.hash;
    const index = panels.findIndex(panel => '#' + panel.id === hash);
    if (index >= 0) select(index);
  }
  select(0);
  fromHash();
  root.classList.add('is-interactive');
  list.hidden = false;
  window.addEventListener('hashchange', fromHash);
  document.querySelectorAll('[data-atlas-capability]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const index = panels.findIndex(panel => panel.id === link.dataset.atlasCapability);
      if (index < 0) return;
      event.preventDefault();
      select(index);
      history.pushState(null, '', link.getAttribute('href'));
      tabs[index].focus({preventScroll: true});
      list.scrollIntoView({block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    });
  });
})();

// Sparse, randomized background stars. Only visible sections receive animation.
(() => {
  const page = document.querySelector('.atlas-page');
  if (!page) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Set();
  const skies = [...page.querySelectorAll(':scope > section')].map(section => {
    const sky = document.createElement('div');
    sky.className = 'atlas-sky';
    sky.setAttribute('aria-hidden', 'true');
    section.prepend(sky);
    return sky;
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({target, isIntersecting}) => {
      if (isIntersecting) visible.add(target);
      else { visible.delete(target); target.replaceChildren(); }
    });
  });
  skies.forEach(sky => observer.observe(sky));
  let timer;
  const random = (min, max) => min + Math.random() * (max - min);
  function launch() {
    if (motion.matches || document.hidden) return;
    const candidates = [...visible];
    if (candidates.length) {
      const sky = candidates[Math.floor(Math.random() * candidates.length)];
      const rect = sky.getBoundingClientRect();
      const top = Math.max(0, -rect.top);
      const bottom = Math.min(rect.height, innerHeight - rect.top);
      if (bottom > top && sky.childElementCount < 4) {
        const star = document.createElement('span');
        star.className = 'atlas-background-star';
        const x = random(100, Math.min(320, innerWidth * .6));
        const y = random(45, 120);
        star.style.left = random(0, Math.max(0, rect.width - x * .6)) + 'px';
        star.style.top = random(top, Math.max(top, bottom - 50)) + 'px';
        star.style.setProperty('--flight-x', x + 'px');
        star.style.setProperty('--flight-y', y + 'px');
        star.style.setProperty('--flight-angle', Math.atan2(y, x) + 'rad');
        star.style.setProperty('--tail-length', random(40, 85) + 'px');
        star.style.setProperty('--flight-duration', random(2200, 3400) + 'ms');
        star.addEventListener('animationend', () => star.remove(), {once: true});
        sky.append(star);
      }
    }
    timer = setTimeout(launch, random(700, 1500));
  }
  function reset() {
    clearTimeout(timer);
    skies.forEach(sky => sky.replaceChildren());
    if (!motion.matches && !document.hidden) timer = setTimeout(launch, 300);
  }
  motion.addEventListener('change', reset);
  document.addEventListener('visibilitychange', reset);
  reset();
})();

// A single outgoing stream releases a star when a capability phrase is explored.
(() => {
  const region = document.querySelector('[data-atlas-prose-diagram]');
  if (!region) return;
  const overlay = region.querySelector('.atlas-prose-connections');
  const origin = region.querySelector('[data-intro-origin]');
  const map = region.querySelector('.atlas-intelligence-map');
  const path = overlay.querySelector('[data-atlas-outgoing]');
  const links = [...region.querySelectorAll('[data-atlas-capability]')];
  let frame;
  function draw() {
    const box = region.getBoundingClientRect();
    const port = origin.getBoundingClientRect();
    const mapBox = map.getBoundingClientRect();
    const scale = mapBox.width / 500;
    overlay.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    const x = port.left + port.width / 2 - box.left;
    const y = port.top + port.height / 2 - box.top;
    // Keep the stream inside the illustration, clear of the paragraph on every screen.
    path.setAttribute('d', `M${x},${y} L${x + 153 * scale},${y}`);
  }
  function schedule() { cancelAnimationFrame(frame); frame = requestAnimationFrame(draw); }
  const observer = new ResizeObserver(schedule);
  observer.observe(region);
  observer.observe(map);
  window.addEventListener('resize', schedule);
  document.fonts.ready.then(schedule);
  {
    const svgNS = 'http://www.w3.org/2000/svg';
    const comet = document.createElementNS(svgNS, 'g');
    comet.classList.add('atlas-connection-comet');
    comet.style.opacity = '0';
    const trail = Array.from({ length: 10 }, (_, index) => {
      const segment = document.createElementNS(svgNS, 'path');
      segment.classList.add('atlas-connection-trail');
      segment.style.opacity = String((1 - index / 10) * .8);
      comet.append(segment);
      return segment;
    });
    const star = document.createElementNS(svgNS, 'path');
    star.classList.add('atlas-connection-star');
    star.setAttribute('d', 'M0 -5 L1.4 -1.4 L5 0 L1.4 1.4 L0 5 L-1.4 1.4 L-5 0 L-1.4 -1.4 Z');
    comet.append(star);
    overlay.append(comet);
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let animation;
    let started;
    function animate(now) {
      if (reducedMotion.matches) { clear(); return; }
      started ??= now;
      const progress = Math.min((now - started) / 1600, 1);
      const length = path.getTotalLength();
      const distance = Math.min(progress, 1) * length;
      comet.style.opacity = String(Math.max(0, Math.min(progress * 10, (1 - progress) / .4, 1)));
      const head = path.getPointAtLength(distance);
      star.setAttribute('transform', `translate(${head.x} ${head.y})`);
      trail.forEach((segment, index) => {
        const from = Math.max(0, distance - (index + 1) * 5);
        const to = Math.max(0, distance - index * 5);
        const a = path.getPointAtLength(from);
        const b = path.getPointAtLength((from + to) / 2);
        const c = path.getPointAtLength(to);
        segment.setAttribute('d', `M${a.x},${a.y} L${b.x},${b.y} L${c.x},${c.y}`);
      });
      if (progress < 1) animation = requestAnimationFrame(animate);
      else clear();
    }
    function clear() {
      cancelAnimationFrame(animation);
      animation = undefined;
      started = undefined;
      comet.style.opacity = '0';
    }
    function highlight() {
      if (animation !== undefined || reducedMotion.matches || !path.hasAttribute('d')) return;
      animation = requestAnimationFrame(animate);
    }
    links.forEach(link => {
      link.addEventListener('mouseenter', highlight);
      link.addEventListener('focus', highlight);
    });
  }
  schedule();
})();
