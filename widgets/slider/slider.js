// ------- Path helpers (repo-aware) -------
function projectBase() {
  // e.g. /widgets-notion/widgets/slider/ -> base = /widgets-notion/
  const parts = location.pathname.split('/').filter(Boolean);
  return '/' + (parts[0] || '') + '/';
}
function toAbsoluteRepoPath(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path; // absolute URL
  if (path.startsWith('/')) return path;       // root-relative (/widgets-notion/...)
  return projectBase() + path.replace(/^\.?\//, '');
}

// ------- Slider -------
class ImageSlider {
  constructor(containerId, data) {
    this.container = document.getElementById(containerId);
    this.data = data;
    this.currentIndex = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.slideWidth = 0; // px
    this.init();
  }

  init() {
    this.render();
    this.cache();
    this.attachEventListeners();
    this.computeSlideWidth();
    this.updateSlider(true);

    // Recalculate after images load (layout may change)
    const imgs = this.container.querySelectorAll('img');
    let remaining = imgs.length;
    if (remaining === 0) return;
    imgs.forEach(img => {
      if (img.complete) { if (--remaining === 0) this.onAllImagesLoaded(); }
      else {
        img.addEventListener('load', () => { if (--remaining === 0) this.onAllImagesLoaded(); });
        img.addEventListener('error', () => { if (--remaining === 0) this.onAllImagesLoaded(); });
      }
    });
  }

  onAllImagesLoaded() {
    this.computeSlideWidth();
    this.updateSlider(true);
  }

  render() {
    const { title, images } = this.data;
    const html = `
      <div class="slider-container">
        ${title ? `<div class="slider-title">${this.escapeHtml(title)}</div>` : ''}
        <div class="slider-wrapper">
          <button class="slider-arrow slider-arrow-prev" aria-label="Previous slide">&#8249;</button>
          <div class="slider-track">
            ${images.map((img, i) => `
              <div class="slider-slide" data-index="${i}">
                <img src="${this.escapeHtml(img.url)}" alt="${this.escapeHtml(img.alt || '')}" loading="lazy" decoding="async">
                ${img.caption ? `<div class="slider-caption">${this.escapeHtml(img.caption)}</div>` : ''}
              </div>
            `).join('')}
          </div>
          <button class="slider-arrow slider-arrow-next" aria-label="Next slide">&#8250;</button>
        </div>
        <div class="slider-dots">
          ${images.map((_, i) => `
            <button class="slider-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>
          `).join('')}
        </div>
      </div>`;
    this.container.innerHTML = html;
  }

  cache() {
    this.sliderTrack = this.container.querySelector('.slider-track');
    this.wrapper = this.container.querySelector('.slider-wrapper');
    this.prevBtn = this.container.querySelector('.slider-arrow-prev');
    this.nextBtn = this.container.querySelector('.slider-arrow-next');
    this.dots = this.container.querySelectorAll('.slider-dot');
    this.count = this.data.images.length;
  }

  escapeHtml(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

  attachEventListeners() {
    // arrows
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());

    // dots
    this.dots.forEach(d => {
      d.addEventListener('click', e => {
        const i = parseInt(e.currentTarget.dataset.index, 10);
        this.goToSlide(i);
      });
    });

    // keyboard (ignore inputs)
    this.keyboardHandler = e => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return;
      if (e.key === 'ArrowLeft') this.prevSlide();
      else if (e.key === 'ArrowRight') this.nextSlide();
    };
    document.addEventListener('keydown', this.keyboardHandler);

    // touch swipe
    this.wrapper.addEventListener('touchstart', e => {
      if (e.touches?.length) this.touchStartX = e.touches[0].clientX;
    }, { passive: true });
    this.wrapper.addEventListener('touchmove', e => {
      if (e.touches?.length) this.touchEndX = e.touches[0].clientX;
    }, { passive: true });
    this.wrapper.addEventListener('touchend', () => this.handleSwipe());

    // mouse drag
    let dragging = false, startX = 0, endX = 0;
    this.wrapper.addEventListener('mousedown', e => { dragging = true; startX = endX = e.clientX; });
    this.wrapper.addEventListener('mousemove', e => { if (dragging) endX = e.clientX; });
    this.wrapper.addEventListener('mouseup', () => {
      if (!dragging) return;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) (diff > 0 ? this.nextSlide() : this.prevSlide());
      dragging = false;
    });
    this.wrapper.addEventListener('mouseleave', () => { dragging = false; });

    // resize (debounced)
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.computeSlideWidth();
        this.updateSlider(true);
      }, 100);
    });
  }

  computeSlideWidth() {
    const w = this.wrapper.getBoundingClientRect().width;
    this.slideWidth = Math.max(0, Math.round(w));
  }

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > 50) (diff > 0 ? this.nextSlide() : this.prevSlide());
  }

  prevSlide() { this.currentIndex = (this.currentIndex - 1 + this.count) % this.count; this.updateSlider(); }
  nextSlide() { this.currentIndex = (this.currentIndex + 1) % this.count; this.updateSlider(); }
  goToSlide(i) { if (i >= 0 && i < this.count) { this.currentIndex = i; this.updateSlider(); } }

  updateSlider(immediate = false) {
    const offsetPx = -(this.currentIndex * this.slideWidth);
    if (immediate) {
      const prev = this.sliderTrack.style.transition;
      this.sliderTrack.style.transition = 'none';
      this.sliderTrack.style.transform = `translate3d(${offsetPx}px,0,0)`;
      void this.sliderTrack.offsetWidth; // reflow
      this.sliderTrack.style.transition = prev || 'transform .3s ease-in-out';
    } else {
      this.sliderTrack.style.transform = `translate3d(${offsetPx}px,0,0)`;
    }
    this.dots.forEach((d, i) => d.classList.toggle('active', i === this.currentIndex));
  }
}

// ------- Boot -------
(async function init() {
  const params = new URLSearchParams(location.search);
  const dataParam = params.get('data') || 'data/slider/example.json';
  const dataUrl = toAbsoluteRepoPath(dataParam);
  const root = document.getElementById('slider-root');

  try {
    root.innerHTML = '<div style="text-align:center;padding:40px;color:#666">Loading slider...</div>';
    const res = await fetch(dataUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load data: ${res.status} ${res.statusText}`);
    const data = await res.json();
    if (!data.images || !Array.isArray(data.images) || data.images.length === 0)
      throw new Error('Invalid data format: images array is required');
    new ImageSlider('slider-root', data);
  } catch (err) {
    console.error('Error loading slider:', err);
    root.innerHTML = `
      <div style="text-align:center;padding:40px;color:#e74c3c">
        <h2>Error Loading Slider</h2>
        <p>${err.message}</p>
        <p>Data URL: ${toAbsoluteRepoPath(dataParam)}</p>
      </div>`;
  }
})();

