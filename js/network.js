// IP信息获取
async function refreshIPInfo() {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    document.getElementById('current-ip').textContent = data.ip

    // 获取IP地理位置
    const geoResponse = await fetch(`https://ipapi.co/${data.ip}/json/`)
    const geoData = await geoResponse.json()
    document.getElementById(
      'ip-location'
    ).textContent = `${geoData.country_name}, ${geoData.region}, ${geoData.city}`
  } catch (error) {
    document.getElementById('current-ip').textContent = '获取失败'
    document.getElementById('ip-location').textContent = '获取失败'
  }
}

// Ping测试
function startPing() {
  const host = document.getElementById('ping-host').value
  const resultBox = document.getElementById('ping-result')

  if (!host) {
    resultBox.textContent = '请输入域名或IP地址'
    return
  }

  resultBox.textContent = '正在测试...'

  // 使用WebSocket或HTTP请求模拟ping
  const startTime = Date.now()
  fetch(`https://${host}`, { mode: 'no-cors' })
    .then(() => {
      const endTime = Date.now()
      resultBox.textContent = `响应时间: ${endTime - startTime}ms`
    })
    .catch(() => {
      resultBox.textContent = '无法连接到目标主机'
    })
}

// DNS查询
async function queryDNS() {
  const domain = document.getElementById('dns-domain').value
  const resultBox = document.getElementById('dns-result')

  if (!domain) {
    resultBox.textContent = '请输入域名'
    return
  }

  resultBox.textContent = '正在查询...'

  try {
    const response = await fetch(`https://dns.google/resolve?name=${domain}`)
    const data = await response.json()

    if (data.Answer) {
      resultBox.innerHTML = data.Answer.map((record) => `${record.name} -> ${record.data}`).join(
        '<br>'
      )
    } else {
      resultBox.textContent = '未找到DNS记录'
    }
  } catch (error) {
    resultBox.textContent = '查询失败'
  }
}

// 端口检测
function checkPort() {
  const host = document.getElementById('port-host').value
  const port = document.getElementById('port-number').value
  const resultBox = document.getElementById('port-result')

  if (!host || !port) {
    resultBox.textContent = '请输入完整信息'
    return
  }

  resultBox.textContent = '正在检测...'

  // 由于浏览器安全限制，这里只能模拟检测
  const startTime = Date.now()
  fetch(`https://${host}:${port}`, { mode: 'no-cors' })
    .then(() => {
      resultBox.textContent = `端口 ${port} 开放`
    })
    .catch(() => {
      resultBox.textContent = `端口 ${port} 可能关闭或被限制访问`
    })
}

// 页面加载时自动获取IP信息
document.addEventListener('DOMContentLoaded', refreshIPInfo)
