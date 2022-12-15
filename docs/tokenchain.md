## Functions

<dl>
<dt><a href="#getTokenList">getTokenList(api)</a> ⇒ <code>Object</code></dt>
<dd><p>get Token List</p>
</dd>
<dt><a href="#lookup">lookup(tokenName, api)</a> ⇒ <code>Number</code></dt>
<dd><p>Lookup Tokenchain with Token Name to get ParaId</p>
</dd>
<dt><a href="#lookUpParaId">lookUpParaId(paraId, api)</a> ⇒ <code>String</code></dt>
<dd><p>Reverse Lookup Tokenchain with ParaId to get Token Name</p>
</dd>
<dt><a href="#getTokenIssuer">getTokenIssuer(currencyCode, api)</a> ⇒ <code>String</code></dt>
<dd><p>Get Token Issuer by currency code</p>
</dd>
<dt><a href="#getTokenInfo">getTokenInfo(currencyCode, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Get Token Info by currency code</p>
</dd>
<dt><a href="#initParachain">initParachain(vcId, initialIssuance, sudoAccountKeyPair, api)</a></dt>
<dd><p>Add new parachain (requires sudo)</p>
</dd>
<dt><a href="#removeParachain">removeParachain(tokenName, sudoAccountKeyPair, api)</a></dt>
<dd><p>Remove parachain (requires sudo)</p>
</dd>
</dl>

<a name="getTokenList"></a>

## getTokenList(api) ⇒ <code>Object</code>
get Token List

**Kind**: global function  
**Returns**: <code>Object</code> - Token List  

| Param | Type |
| --- | --- |
| api | <code>ApiPromise</code> | 

<a name="lookup"></a>

## lookup(tokenName, api) ⇒ <code>Number</code>
Lookup Tokenchain with Token Name to get ParaId

**Kind**: global function  
**Returns**: <code>Number</code> - Para Id  

| Param | Type |
| --- | --- |
| tokenName | <code>HexString</code> \| <code>String</code> | 
| api | <code>ApiPromise</code> | 

<a name="lookUpParaId"></a>

## lookUpParaId(paraId, api) ⇒ <code>String</code>
Reverse Lookup Tokenchain with ParaId to get Token Name

**Kind**: global function  
**Returns**: <code>String</code> - Token Name  

| Param | Type |
| --- | --- |
| paraId | <code>Number</code> | 
| api | <code>ApiPromise</code> | 

<a name="getTokenIssuer"></a>

## getTokenIssuer(currencyCode, api) ⇒ <code>String</code>
Get Token Issuer by currency code

**Kind**: global function  
**Returns**: <code>String</code> - Token Isssuer Did  

| Param | Type |
| --- | --- |
| currencyCode | <code>String</code> | 
| api | <code>ApiPromise</code> | 

<a name="getTokenInfo"></a>

## getTokenInfo(currencyCode, api) ⇒ <code>Object</code>
Get Token Info by currency code

**Kind**: global function  
**Returns**: <code>Object</code> - Token Details  

| Param | Type |
| --- | --- |
| currencyCode | <code>String</code> | 
| api | <code>ApiPromise</code> | 

<a name="initParachain"></a>

## initParachain(vcId, initialIssuance, sudoAccountKeyPair, api)
Add new parachain (requires sudo)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| vcId | <code>HexString</code> | Currency Code HexString |
| initialIssuance | <code>number</code> | LOWEST FORM |
| sudoAccountKeyPair | <code>KeyringPair</code> |  |
| api | <code>ApiPromise</code> |  |

<a name="removeParachain"></a>

## removeParachain(tokenName, sudoAccountKeyPair, api)
Remove parachain (requires sudo)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tokenName | <code>String</code> | Currency Code HexString |
| sudoAccountKeyPair | <code>KeyringPair</code> |  |
| api | <code>ApiPromise</code> |  |

