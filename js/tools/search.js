class ToolSearch {
  constructor() {
    this.searchInput = document.getElementById('searchTools')
    this.toolCards = document.querySelectorAll('.tool-card')

    // 创建并添加清空按钮
    this.createClearButton()
    // 绑定事件
    this.bindEvents()
  }

  createClearButton() {
    // 创建一个包装容器
    const searchContainer = this.searchInput.parentElement

    // 创建清空按钮
    const clearButton = document.createElement('button')
    clearButton.className = 'search-clear-btn'
    clearButton.innerHTML = '×'
    clearButton.style.cssText = `
      position: absolute;
      right: 5%;
      top: 25%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #666;
      font-size: 20px;
      cursor: pointer;
      width: 24px;
      height: 24px;
      display: none;
      line-height: 1;
      border-radius: 50%;
      transition: background-color 0.3s, color 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
    `

    // 添加悬停效果
    clearButton.addEventListener('mouseover', () => {
      clearButton.style.backgroundColor = '#f0f0f0'
      clearButton.style.color = '#333'
    })

    clearButton.addEventListener('mouseout', () => {
      clearButton.style.backgroundColor = 'transparent'
      clearButton.style.color = '#666'
    })

    // 将清空按钮添加到搜索框容器中
    searchContainer.style.position = 'relative'
    searchContainer.appendChild(clearButton)

    // 调整搜索框的内边距，为清空按钮留出空间
    this.searchInput.style.paddingRight = '40px'

    this.clearButton = clearButton
  }

  bindEvents() {
    // 搜索输入事件
    this.searchInput.addEventListener('input', (e) => {
      this.handleSearch(e)
      this.toggleClearButton()
    })

    // 清空按钮点击事件
    this.clearButton.addEventListener('click', () => this.clearSearch())

    // ESC键清空搜索
    this.searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        this.clearSearch()
      }
    })
  }

  handleSearch(e) {
    const searchText = e.target.value.toLowerCase()

    this.toolCards.forEach((card) => {
      const title = card.querySelector('h2').textContent.toLowerCase()
      const description = card.querySelector('p').textContent.toLowerCase()

      if (title.includes(searchText) || description.includes(searchText)) {
        card.classList.remove('hidden')
      } else {
        card.classList.add('hidden')
      }
    })

    // 处理分类标题的显示/隐藏
    document.querySelectorAll('.tools-category').forEach((category) => {
      const visibleCards = category.querySelectorAll('.tool-card:not(.hidden)')
      if (visibleCards.length === 0) {
        category.style.display = 'none'
      } else {
        category.style.display = 'block'
      }
    })
  }

  toggleClearButton() {
    // 根据搜索框是否有内容来显示/隐藏清空按钮
    this.clearButton.style.display = this.searchInput.value ? 'block' : 'none'
  }

  clearSearch() {
    this.searchInput.value = ''
    this.toggleClearButton()

    // 显示所有工具卡片
    this.toolCards.forEach((card) => card.classList.remove('hidden'))

    // 显示所有分类
    document.querySelectorAll('.tools-category').forEach((category) => {
      category.style.display = 'block'
    })
  }
}

new ToolSearch()
