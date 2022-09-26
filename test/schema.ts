import assert from 'assert';
import * as schema from '../src/schema';
import { buildConnection } from '../src/connection';
import ssidJson from '../src/vc_schema/ssid.json';
import identityJSON from '../src/vc_schema/identity.json';
import { sha256 } from 'js-sha256';
import { stringToU8a, stringToHex } from '@polkadot/util';
import * as constants from './test_constants';

describe('Schema Module works correctly', () => {
  let expectedHashSsid = '';
  let expectedHashId = '';

  before(() => {
    expectedHashSsid = stringToHex(sha256(stringToU8a(JSON.stringify(ssidJson))));
    expectedHashId = stringToHex(sha256(stringToU8a(JSON.stringify(identityJSON))));
  });

  it('Schema is created in correct format', async () => {
    const x = schema.createNewSchema(ssidJson);
    assert.strictEqual(x.json_data, JSON.stringify(ssidJson));
    assert.strictEqual(x.hash, expectedHashSsid);
  });

  it('Schema is created in correct format II', async () => {
    const x = schema.createNewSchema(identityJSON);
    assert.strictEqual(x.json_data, JSON.stringify(identityJSON));
    assert.strictEqual(x.hash, expectedHashId);
  });

  it('Schema checks rejects invalid hex', async () => {
    const provider = await buildConnection(constants.providerNetwork);
    const test = await schema.doesSchemaExist('abc', provider);
    assert.strictEqual(test, false);
  });
  // Remove blockchain dependent tests
  // it('Schema checks rejects non existent schema', async () => {
  //   const provider = await buildConnection(constants.providerNetwork);
  //   const test = await schema.doesSchemaExist(constants.inValidSchema, provider);
  //   assert.strictEqual(test, false);
  // });

  // it('Schema checks accepts valid schema', async () => {
  //   const provider = await buildConnection(constants.providerNetwork);
  //   const test = await schema.doesSchemaExist(constants.validSchema, provider);
  //   assert.strictEqual(test, true);
  // });
});
