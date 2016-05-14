require('colors');
var Twitter = require('twitter');

var accounts = require('../accounts');
var idx = 0;

function check() {
  var creds = accounts[idx].creds;
  if (!creds) {
    console.log('ACCOUNT '.red, accounts[idx].username.yellow.bold, ' HAS NO CREDS'.red);
    idx++;
    return check();
  }

  var client = new Twitter(creds);

  client.get('account/verify_credentials', {skip_status: true}, function(err, resp) {
    if (err) {
      console.log('ACCOUNT '.red, accounts[idx].username.yellow.bold, ' IS FUCKED'.red);
    } else {
      console.log('CONFIRMED ACCOUNT '.green, accounts[idx].username.yellow.bold, ' IS GOOD');
    }

    idx++;
    if (idx > accounts.length - 1) {
      console.log('')
      console.log('DONE CHECKING ACCOUNTS!'.green.bold);
      return process.exit();
    }
    setTimeout(function(){
      check();
    }, 5000 + Math.floor(Math.random() * 5000));
  })
}

check();

