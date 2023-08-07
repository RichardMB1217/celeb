let search_keyword = '';
let isTyping = false;

document.addEventListener('keydown', e => {
  const index = e.key;

  if (/^[a-zA-Z0-9\s()-]$/.test(index)) {
    search_keyword += index.toLowerCase();
    isTyping = true;

    var h1Element = document.querySelector("h1");
    h1Element.textContent = "Celeb Hub: " + search_keyword;

    searchCelebrities(search_keyword);
  } else if (index === "Backspace") {
    search_keyword = search_keyword.slice(0, -1);
    isTyping = true;

    var h1Element = document.querySelector("h1");
    h1Element.textContent = "Celeb Hub: " + search_keyword;

    searchCelebrities(search_keyword);
  } else if (index === "Escape") {
    clearSearch();
  } else if (index === "Enter") {
    if (search_keyword !== '') {
      selectFirstVisibleCelebrity();
    }
  } else {
    return;
  }

  if (search_keyword === '') {
    clearSearch();
  }
});

document.addEventListener('keyup', e => {
  if (e.key === "Escape") {
    clearSearch();
  }
});

function clearSearch() {
  search_keyword = '';
  isTyping = false;

  var h1Element = document.querySelector("h1");
  h1Element.textContent = document.querySelector("title").textContent;

  var celebGrid = document.getElementById('celebGrid');
  var celebItems = celebGrid.getElementsByClassName('celeb-item');

  for (let i = 0; i < celebItems.length; i++) {
    var celebItem = celebItems[i];
    celebItem.style.display = 'block';
  }
}

function searchCelebrities(keyword) {
  var celebGrid = document.getElementById('celebGrid');
  var celebItems = celebGrid.getElementsByClassName('celeb-item');

  for (let i = 0; i < celebItems.length; i++) {
    var celebItem = celebItems[i];
    var celebNameElement = celebItem.querySelector('p');
    var celebName = celebNameElement.textContent.toLowerCase();

    if (celebName.includes(keyword)) {
      celebItem.style.display = 'block';
    } else {
      celebItem.style.display = 'none';
    }
  }
}

function selectFirstVisibleCelebrity() {
  var celebGrid = document.getElementById('celebGrid');
  var celebItems = celebGrid.getElementsByClassName('celeb-item');

  for (let i = 0; i < celebItems.length; i++) {
    var celebItem = celebItems[i];

    if (window.getComputedStyle(celebItem).display !== 'none') {
      celebItem.click();
      break;
    }
  }
}
