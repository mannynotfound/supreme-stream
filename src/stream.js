import StreamChannels from './stream-channels'

class Stream {
  constructor(streamCfg, account, cb) {
    this.streamCfg = streamCfg
    this.account = account
    this.cb = cb
  }

  init() {
    const opts = {
      language: 'en',
    }

    if (this.streamCfg.follow) {
      opts.follow = this.streamCfg.follow.join(',')
    }

    if (this.streamCfg.channels) {
      opts.track = this.streamCfg.channels
    }

    this.stream = new StreamChannels(this.account.creds, opts)

    this.stream.on('channels', (tweet) => {
      this.cb(null, tweet, this.streamCfg)
    })
  }
}

export default Stream
