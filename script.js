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
const headerNav = navLinks.parentElement;

function openMenu() {
  // Move nav out of header so backdrop-filter doesn't trap position:fixed
  document.body.appendChild(navLinks);
  burger.classList.add('active');
  navLinks.classList.add('open');
}

function closeMenu() {
  burger.classList.remove('active');
  navLinks.classList.remove('open');
  // Move nav back into header for desktop layout
  headerNav.insertBefore(navLinks, document.getElementById('headerCalendarBtn'));
}

burger.addEventListener('click', () => {
  if (navLinks.classList.contains('open')) {
    closeMenu();
  } else {
    openMenu();
  }
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    closeMenu();
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

/* ========== CALENDAR ========== */
function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function openCalendar() {
  if (isMobile()) {
    // На мобильных — Google Calendar intent (откроет приложение)
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'Свадьба Юлии и Никиты',
      dates: '20260520T090000Z/20260520T200000Z',
      details: 'Торжественная регистрация — 12:20\nФотосессия — 13:00\nФуршет — 14:30\nПраздничное застолье — 15:00\nОкончание банкета — 23:00',
      location: 'Банкетный зал «Тиара», Санкт-Петербургское шоссе, 88, посёлок Стрельна'
    });
    window.open('https://calendar.google.com/calendar/render?' + params.toString(), '_blank');
  } else {
    // На десктопе — скачивание .ics (откроет Outlook / Apple Calendar / др.)
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding//Yulia & Nikita//RU',
      'BEGIN:VEVENT',
      'DTSTART:20260520T090000Z',
      'DTEND:20260520T200000Z',
      'SUMMARY:Свадьба Юлии и Никиты',
      'DESCRIPTION:Торжественная регистрация — 12:20\\nФотосессия — 13:00\\nФуршет — 14:30\\nПраздничное застолье — 15:00\\nОкончание банкета — 23:00',
      'LOCATION:Банкетный зал «Тиара»\\, Санкт-Петербургское шоссе\\, 88\\, посёлок Стрельна',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      'DESCRIPTION:Завтра свадьба Юлии и Никиты!',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-yulia-nikita.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
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
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
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
