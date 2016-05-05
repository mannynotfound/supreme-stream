import Twitter from 'twitter'

class Stream {
  constructor(credentials, cfg, cb) {
    console.log('CONSTRUCTING NEW STREAM')
    this.credentials = credentials
    this.cfg = cfg
    this.cb = cb
  }

  init() {
    console.log('INITING WITH', this.credentials, this.cfg)
    this.api = new Twitter(this.credentials)
    this.startStream()
  }

  startStream() {
    const opts = {}
    console.log(this.cfg)
    opts[this.cfg.type] = this.cfg.param
    this.api.stream('statuses/filter', opts, (stream) => {
      stream.on('data', (tweet) => {
        this.cb(null, tweet, this.cfg)
      })
      stream.on('error', (error) => this.cb(error))
    })
  }
}

export default Stream

