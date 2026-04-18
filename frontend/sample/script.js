// ============================================================
// LEICA M3 MARKET FINDER — Main JavaScript
// Pure vanilla JS, no dependencies
// ============================================================

// ── STATE ──
let currentFilters = {
  priceMin: 0,
  priceMax: 5000,
  platforms: [],
  variants: [],
  recommendedOnly: false,
  claOnly: false,
  sortBy: 'price_asc',
};

// ── DOM ELEMENTS ──
const navTabs = document.querySelectorAll('.nav-tab');
const sections = document.querySelectorAll('.section');
const priceMinInput = document.getElementById('priceMin');
const priceMaxInput = document.getElementById('priceMax');
const priceSlider = document.getElementById('priceSlider');
const priceMinDisplay = document.getElementById('priceMinDisplay');
const priceMaxDisplay = document.getElementById('priceMaxDisplay');
const recommendedCheckbox = document.getElementById('recommendedOnly');
const claCheckbox = document.getElementById('claOnly');
const sortRadios = document.querySelectorAll('input[name="sort"]');
const listingsGrid = document.getElementById('listingsGrid');
const filteredCount = document.getElementById('filteredCount');
const clearFiltersBtn = document.getElementById('clearFilters');
const platformFiltersDiv = document.getElementById('platformFilters');
const variantFiltersDiv = document.getElementById('variantFilters');

// ── INITIALIZATION ──
document.addEventListener('DOMContentLoaded', () => {
  initializeFilters();
  renderListings();
  renderCharts();
  renderGuide();
  setupEventListeners();
});

// ── SETUP EVENT LISTENERS ──
function setupEventListeners() {
  // Tab navigation
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => switchSection(tab.dataset.section));
  });

  // Price filters
  priceMinInput.addEventListener('change', (e) => {
    currentFilters.priceMin = parseInt(e.target.value) || 0;
    updatePriceDisplay();
    renderListings();
  });

  priceMaxInput.addEventListener('change', (e) => {
    currentFilters.priceMax = parseInt(e.target.value) || 5000;
    updatePriceDisplay();
    renderListings();
  });

  priceSlider.addEventListener('input', (e) => {
    currentFilters.priceMax = parseInt(e.target.value);
    updatePriceDisplay();
    renderListings();
  });

  // Quick filters
  recommendedCheckbox.addEventListener('change', (e) => {
    currentFilters.recommendedOnly = e.target.checked;
    renderListings();
  });

  claCheckbox.addEventListener('change', (e) => {
    currentFilters.claOnly = e.target.checked;
    renderListings();
  });

  // Sort
  sortRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentFilters.sortBy = e.target.value;
      renderListings();
    });
  });

  // Clear filters
  clearFiltersBtn.addEventListener('click', clearAllFilters);
}

// ── FILTER INITIALIZATION ──
function initializeFilters() {
  // Get unique platforms and variants
  const platforms = [...new Set(listings.map(l => l.platform))];
  const variants = [...new Set(listings.map(l => l.variant))];

  // Render platform filters
  platforms.forEach(platform => {
    const label = document.createElement('label');
    label.className = 'filter-checkbox';
    const count = listings.filter(l => l.platform === platform).length;
    label.innerHTML = `
      <input type="checkbox" value="${platform}" class="platform-filter">
      <span>${platform}</span>
      <span class="filter-count">${count}</span>
    `;
    platformFiltersDiv.appendChild(label);
  });

  // Render variant filters
  variants.forEach(variant => {
    const label = document.createElement('label');
    label.className = 'filter-checkbox';
    label.innerHTML = `
      <input type="checkbox" value="${variant}" class="variant-filter">
      <span>${variant}</span>
    `;
    variantFiltersDiv.appendChild(label);
  });

  // Add event listeners to platform and variant filters
  document.querySelectorAll('.platform-filter').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        currentFilters.platforms.push(e.target.value);
      } else {
        currentFilters.platforms = currentFilters.platforms.filter(p => p !== e.target.value);
      }
      renderListings();
    });
  });

  document.querySelectorAll('.variant-filter').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        currentFilters.variants.push(e.target.value);
      } else {
        currentFilters.variants = currentFilters.variants.filter(v => v !== e.target.value);
      }
      renderListings();
    });
  });
}

