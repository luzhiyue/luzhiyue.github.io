;(function () {
  // 如果已经存在实例，先销毁
  if (window.timestampConverterInstance) {
    const instance = window.timestampConverterInstance
    // 清理定时器
    if (instance.updateInterval) {
      clearInterval(instance.updateInterval)
    }
    // 清理事件监听器
    instance.cleanup()
    window.timestampConverterInstance = null
  }

  class TimestampConverter {
    constructor() {
      this.initElements()
      this.bindEvents()
      this.initTimezones()
      this.startUpdating()
    }

    initElements() {
      this.timestampInput = document.getElementById('timestamp')
      this.convertBtn = document.getElementById('convertBtn')
      this.dateTimeDisplay = document.getElementById('dateTimeDisplay')
      this.timezoneSelect = document.getElementById('timezone')
      this.currentTimestampInput = document.getElementById('currentTimestamp')
      this.copyCurrentBtn = document.getElementById('copyCurrentBtn')
      this.yearInput = document.getElementById('year')
      this.monthInput = document.getElementById('month')
      this.dayInput = document.getElementById('day')
      this.hourInput = document.getElementById('hour')
      this.minuteInput = document.getElementById('minute')
      this.secondInput = document.getElementById('second')

      this.dateInputs = [
        this.yearInput,
        this.monthInput,
        this.dayInput,
        this.hourInput,
        this.minuteInput,
        this.secondInput,
      ]
    }

    initTimezones() {
      const timezones = Intl.supportedValuesOf('timeZone')
      timezones.forEach((zone) => {
        const option = document.createElement('option')
        option.value = zone
        option.textContent = zone
        this.timezoneSelect.appendChild(option)
      })
    }

    bindEvents() {
      this.timestampInput.addEventListener('input', () => this.handleTimestampInput())
      this.copyCurrentBtn.addEventListener('click', () => this.handleCopy())
      this.dateInputs.forEach((input) => {
        input.addEventListener('input', () => this.updateTimestampFromInputs())
      })
    }

    startUpdating() {
      this.updateCurrentTimestamp()
      this.updateInterval = setInterval(() => this.updateCurrentTimestamp(), 1000)
    }

    updateCurrentTimestamp() {
      const currentTimestamp = Math.floor(Date.now() / 1000)
      this.currentTimestampInput.value = currentTimestamp
    }

    handleTimestampInput() {
      const timestamp = parseInt(this.timestampInput.value)
      if (!isNaN(timestamp)) {
        const date = new Date(timestamp * 1000)
        this.updateDateTimeInputs(date)
      }
    }

    updateDateTimeInputs(date) {
      this.yearInput.value = date.getUTCFullYear()
      this.monthInput.value = date.getUTCMonth() + 1
      this.dayInput.value = date.getUTCDate()
      this.hourInput.value = date.getUTCHours()
      this.minuteInput.value = date.getUTCMinutes()
      this.secondInput.value = date.getUTCSeconds()
    }

    updateTimestampFromInputs() {
      const date = new Date(
        Date.UTC(
          parseInt(this.yearInput.value),
          parseInt(this.monthInput.value) - 1,
          parseInt(this.dayInput.value),
          parseInt(this.hourInput.value),
          parseInt(this.minuteInput.value),
          parseInt(this.secondInput.value)
        )
      )
      const newTimestamp = Math.floor(date.getTime() / 1000)
      this.timestampInput.value = newTimestamp
    }

    handleCopy() {
      this.currentTimestampInput.select()
      document.execCommand('copy')
      alert('当前时间戳已复制到剪贴板')
    }

    cleanup() {
      this.timestampInput?.removeEventListener('input', this.handleTimestampInput)
      this.copyCurrentBtn?.removeEventListener('click', this.handleCopy)
      this.dateInputs.forEach((input) => {
        input?.removeEventListener('input', this.updateTimestampFromInputs)
      })
    }
  }

  // 创建新实例并保存到window对象
  window.timestampConverterInstance = new TimestampConverter()
})()
