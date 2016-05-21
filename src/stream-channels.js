/* Based off an adapted version of twitter-stream-channels
    https://github.com/topheman/twitter-stream-channels/blob/master/lib/StreamChannels.js */

import ImmortalTwitter from './immortal'
import {EventEmitter} from 'events'
import util from 'util'
import helpers from './stream-helpers'

const defaultEventsToTransmit = [
  'connect',
  'connected',
  'disconnect',
  'reconnect',
  'warning'
]

function addEvents(twitterStream, streamChannels) {
  defaultEventsToTransmit.forEach((eventName) => {
    twitterStream.on(eventName, (msg) => {
      streamChannels.emit(eventName, msg)
    })
  })

  twitterStream.on('data', (msg) => {
    helpers.onTweetEvent(msg, streamChannels)
  })

  return streamChannels
}

function removeEvents(twitterStream, streamChannels, options) {
  if (options.removeAllListeners === true) {
    streamChannels.removeAllListeners()
  }

  return streamChannels
}

class StreamChannels {
  constructor(creds, options) {
    helpers.checkStreamChannelsOptions(options, this)
    options.enableChannelsEvents = typeof options.enableChannelsEvents === 'undefined' ? true : options.enableChannelsEvents
    options.enableRootChannelsEvent = typeof options.enableRootChannelsEvent === 'undefined' ? true : options.enableRootChannelsEvent
    options.enableKeywordsEvents = typeof options.enableKeywordsEvents === 'undefined' ? false : options.enableKeywordsEvents
    helpers.preprocessKeywords(options, this)

    this.options = options
    this.client = new ImmortalTwitter(creds)
    EventEmitter.call(this)

    this.client.stream('statuses/filter', this._getOptionsToPassToApiClient(options), (_stream) => {
      this.currentStream = _stream
      addEvents(this.currentStream, this)
    })
  }

  _getOptionsToPassToApiClient(options) {
    const result = {}
    const dontHandle = ['track', 'enableChannelsEvents', 'enableRootChannelsEvent', 'enableKeywordsEvents']
    if (typeof options !== 'undefined') {
      for (var key in options) {
        if (dontHandle.indexOf(key) === -1) {
          result[key] = options[key]
        }
      }
    }

    result.track = this.trackedKeywords.join(',')
    return result
  }
}

util.inherits(StreamChannels, EventEmitter)

export default StreamChannels
