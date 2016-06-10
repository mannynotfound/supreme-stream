import Stream from './stream'

class SupremeStream {
  constructor(streams, accounts, callback) {
    this.streams = streams
    this.accounts = accounts
    this.cb = callback
  }

  startAll() {
    let available = JSON.parse(JSON.stringify(this.accounts))
    this.streamClients = []

    this.streams.forEach((stream) => {
      if (!available.length) {
        return console.warn('NO MORE CREDENTIALS TO GET')
      }

      const rand = Math.floor(Math.random() * available.length)
      const account = available.splice(rand, 1)[0]

      const streamClient = new Stream(stream, account, this.cb)
      streamClient.init();
      this.streamClients.push(streamClient)
    })
  }

  getClients() {
    return this.streamClients.map((s) => s.getClient())
  }
}

export default SupremeStream
