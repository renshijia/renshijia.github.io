// 游戏变量
let majorLevel = 1;
let minorLevel = 1; // 保留 minorLevel，用于逻辑控制
let energyValue = 0;
let isIncreasing = true;
let energyBarInterval;
let monsterEnergy = 60;
let baseSpeed = 12.5; // 初始速度
let currentSpeed = baseSpeed;
let totalLevels = 81; // 总共81级
let newMajorLevelReached = false; // 标记是否晋升大级

let playerHealth = 100;
let monsterHealth = 100;

const monsterEnergyValues = [0, 60, 65, 70, 75, 80, 85, 90, 95, 98]; // 索引对应等级

// DOM 元素
const majorLevelNumber = document.getElementById('majorLevelNumber'); // 新增

const energyFill = document.getElementById('energyFill');
const lockButton = document.getElementById('lockButton');
const monsterImage = document.getElementById('monsterImage');
const overlayImage = document.getElementById('overlayImage'); // 覆盖的图片
const playerImage = document.getElementById('playerImage');
const comparisonResult = document.getElementById('comparisonResult');
const victorySound = document.getElementById('victorySound');
const defeatSound = document.getElementById('defeatSound');
const redSound = document.getElementById('redSound'); // 新增的音频
const backgroundMusic = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const statusText = document.getElementById('statusText'); // 用于显示状态文字

const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const gameContainer = document.getElementById('gameContainer');
const majorLevelScreen = document.getElementById('majorLevelScreen');
const continueButton = document.getElementById('continueButton');
const victoryScreen = document.getElementById('victoryScreen');

const playerHealthFill = document.getElementById('playerHealthFill');
const monsterHealthFill = document.getElementById('monsterHealthFill');

const challengeFailedDialog = document.getElementById('challengeFailedDialog');
const retryButton = document.getElementById('retryButton');

// 初始化游戏
function initGame() {
    updateLevelText();
    updateDifficulty();
    resetHealth();
    initBackgroundMusic();
}

// 开始游戏按钮事件
startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    backgroundMusic.play(); // 开始背景音乐
    startEnergyBar();
});

// 继续打怪按钮事件
continueButton.addEventListener('click', () => {
    majorLevelScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    startEnergyBar();
});

// 挑战失败对话框的再来一次按钮事件
retryButton.addEventListener('click', () => {
    challengeFailedDialog.style.display = 'none';
    resetHealth();
    startEnergyBar();
});

// 更新等级显示
function updateLevelText() {
    majorLevelNumber.textContent = majorLevel;
}

// 更新难度
function updateDifficulty() {
    // 更新妖怪能量值
    monsterEnergy = monsterEnergyValues[majorLevel];
    // 由于已删除妖怪能量值显示，故不再更新文本

    // 更新妖怪图片
    monsterImage.src = `assets/monster${majorLevel}.png`;

    // 隐藏覆盖图片
    overlayImage.style.display = 'none';

    // 更新能量条速度
    currentSpeed = baseSpeed; // 固定速度，或者根据需要调整
}

// 重置生命值
function resetHealth() {
    playerHealth = 100;
    monsterHealth = 100;
    updateHealthBars();
}

// 更新血条
function updateHealthBars() {
    playerHealthFill.style.width = playerHealth + '%';
    monsterHealthFill.style.width = monsterHealth + '%';

    playerHealthFill.style.backgroundColor = getHealthColor(playerHealth);
    monsterHealthFill.style.backgroundColor = getHealthColor(monsterHealth);
}

function getHealthColor(health) {
    if (health > 50) {
        return 'green';
    } else if (health > 20) {
        return 'yellow';
    } else {
        return 'red';
    }
}

// 开始能量条
function startEnergyBar() {
    if (energyBarInterval) clearInterval(energyBarInterval);
    energyValue = 0;
    isIncreasing = true;
    energyFill.style.height = '0%';
    lockButton.disabled = false; // 启用按钮
    energyBarInterval = setInterval(() => {
        if (isIncreasing) {
            energyValue += 1;
            if (energyValue >= 100) {
                energyValue = 100;
                isIncreasing = false;
            }
        } else {
            energyValue -= 1;
            if (energyValue <= 0) {
                energyValue = 0;
                isIncreasing = true;
            }
        }
        energyFill.style.height = `${energyValue}%`;
    }, currentSpeed);
}

