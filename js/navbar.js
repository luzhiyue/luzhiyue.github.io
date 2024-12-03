class Navbar {
  constructor() {
    this.setActiveLink()
  }

  setActiveLink() {
    const currentPath = window.location.hash.slice(1) || '/'
    const links = document.querySelectorAll('.nav-link')

    links.forEach((link) => {
      if (
        currentPath === link.getAttribute('href') ||
        (currentPath.includes(link.dataset.page) && link.dataset.page !== 'index')
      ) {
        link.classList.add('active')
      }
    })
  }
}

// 加载导航栏组件
function loadNavbar() {
  fetch('../components/navbar.html')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.text()
    })
    .then((data) => {
      const navbarContainer = document.getElementById('navbar-container')
      if (navbarContainer) {
        navbarContainer.innerHTML = data
        new Navbar()
        // 初始化时钟和设备信息
        initClock()
        initDeviceInfo()
      } else {
        console.error('找不到导航栏容器元素')
      }
    })
    .catch((error) => {
      console.error('加载导航栏组件失败:', error)
    })
}

// 确保在 DOM 加载完成后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadNavbar)
} else {
  loadNavbar()
}
