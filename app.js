const STORAGE_KEY = 'kgalagadi-checklist-v3';
const DEFAULT_TRACKER_NAME = 'Kgalagadi Team';
const DEFAULT_CATEGORY = 'mammals';

const DATA = window.CHECKLIST_DATA || { mammals: [] };
const CATEGORIES = Object.keys(DATA);

const state = loadState();

const familySections = document.querySelector('#family-sections');
const familyFilter = document.querySelector('#family-filter');
const categoryTabs = document.querySelector('#category-tabs');
const searchInput = document.querySelector('#search-input');
const summaryGrid = document.querySelector('#summary-grid');
const restoreInput = document.querySelector('#restore-input');
const trackerCard = document.querySelector('#tracker-card');
const trackerNameInput = document.querySelector('#tracker-name-input');
const pageTitle = document.querySelector('#page-title');
const pageIntro = document.querySelector('#page-intro');

init();

function init() {
  renderCategoryTabs();
  populateFamilyFilter();
  renderHero();
  renderTracker();
  renderSummary();
  renderFamilies();

  trackerNameInput.value = state.trackerName;
  trackerNameInput.addEventListener('change', () => {
    const value = trackerNameInput.value.trim().slice(0, 24) || DEFAULT_TRACKER_NAME;
    state.trackerName = value;
    trackerNameInput.value = value;
    saveState();
    renderTracker();
    renderFamilies();
  });

  familyFilter.addEventListener('change', renderFamilies);
  searchInput.addEventListener('input', renderFamilies);

  document.querySelector('#backup-button').addEventListener('click', downloadBackup);
  document.querySelector('#restore-button').addEventListener('click', () => restoreInput.click());
  document.querySelector('#reset-button').addEventListener('click', resetAll);
  restoreInput.addEventListener('change', restoreBackup);

  window.addEventListener('load', async () => {
    if ('serviceWorker' in navigator) {
      await navigator.serviceWorker.register('./sw.js?v=6').catch(() => {});
    }
    prefetchImages();
    fetchVisits();
  });
}

function loadState() {
  const fallback = {
    trackerName: DEFAULT_TRACKER_NAME,
    selectedCategory: DEFAULT_CATEGORY,
    sightings: {},
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return normalizeState(fallback);
    }
    return normalizeState(JSON.parse(raw));
  } catch {
    return normalizeState(fallback);
  }
}

function normalizeState(input) {
  const next = {
    trackerName: DEFAULT_TRACKER_NAME,
    selectedCategory: CATEGORIES.includes(input.selectedCategory) ? input.selectedCategory : DEFAULT_CATEGORY,
    sightings: {},
  };

  if (typeof input.trackerName === 'string') {
    next.trackerName = input.trackerName.trim().slice(0, 24) || DEFAULT_TRACKER_NAME;
  } else if (Array.isArray(input.friendNames)) {
    const merged = input.friendNames.filter(Boolean).join(' / ').slice(0, 24);
    next.trackerName = merged || DEFAULT_TRACKER_NAME;
  }

  for (const animal of allAnimals()) {
    const key = itemKey(animal);
    const seen = input.sightings?.[key] ?? input.sightings?.[animal.scientific];
    next.sightings[key] = Array.isArray(seen) ? seen.some(Boolean) : Boolean(seen);
  }

  return next;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function allAnimals() {
  return CATEGORIES.flatMap((category) => DATA[category] || []);
}

function currentAnimals() {
  return DATA[state.selectedCategory] || [];
}

function itemKey(animal) {
  return `${animal.category}:${animal.scientific}`;
}

function categoryLabel(category) {
  return category === 'mammals' ? 'Mammals' : category === 'birds' ? 'Birds' : category;
}

function renderCategoryTabs() {
  categoryTabs.replaceChildren();
  for (const category of CATEGORIES) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `tab-button${state.selectedCategory === category ? ' active' : ''}`;
    button.textContent = categoryLabel(category);
    button.addEventListener('click', () => {
      state.selectedCategory = category;
      familyFilter.value = '';
      saveState();
      renderCategoryTabs();
      populateFamilyFilter();
      renderHero();
      renderTracker();
      renderSummary();
      renderFamilies();
    });
    categoryTabs.append(button);
  }
}

function populateFamilyFilter() {
  familyFilter.innerHTML = '<option value="">All families</option>';
  const families = [...new Set(currentAnimals().map((animal) => animal.family))].sort();
  for (const family of families) {
    const option = document.createElement('option');
    option.value = family;
    option.textContent = family;
    familyFilter.append(option);
  }
}

function renderHero() {
  const label = categoryLabel(state.selectedCategory);
  pageTitle.textContent = `Kgalagadi ${label} Checklist`;
  pageIntro.textContent = `Offline shared checklist for Kgalagadi. This ${label.toLowerCase()} view stays on your device after first load, including local bundled images.`;
}

function renderTracker() {
  const animals = currentAnimals();
  const count = animals.filter((animal) => state.sightings[itemKey(animal)]).length;
  trackerCard.innerHTML = `
    <div class="friend-stats">
      <span class="stat-pill">${escapeHtml(state.trackerName)}</span>
      <span class="stat-pill">${count} seen</span>
      <span class="stat-pill">${animals.length - count} left</span>
    </div>
  `;
}