// 锁定能量
lockButton.addEventListener('click', () => {
    lockButton.disabled = true; // 禁用按钮
    clearInterval(energyBarInterval);
    // 已删除玩家能量值显示

    if (energyValue > monsterEnergy) {
        comparisonResult.textContent = '胜过妖怪的能量值，胜利！';
        playSound('victory');
        showStatusText(`能量值 ${energyValue}%，获胜！`, 'win');
        // 玩家图片震动
        playerImage.classList.add('shake');
        setTimeout(() => {
            playerImage.classList.remove('shake');
        }, 5000); // 震动5秒

        // 减少妖怪生命值
        monsterHealth -= 100 / 9;
        if (monsterHealth < 0) monsterHealth = 0;
        updateHealthBars();

        if (monsterHealth <= 0) {
            // 妖怪被击败，标记为新大级到达
            newMajorLevelReached = true;
            // 检查游戏进度
            setTimeout(() => {
                checkGameProgress();
            }, 1000);
        } else {
            // 继续当前大级
            setTimeout(() => {
                startEnergyBar();
            }, 3000);
        }
    } else {
        comparisonResult.textContent = '未超过妖怪的能量值，失败！';
        playSound('defeat');
        showStatusText(`能量值 ${energyValue}%，失败！`, 'lose');
        // 妖怪图片震动
        monsterImage.classList.add('shake');
        setTimeout(() => {
            monsterImage.classList.remove('shake');
        }, 5000); // 震动5秒

        // 减少玩家生命值
        playerHealth -= 100 / 9;
        if (playerHealth < 0) playerHealth = 0;
        updateHealthBars();

        if (playerHealth <= 0) {
            // 玩家被击败，显示挑战失败对话框
            setTimeout(() => {
                showChallengeFailedDialog();
            }, 3000);
        } else {
            // 继续当前大级
            setTimeout(() => {
                startEnergyBar();
            }, 3000);
        }
    }
});

// 检查游戏进度
function checkGameProgress() {
    if (newMajorLevelReached) {
        newMajorLevelReached = false; // 重置标记

        // 显示 red.png 和播放 red.mp3
        overlayImage.style.display = 'block';

        redSound.currentTime = 0;
        redSound.play();

        // 5秒后进入大级提示页面
        setTimeout(() => {
            gameContainer.style.display = 'none';
            majorLevelScreen.style.display = 'block';

            // 更新到下一个大级
            levelUp();
        }, 5000); // 等待5秒
    } else {
        // 继续当前大级或继续当前战斗
        startEnergyBar();
    }
}

// 显示状态文字
function showStatusText(text, result) {
    statusText.textContent = text;
    statusText.className = `status-text ${result}`; // 添加 win 或 lose 类
    statusText.style.display = 'block';
    setTimeout(() => {
        statusText.style.display = 'none';
    }, 3000);
}

// 播放音效
function playSound(result) {
    if (result === 'victory') {
        victorySound.currentTime = 0;
        victorySound.play();
    } else if (result === 'defeat') {
        defeatSound.currentTime = 0;
        defeatSound.play();
    }
}

// 背景音乐控制
function initBackgroundMusic() {
    backgroundMusic.volume = 0.5; // 音量为50%

    musicToggle.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicToggle.classList.remove('off');
        } else {
            backgroundMusic.pause();
            musicToggle.classList.add('off');
        }
    });
}

// 升级
function levelUp() {
    if (majorLevel < 9) {
        majorLevel++;
        minorLevel = 1; // 重置小级
        resetHealth();
        updateLevelText();
        updateDifficulty();
    } else {
        // 通关
        setTimeout(() => {
            gameContainer.style.display = 'none';
            victoryScreen.style.display = 'block';
            backgroundMusic.pause();
        }, 2000);
    }
}

// 挑战失败
function showChallengeFailedDialog() {
    challengeFailedDialog.style.display = 'block';
}

// 开始游戏
initGame();
