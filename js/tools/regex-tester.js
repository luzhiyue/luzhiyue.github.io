;(function () {
  // 如果已经存在实例，先清理
  if (window.regexTesterInstance) {
    const oldInstance = window.regexTesterInstance
    // 清理所有事件监听器
    oldInstance.regexInput?.removeEventListener('input', oldInstance.updateResults)
    oldInstance.testInput?.removeEventListener('input', oldInstance.updateResults)
    oldInstance.flagGlobal?.removeEventListener('change', oldInstance.updateResults)
    oldInstance.flagCase?.removeEventListener('change', oldInstance.updateResults)
    oldInstance.flagMultiline?.removeEventListener('change', oldInstance.updateResults)

    document.querySelectorAll('.reference-item').forEach((item) => {
      item.removeEventListener('click', oldInstance.updateResults)
    })

    window.regexTesterInstance = null
  }

  class RegexTester {
    constructor() {
      this.initElements()
      this.bindEvents()
    }

    initElements() {
      this.regexInput = document.getElementById('regexInput')
      this.testInput = document.getElementById('testInput')
      this.flagGlobal = document.getElementById('flagGlobal')
      this.flagCase = document.getElementById('flagCase')
      this.flagMultiline = document.getElementById('flagMultiline')
      this.matchCount = document.getElementById('matchCount')
      this.highlightedText = document.getElementById('highlightedText')
      this.matchList = document.getElementById('matchList')
    }

    bindEvents() {
      // 输入事件
      this.regexInput.addEventListener('input', () => this.updateResults())
      this.testInput.addEventListener('input', () => this.updateResults())

      // 复选框事件
      this.flagGlobal.addEventListener('change', () => this.updateResults())
      this.flagCase.addEventListener('change', () => this.updateResults())
      this.flagMultiline.addEventListener('change', () => this.updateResults())

      // 参考示例点击事件
      document.querySelectorAll('.reference-item').forEach((item) => {
        item.addEventListener('click', () => {
          this.regexInput.value = item.dataset.pattern
          this.updateResults()
        })
      })
    }

    updateResults() {
      const regexStr = this.regexInput.value
      const testStr = this.testInput.value

      if (!regexStr || !testStr) {
        this.clearResults()
        return
      }

      try {
        // 构建正则表达式
        const flags = this.getFlags()
        const regex = new RegExp(regexStr, flags)

        // 获取所有匹配
        const matches = this.getMatches(regex, testStr)

        // 更新显示
        this.displayResults(matches, testStr)
      } catch (error) {
        this.showError(error.message)
      }
    }

    getFlags() {
      let flags = ''
      if (this.flagGlobal.checked) flags += 'g'
      if (this.flagCase.checked) flags += 'i'
      if (this.flagMultiline.checked) flags += 'm'
      return flags
    }

    getMatches(regex, text) {
      const matches = []
      let match

      if (regex.global) {
        while ((match = regex.exec(text)) !== null) {
          matches.push({
            value: match[0],
            index: match.index,
            groups: match.slice(1),
          })
        }
      } else {
        match = regex.exec(text)
        if (match) {
          matches.push({
            value: match[0],
            index: match.index,
            groups: match.slice(1),
          })
        }
      }

      return matches
    }

    displayResults(matches, text) {
      // 更新匹配数量
      this.matchCount.textContent = matches.length

      // 高亮显示匹配文本
      let highlightedText = text
      let lastIndex = 0
      let result = ''

      matches.forEach((match) => {
        result += this.escapeHtml(text.substring(lastIndex, match.index))
        result += `<span class="highlight">${this.escapeHtml(match.value)}</span>`
        lastIndex = match.index + match.value.length
      })
      result += this.escapeHtml(text.substring(lastIndex))

      this.highlightedText.innerHTML = result

      // 显示匹配列表
      this.matchList.innerHTML = matches
        .map(
          (match, index) => `
        <div class="match-item">
          匹配 ${index + 1}: "${match.value}"
          ${
            match.groups.length
              ? `
            <br>捕获组: ${match.groups
              .map(
                (group, i) => `
              ${i + 1}: "${group}"`
              )
              .join(', ')}
          `
              : ''
          }
        </div>
      `
        )
        .join('')
    }

    escapeHtml(text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    }

    clearResults() {
      this.matchCount.textContent = '0'
      this.highlightedText.innerHTML = ''
      this.matchList.innerHTML = ''
    }

    showError(message) {
      this.clearResults()
      this.highlightedText.innerHTML = `<span style="color: red;">错误: ${message}</span>`
    }
  }

  // 创建新实例并保存到window对象
  window.regexTesterInstance = new RegexTester()
})()
