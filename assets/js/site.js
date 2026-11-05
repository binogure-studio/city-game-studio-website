(function () {
  'use strict';

  // Mobile menu
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Trailer: load YouTube only when asked
  var yt = document.querySelector('.yt');
  if (yt) {
    yt.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + yt.dataset.yt + '?autoplay=1&rel=0';
      iframe.title = 'City Game Studio trailer';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
      iframe.allowFullscreen = true;
      yt.replaceWith(iframe);
    });
  }

  // Screenshot lightbox
  var box = document.getElementById('lightbox');
  var boxImg = document.getElementById('lightbox-img');
  var boxCap = document.getElementById('lightbox-cap');
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.gallery button'));
  var current = 0;

  function show(i) {
    current = (i + thumbs.length) % thumbs.length;
    var t = thumbs[current];
    var alt = t.querySelector('img').alt;
    boxImg.src = t.dataset.full;
    boxImg.alt = alt;
    boxCap.textContent = alt;
  }

  if (box && typeof box.showModal === 'function') {
    thumbs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(i); box.showModal(); });
    });
    box.addEventListener('click', function (e) {
      var step = e.target.dataset && e.target.dataset.step;
      if (step) { show(current + Number(step)); return; }
      if (e.target === box || e.target.classList.contains('lightbox-close')) box.close();
    });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') show(current + 1);
      if (e.key === 'ArrowLeft') show(current - 1);
    });
  } else {
    // Old browsers: open the full image directly
    thumbs.forEach(function (t) {
      t.addEventListener('click', function () { window.open(t.dataset.full, '_blank'); });
    });
  }

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Gameplay clips: play only while visible, never with reduced motion
  var clips = document.querySelectorAll('video.clip');
  if (calm.matches || !('IntersectionObserver' in window)) {
    clips.forEach(function (v) { v.controls = true; v.preload = 'metadata'; });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { var p = e.target.play(); if (p && p.catch) p.catch(function () {}); }
        else e.target.pause();
      });
    }, { threshold: 0.35 });
    clips.forEach(function (v) { io.observe(v); });
  }

  // Header logo appears once the big hero logo scrolls away
  var topbar = document.querySelector('.topbar');
  var heroLogo = document.querySelector('.hero-logo');
  if (topbar && heroLogo && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      topbar.classList.toggle('at-top', entries[0].isIntersecting);
    }, { rootMargin: '-72px 0px 0px 0px' }).observe(heroLogo);
  }

  // Latest Steam news, from the JSON the GitHub Action keeps up to date
  var newsSection = document.getElementById('news');
  var newsList = document.getElementById('news-list');
  if (newsSection && newsList && window.fetch) {
    fetch('assets/data/news.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        var items = data && data.items;
        if (!items || !items.length) return;
        items.forEach(function (n) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.className = 'news-card';
          a.href = n.url;
          a.rel = 'noopener';
          a.dataset.cta = 'news';

          var img = document.createElement('img');
          img.src = n.image || 'assets/img/og.jpg';
          img.alt = '';
          img.loading = 'lazy';
          img.onerror = function () { img.onerror = null; img.src = 'assets/img/og.jpg'; };

          var body = document.createElement('div');
          body.className = 'news-body';
          var date = document.createElement('p');
          date.className = 'news-date';
          date.textContent = new Date(n.date * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
          var title = document.createElement('h3');
          title.textContent = n.title;
          var text = document.createElement('p');
          text.className = 'news-excerpt';
          text.textContent = n.excerpt;

          body.append(date, title, text);
          a.append(img, body);
          li.append(a);
          newsList.append(li);
        });
        newsSection.hidden = false;
      })
      .catch(function () {});
  }
  // Links to #news point to Steam until the section is filled
  document.querySelectorAll('[data-news-link]').forEach(function (l) {
    l.addEventListener('click', function (e) {
      if (newsSection && newsSection.hidden) {
        e.preventDefault();
        window.open('https://store.steampowered.com/news/app/726840', '_blank', 'noopener');
      }
    });
  });

  // Track store clicks in GTM
  document.querySelectorAll('a[href*="store.steampowered.com"], a[href*="gog.com"], a[href*="itch.io"]').forEach(function (a) {
    a.addEventListener('click', function () {
      (window.dataLayer = window.dataLayer || []).push({ event: 'store_click', store: a.hostname, cta: a.dataset.cta || 'other' });
    });
  });

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
