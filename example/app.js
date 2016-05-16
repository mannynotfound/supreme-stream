import 'colors'
import {assign} from 'lodash'
import streams from './streams'
import accounts from './accounts'
import jsonfile from 'jsonfile'
import path from 'path'

function supremeCallback(err, data, cfg) {
  if (err) {
    console.log('shit hit the fan'.red.bold)
    console.log(JSON.stringify(err, 0, 2).red)
    console.log('')
  } else {
    console.log(cfg.label.grey)
    console.log('~~~~~~~~~~~~~~~~~~~~~~'.grey)
    console.log('')
    console.log(data.text.cyan.bold)
    console.log('')
    console.log('')

    let tweets = []
    const output = path.resolve(__dirname, '/') + `mnt/data/${cfg.label.toLowerCase().replace(/ /g, '-')}/tweets.json`

    try {
      tweets = require(output)
    } catch(e) {
    }

    tweets.push(data)

    jsonfile.writeFile(output, tweets, {spaces: 2}, (err) => {
      if (err) {
        console.log(err)
      }
    })
  }
}

const SupremeStream = require('../src/supreme-stream')
new SupremeStream(streams, accounts, supremeCallback).startAll()
