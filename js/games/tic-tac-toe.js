// 使用立即执行函数来避免全局变量污染
;(function () {
  // 如果已经存在实例，先清理
  if (window.ticTacToeInstance) {
    // 移除事件监听器
    const cells = document.querySelectorAll('.cell')
    cells.forEach((cell) => {
      cell.removeEventListener('click', window.ticTacToeInstance.handleCellClick)
    })
    document
      .getElementById('restartBtn')
      ?.removeEventListener('click', window.ticTacToeInstance.restartGame)

    window.ticTacToeInstance = null
  }

  class TicTacToe {
    constructor() {
      this.board = Array(9).fill(null)
      this.currentPlayer = 'X'
      this.isGameActive = true
      this.message = document.getElementById('message')
      this.cells = document.querySelectorAll('.cell')
      this.restartBtn = document.getElementById('restartBtn')

      this.setupEventListeners()
    }

    setupEventListeners() {
      this.cells.forEach((cell) => cell.addEventListener('click', (e) => this.handleCellClick(e)))
      this.restartBtn.addEventListener('click', () => this.restartGame())
    }

    handleCellClick(e) {
      const index = e.target.dataset.index
      if (this.board[index] || !this.isGameActive) return

      this.board[index] = this.currentPlayer
      e.target.textContent = this.currentPlayer

      if (this.checkWin()) {
        this.message.textContent = `玩家 ${this.currentPlayer} 获胜！`
        this.isGameActive = false
      } else if (this.board.every((cell) => cell)) {
        this.message.textContent = '平局！'
        this.isGameActive = false
      } else {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X'
        this.message.textContent = `轮到玩家 ${this.currentPlayer}`
      }
    }

    checkWin() {
      const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // 行
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // 列
        [0, 4, 8],
        [2, 4, 6], // 对角线
      ]

      return winPatterns.some((pattern) => {
        const [a, b, c] = pattern
        return this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]
      })
    }

    restartGame() {
      this.board.fill(null)
      this.cells.forEach((cell) => (cell.textContent = ''))
      this.currentPlayer = 'X'
      this.isGameActive = true
      this.message.textContent = `轮到玩家 ${this.currentPlayer}`
    }
  }

  // 创建新实例并保存到window对象
  window.ticTacToeInstance = new TicTacToe()
})()
