class ColorPicker {
  constructor() {
    this.initElements()
    this.bindEvents()
    this.updateColor('#007bff')
  }

  initElements() {
    this.colorPicker = document.getElementById('color-picker')
    this.colorInput = document.getElementById('color-input')
    this.colorPreview = document.getElementById('color-preview')
    this.colorValues = document.getElementById('color-values')
    this.hueSlider = document.getElementById('hue-slider')
    this.saturationSlider = document.getElementById('saturation-slider')
    this.lightnessSlider = document.getElementById('lightness-slider')
    this.schemeButtons = document.querySelectorAll('.scheme-buttons .tool-btn')
    this.colorScheme = document.getElementById('color-scheme')
  }

  bindEvents() {
    this.colorPicker.addEventListener('input', (e) => this.updateColor(e.target.value))
    this.colorInput.addEventListener('input', (e) => this.updateColor(e.target.value))

    // HSL滑块事件
    this.hueSlider.addEventListener('input', () => this.updateFromHSL())
    this.saturationSlider.addEventListener('input', () => this.updateFromHSL())
    this.lightnessSlider.addEventListener('input', () => this.updateFromHSL())

    // 颜色方案按钮事件
    this.schemeButtons.forEach((btn) => {
      btn.addEventListener('click', () => this.generateColorScheme(btn.dataset.scheme))
    })
  }

  updateColor(color) {
    try {
      // 标准化颜色值
      const ctx = document.createElement('canvas').getContext('2d')
      ctx.fillStyle = color
      const standardColor = ctx.fillStyle

      // 更新UI
      this.colorPicker.value = standardColor
      this.colorInput.value = standardColor
      this.colorPreview.style.backgroundColor = standardColor

      // 更新HSL滑块
      const hsl = this.hexToHSL(standardColor)
      this.hueSlider.value = hsl.h
      this.saturationSlider.value = hsl.s
      this.lightnessSlider.value = hsl.l

      // 显示各种格式的颜色值
      this.colorValues.innerHTML = `
        HEX: ${standardColor.toUpperCase()}<br>
        RGB: ${this.hexToRGB(standardColor)}<br>
        HSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)
      `
    } catch (error) {
      console.error('Invalid color value:', error)
    }
  }

  updateFromHSL() {
    const h = parseInt(this.hueSlider.value)
    const s = parseInt(this.saturationSlider.value)
    const l = parseInt(this.lightnessSlider.value)
    const hex = this.hslToHex(h, s, l)
    this.updateColor(hex)
  }

  generateColorScheme(scheme) {
    const baseColor = this.colorPicker.value
    const hsl = this.hexToHSL(baseColor)
    let colors = []

    switch (scheme) {
      case 'complementary':
        colors = [baseColor, this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)]
        break
      case 'triadic':
        colors = [
          baseColor,
          this.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
          this.hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
        ]
        break
      case 'analogous':
        colors = [
          this.hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
          baseColor,
          this.hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
        ]
        break
    }

    this.displayColorScheme(colors)
  }

  displayColorScheme(colors) {
    this.colorScheme.innerHTML = colors
      .map(
        (color) => `
      <div class="color-scheme-item" 
           style="background-color: ${color}" 
           data-color="${color.toUpperCase()}"
           onclick="navigator.clipboard.writeText('${color}')">
      </div>
    `
      )
      .join('')
  }

  // 辅助函数
  hexToRGB(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    const r = parseInt(result[1], 16)
    const g = parseInt(result[2], 16)
    const b = parseInt(result[3], 16)
    return `rgb(${r}, ${g}, ${b})`
  }

  hexToHSL(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    let r = parseInt(result[1], 16) / 255
    let g = parseInt(result[2], 16) / 255
    let b = parseInt(result[3], 16) / 255

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

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  hslToHex(h, s, l) {
    l /= 100
    const a = (s * Math.min(l, 1 - l)) / 100
    const f = (n) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }
}

new ColorPicker()
