class Base64TextTool {
  constructor() {
    this.initElements()
    this.bindEvents()
  }

  initElements() {
    this.inputText = document.getElementById('inputText')
    this.outputText = document.getElementById('outputText')
    this.inputCount = document.getElementById('inputCount')
    this.outputCount = document.getElementById('outputCount')
    this.inputBytes = document.getElementById('inputBytes')
    this.outputBytes = document.getElementById('outputBytes')
    this.urlSafe = document.getElementById('urlSafe')
    this.nopadding = document.getElementById('nopadding')
    this.textEncoding = document.getElementById('textEncoding')
  }

  bindEvents() {
    this.inputText.addEventListener('input', () => this.updateInputStats())
    this.outputText.addEventListener('input', () => this.updateOutputStats())
  }

  updateInputStats() {
    const text = this.inputText.value
    this.inputCount.textContent = text.length
    this.inputBytes.textContent = new Blob([text]).size
  }

  updateOutputStats() {
    const text = this.outputText.value
    this.outputCount.textContent = text.length
    this.outputBytes.textContent = new Blob([text]).size
  }

  encodeToBase64() {
    try {
      let text = this.inputText.value
      if (!text) return

      // 使用选定的编码将文本转换为Base64
      let encoder = new TextEncoder()
      let data = encoder.encode(text)
      let base64 = btoa(String.fromCharCode(...data))

      // 处理URL安全选项
      if (this.urlSafe.checked) {
        base64 = base64.replace(/\+/g, '-').replace(/\//g, '_')
      }

      // 处理填充选项
      if (this.nopadding.checked) {
        base64 = base64.replace(/=+$/, '')
      }

      this.outputText.value = base64
      this.updateOutputStats()
    } catch (error) {
      alert('编码失败：' + error.message)
    }
  }

  decodeFromBase64() {
    try {
      let base64 = this.inputText.value
      if (!base64) return

      // 处理URL安全字符
      base64 = base64.replace(/-/g, '+').replace(/_/g, '/')

      // 添加回填充
      while (base64.length % 4) {
        base64 += '='
      }

      // 解码Base64
      let binary = atob(base64)
      let bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }

      // 使用选定的编码解码文本
      let decoder = new TextDecoder(this.textEncoding.value)
      let text = decoder.decode(bytes)

      this.outputText.value = text
      this.updateOutputStats()
    } catch (error) {
      alert('解码失败：' + error.message)
    }
  }

  swapTexts() {
    const temp = this.inputText.value
    this.inputText.value = this.outputText.value
    this.outputText.value = temp
    this.updateInputStats()
    this.updateOutputStats()
  }

  clearInput() {
    this.inputText.value = ''
    this.updateInputStats()
  }

  clearOutput() {
    this.outputText.value = ''
    this.updateOutputStats()
  }

  async pasteText() {
    try {
      const text = await navigator.clipboard.readText()
      this.inputText.value = text
      this.updateInputStats()
    } catch (error) {
      alert('粘贴失败：' + error.message)
    }
  }

  async copyOutput() {
    try {
      await navigator.clipboard.writeText(this.outputText.value)
      alert('已复制到剪贴板')
    } catch (error) {
      alert('复制失败：' + error.message)
    }
  }
}

// 初始化工具
document.addEventListener('DOMContentLoaded', () => {
  window.base64Tool = new Base64TextTool()
})

// 暴露给HTML使用的函数
function encodeToBase64() {
  window.base64Tool.encodeToBase64()
}

function decodeFromBase64() {
  window.base64Tool.decodeFromBase64()
}

function swapTexts() {
  window.base64Tool.swapTexts()
}

function clearInput() {
  window.base64Tool.clearInput()
}

function clearOutput() {
  window.base64Tool.clearOutput()
}

function pasteText() {
  window.base64Tool.pasteText()
}

function copyOutput() {
  window.base64Tool.copyOutput()
}
