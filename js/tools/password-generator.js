;(function () {
  // 如果已经存在实例，先销毁
  if (window.passwordGeneratorInstance) {
    window.passwordGeneratorInstance.generateBtn?.removeEventListener(
      'click',
      window.passwordGeneratorInstance.generatePassword
    )
    window.passwordGeneratorInstance.copyBtn?.removeEventListener(
      'click',
      window.passwordGeneratorInstance.copyPassword
    )

    window.passwordGeneratorInstance = null
  }

  class PasswordGenerator {
    constructor() {
      this.initElements()
      this.bindEvents()
      this.generatePassword() // 初始生成一个密码
    }

    initElements() {
      this.lengthInput = document.getElementById('length')
      this.includeUppercase = document.getElementById('includeUppercase')
      this.includeNumbers = document.getElementById('includeNumbers')
      this.includeSymbols = document.getElementById('includeSymbols')
      this.generateBtn = document.getElementById('generateBtn')
      this.passwordOutput = document.getElementById('passwordOutput')
      this.copyBtn = document.getElementById('copyBtn')

      this.lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
      this.uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      this.numberChars = '0123456789'
      this.symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-='
    }

    bindEvents() {
      this.generatePassword = this.generatePassword.bind(this)
      this.copyPassword = this.copyPassword.bind(this)

      this.generateBtn.addEventListener('click', this.generatePassword)
      this.copyBtn.addEventListener('click', this.copyPassword)
    }

    generatePassword() {
      const length = parseInt(this.lengthInput.value)
      let charSet = this.lowercaseChars
      if (this.includeUppercase.checked) charSet += this.uppercaseChars
      if (this.includeNumbers.checked) charSet += this.numberChars
      if (this.includeSymbols.checked) charSet += this.symbolChars

      let password = ''
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charSet.length)
        password += charSet[randomIndex]
      }
      this.passwordOutput.value = password
      this.adjustOutputWidth(password)
    }

    copyPassword() {
      this.passwordOutput.select()
      document.execCommand('copy')
      alert('密码已复制到剪贴板')
    }

    adjustOutputWidth(password) {
      const minWidth = 200
      const charWidth = 10
      const newWidth = Math.max(minWidth, password.length * charWidth)
      this.passwordOutput.style.width = `${newWidth}px`
    }
  }

  // 创建新实例并保存到window对象
  window.passwordGeneratorInstance = new PasswordGenerator()
})()
