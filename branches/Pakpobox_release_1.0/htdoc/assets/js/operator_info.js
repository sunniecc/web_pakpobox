/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview index.js
	 * @version 1.0.0
	 * @author <a href="mailto:lucienxu@tencent.com">lucienxu</a>
	 * @date 2015/08/15
	 * @copyright Copyright (c) 2014, Tencent Inc. All rights reserved.
	 * @see [link]
	 *
	 */

	__webpack_require__(1);
	var Api = __webpack_require__(2);
	var userType = __webpack_require__(8);
	var Lang = __webpack_require__(3);
	var Header = __webpack_require__(9);
	var Nav = __webpack_require__(10);
	var Table = __webpack_require__(11);

	(function(angular) {
	    'use strict';
	    angular.module('operatorInfo', ['ngSanitize'])
	        .controller('main', function($scope, $templateCache, $filter) {
	            $.extend($scope, Lang);

	            $templateCache.removeAll();
	            $templateCache.put('header',Header);
	            $templateCache.put('nav',Nav);
	            $templateCache.put('table',Table);

	            Api.userInfo(function(json){
	                if(json.statusCode != 0){
	                    location.href = 'login.html';
	                }else{
	                    $scope.usertype = $scope[userType[json.result.role]];
	                    $scope.username = json.result.name;
	                    $scope.$apply();
	                }
	            })
	        })
	        .filter('trusted', ['$sce', function ($sce) {
	            return function (text) {
	                return $sce.trustAsHtml(text);
	            }
	        }]).directive('placeholder', ['$compile', function($compile){
	            return {
	                restrict: 'A',
	                scope: {},
	                link: function(scope, ele, attr) {
	                    var input = document.createElement('input');
	                    var isSupportPlaceholder = 'placeholder' in input;
	                    if (!isSupportPlaceholder) {
	                        var fakePlaceholder = angular.element(
	                            '<span class="placeholder">' + attr['placeholder'] + '</span>');
	                        fakePlaceholder.on('click', function(e){
	                            e.stopPropagation();
	                            ele.focus();
	                        });
	                        ele.before(fakePlaceholder);
	                        $compile(fakePlaceholder)(scope);
	                        ele.on('focus', function(){
	                            fakePlaceholder.hide();
	                        }).on('blur', function(){
	                            if (ele.val() === '') {
	                                fakePlaceholder.show();
	                            }
	                        });
	                    }
	                }
	            };
	        }]);;
	})(window.angular);

