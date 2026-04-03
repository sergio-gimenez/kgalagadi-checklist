const STORAGE_KEY = 'kgalagadi-checklist-v2';

const DEFAULT_TRACKER_NAME = 'Kgalagadi Team';

const ANIMALS = [
  { family: 'Felidae', english: 'African wild cat', spanish: 'Gato salvaje africano', scientific: 'Felis lybica', image: './assets/mammals/african-wild-cat.webp' },
  { family: 'Felidae', english: 'Black-footed cat', spanish: 'Gato patinegro', scientific: 'Felis nigripes', image: './assets/mammals/black-footed-cat.webp' },
  { family: 'Felidae', english: 'Caracal', spanish: 'Caracal', scientific: 'Caracal caracal', image: './assets/mammals/caracal.webp' },
  { family: 'Felidae', english: 'Cheetah', spanish: 'Guepardo', scientific: 'Acinonyx jubatus', image: './assets/mammals/cheetah.webp' },
  { family: 'Felidae', english: 'Leopard', spanish: 'Leopardo', scientific: 'Panthera pardus', image: './assets/mammals/leopard.webp' },
  { family: 'Felidae', english: 'Lion', spanish: 'Leon', scientific: 'Panthera leo', image: './assets/mammals/lion.webp' },

  { family: 'Canidae', english: 'African wild dog', spanish: 'Perro salvaje africano', scientific: 'Lycaon pictus', image: './assets/mammals/african-wild-dog.webp' },
  { family: 'Canidae', english: 'Bat-eared fox', spanish: 'Zorro orejudo', scientific: 'Otocyon megalotis', image: './assets/mammals/bat-eared-fox.webp' },
  { family: 'Canidae', english: 'Black-backed jackal', spanish: 'Chacal de lomo negro', scientific: 'Canis mesomelas', image: './assets/mammals/black-backed-jackal.webp' },
  { family: 'Canidae', english: 'Cape fox', spanish: 'Zorro del Cabo', scientific: 'Vulpes chama', image: './assets/mammals/cape-fox.webp' },

  { family: 'Hyaenidae', english: 'Brown hyena', spanish: 'Hiena parda', scientific: 'Hyaena brunnea', image: './assets/mammals/brown-hyena.webp' },
  { family: 'Hyaenidae', english: 'Spotted hyena', spanish: 'Hiena manchada', scientific: 'Crocuta crocuta', image: './assets/mammals/spotted-hyena.webp' },

  { family: 'Herpestidae', english: 'Meerkat', spanish: 'Suricata', scientific: 'Suricata suricatta', image: './assets/mammals/meerkat.webp' },
  { family: 'Herpestidae', english: 'Slender mongoose', spanish: 'Mangosta esbelta', scientific: 'Galerella sanguinea', image: './assets/mammals/slender-mongoose.webp' },
  { family: 'Herpestidae', english: 'Yellow mongoose', spanish: 'Mangosta amarilla', scientific: 'Cynictis penicillata', image: './assets/mammals/yellow-mongoose.webp' },

  { family: 'Mustelidae', english: 'African striped weasel', spanish: 'Comadreja rayada africana', scientific: 'Poecilogale albinucha', image: './assets/mammals/african-striped-weasel.webp' },
  { family: 'Mustelidae', english: 'Honey badger', spanish: 'Tejon de la miel', scientific: 'Mellivora capensis', image: './assets/mammals/honey-badger.webp' },
  { family: 'Mustelidae', english: 'Striped polecat', spanish: 'Turon rayado', scientific: 'Ictonyx striatus', image: './assets/mammals/striped-polecat.webp' },

  { family: 'Viverridae', english: 'Small spotted genet', spanish: 'Gineta comun', scientific: 'Genetta genetta', image: './assets/mammals/small-spotted-genet.webp' },

  { family: 'Manidae', english: 'Pangolin', spanish: 'Pangolin de Temminck', scientific: 'Manis temminckii', image: './assets/mammals/pangolin.webp' },

  { family: 'Bovidae', english: 'Blue wildebeest', spanish: 'Nu azul', scientific: 'Connochaetes taurinus', image: './assets/mammals/blue-wildebeest.webp' },
  { family: 'Bovidae', english: 'Common duiker', spanish: 'Duiker comun', scientific: 'Sylvicapra grimmia', image: './assets/mammals/common-duiker.webp' },
  { family: 'Bovidae', english: 'Eland', spanish: 'Eland comun', scientific: 'Taurotragus oryx', image: './assets/mammals/eland.webp' },
  { family: 'Bovidae', english: 'Gemsbok', spanish: 'Orix del Cabo', scientific: 'Oryx gazella', image: './assets/mammals/gemsbok.webp' },
  { family: 'Bovidae', english: 'Kudu', spanish: 'Kudu mayor', scientific: 'Tragelaphus strepsiceros', image: './assets/mammals/kudu.webp' },
  { family: 'Bovidae', english: 'Red hartebeest', spanish: 'Alcelafo rojo', scientific: 'Alcelaphus buselaphus', image: './assets/mammals/red-hartebeest.webp' },
  { family: 'Bovidae', english: 'Springbok', spanish: 'Springbok', scientific: 'Antidorcas marsupialis', image: './assets/mammals/springbok.webp' },
  { family: 'Bovidae', english: 'Steenbok', spanish: 'Steenbok', scientific: 'Raphicerus campestris', image: './assets/mammals/steenbok.webp' },

  { family: 'Giraffidae', english: 'Giraffe', spanish: 'Jirafa', scientific: 'Giraffa camelopardalis', image: './assets/mammals/giraffe.webp' },

  { family: 'Suidae', english: 'Common warthog', spanish: 'Facoquero comun', scientific: 'Phacochoerus africanus', image: './assets/mammals/common-warthog.webp' },

  { family: 'Cercopithecidae', english: 'Chacma baboon', spanish: 'Babuino chacma', scientific: 'Papio ursinus', image: './assets/mammals/chacma-baboon.webp' },
  { family: 'Cercopithecidae', english: 'Vervet monkey', spanish: 'Mono vervet', scientific: 'Chlorocebus pygerythrus', image: './assets/mammals/vervet-monkey.webp' },

  { family: 'Macroscelididae', english: 'Bushveld elephant shrew', spanish: 'Musarana elefante del bushveld', scientific: 'Elephantulus intufi', image: './assets/mammals/bushveld-elephant-shrew.webp' },
  { family: 'Macroscelididae', english: 'Round-eared elephant shrew', spanish: 'Musarana elefante de orejas redondas', scientific: 'Macroscelides proboscideus', image: './assets/mammals/round-eared-elephant-shrew.webp' },

  { family: 'Orycteropodidae', english: 'Aardvark', spanish: 'Cerdo hormiguero', scientific: 'Orycteropus afer', image: './assets/mammals/aardvark.webp' },

  { family: 'Chrysochloridae', english: 'Cape golden mole', spanish: 'Topo dorado del Cabo', scientific: 'Chrysochloris asiatica', image: './assets/mammals/cape-golden-mole.webp' },

  { family: 'Erinaceidae', english: 'Southern African hedgehog', spanish: 'Erizo sudafricano', scientific: 'Atelerix frontalis', image: './assets/mammals/southern-african-hedgehog.webp' },

  { family: 'Soricidae', english: 'Desert musk shrew', spanish: 'Musarana almizclera del desierto', scientific: 'Crocidura greenwoodi', image: './assets/mammals/desert-musk-shrew.webp' },

  { family: 'Bathyergidae', english: 'Common mole rat', spanish: 'Rata topo comun', scientific: 'Cryptomys hottentotus', image: './assets/mammals/common-mole-rat.webp' },
  { family: 'Bathyergidae', english: 'Damara mole rat', spanish: 'Rata topo damarense', scientific: 'Cryptomys damarensis', image: './assets/mammals/damara-mole-rat.webp' },

  { family: 'Nesomyidae', english: 'Brant\'s climbing mouse', spanish: 'Raton trepador de Brants', scientific: 'Dendromus mesomelas', image: './assets/mammals/brants-climbing-mouse.webp' },
  { family: 'Nesomyidae', english: 'Large-eared mouse', spanish: 'Raton orejudo', scientific: 'Malacothrix typica', image: './assets/mammals/large-eared-mouse.webp' },
  { family: 'Nesomyidae', english: 'Pouched mouse', spanish: 'Raton de abazones', scientific: 'Saccostomus campestris', image: './assets/mammals/pouched-mouse.webp' },

  { family: 'Muridae', english: 'Acacia rat', spanish: 'Rata de las acacias', scientific: 'Thallomys paedulcus', image: './assets/mammals/acacia-rat.webp' },
  { family: 'Muridae', english: 'African pygmy mouse', spanish: 'Raton pigmeo africano', scientific: 'Mus minutoides', image: './assets/mammals/african-pygmy-mouse.webp' },
  { family: 'Muridae', english: 'Brant\'s whistling rat', spanish: 'Rata silbadora de Brants', scientific: 'Parotomys brantsii', image: './assets/mammals/brants-whistling-rat.webp' },
  { family: 'Muridae', english: 'Cape short-eared gerbil', spanish: 'Gerbo orejicorto del Cabo', scientific: 'Desmodillus auricularis', image: './assets/mammals/cape-short-eared-gerbil.webp' },
  { family: 'Muridae', english: 'Hairy-footed gerbil', spanish: 'Gerbo de patas peludas', scientific: 'Gerbillurus paeba', image: './assets/mammals/hairy-footed-gerbil.webp' },
  { family: 'Muridae', english: 'Highveld gerbil', spanish: 'Gerbo del altiplano', scientific: 'Tatera brantsii', image: './assets/mammals/highveld-gerbil.webp' },
  { family: 'Muridae', english: 'Namaqua rock mouse', spanish: 'Raton roquero namaqua', scientific: 'Aethomys namaquensis', image: './assets/mammals/namaqua-rock-mouse.webp' },
  { family: 'Muridae', english: 'Striped mouse', spanish: 'Raton rayado', scientific: 'Rhabdomys pumilio', image: './assets/mammals/striped-mouse.webp' },
  { family: 'Muridae', english: 'Woosnam\'s desert rat', spanish: 'Rata del desierto de Woosnam', scientific: 'Zelotomys woosnami', image: './assets/mammals/woosnams-desert-rat.webp' },

  { family: 'Sciuridae', english: 'Cape ground squirrel', spanish: 'Ardilla terrestre del Cabo', scientific: 'Xerus inauris', image: './assets/mammals/cape-ground-squirrel.webp' },

  { family: 'Leporidae', english: 'Cape hare', spanish: 'Liebre del Cabo', scientific: 'Lepus capensis', image: './assets/mammals/cape-hare.webp' },

  { family: 'Hystricidae', english: 'Cape porcupine', spanish: 'Puercoespin del Cabo', scientific: 'Hystrix africaeaustralis', image: './assets/mammals/cape-porcupine.webp' },

  { family: 'Pedetidae', english: 'South African springhare', spanish: 'Liebre saltadora sudafricana', scientific: 'Pedetes capensis', image: './assets/mammals/south-african-springhare.webp' },

  { family: 'Molossidae', english: 'Egyptian free-tailed bat', spanish: 'Murcielago egipcio de cola libre', scientific: 'Tadarida aegyptiaca', image: './assets/mammals/egyptian-free-tailed-bat.webp' },

  { family: 'Nycteridae', english: 'Egyptian slit-faced bat', spanish: 'Murcielago egipcio de cara hendida', scientific: 'Nycteris thebaica', image: './assets/mammals/egyptian-slit-faced-bat.webp' },

  { family: 'Vespertilionidae', english: 'Cape serotine bat', spanish: 'Serotino del Cabo', scientific: 'Eptesicus capensis', image: './assets/mammals/cape-serotine-bat.webp' },
];

