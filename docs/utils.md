## Functions

<dl>
<dt><a href="#bytesToHex">bytesToHex(inputBytes)</a></dt>
<dd></dd>
<dt><a href="#hexToBytes">hexToBytes(inputString)</a></dt>
<dd></dd>
<dt><a href="#base58ToBytes">base58ToBytes(bs58string)</a></dt>
<dd></dd>
<dt><a href="#stringToBytes">stringToBytes(inputString)</a></dt>
<dd></dd>
<dt><a href="#hexToString">hexToString(hexString)</a></dt>
<dd></dd>
<dt><a href="#vcHexToVcId">vcHexToVcId(hexString)</a></dt>
<dd></dd>
<dt><a href="#encodeData">encodeData(data, typeKey)</a> ⇒ <code>string</code></dt>
<dd><p>Encodes object/ string of given type to hex</p>
</dd>
<dt><a href="#decodeHex">decodeHex(hexValue, typeKey)</a> ⇒ <code>Object</code> | <code>string</code></dt>
<dd><p>Decodes hex of given type to it&#39;s corresponding object/value</p>
</dd>
<dt><a href="#isUpperAndValid">isUpperAndValid(str)</a> ⇒</dt>
<dd><p>Checks if str is upper and only contains characters</p>
</dd>
<dt><a href="#tidy">tidy(s)</a> ⇒ <code>Object</code> | <code>string</code></dt>
<dd><p>regex to remove unwanted hex bytes</p>
</dd>
<dt><a href="#sortObjectByKeys">sortObjectByKeys(unorderedObj)</a> ⇒ <code>Object</code></dt>
<dd><p>Sort object by keys</p>
</dd>
<dt><a href="#generateObjectHash">generateObjectHash(unordered)</a> ⇒ <code>Object</code></dt>
<dd><p>generate blake hash of js object</p>
</dd>
</dl>

<a name="bytesToHex"></a>

## bytesToHex(inputBytes)
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| inputBytes | <code>Bytes</code> | u8[] |

<a name="hexToBytes"></a>

## hexToBytes(inputString)
**Kind**: global function  

| Param | Type |
| --- | --- |
| inputString | <code>string</code> | 

<a name="base58ToBytes"></a>

## base58ToBytes(bs58string)
**Kind**: global function  

| Param | Type |
| --- | --- |
| bs58string | <code>Base58</code> | 

<a name="stringToBytes"></a>

## stringToBytes(inputString)
**Kind**: global function  

| Param | Type |
| --- | --- |
| inputString | <code>String</code> | 

<a name="hexToString"></a>

## hexToString(hexString)
**Kind**: global function  

| Param | Type |
| --- | --- |
| hexString | <code>Hex</code> | 

<a name="vcHexToVcId"></a>

## vcHexToVcId(hexString)
**Kind**: global function  

| Param | Type |
| --- | --- |
| hexString | <code>Hex</code> | 

<a name="encodeData"></a>

## encodeData(data, typeKey) ⇒ <code>string</code>
Encodes object/ string of given type to hex

**Kind**: global function  
**Returns**: <code>string</code> - Encoded Hex  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> \| <code>string</code> | Object to be encoded |
| typeKey | <code>string</code> | Key from METABLOCKCHAIN_TYPES which represents type of data |

<a name="decodeHex"></a>

## decodeHex(hexValue, typeKey) ⇒ <code>Object</code> \| <code>string</code>
Decodes hex of given type to it's corresponding object/value

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>string</code> - Decoded Object/String  

| Param | Type | Description |
| --- | --- | --- |
| hexValue | <code>string</code> | Hex String to be decoded |
| typeKey | <code>string</code> | Key from METABLOCKCHAIN_TYPES which represents type of data |

<a name="isUpperAndValid"></a>

## isUpperAndValid(str) ⇒
Checks if str is upper and only contains characters

**Kind**: global function  
**Returns**: bool  

| Param |
| --- |
| str | 

<a name="tidy"></a>

## tidy(s) ⇒ <code>Object</code> \| <code>string</code>
regex to remove unwanted hex bytes

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>string</code> - Decoded tidy Object/String  

| Param | Type | Description |
| --- | --- | --- |
| s | <code>string</code> | Hex String to make tidy |

<a name="sortObjectByKeys"></a>

## sortObjectByKeys(unorderedObj) ⇒ <code>Object</code>
Sort object by keys

**Kind**: global function  
**Returns**: <code>Object</code> - ordered object by key  

| Param | Type | Description |
| --- | --- | --- |
| unorderedObj | <code>Object</code> | unordered object |

<a name="generateObjectHash"></a>

## generateObjectHash(unordered) ⇒ <code>Object</code>
generate blake hash of js object

**Kind**: global function  
**Returns**: <code>Object</code> - ordered object by key  

| Param | Type | Description |
| --- | --- | --- |
| unordered | <code>Object</code> | unordered object |

