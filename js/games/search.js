;(function () {
  // 如果已经存在实例，先销毁
  if (window.gameSearchInstance) {
    const oldInstance = window.gameSearchInstance
    // 清理事件监听器
    oldInstance.searchInput?.removeEventListener('input', oldInstance.handleSearch)
    oldInstance.searchInput?.removeEventListener('keyup', oldInstance.handleEscKey)
    oldInstance.clearButton?.removeEventListener('click', oldInstance.clearSearch)
    window.gameSearchInstance = null
  }

  class GameSearch {
    constructor() {
      this.searchInput = document.getElementById('game-search')
      this.gameCards = document.querySelectorAll('.game-card')

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
        right: 35px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #666;
        font-size: 18px;
        cursor: pointer;
        width: 20px;
        height: 20px;
        display: none;
        line-height: 1;
        border-radius: 50%;
        transition: background-color 0.3s, color 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0;
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
      this.searchInput.style.paddingRight = '45px'

      this.clearButton = clearButton
    }

    bindEvents() {
      // 搜索输入事件
      this.handleSearch = this.handleSearch.bind(this)
      this.searchInput.addEventListener('input', (e) => {
        this.handleSearch(e)
        this.toggleClearButton()
      })

      // 清空按钮点击事件
      this.clearSearch = this.clearSearch.bind(this)
      this.clearButton.addEventListener('click', () => this.clearSearch())

      // ESC键清空搜索
      this.handleEscKey = (e) => {
        if (e.key === 'Escape') {
          this.clearSearch()
        }
      }
      this.searchInput.addEventListener('keyup', this.handleEscKey)
    }

    handleSearch(e) {
      const searchTerm = e.target.value.toLowerCase().trim()

      this.gameCards.forEach((card) => {
        const gameName = card.getAttribute('data-game-name').toLowerCase()
        const gameDescription = card.querySelector('p').textContent.toLowerCase()

        if (gameName.includes(searchTerm) || gameDescription.includes(searchTerm)) {
          card.classList.remove('hidden')
        } else {
          card.classList.add('hidden')
        }
      })
    }

    toggleClearButton() {
      // 根据搜索框是否有内容来显示/隐藏清空按钮
      this.clearButton.style.display = this.searchInput.value ? 'flex' : 'none'
    }

    clearSearch() {
      this.searchInput.value = ''
      this.toggleClearButton()

      // 显示所有游戏卡片
      this.gameCards.forEach((card) => card.classList.remove('hidden'))
    }
  }

  // 创建新实例并保存到window对象
  window.gameSearchInstance = new GameSearch()
})()
