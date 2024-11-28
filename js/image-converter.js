class ImageConverter {
  constructor() {
    this.initElements()
    this.bindEvents()
    this.originalImage = null
  }

  initElements() {
    this.dropZone = document.getElementById('dropZone')
    this.fileInput = document.getElementById('fileInput')
    this.previewImage = document.getElementById('previewImage')
    this.originalFormat = document.getElementById('originalFormat')
    this.fileSize = document.getElementById('fileSize')
    this.targetFormat = document.getElementById('targetFormat')
    this.quality = document.getElementById('quality')
    this.qualityValue = document.getElementById('qualityValue')
    this.workspace = document.querySelector('.image-workspace')
  }

  bindEvents() {
    // 文件选择事件
    this.dropZone.addEventListener('click', () => this.fileInput.click())
    this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e))

    // 拖放事件
    this.dropZone.addEventListener('dragover', (e) => {
      e.preventDefault()
      this.dropZone.classList.add('dragover')
    })

    this.dropZone.addEventListener('dragleave', () => {
      this.dropZone.classList.remove('dragover')
    })

    this.dropZone.addEventListener('drop', (e) => {
      e.preventDefault()
      this.dropZone.classList.remove('dragover')
      const files = e.dataTransfer.files
      if (files.length) {
        this.fileInput.files = files
        this.handleFileSelect({ target: this.fileInput })
      }
    })

    // 质量滑块事件
    this.quality.addEventListener('input', () => {
      this.qualityValue.textContent = `${this.quality.value}%`
    })

    // 格式选择事件
    this.targetFormat.addEventListener('change', () => {
      const showQuality = this.targetFormat.value !== 'png'
      document.getElementById('qualityControl').style.display = showQuality ? 'flex' : 'none'
    })
  }

  handleFileSelect(event) {
    const file = event.target.files[0]
    if (!file) return

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    // 显示文件信息
    this.originalFormat.textContent = file.type.split('/')[1].toUpperCase()
    this.fileSize.textContent = this.formatFileSize(file.size)

    // 预览图片
    const reader = new FileReader()
    reader.onload = (e) => {
      this.previewImage.src = e.target.result
      this.originalImage = e.target.result
      this.workspace.style.display = 'grid'
    }
    reader.readAsDataURL(file)
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

// 全局函数
function resetImage() {
  const converter = window.imageConverter
  if (converter.originalImage) {
    converter.previewImage.src = converter.originalImage
    converter.quality.value = 90
    converter.qualityValue.textContent = '90%'
    converter.targetFormat.value = 'jpeg'
    document.getElementById('qualityControl').style.display = 'flex'
  }
}

function convertImage() {
  const converter = window.imageConverter
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()

  img.onload = function () {
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)

    const format = converter.targetFormat.value
    const quality = converter.quality.value / 100

    converter.previewImage.src = canvas.toDataURL(`image/${format}`, quality)
  }

  img.src = converter.previewImage.src
}

function downloadImage() {
  const converter = window.imageConverter
  const format = converter.targetFormat.value
  const extension = format === 'jpeg' ? 'jpg' : format

  const link = document.createElement('a')
  link.download = `converted_image.${extension}`
  link.href = converter.previewImage.src
  link.click()
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  window.imageConverter = new ImageConverter()
})
