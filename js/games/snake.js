class Snake {
  constructor() {
    this.canvas = document.getElementById('snake-canvas')
    this.ctx = this.canvas.getContext('2d')

    // 设置画布大小
    this.canvas.width = 400
    this.canvas.height = 400

    // 游戏配置
    this.gridSize = 20
    this.cols = this.canvas.width / this.gridSize
    this.rows = this.canvas.height / this.gridSize

    // 游戏状态
    this.score = 0
    this.highScore = localStorage.getItem('snakeHighScore') || 0
    this.isPlaying = false
    this.isPaused = false

    // 蛇的初始状态
    this.snake = []
    this.direction = 'right'
    this.nextDirection = 'right'

    // 食物位置
    this.food = null

    this.bindControls()
    this.bindButtons()
    this.updateScore()

    // 初始绘制
    this.draw()
  }

  init() {
    // 初始化蛇的位置
    this.snake = [
      { x: 3, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
    ]

    // 重置游戏状态
    this.score = 0
    this.direction = 'right'
    this.nextDirection = 'right'
    this.isPlaying = true
    this.isPaused = false

    // 生成第一个食物
    this.generateFood()

    // 更新显示
    this.updateScore()
    document.getElementById('pause-btn').textContent = '暂停'
    document.getElementById('pause-btn').disabled = false
  }

  generateFood() {
    do {
      this.food = {
        x: Math.floor(Math.random() * this.cols),
        y: Math.floor(Math.random() * this.rows),
      }
    } while (this.snake.some((segment) => segment.x === this.food.x && segment.y === this.food.y))
  }

  update() {
    if (!this.isPlaying || this.isPaused) return

    // 更新方向
    this.direction = this.nextDirection

    // 计算新的头部位置
    const head = { ...this.snake[0] }
    switch (this.direction) {
      case 'up':
        head.y--
        break
      case 'down':
        head.y++
        break
      case 'left':
        head.x--
        break
      case 'right':
        head.x++
        break
    }

    // 检查碰撞
    if (this.checkCollision(head)) {
      this.gameOver()
      return
    }

    // 移动蛇
    this.snake.unshift(head)

    // 检查是否吃到食物
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10
      this.updateScore()
      this.generateFood()
    } else {
      this.snake.pop()
    }
  }

  checkCollision(head) {
    // 检查墙壁碰撞
    if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows) {
      return true
    }

    // 检查自身碰撞
    return this.snake.some((segment) => segment.x === head.x && segment.y === head.y)
  }

  draw() {
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // 绘制网格
    this.ctx.strokeStyle = '#ddd'
    for (let i = 0; i <= this.cols; i++) {
      this.ctx.beginPath()
      this.ctx.moveTo(i * this.gridSize, 0)
      this.ctx.lineTo(i * this.gridSize, this.canvas.height)
      this.ctx.stroke()
    }
    for (let i = 0; i <= this.rows; i++) {
      this.ctx.beginPath()
      this.ctx.moveTo(0, i * this.gridSize)
      this.ctx.lineTo(this.canvas.width, i * this.gridSize)
      this.ctx.stroke()
    }

    // 绘制蛇
    this.snake.forEach((segment, index) => {
      this.ctx.fillStyle = index === 0 ? '#27AE60' : '#2ECC71'
      this.ctx.fillRect(
        segment.x * this.gridSize,
        segment.y * this.gridSize,
        this.gridSize - 1,
        this.gridSize - 1
      )
    })

    // 绘制食物
    if (this.food) {
      this.ctx.fillStyle = '#E74C3C'
      this.ctx.beginPath()
      this.ctx.arc(
        this.food.x * this.gridSize + this.gridSize / 2,
        this.food.y * this.gridSize + this.gridSize / 2,
        this.gridSize / 2 - 1,
        0,
        Math.PI * 2
      )
      this.ctx.fill()
    }
  }

  start() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval)
    }

    this.init()

    this.gameInterval = setInterval(() => {
      this.update()
      this.draw()
    }, 150)

    document.getElementById('start-btn').textContent = '重新开始'
  }

  togglePause() {
    if (!this.isPlaying) return

    this.isPaused = !this.isPaused
    document.getElementById('pause-btn').textContent = this.isPaused ? '继续' : '暂停'
  }

  gameOver() {
    this.isPlaying = false
    if (this.gameInterval) {
      clearInterval(this.gameInterval)
    }

    if (this.score > this.highScore) {
      this.highScore = this.score
      localStorage.setItem('snakeHighScore', this.highScore)
      this.updateScore()
    }

    alert(`游戏结束！得分：${this.score}`)
    document.getElementById('start-btn').textContent = '开始游戏'
    document.getElementById('pause-btn').disabled = true
  }

  updateScore() {
    document.getElementById('score').textContent = this.score
    document.getElementById('high-score').textContent = this.highScore
  }

  bindControls() {
    document.addEventListener('keydown', (e) => {
      if (!this.isPlaying || this.isPaused) return

      switch (e.key) {
        case 'ArrowUp':
          if (this.direction !== 'down') this.nextDirection = 'up'
          break
        case 'ArrowDown':
          if (this.direction !== 'up') this.nextDirection = 'down'
          break
        case 'ArrowLeft':
          if (this.direction !== 'right') this.nextDirection = 'left'
          break
        case 'ArrowRight':
          if (this.direction !== 'left') this.nextDirection = 'right'
          break
      }
    })
  }

  bindButtons() {
    document.getElementById('start-btn').addEventListener('click', () => this.start())
    document.getElementById('pause-btn').addEventListener('click', () => this.togglePause())
  }
}

// 初始化游戏
window.addEventListener('load', () => {
  const game = new Snake()
})
