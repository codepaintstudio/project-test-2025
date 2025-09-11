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
// 详细注释：这个函数初始化整个网格的状态和布局
const initGrid = () => {
  // 重置所有搜索状态为初始值
  gridState.grid = [];
  gridState.visited = new Set(); // 清空已访问节点集合
  gridState.queue = []; // 清空BFS队列
  gridState.path = []; // 清空路径记录
  gridState.isRunning = false; // 停止搜索状态
  gridState.isCompleted = false; // 重置完成状态

  // 使用双层循环创建二维网格
  for (let i = 0; i < gridState.rows; i++) {
    const row = [];
    for (let j = 0; j < gridState.cols; j++) {
      row.push({
        // 25%的概率生成障碍物（墙）
        isWall: Math.random() < 0.25,
        // 检查当前位置是否为起点
        isStart: i === gridState.start.row && j === gridState.start.col,
        // 检查当前位置是否为终点
        isEnd: i === gridState.end.row && j === gridState.end.col,
      });
    }
    gridState.grid.push(row); // 将这一行添加到网格中
  }

  // 确保起点和终点不是墙（这很重要，否则无法搜索）
  gridState.grid[gridState.start.row][gridState.start.col].isWall = false;
  gridState.grid[gridState.end.row][gridState.end.col].isWall = false;
};

// 获取节点的字符串标识
// 详细注释：这个函数将行和列的数字组合成一个字符串
// 例如：第3行第5列的节点会被标记为 "3,5"
// 这样做的目的是为了在Set中记录已访问节点，因为Set只能存储基本类型
const getNodeKey = (row, col) => `${row},${col}`;

// 获取邻居节点
// 详细注释：这个函数获取指定节点的上下左右四个邻居节点
const getNeighbors = (row, col) => {
  const neighbors = [];
  const directions = [
    [-1, 0], // 上
    [1, 0],  // 下
    [0, -1], // 左
    [0, 1],  // 右
  ];

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    // 检查边界条件、是否为墙、是否已访问
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
// 详细注释：BFS使用队列实现，保证找到的是最短路径
const runBFS = async () => {
  if (gridState.isRunning) return;

  gridState.isRunning = true;
  // 初始化BFS队列，包含起始节点和路径
  gridState.queue = [
    {
      row: gridState.start.row,
      col: gridState.start.col,
      path: [{ row: gridState.start.row, col: gridState.start.col }],
    },
  ];

  while (gridState.queue.length > 0 && gridState.isRunning) {
    // TODO_01 (15分): 实现BFS算法的核心循环逻辑
    // 提示：
    // 1. 从队列前端取出当前节点: const current = gridState.queue.shift();
    // 2. 获取节点信息: const { row, col, path } = current;
    // 3. 检查是否已访问: if (gridState.visited.has(getNodeKey(row, col))) continue;
    // 4. 标记为已访问: gridState.visited.add(getNodeKey(row, col));
    // 5. 检查是否到达终点，如果是则保存路径并返回
    // 6. 获取邻居节点，为每个邻居创建新路径并加入队列
    
    // 请在这里实现BFS的主循环逻辑
    
    // 添加延迟以便观察搜索过程
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  gridState.isRunning = false;
};

// TODO_02 (15分): 实现重置网格功能
// 提示：
// 1. 重新调用initGrid()函数来重新初始化网格
// 2. 这个操作会清空所有搜索状态和重新生成网格
const resetGrid = () => {
  // 请在这里实现重置功能
  
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
