## Functions

<dl>
<dt><a href="#setMembers">setMembers(newMembers, prime, oldCount, signingKeypair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Set Members and prime of collective pallet</p>
</dd>
<dt><a href="#propose">propose(threshold, proposal, lengthCount, signingKeypair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>To create a proposal</p>
</dd>
<dt><a href="#execute">execute(proposal, lengthCount, signingKeypair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>To Execute a call</p>
</dd>
<dt><a href="#vote">vote(proposalHash, index, approve, signingKeypair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Vote on a proposal</p>
</dd>
<dt><a href="#close">close(proposalHash, index, proposalWeightBond, lengthCount, signingKeypair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Close a proposal manually, executes call if yes votes is greater than or equal to threshold</p>
</dd>
<dt><a href="#disapproveProposal">disapproveProposal(proposalHash, signingKeypair, api)</a> ⇒ <code>Object</code></dt>
<dd><p>Disapprove proposal</p>
</dd>
<dt><a href="#getMembers">getMembers(api)</a></dt>
<dd><p>Get Members of Council</p>
</dd>
<dt><a href="#getPrime">getPrime(api)</a></dt>
<dd><p>Get Prime of Council</p>
</dd>
<dt><a href="#getProposals">getProposals(api)</a></dt>
<dd><p>Get All Proposals</p>
</dd>
<dt><a href="#getProposalOf">getProposalOf(proposalHash, api)</a></dt>
<dd><p>Get Proposal of given hash</p>
</dd>
<dt><a href="#getVotes">getVotes(proposalHash, api)</a></dt>
<dd><p>Get Votes of given proposal hash</p>
</dd>
<dt><a href="#getProposalCount">getProposalCount(api)</a></dt>
<dd><p>Get Total proposals count</p>
</dd>
</dl>

<a name="setMembers"></a>

## setMembers(newMembers, prime, oldCount, signingKeypair, api) ⇒ <code>Object</code>
Set Members and prime of collective pallet

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type | Description |
| --- | --- | --- |
| newMembers | <code>Array.&lt;string&gt;</code> | Array of Did |
| prime | <code>string</code> | Did of Prime |
| oldCount | <code>Number</code> | Old members count |
| signingKeypair | <code>KeyringPair</code> | Key pair of Sender |
| api | <code>ApiPromise</code> | Network Provider |

<a name="propose"></a>

## propose(threshold, proposal, lengthCount, signingKeypair, api) ⇒ <code>Object</code>
To create a proposal

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type | Description |
| --- | --- | --- |
| threshold | <code>Number</code> | Threshold to successfull execution |
| proposal | <code>Call</code> | Call to propose |
| lengthCount | <code>Number</code> | Length of call |
| signingKeypair | <code>KeyringPair</code> | Key pair of sender |
| api | <code>ApiPromise</code> | Network Provider |

<a name="execute"></a>

## execute(proposal, lengthCount, signingKeypair, api) ⇒ <code>Object</code>
To Execute a call

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type | Description |
| --- | --- | --- |
| proposal | <code>Call</code> | Call to propose |
| lengthCount | <code>Number</code> | Length of Call |
| signingKeypair | <code>KeyringPair</code> | Key pair of sender |
| api | <code>ApiPromise</code> | Network Provider |

<a name="vote"></a>

## vote(proposalHash, index, approve, signingKeypair, api) ⇒ <code>Object</code>
Vote on a proposal

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type | Description |
| --- | --- | --- |
| proposalHash | <code>string</code> | Hash of proposal |
| index | <code>Number</code> | Proposal index |
| approve | <code>Boolean</code> | True/false |
| signingKeypair | <code>KeyringPair</code> | Key pair of sender |
| api | <code>ApiPromise</code> | Network Provider |

<a name="close"></a>

## close(proposalHash, index, proposalWeightBond, lengthCount, signingKeypair, api) ⇒ <code>Object</code>
Close a proposal manually, executes call if yes votes is greater than or equal to threshold

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type | Description |
| --- | --- | --- |
| proposalHash | <code>string</code> | Hash |
| index | <code>Number</code> | Proposal index |
| proposalWeightBond | <code>Boolean</code> | Weight |
| lengthCount | <code>Number</code> | Length |
| signingKeypair | <code>KeyringPair</code> | Key pair of sender |
| api | <code>ApiPromise</code> | Network Provider |

<a name="disapproveProposal"></a>

## disapproveProposal(proposalHash, signingKeypair, api) ⇒ <code>Object</code>
Disapprove proposal

**Kind**: global function  
**Returns**: <code>Object</code> - Transaction Object  

| Param | Type | Description |
| --- | --- | --- |
| proposalHash | <code>string</code> | Hash |
| signingKeypair | <code>KeyringPair</code> | Key pair of sender |
| api | <code>ApiPromise</code> | Network Provider |

<a name="getMembers"></a>

## getMembers(api)
Get Members of Council

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiPromise</code> | Network Provider |

<a name="getPrime"></a>

## getPrime(api)
Get Prime of Council

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiPromise</code> | Network Provider |

<a name="getProposals"></a>

## getProposals(api)
Get All Proposals

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiPromise</code> | Network Provider |

<a name="getProposalOf"></a>

## getProposalOf(proposalHash, api)
Get Proposal of given hash

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| proposalHash | <code>Hash</code> | Hash of proposal |
| api | <code>ApiPromise</code> | Network Provider |

<a name="getVotes"></a>

## getVotes(proposalHash, api)
Get Votes of given proposal hash

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| proposalHash | <code>Hash</code> | Hash of proposal |
| api | <code>ApiPromise</code> | Network Provider |

<a name="getProposalCount"></a>

## getProposalCount(api)
Get Total proposals count

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiPromise</code> | Network Provider |

