// Clean and synced LocalStorage key initialization
let habits = JSON.parse(localStorage.getItem('my_habits_data')) || [];
let currentDate = new Date();

// DOM elements mapping
const habitForm = document.getElementById('habit-form');
const habitInput = document.getElementById('habit-name-input');
const gridContainer = document.getElementById('grid-container');
const emptyState = document.getElementById('empty-state');
const weekTitle = document.getElementById('week-title');
const prevWeekBtn = document.getElementById('prev-week-btn');
const nextWeekBtn = document.getElementById('next-week-btn');
const todayBtn = document.getElementById('today-btn');
const dailyQuote = document.getElementById('daily-quote');
const toastContainer = document.getElementById('toast-container');

// Stats Widgets Elements
const statTotal = document.getElementById('stat-total');
const statStreaks = document.getElementById('stat-streaks');

// Balanced Human Quotes Array
const quotes = [
  "\"First, solve the problem. Then, write the code.\" — John Johnson",
  "\"Clean code always looks like it was written by someone who cares.\" — Michael Feathers",
  "\"Consistency beats talent when talent doesn't work hard.\"",
  "\"Small daily improvements over time lead to stunning results.\"",
  "\"Simplicity is the soul of efficiency.\" — Austin Freeman",
  "\"Make it work, make it right, make it fast.\" — Kent Beck"
];

// Clean Human-written Appreciation Messages
const appreciationMessages = [
  "⚡ Brilliant! Keep the momentum going!",
  "🔥 Star performance! Habit locked!",
  "🎯 On target! Consistency is key!",
  "🚀 Amazing work! You are building habits!",
  "💪 Excellent! Stay disciplined!",
  "🌟 Keep it up! Proud of you!"
];

// Date processing algorithms
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Standard Monday Start
  return new Date(d.setDate(diff));
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Dependable streak calculation logic
function calculateStreak(history) {
  if (!history || history.length === 0) return 0;
  
  const datesSet = new Set(history);
  let streak = 0;
  let check = new Date();
  
  let todayStr = formatDate(check);
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  let yesterdayStr = formatDate(yesterday);

  if (!datesSet.has(todayStr) && !datesSet.has(yesterdayStr)) {
    return 0;
  }

  if (!datesSet.has(todayStr) && datesSet.has(yesterdayStr)) {
    check = yesterday;
  }

  while (datesSet.has(formatDate(check))) {
    streak++;
    check.setDate(check.getDate() - 1);
  }
  return streak;
}

// Live feedback toast launcher
function showAppreciationToast() {
  if (!toastContainer) return;
  const randomMsg = appreciationMessages[Math.floor(Math.random() * appreciationMessages.length)];
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${randomMsg}</span>`;
  
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 2000);
}

// Live stats dynamic counter
function updateStats() {
  if (statTotal) statTotal.textContent = habits.length;
  
  let maxStreak = 0;
  habits.forEach(h => {
    const current = calculateStreak(h.history);
    if (current > maxStreak) maxStreak = current;
  });
  if (statStreaks) statStreaks.textContent = maxStreak;
}

// Core Render Pipeline
function renderDashboard() {
  updateStats();

  // Guard rails for empty screens
  if (habits.length === 0) {
    if (emptyState) emptyState.classList.remove('hidden-state');
    if (gridContainer) gridContainer.innerHTML = '';
    if (weekTitle) weekTitle.textContent = 'No Active Habits';
    return;
  } else {
    if (emptyState) emptyState.classList.add('hidden-state');
  }

  const startOfWeek = getStartOfWeek(currentDate);
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDays.push(day);
  }

  const opt = { month: 'short', day: 'numeric' };
  if (weekTitle) {
    weekTitle.textContent = `${startOfWeek.toLocaleDateString('en-US', opt)} - ${weekDays[6].toLocaleDateString('en-US', opt)}`;
  }

  if (!gridContainer) return;
  gridContainer.innerHTML = '';

  // Render loop to create beautiful habit nodes
  habits.forEach(habit => {
    const card = document.createElement('div');
    card.className = 'habit-card';

    const header = document.createElement('div');
    header.className = 'card-header';
    header.innerHTML = `
      <h4>${habit.name}</h4>
      <button class="delete-btn" data-id="${habit.id}">&times;</button>
    `;
    card.appendChild(header);

    const daysRow = document.createElement('div');
    daysRow.className = 'days-row';

    weekDays.forEach(day => {
      const dateStr = formatDate(day);
      const isChecked = habit.history.includes(dateStr);
      const dayName = day.toLocaleDateString('en-US', { weekday: 'narrow' });

      const dayCell = document.createElement('div');
      dayCell.className = 'day-cell';
      dayCell.innerHTML = `
        <span class="day-label">${dayName}</span>
        <label class="checkbox-container">
          <input type="checkbox" ${isChecked ? 'checked' : ''} data-habitid="${habit.id}" data-date="${dateStr}">
        </label>
      `;
      daysRow.appendChild(dayCell);
    });
    card.appendChild(daysRow);

    const currentStreak = calculateStreak(habit.history);
    const footer = document.createElement('div');
    footer.className = 'card-footer';
    footer.innerHTML = `<span>🔥 ${currentStreak} day streak</span>`;
    card.appendChild(footer);

    gridContainer.appendChild(card);
  });
}

// --- Interaction Control Operations ---

habitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = habitInput.value.trim();
  if (!name) return;

  const newHabit = {
    id: String(Date.now()), // Unique clean timestamps mapping
    name: name,
    history: []
  };

  habits.push(newHabit);
  localStorage.setItem('my_habits_data', JSON.stringify(habits));
  habitInput.value = '';
  renderDashboard(); // Full redraw to safely swap layout state
});

gridContainer.addEventListener('change', (e) => {
  if (e.target.matches('input[type="checkbox"]')) {
    const habitId = e.target.dataset.habitid;
    const dateStr = e.target.dataset.date;
    const habit = habits.find(h => h.id === habitId);

    if (habit) {
      if (e.target.checked) {
        if (!habit.history.includes(dateStr)) {
          habit.history.push(dateStr);
          showAppreciationToast(); // Play delight interaction
        }
      } else {
        habit.history = habit.history.filter(d => d !== dateStr);
      }
      localStorage.setItem('my_habits_data', JSON.stringify(habits));
      renderDashboard();
    }
  }
});

gridContainer.addEventListener('click', (e) => {
  if (e.target.matches('.delete-btn')) {
    const habitId = e.target.dataset.id;
    if (confirm('Delete this habit?')) {
      habits = habits.filter(h => h.id !== habitId);
      localStorage.setItem('my_habits_data', JSON.stringify(habits));
      renderDashboard();
    }
  }
});

prevWeekBtn.addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() - 7);
  renderDashboard();
});

nextWeekBtn.addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() + 7);
  renderDashboard();
});

todayBtn.addEventListener('click', () => {
  currentDate = new Date();
  renderDashboard();
});

function loadQuote() {
  if (dailyQuote) {
    const dayIndex = new Date().getDay();
    dailyQuote.textContent = quotes[dayIndex % quotes.length];
  }
}

// Main Launch sequence
loadQuote();
renderDashboard();