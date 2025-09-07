// 直播间弹幕系统 - 性能优化完整版
class DanmakuSystem {
    constructor() {
        // 核心配置
        this.container = document.getElementById('danmaku-container');
        this.isRunning = false;
        this.danmakuSpeed = 3; // 较慢的速度
        this.sendRate = 60; // 每秒60条弹幕（挑战模式）
        this.maxCount = 500; // 最大显示数量（高挑战）
        
        // 性能优化相关
        this.danmakuPool = []; // 对象池
        this.activeDanmakus = new Set(); // 活跃弹幕集合
        this.lanes = []; // 弹道系统
        this.laneCount = 20; // 弹道数量
        this.recycledElements = []; // DOM元素回收池
        
        // 性能监控
        this.performanceMonitor = {
            fps: 60,
            danmakuCount: 0,
            memoryUsage: 0,
            danmakuRate: 0,
            lastFrameTime: performance.now(),
            frameCount: 0,
            rateCounter: 0,
            lastRateTime: Date.now()
        };
        
        // 弹幕数据
        this.sampleMessages = [
            '666666', '主播牛逼！', '刷火箭🚀', '哈哈哈哈', '太厉害了',
            '第一！', '沙发！', '前排围观', '老铁没毛病', '双击666',
            '关注走一波', '点赞！！！', '这就是神仙操作', '我的天哪',
            '绝了绝了', '这波不亏', '秀啊', '6到飞起', 'amazing',
            '牛啤plus', '真的强', '服气服气', '教学局', '学会了学会了',
            '主播V50', '上热门啦', '火钳刘明', '前方高能', '我裂开了'
        ];
        
        this.userNames = [
            '小可爱', '大佬', '萌新', '老司机', '路人甲', '吃瓜群众',
            '神秘人', '潜水员', '观众', '粉丝', '铁粉', '路过的',
            '匿名用户', '游客', '新人', '老粉', 'VIP用户', '土豪'
        ];
        
        this.init();
    }
    
    init() {
        this.initLanes();
        this.bindEvents();
        this.startPerformanceMonitoring();
        this.preloadDanmakuPool();
        this.showNotification('弹幕系统初始化完成！', 2000);
    }
    
    // 初始化弹道系统
    initLanes() {
        const containerHeight = window.innerHeight;
        const laneHeight = Math.floor(containerHeight / this.laneCount);
        
        this.lanes = Array.from({ length: this.laneCount }, (_, index) => ({
            id: index,
            y: index * laneHeight + 50, // 留出顶部空间
            occupied: false,
            lastDanmakuTime: 0
        }));
    }
    
    // 预加载弹幕池
    preloadDanmakuPool() {
        const poolSize = 500; // 预创建500个弹幕对象
        
        for (let i = 0; i < poolSize; i++) {
            const danmaku = {
                id: `pool_${i}`,
                element: null,
                content: '',
                lane: null,
                startTime: 0,
                duration: 0,
                isActive: false,
                type: 'normal'
            };
            
            this.danmakuPool.push(danmaku);
        }
        
        console.log(`弹幕池初始化完成，预创建 ${poolSize} 个对象`);
    }
    
    // 从池中获取弹幕对象
    getDanmakuFromPool() {
        // 优先使用池中的对象
        let danmaku = this.danmakuPool.find(item => !item.isActive);
        
        if (!danmaku) {
            // 池中没有可用对象，创建新的
            danmaku = {
                id: `dynamic_${Date.now()}_${Math.random()}`,
                element: null,
                content: '',
                lane: null,
                startTime: 0,
                duration: 0,
                isActive: false,
                type: 'normal'
            };
            this.danmakuPool.push(danmaku);
        }
        
        danmaku.isActive = true;
        return danmaku;
    }
    
    // 回收弹幕对象到池中
    recycleDanmaku(danmaku) {
        if (danmaku.element) {
            // 重置DOM元素
            danmaku.element.style.animation = 'none';
            danmaku.element.classList.add('pooled');
            danmaku.element.classList.remove('active');
            
            // 移除元素或放入回收池
            if (this.recycledElements.length < 100) {
                this.recycledElements.push(danmaku.element);
            } else {
                danmaku.element.remove();
            }
            
            danmaku.element = null;
        }
        
        // 释放弹道
        if (danmaku.lane) {
            danmaku.lane.occupied = false;
            danmaku.lane = null;
        }
        
        // 重置对象状态
        danmaku.content = '';
        danmaku.startTime = 0;
        danmaku.duration = 0;
        danmaku.isActive = false;
        danmaku.type = 'normal';
        
        // 从活跃集合中移除
        this.activeDanmakus.delete(danmaku);
    }
    
    // 获取可用弹道
    getAvailableLane() {
        const currentTime = performance.now();
        
        // 寻找未被占用的弹道
        for (let lane of this.lanes) {
            if (!lane.occupied || (currentTime - lane.lastDanmakuTime > 2000)) {
                return lane;
            }
        }
        
        // 所有弹道都被占用，返回最早使用的弹道
        return this.lanes.reduce((earliest, current) => 
            current.lastDanmakuTime < earliest.lastDanmakuTime ? current : earliest
        );
    }
    
