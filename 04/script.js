// 全局变量
let allContacts = [];
let currentPage = 1;
let pageSize = 10;

// 页面加载完成后获取通讯录数据
document.addEventListener('DOMContentLoaded', function () {
    fetchContacts();
    bindEvents();
});

// TODO_01: 获取通讯录数据
async function fetchContacts() {
    const container = document.getElementById('contacts-container');

    try {
        // 显示加载状态
        container.innerHTML = '<p class="loading">正在加载通讯录...</p>';
        // TODO_01: start

        // 注意: 获取数据之后需赋值给 allContacts 变量，后续渲染数据会用到
        // TODO_01: end

        // 渲染通讯录
        renderContacts();
        renderPagination();
    } catch (error) {
        // 处理错误
        console.error('获取通讯录数据失败:', error);
        container.innerHTML = `
            <div class="error">
                <p>加载通讯录失败: ${error.message}</p>
                <p>请检查网络连接或联系管理员。</p>
            </div>
        `;
    }
}

// 渲染通讯录表格
function renderContacts() {
    const container = document.getElementById('contacts-container');

    // TODO_02: 修复'startIndex'和'endIndex'的计算逻辑
    // TODO_02: start
    let startIndex = 1
    let endIndex = 10
    // TODO_02: end
    const contactsToShow = allContacts.slice(startIndex, endIndex);

    // 检查是否有联系人
    if (allContacts.length === 0) {
        container.innerHTML = '<p class="no-contacts">暂无联系人信息</p>';
        return;
    }

    // 创建表格
    let tableHTML = `
        <table class="contacts-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>姓名</th>
                    <th>电话</th>
                    <th>邮箱</th>
                    <th>地址</th>
                </tr>
            </thead>
            <tbody>
    `;

    // 添加联系人数据
    contactsToShow.forEach(contact => {
        tableHTML += `
            <tr>
                <td>${escapeHtml(contact.id.toString())}</td>
                <td>${escapeHtml(contact.name)}</td>
                <td>${escapeHtml(contact.phone)}</td>
                <td>${escapeHtml(contact.email)}</td>
                <td>${escapeHtml(contact.address)}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    container.innerHTML = tableHTML;
}

// 渲染分页控件
function renderPagination() {
    const totalPages = Math.ceil(allContacts.length / pageSize);

    // 确保当前页不超过总页数
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }

    // 如果没有数据，设置当前页为1
    if (totalPages === 0) {
        currentPage = 1;
    }

    // 更新页面信息
    const pageInfo = document.getElementById('page-info');
    if (allContacts.length > 0) {
        const start = (currentPage - 1) * pageSize + 1;
        const end = Math.min(currentPage * pageSize, allContacts.length);
        pageInfo.textContent = `显示第 ${start} 到 ${end} 项，共 ${allContacts.length} 项`;
    } else {
        pageInfo.textContent = '没有联系人信息';
    }

    // 更新分页按钮状态
    document.getElementById('first-page').disabled = currentPage === 1;
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages || totalPages === 0;
    document.getElementById('last-page').disabled = currentPage === totalPages || totalPages === 0;

    // 更新页码输入框的最大值
    document.getElementById('page-input').max = totalPages;
    document.getElementById('page-input').value = '';

    // 设置每页显示条数的下拉框选中值
    document.getElementById('items-per-page').value = pageSize;

    // 生成页码按钮
    const pageNumbersContainer = document.getElementById('page-numbers');
    pageNumbersContainer.innerHTML = '';

    // 计算要显示的页码范围
    let startPage, endPage;
    if (totalPages <= 5) {
        // 如果总页数小于等于5页，显示所有页码
        startPage = 1;
        endPage = totalPages;
    } else {
        // 如果总页数大于5页，显示当前页附近的页码
        if (currentPage <= 3) {
            startPage = 1;
            endPage = 5;
        } else if (currentPage + 1 >= totalPages) {
            startPage = totalPages - 4;
            endPage = totalPages;
        } else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }
    }

    // 创建页码按钮
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `page-number ${i === currentPage ? 'active' : ''}`;
        pageButton.textContent = i;
        pageButton.dataset.page = i;
        pageNumbersContainer.appendChild(pageButton);
    }
}

// 绑定事件
function bindEvents() {
    // 首页按钮
    document.getElementById('first-page').addEventListener('click', () => {
        currentPage = 1;
        renderContacts();
        renderPagination();
    });

    // 上一页按钮
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderContacts();
            renderPagination();
        }
    });

    // 下一页按钮
    document.getElementById('next-page').addEventListener('click', () => {
        const totalPages = Math.ceil(allContacts.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            renderContacts();
            renderPagination();
        }
    });

    // 末页按钮
    document.getElementById('last-page').addEventListener('click', () => {
        const totalPages = Math.ceil(allContacts.length / pageSize);
        currentPage = totalPages > 0 ? totalPages : 1;
        renderContacts();
        renderPagination();
    });

    // 页码按钮事件委托
    document.getElementById('page-numbers').addEventListener('click', (e) => {
        if (e.target.classList.contains('page-number') && !e.target.classList.contains('active')) {
            currentPage = parseInt(e.target.dataset.page);
            renderContacts();
            renderPagination();
        }
    });

    // 每页显示条数改变事件
    document.getElementById('items-per-page').addEventListener('change', (e) => {
        pageSize = parseInt(e.target.value);
        currentPage = 1; // 重置到第一页
        renderContacts();
        renderPagination();
    });

    // 页码跳转按钮
    document.getElementById('go-to-page').addEventListener('click', goToPage);

    // 页码输入框回车事件
    document.getElementById('page-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            goToPage();
        }
    });
}

// 转义HTML特殊字符以防止XSS攻击
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 跳转到指定页码
function goToPage() {
    const pageInput = document.getElementById('page-input');
    const pageNumber = parseInt(pageInput.value);
    const totalPages = Math.ceil(allContacts.length / pageSize);

    // 检查输入是否有效
    if (isNaN(pageNumber) || pageNumber < 1) {
        alert(`请输入有效的页码 (1-${totalPages})`);
        pageInput.value = '';
        return;
    }

    if (pageNumber > totalPages) {
        alert(`页码不能超过最大页数 ${totalPages}`);
        pageInput.value = '';
        return;
    }

    currentPage = pageNumber;
    renderContacts();
    renderPagination();
}