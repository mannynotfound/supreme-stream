import Twitter from 'twitter'

class Stream {
  constructor(credentials, cfg, cb) {
    this.credentials = credentials
    this.cfg = cfg
    this.cb = cb
    this.streaming = false
  }

  init() {
    console.log('INITING WITH', this.credentials, this.cfg)
    this.api = new Twitter(this.credentials)
    this.startStream()
  }

  startStream() {
    const opts = {
      language: 'en',
    }

    opts[this.cfg.type] = this.cfg.param
    this.api.stream('statuses/filter', opts, this.handleStream.bind(this))
  }

  handleStream(stream) {
    this.streaming = true
    this.stream = stream

    this.stream.on('data', (tweet) => {
      this.cb(null, tweet, this.cfg)
    })

    this.stream.on('error', this.handleError.bind(this))

    this.stream.on('end', (code) => {
      console.log('STREAM ENDED WITH CODE ', code)
      this.streaming = false
      this.reconnect()
    })
  }

  handleError(error) {
    if (!error.source) {
      error.source = ''
    }

    if (error.source.indexOf('Too many requests') > -1) {
      console.log('TOO MANY REQUESTS, CHILLING OUT FOR A BIT....')
      this.stream.destroy()
      clearInterval(this.timer)
      setTimeout(() => {
        this.reconnect()
      }, 1000 * 60 * 15)
    } else if (error.source.indexOf('Exceeded connection limit') > -1) {
      console.log('TOO MANY CONNECTIONS')
      clearInterval(this.timer)
    } else {
      this.cb(error)
    }
  }

  reconnect() {
    const reconnector = () => {
      if (this.streaming) {
        return clearInterval(this.timer)
      } else {
        this.startStream()
      }
    }

    this.timer = setInterval(reconnector, 1000)
  }
}

export default Stream
