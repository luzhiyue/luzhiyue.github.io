;(function () {
  // 如果已经存在实例，先销毁
  if (window.uuidGeneratorInstance) {
    // 清理事件监听器
    window.uuidGeneratorInstance.generateBtn?.removeEventListener(
      'click',
      window.uuidGeneratorInstance.generateUUIDs
    )
    window.uuidGeneratorInstance.copyBtn?.removeEventListener(
      'click',
      window.uuidGeneratorInstance.copyToClipboard
    )
    window.uuidGeneratorInstance.clearBtn?.removeEventListener(
      'click',
      window.uuidGeneratorInstance.clearResult
    )

    window.uuidGeneratorInstance = null
  }

  class UUIDGenerator {
    constructor() {
      this.initElements()
      this.bindEvents()
    }

    initElements() {
      this.versionSelect = document.getElementById('uuidVersion')
      this.caseSelect = document.getElementById('uuidCase')
      this.countInput = document.getElementById('uuidCount')
      this.separatorSelect = document.getElementById('uuidSeparator')
      this.resultArea = document.getElementById('uuidResult')
      this.generateBtn = document.getElementById('generateBtn')
      this.copyBtn = document.getElementById('copyBtn')
      this.clearBtn = document.getElementById('clearBtn')
    }

    bindEvents() {
      this.generateBtn.addEventListener('click', () => this.generateUUIDs())
      this.copyBtn.addEventListener('click', () => this.copyToClipboard())
      this.clearBtn.addEventListener('click', () => this.clearResult())
    }

    generateUUID(version) {
      if (version === '1') {
        // UUID v1 (基于时间戳)
        const now = new Date().getTime()
        const uuid = 'xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (now + Math.random() * 16) % 16 | 0
          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
        })
        return uuid
      } else {
        // UUID v4 (随机)
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0
          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
        })
      }
    }

    generateUUIDs() {
      const version = this.versionSelect.value
      const count = parseInt(this.countInput.value)
      const separator = this.separatorSelect.value
      const isUpperCase = this.caseSelect.value === 'upper'

      let result = []
      for (let i = 0; i < count; i++) {
        let uuid = this.generateUUID(version)

        // 处理分隔符
        if (separator === '') {
          uuid = uuid.replace(/-/g, '')
        }

        // 处理大小写
        uuid = isUpperCase ? uuid.toUpperCase() : uuid.toLowerCase()

        result.push(uuid)
      }

      this.resultArea.value = result.join('\n')
    }

    copyToClipboard() {
      if (!this.resultArea.value) {
        alert('没有可复制的内容！')
        return
      }

      this.resultArea.select()
      document.execCommand('copy')
      alert('已复制到剪贴板！')
    }

    clearResult() {
      this.resultArea.value = ''
    }
  }

  // 创建新实例并保存到window对象
  window.uuidGeneratorInstance = new UUIDGenerator()
})()
