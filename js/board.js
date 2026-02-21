/*
    js/board.js - 棋盘渲染模块
    负责棋盘绘制、棋子绘制、坐标转换
    不处理游戏规则，只负责页面展示
*/

// ==================== 常量定义 ====================

/** 棋盘格子总数（15x15） */
const GRID_COUNT = 15;

/** 单个格子的尺寸（px） */
const GRID_SIZE = 40;

/** 棋盘边距（px）- 棋子要画在交叉点上，所以边距比 GRID_SIZE/2 大一些 */
const BOARD_PADDING = 30;

/** 棋子半径（px） */
const CHESS_RADIUS = 16;

/** 线条颜色 */
const LINE_COLOR = "#5c4033";

/** 背景颜色（浅木色） */
const BOARD_BG_COLOR = "#f0e6d2";

// ==================== 全局变量 ====================

/** 棋盘画布的 DOM 元素 */
let canvas = null;

/** 画布的 2D 绘图上下文 */
let ctx = null;

// ==================== 初始化函数 ====================

/**
 * 初始化棋盘渲染模块
 * 获取画布元素，设置绘图上下文
 */
function initBoard() {
    // 1. 获取画布 DOM 元素
    canvas = document.getElementById("chessBoard");

    // 2. 检查 canvas 是否正确获取
    if (!canvas) {
        console.error("无法获取棋盘画布元素！");
        return;
    }

    // 3. 获取 2D 绘图上下文
    ctx = canvas.getContext("2d");

    // 4. 检查 context 是否正确获取
    if (!ctx) {
        console.error("无法获取 2D 绘图上下文！");
        return;
    }

    // 5. 绘制空棋盘
    renderChessBoard();
    console.log("棋盘渲染初始化完成");
}

// ==================== 核心绘制函数 ====================

/**
 * 渲染整个棋盘（网格线）
 * 先清空画布，再绘制15x15的网格线
 */
function renderChessBoard() {
    // 1. 清空画布
    clearCanvas();

    // 2. 设置线条样式
    ctx.strokeStyle = LINE_COLOR;
    ctx.lineWidth = 1;

    // 3. 绘制横线（15条）
    for (let i = 0; i < GRID_COUNT; i++) {
        // 计算线条的起止坐标
        const startX = BOARD_PADDING;
        const endX = BOARD_PADDING + (GRID_COUNT - 1) * GRID_SIZE;
        const y = BOARD_PADDING + i * GRID_SIZE;

        // 开始绘制线条
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
    }

    // 4. 绘制竖线（15条）
    for (let i = 0; i < GRID_COUNT; i++) {
        // 计算线条的起止坐标
        const startY = BOARD_PADDING;
        const endY = BOARD_PADDING + (GRID_COUNT - 1) * GRID_SIZE;
        const x = BOARD_PADDING + i * GRID_SIZE;

        // 开始绘制线条
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();
    }

    // 5. 绘制天元和星位（装饰性小圆点）
    drawStarPoints();
}

/**
 * 绘制棋盘上的星位标记
 * 标准五子棋棋盘有9个星位（天元和4个角星）
 */
