if(typeof Math.imul == "undefined" || (Math.imul(0xffffffff,5) == 0)) {
    Math.imul = function (a, b) {
        var ah  = (a >>> 16) & 0xffff;
        var al = a & 0xffff;
        var bh  = (b >>> 16) & 0xffff;
        var bl = b & 0xffff;
        // the shift by 0 fixes the sign on the high part
        // the final |0 converts the unsigned value into a signed value
        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
    }
}

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":13}],3:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":36}],4:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],5:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":7}],6:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":6}],8:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":1}],9:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],10:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],11:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":16}],12:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":27,"is-object":9}],13:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":25,"../vnode/is-vnode.js":28,"../vnode/is-vtext.js":29,"../vnode/is-widget.js":30,"./apply-properties":12,"global/document":8}],14:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],15:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var render = require("./create-element")
var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":30,"../vnode/vpatch.js":33,"./apply-properties":12,"./create-element":13,"./update-widget":17}],16:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches) {
    return patchRecursive(rootNode, patches)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions) {
        renderOptions = { patch: patchRecursive }
        if (ownerDocument !== document) {
            renderOptions.document = ownerDocument
        }
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./dom-index":14,"./patch-op":15,"global/document":8,"x-is-array":10}],17:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":30}],18:[function(require,module,exports){
'use strict';

module.exports = AttributeHook;

function AttributeHook(namespace, value) {
    if (!(this instanceof AttributeHook)) {
        return new AttributeHook(namespace, value);
    }

    this.namespace = namespace;
    this.value = value;
}

AttributeHook.prototype.hook = function (node, prop, prev) {
    if (prev && prev.type === 'AttributeHook' &&
        prev.value === this.value &&
        prev.namespace === this.namespace) {
        return;
    }

    node.setAttributeNS(this.namespace, prop, this.value);
};

AttributeHook.prototype.unhook = function (node, prop, next) {
    if (next && next.type === 'AttributeHook' &&
        next.namespace === this.namespace) {
        return;
    }

    var colonPosition = prop.indexOf(':');
    var localName = colonPosition > -1 ? prop.substr(colonPosition + 1) : prop;
    node.removeAttributeNS(this.namespace, localName);
};

AttributeHook.prototype.type = 'AttributeHook';

},{}],19:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":5}],20:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],21:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":26,"../vnode/is-vhook":27,"../vnode/is-vnode":28,"../vnode/is-vtext":29,"../vnode/is-widget":30,"../vnode/vnode.js":32,"../vnode/vtext.js":34,"./hooks/ev-hook.js":19,"./hooks/soft-set-hook.js":20,"./parse-tag.js":22,"x-is-array":10}],22:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":4}],23:[function(require,module,exports){
'use strict';

var DEFAULT_NAMESPACE = null;
var EV_NAMESPACE = 'http://www.w3.org/2001/xml-events';
var XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';

// http://www.w3.org/TR/SVGTiny12/attributeTable.html
// http://www.w3.org/TR/SVG/attindex.html
var SVG_PROPERTIES = {
    'about': DEFAULT_NAMESPACE,
    'accent-height': DEFAULT_NAMESPACE,
    'accumulate': DEFAULT_NAMESPACE,
    'additive': DEFAULT_NAMESPACE,
    'alignment-baseline': DEFAULT_NAMESPACE,
    'alphabetic': DEFAULT_NAMESPACE,
    'amplitude': DEFAULT_NAMESPACE,
    'arabic-form': DEFAULT_NAMESPACE,
    'ascent': DEFAULT_NAMESPACE,
    'attributeName': DEFAULT_NAMESPACE,
    'attributeType': DEFAULT_NAMESPACE,
    'azimuth': DEFAULT_NAMESPACE,
    'bandwidth': DEFAULT_NAMESPACE,
    'baseFrequency': DEFAULT_NAMESPACE,
    'baseProfile': DEFAULT_NAMESPACE,
    'baseline-shift': DEFAULT_NAMESPACE,
    'bbox': DEFAULT_NAMESPACE,
    'begin': DEFAULT_NAMESPACE,
    'bias': DEFAULT_NAMESPACE,
    'by': DEFAULT_NAMESPACE,
    'calcMode': DEFAULT_NAMESPACE,
    'cap-height': DEFAULT_NAMESPACE,
    'class': DEFAULT_NAMESPACE,
    'clip': DEFAULT_NAMESPACE,
    'clip-path': DEFAULT_NAMESPACE,
    'clip-rule': DEFAULT_NAMESPACE,
    'clipPathUnits': DEFAULT_NAMESPACE,
    'color': DEFAULT_NAMESPACE,
    'color-interpolation': DEFAULT_NAMESPACE,
    'color-interpolation-filters': DEFAULT_NAMESPACE,
    'color-profile': DEFAULT_NAMESPACE,
    'color-rendering': DEFAULT_NAMESPACE,
    'content': DEFAULT_NAMESPACE,
    'contentScriptType': DEFAULT_NAMESPACE,
    'contentStyleType': DEFAULT_NAMESPACE,
    'cursor': DEFAULT_NAMESPACE,
    'cx': DEFAULT_NAMESPACE,
    'cy': DEFAULT_NAMESPACE,
    'd': DEFAULT_NAMESPACE,
    'datatype': DEFAULT_NAMESPACE,
    'defaultAction': DEFAULT_NAMESPACE,
    'descent': DEFAULT_NAMESPACE,
    'diffuseConstant': DEFAULT_NAMESPACE,
    'direction': DEFAULT_NAMESPACE,
    'display': DEFAULT_NAMESPACE,
    'divisor': DEFAULT_NAMESPACE,
    'dominant-baseline': DEFAULT_NAMESPACE,
    'dur': DEFAULT_NAMESPACE,
    'dx': DEFAULT_NAMESPACE,
    'dy': DEFAULT_NAMESPACE,
    'edgeMode': DEFAULT_NAMESPACE,
    'editable': DEFAULT_NAMESPACE,
    'elevation': DEFAULT_NAMESPACE,
    'enable-background': DEFAULT_NAMESPACE,
    'end': DEFAULT_NAMESPACE,
    'ev:event': EV_NAMESPACE,
    'event': DEFAULT_NAMESPACE,
    'exponent': DEFAULT_NAMESPACE,
    'externalResourcesRequired': DEFAULT_NAMESPACE,
    'fill': DEFAULT_NAMESPACE,
    'fill-opacity': DEFAULT_NAMESPACE,
    'fill-rule': DEFAULT_NAMESPACE,
    'filter': DEFAULT_NAMESPACE,
    'filterRes': DEFAULT_NAMESPACE,
    'filterUnits': DEFAULT_NAMESPACE,
    'flood-color': DEFAULT_NAMESPACE,
    'flood-opacity': DEFAULT_NAMESPACE,
    'focusHighlight': DEFAULT_NAMESPACE,
    'focusable': DEFAULT_NAMESPACE,
    'font-family': DEFAULT_NAMESPACE,
    'font-size': DEFAULT_NAMESPACE,
    'font-size-adjust': DEFAULT_NAMESPACE,
    'font-stretch': DEFAULT_NAMESPACE,
    'font-style': DEFAULT_NAMESPACE,
    'font-variant': DEFAULT_NAMESPACE,
    'font-weight': DEFAULT_NAMESPACE,
    'format': DEFAULT_NAMESPACE,
    'from': DEFAULT_NAMESPACE,
    'fx': DEFAULT_NAMESPACE,
    'fy': DEFAULT_NAMESPACE,
    'g1': DEFAULT_NAMESPACE,
    'g2': DEFAULT_NAMESPACE,
    'glyph-name': DEFAULT_NAMESPACE,
    'glyph-orientation-horizontal': DEFAULT_NAMESPACE,
    'glyph-orientation-vertical': DEFAULT_NAMESPACE,
    'glyphRef': DEFAULT_NAMESPACE,
    'gradientTransform': DEFAULT_NAMESPACE,
    'gradientUnits': DEFAULT_NAMESPACE,
    'handler': DEFAULT_NAMESPACE,
    'hanging': DEFAULT_NAMESPACE,
    'height': DEFAULT_NAMESPACE,
    'horiz-adv-x': DEFAULT_NAMESPACE,
    'horiz-origin-x': DEFAULT_NAMESPACE,
    'horiz-origin-y': DEFAULT_NAMESPACE,
    'id': DEFAULT_NAMESPACE,
    'ideographic': DEFAULT_NAMESPACE,
    'image-rendering': DEFAULT_NAMESPACE,
    'in': DEFAULT_NAMESPACE,
    'in2': DEFAULT_NAMESPACE,
    'initialVisibility': DEFAULT_NAMESPACE,
    'intercept': DEFAULT_NAMESPACE,
    'k': DEFAULT_NAMESPACE,
    'k1': DEFAULT_NAMESPACE,
    'k2': DEFAULT_NAMESPACE,
    'k3': DEFAULT_NAMESPACE,
    'k4': DEFAULT_NAMESPACE,
    'kernelMatrix': DEFAULT_NAMESPACE,
    'kernelUnitLength': DEFAULT_NAMESPACE,
    'kerning': DEFAULT_NAMESPACE,
    'keyPoints': DEFAULT_NAMESPACE,
    'keySplines': DEFAULT_NAMESPACE,
    'keyTimes': DEFAULT_NAMESPACE,
    'lang': DEFAULT_NAMESPACE,
    'lengthAdjust': DEFAULT_NAMESPACE,
    'letter-spacing': DEFAULT_NAMESPACE,
    'lighting-color': DEFAULT_NAMESPACE,
    'limitingConeAngle': DEFAULT_NAMESPACE,
    'local': DEFAULT_NAMESPACE,
    'marker-end': DEFAULT_NAMESPACE,
    'marker-mid': DEFAULT_NAMESPACE,
    'marker-start': DEFAULT_NAMESPACE,
    'markerHeight': DEFAULT_NAMESPACE,
    'markerUnits': DEFAULT_NAMESPACE,
    'markerWidth': DEFAULT_NAMESPACE,
    'mask': DEFAULT_NAMESPACE,
    'maskContentUnits': DEFAULT_NAMESPACE,
    'maskUnits': DEFAULT_NAMESPACE,
    'mathematical': DEFAULT_NAMESPACE,
    'max': DEFAULT_NAMESPACE,
    'media': DEFAULT_NAMESPACE,
    'mediaCharacterEncoding': DEFAULT_NAMESPACE,
    'mediaContentEncodings': DEFAULT_NAMESPACE,
    'mediaSize': DEFAULT_NAMESPACE,
    'mediaTime': DEFAULT_NAMESPACE,
    'method': DEFAULT_NAMESPACE,
    'min': DEFAULT_NAMESPACE,
    'mode': DEFAULT_NAMESPACE,
    'name': DEFAULT_NAMESPACE,
    'nav-down': DEFAULT_NAMESPACE,
    'nav-down-left': DEFAULT_NAMESPACE,
    'nav-down-right': DEFAULT_NAMESPACE,
    'nav-left': DEFAULT_NAMESPACE,
    'nav-next': DEFAULT_NAMESPACE,
    'nav-prev': DEFAULT_NAMESPACE,
    'nav-right': DEFAULT_NAMESPACE,
    'nav-up': DEFAULT_NAMESPACE,
    'nav-up-left': DEFAULT_NAMESPACE,
    'nav-up-right': DEFAULT_NAMESPACE,
    'numOctaves': DEFAULT_NAMESPACE,
    'observer': DEFAULT_NAMESPACE,
    'offset': DEFAULT_NAMESPACE,
    'opacity': DEFAULT_NAMESPACE,
    'operator': DEFAULT_NAMESPACE,
    'order': DEFAULT_NAMESPACE,
    'orient': DEFAULT_NAMESPACE,
    'orientation': DEFAULT_NAMESPACE,
    'origin': DEFAULT_NAMESPACE,
    'overflow': DEFAULT_NAMESPACE,
    'overlay': DEFAULT_NAMESPACE,
    'overline-position': DEFAULT_NAMESPACE,
    'overline-thickness': DEFAULT_NAMESPACE,
    'panose-1': DEFAULT_NAMESPACE,
    'path': DEFAULT_NAMESPACE,
    'pathLength': DEFAULT_NAMESPACE,
    'patternContentUnits': DEFAULT_NAMESPACE,
    'patternTransform': DEFAULT_NAMESPACE,
    'patternUnits': DEFAULT_NAMESPACE,
    'phase': DEFAULT_NAMESPACE,
    'playbackOrder': DEFAULT_NAMESPACE,
    'pointer-events': DEFAULT_NAMESPACE,
    'points': DEFAULT_NAMESPACE,
    'pointsAtX': DEFAULT_NAMESPACE,
    'pointsAtY': DEFAULT_NAMESPACE,
    'pointsAtZ': DEFAULT_NAMESPACE,
    'preserveAlpha': DEFAULT_NAMESPACE,
    'preserveAspectRatio': DEFAULT_NAMESPACE,
    'primitiveUnits': DEFAULT_NAMESPACE,
    'propagate': DEFAULT_NAMESPACE,
    'property': DEFAULT_NAMESPACE,
    'r': DEFAULT_NAMESPACE,
    'radius': DEFAULT_NAMESPACE,
    'refX': DEFAULT_NAMESPACE,
    'refY': DEFAULT_NAMESPACE,
    'rel': DEFAULT_NAMESPACE,
    'rendering-intent': DEFAULT_NAMESPACE,
    'repeatCount': DEFAULT_NAMESPACE,
    'repeatDur': DEFAULT_NAMESPACE,
    'requiredExtensions': DEFAULT_NAMESPACE,
    'requiredFeatures': DEFAULT_NAMESPACE,
    'requiredFonts': DEFAULT_NAMESPACE,
    'requiredFormats': DEFAULT_NAMESPACE,
    'resource': DEFAULT_NAMESPACE,
    'restart': DEFAULT_NAMESPACE,
    'result': DEFAULT_NAMESPACE,
    'rev': DEFAULT_NAMESPACE,
    'role': DEFAULT_NAMESPACE,
    'rotate': DEFAULT_NAMESPACE,
    'rx': DEFAULT_NAMESPACE,
    'ry': DEFAULT_NAMESPACE,
    'scale': DEFAULT_NAMESPACE,
    'seed': DEFAULT_NAMESPACE,
    'shape-rendering': DEFAULT_NAMESPACE,
    'slope': DEFAULT_NAMESPACE,
    'snapshotTime': DEFAULT_NAMESPACE,
    'spacing': DEFAULT_NAMESPACE,
    'specularConstant': DEFAULT_NAMESPACE,
    'specularExponent': DEFAULT_NAMESPACE,
    'spreadMethod': DEFAULT_NAMESPACE,
    'startOffset': DEFAULT_NAMESPACE,
    'stdDeviation': DEFAULT_NAMESPACE,
    'stemh': DEFAULT_NAMESPACE,
    'stemv': DEFAULT_NAMESPACE,
    'stitchTiles': DEFAULT_NAMESPACE,
    'stop-color': DEFAULT_NAMESPACE,
    'stop-opacity': DEFAULT_NAMESPACE,
    'strikethrough-position': DEFAULT_NAMESPACE,
    'strikethrough-thickness': DEFAULT_NAMESPACE,
    'string': DEFAULT_NAMESPACE,
    'stroke': DEFAULT_NAMESPACE,
    'stroke-dasharray': DEFAULT_NAMESPACE,
    'stroke-dashoffset': DEFAULT_NAMESPACE,
    'stroke-linecap': DEFAULT_NAMESPACE,
    'stroke-linejoin': DEFAULT_NAMESPACE,
    'stroke-miterlimit': DEFAULT_NAMESPACE,
    'stroke-opacity': DEFAULT_NAMESPACE,
    'stroke-width': DEFAULT_NAMESPACE,
    'surfaceScale': DEFAULT_NAMESPACE,
    'syncBehavior': DEFAULT_NAMESPACE,
    'syncBehaviorDefault': DEFAULT_NAMESPACE,
    'syncMaster': DEFAULT_NAMESPACE,
    'syncTolerance': DEFAULT_NAMESPACE,
    'syncToleranceDefault': DEFAULT_NAMESPACE,
    'systemLanguage': DEFAULT_NAMESPACE,
    'tableValues': DEFAULT_NAMESPACE,
    'target': DEFAULT_NAMESPACE,
    'targetX': DEFAULT_NAMESPACE,
    'targetY': DEFAULT_NAMESPACE,
    'text-anchor': DEFAULT_NAMESPACE,
    'text-decoration': DEFAULT_NAMESPACE,
    'text-rendering': DEFAULT_NAMESPACE,
    'textLength': DEFAULT_NAMESPACE,
    'timelineBegin': DEFAULT_NAMESPACE,
    'title': DEFAULT_NAMESPACE,
    'to': DEFAULT_NAMESPACE,
    'transform': DEFAULT_NAMESPACE,
    'transformBehavior': DEFAULT_NAMESPACE,
    'type': DEFAULT_NAMESPACE,
    'typeof': DEFAULT_NAMESPACE,
    'u1': DEFAULT_NAMESPACE,
    'u2': DEFAULT_NAMESPACE,
    'underline-position': DEFAULT_NAMESPACE,
    'underline-thickness': DEFAULT_NAMESPACE,
    'unicode': DEFAULT_NAMESPACE,
    'unicode-bidi': DEFAULT_NAMESPACE,
    'unicode-range': DEFAULT_NAMESPACE,
    'units-per-em': DEFAULT_NAMESPACE,
    'v-alphabetic': DEFAULT_NAMESPACE,
    'v-hanging': DEFAULT_NAMESPACE,
    'v-ideographic': DEFAULT_NAMESPACE,
    'v-mathematical': DEFAULT_NAMESPACE,
    'values': DEFAULT_NAMESPACE,
    'version': DEFAULT_NAMESPACE,
    'vert-adv-y': DEFAULT_NAMESPACE,
    'vert-origin-x': DEFAULT_NAMESPACE,
    'vert-origin-y': DEFAULT_NAMESPACE,
    'viewBox': DEFAULT_NAMESPACE,
    'viewTarget': DEFAULT_NAMESPACE,
    'visibility': DEFAULT_NAMESPACE,
    'width': DEFAULT_NAMESPACE,
    'widths': DEFAULT_NAMESPACE,
    'word-spacing': DEFAULT_NAMESPACE,
    'writing-mode': DEFAULT_NAMESPACE,
    'x': DEFAULT_NAMESPACE,
    'x-height': DEFAULT_NAMESPACE,
    'x1': DEFAULT_NAMESPACE,
    'x2': DEFAULT_NAMESPACE,
    'xChannelSelector': DEFAULT_NAMESPACE,
    'xlink:actuate': XLINK_NAMESPACE,
    'xlink:arcrole': XLINK_NAMESPACE,
    'xlink:href': XLINK_NAMESPACE,
    'xlink:role': XLINK_NAMESPACE,
    'xlink:show': XLINK_NAMESPACE,
    'xlink:title': XLINK_NAMESPACE,
    'xlink:type': XLINK_NAMESPACE,
    'xml:base': XML_NAMESPACE,
    'xml:id': XML_NAMESPACE,
    'xml:lang': XML_NAMESPACE,
    'xml:space': XML_NAMESPACE,
    'y': DEFAULT_NAMESPACE,
    'y1': DEFAULT_NAMESPACE,
    'y2': DEFAULT_NAMESPACE,
    'yChannelSelector': DEFAULT_NAMESPACE,
    'z': DEFAULT_NAMESPACE,
    'zoomAndPan': DEFAULT_NAMESPACE
};

module.exports = SVGAttributeNamespace;

function SVGAttributeNamespace(value) {
  if (SVG_PROPERTIES.hasOwnProperty(value)) {
    return SVG_PROPERTIES[value];
  }
}

},{}],24:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var h = require('./index.js');


var SVGAttributeNamespace = require('./svg-attribute-namespace');
var attributeHook = require('./hooks/attribute-hook');

var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

module.exports = svg;

function svg(tagName, properties, children) {
    if (!children && isChildren(properties)) {
        children = properties;
        properties = {};
    }

    properties = properties || {};

    // set namespace for svg
    properties.namespace = SVG_NAMESPACE;

    var attributes = properties.attributes || (properties.attributes = {});

    for (var key in properties) {
        if (!properties.hasOwnProperty(key)) {
            continue;
        }

        var namespace = SVGAttributeNamespace(key);

        if (namespace === undefined) { // not a svg attribute
            continue;
        }

        var value = properties[key];

        if (typeof value !== 'string' &&
            typeof value !== 'number' &&
            typeof value !== 'boolean'
        ) {
            continue;
        }

        if (namespace !== null) { // namespaced attribute
            properties[key] = attributeHook(namespace, value);
            continue;
        }

        attributes[key] = value
        properties[key] = undefined
    }

    return h(tagName, properties, children);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x);
}

},{"./hooks/attribute-hook":18,"./index.js":21,"./svg-attribute-namespace":23,"x-is-array":10}],25:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":26,"./is-vnode":28,"./is-vtext":29,"./is-widget":30}],26:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],27:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],28:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":31}],29:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":31}],30:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],31:[function(require,module,exports){
module.exports = "2"

},{}],32:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":26,"./is-vhook":27,"./is-vnode":28,"./is-widget":30,"./version":31}],33:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":31}],34:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":31}],35:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":27,"is-object":9}],36:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free,     // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":25,"../vnode/is-thunk":26,"../vnode/is-vnode":28,"../vnode/is-vtext":29,"../vnode/is-widget":30,"../vnode/vpatch":33,"./diff-props":35,"x-is-array":10}],37:[function(require,module,exports){
return VDOM = {
  diff: require("virtual-dom/diff"),
  patch: require("virtual-dom/patch"),
  create: require("virtual-dom/create-element"),
  VHtml: require("virtual-dom/vnode/vnode"),
  VText: require("virtual-dom/vnode/vtext"),
  VSvg: require("virtual-dom/virtual-hyperscript/svg")
}

},{"virtual-dom/create-element":2,"virtual-dom/diff":3,"virtual-dom/patch":11,"virtual-dom/virtual-hyperscript/svg":24,"virtual-dom/vnode/vnode":32,"virtual-dom/vnode/vtext":34}]},{},[37]);

