class HashGenerator {
  constructor() {
    this.initElements()
    this.bindEvents()
  }

  initElements() {
    this.inputText = document.getElementById('inputText')
    this.fileInput = document.getElementById('fileInput')
    this.dropZone = document.getElementById('dropZone')
    this.hashResults = {
      md5: document.getElementById('md5Result'),
      sha1: document.getElementById('sha1Result'),
      sha256: document.getElementById('sha256Result'),
      sha512: document.getElementById('sha512Result'),
    }
  }

  bindEvents() {
    // 文本输入事件
    this.inputText.addEventListener('input', () => this.generateHash())

    // 文件拖放事件
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
      if (file) this.processFile(file)
    })

    // 复制按钮事件
    document.querySelectorAll('.copy-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target)
        input.select()
        document.execCommand('copy')
        const originalText = btn.textContent
        btn.textContent = '已复制'
        setTimeout(() => (btn.textContent = originalText), 1500)
      })
    })
  }

  generateHash(text = this.inputText.value) {
    if (!text) {
      Object.values(this.hashResults).forEach((input) => (input.value = ''))
      return
    }

    this.hashResults.md5.value = CryptoJS.MD5(text).toString()
    this.hashResults.sha1.value = CryptoJS.SHA1(text).toString()
    this.hashResults.sha256.value = CryptoJS.SHA256(text).toString()
    this.hashResults.sha512.value = CryptoJS.SHA512(text).toString()
  }

  handleFileSelect(event) {
    const file = event.target.files[0]
    if (file) this.processFile(file)
  }

  processFile(file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const wordArray = CryptoJS.lib.WordArray.create(e.target.result)
      this.hashResults.md5.value = CryptoJS.MD5(wordArray).toString()
      this.hashResults.sha1.value = CryptoJS.SHA1(wordArray).toString()
      this.hashResults.sha256.value = CryptoJS.SHA256(wordArray).toString()
      this.hashResults.sha512.value = CryptoJS.SHA512(wordArray).toString()
    }
    reader.readAsArrayBuffer(file)
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  new HashGenerator()
})