function drawStarPoints() {
    // 星位坐标（相对于格子索引，0-14）
    const starPoints = [
        { x: 3, y: 3 },   // 左上星位
        { x: 11, y: 3 },  // 右上星位
        { x: 3, y: 11 },  // 左下星位
        { x: 11, y: 11 }, // 右下星位
        { x: 7, y: 7 }    // 天元（棋盘中心）
    ];

    // 设置星位圆点样式
    ctx.fillStyle = LINE_COLOR;

    // 绘制每个星位
    for (const point of starPoints) {
        const centerX = BOARD_PADDING + point.x * GRID_SIZE;
        const centerY = BOARD_PADDING + point.y * GRID_SIZE;

        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

/**
 * 绘制单个棋子
 * @param {number} x - 棋子的行坐标（0-14）
 * @param {number} y - 棋子的列坐标（0-14）
 * @param {string} color - 棋子颜色（"black" 或 "white"）
 */
function drawChess(x, y, color) {
    // 1. 计算棋子在画布上的实际像素坐标
    // 棋子画在交叉点上，所以坐标是 BOARD_PADDING + 索引 * GRID_SIZE
    const pixelX = BOARD_PADDING + x * GRID_SIZE;
    const pixelY = BOARD_PADDING + y * GRID_SIZE;

    // 2. 绘制棋子阴影（立体效果）
    ctx.beginPath();
    ctx.arc(pixelX + 2, pixelY + 2, CHESS_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fill();

    // 3. 绘制棋子主体
    ctx.beginPath();
    ctx.arc(pixelX, pixelY, CHESS_RADIUS, 0, Math.PI * 2);

    // 根据颜色设置渐变效果
    if (color === "black") {
        // 黑棋：黑色到深灰色的径向渐变
        const gradient = ctx.createRadialGradient(
            pixelX - 4, pixelY - 4, 2,    // 渐变起始点（左上）
            pixelX, pixelY, CHESS_RADIUS  // 渐变结束点（中心）
        );
        gradient.addColorStop(0, "#4a4a4a");  // 浅灰高光
        gradient.addColorStop(1, "#1a1a1a");  // 深黑主体
        ctx.fillStyle = gradient;
    } else {
        // 白棋：白色到浅灰色的径向渐变
        const gradient = ctx.createRadialGradient(
            pixelX - 4, pixelY - 4, 2,    // 渐变起始点（左上）
            pixelX, pixelY, CHESS_RADIUS  // 渐变结束点（中心）
        );
        gradient.addColorStop(0, "#ffffff");  // 白色高光
        gradient.addColorStop(1, "#e0e0e0");  // 浅灰主体
        ctx.fillStyle = gradient;
    }

    // 4. 填充棋子颜色
    ctx.fill();

    // 5. 绘制棋子边框
    ctx.strokeStyle = color === "black" ? "#1a1a1a" : "#cccccc";
    ctx.lineWidth = 1;
    ctx.stroke();
}

/**
 * 清空画布
 * 使用背景色填充整个画布
 */
function clearCanvas() {
    ctx.fillStyle = BOARD_BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ==================== 坐标转换函数 ====================

/**
 * 将鼠标点击坐标转换为棋盘格子坐标
 * @param {number} clickX - 鼠标点击的X像素坐标
 * @param {number} clickY - 鼠标点击的Y像素坐标
 * @returns {object} - 包含 x 和 y 属性的对象（格子索引），如果点击在棋盘外返回 null
 */
function pixelToGrid(clickX, clickY) {
    // 1. 计算点击位置距离最近交叉点的距离
    // 交叉点坐标 = BOARD_PADDING + 索引 * GRID_SIZE
    // 所以 索引 = (点击坐标 - BOARD_PADDING) / GRID_SIZE
    const gridX = Math.round((clickX - BOARD_PADDING) / GRID_SIZE);
    const gridY = Math.round((clickY - BOARD_PADDING) / GRID_SIZE);

    // 2. 检查是否在棋盘范围内（0-14）
    if (gridX < 0 || gridX >= GRID_COUNT || gridY < 0 || gridY >= GRID_COUNT) {
        return null;
    }

    // 3. 返回格子坐标
    return { x: gridX, y: gridY };
}

// ==================== 刷新棋盘函数 ====================

/**
 * 刷新棋盘显示
 * 根据游戏状态重新绘制所有棋子和当前状态
 * @param {Array} chessBoardData - 棋盘数据二维数组
 */
function refreshBoard(chessBoardData) {
    // 1. 重新绘制棋盘网格
    renderChessBoard();

    // 2. 遍历棋盘数据，绘制所有已落下的棋子
    for (let i = 0; i < GRID_COUNT; i++) {
        for (let j = 0; j < GRID_COUNT; j++) {
            // 如果该位置有棋子
            if (chessBoardData[i][j] !== null) {
                // 绘制棋子
                drawChess(i, j, chessBoardData[i][j]);
            }
        }
    }
}
