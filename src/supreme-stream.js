import Stream from './stream'
import cfg from './config'
import {sample, without, cloneDeep} from 'lodash'

let available = cloneDeep(cfg.credentials)

cfg.streams.forEach((stream) => {
  const api = sample(available)
  if (!api) {
    return console.warn('NO MORE CREDENTIALS TO GET')
  }

  available = without(available, api)
  new Stream(api, stream, cfg.options.callback).init()
})

