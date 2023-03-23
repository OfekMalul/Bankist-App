/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

'use strict';

const account1 = {
  owner: 'Ofek Malul',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-08-30T17:01:17.194Z',
    '2021-09-01T23:36:17.929Z',
    '2021-09-04T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Recruiter user',
  movements: [1000, 2400, -150, -1790, -3210, 1000, 8500, -30],
  interestRate: 1.5,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, local) {
  const calcDaysPassed = (date1, date2) => {
    return Math.floor(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));
  };

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth()}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(local).format(date);
  }
};

const formatCur = function (value, local, currency) {
  const options = {
    style: 'currency',
    currency: currency,
  };
  return new Intl.NumberFormat(local, options).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.local);
    const formattedMov = formatCur(mov, acc.local, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((sum, move) => sum + move, 0);
  labelBalance.textContent = `${formatCur(
    acc.balance,
    acc.local,
    acc.currency
  )}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(move => move > 0)
    .reduce((sum, move) => sum + move, 0);
  labelSumIn.textContent = `${formatCur(incomes, acc.local, acc.currency)}`;
  const outcomes = acc.movements
    .filter(move => move < 0)
    .reduce((sum, move) => sum + move, 0);
  labelSumOut.textContent = `${formatCur(outcomes, acc.local, acc.currency)}`;
  const interest = acc.movements
    .filter(move => move > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((sum, interest) => sum + interest, 0);
  labelSumInterest.textContent = `${formatCur(
    interest,
    acc.local,
    acc.currency
  )}`;
};

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word[0];
      })
      .join('');
  });
};
createUserNames(accounts);
//update UI
const updateUI = function (acc) {
  //display movements
  displayMovements(acc);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
};
/////////////////////////////////////////////
//Set Timer To Log out user
const startLogOutTimer = function () {
  const tick = function () {
    //In each call, print the remaining time to UI
    const min = `${Math.trunc(time / 60)}`.padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    //When 0 seconds, stop timer and log out user (opacity)
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    //decrease one second
    time--;
  };
  //set time to 10 min
  let time = 600;
  //call the timer every second - basically tick is being called every second which decrase the time in a second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

//event handler
let currentAccount;
let timer;
console.log(timer);
btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount.pin === +inputLoginPin.value) {
    //clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    //remove focus from the field
    inputLoginPin.blur();
    // display UI and welcome message.
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    //day/month/year, hour:min
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth()}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    //checking if there is already a timer, if there is then stop it.
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
  inputTransferAmount.blur();
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    //checks if the receiver account exsist
    receiverAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //add transfer date
    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());
    updateUI(currentAccount);
    //reset timer - the timer is cleared
    clearInterval(timer);
    // The timer starts from the beginning
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loan = Math.floor(inputLoanAmount.value);
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
  if (
    loan > 0 &&
    currentAccount.movements.find(move => (move / loan) * 100 >= 10)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(loan);
      //Add loan date
      currentAccount.movementsDates.push(new Date());
      updateUI(currentAccount);
      //reset timer - the timer is cleared
      clearInterval(timer);
      // The timer starts from the beginning
      timer = startLogOutTimer();
    }, 2500);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const pin = +inputClosePin.value;
  const deleteAcc = accounts.find(
    acc => acc.userName === inputCloseUsername.value
  );
  inputClosePin.value = '';
  inputCloseUsername.value = '';
  inputCloseUsername.blur();
  if (
    deleteAcc &&
    deleteAcc.pin === pin &&
    currentAccount.userName === deleteAcc.userName
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    console.log(index);
    //delete account
    accounts.splice(index, 1);
    //hide UI
    containerApp.style.opacity = 0;
  }
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
  //reset timer - the timer is cleared
  clearInterval(timer);
  // The timer starts from the beginning
  timer = startLogOutTimer();
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// console.log((4.4).toFixed(0));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
//     if (i % 2 === 0) row.style.backgroundColor = 'yellow';
//     if (i % 3 === 0) row.style.backgroundColor = 'blue';
//   });
// });

// const now = new Date();
// console.log(now);

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);

// const future = new Date(2027, 10, 19, 20, 14);
// const myDate = new Date(2027, 10, 21, 20, 20);
// console.log(+future);

// const calcdaysPassed = (date1, date2) => {
//   return Math.abs(date2 - date1);
// };
// const date1 = Math.floor(
//   calcdaysPassed(future, myDate) / (1000 * 60 * 60 * 24)
// );
// console.log(date1);

//API
// const myDate = new Date();
// labelDate.textContent = new Intl.DateTimeFormat('en-US');

// const num = 3884764.23;
// const options = {
//   style: 'currency',
//   unit: 'kilometer-per-hour',
//   currency: 'USD',
//   //There are many ways to style this.
// };

// console.log(
//   'US: ',
//   new Intl.NumberFormat(navigator.language, options).format(num)
// );
// console.log('Portugal: ', new Intl.NumberFormat('de-DE', options).format(num));

// setTimeout(() => console.log('here is your pizza'), 3000);
// console.log('Waiting....');

//setTimeOut
// setInterval(function () {
//   const now = new Date();
//   const hour = `${now.getHours()}`.padStart(2, 0);
//   const min = `${now.getMinutes()}`.padStart(2, 0);
//   const sec = `${now.getSeconds()}`.padStart(2, 0);

//   console.log(`${hour}:${min}:${sec}`);
// }, 1000);
