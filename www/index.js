window.addEventListener('DOMContentLoaded', () => {
  Array.from(document.querySelectorAll('input[type="checkbox"]:not(#success-checkbox)')).forEach(input => {
    input.addEventListener('change', () => {
      document.querySelector('#success-checkbox').checked = true;
    });
  });
});
