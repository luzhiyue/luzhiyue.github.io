;(function () {
  // 如果已经存在实例，先销毁
  if (window.rsaGeneratorInstance) {
    // 清理事件监听器
    window.rsaGeneratorInstance.generateBtn?.removeEventListener(
      'click',
      window.rsaGeneratorInstance.generateKeyPair
    )
    window.rsaGeneratorInstance.clearBtn?.removeEventListener(
      'click',
      window.rsaGeneratorInstance.clearOutput
    )
    window.rsaGeneratorInstance.copyBtns?.forEach((btn) => {
      btn.removeEventListener('click', window.rsaGeneratorInstance.copyToClipboard)
    })

    window.rsaGeneratorInstance = null
  }

  class RSAGenerator {
    constructor() {
      this.initElements()
      this.bindEvents()
    }

    initElements() {
      this.keySizeSelect = document.getElementById('keySize')
      this.formatSelect = document.getElementById('format')
      this.generateBtn = document.getElementById('generateBtn')
      this.clearBtn = document.getElementById('clearBtn')
      this.publicKeyTextarea = document.getElementById('publicKey')
      this.privateKeyTextarea = document.getElementById('privateKey')
      this.copyBtns = document.querySelectorAll('.copy-btn')
    }

    bindEvents() {
      this.generateBtn.addEventListener('click', () => this.generateKeyPair())
      this.clearBtn.addEventListener('click', () => this.clearOutput())
      this.copyBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => this.copyToClipboard(e.target))
      })
    }

    async generateKeyPair() {
      try {
        this.generateBtn.disabled = true
        this.generateBtn.textContent = '生成中...'

        const keySize = parseInt(this.keySizeSelect.value)
        const format = this.formatSelect.value

        const crypt = new JSEncrypt({ default_key_size: keySize })
        await new Promise((resolve) => setTimeout(resolve, 100)) // 让UI有机会更新

        const privateKey = crypt.getPrivateKey()
        const publicKey = crypt.getPublicKey()

        this.publicKeyTextarea.value = publicKey
        this.privateKeyTextarea.value = privateKey
      } catch (error) {
        console.error('生成密钥对失败:', error)
        alert('生成密钥对失败，请重试')
      } finally {
        this.generateBtn.disabled = false
        this.generateBtn.textContent = '生成密钥对'
      }
    }

    clearOutput() {
      this.publicKeyTextarea.value = ''
      this.privateKeyTextarea.value = ''
    }

    copyToClipboard(button) {
      const targetId = button.dataset.target
      const textarea = document.getElementById(targetId)

      textarea.select()
      document.execCommand('copy')

      const originalText = button.textContent
      button.textContent = '已复制'
      setTimeout(() => {
        button.textContent = originalText
      }, 1500)
    }
  }

  // 创建新实例并保存到window对象
  window.rsaGeneratorInstance = new RSAGenerator()
})()
