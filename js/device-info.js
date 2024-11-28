document.addEventListener('DOMContentLoaded', function () {
  const deviceTypeElement = document.querySelector('.device-type')
  const browserInfoElement = document.querySelector('.browser-info')

  // 获取设备类型
  function getDeviceType() {
    const ua = navigator.userAgent
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return '平板设备'
    }
    if (
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return '移动设备'
    }
    return '桌面设备'
  }

  // 获取浏览器信息
  function getBrowserInfo() {
    const ua = navigator.userAgent
    let browserName = '未知浏览器'
    let browserVersion = ''

    if (ua.indexOf('Chrome') > -1) {
      browserName = 'Chrome'
      browserVersion = ua.match(/Chrome\/(\d+)/)[1]
    } else if (ua.indexOf('Firefox') > -1) {
      browserName = 'Firefox'
      browserVersion = ua.match(/Firefox\/(\d+)/)[1]
    } else if (ua.indexOf('Safari') > -1) {
      browserName = 'Safari'
      browserVersion = ua.match(/Version\/(\d+)/)[1]
    } else if (ua.indexOf('Edge') > -1) {
      browserName = 'Edge'
      browserVersion = ua.match(/Edge\/(\d+)/)[1]
    }

    return `${browserName} ${browserVersion}`
  }

  // 更新显示
  deviceTypeElement.textContent = getDeviceType()
  browserInfoElement.textContent = getBrowserInfo()
})
