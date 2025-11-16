/* ============================
   Helpers
============================ */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* ============================
   Elements
============================ */
const sliderTrack = $("#cardSlider");    // track que move
const prevBtn = $("#prev");
const nextBtn = $("#next");
const dotsContainer = $("#dots");
const themeToggle = $("#themeToggle");

let index = 0;
let autoplayTimer = null;
const AUTOPLAY_DELAY = 4800;

/* ============================
   Init
============================ */
window.addEventListener("load", () => {
  createDots();
  goTo(0, false);
  startAutoplay();
});

/* ============================
   Criação dos pontos
============================ */
function createDots() {
  const cards = $$(".card");
  dotsContainer.innerHTML = "";

  cards.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.className = "dot" + (i === 0 ? " active" : "");
    btn.addEventListener("click", () => {
      goTo(i);
      restartAutoplay();
    });
    dotsContainer.appendChild(btn);
  });
}

function getDots() {
  return Array.from(dotsContainer.children);
}

/* ============================
   Slider Logic
============================ */
function goTo(i, animate = true) {
  const cards = $$(".card");

  if (cards.length === 0) return;

  if (i < 0) i = cards.length - 1;
  if (i >= cards.length) i = 0;
  index = i;

  const offset = index * -100;

  if (!animate) sliderTrack.style.transition = "none";
  sliderTrack.style.transform = `translateX(${offset}%)`;
  if (!animate) requestAnimationFrame(() => (sliderTrack.style.transition = ""));

  getDots().forEach((dot, idx) => {
    dot.classList.toggle("active", idx === index);
  });
}

/* Buttons */
prevBtn?.addEventListener("click", () => {
  goTo(index - 1);
  restartAutoplay();
});

nextBtn?.addEventListener("click", () => {
  goTo(index + 1);
  restartAutoplay();
});

/* ============================
   Autoplay
============================ */
function startAutoplay() {
  stopAutoplay();
  autoplayTimer = setInterval(() => {
    goTo(index + 1);
  }, AUTOPLAY_DELAY);
}

function stopAutoplay() {
  if (autoplayTimer) clearInterval(autoplayTimer);
}

function restartAutoplay() {
  stopAutoplay();
  startAutoplay();
}

/* ============================
   Swipe (mobile)
============================ */
(function enableSwipe() {
  let startX = 0;

  sliderTrack.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  sliderTrack.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) {
      goTo(index + 1);
      restartAutoplay();
    } else if (endX - startX > 50) {
      goTo(index - 1);
      restartAutoplay();
    }
  });
})();

/* ============================
   Tema (light / dark) com save
============================ */
(function themeInit() {
  const saved = localStorage.getItem("dev_theme");

  if (saved === "light") {
    document.body.classList.add("light");
    themeToggle.textContent = "🌞";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    themeToggle.textContent = isLight ? "🌞" : "🌙";
    localStorage.setItem("dev_theme", isLight ? "light" : "dark");
  });
})();
