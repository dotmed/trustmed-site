(() => {
  document.querySelectorAll('[data-device-scene]').forEach(scene => {
    const rotation = scene.querySelector('[data-device-rotation]');
    if (!rotation) return;
    const current = 'scalpel';
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
        const mark = scene.querySelector('.itrace-banner-auth>div').getBoundingClientRect();
        const end = new DOMPoint(mark.left, mark.top + mark.height / 2).matrixTransform(transform.inverse());
        svg.querySelector('path').setAttribute('d', `M${anchor.x} ${anchor.y} L${anchor.x} ${end.y} L${end.x} ${end.y}`);
      }
      const landingSvg = scene.querySelector('.connection-zoom-line');
      if (landingSvg?.getScreenCTM()) {
        const inverse = landingSvg.getScreenCTM().inverse();
        const local = (x, y) => new DOMPoint(x, y).matrixTransform(inverse);
        const label = scene.querySelector('.connection-pack').getBoundingClientRect();
        const mark = scene.querySelector('.connection-mark-crop').getBoundingClientRect();
        const file = scene.querySelector('.connection-record').getBoundingClientRect();
        const start = local(point.x, point.y);
        // Approach the right edge of the magnified mark, outside its caption.
        const laneX = Math.max(mark.right + 8, Math.min(point.x, label.left - 8));
        const lower = local(laneX, point.y);
        const upper = local(laneX, mark.top + mark.height / 2);
        const end = local(mark.right, mark.top + mark.height / 2);
        landingSvg.querySelector('.connection-auth-link').setAttribute('d',
          `M${start.x} ${start.y} L${lower.x} ${lower.y} L${upper.x} ${upper.y} L${end.x} ${end.y}`);
        const junction = landingSvg.querySelector('.connection-dot-junction');
        junction.setAttribute('cx', start.x);
        junction.setAttribute('cy', start.y);
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
    const connectorObserver = new ResizeObserver(alignConnectors);
    connectorObserver.observe(rotation);
    const packageLabel = scene.querySelector('.connection-pack');
    if (packageLabel) connectorObserver.observe(packageLabel);
    connectorObserver.observe(scene);
    window.addEventListener('resize', alignConnectors);
    window.addEventListener('load', alignConnectors, {once:true});
    document.fonts.ready.then(alignConnectors);
    scene.dataset.activeDevice = 'scalpel';
    requestAnimationFrame(alignConnectors);
  });
})();
