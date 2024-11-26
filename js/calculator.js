class Calculator {
  constructor() {
    this.displayHistory = document.querySelector('.history')
    this.displayResult = document.querySelector('.result')
    this.currentOperand = '0'
    this.previousOperand = ''
    this.operation = undefined
    this.shouldResetScreen = false

    this.setupEventListeners()
  }

  setupEventListeners() {
    document.querySelectorAll('.number').forEach((button) => {
      button.addEventListener('click', () => this.appendNumber(button.textContent))
    })

    document.querySelectorAll('.operator').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.action
        switch (action) {
          case 'add':
          case 'subtract':
          case 'multiply':
          case 'divide':
            this.chooseOperation(action)
            break
          case 'equals':
            this.calculate()
            break
          case 'clear':
            this.clear()
            break
          case 'clear-entry':
            this.clearEntry()
            break
          case 'decimal':
            this.appendDecimal()
            break
          case 'backspace':
            this.backspace()
            break
          case 'negate':
            this.negate()
            break
          case 'percent':
            this.percent()
            break
          case 'square':
            this.square()
            break
          case 'sqrt':
            this.sqrt()
            break
          case 'reciprocal':
            this.reciprocal()
            break
        }
      })
    })

    // 添加键盘支持
    document.addEventListener('keydown', (e) => {
      if (e.key >= '0' && e.key <= '9') this.appendNumber(e.key)
      if (e.key === '.') this.appendDecimal()
      if (e.key === '=' || e.key === 'Enter') this.calculate()
      if (e.key === 'Backspace') this.backspace()
      if (e.key === 'Escape') this.clear()
      if (e.key === '+') this.chooseOperation('add')
      if (e.key === '-') this.chooseOperation('subtract')
      if (e.key === '*') this.chooseOperation('multiply')
      if (e.key === '/') this.chooseOperation('divide')
    })
  }

  appendNumber(number) {
    if (this.shouldResetScreen) {
      this.currentOperand = ''
      this.shouldResetScreen = false
    }
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number
    } else {
      this.currentOperand += number
    }
    this.updateDisplay()
  }

  appendDecimal() {
    if (this.shouldResetScreen) {
      this.currentOperand = '0'
      this.shouldResetScreen = false
    }
    if (!this.currentOperand.includes('.')) {
      this.currentOperand += '.'
    }
    this.updateDisplay()
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return
    if (this.previousOperand !== '') {
      this.calculate()
    }
    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = ''
    this.updateDisplay()
  }

  calculate() {
    let computation
    const prev = parseFloat(this.previousOperand)
    const current = parseFloat(this.currentOperand)
    if (isNaN(prev) || isNaN(current)) return

    switch (this.operation) {
      case 'add':
        computation = prev + current
        break
      case 'subtract':
        computation = prev - current
        break
      case 'multiply':
        computation = prev * current
        break
      case 'divide':
        if (current === 0) {
          this.displayResult.textContent = '错误'
          return
        }
        computation = prev / current
        break
      default:
        return
    }

    this.currentOperand = computation.toString()
    this.operation = undefined
    this.previousOperand = ''
    this.shouldResetScreen = true
    this.updateDisplay()
  }

  clear() {
    this.currentOperand = '0'
    this.previousOperand = ''
    this.operation = undefined
    this.updateDisplay()
  }

  clearEntry() {
    this.currentOperand = '0'
    this.updateDisplay()
  }

  backspace() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1)
    if (this.currentOperand === '') this.currentOperand = '0'
    this.updateDisplay()
  }

  negate() {
    if (this.currentOperand === '0') return
    this.currentOperand = (-parseFloat(this.currentOperand)).toString()
    this.updateDisplay()
  }

  percent() {
    if (this.currentOperand === '0') return
    this.currentOperand = (parseFloat(this.currentOperand) / 100).toString()
    this.updateDisplay()
  }

  square() {
    const num = parseFloat(this.currentOperand)
    this.currentOperand = (num * num).toString()
    this.updateDisplay()
  }

  sqrt() {
    const num = parseFloat(this.currentOperand)
    if (num < 0) {
      this.displayResult.textContent = '错误'
      return
    }
    this.currentOperand = Math.sqrt(num).toString()
    this.updateDisplay()
  }

  reciprocal() {
    const num = parseFloat(this.currentOperand)
    if (num === 0) {
      this.displayResult.textContent = '错误'
      return
    }
    this.currentOperand = (1 / num).toString()
    this.updateDisplay()
  }

  updateDisplay() {
    this.displayResult.textContent = this.currentOperand
    if (this.operation != null) {
      const operationSymbol = {
        add: '+',
        subtract: '-',
        multiply: '×',
        divide: '÷',
      }[this.operation]
      this.displayHistory.textContent = `${this.previousOperand} ${operationSymbol}`
    } else {
      this.displayHistory.textContent = ''
    }
  }
}

// 初始化计算器
document.addEventListener('DOMContentLoaded', () => {
  new Calculator()
})
