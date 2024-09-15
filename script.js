// 游戏变量
let majorLevel = 1;
let minorLevel = 1;
let energyValue = 0;
let isIncreasing = true;
let energyBarInterval;
let monsterEnergy = 60;
let baseSpeed = 12.5; // 初始速度
let currentSpeed = baseSpeed;
let totalLevels = 81; // 总共81级
let newMajorLevelReached = false; // 标记是否晋升大级
let highestMajorLevel = 1; // 记录玩家达到的最高大级

const monsterEnergyValues = [0, 60, 65, 70, 75, 80, 85, 90, 95, 98]; // 索引对应等级

// DOM 元素
const majorLevelSpan = document.getElementById('majorLevel');
const minorLevelSpan = document.getElementById('minorLevel');
const remainingNumberSpan = document.getElementById('remainingNumber');
const monsterEnergyText = document.getElementById('monsterEnergy');
const energyFill = document.getElementById('energyFill');
const lockButton = document.getElementById('lockButton');
const monsterImage = document.getElementById('monsterImage');
const overlayImage = document.getElementById('overlayImage'); // 覆盖的图片
const playerImage = document.getElementById('playerImage');
const playerEnergyValue = document.getElementById('playerEnergyValue');
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

// 初始化游戏
function initGame() {
    updateLevelText();
    updateRemainingLevels();
    updateDifficulty();
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

// 更新等级显示
function updateLevelText() {
    majorLevelSpan.textContent = `大级：${majorLevel}`;
    minorLevelSpan.textContent = `小级：${minorLevel}`;
}

// 更新剩余难数
function updateRemainingLevels() {
    let passedLevels = (majorLevel - 1) * 9 + (minorLevel - 1);
    let remaining = totalLevels - passedLevels;
    remainingNumberSpan.textContent = remaining;
}

// 更新难度
function updateDifficulty() {
    // 更新妖怪能量值
    monsterEnergy = monsterEnergyValues[majorLevel];
    monsterEnergyText.textContent = `妖怪能量值：${monsterEnergy}%`;

    // 更新妖怪图片
    monsterImage.src = `assets/monster${majorLevel}.png`;

    // 隐藏覆盖图片
    overlayImage.style.display = 'none';

    // 更新能量条速度
    currentSpeed = baseSpeed - (minorLevel - 1) * 1.25;
    if (currentSpeed < 2.5) currentSpeed = 2.5; // 最小速度限制
}

// 开始能量条
function startEnergyBar() {
    if (energyBarInterval) clearInterval(energyBarInterval);
    energyValue = 0;
    isIncreasing = true;
    energyFill.style.height = '0%';
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
    clearInterval(energyBarInterval);
    playerEnergyValue.textContent = `玩家能量值：${energyValue}%`;
    if (energyValue > monsterEnergy) {
        comparisonResult.textContent = '胜过妖怪的能量值，胜利！';
        playSound('victory');
        showStatusText(`能量值 ${energyValue}%，获胜！`, 'win');
        // 玩家图片震动
        playerImage.classList.add('shake');
        setTimeout(() => {
            playerImage.classList.remove('shake');
        }, 5000); // 震动5秒
        levelUp();
    } else {
        comparisonResult.textContent = '未超过妖怪的能量值，失败！';
        playSound('defeat');
        showStatusText(`能量值 ${energyValue}%，失败！`, 'lose');
        // 妖怪图片震动
        monsterImage.classList.add('shake');
        setTimeout(() => {
            monsterImage.classList.remove('shake');
        }, 5000); // 震动5秒
        levelDown();
    }
    setTimeout(() => {
        // 隐藏状态文字
        statusText.style.display = 'none';
        playerEnergyValue.textContent = '玩家能量值：0%';
        comparisonResult.textContent = '';
        checkGameProgress();
    }, 3000); // 状态文字显示3秒
});

// 显示状态文字
function showStatusText(text, result) {
    statusText.textContent = text;
    statusText.className = `status-text ${result}`; // 添加 win 或 lose 类
    statusText.style.display = 'block';
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
    if (minorLevel < 9) {
        minorLevel++;
    } else if (majorLevel < 9) {
        minorLevel = 9; // 确保在处理特殊动画时小级为9
        newMajorLevelReached = true; // 标记晋升大级

        // 更新最高大级
        if (majorLevel + 1 > highestMajorLevel) {
            highestMajorLevel = majorLevel + 1;
        }
    } else {
        // 通关
        setTimeout(() => {
            gameContainer.style.display = 'none';
            victoryScreen.style.display = 'block';
            backgroundMusic.pause();
        }, 2000);
        return;
    }
    updateLevelText();
    updateRemainingLevels();
    updateDifficulty();
}

// 降级
function levelDown() {
    if (minorLevel > 1) {
        minorLevel--;
    } else {
        if (majorLevel > highestMajorLevel) {
            majorLevel--;
            minorLevel = 9;
        } else {
            // 保持在最高大级，最小小级
            minorLevel = 1;
        }
    }
    updateLevelText();
    updateRemainingLevels();
    updateDifficulty();
}

// 检查游戏进度
function checkGameProgress() {
    if (newMajorLevelReached) {
        newMajorLevelReached = false; // 重置标记

        // 延迟1秒，然后播放特殊动画
        setTimeout(() => {
            // 显示覆盖图片
            overlayImage.style.display = 'block';

            // 播放音效 red.mp3
            redSound.currentTime = 0;
            redSound.play();

            // 5秒后进入大级提示页面
            setTimeout(() => {
                gameContainer.style.display = 'none';
                majorLevelScreen.style.display = 'block';

                // 更新到下一个大级
                majorLevel++;
                minorLevel = 1;
                updateLevelText();
                updateRemainingLevels();
                updateDifficulty();
            }, 5000); // 将时间从 3000 毫秒改为 5000 毫秒
        }, 1000);
    } else {
        startEnergyBar();
    }
}

// 开始游戏
initGame();
