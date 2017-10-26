/* globals Image */
const path = require('path')
const cappadonna = require('cappadonna')
const test = cappadonna(path.join(__dirname, 'importer.js'))

test('no params', async (page, t) => {
  t.plan(3)
  await page.evaluate(async () => {
    document.body.innerHTML += '<compretend-img></compretend-img>'
    let el = document.querySelector('compretend-img')
    let img = new Image()
    img.src = window.testimg
    img.onload = async () => {
      t.same(el.innerHTML, '<render slot="render"></render>')
      el.src = window.testimg
      await el.nextRender()
      let innerImage = el.querySelector('img')
      t.same(img.width, innerImage.width)
      t.same(img.height, innerImage.height)
      document.body.innerHTML += '<test-finished></test-finished>'
    }
  })
  await page.waitFor('test-finished')
})

test('crop faces', async (page, t) => {
  t.plan(2)
  await page.evaluate(async () => {
    document.body.innerHTML += `
      <compretend-img src=${window.imgurl} crop="faces"></compretend-img>
    `
    let el = document.querySelector('compretend-img')
    await el.nextRender()
    let img = new Image()
    img.src = window.testimg
    img.onload = async () => {
      let innerImage = el.querySelector('img')
      t.ok(img.width > innerImage.width)
      t.ok(img.height > innerImage.height)
      document.body.innerHTML += '<test-finished></test-finished>'
    }
  })
  await page.waitFor('test-finished')
})