// ── FILTER LISTINGS ──
function getFilteredListings() {
  let filtered = listings.filter(listing => {
    if (listing.price < currentFilters.priceMin || listing.price > currentFilters.priceMax) return false;
    if (currentFilters.platforms.length > 0 && !currentFilters.platforms.includes(listing.platform)) return false;
    if (currentFilters.variants.length > 0 && !currentFilters.variants.includes(listing.variant)) return false;
    if (currentFilters.recommendedOnly && !listing.recommended) return false;
    if (currentFilters.claOnly && !listing.claDate) return false;
    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    if (currentFilters.sortBy === 'price_asc') return a.price - b.price;
    if (currentFilters.sortBy === 'price_desc') return b.price - a.price;
    if (currentFilters.sortBy === 'value') return b.valueScore - a.valueScore;
    if (currentFilters.sortBy === 'quality') return b.qualityScore - a.qualityScore;
    return 0;
  });

  return filtered;
}

// ── RENDER LISTINGS ──
function renderListings() {
  const filtered = getFilteredListings();
  filteredCount.textContent = filtered.length;

  // Update clear button visibility
  const hasFilters = currentFilters.platforms.length > 0 || 
                     currentFilters.variants.length > 0 ||
                     currentFilters.recommendedOnly ||
                     currentFilters.claOnly ||
                     currentFilters.priceMin > 0 ||
                     currentFilters.priceMax < 5000;
  clearFiltersBtn.style.display = hasFilters ? 'flex' : 'none';

  listingsGrid.innerHTML = '';

  if (filtered.length === 0) {
    listingsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #7a7a7a;"><p style="font-size: 1.2rem; margin-bottom: 0.5rem;">No listings found</p><p>Try adjusting your filters</p></div>';
    return;
  }

  filtered.forEach(listing => {
    const card = createListingCard(listing);
    listingsGrid.appendChild(card);
  });
}

