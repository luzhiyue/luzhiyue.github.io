class JsonFormatter {
  constructor() {
    this.inputArea = document.getElementById('input-json')
    this.outputArea = document.getElementById('output-json')
    this.errorMessage = document.getElementById('error-message')

    // 绑定按钮事件
    document.querySelector('.format-btn.primary').addEventListener('click', () => this.formatJson())
    document
      .querySelector('.format-btn.secondary')
      .addEventListener('click', () => this.compressJson())
    document.querySelector('.format-btn.danger').addEventListener('click', () => this.clearAll())

    // 绑定输入事件
    this.inputArea.addEventListener('input', () => this.autoFormatJson())
  }

  autoFormatJson() {
    try {
      const input = this.inputArea.value.trim()
      if (!input) {
        this.outputArea.value = ''
        this.clearError()
        return
      }
      const jsonObj = JSON.parse(input)
      this.outputArea.value = JSON.stringify(jsonObj, null, 2)
      this.clearError()
    } catch (error) {
      this.showError('无效的JSON格式: ' + error.message)
    }
  }

  formatJson() {
    try {
      const input = this.inputArea.value.trim()
      if (!input) {
        this.showError('请输入JSON字符串')
        return
      }
      const jsonObj = JSON.parse(input)
      this.outputArea.value = JSON.stringify(jsonObj, null, 2)
      this.clearError()
    } catch (error) {
      this.showError('无效的JSON格式: ' + error.message)
    }
  }

  compressJson() {
    try {
      const input = this.inputArea.value.trim()
      if (!input) {
        this.showError('请输入JSON字符串')
        return
      }
      const jsonObj = JSON.parse(input)
      this.outputArea.value = JSON.stringify(jsonObj)
      this.clearError()
    } catch (error) {
      this.showError('无效的JSON格式: ' + error.message)
    }
  }

  clearAll() {
    this.inputArea.value = ''
    this.outputArea.value = ''
    this.clearError()
  }

  showError(message) {
    this.errorMessage.textContent = message
    this.errorMessage.style.display = 'block'
  }

  clearError() {
    this.errorMessage.textContent = ''
    this.errorMessage.style.display = 'none'
  }
}

// 初始化
new JsonFormatter()
