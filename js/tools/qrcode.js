;(function () {
  // 如果已经存在实例，先清理
  if (window.qrcodeInstance) {
    const oldInstance = window.qrcodeInstance
    oldInstance.generateBtn?.removeEventListener('click', oldInstance.generateQRCode)
    oldInstance.downloadBtn?.removeEventListener('click', oldInstance.downloadQRCode)
    oldInstance.sizeSelect?.removeEventListener('change', oldInstance.generateQRCode)
    oldInstance.colorPicker?.removeEventListener('change', oldInstance.generateQRCode)
    window.qrcodeInstance = null
  }

  class QRCodeGenerator {
    constructor() {
      this.initElements()
      this.bindEvents()
    }

    initElements() {
      this.textInput = document.getElementById('textInput')
      this.generateBtn = document.getElementById('generateBtn')
      this.downloadBtn = document.getElementById('downloadBtn')
      this.sizeSelect = document.getElementById('sizeSelect')
      this.colorPicker = document.getElementById('colorPicker')
      this.qrcodeDiv = document.getElementById('qrcode')
      this.currentQR = null
    }

    bindEvents() {
      this.generateQRCode = this.generateQRCode.bind(this)
      this.downloadQRCode = this.downloadQRCode.bind(this)

      this.generateBtn.addEventListener('click', this.generateQRCode)
      this.downloadBtn.addEventListener('click', this.downloadQRCode)
      this.sizeSelect.addEventListener('change', this.generateQRCode)
      this.colorPicker.addEventListener('change', this.generateQRCode)
    }

    generateQRCode() {
      const text = this.textInput.value.trim()
      if (!text) {
        alert('请输入文本或URL')
        return
      }

      this.qrcodeDiv.innerHTML = ''
      const size = parseInt(this.sizeSelect.value)
      const color = this.colorPicker.value

      try {
        QRCode.toCanvas(
          document.createElement('canvas'),
          text,
          {
            width: size,
            height: size,
            color: {
              dark: color,
              light: '#ffffff',
            },
          },
          (error, canvas) => {
            if (error) {
              console.error('生成二维码出错:', error)
              alert('生成二维码失败')
              return
            }
            this.qrcodeDiv.innerHTML = ''
            this.qrcodeDiv.appendChild(canvas)
            this.currentQR = canvas
          }
        )
      } catch (error) {
        console.error('生成二维码出错:', error)
        alert('生成二维码失败，请检查输入')
      }
    }

    downloadQRCode() {
      if (!this.currentQR) {
        alert('请先生成二维码')
        return
      }

      const link = document.createElement('a')
      link.download = 'qrcode.png'
      link.href = this.currentQR.toDataURL()
      link.click()
    }
  }

  // 创建新实例并保存到window对象
  window.qrcodeInstance = new QRCodeGenerator()
})()
