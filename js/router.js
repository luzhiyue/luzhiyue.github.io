class Router {
  constructor(routes) {
    this.routes = routes
    this.contentDiv = document.getElementById('content')
    this.loadedScripts = new Set()
    this.loadedStyles = new Set()

    document.addEventListener('click', (e) => {
      if (e.target.matches('.nav-link') || e.target.closest('.nav-link')) {
        e.preventDefault()
        const link = e.target.closest('.nav-link')
        const path = link.getAttribute('href')
        this.navigate(path)
      }
    })

    window.addEventListener('popstate', () => {
      this.handleLocation()
    })
    window.addEventListener('hashchange', function () {
      // 页面刷新
      window.location.reload()
    })

    // 修改初始加载逻辑
    const currentPath = window.location.hash.slice(1) || '/'
    if (currentPath === '/index.html') {
      this.navigate('/')
    } else {
      // 处理尾部斜杠
      if (currentPath !== '/' && currentPath.endsWith('/')) {
        this.navigate(currentPath.slice(0, -1))
      } else {
        // 直接处理当前路径
        this.handleLocation()
        // 确保导航栏状态正确
        this.updateActiveNav(currentPath)
      }
    }
  }

  async loadContent(path) {
    try {
      // 确保路径以 / 开头
      const templatePath = path.startsWith('/') ? path : `/${path}`

      const response = await fetch(templatePath)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const html = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      return doc.querySelector('section') || doc.body
    } catch (error) {
      return this.load404Content()
    }
  }

  async handleLocation() {
    // 从 hash 中获取路径
    const path = window.location.hash.slice(1) || '/'

    const route = this.routes[path] || this.routes['/404']

    try {
      const content = await this.loadContent(route.template)
      if (content) {
        this.cleanupPageInstances()
        this.contentDiv.innerHTML = ''

        // 如果是工具页面，添加返回按钮
        if (path.startsWith('/tools/') && path !== '/tools') {
          const backButton = await this.loadToolsBackButton()
          if (backButton) {
            this.contentDiv.appendChild(backButton)
          }
        }

        // 如果是游戏页面，添加返回按钮
        if (path.startsWith('/games/') && path !== '/games') {
          const backButton = await this.loadGamesBackButton()
          if (backButton) {
            this.contentDiv.appendChild(backButton)
          }
        }

        this.contentDiv.appendChild(content)
        document.title = route.title

        this.updateActiveNav(path)

        // 加载样式
        if (route.styles) {
          for (const style of route.styles) {
            await this.loadStyle(style)
          }
        }

        // 加载脚本
        if (route.scripts) {
          for (const script of route.scripts) {
            await this.loadScript(script)
          }
        }
      }
    } catch (error) {
      const notFoundContent = await this.load404Content()
      this.contentDiv.innerHTML = ''
      this.contentDiv.appendChild(notFoundContent)
      document.title = '页面未找到'
    }
  }

  // 修改事件委托处理
  updateActiveNav(path) {
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.remove('active')
    })

    // 为当前路径的导航项添加激活状态
    document.querySelectorAll('.nav-link').forEach((link) => {
      const href = link.getAttribute('href')
      if (path.startsWith('/tools/') && href === '/tools') {
        // 如果是工具子页面，保持工具导航项的激活状态
        link.classList.add('active')
      } else if (href === path) {
        link.classList.add('active')
      }
    })
  }

  navigate(path) {
    // 使用 hash 进行导航
    window.location.hash = path
  }

  async loadScript(src) {
    if (this.loadedScripts.has(src)) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        this.loadedScripts.add(src)
        resolve()
      }
      script.onerror = reject
      document.body.appendChild(script)
    })
  }

  cleanupPageInstances() {
    if (window.weatherApp) {
      window.weatherApp = null
    }
    if (window.calendar) {
      window.calendar = null
    }
  }

  async loadStyle(href) {
    if (this.loadedStyles.has(href)) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.onload = () => {
        this.loadedStyles.add(href)
        resolve()
      }
      link.onerror = reject
      document.head.appendChild(link)
    })
  }

  async load404Content() {
    const content = document.createElement('section')
    content.className = 'error-section'
    content.innerHTML = `
      <div class="container">
        <h1>404</h1>
        <p>页面未找到</p>
        <a href="/" class="nav-link">返回首页</a>
      </div>
    `
    return content
  }

  // 添加加载返回按钮的方法
  async loadToolsBackButton() {
    try {
      const response = await fetch('/templates/tools/back-button.html')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const html = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      // 添加 nav-link 类以支持路由
      const backButton = doc.querySelector('.back-button')
      if (backButton) {
        backButton.classList.add('nav-link')
      }

      // 返回包含样式和按钮的容器
      const container = document.createElement('div')
      container.innerHTML = html
      return container
    } catch (error) {
      return null
    }
  }
  async loadGamesBackButton() {
    try {
      const response = await fetch('/templates/games/back-button.html')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const html = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      // 添加 nav-link 类以支持路由
      const backButton = doc.querySelector('.back-button')
      if (backButton) {
        backButton.classList.add('nav-link')
      }

      // 返回包含样式和按钮的容器
      const container = document.createElement('div')
      container.innerHTML = html
      return container
    } catch (error) {
      return null
    }
  }
}
