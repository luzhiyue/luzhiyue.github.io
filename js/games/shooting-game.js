const canvas = document.getElementById('shooting-canvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let score = 0
let gameInterval
let lastShootTime = 0
const shootCooldown = 300
let isGameRunning = false
let explosionParticles = []
let isGameOver = false

// 背景星星
const stars = Array(200)
  .fill()
  .map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    speed: 0.5 + Math.random() * 1,
  }))

// 添加升级道具类型
const POWERUP_TYPES = {
  DOUBLE_SHOT: 'double',
  TRIPLE_SHOT: 'triple',
  RAPID_FIRE: 'rapid',
  LARGE_BULLET: 'large',
}

// 添加玩家状态
let player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 100,
  width: 40,
  height: 50,
  speed: 6,
  isExploding: false,
  powerups: {
    doubleShot: false,
    tripleShot: false,
    rapidFire: false,
    largeBullet: false,
  },
  powerupTimers: {}, // 存储能力持续时间
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    }
  },
}

let bullets = []
let enemies = []

// 添加道具数组
let powerups = []

// 创建道具
function createPowerup() {
  const types = Object.values(POWERUP_TYPES)
  const type = types[Math.floor(Math.random() * types.length)]
  return {
    x: Math.random() * (canvas.width - 30),
    y: -30,
    width: 30,
    height: 30,
    type: type,
    speed: 2,
  }
}

// 绘制背景
function drawBackground() {
  // 深色宇宙背景
  const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  bgGradient.addColorStop(0, '#0B0B2A')
  bgGradient.addColorStop(1, '#1A1A3A')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 绘制星星
  stars.forEach((star) => {
    const opacity = Math.random() * 0.5 + 0.5
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
    ctx.fill()

    // 星星移动
    star.y += star.speed
    if (star.y > canvas.height) {
      star.y = 0
      star.x = Math.random() * canvas.width
    }
  })

  // 添加星云效果
  const numNebulas = 3
  for (let i = 0; i < numNebulas; i++) {
    const x = (canvas.width / numNebulas) * i + Math.random() * 100
    const y = Math.random() * canvas.height
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 100)
    gradient.addColorStop(0, 'rgba(100, 100, 255, 0.1)')
    gradient.addColorStop(1, 'rgba(100, 100, 255, 0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, 100, 0, Math.PI * 2)
    ctx.fill()
  }
}

// 绘制玩家飞机
function drawPlayer() {
  if (player.isExploding) return

  ctx.save()
  ctx.translate(player.x, player.y)

  // 机身主体 - 使用更精致的设计
  const bodyGradient = ctx.createLinearGradient(
    -player.width / 2,
    0,
    player.width / 2,
    player.height
  )
  bodyGradient.addColorStop(0, '#4A90E2')
  bodyGradient.addColorStop(0.5, '#5CA6E8')
  bodyGradient.addColorStop(1, '#2980B9')

  ctx.fillStyle = bodyGradient
  ctx.beginPath()

  // 机头
  ctx.moveTo(0, -player.height / 2)
  ctx.bezierCurveTo(
    player.width / 4,
    -player.height / 2.2,
    player.width / 3,
    -player.height / 3,
    player.width / 3,
    -player.height / 4
  )

  // 右侧机身
  ctx.bezierCurveTo(
    player.width / 3,
    0,
    player.width / 3,
    player.height / 3,
    player.width / 4,
    player.height / 2
  )

  // 左侧机身（镜像）
  ctx.bezierCurveTo(
    -player.width / 3,
    player.height / 3,
    -player.width / 3,
    0,
    -player.width / 3,
    -player.height / 4
  )

  ctx.bezierCurveTo(
    -player.width / 3,
    -player.height / 3,
    -player.width / 4,
    -player.height / 2.2,
    0,
    -player.height / 2
  )

  ctx.fill()

  // 机翼装饰
  const wingGradient = ctx.createLinearGradient(-player.width / 2, 0, player.width / 2, 0)
  wingGradient.addColorStop(0, '#2980B9')
  wingGradient.addColorStop(1, '#3498DB')
  ctx.fillStyle = wingGradient

  // 左机翼
  ctx.beginPath()
  ctx.moveTo(-player.width / 3, 0)
  ctx.lineTo(-player.width / 1.5, player.height / 4)
  ctx.lineTo(-player.width / 4, player.height / 3)
  ctx.closePath()
  ctx.fill()

  // 右机翼
  ctx.beginPath()
  ctx.moveTo(player.width / 3, 0)
  ctx.lineTo(player.width / 1.5, player.height / 4)
  ctx.lineTo(player.width / 4, player.height / 3)
  ctx.closePath()
  ctx.fill()

  // 驾驶舱
  const cockpitGradient = ctx.createRadialGradient(
    0,
    -player.height / 6,
    0,
    0,
    -player.height / 6,
    player.width / 4
  )
  cockpitGradient.addColorStop(0, '#FFF')
  cockpitGradient.addColorStop(0.4, '#E8F6FF')
  cockpitGradient.addColorStop(1, '#85C1E9')

  ctx.fillStyle = cockpitGradient
  ctx.beginPath()
  ctx.ellipse(0, -player.height / 6, player.width / 5, player.height / 6, 0, 0, Math.PI * 2)
  ctx.fill()

  // 发光效果
  if (isGameRunning) {
    ctx.shadowColor = '#3498DB'
    ctx.shadowBlur = 10
    ctx.strokeStyle = '#85C1E9'
    ctx.lineWidth = 1
    ctx.stroke()

    // 引擎效果
    const engineGlow = ctx.createLinearGradient(0, player.height / 2, 0, player.height / 2 + 20)
    engineGlow.addColorStop(0, '#E74C3C')
    engineGlow.addColorStop(0.3, '#F1C40F')
    engineGlow.addColorStop(1, 'rgba(231, 76, 60, 0)')

    ctx.fillStyle = engineGlow
    ctx.beginPath()
    ctx.moveTo(-player.width / 6, player.height / 2)
    ctx.quadraticCurveTo(
      0,
      player.height / 2 + 15 + Math.random() * 5,
      player.width / 6,
      player.height / 2
    )
    ctx.fill()
  }

  ctx.restore()
}

