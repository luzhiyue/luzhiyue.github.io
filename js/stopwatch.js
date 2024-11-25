class Stopwatch {
  constructor() {
    this.display = document.querySelector('.time')
    this.millisecondsDisplay = document.querySelector('.milliseconds')
    this.startStopBtn = document.getElementById('startStop')
    this.resetBtn = document.getElementById('reset')
    this.lapBtn = document.getElementById('lap')
    this.lapsList = document.querySelector('.laps-list')

    this.startTime = 0
    this.elapsedTime = 0
    this.running = false
    this.intervalId = null
    this.lapCount = 0
    this.lastLapTime = 0

    this.setupEventListeners()
  }

  setupEventListeners() {
    this.startStopBtn.addEventListener('click', () => this.toggleStartStop())
    this.resetBtn.addEventListener('click', () => this.reset())
    this.lapBtn.addEventListener('click', () => this.lap())
  }

  toggleStartStop() {
    if (!this.running) {
      this.start()
    } else {
      this.stop()
    }
  }

  start() {
    if (!this.running) {
      this.running = true
      this.startTime = Date.now() - this.elapsedTime
      this.intervalId = setInterval(() => this.updateDisplay(), 10)

      this.startStopBtn.textContent = '停止'
      this.startStopBtn.classList.remove('start')
      this.startStopBtn.classList.add('stop')
      this.resetBtn.disabled = false
      this.lapBtn.disabled = false
    }
  }

  stop() {
    if (this.running) {
      this.running = false
      clearInterval(this.intervalId)

      this.startStopBtn.textContent = '开始'
      this.startStopBtn.classList.remove('stop')
      this.startStopBtn.classList.add('start')
    }
  }

  reset() {
    this.stop()
    this.elapsedTime = 0
    this.lastLapTime = 0
    this.lapCount = 0
    this.updateDisplay()
    this.resetBtn.disabled = true
    this.lapBtn.disabled = true
    this.lapsList.innerHTML = ''
  }

  lap() {
    this.lapCount++
    const currentTime = this.elapsedTime
    const lapTime = currentTime - this.lastLapTime
    this.lastLapTime = currentTime

    const lapItem = document.createElement('div')
    lapItem.className = 'lap-item'
    lapItem.innerHTML = `
            <span class="lap-number">计次 ${this.lapCount}</span>
            <span class="lap-time">${this.formatTime(lapTime)}</span>
        `

    this.lapsList.insertBefore(lapItem, this.lapsList.firstChild)
  }

  updateDisplay() {
    if (this.running) {
      this.elapsedTime = Date.now() - this.startTime
    }
    const formattedTime = this.formatTime(this.elapsedTime)
    const [mainTime, ms] = formattedTime.split('.')
    this.display.textContent = mainTime
    this.millisecondsDisplay.textContent = `.${ms}`
  }

  formatTime(time) {
    const ms = String(time % 1000).padStart(3, '0')
    const seconds = String(Math.floor((time / 1000) % 60)).padStart(2, '0')
    const minutes = String(Math.floor((time / (1000 * 60)) % 60)).padStart(2, '0')
    const hours = String(Math.floor(time / (1000 * 60 * 60))).padStart(2, '0')

    return `${hours}:${minutes}:${seconds}.${ms}`
  }
}

// 初始化秒表
document.addEventListener('DOMContentLoaded', () => {
  new Stopwatch()
})
