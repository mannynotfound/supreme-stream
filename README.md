<p align="center">
  <!-- lol -->
  <img src="https://raw.githubusercontent.com/mannynotfound/supreme-stream/master/ss-logo.png" />
</p>

Utility library for handling multiple Twitter streams using various Twitter apps.

# Inspiration

Supreme Stream takes the best features of other node based Twitter streaming libraries and appropriates them into a fire must have jawn.
Supreme Stream is meant to handle multiple Twitter developer credentials and callback to the same handler, while providing meta data on what it found. From there, you can do whatever you
want with the data, see the `example` folder for an example of this.

# Features

* Single or multi account support
* Native proxy support from [node-twitter](https://github.com/desmondmorris/node-twitter)
* Stream channels adapted from [twitter-stream-channels](https://github.com/topheman/twitter-stream-channels)
* Auto-reconnect immortal stream adapted from [immortal-ntwitter](https://github.com/horixon/immortal-ntwitter)

_work in progress not really ready for consumption_

# Usage

SupremeStream takes 3 arguments, an array of account objects with info + credentials, an array of stream objects to track, and a callback to send data to.

### Accounts

```js
[
  {
    "fullname": "BarbaraGreen",
    "username": "eduardkuztxwa1",
    "creds": {
      "consumer_key": "XXX",
      "consumer_secret": "XXX",
      "access_token_key": "XXX",
      "access_token_secret": "XXX"
    }
  },
  // ...
]
```

### Stream Objects

```js
[
  {
    "label": "Kanye West Universe",
    "follow": [
      "169686021",
      "169686021",
      // ...
    ],
    "channels": {
      "kanye general": [
        "goat",
        "kanye west",
        // ...
      ],
      "yeezys": [
        "yeezy boost",
        "yeezys",
        // ...
      ]
    }
  },
  // ...
]
```

### Callback

Calls back with `(err, data, cfg)`


## Todos

* Time scheduling 
* Load balancing across APIs if more streams than available APIs are provided
