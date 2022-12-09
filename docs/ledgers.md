## Functions

<dl>
<dt><a href="#issueToken">issueToken(vcId, totalSupply, senderAccountKeyPair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Issue a new currency</p>
</dd>
<dt><a href="#mintToken">mintToken(vcId, senderAccountKeyPair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Mint token to given currency</p>
</dd>
<dt><a href="#removeToken">removeToken(currencyCode, vcId, fromDid, senderAccountKeyPair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Remove Token from circulation</p>
</dd>
<dt><a href="#setBalance">setBalance(dest, currencyCode, amount, senderAccountKeyPair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Set Balance of a DID of a given currency</p>
</dd>
<dt><a href="#slashToken">slashToken(vcId, senderAccountKeyPair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Slash token from given currency</p>
</dd>
<dt><a href="#transfer">transfer(destDid, currencyCode, amount, senderAccountKeyPair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Transfer token balance to another account</p>
</dd>
<dt><a href="#transferAll">transferAll(destDid, currencyCode, senderAccountKeyPair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Transfer all token balance to another account</p>
</dd>
<dt><a href="#transferTokenWithMemo">transferTokenWithMemo(destDid, currencyCode, amount, memo, senderAccountKeyPair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Transfer token balance to another account</p>
</dd>
<dt><a href="#transferToken">transferToken(vcId, toDid, senderAccountKeyPair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Transfer tokens to a DID</p>
</dd>
<dt><a href="#sanitiseCCode">sanitiseCCode(token)</a> ⇒ <code>String</code></dt>
<dd><p>Sanitise Token Name</p>
</dd>
<dt><a href="#accounts">accounts(currencyCode, did, api)</a></dt>
<dd><p>Get the token balance of an account</p>
</dd>
<dt><a href="#locks">locks(currencyCode, did, api)</a></dt>
<dd><p>Get any liquidity locks of a token type under an account</p>
</dd>
<dt><a href="#removedTokens">removedTokens(api, currencyCode)</a></dt>
<dd><p>Storage map between currency code and block number</p>
</dd>
<dt><a href="#tokenCurrencyCounter">tokenCurrencyCounter(api)</a></dt>
<dd><p>Token currency counter</p>
</dd>
<dt><a href="#tokenData">tokenData(currencyCode, api)</a></dt>
<dd><p>Map to store a friendly token name for token</p>
</dd>
<dt><a href="#tokenInfo">tokenInfo(currencyCode, api)</a> ⇒ <code>Number</code></dt>
<dd><p>Get Token Information</p>
</dd>
<dt><a href="#tokenInfoRLookup">tokenInfoRLookup(currencyId, api)</a> ⇒ <code>HexString</code></dt>
<dd><p>Reverse lookup Token Information</p>
</dd>
<dt><a href="#tokenIssuer">tokenIssuer(currencyCode, api)</a> ⇒ <code>HexString</code></dt>
<dd><p>Lookup Token Issuer</p>
</dd>
<dt><a href="#totalIssuance">totalIssuance(currencyCode, api)</a> ⇒ <code>Number</code></dt>
<dd><p>Get Total Token Issuance</p>
</dd>
</dl>

<a name="issueToken"></a>

## issueToken(vcId, totalSupply, senderAccountKeyPair, api) ⇒ <code>Object</code>
Issue a new currency

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type |
| --- | --- |
| vcId | <code>HexString</code> | 
| totalSupply | <code>Number</code> | 
| senderAccountKeyPair | <code>KeyringPair</code> | 
| api | <code>ApiPromise</code> | 

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

<a name="removeToken"></a>

## removeToken(currencyCode, vcId, fromDid, senderAccountKeyPair, api) ⇒ <code>Object</code>
Remove Token from circulation

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type |
| --- | --- |
| currencyCode | <code>String</code> | 
| vcId | <code>HexString</code> | 
| fromDid | <code>String</code> | 
| senderAccountKeyPair | <code>KeyringPair</code> | 
| api | <code>ApiPromise</code> | 

<a name="setBalance"></a>

## setBalance(dest, currencyCode, amount, senderAccountKeyPair, api) ⇒ <code>Object</code>
Set Balance of a DID of a given currency

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type |
| --- | --- |
| dest | <code>String</code> | 
| currencyCode | <code>String</code> | 
| amount | <code>Number</code> | 
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

<a name="transfer"></a>

## transfer(destDid, currencyCode, amount, senderAccountKeyPair, api) ⇒ <code>Object</code>
Transfer token balance to another account

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type |
| --- | --- |
| destDid | <code>String</code> | 
| currencyCode | <code>String</code> | 
| amount | <code>Number</code> | 
| senderAccountKeyPair | <code>KeyringPair</code> | 
| api | <code>ApiPromise</code> | 

<a name="transferAll"></a>

## transferAll(destDid, currencyCode, senderAccountKeyPair, api) ⇒ <code>Object</code>
Transfer all token balance to another account

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type |
| --- | --- |
| destDid | <code>String</code> | 
| currencyCode | <code>String</code> | 
| senderAccountKeyPair | <code>KeyringPair</code> | 
| api | <code>ApiPromise</code> | 

<a name="transferTokenWithMemo"></a>

## transferTokenWithMemo(destDid, currencyCode, amount, memo, senderAccountKeyPair, api) ⇒ <code>Object</code>
Transfer token balance to another account

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type |
| --- | --- |
| destDid | <code>String</code> | 
| currencyCode | <code>String</code> | 
| amount | <code>Number</code> | 
| memo | <code>String</code> | 
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

<a name="sanitiseCCode"></a>

## sanitiseCCode(token) ⇒ <code>String</code>
Sanitise Token Name

**Kind**: global function  
**Returns**: <code>String</code> - Sanitised Token Name  

| Param | Type |
| --- | --- |
| token | <code>String</code> | 

<a name="accounts"></a>

## accounts(currencyCode, did, api)
Get the token balance of an account

**Kind**: global function  

| Param | Type |
| --- | --- |
| currencyCode | <code>String</code> | 
| did | <code>String</code> | 
| api | <code>ApiPromise</code> | 

<a name="locks"></a>

## locks(currencyCode, did, api)
Get any liquidity locks of a token type under an account

**Kind**: global function  

| Param | Type |
| --- | --- |
| currencyCode | <code>String</code> | 
| did | <code>String</code> | 
| api | <code>ApiPromise</code> | 

<a name="removedTokens"></a>

## removedTokens(api, currencyCode)
Storage map between currency code and block number

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiPromise</code> |  |
| currencyCode | <code>String</code> | (Optional) |

<a name="tokenCurrencyCounter"></a>

## tokenCurrencyCounter(api)
Token currency counter

**Kind**: global function  

| Param | Type |
| --- | --- |
| api | <code>ApiPromise</code> | 

<a name="tokenData"></a>

## tokenData(currencyCode, api)
Map to store a friendly token name for token

**Kind**: global function  

| Param | Type |
| --- | --- |
| currencyCode | <code>String</code> | 
| api | <code>ApiPromise</code> | 

<a name="tokenInfo"></a>

## tokenInfo(currencyCode, api) ⇒ <code>Number</code>
Get Token Information

**Kind**: global function  
**Returns**: <code>Number</code> - Currency Id  

| Param | Type |
| --- | --- |
| currencyCode | <code>String</code> | 
| api | <code>ApiPromise</code> | 

<a name="tokenInfoRLookup"></a>

## tokenInfoRLookup(currencyId, api) ⇒ <code>HexString</code>
Reverse lookup Token Information

**Kind**: global function  
**Returns**: <code>HexString</code> - Currency Code Hex  

| Param | Type |
| --- | --- |
| currencyId | <code>Number</code> | 
| api | <code>ApiPromise</code> | 

<a name="tokenIssuer"></a>

## tokenIssuer(currencyCode, api) ⇒ <code>HexString</code>
Lookup Token Issuer

**Kind**: global function  
**Returns**: <code>HexString</code> - Token Owner DID Hex  

| Param | Type |
| --- | --- |
| currencyCode | <code>String</code> | 
| api | <code>ApiPromise</code> | 

<a name="totalIssuance"></a>

## totalIssuance(currencyCode, api) ⇒ <code>Number</code>
Get Total Token Issuance

**Kind**: global function  
**Returns**: <code>Number</code> - Token Issuance  

| Param | Type |
| --- | --- |
| currencyCode | <code>String</code> | 
| api | <code>ApiPromise</code> | 