var g,aa=this;
function t(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==
b&&"undefined"==typeof a.call)return"object";return b}function ba(a){return"function"==t(a)}var ca="closure_uid_"+(1E9*Math.random()>>>0),ea=0;function fa(a,b,c){return a.call.apply(a.bind,arguments)}function ha(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function ia(a,b,c){ia=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?fa:ha;return ia.apply(null,arguments)};function ja(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function la(a,b){null!=a&&this.append.apply(this,arguments)}g=la.prototype;g.Ma="";g.set=function(a){this.Ma=""+a};g.append=function(a,b,c){this.Ma+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.Ma+=arguments[d];return this};g.clear=function(){this.Ma=""};g.toString=function(){return this.Ma};var ma=Array.prototype;function oa(a,b,c){return 2>=arguments.length?ma.slice.call(a,b):ma.slice.call(a,b,c)}function sa(a,b){return a>b?1:a<b?-1:0};var ta={},ua;if("undefined"===typeof va)var va=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof wa)var wa=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var ya=null;if("undefined"===typeof za)var za=null;function Aa(){return new Ba(null,5,[Ca,!0,Da,!0,Ea,!1,Fa,!1,Ha,null],null)}Ka;function w(a){return null!=a&&!1!==a}La;z;function Ma(a){return null==a}function Na(a){return a instanceof Array}
function Oa(a){return null==a?!0:!1===a?!0:!1}function B(a,b){return a[t(null==b?null:b)]?!0:a._?!0:!1}function C(a,b){var c=null==b?null:b.constructor,c=w(w(c)?c.Ib:c)?c.qb:t(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Pa(a){var b=a.qb;return w(b)?b:""+E(a)}var Qa="undefined"!==typeof Symbol&&"function"===t(Symbol)?Symbol.iterator:"@@iterator";function Sa(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}F;Ta;
var Ka=function Ka(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ka.a(arguments[0]);case 2:return Ka.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Ka.a=function(a){return Ka.b(null,a)};Ka.b=function(a,b){function c(a,b){a.push(b);return a}var d=[];return Ta.c?Ta.c(c,d,b):Ta.call(null,c,d,b)};Ka.A=2;function Ua(){}
var Va=function Va(b){if(null!=b&&null!=b.Z)return b.Z(b);var c=Va[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Va._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ICounted.-count",b);},Wa=function Wa(b){if(null!=b&&null!=b.V)return b.V(b);var c=Wa[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Wa._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IEmptyableCollection.-empty",b);};function Xa(){}
var Ya=function Ya(b,c){if(null!=b&&null!=b.T)return b.T(b,c);var d=Ya[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Ya._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("ICollection.-conj",b);};function Za(){}
var G=function G(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return G.b(arguments[0],arguments[1]);case 3:return G.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
G.b=function(a,b){if(null!=a&&null!=a.U)return a.U(a,b);var c=G[t(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=G._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("IIndexed.-nth",a);};G.c=function(a,b,c){if(null!=a&&null!=a.wa)return a.wa(a,b,c);var d=G[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=G._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("IIndexed.-nth",a);};G.A=3;function $a(){}
var bb=function bb(b){if(null!=b&&null!=b.Y)return b.Y(b);var c=bb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=bb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeq.-first",b);},cb=function cb(b){if(null!=b&&null!=b.qa)return b.qa(b);var c=cb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=cb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeq.-rest",b);};function db(){}function eb(){}
var fb=function fb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return fb.b(arguments[0],arguments[1]);case 3:return fb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
fb.b=function(a,b){if(null!=a&&null!=a.K)return a.K(a,b);var c=fb[t(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=fb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("ILookup.-lookup",a);};fb.c=function(a,b,c){if(null!=a&&null!=a.H)return a.H(a,b,c);var d=fb[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=fb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("ILookup.-lookup",a);};fb.A=3;
var gb=function gb(b,c){if(null!=b&&null!=b.Db)return b.Db(b,c);var d=gb[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=gb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IAssociative.-contains-key?",b);},hb=function hb(b,c,d){if(null!=b&&null!=b.Qa)return b.Qa(b,c,d);var e=hb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=hb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IAssociative.-assoc",b);};function ib(){}
function jb(){}var kb=function kb(b){if(null!=b&&null!=b.lb)return b.lb(b);var c=kb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=kb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMapEntry.-key",b);},lb=function lb(b){if(null!=b&&null!=b.mb)return b.mb(b);var c=lb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=lb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMapEntry.-val",b);};function mb(){}function nb(){}
var ob=function ob(b,c,d){if(null!=b&&null!=b.Ta)return b.Ta(b,c,d);var e=ob[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=ob._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IVector.-assoc-n",b);},pb=function pb(b){if(null!=b&&null!=b.xb)return b.xb(b);var c=pb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=pb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IDeref.-deref",b);};function qb(){}
var rb=function rb(b){if(null!=b&&null!=b.O)return b.O(b);var c=rb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=rb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMeta.-meta",b);};function sb(){}var ub=function ub(b,c){if(null!=b&&null!=b.R)return b.R(b,c);var d=ub[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=ub._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IWithMeta.-with-meta",b);};function vb(){}
var wb=function wb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return wb.b(arguments[0],arguments[1]);case 3:return wb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
wb.b=function(a,b){if(null!=a&&null!=a.aa)return a.aa(a,b);var c=wb[t(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=wb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("IReduce.-reduce",a);};wb.c=function(a,b,c){if(null!=a&&null!=a.ba)return a.ba(a,b,c);var d=wb[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=wb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("IReduce.-reduce",a);};wb.A=3;
var xb=function xb(b,c){if(null!=b&&null!=b.v)return b.v(b,c);var d=xb[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=xb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IEquiv.-equiv",b);},yb=function yb(b){if(null!=b&&null!=b.L)return b.L(b);var c=yb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=yb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IHash.-hash",b);};function zb(){}
var Ab=function Ab(b){if(null!=b&&null!=b.S)return b.S(b);var c=Ab[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ab._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeqable.-seq",b);};function Bb(){}function Cb(){}
var Db=function Db(b,c){if(null!=b&&null!=b.Rb)return b.Rb(0,c);var d=Db[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Db._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IWriter.-write",b);},Eb=function Eb(b,c,d){if(null!=b&&null!=b.J)return b.J(b,c,d);var e=Eb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Eb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IPrintWithWriter.-pr-writer",b);},Fb=function Fb(b,c,d){if(null!=b&&
null!=b.Qb)return b.Qb(0,c,d);var e=Fb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Fb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IWatchable.-notify-watches",b);},Hb=function Hb(b,c,d){if(null!=b&&null!=b.Pb)return b.Pb(0,c,d);var e=Hb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Hb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IWatchable.-add-watch",b);},Ib=function Ib(b){if(null!=b&&null!=b.Za)return b.Za(b);
var c=Ib[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ib._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IEditableCollection.-as-transient",b);},Jb=function Jb(b,c){if(null!=b&&null!=b.Sa)return b.Sa(b,c);var d=Jb[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Jb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("ITransientCollection.-conj!",b);},Kb=function Kb(b){if(null!=b&&null!=b.ab)return b.ab(b);var c=Kb[t(null==b?null:b)];if(null!=c)return c.a?
c.a(b):c.call(null,b);c=Kb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ITransientCollection.-persistent!",b);},Lb=function Lb(b,c,d){if(null!=b&&null!=b.pb)return b.pb(b,c,d);var e=Lb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Lb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("ITransientAssociative.-assoc!",b);},Mb=function Mb(b,c,d){if(null!=b&&null!=b.Ob)return b.Ob(0,c,d);var e=Mb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,
b,c,d);e=Mb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("ITransientVector.-assoc-n!",b);};function Nb(){}
var Ob=function Ob(b,c){if(null!=b&&null!=b.Ra)return b.Ra(b,c);var d=Ob[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Ob._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IComparable.-compare",b);},Pb=function Pb(b){if(null!=b&&null!=b.Mb)return b.Mb();var c=Pb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Pb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunk.-drop-first",b);},Qb=function Qb(b){if(null!=b&&null!=b.Fb)return b.Fb(b);var c=
Qb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Qb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedSeq.-chunked-first",b);},Rb=function Rb(b){if(null!=b&&null!=b.Gb)return b.Gb(b);var c=Rb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Rb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedSeq.-chunked-rest",b);},Sb=function Sb(b){if(null!=b&&null!=b.Eb)return b.Eb(b);var c=Sb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,
b);c=Sb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedNext.-chunked-next",b);},Tb=function Tb(b){if(null!=b&&null!=b.nb)return b.nb(b);var c=Tb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Tb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("INamed.-name",b);},Ub=function Ub(b){if(null!=b&&null!=b.ob)return b.ob(b);var c=Ub[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ub._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("INamed.-namespace",
b);},Vb=function Vb(b,c){if(null!=b&&null!=b.fc)return b.fc(b,c);var d=Vb[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Vb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IReset.-reset!",b);},Wb=function Wb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Wb.b(arguments[0],arguments[1]);case 3:return Wb.c(arguments[0],arguments[1],arguments[2]);case 4:return Wb.o(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return Wb.D(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Wb.b=function(a,b){if(null!=a&&null!=a.hc)return a.hc(a,b);var c=Wb[t(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=Wb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("ISwap.-swap!",a);};
Wb.c=function(a,b,c){if(null!=a&&null!=a.ic)return a.ic(a,b,c);var d=Wb[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Wb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("ISwap.-swap!",a);};Wb.o=function(a,b,c,d){if(null!=a&&null!=a.jc)return a.jc(a,b,c,d);var e=Wb[t(null==a?null:a)];if(null!=e)return e.o?e.o(a,b,c,d):e.call(null,a,b,c,d);e=Wb._;if(null!=e)return e.o?e.o(a,b,c,d):e.call(null,a,b,c,d);throw C("ISwap.-swap!",a);};
Wb.D=function(a,b,c,d,e){if(null!=a&&null!=a.kc)return a.kc(a,b,c,d,e);var f=Wb[t(null==a?null:a)];if(null!=f)return f.D?f.D(a,b,c,d,e):f.call(null,a,b,c,d,e);f=Wb._;if(null!=f)return f.D?f.D(a,b,c,d,e):f.call(null,a,b,c,d,e);throw C("ISwap.-swap!",a);};Wb.A=5;var Xb=function Xb(b){if(null!=b&&null!=b.Fa)return b.Fa(b);var c=Xb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Xb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IIterable.-iterator",b);};
function Yb(a){this.tc=a;this.i=1073741824;this.B=0}Yb.prototype.Rb=function(a,b){return this.tc.append(b)};function Zb(a){var b=new la;a.J(null,new Yb(b),Aa());return""+E(b)}var $b="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function bc(a){a=$b(a|0,-862048943);return $b(a<<15|a>>>-15,461845907)}
function cc(a,b){var c=(a|0)^(b|0);return $b(c<<13|c>>>-13,5)+-430675100|0}function dc(a,b){var c=(a|0)^b,c=$b(c^c>>>16,-2048144789),c=$b(c^c>>>13,-1028477387);return c^c>>>16}function ec(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=cc(c,bc(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^bc(a.charCodeAt(a.length-1)):b;return dc(b,$b(2,a.length))}fc;H;gc;hc;var ic={},jc=0;
function kc(a){if(null!=a){var b=a.length;if(0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=$b(31,d)+a.charCodeAt(c),c=e;else return d;else return 0}else return 0}function lc(a){255<jc&&(ic={},jc=0);var b=ic[a];"number"!==typeof b&&(b=kc(a),ic[a]=b,jc+=1);return a=b}
function mc(a){null!=a&&(a.i&4194304||a.yc)?a=a.L(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=lc(a),0!==a&&(a=bc(a),a=cc(0,a),a=dc(a,4))):a=a instanceof Date?a.valueOf():null==a?0:yb(a);return a}function nc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function La(a,b){return b instanceof a}
function oc(a,b){if(a.Ia===b.Ia)return 0;var c=Oa(a.sa);if(w(c?b.sa:c))return-1;if(w(a.sa)){if(Oa(b.sa))return 1;c=sa(a.sa,b.sa);return 0===c?sa(a.name,b.name):c}return sa(a.name,b.name)}pc;function H(a,b,c,d,e){this.sa=a;this.name=b;this.Ia=c;this.Ya=d;this.va=e;this.i=2154168321;this.B=4096}g=H.prototype;g.toString=function(){return this.Ia};g.equiv=function(a){return this.v(null,a)};g.v=function(a,b){return b instanceof H?this.Ia===b.Ia:!1};
g.call=function(){function a(a,b,c){return pc.c?pc.c(b,this,c):pc.call(null,b,this,c)}function b(a,b){return pc.b?pc.b(b,this):pc.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};g.a=function(a){return pc.b?pc.b(a,this):pc.call(null,a,this)};
g.b=function(a,b){return pc.c?pc.c(a,this,b):pc.call(null,a,this,b)};g.O=function(){return this.va};g.R=function(a,b){return new H(this.sa,this.name,this.Ia,this.Ya,b)};g.L=function(){var a=this.Ya;return null!=a?a:this.Ya=a=nc(ec(this.name),lc(this.sa))};g.nb=function(){return this.name};g.ob=function(){return this.sa};g.J=function(a,b){return Db(b,this.Ia)};
var rc=function rc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return rc.a(arguments[0]);case 2:return rc.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};rc.a=function(a){if(a instanceof H)return a;var b=a.indexOf("/");return-1===b?rc.b(null,a):rc.b(a.substring(0,b),a.substring(b+1,a.length))};rc.b=function(a,b){var c=null!=a?[E(a),E("/"),E(b)].join(""):b;return new H(a,b,c,null,null)};
rc.A=2;I;sc;tc;function K(a){if(null==a)return null;if(null!=a&&(a.i&8388608||a.gc))return a.S(null);if(Na(a)||"string"===typeof a)return 0===a.length?null:new tc(a,0);if(B(zb,a))return Ab(a);throw Error([E(a),E(" is not ISeqable")].join(""));}function L(a){if(null==a)return null;if(null!=a&&(a.i&64||a.$a))return a.Y(null);a=K(a);return null==a?null:bb(a)}function uc(a){return null!=a?null!=a&&(a.i&64||a.$a)?a.qa(null):(a=K(a))?cb(a):vc:vc}
function M(a){return null==a?null:null!=a&&(a.i&128||a.yb)?a.ta(null):K(uc(a))}var gc=function gc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return gc.a(arguments[0]);case 2:return gc.b(arguments[0],arguments[1]);default:return gc.m(arguments[0],arguments[1],new tc(c.slice(2),0))}};gc.a=function(){return!0};gc.b=function(a,b){return null==a?null==b:a===b||xb(a,b)};
gc.m=function(a,b,c){for(;;)if(gc.b(a,b))if(M(c))a=b,b=L(c),c=M(c);else return gc.b(b,L(c));else return!1};gc.F=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return gc.m(b,a,c)};gc.A=2;function wc(a){this.C=a}wc.prototype.next=function(){if(null!=this.C){var a=L(this.C);this.C=M(this.C);return{value:a,done:!1}}return{value:null,done:!0}};function xc(a){return new wc(K(a))}yc;function zc(a,b,c){this.value=a;this.fb=b;this.Ab=c;this.i=8388672;this.B=0}zc.prototype.S=function(){return this};
zc.prototype.Y=function(){return this.value};zc.prototype.qa=function(){null==this.Ab&&(this.Ab=yc.a?yc.a(this.fb):yc.call(null,this.fb));return this.Ab};function yc(a){var b=a.next();return w(b.done)?vc:new zc(b.value,a,null)}function Ac(a,b){var c=bc(a),c=cc(0,c);return dc(c,b)}function Bc(a){var b=0,c=1;for(a=K(a);;)if(null!=a)b+=1,c=$b(31,c)+mc(L(a))|0,a=M(a);else return Ac(c,b)}var Cc=Ac(1,0);function Dc(a){var b=0,c=0;for(a=K(a);;)if(null!=a)b+=1,c=c+mc(L(a))|0,a=M(a);else return Ac(c,b)}
var Ec=Ac(0,0);Fc;fc;Gc;Ua["null"]=!0;Va["null"]=function(){return 0};Date.prototype.v=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.jb=!0;Date.prototype.Ra=function(a,b){if(b instanceof Date)return sa(this.valueOf(),b.valueOf());throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};xb.number=function(a,b){return a===b};Hc;qb["function"]=!0;rb["function"]=function(){return null};yb._=function(a){return a[ca]||(a[ca]=++ea)};N;
function Jc(a){this.N=a;this.i=32768;this.B=0}Jc.prototype.xb=function(){return this.N};function Kc(a){return a instanceof Jc}function N(a){return pb(a)}function Lc(a,b){var c=Va(a);if(0===c)return b.w?b.w():b.call(null);for(var d=G.b(a,0),e=1;;)if(e<c){var f=G.b(a,e),d=b.b?b.b(d,f):b.call(null,d,f);if(Kc(d))return pb(d);e+=1}else return d}function Mc(a,b,c){var d=Va(a),e=c;for(c=0;;)if(c<d){var f=G.b(a,c),e=b.b?b.b(e,f):b.call(null,e,f);if(Kc(e))return pb(e);c+=1}else return e}
function Nc(a,b){var c=a.length;if(0===a.length)return b.w?b.w():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.b?b.b(d,f):b.call(null,d,f);if(Kc(d))return pb(d);e+=1}else return d}function Oc(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.b?b.b(e,f):b.call(null,e,f);if(Kc(e))return pb(e);c+=1}else return e}function Pc(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.b?b.b(c,f):b.call(null,c,f);if(Kc(c))return pb(c);d+=1}else return c}Qc;O;Rc;Sc;
function Tc(a){return null!=a?a.i&2||a.Xb?!0:a.i?!1:B(Ua,a):B(Ua,a)}function Uc(a){return null!=a?a.i&16||a.Nb?!0:a.i?!1:B(Za,a):B(Za,a)}function Vc(a,b){this.f=a;this.j=b}Vc.prototype.ra=function(){return this.j<this.f.length};Vc.prototype.next=function(){var a=this.f[this.j];this.j+=1;return a};function tc(a,b){this.f=a;this.j=b;this.i=166199550;this.B=8192}g=tc.prototype;g.toString=function(){return Zb(this)};g.equiv=function(a){return this.v(null,a)};
g.U=function(a,b){var c=b+this.j;return c<this.f.length?this.f[c]:null};g.wa=function(a,b,c){a=b+this.j;return a<this.f.length?this.f[a]:c};g.Fa=function(){return new Vc(this.f,this.j)};g.ta=function(){return this.j+1<this.f.length?new tc(this.f,this.j+1):null};g.Z=function(){var a=this.f.length-this.j;return 0>a?0:a};g.L=function(){return Bc(this)};g.v=function(a,b){return Gc.b?Gc.b(this,b):Gc.call(null,this,b)};g.V=function(){return vc};
g.aa=function(a,b){return Pc(this.f,b,this.f[this.j],this.j+1)};g.ba=function(a,b,c){return Pc(this.f,b,c,this.j)};g.Y=function(){return this.f[this.j]};g.qa=function(){return this.j+1<this.f.length?new tc(this.f,this.j+1):vc};g.S=function(){return this.j<this.f.length?this:null};g.T=function(a,b){return O.b?O.b(b,this):O.call(null,b,this)};tc.prototype[Qa]=function(){return xc(this)};
var sc=function sc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return sc.a(arguments[0]);case 2:return sc.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};sc.a=function(a){return sc.b(a,0)};sc.b=function(a,b){return b<a.length?new tc(a,b):null};sc.A=2;
var I=function I(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return I.a(arguments[0]);case 2:return I.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};I.a=function(a){return sc.b(a,0)};I.b=function(a,b){return sc.b(a,b)};I.A=2;Hc;Wc;function Rc(a,b,c){this.wb=a;this.j=b;this.s=c;this.i=32374990;this.B=8192}g=Rc.prototype;g.toString=function(){return Zb(this)};
g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.s};g.ta=function(){return 0<this.j?new Rc(this.wb,this.j-1,null):null};g.Z=function(){return this.j+1};g.L=function(){return Bc(this)};g.v=function(a,b){return Gc.b?Gc.b(this,b):Gc.call(null,this,b)};g.V=function(){var a=vc,b=this.s;return Hc.b?Hc.b(a,b):Hc.call(null,a,b)};g.aa=function(a,b){return Wc.b?Wc.b(b,this):Wc.call(null,b,this)};g.ba=function(a,b,c){return Wc.c?Wc.c(b,c,this):Wc.call(null,b,c,this)};
g.Y=function(){return G.b(this.wb,this.j)};g.qa=function(){return 0<this.j?new Rc(this.wb,this.j-1,null):vc};g.S=function(){return this};g.R=function(a,b){return new Rc(this.wb,this.j,b)};g.T=function(a,b){return O.b?O.b(b,this):O.call(null,b,this)};Rc.prototype[Qa]=function(){return xc(this)};function Xc(a){for(;;){var b=M(a);if(null!=b)a=b;else return L(a)}}xb._=function(a,b){return a===b};
var Yc=function Yc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Yc.w();case 1:return Yc.a(arguments[0]);case 2:return Yc.b(arguments[0],arguments[1]);default:return Yc.m(arguments[0],arguments[1],new tc(c.slice(2),0))}};Yc.w=function(){return Zc};Yc.a=function(a){return a};Yc.b=function(a,b){return null!=a?Ya(a,b):Ya(vc,b)};Yc.m=function(a,b,c){for(;;)if(w(c))a=Yc.b(a,b),b=L(c),c=M(c);else return Yc.b(a,b)};
Yc.F=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return Yc.m(b,a,c)};Yc.A=2;function P(a){if(null!=a)if(null!=a&&(a.i&2||a.Xb))a=a.Z(null);else if(Na(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.i&8388608||a.gc))a:{a=K(a);for(var b=0;;){if(Tc(a)){a=b+Va(a);break a}a=M(a);b+=1}}else a=Va(a);else a=0;return a}function $c(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return K(a)?L(a):c;if(Uc(a))return G.c(a,b,c);if(K(a)){var d=M(a),e=b-1;a=d;b=e}else return c}}
function ad(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.i&16||a.Nb))return a.U(null,b);if(Na(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.$a)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(K(c)){c=L(c);break a}throw Error("Index out of bounds");}if(Uc(c)){c=G.b(c,d);break a}if(K(c))c=M(c),--d;else throw Error("Index out of bounds");
}}return c}if(B(Za,a))return G.b(a,b);throw Error([E("nth not supported on this type "),E(Pa(null==a?null:a.constructor))].join(""));}
function Q(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.i&16||a.Nb))return a.wa(null,b,null);if(Na(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.$a))return $c(a,b);if(B(Za,a))return G.b(a,b);throw Error([E("nth not supported on this type "),E(Pa(null==a?null:a.constructor))].join(""));}
var pc=function pc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return pc.b(arguments[0],arguments[1]);case 3:return pc.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};pc.b=function(a,b){return null==a?null:null!=a&&(a.i&256||a.$b)?a.K(null,b):Na(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:B(eb,a)?fb.b(a,b):null};
pc.c=function(a,b,c){return null!=a?null!=a&&(a.i&256||a.$b)?a.H(null,b,c):Na(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:B(eb,a)?fb.c(a,b,c):c:c};pc.A=3;bd;var cd=function cd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return cd.c(arguments[0],arguments[1],arguments[2]);default:return cd.m(arguments[0],arguments[1],arguments[2],new tc(c.slice(3),0))}};cd.c=function(a,b,c){return null!=a?hb(a,b,c):dd([b],[c])};
cd.m=function(a,b,c,d){for(;;)if(a=cd.c(a,b,c),w(d))b=L(d),c=L(M(d)),d=M(M(d));else return a};cd.F=function(a){var b=L(a),c=M(a);a=L(c);var d=M(c),c=L(d),d=M(d);return cd.m(b,a,c,d)};cd.A=3;function ed(a,b){this.g=a;this.s=b;this.i=393217;this.B=0}g=ed.prototype;g.O=function(){return this.s};g.R=function(a,b){return new ed(this.g,b)};
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y,D,J,S){a=this;return F.kb?F.kb(a.g,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y,D,J,S):F.call(null,a.g,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y,D,J,S)}function b(a,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y,D,J){a=this;return a.g.na?a.g.na(b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y,D,J):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y,D,J)}function c(a,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y,D){a=this;return a.g.ma?a.g.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y,D):
a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y,D)}function d(a,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y){a=this;return a.g.la?a.g.la(b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y)}function e(a,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A){a=this;return a.g.ka?a.g.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A)}function f(a,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x){a=this;return a.g.ja?a.g.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x):a.g.call(null,b,
c,d,e,f,h,k,l,m,n,p,q,r,v,u,x)}function h(a,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u){a=this;return a.g.ia?a.g.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,v,u):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u)}function k(a,b,c,d,e,f,h,k,l,m,n,p,q,r,v){a=this;return a.g.ha?a.g.ha(b,c,d,e,f,h,k,l,m,n,p,q,r,v):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,v)}function l(a,b,c,d,e,f,h,k,l,m,n,p,q,r){a=this;return a.g.ga?a.g.ga(b,c,d,e,f,h,k,l,m,n,p,q,r):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r)}function m(a,b,c,d,e,f,h,k,l,m,n,p,q){a=this;
return a.g.fa?a.g.fa(b,c,d,e,f,h,k,l,m,n,p,q):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q)}function n(a,b,c,d,e,f,h,k,l,m,n,p){a=this;return a.g.ea?a.g.ea(b,c,d,e,f,h,k,l,m,n,p):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p)}function p(a,b,c,d,e,f,h,k,l,m,n){a=this;return a.g.da?a.g.da(b,c,d,e,f,h,k,l,m,n):a.g.call(null,b,c,d,e,f,h,k,l,m,n)}function q(a,b,c,d,e,f,h,k,l,m){a=this;return a.g.pa?a.g.pa(b,c,d,e,f,h,k,l,m):a.g.call(null,b,c,d,e,f,h,k,l,m)}function r(a,b,c,d,e,f,h,k,l){a=this;return a.g.oa?a.g.oa(b,c,
d,e,f,h,k,l):a.g.call(null,b,c,d,e,f,h,k,l)}function u(a,b,c,d,e,f,h,k){a=this;return a.g.X?a.g.X(b,c,d,e,f,h,k):a.g.call(null,b,c,d,e,f,h,k)}function x(a,b,c,d,e,f,h){a=this;return a.g.W?a.g.W(b,c,d,e,f,h):a.g.call(null,b,c,d,e,f,h)}function v(a,b,c,d,e,f){a=this;return a.g.D?a.g.D(b,c,d,e,f):a.g.call(null,b,c,d,e,f)}function A(a,b,c,d,e){a=this;return a.g.o?a.g.o(b,c,d,e):a.g.call(null,b,c,d,e)}function D(a,b,c,d){a=this;return a.g.c?a.g.c(b,c,d):a.g.call(null,b,c,d)}function J(a,b,c){a=this;return a.g.b?
a.g.b(b,c):a.g.call(null,b,c)}function S(a,b){a=this;return a.g.a?a.g.a(b):a.g.call(null,b)}function ra(a){a=this;return a.g.w?a.g.w():a.g.call(null)}var y=null,y=function(Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,y,ab,tb,Gb,ac,Ic,ud,ff){switch(arguments.length){case 1:return ra.call(this,Ia);case 2:return S.call(this,Ia,R);case 3:return J.call(this,Ia,R,U);case 4:return D.call(this,Ia,R,U,Y);case 5:return A.call(this,Ia,R,U,Y,da);case 6:return v.call(this,Ia,R,U,Y,da,ga);case 7:return x.call(this,Ia,
R,U,Y,da,ga,ka);case 8:return u.call(this,Ia,R,U,Y,da,ga,ka,na);case 9:return r.call(this,Ia,R,U,Y,da,ga,ka,na,pa);case 10:return q.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa);case 11:return p.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa,xa);case 12:return n.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga);case 13:return m.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja);case 14:return l.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra);case 15:return k.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,y);case 16:return h.call(this,
Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,y,ab);case 17:return f.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,y,ab,tb);case 18:return e.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,y,ab,tb,Gb);case 19:return d.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,y,ab,tb,Gb,ac);case 20:return c.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,y,ab,tb,Gb,ac,Ic);case 21:return b.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,y,ab,tb,Gb,ac,Ic,ud);case 22:return a.call(this,Ia,R,U,Y,da,ga,ka,na,pa,
qa,xa,Ga,Ja,Ra,y,ab,tb,Gb,ac,Ic,ud,ff)}throw Error("Invalid arity: "+arguments.length);};y.a=ra;y.b=S;y.c=J;y.o=D;y.D=A;y.W=v;y.X=x;y.oa=u;y.pa=r;y.da=q;y.ea=p;y.fa=n;y.ga=m;y.ha=l;y.ia=k;y.ja=h;y.ka=f;y.la=e;y.ma=d;y.na=c;y.Hb=b;y.kb=a;return y}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};g.w=function(){return this.g.w?this.g.w():this.g.call(null)};g.a=function(a){return this.g.a?this.g.a(a):this.g.call(null,a)};
g.b=function(a,b){return this.g.b?this.g.b(a,b):this.g.call(null,a,b)};g.c=function(a,b,c){return this.g.c?this.g.c(a,b,c):this.g.call(null,a,b,c)};g.o=function(a,b,c,d){return this.g.o?this.g.o(a,b,c,d):this.g.call(null,a,b,c,d)};g.D=function(a,b,c,d,e){return this.g.D?this.g.D(a,b,c,d,e):this.g.call(null,a,b,c,d,e)};g.W=function(a,b,c,d,e,f){return this.g.W?this.g.W(a,b,c,d,e,f):this.g.call(null,a,b,c,d,e,f)};
g.X=function(a,b,c,d,e,f,h){return this.g.X?this.g.X(a,b,c,d,e,f,h):this.g.call(null,a,b,c,d,e,f,h)};g.oa=function(a,b,c,d,e,f,h,k){return this.g.oa?this.g.oa(a,b,c,d,e,f,h,k):this.g.call(null,a,b,c,d,e,f,h,k)};g.pa=function(a,b,c,d,e,f,h,k,l){return this.g.pa?this.g.pa(a,b,c,d,e,f,h,k,l):this.g.call(null,a,b,c,d,e,f,h,k,l)};g.da=function(a,b,c,d,e,f,h,k,l,m){return this.g.da?this.g.da(a,b,c,d,e,f,h,k,l,m):this.g.call(null,a,b,c,d,e,f,h,k,l,m)};
g.ea=function(a,b,c,d,e,f,h,k,l,m,n){return this.g.ea?this.g.ea(a,b,c,d,e,f,h,k,l,m,n):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n)};g.fa=function(a,b,c,d,e,f,h,k,l,m,n,p){return this.g.fa?this.g.fa(a,b,c,d,e,f,h,k,l,m,n,p):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p)};g.ga=function(a,b,c,d,e,f,h,k,l,m,n,p,q){return this.g.ga?this.g.ga(a,b,c,d,e,f,h,k,l,m,n,p,q):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q)};
g.ha=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r){return this.g.ha?this.g.ha(a,b,c,d,e,f,h,k,l,m,n,p,q,r):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r)};g.ia=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u){return this.g.ia?this.g.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u)};g.ja=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x){return this.g.ja?this.g.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x)};
g.ka=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v){return this.g.ka?this.g.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v)};g.la=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A){return this.g.la?this.g.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A)};
g.ma=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D){return this.g.ma?this.g.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D)};g.na=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J){return this.g.na?this.g.na(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J)};
g.Hb=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J,S){return F.kb?F.kb(this.g,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J,S):F.call(null,this.g,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J,S)};function Hc(a,b){return ba(a)?new ed(a,b):null==a?null:ub(a,b)}function fd(a){var b=null!=a;return(b?null!=a?a.i&131072||a.cc||(a.i?0:B(qb,a)):B(qb,a):b)?rb(a):null}function gd(a){return null==a?!1:null!=a?a.i&8||a.wc?!0:a.i?!1:B(Xa,a):B(Xa,a)}
function hd(a){return null==a?!1:null!=a?a.i&4096||a.Bc?!0:a.i?!1:B(mb,a):B(mb,a)}function id(a){return null!=a?a.i&16777216||a.Ac?!0:a.i?!1:B(Bb,a):B(Bb,a)}function jd(a){return null==a?!1:null!=a?a.i&1024||a.ac?!0:a.i?!1:B(ib,a):B(ib,a)}function kd(a){return null!=a?a.i&16384||a.Cc?!0:a.i?!1:B(nb,a):B(nb,a)}ld;md;function nd(a){return null!=a?a.B&512||a.vc?!0:!1:!1}function od(a){var b=[];ja(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}
function pd(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var qd={};function rd(a){return null==a?!1:null!=a?a.i&64||a.$a?!0:a.i?!1:B($a,a):B($a,a)}function sd(a){return null==a?!1:!1===a?!1:!0}function td(a,b){return pc.c(a,b,qd)===qd?!1:!0}
function hc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return sa(a,b);throw Error([E("Cannot compare "),E(a),E(" to "),E(b)].join(""));}if(null!=a?a.B&2048||a.jb||(a.B?0:B(Nb,a)):B(Nb,a))return Ob(a,b);if("string"!==typeof a&&!Na(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([E("Cannot compare "),E(a),E(" to "),E(b)].join(""));return sa(a,b)}
function vd(a,b){var c=P(a),d=P(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=hc(ad(a,d),ad(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}wd;var Wc=function Wc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Wc.b(arguments[0],arguments[1]);case 3:return Wc.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
Wc.b=function(a,b){var c=K(b);if(c){var d=L(c),c=M(c);return Ta.c?Ta.c(a,d,c):Ta.call(null,a,d,c)}return a.w?a.w():a.call(null)};Wc.c=function(a,b,c){for(c=K(c);;)if(c){var d=L(c);b=a.b?a.b(b,d):a.call(null,b,d);if(Kc(b))return pb(b);c=M(c)}else return b};Wc.A=3;xd;
var Ta=function Ta(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ta.b(arguments[0],arguments[1]);case 3:return Ta.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Ta.b=function(a,b){return null!=b&&(b.i&524288||b.ec)?b.aa(null,a):Na(b)?Nc(b,a):"string"===typeof b?Nc(b,a):B(vb,b)?wb.b(b,a):Wc.b(a,b)};
Ta.c=function(a,b,c){return null!=c&&(c.i&524288||c.ec)?c.ba(null,a,b):Na(c)?Oc(c,a,b):"string"===typeof c?Oc(c,a,b):B(vb,c)?wb.c(c,a,b):Wc.c(a,b,c)};Ta.A=3;function yd(a){return a}var zd=function zd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return zd.w();case 1:return zd.a(arguments[0]);case 2:return zd.b(arguments[0],arguments[1]);default:return zd.m(arguments[0],arguments[1],new tc(c.slice(2),0))}};zd.w=function(){return 0};
zd.a=function(a){return a};zd.b=function(a,b){return a+b};zd.m=function(a,b,c){return Ta.c(zd,a+b,c)};zd.F=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return zd.m(b,a,c)};zd.A=2;var Ad=function Ad(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ad.a(arguments[0]);case 2:return Ad.b(arguments[0],arguments[1]);default:return Ad.m(arguments[0],arguments[1],new tc(c.slice(2),0))}};Ad.a=function(a){return-a};
Ad.b=function(a,b){return a-b};Ad.m=function(a,b,c){return Ta.c(Ad,a-b,c)};Ad.F=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return Ad.m(b,a,c)};Ad.A=2;var Bd=function Bd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Bd.w();case 1:return Bd.a(arguments[0]);case 2:return Bd.b(arguments[0],arguments[1]);default:return Bd.m(arguments[0],arguments[1],new tc(c.slice(2),0))}};Bd.w=function(){return 1};Bd.a=function(a){return a};
Bd.b=function(a,b){return a*b};Bd.m=function(a,b,c){return Ta.c(Bd,a*b,c)};Bd.F=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return Bd.m(b,a,c)};Bd.A=2;ta.Gc;var Cd=function Cd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Cd.a(arguments[0]);case 2:return Cd.b(arguments[0],arguments[1]);default:return Cd.m(arguments[0],arguments[1],new tc(c.slice(2),0))}};Cd.a=function(a){return 1/a};Cd.b=function(a,b){return a/b};
Cd.m=function(a,b,c){return Ta.c(Cd,a/b,c)};Cd.F=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return Cd.m(b,a,c)};Cd.A=2;Dd;function Dd(a,b){return(a%b+b)%b}function Ed(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function Fd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function Gd(a,b){for(var c=b,d=K(a);;)if(d&&0<c)--c,d=M(d);else return d}
var E=function E(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return E.w();case 1:return E.a(arguments[0]);default:return E.m(arguments[0],new tc(c.slice(1),0))}};E.w=function(){return""};E.a=function(a){return null==a?"":""+a};E.m=function(a,b){for(var c=new la(""+E(a)),d=b;;)if(w(d))c=c.append(""+E(L(d))),d=M(d);else return c.toString()};E.F=function(a){var b=L(a);a=M(a);return E.m(b,a)};E.A=1;
function Hd(a,b){return a.substring(b)}Id;Jd;function Gc(a,b){var c;if(id(b))if(Tc(a)&&Tc(b)&&P(a)!==P(b))c=!1;else a:{c=K(a);for(var d=K(b);;){if(null==c){c=null==d;break a}if(null!=d&&gc.b(L(c),L(d)))c=M(c),d=M(d);else{c=!1;break a}}}else c=null;return sd(c)}function Qc(a){if(K(a)){var b=mc(L(a));for(a=M(a);;){if(null==a)return b;b=nc(b,mc(L(a)));a=M(a)}}else return 0}Kd;Ld;Jd;Md;Nd;function Sc(a,b,c,d,e){this.s=a;this.first=b;this.ua=c;this.count=d;this.u=e;this.i=65937646;this.B=8192}g=Sc.prototype;
g.toString=function(){return Zb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.s};g.ta=function(){return 1===this.count?null:this.ua};g.Z=function(){return this.count};g.L=function(){var a=this.u;return null!=a?a:this.u=a=Bc(this)};g.v=function(a,b){return Gc(this,b)};g.V=function(){return ub(vc,this.s)};g.aa=function(a,b){return Wc.b(b,this)};g.ba=function(a,b,c){return Wc.c(b,c,this)};g.Y=function(){return this.first};g.qa=function(){return 1===this.count?vc:this.ua};
g.S=function(){return this};g.R=function(a,b){return new Sc(b,this.first,this.ua,this.count,this.u)};g.T=function(a,b){return new Sc(this.s,b,this,this.count+1,null)};Sc.prototype[Qa]=function(){return xc(this)};function Od(a){this.s=a;this.i=65937614;this.B=8192}g=Od.prototype;g.toString=function(){return Zb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.s};g.ta=function(){return null};g.Z=function(){return 0};g.L=function(){return Cc};
g.v=function(a,b){return(null!=b?b.i&33554432||b.zc||(b.i?0:B(Cb,b)):B(Cb,b))||id(b)?null==K(b):!1};g.V=function(){return this};g.aa=function(a,b){return Wc.b(b,this)};g.ba=function(a,b,c){return Wc.c(b,c,this)};g.Y=function(){return null};g.qa=function(){return vc};g.S=function(){return null};g.R=function(a,b){return new Od(b)};g.T=function(a,b){return new Sc(this.s,b,null,1,null)};var vc=new Od(null);Od.prototype[Qa]=function(){return xc(this)};
var fc=function fc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return fc.m(0<c.length?new tc(c.slice(0),0):null)};fc.m=function(a){var b;if(a instanceof tc&&0===a.j)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.Y(null)),a=a.ta(null);else break a;a=b.length;for(var c=vc;;)if(0<a){var d=a-1,c=c.T(null,b[a-1]);a=d}else return c};fc.A=0;fc.F=function(a){return fc.m(K(a))};function Pd(a,b,c,d){this.s=a;this.first=b;this.ua=c;this.u=d;this.i=65929452;this.B=8192}
g=Pd.prototype;g.toString=function(){return Zb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.s};g.ta=function(){return null==this.ua?null:K(this.ua)};g.L=function(){var a=this.u;return null!=a?a:this.u=a=Bc(this)};g.v=function(a,b){return Gc(this,b)};g.V=function(){return Hc(vc,this.s)};g.aa=function(a,b){return Wc.b(b,this)};g.ba=function(a,b,c){return Wc.c(b,c,this)};g.Y=function(){return this.first};g.qa=function(){return null==this.ua?vc:this.ua};g.S=function(){return this};
g.R=function(a,b){return new Pd(b,this.first,this.ua,this.u)};g.T=function(a,b){return new Pd(null,b,this,this.u)};Pd.prototype[Qa]=function(){return xc(this)};function O(a,b){var c=null==b;return(c?c:null!=b&&(b.i&64||b.$a))?new Pd(null,a,b,null):new Pd(null,a,K(b),null)}function Qd(a,b){if(a.Ga===b.Ga)return 0;var c=Oa(a.sa);if(w(c?b.sa:c))return-1;if(w(a.sa)){if(Oa(b.sa))return 1;c=sa(a.sa,b.sa);return 0===c?sa(a.name,b.name):c}return sa(a.name,b.name)}
function z(a,b,c,d){this.sa=a;this.name=b;this.Ga=c;this.Ya=d;this.i=2153775105;this.B=4096}g=z.prototype;g.toString=function(){return[E(":"),E(this.Ga)].join("")};g.equiv=function(a){return this.v(null,a)};g.v=function(a,b){return b instanceof z?this.Ga===b.Ga:!1};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return pc.b(c,this);case 3:return pc.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return pc.b(c,this)};a.c=function(a,c,d){return pc.c(c,this,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};g.a=function(a){return pc.b(a,this)};g.b=function(a,b){return pc.c(a,this,b)};
g.L=function(){var a=this.Ya;return null!=a?a:this.Ya=a=nc(ec(this.name),lc(this.sa))+2654435769|0};g.nb=function(){return this.name};g.ob=function(){return this.sa};g.J=function(a,b){return Db(b,[E(":"),E(this.Ga)].join(""))};var Rd=function Rd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Rd.a(arguments[0]);case 2:return Rd.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
Rd.a=function(a){if(a instanceof z)return a;if(a instanceof H){var b;if(null!=a&&(a.B&4096||a.dc))b=a.ob(null);else throw Error([E("Doesn't support namespace: "),E(a)].join(""));return new z(b,Jd.a?Jd.a(a):Jd.call(null,a),a.Ia,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new z(b[0],b[1],a,null):new z(null,b[0],a,null)):null};Rd.b=function(a,b){return new z(a,b,[E(w(a)?[E(a),E("/")].join(""):null),E(b)].join(""),null)};Rd.A=2;
function Sd(a,b,c,d){this.s=a;this.cb=b;this.C=c;this.u=d;this.i=32374988;this.B=0}g=Sd.prototype;g.toString=function(){return Zb(this)};g.equiv=function(a){return this.v(null,a)};function Td(a){null!=a.cb&&(a.C=a.cb.w?a.cb.w():a.cb.call(null),a.cb=null);return a.C}g.O=function(){return this.s};g.ta=function(){Ab(this);return null==this.C?null:M(this.C)};g.L=function(){var a=this.u;return null!=a?a:this.u=a=Bc(this)};g.v=function(a,b){return Gc(this,b)};g.V=function(){return Hc(vc,this.s)};
g.aa=function(a,b){return Wc.b(b,this)};g.ba=function(a,b,c){return Wc.c(b,c,this)};g.Y=function(){Ab(this);return null==this.C?null:L(this.C)};g.qa=function(){Ab(this);return null!=this.C?uc(this.C):vc};g.S=function(){Td(this);if(null==this.C)return null;for(var a=this.C;;)if(a instanceof Sd)a=Td(a);else return this.C=a,K(this.C)};g.R=function(a,b){return new Sd(b,this.cb,this.C,this.u)};g.T=function(a,b){return O(b,this)};Sd.prototype[Qa]=function(){return xc(this)};Ud;
function Vd(a,b){this.Cb=a;this.end=b;this.i=2;this.B=0}Vd.prototype.add=function(a){this.Cb[this.end]=a;return this.end+=1};Vd.prototype.Aa=function(){var a=new Ud(this.Cb,0,this.end);this.Cb=null;return a};Vd.prototype.Z=function(){return this.end};function Ud(a,b,c){this.f=a;this.ca=b;this.end=c;this.i=524306;this.B=0}g=Ud.prototype;g.Z=function(){return this.end-this.ca};g.U=function(a,b){return this.f[this.ca+b]};g.wa=function(a,b,c){return 0<=b&&b<this.end-this.ca?this.f[this.ca+b]:c};
g.Mb=function(){if(this.ca===this.end)throw Error("-drop-first of empty chunk");return new Ud(this.f,this.ca+1,this.end)};g.aa=function(a,b){return Pc(this.f,b,this.f[this.ca],this.ca+1)};g.ba=function(a,b,c){return Pc(this.f,b,c,this.ca)};function ld(a,b,c,d){this.Aa=a;this.Ha=b;this.s=c;this.u=d;this.i=31850732;this.B=1536}g=ld.prototype;g.toString=function(){return Zb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.s};
g.ta=function(){if(1<Va(this.Aa))return new ld(Pb(this.Aa),this.Ha,this.s,null);var a=Ab(this.Ha);return null==a?null:a};g.L=function(){var a=this.u;return null!=a?a:this.u=a=Bc(this)};g.v=function(a,b){return Gc(this,b)};g.V=function(){return Hc(vc,this.s)};g.Y=function(){return G.b(this.Aa,0)};g.qa=function(){return 1<Va(this.Aa)?new ld(Pb(this.Aa),this.Ha,this.s,null):null==this.Ha?vc:this.Ha};g.S=function(){return this};g.Fb=function(){return this.Aa};g.Gb=function(){return null==this.Ha?vc:this.Ha};
g.R=function(a,b){return new ld(this.Aa,this.Ha,b,this.u)};g.T=function(a,b){return O(b,this)};g.Eb=function(){return null==this.Ha?null:this.Ha};ld.prototype[Qa]=function(){return xc(this)};function Wd(a,b){return 0===Va(a)?b:new ld(a,b,null,null)}function Xd(a,b){a.add(b)}function Md(a){return Qb(a)}function Nd(a){return Rb(a)}function wd(a){for(var b=[];;)if(K(a))b.push(L(a)),a=M(a);else return b}
function Yd(a,b){if(Tc(a))return P(a);for(var c=a,d=b,e=0;;)if(0<d&&K(c))c=M(c),--d,e+=1;else return e}var Zd=function Zd(b){return null==b?null:null==M(b)?K(L(b)):O(L(b),Zd(M(b)))},$d=function $d(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return $d.w();case 1:return $d.a(arguments[0]);case 2:return $d.b(arguments[0],arguments[1]);default:return $d.m(arguments[0],arguments[1],new tc(c.slice(2),0))}};
$d.w=function(){return new Sd(null,function(){return null},null,null)};$d.a=function(a){return new Sd(null,function(){return a},null,null)};$d.b=function(a,b){return new Sd(null,function(){var c=K(a);return c?nd(c)?Wd(Qb(c),$d.b(Rb(c),b)):O(L(c),$d.b(uc(c),b)):b},null,null)};$d.m=function(a,b,c){return function e(a,b){return new Sd(null,function(){var c=K(a);return c?nd(c)?Wd(Qb(c),e(Rb(c),b)):O(L(c),e(uc(c),b)):w(b)?e(L(b),M(b)):null},null,null)}($d.b(a,b),c)};
$d.F=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return $d.m(b,a,c)};$d.A=2;var ae=function ae(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ae.w();case 1:return ae.a(arguments[0]);case 2:return ae.b(arguments[0],arguments[1]);default:return ae.m(arguments[0],arguments[1],new tc(c.slice(2),0))}};ae.w=function(){return Ib(Zc)};ae.a=function(a){return a};ae.b=function(a,b){return Jb(a,b)};
ae.m=function(a,b,c){for(;;)if(a=Jb(a,b),w(c))b=L(c),c=M(c);else return a};ae.F=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return ae.m(b,a,c)};ae.A=2;
function be(a,b,c){var d=K(c);if(0===b)return a.w?a.w():a.call(null);c=bb(d);var e=cb(d);if(1===b)return a.a?a.a(c):a.a?a.a(c):a.call(null,c);var d=bb(e),f=cb(e);if(2===b)return a.b?a.b(c,d):a.b?a.b(c,d):a.call(null,c,d);var e=bb(f),h=cb(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=bb(h),k=cb(h);if(4===b)return a.o?a.o(c,d,e,f):a.o?a.o(c,d,e,f):a.call(null,c,d,e,f);var h=bb(k),l=cb(k);if(5===b)return a.D?a.D(c,d,e,f,h):a.D?a.D(c,d,e,f,h):a.call(null,c,d,e,f,h);var k=bb(l),
m=cb(l);if(6===b)return a.W?a.W(c,d,e,f,h,k):a.W?a.W(c,d,e,f,h,k):a.call(null,c,d,e,f,h,k);var l=bb(m),n=cb(m);if(7===b)return a.X?a.X(c,d,e,f,h,k,l):a.X?a.X(c,d,e,f,h,k,l):a.call(null,c,d,e,f,h,k,l);var m=bb(n),p=cb(n);if(8===b)return a.oa?a.oa(c,d,e,f,h,k,l,m):a.oa?a.oa(c,d,e,f,h,k,l,m):a.call(null,c,d,e,f,h,k,l,m);var n=bb(p),q=cb(p);if(9===b)return a.pa?a.pa(c,d,e,f,h,k,l,m,n):a.pa?a.pa(c,d,e,f,h,k,l,m,n):a.call(null,c,d,e,f,h,k,l,m,n);var p=bb(q),r=cb(q);if(10===b)return a.da?a.da(c,d,e,f,h,
k,l,m,n,p):a.da?a.da(c,d,e,f,h,k,l,m,n,p):a.call(null,c,d,e,f,h,k,l,m,n,p);var q=bb(r),u=cb(r);if(11===b)return a.ea?a.ea(c,d,e,f,h,k,l,m,n,p,q):a.ea?a.ea(c,d,e,f,h,k,l,m,n,p,q):a.call(null,c,d,e,f,h,k,l,m,n,p,q);var r=bb(u),x=cb(u);if(12===b)return a.fa?a.fa(c,d,e,f,h,k,l,m,n,p,q,r):a.fa?a.fa(c,d,e,f,h,k,l,m,n,p,q,r):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r);var u=bb(x),v=cb(x);if(13===b)return a.ga?a.ga(c,d,e,f,h,k,l,m,n,p,q,r,u):a.ga?a.ga(c,d,e,f,h,k,l,m,n,p,q,r,u):a.call(null,c,d,e,f,h,k,l,m,n,p,q,
r,u);var x=bb(v),A=cb(v);if(14===b)return a.ha?a.ha(c,d,e,f,h,k,l,m,n,p,q,r,u,x):a.ha?a.ha(c,d,e,f,h,k,l,m,n,p,q,r,u,x):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,u,x);var v=bb(A),D=cb(A);if(15===b)return a.ia?a.ia(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v):a.ia?a.ia(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v);var A=bb(D),J=cb(D);if(16===b)return a.ja?a.ja(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A):a.ja?a.ja(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A);var D=bb(J),
S=cb(J);if(17===b)return a.ka?a.ka(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D):a.ka?a.ka(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D);var J=bb(S),ra=cb(S);if(18===b)return a.la?a.la(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J):a.la?a.la(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J);S=bb(ra);ra=cb(ra);if(19===b)return a.ma?a.ma(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J,S):a.ma?a.ma(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J,S):a.call(null,c,d,e,f,h,k,
l,m,n,p,q,r,u,x,v,A,D,J,S);var y=bb(ra);cb(ra);if(20===b)return a.na?a.na(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J,S,y):a.na?a.na(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J,S,y):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J,S,y);throw Error("Only up to 20 arguments supported on functions");}
var F=function F(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return F.b(arguments[0],arguments[1]);case 3:return F.c(arguments[0],arguments[1],arguments[2]);case 4:return F.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return F.D(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return F.m(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new tc(c.slice(5),0))}};
F.b=function(a,b){var c=a.A;if(a.F){var d=Yd(b,c+1);return d<=c?be(a,d,b):a.F(b)}return a.apply(a,wd(b))};F.c=function(a,b,c){b=O(b,c);c=a.A;if(a.F){var d=Yd(b,c+1);return d<=c?be(a,d,b):a.F(b)}return a.apply(a,wd(b))};F.o=function(a,b,c,d){b=O(b,O(c,d));c=a.A;return a.F?(d=Yd(b,c+1),d<=c?be(a,d,b):a.F(b)):a.apply(a,wd(b))};F.D=function(a,b,c,d,e){b=O(b,O(c,O(d,e)));c=a.A;return a.F?(d=Yd(b,c+1),d<=c?be(a,d,b):a.F(b)):a.apply(a,wd(b))};
F.m=function(a,b,c,d,e,f){b=O(b,O(c,O(d,O(e,Zd(f)))));c=a.A;return a.F?(d=Yd(b,c+1),d<=c?be(a,d,b):a.F(b)):a.apply(a,wd(b))};F.F=function(a){var b=L(a),c=M(a);a=L(c);var d=M(c),c=L(d),e=M(d),d=L(e),f=M(e),e=L(f),f=M(f);return F.m(b,a,c,d,e,f)};F.A=5;
var ce=function ce(){"undefined"===typeof ua&&(ua=function(b,c){this.rc=b;this.qc=c;this.i=393216;this.B=0},ua.prototype.R=function(b,c){return new ua(this.rc,c)},ua.prototype.O=function(){return this.qc},ua.prototype.ra=function(){return!1},ua.prototype.next=function(){return Error("No such element")},ua.prototype.remove=function(){return Error("Unsupported operation")},ua.oc=function(){return new T(null,2,5,V,[Hc(de,new Ba(null,1,[ee,fc(fe,fc(Zc))],null)),ta.Fc],null)},ua.Ib=!0,ua.qb="cljs.core/t_cljs$core14789",
ua.Sb=function(b,c){return Db(c,"cljs.core/t_cljs$core14789")});return new ua(ce,ge)};he;function he(a,b,c,d){this.hb=a;this.first=b;this.ua=c;this.s=d;this.i=31719628;this.B=0}g=he.prototype;g.R=function(a,b){return new he(this.hb,this.first,this.ua,b)};g.T=function(a,b){return O(b,Ab(this))};g.V=function(){return vc};g.v=function(a,b){return null!=Ab(this)?Gc(this,b):id(b)&&null==K(b)};g.L=function(){return Bc(this)};g.S=function(){null!=this.hb&&this.hb.step(this);return null==this.ua?null:this};
g.Y=function(){null!=this.hb&&Ab(this);return null==this.ua?null:this.first};g.qa=function(){null!=this.hb&&Ab(this);return null==this.ua?vc:this.ua};g.ta=function(){null!=this.hb&&Ab(this);return null==this.ua?null:Ab(this.ua)};he.prototype[Qa]=function(){return xc(this)};function ie(a,b){for(;;){if(null==K(b))return!0;var c;c=L(b);c=a.a?a.a(c):a.call(null,c);if(w(c)){c=a;var d=M(b);a=c;b=d}else return!1}}
function je(a){for(var b=yd;;)if(K(a)){var c;c=L(a);c=b.a?b.a(c):b.call(null,c);if(w(c))return c;a=M(a)}else return null}
function ke(a){return function(){function b(b,c){return Oa(a.b?a.b(b,c):a.call(null,b,c))}function c(b){return Oa(a.a?a.a(b):a.call(null,b))}function d(){return Oa(a.w?a.w():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new tc(h,0)}return c.call(this,a,d,f)}function c(b,d,e){return Oa(F.o(a,b,d,e))}b.A=2;b.F=function(a){var b=L(a);a=M(a);var d=L(a);a=uc(a);return c(b,d,a)};b.m=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new tc(n,0)}return f.m(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.A=2;e.F=f.F;e.w=d;e.a=c;e.b=b;e.m=f.m;return e}()}
function le(){return function(){function a(a){if(0<arguments.length)for(var c=0,d=Array(arguments.length-0);c<d.length;)d[c]=arguments[c+0],++c;return null}a.A=0;a.F=function(a){K(a);return null};a.m=function(){return null};return a}()}me;function ne(a,b,c,d){this.state=a;this.s=b;this.uc=c;this.zb=d;this.B=16386;this.i=6455296}g=ne.prototype;g.equiv=function(a){return this.v(null,a)};g.v=function(a,b){return this===b};g.xb=function(){return this.state};g.O=function(){return this.s};
g.Qb=function(a,b,c){a=K(this.zb);for(var d=null,e=0,f=0;;)if(f<e){var h=d.U(null,f),k=Q(h,0),h=Q(h,1);h.o?h.o(k,this,b,c):h.call(null,k,this,b,c);f+=1}else if(a=K(a))nd(a)?(d=Qb(a),a=Rb(a),k=d,e=P(d),d=k):(d=L(a),k=Q(d,0),h=Q(d,1),h.o?h.o(k,this,b,c):h.call(null,k,this,b,c),a=M(a),d=null,e=0),f=0;else return null};g.Pb=function(a,b,c){this.zb=cd.c(this.zb,b,c);return this};g.L=function(){return this[ca]||(this[ca]=++ea)};
var W=function W(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return W.a(arguments[0]);default:return W.m(arguments[0],new tc(c.slice(1),0))}};W.a=function(a){return new ne(a,null,null,null)};W.m=function(a,b){var c=null!=b&&(b.i&64||b.$a)?F.b(Fc,b):b,d=pc.b(c,Ea),c=pc.b(c,oe);return new ne(a,d,c,null)};W.F=function(a){var b=L(a);a=M(a);return W.m(b,a)};W.A=1;pe;
function qe(a,b){if(a instanceof ne){var c=a.uc;if(null!=c&&!w(c.a?c.a(b):c.call(null,b)))throw Error([E("Assert failed: "),E("Validator rejected reference state"),E("\n"),E(function(){var a=fc(re,se);return pe.a?pe.a(a):pe.call(null,a)}())].join(""));c=a.state;a.state=b;null!=a.zb&&Fb(a,c,b);return b}return Vb(a,b)}
var te=function te(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return te.b(arguments[0],arguments[1]);case 3:return te.c(arguments[0],arguments[1],arguments[2]);case 4:return te.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:return te.m(arguments[0],arguments[1],arguments[2],arguments[3],new tc(c.slice(4),0))}};te.b=function(a,b){var c;a instanceof ne?(c=a.state,c=b.a?b.a(c):b.call(null,c),c=qe(a,c)):c=Wb.b(a,b);return c};
te.c=function(a,b,c){if(a instanceof ne){var d=a.state;b=b.b?b.b(d,c):b.call(null,d,c);a=qe(a,b)}else a=Wb.c(a,b,c);return a};te.o=function(a,b,c,d){if(a instanceof ne){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=qe(a,b)}else a=Wb.o(a,b,c,d);return a};te.m=function(a,b,c,d,e){return a instanceof ne?qe(a,F.D(b,a.state,c,d,e)):Wb.D(a,b,c,d,e)};te.F=function(a){var b=L(a),c=M(a);a=L(c);var d=M(c),c=L(d),e=M(d),d=L(e),e=M(e);return te.m(b,a,c,d,e)};te.A=4;
function ue(a){this.state=a;this.i=32768;this.B=0}ue.prototype.xb=function(){return this.state};function me(a){return new ue(a)}
var Id=function Id(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Id.a(arguments[0]);case 2:return Id.b(arguments[0],arguments[1]);case 3:return Id.c(arguments[0],arguments[1],arguments[2]);case 4:return Id.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Id.m(arguments[0],arguments[1],arguments[2],arguments[3],new tc(c.slice(4),0))}};
Id.a=function(a){return function(b){return function(){function c(c,d){var e=a.a?a.a(d):a.call(null,d);return b.b?b.b(c,e):b.call(null,c,e)}function d(a){return b.a?b.a(a):b.call(null,a)}function e(){return b.w?b.w():b.call(null)}var f=null,h=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new tc(h,0)}return d.call(this,a,b,f)}function d(c,e,f){e=F.c(a,e,f);return b.b?b.b(c,e):b.call(null,c,e)}c.A=2;c.F=function(a){var b=
L(a);a=M(a);var c=L(a);a=uc(a);return d(b,c,a)};c.m=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new tc(p,0)}return h.m(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.A=2;f.F=h.F;f.w=e;f.a=d;f.b=c;f.m=h.m;return f}()}};
Id.b=function(a,b){return new Sd(null,function(){var c=K(b);if(c){if(nd(c)){for(var d=Qb(c),e=P(d),f=new Vd(Array(e),0),h=0;;)if(h<e)Xd(f,function(){var b=G.b(d,h);return a.a?a.a(b):a.call(null,b)}()),h+=1;else break;return Wd(f.Aa(),Id.b(a,Rb(c)))}return O(function(){var b=L(c);return a.a?a.a(b):a.call(null,b)}(),Id.b(a,uc(c)))}return null},null,null)};
Id.c=function(a,b,c){return new Sd(null,function(){var d=K(b),e=K(c);if(d&&e){var f=O,h;h=L(d);var k=L(e);h=a.b?a.b(h,k):a.call(null,h,k);d=f(h,Id.c(a,uc(d),uc(e)))}else d=null;return d},null,null)};Id.o=function(a,b,c,d){return new Sd(null,function(){var e=K(b),f=K(c),h=K(d);if(e&&f&&h){var k=O,l;l=L(e);var m=L(f),n=L(h);l=a.c?a.c(l,m,n):a.call(null,l,m,n);e=k(l,Id.o(a,uc(e),uc(f),uc(h)))}else e=null;return e},null,null)};
Id.m=function(a,b,c,d,e){var f=function k(a){return new Sd(null,function(){var b=Id.b(K,a);return ie(yd,b)?O(Id.b(L,b),k(Id.b(uc,b))):null},null,null)};return Id.b(function(){return function(b){return F.b(a,b)}}(f),f(Yc.m(e,d,I([c,b],0))))};Id.F=function(a){var b=L(a),c=M(a);a=L(c);var d=M(c),c=L(d),e=M(d),d=L(e),e=M(e);return Id.m(b,a,c,d,e)};Id.A=4;
function ve(a,b){if("number"!==typeof a)throw Error([E("Assert failed: "),E(function(){var a=fc(we,xe);return pe.a?pe.a(a):pe.call(null,a)}())].join(""));return new Sd(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=K(b);if(0<a&&e){var f=a-1,e=uc(e);a=f;b=e}else return e}}),null,null)}function ye(a,b){return Id.c(function(a){return a},b,ve(a,b))}function ze(a,b){for(var c=K(b),d=K(ve(a,b));;)if(d)c=M(c),d=M(d);else return c}Ae;
function Be(a,b){return new Sd(null,function(){var c=K(b);if(c){if(nd(c)){for(var d=Qb(c),e=P(d),f=new Vd(Array(e),0),h=0;;)if(h<e){var k;k=G.b(d,h);k=a.a?a.a(k):a.call(null,k);w(k)&&(k=G.b(d,h),f.add(k));h+=1}else break;return Wd(f.Aa(),Be(a,Rb(c)))}d=L(c);c=uc(c);return w(a.a?a.a(d):a.call(null,d))?O(d,Be(a,c)):Be(a,c)}return null},null,null)}
function Ce(a){return function c(a){return new Sd(null,function(){var e=O,f;w(rd.a?rd.a(a):rd.call(null,a))?(f=I([K.a?K.a(a):K.call(null,a)],0),f=F.b($d,F.c(Id,c,f))):f=null;return e(a,f)},null,null)}(a)}function De(a,b){var c;null!=a?null!=a&&(a.B&4||a.xc)?(c=Ta.c(Jb,Ib(a),b),c=Kb(c),c=Hc(c,fd(a))):c=Ta.c(Ya,a,b):c=Ta.c(Yc,vc,b);return c}function Ee(a,b){this.M=a;this.f=b}
function Fe(a){return new Ee(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function Ge(a){a=a.l;return 32>a?0:a-1>>>5<<5}function He(a,b,c){for(;;){if(0===b)return c;var d=Fe(a);d.f[0]=c;c=d;b-=5}}var Ie=function Ie(b,c,d,e){var f=new Ee(d.M,Sa(d.f)),h=b.l-1>>>c&31;5===c?f.f[h]=e:(d=d.f[h],b=null!=d?Ie(b,c-5,d,e):He(null,c-5,e),f.f[h]=b);return f};
function Je(a,b){throw Error([E("No item "),E(a),E(" in vector of length "),E(b)].join(""));}function Ke(a,b){if(b>=Ge(a))return a.I;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}function Le(a,b){return 0<=b&&b<a.l?Ke(a,b):Je(b,a.l)}var Me=function Me(b,c,d,e,f){var h=new Ee(d.M,Sa(d.f));if(0===c)h.f[e&31]=f;else{var k=e>>>c&31;b=Me(b,c-5,d.f[k],e,f);h.f[k]=b}return h};function Ne(a,b,c,d,e,f){this.j=a;this.Bb=b;this.f=c;this.Ja=d;this.start=e;this.end=f}
Ne.prototype.ra=function(){return this.j<this.end};Ne.prototype.next=function(){32===this.j-this.Bb&&(this.f=Ke(this.Ja,this.j),this.Bb+=32);var a=this.f[this.j&31];this.j+=1;return a};Oe;Pe;Qe;N;Re;Se;Te;function T(a,b,c,d,e,f){this.s=a;this.l=b;this.shift=c;this.root=d;this.I=e;this.u=f;this.i=167668511;this.B=8196}g=T.prototype;g.toString=function(){return Zb(this)};g.equiv=function(a){return this.v(null,a)};g.K=function(a,b){return fb.c(this,b,null)};
g.H=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};g.U=function(a,b){return Le(this,b)[b&31]};g.wa=function(a,b,c){return 0<=b&&b<this.l?Ke(this,b)[b&31]:c};g.Ta=function(a,b,c){if(0<=b&&b<this.l)return Ge(this)<=b?(a=Sa(this.I),a[b&31]=c,new T(this.s,this.l,this.shift,this.root,a,null)):new T(this.s,this.l,this.shift,Me(this,this.shift,this.root,b,c),this.I,null);if(b===this.l)return Ya(this,c);throw Error([E("Index "),E(b),E(" out of bounds  [0,"),E(this.l),E("]")].join(""));};
g.Fa=function(){var a=this.l;return new Ne(0,0,0<P(this)?Ke(this,0):null,this,0,a)};g.O=function(){return this.s};g.Z=function(){return this.l};g.lb=function(){return G.b(this,0)};g.mb=function(){return G.b(this,1)};g.L=function(){var a=this.u;return null!=a?a:this.u=a=Bc(this)};g.v=function(a,b){if(b instanceof T)if(this.l===P(b))for(var c=Xb(this),d=Xb(b);;)if(w(c.ra())){var e=c.next(),f=d.next();if(!gc.b(e,f))return!1}else return!0;else return!1;else return Gc(this,b)};
g.Za=function(){return new Qe(this.l,this.shift,Oe.a?Oe.a(this.root):Oe.call(null,this.root),Pe.a?Pe.a(this.I):Pe.call(null,this.I))};g.V=function(){return Hc(Zc,this.s)};g.aa=function(a,b){return Lc(this,b)};g.ba=function(a,b,c){a=0;for(var d=c;;)if(a<this.l){var e=Ke(this,a);c=e.length;a:for(var f=0;;)if(f<c){var h=e[f],d=b.b?b.b(d,h):b.call(null,d,h);if(Kc(d)){e=d;break a}f+=1}else{e=d;break a}if(Kc(e))return N.a?N.a(e):N.call(null,e);a+=c;d=e}else return d};
g.Qa=function(a,b,c){if("number"===typeof b)return ob(this,b,c);throw Error("Vector's key for assoc must be a number.");};g.S=function(){if(0===this.l)return null;if(32>=this.l)return new tc(this.I,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return Te.o?Te.o(this,a,0,0):Te.call(null,this,a,0,0)};g.R=function(a,b){return new T(b,this.l,this.shift,this.root,this.I,this.u)};
g.T=function(a,b){if(32>this.l-Ge(this)){for(var c=this.I.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.I[e],e+=1;else break;d[c]=b;return new T(this.s,this.l+1,this.shift,this.root,d,null)}c=(d=this.l>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=Fe(null),d.f[0]=this.root,e=He(null,this.shift,new Ee(null,this.I)),d.f[1]=e):d=Ie(this,this.shift,this.root,new Ee(null,this.I));return new T(this.s,this.l+1,c,d,[b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.U(null,c);case 3:return this.wa(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.U(null,c)};a.c=function(a,c,d){return this.wa(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};g.a=function(a){return this.U(null,a)};g.b=function(a,b){return this.wa(null,a,b)};
var V=new Ee(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),Zc=new T(null,0,5,V,[],Cc);T.prototype[Qa]=function(){return xc(this)};function xd(a){if(Na(a))a:{var b=a.length;if(32>b)a=new T(null,b,5,V,a,null);else for(var c=32,d=(new T(null,32,5,V,a.slice(0,32),null)).Za(null);;)if(c<b)var e=c+1,d=ae.b(d,a[c]),c=e;else{a=Kb(d);break a}}else a=Kb(Ta.c(Jb,Ib(Zc),a));return a}Ue;
function md(a,b,c,d,e,f){this.za=a;this.node=b;this.j=c;this.ca=d;this.s=e;this.u=f;this.i=32375020;this.B=1536}g=md.prototype;g.toString=function(){return Zb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.s};g.ta=function(){if(this.ca+1<this.node.length){var a;a=this.za;var b=this.node,c=this.j,d=this.ca+1;a=Te.o?Te.o(a,b,c,d):Te.call(null,a,b,c,d);return null==a?null:a}return Sb(this)};g.L=function(){var a=this.u;return null!=a?a:this.u=a=Bc(this)};
g.v=function(a,b){return Gc(this,b)};g.V=function(){return Hc(Zc,this.s)};g.aa=function(a,b){var c;c=this.za;var d=this.j+this.ca,e=P(this.za);c=Ue.c?Ue.c(c,d,e):Ue.call(null,c,d,e);return Lc(c,b)};g.ba=function(a,b,c){a=this.za;var d=this.j+this.ca,e=P(this.za);a=Ue.c?Ue.c(a,d,e):Ue.call(null,a,d,e);return Mc(a,b,c)};g.Y=function(){return this.node[this.ca]};
g.qa=function(){if(this.ca+1<this.node.length){var a;a=this.za;var b=this.node,c=this.j,d=this.ca+1;a=Te.o?Te.o(a,b,c,d):Te.call(null,a,b,c,d);return null==a?vc:a}return Rb(this)};g.S=function(){return this};g.Fb=function(){var a=this.node;return new Ud(a,this.ca,a.length)};g.Gb=function(){var a=this.j+this.node.length;if(a<Va(this.za)){var b=this.za,c=Ke(this.za,a);return Te.o?Te.o(b,c,a,0):Te.call(null,b,c,a,0)}return vc};
g.R=function(a,b){return Te.D?Te.D(this.za,this.node,this.j,this.ca,b):Te.call(null,this.za,this.node,this.j,this.ca,b)};g.T=function(a,b){return O(b,this)};g.Eb=function(){var a=this.j+this.node.length;if(a<Va(this.za)){var b=this.za,c=Ke(this.za,a);return Te.o?Te.o(b,c,a,0):Te.call(null,b,c,a,0)}return null};md.prototype[Qa]=function(){return xc(this)};
var Te=function Te(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Te.c(arguments[0],arguments[1],arguments[2]);case 4:return Te.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Te.D(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Te.c=function(a,b,c){return new md(a,Le(a,b),b,c,null,null)};
Te.o=function(a,b,c,d){return new md(a,b,c,d,null,null)};Te.D=function(a,b,c,d,e){return new md(a,b,c,d,e,null)};Te.A=5;Ve;function We(a,b,c,d,e){this.s=a;this.Ja=b;this.start=c;this.end=d;this.u=e;this.i=167666463;this.B=8192}g=We.prototype;g.toString=function(){return Zb(this)};g.equiv=function(a){return this.v(null,a)};g.K=function(a,b){return fb.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};
g.U=function(a,b){return 0>b||this.end<=this.start+b?Je(b,this.end-this.start):G.b(this.Ja,this.start+b)};g.wa=function(a,b,c){return 0>b||this.end<=this.start+b?c:G.c(this.Ja,this.start+b,c)};g.Ta=function(a,b,c){var d=this.start+b;a=this.s;c=cd.c(this.Ja,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return Ve.D?Ve.D(a,c,b,d,null):Ve.call(null,a,c,b,d,null)};g.O=function(){return this.s};g.Z=function(){return this.end-this.start};g.L=function(){var a=this.u;return null!=a?a:this.u=a=Bc(this)};
g.v=function(a,b){return Gc(this,b)};g.V=function(){return Hc(Zc,this.s)};g.aa=function(a,b){return Lc(this,b)};g.ba=function(a,b,c){return Mc(this,b,c)};g.Qa=function(a,b,c){if("number"===typeof b)return ob(this,b,c);throw Error("Subvec's key for assoc must be a number.");};g.S=function(){var a=this;return function(b){return function d(e){return e===a.end?null:O(G.b(a.Ja,e),new Sd(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};
g.R=function(a,b){return Ve.D?Ve.D(b,this.Ja,this.start,this.end,this.u):Ve.call(null,b,this.Ja,this.start,this.end,this.u)};g.T=function(a,b){var c=this.s,d=ob(this.Ja,this.end,b),e=this.start,f=this.end+1;return Ve.D?Ve.D(c,d,e,f,null):Ve.call(null,c,d,e,f,null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.U(null,c);case 3:return this.wa(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.U(null,c)};a.c=function(a,c,d){return this.wa(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};g.a=function(a){return this.U(null,a)};g.b=function(a,b){return this.wa(null,a,b)};We.prototype[Qa]=function(){return xc(this)};
function Ve(a,b,c,d,e){for(;;)if(b instanceof We)c=b.start+c,d=b.start+d,b=b.Ja;else{var f=P(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new We(a,b,c,d,e)}}var Ue=function Ue(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ue.b(arguments[0],arguments[1]);case 3:return Ue.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
Ue.b=function(a,b){return Ue.c(a,b,P(a))};Ue.c=function(a,b,c){return Ve(null,a,b,c,null)};Ue.A=3;function Xe(a,b){return a===b.M?b:new Ee(a,Sa(b.f))}function Oe(a){return new Ee({},Sa(a.f))}function Pe(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];pd(a,0,b,0,a.length);return b}
var Ye=function Ye(b,c,d,e){d=Xe(b.root.M,d);var f=b.l-1>>>c&31;if(5===c)b=e;else{var h=d.f[f];b=null!=h?Ye(b,c-5,h,e):He(b.root.M,c-5,e)}d.f[f]=b;return d};function Qe(a,b,c,d){this.l=a;this.shift=b;this.root=c;this.I=d;this.B=88;this.i=275}g=Qe.prototype;
g.Sa=function(a,b){if(this.root.M){if(32>this.l-Ge(this))this.I[this.l&31]=b;else{var c=new Ee(this.root.M,this.I),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.I=d;if(this.l>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=He(this.root.M,this.shift,c);this.root=new Ee(this.root.M,d);this.shift=e}else this.root=Ye(this,this.shift,this.root,c)}this.l+=1;return this}throw Error("conj! after persistent!");};g.ab=function(){if(this.root.M){this.root.M=null;var a=this.l-Ge(this),b=Array(a);pd(this.I,0,b,0,a);return new T(null,this.l,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
g.pb=function(a,b,c){if("number"===typeof b)return Mb(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
g.Ob=function(a,b,c){var d=this;if(d.root.M){if(0<=b&&b<d.l)return Ge(this)<=b?d.I[b&31]=c:(a=function(){return function f(a,k){var l=Xe(d.root.M,k);if(0===a)l.f[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.l)return Jb(this,c);throw Error([E("Index "),E(b),E(" out of bounds for TransientVector of length"),E(d.l)].join(""));}throw Error("assoc! after persistent!");};
g.Z=function(){if(this.root.M)return this.l;throw Error("count after persistent!");};g.U=function(a,b){if(this.root.M)return Le(this,b)[b&31];throw Error("nth after persistent!");};g.wa=function(a,b,c){return 0<=b&&b<this.l?G.b(this,b):c};g.K=function(a,b){return fb.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};function Ze(a,b){this.eb=a;this.vb=b}
Ze.prototype.ra=function(){var a=null!=this.eb&&K(this.eb);return a?a:(a=null!=this.vb)?this.vb.ra():a};Ze.prototype.next=function(){if(null!=this.eb){var a=L(this.eb);this.eb=M(this.eb);return a}if(null!=this.vb&&this.vb.ra())return this.vb.next();throw Error("No such element");};Ze.prototype.remove=function(){return Error("Unsupported operation")};function $e(a,b,c,d){this.s=a;this.Ba=b;this.Ka=c;this.u=d;this.i=31850572;this.B=0}g=$e.prototype;g.toString=function(){return Zb(this)};
g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.s};g.L=function(){var a=this.u;return null!=a?a:this.u=a=Bc(this)};g.v=function(a,b){return Gc(this,b)};g.V=function(){return Hc(vc,this.s)};g.Y=function(){return L(this.Ba)};g.qa=function(){var a=M(this.Ba);return a?new $e(this.s,a,this.Ka,null):null==this.Ka?Wa(this):new $e(this.s,this.Ka,null,null)};g.S=function(){return this};g.R=function(a,b){return new $e(b,this.Ba,this.Ka,this.u)};g.T=function(a,b){return O(b,this)};
$e.prototype[Qa]=function(){return xc(this)};function af(a,b,c,d,e){this.s=a;this.count=b;this.Ba=c;this.Ka=d;this.u=e;this.i=31858766;this.B=8192}g=af.prototype;g.toString=function(){return Zb(this)};g.equiv=function(a){return this.v(null,a)};g.Fa=function(){return new Ze(this.Ba,Xb(this.Ka))};g.O=function(){return this.s};g.Z=function(){return this.count};g.L=function(){var a=this.u;return null!=a?a:this.u=a=Bc(this)};g.v=function(a,b){return Gc(this,b)};g.V=function(){return Hc(bf,this.s)};
g.Y=function(){return L(this.Ba)};g.qa=function(){return uc(K(this))};g.S=function(){var a=K(this.Ka),b=this.Ba;return w(w(b)?b:a)?new $e(null,this.Ba,K(a),null):null};g.R=function(a,b){return new af(b,this.count,this.Ba,this.Ka,this.u)};g.T=function(a,b){var c;w(this.Ba)?(c=this.Ka,c=new af(this.s,this.count+1,this.Ba,Yc.b(w(c)?c:Zc,b),null)):c=new af(this.s,this.count+1,Yc.b(this.Ba,b),Zc,null);return c};var bf=new af(null,0,null,Zc,Cc);af.prototype[Qa]=function(){return xc(this)};
function cf(){this.i=2097152;this.B=0}cf.prototype.equiv=function(a){return this.v(null,a)};cf.prototype.v=function(){return!1};var df=new cf;function ef(a,b){return sd(jd(b)?P(a)===P(b)?ie(yd,Id.b(function(a){return gc.b(pc.c(b,L(a),df),L(M(a)))},a)):null:null)}function gf(a){this.C=a}gf.prototype.next=function(){if(null!=this.C){var a=L(this.C),b=Q(a,0),a=Q(a,1);this.C=M(this.C);return{value:[b,a],done:!1}}return{value:null,done:!0}};function hf(a){return new gf(K(a))}function jf(a){this.C=a}
jf.prototype.next=function(){if(null!=this.C){var a=L(this.C);this.C=M(this.C);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function kf(a,b){var c;if(b instanceof z)a:{c=a.length;for(var d=b.Ga,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof z&&d===a[e].Ga){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof H)a:for(c=a.length,d=b.Ia,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof H&&d===a[e].Ia){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(gc.b(b,a[d])){c=d;break a}d+=2}return c}lf;function mf(a,b,c){this.f=a;this.j=b;this.va=c;this.i=32374990;this.B=0}g=mf.prototype;g.toString=function(){return Zb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.va};g.ta=function(){return this.j<this.f.length-2?new mf(this.f,this.j+2,this.va):null};g.Z=function(){return(this.f.length-this.j)/2};g.L=function(){return Bc(this)};g.v=function(a,b){return Gc(this,b)};
g.V=function(){return Hc(vc,this.va)};g.aa=function(a,b){return Wc.b(b,this)};g.ba=function(a,b,c){return Wc.c(b,c,this)};g.Y=function(){return new T(null,2,5,V,[this.f[this.j],this.f[this.j+1]],null)};g.qa=function(){return this.j<this.f.length-2?new mf(this.f,this.j+2,this.va):vc};g.S=function(){return this};g.R=function(a,b){return new mf(this.f,this.j,b)};g.T=function(a,b){return O(b,this)};mf.prototype[Qa]=function(){return xc(this)};nf;of;function pf(a,b,c){this.f=a;this.j=b;this.l=c}
pf.prototype.ra=function(){return this.j<this.l};pf.prototype.next=function(){var a=new T(null,2,5,V,[this.f[this.j],this.f[this.j+1]],null);this.j+=2;return a};function Ba(a,b,c,d){this.s=a;this.l=b;this.f=c;this.u=d;this.i=16647951;this.B=8196}g=Ba.prototype;g.toString=function(){return Zb(this)};g.equiv=function(a){return this.v(null,a)};g.keys=function(){return xc(nf.a?nf.a(this):nf.call(null,this))};g.entries=function(){return hf(K(this))};
g.values=function(){return xc(of.a?of.a(this):of.call(null,this))};g.has=function(a){return td(this,a)};g.get=function(a,b){return this.H(null,a,b)};g.forEach=function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.U(null,e),h=Q(f,0),f=Q(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=K(b))nd(b)?(c=Qb(b),b=Rb(b),h=c,d=P(c),c=h):(c=L(b),h=Q(c,0),f=Q(c,1),a.b?a.b(f,h):a.call(null,f,h),b=M(b),c=null,d=0),e=0;else return null};g.K=function(a,b){return fb.c(this,b,null)};
g.H=function(a,b,c){a=kf(this.f,b);return-1===a?c:this.f[a+1]};g.Fa=function(){return new pf(this.f,0,2*this.l)};g.O=function(){return this.s};g.Z=function(){return this.l};g.L=function(){var a=this.u;return null!=a?a:this.u=a=Dc(this)};g.v=function(a,b){if(null!=b&&(b.i&1024||b.ac)){var c=this.f.length;if(this.l===b.Z(null))for(var d=0;;)if(d<c){var e=b.H(null,this.f[d],qd);if(e!==qd)if(gc.b(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return ef(this,b)};
g.Za=function(){return new lf({},this.f.length,Sa(this.f))};g.V=function(){return ub(ge,this.s)};g.aa=function(a,b){return Wc.b(b,this)};g.ba=function(a,b,c){return Wc.c(b,c,this)};g.Qa=function(a,b,c){a=kf(this.f,b);if(-1===a){if(this.l<qf){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new Ba(this.s,this.l+1,e,null)}return ub(hb(De(rf,this),b,c),this.s)}if(c===this.f[a+1])return this;b=Sa(this.f);b[a+1]=c;return new Ba(this.s,this.l,b,null)};
g.Db=function(a,b){return-1!==kf(this.f,b)};g.S=function(){var a=this.f;return 0<=a.length-2?new mf(a,0,null):null};g.R=function(a,b){return new Ba(b,this.l,this.f,this.u)};g.T=function(a,b){if(kd(b))return hb(this,G.b(b,0),G.b(b,1));for(var c=this,d=K(b);;){if(null==d)return c;var e=L(d);if(kd(e))c=hb(c,G.b(e,0),G.b(e,1)),d=M(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};var ge=new Ba(null,0,[],Ec),qf=8;Ba.prototype[Qa]=function(){return xc(this)};
sf;function lf(a,b,c){this.bb=a;this.Wa=b;this.f=c;this.i=258;this.B=56}g=lf.prototype;g.Z=function(){if(w(this.bb))return Ed(this.Wa);throw Error("count after persistent!");};g.K=function(a,b){return fb.c(this,b,null)};g.H=function(a,b,c){if(w(this.bb))return a=kf(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
g.Sa=function(a,b){if(w(this.bb)){if(null!=b?b.i&2048||b.bc||(b.i?0:B(jb,b)):B(jb,b))return Lb(this,Kd.a?Kd.a(b):Kd.call(null,b),Ld.a?Ld.a(b):Ld.call(null,b));for(var c=K(b),d=this;;){var e=L(c);if(w(e))c=M(c),d=Lb(d,Kd.a?Kd.a(e):Kd.call(null,e),Ld.a?Ld.a(e):Ld.call(null,e));else return d}}else throw Error("conj! after persistent!");};g.ab=function(){if(w(this.bb))return this.bb=!1,new Ba(null,Ed(this.Wa),this.f,null);throw Error("persistent! called twice");};
g.pb=function(a,b,c){if(w(this.bb)){a=kf(this.f,b);if(-1===a){if(this.Wa+2<=2*qf)return this.Wa+=2,this.f.push(b),this.f.push(c),this;a=sf.b?sf.b(this.Wa,this.f):sf.call(null,this.Wa,this.f);return Lb(a,b,c)}c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};tf;bd;function sf(a,b){for(var c=Ib(rf),d=0;;)if(d<a)c=Lb(c,b[d],b[d+1]),d+=2;else return c}function uf(){this.N=!1}vf;wf;qe;xf;W;N;
function yf(a,b){return a===b?!0:a===b||a instanceof z&&b instanceof z&&a.Ga===b.Ga?!0:gc.b(a,b)}function zf(a,b,c){a=Sa(a);a[b]=c;return a}function Af(a,b,c,d){a=a.Ua(b);a.f[c]=d;return a}Bf;function Cf(a,b,c,d){this.f=a;this.j=b;this.ub=c;this.Ea=d}Cf.prototype.advance=function(){for(var a=this.f.length;;)if(this.j<a){var b=this.f[this.j],c=this.f[this.j+1];null!=b?b=this.ub=new T(null,2,5,V,[b,c],null):null!=c?(b=Xb(c),b=b.ra()?this.Ea=b:!1):b=!1;this.j+=2;if(b)return!0}else return!1};
Cf.prototype.ra=function(){var a=null!=this.ub;return a?a:(a=null!=this.Ea)?a:this.advance()};Cf.prototype.next=function(){if(null!=this.ub){var a=this.ub;this.ub=null;return a}if(null!=this.Ea)return a=this.Ea.next(),this.Ea.ra()||(this.Ea=null),a;if(this.advance())return this.next();throw Error("No such element");};Cf.prototype.remove=function(){return Error("Unsupported operation")};function Df(a,b,c){this.M=a;this.$=b;this.f=c}g=Df.prototype;
g.Ua=function(a){if(a===this.M)return this;var b=Fd(this.$),c=Array(0>b?4:2*(b+1));pd(this.f,0,c,0,2*b);return new Df(a,this.$,c)};g.sb=function(){return vf.a?vf.a(this.f):vf.call(null,this.f)};g.Oa=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.$&e))return d;var f=Fd(this.$&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.Oa(a+5,b,c,d):yf(c,e)?f:d};
g.Da=function(a,b,c,d,e,f){var h=1<<(c>>>b&31),k=Fd(this.$&h-1);if(0===(this.$&h)){var l=Fd(this.$);if(2*l<this.f.length){a=this.Ua(a);b=a.f;f.N=!0;a:for(c=2*(l-k),f=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*k]=d;b[2*k+1]=e;a.$|=h;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=Ef.Da(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.$>>>d&1)&&(k[d]=null!=this.f[e]?Ef.Da(a,b+5,mc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new Bf(a,l+1,k)}b=Array(2*(l+4));pd(this.f,0,b,0,2*k);b[2*k]=d;b[2*k+1]=e;pd(this.f,2*k,b,2*(k+1),2*(l-k));f.N=!0;a=this.Ua(a);a.f=b;a.$|=h;return a}l=this.f[2*k];h=this.f[2*k+1];if(null==l)return l=h.Da(a,b+5,c,d,e,f),l===h?this:Af(this,a,2*k+1,l);if(yf(d,l))return e===h?this:Af(this,a,2*k+1,e);f.N=!0;f=b+5;d=xf.X?xf.X(a,f,l,h,c,d,e):xf.call(null,a,f,l,h,c,d,e);e=2*k;
k=2*k+1;a=this.Ua(a);a.f[e]=null;a.f[k]=d;return a};
g.Ca=function(a,b,c,d,e){var f=1<<(b>>>a&31),h=Fd(this.$&f-1);if(0===(this.$&f)){var k=Fd(this.$);if(16<=k){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[b>>>a&31]=Ef.Ca(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.$>>>c&1)&&(h[c]=null!=this.f[d]?Ef.Ca(a+5,mc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new Bf(null,k+1,h)}a=Array(2*(k+1));pd(this.f,
0,a,0,2*h);a[2*h]=c;a[2*h+1]=d;pd(this.f,2*h,a,2*(h+1),2*(k-h));e.N=!0;return new Df(null,this.$|f,a)}var l=this.f[2*h],f=this.f[2*h+1];if(null==l)return k=f.Ca(a+5,b,c,d,e),k===f?this:new Df(null,this.$,zf(this.f,2*h+1,k));if(yf(c,l))return d===f?this:new Df(null,this.$,zf(this.f,2*h+1,d));e.N=!0;e=this.$;k=this.f;a+=5;a=xf.W?xf.W(a,l,f,b,c,d):xf.call(null,a,l,f,b,c,d);c=2*h;h=2*h+1;d=Sa(k);d[c]=null;d[h]=a;return new Df(null,e,d)};g.Fa=function(){return new Cf(this.f,0,null,null)};
var Ef=new Df(null,0,[]);function Ff(a,b,c){this.f=a;this.j=b;this.Ea=c}Ff.prototype.ra=function(){for(var a=this.f.length;;){if(null!=this.Ea&&this.Ea.ra())return!0;if(this.j<a){var b=this.f[this.j];this.j+=1;null!=b&&(this.Ea=Xb(b))}else return!1}};Ff.prototype.next=function(){if(this.ra())return this.Ea.next();throw Error("No such element");};Ff.prototype.remove=function(){return Error("Unsupported operation")};function Bf(a,b,c){this.M=a;this.l=b;this.f=c}g=Bf.prototype;
g.Ua=function(a){return a===this.M?this:new Bf(a,this.l,Sa(this.f))};g.sb=function(){return wf.a?wf.a(this.f):wf.call(null,this.f)};g.Oa=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.Oa(a+5,b,c,d):d};g.Da=function(a,b,c,d,e,f){var h=c>>>b&31,k=this.f[h];if(null==k)return a=Af(this,a,h,Ef.Da(a,b+5,c,d,e,f)),a.l+=1,a;b=k.Da(a,b+5,c,d,e,f);return b===k?this:Af(this,a,h,b)};
g.Ca=function(a,b,c,d,e){var f=b>>>a&31,h=this.f[f];if(null==h)return new Bf(null,this.l+1,zf(this.f,f,Ef.Ca(a+5,b,c,d,e)));a=h.Ca(a+5,b,c,d,e);return a===h?this:new Bf(null,this.l,zf(this.f,f,a))};g.Fa=function(){return new Ff(this.f,0,null)};function Gf(a,b,c){b*=2;for(var d=0;;)if(d<b){if(yf(c,a[d]))return d;d+=2}else return-1}function Hf(a,b,c,d){this.M=a;this.Na=b;this.l=c;this.f=d}g=Hf.prototype;
g.Ua=function(a){if(a===this.M)return this;var b=Array(2*(this.l+1));pd(this.f,0,b,0,2*this.l);return new Hf(a,this.Na,this.l,b)};g.sb=function(){return vf.a?vf.a(this.f):vf.call(null,this.f)};g.Oa=function(a,b,c,d){a=Gf(this.f,this.l,c);return 0>a?d:yf(c,this.f[a])?this.f[a+1]:d};
g.Da=function(a,b,c,d,e,f){if(c===this.Na){b=Gf(this.f,this.l,d);if(-1===b){if(this.f.length>2*this.l)return b=2*this.l,c=2*this.l+1,a=this.Ua(a),a.f[b]=d,a.f[c]=e,f.N=!0,a.l+=1,a;c=this.f.length;b=Array(c+2);pd(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.N=!0;d=this.l+1;a===this.M?(this.f=b,this.l=d,a=this):a=new Hf(this.M,this.Na,d,b);return a}return this.f[b+1]===e?this:Af(this,a,b+1,e)}return(new Df(a,1<<(this.Na>>>b&31),[null,this,null,null])).Da(a,b,c,d,e,f)};
g.Ca=function(a,b,c,d,e){return b===this.Na?(a=Gf(this.f,this.l,c),-1===a?(a=2*this.l,b=Array(a+2),pd(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.N=!0,new Hf(null,this.Na,this.l+1,b)):gc.b(this.f[a],d)?this:new Hf(null,this.Na,this.l,zf(this.f,a+1,d))):(new Df(null,1<<(this.Na>>>a&31),[null,this])).Ca(a,b,c,d,e)};g.Fa=function(){return new Cf(this.f,0,null,null)};
var xf=function xf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return xf.W(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return xf.X(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
xf.W=function(a,b,c,d,e,f){var h=mc(b);if(h===d)return new Hf(null,h,2,[b,c,e,f]);var k=new uf;return Ef.Ca(a,h,b,c,k).Ca(a,d,e,f,k)};xf.X=function(a,b,c,d,e,f,h){var k=mc(c);if(k===e)return new Hf(null,k,2,[c,d,f,h]);var l=new uf;return Ef.Da(a,b,k,c,d,l).Da(a,b,e,f,h,l)};xf.A=7;function If(a,b,c,d,e){this.s=a;this.Pa=b;this.j=c;this.C=d;this.u=e;this.i=32374860;this.B=0}g=If.prototype;g.toString=function(){return Zb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.s};
g.L=function(){var a=this.u;return null!=a?a:this.u=a=Bc(this)};g.v=function(a,b){return Gc(this,b)};g.V=function(){return Hc(vc,this.s)};g.aa=function(a,b){return Wc.b(b,this)};g.ba=function(a,b,c){return Wc.c(b,c,this)};g.Y=function(){return null==this.C?new T(null,2,5,V,[this.Pa[this.j],this.Pa[this.j+1]],null):L(this.C)};
g.qa=function(){if(null==this.C){var a=this.Pa,b=this.j+2;return vf.c?vf.c(a,b,null):vf.call(null,a,b,null)}var a=this.Pa,b=this.j,c=M(this.C);return vf.c?vf.c(a,b,c):vf.call(null,a,b,c)};g.S=function(){return this};g.R=function(a,b){return new If(b,this.Pa,this.j,this.C,this.u)};g.T=function(a,b){return O(b,this)};If.prototype[Qa]=function(){return xc(this)};
var vf=function vf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return vf.a(arguments[0]);case 3:return vf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};vf.a=function(a){return vf.c(a,0,null)};
vf.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new If(null,a,b,null,null);var d=a[b+1];if(w(d)&&(d=d.sb(),w(d)))return new If(null,a,b+2,d,null);b+=2}else return null;else return new If(null,a,b,c,null)};vf.A=3;function Jf(a,b,c,d,e){this.s=a;this.Pa=b;this.j=c;this.C=d;this.u=e;this.i=32374860;this.B=0}g=Jf.prototype;g.toString=function(){return Zb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.s};
g.L=function(){var a=this.u;return null!=a?a:this.u=a=Bc(this)};g.v=function(a,b){return Gc(this,b)};g.V=function(){return Hc(vc,this.s)};g.aa=function(a,b){return Wc.b(b,this)};g.ba=function(a,b,c){return Wc.c(b,c,this)};g.Y=function(){return L(this.C)};g.qa=function(){var a=this.Pa,b=this.j,c=M(this.C);return wf.o?wf.o(null,a,b,c):wf.call(null,null,a,b,c)};g.S=function(){return this};g.R=function(a,b){return new Jf(b,this.Pa,this.j,this.C,this.u)};g.T=function(a,b){return O(b,this)};
Jf.prototype[Qa]=function(){return xc(this)};var wf=function wf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return wf.a(arguments[0]);case 4:return wf.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};wf.a=function(a){return wf.o(null,a,0,null)};
wf.o=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(w(e)&&(e=e.sb(),w(e)))return new Jf(a,b,c+1,e,null);c+=1}else return null;else return new Jf(a,b,c,d,null)};wf.A=4;tf;function Kf(a,b,c){this.ya=a;this.Vb=b;this.Kb=c}Kf.prototype.ra=function(){return this.Kb&&this.Vb.ra()};Kf.prototype.next=function(){if(this.Kb)return this.Vb.next();this.Kb=!0;return this.ya};Kf.prototype.remove=function(){return Error("Unsupported operation")};
function bd(a,b,c,d,e,f){this.s=a;this.l=b;this.root=c;this.xa=d;this.ya=e;this.u=f;this.i=16123663;this.B=8196}g=bd.prototype;g.toString=function(){return Zb(this)};g.equiv=function(a){return this.v(null,a)};g.keys=function(){return xc(nf.a?nf.a(this):nf.call(null,this))};g.entries=function(){return hf(K(this))};g.values=function(){return xc(of.a?of.a(this):of.call(null,this))};g.has=function(a){return td(this,a)};g.get=function(a,b){return this.H(null,a,b)};
g.forEach=function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.U(null,e),h=Q(f,0),f=Q(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=K(b))nd(b)?(c=Qb(b),b=Rb(b),h=c,d=P(c),c=h):(c=L(b),h=Q(c,0),f=Q(c,1),a.b?a.b(f,h):a.call(null,f,h),b=M(b),c=null,d=0),e=0;else return null};g.K=function(a,b){return fb.c(this,b,null)};g.H=function(a,b,c){return null==b?this.xa?this.ya:c:null==this.root?c:this.root.Oa(0,mc(b),b,c)};
g.Fa=function(){var a=this.root?Xb(this.root):ce;return this.xa?new Kf(this.ya,a,!1):a};g.O=function(){return this.s};g.Z=function(){return this.l};g.L=function(){var a=this.u;return null!=a?a:this.u=a=Dc(this)};g.v=function(a,b){return ef(this,b)};g.Za=function(){return new tf({},this.root,this.l,this.xa,this.ya)};g.V=function(){return ub(rf,this.s)};
g.Qa=function(a,b,c){if(null==b)return this.xa&&c===this.ya?this:new bd(this.s,this.xa?this.l:this.l+1,this.root,!0,c,null);a=new uf;b=(null==this.root?Ef:this.root).Ca(0,mc(b),b,c,a);return b===this.root?this:new bd(this.s,a.N?this.l+1:this.l,b,this.xa,this.ya,null)};g.Db=function(a,b){return null==b?this.xa:null==this.root?!1:this.root.Oa(0,mc(b),b,qd)!==qd};g.S=function(){if(0<this.l){var a=null!=this.root?this.root.sb():null;return this.xa?O(new T(null,2,5,V,[null,this.ya],null),a):a}return null};
g.R=function(a,b){return new bd(b,this.l,this.root,this.xa,this.ya,this.u)};g.T=function(a,b){if(kd(b))return hb(this,G.b(b,0),G.b(b,1));for(var c=this,d=K(b);;){if(null==d)return c;var e=L(d);if(kd(e))c=hb(c,G.b(e,0),G.b(e,1)),d=M(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};var rf=new bd(null,0,null,!1,null,Ec);
function dd(a,b){for(var c=a.length,d=0,e=Ib(rf);;)if(d<c)var f=d+1,e=e.pb(null,a[d],b[d]),d=f;else return Kb(e)}bd.prototype[Qa]=function(){return xc(this)};function tf(a,b,c,d,e){this.M=a;this.root=b;this.count=c;this.xa=d;this.ya=e;this.i=258;this.B=56}function Lf(a,b,c){if(a.M){if(null==b)a.ya!==c&&(a.ya=c),a.xa||(a.count+=1,a.xa=!0);else{var d=new uf;b=(null==a.root?Ef:a.root).Da(a.M,0,mc(b),b,c,d);b!==a.root&&(a.root=b);d.N&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}g=tf.prototype;
g.Z=function(){if(this.M)return this.count;throw Error("count after persistent!");};g.K=function(a,b){return null==b?this.xa?this.ya:null:null==this.root?null:this.root.Oa(0,mc(b),b)};g.H=function(a,b,c){return null==b?this.xa?this.ya:c:null==this.root?c:this.root.Oa(0,mc(b),b,c)};
g.Sa=function(a,b){var c;a:if(this.M)if(null!=b?b.i&2048||b.bc||(b.i?0:B(jb,b)):B(jb,b))c=Lf(this,Kd.a?Kd.a(b):Kd.call(null,b),Ld.a?Ld.a(b):Ld.call(null,b));else{c=K(b);for(var d=this;;){var e=L(c);if(w(e))c=M(c),d=Lf(d,Kd.a?Kd.a(e):Kd.call(null,e),Ld.a?Ld.a(e):Ld.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};g.ab=function(){var a;if(this.M)this.M=null,a=new bd(null,this.count,this.root,this.xa,this.ya,null);else throw Error("persistent! called twice");return a};
g.pb=function(a,b,c){return Lf(this,b,c)};Mf;Nf;function Nf(a,b,c,d,e){this.key=a;this.N=b;this.left=c;this.right=d;this.u=e;this.i=32402207;this.B=0}g=Nf.prototype;g.replace=function(a,b,c,d){return new Nf(a,b,c,d,null)};g.K=function(a,b){return G.c(this,b,null)};g.H=function(a,b,c){return G.c(this,b,c)};g.U=function(a,b){return 0===b?this.key:1===b?this.N:null};g.wa=function(a,b,c){return 0===b?this.key:1===b?this.N:c};
g.Ta=function(a,b,c){return(new T(null,2,5,V,[this.key,this.N],null)).Ta(null,b,c)};g.O=function(){return null};g.Z=function(){return 2};g.lb=function(){return this.key};g.mb=function(){return this.N};g.L=function(){var a=this.u;return null!=a?a:this.u=a=Bc(this)};g.v=function(a,b){return Gc(this,b)};g.V=function(){return Zc};g.aa=function(a,b){return Lc(this,b)};g.ba=function(a,b,c){return Mc(this,b,c)};g.Qa=function(a,b,c){return cd.c(new T(null,2,5,V,[this.key,this.N],null),b,c)};
g.S=function(){return Ya(Ya(vc,this.N),this.key)};g.R=function(a,b){return Hc(new T(null,2,5,V,[this.key,this.N],null),b)};g.T=function(a,b){return new T(null,3,5,V,[this.key,this.N,b],null)};g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();
g.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};Nf.prototype[Qa]=function(){return xc(this)};function Mf(a,b,c,d,e){this.key=a;this.N=b;this.left=c;this.right=d;this.u=e;this.i=32402207;this.B=0}g=Mf.prototype;g.replace=function(a,b,c,d){return new Mf(a,b,c,d,null)};g.K=function(a,b){return G.c(this,b,null)};g.H=function(a,b,c){return G.c(this,b,c)};
g.U=function(a,b){return 0===b?this.key:1===b?this.N:null};g.wa=function(a,b,c){return 0===b?this.key:1===b?this.N:c};g.Ta=function(a,b,c){return(new T(null,2,5,V,[this.key,this.N],null)).Ta(null,b,c)};g.O=function(){return null};g.Z=function(){return 2};g.lb=function(){return this.key};g.mb=function(){return this.N};g.L=function(){var a=this.u;return null!=a?a:this.u=a=Bc(this)};g.v=function(a,b){return Gc(this,b)};g.V=function(){return Zc};g.aa=function(a,b){return Lc(this,b)};
g.ba=function(a,b,c){return Mc(this,b,c)};g.Qa=function(a,b,c){return cd.c(new T(null,2,5,V,[this.key,this.N],null),b,c)};g.S=function(){return Ya(Ya(vc,this.N),this.key)};g.R=function(a,b){return Hc(new T(null,2,5,V,[this.key,this.N],null),b)};g.T=function(a,b){return new T(null,3,5,V,[this.key,this.N,b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};Mf.prototype[Qa]=function(){return xc(this)};Kd;
var Fc=function Fc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Fc.m(0<c.length?new tc(c.slice(0),0):null)};Fc.m=function(a){for(var b=K(a),c=Ib(rf);;)if(b){a=M(M(b));var d=L(b),b=L(M(b)),c=Lb(c,d,b),b=a}else return Kb(c)};Fc.A=0;Fc.F=function(a){return Fc.m(K(a))};function Of(a,b){this.G=a;this.va=b;this.i=32374988;this.B=0}g=Of.prototype;g.toString=function(){return Zb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.va};
g.ta=function(){var a=(null!=this.G?this.G.i&128||this.G.yb||(this.G.i?0:B(db,this.G)):B(db,this.G))?this.G.ta(null):M(this.G);return null==a?null:new Of(a,this.va)};g.L=function(){return Bc(this)};g.v=function(a,b){return Gc(this,b)};g.V=function(){return Hc(vc,this.va)};g.aa=function(a,b){return Wc.b(b,this)};g.ba=function(a,b,c){return Wc.c(b,c,this)};g.Y=function(){return this.G.Y(null).lb(null)};
g.qa=function(){var a=(null!=this.G?this.G.i&128||this.G.yb||(this.G.i?0:B(db,this.G)):B(db,this.G))?this.G.ta(null):M(this.G);return null!=a?new Of(a,this.va):vc};g.S=function(){return this};g.R=function(a,b){return new Of(this.G,b)};g.T=function(a,b){return O(b,this)};Of.prototype[Qa]=function(){return xc(this)};function nf(a){return(a=K(a))?new Of(a,null):null}function Kd(a){return kb(a)}function Pf(a,b){this.G=a;this.va=b;this.i=32374988;this.B=0}g=Pf.prototype;g.toString=function(){return Zb(this)};
g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.va};g.ta=function(){var a=(null!=this.G?this.G.i&128||this.G.yb||(this.G.i?0:B(db,this.G)):B(db,this.G))?this.G.ta(null):M(this.G);return null==a?null:new Pf(a,this.va)};g.L=function(){return Bc(this)};g.v=function(a,b){return Gc(this,b)};g.V=function(){return Hc(vc,this.va)};g.aa=function(a,b){return Wc.b(b,this)};g.ba=function(a,b,c){return Wc.c(b,c,this)};g.Y=function(){return this.G.Y(null).mb(null)};
g.qa=function(){var a=(null!=this.G?this.G.i&128||this.G.yb||(this.G.i?0:B(db,this.G)):B(db,this.G))?this.G.ta(null):M(this.G);return null!=a?new Pf(a,this.va):vc};g.S=function(){return this};g.R=function(a,b){return new Pf(this.G,b)};g.T=function(a,b){return O(b,this)};Pf.prototype[Qa]=function(){return xc(this)};function of(a){return(a=K(a))?new Pf(a,null):null}function Ld(a){return lb(a)}
var Qf=function Qf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Qf.m(0<c.length?new tc(c.slice(0),0):null)};Qf.m=function(a){return w(je(a))?Ta.b(function(a,c){return Yc.b(w(a)?a:ge,c)},a):null};Qf.A=0;Qf.F=function(a){return Qf.m(K(a))};Rf;function Sf(a){this.fb=a}Sf.prototype.ra=function(){return this.fb.ra()};Sf.prototype.next=function(){if(this.fb.ra())return this.fb.next().I[0];throw Error("No such element");};Sf.prototype.remove=function(){return Error("Unsupported operation")};
function Tf(a,b,c){this.s=a;this.Va=b;this.u=c;this.i=15077647;this.B=8196}g=Tf.prototype;g.toString=function(){return Zb(this)};g.equiv=function(a){return this.v(null,a)};g.keys=function(){return xc(K(this))};g.entries=function(){var a=K(this);return new jf(K(a))};g.values=function(){return xc(K(this))};g.has=function(a){return td(this,a)};
g.forEach=function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.U(null,e),h=Q(f,0),f=Q(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=K(b))nd(b)?(c=Qb(b),b=Rb(b),h=c,d=P(c),c=h):(c=L(b),h=Q(c,0),f=Q(c,1),a.b?a.b(f,h):a.call(null,f,h),b=M(b),c=null,d=0),e=0;else return null};g.K=function(a,b){return fb.c(this,b,null)};g.H=function(a,b,c){return gb(this.Va,b)?b:c};g.Fa=function(){return new Sf(Xb(this.Va))};g.O=function(){return this.s};g.Z=function(){return Va(this.Va)};
g.L=function(){var a=this.u;return null!=a?a:this.u=a=Dc(this)};g.v=function(a,b){return hd(b)&&P(this)===P(b)&&ie(function(a){return function(b){return td(a,b)}}(this),b)};g.Za=function(){return new Rf(Ib(this.Va))};g.V=function(){return Hc(Uf,this.s)};g.S=function(){return nf(this.Va)};g.R=function(a,b){return new Tf(b,this.Va,this.u)};g.T=function(a,b){return new Tf(this.s,cd.c(this.Va,b,null),null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};var Uf=new Tf(null,ge,Ec);Tf.prototype[Qa]=function(){return xc(this)};
function Rf(a){this.La=a;this.B=136;this.i=259}g=Rf.prototype;g.Sa=function(a,b){this.La=Lb(this.La,b,null);return this};g.ab=function(){return new Tf(null,Kb(this.La),null)};g.Z=function(){return P(this.La)};g.K=function(a,b){return fb.c(this,b,null)};g.H=function(a,b,c){return fb.c(this.La,b,qd)===qd?c:b};
g.call=function(){function a(a,b,c){return fb.c(this.La,b,qd)===qd?c:b}function b(a,b){return fb.c(this.La,b,qd)===qd?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};g.a=function(a){return fb.c(this.La,a,qd)===qd?null:a};g.b=function(a,b){return fb.c(this.La,a,qd)===qd?b:a};
function Jd(a){if(null!=a&&(a.B&4096||a.dc))return a.nb(null);if("string"===typeof a)return a;throw Error([E("Doesn't support name: "),E(a)].join(""));}function Vf(a,b){if("string"===typeof b){var c=a.exec(b);return gc.b(L(c),b)?1===P(c)?L(c):xd(c):null}throw new TypeError("re-matches must match against a string.");}function Wf(a,b){if("string"===typeof b){var c=a.exec(b);return null==c?null:1===P(c)?L(c):xd(c)}throw new TypeError("re-find must match against a string.");}
var Xf=function Xf(b,c){var d=Wf(b,c),e=c.search(b),f=gd(d)?L(d):d,h=Hd(c,e+P(f));return w(d)?new Sd(null,function(c,d,e,f){return function(){return O(c,K(f)?Xf(b,f):null)}}(d,e,f,h),null,null):null};function Yf(a){if(a instanceof RegExp)return a;var b=Wf(/^\(\?([idmsux]*)\)/,a),c=Q(b,0),b=Q(b,1);a=Hd(a,P(c));return new RegExp(a,w(b)?b:"")}
function Re(a,b,c,d,e,f,h){var k=ya;ya=null==ya?null:ya-1;try{if(null!=ya&&0>ya)return Db(a,"#");Db(a,c);if(0===Ha.a(f))K(h)&&Db(a,function(){var a=Zf.a(f);return w(a)?a:"..."}());else{if(K(h)){var l=L(h);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var m=M(h),n=Ha.a(f)-1;;)if(!m||null!=n&&0===n){K(m)&&0===n&&(Db(a,d),Db(a,function(){var a=Zf.a(f);return w(a)?a:"..."}()));break}else{Db(a,d);var p=L(m);c=a;h=f;b.c?b.c(p,c,h):b.call(null,p,c,h);var q=M(m);c=n-1;m=q;n=c}}return Db(a,e)}finally{ya=k}}
function $f(a,b){for(var c=K(b),d=null,e=0,f=0;;)if(f<e){var h=d.U(null,f);Db(a,h);f+=1}else if(c=K(c))d=c,nd(d)?(c=Qb(d),e=Rb(d),d=c,h=P(c),c=e,e=h):(h=L(d),Db(a,h),c=M(d),d=null,e=0),f=0;else return null}var ag={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function bg(a){return[E('"'),E(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return ag[a]})),E('"')].join("")}cg;
function dg(a,b){var c=sd(pc.b(a,Ea));return c?(c=null!=b?b.i&131072||b.cc?!0:!1:!1)?null!=fd(b):c:c}
function eg(a,b,c){if(null==a)return Db(b,"nil");if(dg(c,a)){Db(b,"^");var d=fd(a);Se.c?Se.c(d,b,c):Se.call(null,d,b,c);Db(b," ")}if(a.Ib)return a.Sb(a,b,c);if(null!=a&&(a.i&2147483648||a.P))return a.J(null,b,c);if(!0===a||!1===a||"number"===typeof a)return Db(b,""+E(a));if(null!=a&&a.constructor===Object)return Db(b,"#js "),d=Id.b(function(b){return new T(null,2,5,V,[Rd.a(b),a[b]],null)},od(a)),cg.o?cg.o(d,Se,b,c):cg.call(null,d,Se,b,c);if(Na(a))return Re(b,Se,"#js ["," ","]",c,a);if("string"==typeof a)return w(Da.a(c))?
Db(b,bg(a)):Db(b,a);if(ba(a)){var e=a.name;c=w(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return $f(b,I(["#object[",c,' "',""+E(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+E(a);;)if(P(c)<b)c=[E("0"),E(c)].join("");else return c},$f(b,I(['#inst "',""+E(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),3),"-",'00:00"'],
0));if(a instanceof RegExp)return $f(b,I(['#"',a.source,'"'],0));if(null!=a&&(a.i&2147483648||a.P))return Eb(a,b,c);if(w(a.constructor.qb))return $f(b,I(["#object[",a.constructor.qb.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=w(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return $f(b,I(["#object[",c," ",""+E(a),"]"],0))}function Se(a,b,c){var d=fg.a(c);return w(d)?(c=cd.c(c,gg,eg),d.c?d.c(a,b,c):d.call(null,a,b,c)):eg(a,b,c)}
var pe=function pe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return pe.m(0<c.length?new tc(c.slice(0),0):null)};pe.m=function(a){var b=Aa();if(null==a||Oa(K(a)))b="";else{var c=E,d=new la;a:{var e=new Yb(d);Se(L(a),e,b);a=K(M(a));for(var f=null,h=0,k=0;;)if(k<h){var l=f.U(null,k);Db(e," ");Se(l,e,b);k+=1}else if(a=K(a))f=a,nd(f)?(a=Qb(f),h=Rb(f),f=a,l=P(a),a=h,h=l):(l=L(f),Db(e," "),Se(l,e,b),a=M(f),f=null,h=0),k=0;else break a}b=""+c(d)}return b};pe.A=0;
pe.F=function(a){return pe.m(K(a))};function cg(a,b,c,d){return Re(c,function(a,c,d){var k=kb(a);b.c?b.c(k,c,d):b.call(null,k,c,d);Db(c," ");a=lb(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,K(a))}ue.prototype.P=!0;ue.prototype.J=function(a,b,c){Db(b,"#object [cljs.core.Volatile ");Se(new Ba(null,1,[hg,this.state],null),b,c);return Db(b,"]")};tc.prototype.P=!0;tc.prototype.J=function(a,b,c){return Re(b,Se,"("," ",")",c,this)};Sd.prototype.P=!0;
Sd.prototype.J=function(a,b,c){return Re(b,Se,"("," ",")",c,this)};If.prototype.P=!0;If.prototype.J=function(a,b,c){return Re(b,Se,"("," ",")",c,this)};Nf.prototype.P=!0;Nf.prototype.J=function(a,b,c){return Re(b,Se,"["," ","]",c,this)};mf.prototype.P=!0;mf.prototype.J=function(a,b,c){return Re(b,Se,"("," ",")",c,this)};zc.prototype.P=!0;zc.prototype.J=function(a,b,c){return Re(b,Se,"("," ",")",c,this)};md.prototype.P=!0;md.prototype.J=function(a,b,c){return Re(b,Se,"("," ",")",c,this)};
Pd.prototype.P=!0;Pd.prototype.J=function(a,b,c){return Re(b,Se,"("," ",")",c,this)};Rc.prototype.P=!0;Rc.prototype.J=function(a,b,c){return Re(b,Se,"("," ",")",c,this)};bd.prototype.P=!0;bd.prototype.J=function(a,b,c){return cg(this,Se,b,c)};Jf.prototype.P=!0;Jf.prototype.J=function(a,b,c){return Re(b,Se,"("," ",")",c,this)};We.prototype.P=!0;We.prototype.J=function(a,b,c){return Re(b,Se,"["," ","]",c,this)};Tf.prototype.P=!0;Tf.prototype.J=function(a,b,c){return Re(b,Se,"#{"," ","}",c,this)};
ld.prototype.P=!0;ld.prototype.J=function(a,b,c){return Re(b,Se,"("," ",")",c,this)};ne.prototype.P=!0;ne.prototype.J=function(a,b,c){Db(b,"#object [cljs.core.Atom ");Se(new Ba(null,1,[hg,this.state],null),b,c);return Db(b,"]")};Pf.prototype.P=!0;Pf.prototype.J=function(a,b,c){return Re(b,Se,"("," ",")",c,this)};Mf.prototype.P=!0;Mf.prototype.J=function(a,b,c){return Re(b,Se,"["," ","]",c,this)};T.prototype.P=!0;T.prototype.J=function(a,b,c){return Re(b,Se,"["," ","]",c,this)};$e.prototype.P=!0;
$e.prototype.J=function(a,b,c){return Re(b,Se,"("," ",")",c,this)};Od.prototype.P=!0;Od.prototype.J=function(a,b){return Db(b,"()")};he.prototype.P=!0;he.prototype.J=function(a,b,c){return Re(b,Se,"("," ",")",c,this)};af.prototype.P=!0;af.prototype.J=function(a,b,c){return Re(b,Se,"#queue ["," ","]",c,K(this))};Ba.prototype.P=!0;Ba.prototype.J=function(a,b,c){return cg(this,Se,b,c)};Of.prototype.P=!0;Of.prototype.J=function(a,b,c){return Re(b,Se,"("," ",")",c,this)};Sc.prototype.P=!0;
Sc.prototype.J=function(a,b,c){return Re(b,Se,"("," ",")",c,this)};H.prototype.jb=!0;H.prototype.Ra=function(a,b){if(b instanceof H)return oc(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};z.prototype.jb=!0;z.prototype.Ra=function(a,b){if(b instanceof z)return Qd(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};We.prototype.jb=!0;
We.prototype.Ra=function(a,b){if(kd(b))return vd(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};T.prototype.jb=!0;T.prototype.Ra=function(a,b){if(kd(b))return vd(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};function ig(a){return function(b,c){var d=a.b?a.b(b,c):a.call(null,b,c);return Kc(d)?new Jc(d):d}}
function Ae(a){return function(b){return function(){function c(a,c){return Ta.c(b,a,c)}function d(b){return a.a?a.a(b):a.call(null,b)}function e(){return a.w?a.w():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.w=e;f.a=d;f.b=c;return f}()}(ig(a))}jg;function kg(){}
var lg=function lg(b){if(null!=b&&null!=b.Zb)return b.Zb(b);var c=lg[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=lg._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IEncodeJS.-clj-\x3ejs",b);};mg;function ng(a){return(null!=a?a.Yb||(a.lc?0:B(kg,a)):B(kg,a))?lg(a):"string"===typeof a||"number"===typeof a||a instanceof z||a instanceof H?mg.a?mg.a(a):mg.call(null,a):pe.m(I([a],0))}
var mg=function mg(b){if(null==b)return null;if(null!=b?b.Yb||(b.lc?0:B(kg,b)):B(kg,b))return lg(b);if(b instanceof z)return Jd(b);if(b instanceof H)return""+E(b);if(jd(b)){var c={};b=K(b);for(var d=null,e=0,f=0;;)if(f<e){var h=d.U(null,f),k=Q(h,0),h=Q(h,1);c[ng(k)]=mg(h);f+=1}else if(b=K(b))nd(b)?(e=Qb(b),b=Rb(b),d=e,e=P(e)):(e=L(b),d=Q(e,0),e=Q(e,1),c[ng(d)]=mg(e),b=M(b),d=null,e=0),f=0;else break;return c}if(gd(b)){c=[];b=K(Id.b(mg,b));d=null;for(f=e=0;;)if(f<e)k=d.U(null,f),c.push(k),f+=1;else if(b=
K(b))d=b,nd(d)?(b=Qb(d),f=Rb(d),d=b,e=P(b),b=f):(b=L(d),c.push(b),b=M(d),d=null,e=0),f=0;else break;return c}return b},jg=function jg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return jg.w();case 1:return jg.a(arguments[0]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};jg.w=function(){return jg.a(1)};jg.a=function(a){return Math.random()*a};jg.A=1;var og=null;
function pg(){if(null==og){var a=new Ba(null,3,[qg,ge,rg,ge,sg,ge],null);og=W.a?W.a(a):W.call(null,a)}return og}function tg(a,b,c){var d=gc.b(b,c);if(!d&&!(d=td(sg.a(a).call(null,b),c))&&(d=kd(c))&&(d=kd(b)))if(d=P(c)===P(b))for(var d=!0,e=0;;)if(d&&e!==P(c))d=tg(a,b.a?b.a(e):b.call(null,e),c.a?c.a(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function ug(a){var b;b=pg();b=N.a?N.a(b):N.call(null,b);a=pc.b(qg.a(b),a);return K(a)?a:null}
function vg(a,b,c,d){te.b(a,function(){return N.a?N.a(b):N.call(null,b)});te.b(c,function(){return N.a?N.a(d):N.call(null,d)})}var wg=function wg(b,c,d){var e=(N.a?N.a(d):N.call(null,d)).call(null,b),e=w(w(e)?e.a?e.a(c):e.call(null,c):e)?!0:null;if(w(e))return e;e=function(){for(var e=ug(c);;)if(0<P(e))wg(b,L(e),d),e=uc(e);else return null}();if(w(e))return e;e=function(){for(var e=ug(b);;)if(0<P(e))wg(L(e),c,d),e=uc(e);else return null}();return w(e)?e:!1};
function xg(a,b,c){c=wg(a,b,c);if(w(c))a=c;else{c=tg;var d;d=pg();d=N.a?N.a(d):N.call(null,d);a=c(d,a,b)}return a}
var yg=function yg(b,c,d,e,f,h,k){var l=Ta.c(function(e,h){var k=Q(h,0);Q(h,1);if(tg(N.a?N.a(d):N.call(null,d),c,k)){var l;l=(l=null==e)?l:xg(k,L(e),f);l=w(l)?h:e;if(!w(xg(L(l),k,f)))throw Error([E("Multiple methods in multimethod '"),E(b),E("' match dispatch value: "),E(c),E(" -\x3e "),E(k),E(" and "),E(L(l)),E(", and neither is preferred")].join(""));return l}return e},null,N.a?N.a(e):N.call(null,e));if(w(l)){if(gc.b(N.a?N.a(k):N.call(null,k),N.a?N.a(d):N.call(null,d)))return te.o(h,cd,c,L(M(l))),
L(M(l));vg(h,e,k,d);return yg(b,c,d,e,f,h,k)}return null};function X(a,b){throw Error([E("No method in multimethod '"),E(a),E("' for dispatch value: "),E(b)].join(""));}function zg(a,b,c,d,e,f,h,k){this.name=a;this.h=b;this.mc=c;this.rb=d;this.gb=e;this.sc=f;this.tb=h;this.ib=k;this.i=4194305;this.B=4352}g=zg.prototype;
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y,D,J,S){a=this;var ra=F.m(a.h,b,c,d,e,I([f,h,k,l,m,n,p,q,v,r,u,x,A,y,D,J,S],0)),jh=Z(this,ra);w(jh)||X(a.name,ra);return F.m(jh,b,c,d,e,I([f,h,k,l,m,n,p,q,v,r,u,x,A,y,D,J,S],0))}function b(a,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y,D,J){a=this;var S=a.h.na?a.h.na(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y,D,J):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y,D,J),ra=Z(this,S);w(ra)||X(a.name,S);return ra.na?ra.na(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,
x,A,y,D,J):ra.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y,D,J)}function c(a,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y,D){a=this;var J=a.h.ma?a.h.ma(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y,D):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y,D),S=Z(this,J);w(S)||X(a.name,J);return S.ma?S.ma(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y,D):S.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y,D)}function d(a,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y){a=this;var D=a.h.la?a.h.la(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y):a.h.call(null,
b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y),J=Z(this,D);w(J)||X(a.name,D);return J.la?J.la(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y):J.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y)}function e(a,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A){a=this;var y=a.h.ka?a.h.ka(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A),D=Z(this,y);w(D)||X(a.name,y);return D.ka?D.ka(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A):D.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A)}function f(a,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,
x){a=this;var A=a.h.ja?a.h.ja(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x),y=Z(this,A);w(y)||X(a.name,A);return y.ja?y.ja(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x):y.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x)}function h(a,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u){a=this;var x=a.h.ia?a.h.ia(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u),A=Z(this,x);w(A)||X(a.name,x);return A.ia?A.ia(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u):A.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u)}
function k(a,b,c,d,e,f,h,k,l,m,n,p,q,v,r){a=this;var u=a.h.ha?a.h.ha(b,c,d,e,f,h,k,l,m,n,p,q,v,r):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r),x=Z(this,u);w(x)||X(a.name,u);return x.ha?x.ha(b,c,d,e,f,h,k,l,m,n,p,q,v,r):x.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r)}function l(a,b,c,d,e,f,h,k,l,m,n,p,q,v){a=this;var r=a.h.ga?a.h.ga(b,c,d,e,f,h,k,l,m,n,p,q,v):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v),u=Z(this,r);w(u)||X(a.name,r);return u.ga?u.ga(b,c,d,e,f,h,k,l,m,n,p,q,v):u.call(null,b,c,d,e,f,h,k,l,m,n,p,
q,v)}function m(a,b,c,d,e,f,h,k,l,m,n,p,q){a=this;var v=a.h.fa?a.h.fa(b,c,d,e,f,h,k,l,m,n,p,q):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q),r=Z(this,v);w(r)||X(a.name,v);return r.fa?r.fa(b,c,d,e,f,h,k,l,m,n,p,q):r.call(null,b,c,d,e,f,h,k,l,m,n,p,q)}function n(a,b,c,d,e,f,h,k,l,m,n,p){a=this;var q=a.h.ea?a.h.ea(b,c,d,e,f,h,k,l,m,n,p):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p),v=Z(this,q);w(v)||X(a.name,q);return v.ea?v.ea(b,c,d,e,f,h,k,l,m,n,p):v.call(null,b,c,d,e,f,h,k,l,m,n,p)}function p(a,b,c,d,e,f,h,k,l,m,
n){a=this;var p=a.h.da?a.h.da(b,c,d,e,f,h,k,l,m,n):a.h.call(null,b,c,d,e,f,h,k,l,m,n),q=Z(this,p);w(q)||X(a.name,p);return q.da?q.da(b,c,d,e,f,h,k,l,m,n):q.call(null,b,c,d,e,f,h,k,l,m,n)}function q(a,b,c,d,e,f,h,k,l,m){a=this;var n=a.h.pa?a.h.pa(b,c,d,e,f,h,k,l,m):a.h.call(null,b,c,d,e,f,h,k,l,m),p=Z(this,n);w(p)||X(a.name,n);return p.pa?p.pa(b,c,d,e,f,h,k,l,m):p.call(null,b,c,d,e,f,h,k,l,m)}function r(a,b,c,d,e,f,h,k,l){a=this;var m=a.h.oa?a.h.oa(b,c,d,e,f,h,k,l):a.h.call(null,b,c,d,e,f,h,k,l),n=
Z(this,m);w(n)||X(a.name,m);return n.oa?n.oa(b,c,d,e,f,h,k,l):n.call(null,b,c,d,e,f,h,k,l)}function u(a,b,c,d,e,f,h,k){a=this;var l=a.h.X?a.h.X(b,c,d,e,f,h,k):a.h.call(null,b,c,d,e,f,h,k),m=Z(this,l);w(m)||X(a.name,l);return m.X?m.X(b,c,d,e,f,h,k):m.call(null,b,c,d,e,f,h,k)}function x(a,b,c,d,e,f,h){a=this;var k=a.h.W?a.h.W(b,c,d,e,f,h):a.h.call(null,b,c,d,e,f,h),l=Z(this,k);w(l)||X(a.name,k);return l.W?l.W(b,c,d,e,f,h):l.call(null,b,c,d,e,f,h)}function v(a,b,c,d,e,f){a=this;var h=a.h.D?a.h.D(b,c,
d,e,f):a.h.call(null,b,c,d,e,f),k=Z(this,h);w(k)||X(a.name,h);return k.D?k.D(b,c,d,e,f):k.call(null,b,c,d,e,f)}function A(a,b,c,d,e){a=this;var f=a.h.o?a.h.o(b,c,d,e):a.h.call(null,b,c,d,e),h=Z(this,f);w(h)||X(a.name,f);return h.o?h.o(b,c,d,e):h.call(null,b,c,d,e)}function D(a,b,c,d){a=this;var e=a.h.c?a.h.c(b,c,d):a.h.call(null,b,c,d),f=Z(this,e);w(f)||X(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function J(a,b,c){a=this;var d=a.h.b?a.h.b(b,c):a.h.call(null,b,c),e=Z(this,d);w(e)||X(a.name,
d);return e.b?e.b(b,c):e.call(null,b,c)}function S(a,b){a=this;var c=a.h.a?a.h.a(b):a.h.call(null,b),d=Z(this,c);w(d)||X(a.name,c);return d.a?d.a(b):d.call(null,b)}function ra(a){a=this;var b=a.h.w?a.h.w():a.h.call(null),c=Z(this,b);w(c)||X(a.name,b);return c.w?c.w():c.call(null)}var y=null,y=function(y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,qc,ab,tb,Gb,ac,Ic,ud,ff){switch(arguments.length){case 1:return ra.call(this,y);case 2:return S.call(this,y,R);case 3:return J.call(this,y,R,U);case 4:return D.call(this,
y,R,U,Y);case 5:return A.call(this,y,R,U,Y,da);case 6:return v.call(this,y,R,U,Y,da,ga);case 7:return x.call(this,y,R,U,Y,da,ga,ka);case 8:return u.call(this,y,R,U,Y,da,ga,ka,na);case 9:return r.call(this,y,R,U,Y,da,ga,ka,na,pa);case 10:return q.call(this,y,R,U,Y,da,ga,ka,na,pa,qa);case 11:return p.call(this,y,R,U,Y,da,ga,ka,na,pa,qa,xa);case 12:return n.call(this,y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga);case 13:return m.call(this,y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja);case 14:return l.call(this,y,R,U,Y,da,
ga,ka,na,pa,qa,xa,Ga,Ja,Ra);case 15:return k.call(this,y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,qc);case 16:return h.call(this,y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,qc,ab);case 17:return f.call(this,y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,qc,ab,tb);case 18:return e.call(this,y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,qc,ab,tb,Gb);case 19:return d.call(this,y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,qc,ab,tb,Gb,ac);case 20:return c.call(this,y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,qc,ab,tb,Gb,ac,Ic);case 21:return b.call(this,
y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,qc,ab,tb,Gb,ac,Ic,ud);case 22:return a.call(this,y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,qc,ab,tb,Gb,ac,Ic,ud,ff)}throw Error("Invalid arity: "+arguments.length);};y.a=ra;y.b=S;y.c=J;y.o=D;y.D=A;y.W=v;y.X=x;y.oa=u;y.pa=r;y.da=q;y.ea=p;y.fa=n;y.ga=m;y.ha=l;y.ia=k;y.ja=h;y.ka=f;y.la=e;y.ma=d;y.na=c;y.Hb=b;y.kb=a;return y}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};
g.w=function(){var a=this.h.w?this.h.w():this.h.call(null),b=Z(this,a);w(b)||X(this.name,a);return b.w?b.w():b.call(null)};g.a=function(a){var b=this.h.a?this.h.a(a):this.h.call(null,a),c=Z(this,b);w(c)||X(this.name,b);return c.a?c.a(a):c.call(null,a)};g.b=function(a,b){var c=this.h.b?this.h.b(a,b):this.h.call(null,a,b),d=Z(this,c);w(d)||X(this.name,c);return d.b?d.b(a,b):d.call(null,a,b)};
g.c=function(a,b,c){var d=this.h.c?this.h.c(a,b,c):this.h.call(null,a,b,c),e=Z(this,d);w(e)||X(this.name,d);return e.c?e.c(a,b,c):e.call(null,a,b,c)};g.o=function(a,b,c,d){var e=this.h.o?this.h.o(a,b,c,d):this.h.call(null,a,b,c,d),f=Z(this,e);w(f)||X(this.name,e);return f.o?f.o(a,b,c,d):f.call(null,a,b,c,d)};g.D=function(a,b,c,d,e){var f=this.h.D?this.h.D(a,b,c,d,e):this.h.call(null,a,b,c,d,e),h=Z(this,f);w(h)||X(this.name,f);return h.D?h.D(a,b,c,d,e):h.call(null,a,b,c,d,e)};
g.W=function(a,b,c,d,e,f){var h=this.h.W?this.h.W(a,b,c,d,e,f):this.h.call(null,a,b,c,d,e,f),k=Z(this,h);w(k)||X(this.name,h);return k.W?k.W(a,b,c,d,e,f):k.call(null,a,b,c,d,e,f)};g.X=function(a,b,c,d,e,f,h){var k=this.h.X?this.h.X(a,b,c,d,e,f,h):this.h.call(null,a,b,c,d,e,f,h),l=Z(this,k);w(l)||X(this.name,k);return l.X?l.X(a,b,c,d,e,f,h):l.call(null,a,b,c,d,e,f,h)};
g.oa=function(a,b,c,d,e,f,h,k){var l=this.h.oa?this.h.oa(a,b,c,d,e,f,h,k):this.h.call(null,a,b,c,d,e,f,h,k),m=Z(this,l);w(m)||X(this.name,l);return m.oa?m.oa(a,b,c,d,e,f,h,k):m.call(null,a,b,c,d,e,f,h,k)};g.pa=function(a,b,c,d,e,f,h,k,l){var m=this.h.pa?this.h.pa(a,b,c,d,e,f,h,k,l):this.h.call(null,a,b,c,d,e,f,h,k,l),n=Z(this,m);w(n)||X(this.name,m);return n.pa?n.pa(a,b,c,d,e,f,h,k,l):n.call(null,a,b,c,d,e,f,h,k,l)};
g.da=function(a,b,c,d,e,f,h,k,l,m){var n=this.h.da?this.h.da(a,b,c,d,e,f,h,k,l,m):this.h.call(null,a,b,c,d,e,f,h,k,l,m),p=Z(this,n);w(p)||X(this.name,n);return p.da?p.da(a,b,c,d,e,f,h,k,l,m):p.call(null,a,b,c,d,e,f,h,k,l,m)};g.ea=function(a,b,c,d,e,f,h,k,l,m,n){var p=this.h.ea?this.h.ea(a,b,c,d,e,f,h,k,l,m,n):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n),q=Z(this,p);w(q)||X(this.name,p);return q.ea?q.ea(a,b,c,d,e,f,h,k,l,m,n):q.call(null,a,b,c,d,e,f,h,k,l,m,n)};
g.fa=function(a,b,c,d,e,f,h,k,l,m,n,p){var q=this.h.fa?this.h.fa(a,b,c,d,e,f,h,k,l,m,n,p):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p),r=Z(this,q);w(r)||X(this.name,q);return r.fa?r.fa(a,b,c,d,e,f,h,k,l,m,n,p):r.call(null,a,b,c,d,e,f,h,k,l,m,n,p)};g.ga=function(a,b,c,d,e,f,h,k,l,m,n,p,q){var r=this.h.ga?this.h.ga(a,b,c,d,e,f,h,k,l,m,n,p,q):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q),u=Z(this,r);w(u)||X(this.name,r);return u.ga?u.ga(a,b,c,d,e,f,h,k,l,m,n,p,q):u.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q)};
g.ha=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r){var u=this.h.ha?this.h.ha(a,b,c,d,e,f,h,k,l,m,n,p,q,r):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r),x=Z(this,u);w(x)||X(this.name,u);return x.ha?x.ha(a,b,c,d,e,f,h,k,l,m,n,p,q,r):x.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r)};
g.ia=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u){var x=this.h.ia?this.h.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u),v=Z(this,x);w(v)||X(this.name,x);return v.ia?v.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u):v.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u)};
g.ja=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x){var v=this.h.ja?this.h.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x),A=Z(this,v);w(A)||X(this.name,v);return A.ja?A.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x):A.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x)};
g.ka=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v){var A=this.h.ka?this.h.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v),D=Z(this,A);w(D)||X(this.name,A);return D.ka?D.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v):D.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v)};
g.la=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A){var D=this.h.la?this.h.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A),J=Z(this,D);w(J)||X(this.name,D);return J.la?J.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A):J.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A)};
g.ma=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D){var J=this.h.ma?this.h.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D),S=Z(this,J);w(S)||X(this.name,J);return S.ma?S.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D):S.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D)};
g.na=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J){var S=this.h.na?this.h.na(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J),ra=Z(this,S);w(ra)||X(this.name,S);return ra.na?ra.na(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J):ra.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J)};
g.Hb=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J,S){var ra=F.m(this.h,a,b,c,d,I([e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J,S],0)),y=Z(this,ra);w(y)||X(this.name,ra);return F.m(y,a,b,c,d,I([e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J,S],0))};
function Z(a,b){gc.b(N.a?N.a(a.ib):N.call(null,a.ib),N.a?N.a(a.rb):N.call(null,a.rb))||vg(a.tb,a.gb,a.ib,a.rb);var c=(N.a?N.a(a.tb):N.call(null,a.tb)).call(null,b);if(w(c))return c;c=yg(a.name,b,a.rb,a.gb,a.sc,a.tb,a.ib);return w(c)?c:(N.a?N.a(a.gb):N.call(null,a.gb)).call(null,a.mc)}g.nb=function(){return Tb(this.name)};g.ob=function(){return Ub(this.name)};g.L=function(){return this[ca]||(this[ca]=++ea)};function Ag(a,b){this.Xa=a;this.u=b;this.i=2153775104;this.B=2048}g=Ag.prototype;
g.toString=function(){return this.Xa};g.equiv=function(a){return this.v(null,a)};g.v=function(a,b){return b instanceof Ag&&this.Xa===b.Xa};g.J=function(a,b){return Db(b,[E('#uuid "'),E(this.Xa),E('"')].join(""))};g.L=function(){null==this.u&&(this.u=kc(this.Xa));return this.u};g.Ra=function(a,b){return sa(this.Xa,b.Xa)};var Bg=new z(null,"javascript","javascript",-45283711),Cg=new H(null,"floor","floor",-772394748,null),Dg=new z(null,"algorithm","algorithm",739262820),Ea=new z(null,"meta","meta",1499536964),Eg=new z(null,"table","table",-564943036),Fg=new H(null,"blockable","blockable",-28395259,null),Fa=new z(null,"dup","dup",556298533),Gg=new H(null,"divmod","divmod",811386629,null),Hg=new z(null,"number","number",1570378438),Ig=new z(null,"button","button",1456579943),se=new H(null,"new-value","new-value",-1567397401,
null),Jg=new H(null,"century-and-year","century-and-year",-681394297,null),oe=new z(null,"validator","validator",-1966190681),Kg=new z(null,"default","default",-1987822328),Lg=new H(null,"closest-perfect-cube","closest-perfect-cube",1220545609,null),Mg=new z(null,"td","td",1479933353),Ng=new H(null,"*","*",345799209,null),Og=new z(null,"value","value",305978217),Pg=new z(null,"tr","tr",-1424774646),Qg=new z(null,"onclick","onclick",1297553739),hg=new z(null,"val","val",128701612),Rg=new z(null,"persist",
"persist",815289548),Sg=new z(null,"type","type",1174270348),Tg=new z(null,"classname","classname",777390796),re=new H(null,"validate","validate",1439230700,null),Ug=new H(null,"dup","dup",-2098137236,null),gg=new z(null,"fallback-impl","fallback-impl",-1501286995),Vg=new H(null,"century-anchor","century-anchor",1137235565,null),Ca=new z(null,"flush-on-newline","flush-on-newline",-151457939),Wg=new H(null,"sqrt","sqrt",370479598,null),Xg=new H(null,"dip","dip",-323933490,null),Yg=new H(null,"%","%",
-950237169,null),Zg=new z(null,"className","className",-1983287057),rg=new z(null,"descendants","descendants",1824886031),sg=new z(null,"ancestors","ancestors",-776045424),$g=new H(null,"-","-",-471816912,null),ah=new z(null,"textarea","textarea",-650375824),xe=new H(null,"n","n",-2092305744,null),bh=new z(null,"div","div",1057191632),Da=new z(null,"readably","readably",1129599760),Zf=new z(null,"more-marker","more-marker",-14717935),ch=new H("eval","all","eval/all",-1769564175,null),dh=new z(null,
"lacket","lacket",-808519309),eh=new z(null,"word","word",-420123725),Ha=new z(null,"print-length","print-length",1931866356),fh=new z(null,"id","id",-1388402092),qg=new z(null,"parents","parents",-2027538891),gh=new H(null,"/","/",-1371932971,null),hh=new z(null,"svg","svg",856789142),ih=new z(null,"code","code",1586293142),kh=new z(null,"initial","initial",1854648214),lh=new z(null,"tag","tag",-1290361223),mh=new z(null,"rerender","rerender",-1601192263),nh=new z(null,"input","input",556931961),
oh=new H(null,"+","+",-740910886,null),fe=new H(null,"quote","quote",1377916282,null),ee=new z(null,"arglists","arglists",1661989754),de=new H(null,"nil-iter","nil-iter",1101030523,null),ph=new z(null,"main","main",-2117802661),qh=new z(null,"hierarchy","hierarchy",-1053470341),fg=new z(null,"alt-impl","alt-impl",670969595),rh=new z(null,"racket","racket",781983516),sh=new H(null,"deref","deref",1494944732,null),th=new H(null,"closest-perfect-square","closest-perfect-square",1449996605,null),we=new H(null,
"number?","number?",-1747282210,null),uh=new z(null,"foreignObject","foreignObject",25502111),vh=new z(null,"text","text",-1790561697),wh=new z(null,"span","span",1394872991),xh=new H(null,"f","f",43394975,null);var yh;function zh(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function Ah(a,b,c,d){this.head=a;this.I=b;this.length=c;this.f=d}Ah.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.I];this.f[this.I]=null;this.I=(this.I+1)%this.f.length;--this.length;return a};Ah.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};
Ah.prototype.resize=function(){var a=Array(2*this.f.length);return this.I<this.head?(zh(this.f,this.I,a,0,this.length),this.I=0,this.head=this.length,this.f=a):this.I>this.head?(zh(this.f,this.I,a,0,this.f.length-this.I),zh(this.f,0,a,this.f.length-this.I,this.head),this.I=0,this.head=this.length,this.f=a):this.I===this.head?(this.head=this.I=0,this.f=a):null};if("undefined"===typeof Bh)var Bh={};var Ch;a:{var Dh=aa.navigator;if(Dh){var Eh=Dh.userAgent;if(Eh){Ch=Eh;break a}}Ch=""}function Fh(a){return-1!=Ch.indexOf(a)};var Gh;
function Hh(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&!Fh("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ia(function(a){if(("*"==d||a.origin==d)&&a.data==
c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&!Fh("Trident")&&!Fh("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.Lb;c.Lb=null;a()}};return function(a){d.next={Lb:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=document.createElement("SCRIPT");
b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var Ih;Ih=new Ah(0,0,0,Array(32));var Jh=!1,Kh=!1;Lh;function Mh(){Jh=!0;Kh=!1;for(var a=0;;){var b=Ih.pop();if(null!=b&&(b.w?b.w():b.call(null),1024>a)){a+=1;continue}break}Jh=!1;return 0<Ih.length?Lh.w?Lh.w():Lh.call(null):null}function Lh(){var a=Kh;if(w(w(a)?Jh:a))return null;Kh=!0;!ba(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(Gh||(Gh=Hh()),Gh(Mh)):aa.setImmediate(Mh)};for(var Nh=Array(1),Oh=0;;)if(Oh<Nh.length)Nh[Oh]=null,Oh+=1;else break;(function(a){"undefined"===typeof yh&&(yh=function(a,c,d){this.nc=a;this.Wb=c;this.pc=d;this.i=393216;this.B=0},yh.prototype.R=function(a,c){return new yh(this.nc,this.Wb,c)},yh.prototype.O=function(){return this.pc},yh.oc=function(){return new T(null,3,5,V,[xh,Fg,ta.Ec],null)},yh.Ib=!0,yh.qb="cljs.core.async/t_cljs$core$async10693",yh.Sb=function(a,c){return Db(c,"cljs.core.async/t_cljs$core$async10693")});return new yh(a,!0,ge)})(function(){return null});var Ph=VDOM.diff,Qh=VDOM.patch,Rh=VDOM.create;function Sh(a){return Be(ke(Ma),Be(ke(rd),Ce(a)))}function Th(a,b,c){return new VDOM.VHtml(Jd(a),mg(b),mg(c))}function Uh(a,b,c){return new VDOM.VSvg(Jd(a),mg(b),mg(c))}Vh;
var Wh=function Wh(b){if(null==b)return new VDOM.VText("");if(rd(b))return Th(bh,ge,Id.b(Wh,Sh(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(gc.b(hh,L(b)))return Vh.a?Vh.a(b):Vh.call(null,b);var c=Q(b,0),d=Q(b,1);b=Gd(b,2);return Th(c,d,Id.b(Wh,Sh(b)))},Vh=function Vh(b){if(null==b)return new VDOM.VText("");if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(gc.b(uh,L(b))){var c=Q(b,0),d=Q(b,1);b=Gd(b,2);return Uh(c,d,Id.b(Wh,Sh(b)))}c=Q(b,0);d=Q(b,
1);b=Gd(b,2);return Uh(c,d,Id.b(Vh,Sh(b)))};
function Xh(){var a=document.getElementById("app"),b=function(){var a=new VDOM.VText("");return W.a?W.a(a):W.call(null,a)}(),c=function(){var a;a=N.a?N.a(b):N.call(null,b);a=Rh.a?Rh.a(a):Rh.call(null,a);return W.a?W.a(a):W.call(null,a)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.w?a.w():a.call(null)}}(b,c):function(){return function(a){return window.requestAnimationFrame(a)}}(b,c);a.appendChild(N.a?N.a(c):N.call(null,c));return function(a,b,c){return function(d){var l=
Wh(d);d=function(){var b=N.a?N.a(a):N.call(null,a);return Ph.b?Ph.b(b,l):Ph.call(null,b,l)}();qe.b?qe.b(a,l):qe.call(null,a,l);d=function(a,b,c,d){return function(){return te.c(d,Qh,b)}}(l,d,a,b,c);return c.a?c.a(d):c.call(null,d)}}(b,c,d)};function Yh(a,b){return gc.b(a,b)?0:Math.abs((a-b)/a)};function Zh(a){return Id.b(function(a){return new Ba(null,2,[Og,a,Sg,w(Vf.b?Vf.b(/\[/,a):Vf.call(null,/\[/,a))?dh:w(Vf.b?Vf.b(/\]/,a):Vf.call(null,/\]/,a))?rh:w(Vf.b?Vf.b(/[0-9]+/,a):Vf.call(null,/[0-9]+/,a))?Hg:eh],null)},Xf(/\[|\]|[0-9]+|[^ \[\]]+/,a))}function $h(a){return gc.b(Hg,a.a?a.a(Sg):a.call(null,Sg))?(a=a.a?a.a(Og):a.call(null,Og),parseFloat(a)):gc.b(eh,a.a?a.a(Sg):a.call(null,Sg))?rc.a(a.a?a.a(Og):a.call(null,Og)):null}
function ai(a){var b=a;for(a=Zc;;)if(K(b)){var c=b,b=Q(c,0),c=Gd(c,1),d=gc,e=b.a?b.a(Sg):b.call(null,Sg);if(w(d.b?d.b(dh,e):d.call(null,dh,e))){a:for(b=rh,d=c,c=Zc;;)if(K(d)){e=d;d=Q(e,0);e=Gd(e,1);if(gc.b(b,d.a?d.a(Sg):d.call(null,Sg))){c=new T(null,2,5,V,[e,c],null);break a}c=Yc.b(c,$h(d));d=e}else throw Error("Unexpected end of input, expected ",b);b=Q(c,0);c=Q(c,1);a=Yc.b(a,c)}else a=Yc.b(a,$h(b)),b=c}else return a};function bi(a){var b=new la;for(a=K(a);;)if(null!=a)b.append(""+E(L(a))),a=M(a),null!=a&&b.append(" ");else return b.toString()};function ci(a,b){return function(c){return new T(null,1,5,V,[Yc.b(xd(ye(a,c)),F.b(b,ze(a,c)))],null)}}function di(a){return function(b){return new T(null,1,5,V,[xd($d.b(ye(2,b),F.b(a,ze(2,b))))],null)}}
var ei=dd([Vg,th,Xg,Gg,rc.a("\u221a3"),rc.a("\u221a"),Ug,oh,Ng,rc.a("/"),Cg,$g,Lg,Wg,Jg,Yg],[ci(1,function(a){return Dd(5*Dd(a,4)+2,7)}),ci(1,function(a){return Math.pow(Math.round(Math.sqrt(a)),2)}),function(a){var b=ze(2,a),c=Q(b,0),b=Q(b,1);return new T(null,2,5,V,[xd(ye(2,a)),xd($d.b(b,new T(null,1,5,V,[c],null)))],null)},di(function(a,b){return new T(null,2,5,V,[Math.floor(a/b),Dd(a,b)],null)}),ci(1,function(a){return Math.pow(a,1/3)}),ci(1,function(a){return Math.sqrt(a)}),function(a){return new T(null,
1,5,V,[Yc.b(a,Xc(a))],null)},ci(2,zd),ci(2,Bd),ci(2,Cd),ci(1,Math.floor),ci(2,Ad),ci(1,function(a){return Math.pow(Math.round(Math.pow(a,1/3)),3)}),ci(1,function(a){return Math.sqrt(a)}),di(function(a){var b=Math.floor(a/100);return new T(null,2,5,V,[b,a-100*b],null)}),ci(2,Dd)]);
function fi(a,b){if(kd(b)||"number"===typeof b)return new T(null,1,5,V,[Yc.b(a,b)],null);if(b instanceof H){var c=ei.a?ei.a(b):ei.call(null,b);if(w(c))return c.a?c.a(a):c.call(null,a);throw Error([E("Unknown word `"),E(b),E("`")].join(""));}throw Error([E("Unknown value `"),E(b),E("`")].join(""));}
function gi(a,b){for(var c=a,d=b,e=new T(null,1,5,V,[new T(null,2,5,V,[c,d],null)],null);;)if(K(d))var f=Q(d,0),d=Gd(d,1),f=fi(c,f),c=Q(f,0),f=Q(f,1),h=xd($d.b(f,d)),f=c,d=h,e=Yc.b(e,new T(null,2,5,V,[c,h],null)),c=f;else return e}function hi(a){a=[E("(function(x){return "),E(a),E(";})")].join("");return eval(a)}
function ii(a){return function(){function b(a){var b=null;if(0<arguments.length){for(var b=0,f=Array(arguments.length-0);b<f.length;)f[b]=arguments[b+0],++b;b=new tc(f,0)}return c.call(this,b)}function c(b){return Xc(L(Xc(gi(xd(b),a))))}b.A=0;b.F=function(a){a=K(a);return c(a)};b.m=c;return b}()};function ji(a,b){return b*Math.round(a/b)}
function ki(a){return new T(null,3,5,V,[Eg,ge,function(){return function c(a){return new Sd(null,function(){for(;;){var e=K(a);if(e){if(nd(e)){var f=Qb(e),h=P(f),k=new Vd(Array(h),0);a:for(var l=0;;)if(l<h){var m=G.b(f,l),n=Q(m,0),m=Q(m,1),n=new T(null,5,5,V,[Pg,ge,new T(null,3,5,V,[Mg,new Ba(null,1,[Zg,"t-right"],null),bi(n)],null),new T(null,3,5,V,[Mg,new Ba(null,1,[Zg,"t-muted"],null)," \u25c6 "],null),new T(null,3,5,V,[Mg,ge,bi(m)],null)],null);k.add(n);l+=1}else{f=!0;break a}return f?Wd(k.Aa(),
c(Rb(e))):Wd(k.Aa(),null)}f=L(e);k=Q(f,0);f=Q(f,1);return O(new T(null,5,5,V,[Pg,ge,new T(null,3,5,V,[Mg,new Ba(null,1,[Zg,"t-right"],null),bi(k)],null),new T(null,3,5,V,[Mg,new Ba(null,1,[Zg,"t-muted"],null)," \u25c6 "],null),new T(null,3,5,V,[Mg,ge,bi(f)],null)],null),c(uc(e)))}return null}},null,null)}(a)}()],null)}
function li(){var a=mi,b=N.a?N.a(ni):N.call(null,ni),c=L(Ta.c(fi,Zc,ai(Zh(kh.a(b))))),d;try{d=gi(c,ai(Zh(Dg.a(b))))}catch(e){if(e instanceof Error)d=e.message;else throw e;}var f=K(b.a?b.a(Bg):b.call(null,Bg))?hi(b.a?b.a(Bg):b.call(null,Bg)):le(),h=F.b(f,c),k=K(b.a?b.a(Dg):b.call(null,Dg))?ii(ai(Zh(Dg.a(b)))):le(),l=F.b(k,c);return new T(null,3,5,V,[ph,ge,new T(null,4,5,V,[bh,new Ba(null,1,[Zg,"l-diptych"],null),new T(null,6,5,V,[bh,new Ba(null,1,[Zg,"l-vspaced"],null),new T(null,5,5,V,[bh,new Ba(null,
1,[Tg,"l-width-full"],null),"JavaScript expression of ",new T(null,3,5,V,[ih,ge,"x"],null),new T(null,3,5,V,[bh,ge,new T(null,2,5,V,[ah,new Ba(null,3,[fh,"input-js",Zg,"l-width-full",Og,b.a?b.a(Bg):b.call(null,Bg)],null)],null)],null)],null),new T(null,4,5,V,[bh,ge,"Stack algorithm",new T(null,3,5,V,[bh,ge,new T(null,2,5,V,[ah,new Ba(null,3,[fh,"input-algorithm",Zg,"l-width-full",Og,b.a?b.a(Dg):b.call(null,Dg)],null)],null)],null)],null),new T(null,4,5,V,[bh,ge,"Initial stack",new T(null,3,5,V,[bh,
ge,new T(null,2,5,V,[nh,new Ba(null,3,[fh,"input-init",Zg,"l-width-full",Og,b.a?b.a(kh):b.call(null,kh)],null)],null)],null)],null),new T(null,3,5,V,[bh,ge,new T(null,3,5,V,[Ig,new Ba(null,1,[Qg,function(){return function(){var b=document.getElementById("input-js").value,c=document.getElementById("input-algorithm").value,d=document.getElementById("input-init").value;return a.o?a.o(ch,b,c,d):a.call(null,ch,b,c,d)}}(c,d,f,h,k,l)],null),"Evaluate"],null)],null)],null),new T(null,5,5,V,[bh,new Ba(null,
1,[Zg,"l-vspaced"],null),w(h)?new T(null,4,5,V,[bh,ge,new T(null,3,5,V,[wh,new Ba(null,1,[Zg,"t-muted"],null),"JavaScript result "],null),ji(h,1E-4)],null):null,null!=L(L(d))?new T(null,4,5,V,[bh,ge,new T(null,3,5,V,[wh,new Ba(null,1,[Zg,"t-muted"],null),"Stack evaluation "],null),"string"===typeof d?new T(null,3,5,V,[vh,new Ba(null,1,[Zg,"t-error"],null),d],null):ki(d)],null):null,K(b.a?b.a(Bg):b.call(null,Bg))&&"string"!==typeof d?Ya(vc,new T(null,5,5,V,[bh,ge,new T(null,3,5,V,[wh,new Ba(null,1,
[Zg,"t-muted"],null),"Error "],null),ji(100*Yh(h,l),.1),"%"],null)):null],null)],null)],null)};var oi=Fh("Opera")||Fh("OPR"),pi=Fh("Trident")||Fh("MSIE"),qi=Fh("Edge"),ri=Fh("Gecko")&&!(-1!=Ch.toLowerCase().indexOf("webkit")&&!Fh("Edge"))&&!(Fh("Trident")||Fh("MSIE"))&&!Fh("Edge"),si=-1!=Ch.toLowerCase().indexOf("webkit")&&!Fh("Edge");function ti(){var a=Ch;if(ri)return/rv\:([^\);]+)(\)|;)/.exec(a);if(qi)return/Edge\/([\d\.]+)/.exec(a);if(pi)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(si)return/WebKit\/(\S+)/.exec(a)}
(function(){if(oi&&aa.opera){var a=aa.opera.version;return ba(a)?a():a}var a="",b=ti();b&&(a=b?b[1]:"");return pi&&(b=(b=aa.document)?b.documentMode:void 0,b>parseFloat(a))?String(b):a})();var ui=null,vi=null,wi=ri||si||oi||"function"==typeof aa.atob;function xi(){if(!ui){ui={};vi={};for(var a=0;65>a;a++)ui[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(a),vi[ui[a]]=a,62<=a&&(vi["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(a)]=a)}};var yi=function yi(b){if(null!=b&&null!=b.Tb)return b.Tb();var c=yi[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=yi._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("PushbackReader.read-char",b);},zi=function zi(b,c){if(null!=b&&null!=b.Ub)return b.Ub(0,c);var d=zi[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=zi._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("PushbackReader.unread",b);};
function Ai(a,b,c){this.C=a;this.buffer=b;this.Jb=c}Ai.prototype.Tb=function(){return 0===this.buffer.length?(this.Jb+=1,this.C[this.Jb]):this.buffer.pop()};Ai.prototype.Ub=function(a,b){return this.buffer.push(b)};function Bi(a){var b=!/[^\t\n\r ]/.test(a);return w(b)?b:","===a}Ci;Di;Ei;function Fi(a){throw Error(F.b(E,a));}
function Gi(a,b){for(var c=new la(b),d=yi(a);;){var e;if(!(e=null==d||Bi(d))){e=d;var f="#"!==e;e=f?(f="'"!==e)?(f=":"!==e)?Di.a?Di.a(e):Di.call(null,e):f:f:f}if(e)return zi(a,d),c.toString();c.append(d);d=yi(a)}}function Hi(a){for(;;){var b=yi(a);if("\n"===b||"\r"===b||null==b)return a}}var Ii=Yf("^([-+]?)(?:(0)|([1-9][0-9]*)|0[xX]([0-9A-Fa-f]+)|0([0-7]+)|([1-9][0-9]?)[rR]([0-9A-Za-z]+))(N)?$"),Ji=Yf("^([-+]?[0-9]+)/([0-9]+)$"),Ki=Yf("^([-+]?[0-9]+(\\.[0-9]*)?([eE][-+]?[0-9]+)?)(M)?$"),Li=Yf("^[:]?([^0-9/].*/)?([^0-9/][^/]*)$");
function Mi(a,b){var c=a.exec(b);return null!=c&&c[0]===b?1===c.length?c[0]:c:null}var Ni=Yf("^[0-9A-Fa-f]{2}$"),Oi=Yf("^[0-9A-Fa-f]{4}$");function Pi(a,b,c){return w(Vf(a,c))?c:Fi(I(["Unexpected unicode escape \\",b,c],0))}function Qi(a){return String.fromCharCode(parseInt(a,16))}
function Ri(a){var b=yi(a),c="t"===b?"\t":"r"===b?"\r":"n"===b?"\n":"\\"===b?"\\":'"'===b?'"':"b"===b?"\b":"f"===b?"\f":null;w(c)?b=c:"x"===b?(a=(new la(yi(a),yi(a))).toString(),b=Qi(Pi(Ni,b,a))):"u"===b?(a=(new la(yi(a),yi(a),yi(a),yi(a))).toString(),b=Qi(Pi(Oi,b,a))):b=/[^0-9]/.test(b)?Fi(I(["Unexpected unicode escape \\",b],0)):String.fromCharCode(b);return b}
function Si(a,b){for(var c=Ib(Zc);;){var d;a:{d=Bi;for(var e=b,f=yi(e);;)if(w(d.a?d.a(f):d.call(null,f)))f=yi(e);else{d=f;break a}}w(d)||Fi(I(["EOF while reading"],0));if(a===d)return Kb(c);e=Di.a?Di.a(d):Di.call(null,d);w(e)?d=e.b?e.b(b,d):e.call(null,b,d):(zi(b,d),d=Ci.o?Ci.o(b,!0,null,!0):Ci.call(null,b,!0,null));c=d===b?c:ae.b(c,d)}}function Ti(a,b){return Fi(I(["Reader for ",b," not implemented yet"],0))}Ui;
function Vi(a,b){var c=yi(a),d=Ei.a?Ei.a(c):Ei.call(null,c);if(w(d))return d.b?d.b(a,b):d.call(null,a,b);d=Ui.b?Ui.b(a,c):Ui.call(null,a,c);return w(d)?d:Fi(I(["No dispatch macro for ",c],0))}function Wi(a,b){return Fi(I(["Unmatched delimiter ",b],0))}function Xi(a){return F.b(fc,Si(")",a))}function Yi(a){return Si("]",a)}
function Zi(a){a=Si("}",a);var b=P(a);if("number"!==typeof b||isNaN(b)||Infinity===b||parseFloat(b)!==parseInt(b,10))throw Error([E("Argument must be an integer: "),E(b)].join(""));0!==(b&1)&&Fi(I(["Map literal must contain an even number of forms"],0));return F.b(Fc,a)}function $i(a){for(var b=new la,c=yi(a);;){if(null==c)return Fi(I(["EOF while reading"],0));if("\\"===c)b.append(Ri(a));else{if('"'===c)return b.toString();b.append(c)}c=yi(a)}}
function aj(a){for(var b=new la,c=yi(a);;){if(null==c)return Fi(I(["EOF while reading"],0));if("\\"===c){b.append(c);var d=yi(a);if(null==d)return Fi(I(["EOF while reading"],0));var e=function(){var a=b;a.append(d);return a}(),f=yi(a)}else{if('"'===c)return b.toString();e=function(){var a=b;a.append(c);return a}();f=yi(a)}b=e;c=f}}
function bj(a,b){var c=Gi(a,b),d=-1!=c.indexOf("/");w(w(d)?1!==c.length:d)?c=rc.b(c.substring(0,c.indexOf("/")),c.substring(c.indexOf("/")+1,c.length)):(d=rc.a(c),c="nil"===c?null:"true"===c?!0:"false"===c?!1:"/"===c?gh:d);return c}
function cj(a,b){var c=Gi(a,b),d=c.substring(1);return 1===d.length?d:"tab"===d?"\t":"return"===d?"\r":"newline"===d?"\n":"space"===d?" ":"backspace"===d?"\b":"formfeed"===d?"\f":"u"===d.charAt(0)?Qi(d.substring(1)):"o"===d.charAt(0)?Ti(0,c):Fi(I(["Unknown character literal: ",c],0))}
function dj(a){a=Gi(a,yi(a));var b=Mi(Li,a);a=b[0];var c=b[1],b=b[2];return void 0!==c&&":/"===c.substring(c.length-2,c.length)||":"===b[b.length-1]||-1!==a.indexOf("::",1)?Fi(I(["Invalid token: ",a],0)):null!=c&&0<c.length?Rd.b(c.substring(0,c.indexOf("/")),b):Rd.a(a)}function ej(a){return function(b){return Ya(Ya(vc,Ci.o?Ci.o(b,!0,null,!0):Ci.call(null,b,!0,null)),a)}}function fj(){return function(){return Fi(I(["Unreadable form"],0))}}
function gj(a){var b;b=Ci.o?Ci.o(a,!0,null,!0):Ci.call(null,a,!0,null);if(b instanceof H)b=new Ba(null,1,[lh,b],null);else if("string"===typeof b)b=new Ba(null,1,[lh,b],null);else if(b instanceof z){b=[b,!0];for(var c=[],d=0;;)if(d<b.length){var e=b[d],f=b[d+1];-1===kf(c,e)&&(c.push(e),c.push(f));d+=2}else break;b=new Ba(null,c.length/2,c,null)}jd(b)||Fi(I(["Metadata must be Symbol,Keyword,String or Map"],0));a=Ci.o?Ci.o(a,!0,null,!0):Ci.call(null,a,!0,null);return(null!=a?a.i&262144||a.Dc||(a.i?
0:B(sb,a)):B(sb,a))?Hc(a,Qf.m(I([fd(a),b],0))):Fi(I(["Metadata can only be applied to IWithMetas"],0))}function hj(a){a:if(a=Si("}",a),a=K(a),null==a)a=Uf;else if(a instanceof tc&&0===a.j){a=a.f;b:for(var b=0,c=Ib(Uf);;)if(b<a.length)var d=b+1,c=c.Sa(null,a[b]),b=d;else break b;a=c.ab(null)}else for(d=Ib(Uf);;)if(null!=a)b=M(a),d=d.Sa(null,a.Y(null)),a=b;else{a=Kb(d);break a}return a}function ij(a){return Yf(aj(a))}function jj(a){Ci.o?Ci.o(a,!0,null,!0):Ci.call(null,a,!0,null);return a}
function Di(a){return'"'===a?$i:":"===a?dj:";"===a?Hi:"'"===a?ej(fe):"@"===a?ej(sh):"^"===a?gj:"`"===a?Ti:"~"===a?Ti:"("===a?Xi:")"===a?Wi:"["===a?Yi:"]"===a?Wi:"{"===a?Zi:"}"===a?Wi:"\\"===a?cj:"#"===a?Vi:null}function Ei(a){return"{"===a?hj:"\x3c"===a?fj():'"'===a?ij:"!"===a?Hi:"_"===a?jj:null}
function Ci(a,b,c){for(;;){var d=yi(a);if(null==d)return w(b)?Fi(I(["EOF while reading"],0)):c;if(!Bi(d))if(";"===d)a=Hi.b?Hi.b(a,d):Hi.call(null,a);else{var e=Di(d);if(w(e))e=e.b?e.b(a,d):e.call(null,a,d);else{var e=a,f=void 0;!(f=!/[^0-9]/.test(d))&&(f=void 0,f="+"===d||"-"===d)&&(f=yi(e),zi(e,f),f=!/[^0-9]/.test(f));if(f)a:for(e=a,d=new la(d),f=yi(e);;){var h;h=null==f;h||(h=(h=Bi(f))?h:Di.a?Di.a(f):Di.call(null,f));if(w(h)){zi(e,f);d=e=d.toString();f=void 0;w(Mi(Ii,d))?(d=Mi(Ii,d),f=d[2],null!=
(gc.b(f,"")?null:f)?f=0:(f=w(d[3])?[d[3],10]:w(d[4])?[d[4],16]:w(d[5])?[d[5],8]:w(d[6])?[d[7],parseInt(d[6],10)]:[null,null],h=f[0],null==h?f=null:(f=parseInt(h,f[1]),f="-"===d[1]?-f:f))):(f=void 0,w(Mi(Ji,d))?(d=Mi(Ji,d),f=parseInt(d[1],10)/parseInt(d[2],10)):f=w(Mi(Ki,d))?parseFloat(d):null);d=f;e=w(d)?d:Fi(I(["Invalid number format [",e,"]"],0));break a}d.append(f);f=yi(e)}else e=bj(a,d)}if(e!==a)return e}}}
var kj=function(a,b){return function(c,d){return pc.b(w(d)?b:a,c)}}(new T(null,13,5,V,[null,31,28,31,30,31,30,31,31,30,31,30,31],null),new T(null,13,5,V,[null,31,29,31,30,31,30,31,31,30,31,30,31],null)),lj=/(\d\d\d\d)(?:-(\d\d)(?:-(\d\d)(?:[T](\d\d)(?::(\d\d)(?::(\d\d)(?:[.](\d+))?)?)?)?)?)?(?:[Z]|([-+])(\d\d):(\d\d))?/;function mj(a){a=parseInt(a,10);return Oa(isNaN(a))?a:null}
function nj(a,b,c,d){a<=b&&b<=c||Fi(I([[E(d),E(" Failed:  "),E(a),E("\x3c\x3d"),E(b),E("\x3c\x3d"),E(c)].join("")],0));return b}
function oj(a){var b=Vf(lj,a);Q(b,0);var c=Q(b,1),d=Q(b,2),e=Q(b,3),f=Q(b,4),h=Q(b,5),k=Q(b,6),l=Q(b,7),m=Q(b,8),n=Q(b,9),p=Q(b,10);if(Oa(b))return Fi(I([[E("Unrecognized date/time syntax: "),E(a)].join("")],0));var q=mj(c),r=function(){var a=mj(d);return w(a)?a:1}();a=function(){var a=mj(e);return w(a)?a:1}();var b=function(){var a=mj(f);return w(a)?a:0}(),c=function(){var a=mj(h);return w(a)?a:0}(),u=function(){var a=mj(k);return w(a)?a:0}(),x=function(){var a;a:if(gc.b(3,P(l)))a=l;else if(3<P(l))a=
l.substring(0,3);else for(a=new la(l);;)if(3>a.Ma.length)a=a.append("0");else{a=a.toString();break a}a=mj(a);return w(a)?a:0}(),m=(gc.b(m,"-")?-1:1)*(60*function(){var a=mj(n);return w(a)?a:0}()+function(){var a=mj(p);return w(a)?a:0}());return new T(null,8,5,V,[q,nj(1,r,12,"timestamp month field must be in range 1..12"),nj(1,a,function(){var a;a=0===Dd(q,4);w(a)&&(a=Oa(0===Dd(q,100)),a=w(a)?a:0===Dd(q,400));return kj.b?kj.b(r,a):kj.call(null,r,a)}(),"timestamp day field must be in range 1..last day in month"),
nj(0,b,23,"timestamp hour field must be in range 0..23"),nj(0,c,59,"timestamp minute field must be in range 0..59"),nj(0,u,gc.b(c,59)?60:59,"timestamp second field must be in range 0..60"),nj(0,x,999,"timestamp millisecond field must be in range 0..999"),m],null)}
var pj,qj=new Ba(null,4,["inst",function(a){var b;if("string"===typeof a)if(b=oj(a),w(b)){a=Q(b,0);var c=Q(b,1),d=Q(b,2),e=Q(b,3),f=Q(b,4),h=Q(b,5),k=Q(b,6);b=Q(b,7);b=new Date(Date.UTC(a,c-1,d,e,f,h,k)-6E4*b)}else b=Fi(I([[E("Unrecognized date/time syntax: "),E(a)].join("")],0));else b=Fi(I(["Instance literal expects a string for its timestamp."],0));return b},"uuid",function(a){return"string"===typeof a?new Ag(a,null):Fi(I(["UUID literal expects a string as its representation."],0))},"queue",function(a){return kd(a)?
De(bf,a):Fi(I(["Queue literal expects a vector for its elements."],0))},"js",function(a){if(kd(a)){var b=[];a=K(a);for(var c=null,d=0,e=0;;)if(e<d){var f=c.U(null,e);b.push(f);e+=1}else if(a=K(a))c=a,nd(c)?(a=Qb(c),e=Rb(c),c=a,d=P(a),a=e):(a=L(c),b.push(a),a=M(c),c=null,d=0),e=0;else break;return b}if(jd(a)){b={};a=K(a);c=null;for(e=d=0;;)if(e<d){var h=c.U(null,e),f=Q(h,0),h=Q(h,1);b[Jd(f)]=h;e+=1}else if(a=K(a))nd(a)?(d=Qb(a),a=Rb(a),c=d,d=P(d)):(d=L(a),c=Q(d,0),d=Q(d,1),b[Jd(c)]=d,a=M(a),c=null,
d=0),e=0;else break;return b}return Fi(I([[E("JS literal expects a vector or map containing "),E("only string or unqualified keyword keys")].join("")],0))}],null);pj=W.a?W.a(qj):W.call(null,qj);var rj=W.a?W.a(null):W.call(null,null);
function Ui(a,b){var c=bj(a,b),d=pc.b(N.a?N.a(pj):N.call(null,pj),""+E(c)),e=N.a?N.a(rj):N.call(null,rj);return w(d)?(c=Ci(a,!0,null),d.a?d.a(c):d.call(null,c)):w(e)?(d=Ci(a,!0,null),e.b?e.b(c,d):e.call(null,c,d)):Fi(I(["Could not find tag parser for ",""+E(c)," in ",pe.m(I([nf(N.a?N.a(pj):N.call(null,pj))],0))],0))};var va=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new tc(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Ka.a?Ka.a(a):Ka.call(null,a))}a.A=0;a.F=function(a){a=K(a);return b(a)};a.m=b;return a}(),wa=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new tc(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,
Ka.a?Ka.a(a):Ka.call(null,a))}a.A=0;a.F=function(a){a=K(a);return b(a)};a.m=b;return a}(),sj;
try{var tj,uj;var vj=window.location.hash,wj=/^#\//;if("string"===typeof wj)uj=vj.replace(new RegExp(String(wj).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08"),"g"),"");else if(wj instanceof RegExp)uj=vj.replace(new RegExp(wj.source,"g"),"");else throw[E("Invalid match arg: "),E(wj)].join("");var xj=uj,yj;if(wi)yj=aa.atob(xj);else{xi();for(var zj=vi,Aj=[],Bj=0;Bj<xj.length;){var Cj=zj[xj.charAt(Bj++)],Dj=Bj<xj.length?zj[xj.charAt(Bj)]:0;++Bj;var Ej=Bj<xj.length?zj[xj.charAt(Bj)]:
64;++Bj;var Fj=Bj<xj.length?zj[xj.charAt(Bj)]:64;++Bj;if(null==Cj||null==Dj||null==Ej||null==Fj)throw Error();Aj.push(Cj<<2|Dj>>4);64!=Ej&&(Aj.push(Dj<<4&240|Ej>>2),64!=Fj&&Aj.push(Ej<<6&192|Fj))}if(8192>=Aj.length)yj=String.fromCharCode.apply(null,Aj);else{for(var Gj="",Hj=0;Hj<Aj.length;Hj+=8192)Gj+=String.fromCharCode.apply(null,oa(Aj,Hj,Hj+8192));yj=Gj}}tj=yj;if("string"!==typeof tj)throw Error("Cannot read from non-string object.");sj=Ci(new Ai(tj,[],-1),!1,null)}catch(Ij){if(Ij instanceof Exception)sj=
null;else throw Ij;}if("undefined"===typeof ni){var ni,Jj=w(sj)?sj:new Ba(null,3,[Bg,"",Dg,"",kh,""],null);ni=W.a?W.a(Jj):W.call(null,Jj)}
if("undefined"===typeof mi)var mi=function(){var a=W.a?W.a(ge):W.call(null,ge),b=W.a?W.a(ge):W.call(null,ge),c=W.a?W.a(ge):W.call(null,ge),d=W.a?W.a(ge):W.call(null,ge),e=pc.c(ge,qh,pg());return new zg(rc.b("mmh.core","emit"),function(){return function(){function a(b,c){if(1<arguments.length)for(var d=0,e=Array(arguments.length-1);d<e.length;)e[d]=arguments[d+1],++d;return b}a.A=1;a.F=function(a){var b=L(a);uc(a);return b};a.m=function(a){return a};return a}()}(a,b,c,d,e),Kg,e,a,b,c,d)}();
var Kj=mi;te.o(Kj.gb,cd,ch,function(a,b,c,d){return te.c(ni,Qf,new Ba(null,3,[Bg,b,Dg,c,kh,d],null))});vg(Kj.tb,Kj.gb,Kj.ib,Kj.rb);if("undefined"===typeof Lj)var Lj=function(a){return function(){var b=li();return a.a?a.a(b):a.call(null,b)}}(Xh());if("undefined"===typeof Mj){var Mj,Nj=ni;Hb(Nj,mh,function(a,b,c,d){return Lj.a?Lj.a(d):Lj.call(null,d)});Mj=Nj}
if("undefined"===typeof Oj){var Oj,Pj=ni;Hb(Pj,Rg,function(a,b,c,d){return window.location.hash=[E("/"),E(function(){var a=pe.m(I([d],0)),b;if(wi)b=aa.btoa(a);else{b=[];for(var c=0,k=0;k<a.length;k++){for(var l=a.charCodeAt(k);255<l;)b[c++]=l&255,l>>=8;b[c++]=l}a=t(b);if("array"!=a&&("object"!=a||"number"!=typeof b.length))throw Error("encodeByteArray takes an array as a parameter");xi();a=ui;c=[];for(k=0;k<b.length;k+=3){var m=b[k],n=(l=k+1<b.length)?b[k+1]:0,p=k+2<b.length,q=p?b[k+2]:0,r=m>>2,m=
(m&3)<<4|n>>4,n=(n&15)<<2|q>>6,q=q&63;p||(q=64,l||(n=64));c.push(a[r],a[m],a[n],a[q])}b=c.join("")}return b}())].join("")});Oj=Pj}var Qj=N.a?N.a(ni):N.call(null,ni);Lj.a?Lj.a(Qj):Lj.call(null,Qj);