## Functions

<dl>
<dt><a href="#getBalance">getBalance(did, api)</a> ⇒ <code>Number</code></dt>
<dd><p>Get account balance(Highest Form) based on the did supplied.</p>
</dd>
<dt><a href="#getDetailedBalance">getDetailedBalance(did, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Get account balance(Lowest Form) based on the did supplied.
A valid registered did is required</p>
</dd>
<dt><a href="#subscribeToBalanceChanges">subscribeToBalanceChanges(did, callback, api)</a></dt>
<dd><p>Listen to balance changes for a DID and execute the callback.</p>
</dd>
<dt><a href="#subscribeToDetailedBalanceChanges">subscribeToDetailedBalanceChanges(did, callback, api)</a></dt>
<dd><p>Subsribe to detailed balance changes for a DID and execute the callback.</p>
</dd>
<dt><a href="#getTotalSupply">getTotalSupply(api, decimal)</a></dt>
<dd><p>Get total units of tokens issued in the network.</p>
</dd>
<dt><a href="#transfer">transfer(senderAccountKeyPair, receiverDID, amount, api, nonce)</a> ⇒ <code>Uint8Array</code></dt>
<dd><p>The function will perform a metamui transfer operation from the account of senderAccount to the
receiverDID. The amount is in the lowest form.</p>
</dd>
<dt><a href="#transferWithMemo">transferWithMemo(senderAccountKeyPair, receiverDID, amount, memo, api, nonce)</a> ⇒ <code>Uint8Array</code></dt>
<dd><p>This function is similar to sendTransaction except that it provides the user to add the memo to transfer functionality.</p>
</dd>
</dl>

<a name="getBalance"></a>

## getBalance(did, api) ⇒ <code>Number</code>
Get account balance(Highest Form) based on the did supplied.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| did | <code>string</code> | valid registered did |
| api | <code>ApiPromise</code> | (optional) |

<a name="getDetailedBalance"></a>

## getDetailedBalance(did, api) ⇒ <code>Object</code>
Get account balance(Lowest Form) based on the did supplied.
A valid registered did is required

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| did | <code>string</code> | valid registered did |
| api | <code>ApiPromise</code> | (optional) |

<a name="subscribeToBalanceChanges"></a>

## subscribeToBalanceChanges(did, callback, api)
Listen to balance changes for a DID and execute the callback.

**Kind**: global function  

| Param | Type |
| --- | --- |
| did | <code>string</code> | 
| callback | <code>function</code> | 
| api | <code>ApiPromise</code> | 

<a name="subscribeToDetailedBalanceChanges"></a>

## subscribeToDetailedBalanceChanges(did, callback, api)
Subsribe to detailed balance changes for a DID and execute the callback.

**Kind**: global function  

| Param | Type |
| --- | --- |
| did | <code>string</code> | 
| callback | <code>function</code> | 
| api | <code>ApiPromise</code> | 

<a name="getTotalSupply"></a>

## getTotalSupply(api, decimal)
Get total units of tokens issued in the network.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiPromise</code> |  |
| decimal | <code>Boolean</code> | default value is false. Value is true for decimal form (Highest form) and false for lowest form |

<a name="transfer"></a>

## transfer(senderAccountKeyPair, receiverDID, amount, api, nonce) ⇒ <code>Uint8Array</code>
The function will perform a metamui transfer operation from the account of senderAccount to the
receiverDID. The amount is in the lowest form.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| senderAccountKeyPair | <code>KeyPair</code> |  |
| receiverDID | <code>string</code> |  |
| amount | <code>Number</code> | In Lowest Form |
| api | <code>ApiPromise</code> | (optional) |
| nonce | <code>int</code> | (optional) |

<a name="transferWithMemo"></a>

## transferWithMemo(senderAccountKeyPair, receiverDID, amount, memo, api, nonce) ⇒ <code>Uint8Array</code>
This function is similar to sendTransaction except that it provides the user to add the memo to transfer functionality.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| senderAccountKeyPair | <code>KeyPair</code> |  |
| receiverDID | <code>string</code> |  |
| amount | <code>Number</code> | In Lowest Form |
| memo | <code>string</code> |  |
| api | <code>ApiPromise</code> |  |
| nonce | <code>int</code> | (optional) |

