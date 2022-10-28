'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _require = require('../connection'), buildConnection = _require.buildConnection;
var _require2 = require('../balances'), subscribeToBalanceChanges = _require2.subscribeToBalanceChanges;
function balancetest() {
    return __awaiter(this, void 0, void 0, function* () {
        var api = yield buildConnection('dev');
        subscribeToBalanceChanges('did:ssid:swn', function (val) {
            return console.log('Balance Update', val);
        }, api);
    });
}
balancetest();
