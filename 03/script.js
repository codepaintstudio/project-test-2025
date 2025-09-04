// TodoList 应用
class TodoList {
    constructor() {
        this.tasks = [];
        this.nextId = 1;
        this.init();
    }

    // 初始化应用
    init() {
        // 从localStorage加载任务
        this.loadTasks();

        // 如果没有任务，则添加初始化的四个任务
        if (this.tasks.length === 0) {
            this.addInitialTasks();
        }

        // 渲染任务列表
        this.renderTasks();

        // 绑定事件
        this.bindEvents();
    }

    // 添加初始化任务
    addInitialTasks() {
        const initialTasks = [
            { id: this.nextId++, text: "构建一个完整的Web应用", completed: false, createdAt: new Date(Date.now() - 259200000) }, // 三天前
            { id: this.nextId++, text: "学习HTML基础知识", completed: false, createdAt: new Date() },
            { id: this.nextId++, text: "掌握JavaScript编程", completed: true, createdAt: new Date(Date.now() - 172800000) }, // 前天
            { id: this.nextId++, text: "练习CSS样式设计", completed: false, createdAt: new Date(Date.now() - 86400000) }, // 昨天
        ];

        this.tasks = initialTasks;
        this.saveTasks();
    }

    // 从localStorage加载任务
    loadTasks() {
        const tasksJson = localStorage.getItem('todoTasks');
        if (tasksJson) {
            const parsed = JSON.parse(tasksJson);
            // 转换日期字符串为Date对象
            this.tasks = parsed.map(task => ({
                ...task,
                createdAt: new Date(task.createdAt)
            }));

            // 更新nextId以避免ID冲突
            const maxId = Math.max(...this.tasks.map(task => task.id), 0);
            this.nextId = maxId + 1;
        }
    }

    // TODO_01: 完成任务持久化存储，本地存储键为：“todoTasks”
    saveTasks() {
        // TODO_01: start

        // TODO_01: end
    }

    // 添加新任务
    addTask(text) {
        if (text.trim() === '') return;

        const task = {
            id: this.nextId++,
            text: text.trim(),
            completed: false,
            createdAt: new Date()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
    }

    // TODO_02: 完成删除任务
    deleteTask(id) {
        // TODO_02: start

        // TODO_02: end
        this.saveTasks();
        this.renderTasks();
    }

    // TODO_03: 完成切换任务完成状态
    toggleTask(id) {
        // TODO_03: start

        // TODO_03: end
    }

    // 编辑任务
    editTask(id, newText) {
        if (newText.trim() === '') {
            this.deleteTask(id);
            return;
        }

        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.text = newText.trim();
            this.saveTasks();
            this.renderTasks();
        }
    }

    // 搜索任务
    searchTasks(query) {
        if (!query) {
            return this.tasks;
        }

        return this.tasks.filter(task =>
            task.text.toLowerCase().includes(query.toLowerCase())
        );
    }

    // 渲染任务列表
    renderTasks(query = '') {
        const taskList = document.getElementById('taskList');
        const filteredTasks = this.searchTasks(query);

        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<p class="no-tasks">没有找到相关任务</p>';
            return;
        }

        taskList.innerHTML = filteredTasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-content ${task.completed ? 'completed' : ''}">
                    ${this.escapeHtml(task.text)}
                </div>
                <div class="task-actions">
                    <button class="toggle-btn">${task.completed ? '撤销' : '完成'}</button>
                    <button class="edit-btn">编辑</button>
                    <button class="delete-btn">删除</button>
                </div>
            </li>
        `).join('');
    }

    // 转义HTML特殊字符以防止XSS攻击
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 绑定事件
    bindEvents() {
        // 添加任务事件
        const taskInput = document.getElementById('taskInput');
        const addTaskBtn = document.getElementById('addTaskBtn');

        addTaskBtn.addEventListener('click', () => {
            this.addTask(taskInput.value);
            taskInput.value = '';
            taskInput.focus();
        });

        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask(taskInput.value);
                taskInput.value = '';
            }
        });

        // 搜索事件
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.renderTasks(e.target.value);
        });


        // 任务列表事件委托
        const taskList = document.getElementById('taskList');
        taskList.addEventListener('click', (e) => {
            const taskItem = e.target.closest('.task-item');
            if (!taskItem) return;

            const taskId = parseInt(taskItem.dataset.id);

            // 完成/撤销任务
            if (e.target.classList.contains('toggle-btn')) {
                this.toggleTask(taskId);
            }

            // 删除任务
            if (e.target.classList.contains('delete-btn')) {
                this.deleteTask(taskId);
            }

            // 编辑任务
            if (e.target.classList.contains('edit-btn')) {
                const task = this.tasks.find(t => t.id === taskId);
                if (!task) return;

                const contentElement = taskItem.querySelector('.task-content');
                const originalText = task.text;

                contentElement.innerHTML = `
                    <input type="text" class="edit-input" value="${this.escapeHtml(task.text)}">
                `;

                const editInput = contentElement.querySelector('.edit-input');
                editInput.focus();

                const saveEdit = () => {
                    this.editTask(taskId, editInput.value);
                };

                editInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        saveEdit();
                    }
                });

                editInput.addEventListener('blur', saveEdit);
            }
        });
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoList();
});