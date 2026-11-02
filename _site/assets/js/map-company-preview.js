(() => {
  const form = document.querySelector('.map-submit-page .map-update-form');
  const preview = document.querySelector('.map-submit-preview');
  if (!form || !preview) return;

  const value = name => form.elements.namedItem(name)?.value.trim().replace(/\s+/g, ' ') || '';
  const excerpt = (text, limit) => text.length > limit ? `${text.slice(0, limit - 1).trimEnd()}…` : text;
  const fields = [
    ['customers_served', 'Who we help'],
    ['products_and_services', 'Products & services'],
    ['use_cases', 'Problems we solve'],
    ['public_company_location', 'Location'],
    ['public_company_email', 'Company email'],
    ['public_company_phone', 'Company phone'],
    ['company_linkedin', 'LinkedIn'],
    ['public_contact_url', 'Contact'],
    ['supporting_resource_url', 'Resource'],
  ];
  function update() {
    const name = value('company_name');
    preview.querySelector('[data-preview-name]').textContent = excerpt(name, 90) || 'Your company.';
    preview.querySelector('[data-preview-initials]').textContent = name
      ? Array.from(name.split(/\s+/).slice(0, 2).map(word => Array.from(word)[0]).join('')).slice(0, 2).join('').toUpperCase()
      : '✦';
    preview.querySelector('[data-preview-website]').textContent = excerpt(value('company_website').replace(/^https?:\/\//i, '').replace(/\/$/, ''), 80) || 'Your place in the supply chain.';
    preview.querySelector('[data-preview-overview]').textContent = excerpt(value('proposed_updates'), 240) || 'Describe what you do and help your next partner see the possibilities.';
    const details = preview.querySelector('[data-preview-details]');
    const rows = fields.flatMap(([field, label]) => {
      let text = value(field);
      if (field === 'supporting_resource_url') {
        text = [value('supporting_resource_description'), text].filter(Boolean).join(' · ');
      }
      if (!text) return [];
      const row = document.createElement('div');
      const term = document.createElement('dt');
      const description = document.createElement('dd');
      term.textContent = label;
      description.textContent = excerpt(text, 110);
      row.append(term, description);
      return [row];
    });
    details.replaceChildren(...rows);
    details.hidden = !rows.length;
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('reset', () => requestAnimationFrame(update));
  window.addEventListener('pageshow', update);
  update();
})();
