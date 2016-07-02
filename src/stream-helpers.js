/* Based off an adapted version of twitter-stream-channels
    https://github.com/topheman/twitter-stream-channels/blob/master/lib/StreamChannels.js */

function regExpEscape(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
      replace(/\x08/g, '\\x08')
}

const helpers = {
  checkStreamChannelsOptions(options) {
    if (typeof options === 'undefined') {
      throw new Error('new StreamChannels(options) - options parameter missing')
    }
    else if (typeof options.track === 'undefined') {
      throw new Error('new StreamChannels(options) - options.track parameter missing')
    }
    else if (!(typeof options.track === 'object' || typeof options.track === 'string')) {
      throw new Error('new StreamChannels(options) - options.track must be an Object (representing your channels with there keywords), an Array (of keywords) or a String (with comma separeted keywords)')
    }
  },
  /*
   * Prepares the channels and keywords to be processed later
   * @method preprocessKeywords
   * @private
   * @param {type} options
   * @param {type} streamChannels
   * @returns {StreamChannels}
   */
  preprocessKeywords(options, streamChannels) {
    streamChannels.trackedKeywords = []
    streamChannels.channels = {}
    streamChannels.channelsKeywordsLowerCased = {}
    streamChannels.channelsKeywordsLowerCasedRegExpSafe = {}
    streamChannels.channelsKeywordsLowerCasedRegExp = {}

    if (options.track instanceof Array || typeof options.track === 'string') {
      options.track = {
        "default": options.track
      }
    }

    for (var channel in options.track) {
      streamChannels.channels[channel] = keywordsToArray(options.track[channel], [])//process the options.track[channel] to make sure it will be an array of keywords
      streamChannels.channelsKeywordsLowerCased[channel] = streamChannels.channels[channel].map(function(item){
        return item.toLowerCase()
      })
      streamChannels.channelsKeywordsLowerCasedRegExpSafe[channel] = streamChannels.channelsKeywordsLowerCased[channel].map(function(item){
        return regExpEscape(item)//escape the lower cased keywords so they will be regexp proof
      })
      streamChannels.channelsKeywordsLowerCasedRegExp[channel] = streamChannels.channelsKeywordsLowerCased[channel].length > 0 ? new RegExp(streamChannels.channelsKeywordsLowerCasedRegExpSafe[channel].join('|'),'g') : null//create the full text search regexp on lower cased keywords
      streamChannels.channels[channel].forEach((item) => {
        if (streamChannels.trackedKeywords.indexOf(item) === -1) {
          streamChannels.trackedKeywords.push(item)
        }
      })
    }

    function keywordsToArray(keywords, result) {
      if (typeof keywords === 'string') {
        result = result.concat(keywords.split(','))
      }
      else if (keywords instanceof Array) {
        if (keywords.length > 0) {
          for (var i = 0; i < keywords.length; i++) {
            result = keywordsToArray(keywords[i], result)
          }
        }
      }
      return result
    }

    return streamChannels
  },

  postprocessTweet(tweet,streamChannels){
    tweet.$channels = {}
    tweet.$keywords = []
    let i, j, k, tmpKeywords
    let keywordsFound = []
    const lowerCasedSearch = []

    if (!tweet.text) tweet.text = ''

    //prepare the lowerCased strings to full text search in the tweet object
    lowerCasedSearch.push(tweet.text.toLowerCase())
    if (tweet.user && tweet.user.screen_name) {
      lowerCasedSearch.push(tweet.user.screen_name.toLowerCase())
    }

    if (tweet.entities && tweet.entities.urls && tweet.entities.urls.length > 0) {
      for (i=0; i<tweet.entities.urls.length; i++) {
        if (tweet.entities.urls[i].display_url) {
          lowerCasedSearch.push(tweet.entities.urls[i].display_url.toLowerCase())
        }
        if (tweet.entities.urls[i].expanded_url) {
          lowerCasedSearch.push(tweet.entities.urls[i].expanded_url.toLowerCase())
        }
      }
    }

    //find the keywords
    for(var channel in streamChannels.channelsKeywordsLowerCasedRegExp){
      keywordsFound = []
      for (j=0; j<lowerCasedSearch.length; j++) {
        tmpKeywords = lowerCasedSearch[j].match(streamChannels.channelsKeywordsLowerCasedRegExp[channel])
        if (tmpKeywords !== null) {
          keywordsFound = keywordsFound.concat(tmpKeywords)
        }
      }
      if (keywordsFound.length > 0) {
        tweet.$channels[channel] = []
        for (k=0; k<keywordsFound.length; k++) {
          if (tweet.$channels[channel].indexOf(keywordsFound[k]) === -1) {
            tweet.$channels[channel].push(keywordsFound[k])
          }
          if (tweet.$keywords.indexOf(keywordsFound[k]) === -1) {
            tweet.$keywords.push(keywordsFound[k])
          }
        }
      }
    }

    return streamChannels
  },

  emitPosprocessedTweet(tweet,streamChannels){
    let channel, keyword

    if (streamChannels.options.enableRootChannelsEvent === true) {
      streamChannels.emit('channels', tweet)
    }

    if (streamChannels.options.enableChannelsEvents === true) {
      for (channel in tweet.$channels) {
        streamChannels.emit('channels/'+channel, tweet)
      }
    }
    if (streamChannels.options.enableKeywordsEvents === true) {
      for (channel in tweet.$channels) {
        if (tweet.$channels[channel].length > 0) {
          for (var i=0; i<tweet.$channels[channel].length; i++) {
            streamChannels.emit('keywords/'+tweet.$channels[channel][i], tweet)
          }
        }
      }
    }
    return streamChannels
  },

  onTweetEvent(tweet, streamChannels) {
    helpers.postprocessTweet(tweet, streamChannels)
    return helpers.emitPosprocessedTweet(tweet, streamChannels)
  }
}

export default helpers
