;(function () {
  // 如果已经存在实例，先销毁
  if (window.mapInstance) {
    // 清理地图实例
    window.mapInstance.clearOverlays()
    window.mapInstance = null
  }

  // 定义全局回调函数
  window.initBMap = function () {
    initMap()
  }

  function initMap() {
    // 创建百度地图实例
    const map = new BMap.Map('baiduMap')
    // 保存地图实例
    window.mapInstance = map

    // 创建地理位置解析器
    const geolocation = new BMap.Geolocation()

    // 获取当前位置
    geolocation.getCurrentPosition(
      function (result) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          const point = result.point

          // 初始化地图，设置中心点和缩放级别
          map.centerAndZoom(point, 15)

          // 开启鼠标滚轮缩放
          map.enableScrollWheelZoom()

          // 添加地图控件
          map.addControl(new BMap.NavigationControl())
          map.addControl(new BMap.ScaleControl())
          map.addControl(new BMap.OverviewMapControl())
          map.addControl(new BMap.MapTypeControl())

          // 创建标记
          const marker = new BMap.Marker(point)
          map.addOverlay(marker)

          // 创建地址解析器
          const geocoder = new BMap.Geocoder()

          // 获取地址信息
          geocoder.getLocation(point, function (result) {
            if (result) {
              const address = result.address
              // 创建信息窗口
              const infoWindow = new BMap.InfoWindow(
                `
                  <div style="padding: 8px">
                    <strong style="font-size: 14px; display: block; margin-bottom: 5px;">当前位置</strong>
                    <span style="color: #666;">${address}</span>
                  </div>
                `,
                {
                  width: 250,
                  height: 80,
                  title: '',
                }
              )

              // 点击标记显示信息窗口
              marker.addEventListener('click', () => {
                map.openInfoWindow(infoWindow, point)
              })
            }
          })

          // 设置地图样式
          map.setMapStyle({
            style: 'light',
          })
        } else {
          // 如果获取位置失败，使用默认位置（上海）
          const defaultPoint = new BMap.Point(121.4737, 31.2304)
          map.centerAndZoom(defaultPoint, 15)
          console.log('定位失败，使用默认位置')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    )
  }
})()
