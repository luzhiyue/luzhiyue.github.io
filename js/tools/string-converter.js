;(function () {
  // 如果已经存在实例，先销毁
  if (window.stringConverterInstance) {
    const inputString = document.getElementById('inputString')
    if (inputString) {
      inputString.removeEventListener('input', window.stringConverterInstance.updateResults)
    }
    window.stringConverterInstance = null
  }

  // 将工具函数和常量移到IIFE内部
  const stringConverters = {
    sentence: (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),
    lower: (str) => str.toLowerCase(),
    upper: (str) => str.toUpperCase(),
    title: (str) =>
      str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
    camel: (str) =>
      str
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
        .replace(/^[A-Z]/, (c) => c.toLowerCase()),
    snake: (str) =>
      str
        .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
        .replace(/^_/, '')
        .replace(/\s+/g, '_')
        .toLowerCase(),
    constant: (str) =>
      str
        .replace(/[A-Z]/g, (letter) => `_${letter}`)
        .toUpperCase()
        .replace(/^_/, '')
        .replace(/\s+/g, '_'),
    kebab: (str) =>
      str
        .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
        .replace(/^-/, '')
        .replace(/\s+/g, '-')
        .toLowerCase(),
    pascal: (str) =>
      str
        .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
        .replace(/\s+/g, ''),
    alternating: (str) =>
      [...str].map((char, i) => (i % 2 ? char.toLowerCase() : char.toUpperCase())).join(''),
    inverseAlternating: (str) =>
      [...str].map((char, i) => (i % 2 ? char.toUpperCase() : char.toLowerCase())).join(''),
  }

  const converterNames = {
    sentence: '句子首字母大写',
    lower: '小写转换',
    upper: '大写转换',
    title: '单词首字母大写',
    camel: '驼峰命名法',
    snake: '蛇形命名',
    constant: '常量大写',
    kebab: '短横线命名',
    pascal: '帕斯卡命名',
    alternating: '交替大小写',
    inverseAlternating: '反向交替大小写',
  }

  function copyText(text, button) {
    navigator.clipboard.writeText(text).then(() => {
      const originalText = button.textContent
      button.textContent = '已复制！'
      setTimeout(() => {
        button.textContent = originalText
      }, 1500)
    })
  }
  // 将copyText暴露到全局作用域，因为HTML中有onclick调用
  window.copyText = copyText

  class StringConverter {
    constructor() {
      this.initComponents()
      this.initConverters()
      this.bindEvents()
    }

    async initComponents() {
      try {
        const headerContainer = document.getElementById('header-container')
        const backButtonContainer = document.getElementById('back-button-container')

        if (headerContainer) {
          const headerResponse = await fetch('components/header.html')
          const headerData = await headerResponse.text()
          headerContainer.innerHTML = headerData
        }

        if (backButtonContainer) {
          const backButtonResponse = await fetch('components/back-button.html')
          const backButtonData = await backButtonResponse.text()
          backButtonContainer.innerHTML = backButtonData
        }
      } catch (error) {
        console.error('加载组件失败:', error)
      }
    }

    initConverters() {
      const resultsDiv = document.getElementById('results')
      if (!resultsDiv) return

      Object.entries(converterNames).forEach(([key, name]) => {
        const resultBox = document.createElement('div')
        resultBox.className = 'result-box'
        resultBox.innerHTML = `
          <h3>
            ${name}
            <button class="copy-btn" onclick="copyText('', this)">复制</button>
          </h3>
          <div class="result-content"></div>
        `
        resultsDiv.appendChild(resultBox)
      })
    }

    bindEvents() {
      const inputString = document.getElementById('inputString')
      if (inputString) {
        inputString.addEventListener('input', (e) => {
          this.updateResults(e.target.value)
        })
      }
    }

    updateResults(input) {
      const resultsDiv = document.getElementById('results')
      if (!resultsDiv) return

      resultsDiv.innerHTML = ''

      Object.entries(stringConverters).forEach(([key, converter]) => {
        const result = converter(input)
        const resultBox = document.createElement('div')
        resultBox.className = 'result-box'
        resultBox.innerHTML = `
          <h3>
            ${converterNames[key]}
            <button class="copy-btn" onclick="copyText('${result}', this)">复制</button>
          </h3>
          <div class="result-content">${result}</div>
        `
        resultsDiv.appendChild(resultBox)
      })
    }
  }

  // 创建新实例并保存到window对象
  window.stringConverterInstance = new StringConverter()
})()
