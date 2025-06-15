// Pomodoro Timer Script

// --- Configuration ---
const workDuration = 25 * 60; for 25 minutes.

// --- State Variables ---
let secondsLeft = workDuration;
let timerInterval = null;
let cycleCount = 0;

// --- DOM Elements ---
const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');
const intervalType = document.getElementById('intervalType');
const cycleCountDisplay = document.getElementById('cycleCount');
const chime = document.getElementById('chime');
const progressArc = document.getElementById('progressArc');
const motivationPopup = document.getElementById('motivation-popup');
const motivationOk = document.getElementById('motivation-ok');
const container = document.querySelector('.container');

// --- Favicon Progress Arc ---
const CIRCUMFERENCE = 2 * Math.PI * 100; // SVG circle r=100
let originalTitle = document.title;

// Save the original favicon href
const favicon = document.querySelector('link[rel="icon"]');
let originalFaviconHref = favicon ? favicon.href : 'Under_25_Logo.jfif';

/**
 * Updates the favicon to show timer progress as a circular arc.
 * @param {number} progress - Progress from 0 to 1.
 */
function updateFavicon(progress) {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Draw background (white)
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.fill();

    // Draw progress arc
    ctx.strokeStyle = '#f06292';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(
        size / 2,
        size / 2,
        size / 2 - 6,
        -Math.PI / 2,
        -Math.PI / 2 + 2 * Math.PI * progress,
        false
    );
    ctx.stroke();

    // Draw center circle (to match UI)
    ctx.fillStyle = '#fff0f6';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 14, 0, 2 * Math.PI);
    ctx.fill();

    // Set favicon
    if (favicon) {
        favicon.href = canvas.toDataURL('image/png');
    }
}

// Restores the original favicon.
function restoreFavicon() {
    if (favicon && originalFaviconHref) {
        favicon.href = originalFaviconHref;
    }
}

// Updates the timer display, progress arc, favicon, and document title.
function updateDisplay() {
    const min = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const sec = String(secondsLeft % 60).padStart(2, '0');
    timerDisplay.textContent = `${min}:${sec}`;

    // Progress arc
    const progress = 1 - secondsLeft / workDuration;
    progressArc.style.strokeDasharray = CIRCUMFERENCE;
    progressArc.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);

    // Update favicon with progress
    updateFavicon(progress);

    // Update status
    intervalType.textContent = "Focus";
    cycleCountDisplay.textContent = `Cycle: ${cycleCount + 1}`;

    // Update document title
    document.title = `${min}:${sec} Focus time`;
}

/**
 * Shows the motivation popup and blurs the container.
 */
function showMotivationPopup() {
    motivationPopup.style.display = 'block';
    container.classList.add('blur');
}

/**
 * Hides the motivation popup and removes blur from the container.
 */
function hideMotivationPopup() {
    motivationPopup.style.display = 'none';
    container.classList.remove('blur');
}

// Hide popup when OK button is clicked
motivationOk.addEventListener('click', hideMotivationPopup);

/**
 * Handles the end of a timer cycle.
 */
function handleTimerEnd() {
    chime.play();
    showMotivationPopup();
    clearInterval(timerInterval);
    timerInterval = null;
    document.title = originalTitle;
    restoreFavicon();
    cycleCount++;
    secondsLeft = workDuration;
    updateDisplay();
}

/**
 * Starts the timer countdown.
 */
function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        if (secondsLeft > 0) {
            secondsLeft--;
            updateDisplay();
        } else {
            handleTimerEnd();
            document.title = originalTitle;
            restoreFavicon();
        }
    }, 1000);
}

/**
 * Pauses the timer and resets to the start of the current cycle.
 */
function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    secondsLeft = workDuration;
    updateDisplay();
    document.title = originalTitle;
    restoreFavicon();
}

/**
 * Resets the timer and cycle count.
 */
function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    secondsLeft = workDuration;
    cycleCount = 0;
    updateDisplay();
    cycleCountDisplay.textContent = '';
    document.title = originalTitle;
    restoreFavicon();
}

// --- Event Listeners ---
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// --- Initialization ---
updateDisplay();

window.addEventListener('DOMContentLoaded', () => {
    document.title = originalTitle;
    restoreFavicon();
    resetTimer();
});
