/*****************************************************************/
/*                                                               */
/*   Addon.js                                                    */
/*     Addon permettant d'unifomiser les navigateurs (en partie) */
/*                                                               */
/*   Developpeur : Gigatrappeur                                  */
/*   Email : gigatrappeur@gmail.com                              */
/*   Création : 12/01/2011                                       */
/*   Dernière modification : 30/03/2017                          */
/*                                                               */
/*****************************************************************/


initialisation_Addon();

function initialisation_Addon()
{
	Addon_object();
	Addon_Array();
	Addon_String();
	Addon_Math();
	Addon_Event();
	Addon_node();
	Addon_Request();
	Addon_date();
	Addon_cookie();
	
	
	navigator.Addon = function ()
	{
		this.version = '20170330';
		this.subversion = '2'; // indique version non compatible IE 7 (voir la subversion 1 pour une compatibilité avec IE 7)
		this.auteur = 'Gigatrappeur';
		this.mail_auteur = 'gigatrappeur@gmail.com';
		
		this.contributeurs = {'Gigatrappeur':'gigatrappeur@gmail.com'};
		
	};
	
	
	// Browser Detection Javascript
	// copyright 1 February 2003, by Stephen Chapman, Felgall Pty Ltd
	// objet modifier pour correspondre au modele utilisé
	function BrowserDetect()
	{
		var versionSearchString = '';
		var dataBrowser = new Array
		(
			{'string':navigator.userAgent, 'subString':'Chrome', 'identity':'Chrome'},
			{'string':navigator.userAgent, 'subString':'OmniWeb', 'versionSearch': 'OmniWeb/', 'identity':'OmniWeb'},
			{'string':navigator.vendor, 'subString':'Apple', 'identity':'Safari', 'versionSearch':'Version'},
			{'prop':window.opera, 'identity':'Opera'},
			{'string':navigator.vendor, 'subString':'iCab', 'identity':'iCab'},
			{'string':navigator.vendor, 'subString':'KDE', 'identity':'Konqueror'},
			{'string':navigator.userAgent, 'subString':'Firefox', 'identity':'Firefox'},
			{'string':navigator.vendor, 'subString':'Camino', 'identity':'Camino'},
			{'string':navigator.userAgent, 'subString':'Netscape', 'identity':'Netscape'},// for newer Netscapes (6+)
			{'string':navigator.userAgent, 'subString':'MSIE', 'identity':'Explorer', 'versionSearch': 'MSIE'},
			{'string':navigator.userAgent, 'subString':'Gecko', 'identity':'Mozilla', 'versionSearch': 'rv'},
			{'string':navigator.userAgent, 'subString':'Mozilla', 'identity':'Netscape', 'versionSearch':'Mozilla'}// for older Netscapes (4-)
		);
		
		var dataOS = new Array
		(
			{'string':navigator.platform, 'subString':'Win', 'identity':'Windows'},
			{'string':navigator.platform, 'subString':'Mac', 'identity':'Mac'},
			{'string':navigator.userAgent, 'subString':'iPhone', 'identity': 'iPhone/iPod'},
			{'string':navigator.platform, 'subString':'Linux', 'identity':'Linux'}
		);
		
		function searchString (data)
		{
			for (var i = 0; i < data.length; i++)
			{
				var dataString = data[i].string;
				var dataProp = data[i].prop;
				versionSearchString = data[i].versionSearch || data[i].identity;
				if (dataString)
				{
					if (dataString.indexOf(data[i].subString) != -1)
						return data[i].identity;
				}
				else if (dataProp)
					return data[i].identity;
			}
		}
		
		function searchVersion(dataString)
		{
			var index = dataString.indexOf(versionSearchString);
			if (index == -1) return;
			return parseFloat(dataString.substring(index+versionSearchString.length+1));
		}
		
		var name = searchString(dataBrowser) || "An unknown browser";
		var version = searchVersion(navigator.userAgent) || searchVersion(navigator.appVersion) || "an unknown version";
		var OS = searchString(dataOS) || "an unknown OS";
		
		return {'name':name, 'version':version, 'OS':OS};
	};
	
	var dataBrowser = BrowserDetect();
	
	navigator.Name = dataBrowser.name;
	navigator.Version = dataBrowser.version;
	navigator.OS = dataBrowser.OS;
}



function Addon_object()
{
	Object.getObjectJSON = function (string_JSON)
	{
		try
		{
			// on transforme la chaine en objet
			eval('var object_JSON = '+string_JSON);
		}
		catch (erreur)
		{ // en cas d'erreur lors de la création de l'objet JSON
			return null;
		}
		return object_JSON;
	};
	
	
	Object.getPropertiesOf = function (obj)
	{
		var properties = new Array();
		for(var e in obj)
			properties[properties.length] = e;
		
		properties.sort();
		return properties;
	};
	
	
	// IE 7 non compatible 
	// permet d'ajouter des getters et setters
	Object.addProperty = function (obj, nameProperty, getter, setter)
	{
		if (Object.defineProperty)
		{
			var methodes = {};
			if (typeof(getter) != 'undefined' && getter != null) methodes['get'] = getter;
			if (typeof(setter) != 'undefined' && setter != null) methodes['set'] = setter;
			Object.defineProperty(obj, nameProperty, methodes);
		}
		else if (Object.__defineGetter__)
		{// uniquement pour Opéra
			if (getter) obj.__defineGetter__(nameProperty, getter);
			if (setter) obj.__defineSetter__(nameProperty, setter);
		}
		else
		{
			alert('defineProperty and __defineGetter__ not supported');
		}
	};
	
	
	Object.prototype.clone = function ()
	{
		var rt = {};
		for(var i in this)
		{
			if (!this.hasOwnProperty(i)) continue;

			if (typeof this[i] == 'object' || typeof this[i] == 'array')
				rt[i] = this[i].clone();
			else
				rt[i] = this[i];
		}
		
		return rt;
	};

	Object.mergeJson = function(json1, json2) {
        if(json1 == null) {
            json1 = {};
        }
        if(json2 == null) {
            json2 = {};
        }
        for(var property in json2) {
            if(json2.hasOwnProperty(property)) {
                if(typeof json2[property] == 'object') {
                    if(json1[property] == null) {
                        json1[property] = {};
                    }
                    this.mergeJson(json1[property], json2[property]);
                } else {
                    json1[property] = json2[property];
                }
            }
        }
    };
	
	Object.prototype.inherit = function (mere, args)
	{
		mere.apply(this, args);
		
		if (typeof(this.parent) == 'undefined') this.parent = {};
		for (var i in this)
		{
			if (this.hasOwnProperty(i) && this[i] != this.parent)
				this.parent[i] = this[i].bind(this);
		}
	};
}


