"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitTransaction = void 0;
function submitTransaction(signedTx, api) {
    let returnObj = {
        transactionHash: "",
        events: {},
    };
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        yield signedTx.send(function ({ status, events, dispatchError }) {
            if (dispatchError) {
                if (dispatchError.isModule) {
                    // for module errors, we have the section indexed, lookup
                    const decoded = api.registry.findMetaError(dispatchError.asModule);
                    const { docs, section, name } = decoded;
                    console.log(`${section}.${name}: ${docs.join(' ')}`);
                    reject(new Error(`${section}.${name}`));
                }
                else {
                    // Other, CannotLookup, BadOrigin, no extra info
                    reject(new Error(dispatchError.toString()));
                }
            }
            else if (status.isFinalized) {
                // console.log('Finalized block hash', status.asFinalized.toHex());
                events.forEach(({ phase, event: { data, method, section } }) => {
                    // console.log('\t', phase.toString(), `: ${section}.${method}`, data.toHuman());
                    let eventObj = {};
                    eventObj[section] = {};
                    eventObj[section][method] = data.toHuman();
                    returnObj.events = Object.assign(Object.assign({}, returnObj.events), eventObj);
                });
                returnObj.transactionHash = signedTx.hash.toHex();
                // console.log(returnObj);
                resolve(returnObj);
            }
        });
    }));
}
exports.submitTransaction = submitTransaction;
