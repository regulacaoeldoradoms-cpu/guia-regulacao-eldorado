'use strict';
(() => {
  function today() {
    const parts = new Intl.DateTimeFormat('en-CA', {timeZone:'America/Campo_Grande',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const part = name => parts.find(p => p.type === name).value;
    return `${part('year')}-${part('month')}-${part('day')}`;
  }
  function validate(input) {
    input.min = '1900-01-01'; input.max = today();
    input.setCustomValidity('');
    const value = input.value;
    const [year,month,day] = value.split('-').map(Number);
    const leap = year%4===0 && (year%100!==0 || year%400===0);
    const days = [31,leap?29:28,31,30,31,30,31,31,30,31,30,31];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || year<1900 || month<1 || month>12 || day<1 || day>days[month-1] || value>input.max) input.setCustomValidity('Informe uma data de nascimento válida.');
    return input.validity.valid;
  }
  function bind(input) {
    if (!input) return;
    input.min = '1900-01-01'; input.max = today();
    input.addEventListener('input', () => validate(input));
    input.addEventListener('focus', () => { input.max=today(); });
  }
  window.PortalBirthDateInput = Object.freeze({bind,validate});
})();
