;(function () {
  // 如果已经存在实例，先销毁
  if (window.base64ImageInstance) {
    // 清理事件监听器
    const oldInstance = window.base64ImageInstance

    // 清理模式切换按钮事件
    oldInstance.modeBtns?.forEach((btn) => {
      btn.removeEventListener('click', () => oldInstance.switchMode(btn))
    })

    // 清理文件上传相关事件
    oldInstance.dropZone?.removeEventListener('click', () => oldInstance.fileInput.click())
    oldInstance.fileInput?.removeEventListener('change', oldInstance.handleFileSelect)
    oldInstance.dropZone?.removeEventListener('dragover', () => {})
    oldInstance.dropZone?.removeEventListener('dragleave', () => {})
    oldInstance.dropZone?.removeEventListener('drop', () => {})

    // 清理其他事件
    oldInstance.base64Input?.removeEventListener('input', () => oldInstance.decodeBase64())
    oldInstance.copyBtn?.removeEventListener('click', () => oldInstance.copyResult())
    oldInstance.downloadBtn?.removeEventListener('click', () => oldInstance.downloadImage())

    window.base64ImageInstance = null
  }

  class Base64ImageTool {
    constructor() {
      this.initElements()
      this.bindEvents()
    }

    initElements() {
      // 模式切换按钮
      this.modeBtns = document.querySelectorAll('.mode-btn')
      this.encodeArea = document.getElementById('encodeArea')
      this.decodeArea = document.getElementById('decodeArea')

      // 文件上传相关
      this.dropZone = document.getElementById('dropZone')
      this.fileInput = document.getElementById('fileInput')
      this.previewContainer = document.querySelector('.preview-container')
      this.previewImage = document.getElementById('previewImage')
      this.originalSize = document.getElementById('originalSize')
      this.fileSize = document.getElementById('fileSize')

      // Base64输入输出
      this.base64Input = document.getElementById('base64Input')
      this.resultOutput = document.getElementById('resultOutput')
      this.resultImage = document.getElementById('resultImage')
      this.decodedImage = document.getElementById('decodedImage')

      // 按钮
      this.copyBtn = document.getElementById('copyBtn')
      this.downloadBtn = document.getElementById('downloadBtn')
    }

    bindEvents() {
      // 模式切换
      this.modeBtns.forEach((btn) => {
        btn.addEventListener('click', () => this.switchMode(btn))
      })

      // 文件上传
      this.dropZone.addEventListener('click', () => this.fileInput.click())
      this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e))
      this.dropZone.addEventListener('dragover', (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dropZone.style.borderColor = '#007bff'
      })
      this.dropZone.addEventListener('dragleave', () => {
        this.dropZone.style.borderColor = '#ddd'
      })
      this.dropZone.addEventListener('drop', (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dropZone.style.borderColor = '#ddd'
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('image/')) {
          this.handleFile(file)
        }
      })

      // Base64解码
      this.base64Input.addEventListener('input', () => this.decodeBase64())

      // 复制和下载
      this.copyBtn.addEventListener('click', () => this.copyResult())
      this.downloadBtn.addEventListener('click', () => this.downloadImage())
    }

    switchMode(btn) {
      const mode = btn.dataset.mode
      this.modeBtns.forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')

      if (mode === 'encode') {
        this.encodeArea.style.display = 'block'
        this.decodeArea.style.display = 'none'
        this.resultImage.style.display = 'none'
        this.resultOutput.style.display = 'block'
      } else {
        this.encodeArea.style.display = 'none'
        this.decodeArea.style.display = 'block'
        this.resultImage.style.display = 'block'
        this.resultOutput.style.display = 'none'
      }
    }

    handleFileSelect(e) {
      const file = e.target.files[0]
      if (file) {
        this.handleFile(file)
      }
    }

    handleFile(file) {
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件！')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        // 显示预览
        this.previewImage.src = e.target.result
        this.previewContainer.style.display = 'block'

        // 显示图片信息
        const img = new Image()
        img.onload = () => {
          this.originalSize.textContent = `${img.width} x ${img.height}`
        }
        img.src = e.target.result

        // 显示文件大小
        this.fileSize.textContent = this.formatFileSize(file.size)

        // 显示Base64结果
        this.resultOutput.value = e.target.result
      }
      reader.readAsDataURL(file)
    }

    decodeBase64() {
      const base64Data = this.base64Input.value.trim()
      if (!base64Data) return

      try {
        this.decodedImage.src = base64Data
        this.resultImage.style.display = 'block'
      } catch (error) {
        alert('无效的Base64图片数据！')
      }
    }

    copyResult() {
      const textToCopy = this.resultOutput.value
      if (!textToCopy) return

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => alert('已复制到剪贴板！'))
        .catch((err) => console.error('复制失败：', err))
    }

    downloadImage() {
      const imgSrc = this.decodedImage.src
      if (!imgSrc) return

      const link = document.createElement('a')
      link.href = imgSrc
      link.download = 'decoded-image.' + this.getImageFormat(imgSrc)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    getImageFormat(dataUrl) {
      const match = dataUrl.match(/^data:image\/(\w+);base64,/)
      return match ? match[1] : 'png'
    }
  }

  // 创建新实例并保存到window对象
  window.base64ImageInstance = new Base64ImageTool()
})()
