document.addEventListener('DOMContentLoaded', () => {
  const lengthInput = document.getElementById('length')
  const includeUppercase = document.getElementById('includeUppercase')
  const includeNumbers = document.getElementById('includeNumbers')
  const includeSymbols = document.getElementById('includeSymbols')
  const generateBtn = document.getElementById('generateBtn')
  const passwordOutput = document.getElementById('passwordOutput')
  const copyBtn = document.getElementById('copyBtn')

  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numberChars = '0123456789'
  const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-='

  generateBtn.addEventListener('click', () => {
    const length = parseInt(lengthInput.value)
    let charSet = lowercaseChars
    if (includeUppercase.checked) charSet += uppercaseChars
    if (includeNumbers.checked) charSet += numberChars
    if (includeSymbols.checked) charSet += symbolChars

    let password = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charSet.length)
      password += charSet[randomIndex]
    }
    passwordOutput.value = password
    adjustOutputWidth(password)
  })

  copyBtn.addEventListener('click', () => {
    passwordOutput.select()
    document.execCommand('copy')
    alert('密码已复制到剪贴板')
  })

  function adjustOutputWidth(password) {
    const minWidth = 200 // 初始最小宽度
    const charWidth = 10 // 每个字符的宽度估计
    const newWidth = Math.max(minWidth, password.length * charWidth)
    passwordOutput.style.width = `${newWidth}px`
  }
})
