// 初始化百度地图
function initMap() {
  // 创建百度地图实例
  const map = new BMap.Map('baiduMap')

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
        map.addControl(new BMap.NavigationControl()) // 添加平移缩放控件
        map.addControl(new BMap.ScaleControl()) // 添加比例尺控件
        map.addControl(new BMap.OverviewMapControl()) // 添加缩略地图控件
        map.addControl(new BMap.MapTypeControl()) // 添加地图类型控件

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
                width: 250, // 信息窗口宽度
                height: 80, // 信息窗口高度
                title: '', // 信息窗口标题
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
          style: 'light', // 可选值：'normal'普通、'light'清新、'dark'黑夜等
        })
      } else {
        // 如果获取位置失败，使用默认位置（上海）
        const defaultPoint = new BMap.Point(121.4737, 31.2304)
        map.centerAndZoom(defaultPoint, 15)
        console.log('定位失败，使用默认位置')
      }
    },
    {
      enableHighAccuracy: true, // 启用高精度定位
      timeout: 5000, // 超时时间：5秒
      maximumAge: 0, // 禁用缓存
    }
  )
}

// 页面加载完成后初始化地图
document.addEventListener('DOMContentLoaded', initMap)
