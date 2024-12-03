class CronParser {
  constructor() {
    this.initElements()
    this.bindEvents()
  }

  initElements() {
    this.inputCron = document.getElementById('input-cron')
    this.cronDescription = document.getElementById('cron-description')
    this.nextRunTimes = document.getElementById('next-run-times')
    this.errorMessage = document.getElementById('error-message')
    this.parseBtn = document.querySelector('.parse-btn')
    this.exampleBtn = document.querySelector('.example-btn')
    this.clearBtn = document.querySelector('.clear-btn')
  }

  bindEvents() {
    this.parseBtn.addEventListener('click', () => this.parseCron())
    this.exampleBtn.addEventListener('click', () => this.showExample())
    this.clearBtn.addEventListener('click', () => this.clearAll())

    this.inputCron.addEventListener('input', () => {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.parseCron()
      }, 300)
    })

    this.inputCron.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        clearTimeout(this.debounceTimer)
        this.parseCron()
      }
    })
  }

  parseCron() {
    const cronExpression = this.inputCron.value.trim()
    if (!cronExpression) {
      this.showError('请输入Cron表达式')
      return
    }

    try {
      const parts = cronExpression.split(' ')
      if (parts.length !== 5 && parts.length !== 6) {
        throw new Error('Cron表达式必须包含5位或6位')
      }

      let second, minute, hour, dayOfMonth, month, dayOfWeek

      if (parts.length === 6) {
        ;[second, minute, hour, dayOfMonth, month, dayOfWeek] = parts
        this.validateCronPart(second, 0, 59, '秒')
      } else {
        ;[minute, hour, dayOfMonth, month, dayOfWeek] = parts
        second = '0'
      }

      // 验证每个部分
      this.validateCronPart(minute, 0, 59, '分钟')
      this.validateCronPart(hour, 0, 23, '小时')
      this.validateCronPart(dayOfMonth, 1, 31, '日期')
      this.validateCronPart(month, 1, 12, '月份')
      this.validateCronPart(dayOfWeek, 0, 6, '星期')

      // 生成描述
      const description = this.generateDescription(
        [second, minute, hour, dayOfMonth, month, dayOfWeek],
        parts.length === 6
      )
      this.cronDescription.innerHTML = description

      // 生成接下来10次运行时间
      const nextRuns = this.generateNextRuns(second, minute, hour, dayOfMonth, month, dayOfWeek)
      this.displayNextRuns(nextRuns)

      this.hideError()
    } catch (error) {
      this.showError(error.message)
    }
  }

  validateCronPart(part, min, max, name) {
    if (part === '*') return

    const values = part.split(',')
    for (const value of values) {
      if (value.includes('-')) {
        const [start, end] = value.split('-').map(Number)
        if (isNaN(start) || isNaN(end) || start < min || end > max || start > end) {
          throw new Error(`${name}范围无效`)
        }
      } else if (value.includes('/')) {
        const [range, step] = value.split('/')
        if (range !== '*' || isNaN(Number(step))) {
          throw new Error(`${name}步长格式无效`)
        }
      } else {
        const num = Number(value)
        if (isNaN(num) || num < min || num > max) {
          throw new Error(`${name}值无效`)
        }
      }
    }
  }

  generateDescription(parts, includeSeconds) {
    const [second, minute, hour, dayOfMonth, month, dayOfWeek] = parts
    let description = '这个Cron表达式的含义是：<br><br>'

    if (includeSeconds) {
      description += `秒：${this.describePart(second, '秒')}<br>`
    }
    description += `分钟：${this.describePart(minute, '分钟')}<br>`
    description += `小时：${this.describePart(hour, '小时')}<br>`
    description += `日期：${this.describePart(dayOfMonth, '日')}<br>`
    description += `月份：${this.describePart(month, '月')}<br>`
    description += `星期：${this.describePart(dayOfWeek, '星期', true)}`

    return description
  }

  describePart(part, unit, isWeek = false) {
    if (part === '*') return `每${unit}`

    if (part.includes('/')) {
      const [, step] = part.split('/')
      return `每${step}${unit}`
    }

    if (part.includes('-')) {
      const [start, end] = part.split('-')
      return `从${start}${unit}到${end}${unit}`
    }

    if (part.includes(',')) {
      return `在${part.split(',').join(unit + '、')}${unit}`
    }

    if (isWeek) {
      const weekdays = ['日', '一', '二', '三', '四', '五', '六']
      return `星期${weekdays[parseInt(part)]}`
    }

    return `在${part}${unit}`
  }

  generateNextRuns(second, minute, hour, dayOfMonth, month, dayOfWeek) {
    const now = new Date()
    const nextRuns = []
    let current = new Date(now)

    while (nextRuns.length < 10) {
      current = this.getNextRunTime(current, second, minute, hour, dayOfMonth, month, dayOfWeek)
      if (!current || isNaN(current.getTime())) break
      nextRuns.push(new Date(current))

      if (second.includes('/')) {
        current.setSeconds(current.getSeconds() + 1)
      } else if (minute.includes('/')) {
        current.setMinutes(current.getMinutes() + 1)
      } else if (hour.includes('/')) {
        current.setHours(current.getHours() + 1)
      } else {
        current.setDate(current.getDate() + 1)
      }
    }

    return nextRuns
  }

  getNextRunTime(current, second, minute, hour, dayOfMonth, month, dayOfWeek) {
    const next = new Date(current)
    next.setMilliseconds(0)

    const parseStepValue = (value, currentValue, maxValue) => {
      if (value.includes('/')) {
        const [, step] = value.split('/')
        const stepInt = parseInt(step)
        let nextValue = Math.ceil(currentValue / stepInt) * stepInt
        if (nextValue <= currentValue) {
          nextValue += stepInt
        }
        if (nextValue >= maxValue) {
          return 0
        }
        return nextValue
      }
      return parseInt(value)
    }

    if (second !== '*') {
      if (second.includes('/')) {
        const nextSecond = parseStepValue(second, current.getSeconds(), 60)
        next.setSeconds(nextSecond)
        if (nextSecond === 0) {
          next.setMinutes(next.getMinutes() + 1)
        }
      } else {
        next.setSeconds(parseInt(second))
      }
    }

    if (minute !== '*') {
      if (minute.includes('/')) {
        const nextMinute = parseStepValue(minute, current.getMinutes(), 60)
        next.setMinutes(nextMinute)
        if (nextMinute === 0) {
          next.setHours(next.getHours() + 1)
        }
      } else {
        next.setMinutes(parseInt(minute))
      }
    }

    if (hour !== '*') {
      if (hour.includes('/')) {
        const nextHour = parseStepValue(hour, current.getHours(), 24)
        next.setHours(nextHour)
        if (nextHour === 0) {
          next.setDate(next.getDate() + 1)
        }
      } else {
        next.setHours(parseInt(hour))
      }
    }

    if (next <= current) {
      if (second.includes('/')) {
        next.setSeconds(next.getSeconds() + parseInt(second.split('/')[1]))
      } else if (minute.includes('/')) {
        next.setMinutes(next.getMinutes() + parseInt(minute.split('/')[1]))
      } else if (hour.includes('/')) {
        next.setHours(next.getHours() + parseInt(hour.split('/')[1]))
      } else {
        next.setDate(next.getDate() + 1)
      }
    }

    if (month !== '*') {
      const monthNum = parseInt(month)
      if (next.getMonth() + 1 !== monthNum) {
        next.setMonth(monthNum - 1)
        next.setDate(1)
      }
    }

    if (dayOfWeek !== '*') {
      const targetDay = parseInt(dayOfWeek)
      while (next.getDay() !== targetDay) {
        next.setDate(next.getDate() + 1)
      }
    }

    if (dayOfMonth !== '*') {
      const targetDate = parseInt(dayOfMonth)
      if (next.getDate() !== targetDate) {
        next.setDate(targetDate)
        if (next <= current) {
          next.setMonth(next.getMonth() + 1)
        }
      }
    }

    return next
  }

  displayNextRuns(nextRuns) {
    this.nextRunTimes.innerHTML = nextRuns
      .map((date) => `<li>${date.toLocaleString('zh-CN')}</li>`)
      .join('')
  }

  showExample() {
    this.inputCron.value = '0 0 * * *'
    this.parseCron()
  }

  clearAll() {
    this.inputCron.value = ''
    this.cronDescription.innerHTML = ''
    this.nextRunTimes.innerHTML = ''
    this.hideError()
  }

  showError(message) {
    this.errorMessage.textContent = message
    this.errorMessage.style.display = 'block'
  }

  hideError() {
    this.errorMessage.style.display = 'none'
  }
}

new CronParser()
