/* Modernized version of https://github.com/horixon/immortal-ntwitter/blob/master/lib/immortal-ntwitter.js */

import util from 'util'
import {EventEmitter} from 'events'
import Twitter from 'twitter'

(function(){
  "use strict";

  function BackoffStratedgy(){
    this.httpErrorSleepRange = {
      min:     10000,
      max:     320000,
      current: 10000}

    this.networkErrorSleepRange = {
      min:     250,
      max:     16000,
      current: 250}
  }

  BackoffStratedgy.create = function(){
    return new BackoffStratedgy();
  }

  BackoffStratedgy.prototype = {

    httpErrorBackoff : function(callback){
      console.log('http sleep ' + this.httpErrorSleepRange.current);
      this.httpErrorSleep(this.httpErrorSleepRange, callback);
    },

    tcpipErrorBackoff : function(callback){
      console.log('tcp/ip sleep ' + this.networkErrorSleepRange.current);
      this.tcpipErrorSleep(this.networkErrorSleepRange, callback);
    },

    resetSleeps : function(){
      this.httpErrorSleepRange.current = this.httpErrorSleepRange.min;
      this.networkErrorSleepRange.current = this.networkErrorSleepRange.min;
    },

    httpErrorSleep : function( range, callback ){
      var self = this;
      self.sleepAndBackOff(range.current,  function(){
        self.exponentialBackOff(range)
      }, callback);
    },

    tcpipErrorSleep : function(range, callback ){
      var self = this;
      self.sleepAndBackOff(range.current,  function(){
        self.linearBackOff(range);
      }, callback);
    },

    linearBackOff : function(range){
      if(range.current < range.max)
        range.current = range.current + range.min;
    },

    exponentialBackOff : function(range){
      if(range.current < range.max)
        range.current = range.current * 2;
    },

    sleepAndBackOff : function(delay, backOff, callback ){
      setTimeout( function(){
        backOff();
        callback();
      }, delay);
    }
  }


  function ImmortalTwitter(options){
    Twitter.call(this, options);
  }

  util.inherits(ImmortalTwitter, Twitter);

  ImmortalTwitter.create = function( options ){
    return new ImmortalTwitter( options );
  }

  ImmortalTwitter.prototype.immortalStream = function(method, params, callback) {

    var self = this
    ,immortalStream = new EventEmitter();
    immortalStream.backoffStratedgy = BackoffStratedgy.create();

    immortalStream.resurrectStream = function(){
      self.stream(method, params, function(stream){
        immortalStream.stream = stream;
        stream
        .on('error', function(error){
          immortalStream.handleError(error);
        })
        .on('destroy',function(){
          immortalStream.resurrectWithResetSleeps();
        })
        .on('end', function(){
          immortalStream.resurrectWithResetSleeps();
        })
        .on('data', function(data){
          immortalStream.emit('data',data);
        })
        .on('limit', function(data){
           console.log('HIT LIMIT!')
          immortalStream.emit('limit',data);
        })
        .on('delete', function(data){
           console.log('HIT DELETE!')
          immortalStream.emit('delete',data);
        })
        .on('scrub_geo', function(data){
           console.log('HIT GEO!')
          immortalStream.emit('scrub_geo',data);
        })
        .on('tcpTimeout', function(){
           console.log('HIT TIMEOUT!')
          immortalStream.emit('tcpTimeout');
        });
      });
    }

    immortalStream.handleError = function (error){
      console.log('Error: ' + error);
      var self = this;
      if(error != 'http'){
        this.backoffStratedgy.tcpipErrorBackoff(function(){
          self.resurrect(); });
      }else {
        this.backoffStratedgy.httpErrorBackoff(function(){
          self.resurrect(); });
      }
    }

    immortalStream.resurrectWithResetSleeps = function(){
      this.backoffStratedgy.resetSleeps();
      this.resurrect();
    }

    immortalStream.resurrect = function(){
      this.stream.removeAllListeners();
      this.stream = null;
      this.resurrectStream();
    }

    immortalStream.destroy = function(){
      this.stream.removeAllListeners();
      this.stream.destroySilent();
      this.stream = null;
      this.emit('destroy');
    }

    callback(immortalStream);
    immortalStream.resurrectStream();

    return this;
  }


  module.exports = ImmortalTwitter;
}());
