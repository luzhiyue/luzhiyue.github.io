class GuessNumberGame {
  constructor() {
    this.randomNumber = this.generateRandomNumber()
    this.guessInput = document.getElementById('guessInput')
    this.guessBtn = document.getElementById('guessBtn')
    this.message = document.getElementById('message')
    this.restartBtn = document.getElementById('restartBtn')

    this.setupEventListeners()
  }

  setupEventListeners() {
    this.guessBtn.addEventListener('click', () => this.checkGuess())
    this.restartBtn.addEventListener('click', () => this.restartGame())
  }

  generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1
  }

  checkGuess() {
    const userGuess = parseInt(this.guessInput.value, 10)
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
      this.message.textContent = '请输入一个1到100之间的数字！'
      return
    }

    if (userGuess === this.randomNumber) {
      this.message.textContent = '恭喜你，猜对了！'
      this.endGame()
    } else if (userGuess < this.randomNumber) {
      this.message.textContent = '太小了，再试一次！'
    } else {
      this.message.textContent = '太大了，再试一次！'
    }
  }

  endGame() {
    this.guessBtn.disabled = true
    this.restartBtn.style.display = 'block'
  }

  restartGame() {
    this.randomNumber = this.generateRandomNumber()
    this.guessInput.value = ''
    this.message.textContent = ''
    this.guessBtn.disabled = false
    this.restartBtn.style.display = 'none'
  }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
  new GuessNumberGame()
})