function createExplosion(x, y) {
  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 2 + Math.random() * 3
    const size = 2 + Math.random() * 3
    explosionParticles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: size,
      alpha: 1,
      color: `hsl(${Math.random() * 30 + 10}, 100%, 50%)`,
    })
  }
}

function updateExplosion() {
  for (let i = explosionParticles.length - 1; i >= 0; i--) {
    const particle = explosionParticles[i]
    particle.x += particle.vx
    particle.y += particle.vy
    particle.alpha -= 0.02

    if (particle.alpha <= 0) {
      explosionParticles.splice(i, 1)
    }
  }
}

function drawExplosion() {
  ctx.save()
  explosionParticles.forEach((particle) => {
    ctx.globalAlpha = particle.alpha
    ctx.fillStyle = particle.color
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.restore()
}

function checkPlayerCollision() {
  if (player.isExploding) return

  const playerBounds = player.getBounds()

  for (let enemy of enemies) {
    const dx = playerBounds.x + playerBounds.width / 2 - (enemy.x + enemy.width / 2)
    const dy = playerBounds.y + playerBounds.height / 2 - (enemy.y + enemy.height / 2)
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < (playerBounds.width + enemy.width) / 2) {
      player.isExploding = true
      createExplosion(
        playerBounds.x + playerBounds.width / 2,
        playerBounds.y + playerBounds.height / 2
      )
      gameOver()
      return
    }
  }
}

function gameOver() {
  isGameRunning = false
  isGameOver = true
  setTimeout(() => {
    clearInterval(gameInterval)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#FFF'
    ctx.font = '48px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('游戏结束', canvas.width / 2, canvas.height / 2)
    ctx.font = '24px Arial'
    ctx.fillText(`最终得分: ${score}`, canvas.width / 2, canvas.height / 2 + 50)
    ctx.fillText('点击"开始游戏"重新开始', canvas.width / 2, canvas.height / 2 + 100)
  }, 1000)
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  drawBackground() // 添加背景

  if (isGameRunning && !player.isExploding) {
    const currentTime = Date.now()
    const shootDelay = player.powerups.rapidFire ? shootCooldown / 2 : shootCooldown

    if (currentTime - lastShootTime >= shootDelay) {
      shootBullets()
      lastShootTime = currentTime
    }
  }

  // 随机生成道具
  if (Math.random() < 0.002) {
    // 调整出现概率
    powerups.push(createPowerup())
  }

  handlePlayerMovement()
  updatePowerups()
  drawPowerups()
  drawPlayer()
  drawBullets()
  drawEnemies()
  drawExplosion()

  if (!isGameOver) {
    moveBullets()
    moveEnemies()
    checkCollisions()
    checkPlayerCollision()
    updateExplosion()
  }

  document.getElementById('score').textContent = score
}

function drawBullets() {
  ctx.save()
  bullets.forEach((bullet) => {
    // 子弹光效
    const gradient = ctx.createRadialGradient(
      bullet.x,
      bullet.y,
      0,
      bullet.x,
      bullet.y,
      bullet.radius * 2
    )
    gradient.addColorStop(0, '#FFF')
    gradient.addColorStop(0.3, '#3498DB')
    gradient.addColorStop(1, 'rgba(52, 152, 219, 0)')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(bullet.x, bullet.y, bullet.radius * 2, 0, Math.PI * 2)
    ctx.fill()

    // 子弹尾迹
    const tailGradient = ctx.createLinearGradient(bullet.x, bullet.y, bullet.x, bullet.y + 10)
    tailGradient.addColorStop(0, 'rgba(52, 152, 219, 0.8)')
    tailGradient.addColorStop(1, 'rgba(52, 152, 219, 0)')

    ctx.fillStyle = tailGradient
    ctx.fillRect(bullet.x - bullet.radius / 2, bullet.y, bullet.radius, 10)
  })
  ctx.restore()
}

function drawEnemies() {
  enemies.forEach((enemy) => {
    ctx.save()

    ctx.fillStyle = '#27AE60'
    ctx.beginPath()
    ctx.moveTo(enemy.x + enemy.width / 2, enemy.y)
    ctx.lineTo(enemy.x + enemy.width, enemy.y + enemy.height * 0.3)
    ctx.lineTo(enemy.x + enemy.width * 0.8, enemy.y + enemy.height)
    ctx.lineTo(enemy.x + enemy.width * 0.2, enemy.y + enemy.height)
    ctx.lineTo(enemy.x, enemy.y + enemy.height * 0.3)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#219A52'
    ctx.beginPath()
    ctx.moveTo(enemy.x + enemy.width * 0.3, enemy.y + enemy.height * 0.4)
    ctx.lineTo(enemy.x + enemy.width * 0.7, enemy.y + enemy.height * 0.4)
    ctx.lineTo(enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.7)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#E8F6FF'
    ctx.beginPath()
    ctx.ellipse(
      enemy.x + enemy.width / 2,
      enemy.y + enemy.height * 0.3,
      enemy.width * 0.15,
      enemy.height * 0.15,
      0,
      0,
      Math.PI * 2
    )
    ctx.fill()

    ctx.restore()
  })
}

function moveBullets() {
  bullets = bullets.filter((bullet) => bullet.y > -bullet.radius)
  bullets.forEach((bullet) => (bullet.y -= bullet.speed))
}

function moveEnemies() {
  enemies = enemies.filter((enemy) => enemy.y < canvas.height)
  enemies.forEach((enemy) => (enemy.y += enemy.speed))
}

function checkCollisions() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i]
    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j]
      const dx = bullet.x - (enemy.x + enemy.width / 2)
      const dy = bullet.y - (enemy.y + enemy.height / 2)
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < bullet.radius + enemy.width / 2) {
        createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2)
        bullets.splice(i, 1)
        enemies.splice(j, 1)
        score += 10
        break
      }
    }
  }
}