function Addon_Array()
{
	Array.isArray = function (mixed_var)
	{
		return mixed_var.constructor == Array;
	};
	
	
	Array.prototype.joinTextArray = function(separator, and_separator)
	{
		if (this.length > 1)
		{
			var _array = this.clone();
			var last = _array.pop();
			return _array.join(separator)+and_separator+last;
		}
		else if (this.lenght == 1)
			return this[0];
		else
			return '';
	};
	
	Array.prototype.clone = function ()
	{
		var rt = new Array();
		for (var i = 0; i < this.length; i++)
			rt[i] = this[i];
		
		return rt;
	};
	
	Array.prototype.remove = function (key)
	{
		var clone = this.clone();
		clone.splice(key, 1);
		return clone;
	};

	Array.prototype.insert = function (key, value)
	{
		var clone = this.clone();
		clone.splice(key, 0, value);
		return clone;
	};
	
	if (typeof(Array.prototype.indexOf) != 'function')
	{
		Array.prototype.indexOf = function (value)
		{
			var key = 0;
			while (key < this.length &&	this[key] != value)
				key++;
			
			if (key == this.length)
				return -1;
			
			return key;
		};
	}
	
	Array.prototype.search = function (value, callback_compare)
	{
		var IsUserCompare = (typeof(callback_compare) == 'function');
		
		var key = 0;
		while (key < this.length && (!IsUserCompare && this[key] != value || IsUserCompare && !callback_compare(this[key], value)))
			key++;
		
		if (key == this.length)
			return -1;
		
		return key;
	};
	
	Array.prototype.unique = function ()
	{
		var rt = new Array();
		for (var i = 0; i < this.length; i++)
		{
			if (rt.indexOf(this[i]) == -1)
				rt.push(this[i]);
		}
		return rt;
	};
	
	Array.prototype.filtre = function (filtre)
	{
		var rt = new Array();
		for (var i = 0; i < this.length; i++)
		{
			if (filtre.indexOf(this[i]) == -1)
				rt.push(this[i]);
		}
		return rt;
	};
	
	Array.prototype.intersect = function (intersect)
	{
		var rt = new Array();
		for (var i = 0; i < this.length; i++)
		{
			if (intersect.indexOf(this[i]) > -1)
				rt.push(this[i]);
		}
		return rt;
	};
	
	HTMLCollection.prototype.toArray = function ()
	{
		var rt = new Array();
		for (var i = 0; i < this.length; i++)
			rt[i] = this[i];
		
		return rt;
	};
	
	NodeList.prototype.toArray = HTMLCollection.prototype.toArray;
	
	
	function each(clbck)
	{
		for (var i = 0; i < this.length; i++)
			clbck(this[i], i);
	}
	
	Array.prototype.each = each;
	HTMLCollection.prototype.each = each;
	NodeList.prototype.each = each;
}

