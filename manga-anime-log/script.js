const form = document.getElementById('entry-form');
const entryList = document.getElementById('entry-list');

let data = JSON.parse(localStorage.getItem('entries')) || [];
let editIndex = null;

renderList();

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const type = document.getElementById('type').value;
  const rating = document.getElementById('rating').value;
  const comment = document.getElementById('comment').value;
  const today = new Date().toLocaleDateString('ja-JP');
  const image = document.getElementById('image').value;
  const episode = document.getElementById('episode').value;
   



const entry = {
  title,
  type,
  rating,
  comment,
  image,
  episode,
  favorite: editIndex !== null ? data[editIndex].favorite : false,
  date: editIndex !== null ? data[editIndex].date : today
};




  if (editIndex !== null) {
    data[editIndex] = entry;
    editIndex = null;
  } else {
    data.push(entry);
  }

  localStorage.setItem('entries', JSON.stringify(data));
  form.reset();
  renderList();
});

function renderList() {
  entryList.innerHTML = '';

  let sortedData = [...data]; // 元の配列をコピー

  const sortOption = document.getElementById('sort').value;

  if (sortOption === 'rating') {
    sortedData.sort((a, b) => b.rating - a.rating);
  } else if (sortOption === 'favorite') {
    sortedData.sort((a, b) => (b.favorite === a.favorite) ? 0 : b.favorite ? 1 : -1);
  }

  sortedData.forEach((entry, index) => {
    const card = document.createElement('div');
    card.className = 'entry-card';

    const heartIcon = entry.favorite ? '❤️' : '🤍';

    card.innerHTML = `
      ${entry.image ? `<img src="${entry.image}" class="entry-img">` : ''}
      <strong>${entry.title}</strong>（${entry.type}）<br>
      評価：${'★'.repeat(entry.rating)}${'☆'.repeat(5 - entry.rating)}<br>
      <p>話数,巻数：${entry.episode} </p>
      <p>${entry.comment}</p>
      <p>登録日：${entry.date}</p>
      <button onclick="toggleFavorite(${data.indexOf(entry)})">${heartIcon}</button>
      <button onclick="editEntry(${data.indexOf(entry)})">✏ 編集</button>
      <button onclick="deleteEntry(${data.indexOf(entry)})">🗑 削除</button>
    `;
    entryList.appendChild(card);
  });
}


function toggleFavorite(index) {
  data[index].favorite = !data[index].favorite;
  localStorage.setItem('entries', JSON.stringify(data));
  renderList();
}

function editEntry(index) {
  const entry = data[index];
  document.getElementById('title').value = entry.title;
  document.getElementById('type').value = entry.type;
  document.getElementById('rating').value = entry.rating;
  document.getElementById('comment').value = entry.comment;
  document.getElementById('image').value = entry.image || '';
  document.getElementById('sort').addEventListener('change', renderList);
  document.getElementById('episode').value = entry.episode || '';
  editIndex = index;
}

function deleteEntry(index) {
  if (confirm('本当に削除しますか？')) {
    data.splice(index, 1);
    localStorage.setItem('entries', JSON.stringify(data));
    renderList();
  }
}
