function initDeviceInfo() {
  // 获取设备类型
  const deviceType = getDeviceType()

  // 获取浏览器信息
  const browserInfo = getBrowserInfo()

  // 获取元素并检查是否存在
  const deviceTypeElement = document.querySelector('.device-type')
  const browserInfoElement = document.querySelector('.browser-info')

  // 只在元素存在时更新内容
  if (deviceTypeElement && browserInfoElement) {
    deviceTypeElement.textContent = deviceType
    browserInfoElement.textContent = browserInfo
  }
}

// 获取设备类型函数
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

// 获取浏览器信息函数
function getBrowserInfo() {
  const ua = navigator.userAgent
  let browserInfo = ''

  if (ua.indexOf('Firefox') > -1) {
    browserInfo = 'Firefox'
  } else if (ua.indexOf('Chrome') > -1) {
    browserInfo = 'Chrome'
  } else if (ua.indexOf('Safari') > -1) {
    browserInfo = 'Safari'
  } else if (ua.indexOf('Edge') > -1) {
    browserInfo = 'Edge'
  } else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
    browserInfo = 'IE'
  } else {
    browserInfo = '未知浏览器'
  }

  return browserInfo
}

// 移除直接的事件监听器
// document.addEventListener('DOMContentLoaded', function() {
//     const deviceTypeElement = document.querySelector('.device-type');
//     const browserInfoElement = document.querySelector('.browser-info');
//
//     deviceTypeElement.textContent = getDeviceType();
//     browserInfoElement.textContent = getBrowserInfo();
// });