    // 创建弹幕DOM元素
    createDanmakuElement(content, type = 'normal') {
        let element;
        
        // 优先使用回收池中的元素
        if (this.recycledElements.length > 0) {
            element = this.recycledElements.pop();
            element.className = ''; // 重置类名
            element.style.cssText = ''; // 重置所有样式
        } else {
            element = document.createElement('div');
        }
        
        element.className = `danmaku-item danmaku-${type} active`;
        element.textContent = content;
        element.style.willChange = 'transform';
        element.style.backfaceVisibility = 'hidden';
        element.style.transform = 'translateZ(0)';
        
        return element;
    }
    
    // 发送弹幕
    sendDanmaku(content, type = 'normal', userName = null) {
        if (this.activeDanmakus.size >= this.maxCount) {
            // 达到最大数量限制，移除最早的弹幕
            const oldestDanmaku = Array.from(this.activeDanmakus)[0];
            this.removeDanmaku(oldestDanmaku);
        }
        
        const danmaku = this.getDanmakuFromPool();
        const lane = this.getAvailableLane();
        
        if (!lane) return; // 没有可用弹道
        
        // 设置弹幕属性
        danmaku.content = userName ? `${userName}: ${content}` : content;
        danmaku.lane = lane;
        danmaku.type = type;
        danmaku.startTime = performance.now();
        
        // 创建DOM元素
        danmaku.element = this.createDanmakuElement(danmaku.content, type);
        
        // 设置位置和动画
        danmaku.element.style.top = `${lane.y}px`;
        danmaku.element.style.left = '100vw';
        
        // 计算动画持续时间（基于弹幕速度）
        const baseSpeed = 8; // 基础速度（秒）
        danmaku.duration = (baseSpeed - this.danmakuSpeed + 1) * 1000;
        danmaku.element.style.animationDuration = `${danmaku.duration}ms`;
        
        // 添加到DOM
        this.container.appendChild(danmaku.element);
        
        // 占用弹道
        lane.occupied = true;
        lane.lastDanmakuTime = danmaku.startTime;
        
        // 添加到活跃集合
        this.activeDanmakus.add(danmaku);
        
        // 设置移除定时器
        setTimeout(() => {
            this.removeDanmaku(danmaku);
        }, danmaku.duration + 500); // 多给500ms缓冲时间
        
        // 更新性能计数
        this.performanceMonitor.rateCounter++;
        
        return danmaku;
    }
    
    // 移除弹幕
    removeDanmaku(danmaku) {
        if (!danmaku || !danmaku.isActive) return;
        
        this.recycleDanmaku(danmaku);
    }
    
    // 清空所有弹幕
    clearAllDanmakus() {
        // 批量处理以提高性能
        const danmakuArray = Array.from(this.activeDanmakus);
        
        // 使用requestAnimationFrame确保在渲染帧中执行
        const batchSize = 50;
        let index = 0;
        
        const processBatch = () => {
            const endIndex = Math.min(index + batchSize, danmakuArray.length);
            
            for (let i = index; i < endIndex; i++) {
                this.removeDanmaku(danmakuArray[i]);
            }
            
            index = endIndex;
            
            if (index < danmakuArray.length) {
                requestAnimationFrame(processBatch);
            }
        };
        
        requestAnimationFrame(processBatch);
    }
    
    // 生成随机弹幕
    generateRandomDanmaku() {
        const message = this.sampleMessages[Math.floor(Math.random() * this.sampleMessages.length)];
        const userName = Math.random() < 0.7 ? this.userNames[Math.floor(Math.random() * this.userNames.length)] : null;
        
        // 随机弹幕类型
        let type = 'normal';
        const rand = Math.random();
        if (rand < 0.1) type = 'vip';
        else if (rand < 0.15) type = 'super';
        else if (rand < 0.18) type = 'gift';
        
        return { message, userName, type };
    }
    
    // 开始弹幕风暴
    startDanmakuStorm() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.stormInterval = setInterval(() => {
            if (!this.isRunning) return;
            
            // 批量发送弹幕以模拟高频场景
            const batchCount = Math.floor(this.sendRate / 10); // 每100ms发送的数量
            
            for (let i = 0; i < batchCount; i++) {
                const { message, userName, type } = this.generateRandomDanmaku();
                
                // 使用微任务确保不阻塞UI
                Promise.resolve().then(() => {
                    this.sendDanmaku(message, type, userName);
                });
            }
        }, 100); // 每100ms执行一次
        
