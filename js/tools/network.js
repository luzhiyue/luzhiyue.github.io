// 使用立即执行函数来避免全局变量污染
;(function () {
  // 如果已经存在实例，先销毁
  if (window.networkInstance) {
    // 清理事件监听器
    document
      .querySelector('.tool-box:nth-child(1) .tool-btn')
      ?.removeEventListener('click', window.networkInstance.getIPInfo)
    document
      .querySelector('.tool-box:nth-child(2) .tool-btn')
      ?.removeEventListener('click', window.networkInstance.startPing)
    document
      .querySelector('.tool-box:nth-child(3) .tool-btn')
      ?.removeEventListener('click', window.networkInstance.queryDNS)
    document
      .querySelector('.tool-box:nth-child(4) .tool-btn')
      ?.removeEventListener('click', window.networkInstance.checkPort)

    window.networkInstance = null
  }

  class Network {
    constructor() {
      this.initializeElements()
      // 页面加载时自动获取IP信息
      this.getIPInfo()
    }

    initializeElements() {
      // IP信息元素
      this.currentIPElement = document.getElementById('current-ip')
      this.ipLocationElement = document.getElementById('ip-location')

      // Ping测试元素
      this.pingHostInput = document.getElementById('ping-host')
      this.pingResultElement = document.getElementById('ping-result')

      // DNS查询元素
      this.dnsInput = document.getElementById('dns-domain')
      this.dnsResultElement = document.getElementById('dns-result')

      // 端口检测元素
      this.portHostInput = document.getElementById('port-host')
      this.portNumberInput = document.getElementById('port-number')
      this.portResultElement = document.getElementById('port-result')

      // 绑定按钮事件
      this.bindEvents()
    }

    bindEvents() {
      // 替换内联onclick为事件监听器
      document
        .querySelector('.tool-box:nth-child(1) .tool-btn')
        .addEventListener('click', () => this.getIPInfo())

      document
        .querySelector('.tool-box:nth-child(2) .tool-btn')
        .addEventListener('click', () => this.startPing())

      document
        .querySelector('.tool-box:nth-child(3) .tool-btn')
        .addEventListener('click', () => this.queryDNS())

      document
        .querySelector('.tool-box:nth-child(4) .tool-btn')
        .addEventListener('click', () => this.checkPort())
    }

    async getIPInfo() {
      try {
        this.currentIPElement.textContent = '正在获取...'
        this.ipLocationElement.textContent = '正在获取...'

        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()

        this.currentIPElement.textContent = data.ip

        // 获取IP地理位置信息
        const locationResponse = await fetch(`http://ip-api.com/json/${data.ip}`)
        const locationData = await locationResponse.json()

        if (locationData.status === 'success') {
          this.ipLocationElement.textContent = `${locationData.country} ${locationData.regionName} ${locationData.city}`
        } else {
          this.ipLocationElement.textContent = '无法获取位置信息'
        }
      } catch (error) {
        this.currentIPElement.textContent = '获取失败'
        this.ipLocationElement.textContent = '获取失败'
        console.error('获取IP信息失败:', error)
      }
    }

    async startPing() {
      const host = this.pingHostInput.value.trim()
      if (!host) {
        this.pingResultElement.textContent = '请输入有效的域名或IP地址'
        return
      }

      this.pingResultElement.textContent = '正在测试...'
      try {
        // 这里使用简单的fetch请求来模拟ping
        const startTime = performance.now()
        await fetch(`https://${host}`, { mode: 'no-cors' })
        const endTime = performance.now()

        this.pingResultElement.textContent = `响应时间: ${Math.round(endTime - startTime)}ms`
      } catch (error) {
        this.pingResultElement.textContent = '无法连接到目标主机'
      }
    }

    async queryDNS() {
      const domain = this.dnsInput.value.trim()
      if (!domain) {
        this.dnsResultElement.textContent = '请输入有效的域名'
        return
      }

      this.dnsResultElement.textContent = '正在查询...'
      try {
        const response = await fetch(`https://dns.google/resolve?name=${domain}`)
        const data = await response.json()

        if (data.Answer) {
          const results = data.Answer.map(
            (record) => `${record.name} (${record.type}): ${record.data}`
          ).join('\n')
          this.dnsResultElement.textContent = results
        } else {
          this.dnsResultElement.textContent = '未找到DNS记录'
        }
      } catch (error) {
        this.dnsResultElement.textContent = 'DNS查询失败'
      }
    }

    async checkPort() {
      const host = this.portHostInput.value.trim()
      const port = this.portNumberInput.value

      if (!host || !port) {
        this.portResultElement.textContent = '请输入有效的主机和端口'
        return
      }

      this.portResultElement.textContent = '正在检测...'
      try {
        // 注意：实际的端口扫描需要后端支持
        const response = await fetch(`/api/port-check?host=${host}&port=${port}`)
        const data = await response.json()

        this.portResultElement.textContent = data.open
          ? `端口 ${port} 已开放`
          : `端口 ${port} 已关闭`
      } catch (error) {
        this.portResultElement.textContent = '端口检测失败'
      }
    }
  }

  // 创建新实例并保存到window对象
  window.networkInstance = new Network()
})()