function renderSummary() {
  const animals = currentAnimals();
  const seen = animals.filter((animal) => state.sightings[itemKey(animal)]).length;
  const template = document.querySelector('#summary-card-template');
  summaryGrid.replaceChildren();

  const cards = [
    { label: 'Seen', value: `${seen}`, note: `${animals.length - seen} still open` },
    { label: 'Progress', value: `${animals.length ? Math.round((seen / animals.length) * 100) : 0}%`, note: 'Shared checklist' },
    { label: 'Total Species', value: `${animals.length}`, note: `${categoryLabel(state.selectedCategory)} in this view` },
  ];

  for (const card of cards) {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector('.summary-label').textContent = card.label;
    node.querySelector('.summary-value').textContent = card.value;
    node.querySelector('.summary-note').textContent = card.note;
    summaryGrid.append(node);
  }
}

function renderFamilies() {
  const animals = currentAnimals();
  const search = searchInput.value.trim().toLowerCase();
  const familyValue = familyFilter.value;
  const grouped = new Map();

  for (const animal of animals) {
    if (familyValue && animal.family !== familyValue) {
      continue;
    }

    const haystack = `${animal.family} ${animal.english} ${animal.spanish || ''} ${animal.scientific} ${animal.roberts || ''}`.toLowerCase();
    if (search && !haystack.includes(search)) {
      continue;
    }

    if (!grouped.has(animal.family)) {
      grouped.set(animal.family, []);
    }
    grouped.get(animal.family).push(animal);
  }

  familySections.replaceChildren();

  for (const [family, entries] of grouped.entries()) {
    const block = document.createElement('section');
    block.className = 'family-block';

    const seenCount = entries.filter((animal) => state.sightings[itemKey(animal)]).length;
    const head = document.createElement('div');
    head.className = 'family-head';
    head.innerHTML = `
      <div>
        <h2>${family}</h2>
        <p class="family-note">${seenCount}/${entries.length} seen in this family</p>
      </div>
      <span class="stat-pill">${entries.length} species</span>
    `;
    block.append(head);

    const list = document.createElement('div');
    list.className = 'animal-list';
    entries.forEach((animal) => list.append(renderAnimalCard(animal)));
    block.append(list);
    familySections.append(block);
  }

  if (!grouped.size) {
    const empty = document.createElement('section');
    empty.className = 'family-block';
    empty.innerHTML = '<p class="family-note">No animals match that search.</p>';
    familySections.append(empty);
  }
}

function renderAnimalCard(animal) {
  const template = document.querySelector('#animal-card-template');
  const node = template.content.firstElementChild.cloneNode(true);
  const key = itemKey(animal);
  const seen = state.sightings[key];
  const image = node.querySelector('.animal-image');

  node.querySelector('.animal-name').textContent = animal.english;
  node.querySelector('.animal-meta').innerHTML = animal.roberts
    ? `${animal.spanish || ''}<br><code>${animal.scientific}</code><br>Roberts ${animal.roberts}`
    : `${animal.spanish || ''}<br><code>${animal.scientific}</code>`;

  image.src = animal.image;
  image.alt = `${animal.english} photo`;

  const actions = node.querySelector('.animal-actions');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `toggle${seen ? ' active' : ''}`;
  button.setAttribute('aria-pressed', String(seen));
  button.innerHTML = `<strong>${escapeHtml(state.trackerName)}</strong><span>${seen ? 'Seen' : 'Not yet'}</span>`;
  button.addEventListener('click', () => {
    state.sightings[key] = !state.sightings[key];
    saveState();
    renderTracker();
    renderSummary();
    renderFamilies();
  });
  actions.append(button);

  return node;
}

function downloadBackup() {
  const payload = {
    version: 2,
    exportedAt: new Date().toISOString(),
    data: state,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'kgalagadi-checklist-backup.json';
  anchor.click();
  URL.revokeObjectURL(url);
}

function restoreBackup(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const next = normalizeState(parsed.data || parsed);
      state.trackerName = next.trackerName;
      state.selectedCategory = next.selectedCategory;
      state.sightings = next.sightings;
      trackerNameInput.value = state.trackerName;
      saveState();
      renderCategoryTabs();
      populateFamilyFilter();
      renderHero();
      renderTracker();
      renderSummary();
      renderFamilies();
    } catch {
      window.alert('That backup file could not be read.');
    } finally {
      restoreInput.value = '';
    }
  };
  reader.readAsText(file);
}

function resetAll() {
  if (!window.confirm('Clear all names and sightings on this device?')) {
    return;
  }
  state.trackerName = DEFAULT_TRACKER_NAME;
  state.selectedCategory = DEFAULT_CATEGORY;
  trackerNameInput.value = state.trackerName;
  for (const animal of allAnimals()) {
    state.sightings[itemKey(animal)] = false;
  }
  saveState();
  renderCategoryTabs();
  populateFamilyFilter();
  renderHero();
  renderTracker();
  renderSummary();
  renderFamilies();
}

function fetchVisits() {
  const el = document.querySelector('#visit-counter');
  if (!el) return;
  fetch('./api/visits')
    .then((r) => r.json())
    .then((d) => {
      el.textContent = `~${d.visits} visitors · ${d.requests} requests (park access logs)`;
    })
    .catch(() => {});
}

function prefetchImages() {
  for (const animal of allAnimals()) {
    const img = new Image();
    img.src = animal.image;
  }
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
