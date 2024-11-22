function formatJSON() {
  const input = document.getElementById('input-json').value
  const output = document.getElementById('output-json')
  const errorMsg = document.getElementById('error-message')

  try {
    const obj = JSON.parse(input)
    output.value = JSON.stringify(obj, null, 2)
    errorMsg.style.display = 'none'
  } catch (e) {
    errorMsg.textContent = '无效的JSON格式: ' + e.message
    errorMsg.style.display = 'block'
  }
}

function minifyJSON() {
  const input = document.getElementById('input-json').value
  const output = document.getElementById('output-json')
  const errorMsg = document.getElementById('error-message')

  try {
    const obj = JSON.parse(input)
    output.value = JSON.stringify(obj)
    errorMsg.style.display = 'none'
  } catch (e) {
    errorMsg.textContent = '无效的JSON格式: ' + e.message
    errorMsg.style.display = 'block'
  }
}

function clearJSON() {
  document.getElementById('input-json').value = ''
  document.getElementById('output-json').value = ''
  document.getElementById('error-message').style.display = 'none'
}