function spawnEnemy() {
  const width = 30
  const height = 40
  const x = Math.random() * (canvas.width - width)
  enemies.push({
    x,
    y: -height,
    width,
    height,
    speed: 2 + Math.random() * 2,
  })
}

let keys = {}
document.addEventListener('keydown', (e) => {
  keys[e.key] = true
})

document.addEventListener('keyup', (e) => {
  keys[e.key] = false
})

function handlePlayerMovement() {
  const speed = player.speed

  if (keys['ArrowLeft'] && player.x > 0) {
    player.x -= speed
  }
  if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
    player.x += speed
  }
  if (keys['ArrowUp'] && player.y > 0) {
    player.y -= speed
  }
  if (keys['ArrowDown'] && player.y < canvas.height - player.height) {
    player.y += speed
  }
}

function createBullet(offsetX = 0) {
  return {
    x: player.x + offsetX,
    y: player.y - player.height / 2,
    radius: player.powerups.largeBullet ? 6 : 3,
    speed: 8,
    damage: player.powerups.largeBullet ? 2 : 1,
  }
}

function shootBullets() {
  if (player.powerups.tripleShot) {
    bullets.push(createBullet(0), createBullet(-15), createBullet(15))
  } else if (player.powerups.doubleShot) {
    bullets.push(createBullet(-10), createBullet(10))
  } else {
    bullets.push(createBullet(0))
  }
}

