## Functions

<dl>
<dt><a href="#generateMnemonic">generateMnemonic()</a> ⇒ <code>String</code></dt>
<dd><p>Generate Mnemonic</p>
</dd>
<dt><a href="#createPrivate">createPrivate(vcId, paraId, signingKeypair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Store the generated DID VC</p>
</dd>
<dt><a href="#createPublic">createPublic(vcId, paraId, signingKeypair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Create Private DID and store the generated DID object in blockchain</p>
</dd>
<dt><a href="#getDIDDetails">getDIDDetails(identifier, api)</a> ⇒ <code>JSON</code></dt>
<dd><p>Get did information from accountID</p>
</dd>
<dt><a href="#resolveDIDToAccount">resolveDIDToAccount(identifier, api, blockNumber)</a> ⇒ <code>JSON</code></dt>
<dd><p>Get the accountId for a given DID</p>
</dd>
<dt><a href="#resolveAccountIdToDid">resolveAccountIdToDid(accountId, api)</a> ⇒ <code>JSON</code></dt>
<dd><p>Get the DID associated to given accountID</p>
</dd>
<dt><a href="#updateDidKey">updateDidKey(identifier, newKey, paraId, signingKeypair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>This function will rotate the keys assiged to a DID
It should only be called by validator accounts, else will fail</p>
</dd>
<dt><a href="#convertFixedSizeHex">convertFixedSizeHex(data, size)</a> ⇒ <code>String</code></dt>
<dd><p>Convert to hex but return fixed size always, mimics substrate storage</p>
</dd>
<dt><a href="#sanitiseDid">sanitiseDid(did)</a> ⇒ <code>String</code></dt>
<dd><p>Checks if the given did is in hex format or not &amp; converts it into valid hex format.</p>
<p> Note: This util function is needed since dependant module wont convert the utf did to hex anymore</p>
</dd>
<dt><a href="#isDidValidator">isDidValidator(identifier, api)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Check if the user is an approved validator</p>
</dd>
<dt><a href="#getDidKeyHistory">getDidKeyHistory(identifier, api)</a> ⇒ <code>JSON</code></dt>
<dd><p>Fetch the history of rotated keys for the specified DID</p>
</dd>
<dt><a href="#updateMetadata">updateMetadata(identifier, metadata, signingKeypair, api)</a> ⇒ <code>Object</code></dt>
<dd></dd>
<dt><a href="#syncDid">syncDid(identifier, paraId, signingKeypair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Sync DID VC with other chains</p>
</dd>
<dt><a href="#removeDid">removeDid(identifier, paraId, signingKeypair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Remove DID VC</p>
</dd>
</dl>

<a name="generateMnemonic"></a>

## generateMnemonic() ⇒ <code>String</code>
Generate Mnemonic

**Kind**: global function  
**Returns**: <code>String</code> - Mnemonic  
<a name="createPrivate"></a>

## createPrivate(vcId, paraId, signingKeypair, api) ⇒ <code>Object</code>
Store the generated DID VC

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| vcId | <code>HexString</code> |  |  |
| paraId |  | <code></code> | Optional - Stores in current chain if paraId not provided |
| signingKeypair | <code>KeyringPair</code> |  |  |
| api | <code>ApiPromise</code> |  |  |

<a name="createPublic"></a>

## createPublic(vcId, paraId, signingKeypair, api) ⇒ <code>Object</code>
Create Private DID and store the generated DID object in blockchain

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| vcId | <code>HexString</code> |  |  |
| paraId |  | <code></code> | Optional - Stores in current chain if paraId not provided |
| signingKeypair | <code>KeyringPair</code> |  |  |
| api | <code>ApiPromise</code> |  |  |

<a name="getDIDDetails"></a>

## getDIDDetails(identifier, api) ⇒ <code>JSON</code>
Get did information from accountID

**Kind**: global function  
**Returns**: <code>JSON</code> - DID Information  

| Param | Type | Description |
| --- | --- | --- |
| identifier | <code>String</code> | DID Identifier |
| api | <code>ApiPromise</code> |  |

<a name="resolveDIDToAccount"></a>

## resolveDIDToAccount(identifier, api, blockNumber) ⇒ <code>JSON</code>
Get the accountId for a given DID

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| identifier | <code>String</code> |  |
| api | <code>ApiPromise</code> |  |
| blockNumber | <code>Number</code> | (optional) |

<a name="resolveAccountIdToDid"></a>

## resolveAccountIdToDid(accountId, api) ⇒ <code>JSON</code>
Get the DID associated to given accountID

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>String</code> | (hex/base64 version works) |
| api | <code>ApiPromise</code> |  |

<a name="updateDidKey"></a>

## updateDidKey(identifier, newKey, paraId, signingKeypair, api) ⇒ <code>Object</code>
This function will rotate the keys assiged to a DID
It should only be called by validator accounts, else will fail

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| identifier | <code>String</code> |  |  |
| newKey | <code>Uint8Array</code> |  |  |
| paraId | <code>Number</code> | <code></code> |  |
| signingKeypair | <code>KeyringPair</code> |  | // of a validator account |
| api | <code>ApiPromise</code> |  |  |

<a name="convertFixedSizeHex"></a>

## convertFixedSizeHex(data, size) ⇒ <code>String</code>
Convert to hex but return fixed size always, mimics substrate storage

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| data | <code>String</code> |  | 
| size | <code>Int</code> | <code>64</code> | 

<a name="sanitiseDid"></a>

## sanitiseDid(did) ⇒ <code>String</code>
Checks if the given did is in hex format or not & converts it into valid hex format.

 Note: This util function is needed since dependant module wont convert the utf did to hex anymore

**Kind**: global function  
**Returns**: <code>String</code> - Hex did  

| Param | Type |
| --- | --- |
| did | <code>String</code> | 

<a name="isDidValidator"></a>

## isDidValidator(identifier, api) ⇒ <code>Boolean</code>
Check if the user is an approved validator

**Kind**: global function  

| Param | Type |
| --- | --- |
| identifier | <code>String</code> | 
| api | <code>ApiPromise</code> | 

<a name="getDidKeyHistory"></a>

## getDidKeyHistory(identifier, api) ⇒ <code>JSON</code>
Fetch the history of rotated keys for the specified DID

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| identifier | <code>String</code> |  | 
| api | <code>ApiPromise</code> | <code>false</code> | 

<a name="updateMetadata"></a>

## updateMetadata(identifier, metadata, signingKeypair, api) ⇒ <code>Object</code>
**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type | Description |
| --- | --- | --- |
| identifier | <code>String</code> |  |
| metadata | <code>String</code> |  |
| signingKeypair | <code>Keyringpair</code> | of a validator account |
| api | <code>ApiPromise</code> |  |

<a name="syncDid"></a>

## syncDid(identifier, paraId, signingKeypair, api) ⇒ <code>Object</code>
Sync DID VC with other chains

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| identifier | <code>String</code> |  |  |
| paraId | <code>Number</code> | <code></code> | Optional |
| signingKeypair | <code>KeyringPair</code> |  | of a validator account |
| api | <code>ApiPromise</code> |  |  |

<a name="removeDid"></a>

## removeDid(identifier, paraId, signingKeypair, api) ⇒ <code>Object</code>
Remove DID VC

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| identifier | <code>String</code> |  |  |
| paraId | <code>Number</code> | <code></code> | Optional |
| signingKeypair | <code>KeyringPair</code> |  | of a SUDO account |
| api | <code>ApiPromise</code> |  |  |

