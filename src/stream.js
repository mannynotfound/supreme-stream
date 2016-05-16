import ImmortalTwitter from './immortal'

class Stream {
  constructor(streamCfg, account, cb) {
    this.streamCfg = streamCfg
    this.account = account
    this.cb = cb
  }

  init() {
    console.log('INITING ', this.account.username, this.streamCfg)
    console.log('')
    this.api = new ImmortalTwitter(this.account.creds)
    this.startStream()
  }

  startStream() {
    const opts = {
      language: 'en',
    }

    if (this.streamCfg.follow) {
      opts.follow = this.streamCfg.follow.join(',')
    }

    if (this.streamCfg.track) {
      opts.track = this.streamCfg.track.join(',')
    }

    this.api.stream('statuses/filter', opts, this.handleStream.bind(this))
  }

  handleStream(stream) {
    this.stream = stream

    this.stream.on('data', (tweet) => {
      this.cb(null, tweet, this.streamCfg)
    })
  }
}

export default Stream
