/* =========================================================
   前期課題サイト - JavaScript
   - スキルローテーター（自動スクロール）
   - スクロール時のフェードイン
   - TOPボタンの表示制御
   ========================================================= */

(function () {
  'use strict';

  /* ============================================
     スキルローテーター
     ============================================ */
  function initSkillsRotator() {
    const rotator = document.getElementById('skills-rotator');
    if (!rotator) return;

    const track = rotator.querySelector('.track');
    if (!track) return;

    // モバイル(640px以下)ではタッチスワイプに任せる
    const isMobile = () => window.matchMedia('(max-width: 640px)').matches;

    if (isMobile()) {
      rotator.style.overflowX = 'auto';
      rotator.style.scrollSnapType = 'x mandatory';
      Array.from(track.children).forEach((el) => {
        el.style.scrollSnapAlign = 'start';
      });
      return;
    }

    // 元のアイテムを複製してシームレスループにする
    const originalHTML = track.innerHTML;
    track.innerHTML = originalHTML + originalHTML;

    let speed = 0.4;
    let x = 0;
    let halfWidth = 0;
    let paused = false;

    function measure() {
      const items = track.children;
      const itemCount = items.length / 2;
      if (itemCount === 0) return;

      const viewport = rotator.clientWidth;

      for (let i = 0; i < items.length; i++) {
        items[i].style.width = viewport + 'px';
      }

      halfWidth = viewport * itemCount;
      x = (((x % halfWidth) + halfWidth) % halfWidth) * -1;
      track.style.transform = 'translateX(' + x + 'px)';
    }

    function tick() {
      if (!paused) {
        x -= speed;
        if (Math.abs(x) >= halfWidth) {
          x = 0;
        }
        track.style.transform = 'translateX(' + x + 'px)';
      }
      requestAnimationFrame(tick);
    }

    rotator.addEventListener('mouseenter', function () {
      paused = true;
      rotator.classList.add('is-paused');
    });
    rotator.addEventListener('mouseleave', function () {
      paused = false;
      rotator.classList.remove('is-paused');
    });

    document.addEventListener('visibilitychange', function () {
      paused = document.hidden;
    });

    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measure, 150);
    });

    measure();
    tick();
  }

  /* ============================================
     スクロールフェードイン
     ============================================ */
  function initFadeIn() {
    const targets = document.querySelectorAll('.fade-in');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ============================================
     TOPボタン表示制御
     ============================================ */
  function initTopButton() {
    const topBtn = document.getElementById('top');
    if (!topBtn) return;

    let ticking = false;

    function update() {
      if (window.scrollY > 400) {
        topBtn.classList.add('visible');
      } else {
        topBtn.classList.remove('visible');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    });

    update();
  }

  /* ============================================
     ナビゲーションのアクティブ表示
     ============================================ */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#global_nav a[href^="#"]');
    if (!sections.length || !navLinks.length) return;
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(function (link) {
              const href = link.getAttribute('href');
              if (href === '#' + id) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(function (sec) { observer.observe(sec); });
  }

  function init() {
    initSkillsRotator();
    initFadeIn();
    initTopButton();
    initActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
