const phantom = require('phantom')

async function main(payload) {
  try {
    const instance = await phantom.create()
    const page = await instance.createPage()
    page.on("onResourceRequested", function(requestData) {
        console.info('Requesting', requestData.url)
    })

    const status = await page.open('https://stackoverflow.com/')

    const content = await page.property('content')
  } catch(e) {
    console.warn(e)
  }

  
  // await instance.exit()
  
  // process.exit()
}

process.send({type: 'shake'})

process.on('message', ({ type, payload }) => {
  if (type === 'init') {
    routin()
    main(payload)
  }
})

function routin() {
  setInterval(function() {
    process.send({type: 'heart-beat'})
  }, 100)
}
