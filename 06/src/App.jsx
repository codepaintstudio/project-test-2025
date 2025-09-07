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
  const getNodeKey = useCallback((row, col) => `${row},${col}`, []);

  // 初始化网格
  const initGrid = useCallback(() => {
    const newGrid = [];
    for (let i = 0; i < gridState.rows; i++) {
      const row = [];
      for (let j = 0; j < gridState.cols; j++) {
        row.push({
          isWall: Math.random() < 0.25,
          isStart: i === gridState.start.row && j === gridState.start.col,
          isEnd: i === gridState.end.row && j === gridState.end.col
        });
      }
      newGrid.push(row);
    }

    // 确保起点和终点不是墙
    newGrid[gridState.start.row][gridState.start.col].isWall = false;
    newGrid[gridState.end.row][gridState.end.col].isWall = false;

    setGridState({
      rows: gridState.rows,
      cols: gridState.cols,
      grid: newGrid,
      start: gridState.start,
      end: gridState.end,
      isRunning: false,
      isCompleted: false,
      visited: new Set(),
      currentPath: [],
      finalPath: [],
      stack: []
    });
  }, [gridState.rows, gridState.cols, gridState.start.row, gridState.start.col, gridState.end.row, gridState.end.col]);

  // 获取邻居节点
  const getNeighbors = useCallback((row, col) => {
    const neighbors = [];
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1] // 上下左右
    ];

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

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
  const handleCellClick = useCallback((rowIndex, colIndex) => {
    if (gridState.isRunning) return;
    
    const newGrid = [...gridState.grid];
    newGrid[rowIndex][colIndex].isWall = !newGrid[rowIndex][colIndex].isWall;
    if (newGrid[rowIndex][colIndex].isStart) newGrid[rowIndex][colIndex].isStart = false;
    if (newGrid[rowIndex][colIndex].isEnd) newGrid[rowIndex][colIndex].isEnd = false;
    
    // 更新网格状态
    setGridState(prev => ({
      ...prev,
      grid: newGrid
    }));
  }, [gridState.grid, gridState.isRunning]);

  // 执行DFS搜索
  const runDFS = useCallback(async () => {
    if (gridState.isRunning) return;

    // 初始化栈，放入起始节点
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
      
      // 取出栈顶路径
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
    }

    setGridState(prev => ({
      ...prev,
      isRunning: false
    }));
  }, [getNodeKey, getNeighbors, gridState.end.row, gridState.end.col, gridState.start.row, gridState.start.col]);

  // 重置网格
  const resetGrid = useCallback(() => {
    initGrid();
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