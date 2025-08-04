// sound preloading
const soundMenu = new Audio('audio/menu.wav');
const soundUpgrade = new Audio('audio/powerUp.wav');
const soundClick = new Audio('audio/hitHurt.wav');
const soundWin = new Audio('audio/win.wav');
const soundReset = new Audio('audio/reset.wav');

// page navigation
document.querySelectorAll('.nav-btn').forEach(button => {
  button.addEventListener('click', () => {
    const target = button.getAttribute('data-target');
    document.querySelectorAll('.page').forEach(page => {
      page.classList.add('hidden');
    });
    document.getElementById(target).classList.remove('hidden');
  });
});

// clicker logic starts
let score = 0;
let gameStarted = false;
let gameWon = false;
let startTime = 0;
let timerInterval = null;
const winButton = document.getElementById('win-button');
const timerDisplay = document.getElementById('timer-display');
const scoreDisplay = document.getElementById('score');
const upgradesDiv = document.getElementById('upgrades');
const clickButton = document.getElementById('click-button');
const cog = document.getElementById('cog');

document.querySelectorAll('.nav-btn').forEach(button => {
  button.addEventListener('click', () => {
    const target = button.getAttribute('data-target');
    document.querySelectorAll('.page').forEach(page => {
      page.classList.add('hidden');
    });
    document.getElementById(target).classList.remove('hidden');
  });
});

// clicker logic
clickButton.addEventListener('click', () => {

  if (!gameStarted) {
    gameStarted = true;
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
  }

  score += partsPerClick;
  scoreDisplay.textContent = score;

  // spin cog
  //cog.classList.add('spin');
  //setTimeout(() => {
  //  cog.classList.remove('spin');
  //}, 400);
  cog.classList.remove('spin');     // remove it first
  void cog.offsetWidth;             // force reflow
  cog.classList.add('spin');        // re-add it to restart animation

  updateUpgradePanel();
  updateWinButton();
});

let partsPerClick = 1;
let passiveRate = 0;

// upgrades !!
const upgrades = [
  {
    name: '🔩 Bigger Wrench',
    id: 'wrench',
    baseCost: 10,
    owned: 0,
    effect: 'Bigger wrench means better machines, surely. +1 part per click',
    apply: () => { partsPerClick++; }
  },
  {
    name: '⚡ Electric Power',
    id: 'electric',
    baseCost: 25,
    owned: 0,
    effect: 'Simple machine that makes parts automatically. +0.5 parts/sec',
    apply: () => { passiveRate += 0.5; }
  },
  {
    name: '🤖 Auto Machine Arm',
    id: 'arm',
    baseCost: 100,
    owned: 0,
    effect: 'Advanced machine that makes even more parts! +2 parts/sec',
    apply: () => { passiveRate += 2; }
  }
];

function updateUpgradePanel() {
  upgradesDiv.innerHTML = '';
  upgrades.forEach(upg => {
    const cost = upg.baseCost * (upg.owned + 1);
    const upgradeEl = document.createElement('div');
    upgradeEl.className = 'upgrade';

    upgradeEl.innerHTML = `
      <p><strong>${upg.name}</strong> | Cost: ${cost} | Owned: ${upg.owned}<br/>
      ${upg.effect}</p>
      <button data-id="${upg.id}" class="sound-upgrade">Buy</button>
    `;

    upgradesDiv.appendChild(upgradeEl);
  });

  // event delegation
  upgradesDiv.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const upgrade = upgrades.find(u => u.id === id);
      const cost = upgrade.baseCost * (upgrade.owned + 1);

      if (score >= cost) {
        score -= cost;
        upgrade.owned++;
        upgrade.apply();
        dropMachineImage(upgrade.id);
        scoreDisplay.textContent = Math.floor(score);
        updateUpgradePanel();
      } else {
        alert('Not enough parts!');
      }
    });
  });
}

setInterval(() => {
  if (passiveRate > 0) {
    score += passiveRate;
    scoreDisplay.textContent = Math.floor(score);
  }
}, 1000);

updateUpgradePanel();

// built machines panel
function dropMachineImage(type) {
  const dropZone = document.getElementById('machine-drop-zone');
  const img = document.createElement('img');
  img.className = 'drop-item';

  if (type === 'wrench') img.src = 'images/wrench.png';
  if (type === 'electric') img.src = 'images/machine.png';
  if (type === 'arm') img.src = 'images/robot.png';

  // random drop position
  img.style.left = Math.floor(Math.random() * 60 + 10) + '%';

  dropZone.appendChild(img);
}

function updateTimer() {
  if (gameStarted && !gameWon) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = `Time: ${elapsed}s`;
  }
}

function updateWinButton() {
  if (score >= 2000 && !gameWon) {
    winButton.disabled = false;
  }
}

winButton.addEventListener('click', () => {
  if (score >= 2000 && !gameWon) {
    gameWon = true;
    clearInterval(timerInterval);
    const finalTime = Math.floor((Date.now() - startTime) / 1000);
    alert(`🎉 Congrats! You've beaten the game in ${finalTime} seconds.\n\nYou can keep playing or refresh the page to try for a better time.`);
  }
});

// makes the sounds
document.addEventListener('click', (e) => {
  if (e.target.closest('.sound-menu')) {
    soundMenu.currentTime = 0;
    soundMenu.play();
  } 
  else if (e.target.closest('.sound-upgrade')) {
    soundUpgrade.currentTime = 0;
    soundUpgrade.play();
  } 
  else if (e.target.closest('.sound-click')) {
    soundClick.currentTime = 0;
    soundClick.play();
  }
  else if (e.target.closest('.sound-win')) {
    soundWin.currentTime = 0;
    soundWin.play();
  }
  else if (e.target.closest('.sound-reset')) {
    soundReset.currentTime = 0;
    soundReset.play();
  }
});