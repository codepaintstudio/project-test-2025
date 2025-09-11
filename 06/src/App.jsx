import { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  // DFS搜索状态
  const [gridState, setGridState] = useState({
    rows: 20,
    cols: 30,
    grid: [],
    start: { row: 10, col: 5 },
    end: { row: 10, col: 25 },
    isRunning: false,
    isCompleted: false,
    visited: new Set(), // 已访问的节点
    currentPath: [], // 当前探索路径
    finalPath: [], // 最终找到的路径
    stack: [] // DFS栈
  });

  // 获取节点的字符串标识
  // 详细注释：这个函数将行和列的数字组合成一个字符串
  // 例如：第3行第5列的节点会被标记为 "3,5"
  // useCallback用于优化性能，避免函数在每次渲染时重新创建
  const getNodeKey = useCallback((row, col) => `${row},${col}`, []);

  // 初始化网格
  // 详细注释：这个函数初始化整个网格的状态和布局
  const initGrid = useCallback(() => {
    const newGrid = [];
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
          isEnd: i === gridState.end.row && j === gridState.end.col
        });
      }
      newGrid.push(row); // 将这一行添加到网格中
    }

    // 确保起点和终点不是墙（这很重要，否则无法搜索）
    newGrid[gridState.start.row][gridState.start.col].isWall = false;
    newGrid[gridState.end.row][gridState.end.col].isWall = false;

    // 使用setGridState更新整个状态对象（React的不可变状态更新模式）
    setGridState({
      rows: gridState.rows,
      cols: gridState.cols,
      grid: newGrid,
      start: gridState.start,
      end: gridState.end,
      isRunning: false, // 停止搜索状态
      isCompleted: false, // 重置完成状态
      visited: new Set(), // 清空已访问节点集合
      currentPath: [], // 清空当前路径
      finalPath: [], // 清空最终路径
      stack: [] // 清空DFS栈
    });
  }, [gridState.rows, gridState.cols, gridState.start.row, gridState.start.col, gridState.end.row, gridState.end.col]);

  // 获取邻居节点
  // 详细注释：这个函数获取指定节点的上下左右四个邻居节点
  const getNeighbors = useCallback((row, col) => {
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

      // 检查边界条件和是否为墙
      if (
        newRow >= 0 &&
        newRow < gridState.rows &&
        newCol >= 0 &&
        newCol < gridState.cols &&
        !gridState.grid[newRow][newCol].isWall
      ) {
        neighbors.push({ row: newRow, col: newCol });
      }
    }

    return neighbors;
  }, [gridState.rows, gridState.cols, gridState.grid]);

  // 处理网格点击事件
  // 详细注释：允许用户点击网格单元格来切换墙的状态
  const handleCellClick = useCallback((rowIndex, colIndex) => {
    // 如果正在运行搜索算法，不允许修改网格
    if (gridState.isRunning) return;
    
    // 创建网格的浅拷贝（React要求不可变状态更新）
    const newGrid = [...gridState.grid];
    // 切换当前单元格的墙状态
    newGrid[rowIndex][colIndex].isWall = !newGrid[rowIndex][colIndex].isWall;
    // 如果点击的是起点或终点，取消其特殊状态
    if (newGrid[rowIndex][colIndex].isStart) newGrid[rowIndex][colIndex].isStart = false;
    if (newGrid[rowIndex][colIndex].isEnd) newGrid[rowIndex][colIndex].isEnd = false;
    
    // 使用函数式更新状态，保留原有的其他属性
    setGridState(prev => ({
      ...prev,
      grid: newGrid
    }));
  }, [gridState.grid, gridState.isRunning]);

  // 执行DFS搜索
  // 详细注释：DFS使用栈实现，探索更深的路径
  const runDFS = useCallback(async () => {
    if (gridState.isRunning) return;

    // 初始化DFS栈和状态
    const initialStack = [[{ row: gridState.start.row, col: gridState.start.col }]];
    const visited = new Set();
    
    setGridState(prev => ({
      ...prev,
      isRunning: true,
      stack: initialStack,
      visited: new Set(),
      currentPath: [{ row: gridState.start.row, col: gridState.start.col }],
      finalPath: []
    }));

    while (initialStack.length > 0) {
      // 添加延迟以便观察搜索过程
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // TODO_01 (15分): 实现DFS算法的核心循环逻辑
      // 提示：
      // 1. 从栈顶取出路径: const path = initialStack.pop();
      // 2. 获取当前节点: const current = path[path.length - 1];
      // 3. 检查是否已访问: if (visited.has(getNodeKey(current.row, current.col))) continue;
      // 4. 标记为已访问并更新状态
      // 5. 检查是否到达终点，如果是则保存路径并返回
      // 6. 获取邻居节点，为每个未访问的邻居创建新路径并推入栈
      
      // 请在这里实现DFS的主循环逻辑
      
    }

    setGridState(prev => ({
      ...prev,
      isRunning: false
    }));
  }, [getNodeKey, getNeighbors, gridState.end.row, gridState.end.col, gridState.start.row, gridState.start.col]);

  // TODO_02 (15分): 实现重置网格功能
  // 提示：
  // 1. 调用initGrid()函数来重新初始化网格
  // 2. 这个操作会清空所有搜索状态和重新生成网格
  const resetGrid = useCallback(() => {
    // 请在这里实现重置功能
    
  }, [initGrid]);

  // 页面加载时初始化网格
  useEffect(() => {
    initGrid();
  }, [initGrid]);

  // 计算每个单元格的类名
  const getCellClassName = (cell, rowIndex, colIndex) => {
    const classes = ['grid-cell'];
    
    if (cell.isWall) {
      classes.push('wall');
    }
    
    if (cell.isStart) {
      classes.push('start');
    }
    
    if (cell.isEnd) {
      classes.push('end');
    }
    
    const key = getNodeKey(rowIndex, colIndex);
    
    // 已访问的节点
    if (gridState.visited.has(key) && !cell.isStart && !cell.isEnd) {
      classes.push('visited');
    }
    
    // 当前路径中的节点
    if (gridState.currentPath.some(p => p.row === rowIndex && p.col === colIndex) && !cell.isStart && !cell.isEnd) {
      classes.push('current-path');
    }
    
    // 最终路径
    if (gridState.finalPath.some(p => p.row === rowIndex && p.col === colIndex) && !cell.isStart && !cell.isEnd) {
      classes.push('final-path');
    }
    
    return classes.join(' ');
  };

  return (
    <div className="dfs-app">
      <div className="header">
        <h1>深度优先搜索(DFS)可视化</h1>
      </div>

      <div className="main-content">
        <div className="controls">
          <button 
            onClick={runDFS} 
            disabled={gridState.isRunning} 
            className="btn btn-primary"
          >
            {gridState.isRunning ? '搜索中...' : '开始搜索'}
          </button>
          <button onClick={resetGrid} className="btn btn-secondary">重新生成</button>
        </div>

        <div className="grid-container">
          {gridState.grid.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={getCellClassName(cell, rowIndex, colIndex)}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="legend">
          <div className="legend-item">
            <div className="legend-color start"></div>
            <span>起点</span>
          </div>
          <div className="legend-item">
            <div className="legend-color end"></div>
            <span>终点</span>
          </div>
          <div className="legend-item">
            <div className="legend-color wall"></div>
            <span>障碍物</span>
          </div>
          <div className="legend-item">
            <div className="legend-color visited"></div>
            <span>已访问</span>
          </div>
          <div className="legend-item">
            <div className="legend-color current-path"></div>
            <span>当前路径</span>
          </div>
          <div className="legend-item">
            <div className="legend-color final-path"></div>
            <span>最终路径</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;