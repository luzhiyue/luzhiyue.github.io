// 获取DOM元素
const timestampInput = document.getElementById('timestamp')
const convertBtn = document.getElementById('convertBtn')
const dateTimeDisplay = document.getElementById('dateTimeDisplay')
const timezoneSelect = document.getElementById('timezone')
const currentTimestampInput = document.getElementById('currentTimestamp')
const copyCurrentBtn = document.getElementById('copyCurrentBtn')
const yearInput = document.getElementById('year')
const monthInput = document.getElementById('month')
const dayInput = document.getElementById('day')
const hourInput = document.getElementById('hour')
const minuteInput = document.getElementById('minute')
const secondInput = document.getElementById('second')

// 动态生成时区选项
const timezones = Intl.supportedValuesOf('timeZone')
timezones.forEach((zone) => {
  const option = document.createElement('option')
  option.value = zone
  option.textContent = zone
  timezoneSelect.appendChild(option)
})

// 显示当前时间戳
function updateCurrentTimestamp() {
  const currentTimestamp = Math.floor(Date.now() / 1000)
  currentTimestampInput.value = currentTimestamp
}
updateCurrentTimestamp()
setInterval(updateCurrentTimestamp, 1000)

// 监听时间戳输入变化
timestampInput.addEventListener('input', () => {
  const timestamp = parseInt(timestampInput.value)
  if (!isNaN(timestamp)) {
    const date = new Date(timestamp * 1000)
    updateDateTimeInputs(date)
  }
})

function updateDateTimeInputs(date) {
  yearInput.value = date.getUTCFullYear()
  monthInput.value = date.getUTCMonth() + 1
  dayInput.value = date.getUTCDate()
  hourInput.value = date.getUTCHours()
  minuteInput.value = date.getUTCMinutes()
  secondInput.value = date.getUTCSeconds()
}

function updateTimestampFromInputs() {
  const date = new Date(
    Date.UTC(
      parseInt(yearInput.value),
      parseInt(monthInput.value) - 1,
      parseInt(dayInput.value),
      parseInt(hourInput.value),
      parseInt(minuteInput.value),
      parseInt(secondInput.value)
    )
  )
  const newTimestamp = Math.floor(date.getTime() / 1000)
  timestampInput.value = newTimestamp
}

;[yearInput, monthInput, dayInput, hourInput, minuteInput, secondInput].forEach((input) => {
  input.addEventListener('input', updateTimestampFromInputs)
})

copyCurrentBtn.addEventListener('click', () => {
  currentTimestampInput.select()
  document.execCommand('copy')
  alert('当前时间戳已复制到剪贴板')
})
