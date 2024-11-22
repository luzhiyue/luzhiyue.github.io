let originalImage = null
let currentImage = null
let cropper = null
let startCropBtn, applyCropBtn, cancelCropBtn

// 初始化事件监听
document.addEventListener('DOMContentLoaded', function () {
  const dropZone = document.getElementById('dropZone')
  const fileInput = document.getElementById('fileInput')

  // 点击上传
  dropZone.addEventListener('click', () => fileInput.click())

  // 文件选择
  fileInput.addEventListener('change', handleFileSelect)

  // 拖拽上传
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault()
    dropZone.classList.add('dragover')
  })

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover')
  })

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault()
    dropZone.classList.remove('dragover')
    handleFiles(e.dataTransfer.files)
  })

  // 尺寸联动
  const widthInput = document.getElementById('width')
  const heightInput = document.getElementById('height')
  const keepRatioCheckbox = document.getElementById('keepRatio')

  widthInput.addEventListener('input', () => {
    if (keepRatioCheckbox.checked && originalImage) {
      const ratio = originalImage.height / originalImage.width
      heightInput.value = Math.round(widthInput.value * ratio)
    }
  })

  heightInput.addEventListener('input', () => {
    if (keepRatioCheckbox.checked && originalImage) {
      const ratio = originalImage.width / originalImage.height
      widthInput.value = Math.round(heightInput.value * ratio)
    }
  })

  // 实时预览效果
  const effectInputs = ['brightness', 'contrast', 'saturation']
  effectInputs.forEach((effect) => {
    document.getElementById(effect).addEventListener('input', updatePreview)
  })

  // 显示质量值
  document.getElementById('quality').addEventListener('input', function () {
    document.getElementById('qualityValue').textContent = this.value + '%'
  })

  // 初始化裁剪按钮
  startCropBtn = document.getElementById('startCropBtn')
  applyCropBtn = document.getElementById('applyCropBtn')
  cancelCropBtn = document.getElementById('cancelCropBtn')

  // 添加裁剪按钮事件监听
  if (startCropBtn) startCropBtn.addEventListener('click', startCrop)
  if (applyCropBtn) applyCropBtn.addEventListener('click', applyCrop)
  if (cancelCropBtn) cancelCropBtn.addEventListener('click', cancelCrop)
})

// 处理文件选择
function handleFileSelect(e) {
  handleFiles(e.target.files)
}

