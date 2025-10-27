let nameData = [];
let currentResults = [];

// JSONを読み込む
fetch('names.json')
  .then(response => response.json())
  .then(data => {
    nameData = data;
    currentResults = [...nameData];

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

// 検索ボタン押下時
document.getElementById('searchBtn').addEventListener('click', runSearch);

// 性別セレクト変更時
document.getElementById('genderFilter').addEventListener('change', runSearch);

// ソートボタン（昇順・降順）イベント設定
document.getElementById('sortSelect').addEventListener('change', handleSortChange);

// 検索実行関数（共通化）
function runSearch() {
  const query = document.getElementById('searchBox').value.trim().toLowerCase();
  const genderFilter = document.getElementById('genderFilter').value;

  // 絞り込み処理
  const results = nameData.filter(entry => {
    const matchQuery =
      entry.name.includes(query) || entry.reading.includes(query);

    const matchGender =
      genderFilter === 'all' || entry.gender === genderFilter;

    return matchQuery && matchGender;
  });

  // 結果描画
  currentResults = results; // ← 検索結果を保存
  applySortAndDisplay(); 

  // 件数更新
  const resultCountElem = document.getElementById('resultCount');
  if (resultCountElem) {
    if (query === '' && genderFilter === 'all') {
      resultCountElem.textContent = '';
    } else {
      resultCountElem.textContent = `検索結果：${results.length} 件`;
    }
  }
}

// ソート変更イベント
function handleSortChange() {
  applySortAndDisplay();
}

// ソートと表示をまとめて実行
function applySortAndDisplay() {
  const sortOption = document.getElementById('sortSelect').value;
  let results = [...currentResults];

  if (sortOption === 'asc') {
    results.sort((a, b) => a.stroke - b.stroke);
  } else if (sortOption === 'desc') {
    results.sort((a, b) => b.stroke - a.stroke);
  }

  displayResults(results);
}

// 結果表示
function displayResults(results) {
  const container = document.getElementById('resultList');
  container.innerHTML = '';

  results.forEach(entry => {
    const block = document.createElement('div');
    let genderHTML = '';

    if (entry.gender === 'm') {
      genderHTML = `<span style="color: skyblue; font-weight: bold;">⚫︎</span>`;
    } else if (entry.gender === 'f') {
      genderHTML = `<span style="color: pink; font-weight: bold;">⚫︎</span>`;
    } else if (entry.gender === 'u') {
      genderHTML = `
        <span style="color: skyblue; font-weight: bold;">⚫︎</span>
        <span style="color: pink; font-weight: bold;">⚫︎</span>
      `;
    }
    
    // 画数入力終わったら追加：　${entry.stroke}
    block.innerHTML = `
      ${entry.name}　${entry.reading}　${genderHTML}　<span style="float: right;">${entry.stroke}</span>
      <hr>
    `;
    container.appendChild(block);
  });
}

// stroke順ソート
function sortByStroke(order) {
  if (!currentResults.length) return;

  const sorted = [...currentResults].sort((a, b) => {
    if (order === 'asc') {
      return a.stroke - b.stroke;
    } else {
      return b.stroke - a.stroke;
    }
  });

  displayResults(sorted);
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

// // ▼ 「漢字」判定（々除外・基本＋拡張A＋互換対応）
// const kanjiRegex = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/;

// fetch('names.json')
//   .then(r => r.json())
//   .then(data => {
//     const output = document.getElementById('output');
//     let resultText = '';
//     const globalKanjiSet = new Set();

//     data.forEach(entry => {
//       const str = entry.name || '';
//       const perEntrySet = new Set();

//       for (const ch of str) {
//         if (ch === '々') continue;
//         if (kanjiRegex.test(ch)) {
//           perEntrySet.add(ch);
//           globalKanjiSet.add(ch);
//         }
//       }

//       const uniqueChars = [...perEntrySet].join(' ');
//       resultText += `${str} → ${perEntrySet.size}種類${uniqueChars ? `（${uniqueChars}）` : ''}\n`;
//     });

//     resultText += `\n――――――――――――――――――――\n`;
//     resultText += `全体の漢字種類数：${globalKanjiSet.size}\n`;
//     resultText += `使用漢字一覧：${[...globalKanjiSet].join(' ')}`;

//     output.textContent = resultText;
//   })
//   .catch(err => {
//     document.getElementById('output').textContent = '読み込みエラー: ' + err.message;
//   });

const kanjiRegex = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|\u{20B9F}/u;

fetch('names.json')
  .then(r => r.json())
  .then(data => {
    const globalKanjiSet = new Set();

    data.forEach(entry => {
      const str = entry.name || '';
      for (const ch of str) {
        if (ch === '々') continue;
        if (kanjiRegex.test(ch)) {
          globalKanjiSet.add(ch);
        }
      }
    });
    const output = document.getElementById('output');
    output.textContent = `人名に使える漢字のうち、${globalKanjiSet.size}字／2999字が使われています`;
  })
  .catch(err => {
    document.getElementById('output').textContent = '読み込みエラー: ' + err.message;
  });