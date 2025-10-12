let nameData = [];

// JSONを読み込む
fetch('names.json')
  .then(response => response.json())
  .then(data => {
    nameData = data;

    // 総件数表示
    const countElem = document.getElementById('count');
    if (countElem) {
      countElem.textContent = `現在 ${nameData.length} 件の人名が登録されています`;
    }

    // 初期状態ですべて表示
    displayResults(nameData);
  })
  .catch(err => {
    console.error('データ読み込みエラー:', err);
    const countElem = document.getElementById('count');
    if (countElem) countElem.textContent = 'データを読み込めませんでした';
  });

// 検索処理
document.getElementById('searchBtn').addEventListener('click', () => {
  const query = document.getElementById('searchBox').value.trim().toLowerCase();

  // 絞り込み
  const results = nameData.filter(entry =>
    entry.name.includes(query) || entry.reading.includes(query)
  );

  // 結果描画
  displayResults(results);

  // 件数更新
  const resultCountElem = document.getElementById('resultCount');
  if (resultCountElem) {
    if (query === '') {
      resultCountElem.textContent = '';
    } else {
      resultCountElem.textContent = `検索結果：${results.length} 件`;
    }
  }
});

// 結果表示
function displayResults(results) {
  const container = document.getElementById('resultList');
  container.innerHTML = '';

  results.forEach(entry => {
    const block = document.createElement('div');
    block.innerHTML = `
      ${entry.name}　${entry.reading}
      <hr>
    `;
    container.appendChild(block);
  });
}

function goBack() {
      if (history.length <= 1 || document.referrer === "") {
        window.location.href = 'sentences.html';
      } else {
        history.back();
      }
    }

    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }