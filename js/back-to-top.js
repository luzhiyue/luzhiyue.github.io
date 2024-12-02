class BackToTop {
  constructor() {
    this.button = document.getElementById('backToTop')
    this.scrollThreshold = 300 // 滚动多少距离显示按钮
    this.bindEvents()
  }

  bindEvents() {
    // 监听滚动事件
    window.addEventListener('scroll', () => {
      this.toggleButtonVisibility()
    })

    // 点击事件
    this.button.addEventListener('click', () => {
      this.scrollToTop()
    })
  }

  toggleButtonVisibility() {
    if (window.scrollY > this.scrollThreshold) {
      this.button.classList.add('visible')
    } else {
      this.button.classList.remove('visible')
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
}