const state = loadState();

const familySections = document.querySelector('#family-sections');
const familyFilter = document.querySelector('#family-filter');
const searchInput = document.querySelector('#search-input');
const summaryGrid = document.querySelector('#summary-grid');
const restoreInput = document.querySelector('#restore-input');
const trackerCard = document.querySelector('#tracker-card');
const trackerNameInput = document.querySelector('#tracker-name-input');

init();

function init() {
  populateFamilyFilter();
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
      await navigator.serviceWorker.register('./sw.js?v=4').catch(() => {});
    }
    prefetchImages();
  });
}

function loadState() {
  const fallback = {
    trackerName: DEFAULT_TRACKER_NAME,
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
    sightings: {},
  };

  if (typeof input.trackerName === 'string') {
    next.trackerName = input.trackerName.trim().slice(0, 24) || DEFAULT_TRACKER_NAME;
  } else if (Array.isArray(input.friendNames)) {
    const merged = input.friendNames.filter(Boolean).join(' / ').slice(0, 24);
    next.trackerName = merged || DEFAULT_TRACKER_NAME;
  }

  for (const animal of ANIMALS) {
    const seen = input.sightings?.[animal.scientific];
    next.sightings[animal.scientific] = Array.isArray(seen)
      ? seen.some(Boolean)
      : Boolean(seen);
  }

  return next;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function populateFamilyFilter() {
  const families = [...new Set(ANIMALS.map((animal) => animal.family))];
  for (const family of families) {
    const option = document.createElement('option');
    option.value = family;
    option.textContent = family;
    familyFilter.append(option);
  }
}

function renderTracker() {
  const count = ANIMALS.filter((animal) => state.sightings[animal.scientific]).length;
  trackerCard.innerHTML = `
    <div class="friend-stats">
      <span class="stat-pill">${escapeHtml(state.trackerName)}</span>
      <span class="stat-pill">${count} seen</span>
      <span class="stat-pill">${ANIMALS.length - count} left</span>
    </div>
  `;
}

function renderSummary() {
  const template = document.querySelector('#summary-card-template');
  summaryGrid.replaceChildren();

  const seen = ANIMALS.filter((animal) => state.sightings[animal.scientific]).length;
  const cards = [
    { label: 'Seen', value: `${seen}`, note: `${ANIMALS.length - seen} still open` },
    { label: 'Progress', value: `${Math.round((seen / ANIMALS.length) * 100)}%`, note: 'Shared checklist' },
    { label: 'Total Species', value: `${ANIMALS.length}`, note: 'Mammals in this app' },
  ];

  cards.forEach((card) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector('.summary-label').textContent = card.label;
    node.querySelector('.summary-value').textContent = card.value;
    node.querySelector('.summary-note').textContent = card.note;
    summaryGrid.append(node);
  });
}

