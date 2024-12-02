function updateClock() {
  const now = new Date()
  const timeElement = document.querySelector('.time')
  const dateElement = document.querySelector('.date')

  // 格式化时间
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  // 格式化日期
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekDay = weekDays[now.getDay()]

  // 添加判断，确保元素存在
  if (timeElement && dateElement) {
    timeElement.textContent = `${hours}:${minutes}:${seconds}`
    dateElement.textContent = `${year}年${month}月${day}日 ${weekDay}`
  }
}

// 修改初始化方式
function initClock() {
  // 立即更新一次
  updateClock()
  // 设置定时器
  setInterval(updateClock, 1000)
}

// 移除这里的直接调用
// document.addEventListener('DOMContentLoaded', updateClock);
// setInterval(updateClock, 1000);
