const btn = document.querySelector("#emoji");
const emojis = [
"😆", "😅", "🤣", "😂", "😀", "🤑", "🤨", "🙂", "😊", "😗",
  "😛", "😏", "🤥", "😴", "🥺", "😧", "😇", "😳", "🙃", "🥴",
  "🧐", "🤨", "😒", "🤔", "🤭", "🥰", "🤐", "👀", "🤔", "🤪",
  "🥲", "😃", "😁", "😬",
];

let changeCount = 0;
let emojiHistory = [];
let emojiCounts = {};
let autoChangeInterval = null;
let currentSpeed = 300;

const explosionSound = new Audio('pop.mp3');

function playSound() {
  if (!document.getElementById('soundToggle').checked) return;
  
  const sound = explosionSound.cloneNode();
  sound.volume = 0.3;
  sound.play();
}

function changeEmoji() {
  const newEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  btn.innerHTML = newEmoji;
  
  emojiHistory.unshift(newEmoji);
  if (emojiHistory.length > 20) emojiHistory.pop();
  
  emojiCounts[newEmoji] = (emojiCounts[newEmoji] || 0) + 1;
  
  changeCount++;
  document.getElementById('changeCount').textContent = changeCount;
  updateFavorite();
  updateHistory();
  
  playSound();
  
  const animation = document.getElementById('animation').value;
  if (animation !== 'none') {
    btn.classList.remove('shake', 'spin', 'bounce');
    void btn.offsetWidth;
    btn.classList.add(animation);
  }

  if (document.getElementById('emojiTrail').checked) {
    createEmojiTrail(newEmoji);
  }
}

function createEmojiTrail(emoji) {
  const trail = document.createElement('div');
  trail.className = 'emoji-trail';
  trail.textContent = emoji;
  trail.style.left = btn.getBoundingClientRect().left + btn.offsetWidth / 2 + 'px';
  trail.style.top = btn.getBoundingClientRect().top + 'px';
  document.body.appendChild(trail);
  
  setTimeout(() => trail.remove(), 1000);
}

function updateFavorite() {
  let maxCount = 0;
  let favorite = '-';
  
  for (let emoji in emojiCounts) {
    if (emojiCounts[emoji] > maxCount) {
      maxCount = emojiCounts[emoji];
      favorite = emoji;
    }
  }
  
  document.getElementById('favorite').textContent = favorite;
}

function updateHistory() {
  const historyContainer = document.getElementById('historyItems');
  historyContainer.innerHTML = '';
  
  const uniqueHistory = [...new Set(emojiHistory.slice(0, 10))];
  uniqueHistory.forEach(emoji => {
    const item = document.createElement('span');
    item.className = 'history-item';
    item.textContent = emoji;
    item.title = `Used ${emojiCounts[emoji]} times`;
    item.onclick = () => {
      btn.innerHTML = emoji;
      playSound();
    };
    historyContainer.appendChild(item);
  });
}

btn.addEventListener("mouseover", changeEmoji);

btn.addEventListener("click", () => {
  changeEmoji();
});

document.getElementById('size').addEventListener('input', (e) => {
  btn.style.fontSize = e.target.value + 'px';
  document.getElementById('sizeValue').textContent = e.target.value + 'px';
});

document.getElementById('speed').addEventListener('input', (e) => {
  currentSpeed = e.target.value;
  document.getElementById('speedValue').textContent = e.target.value + 'ms';
  
  if (autoChangeInterval) {
    clearInterval(autoChangeInterval);
    autoChangeInterval = setInterval(changeEmoji, currentSpeed);
  }
});

document.getElementById('autoChange').addEventListener('change', (e) => {
  if (e.target.checked) {
    autoChangeInterval = setInterval(changeEmoji, currentSpeed);
  } else {
    clearInterval(autoChangeInterval);
    autoChangeInterval = null;
  }
});

document.getElementById('randomColor').addEventListener('click', () => {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  ];
  document.body.style.background = colors[Math.floor(Math.random() * colors.length)];
});

document.getElementById('copyEmoji').addEventListener('click', () => {
  navigator.clipboard.writeText(btn.innerHTML).then(() => {
    alert('Emoji copied: ' + btn.innerHTML);
  });
});

document.getElementById('clearHistory').addEventListener('click', () => {
  emojiHistory = [];
  emojiCounts = {};
  changeCount = 0;
  document.getElementById('changeCount').textContent = '0';
  document.getElementById('favorite').textContent = '-';
  updateHistory();
});

document.getElementById('downloadHistory').addEventListener('click', () => {
  const data = {
    totalChanges: changeCount,
    history: emojiHistory,
    counts: emojiCounts
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'emoji-history.json';
  a.click();
  URL.revokeObjectURL(url);
});

btn.addEventListener('animationend', () => {
  btn.classList.remove('shake', 'spin', 'bounce');
});