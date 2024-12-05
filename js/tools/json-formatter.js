;(function () {
  // 如果已经存在实例，先清理
  if (window.jsonFormatterInstance) {
    const instance = window.jsonFormatterInstance
    // 清理事件监听器
    document.querySelector('.format-btn.primary')?.removeEventListener('click', instance.formatJson)
    document
      .querySelector('.format-btn.secondary')
      ?.removeEventListener('click', instance.compressJson)
    document.querySelector('.format-btn.danger')?.removeEventListener('click', instance.clearAll)
    instance.inputArea?.removeEventListener('input', instance.autoFormatJson)

    window.jsonFormatterInstance = null
  }

  class JsonFormatter {
    constructor() {
      this.inputArea = document.getElementById('input-json')
      this.outputArea = document.getElementById('output-json')
      this.errorMessage = document.getElementById('error-message')
      this.bindEvents()
    }

    bindEvents() {
      // 绑定按钮事件，使用箭头函数保持this指向
      document
        .querySelector('.format-btn.primary')
        .addEventListener('click', () => this.formatJson())
      document
        .querySelector('.format-btn.secondary')
        .addEventListener('click', () => this.compressJson())
      document.querySelector('.format-btn.danger').addEventListener('click', () => this.clearAll())
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

  // 创建新实例并保存到window对象
  window.jsonFormatterInstance = new JsonFormatter()
})()
