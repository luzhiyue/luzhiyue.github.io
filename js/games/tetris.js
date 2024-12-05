// 使用立即执行函数来避免全局变量污染
;(function () {
  // 如果已经存在实例，先清理
  if (window.tetrisInstance) {
    if (window.tetrisInstance.gameInterval) {
      clearInterval(window.tetrisInstance.gameInterval)
    }
    window.tetrisInstance = null
  }

  class Tetris {
    constructor() {
      this.canvas = document.getElementById('tetris-canvas')
      this.ctx = this.canvas.getContext('2d')
      this.nextCanvas = document.getElementById('next-piece-canvas')
      this.nextCtx = this.nextCanvas.getContext('2d')

      // 设置画布大小
      this.canvas.width = 300
      this.canvas.height = 600
      this.nextCanvas.width = 100
      this.nextCanvas.height = 100

      // 游戏配置
      this.blockSize = 30
      this.cols = 10
      this.rows = 20
      this.grid = Array(this.rows)
        .fill()
        .map(() => Array(this.cols).fill(0))

      // 游戏状态
      this.score = 0
      this.level = 1
      this.isPlaying = false
      this.isPaused = false

      // 方块形状
      this.shapes = {
        I: [[1, 1, 1, 1]],
        O: [
          [1, 1],
          [1, 1],
        ],
        T: [
          [0, 1, 0],
          [1, 1, 1],
        ],
        S: [
          [0, 1, 1],
          [1, 1, 0],
        ],
        Z: [
          [1, 1, 0],
          [0, 1, 1],
        ],
        J: [
          [1, 0, 0],
          [1, 1, 1],
        ],
        L: [
          [0, 0, 1],
          [1, 1, 1],
        ],
      }

      this.currentPiece = null
      this.nextPiece = null

      this.bindControls()
      this.bindButtons()

      // 初始绘制空游戏板
      this.draw()
    }

    // 初始化游戏
    init() {
      // 重置游戏状态
      this.grid = Array(this.rows)
        .fill()
        .map(() => Array(this.cols).fill(0))
      this.score = 0
      this.level = 1
      this.isPlaying = true
      this.isPaused = false

      // 重置方块
      this.currentPiece = null
      this.nextPiece = null

      // 生成新方块
      this.generateNewPiece()

      // 更新显示
      this.updateScore()
      document.getElementById('pause-btn').textContent = '暂停'
      document.getElementById('pause-btn').disabled = false
    }

    // 开始游戏
    start() {
      // 停止当前游戏循环（如果存在）
      if (this.gameInterval) {
        clearInterval(this.gameInterval)
      }

      // 初始化新游戏
      this.init()

      // 设置游戏循环
      this.gameInterval = setInterval(() => {
        if (!this.isPaused && this.isPlaying) {
          this.update()
          this.draw()
        }
      }, 1000 / this.level)

      document.getElementById('start-btn').textContent = '重新开始'
    }

    // 游戏结束
    gameOver() {
      this.isPlaying = false
      if (this.gameInterval) {
        clearInterval(this.gameInterval)
      }
      alert(`游戏结束！得分：${this.score}`)
      document.getElementById('start-btn').textContent = '开始游戏'
      document.getElementById('pause-btn').disabled = true
    }

    // 暂停游戏
    togglePause() {
      if (!this.isPlaying) return

      this.isPaused = !this.isPaused
      document.getElementById('pause-btn').textContent = this.isPaused ? '继续' : '暂停'
    }

    // 更新游戏状态
    update() {
      if (this.canMove(this.currentPiece.x, this.currentPiece.y + 1)) {
        this.currentPiece.y++
      } else {
        this.placePiece()
        this.checkLines()
        this.generateNewPiece()

        if (!this.canMove(this.currentPiece.x, this.currentPiece.y)) {
          this.gameOver()
        }
      }
    }

    // 绘制游戏画面
    draw() {
      // 清空画布
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      // 绘制网格
      this.drawGrid()

      // 绘制当前方块
      this.drawPiece(this.currentPiece)
    }

    // 绑定控制器
    bindControls() {
      document.addEventListener('keydown', (e) => {
        if (!this.isPlaying || this.isPaused) return

        switch (e.key) {
          case 'ArrowLeft':
            if (this.canMove(this.currentPiece.x - 1, this.currentPiece.y)) {
              this.currentPiece.x--
            }
            break
          case 'ArrowRight':
            if (this.canMove(this.currentPiece.x + 1, this.currentPiece.y)) {
              this.currentPiece.x++
            }
            break
          case 'ArrowDown':
            if (this.canMove(this.currentPiece.x, this.currentPiece.y + 1)) {
              this.currentPiece.y++
            }
            break
          case 'ArrowUp':
            this.rotatePiece()
            break
        }
        this.draw()
      })
    }

    // 绑定按钮事件
    bindButtons() {
      document.getElementById('start-btn').addEventListener('click', () => this.start())
      document.getElementById('pause-btn').addEventListener('click', () => this.togglePause())
    }

    // 更新分数显示
    updateScore() {
      document.getElementById('score').textContent = this.score
      document.getElementById('level').textContent = this.level
    }

    // 绘制网格
    drawGrid() {
      // 绘制已放置的方块
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          if (this.grid[row][col]) {
            this.drawBlock(col, row, '#3498db')
          }
        }
      }

      // 绘制网格线
      this.ctx.strokeStyle = '#333'
      this.ctx.lineWidth = 0.5

      // 垂直线
      for (let col = 0; col <= this.cols; col++) {
        this.ctx.beginPath()
        this.ctx.moveTo(col * this.blockSize, 0)
        this.ctx.lineTo(col * this.blockSize, this.canvas.height)
        this.ctx.stroke()
      }

      // 水平线
      for (let row = 0; row <= this.rows; row++) {
        this.ctx.beginPath()
        this.ctx.moveTo(0, row * this.blockSize)
        this.ctx.lineTo(this.canvas.width, row * this.blockSize)
        this.ctx.stroke()
      }
    }

    // 绘制方块
    drawBlock(x, y, color) {
      this.ctx.fillStyle = color
      this.ctx.fillRect(
        x * this.blockSize,
        y * this.blockSize,
        this.blockSize - 1,
        this.blockSize - 1
      )
    }

    // 绘制当前方块
    drawPiece(piece) {
      if (!piece) return

      piece.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell) {
            this.drawBlock(piece.x + colIndex, piece.y + rowIndex, '#e74c3c')
          }
        })
      })
    }

    // 检查是否可以移动
    canMove(newX, newY, shape = this.currentPiece.shape) {
      return shape.every((row, rowIndex) => {
        return row.every((cell, colIndex) => {
          if (!cell) return true

          const nextX = newX + colIndex
          const nextY = newY + rowIndex

          return (
            nextX >= 0 &&
            nextX < this.cols &&
            nextY >= 0 &&
            nextY < this.rows &&
            !this.grid[nextY][nextX]
          )
        })
      })
    }

    // 放置方块
    placePiece() {
      this.currentPiece.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell) {
            const x = this.currentPiece.x + colIndex
            const y = this.currentPiece.y + rowIndex
            if (y >= 0 && y < this.rows) {
              this.grid[y][x] = 1
            }
          }
        })
      })
    }

    // 检查并清除完整的行
    checkLines() {
      for (let row = this.rows - 1; row >= 0; row--) {
        if (this.grid[row].every((cell) => cell === 1)) {
          // 移除该行
          this.grid.splice(row, 1)
          // 在顶部添加新行
          this.grid.unshift(Array(this.cols).fill(0))
          // 增加分数
          this.score += 100
          this.level = Math.floor(this.score / 1000) + 1
          this.updateScore()
        }
      }
    }

    // 旋转方块
    rotatePiece() {
      const rotated = this.currentPiece.shape[0].map((_, i) =>
        this.currentPiece.shape.map((row) => row[i]).reverse()
      )

      if (this.canMove(this.currentPiece.x, this.currentPiece.y, rotated)) {
        this.currentPiece.shape = rotated
      }
    }

    // 生成新方块
    generateNewPiece() {
      this.currentPiece = this.nextPiece || {
        shape:
          this.shapes[
            Object.keys(this.shapes)[Math.floor(Math.random() * Object.keys(this.shapes).length)]
          ],
        x: Math.floor(this.cols / 2) - 1,
        y: 0,
      }

      this.nextPiece = {
        shape:
          this.shapes[
            Object.keys(this.shapes)[Math.floor(Math.random() * Object.keys(this.shapes).length)]
          ],
        x: Math.floor(this.cols / 2) - 1,
        y: 0,
      }

      // 绘制下一个方块预览
      this.drawNextPiece()
    }

    // 绘制下一个方块预览
    drawNextPiece() {
      this.nextCtx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height)

      const blockSize = 20
      const offsetX = (this.nextCanvas.width - this.nextPiece.shape[0].length * blockSize) / 2
      const offsetY = (this.nextCanvas.height - this.nextPiece.shape.length * blockSize) / 2

      this.nextPiece.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell) {
            this.nextCtx.fillStyle = '#e74c3c'
            this.nextCtx.fillRect(
              offsetX + colIndex * blockSize,
              offsetY + rowIndex * blockSize,
              blockSize - 1,
              blockSize - 1
            )
          }
        })
      })
    }
  }

  // 创建新实例并保存到window对象
  window.tetrisInstance = new Tetris()
})()
