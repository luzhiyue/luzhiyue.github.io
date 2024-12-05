;(function () {
  // 动态加载百度地图API
  function loadBaiduMapScript() {
    return new Promise((resolve, reject) => {
      // 如果已经加载过，直接返回
      if (window.BMap) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://api.map.baidu.com/api?v=3.0&ak=YXvh2NL9qtyIBJuoWCktypGXaG10iQ2j&callback=initBMap`
      document.body.appendChild(script)

      window.initBMap = function () {
        resolve()
      }

      script.onerror = reject
    })
  }

  // 创建自定义标记图标
  function createCustomIcon() {
    return new BMap.Icon(
      // 使用自定义图标URL，这里用默认图标
      'https://api.map.baidu.com/images/marker_red.png',
      new BMap.Size(23, 25), // 图标大小
      {
        anchor: new BMap.Size(11, 25), // 图标定位点
        imageOffset: new BMap.Size(0, 0), // 图片偏移量
      }
    )
  }

  // 创建信息窗口内容
  function createInfoWindowContent() {
    return `
      <div class="map-info-window">
        <h4 style="margin: 0 0 5px 0; font-size: 16px;">公司名称</h4>
        <p style="margin: 0; font-size: 14px; color: #666;">
          <i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i>
          上海市浦东新区XX路XX号
        </p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
          <i class="fas fa-phone-alt" style="margin-right: 5px;"></i>
          +86 21 1234 5678
        </p>
      </div>
    `
  }

  // 初始化地图
  function initMap() {
    try {
      // 创建地图实例
      const map = new BMap.Map('baiduMap')
      window.mapInstance = map

      // 设置地图中心点（上海）
      const defaultPoint = new BMap.Point(121.4737, 31.2304)
      map.centerAndZoom(defaultPoint, 15)

      // 添加地图控件
      map.addControl(
        new BMap.NavigationControl({
          type: BMAP_NAVIGATION_CONTROL_LARGE,
          anchor: BMAP_ANCHOR_TOP_RIGHT,
        })
      )
      map.addControl(
        new BMap.ScaleControl({
          anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        })
      )
      map.addControl(
        new BMap.MapTypeControl({
          anchor: BMAP_ANCHOR_TOP_LEFT,
        })
      )

      // 启用滚轮缩放
      map.enableScrollWheelZoom()

      // 创建标记
      const marker = new BMap.Marker(defaultPoint, {
        icon: createCustomIcon(),
      })
      map.addOverlay(marker)

      // 创建信息窗口
      const infoWindow = new BMap.InfoWindow(createInfoWindowContent(), {
        width: 300,
        height: 120,
        title: '',
        enableAutoPan: true,
        enableCloseOnClick: true,
      })

      // 点击标记显示信息窗口
      marker.addEventListener('click', () => {
        map.openInfoWindow(infoWindow, defaultPoint)
      })

      // 设置地图样式
      map.setMapStyle({
        styleJson: [
          {
            featureType: 'all',
            elementType: 'all',
            stylers: {
              lightness: 10,
              saturation: -100,
            },
          },
        ],
      })

      // 默认打开信息窗口
      map.openInfoWindow(infoWindow, defaultPoint)

      // 添加地图点击事件
      map.addEventListener('click', () => {
        if (map.getInfoWindow()) {
          map.closeInfoWindow()
        }
      })
    } catch (error) {
      console.error('地图初始化失败:', error)
    }
  }

  // 初始化
  loadBaiduMapScript()
    .then(() => {
      initMap()
    })
    .catch((error) => {
      console.error('百度地图加载失败:', error)
      // 显示错误提示
      const mapContainer = document.getElementById('baiduMap')
      if (mapContainer) {
        mapContainer.innerHTML = `
          <div style="
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
            color: #dc3545;
            text-align: center;
            padding: 20px;
          ">
            <div>
              <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
              <p style="margin: 0;">地图加载失败，请刷新页面重试</p>
            </div>
          </div>
        `
      }
    })
})()
