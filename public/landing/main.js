const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const searchButton = document.querySelector('.search-button');
const searchPanel = document.querySelector('.search-panel');
const closeSearch = document.querySelector('.search-close');
const topbar = document.querySelector('.topbar');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.classList.toggle('open', open);
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  });
});

searchButton.addEventListener('click', () => {
  searchPanel.hidden = !searchPanel.hidden;
  if (!searchPanel.hidden) document.querySelector('#site-search').focus();
});

closeSearch.addEventListener('click', () => {
  searchPanel.hidden = true;
  searchButton.focus();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let scrollFrame = 0;

const syncScroll = () => {
  scrollFrame = 0;
  topbar.classList.toggle('is-scrolled', window.scrollY > 36);

  if (reduceMotion) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;
  const bounds = hero.getBoundingClientRect();
  const progress = Math.min(1, Math.max(0, -bounds.top / bounds.height));
  hero.style.setProperty('--hero-scroll', `${(progress * 54).toFixed(1)}px`);
  hero.style.setProperty('--hero-fade', (progress * 0.55).toFixed(2));
  hero.style.setProperty('--hero-copy-y', `${(-progress * 36).toFixed(1)}px`);
};

window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(syncScroll);
}, { passive: true });
syncScroll();

if (!reduceMotion) {
  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  if (finePointer) {
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');
    let heroFrame = 0;

    hero.addEventListener('pointermove', (event) => {
      if (heroFrame) return;
      heroFrame = requestAnimationFrame(() => {
        heroFrame = 0;
        const bounds = hero.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        heroImage.style.setProperty('--hero-x', `${(-x * 9).toFixed(1)}px`);
        heroImage.style.setProperty('--hero-y', `${(-y * 7).toFixed(1)}px`);
      });
    });

    hero.addEventListener('pointerleave', () => {
      heroImage.style.setProperty('--hero-x', '0px');
      heroImage.style.setProperty('--hero-y', '0px');
    });

    document.querySelectorAll('.story-card, .service-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.setProperty('--tilt-x', `${(-y * 3).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${(x * 3.6).toFixed(2)}deg`);
        card.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }
}