// ── CREATE LISTING CARD ──
function createListingCard(listing) {
  const card = document.createElement('div');
  card.className = 'listing-card';
  
  const platformColor = platformColors[listing.platform] || '#999';
  const conditionColor = conditionColors[listing.condition] || '#f0f0f0';

  card.innerHTML = `
    <div class="listing-top-bar" style="background-color: ${platformColor}"></div>
    <div class="listing-content">
      <div class="listing-badges">
        <span class="badge badge-platform" style="background-color: ${platformColor}">${listing.platform}</span>
        <span class="badge badge-condition" style="background-color: ${conditionColor}">${listing.condition}</span>
        ${listing.recommended ? '<span class="badge badge-recommended">★ Recommended</span>' : ''}
        ${listing.claDate ? '<span class="badge badge-cla">CLA\'d</span>' : ''}
      </div>
      
      <h3 class="listing-title">${listing.title}</h3>
      
      <div class="listing-price">$${listing.price.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
      ${listing.originalPrice ? `<div class="listing-original-price">$${listing.originalPrice.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>` : ''}
      
      <div class="score-bar">
        <span class="score-label">Value</span>
        <div class="score-dots">
          ${Array.from({length: 10}).map((_, i) => `<div class="dot ${i < listing.valueScore ? 'filled' : ''}"></div>`).join('')}
        </div>
        <span class="score-number">${listing.valueScore}/10</span>
      </div>
      
      <div class="score-bar">
        <span class="score-label">Quality</span>
        <div class="score-dots">
          ${Array.from({length: 10}).map((_, i) => `<div class="dot quality-filled ${i < listing.qualityScore ? 'filled' : ''}"></div>`).join('')}
        </div>
        <span class="score-number">${listing.qualityScore}/10</span>
      </div>
      
      <div class="listing-meta">
        <span>📍 ${listing.location}</span>
        <span>🚚 ${listing.shipping}</span>
      </div>
      
      <button class="expand-btn" onclick="toggleExpand(this)">
        <i class="fas fa-chevron-down"></i>
        <span>Show details</span>
      </button>
      
      <div class="listing-expandable">
        <p><strong>Condition:</strong> ${listing.conditionNotes}</p>
        <p><strong>Notes:</strong> ${listing.notes}</p>
        ${listing.claDate ? `<p><strong>CLA:</strong> ${listing.claDate}</p>` : ''}
        <p><strong>Variant:</strong> ${listing.variant}</p>
      </div>
      
      <a href="${listing.url}" target="_blank" rel="noopener noreferrer" class="listing-cta">
        View Listing <i class="fas fa-external-link-alt"></i>
      </a>
    </div>
  `;

  return card;
}

// ── TOGGLE EXPAND ──
function toggleExpand(btn) {
  const expandable = btn.nextElementSibling;
  const isOpen = expandable.classList.contains('open');
  expandable.classList.toggle('open');
  btn.innerHTML = isOpen ? 
    '<i class="fas fa-chevron-down"></i><span>Show details</span>' : 
    '<i class="fas fa-chevron-up"></i><span>Hide details</span>';
}

// ── UPDATE PRICE DISPLAY ──
function updatePriceDisplay() {
  priceMinDisplay.textContent = '$' + currentFilters.priceMin.toLocaleString();
  priceMaxDisplay.textContent = '$' + currentFilters.priceMax.toLocaleString();
  priceMinInput.value = currentFilters.priceMin;
  priceMaxInput.value = currentFilters.priceMax;
  priceSlider.value = currentFilters.priceMax;
}

// ── CLEAR ALL FILTERS ──
function clearAllFilters() {
  currentFilters = {
    priceMin: 0,
    priceMax: 5000,
    platforms: [],
    variants: [],
    recommendedOnly: false,
    claOnly: false,
    sortBy: 'price_asc',
  };

  // Reset UI
  priceMinInput.value = 0;
  priceMaxInput.value = 5000;
  priceSlider.value = 5000;
  updatePriceDisplay();
  recommendedCheckbox.checked = false;
  claCheckbox.checked = false;
  document.querySelector('input[value="price_asc"]').checked = true;
  document.querySelectorAll('.platform-filter, .variant-filter').forEach(cb => cb.checked = false);

  renderListings();
}

// ── RENDER CHARTS ──
function renderCharts() {
  // Platform comparison table
  const platformTable = document.getElementById('platformTable');
  Object.entries(platformInfo).forEach(([platform, info]) => {
    const count = listings.filter(l => l.platform === platform).length;
    if (count === 0) return;
    
    const row = document.createElement('tr');
    const platformColor = platformColors[platform] || '#999';
    row.innerHTML = `
      <td>
        <a href="${info.url}" target="_blank" class="platform-link">
          <span class="platform-dot" style="background-color: ${platformColor}"></span>
          ${platform}
          <i class="fas fa-external-link-alt"></i>
        </a>
      </td>
      <td>${info.type}</td>
      <td>${info.warranty}</td>
      <td>${info.returns}</td>
      <td>${count}</td>
    `;
    platformTable.appendChild(row);
  });

  // Calculate stats
  const prices = listings.map(l => l.price);
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const sortedPrices = [...prices].sort((a, b) => a - b);
  const medianPrice = sortedPrices[Math.floor(sortedPrices.length / 2)];

  document.getElementById('avgPrice').textContent = '$' + avgPrice.toLocaleString();
  document.getElementById('medianPrice').textContent = '$' + medianPrice.toLocaleString();

  // Platform price chart
  renderPlatformChart();
  
  // Variant price chart
  renderVariantChart();
}

// ── RENDER PLATFORM CHART ──
function renderPlatformChart() {
  const platformChart = document.getElementById('platformChart');
  platformChart.innerHTML = '';

  const platformData = [
    { platform: 'eBay', min: 845, avg: 1540, max: 2295 },
    { platform: 'KEH Camera', min: 1699, avg: 1849, max: 1999 },
    { platform: 'MPB', min: 1350, avg: 1500, max: 1650 },
    { platform: 'Camera West', min: 1495, avg: 1545, max: 1595 },
    { platform: 'GearFocus', min: 3700, avg: 3700, max: 3700 },
    { platform: 'Classic Connection', min: 2799, avg: 2799, max: 2799 },
    { platform: 'Facebook/Craigslist', min: 1300, avg: 1758, max: 2200 },
  ];

  const maxPrice = 4000;
  const chartHeight = 250;

  platformData.forEach(data => {
    const group = document.createElement('div');
    group.className = 'chart-bar-group';

    const barsContainer = document.createElement('div');
    barsContainer.className = 'chart-bars';

    const minBar = document.createElement('div');
    minBar.className = 'bar min';
    minBar.style.height = (data.min / maxPrice * chartHeight) + 'px';
    minBar.title = `Min: $${data.min}`;

    const avgBar = document.createElement('div');
    avgBar.className = 'bar avg';
    avgBar.style.height = (data.avg / maxPrice * chartHeight) + 'px';
    avgBar.title = `Avg: $${data.avg}`;

    const maxBar = document.createElement('div');
    maxBar.className = 'bar max';
    maxBar.style.height = (data.max / maxPrice * chartHeight) + 'px';
    maxBar.title = `Max: $${data.max}`;

    barsContainer.appendChild(minBar);
    barsContainer.appendChild(avgBar);
    barsContainer.appendChild(maxBar);

    const label = document.createElement('div');
    label.className = 'bar-label';
    label.textContent = data.platform;

    group.appendChild(barsContainer);
    group.appendChild(label);
    platformChart.appendChild(group);
  });
}

// ── RENDER VARIANT CHART ──
function renderVariantChart() {
  const variantChart = document.getElementById('variantChart');
  variantChart.innerHTML = '';

  const variantData = [
    { variant: 'Double Stroke (DS)', min: 845, avg: 1480, max: 2295 },
    { variant: 'Single Stroke (SS)', min: 1129, avg: 1730, max: 2799 },
    { variant: 'Very Early DS', min: 1550, avg: 2625, max: 3700 },
  ];

  const maxPrice = 4000;
  const chartHeight = 250;

  variantData.forEach(data => {
    const group = document.createElement('div');
    group.className = 'chart-bar-group';

    const barsContainer = document.createElement('div');
    barsContainer.className = 'chart-bars';

    const minBar = document.createElement('div');
    minBar.className = 'bar min';
    minBar.style.height = (data.min / maxPrice * chartHeight) + 'px';
    minBar.title = `Min: $${data.min}`;

    const avgBar = document.createElement('div');
    avgBar.className = 'bar avg';
    avgBar.style.height = (data.avg / maxPrice * chartHeight) + 'px';
    avgBar.title = `Avg: $${data.avg}`;

    const maxBar = document.createElement('div');
    maxBar.className = 'bar max';
    maxBar.style.height = (data.max / maxPrice * chartHeight) + 'px';
    maxBar.title = `Max: $${data.max}`;

    barsContainer.appendChild(minBar);
    barsContainer.appendChild(avgBar);
    barsContainer.appendChild(maxBar);

    const label = document.createElement('div');
    label.className = 'bar-label';
    label.textContent = data.variant;

    group.appendChild(barsContainer);
    group.appendChild(label);
    variantChart.appendChild(group);
  });
}

// ── RENDER GUIDE ──
function renderGuide() {
  // Buying tips
  const buyingTipsDiv = document.getElementById('buyingTips');
  buyingTips.forEach(tip => {
    const item = document.createElement('div');
    item.className = 'tip-item';
    item.innerHTML = `
      <div class="tip-icon check">
        <i class="fas fa-check-circle"></i>
      </div>
      <p class="tip-text">${tip}</p>
    `;
    buyingTipsDiv.appendChild(item);
  });

  // Red flags
  const redFlagsDiv = document.getElementById('redFlags');
  redFlags.forEach(flag => {
    const item = document.createElement('div');
    item.className = 'tip-item';
    item.innerHTML = `
      <div class="tip-icon warning">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <p class="tip-text">${flag}</p>
    `;
    redFlagsDiv.appendChild(item);
  });

  // Resources
  const resourcesDiv = document.getElementById('resources');
  resources.forEach(resource => {
    const link = document.createElement('a');
    link.href = resource.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'resource-link';
    link.innerHTML = `
      <div class="resource-icon">
        <i class="fas fa-external-link-alt"></i>
      </div>
      <div class="resource-content">
        <h3>${resource.name}</h3>
        <p>${resource.desc}</p>
      </div>
    `;
    resourcesDiv.appendChild(link);
  });
}

// ── SWITCH SECTION ──
function switchSection(sectionName) {
  // Update tabs
  navTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.section === sectionName);
  });

  // Update sections
  sections.forEach(section => {
    section.classList.toggle('active', section.id === sectionName);
  });
}
