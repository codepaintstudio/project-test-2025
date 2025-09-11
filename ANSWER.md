# 前端技能考核项目 - 标准答案与详解

> **成都锦城学院计算机与软件学院项目班前端部门 2025 年成员选拔考试**
>
> 本文档包含六道题目的标准答案、详细解析和考查点说明

---

> 1、2 题目实现效果均可，没有固定的答案；

## 第 03 题：JavaScript 应用开发（20 分）

### 考查点

- 本地存储 API 使用
- 数组操作和 DOM 操作
- 事件处理和状态管理
- JavaScript ES6+ 语法

### 题目位置

**文件路径：** `./03/script.js`

### 标准答案

#### TODO_01 (10 分)：实现本地存储功能

**位置：** `03/script.js:56-60`

```javascript
saveTasks() {
  localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
}
```

**详解：**

- 使用 `localStorage.setItem()` 存储数据
- 键名必须是 `"todoTasks"`
- 使用 `JSON.stringify()` 将数组转换为字符串
- 本地存储只能存储字符串类型数据

#### TODO_02 (5 分)：实现删除任务功能

**位置：** `03/script.js:79-83`

```javascript
deleteTask(id) {
  this.tasks = this.tasks.filter(task => task.id !== id);
  this.saveTasks();
  this.renderTasks();
}
```

**详解：**

- 使用 `filter()` 方法过滤掉指定 ID 的任务
- 过滤条件是 `task.id !== id`，保留不等于目标 ID 的任务
- 删除后调用 `saveTasks()` 保存到本地存储
- 调用 `renderTasks()` 更新界面显示

#### TODO_03 (5 分)：实现任务状态切换

**位置：** `03/script.js:88-92`

```javascript
toggleTask(id) {
  const task = this.tasks.find(task => task.id === id);
  if (task) {
    task.completed = !task.completed;
    this.saveTasks();
    this.renderTasks();
  }
}
```

**详解：**

- 使用 `find()` 方法查找指定 ID 的任务
- 使用逻辑非操作符 `!` 切换完成状态
- 需要检查任务是否存在（防止空指针错误）
- 状态改变后保存并更新界面

### 评分标准

- 函数实现的完整性和正确性
- 错误处理的考虑
- 代码的可读性和规范性

---

## 第 04 题：2048 游戏核心逻辑（20 分）

### 考查点

- 算法逻辑实现
- 数组操作和数据处理
- 游戏状态判断
- 随机数生成和概率控制

### 题目位置

**文件路径：** `./04/script.js`

### 标准答案

#### TODO_01 (10 分)：实现向左移动核心逻辑

**位置：** `04/script.js:113-126`

```javascript
moveLeft() {
  let moved = false;
  for (let i = 0; i < 4; i++) {
    // 1. 过滤掉空格子
    const row = this.board[i].filter(val => val !== 0);

    // 2. 合并相同的数字
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

    // 3. 移除0并填充到4位
    const newRow = row.filter(val => val !== 0);
    while (newRow.length < 4) {
      newRow.push(0);
    }

    // 4. 检查是否有变化
    for (let j = 0; j < 4; j++) {
      if (this.board[i][j] !== newRow[j]) {
        moved = true;
      }
      this.board[i][j] = newRow[j];
    }
  }
  return moved;
}
```

**详解：**

- **步骤 1**: 使用 `filter()` 过滤掉值为 0 的空格子
- **步骤 2**: 遍历数组合并相邻相同数字，注意处理分数和胜利条件
- **步骤 3**: 再次过滤 0 值，用 0 填充到 4 个位置
- **步骤 4**: 比较新旧数组判断是否有移动发生

#### TODO_02 (5 分)：实现随机方块生成

**位置：** `04/script.js:212-221`

```javascript
addRandomTile() {
  const emptyCells = [];

  // 找出所有空格子
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (this.board[i][j] === 0) {
        emptyCells.push({ row: i, col: j });
      }
    }
  }

  // 随机选择一个空格子
  if (emptyCells.length > 0) {
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    // 90%概率出现2，10%概率出现4
    this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
  }
}
```

**详解：**

- 双重循环找出所有值为 0 的空格子
- 使用 `Math.random()` 和 `Math.floor()` 随机选择位置
- 使用三元运算符控制生成数字的概率

#### TODO_03 (5 分)：实现游戏结束判断

**位置：** `04/script.js:288-315`

```javascript
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
```

**详解：**

