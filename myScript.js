let isRunning = false;
let isTimer = true;
let duration = 60;
let time = duration;
let interval;

const display = document.getElementById('display');
const fill = document.getElementById('progressFill');
const startPauseBtn = document.getElementById('startPause');
const beepSound = document.getElementById('beepSound');

function formatTime(t) {
  const mins = Math.floor(t / 60).toString().padStart(2, '0');
  const secs = (t % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function updateDisplay() {
  display.textContent = formatTime(time);

  let percent = isTimer
    ? (1 - time / duration)
    : (time / duration);

  let angle = 360 * percent;
  fill.style.transform = `rotate(${angle}deg)`;
}

function tick() {
  if (isTimer) {
    time--;
    if (time <= 0) {
      clearInterval(interval);
      isRunning = false;
      startPauseBtn.textContent = '▶️';
      beepSound.play();
    }
  } else {
    time++;
    if (time > duration) time = duration;
  }
  updateDisplay();
}

function startPause() {
  if (isRunning) {
    clearInterval(interval);
    startPauseBtn.textContent = '▶️';
  } else {
    interval = setInterval(tick, 1000);
    startPauseBtn.textContent = '⏸️';
  }
  isRunning = !isRunning;
}

function reset() {
  clearInterval(interval);
  isRunning = false;
  startPauseBtn.textContent = '▶️';
  time = isTimer ? duration : 0;
  updateDisplay();
}

function switchMode(timerSelected) {
  isTimer = timerSelected;
  duration = timerSelected ? 60 : 600;
  time = timerSelected ? duration : 0;
  document.getElementById('customInputGroup').style.display = timerSelected ? 'block' : 'none';
  reset();
}

function setCustomTime() {
  const input = document.getElementById('customTime').value;
  const parts = input.split(':');
  if (parts.length === 2) {
    let mins = parseInt(parts[0]);
    let secs = parseInt(parts[1]);
    if (!isNaN(mins) && !isNaN(secs)) {
      duration = mins * 60 + secs;
      time = duration;
      updateDisplay();
    }
  }
}

// Theme Switcher
const themeToggleBtn = document.getElementById('themeToggle');
themeToggleBtn.onclick = () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  themeToggleBtn.textContent = isLight ? '☀️ Theme' : '🌙 Theme';
};

function loadTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.body.classList.add('light');
    themeToggleBtn.textContent = '☀️ Theme';
  }
}

document.getElementById('startPause').onclick = startPause;
document.getElementById('reset').onclick = reset;
document.getElementById('timerMode').onclick = () => switchMode(true);
document.getElementById('stopwatchMode').onclick = () => switchMode(false);

loadTheme();
switchMode(true); // Default
