class JsonYamlConverter {
  constructor() {
    this.initElements()
    this.bindEvents()
  }

  initElements() {
    this.inputText = document.getElementById('inputText')
    this.outputText = document.getElementById('outputText')
    this.inputFormat = document.getElementById('inputFormat')
    this.outputFormat = document.getElementById('outputFormat')
    this.convertBtn = document.getElementById('convertBtn')
    this.swapBtn = document.getElementById('swapBtn')
    this.clearBtn = document.getElementById('clearBtn')
    this.formatBtn = document.getElementById('formatBtn')
    this.copyBtn = document.getElementById('copyBtn')
    this.errorMessage = document.getElementById('errorMessage')
  }

  bindEvents() {
    this.convertBtn.addEventListener('click', () => this.convert())
    this.swapBtn.addEventListener('click', () => this.swap())
    this.clearBtn.addEventListener('click', () => this.clear())
    this.formatBtn.addEventListener('click', () => this.format())
    this.copyBtn.addEventListener('click', () => this.copy())

    // 自动转换
    this.inputText.addEventListener('input', () => {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => this.convert(), 500)
    })
  }

  convert() {
    try {
      const input = this.inputText.value.trim()
      if (!input) {
        this.outputText.value = ''
        return
      }

      let data
      // 解析输入
      if (this.inputFormat.value === 'json') {
        data = JSON.parse(input)
      } else {
        data = jsyaml.load(input)
      }

      // 转换输出
      if (this.outputFormat.value === 'json') {
        this.outputText.value = JSON.stringify(data, null, 2)
      } else {
        this.outputText.value = jsyaml.dump(data)
      }

      this.hideError()
    } catch (error) {
      this.showError(`转换错误: ${error.message}`)
    }
  }

  swap() {
    // 交换输入输出的内容
    const tempContent = this.inputText.value
    this.inputText.value = this.outputText.value
    this.outputText.value = tempContent

    // 交换格式选择
    const tempFormat = this.inputFormat.value
    this.inputFormat.value = this.outputFormat.value
    this.outputFormat.value = tempFormat

    // 重新转换
    this.convert()
  }

  clear() {
    this.inputText.value = ''
    this.outputText.value = ''
    this.hideError()
  }

  format() {
    try {
      const input = this.inputText.value.trim()
      if (!input) return

      let data
      if (this.inputFormat.value === 'json') {
        data = JSON.parse(input)
        this.inputText.value = JSON.stringify(data, null, 2)
      } else {
        data = jsyaml.load(input)
        this.inputText.value = jsyaml.dump(data)
      }

      this.hideError()
    } catch (error) {
      this.showError(`格式化错误: ${error.message}`)
    }
  }

  async copy() {
    try {
      await navigator.clipboard.writeText(this.outputText.value)
      this.copyBtn.textContent = '已复制'
      setTimeout(() => {
        this.copyBtn.textContent = '复制'
      }, 2000)
    } catch (error) {
      this.showError('复制失败')
    }
  }

  showError(message) {
    this.errorMessage.textContent = message
    this.errorMessage.style.display = 'block'
  }

  hideError() {
    this.errorMessage.style.display = 'none'
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  new JsonYamlConverter()
})
