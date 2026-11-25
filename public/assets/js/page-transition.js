(() => {
  const overlay = document.querySelector('[data-page-transition]');
  if (!overlay) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    document.documentElement.classList.remove('transition-in');
    return;
  }

  const STORAGE_KEY = 'callflow-page-transition';
  const settle = () => overlay.classList.remove('is-leaving');
  const finishLeaving = () => {
    overlay.addEventListener('animationend', settle, { once: true });
    overlay.addEventListener('transitionend', settle, { once: true });
    setTimeout(settle, 900);
  };

  if (sessionStorage.getItem(STORAGE_KEY) === '1') {
    sessionStorage.removeItem(STORAGE_KEY);
    overlay.classList.add('is-covering', 'is-instant');
    document.documentElement.classList.remove('transition-in');
    void overlay.offsetWidth;
    overlay.classList.remove('is-instant');
    setTimeout(() => {
      overlay.classList.remove('is-covering');
      overlay.classList.add('is-leaving');
      finishLeaving();
    }, 40);
  }

  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    document.documentElement.classList.remove('transition-in');
    overlay.classList.remove('is-covering', 'is-leaving', 'is-instant');
  });

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest('a[href]');
    if (!link || link.target || link.hasAttribute('download')) return;

    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname) return;

    event.preventDefault();
    sessionStorage.setItem(STORAGE_KEY, '1');

    overlay.classList.remove('is-leaving');
    void overlay.offsetWidth;
    overlay.classList.add('is-covering');

    let navigated = false;
    const go = () => {
      if (navigated) return;
      navigated = true;
      location.href = url.href;
    };

    overlay.addEventListener('transitionend', go, { once: true });
    setTimeout(go, 620);
  });
})();