        this.showNotification('弹幕风暴已开始！', 2000);
    }
    
    // 停止弹幕风暴
    stopDanmakuStorm() {
        this.isRunning = false;
        
        if (this.stormInterval) {
            clearInterval(this.stormInterval);
            this.stormInterval = null;
        }
        
        this.showNotification('弹幕风暴已停止', 2000);
    }
    
    // 性能监控
    startPerformanceMonitoring() {
        let lastTime = performance.now();
        let frames = 0;
        
        const updatePerformance = () => {
            const now = performance.now();
            frames++;
            
            // 每秒更新一次性能数据
            if (now - lastTime >= 1000) {
                const fps = Math.round(frames * 1000 / (now - lastTime));
                this.performanceMonitor.fps = fps;
                this.performanceMonitor.danmakuCount = this.activeDanmakus.size;
                
                // 更新弹幕发送率
                this.performanceMonitor.danmakuRate = this.performanceMonitor.rateCounter;
                this.performanceMonitor.rateCounter = 0;
                
                // 估算内存使用（简化计算）
                const estimatedMemory = (this.danmakuPool.length * 0.001 + this.activeDanmakus.size * 0.002).toFixed(2);
                this.performanceMonitor.memoryUsage = estimatedMemory;
                
                this.updatePerformanceDisplay();
                
                frames = 0;
                lastTime = now;
            }
            
            requestAnimationFrame(updatePerformance);
        };
        
        requestAnimationFrame(updatePerformance);
    }
    
    // 更新性能显示
    updatePerformanceDisplay() {
        const fpsElement = document.getElementById('fps-counter');
        const countElement = document.getElementById('danmaku-count');
        const memoryElement = document.getElementById('memory-usage');
        const rateElement = document.getElementById('danmaku-rate');
        const laneElement = document.getElementById('lane-usage');
        const poolElement = document.getElementById('pool-size');
        
        if (fpsElement) {
            fpsElement.textContent = this.performanceMonitor.fps;
            fpsElement.style.color = this.performanceMonitor.fps >= 50 ? '#4ecdc4' : 
                                   this.performanceMonitor.fps >= 30 ? '#f39c12' : '#e74c3c';
        }
        
        if (countElement) {
            countElement.textContent = this.performanceMonitor.danmakuCount;
            countElement.style.color = this.performanceMonitor.danmakuCount < this.maxCount * 0.8 ? '#4ecdc4' : '#f39c12';
        }
        
        if (memoryElement) {
            memoryElement.textContent = `${this.performanceMonitor.memoryUsage} MB`;
        }
        
        if (rateElement) {
            rateElement.textContent = this.performanceMonitor.danmakuRate;
        }
        
        if (laneElement) {
            const occupiedLanes = this.lanes.filter(lane => lane.occupied).length;
            const usagePercent = Math.round((occupiedLanes / this.laneCount) * 100);
            laneElement.textContent = `${usagePercent}%`;
            laneElement.style.color = usagePercent < 70 ? '#4ecdc4' : usagePercent < 90 ? '#f39c12' : '#e74c3c';
        }
        
        if (poolElement) {
            const activeCount = this.danmakuPool.filter(item => item.isActive).length;
            poolElement.textContent = `${activeCount}/${this.danmakuPool.length}`;
        }
    }
    
    // 绑定事件
    bindEvents() {
        // 窗口大小改变时重新初始化弹道
        window.addEventListener('resize', () => {
            this.initLanes();
        });
    }
    
    
    // 显示通知
    showNotification(message, duration = 3000) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.remove('hidden');
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, duration);
    }
    
    // 获取性能统计
    getPerformanceStats() {
        return {
            fps: this.performanceMonitor.fps,
            activeDanmakus: this.activeDanmakus.size,
            poolSize: this.danmakuPool.length,
            recycledElements: this.recycledElements.length,
            memoryEstimate: this.performanceMonitor.memoryUsage,
            isRunning: this.isRunning
        };
    }
}

// 初始化系统
let danmakuSystem;

document.addEventListener('DOMContentLoaded', () => {
    danmakuSystem = new DanmakuSystem();
    
    // 添加一些初始弹幕
    setTimeout(() => {
        danmakuSystem.sendDanmaku('🎯 性能优化挑战开始！', 'super', '系统');
        danmakuSystem.sendDanmaku('目标：保持60FPS流畅运行', 'vip', '系统');
        danmakuSystem.sendDanmaku('准备好接受挑战了吗？', 'gift', '系统');
    }, 1000);
    
    // 3秒后自动开始弹幕风暴
    setTimeout(() => {
        danmakuSystem.startDanmakuStorm();
        danmakuSystem.showNotification('🌪️ 高频弹幕挑战已自动开始！', 3000);
    }, 3000);
    
    // 模拟观众数量变化
    setInterval(() => {
        const viewerElement = document.getElementById('viewer-count');
        if (viewerElement) {
            const currentCount = parseInt(viewerElement.textContent.replace(',', ''));
            const variation = Math.floor(Math.random() * 500 - 250); // 更大的波动
            const newCount = Math.max(8000, currentCount + variation);
            viewerElement.textContent = newCount.toLocaleString();
        }
    }, 3000); // 更频繁的更新
});

// 暴露全局接口供调试使用
window.danmakuSystem = danmakuSystem;