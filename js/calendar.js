class Calendar {
  constructor() {
    this.date = new Date()
    this.solarTerms = null
    this.initElements()
    this.loadSolarTerms().then(() => {
      this.bindEvents()
      this.render()
    })
  }

  async loadSolarTerms() {
    try {
      const response = await fetch('/data/solarTerms.json')
      const data = await response.json()
      this.solarTerms = data
    } catch (error) {
      console.error('加载节气数据失败:', error)
    }
  }

  initElements() {
    this.yearElem = document.querySelector('.year-input')
    this.monthElem = document.querySelector('.month-select')
    this.datesElem = document.querySelector('.calendar-dates')
    this.termElem = document.querySelector('.term-name')
    this.todayBtn = document.querySelector('.today-btn')
  }

  bindEvents() {
    document.querySelector('.prev-year').addEventListener('click', () => this.changeYear(-1))
    document.querySelector('.next-year').addEventListener('click', () => this.changeYear(1))
    this.yearElem.addEventListener('input', (e) => {
      const year = parseInt(e.target.value, 10)
      if (!isNaN(year) && year.toString().length === 4) {
        this.date.setFullYear(year)
        this.render()
        this.updateSolarTerm()
      }
    })
    this.yearElem.addEventListener('blur', (e) => {
      let year = parseInt(e.target.value, 10)
      if (isNaN(year) || year < 1900 || year > 2100) {
        year = new Date().getFullYear()
      }
      this.date.setFullYear(year)
      this.render()
      this.updateSolarTerm()
    })
    this.monthElem.addEventListener('change', () => this.updateMonth())
    this.todayBtn.addEventListener('click', () => this.goToToday())
  }

  changeYear(delta) {
    this.date.setFullYear(this.date.getFullYear() + delta)
    this.render()
    this.updateSolarTerm()
  }

  updateYear() {
    const year = parseInt(this.yearElem.value, 10)
    if (!isNaN(year)) {
      this.date.setFullYear(year)
      this.render()
      this.updateSolarTerm()
    }
  }

  updateMonth() {
    const month = parseInt(this.monthElem.value, 10)
    if (!isNaN(month)) {
      this.date.setMonth(month)
      this.render()
      this.updateSolarTerm()
    }
  }

  render() {
    this.yearElem.value = this.date.getFullYear()
    this.monthElem.value = this.date.getMonth()
    this.renderDates()
  }

  renderDates() {
    this.datesElem.innerHTML = ''
    const year = this.date.getFullYear()
    const month = this.date.getMonth()

    // 获取当月第一天和最后一天
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // 填充前面的空白日期
    for (let i = 0; i < firstDay.getDay(); i++) {
      const div = document.createElement('div')
      div.className = 'calendar-date empty'
      this.datesElem.appendChild(div)
    }

    // 填充日期
    const today = new Date()
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const div = document.createElement('div')
      div.className = 'calendar-date'

      // 创建日期数字容器
      const dateNumber = document.createElement('div')
      dateNumber.className = 'date-number'
      dateNumber.textContent = i

      // 创建节气容器
      const solarTerm = document.createElement('div')
      solarTerm.className = 'date-solar-term'

      // 检查是否是今天
      if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
        div.className += ' today'
      }

      // 检查该日期是否有节气
      const termName = this.getSolarTermForDate(year, month + 1, i)
      if (termName) {
        solarTerm.textContent = termName
        div.className += ' has-term'
      }

      div.appendChild(dateNumber)
      div.appendChild(solarTerm)
      this.datesElem.appendChild(div)
    }
  }

  getSolarTermForDate(year, month, day) {
    if (!this.solarTerms || !this.solarTerms[year]) return null

    const yearData = this.solarTerms[year]
    for (const [term, dateStr] of Object.entries(yearData)) {
      const [m, d] = dateStr.split(' ')[0].split('-').map(Number)
      if (m === month && d === day) {
        return term
      }
    }
    return null
  }

  goToToday() {
    const today = new Date()
    this.date = today
    this.render()
    this.updateSolarTerm()
  }

  // ... 其他日历相关方法
}

new Calendar()
