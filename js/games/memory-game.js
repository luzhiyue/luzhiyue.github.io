class MemoryGame {
  constructor() {
    this.cardGrid = document.querySelector('.card-grid')
    this.scoreDisplay = document.getElementById('score')
    this.startBtn = document.getElementById('start-btn')
    this.levelSelect = document.getElementById('level-select')
    this.cards = []
    this.flippedCards = []
    this.matchedPairs = 0
    this.score = 0
    this.images = [
      'image1.svg',
      'image2.svg',
      'image3.svg',
      'image4.svg',
      'image5.svg',
      'image6.svg',
      'image7.svg',
      'image8.svg',
    ]

    this.setupEventListeners()
  }

  setupEventListeners() {
    this.startBtn.addEventListener('click', () => this.startGame())
  }

  startGame() {
    this.score = 0
    this.matchedPairs = 0
    this.updateScore()
    this.generateCards()
    this.renderCards()
  }

  generateCards() {
    const level = this.levelSelect.value
    let numPairs
    switch (level) {
      case 'easy':
        numPairs = 4
        break
      case 'medium':
        numPairs = 6
        break
      case 'hard':
        numPairs = 8
        break
    }

    const selectedImages = this.images.slice(0, numPairs)
    this.cards = [...selectedImages, ...selectedImages].sort(() => Math.random() - 0.5)
  }

  renderCards() {
    this.cardGrid.innerHTML = ''
    const gridSize = Math.ceil(Math.sqrt(this.cards.length))
    this.cardGrid.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`
    this.cards.forEach((image, index) => {
      const card = document.createElement('div')
      card.classList.add('card')
      card.dataset.image = image
      card.innerHTML = `
                <div class="front"></div>
                <div class="back"><img src="../images/games/memory/${image}" alt="Memory Image"></div>
            `
      card.addEventListener('click', () => this.flipCard(card))
      this.cardGrid.appendChild(card)
    })
  }

  flipCard(card) {
    if (this.flippedCards.length < 2 && !card.classList.contains('flipped')) {
      card.classList.add('flipped')
      this.flippedCards.push(card)

      if (this.flippedCards.length === 2) {
        this.checkForMatch()
      }
    }
  }

  checkForMatch() {
    const [card1, card2] = this.flippedCards
    if (card1.dataset.image === card2.dataset.image) {
      this.matchedPairs++
      this.score += 10
      this.flippedCards = []
      if (this.matchedPairs === this.cards.length / 2) {
        setTimeout(() => alert('恭喜你，完成了游戏！'), 500)
      }
    } else {
      setTimeout(() => {
        card1.classList.remove('flipped')
        card2.classList.remove('flipped')
        this.flippedCards = []
      }, 1000)
    }
    this.updateScore()
  }

  updateScore() {
    this.scoreDisplay.textContent = this.score
  }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
  new MemoryGame()
})
