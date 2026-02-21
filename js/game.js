/*
    js/game.js - 五子棋游戏规则模块
    负责游戏规则（落子合法性、胜负判断、状态管理）
    核心逻辑层，与页面渲染解耦
*/

// ==================== 常量定义 ====================

/** 棋盘格子总数（15x15） */
const GRID_COUNT = 15;

/** 获胜所需连续棋子数 */
const WIN_COUNT = 5;

/** 黑棋标识 */
const CHESS_BLACK = "black";

/** 白棋标识 */
const CHESS_WHITE = "white";

// ==================== 游戏状态变量 ====================

/**
 * 存储棋盘棋子的二维数组
 * 数组结构：chessBoard[x][y] = null(空) | "black"(黑棋) | "white"(白棋)
 */
let chessBoard = [];

/** 当前落子玩家（CHESS_BLACK=黑棋，CHESS_WHITE=白棋） */
let currentPlayer = CHESS_BLACK;

/** 游戏是否结束（true=结束，false=进行中） */
let isGameOver = false;

/** 获胜玩家的标识（CHESS_BLACK 或 CHESS_WHITE） */
let winner = null;

// ==================== 初始化函数 ====================

/**
 * 初始化游戏状态
 * 创建一个空的棋盘数组，设置初始玩家为黑棋
 */
function initGame() {
    // 1. 创建 15x15 的空棋盘
    chessBoard = [];
    for (let i = 0; i < GRID_COUNT; i++) {
        // 每一行也是一个数组，初始值为 null（表示空位）
        chessBoard[i] = [];
        for (let j = 0; j < GRID_COUNT; j++) {
            chessBoard[i][j] = null;
        }
    }

    // 2. 设置黑棋为先手
    currentPlayer = CHESS_BLACK;

    // 3. 游戏状态重置为进行中
    isGameOver = false;
    winner = null;

    console.log("游戏状态初始化完成");
}

// ==================== 核心功能函数 ====================

/**
 * 尝试在指定位置落子
 * @param {number} x - 落子的行坐标（0-14）
 * @param {number} y - 落子的列坐标（0-14）
 * @returns {boolean} - 落子是否成功（true=成功，false=失败）
 */
function placeChess(x, y) {
    // 1. 检查游戏是否已结束
    if (isGameOver) {
        return false;
    }

    // 2. 检查坐标是否超出棋盘范围
    if (x < 0 || x >= GRID_COUNT || y < 0 || y >= GRID_COUNT) {
        return false;
    }

    // 3. 检查该位置是否已有棋子（不能重复落子）
    if (chessBoard[x][y] !== null) {
        return false;
    }

    // 4. 在棋盘上放置当前玩家的棋子
    chessBoard[x][y] = currentPlayer;

    // 5. 检查是否获胜
    if (checkWin(x, y)) {
        // 设置游戏结束状态和获胜玩家
        isGameOver = true;
        winner = currentPlayer;
    } else {
        // 6. 如果没有获胜，切换到另一方玩家
        switchPlayer();
    }

    // 7. 落子成功
    return true;
}

/**
 * 切换当前玩家
 * 黑棋 -> 白棋 -> 黑棋 循环
 */
function switchPlayer() {
    if (currentPlayer === CHESS_BLACK) {
        currentPlayer = CHESS_WHITE;
    } else {
        currentPlayer = CHESS_BLACK;
    }
}

/**
 * 检查指定位置是否构成五子连珠（获胜）
 * @param {number} x - 落子的行坐标
 * @param {number} y - 落子的列坐标
 * @returns {boolean} - 是否获胜
 */
function checkWin(x, y) {
    // 获取当前落子的颜色
    const color = chessBoard[x][y];

    // 四个方向：水平、垂直、左斜、右斜
    // 每条线需要检查是否连成 5 个同色棋子

    // 1. 检查水平方向（左右扩展）
    if (countConsecutive(x, y, 0, 1, color) >= WIN_COUNT) {
        return true;
    }

    // 2. 检查垂直方向（上下扩展）
    if (countConsecutive(x, y, 1, 0, color) >= WIN_COUNT) {
        return true;
    }

    // 3. 检查左斜方向（左上-右下）
    if (countConsecutive(x, y, 1, 1, color) >= WIN_COUNT) {
        return true;
    }

    // 4. 检查右斜方向（右上-左下）
    if (countConsecutive(x, y, 1, -1, color) >= WIN_COUNT) {
        return true;
    }

    // 四个方向都没有连成5子，返回 false
    return false;
}

/**
 * 统计指定方向上连续相同颜色棋子的数量
 * @param {number} x - 起始行坐标
 * @param {number} y - 起始列坐标
 * @param {number} dx - 行方向增量（-1, 0, 1）
 * @param {number} dy - 列方向增量（-1, 0, 1）
 * @param {string} color - 要检查的颜色
 * @returns {number} - 连续相同颜色的棋子数量（包含起始位置）
 */
function countConsecutive(x, y, dx, dy, color) {
    let count = 1; // 起始位置算1个

    // 1. 向正方向统计（dx, dy）
    let i = x + dx;
    let j = y + dy;
    while (i >= 0 && i < GRID_COUNT && j >= 0 && j < GRID_COUNT && chessBoard[i][j] === color) {
        count++;
        i += dx;
        j += dy;
    }

    // 2. 向反方向统计（-dx, -dy）
    i = x - dx;
    j = y - dy;
    while (i >= 0 && i < GRID_COUNT && j >= 0 && j < GRID_COUNT && chessBoard[i][j] === color) {
        count++;
        i -= dx;
        j -= dy;
    }

    return count;
}

// ==================== 获取状态函数 ====================

/**
 * 获取当前游戏状态
 * @returns {object} - 包含当前玩家、游戏是否结束等状态信息
 */
function getGameState() {
    return {
        currentPlayer: currentPlayer,
        isGameOver: isGameOver,
        winner: winner,
        chessBoard: chessBoard
    };
}

/**
 * 获取棋盘数组的副本（用于外部读取）
 * @returns {Array} - 棋盘数组的深拷贝
 */
function getChessBoardCopy() {
    // 返回二维数组的深拷贝，防止外部修改内部数据
    return chessBoard.map(row => [...row]);
}
