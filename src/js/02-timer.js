import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';


const startBtn = document.querySelector('[data-start]');
const daysData = document.querySelector('[data-days]');
const hoursData = document.querySelector('[data-hours]');
const minutesData = document.querySelector('[data-minutes]');
const secondsData = document.querySelector('[data-seconds]');

const dateInput = document.querySelector('#datetime-picker');

let intervId;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose: dateInputClose,
};

flatpickr(dateInput, options);

function dateInputClose(selectedDates) {
  const selectedDate = selectedDates[0];
  if (selectedDate < new Date()) {
    Notiflix.Notify.warning('Please choose a date in the future');
    startBtn.disabled = true;
  } else {
    startBtn.disabled = false;
  }
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function startBtnClick() {
  clearInterval(intervId);

  const currentDate = new Date(dateInput.value).getTime();
  const now = new Date().getTime();

  if (isNaN(currentDate) || currentDate < now) {
    Notiflix.Notify.failure('Please choose a valid date in the future');
    return;
  }

  updateTimer();

  intervId = setInterval(() => {
    updateTimer();
  }, 1000);
}

function updateTimer() {
  const currentDate = new Date(dateInput.value).getTime();
  const now = new Date().getTime();

  if (isNaN(currentDate) || currentDate < now) {
    Notiflix.Notify.failure('Please choose a valid date in the future');
    clearInterval(intervId);
    return;
  }

  let timeLeft = currentDate - now;

  if (timeLeft < 0) {
    clearInterval(intervId);
    daysData.textContent = '00';
    hoursData.textContent = '00';
    minutesData.textContent = '00';
    secondsData.textContent = '00';
    startBtn.disabled = true;
    Notiflix.Notify.success('Countdown finished!');
  } else {
    const timeObject = convertMs(timeLeft);
    daysData.textContent = timeObject.days.toString().padStart(2, '0');
    hoursData.textContent = timeObject.hours.toString().padStart(2, '0');
    minutesData.textContent = timeObject.minutes.toString().padStart(2, '0');
    secondsData.textContent = timeObject.seconds.toString().padStart(2, '0');
  }
}

startBtn.addEventListener('click', startBtnClick);
