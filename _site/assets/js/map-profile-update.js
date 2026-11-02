(() => {
  const form = document.querySelector('.map-update-form');
  const companies = document.getElementById('map-update-companies');
  if (!form || !companies) return;
  const selected = new URLSearchParams(location.search).get('company');
  const company = [...companies.content.querySelectorAll('[data-company-id]')]
    .find(item => item.dataset.companyId === selected);
  if (!company) {
    location.replace('/map/#explore');
    return;
  }
  const name = company.textContent;
  const path = `/map/companies/${encodeURIComponent(selected)}/`;
  document.getElementById('map-update-company').value = selected;
  document.getElementById('map-update-company-name').value = name;
  document.getElementById('map-update-profile-url').value = `https://trust.med${path}`;
  const back = document.getElementById('map-update-back');
  back.href = path;
  back.textContent = `← Back to ${name}`;
  document.getElementById('map-update-selection').hidden = true;
  form.hidden = false;
})();