/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * @license AngularJS v1.4.0-rc.2
	 * (c) 2010-2015 Google, Inc. http://angularjs.org
	 * License: MIT
	 */
	(function(window, angular, undefined) {'use strict';

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 *     Any commits to this file should be reviewed with security in mind.  *
	 *   Changes to this file can potentially create security vulnerabilities. *
	 *          An approval from 2 Core members with history of modifying      *
	 *                         this file is required.                          *
	 *                                                                         *
	 *  Does the change somehow allow for arbitrary javascript to be executed? *
	 *    Or allows for someone to change the prototype of built-in objects?   *
	 *     Or gives undesired access to variables likes document or window?    *
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	var $sanitizeMinErr = angular.$$minErr('$sanitize');

	/**
	 * @ngdoc module
	 * @name ngSanitize
	 * @description
	 *
	 * # ngSanitize
	 *
	 * The `ngSanitize` module provides functionality to sanitize HTML.
	 *
	 *
	 * <div doc-module-components="ngSanitize"></div>
	 *
	 * See {@link ngSanitize.$sanitize `$sanitize`} for usage.
	 */

	/*
	 * HTML Parser By Misko Hevery (misko@hevery.com)
	 * based on:  HTML Parser By John Resig (ejohn.org)
	 * Original code by Erik Arvidsson, Mozilla Public License
	 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
	 *
	 * // Use like so:
	 * htmlParser(htmlString, {
	 *     start: function(tag, attrs, unary) {},
	 *     end: function(tag) {},
	 *     chars: function(text) {},
	 *     comment: function(text) {}
	 * });
	 *
	 */


	/**
	 * @ngdoc service
	 * @name $sanitize
	 * @kind function
	 *
	 * @description
	 *   The input is sanitized by parsing the HTML into tokens. All safe tokens (from a whitelist) are
	 *   then serialized back to properly escaped html string. This means that no unsafe input can make
	 *   it into the returned string, however, since our parser is more strict than a typical browser
	 *   parser, it's possible that some obscure input, which would be recognized as valid HTML by a
	 *   browser, won't make it through the sanitizer. The input may also contain SVG markup.
	 *   The whitelist is configured using the functions `aHrefSanitizationWhitelist` and
	 *   `imgSrcSanitizationWhitelist` of {@link ng.$compileProvider `$compileProvider`}.
	 *
	 * @param {string} html HTML input.
	 * @returns {string} Sanitized HTML.
	 *
	 * @example
	   <example module="sanitizeExample" deps="angular-sanitize.js">
	   <file name="index.html">
	     <script>
	         angular.module('sanitizeExample', ['ngSanitize'])
	           .controller('ExampleController', ['$scope', '$sce', function($scope, $sce) {
	             $scope.snippet =
	               '<p style="color:blue">an html\n' +
	               '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>\n' +
	               'snippet</p>';
	             $scope.deliberatelyTrustDangerousSnippet = function() {
	               return $sce.trustAsHtml($scope.snippet);
	             };
	           }]);
	     </script>
	     <div ng-controller="ExampleController">
	        Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
	       <table>
	         <tr>
	           <td>Directive</td>
	           <td>How</td>
	           <td>Source</td>
	           <td>Rendered</td>
	         </tr>
	         <tr id="bind-html-with-sanitize">
	           <td>ng-bind-html</td>
	           <td>Automatically uses $sanitize</td>
	           <td><pre>&lt;div ng-bind-html="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
	           <td><div ng-bind-html="snippet"></div></td>
	         </tr>
	         <tr id="bind-html-with-trust">
	           <td>ng-bind-html</td>
	           <td>Bypass $sanitize by explicitly trusting the dangerous value</td>
	           <td>
	           <pre>&lt;div ng-bind-html="deliberatelyTrustDangerousSnippet()"&gt;
	&lt;/div&gt;</pre>
	           </td>
	           <td><div ng-bind-html="deliberatelyTrustDangerousSnippet()"></div></td>
	         </tr>
	         <tr id="bind-default">
	           <td>ng-bind</td>
	           <td>Automatically escapes</td>
	           <td><pre>&lt;div ng-bind="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
	           <td><div ng-bind="snippet"></div></td>
	         </tr>
	       </table>
	       </div>
	   </file>
	   <file name="protractor.js" type="protractor">
	     it('should sanitize the html snippet by default', function() {
	       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
	         toBe('<p>an html\n<em>click here</em>\nsnippet</p>');
	     });

	     it('should inline raw snippet if bound to a trusted value', function() {
	       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).
	         toBe("<p style=\"color:blue\">an html\n" +
	              "<em onmouseover=\"this.textContent='PWN3D!'\">click here</em>\n" +
	              "snippet</p>");
	     });

	     it('should escape snippet without any filter', function() {
	       expect(element(by.css('#bind-default div')).getInnerHtml()).
	         toBe("&lt;p style=\"color:blue\"&gt;an html\n" +
	              "&lt;em onmouseover=\"this.textContent='PWN3D!'\"&gt;click here&lt;/em&gt;\n" +
	              "snippet&lt;/p&gt;");
	     });

	     it('should update', function() {
	       element(by.model('snippet')).clear();
	       element(by.model('snippet')).sendKeys('new <b onclick="alert(1)">text</b>');
	       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
	         toBe('new <b>text</b>');
	       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).toBe(
	         'new <b onclick="alert(1)">text</b>');
	       expect(element(by.css('#bind-default div')).getInnerHtml()).toBe(
	         "new &lt;b onclick=\"alert(1)\"&gt;text&lt;/b&gt;");
	     });
	   </file>
	   </example>
	 */
	function $SanitizeProvider() {
	  this.$get = ['$$sanitizeUri', function($$sanitizeUri) {
	    return function(html) {
	      var buf = [];
	      htmlParser(html, htmlSanitizeWriter(buf, function(uri, isImage) {
	        return !/^unsafe/.test($$sanitizeUri(uri, isImage));
	      }));
	      return buf.join('');
	    };
	  }];
	}

	function sanitizeText(chars) {
	  var buf = [];
	  var writer = htmlSanitizeWriter(buf, angular.noop);
	  writer.chars(chars);
	  return buf.join('');
	}


	// Regular Expressions for parsing tags and attributes
	var START_TAG_REGEXP =
	       /^<((?:[a-zA-Z])[\w:-]*)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*(>?)/,
	  END_TAG_REGEXP = /^<\/\s*([\w:-]+)[^>]*>/,
	  ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
	  BEGIN_TAG_REGEXP = /^</,
	  BEGING_END_TAGE_REGEXP = /^<\//,
	  COMMENT_REGEXP = /<!--(.*?)-->/g,
	  DOCTYPE_REGEXP = /<!DOCTYPE([^>]*?)>/i,
	  CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
	  SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
	  // Match everything outside of normal chars and " (quote character)
	  NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;


	// Good source of info about elements and attributes
	// http://dev.w3.org/html5/spec/Overview.html#semantics
	// http://simon.html5.org/html-elements

	// Safe Void Elements - HTML5
	// http://dev.w3.org/html5/spec/Overview.html#void-elements
	var voidElements = makeMap("area,br,col,hr,img,wbr");

	// Elements that you can, intentionally, leave open (and which close themselves)
	// http://dev.w3.org/html5/spec/Overview.html#optional-tags
	var optionalEndTagBlockElements = makeMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
	    optionalEndTagInlineElements = makeMap("rp,rt"),
	    optionalEndTagElements = angular.extend({},
	                                            optionalEndTagInlineElements,
	                                            optionalEndTagBlockElements);

	// Safe Block Elements - HTML5
	var blockElements = angular.extend({}, optionalEndTagBlockElements, makeMap("address,article," +
	        "aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," +
	        "h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul"));

	// Inline Elements - HTML5
	var inlineElements = angular.extend({}, optionalEndTagInlineElements, makeMap("a,abbr,acronym,b," +
	        "bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s," +
	        "samp,small,span,strike,strong,sub,sup,time,tt,u,var"));

	// SVG Elements
	// https://wiki.whatwg.org/wiki/Sanitization_rules#svg_Elements
	// Note: the elements animate,animateColor,animateMotion,animateTransform,set are intentionally omitted.
	// They can potentially allow for arbitrary javascript to be executed. See #11290
	var svgElements = makeMap("circle,defs,desc,ellipse,font-face,font-face-name,font-face-src,g,glyph," +
	        "hkern,image,linearGradient,line,marker,metadata,missing-glyph,mpath,path,polygon,polyline," +
	        "radialGradient,rect,stop,svg,switch,text,title,tspan,use");

	// Special Elements (can contain anything)
	var specialElements = makeMap("script,style");

	var validElements = angular.extend({},
	                                   voidElements,
	                                   blockElements,
	                                   inlineElements,
	                                   optionalEndTagElements,
	                                   svgElements);

	//Attributes that have href and hence need to be sanitized
	var uriAttrs = makeMap("background,cite,href,longdesc,src,usemap,xlink:href");

	var htmlAttrs = makeMap('abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,' +
	    'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,' +
	    'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,' +
	    'scope,scrolling,shape,size,span,start,summary,target,title,type,' +
	    'valign,value,vspace,width');

	// SVG attributes (without "id" and "name" attributes)
	// https://wiki.whatwg.org/wiki/Sanitization_rules#svg_Attributes
	var svgAttrs = makeMap('accent-height,accumulate,additive,alphabetic,arabic-form,ascent,' +
	    'baseProfile,bbox,begin,by,calcMode,cap-height,class,color,color-rendering,content,' +
	    'cx,cy,d,dx,dy,descent,display,dur,end,fill,fill-rule,font-family,font-size,font-stretch,' +
	    'font-style,font-variant,font-weight,from,fx,fy,g1,g2,glyph-name,gradientUnits,hanging,' +
	    'height,horiz-adv-x,horiz-origin-x,ideographic,k,keyPoints,keySplines,keyTimes,lang,' +
	    'marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mathematical,' +
	    'max,min,offset,opacity,orient,origin,overline-position,overline-thickness,panose-1,' +
	    'path,pathLength,points,preserveAspectRatio,r,refX,refY,repeatCount,repeatDur,' +
	    'requiredExtensions,requiredFeatures,restart,rotate,rx,ry,slope,stemh,stemv,stop-color,' +
	    'stop-opacity,strikethrough-position,strikethrough-thickness,stroke,stroke-dasharray,' +
	    'stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,' +
	    'stroke-width,systemLanguage,target,text-anchor,to,transform,type,u1,u2,underline-position,' +
	    'underline-thickness,unicode,unicode-range,units-per-em,values,version,viewBox,visibility,' +
	    'width,widths,x,x-height,x1,x2,xlink:actuate,xlink:arcrole,xlink:role,xlink:show,xlink:title,' +
	    'xlink:type,xml:base,xml:lang,xml:space,xmlns,xmlns:xlink,y,y1,y2,zoomAndPan', true);

	var validAttrs = angular.extend({},
	                                uriAttrs,
	                                svgAttrs,
	                                htmlAttrs);

	function makeMap(str, lowercaseKeys) {
	  var obj = {}, items = str.split(','), i;
	  for (i = 0; i < items.length; i++) {
	    obj[lowercaseKeys ? angular.lowercase(items[i]) : items[i]] = true;
	  }
	  return obj;
	}


	/**
	 * @example
	 * htmlParser(htmlString, {
	 *     start: function(tag, attrs, unary) {},
	 *     end: function(tag) {},
	 *     chars: function(text) {},
	 *     comment: function(text) {}
	 * });
	 *
	 * @param {string} html string
	 * @param {object} handler
	 */
	function htmlParser(html, handler) {
	  if (typeof html !== 'string') {
	    if (html === null || typeof html === 'undefined') {
	      html = '';
	    } else {
	      html = '' + html;
	    }
	  }
	  var index, chars, match, stack = [], last = html, text;
	  stack.last = function() { return stack[stack.length - 1]; };

	  while (html) {
	    text = '';
	    chars = true;

	    // Make sure we're not in a script or style element
	    if (!stack.last() || !specialElements[stack.last()]) {

	      // Comment
	      if (html.indexOf("<!--") === 0) {
	        // comments containing -- are not allowed unless they terminate the comment
	        index = html.indexOf("--", 4);

	        if (index >= 0 && html.lastIndexOf("-->", index) === index) {
	          if (handler.comment) handler.comment(html.substring(4, index));
	          html = html.substring(index + 3);
	          chars = false;
	        }
	      // DOCTYPE
	      } else if (DOCTYPE_REGEXP.test(html)) {
	        match = html.match(DOCTYPE_REGEXP);

	        if (match) {
	          html = html.replace(match[0], '');
	          chars = false;
	        }
	      // end tag
	      } else if (BEGING_END_TAGE_REGEXP.test(html)) {
	        match = html.match(END_TAG_REGEXP);

	        if (match) {
	          html = html.substring(match[0].length);
	          match[0].replace(END_TAG_REGEXP, parseEndTag);
	          chars = false;
	        }

	      // start tag
	      } else if (BEGIN_TAG_REGEXP.test(html)) {
	        match = html.match(START_TAG_REGEXP);

	        if (match) {
	          // We only have a valid start-tag if there is a '>'.
	          if (match[4]) {
	            html = html.substring(match[0].length);
	            match[0].replace(START_TAG_REGEXP, parseStartTag);
	          }
	          chars = false;
	        } else {
	          // no ending tag found --- this piece should be encoded as an entity.
	          text += '<';
	          html = html.substring(1);
	        }
	      }

	      if (chars) {
	        index = html.indexOf("<");

	        text += index < 0 ? html : html.substring(0, index);
	        html = index < 0 ? "" : html.substring(index);

	        if (handler.chars) handler.chars(decodeEntities(text));
	      }

	    } else {
	      // IE versions 9 and 10 do not understand the regex '[^]', so using a workaround with [\W\w].
	      html = html.replace(new RegExp("([\\W\\w]*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'),
	        function(all, text) {
	          text = text.replace(COMMENT_REGEXP, "$1").replace(CDATA_REGEXP, "$1");

	          if (handler.chars) handler.chars(decodeEntities(text));

	          return "";
	      });

	      parseEndTag("", stack.last());
	    }

	    if (html == last) {
	      throw $sanitizeMinErr('badparse', "The sanitizer was unable to parse the following block " +
	                                        "of html: {0}", html);
	    }
	    last = html;
	  }

	  // Clean up any remaining tags
	  parseEndTag();

	  function parseStartTag(tag, tagName, rest, unary) {
	    tagName = angular.lowercase(tagName);
	    if (blockElements[tagName]) {
	      while (stack.last() && inlineElements[stack.last()]) {
	        parseEndTag("", stack.last());
	      }
	    }

	    if (optionalEndTagElements[tagName] && stack.last() == tagName) {
	      parseEndTag("", tagName);
	    }

	    unary = voidElements[tagName] || !!unary;

	    if (!unary) {
	      stack.push(tagName);
	    }

	    var attrs = {};

	    rest.replace(ATTR_REGEXP,
	      function(match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
	        var value = doubleQuotedValue
	          || singleQuotedValue
	          || unquotedValue
	          || '';

	        attrs[name] = decodeEntities(value);
	    });
	    if (handler.start) handler.start(tagName, attrs, unary);
	  }

	  function parseEndTag(tag, tagName) {
	    var pos = 0, i;
	    tagName = angular.lowercase(tagName);
	    if (tagName) {
	      // Find the closest opened tag of the same type
	      for (pos = stack.length - 1; pos >= 0; pos--) {
	        if (stack[pos] == tagName) break;
	      }
	    }

	    if (pos >= 0) {
	      // Close all the open elements, up the stack
	      for (i = stack.length - 1; i >= pos; i--)
	        if (handler.end) handler.end(stack[i]);

	      // Remove the open elements from the stack
	      stack.length = pos;
	    }
	  }
	}

	var hiddenPre=document.createElement("pre");
	/**
	 * decodes all entities into regular string
	 * @param value
	 * @returns {string} A string with decoded entities.
	 */
	function decodeEntities(value) {
	  if (!value) { return ''; }

	  hiddenPre.innerHTML = value.replace(/</g,"&lt;");
	  // innerText depends on styling as it doesn't display hidden elements.
	  // Therefore, it's better to use textContent not to cause unnecessary reflows.
	  return hiddenPre.textContent;
	}

	/**
	 * Escapes all potentially dangerous characters, so that the
	 * resulting string can be safely inserted into attribute or
	 * element text.
	 * @param value
	 * @returns {string} escaped text
	 */
	function encodeEntities(value) {
	  return value.
	    replace(/&/g, '&amp;').
	    replace(SURROGATE_PAIR_REGEXP, function(value) {
	      var hi = value.charCodeAt(0);
	      var low = value.charCodeAt(1);
	      return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
	    }).
	    replace(NON_ALPHANUMERIC_REGEXP, function(value) {
	      return '&#' + value.charCodeAt(0) + ';';
	    }).
	    replace(/</g, '&lt;').
	    replace(/>/g, '&gt;');
	}

	/**
	 * create an HTML/XML writer which writes to buffer
	 * @param {Array} buf use buf.jain('') to get out sanitized html string
	 * @returns {object} in the form of {
	 *     start: function(tag, attrs, unary) {},
	 *     end: function(tag) {},
	 *     chars: function(text) {},
	 *     comment: function(text) {}
	 * }
	 */
	function htmlSanitizeWriter(buf, uriValidator) {
	  var ignore = false;
	  var out = angular.bind(buf, buf.push);
	  return {
	    start: function(tag, attrs, unary) {
	      tag = angular.lowercase(tag);
	      if (!ignore && specialElements[tag]) {
	        ignore = tag;
	      }
	      if (!ignore && validElements[tag] === true) {
	        out('<');
	        out(tag);
	        angular.forEach(attrs, function(value, key) {
	          var lkey=angular.lowercase(key);
	          var isImage = (tag === 'img' && lkey === 'src') || (lkey === 'background');
	          if (validAttrs[lkey] === true &&
	            (uriAttrs[lkey] !== true || uriValidator(value, isImage))) {
	            out(' ');
	            out(key);
	            out('="');
	            out(encodeEntities(value));
	            out('"');
	          }
	        });
	        out(unary ? '/>' : '>');
	      }
	    },
	    end: function(tag) {
	        tag = angular.lowercase(tag);
	        if (!ignore && validElements[tag] === true) {
	          out('</');
	          out(tag);
	          out('>');
	        }
	        if (tag == ignore) {
	          ignore = false;
	        }
	      },
	    chars: function(chars) {
	        if (!ignore) {
	          out(encodeEntities(chars));
	        }
	      }
	  };
	}


	// define ngSanitize module and register $sanitize service
	angular.module('ngSanitize', []).provider('$sanitize', $SanitizeProvider);

	/* global sanitizeText: false */

	/**
	 * @ngdoc filter
	 * @name linky
	 * @kind function
	 *
	 * @description
	 * Finds links in text input and turns them into html links. Supports http/https/ftp/mailto and
	 * plain email address links.
	 *
	 * Requires the {@link ngSanitize `ngSanitize`} module to be installed.
	 *
	 * @param {string} text Input text.
	 * @param {string} target Window (_blank|_self|_parent|_top) or named frame to open links in.
	 * @returns {string} Html-linkified text.
	 *
	 * @usage
	   <span ng-bind-html="linky_expression | linky"></span>
	 *
	 * @example
	   <example module="linkyExample" deps="angular-sanitize.js">
	     <file name="index.html">
	       <script>
	         angular.module('linkyExample', ['ngSanitize'])
	           .controller('ExampleController', ['$scope', function($scope) {
	             $scope.snippet =
	               'Pretty text with some links:\n'+
	               'http://angularjs.org/,\n'+
	               'mailto:us@somewhere.org,\n'+
	               'another@somewhere.org,\n'+
	               'and one more: ftp://127.0.0.1/.';
	             $scope.snippetWithTarget = 'http://angularjs.org/';
	           }]);
	       </script>
	       <div ng-controller="ExampleController">
	       Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
	       <table>
	         <tr>
	           <td>Filter</td>
	           <td>Source</td>
	           <td>Rendered</td>
	         </tr>
	         <tr id="linky-filter">
	           <td>linky filter</td>
	           <td>
	             <pre>&lt;div ng-bind-html="snippet | linky"&gt;<br>&lt;/div&gt;</pre>
	           </td>
	           <td>
	             <div ng-bind-html="snippet | linky"></div>
	           </td>
	         </tr>
	         <tr id="linky-target">
	          <td>linky target</td>
	          <td>
	            <pre>&lt;div ng-bind-html="snippetWithTarget | linky:'_blank'"&gt;<br>&lt;/div&gt;</pre>
	          </td>
	          <td>
	            <div ng-bind-html="snippetWithTarget | linky:'_blank'"></div>
	          </td>
	         </tr>
	         <tr id="escaped-html">
	           <td>no filter</td>
	           <td><pre>&lt;div ng-bind="snippet"&gt;<br>&lt;/div&gt;</pre></td>
	           <td><div ng-bind="snippet"></div></td>
	         </tr>
	       </table>
	     </file>
	     <file name="protractor.js" type="protractor">
	       it('should linkify the snippet with urls', function() {
	         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
	             toBe('Pretty text with some links: http://angularjs.org/, us@somewhere.org, ' +
	                  'another@somewhere.org, and one more: ftp://127.0.0.1/.');
	         expect(element.all(by.css('#linky-filter a')).count()).toEqual(4);
	       });

	       it('should not linkify snippet without the linky filter', function() {
	         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText()).
	             toBe('Pretty text with some links: http://angularjs.org/, mailto:us@somewhere.org, ' +
	                  'another@somewhere.org, and one more: ftp://127.0.0.1/.');
	         expect(element.all(by.css('#escaped-html a')).count()).toEqual(0);
	       });

	       it('should update', function() {
	         element(by.model('snippet')).clear();
	         element(by.model('snippet')).sendKeys('new http://link.');
	         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
	             toBe('new http://link.');
	         expect(element.all(by.css('#linky-filter a')).count()).toEqual(1);
	         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText())
	             .toBe('new http://link.');
	       });

	       it('should work with the target property', function() {
	        expect(element(by.id('linky-target')).
	            element(by.binding("snippetWithTarget | linky:'_blank'")).getText()).
	            toBe('http://angularjs.org/');
	        expect(element(by.css('#linky-target a')).getAttribute('target')).toEqual('_blank');
	       });
	     </file>
	   </example>
	 */
	angular.module('ngSanitize').filter('linky', ['$sanitize', function($sanitize) {
	  var LINKY_URL_REGEXP =
	        /((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"”’]/,
	      MAILTO_REGEXP = /^mailto:/;

	  return function(text, target) {
	    if (!text) return text;
	    var match;
	    var raw = text;
	    var html = [];
	    var url;
	    var i;
	    while ((match = raw.match(LINKY_URL_REGEXP))) {
	      // We can not end in these as they are sometimes found at the end of the sentence
	      url = match[0];
	      // if we did not match ftp/http/www/mailto then assume mailto
	      if (!match[2] && !match[4]) {
	        url = (match[3] ? 'http://' : 'mailto:') + url;
	      }
	      i = match.index;
	      addText(raw.substr(0, i));
	      addLink(url, match[0].replace(MAILTO_REGEXP, ''));
	      raw = raw.substring(i + match[0].length);
	    }
	    addText(raw);
	    return $sanitize(html.join(''));

	    function addText(text) {
	      if (!text) {
	        return;
	      }
	      html.push(sanitizeText(text));
	    }

	    function addLink(url, text) {
	      html.push('<a ');
	      if (angular.isDefined(target)) {
	        html.push('target="',
	                  target,
	                  '" ');
	      }
	      html.push('href="',
	                url.replace(/"/g, '&quot;'),
	                '">');
	      addText(text);
	      html.push('</a>');
	    }
	  };
	}]);


	})(window, window.angular);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview api接口
	 * @version 1.0.0
	 * @author <a href="mailto:lucienxu@tencent.com">lucienxu</a>
	 * @date 2015/08/15
	 * @copyright Copyright (c) 2014, Tencent Inc. All rights reserved.
	 * @see [link]
	 *
	 */

	var Lang = __webpack_require__(3);
	var Alert = __webpack_require__(6);

	var urlHead = 'http://admin.pakpobox.com/cgi-bin/';
	var getData = function (url, data, callback) {
	    $.ajax({
	        url: urlHead + url,
	        type: 'GET',
	        data: data,
	        dataType: 'json',
	        success: function (json) {
	            callback(json);
	        },
	        error: function (err) {
	            console.log(err)
	            Alert.show(Lang.LConnectError);
	        }
	    })
	}

	var postData = function (url, data, callback) {
	    data = JSON.stringify(data);
	    $.ajax({
	        url: urlHead + url,
	        type: 'POST',
	        data: data,
	        dataType: 'json',
	        contentType: 'application/json',
	        success: function (json) {
	            callback(json);
	        },
	        error: function () {
	            Alert.show(Lang.LConnectError);
	        }
	    })
	}

	var Api = {
	    login: function (param, callback) {
	        var url = 'index/user/login',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    logout: function () {
	        var url = 'index/user/logout',
	            data = {}
	        postData(url, data, function (json) {
	            if(json.statusCode == 0){
	                location.href = 'login.html';
	            }
	        })
	    },
	    post: function (callback) {
	        var url = 'index/user/post',
	            data = {}
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    userInfo: function (callback) {
	        var url = 'index/user/userInfo',
	            data = {}
	        getData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    getExpress: function (param, callback) {
	        var url = 'index/express/getExpress',
	            data = {}
	        $.extend(data, param);
	        getData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    companyInfo: function(param, callback){
	        var url = 'index/company/queryCompanyInfo',
	            data = {}
	        $.extend(data, param);
	        getData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    courierInfo: function(param, callback){
	        var url = 'index/user/queryStaff',
	            data = {}
	        $.extend(data, param);
	        getData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    modifyExpress: function (param, callback) {
	        var url = 'index/express/modifyPhoneNumber',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    }
	}

	module.exports = Api;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	if(localStorage.lang == 'en'){
	    var Lang = __webpack_require__(4);
	}else{
	    var Lang = __webpack_require__(5);
	}
	console.log(Lang)
	//var Lang = require('./lang-en');
	Lang.localStorage = localStorage;
	Lang.location = location;

	module.exports = Lang;

/***/ },
/* 4 */
/***/ function(module, exports) {

	
	var Lang = {
	    'LTitle': "Pakpobox",

	    'LConnectError': 'Server Error',

	    'LUsernamePlaceholer': 'Email/Phone/LoginName',
	    'LUPasswordPlaceholer': 'Password',
	    'LLoginSubmit': 'login',
	    'LContratUs': 'Connect Us',
	    'LForgetPassword': 'Forget Password？',
	    'LValidation': 'Validation',
	    'LResetPassword': 'Reset',
	    'LValidationTips': 'Please put your binding infomation for Validation：',
	    'LValitaionSubmit': 'Validate',

	    'LUserTypeManager': 'Manager',
	    'LUserTypeOprator': 'Operator',
	    'LUserTypeLogistics': 'Courier',

	    'LAll': 'All',

	    'LLevel': 'Level',
	    'LLevelOne': 'Level1',
	    'LLevelTwo': 'Level2',
	    'LLevelThree': 'Level3',

	    'LStatus': 'Status',
	    'LStatusOn': 'Open',
	    'LStatusOff': 'Disable',

	    'LNumber': 'Number',
	    'LName': 'Name',
	    'LSearch': 'Query',
	    'LPhoneNum': 'TakePhone',

	    'LOperatorInfo': 'Operator ',
	    'LLinkmanInfo': 'Linkman ',
	    'LExpressStatuStoring': 'need Store',
	    'LExpressStatuStore': 'stored',
	    'LExpressStatuStored': 'got',
	    'LExpressStatuTimeout': 'timeout',
	    'LExpressStatuCourierPickup': 'courier pick',
	    'LExpressStatuManagerPickup': 'manager pick',

	    //table
	    'LTableOrderSeq': 'sequence',
	    'LTableOrderNumber': 'number',
	    'LTableTakerPhone': 'takerPhone',
	    'LTableStoreTime': 'storeTime',
	    'LTableTakeTime': 'takeTime',
	    'LTableValidationNum': 'validation',
	    'LTableExpressStatu': 'expressStatu',
	    'LTableOperator': 'operator',
	    'LTableDetails': 'Details',
	    //导航
	    'LNavBaseInfomation': 'Base Info',
	    'LNavOperator': 'Operators',
	    'LNavLogisticsCompany': 'LogisticsCompany',
	    'LNavCourier': 'Courier',
	    'LNavAccount': 'My Account',
	    'LNavPakpobox': 'Pakpobox',
	    'LNavPakpoboxMaintain': 'Maintain',
	    'LNavPakpoboxManagement': 'Management',
	    'LNavExpressManagement': 'Express',
	    'LNavAbnomalExpress': 'AbnomalExpress',
	    'LNavExpressManagementAll': 'Management',
	    'LNavAd': 'Ad',
	    'LNavAdManagement': 'Management',
	}

	module.exports = Lang;

/***/ },
/* 5 */
/***/ function(module, exports) {

	
	var Lang = {
	    'LTitle': "派宝箱",

	    'LConnectError': '连接服务器异常',

	    'LUsernamePlaceholer': '邮箱/手机/登陆名',
	    'LUPasswordPlaceholer': '密码',
	    'LLoginSubmit': '登陆',
	    'LContratUs': '联系我们',
	    'LForgetPassword': '忘记密码？',
	    'LValidation': '验证信息',
	    'LResetPassword': '重置密码',
	    'LValidationTips': '如忘记密码，请输入您的绑定信息以验证：',
	    'LValitaionSubmit': '立即验证',
	    'LValidationResultTips': '验证成功！已发送随机密码到您的邮箱！',
	    'LValitaionResultButton': '返回登陆',

	    'LUserTypeRoot': 'ROOT',
	    'LUserTypeManager': '管理员',
	    'LUserTypeOprator': '运营商',
	    'LUserTypeLogistics': '快递员',

	    'LAll': '全部',

	    'LLevel': '等级',
	    'LLevelOne': '一级',
	    'LLevelTwo': '二级',
	    'LLevelThree': '三级',

	    'LStatus': '快件状态',
	    'LStatusOn': '启用',
	    'LStatusOff': '禁用',

	    'LNumber': '快件编号',
	    'LName': '名称',
	    'LSearch': '查询',
	    'LPhoneNum': '取件手机',

	    'LOperatorInfo': '运营商信息',
	    'LLinkmanInfo': '联系人信息',
	    'LOperatorInfoTips': '请确认运营商信息填写无误，名称一旦确认不可再更改。',
	    'LOperatorNamePlaceholder': '输入运营商名称',

	    'LExpressStatuStoring': '未存',
	    'LExpressStatuStore': '已存',
	    'LExpressStatuStored': '已取',
	    'LExpressStatuTimeout': '逾期',
	    'LExpressStatuCourierPickup': '快递员收',
	    'LExpressStatuManagerPickup': '管理员收',

	    //table
	    'LTableOrderSeq': '序列',
	    'LTableOrderNumber': '编号',
	    'LTableTakerPhone': '取件人手机',
	    'LTableStoreTime': '存件时间',
	    'LTableTakeTime': '取件时间',
	    'LTableValidationNum': '验证码',
	    'LTableExpressStatu': '快件状态',
	    'LTableOperator': '操作',
	    'LTableDetails': '查看详情',

	    //导航
	    'LNavBaseInfomation': '基础信息',
	    'LNavOperator': '运营商',
	    'LNavLogisticsCompany': '物流公司',
	    'LNavCourier': '快递员',
	    'LNavAccount': '当前账户',
	    'LNavPakpobox': '派宝箱',
	    'LNavPakpoboxMaintain': '维护',
	    'LNavPakpoboxManagement': '综合管理',
	    'LNavExpressManagement': '快件管理',
	    'LNavAbnomalExpress': '异常逾期件维护',
	    'LNavExpressManagementAll': '综合管理',
	    'LNavAd': '广告投放',
	    'LNavAdManagement': '广告发布管理',


	}

	module.exports = Lang;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview alert警告框
	 * @version 1.0.0
	 * @author <a href="mailto:lucienxu@tencent.com">lucienxu</a>
	 * @date 2015/08/15
	 * @copyright Copyright (c) 2014, Tencent Inc. All rights reserved.
	 * @see [link]
	 *
	 */

	var tpl = __webpack_require__(7);

	var Alert = {
	    show: function (msg, type) {
	        $('#alert').html(tpl);
	        $('#msg').html(msg);
	        switch (type){
	            case 'success':
	                $('.alert')[0].className = "alert alert-success";
	                break;
	            case 'info':
	                $('.alert')[0].className = "alert alert-info";
	                break;
	            case 'warning':
	                $('.alert')[0].className = "alert alert-warning";
	                break;
	            case 'danger':
	                $('.alert')[0].className = "alert alert-danger";
	                break;
	        }
	        $('.alert').show();
	    }
	}

	module.exports = Alert;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = "<div class=\"alert alert-danger\" role=\"alert\" style=\"display: none;\">\r\n    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\r\n    <div id=\"msg\">warning!<div>\r\n</div>";

/***/ },
/* 8 */
/***/ function(module, exports) {

	var userType = {
	    'ROOT': 'LUserTypeRoot',
	    'ADMIN': 'LUserTypeManager',
	    'OPERATOR_USER': 'LUserTypeOprator',
	    'LOGISTICS_COMPANY_USER': 'LUserTypeLogistics',
	}

	module.exports = userType;

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = "<header class=\"header\">\r\n    <div class=\"header-box\">\r\n        <div class=\"inner-wrapper\">\r\n            <h1 class=\"logo\">\r\n                <a href=\"/\" title=\"pakbox\">\r\n                    <img ng-src=\"assets/img/logo.png\"/>\r\n                </a>\r\n            </h1>\r\n\r\n            <div class=\"account\" ng-init=\"showDrop = 0\" ng-mouseover=\"showDrop = 1\" ng-mouseleave=\"showDrop = 0\">\r\n                <div class=\"account-info\">\r\n                    <span ng-bind=\"username || ''\"></span>\r\n                </div>\r\n                <div class=\"account-type\">\r\n                    <span ng-bind=\"usertype\"></span>\r\n                </div>\r\n                <div class=\"account-dropdown\" ng-style=\"showDrop && {'display': 'block'}\">\r\n                    <ul class=\"account-dropdown-menu\">\r\n                        <li><a ng-click=\"logout()\">退出</a></li>\r\n                    </ul>\r\n                </div>\r\n\r\n            </div>\r\n\r\n\r\n\r\n            <div class=\"language\">\r\n                <a href=\"?lang=zh\" ng-click=\"localStorage.lang = 'zh'\">中文</a>\r\n                |\r\n                <a href=\"?lang=en\" ng-click=\"localStorage.lang = 'en'\">English</a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</header>\r\n\r\n<div id=\"alert\">\r\n\r\n</div>\r\n";

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = "<nav class=\"nav\">\r\n    <ul>\r\n        <li class=\"nav_title\">\r\n            <i class=\"nav_icon\" style=\"background:url(\r\n        assets/img/nav-icon.png\r\n        ) no-repeat center;\">\r\n            </i>\r\n            <span ng-bind=\"LNavBaseInfomation\"></span>\r\n        </li>\r\n\r\n        <li ng-class=\"{nav_item: 1, selected: location.pathname.split('/').pop() == 'index.html'}\">\r\n            <a href=\"index.html\" ng-bind=\"LNavOperator\">运营商</a>\r\n        </li>\r\n        <li class=\"nav_item\">\r\n            <a href=\"#\" ng-bind=\"LNavLogisticsCompany\">物流公司</a>\r\n        </li>\r\n        <li class=\"nav_item\">\r\n            <a href=\"#\" ng-bind=\"LNavCourier\">快递员</a>\r\n        </li>\r\n        <li class=\"nav_item\">\r\n            <a href=\"#\" ng-bind=\"LNavAccount\">当前账户</a>\r\n        </li>\r\n    </ul>\r\n    <ul>\r\n        <li class=\"nav_title\">\r\n            <i class=\"nav_icon\" style=\"background:url(\r\n        assets/img/nav-icon.png\r\n        ) no-repeat center;\">\r\n            </i>\r\n            <span ng-bind=\"LNavPakpobox\"></span>\r\n        </li>\r\n        <li class=\"nav_item\">\r\n            <a href=\"#\" ng-bind=\"LNavPakpoboxMaintain\">维护</a>\r\n        </li>\r\n        <li class=\"nav_item\">\r\n            <a href=\"#\" ng-bind=\"LNavPakpoboxManagement\">综合管理</a>\r\n        </li>\r\n    </ul>\r\n    <ul>\r\n        <li class=\"nav_title\">\r\n            <i class=\"nav_icon\" style=\"background:url(\r\n        assets/img/nav-icon.png\r\n        ) no-repeat center;\">\r\n            </i>\r\n            <span ng-bind=\"LNavExpressManagement\"></span>\r\n        </li>\r\n        <li class=\"nav_item\">\r\n            <a href=\"#\" ng-bind=\"LNavAbnomalExpress\">异常逾期件维护</a>\r\n        </li>\r\n\r\n        <li class=\"nav_item\"  ng-class=\"{nav_item: 1, selected: location.pathname.split('/').pop() == 'express.html'}\">\r\n            <a href=\"express.html\" ng-bind=\"LNavExpressManagementAll\">综合管理</a>\r\n        </li>\r\n    </ul>\r\n    <ul>\r\n        <li class=\"nav_title\">\r\n            <i class=\"nav_icon\" style=\"background:url(\r\n        assets/img/nav-icon.png\r\n        ) no-repeat center;\">\r\n            </i>\r\n            <span ng-bind=\"LNavAd\"></span>\r\n        </li>\r\n        <li class=\"nav_item\">\r\n            <a href=\"#\" ng-bind=\"LNavAdManagement\">广告发布管理</a>\r\n        </li>\r\n    </ul>\r\n</nav>";

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = "<table class=\"table table-striped table-hover\">\r\n    <thead>\r\n        <tr>\r\n            <th ng-repeat=\"item in tableData.thead\" ng-bind-html=\"item | trusted\"></th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        <tr ng-repeat=\"tr in tableData.tbody track by $index\">\r\n            <td ng-repeat=\"item in tr track by $index\" ng-bind-html=\"item | trusted\"></td>\r\n        </tr>\r\n    </tbody>\r\n</table>\r\n<paging>\r\n    <div class=\"page\">\r\n        <ul class=\"pagination\">\r\n            <li ng-class=\"{disabled: noPrevious()}\">\r\n                <a href=\"#\" aria-label=\"Previous\" ng-click=\"selectStart()\">\r\n                    <i class=\"glyphicon glyphicon-backward\" aria-hidden=\"true\" />\r\n                </a>\r\n            </li>\r\n            <li ng-class=\"{disabled: noPrevious()}\">\r\n                <a href=\"#\" aria-label=\"Previous\" ng-click=\"selectPrevious()\">\r\n                    <i class=\"glyphicon glyphicon-triangle-left\" aria-hidden=\"true\" />\r\n                </a>\r\n            </li>\r\n            <li ng-repeat=\"page in pageNum.pages\" ng-class=\"{active: isActive(page)}\"><a ng-click=\"selectPage(page)\">{{page}}</a></li>\r\n            <li ng-class=\"{disabled: noNext()}\">\r\n                <a href=\"#\" aria-label=\"Next\" ng-click=\"selectNext()\">\r\n                    <i class=\"glyphicon glyphicon-triangle-right\" aria-hidden=\"true\" />\r\n                </a>\r\n            </li>\r\n            <li ng-class=\"{disabled: noNext()}\">\r\n                <a href=\"#\" aria-label=\"Next\" ng-click=\"selectEnd()\">\r\n                    <i class=\"glyphicon glyphicon-forward\" aria-hidden=\"true\" />\r\n                </a>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n</paging>\r\n\r\n";

/***/ }
/******/ ]);