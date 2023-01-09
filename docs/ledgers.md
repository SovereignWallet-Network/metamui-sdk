## Functions

<dl>
<dt><a href="#issueToken">issueToken(vcId, totalSupply, senderAccountKeyPair, api, relayApi)</a> ⇒ <code>Object</code></dt>
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
<dt><a href="#transferWithMemo">transferWithMemo(destDid, currencyCode, amount, memo, senderAccountKeyPair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Transfer token balance to another account</p>
</dd>
<dt><a href="#transferToken">transferToken(vcId, toDid, senderAccountKeyPair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Transfer tokens to a DID</p>
</dd>
<dt><a href="#sanitiseCCode">sanitiseCCode(token)</a> ⇒ <code>String</code></dt>
<dd><p>Sanitise Token Name</p>
</dd>
<dt><a href="#getBalance">getBalance(did, currencyCode, api)</a> ⇒ <code>number</code></dt>
<dd><p>Get account balance (Highest Form) based on the did supplied.</p>
</dd>
<dt><a href="#getDetailedBalance">getDetailedBalance(currencyCode, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Get account balance (Lowest Form) based on the did supplied.
A valid registered did is required</p>
</dd>
<dt><a href="#subscribeToBalanceChanges">subscribeToBalanceChanges(did, currencyCode, callback, api)</a></dt>
<dd><p>Listen to balance (Highest Form) changes for a DID and execute the callback</p>
</dd>
<dt><a href="#subscribeToDetailedBalanceChanges">subscribeToDetailedBalanceChanges(did, currencyCode, callback, api)</a></dt>
<dd><p>Subsribe to detailed balance changes for a DID and execute the callback.</p>
</dd>
<dt><a href="#getTokenList">getTokenList(api)</a> ⇒ <code>Object</code></dt>
<dd><p>get Token List</p>
</dd>
<dt><a href="#getLocks">getLocks(currencyCode, did, api)</a></dt>
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

## issueToken(vcId, totalSupply, senderAccountKeyPair, api, relayApi) ⇒ <code>Object</code>
Issue a new currency

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type | Description |
| --- | --- | --- |
| vcId | <code>HexString</code> |  |
| totalSupply | <code>Number</code> | HIGHEST FORM WITHOUT DECIMALS |
| senderAccountKeyPair | <code>KeyringPair</code> |  |
| api | <code>ApiPromise</code> | Ledger chain connection |
| relayApi | <code>ApiPromise</code> | Relay chain connection |

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

<a name="transferWithMemo"></a>

## transferWithMemo(destDid, currencyCode, amount, memo, senderAccountKeyPair, api) ⇒ <code>Object</code>
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

<a name="getBalance"></a>

## getBalance(did, currencyCode, api) ⇒ <code>number</code>
Get account balance (Highest Form) based on the did supplied.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| did | <code>string</code> | valid registered did |
| currencyCode | <code>string</code> |  |
| api | <code>ApiPromise</code> | (optional) |

<a name="getDetailedBalance"></a>

## getDetailedBalance(currencyCode, api) ⇒ <code>Object</code>
Get account balance (Lowest Form) based on the did supplied.
A valid registered did is required

**Kind**: global function  
**Returns**: <code>Object</code> - Balance Object { free: number, reserved: number, frozen: number}  

| Param | Type | Description |
| --- | --- | --- |
| currencyCode | <code>string</code> |  |
| api | <code>ApiPromise</code> | (optional) |

<a name="subscribeToBalanceChanges"></a>

## subscribeToBalanceChanges(did, currencyCode, callback, api)
Listen to balance (Highest Form) changes for a DID and execute the callback

**Kind**: global function  

| Param | Type |
| --- | --- |
| did | <code>string</code> | 
| currencyCode | <code>string</code> | 
| callback | <code>function</code> | 
| api | <code>ApiPromise</code> | 

<a name="subscribeToDetailedBalanceChanges"></a>

## subscribeToDetailedBalanceChanges(did, currencyCode, callback, api)
Subsribe to detailed balance changes for a DID and execute the callback.

**Kind**: global function  

| Param | Type |
| --- | --- |
| did | <code>string</code> | 
| currencyCode | <code>string</code> | 
| callback | <code>function</code> | 
| api | <code>ApiPromise</code> | 

<a name="getTokenList"></a>

## getTokenList(api) ⇒ <code>Object</code>
get Token List

**Kind**: global function  
**Returns**: <code>Object</code> - Token List  

| Param | Type |
| --- | --- |
| api | <code>ApiPromise</code> | 

<a name="getLocks"></a>

## getLocks(currencyCode, did, api)
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
| currencyCode | <code>string</code> \| <code>null</code> | 
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

