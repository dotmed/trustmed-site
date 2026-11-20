// Add approved documents under src/assets/downloads/companies/<company-id>/,
// then add their title, description, file, optional cover, pages, language and
// providedBy to industry-map/research/site-resources.json. Rebuild to publish.
// Each company may feature one resource. Replace its entry to update it.
// Files are public. Keep original PDFs intact; use a new filename for revisions.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function localAsset(url, company, extensions) {
  const prefix = '/assets/downloads/companies/' + company + '/';
  if (typeof url !== 'string' || !url.startsWith(prefix) || !/^[a-z0-9./-]+$/.test(url) || url.includes('..') || !extensions.includes(path.extname(url))) throw new Error('Invalid resource asset: ' + url);
  const file = path.join(root, 'src', url);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error('Missing resource asset: ' + url);
  return file;
}
function validateResources(config, companies) {
  const result = {};
  for (const [company, entries] of Object.entries(config)) {
    if (!companies.has(company) || !Array.isArray(entries)) throw new Error('Unknown company or invalid resources: ' + company);
    if (entries.length > 1) throw new Error('Only one featured resource is allowed per company: ' + company);
    const ids = new Set();
    result[company] = entries.map(item => {
      if (!/^[a-z0-9-]+$/.test(item.id || '') || ids.has(item.id)) throw new Error('Invalid or duplicate resource ID: ' + company);
      ids.add(item.id);
      for (const key of ['title','description','language','providedBy']) if (typeof item[key] !== 'string' || !item[key].trim()) throw new Error('Missing resource ' + key + ': ' + company);
      if (!Number.isInteger(item.pages) || item.pages < 1) throw new Error('Invalid resource page count: ' + company);
      const file = localAsset(item.file, company, ['.pdf']);
      const fd = fs.openSync(file, 'r'), signature = Buffer.alloc(5);
      try { fs.readSync(fd, signature, 0, 5, 0); } finally { fs.closeSync(fd); }
      if (signature.toString() !== '%PDF-') throw new Error('Not a PDF: ' + item.file);
      if (item.cover) localAsset(item.cover, company, ['.png','.jpg','.webp']);
      const bytes = fs.statSync(file).size;
      return {...item, bytes, size: bytes >= 1048576 ? (bytes / 1048576).toFixed(1) + ' MB' : Math.round(bytes / 1024) + ' KB'};
    });
  }
  return result;
}
function resourceSection(provider) {
  if (!provider.resources?.length) return '';
  return `<section id="profile-resources" class="atlas-profile-resources" aria-labelledby="profile-resources-title"><header class="atlas-resources-heading"><p class="atlas-eyebrow">FROM ${escape(provider.provider)}</p><h2 id="profile-resources-title">Resources</h2><p>Explore documents shared by the company.</p></header><div class="atlas-resource-list">${provider.resources.map(item => {
    const attributes = `data-company-resource="${escape(item.id)}" data-company-id="${escape(provider.id)}"`;
    return `<article class="atlas-resource-card"><div class="atlas-resource-cover">${item.cover ? `<img src="${escape(item.cover)}" alt="Cover of ${escape(item.title)}" width="480" height="622" loading="lazy">` : '<span class="atlas-resource-placeholder" aria-hidden="true">PDF</span>'}</div><div class="atlas-resource-copy"><p class="atlas-resource-provider">Provided by ${escape(item.providedBy)}</p><h3>${escape(item.title)}</h3><p class="atlas-resource-description">${escape(item.description)}</p><p class="atlas-resource-meta">PDF <span>·</span> ${item.pages} ${item.pages === 1 ? 'page' : 'pages'} <span>·</span> ${item.size} <span>·</span> ${escape(item.language)}</p><div class="atlas-resource-actions"><a class="atlas-resource-view" href="${escape(item.file)}" target="_blank" rel="noopener" ${attributes} data-resource-action="view" aria-label="View ${escape(item.title)} (PDF, opens in a new tab)">View PDF <span aria-hidden="true">↗</span></a><a class="atlas-resource-download" href="${escape(item.file)}" download ${attributes} data-resource-action="download" aria-label="Download ${escape(item.title)} (PDF, ${item.size})"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></svg>Download</a></div></div></article>`;
  }).join('')}</div></section>`;
}
function resourceSchema(provider, origin, entityId) {
  return (provider.resources || []).map(item => {
    const url = origin + item.file;
    // Supplied-by attribution does not imply authorship or original publication.
    const supplier = provider.record_kind !== 'Product' && item.providedBy.toLowerCase() === provider.provider.toLowerCase()
      ? {'@id':entityId}
      : {'@type':'Organization', name:item.providedBy};
    return {
      '@type':'DigitalDocument',
      '@id':url + '#document',
      url,
      name:item.title,
      description:item.description,
      inLanguage:item.language === 'English' ? 'en' : item.language,
      encodingFormat:'application/pdf',
      isAccessibleForFree:true,
      about:{'@id':entityId},
      provider:supplier,
      ...(item.cover ? {image:origin + item.cover} : {}),
      encoding:{
        '@type':'MediaObject',
        '@id':url + '#file',
        contentUrl:url,
        encodingFormat:'application/pdf',
        contentSize:item.size,
        ...(item.cover ? {thumbnailUrl:origin + item.cover} : {})
      }
    };
  });
}
module.exports = {validateResources, resourceSection, resourceSchema};
