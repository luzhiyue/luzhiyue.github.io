class GZipTool {
  constructor() {
    this.initElements()
    this.bindEvents()
    this.updateCounts()
    this.currentMode = 'compress'
  }

  initElements() {
    this.inputText = document.getElementById('inputText')
    this.outputText = document.getElementById('outputText')
    this.clearBtn = document.getElementById('clearBtn')
    this.outputFormat = document.getElementById('outputFormat')
    this.errorMessage = document.getElementById('error-message')
    this.modeBtns = document.querySelectorAll('.mode-btn')

    // 计数器元素
    this.inputCount = document.getElementById('inputCount')
    this.inputBytes = document.getElementById('inputBytes')
    this.outputCount = document.getElementById('outputCount')
    this.outputBytes = document.getElementById('outputBytes')
    this.compressionRatio = document.getElementById('compressionRatio')
  }

  bindEvents() {
    // 模式切换
    this.modeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.modeBtns.forEach((b) => b.classList.remove('active'))
        btn.classList.add('active')
        this.currentMode = btn.dataset.mode
        this.processInput()
      })
    })

    // 输入实时处理
    this.inputText.addEventListener('input', () => {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.processInput()
      }, 300)
    })

    this.clearBtn.addEventListener('click', () => this.clear())
    this.outputFormat.addEventListener('change', () => this.processInput())
  }

  processInput() {
    const input = this.inputText.value.trim()
    if (!input) {
      this.outputText.value = ''
      this.updateCounts()
      return
    }

    try {
      if (this.currentMode === 'compress') {
        const compressed = pako.gzip(input)
        this.setOutput(compressed)
      } else {
        let data
        switch (this.outputFormat.value) {
          case 'base64':
            data = this.base64ToUint8Array(input)
            break
          case 'hex':
            data = this.hexToUint8Array(input)
            break
          case 'utf8':
            data = new TextEncoder().encode(input)
            break
        }
        const decompressed = pako.ungzip(data, { to: 'string' })
        this.outputText.value = decompressed
      }
      this.hideError()
    } catch (error) {
      this.showError(`${this.currentMode === 'compress' ? '压缩' : '解压'}失败：${error.message}`)
    }
    this.updateCounts()
  }

  setOutput(data) {
    switch (this.outputFormat.value) {
      case 'base64':
        this.outputText.value = this.uint8ArrayToBase64(data)
        break
      case 'hex':
        this.outputText.value = this.uint8ArrayToHex(data)
        break
      case 'utf8':
        this.outputText.value = new TextDecoder().decode(data)
        break
    }
    this.updateCounts()
  }

  clear() {
    this.inputText.value = ''
    this.outputText.value = ''
    this.hideError()
    this.updateCounts()
  }

  updateCounts() {
    const inputText = this.inputText.value
    const outputText = this.outputText.value

    this.inputCount.textContent = inputText.length
    this.inputBytes.textContent = new Blob([inputText]).size
    this.outputCount.textContent = outputText.length
    this.outputBytes.textContent = new Blob([outputText]).size

    if (inputText && outputText) {
      const ratio = ((1 - new Blob([outputText]).size / new Blob([inputText]).size) * 100).toFixed(
        2
      )
      this.compressionRatio.textContent = ratio + '%'
    } else {
      this.compressionRatio.textContent = '0%'
    }
  }

  showError(message) {
    this.errorMessage.textContent = message
    this.errorMessage.style.display = 'block'
  }

  hideError() {
    this.errorMessage.style.display = 'none'
  }

  // 工具方法
  uint8ArrayToBase64(uint8Array) {
    return btoa(String.fromCharCode.apply(null, uint8Array))
  }

  base64ToUint8Array(base64) {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes
  }

  uint8ArrayToHex(uint8Array) {
    return Array.from(uint8Array)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }

  hexToUint8Array(hex) {
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
    }
    return bytes
  }
}

// 直接实例化 GZipTool 类
new GZipTool()
