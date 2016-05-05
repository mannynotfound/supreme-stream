import {assign} from 'lodash'
import 'colors'

export default {
  options: {
    callback: (err, data, cfg) => {
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
    },
  },
  streams: [
    {
      type: 'follow',
      param: '169686021',
      label: 'Kanye West'
    },
    {
      type: 'follow',
      param: '169686021',
      label: 'Kim Kardashian',
    },
    {
      type: 'follow',
      param: '236699098',
      label: 'Kylie Jenner',
    },
    {
      type: 'track',
      param: 'yeezy',
      label: 'Yeezy',
    },
    {
      type: 'track',
      param: 'the life of pablo, tlop',
      label: 'The Life of Pablo',
    },
    {
      type: 'track',
      param: 'pastelle',
      label: 'Pastelle',
    },
    {
      type: 'follow',
      param: '21845792',
      label: 'Virgil Abloh',
    },
    {
      type: 'track',
      param: 'ultralight beam, ultra light beam',
      label: 'Ultralight Beam',
    },
    {
      type: 'track',
      param: 'turbo grafx 16',
      label: 'Turbo Grafx',
    },
    {
      type: 'follow',
      param: '189470083',
      label: 'Team Kanye Daily',
    },
  ],
  credentials: [
    {
      "consumer_key": "XXX",
      "consumer_secret": "XXX",
      "access_token_key": "XXX",
      "access_token_secret": "XXX",
    },
    {
      "consumer_key": "XXX",
      "consumer_secret": "XXX",
      "access_token_key": "XXX",
      "access_token_secret": "XXX",
    },
    {
      "consumer_key": "XXX",
      "consumer_secret": "XXX",
      "access_token_key": "XXX",
      "access_token_secret": "XXX",
    },
    {
      "consumer_key": "XXX",
      "consumer_secret": "XXX",
      "access_token_key": "XXX",
      "access_token_secret": "XXX",
    },
    {
      "consumer_key": "XXX",
      "consumer_secret": "XXX",
      "access_token_key": "XXX",
      "access_token_secret": "XXX",
    },
    {
      "consumer_key": "XXX",
      "consumer_secret": "XXX",
      "access_token_key": "XXX",
      "access_token_secret": "XXX",
    },
    {
      "consumer_key": "XXX",
      "consumer_secret": "XXX",
      "access_token_key": "XXX",
      "access_token_secret": "XXX",
    },
    {
      "consumer_key": "XXX",
      "consumer_secret": "XXX",
      "access_token_key": "XXX",
      "access_token_secret": "XXX",
    },
    {
      "consumer_key": "XXX",
      "consumer_secret": "XXX",
      "access_token_key": "XXX",
      "access_token_secret": "XXX",
    },
    {
      "consumer_key": "XXX",
      "consumer_secret": "XXX",
      "access_token_key": "XXX",
      "access_token_secret": "XXX",
    },
  ],
}
