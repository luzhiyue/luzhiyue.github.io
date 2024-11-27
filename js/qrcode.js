document.addEventListener('DOMContentLoaded', function () {
  const textInput = document.getElementById('textInput')
  const generateBtn = document.getElementById('generateBtn')
  const downloadBtn = document.getElementById('downloadBtn')
  const sizeSelect = document.getElementById('sizeSelect')
  const colorPicker = document.getElementById('colorPicker')
  const qrcodeDiv = document.getElementById('qrcode')

  let currentQR = null

  function generateQRCode() {
    const text = textInput.value.trim()
    if (!text) {
      alert('请输入文本或URL')
      return
    }

    // 清除之前的二维码
    qrcodeDiv.innerHTML = ''

    // 生成新的二维码
    const size = parseInt(sizeSelect.value)
    const color = colorPicker.value

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
        function (error, canvas) {
          if (error) {
            console.error('生成二维码出错:', error)
            alert('生成二维码失败')
            return
          }
          // 清除之前的内容并添加新的画布
          qrcodeDiv.innerHTML = ''
          qrcodeDiv.appendChild(canvas)
          currentQR = canvas
        }
      )
    } catch (error) {
      console.error('生成二维码出错:', error)
      alert('生成二维码失败，请检查输入')
    }
  }

  function downloadQRCode() {
    if (!currentQR) {
      alert('请先生成二维码')
      return
    }

    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = currentQR.toDataURL()
    link.click()
  }

  generateBtn.addEventListener('click', generateQRCode)
  downloadBtn.addEventListener('click', downloadQRCode)

  // 当选项改变时自动重新生成二维码
  sizeSelect.addEventListener('change', generateQRCode)
  colorPicker.addEventListener('change', generateQRCode)
})
