import StreamChannels from './stream-channels'

class Stream {
  constructor(streamCfg, account, cb) {
    this.streamCfg = streamCfg
    this.account = account
    this.cb = cb
  }

  init() {
    console.log('INITING ', this.account.username, this.streamCfg)
    console.log('')
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

    console.log('MADE STREAM CHANNEL')
    console.log(this.stream.currentStream.on)

    this.stream.on('channels', (tweet) => {
      console.log('GOT TWEET! ', tweet.$channels, tweet.$keywords)
      this.cb(null, tweet, this.streamCfg)
    })
  }
}

export default Stream
