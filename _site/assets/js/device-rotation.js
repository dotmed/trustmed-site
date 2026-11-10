(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-device-scene]').forEach(scene => {
    const rotation = scene.querySelector('[data-device-rotation]');
    if (!rotation) return;
    const pause = rotation.querySelector('[data-pause-device]');
    const select = [...rotation.querySelectorAll('[data-select-device]')];
    const walker = document.createTreeWalker(scene, NodeFilter.SHOW_TEXT);
    const originals = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (/SN26041700842|09521321073463|9521321\.007346|2DMI-8F4C2A91/.test(node.textContent)) originals.push([node, node.textContent]);
    }
    let current = 'scalpel', paused = reduced.matches, timer;
    function alignConnectors() {
      const dot = rotation.querySelector(`[data-device="${current}"] .device-mark-dot`);
      const matrix = dot?.getScreenCTM();
      if (!matrix) return;
      const point = new DOMPoint(Number(dot.getAttribute('cx')), Number(dot.getAttribute('cy'))).matrixTransform(matrix);
      for (const [selector, endX] of [['.itrace-banner-auth-line', 55]]) {
        const svg = scene.querySelector(selector);
        const transform = svg?.getScreenCTM();
        if (!transform) continue;
        const anchor = point.matrixTransform(transform.inverse());
        svg.querySelector('path').setAttribute('d', `M${anchor.x} ${anchor.y} L${anchor.x} 45 L${endX} 0`);
      }
      const landingSvg = scene.querySelector('.connection-zoom-line');
      if (landingSvg?.getScreenCTM()) {
        const inverse = landingSvg.getScreenCTM().inverse();
        const local = (x, y) => new DOMPoint(x, y).matrixTransform(inverse);
        const label = scene.querySelector('.connection-pack').getBoundingClientRect();
        const mark = scene.querySelector('.connection-mark-crop').getBoundingClientRect();
        const file = scene.querySelector('.connection-record').getBoundingClientRect();
        const start = local(point.x, point.y);
        const laneY = Math.max(label.bottom, mark.bottom) + 16;
        const laneX = (label.right + mark.left) / 2;
        const bend = local(point.x, laneY);
        const corner = local(laneX, laneY);
        const turn = local(laneX, mark.top + mark.height / 2);
        const end = local(mark.left, mark.top + mark.height / 2);
        const radius = Math.max(1, Math.min(8, (mark.left - label.right) / 4));
        const rx = local(radius, 0).x - local(0, 0).x;
        const ry = local(0, radius).y - local(0, 0).y;
        landingSvg.querySelector('.connection-auth-link').setAttribute('d',
          `M${start.x} ${start.y} L${bend.x} ${bend.y + ry} Q${bend.x} ${bend.y} ${bend.x + rx} ${bend.y} L${corner.x - rx} ${corner.y} Q${corner.x} ${corner.y} ${corner.x} ${corner.y - ry} L${turn.x} ${turn.y + ry} Q${turn.x} ${turn.y} ${turn.x + rx} ${turn.y} L${end.x} ${end.y}`);
        const fileEnd = local(point.x, file.top);
        landingSvg.querySelector('.connection-file-link').setAttribute('d', `M${start.x} ${start.y} L${fileEnd.x} ${fileEnd.y}`);
        const endpoint = landingSvg.querySelector('.connection-file-end');
        endpoint.setAttribute('cx', fileEnd.x);
        endpoint.setAttribute('cy', fileEnd.y);
      }
      const link = scene.querySelector('.itrace-banner-link');
      if (link) {
        const bounds = link.parentElement.getBoundingClientRect();
        link.style.left = `${point.x - bounds.left}px`;
        link.style.top = `${point.y - bounds.top}px`;
      }
    }
    function show(device) {
      current = device;
      rotation.dataset.activeDevice = device;
      scene.dataset.activeDevice = device;
      rotation.querySelectorAll('[data-device]').forEach(slide => slide.setAttribute('aria-hidden', String(slide.dataset.device !== device)));
      select.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.selectDevice === device)));
      const stapler = device === 'stapler';
      const name = scene.querySelector('[data-device-name]');
      if (name) name.textContent = stapler ? 'Surgical stapler' : 'Surgical scalpel';
      originals.forEach(([node, original]) => { node.textContent = stapler ? original.replaceAll('SN26041700842','SN26051001628').replaceAll('09521321073463','09521321073470').replaceAll('9521321.007346','9521321.007347').replaceAll('2DMI-8F4C2A91','2DMI-B6E9037D') : original; });
      const matrix = scene.querySelector('.connection-package-code img');
      if (matrix) {
        matrix.src = '/assets/img/' + (stapler ? 'stapler' : 'scalpel') + '-datamatrix.svg';
        matrix.alt = stapler ? 'GS1 Data Matrix, GTIN 09521321073470, serial SN26051001628' : 'GS1 Data Matrix, GTIN 09521321073463, serial SN26041700842';
      }
      requestAnimationFrame(alignConnectors);
      scene.setAttribute('aria-label', `${stapler ? 'Surgical stapler' : 'Surgical scalpel'}, authentication reference, and EPCIS record with matching product identity and serial`);
    }
    function schedule() {
      clearInterval(timer);
      pause.textContent = paused ? '▷' : 'Ⅱ';
      pause.setAttribute('aria-label', paused ? 'Resume device rotation' : 'Pause device rotation');
      if (!paused && !document.hidden) timer = setInterval(() => {
        if (!rotation.querySelector('.device-controls').matches(':hover')) show(current === 'scalpel' ? 'stapler' : 'scalpel');
      }, 6500);
    }
    select.forEach(button => button.addEventListener('click', () => { paused = true; show(button.dataset.selectDevice); schedule(); }));
    pause.addEventListener('click', () => { paused = !paused; schedule(); });
    reduced.addEventListener('change', () => { paused = reduced.matches; schedule(); });
    document.addEventListener('visibilitychange', schedule);
    const connectorObserver = new ResizeObserver(alignConnectors);
    connectorObserver.observe(rotation);
    const packageLabel = scene.querySelector('.connection-pack');
    if (packageLabel) connectorObserver.observe(packageLabel);
    show('scalpel'); schedule();
  });
})();
