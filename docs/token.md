## Functions

<dl>
<dt><a href="#mintToken">mintToken(vcId, senderAccountKeyPair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Mint token to given currency</p>
</dd>
<dt><a href="#slashToken">slashToken(vcId, senderAccountKeyPair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Slash token from given currency</p>
</dd>
<dt><a href="#transferToken">transferToken(vcId, toDid, senderAccountKeyPair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Transfer tokens to a DID</p>
</dd>
<dt><a href="#withdrawReserved">withdrawReserved(toDid, fromDid, amount, senderAccountKeyPair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Withdraw Reserved tokens from one DID to another DID</p>
</dd>
<dt><a href="#getTokenList">getTokenList(api)</a> ⇒ <code>Object</code></dt>
<dd><p>get Token List</p>
</dd>
</dl>

<a name="mintToken"></a>

## mintToken(vcId, senderAccountKeyPair, api) ⇒ <code>Object</code>
Mint token to given currency

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type |
| --- | --- |
| vcId | <code>HexString</code> | 
| senderAccountKeyPair | <code>KeyringPair</code> | 
| api | <code>ApiPromise</code> | 

<a name="slashToken"></a>

## slashToken(vcId, senderAccountKeyPair, api) ⇒ <code>Object</code>
Slash token from given currency

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type |
| --- | --- |
| vcId | <code>HexString</code> | 
| senderAccountKeyPair | <code>KeyringPair</code> | 
| api | <code>ApiPromise</code> | 

<a name="transferToken"></a>

## transferToken(vcId, toDid, senderAccountKeyPair, api) ⇒ <code>Object</code>
Transfer tokens to a DID

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type |
| --- | --- |
| vcId | <code>HexString</code> | 
| toDid | <code>string</code> | 
| senderAccountKeyPair | <code>KeyringPair</code> | 
| api | <code>ApiPromise</code> | 

<a name="withdrawReserved"></a>

## withdrawReserved(toDid, fromDid, amount, senderAccountKeyPair, api) ⇒ <code>Object</code>
Withdraw Reserved tokens from one DID to another DID

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type |
| --- | --- |
| toDid | <code>string</code> | 
| fromDid | <code>string</code> | 
| amount | <code>Number</code> | 
| senderAccountKeyPair | <code>KeyringPair</code> | 
| api | <code>ApiPromise</code> | 

<a name="getTokenList"></a>

## getTokenList(api) ⇒ <code>Object</code>
get Token List

**Kind**: global function  
**Returns**: <code>Object</code> - Token List  

| Param | Type |
| --- | --- |
| api | <code>ApiPromise</code> | 

