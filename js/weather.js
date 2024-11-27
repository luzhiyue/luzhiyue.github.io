class WeatherApp {
  constructor() {
    this.API_KEY = 'b1810ac0064baf1fe8ebc28f16a81145' // 需要替换为实际的API密钥
    this.searchInput = document.getElementById('searchInput')
    this.searchBtn = document.getElementById('searchBtn')

    this.setupEventListeners()
    this.getCurrentLocation()
    this.updateDateTime()
    setInterval(() => this.updateDateTime(), 1000)
  }

  setupEventListeners() {
    this.searchBtn.addEventListener('click', () => this.searchWeather())
    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.searchWeather()
    })
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => this.getWeatherByCoords(position.coords),
        (error) => {
          console.error('Error getting location:', error)
          this.getWeatherByCity('北京') // 默认城市
        }
      )
    } else {
      this.getWeatherByCity('北京') // 默认城市
    }
  }

  async getWeatherByCoords(coords) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${this.API_KEY}&units=metric&lang=zh_cn`
      )
      const data = await response.json()
      this.updateUI(data)
    } catch (error) {
      console.error('Error fetching weather:', error)
      this.showError('获取天气信息失败')
    }
  }

  async getWeatherByCity(city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.API_KEY}&units=metric&lang=zh_cn`
      )
      const data = await response.json()
      if (response.ok) {
        this.updateUI(data)
      } else {
        this.showError('未找到该城市')
      }
    } catch (error) {
      console.error('Error fetching weather:', error)
      this.showError('获取天气信息失败')
    }
  }

  searchWeather() {
    const city = this.searchInput.value.trim()
    if (city) {
      this.getWeatherByCity(city)
    }
  }

  updateDateTime() {
    const now = new Date()
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
    document.querySelector('.date').textContent = now.toLocaleDateString('zh-CN', options)
  }

  updateUI(data) {
    // 更新位置
    document.querySelector('.location h2').textContent = data.name

    // 更新温度
    document.querySelector('.temp').textContent = Math.round(data.main.temp)

    // 更新天气描述
    document.querySelector('.weather-description span').textContent = data.weather[0].description

    // 更新天气图标
    const iconElement = document.querySelector('.weather-icon i')
    iconElement.className = this.getWeatherIcon(data.weather[0].id)

    // 更新详细信息
    document.querySelector('.humidity').textContent = `${data.main.humidity}%`
    document.querySelector('.wind').textContent = `${data.wind.speed} m/s`
    document.querySelector('.pressure').textContent = `${data.main.pressure} hPa`
  }

  getWeatherIcon(code) {
    // 根据OpenWeather的天气代码返回对应的weather-icons类名
    const icons = {
      200: 'wi wi-thunderstorm',
      300: 'wi wi-sprinkle',
      500: 'wi wi-rain',
      600: 'wi wi-snow',
      700: 'wi wi-fog',
      800: 'wi wi-day-sunny',
      801: 'wi wi-day-cloudy',
      802: 'wi wi-cloud',
      803: 'wi wi-cloudy',
      804: 'wi wi-cloudy',
    }

    const firstDigit = Math.floor(code / 100)
    return icons[code] || icons[firstDigit * 100] || 'wi wi-day-sunny'
  }

  showError(message) {
    document.querySelector('.location h2').textContent = message
    document.querySelector('.temp').textContent = '--'
    document.querySelector('.weather-description span').textContent = '未知'
    document.querySelector('.humidity').textContent = '--%'
    document.querySelector('.wind').textContent = '-- m/s'
    document.querySelector('.pressure').textContent = '-- hPa'
  }
}

// 初始化天气应用
document.addEventListener('DOMContentLoaded', () => {
  new WeatherApp()
})