- 首先检查是否还有空格子（值为 0）
- 然后检查相邻格子是否有相同数字可以合并
- 只需检查右边和下面，避免重复检查
- 两个条件都不满足才算游戏结束

### 评分标准

- 算法逻辑的正确性和完整性
- 边界条件的处理
- 游戏规则的准确实现

---

## 第 05 题：Vue 3 + BFS 算法可视化（30 分）

### 考查点

- Vue 3 Composition API 使用
- BFS 算法理解和实现
- 队列数据结构操作
- 异步编程和状态管理

### 题目位置

**文件路径：** `./05/src/App.vue`

### 标准答案

#### TODO_01 (15 分)：实现 BFS 算法核心循环

**位置：** `05/src/App.vue:90-105`

```javascript
// 在while循环内部实现
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
```

**详解：**

- **BFS 核心思想**: 使用队列实现广度优先搜索，先进先出
- **队列操作**: 使用 `shift()` 从队列前端取出，`push()` 向队列后端添加
- **访问检查**: 使用 Set 数据结构快速检查是否已访问
- **路径追踪**: 为每个节点保存从起点到当前点的完整路径
- **终点判断**: 检查当前节点是否为目标节点
- **邻居扩展**: 为每个有效邻居创建新的路径节点

#### TODO_02 (15 分)：实现重置网格功能

**位置：** `05/src/App.vue:110-115`

```javascript
const resetGrid = () => {
  initGrid();
};
```

**详解：**

- 调用已有的 `initGrid()` 函数
- 该函数会重置所有搜索状态和重新生成随机网格
- Vue 的响应式系统会自动更新 UI 显示

### 评分标准

- BFS 算法实现的正确性
- 队列操作的准确性
- 路径追踪逻辑
- Vue 响应式数据的使用

---

## 第 06 题：React 18 + DFS 算法可视化（30 分）

### 考查点

- React 18 Hooks 使用
- DFS 算法理解和实现
- 栈数据结构操作
- React 状态管理和 useCallback 优化

### 题目位置

**文件路径：** `./06/src/App.jsx`

### 标准答案

#### TODO_01 (15 分)：实现 DFS 算法核心循环

**位置：** `06/src/App.jsx:118-135`

```javascript
// 在while循环内部实现
const path = initialStack.pop();
if (!path || path.length === 0) continue;

// 当前节点是路径的最后一个节点
const current = path[path.length - 1];
const key = getNodeKey(current.row, current.col);

// 如果已经访问过，跳过
if (visited.has(key)) continue;

// 标记为已访问
visited.add(key);

// 更新状态
setGridState(prev => ({
  ...prev,
  visited: new Set(visited),
  currentPath: [...path]
}));

// 如果到达终点
if (current.row === gridState.end.row && current.col === gridState.end.col) {
  setGridState(prev => ({
    ...prev,
    finalPath: [...path],
    isCompleted: true,
    isRunning: false
  }));
  return;
}

// 获取邻居节点
const neighbors = getNeighbors(current.row, current.col);

// 将每个邻居添加到新路径中并推入栈
for (const neighbor of neighbors) {
  const neighborKey = getNodeKey(neighbor.row, neighbor.col);
  if (!visited.has(neighborKey)) {
    const newPath = [...path, { row: neighbor.row, col: neighbor.col }];
    initialStack.push(newPath);
  }
}

// 更新栈状态
setGridState(prev => ({
  ...prev,
  stack: [...initialStack]
}));
```

**详解：**

- **DFS 核心思想**: 使用栈实现深度优先搜索，后进先出
- **栈操作**: 使用 `pop()` 从栈顶取出，`push()` 向栈顶添加
- **状态管理**: 使用 React 的 `useState` 和 `setGridState` 更新状态
- **路径追踪**: 每个栈中元素都包含完整的路径信息
- **避免重复访问**: 检查 visited 集合防止无限循环
- **React 最佳实践**: 使用函数式状态更新，保持状态不可变性

#### TODO_02 (15 分)：实现重置网格功能

**位置：** `06/src/App.jsx:148-155`

```javascript
const resetGrid = useCallback(() => {
  initGrid();
}, [initGrid]);
```

**详解：**

- 调用已有的 `initGrid()` 函数
- 使用 `useCallback` 优化性能，避免不必要的重新渲染
- 依赖数组包含 `[initGrid]`，确保依赖关系正确

### 评分标准

- DFS 算法实现的正确性
- 栈操作的准确性
- React 状态管理的合理性
- useCallback 等 Hook 的正确使用

---
