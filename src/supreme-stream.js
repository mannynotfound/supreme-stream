import Stream from './stream'
import {sample, without, cloneDeep} from 'lodash'

class SupremeStream {
  constructor(streams, accounts, callback) {
    this.streams = streams
    this.accounts = accounts
    this.cb = callback
  }

  startAll() {
    let available = cloneDeep(this.accounts)

    this.streams.forEach((stream) => {
      if (!available.length) {
        return console.warn('NO MORE CREDENTIALS TO GET')
      }

      const account = sample(available)
      available = without(available, account)

      new Stream(stream, account, this.cb).init()
    })
  }
}

export default SupremeStream
