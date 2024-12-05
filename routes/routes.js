const routes = {
  '/': {
    template: '/templates/home.html',
    title: '首页',
    styles: [
      '/css/calendar.css',
      'https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.10/css/weather-icons.min.css',
    ],
    scripts: ['/js/weather.js', '/js/calendar.js'],
  },
  '/about': {
    template: '/templates/about.html',
    title: '关于',
    // styles: ['/css/about.css'],
  },
  '/tools': {
    template: '/templates/tools.html',
    title: '工具集合',
    styles: ['/css/tools.css'],
    scripts: ['/js/tools/search.js'],
  },
  '/games': {
    template: '/templates/games.html',
    title: '游戏集合',
    styles: ['/css/games.css'],
    scripts: ['/js/games/search.js'],
  },
  '/contact': {
    template: '/templates/contact.html',
    title: '联系我们',
    styles: [
      '/css/contact.css',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
    ],
    scripts: ['/js/contact.js'],
  },
  '/404': {
    template: '/templates/404.html',
    title: '页面未找到',
    styles: ['/css/404.css'],
  },
}

// 工具路由配置
const toolRoutes = {
  'json-formatter': {
    title: 'JSON格式化',
    styles: ['/css/tools/json-formatter.css'],
    scripts: ['/js/tools/json-formatter.js'],
  },
  network: {
    title: '网络工具',
    styles: ['/css/tools/network.css'],
    scripts: ['/js/tools/network.js'],
  },
  'color-picker': {
    title: '颜色选择器',
    styles: ['/css/tools/color-picker.css'],
    scripts: ['/js/tools/color-picker.js'],
  },
  image: {
    title: '图片处理',
    styles: ['/css/tools/image.css', '/css/repo/cropper.min.css'],
    scripts: ['/js/tools/image.js', '/js/repo/cropper.min.js'],
  },
  calculator: {
    title: '计算器',
    styles: ['/css/tools/calculator.css'],
    scripts: ['/js/tools/calculator.js'],
  },
  stopwatch: {
    title: '秒表',
    styles: ['/css/tools/stopwatch.css'],
    scripts: ['/js/tools/stopwatch.js'],
  },
  weather: {
    title: '天气查询',
    // styles: ['/css/tools/weather.css'],
    scripts: ['/js/weather.js'],
  },
  qrcode: {
    title: '二维码生成器',
    styles: ['/css/tools/qrcode.css'],
    scripts: ['/js/repo/qrcode.min.js', '/js/tools/qrcode.js'],
  },
  'password-generator': {
    title: '密码生成器',
    styles: ['/css/tools/password-generator.css'],
    scripts: ['/js/tools/password-generator.js'],
  },
  'unix-timestamp-converter': {
    title: 'Unix时间戳转换',
    styles: ['/css/tools/unix-timestamp-converter.css'],
    scripts: [
      '/js/tools/unix-timestamp-converter.js',
      '/js/repo/jquery.min.js',
      '/js/repo/select2.min.js',
    ],
  },
  'cron-parser': {
    title: 'Cron表达式解析器',
    styles: ['/css/tools/cron-parser.css'],
    scripts: ['/js/tools/cron-parser.js'],
  },
  'base64-image': {
    title: 'Base64图像转换',
    styles: ['/css/tools/base64-image.css'],
    scripts: ['/js/tools/base64-image.js'],
  },
  'base64-text': {
    title: 'Base64文本编解码',
    styles: ['/css/tools/base64-text.css'],
    scripts: ['/js/tools/base64-text.js'],
  },
  gzip: {
    title: 'GZip编码/解码',
    styles: ['/css/tools/gzip.css'],
    scripts: ['/js/tools/gzip.js', '/js/repo/pako.min.js'],
  },
  'json-yaml-converter': {
    title: 'JSON/YAML转换器',
    styles: ['/css/tools/json-yaml-converter.css'],
    scripts: ['/js/tools/json-yaml-converter.js', '/js/repo/js-yaml.min.js'],
  },
  'hash-generator': {
    title: '哈希散列生成器',
    styles: ['/css/tools/hash-generator.css'],
    scripts: ['/js/tools/hash-generator.js', '/js/repo/crypto-js.min.js'],
  },
  'uuid-generator': {
    title: 'UUID生成器',
    styles: ['/css/tools/uuid-generator.css'],
    scripts: ['/js/tools/uuid-generator.js'],
  },
  'regex-tester': {
    title: '正则表达式测试',
    styles: ['/css/tools/regex-tester.css'],
    scripts: ['/js/tools/regex-tester.js'],
  },
  'image-converter': {
    title: '图片格式转换',
    styles: ['/css/tools/image-converter.css'],
    scripts: ['/js/tools/image-converter.js'],
  },
  'text-diff': {
    title: '文本比较工具',
    styles: ['/css/tools/text-diff.css'],
    scripts: ['/js/tools/text-diff.js'],
  },
  'chinese-converter': {
    title: '中文简繁转换',
    styles: ['/css/tools/chinese-converter.css'],
    scripts: ['/js/tools/chinese-mapping.js', '/js/tools/chinese-converter.js'],
  },
  'string-converter': {
    title: '字符串处理工具',
    styles: ['/css/tools/string-converter.css'],
    scripts: ['/js/tools/string-converter.js'],
  },
  'rsa-generator': {
    title: 'RSA密钥对生成器',
    styles: ['/css/tools/rsa-generator.css'],
    scripts: ['/js/tools/rsa-generator.js', '/js/repo/jsencrypt.min.js'],
  },
}

// 将工具路由添加到主路由
Object.entries(toolRoutes).forEach(([path, config]) => {
  routes[`/tools/${path}`] = {
    template: `/templates/tools/${path}.html`,
    title: config.title,
    styles: config.styles,
    scripts: config.scripts,
  }
})

// 游戏路由配置
const gameRoutes = {
  tetris: {
    title: '俄罗斯方块',
    styles: ['/css/games/tetris.css'],
    scripts: ['/js/games/tetris.js'],
  },
  snake: {
    title: '贪吃蛇',
    styles: ['/css/games/snake.css'],
    scripts: ['/js/games/snake.js'],
  },
  2048: {
    title: '2048',
    styles: ['/css/games/2048.css'],
    scripts: ['/js/games/2048.js'],
  },
  'guess-number': {
    title: '猜数字',
    styles: ['/css/games/guess-number.css'],
    scripts: ['/js/games/guess-number.js'],
  },
  'tic-tac-toe': {
    title: '井字棋',
    styles: ['/css/games/tic-tac-toe.css'],
    scripts: ['/js/games/tic-tac-toe.js'],
  },
  'memory-game': {
    title: '记忆游戏',
    styles: ['/css/games/memory-game.css'],
    scripts: ['/js/games/memory-game.js'],
  },
  'shooting-game': {
    title: '打飞机',
    styles: ['/css/games/shooting-game.css'],
    scripts: ['/js/games/shooting-game.js'],
  },
  dice: {
    title: '三筛子',
    styles: ['/css/games/dice.css'],
    scripts: ['/js/games/dice.js'],
  },
  minesweeper: {
    title: '扫雷',
    styles: ['/css/games/minesweeper.css'],
    scripts: ['/js/games/minesweeper.js'],
  },
}

// 将游戏路由添加到主路由
Object.entries(gameRoutes).forEach(([path, config]) => {
  routes[`/games/${path}`] = {
    template: `/templates/games/${path}.html`,
    title: config.title,
    styles: config.styles,
    scripts: config.scripts,
  }
})

export default routes
