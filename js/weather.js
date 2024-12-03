// 检查是否已经存在实例
if (!window.weatherApp) {
  class WeatherApp {
    constructor() {
      this.API_KEY = 'b1810ac0064baf1fe8ebc28f16a81145'
      this.searchInput = document.getElementById('searchInput')
      this.searchBtn = document.getElementById('searchBtn')

      if (this.searchInput && this.searchBtn) {
        this.setupEventListeners()
      }

      this.getCurrentLocation()
    }

    setupEventListeners() {
      this.searchBtn.addEventListener('click', () => this.searchWeather())
      this.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.searchWeather()
      })
    }

    searchWeather() {
      const city = this.searchInput.value.trim()
      if (city) {
        this.getWeatherByCity(city)
      }
    }

    getWeatherByCity(city) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.API_KEY}&units=metric&lang=zh_cn`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.cod === 200) {
            this.updateCurrentWeather(data)
            return this.getForecastByCity(city)
          } else {
            this.showError('城市未找到')
          }
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error)
          this.showError('获取天气信息失败')
        })
    }

    getForecastByCity(city) {
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.API_KEY}&units=metric&lang=zh_cn`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.cod === '200') {
            this.updateHourlyForecast(data)
            this.updateFutureForecast(data)
          } else {
            this.showError('无法获取预报数据')
          }
        })
        .catch((error) => {
          console.error('Error fetching forecast data:', error)
          this.showError('获取预报信息失败')
        })
    }

    getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.getWeatherData(position.coords)
          },
          (error) => {
            console.error('Error getting location:', error)
            this.getWeatherByCity('北京') // 默认城市
          }
        )
      } else {
        this.getWeatherByCity('北京') // 默认城市
      }
    }

    async getWeatherData(coords) {
      try {
        const currentWeather = await this.getCurrentWeather(coords)
        const forecast = await this.getForecast(coords)
        this.updateUI(currentWeather, forecast)
      } catch (error) {
        console.error('Error fetching weather data:', error)
        this.showError('获取天气信息失败')
      }
    }

    async getCurrentWeather(coords) {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${this.API_KEY}&units=metric&lang=zh_cn`
      )
      return await response.json()
    }

    async getForecast(coords) {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&appid=${this.API_KEY}&units=metric&lang=zh_cn`
      )
      return await response.json()
    }

    updateUI(current, forecast) {
      this.updateCurrentWeather(current)
      this.updateHourlyForecast(forecast)
      this.updateFutureForecast(forecast)
    }

    updateCurrentWeather(data) {
      document.querySelector('.location h2').textContent = data.name
      document.querySelector('.temp').textContent = Math.round(data.main.temp)
      document.querySelector('.weather-description span').textContent = data.weather[0].description
      document.querySelector('.weather-icon i').className = this.getWeatherIcon(data.weather[0].id)
      document.querySelector('.humidity').textContent = `${data.main.humidity}%`
      document.querySelector('.wind').textContent = `${data.wind.speed} m/s`
      document.querySelector('.pressure').textContent = `${data.main.pressure} hPa`
    }

    updateHourlyForecast(forecast) {
      const hourlyList = document.getElementById('hourlyList')
      if (!hourlyList) {
        console.error('Element with id "hourlyList" not found.')
        return
      }

      const next24Hours = forecast.list.slice(0, 8)
      hourlyList.innerHTML = next24Hours
        .map((item) => {
          const time = new Date(item.dt * 1000)
          return `
          <div class="forecast-item">
            <div class="time">${time.getHours()}:00</div>
            <div class="icon">
              <i class="${this.getWeatherIcon(item.weather[0].id)}"></i>
            </div>
            <div class="temp">${Math.round(item.main.temp)}°C</div>
            <div class="desc">${item.weather[0].description}</div>
          </div>
        `
        })
        .join('')
    }

    updateFutureForecast(forecast) {
      const futureList = document.getElementById('futureList')
      if (!futureList) {
        console.error('Element with id "futureList" not found.')
        return
      }

      const dailyData = {}
      forecast.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString()
        if (!dailyData[date]) {
          dailyData[date] = item
        }
      })
      const dailyForecast = Object.values(dailyData).slice(1, 7)
      futureList.innerHTML = dailyForecast
        .map((item) => {
          const date = new Date(item.dt * 1000)
          return `
          <div class="forecast-item">
            <div class="time">${date.toLocaleDateString('zh-CN', {
              weekday: 'short',
              month: 'numeric',
              day: 'numeric',
            })}</div>
            <div class="icon">
              <i class="${this.getWeatherIcon(item.weather[0].id)}"></i>
            </div>
            <div class="temp">${Math.round(item.main.temp)}°C</div>
            <div class="desc">${item.weather[0].description}</div>
          </div>
        `
        })
        .join('')
    }

    getWeatherIcon(code) {
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
    }
  }

  // 创建全局实例
  window.weatherApp = new WeatherApp()
}