// 处理文件
function handleFiles(files) {
  if (files.length === 0) return

  const file = files[0]
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件！')
    return
  }

  // 显示文件信息
  document.getElementById('fileSize').textContent = formatFileSize(file.size)

  const reader = new FileReader()
  reader.onload = function (e) {
    const img = new Image()
    img.onload = function () {
      originalImage = img
      currentImage = img

      // 更新尺寸输入框
      document.getElementById('width').value = img.width
      document.getElementById('height').value = img.height

      // 显示原始尺寸
      document.getElementById('originalSize').textContent = `${img.width} x ${img.height}`

      // 显示预览
      document.getElementById('previewImage').src = e.target.result
      document.querySelector('.image-workspace').style.display = 'grid'
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

// 更新预览效果
function updatePreview() {
  if (!currentImage) return

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = currentImage.width
  canvas.height = currentImage.height

  // 应用效果
  const brightness = document.getElementById('brightness').value / 100
  const contrast = document.getElementById('contrast').value / 100
  const saturation = document.getElementById('saturation').value / 100

  ctx.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`
  ctx.drawImage(currentImage, 0, 0)

  document.getElementById('previewImage').src = canvas.toDataURL()
}

// 处理图片
function processImage() {
  if (cropper) return
  if (!currentImage) return

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // 设置尺寸
  const width = parseInt(document.getElementById('width').value)
  const height = parseInt(document.getElementById('height').value)
  canvas.width = width
  canvas.height = height

  // 应用效果
  const brightness = document.getElementById('brightness').value / 100
  const contrast = document.getElementById('contrast').value / 100
  const saturation = document.getElementById('saturation').value / 100

  ctx.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`
  ctx.drawImage(currentImage, 0, 0, width, height)

  // 更新预览
  document.getElementById('previewImage').src = canvas.toDataURL()
}

// 重置图片
function resetImage() {
  if (!originalImage) return

  // 如果正在裁剪，先清理裁剪器
  if (cropper) {
    cleanupCropper()
  }

  // 重置尺寸
  document.getElementById('width').value = originalImage.width
  document.getElementById('height').value = originalImage.height

  // 重置效果
  document.getElementById('brightness').value = 100
  document.getElementById('contrast').value = 100
  document.getElementById('saturation').value = 100

  // 重置预览
  const previewImage = document.getElementById('previewImage')
  previewImage.src = originalImage.src
  currentImage = originalImage

  // 确保裁剪按钮可见
  if (startCropBtn) startCropBtn.style.display = 'block'
}

// 下载图片
function downloadImage() {
  if (cropper) return
  if (!currentImage) return

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // 设置尺寸和效果
  const width = parseInt(document.getElementById('width').value)
  const height = parseInt(document.getElementById('height').value)
  canvas.width = width
  canvas.height = height

  const brightness = document.getElementById('brightness').value / 100
  const contrast = document.getElementById('contrast').value / 100
  const saturation = document.getElementById('saturation').value / 100

  ctx.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`
  ctx.drawImage(currentImage, 0, 0, width, height)

  // 获取格式和质量
  const format = document.getElementById('format').value
  const quality = document.getElementById('quality').value / 100

  // 创建下载链接
  const link = document.createElement('a')
  link.download = `processed_image.${format}`
  link.href = canvas.toDataURL(`image/${format}`, quality)
  link.click()
}

// 格式化文件大小
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 开始裁剪
function startCrop() {
  if (!currentImage) return

  const previewContainer = document.querySelector('.preview-container')
  const previewImage = document.getElementById('previewImage')

  // 显示/隐藏相应按钮
  startCropBtn.style.display = 'none'
  applyCropBtn.style.display = 'block'
  cancelCropBtn.style.display = 'block'

  // 显示裁剪选项
  document.querySelector('.crop-options').style.display = 'block'

  // 添加裁剪类
  previewContainer.classList.add('cropping')

  // 创建新图片用于裁剪
  const img = new Image()
  img.onload = function () {
    // 初始化裁剪器
    cropper = new Cropper(previewImage, {
      aspectRatio: NaN,
      viewMode: 1,
      guides: true,
      center: true,
      highlight: false,
      cropBoxMovable: true,
      cropBoxResizable: true,
      toggleDragModeOnDblclick: true,
    })
  }
  img.src = previewImage.src
}

// 应用裁剪
function applyCrop() {
  if (!cropper) return

  // 获取裁剪后的canvas
  const canvas = cropper.getCroppedCanvas()
  if (!canvas) return

  // 更新预览图
  const previewImage = document.getElementById('previewImage')
  previewImage.src = canvas.toDataURL()

  // 更新当前图片
  const img = new Image()
  img.onload = function () {
    currentImage = img
    // 更新尺寸输入框
    document.getElementById('width').value = img.width
    document.getElementById('height').value = img.height
  }
  img.src = canvas.toDataURL()

  // 清理裁剪器
  cleanupCropper()
}

// 取消裁剪
function cancelCrop() {
  cleanupCropper()
}

// 清理裁剪器
function cleanupCropper() {
  if (cropper) {
    cropper.destroy()
    cropper = null
  }

  // 重置按钮状态
  if (startCropBtn) startCropBtn.style.display = 'block'
  if (applyCropBtn) applyCropBtn.style.display = 'none'
  if (cancelCropBtn) cancelCropBtn.style.display = 'none'

  // 隐藏裁剪选项
  const cropOptions = document.querySelector('.crop-options')
  if (cropOptions) cropOptions.style.display = 'none'

  // 移除裁剪类
  const previewContainer = document.querySelector('.preview-container')
  if (previewContainer) previewContainer.classList.remove('cropping')
}
