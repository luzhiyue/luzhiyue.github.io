;(function () {
  // 如果已经存在实例，先销毁
  if (window.chineseConverterInstance) {
    // 清理事件监听器
    const instance = window.chineseConverterInstance
    instance.inputText?.removeEventListener('input', instance.updateCharCount)
    instance.convertSwitch?.removeEventListener('change', instance.convert)
    instance.swapText?.removeEventListener('click', instance.swapTextContent)
    instance.clearText?.removeEventListener('click', instance.clearAll)
    instance.copyResult?.removeEventListener('click', instance.copyToClipboard)

    window.chineseConverterInstance = null
  }

  class ChineseConverter {
    constructor() {
      this.initElements()
      this.bindEvents()
      this.simplifiedToTraditional = ChineseMapping.simplified
      this.traditionalToSimplified = ChineseMapping.traditional
    }

    initElements() {
      this.inputText = document.getElementById('inputText')
      this.outputText = document.getElementById('outputText')
      this.inputCount = document.getElementById('inputCount')
      this.outputCount = document.getElementById('outputCount')
      this.convertSwitch = document.getElementById('convertSwitch')
      this.switchLabel = document.getElementById('switchLabel')
      this.swapText = document.getElementById('swapText')
      this.clearText = document.getElementById('clearText')
      this.copyResult = document.getElementById('copyResult')
    }

    bindEvents() {
      // 监听输入变化
      this.inputText.addEventListener('input', () => {
        this.updateCharCount()
        this.convert()
      })

      // 监听开关变化
      this.convertSwitch.addEventListener('change', () => {
        this.switchLabel.textContent = this.convertSwitch.checked ? '繁体 → 简体' : '简体 → 繁体'
        this.convert()
      })

      this.swapText.addEventListener('click', () => this.swapTextContent())
      this.clearText.addEventListener('click', () => this.clearAll())
      this.copyResult.addEventListener('click', () => this.copyToClipboard())
    }

    convert() {
      const text = this.inputText.value
      if (!text) {
        this.outputText.value = ''
        return
      }

      const conversionMap = this.convertSwitch.checked
        ? this.traditionalToSimplified
        : this.simplifiedToTraditional

      this.outputText.value = this.convertText(text, conversionMap)
      this.updateCharCount()
    }

    convertText(text, conversionMap) {
      let result = ''
      for (let char of text) {
        result += conversionMap[char] || char
      }
      return result
    }

    swapTextContent() {
      ;[this.inputText.value, this.outputText.value] = [this.outputText.value, this.inputText.value]
      this.updateCharCount()
      this.convertSwitch.checked = !this.convertSwitch.checked
      this.switchLabel.textContent = this.convertSwitch.checked ? '繁体 → 简体' : '简体 → 繁体'
    }

    clearAll() {
      this.inputText.value = ''
      this.outputText.value = ''
      this.updateCharCount()
    }

    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.outputText.value)
        alert('已复制到剪贴板')
      } catch (error) {
        alert('复制失败：' + error.message)
      }
    }

    updateCharCount() {
      this.inputCount.textContent = this.inputText.value.length
      this.outputCount.textContent = this.outputText.value.length
    }
  }

  // 创建新实例并保存到window对象
  window.chineseConverterInstance = new ChineseConverter()
})()
