document.querySelectorAll('.file-date').forEach(function(span) {
  const fileName = span.getAttribute('data-file');
  fetch('TEXT/' + fileName)
    .then(response => response.text())
    .then(text => {
      const lines = text.split(/\r?\n/);
      span.innerHTML = lines[1] || '';
    });
});