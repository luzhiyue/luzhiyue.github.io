class DiceGame {
  constructor() {
    this.dice1 = document.getElementById('dice1')
    this.dice2 = document.getElementById('dice2')
    this.dice3 = document.getElementById('dice3')
    this.rollButton = document.getElementById('roll-btn')
    this.resultDisplay = document.getElementById('result')
    this.isRolling = false
    this.lastResults = [1, 1, 1] // 存储上一次的结果

    this.rollButton.addEventListener('click', () => this.rollAllDice())

    // 初始化骰子显示
    this.initializeDice()
  }

  initializeDice() {
    const dices = [this.dice1, this.dice2, this.dice3]
    dices.forEach((dice, index) => {
      // 设置初始旋转状态
      this.setDiceFace(dice, this.lastResults[index])
    })
  }

  async rollAllDice() {
    if (this.isRolling) return
    this.isRolling = true
    this.rollButton.disabled = true
    this.resultDisplay.textContent = ''

    // 生成新的结果
    const results = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
    ]

    const dices = [this.dice1, this.dice2, this.dice3]

    // 从当前状态开始动画
    const animations = dices.map((dice, index) => {
      const keyframes = this.generateComplexRotationKeyframes(
        this.lastResults[index], // 开始状态
        results[index] // 结束状态
      )
      return dice.animate(keyframes, {
        duration: 2000,
        easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)',
        fill: 'forwards',
      })
    })

    // 等待所有动画完成
    await Promise.all(animations.map((animation) => animation.finished))

    // 更新最后的结果
    this.lastResults = [...results]

    // 显示结果
    const total = results.reduce((a, b) => a + b, 0)
    this.resultDisplay.innerHTML = `
            <div class="result-animation">
                <span class="result-number">${results.join(' + ')}</span>
                <span class="result-equals">=</span>
                <span class="result-total">${total}</span>
            </div>
        `

    this.isRolling = false
    this.rollButton.disabled = false
  }

  generateComplexRotationKeyframes(startNumber, endNumber) {
    const keyframes = []
    const steps = 20

    // 获取开始和结束的旋转状态
    const startRotation = this.getFinalRotation(startNumber)
    const endRotation = this.getFinalRotation(endNumber)

    // 添加开始状态
    keyframes.push({
      transform: startRotation,
      offset: 0,
    })

    // 生成中间状态
    for (let i = 1; i < steps; i++) {
      const progress = i / steps
      const xRotation = Math.sin(progress * Math.PI * 4) * 360
      const yRotation = Math.cos(progress * Math.PI * 3) * 360
      const zRotation = Math.sin(progress * Math.PI * 2) * 180

      const randomX = Math.random() * 30 - 15
      const randomY = Math.random() * 30 - 15
      const randomZ = Math.random() * 30 - 15

      keyframes.push({
        transform: `rotateX(${xRotation + randomX}deg) 
                           rotateY(${yRotation + randomY}deg) 
                           rotateZ(${zRotation + randomZ}deg)`,
        offset: progress,
        easing: 'ease-out',
      })
    }

    // 添加结束状态
    keyframes.push({
      transform: endRotation,
      offset: 1,
    })

    return keyframes
  }

  getFinalRotation(number) {
    // 为每个点数定义最终的3D旋转状态
    const rotations = {
      1: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
      2: 'rotateX(-90deg) rotateY(0deg) rotateZ(0deg)',
      3: 'rotateX(0deg) rotateY(-90deg) rotateZ(0deg)',
      4: 'rotateX(0deg) rotateY(90deg) rotateZ(0deg)',
      5: 'rotateX(90deg) rotateY(0deg) rotateZ(0deg)',
      6: 'rotateX(180deg) rotateY(0deg) rotateZ(0deg)',
    }
    return rotations[number]
  }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
  new DiceGame()
})
