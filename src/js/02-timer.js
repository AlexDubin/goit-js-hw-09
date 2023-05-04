import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const startBtn = document.querySelector('[data-start]');
const daysData = document.querySelector('[data-days]');
const hoursData = document.querySelector('[data-hours]');
const minutesData = document.querySelector('[data-minutes]');
const secondsData = document.querySelector('[data-seconds]');

const currentDate = new Date();
const dateInput = document.querySelector('#datetime-picker');

let intervId = null;

startBtn.setAttribute('disabled', 'disabled');

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

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

const option = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    currentDate.getTime();
    selectedDates[0].getTime();
    if (currentDate > selectedDates[0]) {
      return Notiflix.Report.warning(
        'Error',
        'Please choose a date in the future!',
        'Ok'
      );
    }
    startBtn.removeAttribute('disabled');
    startBtn.addEventListener('click', () => {
      intervId = setInterval(() => {
        let time = convertMs(
          selectedDates[0].getTime() - Date.parse(new Date())
        );
        daysData.innerHTML = addLeadingZero(time.days);
        hoursData.innerHTML = addLeadingZero(time.hours);
        minutesData.innerHTML = addLeadingZero(time.minutes);
        secondsData.innerHTML = addLeadingZero(time.seconds);
        if (selectedDates[0].getTime() - Date.parse(new Date()) <= 0) {
          clearInterval(intervId);
        }
      }, 1000);
    });
  },
};

flatpickr(dateInput, option);
