## Functions

<dl>
<dt><a href="#buildConnection">buildConnection(network, ignoreCache)</a> ⇒ <code>ApiPromise</code></dt>
<dd><p>Return an APIPromise object</p>
</dd>
<dt><a href="#buildConnectionByUrl">buildConnectionByUrl(wssUrl)</a> ⇒ <code>ApiPromise</code></dt>
<dd><p>Return an APIPromise object</p>
</dd>
</dl>

<a name="buildConnection"></a>

## buildConnection(network, ignoreCache) ⇒ <code>ApiPromise</code>
Return an APIPromise object

**Kind**: global function  
**Returns**: <code>ApiPromise</code> - APIPromise object
Note : setting the ignoreCache value to true will create a new ws
ws conection on every call  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| network | <code>string</code> | <code>&quot;local&quot;</code> | MetaMUI network provider to connect |
| ignoreCache | <code>boolean</code> | <code>false</code> | (optional) (default=true) |

<a name="buildConnectionByUrl"></a>

## buildConnectionByUrl(wssUrl) ⇒ <code>ApiPromise</code>
Return an APIPromise object

**Kind**: global function  
**Returns**: <code>ApiPromise</code> - APIPromise object  

| Param | Type | Description |
| --- | --- | --- |
| wssUrl | <code>string</code> | Tokenchain network wss URL to connect |

