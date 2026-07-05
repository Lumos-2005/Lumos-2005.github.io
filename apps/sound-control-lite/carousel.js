(function () {
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
