class Minesweeper {
  constructor() {
    this.grid = []
    this.minesCount = 0
    this.rows = 0
    this.cols = 0
    this.isGameOver = false
    this.timer = 0
    this.timerInterval = null

    this.difficulties = {
      beginner: { rows: 9, cols: 9, mines: 10 },
      intermediate: { rows: 16, cols: 16, mines: 40 },
      expert: { rows: 16, cols: 30, mines: 99 },
    }

    this.init()
  }

  init() {
    this.bindElements()
    this.bindEvents()
    this.startNewGame()
  }

  bindElements() {
    this.gridElement = document.getElementById('minesweeper-grid')
    this.minesCountElement = document.getElementById('mines-count')
    this.timerElement = document.getElementById('timer')
    this.startButton = document.getElementById('start-btn')
    this.difficultySelect = document.getElementById('difficulty')
  }

  bindEvents() {
    this.startButton.addEventListener('click', () => this.startNewGame())
    this.gridElement.addEventListener('click', (e) => this.handleClick(e))
    this.gridElement.addEventListener('contextmenu', (e) => this.handleRightClick(e))
  }

  startNewGame() {
    clearInterval(this.timerInterval)
    this.timer = 0
    this.timerElement.textContent = '0'
    this.isGameOver = false

    const difficulty = this.difficulties[this.difficultySelect.value]
    this.rows = difficulty.rows
    this.cols = difficulty.cols
    this.minesCount = difficulty.mines

    this.createGrid()
    this.placeMines()
    this.calculateNumbers()
    this.renderGrid()
    this.updateMinesCount()
  }

  createGrid() {
    this.grid = []
    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = []
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j] = {
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        }
      }
    }
  }

  placeMines() {
    let minesPlaced = 0
    while (minesPlaced < this.minesCount) {
      const row = Math.floor(Math.random() * this.rows)
      const col = Math.floor(Math.random() * this.cols)
      if (!this.grid[row][col].isMine) {
        this.grid[row][col].isMine = true
        minesPlaced++
      }
    }
  }

  calculateNumbers() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (!this.grid[i][j].isMine) {
          this.grid[i][j].neighborMines = this.countNeighborMines(i, j)
        }
      }
    }
  }

  countNeighborMines(row, col) {
    let count = 0
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i
        const newCol = col + j
        if (
          newRow >= 0 &&
          newRow < this.rows &&
          newCol >= 0 &&
          newCol < this.cols &&
          this.grid[newRow][newCol].isMine
        ) {
          count++
        }
      }
    }
    return count
  }

  renderGrid() {
    this.gridElement.style.gridTemplateColumns = `repeat(${this.cols}, 30px)`
    this.gridElement.innerHTML = ''

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const cell = document.createElement('div')
        cell.className = 'cell'
        cell.dataset.row = i
        cell.dataset.col = j
        this.gridElement.appendChild(cell)
        this.updateCell(cell, this.grid[i][j])
      }
    }
  }

  updateCell(cell, cellData) {
    cell.className = 'cell'
    if (cellData.isRevealed) {
      cell.classList.add('revealed')
      if (cellData.isMine) {
        cell.classList.add('mine')
        cell.textContent = '💣'
      } else if (cellData.neighborMines > 0) {
        cell.textContent = cellData.neighborMines
      }
    } else if (cellData.isFlagged) {
      cell.classList.add('flagged')
      cell.textContent = '🚩'
    } else {
      cell.textContent = ''
    }
  }

  handleClick(e) {
    if (this.isGameOver) return
    const cell = e.target
    if (!cell.classList.contains('cell')) return

    const row = parseInt(cell.dataset.row)
    const col = parseInt(cell.dataset.col)

    if (!this.timerInterval) {
      this.startTimer()
    }

    if (!this.grid[row][col].isFlagged) {
      this.revealCell(row, col)
    }
  }

  handleRightClick(e) {
    e.preventDefault()
    if (this.isGameOver) return

    const cell = e.target
    if (!cell.classList.contains('cell')) return

    const row = parseInt(cell.dataset.row)
    const col = parseInt(cell.dataset.col)

    if (!this.grid[row][col].isRevealed) {
      this.grid[row][col].isFlagged = !this.grid[row][col].isFlagged
      this.updateCell(cell, this.grid[row][col])
      this.updateMinesCount()
    }
  }

  revealCell(row, col) {
    const cell = this.grid[row][col]
    if (cell.isRevealed || cell.isFlagged) return

    cell.isRevealed = true
    const cellElement = this.gridElement.children[row * this.cols + col]
    this.updateCell(cellElement, cell)

    if (cell.isMine) {
      this.gameOver(false)
      return
    }

    if (cell.neighborMines === 0) {
      this.revealNeighbors(row, col)
    }

    if (this.checkWin()) {
      this.gameOver(true)
    }
  }

  revealNeighbors(row, col) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i
        const newCol = col + j
        if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
          this.revealCell(newRow, newCol)
        }
      }
    }
  }

  checkWin() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const cell = this.grid[i][j]
        if (!cell.isMine && !cell.isRevealed) return false
      }
    }
    return true
  }

  gameOver(isWin) {
    this.isGameOver = true
    clearInterval(this.timerInterval)

    // 显示所有地雷
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.grid[i][j].isMine) {
          this.grid[i][j].isRevealed = true
          const cellElement = this.gridElement.children[i * this.cols + j]
          this.updateCell(cellElement, this.grid[i][j])
        }
      }
    }

    setTimeout(() => {
      alert(isWin ? '恭喜你赢了！' : '游戏结束！')
    }, 100)
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timer++
      this.timerElement.textContent = this.timer
    }, 1000)
  }

  updateMinesCount() {
    let flaggedCount = 0
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.grid[i][j].isFlagged) flaggedCount++
      }
    }
    this.minesCountElement.textContent = this.minesCount - flaggedCount
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Minesweeper()
})