document.getElementById('start-btn').addEventListener('click', () => {
  if (gameInterval) clearInterval(gameInterval)
  score = 0
  bullets = []
  enemies = []
  powerups = []
  explosionParticles = []

  // 重置玩家状态
  player.x = canvas.width / 2 - 20
  player.y = canvas.height - 100
  player.isExploding = false
  player.powerups = {
    doubleShot: false,
    tripleShot: false,
    rapidFire: false,
    largeBullet: false,
  }

  // 清除所有能力计时器
  Object.values(player.powerupTimers).forEach((timer) => clearTimeout(timer))
  player.powerupTimers = {}

  isGameRunning = true
  isGameOver = false

  gameInterval = setInterval(() => {
    update()
    if (Math.random() < 0.03) spawnEnemy()
  }, 1000 / 60)
})

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  player.x = Math.min(player.x, canvas.width - player.width)
  player.y = Math.min(player.y, canvas.height - player.height)
})

// 绘制道具
function drawPowerups() {
  powerups.forEach((powerup) => {
    ctx.save()
    ctx.translate(powerup.x + powerup.width / 2, powerup.y + powerup.height / 2)

    // 旋转效果
    ctx.rotate(Date.now() / 1000)

    // 发光效果
    ctx.shadowColor = getPowerupColor(powerup.type)
    ctx.shadowBlur = 10

    // 绘制道具
    ctx.fillStyle = getPowerupColor(powerup.type)
    ctx.beginPath()
    ctx.moveTo(-15, 0)
    ctx.lineTo(0, -15)
    ctx.lineTo(15, 0)
    ctx.lineTo(0, 15)
    ctx.closePath()
    ctx.fill()

    // 内部装饰
    ctx.fillStyle = '#FFF'
    ctx.beginPath()
    ctx.arc(0, 0, 5, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  })
}

// 获取道具颜色
function getPowerupColor(type) {
  switch (type) {
    case POWERUP_TYPES.DOUBLE_SHOT:
      return '#FFD700' // 金色
    case POWERUP_TYPES.TRIPLE_SHOT:
      return '#FF4500' // 红橙色
    case POWERUP_TYPES.RAPID_FIRE:
      return '#00FF00' // 绿色
    case POWERUP_TYPES.LARGE_BULLET:
      return '#FF1493' // 粉色
    default:
      return '#FFFFFF'
  }
}

// 更新道具
function updatePowerups() {
  // 移动道具
  powerups.forEach((powerup) => {
    powerup.y += powerup.speed
  })

  // 移除超出屏幕的道具
  powerups = powerups.filter((powerup) => powerup.y < canvas.height)

  // 检测碰撞
  const playerBounds = player.getBounds()
  powerups.forEach((powerup, index) => {
    if (checkCollisionWithPlayer(powerup, playerBounds)) {
      activatePowerup(powerup.type)
      powerups.splice(index, 1)
    }
  })
}

// 检测与玩家的碰撞
function checkCollisionWithPlayer(powerup, playerBounds) {
  return (
    powerup.x < playerBounds.x + playerBounds.width &&
    powerup.x + powerup.width > playerBounds.x &&
    powerup.y < playerBounds.y + playerBounds.height &&
    powerup.y + powerup.height > playerBounds.y
  )
}

// 激活道具效果
function activatePowerup(type) {
  const POWERUP_DURATION = 10000 // 10秒

  // 清除之前的计时器
  if (player.powerupTimers[type]) {
    clearTimeout(player.powerupTimers[type])
  }

  // 激活效果
  switch (type) {
    case POWERUP_TYPES.DOUBLE_SHOT:
      player.powerups.doubleShot = true
      player.powerups.tripleShot = false
      break
    case POWERUP_TYPES.TRIPLE_SHOT:
      player.powerups.tripleShot = true
      player.powerups.doubleShot = false
      break
    case POWERUP_TYPES.RAPID_FIRE:
      player.powerups.rapidFire = true
      break
    case POWERUP_TYPES.LARGE_BULLET:
      player.powerups.largeBullet = true
      break
  }

  // 设置定时器
  player.powerupTimers[type] = setTimeout(() => {
    player.powerups[type] = false
  }, POWERUP_DURATION)
}
