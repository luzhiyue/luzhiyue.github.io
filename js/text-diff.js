class TextDiffTool {
  constructor() {
    this.initElements()
    this.bindEvents()
  }

  initElements() {
    this.originalText = document.getElementById('originalText')
    this.compareText = document.getElementById('compareText')
    this.diffOutput1 = document.getElementById('diffOutput1')
    this.diffOutput2 = document.getElementById('diffOutput2')
    this.compareBtn = document.getElementById('compareBtn')
    this.clearBtn = document.getElementById('clearBtn')
    this.ignoreCase = document.getElementById('ignoreCase')
    this.ignoreSpace = document.getElementById('ignoreSpace')
    this.ignoreNewlines = document.getElementById('ignoreNewlines')
  }

  bindEvents() {
    this.compareBtn.addEventListener('click', () => this.compareDiff(true))
    this.clearBtn.addEventListener('click', () => this.clearAll())

    this.originalText.addEventListener('input', () => {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => this.compareDiff(false), 300)
    })

    this.compareText.addEventListener('input', () => {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => this.compareDiff(false), 300)
    })

    this.ignoreCase.addEventListener('change', () => this.compareDiff(false))
    this.ignoreSpace.addEventListener('change', () => this.compareDiff(false))
    this.ignoreNewlines.addEventListener('change', () => this.compareDiff(false))
  }

  compareDiff(showAlert = false) {
    let text1 = this.originalText.value
    let text2 = this.compareText.value

    if (showAlert && (!text1 || !text2)) {
      alert('请输入需要比较的文本')
      return
    }

    // 应用选项
    if (this.ignoreCase.checked) {
      text1 = text1.toLowerCase()
      text2 = text2.toLowerCase()
    }
    if (this.ignoreSpace.checked) {
      text1 = text1.replace(/\s+/g, ' ').trim()
      text2 = text2.replace(/\s+/g, ' ').trim()
    }
    if (this.ignoreNewlines.checked) {
      text1 = text1.replace(/\n/g, ' ')
      text2 = text2.replace(/\n/g, ' ')
    }

    const lines1 = text1.split('\n')
    const lines2 = text2.split('\n')
    const diff = this.computeDiff(lines1, lines2)
    this.displayDiff(diff)
  }

  computeDiff(lines1, lines2) {
    const diff = []
    let i = 0,
      j = 0

    while (i < lines1.length || j < lines2.length) {
      if (i >= lines1.length) {
        // 剩余的行都是新增的
        diff.push({ type: 'added', line: lines2[j] })
        j++
      } else if (j >= lines2.length) {
        // 剩余的行都是删除的
        diff.push({ type: 'removed', line: lines1[i] })
        i++
      } else if (lines1[i] === lines2[j]) {
        // 行相同
        diff.push({ type: 'unchanged', line: lines1[i] })
        i++
        j++
      } else {
        // 行不同
        diff.push({ type: 'removed', line: lines1[i] })
        diff.push({ type: 'added', line: lines2[j] })
        i++
        j++
      }
    }

    return diff
  }

  displayDiff(diff) {
    this.diffOutput.innerHTML = ''
    diff.forEach((item) => {
      const line = document.createElement('div')
      line.className = `diff-line diff-${item.type}`
      line.textContent = item.line
      this.diffOutput.appendChild(line)
    })
  }

  clearAll() {
    this.originalText.value = ''
    this.compareText.value = ''
    this.diffOutput.innerHTML = ''
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  new TextDiffTool()
})
