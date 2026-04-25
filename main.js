  const btn = document.getElementById('calculate-btn');
  const inputDay   = document.getElementById('input-day');
  const inputMonth = document.getElementById('input-month');
  const inputYear  = document.getElementById('input-year');

  const errDay   = document.getElementById('err-day');
  const errMonth = document.getElementById('err-month');
  const errYear  = document.getElementById('err-year');

  const fieldDay   = document.getElementById('field-day');
  const fieldMonth = document.getElementById('field-month');
  const fieldYear  = document.getElementById('field-year');

  const resYears  = document.getElementById('res-years');
  const resMonths = document.getElementById('res-months');
  const resDays   = document.getElementById('res-days');

  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  function clearErrors() {
    [fieldDay, fieldMonth, fieldYear].forEach(f => f.classList.remove('error'));
    [errDay, errMonth, errYear].forEach(e => e.textContent = '');
  }

  function setError(field, errEl, msg) {
    field.classList.add('error');
    errEl.textContent = msg;
  }

  function animateCount(el, target) {
    const duration = 900;
    const start = performance.now();
    el.classList.remove('animate');
    void el.offsetWidth; // reflow
    el.classList.add('animate');

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function calculate() {
    clearErrors();

    const dayVal   = inputDay.value.trim();
    const monthVal = inputMonth.value.trim();
    const yearVal  = inputYear.value.trim();

    let valid = true;

    // Required checks
    if (!dayVal)   { setError(fieldDay,   errDay,   'This field is required'); valid = false; }
    if (!monthVal) { setError(fieldMonth, errMonth, 'This field is required'); valid = false; }
    if (!yearVal)  { setError(fieldYear,  errYear,  'This field is required'); valid = false; }

    if (!valid) return;

    const day   = parseInt(dayVal, 10);
    const month = parseInt(monthVal, 10);
    const year  = parseInt(yearVal, 10);
    const now   = new Date();

    // Range checks
    if (month < 1 || month > 12) { setError(fieldMonth, errMonth, 'Must be a valid month'); valid = false; }
    if (day < 1 || day > 31)     { setError(fieldDay,   errDay,   'Must be a valid day');   valid = false; }
    if (year > now.getFullYear()) { setError(fieldYear,  errYear,  'Must be in the past');   valid = false; }
    if (year < 1)                 { setError(fieldYear,  errYear,  'Must be a valid year');  valid = false; }

    if (!valid) return;

    // Day in month validity
    if (day > daysInMonth(month, year)) {
      setError(fieldDay, errDay, 'Must be a valid date');
      return;
    }

    // Past date check
    const birthDate = new Date(year, month - 1, day);
    if (birthDate > now) {
      setError(fieldDay, errDay, 'Must be in the past');
      return;
    }

    // Calculate age
    let ageYears  = now.getFullYear() - year;
    let ageMonths = now.getMonth()    - (month - 1);
    let ageDays   = now.getDate()     - day;

    if (ageDays < 0) {
      ageMonths -= 1;
      ageDays += daysInMonth(now.getMonth(), now.getFullYear()); // days in previous month
    }

    if (ageMonths < 0) {
      ageYears  -= 1;
      ageMonths += 12;
    }

    animateCount(resYears,  ageYears);
    animateCount(resMonths, ageMonths);
    animateCount(resDays,   ageDays);
  }

  btn.addEventListener('click', calculate);

  // Allow Enter key
  [inputDay, inputMonth, inputYear].forEach(input => {
    input.addEventListener('keydown', e => { if (e.key === 'Enter') calculate(); });
  });