'use strict';

var _require = require('../connection'),
    buildConnection = _require.buildConnection;

var _require2 = require('../transaction'),
    subscribeToBalanceChanges = _require2.subscribeToBalanceChanges;

async function balancetest() {
  var api = await buildConnection('dev');
  subscribeToBalanceChanges('did:ssid:swn', function (val: any) {
    return console.log('Balance Update', val);
  }, api);
}

balancetest();