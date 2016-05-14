import 'colors'
import {assign} from 'lodash'
import streams from './streams'
import accounts from './accounts'

function supremeCallback(err, data, cfg) {
  if (err) {
    console.log('shit hit the fan'.red.bold)
    console.log(JSON.stringify(err, 0, 2).red)
    console.log('')
  } else {
    console.log(cfg.label.white.bold)
    console.log('~~~~~~~~~~~~~~~~~~~~~~'.rainbow.bold)
    console.log('')
    console.log(data.text)
    console.log('')
    const print = assign({}, {
      id: data.id_str,
      from: data.user.screen_name,
      source: `http://twitter.com/${data.user.screen_name}/status/${data.id_str}`,
    })
    console.log(JSON.stringify(print, 0, 2).cyan)
    console.log('')
    console.log('')
  }
}

const SupremeStream = require('../src/supreme-stream')
new SupremeStream(streams, accounts, supremeCallback).startAll()