function Addon_String()
{
	String.prototype.trim = function ()
	{
		return this.replace(/(^\s*)|(\s*$)/g, "");
	};
	
	String.isString = function (mixed_var)
	{
		return typeof(mixed_var) == 'string';
	};
	
	String.prototype.startWith = function (str)
    {
        return str.length <= this.length && this.substr(0, str.length) == str;
    };
    
    String.prototype.endWith = function (str)
    {
        return str.length <= this.length && this.substr(this.length-str.length) == str;
    };
	
	String.compare = function (s1, s2)
	{
		return s1.toLowerCase()<s2.toLowerCase()?-1:(s1.toLowerCase()>s2.toLowerCase()?1:0);
	};
	
	String.prototype.count = function (c)
	{
		var nb = 0;
		for(var i = 0; i < this.length; i++)
		{
			if (this[i] == c)
				nb++;
		}
		
		return nb;
	};
	

	get_html_translation_table = function (table, quote_style)
	{ // http://phpjs.org/functions/get_html_translation_table:416
		// Returns the internal translation table used by htmlspecialchars and htmlentities  
		// 
		// version: 1103.1210
		// discuss at: http://phpjs.org/functions/get_html_translation_table
		// +   original by: Philip Peterson
		// +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +   bugfixed by: noname
		// +   bugfixed by: Alex
		// +   bugfixed by: Marco
		// +   bugfixed by: madipta
		// +   improved by: KELAN
		// +   improved by: Brett Zamir (http://brett-zamir.me)
		// +   bugfixed by: Brett Zamir (http://brett-zamir.me)
		// +      input by: Frank Forte
		// +   bugfixed by: T.Wild
		// +      input by: Ratheous
		// %          note: It has been decided that we're not going to add global
		// %          note: dependencies to php.js, meaning the constants are not
		// %          note: real constants, but strings instead. Integers are also supported if someone
		// %          note: chooses to create the constants themselves.
		// *     example 1: get_html_translation_table('HTML_SPECIALCHARS');
		// *     returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}
		var entities = {}, hash_map = {}, decimal = 0, symbol = '';
		var constMappingTable = {'0':'HTML_SPECIALCHARS', '1':'HTML_ENTITIES'};
		var constMappingQuoteStyle = {'0':'ENT_NOQUOTES', '2':'ENT_COMPAT', '3':'ENT_QUOTES'};
		var useTable = {}, useQuoteStyle = {};
		
		useTable = !isNaN(table)?constMappingTable[table]:(table?table.toUpperCase():'HTML_SPECIALCHARS');
		useQuoteStyle = !isNaN(quote_style)?constMappingQuoteStyle[quote_style]:(quote_style?quote_style.toUpperCase():'ENT_COMPAT');
		
		if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') throw new Error("Table: " + useTable + ' not supported');
		
		if (useTable === 'HTML_ENTITIES')
		{
			entities = {'38':'&amp;', '160':'&nbsp;', '161':'&iexcl;', '162':'&cent;', '163':'&pound;', '164':'&curren;', '165':'&yen;',
			'166':'&brvbar;', '167':'&sect;', '168':'&uml;', '169':'&copy;', '170':'&ordf;', '171':'&laquo;',
			'172':'&not;', '173':'&shy;', '174':'&reg;', '175':'&macr;', '176':'&deg;', '177':'&plusmn;',
			'178':'&sup2;', '179':'&sup3;', '180':'&acute;', '181':'&micro;', '182':'&para;', '183':'&middot;',
			'184':'&cedil;', '185':'&sup1;', '186':'&ordm;', '187':'&raquo;', '188':'&frac14;', '189':'&frac12;',
			'190':'&frac34;', '191':'&iquest;', '192':'&Agrave;', '193':'&Aacute;', '194':'&Acirc;',
			'195':'&Atilde;', '196':'&Auml;', '197':'&Aring;', '198':'&AElig;', '199':'&Ccedil;', '200':'&Egrave;',
			'201':'&Eacute;', '202':'&Ecirc;', '203':'&Euml;', '204':'&Igrave;', '205':'&Iacute;', '206':'&Icirc;',
			'207':'&Iuml;', '208':'&ETH;', '209':'&Ntilde;', '210':'&Ograve;', '211':'&Oacute;', '212':'&Ocirc;',
			'213':'&Otilde;', '214':'&Ouml;', '215':'&times;', '216':'&Oslash;', '217':'&Ugrave;',
			'218':'&Uacute;', '219':'&Ucirc;', '220':'&Uuml;', '221':'&Yacute;', '222':'&THORN;', '223':'&szlig;',
			'224':'&agrave;', '225':'&aacute;', '226':'&acirc;', '227':'&atilde;', '228':'&auml;', '229':'&aring;',
			'230':'&aelig;', '231':'&ccedil;', '232':'&egrave;', '233':'&eacute;', '234':'&ecirc;', '235':'&euml;',
			'236':'&igrave;', '237':'&iacute;', '238':'&icirc;', '239':'&iuml;', '240':'&eth;', '241':'&ntilde;',
			'242':'&ograve;', '243':'&oacute;', '244':'&ocirc;', '245':'&otilde;', '246':'&ouml;',
			'247':'&divide;', '248':'&oslash;', '249':'&ugrave;', '250':'&uacute;', '251':'&ucirc;',
			'252':'&uuml;', '253':'&yacute;', '254':'&thorn;', '255':'&yuml;'};
		}
		else
		{
			entities['38'] = '&amp;';
		}
		
		if (useQuoteStyle !== 'ENT_NOQUOTES') entities['34'] = '&quot;';
		if (useQuoteStyle === 'ENT_QUOTES') entities['39'] = '&#39;';
		entities['60'] = '&lt;';
		entities['62'] = '&gt;'; 
		
		// ascii decimals to real symbols
		for (decimal in entities)
		{
			symbol = String.fromCharCode(decimal);
			hash_map[symbol] = entities[decimal];
		}
		
		return hash_map;
	};

	String.prototype.encode_html = function (quote_style)
	{
		// Convert all applicable characters to HTML entities  
		// 
		// version: 1103.1210
		// discuss at: http://phpjs.org/functions/htmlentities    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +   improved by: nobbler
		// +    tweaked by: Jack
		// +   bugfixed by: Onno Marsman    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +    bugfixed by: Brett Zamir (http://brett-zamir.me)
		// +      input by: Ratheous
		// -    depends on: get_html_translation_table
		// *     example 1: htmlentities('Kevin & van Zonneveld');    // *     returns 1: 'Kevin &amp; van Zonneveld'
		// *     example 2: htmlentities("foo'bar","ENT_QUOTES");
		// *     returns 2: 'foo&#039;bar'
		var hash_map = {}, symbol = '', entity = '';
		var tmp_str = this;
		
		if (false === (hash_map = get_html_translation_table('HTML_ENTITIES', quote_style)))
		{
			return false;
		}
		hash_map["'"] = '&#039;';
		for (symbol in hash_map)
		{
			entity = hash_map[symbol];
			tmp_str = tmp_str.split(symbol).join(entity);
		}
		
		return tmp_str;
	};
	
	String.prototype.cut = function(pos, ajout)
	{
		if (typeof(ajout) != 'string') ajout = '';
		if (this.length > pos && pos > ajout.length)
		{
			return this.substr(0, pos-ajout.length)+ajout;
		}
		return this;
	};
	
	// Attention : il faut que le DOM soit initialisé pour cette méthode
	String.prototype.textWidth = function (styles)
	{
		var span = document.createElement('SPAN');
		if (styles)
			span.setStyles(styles);
		
		span.visibility = 'hidden';
		span.innerHTML = this;
		document.body.appendChild(span);
		var width = span.offsetWidth;
		document.body.removeChild(span);
		return width;
	};
	
	String.prototype.utf8_encode = function ()
	{
		var string = this + '';
		var utftext = '', start, end, stringl = 0;
		
		start = end = 0;
		stringl = string.length;
		for (var n = 0; n < stringl; n++)
		{
			var c1 = string.charCodeAt(n);
			var enc = null;
			if (c1 < 128)
				end++;
			else if (c1 > 127 && c1 < 2048)
				enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
			else
				enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
			
			if (enc !== null)
			{
				if (end > start)
					utftext += string.slice(start, end);
				
				utftext += enc;
				start = end = n + 1;
			}
		}
		if (end > start)
			utftext += string.slice(start, stringl);
		
		return utftext;
	};
	
	String.prototype.utf8_decode = function ()
	{
		var str_data = this + '';
		var tmp_arr = [], i = 0, ac = 0, c1 = 0, c2 = 0, c3 = 0;
		
		while (i < str_data.length)
		{
			c1 = str_data.charCodeAt(i);
			if (c1 < 128)
			{
				tmp_arr[ac++] = String.fromCharCode(c1);
				i++;
			}
			else if (c1 > 191 && c1 < 224)
			{
				c2 = str_data.charCodeAt(i + 1);
				tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else
			{
				c2 = str_data.charCodeAt(i + 1);
				c3 = str_data.charCodeAt(i + 2);
				tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		} 
		return tmp_arr.join('');
	};
	
	String.prototype.base64_encode = function ()
	{
		var data = this;
		var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc = '', tmp_arr = [];
		if (!data)
			return data;
		
		data = data.utf8_encode();
		
		do
		{ // pack three octets into four hexets
			o1 = data.charCodeAt(i++);
			o2 = data.charCodeAt(i++);        o3 = data.charCodeAt(i++);
			
			bits = o1 << 16 | o2 << 8 | o3;
			
			h1 = bits >> 18 & 0x3f;        h2 = bits >> 12 & 0x3f;
			h3 = bits >> 6 & 0x3f;
			h4 = bits & 0x3f;
			
			// use hexets to index into b64, and append result to encoded string
			tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
		}
		while (i < data.length);
		
		enc = tmp_arr.join('');
		var r = data.length % 3;
		
		return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
	};
	
	String.prototype.base64_decode = function ()
	{
		var data = this;
		var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = '', tmp_arr = [];
		
		if (!data)
			return data;
		
		data += '';
		
		do
		{ // unpack four hexets into three octets using index points in b64
			h1 = b64.indexOf(data.charAt(i++));
			h2 = b64.indexOf(data.charAt(i++));
			h3 = b64.indexOf(data.charAt(i++));
			h4 = b64.indexOf(data.charAt(i++));
			bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
			
			o1 = bits >> 16 & 0xff;
			o2 = bits >> 8 & 0xff;
			o3 = bits & 0xff; 
			if (h3 == 64)
				tmp_arr[ac++] = String.fromCharCode(o1);
			else if (h4 == 64)
				tmp_arr[ac++] = String.fromCharCode(o1, o2);
			else
				tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
		}
		while (i < data.length);
		
		dec = tmp_arr.join('');
		dec = dec.utf8_decode();
		
		return dec;
	};
	
	
	
	String.prototype.removesAccents = function ()
	{
		return this.replace(/(&#x40|&#064;|@|&commat;|&#x41|&#065;|A|&#x61|&#097;|&#xC0|&#192;|À|&Agrave;|&#xC1|&#193;|Á|&Aacute;|&#xC2|&#194;|Â|&Acirc;|&#xC3|&#195;|Ã|&Atilde;|&#xC4|&#196;|Ä|&Auml;|&#xC5|&#197;|Å|&Aring;|&#xE0|&#224;|à|&agrave;|&#xE1|&#225;|á|&aacute;|&#xE2|&#226;|â|&acirc;|&#xE3|&#227;|ã|&atilde;|&#xE4|&#228;|ä|&auml;|&#xE5|&#229;|å|&aring;)/gi, 'a')
				.replace(/(&#xC7|&#199;|Ç|&Ccedil;|&#xE7|&#231;|ç|&ccedil;)/gi, 'c')
				.replace(/(&#xD0|&#208;|Ð|&ETH;)/gi, 'd')
				.replace(/(&#x45;|&#069;|E|&#x65;|&#101;|&#xC8;|&#200;|È|&Egrave;|&#xC9;|&#201;|É|&Eacute;|&#xCA;|&#202;|Ê|&Ecirc;|&#xCB;|&#203;|Ë|&Euml;|&#xE8;|&#232;|è|&egrave;|&#xE9;|&#233;|é|&eacute;|&#xEA;|&#234;|ê|&ecirc;|&#xEB;|&#235;|ë|&euml;)/gi, 'e')
				.replace(/(&#x49|&#073;|I|&#x69|&#105;|&#xCC|&#204;|Ì|&Igrave;|&#xCD|&#205;|Í|&Iacute;|&#xCE|&#206;|Î|&Icirc;|&#xCF|&#207;|Ï|&Iuml;|&#xEC|&#236;|ì|&igrave;|&#xED|&#237;|í|&iacute;|&#xEE|&#238;|î|&icirc;|&#xEF|&#239;|ï|&iuml;)/gi, 'i')
				.replace(/(&#x4E|&#078;|N|&#x6E|&#110;|&#xD1|&#209;|Ñ|&Ntilde;|&#xF1|&#241;|ñ|&ntilde;)/gi, 'n')
				.replace(/(&#x4F|&#079;|O|&#x6F|&#111;|&#xD2|&#210;|Ò|&Ograve;|&#xD3|&#211;|Ó|&Oacute;|&#xD4|&#212;|Ô|&Ocirc;|&#xD5|&#213;|Õ|&Otilde;|&#xD6|&#214;|Ö|&Ouml;|&#xF2|&#242;|ò|&ograve;|&#xF3|&#243;|ó|&oacute;|&#xF4|&#244;|ô|&ocirc;|&#xF5|&#245;|õ|&otilde;|&#xF6|&#246;|ö|&ouml;|&#xF8|&#248;|ø|&oslash;)/gi, 'o')
				.replace(/(&#x55|&#085;|U|&#x75|&#117;|&#xD9|&#217;|Ù|&Ugrave;|&#xDA|&#218;|Ú|&Uacute;|&#xDB|&#219;|Û|&Ucirc;|&#xDC|&#220;|Ü|&Uuml;|&#xF9|&#249;|ù|&ugrave;|&#xFA|&#250;|ú|&uacute;|&#xFB|&#251;|û|&ucirc;|&#xFC|&#252;|ü|&uuml;)/gi, 'u')
				.replace(/(&#x59|&#089;|Y|&#x79|&#121;|&#xDD|&#221;|Ý|&Yacute;|&#xFD|&#253;|ý|&yacute;|&#xFF|&#255;|ÿ|&yuml;)/gi,'y')
				.replace(/(&#xC6|&#198;|Æ|&AElig;|&#xE6|&#230;|æ|&aelig;)/gi, 'ae')
				.replace(/(&#x8C|&#140;|Œ|&OElig;|&#x9C|&#156;|œ|&oelig;)/gi, 'oe');
	};
}

function Addon_Math()
{
	Math.number_format = function (number, nb_digit)
	{
		var rt = ''+number;
		while (rt.length < nb_digit)
			rt = '0'+rt;
		
		return rt;
	};
	
	Math.nb_decimal = function (number)
	{
		var tmp = ''+number; // transformation en string
		var pos = -1;
		if (tmp.indexOf('.') > -1)
			pos = tmp.indexOf('.');
		else if (tmp.indexOf(',') > -1)
			pos = tmp.indexOf(',');
		else
			return 0;
		
		return tmp.substr(pos+1).length;
	};
	
	Math.px2int = function (pixel)
	{
		return parseInt(pixel.substr(0, pixel.length-2));
	};
}

function Addon_Event()
{
	function Target()
	{
		var targ;
		if (this.target) targ = this.target;
		else if (this.srcElement) targ = this.srcElement;
		
		if (targ.nodeType == 3) // defeat Safari bug
			targ = targ.parentNode;
		
		return targ;
	}
	
	function Stop()
	{
		if (this.cancelBubble != undefined) this.cancelBubble = true;
		if (typeof(this.stopPropagation) != 'undefined')
		{
			this.stopPropagation();
			this.preventDefault();
		}
		return false;
	}
	
	function MOUSE_BUTTON_LEFT()
	{
		return (navigator.Name == 'Explorer' && this.button == 1) || (this.which == 1);
	}
	
	function MOUSE_BUTTON_MIDDLE()
	{
		return (navigator.Name == 'Explorer' && this.button != 1 && this.button != 2) || (this.which == 2);
	}
	
	function MOUSE_BUTTON_RIGHT()
	{
		return (navigator.Name == 'Explorer' && this.button == 2) || (this.which == 3);
	}
	
	function getEvent(event)
	{
		if (!event) event = window.event;
		return event;
	}
	
	function code_keyboard()
	{
		if (navigator.Name == 'Explorer')
			return this.keyCode;
		
		return this.which;
	}
	
	function char_keyboard()
	{
		return String.fromCharCode(this.KEYCODE);
	}
	
	function getPositionX()
	{
		if (this.pageX)
			posx = this.pageX;
		else if (this.clientX)
			posx = this.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		
		return posx;
	}
	
	function getPositionY()
	{
		if (this.pageY)
			posy = this.pageY;
		else if (this.clientY)
			posy = this.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		
		return posy;
	}
	// posx and posy contain the mouse position relative to the document
	// Do something with this information

	// IE 7 non compatible
	// cheat pour que cela fonctionne avec IE 8
	if (typeof(Node) == 'undefined') var Node = Element;
	
	if (typeof(Node) != 'undefined')
	{
		Object.addProperty(Event.prototype, 'Target', Target, null);
		Object.addProperty(Event.prototype, 'MOUSE_BUTTON_LEFT', MOUSE_BUTTON_LEFT, null);
		Object.addProperty(Event.prototype, 'MOUSE_BUTTON_MIDDLE', MOUSE_BUTTON_MIDDLE, null);
		Object.addProperty(Event.prototype, 'MOUSE_BUTTON_RIGHT', MOUSE_BUTTON_RIGHT, null);
		Object.addProperty(Event.prototype, 'KEYCODE', code_keyboard, null);
		Object.addProperty(Event.prototype, 'KEYCHAR', char_keyboard, null);
		Object.addProperty(Event.prototype, 'POSITION_X', getPositionX, null);
		Object.addProperty(Event.prototype, 'POSITION_Y', getPositionY, null);
		Event.prototype.Stop = Stop;
		Event.getEvent = getEvent;
	}
}

	
function Addon_node()
{
	function nextTag()
	{
		var node = this.nextSibling;
		while (node && node.nodeName == '#text')
			node = node.nextSibling;
		
		return node;
	}
	
	function previousTag()
    {
        var node = this.previousSibling;
        while (node && node.nodeName == '#text')
            node = node.previousSibling;
        
        return node;
    }
			
	function firstTag()
	{
		var node = this.firstChild;
		while (node && node.nodeName == '#text')
			node = node.nextSibling;
		
		return node;
	}
			
	function lastTag()
	{
		var node = this.lastChild;
		while (node && node.nodeName == '#text')
			node = node.previousSibling;
		
		return node;
	}

	function insertAfter(newChild, refChild)
	{
		if (refChild.nextSibling)
			this.insertBefore(newChild, refChild.nextSibling);
		else
			this.appendChild(newChild);
	}
	
	function remove()
	{
		this.parentNode.removeChild(this);
	}
	
	function nodes()
	{
		var nodes = new Array();
		var current = this.firstTag;
		while(current)
		{
			nodes[nodes.length] = current;
			current = current.nextTag;
		}
		return nodes;
	}

	function index()
	{
		var current = this;
		var i = 0;
		while((current = current.previousTag) != null) //previousSibling
			i++;

		return i;
	}
	
	function setStyles(styles)
	{
		for (var i in styles)
			this.style[i] = styles[i];
		
		return this; // pour enchainer des opérations
	}
	
	function computedStyle(cssRule)
	{
		if(document.defaultView && document.defaultView.getComputedStyle)
			return document.defaultView.getComputedStyle(this, '').getPropertyValue(cssRule);
			
		if(this.currentStyle)
			return this.currentStyle[cssRule.replace(/\-(\w)/g, function(strMatch, p1) { return p1.toUpperCase(); })];
		
		return '';
	}
	
	function addClass(name_class)
    {
		if (!this.existClass(name_class))
	        this.className += ' ' + name_class;
		
        return this;
    }
    
    function existClass(name_class)
    {
        var classes = this.className.split(' ');
        var i = 0;
        while (i < classes.length && classes[i] != name_class)
            i++;
        
        return (i < classes.length);
    }
    
    function removeClass(name_class)
    {
        var classes = this.className.split(' ');
        var i = 0;
        while (i < classes.length && classes[i] != name_class)
            i++;
        
        if (i < classes.length)
        {
            classes.splice(i, 1);
            this.className = classes.join(' ');
        }
        
        return this;
    }
	
	function getPosition() // marche bien !!!
    {
		var e = this;
        var left = 0;
        var top = 0;
        // Tant que l'on a un element parent
        while (typeof(e.offsetParent) != 'undefined' && e.offsetParent != null)
        {
            // On ajoute la position de l'element parent
            left += e.offsetLeft + (e.clientLeft?e.clientLeft:0);
            top += e.offsetTop + (e.clientTop?e.clientTop:0);
            e = e.offsetParent;
        }
        return {'left':left, 'top':top};
    }
	
	// IE 7 non compatible
	// cheat pour que cela fonctionne avec IE 8
	if (typeof(Node) == 'undefined') var Node = Element;
	
	if (typeof(Node) != 'undefined')
	{
		Object.addProperty(Node.prototype, 'nextTag', nextTag, null);
		Object.addProperty(Node.prototype, 'previousTag', previousTag, null);
		Object.addProperty(Node.prototype, 'firstTag', firstTag, null);
		Object.addProperty(Node.prototype, 'lastTag', lastTag, null);
		Object.addProperty(Node.prototype, 'nodes', nodes, null);
		Object.addProperty(Node.prototype, 'index', index, null);
		Object.addProperty(Node.prototype, 'position', getPosition, null);
		Node.prototype.insertAfter = insertAfter;
		Node.prototype.remove = remove;
		Node.prototype.setStyles = setStyles;
		Node.prototype.computedStyle = computedStyle;
		Node.prototype.existClass = existClass;
		Node.prototype.addClass = addClass;
		Node.prototype.removeClass = removeClass;
		
		/*Node.prototype.attachHandler = function (Event, callback)
		{
			if (window.addEventListener)
			{
				return function(Event, callback)
				{
					this.addEventListener(Event, callback, false);
				};
			}
			else if (window.attachEvent)
			{
				return function(Event, callback)
				{
					this.attachEvent('on'+Event, callback);
				};
			}
			else
			{
				return function(Event, callback)
				{
					alert('impossible d\'attacher l\'évenement "'+Event+'"');
				};
			}
		}();
		
		Node.prototype.detachHandler = function (Event, callback)
		{
			if (window.removeEventListener)
			{
				return function(Event, callback)
				{
					this.removeEventListener(Event, callback, false);
				};
			}
			else if (window.detachEvent)
			{
				return function(Event, callback)
				{
					this.detachEvent('on'+Event, callback);
				};
			}
			else
			{
				return function(Event, callback)
				{
					alert('impossible d\'attacher l\'évenement "'+Event+'"');
				};
			}
		}();*/
		
		if (window.addEventListener)
			Node.prototype.attachHandler = function (eventName, handler) { this.addEventListener(eventName, handler, false); };
		else if (window.attachEvent)
			Node.prototype.attachHandler = function (eventName, handler) { this.attachEvent('on'+eventName, handler); };
		else
			Node.prototype.attachHandler = function(eventName, handler) { alert('impossible d\'attacher l\'évenement "'+eventName+'"'); };
		
		if (window.removeEventListener)
			Node.prototype.detachHandler = function (eventName, handler) { this.removeEventListener(eventName, handler, false); };
		else if (window.detachEvent)
			Node.prototype.detachHandler = function (eventName, handler) { this.detachEvent('on'+eventName, handler); };
		else
			Node.prototype.detachHandler = function(eventName, handler) { alert('impossible de déttacher l\'évenement "'+eventName+'"'); };
		
		
		
		if (!document.attachHandler)
		{
			document.attachHandler = Node.prototype.attachHandler;
			document.detachHandler = Node.prototype.detachHandler;
		}
	}
	
	if (!window.attachHandler)
	{
		window.attachHandler = Node.prototype.attachHandler;
		window.detachHandler = Node.prototype.detachHandler;
	}
	
	window.addLoadEvent = function(callback) { window.attachHandler('load', callback); };
	window.addUnloadEvent = function(callback) { window.attachHandler('unload', callback); };
}


function Addon_Request()
{
	window.Request = function (_link, _arguments, _method, _callback, _format)
	{
		var m_link;
		var m_method;
		
		if (typeof(_format) != 'string' || _format != 'TEXT' && _format != 'JSON') _format = 'TEXT';
		if (typeof(_callback) != 'function') _callback = function (html) {};
		if (typeof(_method) != 'string' || _method != 'GET' && _method != 'POST') _method = 'GET';
		if (typeof(_arguments) != 'string' && typeof(_arguments) != 'object') _arguments = {};
		
		
		
		var obj = null;
		if(window.XMLHttpRequest) // Firefox 
		   obj = new XMLHttpRequest(); 
		else if(window.ActiveXObject) // Internet Explorer 
		   obj = new ActiveXObject("Microsoft.XMLHTTP"); 
		else // XMLHttpRequest non supporté par le navigateur 
		   throw new Exception('Votre navigateur ne supporte pas les objets XMLHTTPRequest...'); 
		
		obj.conteneur = this;
		obj.callback = _callback;
		obj.format = _format;
		obj.arguments = _arguments;
		
		Object.addProperty(this, 'link', function () { return m_link; }, function (l) { if (typeof(l) != 'string') throw new Exception('Aucun lien valide définie'); m_link = l; });
		Object.addProperty(this, 'arguments', function () { return obj.arguments; }, function (a) { if (typeof(a) != 'string' && typeof(a) != 'object') throw new Exception('Mauvais format'); obj.arguments = a; });
		Object.addProperty(this, 'method', function () { return m_method; }, function (m) { if (typeof(m) != 'string' || m != 'GET' && m != 'POST') throw new Exception('Mauvaise methode'); m_method = m; });
		Object.addProperty(this, 'callback', function () { return obj.callback; }, function (c) { if (typeof(c) != 'function') throw new Exception('Le callback doit être une fonction'); obj.callback = c; });
		Object.addProperty(this, 'formet', function () { return obj.format; }, function (f) { if (typeof(f) != 'string' || f != 'TEXT' && f != 'JSON') throw new Exception('Mauvais format'); obj.format = f; });
		
		this.link = _link;
		this.method = _method;
		
		this.send = function ()
		{
			obj.onreadystatechange = function()
			{ 
				if(this.readyState == 4)
				{
					window.request_sended.remove(window.request_sended.indexOf(this.conteneur));
					this.callback((this.format=='JSON'?Object.getObjectJSON(this.responseText):this.responseText), this.arguments, this.conteneur);
					
					this.onreadystatechange = null; // pour empecher de lever plusieurs fois l'event
				}
			};
			
			var args = '';
			if (typeof(obj.arguments) == 'string')
				args = obj.arguments;
			else
			{ // tableau
				for (var arg in obj.arguments)
				{
					if (obj.arguments.hasOwnProperty(arg))
						args += '&'+arg+'='+obj.arguments[arg];
				}
				
				if (args != '')
					args = args.substring(1, args.length);	
			}
			if (this.method == 'GET' && args != '')
				this.link += '?'+args;
			
			obj.open(this.method, this.link, true);
			if (this.method == 'GET')
			{
				obj.send(null);
			}
			else
			{
				obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				obj.send(args);
			}
			
			window.request_sended.push(this);
		};
		
		this.origin = function ()
		{
			return obj;
		};
	};
	
	// liste les requetes ajax en cours d'execution (peut permettre de les stopper lorsque l'on quitte la page)
	window.request_sended = new Array();
	
	window.sendRequest = function (lien, arguments, methode, nom_fonction, format)
	{
		new window.Request(lien, arguments, methode, nom_fonction, format).send();
	};
}

function Addon_date()
{
	Date.DAYS = new Array('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche');
	Date.MONTHS = new Array('janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre');
	
			 
	Date.get = function (year, month, day, hours, minutes, seconds, milliseconds)
	{ // retourne un objet Date initialisé avec day, month et year
		return new Date().set(year, month, day, hours, minutes, seconds, milliseconds);
	};
	
	Date.prototype.set = function (year, month, day, hours, minutes, seconds, milliseconds)
	{ // initialise un objet Date avec day, month et year
		this.setDate(day);
		this.setFullMonth(month);
		this.setFullYear(year);
		if (typeof(hours) != 'undefined') this.setHours(hours); else this.setHours(0);
		if (typeof(minutes) != 'undefined') this.setMinutes(minutes); else this.setMinutes(0);
		if (typeof(seconds) != 'undefined') this.setSeconds(seconds); else this.setSeconds(0);
		if (typeof(milliseconds) != 'undefined') this.setMilliseconds(milliseconds); else this.setMilliseconds(0);
		return this; // pour permettre d'enchainer les opérations
	};
	
	Date.prototype.clone = function ()
	{
		return Date.get(this.getFullYear(), this.getFullMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds());
	};
	
	Date.prototype.getNbDayOnMonth = function ()
	{ // retourne le nombre de jour du mois courant de l'année courante
		var month = this.getMonth()+1;
		var year = this.getFullYear();
		if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12)
			return 31;
		else if (month == 4 || month == 6 || month == 9 || month == 11)
			return 30;
		else if (month == 2 && (year % 4) == 0)
			return 29;
		else if (month == 2 && (year % 4) != 0)
			return 28;
		
		return -1;
	};
	
	Date.prototype.getFullMonth = function ()
	{
		return this.getMonth()+1;
	};
	
	Date.prototype.setFullMonth = function (month)
	{
		return this.setMonth(month-1);
	};
	
	Date.prototype.getDayInWeek = function ()
	{ // retourne le numéro du jour de la semaine (1 => Lu, 2 => Ma, 3 => Me, ..., 7 => Di)
		return (this.getDay()==0?7:this.getDay());
	};
	
	Date.validate = function (year, month, day, hours, minutes, seconds, milliseconds)
	{ // return true si date valide
		if (typeof(milliseconds) != 'undefined' && (milliseconds < 0 || milliseconds > 999)) return false;
		if (typeof(seconds) != 'undefined' && (seconds < 0 || seconds > 59)) return false;
		if (typeof(minutes) != 'undefined' && (minutes < 0 || minutes > 59)) return false;
		if (typeof(hours) != 'undefined' && (hours < 0 || hours > 24)) return false;
		if (month < 1 || month > 12) return false;
		
		var tmp = Date.get(year, month, 1);
		return day >= 1 && day <= tmp.getNbDayOnMonth();
	};
	
	
	Date.prototype.toSqlDate = function ()
	{ // retourne la date au format SQL : YYYY-MM-DD
		var day = this.getDate();
		var month = this.getMonth()+1;
		var year = this.getFullYear();
		return year+'-'+Math.number_format(month, 2)+'-'+Math.number_format(day, 2);
	};
	
	Date.prototype.toSqlTime = function ()
	{ // retourne l'heure au format SQL : HH:MM:SS
		var hours = this.getHours();
		var minutes = this.getMinutes();
		var seconds = this.getSeconds();
		return Math.number_format(hours, 2)+':'+Math.number_format(minutes, 2)+':'+Math.number_format(seconds, 2);
	};
	
	Date.prototype.toSqlDateTime = function ()
	{ // retourne l'heure et la date au format SQL : "YYYY-MM-DD HH:MM:SS"
		return this.toSqlDate()+' '+this.toSqlTime();
	};
	
	Date.prototype.equals = function (date)
	{ // retourne true si this est égale à date
		return this.getFullYear()     == date.getFullYear()
			&& this.getMonth()        == date.getMonth()
			&& this.getDate()         == date.getDate()
			&& this.getHours()        == date.getHours()
			&& this.getMinutes()      == date.getMinutes()
			&& this.getSeconds()      == date.getSeconds()
			&& this.getMilliseconds() == date.getMilliseconds();
	};
	
	Date.prototype.greaterThan = function (date)
	{ // retourne true si this est plus grand que date
		return this.getFullYear() > date.getFullYear() || 
		this.getFullYear() == date.getFullYear() && this.getMonth() > date.getMonth() || 
		this.getFullYear() == date.getFullYear() && this.getMonth() == date.getMonth() && this.getDate() > date.getDate() || 
		this.getFullYear() == date.getFullYear() && this.getMonth() == date.getMonth() && this.getDate() == date.getDate() && this.getHours() > date.getHours() ||
		this.getFullYear() == date.getFullYear() && this.getMonth() == date.getMonth() && this.getDate() == date.getDate() && this.getHours() == date.getHours() && this.getMinutes() > date.getMinutes() || 
		this.getFullYear() == date.getFullYear() && this.getMonth() == date.getMonth() && this.getDate() == date.getDate() && this.getHours() == date.getHours() && this.getMinutes() == date.getMinutes() && this.getSeconds() > date.getSeconds() || 
		this.getFullYear() == date.getFullYear() && this.getMonth() == date.getMonth() && this.getDate() == date.getDate() && this.getHours() == date.getHours() && this.getMinutes() == date.getMinutes() && this.getSeconds() == date.getSeconds() && this.getMilliseconds() > date.getMilliseconds();
	};
	
	Date.prototype.lowerThan = function (date)
	{ // retourne true si this est plus petit que date
		return !this.greaterThan(date) && !this.equals(date);
	};
}


function Addon_cookie()
{
	document.Cookie = {};
	
	document.Cookie.Create = function (name, value, days)
	{
		var expires = '';
		
		if (days)
		{
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = '; expires=' + date.toGMTString();
		}
		
		document.cookie = name + '=' + value + expires + '; path=/';
	};

	document.Cookie.Read = function (name)
	{
		var nameEQ = name + '=';
		var ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++)
		{
			var c = ca[i];
			while (c.charAt(0) == ' ')
				c = c.substring(1, c.length);
			
			if (c.indexOf(nameEQ) == 0)
				return c.substring(nameEQ.length, c.length);
		}
		return null;
	};

	document.Cookie.Erase = function (name)
	{
		document.Cookie.Create(name, '', -1);
	};
}