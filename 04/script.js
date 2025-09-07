// 2048游戏类
class Game2048 {
    constructor() {
        this.board = [];
        this.score = 0;
        this.bestScore = this.loadBestScore();
        this.gameOver = false;
        this.won = false;
        this.moving = false; // 防止快速连续移动

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

        // 触摸事件（移动设备支持）
        this.bindTouchEvents();
    }

    // 绑定触摸事件
    bindTouchEvents() {
        const gameBoard = document.getElementById('game-board');
        let startX, startY;

        gameBoard.addEventListener('touchstart', (e) => {
            if (this.gameOver || this.moving) return;

            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            e.preventDefault();
        });

        gameBoard.addEventListener('touchend', (e) => {
            if (this.gameOver || this.moving || !startX || !startY) return;

            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            const minDistance = 30;
            let moved = false;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // 水平滑动
                if (Math.abs(deltaX) > minDistance) {
                    moved = deltaX > 0 ? this.move('right') : this.move('left');
                }
            } else {
                // 垂直滑动
                if (Math.abs(deltaY) > minDistance) {
                    moved = deltaY > 0 ? this.move('down') : this.move('up');
                }
            }

            if (moved) {
                // 立即更新棋盘显示移动结果
                this.updateBoard(true);
                this.afterMove();
            }

            startX = startY = null;
            e.preventDefault();
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
            const row = this.board[i].filter(val => val !== 0);

            // 合并相同的数字
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row[j + 1] = 0;

                    // 检查是否达到2048
                    if (row[j] === 2048 && !this.won) {
                        this.won = true;
                        setTimeout(() => {
                            this.showWinMessage();
                        }, 300);
                    }
                }
            }

            // 移除0并填充到4位
            const newRow = row.filter(val => val !== 0);
            while (newRow.length < 4) {
                newRow.push(0);
            }

            // 检查是否有变化
            for (let j = 0; j < 4; j++) {
                if (this.board[i][j] !== newRow[j]) {
                    moved = true;
                }
                this.board[i][j] = newRow[j];
            }
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
    reverseBoard() {
        for (let i = 0; i < 4; i++) {
            this.board[i].reverse();
        }
    }

    // 转置棋盘
    transposeBoard() {
        const newBoard = [];
        for (let i = 0; i < 4; i++) {
            newBoard[i] = [];
            for (let j = 0; j < 4; j++) {
                newBoard[i][j] = this.board[j][i];
            }
        }
        this.board = newBoard;
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
        const emptyCells = [];

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.board[i][j] === 0) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            // 90% 概率出现2，10% 概率出现4
            this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
        }
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
        // 检查是否还有空格
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.board[i][j] === 0) {
                    return false;
                }
            }
        }

        // 检查是否还能合并
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const current = this.board[i][j];

                // 检查右边
                if (j < 3 && current === this.board[i][j + 1]) {
                    return false;
                }

                // 检查下面
                if (i < 3 && current === this.board[i + 1][j]) {
                    return false;
                }
            }
        }

        return true;
    }

    // 比较两个棋盘是否相等
    boardsEqual(board1, board2) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board1[i][j] !== board2[i][j]) {
                    return false;
                }
            }
        }
        return true;
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