function renderFamilies() {
  const search = searchInput.value.trim().toLowerCase();
  const familyValue = familyFilter.value;
  const grouped = new Map();

  for (const animal of ANIMALS) {
    if (familyValue && animal.family !== familyValue) {
      continue;
    }

    const haystack = `${animal.family} ${animal.english} ${animal.spanish} ${animal.scientific}`.toLowerCase();
    if (search && !haystack.includes(search)) {
      continue;
    }

    if (!grouped.has(animal.family)) {
      grouped.set(animal.family, []);
    }
    grouped.get(animal.family).push(animal);
  }

  familySections.replaceChildren();

  for (const [family, animals] of grouped.entries()) {
    const block = document.createElement('section');
    block.className = 'family-block';

    const seenByAnyone = animals.filter((animal) => state.sightings[animal.scientific]).length;
    const head = document.createElement('div');
    head.className = 'family-head';
    head.innerHTML = `
      <div>
        <h2>${family}</h2>
        <p class="family-note">${seenByAnyone}/${animals.length} seen by at least one friend</p>
      </div>
      <span class="stat-pill">${animals.length} species</span>
    `;
    block.append(head);

    const list = document.createElement('div');
    list.className = 'animal-list';
    animals.forEach((animal) => list.append(renderAnimalCard(animal)));
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
  const seen = state.sightings[animal.scientific];
  const image = node.querySelector('.animal-image');

  node.querySelector('.animal-name').textContent = animal.english;
  node.querySelector('.animal-meta').innerHTML = `${animal.spanish} <br><code>${animal.scientific}</code>`;
  image.src = animal.image;
  image.alt = `${animal.english} photo`;

  const actions = node.querySelector('.animal-actions');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `toggle${seen ? ' active' : ''}`;
  button.setAttribute('aria-pressed', String(seen));
  button.innerHTML = `<strong>${escapeHtml(state.trackerName)}</strong><span>${seen ? 'Seen' : 'Not yet'}</span>`;
  button.addEventListener('click', () => {
    state.sightings[animal.scientific] = !state.sightings[animal.scientific];
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
    version: 1,
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
      state.sightings = next.sightings;
      trackerNameInput.value = state.trackerName;
      saveState();
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
  trackerNameInput.value = state.trackerName;
  for (const animal of ANIMALS) {
    state.sightings[animal.scientific] = false;
  }
  saveState();
  renderTracker();
  renderSummary();
  renderFamilies();
}

function prefetchImages() {
  for (const animal of ANIMALS) {
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
