// 2048游戏类
class Game2048 {
    constructor() {
        this.board = [];
        this.score = 0;
        this.bestScore = this.loadBestScore();
        this.gameOver = false;
        this.won = false;
        this.moving = false;

        this.initializeBoard();
        this.bindEvents();
        this.updateDisplay();
        this.addRandomTile();
        this.addRandomTile();
        this.updateBoard();
    }

    // 初始化4x4游戏板
    initializeBoard() {
        this.board = [];
        for (let i = 0; i < 4; i++) {
            this.board[i] = [];
            for (let j = 0; j < 4; j++) {
                this.board[i][j] = 0;
            }
        }
    }

    // 绑定事件
    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (this.gameOver || this.moving) return;

            let moved = false;
            switch (e.code) {
                case 'ArrowUp':
                case 'KeyW':
                    moved = this.move('up');
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    moved = this.move('down');
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    moved = this.move('left');
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    moved = this.move('right');
                    break;
                default:
                    return;
            }

            if (moved) {
                e.preventDefault();
                // 立即更新棋盘显示移动结果
                this.updateBoard(true);
                this.afterMove();
            }
        });

        // 按钮事件
        document.getElementById('new-game').addEventListener('click', () => {
            this.newGame();
        });

        document.getElementById('restart').addEventListener('click', () => {
            this.restart();
        });

        document.getElementById('try-again').addEventListener('click', () => {
            this.newGame();
        });
    }

    // 移动逻辑
    move(direction) {
        const prevBoard = JSON.parse(JSON.stringify(this.board));
        let moved = false;

        this.moving = true;

        switch (direction) {
            case 'left':
                moved = this.moveLeft();
                break;
            case 'right':
                moved = this.moveRight();
                break;
            case 'up':
                moved = this.moveUp();
                break;
            case 'down':
                moved = this.moveDown();
                break;
        }

        // 检查是否真的有移动
        if (!this.boardsEqual(prevBoard, this.board)) {
            moved = true;
        }

        return moved;
    }

    // 向左移动
    moveLeft() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            // TODO_01 (10分): 实现向左移动的核心逻辑
            // 提示：
            // 1. 首先过滤掉空格子(值为0的格子): const row = this.board[i].filter(val => val !== 0);
            // 2. 然后遍历行，合并相邻的相同数字
            // 3. 合并时需要将第一个数字翻倍，第二个数字设为0，并增加分数
            // 4. 最后移除所有0，并用0填充到4个位置
            // 5. 检查棋盘是否有变化，如果有变化则返回true
            
            // 请在这里实现向左移动逻辑
            
        }
        return moved;
    }

    // 向右移动
    moveRight() {
        this.reverseBoard();
        const moved = this.moveLeft();
        this.reverseBoard();
        return moved;
    }

    // 向上移动
    moveUp() {
        this.transposeBoard();
        const moved = this.moveLeft();
        this.transposeBoard();
        return moved;
    }

    // 向下移动
    moveDown() {
        this.transposeBoard();
        this.reverseBoard();
        const moved = this.moveLeft();
        this.reverseBoard();
        this.transposeBoard();
        return moved;
    }

    // 翻转棋盘（水平翻转）
    // 详细注释：这个函数将棋盘的每一行都左右翻转
    // 例如：[2, 4, 8, 0] 会变成 [0, 8, 4, 2]
    // 这样做的目的是复用moveLeft()方法来实现moveRight()
    reverseBoard() {
        for (let i = 0; i < 4; i++) {
            this.board[i].reverse(); // JavaScript数组的reverse()方法可以原地翻转数组
        }
    }

    // 转置棋盘
    // 详细注释：将棋盘行和列交换，相当于矩阵转置
    // 原始棋盘的第i行第j列元素，会变成新棋盘的第j行第i列元素
    // 这样做的目的是将竖直方向的操作转换为水平方向的操作
    transposeBoard() {
        const newBoard = []; // 创建新的二维数组
        for (let i = 0; i < 4; i++) {
            newBoard[i] = [];
            for (let j = 0; j < 4; j++) {
                newBoard[i][j] = this.board[j][i]; // 关键操作：行列交换
            }
        }
        this.board = newBoard; // 替换原棋盘
    }

    // 移动后处理
    afterMove() {
        // 立即更新分数
        this.updateDisplay();

        // 延迟添加新方块，让移动动画完成
        setTimeout(() => {
            this.addRandomTile();
            this.updateBoard(); // 这里会显示出现动画
            this.checkGameState();
            this.moving = false;
        }, 200);
    }

    // 添加随机方块
    addRandomTile() {
        // TODO_02 (5分): 实现随机添加方块的功能
        // 提示：
        // 1. 找出所有空的格子(值为0)
        // 2. 从空格子中随机选择一个
        // 3. 90%概率放置数字2，10%概率放置数字4
        // 4. 可以使用 Math.random() 和 Math.floor() 函数
        
        // 请在这里实现随机方块生成逻辑
        
    }

    // 更新游戏板显示
    updateBoard(skipAnimation = false) {
        const container = document.getElementById('tile-container');

        // 使用requestAnimationFrame确保DOM更新的流畅性
        requestAnimationFrame(() => {
            container.innerHTML = '';

            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (this.board[i][j] !== 0) {
                        const tile = document.createElement('div');
                        tile.className = `tile tile-${this.board[i][j]}`;

                        // 超过2048的方块使用特殊样式
                        if (this.board[i][j] > 2048) {
                            tile.className = 'tile tile-super';
                        }

                        // 如果跳过动画（用于移动时），移除出现动画
                        if (skipAnimation) {
                            tile.style.animation = 'none';
                        }

                        tile.textContent = this.board[i][j];
                        tile.style.left = `${j * 80}px`;
                        tile.style.top = `${i * 80}px`;

                        container.appendChild(tile);
                    }
                }
            }
        });
    }

    // 更新分数显示
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('best-score').textContent = this.bestScore;

        // 更新最高分
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore();
        }
    }

    // 检查游戏状态
    checkGameState() {
        if (this.isGameOver()) {
            this.gameOver = true;
            setTimeout(() => {
                this.showGameOver();
            }, 300);
        }
    }

    // 检查游戏是否结束
    isGameOver() {
        // TODO_03 (5分): 实现游戏结束判断逻辑
        // 提示：
        // 1. 游戏结束的条件：棋盘满了且无法再移动
        // 2. 首先检查是否还有空格子(值为0)
        // 3. 如果没有空格子，再检查相邻格子是否有相同数字可以合并
        // 4. 需要检查每个格子的右边和下面的格子
        // 5. 如果既没有空格又不能合并，则游戏结束
        
        // 请在这里实现游戏结束判断逻辑
        return false; // 临时返回false，请根据实际逻辑修改
    }

    // 比较两个棋盘是否相等
    // 详细注释：这个函数用于判断移动前后棋盘是否发生了变化
    // 如果棋盘没有变化，则不需要添加新方块，也不需要进行动画
    boardsEqual(board1, board2) {
        // 遍历棋盘的每一个位置
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                // 只要有一个位置不相等，就说明棋盘发生了变化
                if (board1[i][j] !== board2[i][j]) {
                    return false;
                }
            }
        }
        return true; // 所有位置都相等，棋盘没有变化
    }

    // 显示获胜消息
    showWinMessage() {
        const gameOverDiv = document.getElementById('game-over');
        const titleDiv = document.getElementById('game-over-title');
        const messageDiv = document.getElementById('game-over-message');

        titleDiv.textContent = '恭喜你！';
        messageDiv.textContent = '你达到了2048！继续游戏挑战更高分数吧！';
        gameOverDiv.classList.remove('hidden');

        // 3秒后自动隐藏
        setTimeout(() => {
            gameOverDiv.classList.add('hidden');
        }, 3000);
    }

    // 显示游戏结束
    showGameOver() {
        const gameOverDiv = document.getElementById('game-over');
        const titleDiv = document.getElementById('game-over-title');
        const messageDiv = document.getElementById('game-over-message');

        titleDiv.textContent = '游戏结束！';
        messageDiv.textContent = `你的分数：${this.score} 分`;
        gameOverDiv.classList.remove('hidden');
    }

    // 开始新游戏
    newGame() {
        this.board = [];
        this.score = 0;
        this.gameOver = false;
        this.won = false;
        this.moving = false;

        this.initializeBoard();
        this.addRandomTile();
        this.addRandomTile();
        this.updateBoard();
        this.updateDisplay();

        // 隐藏游戏结束界面
        document.getElementById('game-over').classList.add('hidden');
    }

    // 重新开始（保持分数）
    restart() {
        this.newGame();
    }

    // 保存最高分到本地存储
    saveBestScore() {
        localStorage.setItem('game2048-best-score', this.bestScore.toString());
    }

    // 从本地存储加载最高分
    loadBestScore() {
        const saved = localStorage.getItem('game2048-best-score');
        return saved ? parseInt(saved) : 0;
    }
}

// 页面加载完成后启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new Game2048();

    // 显示键盘提示
    setTimeout(() => {
        const hint = document.createElement('div');
        hint.className = 'key-hint';
        hint.textContent = '使用方向键或 WASD 移动方块';
        document.body.appendChild(hint);

        setTimeout(() => {
            document.body.removeChild(hint);
        }, 2000);
    }, 1000);
});

// 防止方向键滚动页面
window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
    }
});