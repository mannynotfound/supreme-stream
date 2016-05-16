import 'colors'
import {assign} from 'lodash'
import streams from './streams'
import accounts from './accounts'
import jsonfile from 'jsonfile'
import path from 'path'

var tweetCache = []
var saving = false

if (process.env.SILENT) {
  console.log = () => {}
}

function supremeCallback(err, data, cfg) {
  if (err) {
    console.log('shit hit the fan'.red.bold)
    console.log(JSON.stringify(err, 0, 2).red)
    console.log('')
  } else {
    if (!data.user || !data.text) return
    console.log('~~~~~~~~~~~~~~~~~~~~~~'.grey)
    console.log('')
    const label = `${cfg.label} |`.grey
    const name = `@${data.user.screen_name}:`.yellow.bold
    const text = data.text.cyan.bold
    console.log(`${label} ${name} ${text}`)
    console.log('')

    const output = path.resolve(__dirname, '/') + `mnt/data/${cfg.label.toLowerCase().replace(/ /g, '-')}/tweets.json`

    tweetCache.push(data)

    if (tweetCache.length > 99 && !saving) {
      saving = true

      try {
        tweetCache = require(output).concat(tweetCache)
      } catch(e) {
        console.log('COULDNT REQUIRE TWEETS')
      }

      jsonfile.writeFile(output, tweetCache, {spaces: 2}, (err) => {
        if (err) {
          console.log(err)
        } else {
          tweetCache.splice(0, 99)
        }
        saving = false
      })
    }

  }
}

const SupremeStream = require('../lib/supreme-stream')
new SupremeStream(streams, accounts, supremeCallback).startAll()
