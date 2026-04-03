/* ========== COUNTDOWN ========== */
const WEDDING_DATE = new Date('2026-05-20T12:00:00+03:00');

function updateCountdown() {
  const now = new Date();
  let diff = WEDDING_DATE - now;

  if (diff < 0) diff = 0;

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / 1000 / 60) % 60;
  const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
  const totalDays = Math.floor(diff / 1000 / 60 / 60 / 24);
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;

  setCountdownValue('cdWeeks', weeks);
  setCountdownValue('cdDays', days);
  setCountdownValue('cdHours', hours);
  setCountdownValue('cdMinutes', minutes);
  setCountdownValue('cdSeconds', seconds);
}

function setCountdownValue(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  const str = String(value).padStart(2, '0');
  if (el.textContent !== str) {
    el.textContent = str;
    el.classList.remove('flip');
    // force reflow
    void el.offsetWidth;
    el.classList.add('flip');
  }
}

setInterval(updateCountdown, 1000);
updateCountdown();

/* ========== HEADER SCROLL ========== */
const header = document.getElementById('siteHeader');

function onScroll() {
  if (window.scrollY > 80) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ========== BURGER MENU ========== */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

/* ========== SCROLL ANIMATIONS ========== */
const animElements = document.querySelectorAll('.anim-fade, .anim-up');
const timeline = document.querySelector('.timeline');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Number(delay));
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

animElements.forEach(el => observer.observe(el));

// Timeline line animation
if (timeline) {
  const tlObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('timeline--visible');
        tlObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  tlObserver.observe(timeline);
}

/* ========== CALENDAR (Google Calendar intent) ========== */
function openCalendar() {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Свадьба Юлии и Никиты',
    dates: '20260520T090000Z/20260520T200000Z',
    details: 'Торжественная регистрация — 12:20\nФотосессия — 13:00\nФуршет — 14:30\nПраздничное застолье — 15:00\nОкончание банкета — 23:00',
    location: 'Банкетный зал «Тиара», Санкт-Петербургское шоссе, 88, посёлок Стрельна'
  });
  window.open('https://calendar.google.com/calendar/render?' + params.toString(), '_blank');
}

document.getElementById('calendarBtn').addEventListener('click', (e) => {
  e.preventDefault();
  openCalendar();
});

document.getElementById('headerCalendarBtn').addEventListener('click', (e) => {
  e.preventDefault();
  openCalendar();
});

/* ========== RSVP FORM ========== */
const form = document.getElementById('rsvpForm');
const success = document.getElementById('rsvpSuccess');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      form.hidden = true;
      success.hidden = false;
    } else {
      alert('Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз.');
    }
  } catch (err) {
    alert('Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз.');
  }
});
