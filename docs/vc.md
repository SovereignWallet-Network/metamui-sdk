## Functions

<dl>
<dt><a href="#createTokenVC">createTokenVC(TokenVC)</a> ⇒ <code>HexString</code></dt>
<dd><p>Encodes Token VC and pads with appropriate bytes</p>
</dd>
<dt><a href="#createMintSlashVC">createMintSlashVC(MintSlashVC)</a> ⇒ <code>HexString</code></dt>
<dd><p>Encodes Token VC and pads with appropriate bytes</p>
</dd>
<dt><a href="#createTokenTransferVC">createTokenTransferVC(vcProperty)</a> ⇒ <code>HexString</code></dt>
<dd><p>Encodes Token VC and pads with appropriate bytes</p>
</dd>
<dt><a href="#createGenericVC">createGenericVC(vcProperty)</a> ⇒ <code>HexString</code></dt>
<dd><p>Encodes Generic VC and pads with appropriate bytes</p>
</dd>
<dt><a href="#createPublicDidVC">createPublicDidVC(publicDidVC)</a> ⇒ <code>HexString</code></dt>
<dd><p>Create Public Did VC</p>
</dd>
<dt><a href="#createPrivateDidVC">createPrivateDidVC(privateDidVC)</a> ⇒ <code>HexString</code></dt>
<dd><p>Create Private Did VC</p>
</dd>
<dt><a href="#generateVC">generateVC(vcProperty, owner, issuers, vcType, sigKeypair, ssidUrl)</a> ⇒ <code>string</code></dt>
<dd><p>Create VC</p>
</dd>
<dt><a href="#getVCIdsByDID">getVCIdsByDID(did, api)</a> ⇒ <code>JSON</code></dt>
<dd><p>Lookup a VC</p>
</dd>
<dt><a href="#getDIDByVCId">getDIDByVCId(vcId, api)</a> ⇒ <code>JSON</code></dt>
<dd><p>Reverse lookup a VC ID</p>
</dd>
<dt><a href="#getVCs">getVCs(vcId, api)</a> ⇒ <code>JSON</code></dt>
<dd><p>Get VCs by VC ID</p>
</dd>
<dt><a href="#getVCApprovers">getVCApprovers(vcId, api)</a> ⇒ <code>JSON</code></dt>
<dd><p>Get VC Approver List from the chain</p>
</dd>
<dt><a href="#getVCHistoryByVCId">getVCHistoryByVCId(vcId, api)</a> ⇒ <code>JSON</code></dt>
<dd><p>Get VC History using vcId</p>
</dd>
<dt><a href="#getGenericVCDataByCId">getGenericVCDataByCId(vcId, api)</a> ⇒ <code>JSON</code></dt>
<dd><p>Get Generic vc data</p>
</dd>
<dt><a href="#getGenericVCData">getGenericVCData(vcId, api)</a> ⇒ <code>JSON</code></dt>
<dd><p>Get Generic vc data</p>
</dd>
<dt><a href="#verifyGenericVC">verifyGenericVC(vcId, data, api)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify Generic Vc data</p>
</dd>
<dt><a href="#approveVC">approveVC(vcID, senderAccountKeyPair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Approve VC</p>
</dd>
<dt><a href="#storeVC">storeVC(vcHex, senderAccountKeyPair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Store VC Hex in the chain</p>
</dd>
<dt><a href="#updateStatus">updateStatus(vcId, vcStatus, senderAccountKeyPair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Update Status of a VC ID</p>
</dd>
<dt><a href="#decodeVCProperty">decodeVCProperty(hexValue, typeKey)</a> ⇒ <code>Object</code> | <code>string</code></dt>
<dd><p>function that decodes hex of createTokenVC</p>
</dd>
<dt><a href="#decodeVC">decodeVC(hexValue, typeKey)</a> ⇒ <code>Object</code> | <code>string</code></dt>
<dd><p>function that decodes hex of createVC where type is TokenVC to it&#39;s corresponding object/value</p>
</dd>
<dt><a href="#getFormattedTokenAmount">getFormattedTokenAmount(tokenSymbol, tokenAmount, api)</a> ⇒ <code>string</code></dt>
<dd></dd>
</dl>

<a name="createTokenVC"></a>

## createTokenVC(TokenVC) ⇒ <code>HexString</code>
Encodes Token VC and pads with appropriate bytes

**Kind**: global function  
**Returns**: <code>HexString</code> - Token VC Hex String  

| Param | Type |
| --- | --- |
| TokenVC | <code>Object</code> | 
| TokenVC.tokenName | <code>string</code> | 
| TokenVC.reservableBalance | <code>string</code> | 
| TokenVC.decimal | <code>string</code> | 
| TokenVC.currencyCode | <code>string</code> | 

<a name="createMintSlashVC"></a>

## createMintSlashVC(MintSlashVC) ⇒ <code>HexString</code>
Encodes Token VC and pads with appropriate bytes

**Kind**: global function  
**Returns**: <code>HexString</code> - Token VC Hex String  

| Param | Type | Description |
| --- | --- | --- |
| MintSlashVC | <code>Object</code> | VC Property |
| MintSlashVC.vcId | <code>String</code> | VC Id |
| MintSlashVC.amount | <code>String</code> | In Highest Form |

<a name="createTokenTransferVC"></a>

## createTokenTransferVC(vcProperty) ⇒ <code>HexString</code>
Encodes Token VC and pads with appropriate bytes

**Kind**: global function  
**Returns**: <code>HexString</code> - Token VC Hex String  

| Param | Type | Description |
| --- | --- | --- |
| vcProperty | <code>Object</code> | VC Property |
| vcProperty.vcId | <code>string</code> | VC Id |
| vcProperty.amount | <code>string</code> | In Highest Form |

<a name="createGenericVC"></a>

## createGenericVC(vcProperty) ⇒ <code>HexString</code>
Encodes Generic VC and pads with appropriate bytes

**Kind**: global function  
**Returns**: <code>HexString</code> - Token VC Hex String  

| Param | Type |
| --- | --- |
| vcProperty | <code>Object</code> | 
| vcProperty.cid | <code>string</code> | 

<a name="createPublicDidVC"></a>

## createPublicDidVC(publicDidVC) ⇒ <code>HexString</code>
Create Public Did VC

**Kind**: global function  
**Returns**: <code>HexString</code> - Public Did VC Hex String  

| Param | Type |
| --- | --- |
| publicDidVC | <code>Object</code> | 
| publicDidVC.public_key | <code>string</code> | 
| publicDidVC.registration_number | <code>string</code> | 
| publicDidVC.company_name | <code>string</code> | 
| publicDidVC.did | <code>string</code> | 

<a name="createPrivateDidVC"></a>

## createPrivateDidVC(privateDidVC) ⇒ <code>HexString</code>
Create Private Did VC

**Kind**: global function  
**Returns**: <code>HexString</code> - Private Did VC Hex String  

| Param | Type |
| --- | --- |
| privateDidVC | <code>Object</code> | 
| privateDidVC.public_key | <code>string</code> | 
| privateDidVC.did | <code>string</code> | 

<a name="generateVC"></a>

## generateVC(vcProperty, owner, issuers, vcType, sigKeypair, ssidUrl) ⇒ <code>string</code>
Create VC

**Kind**: global function  
**Returns**: <code>string</code> - VC Hex String  

| Param | Type | Description |
| --- | --- | --- |
| vcProperty | <code>Object</code> |  |
| owner | <code>string</code> | Did |
| issuers | <code>Array.&lt;string&gt;</code> | Array of Did |
| vcType | <code>string</code> | TokenVC, MintTokens, SlashTokens, TokenTransferVC, GenericVC |
| sigKeypair | <code>KeyPair</code> | Owner Key Ring pair |
| ssidUrl | <code>string</code> | (Optional) |

<a name="getVCIdsByDID"></a>

## getVCIdsByDID(did, api) ⇒ <code>JSON</code>
Lookup a VC

**Kind**: global function  
**Returns**: <code>JSON</code> - VC Object  

| Param | Type | Description |
| --- | --- | --- |
| did | <code>HexString</code> | VC Owner's did |
| api | <code>ApiPromise</code> |  |

<a name="getDIDByVCId"></a>

## getDIDByVCId(vcId, api) ⇒ <code>JSON</code>
Reverse lookup a VC ID

**Kind**: global function  
**Returns**: <code>JSON</code> - VC Object  

| Param | Type |
| --- | --- |
| vcId | <code>HexString</code> | 
| api | <code>ApiPromise</code> | 

<a name="getVCs"></a>

## getVCs(vcId, api) ⇒ <code>JSON</code>
Get VCs by VC ID

**Kind**: global function  
**Returns**: <code>JSON</code> - VC Object  

| Param | Type |
| --- | --- |
| vcId | <code>HexString</code> | 
| api | <code>ApiPromise</code> | 

<a name="getVCApprovers"></a>

## getVCApprovers(vcId, api) ⇒ <code>JSON</code>
Get VC Approver List from the chain

**Kind**: global function  
**Returns**: <code>JSON</code> - VC Approver List  

| Param | Type |
| --- | --- |
| vcId | <code>HexString</code> | 
| api | <code>ApiPromise</code> | 

<a name="getVCHistoryByVCId"></a>

## getVCHistoryByVCId(vcId, api) ⇒ <code>JSON</code>
Get VC History using vcId

**Kind**: global function  
**Returns**: <code>JSON</code> - VC History  

| Param | Type |
| --- | --- |
| vcId | <code>HexString</code> | 
| api | <code>ApiPromise</code> | 

<a name="getGenericVCDataByCId"></a>

## getGenericVCDataByCId(vcId, api) ⇒ <code>JSON</code>
Get Generic vc data

**Kind**: global function  
**Returns**: <code>JSON</code> - Generic VC data  

| Param | Type |
| --- | --- |
| vcId | <code>string</code> | 
| api | <code>ApiPromise</code> | 

<a name="getGenericVCData"></a>

## getGenericVCData(vcId, api) ⇒ <code>JSON</code>
Get Generic vc data

**Kind**: global function  
**Returns**: <code>JSON</code> - Generic VC data  

| Param | Type |
| --- | --- |
| vcId | <code>string</code> | 
| api | <code>ApiPromise</code> | 

<a name="verifyGenericVC"></a>

## verifyGenericVC(vcId, data, api) ⇒ <code>Boolean</code>
Verify Generic Vc data

**Kind**: global function  
**Returns**: <code>Boolean</code> - true if verified  

| Param | Type |
| --- | --- |
| vcId | <code>string</code> | 
| data | <code>Object</code> | 
| api | <code>ApiPromise</code> | 

<a name="approveVC"></a>

## approveVC(vcID, senderAccountKeyPair, api) ⇒ <code>Object</code>
Approve VC

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type | Description |
| --- | --- | --- |
| vcID | <code>HexString</code> | vc_id of VC to be approved |
| senderAccountKeyPair | <code>KeyringPair</code> | Issuer Key Ring pair |
| api | <code>APIPromise</code> |  |

<a name="storeVC"></a>

## storeVC(vcHex, senderAccountKeyPair, api) ⇒ <code>Object</code>
Store VC Hex in the chain

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type |
| --- | --- |
| vcHex | <code>HexString</code> | 
| senderAccountKeyPair | <code>KeyringPair</code> | 
| api | <code>ApiPromise</code> | 

<a name="updateStatus"></a>

## updateStatus(vcId, vcStatus, senderAccountKeyPair, api) ⇒ <code>Object</code>
Update Status of a VC ID

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type |
| --- | --- |
| vcId | <code>string</code> | 
| vcStatus | <code>Boolean</code> | 
| senderAccountKeyPair | <code>KeyringPair</code> | 
| api | <code>ApiPromise</code> | 

<a name="decodeVCProperty"></a>

## decodeVCProperty(hexValue, typeKey) ⇒ <code>Object</code> \| <code>string</code>
function that decodes hex of createTokenVC

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>string</code> - Decoded Object/String  

| Param | Type | Description |
| --- | --- | --- |
| hexValue | <code>string</code> | Hex String to be decoded |
| typeKey | <code>string</code> | Key from METABLOCKCHAIN_TYPES which represents type of data |

<a name="decodeVC"></a>

## decodeVC(hexValue, typeKey) ⇒ <code>Object</code> \| <code>string</code>
function that decodes hex of createVC where type is TokenVC to it's corresponding object/value

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>string</code> - Decoded Object/String  

| Param | Type | Description |
| --- | --- | --- |
| hexValue | <code>string</code> | Hex String to be decoded |
| typeKey | <code>string</code> | Key from METABLOCKCHAIN_TYPES which represents type of data |

<a name="getFormattedTokenAmount"></a>

## getFormattedTokenAmount(tokenSymbol, tokenAmount, api) ⇒ <code>string</code>
**Kind**: global function  
**Returns**: <code>string</code> - Formatted Token Amount  

| Param | Type |
| --- | --- |
| tokenSymbol | <code>string</code> | 
| tokenAmount | <code>string</code> | 
| api | <code>ApiPromise</code> | 

