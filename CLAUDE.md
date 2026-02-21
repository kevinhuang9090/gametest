五子棋项目 - 代码规范（CLAUDE.md）
一、文件结构规范（必须严格遵循）
所有代码按以下固定结构存放，禁止随意新增 / 重命名文件，确保项目结构清晰：
text
gametest/
├── index.html       # 游戏主页面（唯一入口）
│                    # 包含页面结构、资源引入和基础布局
├── css/             # 样式文件夹
│   └── style.css    # 全局样式（棋盘、棋子、按钮、提示文字等所有视觉样式）
└── js/              # 功能逻辑文件夹
    ├── board.js     # 棋盘渲染、棋子绘制、坐标计算
    │                # 不处理游戏规则，只负责页面展示
    ├── game.js      # 游戏规则（落子合法性、胜负判断、状态管理）
    │                # 核心逻辑层，与页面渲染解耦
    └── main.js      # 入口文件（事件绑定、游戏初始化、模块调度）
二、命名规范（新手易理解，统一风格）
1. 变量 / 常量命名
变量：小驼峰命名 + 中文注释，优先用英文单词，避免拼音 / 缩写
javascript
运行
// 正确示例
let currentPlayer = "black"; // 当前落子玩家（black=黑棋，white=白棋）
let chessBoard = []; // 存储棋盘棋子的二维数组（15x15）
let isGameOver = false; // 游戏是否结束（true=结束，false=进行中）

// 错误示例（禁止使用）
let dangQianWanJia = "black"; // 禁止中文变量名
let cp = "black"; // 禁止无意义缩写
let CurrentPlayer = "black"; // 禁止大驼峰
常量：全大写 + 下划线，仅用于固定不变的值
javascript
运行
// 正确示例
const GRID_COUNT = 15; // 棋盘格子总数（15x15）
const GRID_SIZE = 40; // 单个格子的尺寸（px）
const WIN_COUNT = 5; // 获胜所需连续棋子数

// 错误示例（禁止使用）
const gridCount = 15; // 禁止小驼峰
2. 函数命名
小驼峰 + 动词开头，明确表达函数功能，避免模糊命名
javascript
运行
// 正确示例
function renderChessBoard() {} // 渲染棋盘
function placeChess(x, y) {} // 落子逻辑
function judgeWin(x, y) {} // 判断胜负
function restartGame() {} // 重新开始游戏

// 错误示例（禁止使用）
function f1() {} // 禁止无意义命名
function RenderBoard() {} // 禁止大驼峰
function 下棋子() {} // 禁止中文函数名
三、注释规范（新手必看，方便理解代码）
1. 必加注释的位置
每个 JS 文件开头：标注文件作用
核心函数：标注功能、入参、返回值（JSDoc 风格）
复杂逻辑：单行注释解释思路
2. 注释示例
javascript
运行
// board.js - 负责棋盘渲染、棋子绘制、坐标转换，不处理游戏规则
/**
 * 落子函数（核心）
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
  // 3. 检查该位置是否已有棋子
  if (chessBoard[x][y] !== null) {
    return false;
  }
  // 后续逻辑...
}
四、技术约束（避免新手踩坑）
语言限制：仅使用原生 HTML/CSS/JavaScript，禁止引入 Vue、jQuery、React 等框架；
代码拆分：单个 JS 文件代码不超过 300 行，禁止把所有逻辑写在一个文件里；
CSS 约束：所有样式写在 style.css 里，禁止在 HTML 中写行内样式（如 <div style="color:red">）；
兼容性：代码需兼容 Chrome、Edge 最新版，无需兼容 IE；
交互约束：弹窗仅用原生 alert ()，提示文字优先用页面元素展示，避免频繁弹窗。
五、格式规范（统一代码排版）
缩进：统一用 4 个空格（记事本 / VS Code 默认即可，禁止用 Tab 缩进）；
JS 语法：语句结尾必须加分号（;），花括号 {} 换行对齐；
CSS 格式：属性按 “布局→样式→交互” 排序，每个属性单独一行，示例：
css
/* 正确示例 */
#chessBoard {
    width: 600px; /* 布局 */
    height: 600px; /* 布局 */
    background: #f0e6d2; /* 样式 */
    border: 2px solid #333; /* 样式 */
    cursor: pointer; /* 交互 */
}

/* 错误示例（禁止使用） */
#chessBoard {width:600px;height:600px;background:#f0e6d2;}