;(function () {
  // 如果已经存在实例，先销毁
  if (window.textDiffInstance) {
    const instance = window.textDiffInstance
    // 清理事件监听器
    instance.compareBtn?.removeEventListener('click', instance.compareDiff)
    instance.clearBtn?.removeEventListener('click', instance.clearAll)
    instance.originalText?.removeEventListener('input', instance.handleInput)
    instance.compareText?.removeEventListener('input', instance.handleInput)
    instance.ignoreCase?.removeEventListener('change', instance.handleOptionChange)
    instance.ignoreSpace?.removeEventListener('change', instance.handleOptionChange)
    instance.ignoreNewlines?.removeEventListener('change', instance.handleOptionChange)

    window.textDiffInstance = null
  }

  class TextDiffTool {
    constructor() {
      this.initElements()
      this.bindEvents()

      // 绑定方法到实例
      this.handleInput = this.handleInput.bind(this)
      this.handleOptionChange = this.handleOptionChange.bind(this)
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

      // 先分行，再应用选项
      let lines1 = text1.split('\n')
      let lines2 = text2.split('\n')

      // 应用选项到每一行
      lines1 = lines1.map((line) => {
        if (this.ignoreCase.checked) {
          line = line.toLowerCase()
        }
        if (this.ignoreSpace.checked) {
          line = line.replace(/\s+/g, ' ').trim()
        }
        return line
      })

      lines2 = lines2.map((line) => {
        if (this.ignoreCase.checked) {
          line = line.toLowerCase()
        }
        if (this.ignoreSpace.checked) {
          line = line.replace(/\s+/g, ' ').trim()
        }
        return line
      })

      // 如果忽略换行，则将所有行合并
      if (this.ignoreNewlines.checked) {
        lines1 = [lines1.join(' ')]
        lines2 = [lines2.join(' ')]
      }

      const diff = this.computeDiff(lines1, lines2)
      this.displayDiff(diff)
    }

    computeDiff(lines1, lines2) {
      const diff = []
      let i = 0
      let j = 0

      // 创建一个辅助函数来检查两行是否相同
      const linesEqual = (line1, line2) => {
        if (this.ignoreCase.checked) {
          line1 = line1.toLowerCase()
          line2 = line2.toLowerCase()
        }
        if (this.ignoreSpace.checked) {
          line1 = line1.replace(/\s+/g, ' ').trim()
          line2 = line2.replace(/\s+/g, ' ').trim()
        }
        return line1 === line2
      }

      while (i < lines1.length || j < lines2.length) {
        // 如果第一个文本已经到末尾
        if (i >= lines1.length) {
          // 将剩余的第二个文本标记为新增
          while (j < lines2.length) {
            diff.push({ type: 'added', line: lines2[j] })
            j++
          }
          break
        }

        // 如果第二个文本已经到末尾
        if (j >= lines2.length) {
          // 将剩余的第一个文本标记为删除
          while (i < lines1.length) {
            diff.push({ type: 'removed', line: lines1[i] })
            i++
          }
          break
        }

        // 如果两行相同
        if (linesEqual(lines1[i], lines2[j])) {
          diff.push({ type: 'unchanged', line: lines1[i] })
          i++
          j++
          continue
        }

        // 尝试向前查找匹配
        let foundMatch = false
        const lookAhead = 3 // 向前查找的行数

        // 在第二个文本中查找匹配的行
        for (let k = 1; k <= lookAhead && j + k < lines2.length; k++) {
          if (linesEqual(lines1[i], lines2[j + k])) {
            // 将中间的行标记为新增
            for (let l = 0; l < k; l++) {
              diff.push({ type: 'added', line: lines2[j + l] })
            }
            j += k
            foundMatch = true
            break
          }
        }

        // 在第一个文本中查找匹配的行
        if (!foundMatch) {
          for (let k = 1; k <= lookAhead && i + k < lines1.length; k++) {
            if (linesEqual(lines1[i + k], lines2[j])) {
              // 将中间的行标记为删除
              for (let l = 0; l < k; l++) {
                diff.push({ type: 'removed', line: lines1[i + l] })
              }
              i += k
              foundMatch = true
              break
            }
          }
        }

        // 如果没有找到匹配，则标记当前行为修改
        if (!foundMatch) {
          diff.push({ type: 'removed', line: lines1[i] })
          diff.push({ type: 'added', line: lines2[j] })
          i++
          j++
        }
      }

      return diff
    }

    displayDiff(diff) {
      this.diffOutput1.innerHTML = ''
      this.diffOutput2.innerHTML = ''

      let lineNumber1 = 1
      let lineNumber2 = 1

      diff.forEach((item) => {
        const line1 = document.createElement('div')
        const line2 = document.createElement('div')

        line1.className = `diff-line diff-${item.type}`
        line2.className = `diff-line diff-${item.type}`

        // 添加行号
        const lineNum1 = document.createElement('span')
        const lineNum2 = document.createElement('span')
        lineNum1.className = 'line-number'
        lineNum2.className = 'line-number'

        // 添加内容
        const content1 = document.createElement('span')
        const content2 = document.createElement('span')
        content1.className = 'line-content'
        content2.className = 'line-content'

        if (item.type === 'removed') {
          lineNum1.textContent = lineNumber1++
          content1.textContent = item.line || ' '
          line2.style.display = 'none' // 隐藏对应的空行
        } else if (item.type === 'added') {
          lineNum2.textContent = lineNumber2++
          content2.textContent = item.line || ' '
          line1.style.display = 'none' // 隐藏对应的空行
        } else {
          lineNum1.textContent = lineNumber1++
          lineNum2.textContent = lineNumber2++
          content1.textContent = item.line || ' '
          content2.textContent = item.line || ' '
        }

        // 组装行元素
        line1.appendChild(lineNum1)
        line1.appendChild(content1)
        line2.appendChild(lineNum2)
        line2.appendChild(content2)

        this.diffOutput1.appendChild(line1)
        this.diffOutput2.appendChild(line2)
      })
    }

    clearAll() {
      this.originalText.value = ''
      this.compareText.value = ''
      this.diffOutput1.innerHTML = ''
      this.diffOutput2.innerHTML = ''
    }

    handleInput() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => this.compareDiff(false), 300)
    }

    handleOptionChange() {
      this.compareDiff(false)
    }
  }

  // 创建新实例并保存到window对象
  window.textDiffInstance = new TextDiffTool()
})()
