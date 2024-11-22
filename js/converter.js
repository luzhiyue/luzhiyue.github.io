// 时间格式转换
function convertTime() {
  const input = document.getElementById('timestamp').value
  const format = document.getElementById('time-format').value
  const resultBox = document.getElementById('time-result')

  try {
    let date
    if (!isNaN(input)) {
      // 处理时间戳
      date = new Date(parseInt(input) * (input.length === 10 ? 1000 : 1))
    } else {
      // 处理日期字符串
      date = new Date(input)
    }

    if (isNaN(date.getTime())) {
      throw new Error('无效的日期格式')
    }

    let result = ''
    switch (format) {
      case 'timestamp':
        result = `Unix时间戳: ${Math.floor(date.getTime() / 1000)}\n`
        result += `毫秒时间戳: ${date.getTime()}`
        break
      case 'iso':
        result = date.toISOString()
        break
      case 'local':
        result = date.toLocaleString()
        break
    }
    resultBox.textContent = result
  } catch (error) {
    resultBox.textContent = `错误: ${error.message}`
  }
}

// 进制转换
function convertBase() {
  const input = document.getElementById('number-input').value
  const fromBase = parseInt(document.getElementById('from-base').value)
  const toBase = parseInt(document.getElementById('to-base').value)
  const resultBox = document.getElementById('base-result')

  try {
    const decimal = parseInt(input, fromBase)
    if (isNaN(decimal)) {
      throw new Error('无效的输入数字')
    }
    resultBox.textContent = decimal.toString(toBase).toUpperCase()
  } catch (error) {
    resultBox.textContent = `错误: ${error.message}`
  }
}

// 颜色格式转换
function convertColor() {
  const input = document.getElementById('color-input').value.trim()
  const colorPicker = document.getElementById('color-picker')
  const preview = document.querySelector('.color-preview')
  const values = document.querySelector('.color-values')

  try {
    let color

    // 处理不同格式的输入
    if (input.startsWith('#')) {
      // HEX格式
      color = input
    } else if (input.startsWith('rgb')) {
      // RGB格式
      const matches = input.match(/\d+/g)
      if (matches && matches.length === 3) {
        color = rgbToHex(parseInt(matches[0]), parseInt(matches[1]), parseInt(matches[2]))
      } else {
        throw new Error('无效的RGB格式')
      }
    } else if (input.startsWith('hsl')) {
      // HSL格式
      const matches = input.match(/\d+/g)
      if (matches && matches.length === 3) {
        color = hslToHex(parseInt(matches[0]), parseInt(matches[1]), parseInt(matches[2]))
      } else {
        throw new Error('无效的HSL格式')
      }
    } else {
      throw new Error('不支持的颜色格式')
    }

    // 更新颜色显示
    colorPicker.value = color
    preview.style.backgroundColor = color

    // 显示不同格式的值
    values.innerHTML = `
            HEX: ${color.toUpperCase()}<br>
            RGB: ${hexToRgb(color)}<br>
            HSL: ${hexToHsl(color)}
        `
  } catch (error) {
    values.textContent = `错误: ${error.message}`
    preview.style.backgroundColor = 'transparent'
  }
}

// 辅助函数
function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) throw new Error('无效的HEX格式')
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)
  return `rgb(${r}, ${g}, ${b})`
}

function hexToHsl(hex) {
  // 先转换为RGB
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) throw new Error('无效的HEX格式')

  let r = parseInt(result[1], 16) / 255
  let g = parseInt(result[2], 16) / 255
  let b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h,
    s,
    l = (max + min) / 2

  if (max === min) {
    h = s = 0 // 灰色
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

function hslToHex(h, s, l) {
  s /= 100
  l /= 100

  let c = (1 - Math.abs(2 * l - 1)) * s
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  let m = l - c / 2
  let r = 0,
    g = 0,
    b = 0

  if (0 <= h && h < 60) {
    r = c
    g = x
    b = 0
  } else if (60 <= h && h < 120) {
    r = x
    g = c
    b = 0
  } else if (120 <= h && h < 180) {
    r = 0
    g = c
    b = x
  } else if (180 <= h && h < 240) {
    r = 0
    g = x
    b = c
  } else if (240 <= h && h < 300) {
    r = x
    g = 0
    b = c
  } else if (300 <= h && h < 360) {
    r = c
    g = 0
    b = x
  }

  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)

  return rgbToHex(r, g, b)
}

// 添加颜色选择器的事件监听
document.addEventListener('DOMContentLoaded', function () {
  const colorPicker = document.getElementById('color-picker')
  if (colorPicker) {
    colorPicker.addEventListener('input', function (e) {
      document.getElementById('color-input').value = e.target.value
      convertColor()
    })
  }
})

// 单位转换
const unitTypes = {
  length: {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    inch: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mile: 1609.344,
  },
  weight: {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.45359237,
    oz: 0.028349523125,
  },
  temperature: {
    c: 'c',
    f: 'f',
    k: 'k',
  },
}

// 初始化单位选择器
document.getElementById('unit-type').addEventListener('change', function () {
  const fromUnit = document.getElementById('from-unit')
  const toUnit = document.getElementById('to-unit')
  const units = Object.keys(unitTypes[this.value])

  fromUnit.innerHTML = ''
  toUnit.innerHTML = ''

  units.forEach((unit) => {
    fromUnit.add(new Option(unit.toUpperCase(), unit))
    toUnit.add(new Option(unit.toUpperCase(), unit))
  })
})

function convertUnit() {
  const value = parseFloat(document.getElementById('unit-value').value)
  const type = document.getElementById('unit-type').value
  const fromUnit = document.getElementById('from-unit').value
  const toUnit = document.getElementById('to-unit').value
  const resultBox = document.getElementById('unit-result')

  try {
    if (isNaN(value)) {
      throw new Error('请输入有效的数字')
    }

    let result
    if (type === 'temperature') {
      result = convertTemperature(value, fromUnit, toUnit)
    } else {
      const baseValue = value * unitTypes[type][fromUnit]
      result = baseValue / unitTypes[type][toUnit]
    }

    resultBox.textContent = `${value} ${fromUnit.toUpperCase()} = ${result.toFixed(
      6
    )} ${toUnit.toUpperCase()}`
  } catch (error) {
    resultBox.textContent = `错误: ${error.message}`
  }
}

// 辅助函数
function colorToRGB(hex) {
  const ctx = document.createElement('canvas').getContext('2d')
  ctx.fillStyle = hex
  const color = ctx.fillStyle
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color)
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)
  return `rgb(${r}, ${g}, ${b})`
}

function colorToHSL(hex) {
  const ctx = document.createElement('canvas').getContext('2d')
  ctx.fillStyle = hex
  const color = ctx.fillStyle
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color)
  const r = parseInt(result[1], 16) / 255
  const g = parseInt(result[2], 16) / 255
  const b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h,
    s,
    l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

function convertTemperature(value, from, to) {
  let celsius
  // 转换为摄氏度
  switch (from) {
    case 'c':
      celsius = value
      break
    case 'f':
      celsius = ((value - 32) * 5) / 9
      break
    case 'k':
      celsius = value - 273.15
      break
  }

  // 从摄氏度转换为目标单位
  switch (to) {
    case 'c':
      return celsius
    case 'f':
      return (celsius * 9) / 5 + 32
    case 'k':
      return celsius + 273.15
  }
}

// 页面加载时初始化单位选择器
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('unit-type').dispatchEvent(new Event('change'))
})
