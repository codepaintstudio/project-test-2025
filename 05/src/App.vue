<script setup>
import { ref, reactive } from "vue";

// BFS搜索状态
const gridState = reactive({
  rows: 20,
  cols: 30,
  grid: [],
  start: { row: 10, col: 5 },
  end: { row: 10, col: 25 },
  isRunning: false,
  isCompleted: false,
  queue: [],
  visited: new Set(),
  path: [],
});

// 初始化网格
const initGrid = () => {
  gridState.grid = [];
  gridState.visited = new Set();
  gridState.queue = [];
  gridState.path = [];
  gridState.isRunning = false;
  gridState.isCompleted = false;

  for (let i = 0; i < gridState.rows; i++) {
    const row = [];
    for (let j = 0; j < gridState.cols; j++) {
      row.push({
        isWall: Math.random() < 0.25,
        isStart: i === gridState.start.row && j === gridState.start.col,
        isEnd: i === gridState.end.row && j === gridState.end.col,
      });
    }
    gridState.grid.push(row);
  }

  // 确保起点和终点不是墙
  gridState.grid[gridState.start.row][gridState.start.col].isWall = false;
  gridState.grid[gridState.end.row][gridState.end.col].isWall = false;
};

// 获取节点的字符串标识
const getNodeKey = (row, col) => `${row},${col}`;

// 获取邻居节点
const getNeighbors = (row, col) => {
  const neighbors = [];
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1], // 上下左右
  ];

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    if (
      newRow >= 0 &&
      newRow < gridState.rows &&
      newCol >= 0 &&
      newCol < gridState.cols &&
      !gridState.grid[newRow][newCol].isWall &&
      !gridState.visited.has(getNodeKey(newRow, newCol))
    ) {
      neighbors.push({ row: newRow, col: newCol });
    }
  }

  return neighbors;
};

// 执行BFS搜索
const runBFS = async () => {
  if (gridState.isRunning) return;

  gridState.isRunning = true;
  gridState.queue = [
    {
      row: gridState.start.row,
      col: gridState.start.col,
      path: [{ row: gridState.start.row, col: gridState.start.col }],
    },
  ];

  while (gridState.queue.length > 0 && gridState.isRunning) {
    const current = gridState.queue.shift();
    const { row, col, path } = current;
    const key = getNodeKey(row, col);

    // 如果已经访问过，跳过
    if (gridState.visited.has(key)) continue;

    // 标记为已访问
    gridState.visited.add(key);

    // 如果到达终点
    if (row === gridState.end.row && col === gridState.end.col) {
      gridState.path = path;
      gridState.isCompleted = true;
      gridState.isRunning = false;
      return;
    }

    // 获取邻居节点
    const neighbors = getNeighbors(row, col);

    for (const neighbor of neighbors) {
      const newPath = [...path, { row: neighbor.row, col: neighbor.col }];
      gridState.queue.push({
        row: neighbor.row,
        col: neighbor.col,
        path: newPath,
      });
    }

    // 添加延迟以便观察搜索过程（调整为100ms）
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  gridState.isRunning = false;
};

// 重置网格
const resetGrid = () => {
  initGrid();
};

// 页面加载时初始化网格
initGrid();
</script>

<template>
  <div class="bfs-app">
    <div class="header">
      <h1>广度优先搜索(BFS)可视化</h1>
    </div>

    <div class="main-content">
      <div class="controls">
        <button
          @click="runBFS"
          :disabled="gridState.isRunning"
          class="btn btn-primary"
        >
          <span v-if="!gridState.isRunning">开始搜索</span>
          <span v-else>搜索中...</span>
        </button>
        <button @click="resetGrid" class="btn btn-secondary">重新生成</button>
      </div>

      <div class="grid-container">
        <div
          v-for="(row, rowIndex) in gridState.grid"
          :key="rowIndex"
          class="grid-row"
        >
          <div
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            :class="[
              'grid-cell',
              {
                wall: cell.isWall,
                start: cell.isStart,
                end: cell.isEnd,
                visited:
                  gridState.visited.has(getNodeKey(rowIndex, colIndex)) &&
                  !cell.isStart &&
                  !cell.isEnd,
                path:
                  gridState.path.some(
                    (p) => p.row === rowIndex && p.col === colIndex
                  ) &&
                  !cell.isStart &&
                  !cell.isEnd,
                'in-queue':
                  gridState.queue.some(
                    (q) => q.row === rowIndex && q.col === colIndex
                  ) &&
                  !cell.isStart &&
                  !cell.isEnd,
              },
            ]"
            @click="
              () => {
                if (!gridState.isRunning) {
                  cell.isWall = !cell.isWall;
                  if (cell.isStart) cell.isStart = false;
                  if (cell.isEnd) cell.isEnd = false;
                }
              }
            "
          ></div>
        </div>
      </div>

      <div class="legend">
        <div class="legend-item">
          <div class="legend-color start"></div>
          <span>起点</span>
        </div>
        <div class="legend-item">
          <div class="legend-color end"></div>
          <span>终点</span>
        </div>
        <div class="legend-item">
          <div class="legend-color wall"></div>
          <span>障碍物</span>
        </div>
        <div class="legend-item">
          <div class="legend-color visited"></div>
          <span>已访问</span>
        </div>
        <div class="legend-item">
          <div class="legend-color path"></div>
          <span>最短路径</span>
        </div>
        <div class="legend-item">
          <div class="legend-color in-queue"></div>
          <span>待探索</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bfs-app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  text-align: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.header h1 {
  color: #2c3e50;
  margin: 0;
  font-size: 24px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
  overflow: auto;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
}

.btn {
  padding: 10px 20px;
  font-size: 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-primary:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.grid-container {
  display: inline-block;
  border: 3px solid #34495e;
  border-radius: 4px;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.grid-row {
  display: flex;
}

.grid-cell {
  width: 22px;
  height: 22px;
  border: 1px solid #ddd;
  background-color: white;
  transition: all 0.3s ease;
}

.grid-cell.wall {
  background-color: #34495e;
  border-color: #2c3e50;
}

.grid-cell.start {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  border-color: #27ae60;
}

.grid-cell.end {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  border-color: #c0392b;
}

.grid-cell.visited {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  border-color: #2980b9;
  animation: visitedAnimation 0.5s ease-out;
}

.grid-cell.path {
  background: linear-gradient(135deg, #f1c40f 0%, #f39c12 100%);
  border-color: #f39c12;
  animation: pathAnimation 0.5s ease-out;
}

.grid-cell.in-queue {
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
  border-color: #8e44ad;
  animation: pulse 1.5s infinite;
}

@keyframes visitedAnimation {
  0% {
    transform: scale(0.3);
    background-color: #aec6cf;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes pathAnimation {
  0% {
    transform: scale(0.5);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(155, 89, 182, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(155, 89, 182, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(155, 89, 182, 0);
  }
}

.legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 15px 0 0;
  gap: 15px;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: 1px solid #ddd;
}

.legend-color.start {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
}

.legend-color.end {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.legend-color.wall {
  background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
}

.legend-color.visited {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
}

.legend-color.path {
  background: linear-gradient(135deg, #f1c40f 0%, #f39c12 100%);
}

.legend-color.in-queue {
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
}
/* 响应式设计 */
@media (max-width: 992px) {
  .main-content {
    flex-direction: column;
  }

  .grid-section {
    flex: 1;
  }
}
</style>
