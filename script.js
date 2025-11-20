// Simple, readable JS for card creation and management

// DOM refs
const form = document.getElementById('cardForm');
const cardsContainer = document.getElementById('cardsContainer');
const toggleFormBtn = document.getElementById('toggleFormBtn');
const resetBtn = document.getElementById('resetButton');
const clearAllBtn = document.getElementById('clearAllBtn');

// Placeholder image for broken/missing images
const PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
     <rect width="100%" height="100%" fill="#2a2a2a"/>
     <text x="50%" y="50%" font-size="20" fill="#9aa0a6" dominant-baseline="middle" text-anchor="middle">No image</text>
   </svg>`
);

// helper: sanitize & trim text
function text(val) {
  return String(val || '').trim();
}

// helper: create element with optional class and attrs
function el(tag, cls, attrs = {}) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  Object.keys(attrs).forEach(k => node.setAttribute(k, attrs[k]));
  return node;
}

// Build card DOM from values
function buildCard({ name, title, email, age, description, tags, imageUrl }) {
  const card = el('article', 'card');

  const img = el('img');
  img.src = imageUrl || PLACEHOLDER;
  img.alt = name ? `${name}'s photo` : 'Card image';
  // fallback on error
  img.onerror = () => { img.src = PLACEHOLDER; };

  const body = el('div', 'card-body');

  const h = el('h2');
  h.textContent = name || 'Unnamed';

  const meta = el('div', 'meta');
  meta.textContent = `${title || ''}${title && email ? ' • ' : ''}${email || ''}`;

  const desc = el('div');
  desc.textContent = description || '';

  // tags
  const tagsWrap = el('div', 'tags');
  (tags || []).forEach(t => {
    const tag = el('span', 'tag');
    tag.textContent = t;
    tagsWrap.appendChild(tag);
  });

  body.append(h, meta, desc, tagsWrap);

  // actions
  const actions = el('div', 'card-actions');
  const delBtn = el('button', 'delete');
  delBtn.type = 'button';
  delBtn.textContent = 'Delete';
  delBtn.addEventListener('click', () => {
    card.remove();
    updateEmptyState();
  });

  actions.appendChild(delBtn);

  // optional: show age
  if (age) {
    const ageEl = el('div');
    ageEl.className = 'meta';
    ageEl.textContent = `Age: ${age}`;
    body.appendChild(ageEl);
  }

  card.append(img, body, actions);
  return card;
}

// normalize tags: input string => array (lowercased, trimmed, unique)
function parseTags(raw) {
  if (!raw) return [];
  return raw.split(',')
    .map(t => t.trim())
    .filter(Boolean)
    .map(t => t.toLowerCase())
    .filter((v, i, arr) => arr.indexOf(v) === i); // unique
}

// display empty state if there are no cards
function updateEmptyState() {
  if (!cardsContainer.children.length) {
    cardsContainer.classList.add('empty');
    cardsContainer.innerHTML = `<div>No cards yet — create one using the form.</div>`;
  } else {
    // leave the existing cards intact (don't override)
    if (cardsContainer.classList.contains('empty')) {
      // if it's empty placeholder, clear it so we can insert real cards later
      cardsContainer.classList.remove('empty');
      cardsContainer.innerHTML = '';
    }
  }
}

// initial empty state
updateEmptyState();

// handle submit
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = {
    name: text(document.getElementById('nameInput').value),
    title: text(document.getElementById('titleInput').value),
    email: text(document.getElementById('emailInput').value),
    age: text(document.getElementById('ageInput').value),
    description: text(document.getElementById('descriptionInput').value),
    tags: parseTags(document.getElementById('tagInput').value),
    imageUrl: text(document.getElementById('imageInput').value),
  };

  // Basic validation: name & title required
  if (!data.name || !data.title) {
    alert('Please provide at least a name and title.');
    return;
  }

  const cardEl = buildCard(data);
  // ensure placeholder removed
  if (cardsContainer.classList.contains('empty')) {
    cardsContainer.classList.remove('empty');
    cardsContainer.innerHTML = '';
  }
  // add newest card to top
  cardsContainer.insertBefore(cardEl, cardsContainer.firstChild);

  form.reset();
  updateEmptyState();
});

// reset button (just reset fields)
resetBtn.addEventListener('click', () => form.reset());

// toggle form visibility
toggleFormBtn.addEventListener('click', () => {
  const hidden = form.classList.toggle('hidden');
  toggleFormBtn.textContent = hidden ? 'Show Form' : 'Hide Form';
  toggleFormBtn.setAttribute('aria-expanded', String(!hidden));
});

// clear all cards (confirm)
clearAllBtn.addEventListener('click', () => {
  if (!cardsContainer.children.length) return;
  if (confirm('Remove all cards?')) {
    cardsContainer.innerHTML = '';
    updateEmptyState();
  }
});
