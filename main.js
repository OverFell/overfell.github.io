// Page navigation
document.querySelectorAll('.nav-btn').forEach(button => {
  button.addEventListener('click', () => {
    const target = button.getAttribute('data-target');
    document.querySelectorAll('.page').forEach(page => {
      page.classList.add('hidden');
    });
    document.getElementById(target).classList.remove('hidden');
  });
});

// Simple clicker game
let score = 0;
const scoreDisplay = document.getElementById('score');
const upgradesDiv = document.getElementById('upgrades');
const machineDisplay = document.getElementById('machine-icons');
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

// Handle clicker logic
clickButton.addEventListener('click', () => {
  score += partsPerClick;
  scoreDisplay.textContent = score;

  // Spin only the cog
  cog.classList.add('spin');
  setTimeout(() => {
    cog.classList.remove('spin');
  }, 400);

  updateUpgrades();
  updateMachines();
});

let partsPerClick = 1;
let passiveRate = 0;

// Upgrade definitions
const upgrades = [
  {
    name: '🔩 Bigger Wrench',
    id: 'wrench',
    baseCost: 10,
    owned: 0,
    effect: '+1 part per click',
    apply: () => { partsPerClick++; }
  },
  {
    name: '⚡ Electric Power',
    id: 'electric',
    baseCost: 25,
    owned: 0,
    effect: '+0.5 parts/sec',
    apply: () => { passiveRate += 0.5; }
  },
  {
    name: '🤖 Auto Machine Arm',
    id: 'arm',
    baseCost: 100,
    owned: 0,
    effect: '+2 parts/sec',
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
      <button data-id="${upg.id}">Buy</button>
    `;

    upgradesDiv.appendChild(upgradeEl);
  });

  // Event delegation
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

function updateMachines() {
  machineDisplay.innerHTML = '';
  const numIcons = Math.floor(score / 10);
  for (let i = 0; i < numIcons; i++) {
    machineDisplay.innerHTML += '🛠️ ';
  }
}

setInterval(() => {
  if (passiveRate > 0) {
    score += passiveRate;
    scoreDisplay.textContent = Math.floor(score);
    updateMachines();
  }
}, 1000);

updateUpgradePanel();

function dropMachineImage(type) {
  const dropZone = document.getElementById('machine-drop-zone');
  const img = document.createElement('img');
  img.className = 'drop-item';

  // Set the image source based on upgrade type
  if (type === 'wrench') img.src = 'images/wrench.png';
  if (type === 'electric') img.src = 'images/machine.png';
  if (type === 'arm') img.src = 'images/robot.png';

  // Random horizontal position within drop zone
  img.style.left = Math.floor(Math.random() * 60 + 10) + '%';

  dropZone.appendChild(img);
}