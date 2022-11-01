## Functions

<dl>
<dt><a href="#getBalance">getBalance(did, api)</a></dt>
<dd><p>Get account balance(Highest Form) based on the did supplied.</p>
</dd>
<dt><a href="#subscribeToBalanceChanges">subscribeToBalanceChanges(identifier, callback, api)</a></dt>
<dd><p>Listen to balance changes for a DID and execute the callback.</p>
</dd>
<dt><a href="#transfer">transfer(senderAccountKeyPair, receiverDID, amount, api, nonce)</a> ⇒ <code>Uint8Array</code></dt>
<dd><p>The function will perform a metamui transfer operation from the account of senderAccount to the
receiverDID.
Note : balanceCheck has not been included in the checks since sender not having balance
is handled in extrinsic, check test/balances.js</p>
</dd>
<dt><a href="#transferWithMemo">transferWithMemo(senderAccountKeyPair, receiverDID, amount, memo, api, nonce)</a> ⇒ <code>Uint8Array</code></dt>
<dd><p>This function is similar to sendTransaction except that it provides the user to add the memo to transfer functionality.</p>
</dd>
</dl>

<a name="getBalance"></a>

## getBalance(did, api)
Get account balance(Highest Form) based on the did supplied.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| did | <code>string</code> |  |
| api | <code>APIPromise</code> | (optional) |

<a name="subscribeToBalanceChanges"></a>

## subscribeToBalanceChanges(identifier, callback, api)
Listen to balance changes for a DID and execute the callback.

**Kind**: global function  

| Param | Type |
| --- | --- |
| identifier | <code>string</code> | 
| callback | <code>function</code> | 
| api | <code>APIPromise</code> | 

<a name="transfer"></a>

## transfer(senderAccountKeyPair, receiverDID, amount, api, nonce) ⇒ <code>Uint8Array</code>
The function will perform a metamui transfer operation from the account of senderAccount to the
receiverDID.
Note : balanceCheck has not been included in the checks since sender not having balance
is handled in extrinsic, check test/balances.js

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| senderAccountKeyPair | <code>KeyPair</code> |  |
| receiverDID | <code>string</code> |  |
| amount | <code>Number</code> | In Lowest Form |
| api | <code>APIPromise</code> | (optional) |
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
| api | <code>APIPromise</code> |  |
| nonce | <code>int</code> | (optional) |

