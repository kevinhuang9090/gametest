/*
    js/main.js - 入口文件
    负责事件绑定、游戏初始化、模块调度
    连接 game.js（逻辑） 和 board.js（渲染）
*/

// ==================== 常量定义 ====================

/** 黑棋显示文字 */
const PLAYER_BLACK_TEXT = "黑棋";

/** 白棋显示文字 */
const PLAYER_WHITE_TEXT = "白棋";

// ==================== 页面元素引用 ====================

/** 棋盘画布元素 */
let chessBoardCanvas = null;

/** 当前玩家显示文字元素 */
let currentPlayerText = null;

/** 重新开始按钮元素 */
let restartBtn = null;

// ==================== 初始化函数 ====================

/**
 * 页面加载完成后初始化游戏
 * 这是整个游戏的入口点
 */
function init() {
    console.log("开始初始化游戏...");

    // 1. 获取页面元素
    chessBoardCanvas = document.getElementById("chessBoard");
    currentPlayerText = document.getElementById("currentPlayerText");
    restartBtn = document.getElementById("restartBtn");

    // 检查元素是否正确获取
    if (!chessBoardCanvas) {
        console.error("无法获取棋盘画布元素！");
        return;
    }
    if (!currentPlayerText) {
        console.error("无法获取当前玩家文字元素！");
        return;
    }
    if (!restartBtn) {
        console.error("无法获取重新开始按钮元素！");
        return;
    }

    // 2. 初始化游戏状态（game.js）
    initGame();

    // 3. 初始化棋盘渲染（board.js）
    initBoard();

    // 4. 绑定事件监听器
    bindEventListeners();

    // 5. 更新界面显示
    updateUI();

    console.log("游戏初始化完成");
}

// ==================== 事件绑定函数 ====================

/**
 * 绑定页面元素的事件监听器
 */
function bindEventListeners() {
    // 1. 绑定棋盘点击事件（落子）
    chessBoardCanvas.addEventListener("click", handleBoardClick);

    // 2. 绑定重新开始按钮点击事件
    restartBtn.addEventListener("click", handleRestartClick);
}

// ==================== 事件处理函数 ====================

/**
 * 处理棋盘点击事件
 * 用户点击棋盘时触发落子逻辑
 * @param {Event} event - 点击事件对象
 */
function handleBoardClick(event) {
    // 1. 获取点击位置相对于画布的坐标
    const rect = chessBoardCanvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // 2. 将像素坐标转换为棋盘格子坐标
    const gridPos = pixelToGrid(clickX, clickY);

    // 3. 如果点击在棋盘外，直接返回
    if (gridPos === null) {
        return;
    }

    // 4. 尝试落子（调用 game.js 的逻辑）
    const success = placeChess(gridPos.x, gridPos.y);

    // 5. 如果落子成功，更新界面
    if (success) {
        // 获取当前游戏状态
        const gameState = getGameState();

        // 刷新棋盘显示
        refreshBoard(gameState.chessBoard);

        // 更新界面文字
        updateUI();

        // 检查游戏是否结束
        if (gameState.isGameOver) {
            // 延迟一点弹出胜利消息，让用户看到最后一颗棋子
            setTimeout(() => {
                // 获取获胜玩家名称
                const winnerName = gameState.winner === "black" ? PLAYER_BLACK_TEXT : PLAYER_WHITE_TEXT;

                // 弹出胜利提示
                alert("恭喜！" + winnerName + " 获胜！");

                // 更新文字显示为游戏结束
                updateGameOverUI(winnerName);
            }, 100);
        }
    }
}

/**
 * 处理重新开始按钮点击事件
 * 清空棋盘，重置游戏状态
 */
function handleRestartClick() {
    // 1. 重新初始化游戏状态
    initGame();

    // 2. 重新渲染棋盘（清空所有棋子）
    const emptyBoard = getChessBoardCopy();
    refreshBoard(emptyBoard);

    // 3. 更新界面显示
    updateUI();
}

// ==================== 界面更新函数 ====================

/**
 * 更新界面显示
 * 根据当前游戏状态更新文字和样式
 */
function updateUI() {
    // 获取当前游戏状态
    const gameState = getGameState();

    // 更新当前玩家显示文字
    if (gameState.currentPlayer === "black") {
        currentPlayerText.textContent = "当前回合：" + PLAYER_BLACK_TEXT;
        currentPlayerText.className = "player-black";
    } else {
        currentPlayerText.textContent = "当前回合：" + PLAYER_WHITE_TEXT;
        currentPlayerText.className = "player-white";
    }
}

/**
 * 游戏结束时更新界面
 * @param {string} winnerName - 获胜玩家名称
 */
function updateGameOverUI(winnerName) {
    // 更新显示文字为获胜信息
    currentPlayerText.textContent = winnerName + " 获胜！";
}

// ==================== 启动游戏 ====================

/**
 * 页面加载完成后自动启动游戏
 * 使用 DOMContentLoaded 事件确保页面元素已加载
 */
document.addEventListener("DOMContentLoaded", init);
