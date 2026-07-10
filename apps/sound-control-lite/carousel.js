(function () {
  function formatDownloadCount(count) {
    if (count < 1000) {
      return String(count);
    }

    return `${(Math.floor(count / 100) / 10).toFixed(1)}k`;
  }

  async function loadDownloadCount() {
    const downloadCountValue = document.querySelector("#downloadCountValue");

    if (!downloadCountValue) {
      return;
    }

    try {
      // GitHub Pages static files do not expose download counts. This counter uses GitHub Releases asset download counts and sums all SoundControlLite DMG versions.
      const response = await fetch("https://api.github.com/repos/Lumos-2005/Lumos-2005.github.io/releases");

      if (!response.ok) {
        return;
      }

      const releases = await response.json();
      const total = releases.reduce((sum, release) => {
        const assets = Array.isArray(release.assets) ? release.assets : [];

        return sum + assets.reduce((assetSum, asset) => {
          if (!/^SoundControlLite-v.*\.dmg$/.test(asset.name)) {
            return assetSum;
          }

          return assetSum + Number(asset.download_count || 0);
        }, 0);
      }, 0);

      if (!Number.isFinite(total) || total < 0) {
        return;
      }

      downloadCountValue.textContent = formatDownloadCount(total);
    } catch (error) {
      return;
    }
  }

  document.addEventListener("DOMContentLoaded", loadDownloadCount);

  const carousel = document.querySelector(".scl-carousel");

  if (!carousel) {
    return;
  }

  const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
  const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));
  const prev = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");

  if (!slides.length || !dots.length || !prev || !next) {
    return;
  }

  let current = 0;
  let timerId = null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function show(index) {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === current);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  }

  function stop() {
    window.clearInterval(timerId);
    timerId = null;
  }

  function start() {
    stop();

    if (reduceMotion.matches) {
      return;
    }

    timerId = window.setInterval(() => {
      show(current + 1);
    }, 5000);
  }

  prev.addEventListener("click", () => {
    show(current - 1);
    start();
  });

  next.addEventListener("click", () => {
    show(current + 1);
    start();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      show(index);
      start();
    });
  });

  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);

  show(0);
  start();
})();
