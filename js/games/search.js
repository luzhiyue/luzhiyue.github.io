document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('game-search')
  const gameCards = document.querySelectorAll('.game-card')

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim()

    gameCards.forEach((card) => {
      const gameName = card.getAttribute('data-game-name').toLowerCase()
      const gameDescription = card.querySelector('p').textContent.toLowerCase()

      if (gameName.includes(searchTerm) || gameDescription.includes(searchTerm)) {
        card.classList.remove('hidden')
      } else {
        card.classList.add('hidden')
      }
    })
  })

  // 添加搜索框清空按钮功能
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = ''
      gameCards.forEach((card) => card.classList.remove('hidden'))
    }
  })

  // 添加搜索框聚焦时的提示
  searchInput.addEventListener('focus', () => {
    if (searchInput.value === '') {
      searchInput.placeholder = '输入游戏名称或描述...'
    }
  })

  // 失去焦点时恢复原始提示
  searchInput.addEventListener('blur', () => {
    searchInput.placeholder = '搜索游戏...'
  })
})
