class Game2048 {
  constructor() {
    this.size = 4
    this.gridContainer = document.querySelector('.grid-tiles')
    this.score = 0
    this.bestScore = parseInt(localStorage.getItem('2048-best')) || 0
    this.history = []

    this.init()
    this.bindEvents()
  }

  init() {
    this.grid = Array(this.size)
      .fill()
      .map(() => Array(this.size).fill(0))
    this.score = 0
    this.updateScore()
    this.clearGrid()
    this.addRandomTile()
    this.addRandomTile()
    this.history = []
    document.getElementById('undo-btn').disabled = true
  }

  clearGrid() {
    this.gridContainer.innerHTML = ''
  }

  addRandomTile() {
    const emptyCells = []
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] === 0) {
          emptyCells.push({ x: i, y: j })
        }
      }
    }

    if (emptyCells.length) {
      const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      const value = Math.random() < 0.9 ? 2 : 4
      this.grid[x][y] = value
      this.addTile(x, y, value)
    }
  }

  addTile(x, y, value, isNew = false) {
    const tile = document.createElement('div')
    tile.className = `tile tile-${value}`
    tile.textContent = value

    // 获取一个空白格子的实际尺寸
    const gridCell = document.querySelector('.grid-cell')
    const cellWidth = gridCell.offsetWidth
    const cellHeight = gridCell.offsetHeight

    // 获取网格容器的实际尺寸
    const container = document.querySelector('.grid-container')
    const gap = 15 // 格子间的间隙

    // 计算精确位置（使用空白格子的尺寸）
    const xPos = y * (cellWidth + gap)
    const yPos = x * (cellHeight + gap)

    // 设置tile的样式，使用与空白格子完全相同的尺寸
    tile.style.width = `${cellWidth}px`
    tile.style.height = `${cellHeight}px`
    tile.style.left = `${xPos}px`
    tile.style.top = `${yPos}px`

    if (isNew) {
      tile.style.transform = 'scale(0)'
      setTimeout(() => {
        tile.style.transform = 'scale(1)'
      }, 50)
    }

    this.gridContainer.appendChild(tile)
    return tile
  }

  updateGrid() {
    this.clearGrid()
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] !== 0) {
          this.addTile(i, j, this.grid[i][j])
        }
      }
    }
  }

  move(direction) {
    const previousState = {
      grid: this.grid.map((row) => [...row]),
      score: this.score,
    }

    let moved = false
    const vector = this.getVector(direction)
    const traversals = this.buildTraversals(vector)
    const mergedTiles = new Set()

    // 清除之前的合并标记
    this.gridContainer.querySelectorAll('.merged').forEach((tile) => {
      tile.classList.remove('merged')
    })

    traversals.x.forEach((x) => {
      traversals.y.forEach((y) => {
        const cell = { x, y }
        const tile = this.grid[x][y]

        if (tile) {
          const positions = this.findFarthestPosition(cell, vector)
          const next = positions.next

          if (
            this.withinBounds(next) &&
            this.grid[next.x][next.y] === tile &&
            !mergedTiles.has(`${next.x},${next.y}`)
          ) {
            // 合并
            const merged = tile * 2
            this.grid[next.x][next.y] = merged
            this.grid[x][y] = 0
            this.score += merged

            // 添加合并动画
            const mergedTile = this.addTile(next.x, next.y, merged)
            mergedTile.classList.add('merged')
            mergedTiles.add(`${next.x},${next.y}`)

            moved = true
          } else if (positions.farthest.x !== x || positions.farthest.y !== y) {
            // 移动
            this.grid[positions.farthest.x][positions.farthest.y] = tile
            this.grid[x][y] = 0
            moved = true
          }
        }
      })
    })

    if (moved) {
      this.history.push(previousState)
      setTimeout(() => {
        this.clearGrid()
        this.updateGrid()
        this.addRandomTile()
      }, 150)

      this.updateScore()
      document.getElementById('undo-btn').disabled = false

      if (this.isGameOver()) {
        setTimeout(() => {
          alert('游戏结束！')
        }, 200)
      }
    }
  }

  getVector(direction) {
    const vectors = {
      up: { x: -1, y: 0 },
      right: { x: 0, y: 1 },
      down: { x: 1, y: 0 },
      left: { x: 0, y: -1 },
    }
    return vectors[direction]
  }

  buildTraversals(vector) {
    const traversals = {
      x: Array(this.size)
        .fill()
        .map((_, i) => i),
      y: Array(this.size)
        .fill()
        .map((_, i) => i),
    }

    // 确保正确的遍历顺序
    if (vector.x === 1) traversals.x.reverse()
    if (vector.y === 1) traversals.y.reverse()

    return traversals
  }

  findFarthestPosition(cell, vector) {
    let previous
    let next = { x: cell.x, y: cell.y }

    do {
      previous = next
      next = {
        x: previous.x + vector.x,
        y: previous.y + vector.y,
      }
    } while (this.withinBounds(next) && this.grid[next.x][next.y] === 0)

    return {
      farthest: previous,
      next: next,
    }
  }

  withinBounds(position) {
    return position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size
  }

  isGameOver() {
    // 检查是否还有空格
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] === 0) return false
      }
    }

    // 检查是否还能合并
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const current = this.grid[i][j]
        const directions = ['up', 'right', 'down', 'left']

        for (let direction of directions) {
          const vector = this.getVector(direction)
          const next = {
            x: i + vector.x,
            y: j + vector.y,
          }

          if (this.withinBounds(next) && this.grid[next.x][next.y] === current) {
            return false
          }
        }
      }
    }

    return true
  }

  saveState() {
    this.history.push({
      grid: this.grid.map((row) => [...row]),
      score: this.score,
    })
  }

  undo() {
    if (this.history.length) {
      const previousState = this.history.pop()
      this.grid = previousState.grid
      this.score = previousState.score
      this.updateGrid()
      this.updateScore()
      document.getElementById('undo-btn').disabled = this.history.length === 0
    }
  }

  updateScore() {
    document.getElementById('score').textContent = this.score
    if (this.score > this.bestScore) {
      this.bestScore = this.score
      localStorage.setItem('2048-best', this.bestScore)
    }
    document.getElementById('best-score').textContent = this.bestScore
  }

  bindEvents() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          this.move('up')
          break
        case 'ArrowRight':
          this.move('right')
          break
        case 'ArrowDown':
          this.move('down')
          break
        case 'ArrowLeft':
          this.move('left')
          break
      }
    })

    document.getElementById('start-btn').addEventListener('click', () => this.init())
    document.getElementById('undo-btn').addEventListener('click', () => this.undo())
  }
}

new Game2048()
