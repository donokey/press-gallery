(function () {
  let articles = [];
  let currentCategory = 'all';
  let currentSearch = '';
  let searchTimer = null;

  /* ---- DOM refs ---- */
  const categoryPills = document.getElementById('categoryPills');
  const searchInput = document.getElementById('searchInput');
  const heroZone = document.getElementById('heroZone');
  const articleGrid = document.getElementById('articleGrid');
  const noResults = document.getElementById('noResults');

  /* ---- Fetch ---- */
  async function fetchArticles() {
    try {
      const res = await fetch('data/articles.json');
      if (!res.ok) throw new Error('Failed to load articles');
      articles = await res.json();
      init();
    } catch (err) {
      articleGrid.innerHTML =
        '<p style="text-align:center;grid-column:1/-1;color:var(--color-muted);">文章加载失败，请刷新页面重试。</p>';
      console.error(err);
    }
  }

  /* ---- Init ---- */
  function init() {
    renderCategories();
    renderAll();
    bindEvents();
  }

  /* ---- Categories ---- */
  function renderCategories() {
    const cats = ['all', ...new Set(articles.map(a => a.category))];
    categoryPills.innerHTML = cats
      .map(c =>
        `<button class="pill${c === 'all' ? ' active' : ''}" data-category="${c}">
          ${c === 'all' ? '全部' : c}
        </button>`
      )
      .join('');
  }

  /* ---- Filtering ---- */
  function getFiltered() {
    return articles
      .filter(a => {
        if (currentCategory !== 'all' && a.category !== currentCategory) return false;
        if (currentSearch && !a.title.toLowerCase().includes(currentSearch.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  /* ---- Rendering ---- */
  function renderAll() {
    const filtered = getFiltered();

    if (filtered.length === 0) {
      heroZone.innerHTML = '';
      articleGrid.innerHTML = '';
      noResults.classList.add('visible');
      return;
    }

    noResults.classList.remove('visible');

    const heroArticles = filtered.slice(0, 3);
    const gridArticles = filtered.slice(3);

    heroZone.innerHTML = heroArticles.map(a => createCard(a, a.id)).join('');
    articleGrid.innerHTML = gridArticles.map((a, i) => createCard(a, a.id, i + 3)).join('');
  }

  function createCard(article, id, position) {
    const classes = getCardModifiers(id);
    const hasImage = article.image && article.image.trim() !== '';

    const imageHTML = hasImage
      ? `<img class="card__image" src="${escapeHTML(article.image)}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block';">`
      : '';

    const placeholderHTML = hasImage
      ? `<div class="card__image--placeholder" style="display:none;"></div>`
      : `<div class="card__image--placeholder"></div>`;

    return `
      <a href="${escapeHTML(article.url)}" target="_blank" rel="noopener" class="card ${classes}">
        <div class="card__image-wrap">
          ${imageHTML}
          ${placeholderHTML}
          <span class="card__tag">${escapeHTML(article.category)}</span>
        </div>
        <div class="card__body">
          <h2 class="card__title">${escapeHTML(article.title)}</h2>
          <p class="card__summary">${escapeHTML(article.summary)}</p>
          <time class="card__date" datetime="${article.date}">${formatDate(article.date)}</time>
        </div>
      </a>`;
  }

  function getCardModifiers(id) {
    let classes = '';
    if (id % 7 === 6) classes += ' card--large';
    if (id % 11 === 10) classes += ' card--tall';
    return classes;
  }

  /* ---- Filter actions ---- */
  function setCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.pill').forEach(p => {
      p.classList.toggle('active', p.dataset.category === cat);
    });
    renderAll();
  }

  function setSearch(term) {
    currentSearch = term;
    renderAll();
  }

  /* ---- Events ---- */
  function bindEvents() {
    categoryPills.addEventListener('click', e => {
      if (e.target.classList.contains('pill')) {
        setCategory(e.target.dataset.category);
      }
    });

    searchInput.addEventListener('input', e => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => setSearch(e.target.value), 200);
    });
  }

  /* ---- Utilities ---- */
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  const entityMap = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  };

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, c => entityMap[c]);
  }

  /* ---- Start ---- */
  fetchArticles();
})();
