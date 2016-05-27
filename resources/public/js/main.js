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

var g,ba=this;
function u(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==
b&&"undefined"==typeof a.call)return"object";return b}var ca="closure_uid_"+(1E9*Math.random()>>>0),ea=0;function fa(a,b,c){return a.call.apply(a.bind,arguments)}function ga(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function ha(a,b,c){ha=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?fa:ga;return ha.apply(null,arguments)};function ia(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function ja(a,b){null!=a&&this.append.apply(this,arguments)}g=ja.prototype;g.Ma="";g.set=function(a){this.Ma=""+a};g.append=function(a,b,c){this.Ma+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.Ma+=arguments[d];return this};g.clear=function(){this.Ma=""};g.toString=function(){return this.Ma};function la(a,b){return a>b?1:a<b?-1:0};var na={},qa;if("undefined"===typeof ra)var ra=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof sa)var sa=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var ua=null;if("undefined"===typeof va)var va=null;function wa(){return new xa(null,5,[za,!0,Aa,!0,Ba,!1,Da,!1,Ea,null],null)}Ga;function y(a){return null!=a&&!1!==a}Ha;A;function Ia(a){return null==a}function Ja(a){return a instanceof Array}
function La(a){return null==a?!0:!1===a?!0:!1}function B(a,b){return a[u(null==b?null:b)]?!0:a._?!0:!1}function C(a,b){var c=null==b?null:b.constructor,c=y(y(c)?c.Cb:c)?c.lb:u(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Ma(a){var b=a.lb;return y(b)?b:""+E(a)}var Na="undefined"!==typeof Symbol&&"function"===u(Symbol)?Symbol.iterator:"@@iterator";function Oa(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}Pa;Qa;
var Ga=function Ga(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ga.a(arguments[0]);case 2:return Ga.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Ga.a=function(a){return Ga.b(null,a)};Ga.b=function(a,b){function c(a,b){a.push(b);return a}var d=[];return Qa.c?Qa.c(c,d,b):Qa.call(null,c,d,b)};Ga.A=2;function Ra(){}
var Sa=function Sa(b){if(null!=b&&null!=b.X)return b.X(b);var c=Sa[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Sa._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ICounted.-count",b);};function Ua(){}var Va=function Va(b,c){if(null!=b&&null!=b.T)return b.T(b,c);var d=Va[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Va._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("ICollection.-conj",b);};function Wa(){}
var G=function G(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return G.b(arguments[0],arguments[1]);case 3:return G.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
G.b=function(a,b){if(null!=a&&null!=a.W)return a.W(a,b);var c=G[u(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=G._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("IIndexed.-nth",a);};G.c=function(a,b,c){if(null!=a&&null!=a.ta)return a.ta(a,b,c);var d=G[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=G._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("IIndexed.-nth",a);};G.A=3;function Xa(){}
var Ya=function Ya(b){if(null!=b&&null!=b.aa)return b.aa(b);var c=Ya[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ya._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeq.-first",b);},Za=function Za(b){if(null!=b&&null!=b.ra)return b.ra(b);var c=Za[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Za._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeq.-rest",b);};function $a(){}function ab(){}
var bb=function bb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return bb.b(arguments[0],arguments[1]);case 3:return bb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
bb.b=function(a,b){if(null!=a&&null!=a.J)return a.J(a,b);var c=bb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=bb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("ILookup.-lookup",a);};bb.c=function(a,b,c){if(null!=a&&null!=a.H)return a.H(a,b,c);var d=bb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=bb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("ILookup.-lookup",a);};bb.A=3;
var cb=function cb(b,c){if(null!=b&&null!=b.xb)return b.xb(b,c);var d=cb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=cb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IAssociative.-contains-key?",b);},db=function db(b,c,d){if(null!=b&&null!=b.Na)return b.Na(b,c,d);var e=db[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=db._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IAssociative.-assoc",b);};function eb(){}
function fb(){}var hb=function hb(b){if(null!=b&&null!=b.eb)return b.eb(b);var c=hb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=hb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMapEntry.-key",b);},ib=function ib(b){if(null!=b&&null!=b.fb)return b.fb(b);var c=ib[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=ib._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMapEntry.-val",b);};function jb(){}function kb(){}
var lb=function lb(b,c,d){if(null!=b&&null!=b.Oa)return b.Oa(b,c,d);var e=lb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=lb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IVector.-assoc-n",b);},mb=function mb(b){if(null!=b&&null!=b.rb)return b.rb(b);var c=mb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=mb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IDeref.-deref",b);};function nb(){}
var ob=function ob(b){if(null!=b&&null!=b.O)return b.O(b);var c=ob[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=ob._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMeta.-meta",b);},pb=function pb(b,c){if(null!=b&&null!=b.R)return b.R(b,c);var d=pb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=pb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IWithMeta.-with-meta",b);};function qb(){}
var rb=function rb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return rb.b(arguments[0],arguments[1]);case 3:return rb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
rb.b=function(a,b){if(null!=a&&null!=a.Z)return a.Z(a,b);var c=rb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=rb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("IReduce.-reduce",a);};rb.c=function(a,b,c){if(null!=a&&null!=a.$)return a.$(a,b,c);var d=rb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=rb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("IReduce.-reduce",a);};rb.A=3;
var sb=function sb(b,c){if(null!=b&&null!=b.v)return b.v(b,c);var d=sb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=sb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IEquiv.-equiv",b);},tb=function tb(b){if(null!=b&&null!=b.N)return b.N(b);var c=tb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=tb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IHash.-hash",b);};function ub(){}
var wb=function wb(b){if(null!=b&&null!=b.S)return b.S(b);var c=wb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=wb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeqable.-seq",b);};function xb(){}function yb(){}
var zb=function zb(b,c){if(null!=b&&null!=b.Kb)return b.Kb(0,c);var d=zb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=zb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IWriter.-write",b);},Ab=function Ab(b,c,d){if(null!=b&&null!=b.M)return b.M(b,c,d);var e=Ab[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Ab._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IPrintWithWriter.-pr-writer",b);},Bb=function Bb(b,c,d){if(null!=b&&
null!=b.Jb)return b.Jb(0,c,d);var e=Bb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Bb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IWatchable.-notify-watches",b);},Cb=function Cb(b,c,d){if(null!=b&&null!=b.Ib)return b.Ib(0,c,d);var e=Cb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Cb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IWatchable.-add-watch",b);},Db=function Db(b){if(null!=b&&null!=b.Ua)return b.Ua(b);
var c=Db[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Db._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IEditableCollection.-as-transient",b);},Eb=function Eb(b,c){if(null!=b&&null!=b.jb)return b.jb(b,c);var d=Eb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Eb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("ITransientCollection.-conj!",b);},Fb=function Fb(b){if(null!=b&&null!=b.kb)return b.kb(b);var c=Fb[u(null==b?null:b)];if(null!=c)return c.a?
c.a(b):c.call(null,b);c=Fb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ITransientCollection.-persistent!",b);},Gb=function Gb(b,c,d){if(null!=b&&null!=b.ib)return b.ib(b,c,d);var e=Gb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Gb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("ITransientAssociative.-assoc!",b);},Hb=function Hb(b,c,d){if(null!=b&&null!=b.Hb)return b.Hb(0,c,d);var e=Hb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,
b,c,d);e=Hb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("ITransientVector.-assoc-n!",b);};function Ib(){}
var Jb=function Jb(b,c){if(null!=b&&null!=b.Ta)return b.Ta(b,c);var d=Jb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Jb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IComparable.-compare",b);},Kb=function Kb(b){if(null!=b&&null!=b.Fb)return b.Fb();var c=Kb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Kb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunk.-drop-first",b);},Lb=function Lb(b){if(null!=b&&null!=b.zb)return b.zb(b);var c=
Lb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Lb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedSeq.-chunked-first",b);},Mb=function Mb(b){if(null!=b&&null!=b.Ab)return b.Ab(b);var c=Mb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Mb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedSeq.-chunked-rest",b);},Nb=function Nb(b){if(null!=b&&null!=b.yb)return b.yb(b);var c=Nb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,
b);c=Nb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedNext.-chunked-next",b);},Pb=function Pb(b){if(null!=b&&null!=b.gb)return b.gb(b);var c=Pb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Pb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("INamed.-name",b);},Qb=function Qb(b){if(null!=b&&null!=b.hb)return b.hb(b);var c=Qb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Qb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("INamed.-namespace",
b);},Rb=function Rb(b,c){if(null!=b&&null!=b.Xb)return b.Xb(b,c);var d=Rb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Rb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IReset.-reset!",b);},Sb=function Sb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Sb.b(arguments[0],arguments[1]);case 3:return Sb.c(arguments[0],arguments[1],arguments[2]);case 4:return Sb.o(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return Sb.C(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Sb.b=function(a,b){if(null!=a&&null!=a.Zb)return a.Zb(a,b);var c=Sb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=Sb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("ISwap.-swap!",a);};
Sb.c=function(a,b,c){if(null!=a&&null!=a.$b)return a.$b(a,b,c);var d=Sb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Sb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("ISwap.-swap!",a);};Sb.o=function(a,b,c,d){if(null!=a&&null!=a.ac)return a.ac(a,b,c,d);var e=Sb[u(null==a?null:a)];if(null!=e)return e.o?e.o(a,b,c,d):e.call(null,a,b,c,d);e=Sb._;if(null!=e)return e.o?e.o(a,b,c,d):e.call(null,a,b,c,d);throw C("ISwap.-swap!",a);};
Sb.C=function(a,b,c,d,e){if(null!=a&&null!=a.bc)return a.bc(a,b,c,d,e);var f=Sb[u(null==a?null:a)];if(null!=f)return f.C?f.C(a,b,c,d,e):f.call(null,a,b,c,d,e);f=Sb._;if(null!=f)return f.C?f.C(a,b,c,d,e):f.call(null,a,b,c,d,e);throw C("ISwap.-swap!",a);};Sb.A=5;var Tb=function Tb(b){if(null!=b&&null!=b.Ha)return b.Ha(b);var c=Tb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Tb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IIterable.-iterator",b);};
function Ub(a){this.kc=a;this.i=1073741824;this.B=0}Ub.prototype.Kb=function(a,b){return this.kc.append(b)};function Vb(a){var b=new ja;a.M(null,new Ub(b),wa());return""+E(b)}var Wb="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function Xb(a){a=Wb(a|0,-862048943);return Wb(a<<15|a>>>-15,461845907)}
function Yb(a,b){var c=(a|0)^(b|0);return Wb(c<<13|c>>>-13,5)+-430675100|0}function Zb(a,b){var c=(a|0)^b,c=Wb(c^c>>>16,-2048144789),c=Wb(c^c>>>13,-1028477387);return c^c>>>16}function ac(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=Yb(c,Xb(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^Xb(a.charCodeAt(a.length-1)):b;return Zb(b,Wb(2,a.length))}bc;H;cc;dc;var ec={},fc=0;
function gc(a){255<fc&&(ec={},fc=0);var b=ec[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=Wb(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;ec[a]=b;fc+=1}return a=b}function hc(a){null!=a&&(a.i&4194304||a.pc)?a=a.N(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=gc(a),0!==a&&(a=Xb(a),a=Yb(0,a),a=Zb(a,4))):a=a instanceof Date?a.valueOf():null==a?0:tb(a);return a}
function ic(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function Ha(a,b){return b instanceof a}function jc(a,b){if(a.Fa===b.Fa)return 0;var c=La(a.pa);if(y(c?b.pa:c))return-1;if(y(a.pa)){if(La(b.pa))return 1;c=la(a.pa,b.pa);return 0===c?la(a.name,b.name):c}return la(a.name,b.name)}kc;function H(a,b,c,d,e){this.pa=a;this.name=b;this.Fa=c;this.Sa=d;this.ya=e;this.i=2154168321;this.B=4096}g=H.prototype;g.toString=function(){return this.Fa};g.equiv=function(a){return this.v(null,a)};
g.v=function(a,b){return b instanceof H?this.Fa===b.Fa:!1};g.call=function(){function a(a,b,c){return kc.c?kc.c(b,this,c):kc.call(null,b,this,c)}function b(a,b){return kc.b?kc.b(b,this):kc.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};
g.a=function(a){return kc.b?kc.b(a,this):kc.call(null,a,this)};g.b=function(a,b){return kc.c?kc.c(a,this,b):kc.call(null,a,this,b)};g.O=function(){return this.ya};g.R=function(a,b){return new H(this.pa,this.name,this.Fa,this.Sa,b)};g.N=function(){var a=this.Sa;return null!=a?a:this.Sa=a=ic(ac(this.name),gc(this.pa))};g.gb=function(){return this.name};g.hb=function(){return this.pa};g.M=function(a,b){return zb(b,this.Fa)};
var lc=function lc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return lc.a(arguments[0]);case 2:return lc.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};lc.a=function(a){if(a instanceof H)return a;var b=a.indexOf("/");return-1===b?lc.b(null,a):lc.b(a.substring(0,b),a.substring(b+1,a.length))};lc.b=function(a,b){var c=null!=a?[E(a),E("/"),E(b)].join(""):b;return new H(a,b,c,null,null)};
lc.A=2;mc;nc;I;function J(a){if(null==a)return null;if(null!=a&&(a.i&8388608||a.Yb))return a.S(null);if(Ja(a)||"string"===typeof a)return 0===a.length?null:new I(a,0);if(B(ub,a))return wb(a);throw Error([E(a),E(" is not ISeqable")].join(""));}function K(a){if(null==a)return null;if(null!=a&&(a.i&64||a.Va))return a.aa(null);a=J(a);return null==a?null:Ya(a)}function oc(a){return null!=a?null!=a&&(a.i&64||a.Va)?a.ra(null):(a=J(a))?Za(a):pc:pc}
function L(a){return null==a?null:null!=a&&(a.i&128||a.sb)?a.qa(null):J(oc(a))}var cc=function cc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return cc.a(arguments[0]);case 2:return cc.b(arguments[0],arguments[1]);default:return cc.m(arguments[0],arguments[1],new I(c.slice(2),0))}};cc.a=function(){return!0};cc.b=function(a,b){return null==a?null==b:a===b||sb(a,b)};
cc.m=function(a,b,c){for(;;)if(cc.b(a,b))if(L(c))a=b,b=K(c),c=L(c);else return cc.b(b,K(c));else return!1};cc.G=function(a){var b=K(a),c=L(a);a=K(c);c=L(c);return cc.m(b,a,c)};cc.A=2;function qc(a){this.D=a}qc.prototype.next=function(){if(null!=this.D){var a=K(this.D);this.D=L(this.D);return{value:a,done:!1}}return{value:null,done:!0}};function sc(a){return new qc(J(a))}tc;function uc(a,b,c){this.value=a;this.Ya=b;this.ub=c;this.i=8388672;this.B=0}uc.prototype.S=function(){return this};
uc.prototype.aa=function(){return this.value};uc.prototype.ra=function(){null==this.ub&&(this.ub=tc.a?tc.a(this.Ya):tc.call(null,this.Ya));return this.ub};function tc(a){var b=a.next();return y(b.done)?pc:new uc(b.value,a,null)}function vc(a,b){var c=Xb(a),c=Yb(0,c);return Zb(c,b)}function wc(a){var b=0,c=1;for(a=J(a);;)if(null!=a)b+=1,c=Wb(31,c)+hc(K(a))|0,a=L(a);else return vc(c,b)}var xc=vc(1,0);function yc(a){var b=0,c=0;for(a=J(a);;)if(null!=a)b+=1,c=c+hc(K(a))|0,a=L(a);else return vc(c,b)}
var zc=vc(0,0);Ac;bc;Bc;Ra["null"]=!0;Sa["null"]=function(){return 0};Date.prototype.v=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.bb=!0;Date.prototype.Ta=function(a,b){if(b instanceof Date)return la(this.valueOf(),b.valueOf());throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};sb.number=function(a,b){return a===b};Cc;nb["function"]=!0;ob["function"]=function(){return null};tb._=function(a){return a[ca]||(a[ca]=++ea)};M;
function Dc(a){this.L=a;this.i=32768;this.B=0}Dc.prototype.rb=function(){return this.L};function Ec(a){return a instanceof Dc}function M(a){return mb(a)}function Fc(a,b){var c=Sa(a);if(0===c)return b.u?b.u():b.call(null);for(var d=G.b(a,0),e=1;;)if(e<c){var f=G.b(a,e),d=b.b?b.b(d,f):b.call(null,d,f);if(Ec(d))return mb(d);e+=1}else return d}function Gc(a,b,c){var d=Sa(a),e=c;for(c=0;;)if(c<d){var f=G.b(a,c),e=b.b?b.b(e,f):b.call(null,e,f);if(Ec(e))return mb(e);c+=1}else return e}
function Hc(a,b){var c=a.length;if(0===a.length)return b.u?b.u():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.b?b.b(d,f):b.call(null,d,f);if(Ec(d))return mb(d);e+=1}else return d}function Ic(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.b?b.b(e,f):b.call(null,e,f);if(Ec(e))return mb(e);c+=1}else return e}function Jc(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.b?b.b(c,f):b.call(null,c,f);if(Ec(c))return mb(c);d+=1}else return c}Kc;N;Lc;Mc;
function Nc(a){return null!=a?a.i&2||a.Ob?!0:a.i?!1:B(Ra,a):B(Ra,a)}function Oc(a){return null!=a?a.i&16||a.Gb?!0:a.i?!1:B(Wa,a):B(Wa,a)}function Pc(a,b){this.f=a;this.l=b}Pc.prototype.ua=function(){return this.l<this.f.length};Pc.prototype.next=function(){var a=this.f[this.l];this.l+=1;return a};function I(a,b){this.f=a;this.l=b;this.i=166199550;this.B=8192}g=I.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};
g.W=function(a,b){var c=b+this.l;return c<this.f.length?this.f[c]:null};g.ta=function(a,b,c){a=b+this.l;return a<this.f.length?this.f[a]:c};g.Ha=function(){return new Pc(this.f,this.l)};g.qa=function(){return this.l+1<this.f.length?new I(this.f,this.l+1):null};g.X=function(){var a=this.f.length-this.l;return 0>a?0:a};g.N=function(){return wc(this)};g.v=function(a,b){return Bc.b?Bc.b(this,b):Bc.call(null,this,b)};g.Z=function(a,b){return Jc(this.f,b,this.f[this.l],this.l+1)};
g.$=function(a,b,c){return Jc(this.f,b,c,this.l)};g.aa=function(){return this.f[this.l]};g.ra=function(){return this.l+1<this.f.length?new I(this.f,this.l+1):pc};g.S=function(){return this.l<this.f.length?this:null};g.T=function(a,b){return N.b?N.b(b,this):N.call(null,b,this)};I.prototype[Na]=function(){return sc(this)};
var nc=function nc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return nc.a(arguments[0]);case 2:return nc.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};nc.a=function(a){return nc.b(a,0)};nc.b=function(a,b){return b<a.length?new I(a,b):null};nc.A=2;
var mc=function mc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return mc.a(arguments[0]);case 2:return mc.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};mc.a=function(a){return nc.b(a,0)};mc.b=function(a,b){return nc.b(a,b)};mc.A=2;Cc;O;function Lc(a,b,c){this.qb=a;this.l=b;this.w=c;this.i=32374990;this.B=8192}g=Lc.prototype;g.toString=function(){return Vb(this)};
g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.w};g.qa=function(){return 0<this.l?new Lc(this.qb,this.l-1,null):null};g.X=function(){return this.l+1};g.N=function(){return wc(this)};g.v=function(a,b){return Bc.b?Bc.b(this,b):Bc.call(null,this,b)};g.Z=function(a,b){return O.b?O.b(b,this):O.call(null,b,this)};g.$=function(a,b,c){return O.c?O.c(b,c,this):O.call(null,b,c,this)};g.aa=function(){return G.b(this.qb,this.l)};
g.ra=function(){return 0<this.l?new Lc(this.qb,this.l-1,null):pc};g.S=function(){return this};g.R=function(a,b){return new Lc(this.qb,this.l,b)};g.T=function(a,b){return N.b?N.b(b,this):N.call(null,b,this)};Lc.prototype[Na]=function(){return sc(this)};function Qc(a){for(;;){var b=L(a);if(null!=b)a=b;else return K(a)}}sb._=function(a,b){return a===b};
var Rc=function Rc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Rc.u();case 1:return Rc.a(arguments[0]);case 2:return Rc.b(arguments[0],arguments[1]);default:return Rc.m(arguments[0],arguments[1],new I(c.slice(2),0))}};Rc.u=function(){return Sc};Rc.a=function(a){return a};Rc.b=function(a,b){return null!=a?Va(a,b):Va(pc,b)};Rc.m=function(a,b,c){for(;;)if(y(c))a=Rc.b(a,b),b=K(c),c=L(c);else return Rc.b(a,b)};
Rc.G=function(a){var b=K(a),c=L(a);a=K(c);c=L(c);return Rc.m(b,a,c)};Rc.A=2;function P(a){if(null!=a)if(null!=a&&(a.i&2||a.Ob))a=a.X(null);else if(Ja(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.i&8388608||a.Yb))a:{a=J(a);for(var b=0;;){if(Nc(a)){a=b+Sa(a);break a}a=L(a);b+=1}}else a=Sa(a);else a=0;return a}function Tc(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return J(a)?K(a):c;if(Oc(a))return G.c(a,b,c);if(J(a)){var d=L(a),e=b-1;a=d;b=e}else return c}}
function Uc(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.i&16||a.Gb))return a.W(null,b);if(Ja(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.Va)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(J(c)){c=K(c);break a}throw Error("Index out of bounds");}if(Oc(c)){c=G.b(c,d);break a}if(J(c))c=L(c),--d;else throw Error("Index out of bounds");
}}return c}if(B(Wa,a))return G.b(a,b);throw Error([E("nth not supported on this type "),E(Ma(null==a?null:a.constructor))].join(""));}
function T(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.i&16||a.Gb))return a.ta(null,b,null);if(Ja(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.Va))return Tc(a,b);if(B(Wa,a))return G.b(a,b);throw Error([E("nth not supported on this type "),E(Ma(null==a?null:a.constructor))].join(""));}
var kc=function kc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return kc.b(arguments[0],arguments[1]);case 3:return kc.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};kc.b=function(a,b){return null==a?null:null!=a&&(a.i&256||a.Rb)?a.J(null,b):Ja(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:B(ab,a)?bb.b(a,b):null};
kc.c=function(a,b,c){return null!=a?null!=a&&(a.i&256||a.Rb)?a.H(null,b,c):Ja(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:B(ab,a)?bb.c(a,b,c):c:c};kc.A=3;Vc;var Wc=function Wc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Wc.c(arguments[0],arguments[1],arguments[2]);default:return Wc.m(arguments[0],arguments[1],arguments[2],new I(c.slice(3),0))}};Wc.c=function(a,b,c){return null!=a?db(a,b,c):Xc([b],[c])};
Wc.m=function(a,b,c,d){for(;;)if(a=Wc.c(a,b,c),y(d))b=K(d),c=K(L(d)),d=L(L(d));else return a};Wc.G=function(a){var b=K(a),c=L(a);a=K(c);var d=L(c),c=K(d),d=L(d);return Wc.m(b,a,c,d)};Wc.A=3;function Yc(a,b){this.g=a;this.w=b;this.i=393217;this.B=0}g=Yc.prototype;g.O=function(){return this.w};g.R=function(a,b){return new Yc(this.g,b)};
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,F,R){a=this;return Pa.cb?Pa.cb(a.g,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,F,R):Pa.call(null,a.g,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,F,R)}function b(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,F){a=this;return a.g.ma?a.g.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,F):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,F)}function c(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D){a=this;return a.g.la?a.g.la(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,
D):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D)}function d(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x){a=this;return a.g.ka?a.g.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x)}function e(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){a=this;return a.g.ja?a.g.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)}function f(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w){a=this;return a.g.ia?a.g.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.g.call(null,
b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)}function h(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){a=this;return a.g.ha?a.g.ha(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)}function k(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){a=this;return a.g.ga?a.g.ga(b,c,d,e,f,h,k,l,m,n,p,q,r,t):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,h,k,l,m,n,p,q,r){a=this;return a.g.fa?a.g.fa(b,c,d,e,f,h,k,l,m,n,p,q,r):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r)}function m(a,b,c,d,e,f,h,k,l,m,n,p,q){a=this;
return a.g.ea?a.g.ea(b,c,d,e,f,h,k,l,m,n,p,q):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q)}function n(a,b,c,d,e,f,h,k,l,m,n,p){a=this;return a.g.da?a.g.da(b,c,d,e,f,h,k,l,m,n,p):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p)}function p(a,b,c,d,e,f,h,k,l,m,n){a=this;return a.g.ca?a.g.ca(b,c,d,e,f,h,k,l,m,n):a.g.call(null,b,c,d,e,f,h,k,l,m,n)}function q(a,b,c,d,e,f,h,k,l,m){a=this;return a.g.oa?a.g.oa(b,c,d,e,f,h,k,l,m):a.g.call(null,b,c,d,e,f,h,k,l,m)}function r(a,b,c,d,e,f,h,k,l){a=this;return a.g.na?a.g.na(b,c,
d,e,f,h,k,l):a.g.call(null,b,c,d,e,f,h,k,l)}function t(a,b,c,d,e,f,h,k){a=this;return a.g.V?a.g.V(b,c,d,e,f,h,k):a.g.call(null,b,c,d,e,f,h,k)}function v(a,b,c,d,e,f,h){a=this;return a.g.U?a.g.U(b,c,d,e,f,h):a.g.call(null,b,c,d,e,f,h)}function w(a,b,c,d,e,f){a=this;return a.g.C?a.g.C(b,c,d,e,f):a.g.call(null,b,c,d,e,f)}function z(a,b,c,d,e){a=this;return a.g.o?a.g.o(b,c,d,e):a.g.call(null,b,c,d,e)}function D(a,b,c,d){a=this;return a.g.c?a.g.c(b,c,d):a.g.call(null,b,c,d)}function F(a,b,c){a=this;return a.g.b?
a.g.b(b,c):a.g.call(null,b,c)}function R(a,b){a=this;return a.g.a?a.g.a(b):a.g.call(null,b)}function pa(a){a=this;return a.g.u?a.g.u():a.g.call(null)}var x=null,x=function(Ca,Q,S,U,W,aa,da,ka,ma,oa,ta,ya,Fa,Ka,x,Ta,gb,vb,Ob,rc,cd,ve){switch(arguments.length){case 1:return pa.call(this,Ca);case 2:return R.call(this,Ca,Q);case 3:return F.call(this,Ca,Q,S);case 4:return D.call(this,Ca,Q,S,U);case 5:return z.call(this,Ca,Q,S,U,W);case 6:return w.call(this,Ca,Q,S,U,W,aa);case 7:return v.call(this,Ca,Q,
S,U,W,aa,da);case 8:return t.call(this,Ca,Q,S,U,W,aa,da,ka);case 9:return r.call(this,Ca,Q,S,U,W,aa,da,ka,ma);case 10:return q.call(this,Ca,Q,S,U,W,aa,da,ka,ma,oa);case 11:return p.call(this,Ca,Q,S,U,W,aa,da,ka,ma,oa,ta);case 12:return n.call(this,Ca,Q,S,U,W,aa,da,ka,ma,oa,ta,ya);case 13:return m.call(this,Ca,Q,S,U,W,aa,da,ka,ma,oa,ta,ya,Fa);case 14:return l.call(this,Ca,Q,S,U,W,aa,da,ka,ma,oa,ta,ya,Fa,Ka);case 15:return k.call(this,Ca,Q,S,U,W,aa,da,ka,ma,oa,ta,ya,Fa,Ka,x);case 16:return h.call(this,
Ca,Q,S,U,W,aa,da,ka,ma,oa,ta,ya,Fa,Ka,x,Ta);case 17:return f.call(this,Ca,Q,S,U,W,aa,da,ka,ma,oa,ta,ya,Fa,Ka,x,Ta,gb);case 18:return e.call(this,Ca,Q,S,U,W,aa,da,ka,ma,oa,ta,ya,Fa,Ka,x,Ta,gb,vb);case 19:return d.call(this,Ca,Q,S,U,W,aa,da,ka,ma,oa,ta,ya,Fa,Ka,x,Ta,gb,vb,Ob);case 20:return c.call(this,Ca,Q,S,U,W,aa,da,ka,ma,oa,ta,ya,Fa,Ka,x,Ta,gb,vb,Ob,rc);case 21:return b.call(this,Ca,Q,S,U,W,aa,da,ka,ma,oa,ta,ya,Fa,Ka,x,Ta,gb,vb,Ob,rc,cd);case 22:return a.call(this,Ca,Q,S,U,W,aa,da,ka,ma,oa,ta,ya,
Fa,Ka,x,Ta,gb,vb,Ob,rc,cd,ve)}throw Error("Invalid arity: "+arguments.length);};x.a=pa;x.b=R;x.c=F;x.o=D;x.C=z;x.U=w;x.V=v;x.na=t;x.oa=r;x.ca=q;x.da=p;x.ea=n;x.fa=m;x.ga=l;x.ha=k;x.ia=h;x.ja=f;x.ka=e;x.la=d;x.ma=c;x.Bb=b;x.cb=a;return x}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.u=function(){return this.g.u?this.g.u():this.g.call(null)};g.a=function(a){return this.g.a?this.g.a(a):this.g.call(null,a)};
g.b=function(a,b){return this.g.b?this.g.b(a,b):this.g.call(null,a,b)};g.c=function(a,b,c){return this.g.c?this.g.c(a,b,c):this.g.call(null,a,b,c)};g.o=function(a,b,c,d){return this.g.o?this.g.o(a,b,c,d):this.g.call(null,a,b,c,d)};g.C=function(a,b,c,d,e){return this.g.C?this.g.C(a,b,c,d,e):this.g.call(null,a,b,c,d,e)};g.U=function(a,b,c,d,e,f){return this.g.U?this.g.U(a,b,c,d,e,f):this.g.call(null,a,b,c,d,e,f)};
g.V=function(a,b,c,d,e,f,h){return this.g.V?this.g.V(a,b,c,d,e,f,h):this.g.call(null,a,b,c,d,e,f,h)};g.na=function(a,b,c,d,e,f,h,k){return this.g.na?this.g.na(a,b,c,d,e,f,h,k):this.g.call(null,a,b,c,d,e,f,h,k)};g.oa=function(a,b,c,d,e,f,h,k,l){return this.g.oa?this.g.oa(a,b,c,d,e,f,h,k,l):this.g.call(null,a,b,c,d,e,f,h,k,l)};g.ca=function(a,b,c,d,e,f,h,k,l,m){return this.g.ca?this.g.ca(a,b,c,d,e,f,h,k,l,m):this.g.call(null,a,b,c,d,e,f,h,k,l,m)};
g.da=function(a,b,c,d,e,f,h,k,l,m,n){return this.g.da?this.g.da(a,b,c,d,e,f,h,k,l,m,n):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n)};g.ea=function(a,b,c,d,e,f,h,k,l,m,n,p){return this.g.ea?this.g.ea(a,b,c,d,e,f,h,k,l,m,n,p):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p)};g.fa=function(a,b,c,d,e,f,h,k,l,m,n,p,q){return this.g.fa?this.g.fa(a,b,c,d,e,f,h,k,l,m,n,p,q):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q)};
g.ga=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r){return this.g.ga?this.g.ga(a,b,c,d,e,f,h,k,l,m,n,p,q,r):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r)};g.ha=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){return this.g.ha?this.g.ha(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t)};g.ia=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){return this.g.ia?this.g.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)};
g.ja=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w){return this.g.ja?this.g.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)};g.ka=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){return this.g.ka?this.g.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)};
g.la=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D){return this.g.la?this.g.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D)};g.ma=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F){return this.g.ma?this.g.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F)};
g.Bb=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F,R){return Pa.cb?Pa.cb(this.g,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F,R):Pa.call(null,this.g,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F,R)};function Cc(a,b){return"function"==u(a)?new Yc(a,b):null==a?null:pb(a,b)}function Zc(a){var b=null!=a;return(b?null!=a?a.i&131072||a.Ub||(a.i?0:B(nb,a)):B(nb,a):b)?ob(a):null}function $c(a){return null==a?!1:null!=a?a.i&8||a.nc?!0:a.i?!1:B(Ua,a):B(Ua,a)}
function ad(a){return null==a?!1:null!=a?a.i&4096||a.sc?!0:a.i?!1:B(jb,a):B(jb,a)}function bd(a){return null!=a?a.i&16777216||a.rc?!0:a.i?!1:B(xb,a):B(xb,a)}function dd(a){return null==a?!1:null!=a?a.i&1024||a.Sb?!0:a.i?!1:B(eb,a):B(eb,a)}function ed(a){return null!=a?a.i&16384||a.tc?!0:a.i?!1:B(kb,a):B(kb,a)}fd;gd;function hd(a){return null!=a?a.B&512||a.mc?!0:!1:!1}function id(a){var b=[];ia(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}
function jd(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var kd={};function ld(a){return null==a?!1:null!=a?a.i&64||a.Va?!0:a.i?!1:B(Xa,a):B(Xa,a)}function md(a){return null==a?!1:!1===a?!1:!0}function nd(a,b){return kc.c(a,b,kd)===kd?!1:!0}
function dc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return la(a,b);throw Error([E("Cannot compare "),E(a),E(" to "),E(b)].join(""));}if(null!=a?a.B&2048||a.bb||(a.B?0:B(Ib,a)):B(Ib,a))return Jb(a,b);if("string"!==typeof a&&!Ja(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([E("Cannot compare "),E(a),E(" to "),E(b)].join(""));return la(a,b)}
function od(a,b){var c=P(a),d=P(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=dc(Uc(a,d),Uc(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}pd;var O=function O(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return O.b(arguments[0],arguments[1]);case 3:return O.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
O.b=function(a,b){var c=J(b);if(c){var d=K(c),c=L(c);return Qa.c?Qa.c(a,d,c):Qa.call(null,a,d,c)}return a.u?a.u():a.call(null)};O.c=function(a,b,c){for(c=J(c);;)if(c){var d=K(c);b=a.b?a.b(b,d):a.call(null,b,d);if(Ec(b))return mb(b);c=L(c)}else return b};O.A=3;qd;
var Qa=function Qa(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Qa.b(arguments[0],arguments[1]);case 3:return Qa.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Qa.b=function(a,b){return null!=b&&(b.i&524288||b.Wb)?b.Z(null,a):Ja(b)?Hc(b,a):"string"===typeof b?Hc(b,a):B(qb,b)?rb.b(b,a):O.b(a,b)};
Qa.c=function(a,b,c){return null!=c&&(c.i&524288||c.Wb)?c.$(null,a,b):Ja(c)?Ic(c,a,b):"string"===typeof c?Ic(c,a,b):B(qb,c)?rb.c(c,a,b):O.c(a,b,c)};Qa.A=3;function rd(a){return a}var sd=function sd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return sd.u();case 1:return sd.a(arguments[0]);case 2:return sd.b(arguments[0],arguments[1]);default:return sd.m(arguments[0],arguments[1],new I(c.slice(2),0))}};sd.u=function(){return 0};sd.a=function(a){return a};
sd.b=function(a,b){return a+b};sd.m=function(a,b,c){return Qa.c(sd,a+b,c)};sd.G=function(a){var b=K(a),c=L(a);a=K(c);c=L(c);return sd.m(b,a,c)};sd.A=2;var td=function td(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return td.a(arguments[0]);case 2:return td.b(arguments[0],arguments[1]);default:return td.m(arguments[0],arguments[1],new I(c.slice(2),0))}};td.a=function(a){return-a};td.b=function(a,b){return a-b};
td.m=function(a,b,c){return Qa.c(td,a-b,c)};td.G=function(a){var b=K(a),c=L(a);a=K(c);c=L(c);return td.m(b,a,c)};td.A=2;var ud=function ud(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ud.u();case 1:return ud.a(arguments[0]);case 2:return ud.b(arguments[0],arguments[1]);default:return ud.m(arguments[0],arguments[1],new I(c.slice(2),0))}};ud.u=function(){return 1};ud.a=function(a){return a};ud.b=function(a,b){return a*b};
ud.m=function(a,b,c){return Qa.c(ud,a*b,c)};ud.G=function(a){var b=K(a),c=L(a);a=K(c);c=L(c);return ud.m(b,a,c)};ud.A=2;na.wc;var vd=function vd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return vd.a(arguments[0]);case 2:return vd.b(arguments[0],arguments[1]);default:return vd.m(arguments[0],arguments[1],new I(c.slice(2),0))}};vd.a=function(a){return 1/a};vd.b=function(a,b){return a/b};vd.m=function(a,b,c){return Qa.c(vd,a/b,c)};
vd.G=function(a){var b=K(a),c=L(a);a=K(c);c=L(c);return vd.m(b,a,c)};vd.A=2;wd;function wd(a,b){return(a%b+b)%b}function xd(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function yd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function zd(a,b){for(var c=b,d=J(a);;)if(d&&0<c)--c,d=L(d);else return d}
var E=function E(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return E.u();case 1:return E.a(arguments[0]);default:return E.m(arguments[0],new I(c.slice(1),0))}};E.u=function(){return""};E.a=function(a){return null==a?"":""+a};E.m=function(a,b){for(var c=new ja(""+E(a)),d=b;;)if(y(d))c=c.append(""+E(K(d))),d=L(d);else return c.toString()};E.G=function(a){var b=K(a);a=L(a);return E.m(b,a)};E.A=1;
function Ad(a,b){return a.substring(b)}Bd;Cd;function Bc(a,b){var c;if(bd(b))if(Nc(a)&&Nc(b)&&P(a)!==P(b))c=!1;else a:{c=J(a);for(var d=J(b);;){if(null==c){c=null==d;break a}if(null!=d&&cc.b(K(c),K(d)))c=L(c),d=L(d);else{c=!1;break a}}}else c=null;return md(c)}function Kc(a){if(J(a)){var b=hc(K(a));for(a=L(a);;){if(null==a)return b;b=ic(b,hc(K(a)));a=L(a)}}else return 0}Dd;Ed;Cd;Fd;Gd;function Mc(a,b,c,d,e){this.w=a;this.first=b;this.sa=c;this.count=d;this.s=e;this.i=65937646;this.B=8192}g=Mc.prototype;
g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.w};g.qa=function(){return 1===this.count?null:this.sa};g.X=function(){return this.count};g.N=function(){var a=this.s;return null!=a?a:this.s=a=wc(this)};g.v=function(a,b){return Bc(this,b)};g.Z=function(a,b){return O.b(b,this)};g.$=function(a,b,c){return O.c(b,c,this)};g.aa=function(){return this.first};g.ra=function(){return 1===this.count?pc:this.sa};g.S=function(){return this};
g.R=function(a,b){return new Mc(b,this.first,this.sa,this.count,this.s)};g.T=function(a,b){return new Mc(this.w,b,this,this.count+1,null)};Mc.prototype[Na]=function(){return sc(this)};function Hd(a){this.w=a;this.i=65937614;this.B=8192}g=Hd.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.w};g.qa=function(){return null};g.X=function(){return 0};g.N=function(){return xc};
g.v=function(a,b){return(null!=b?b.i&33554432||b.qc||(b.i?0:B(yb,b)):B(yb,b))||bd(b)?null==J(b):!1};g.Z=function(a,b){return O.b(b,this)};g.$=function(a,b,c){return O.c(b,c,this)};g.aa=function(){return null};g.ra=function(){return pc};g.S=function(){return null};g.R=function(a,b){return new Hd(b)};g.T=function(a,b){return new Mc(this.w,b,null,1,null)};var pc=new Hd(null);Hd.prototype[Na]=function(){return sc(this)};
var bc=function bc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return bc.m(0<c.length?new I(c.slice(0),0):null)};bc.m=function(a){var b;if(a instanceof I&&0===a.l)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.aa(null)),a=a.qa(null);else break a;a=b.length;for(var c=pc;;)if(0<a){var d=a-1,c=c.T(null,b[a-1]);a=d}else return c};bc.A=0;bc.G=function(a){return bc.m(J(a))};function Id(a,b,c,d){this.w=a;this.first=b;this.sa=c;this.s=d;this.i=65929452;this.B=8192}
g=Id.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.w};g.qa=function(){return null==this.sa?null:J(this.sa)};g.N=function(){var a=this.s;return null!=a?a:this.s=a=wc(this)};g.v=function(a,b){return Bc(this,b)};g.Z=function(a,b){return O.b(b,this)};g.$=function(a,b,c){return O.c(b,c,this)};g.aa=function(){return this.first};g.ra=function(){return null==this.sa?pc:this.sa};g.S=function(){return this};
g.R=function(a,b){return new Id(b,this.first,this.sa,this.s)};g.T=function(a,b){return new Id(null,b,this,this.s)};Id.prototype[Na]=function(){return sc(this)};function N(a,b){var c=null==b;return(c?c:null!=b&&(b.i&64||b.Va))?new Id(null,a,b,null):new Id(null,a,J(b),null)}function Jd(a,b){if(a.Da===b.Da)return 0;var c=La(a.pa);if(y(c?b.pa:c))return-1;if(y(a.pa)){if(La(b.pa))return 1;c=la(a.pa,b.pa);return 0===c?la(a.name,b.name):c}return la(a.name,b.name)}
function A(a,b,c,d){this.pa=a;this.name=b;this.Da=c;this.Sa=d;this.i=2153775105;this.B=4096}g=A.prototype;g.toString=function(){return[E(":"),E(this.Da)].join("")};g.equiv=function(a){return this.v(null,a)};g.v=function(a,b){return b instanceof A?this.Da===b.Da:!1};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return kc.b(c,this);case 3:return kc.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return kc.b(c,this)};a.c=function(a,c,d){return kc.c(c,this,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return kc.b(a,this)};g.b=function(a,b){return kc.c(a,this,b)};
g.N=function(){var a=this.Sa;return null!=a?a:this.Sa=a=ic(ac(this.name),gc(this.pa))+2654435769|0};g.gb=function(){return this.name};g.hb=function(){return this.pa};g.M=function(a,b){return zb(b,[E(":"),E(this.Da)].join(""))};var Kd=function Kd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Kd.a(arguments[0]);case 2:return Kd.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
Kd.a=function(a){if(a instanceof A)return a;if(a instanceof H){var b;if(null!=a&&(a.B&4096||a.Vb))b=a.hb(null);else throw Error([E("Doesn't support namespace: "),E(a)].join(""));return new A(b,Cd.a?Cd.a(a):Cd.call(null,a),a.Fa,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new A(b[0],b[1],a,null):new A(null,b[0],a,null)):null};Kd.b=function(a,b){return new A(a,b,[E(y(a)?[E(a),E("/")].join(""):null),E(b)].join(""),null)};Kd.A=2;
function Ld(a,b,c,d){this.w=a;this.Xa=b;this.D=c;this.s=d;this.i=32374988;this.B=0}g=Ld.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};function Md(a){null!=a.Xa&&(a.D=a.Xa.u?a.Xa.u():a.Xa.call(null),a.Xa=null);return a.D}g.O=function(){return this.w};g.qa=function(){wb(this);return null==this.D?null:L(this.D)};g.N=function(){var a=this.s;return null!=a?a:this.s=a=wc(this)};g.v=function(a,b){return Bc(this,b)};g.Z=function(a,b){return O.b(b,this)};
g.$=function(a,b,c){return O.c(b,c,this)};g.aa=function(){wb(this);return null==this.D?null:K(this.D)};g.ra=function(){wb(this);return null!=this.D?oc(this.D):pc};g.S=function(){Md(this);if(null==this.D)return null;for(var a=this.D;;)if(a instanceof Ld)a=Md(a);else return this.D=a,J(this.D)};g.R=function(a,b){return new Ld(b,this.Xa,this.D,this.s)};g.T=function(a,b){return N(b,this)};Ld.prototype[Na]=function(){return sc(this)};Nd;function Od(a,b){this.wb=a;this.end=b;this.i=2;this.B=0}
Od.prototype.add=function(a){this.wb[this.end]=a;return this.end+=1};Od.prototype.za=function(){var a=new Nd(this.wb,0,this.end);this.wb=null;return a};Od.prototype.X=function(){return this.end};function Nd(a,b,c){this.f=a;this.ba=b;this.end=c;this.i=524306;this.B=0}g=Nd.prototype;g.X=function(){return this.end-this.ba};g.W=function(a,b){return this.f[this.ba+b]};g.ta=function(a,b,c){return 0<=b&&b<this.end-this.ba?this.f[this.ba+b]:c};
g.Fb=function(){if(this.ba===this.end)throw Error("-drop-first of empty chunk");return new Nd(this.f,this.ba+1,this.end)};g.Z=function(a,b){return Jc(this.f,b,this.f[this.ba],this.ba+1)};g.$=function(a,b,c){return Jc(this.f,b,c,this.ba)};function fd(a,b,c,d){this.za=a;this.Ea=b;this.w=c;this.s=d;this.i=31850732;this.B=1536}g=fd.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.w};
g.qa=function(){if(1<Sa(this.za))return new fd(Kb(this.za),this.Ea,this.w,null);var a=wb(this.Ea);return null==a?null:a};g.N=function(){var a=this.s;return null!=a?a:this.s=a=wc(this)};g.v=function(a,b){return Bc(this,b)};g.aa=function(){return G.b(this.za,0)};g.ra=function(){return 1<Sa(this.za)?new fd(Kb(this.za),this.Ea,this.w,null):null==this.Ea?pc:this.Ea};g.S=function(){return this};g.zb=function(){return this.za};g.Ab=function(){return null==this.Ea?pc:this.Ea};
g.R=function(a,b){return new fd(this.za,this.Ea,b,this.s)};g.T=function(a,b){return N(b,this)};g.yb=function(){return null==this.Ea?null:this.Ea};fd.prototype[Na]=function(){return sc(this)};function Pd(a,b){return 0===Sa(a)?b:new fd(a,b,null,null)}function Qd(a,b){a.add(b)}function Fd(a){return Lb(a)}function Gd(a){return Mb(a)}function pd(a){for(var b=[];;)if(J(a))b.push(K(a)),a=L(a);else return b}
function Rd(a,b){if(Nc(a))return P(a);for(var c=a,d=b,e=0;;)if(0<d&&J(c))c=L(c),--d,e+=1;else return e}var Sd=function Sd(b){return null==b?null:null==L(b)?J(K(b)):N(K(b),Sd(L(b)))},Td=function Td(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Td.u();case 1:return Td.a(arguments[0]);case 2:return Td.b(arguments[0],arguments[1]);default:return Td.m(arguments[0],arguments[1],new I(c.slice(2),0))}};
Td.u=function(){return new Ld(null,function(){return null},null,null)};Td.a=function(a){return new Ld(null,function(){return a},null,null)};Td.b=function(a,b){return new Ld(null,function(){var c=J(a);return c?hd(c)?Pd(Lb(c),Td.b(Mb(c),b)):N(K(c),Td.b(oc(c),b)):b},null,null)};Td.m=function(a,b,c){return function e(a,b){return new Ld(null,function(){var c=J(a);return c?hd(c)?Pd(Lb(c),e(Mb(c),b)):N(K(c),e(oc(c),b)):y(b)?e(K(b),L(b)):null},null,null)}(Td.b(a,b),c)};
Td.G=function(a){var b=K(a),c=L(a);a=K(c);c=L(c);return Td.m(b,a,c)};Td.A=2;var Ud=function Ud(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Ud.u();case 1:return Ud.a(arguments[0]);case 2:return Ud.b(arguments[0],arguments[1]);default:return Ud.m(arguments[0],arguments[1],new I(c.slice(2),0))}};Ud.u=function(){return Db(Sc)};Ud.a=function(a){return a};Ud.b=function(a,b){return Eb(a,b)};
Ud.m=function(a,b,c){for(;;)if(a=Eb(a,b),y(c))b=K(c),c=L(c);else return a};Ud.G=function(a){var b=K(a),c=L(a);a=K(c);c=L(c);return Ud.m(b,a,c)};Ud.A=2;
function Vd(a,b,c){var d=J(c);if(0===b)return a.u?a.u():a.call(null);c=Ya(d);var e=Za(d);if(1===b)return a.a?a.a(c):a.a?a.a(c):a.call(null,c);var d=Ya(e),f=Za(e);if(2===b)return a.b?a.b(c,d):a.b?a.b(c,d):a.call(null,c,d);var e=Ya(f),h=Za(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=Ya(h),k=Za(h);if(4===b)return a.o?a.o(c,d,e,f):a.o?a.o(c,d,e,f):a.call(null,c,d,e,f);var h=Ya(k),l=Za(k);if(5===b)return a.C?a.C(c,d,e,f,h):a.C?a.C(c,d,e,f,h):a.call(null,c,d,e,f,h);var k=Ya(l),
m=Za(l);if(6===b)return a.U?a.U(c,d,e,f,h,k):a.U?a.U(c,d,e,f,h,k):a.call(null,c,d,e,f,h,k);var l=Ya(m),n=Za(m);if(7===b)return a.V?a.V(c,d,e,f,h,k,l):a.V?a.V(c,d,e,f,h,k,l):a.call(null,c,d,e,f,h,k,l);var m=Ya(n),p=Za(n);if(8===b)return a.na?a.na(c,d,e,f,h,k,l,m):a.na?a.na(c,d,e,f,h,k,l,m):a.call(null,c,d,e,f,h,k,l,m);var n=Ya(p),q=Za(p);if(9===b)return a.oa?a.oa(c,d,e,f,h,k,l,m,n):a.oa?a.oa(c,d,e,f,h,k,l,m,n):a.call(null,c,d,e,f,h,k,l,m,n);var p=Ya(q),r=Za(q);if(10===b)return a.ca?a.ca(c,d,e,f,h,
k,l,m,n,p):a.ca?a.ca(c,d,e,f,h,k,l,m,n,p):a.call(null,c,d,e,f,h,k,l,m,n,p);var q=Ya(r),t=Za(r);if(11===b)return a.da?a.da(c,d,e,f,h,k,l,m,n,p,q):a.da?a.da(c,d,e,f,h,k,l,m,n,p,q):a.call(null,c,d,e,f,h,k,l,m,n,p,q);var r=Ya(t),v=Za(t);if(12===b)return a.ea?a.ea(c,d,e,f,h,k,l,m,n,p,q,r):a.ea?a.ea(c,d,e,f,h,k,l,m,n,p,q,r):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r);var t=Ya(v),w=Za(v);if(13===b)return a.fa?a.fa(c,d,e,f,h,k,l,m,n,p,q,r,t):a.fa?a.fa(c,d,e,f,h,k,l,m,n,p,q,r,t):a.call(null,c,d,e,f,h,k,l,m,n,p,q,
r,t);var v=Ya(w),z=Za(w);if(14===b)return a.ga?a.ga(c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.ga?a.ga(c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v);var w=Ya(z),D=Za(z);if(15===b)return a.ha?a.ha(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.ha?a.ha(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w);var z=Ya(D),F=Za(D);if(16===b)return a.ia?a.ia(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.ia?a.ia(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z);var D=Ya(F),
R=Za(F);if(17===b)return a.ja?a.ja(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):a.ja?a.ja(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D);var F=Ya(R),pa=Za(R);if(18===b)return a.ka?a.ka(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F):a.ka?a.ka(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F);R=Ya(pa);pa=Za(pa);if(19===b)return a.la?a.la(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F,R):a.la?a.la(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F,R):a.call(null,c,d,e,f,h,k,
l,m,n,p,q,r,t,v,w,z,D,F,R);var x=Ya(pa);Za(pa);if(20===b)return a.ma?a.ma(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F,R,x):a.ma?a.ma(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F,R,x):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F,R,x);throw Error("Only up to 20 arguments supported on functions");}
var Pa=function Pa(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Pa.b(arguments[0],arguments[1]);case 3:return Pa.c(arguments[0],arguments[1],arguments[2]);case 4:return Pa.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Pa.C(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return Pa.m(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new I(c.slice(5),0))}};
Pa.b=function(a,b){var c=a.A;if(a.G){var d=Rd(b,c+1);return d<=c?Vd(a,d,b):a.G(b)}return a.apply(a,pd(b))};Pa.c=function(a,b,c){b=N(b,c);c=a.A;if(a.G){var d=Rd(b,c+1);return d<=c?Vd(a,d,b):a.G(b)}return a.apply(a,pd(b))};Pa.o=function(a,b,c,d){b=N(b,N(c,d));c=a.A;return a.G?(d=Rd(b,c+1),d<=c?Vd(a,d,b):a.G(b)):a.apply(a,pd(b))};Pa.C=function(a,b,c,d,e){b=N(b,N(c,N(d,e)));c=a.A;return a.G?(d=Rd(b,c+1),d<=c?Vd(a,d,b):a.G(b)):a.apply(a,pd(b))};
Pa.m=function(a,b,c,d,e,f){b=N(b,N(c,N(d,N(e,Sd(f)))));c=a.A;return a.G?(d=Rd(b,c+1),d<=c?Vd(a,d,b):a.G(b)):a.apply(a,pd(b))};Pa.G=function(a){var b=K(a),c=L(a);a=K(c);var d=L(c),c=K(d),e=L(d),d=K(e),f=L(e),e=K(f),f=L(f);return Pa.m(b,a,c,d,e,f)};Pa.A=5;
var Wd=function Wd(){"undefined"===typeof qa&&(qa=function(b,c){this.ic=b;this.hc=c;this.i=393216;this.B=0},qa.prototype.R=function(b,c){return new qa(this.ic,c)},qa.prototype.O=function(){return this.hc},qa.prototype.ua=function(){return!1},qa.prototype.next=function(){return Error("No such element")},qa.prototype.remove=function(){return Error("Unsupported operation")},qa.fc=function(){return new V(null,2,5,X,[Cc(Xd,new xa(null,1,[Yd,bc(Zd,bc(Sc))],null)),na.vc],null)},qa.Cb=!0,qa.lb="cljs.core/t_cljs$core14789",
qa.Lb=function(b,c){return zb(c,"cljs.core/t_cljs$core14789")});return new qa(Wd,$d)};ae;function ae(a,b,c,d){this.$a=a;this.first=b;this.sa=c;this.w=d;this.i=31719628;this.B=0}g=ae.prototype;g.R=function(a,b){return new ae(this.$a,this.first,this.sa,b)};g.T=function(a,b){return N(b,wb(this))};g.v=function(a,b){return null!=wb(this)?Bc(this,b):bd(b)&&null==J(b)};g.N=function(){return wc(this)};g.S=function(){null!=this.$a&&this.$a.step(this);return null==this.sa?null:this};
g.aa=function(){null!=this.$a&&wb(this);return null==this.sa?null:this.first};g.ra=function(){null!=this.$a&&wb(this);return null==this.sa?pc:this.sa};g.qa=function(){null!=this.$a&&wb(this);return null==this.sa?null:wb(this.sa)};ae.prototype[Na]=function(){return sc(this)};function be(a,b){for(;;){if(null==J(b))return!0;var c;c=K(b);c=a.a?a.a(c):a.call(null,c);if(y(c)){c=a;var d=L(b);a=c;b=d}else return!1}}
function ce(a){for(var b=rd;;)if(J(a)){var c;c=K(a);c=b.a?b.a(c):b.call(null,c);if(y(c))return c;a=L(a)}else return null}
function de(a){return function(){function b(b,c){return La(a.b?a.b(b,c):a.call(null,b,c))}function c(b){return La(a.a?a.a(b):a.call(null,b))}function d(){return La(a.u?a.u():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new I(h,0)}return c.call(this,a,d,f)}function c(b,d,e){return La(Pa.o(a,b,d,e))}b.A=2;b.G=function(a){var b=K(a);a=L(a);var d=K(a);a=oc(a);return c(b,d,a)};b.m=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new I(n,0)}return f.m(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.A=2;e.G=f.G;e.u=d;e.a=c;e.b=b;e.m=f.m;return e}()}ee;function fe(a,b,c,d){this.state=a;this.w=b;this.lc=c;this.tb=d;this.B=16386;this.i=6455296}g=fe.prototype;
g.equiv=function(a){return this.v(null,a)};g.v=function(a,b){return this===b};g.rb=function(){return this.state};g.O=function(){return this.w};g.Jb=function(a,b,c){a=J(this.tb);for(var d=null,e=0,f=0;;)if(f<e){var h=d.W(null,f),k=T(h,0),h=T(h,1);h.o?h.o(k,this,b,c):h.call(null,k,this,b,c);f+=1}else if(a=J(a))hd(a)?(d=Lb(a),a=Mb(a),k=d,e=P(d),d=k):(d=K(a),k=T(d,0),h=T(d,1),h.o?h.o(k,this,b,c):h.call(null,k,this,b,c),a=L(a),d=null,e=0),f=0;else return null};
g.Ib=function(a,b,c){this.tb=Wc.c(this.tb,b,c);return this};g.N=function(){return this[ca]||(this[ca]=++ea)};var ge=function ge(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ge.a(arguments[0]);default:return ge.m(arguments[0],new I(c.slice(1),0))}};ge.a=function(a){return new fe(a,null,null,null)};ge.m=function(a,b){var c=null!=b&&(b.i&64||b.Va)?Pa.b(Ac,b):b,d=kc.b(c,Ba),c=kc.b(c,he);return new fe(a,d,c,null)};
ge.G=function(a){var b=K(a);a=L(a);return ge.m(b,a)};ge.A=1;ie;function je(a,b){if(a instanceof fe){var c=a.lc;if(null!=c&&!y(c.a?c.a(b):c.call(null,b)))throw Error([E("Assert failed: "),E("Validator rejected reference state"),E("\n"),E(function(){var a=bc(ke,le);return ie.a?ie.a(a):ie.call(null,a)}())].join(""));c=a.state;a.state=b;null!=a.tb&&Bb(a,c,b);return b}return Rb(a,b)}
var me=function me(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return me.b(arguments[0],arguments[1]);case 3:return me.c(arguments[0],arguments[1],arguments[2]);case 4:return me.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:return me.m(arguments[0],arguments[1],arguments[2],arguments[3],new I(c.slice(4),0))}};me.b=function(a,b){var c;a instanceof fe?(c=a.state,c=b.a?b.a(c):b.call(null,c),c=je(a,c)):c=Sb.b(a,b);return c};
me.c=function(a,b,c){if(a instanceof fe){var d=a.state;b=b.b?b.b(d,c):b.call(null,d,c);a=je(a,b)}else a=Sb.c(a,b,c);return a};me.o=function(a,b,c,d){if(a instanceof fe){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=je(a,b)}else a=Sb.o(a,b,c,d);return a};me.m=function(a,b,c,d,e){return a instanceof fe?je(a,Pa.C(b,a.state,c,d,e)):Sb.C(a,b,c,d,e)};me.G=function(a){var b=K(a),c=L(a);a=K(c);var d=L(c),c=K(d),e=L(d),d=K(e),e=L(e);return me.m(b,a,c,d,e)};me.A=4;
function ne(a){this.state=a;this.i=32768;this.B=0}ne.prototype.rb=function(){return this.state};function ee(a){return new ne(a)}
var Bd=function Bd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Bd.a(arguments[0]);case 2:return Bd.b(arguments[0],arguments[1]);case 3:return Bd.c(arguments[0],arguments[1],arguments[2]);case 4:return Bd.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Bd.m(arguments[0],arguments[1],arguments[2],arguments[3],new I(c.slice(4),0))}};
Bd.a=function(a){return function(b){return function(){function c(c,d){var e=a.a?a.a(d):a.call(null,d);return b.b?b.b(c,e):b.call(null,c,e)}function d(a){return b.a?b.a(a):b.call(null,a)}function e(){return b.u?b.u():b.call(null)}var f=null,h=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new I(h,0)}return d.call(this,a,b,f)}function d(c,e,f){e=Pa.c(a,e,f);return b.b?b.b(c,e):b.call(null,c,e)}c.A=2;c.G=function(a){var b=
K(a);a=L(a);var c=K(a);a=oc(a);return d(b,c,a)};c.m=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new I(p,0)}return h.m(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.A=2;f.G=h.G;f.u=e;f.a=d;f.b=c;f.m=h.m;return f}()}};
Bd.b=function(a,b){return new Ld(null,function(){var c=J(b);if(c){if(hd(c)){for(var d=Lb(c),e=P(d),f=new Od(Array(e),0),h=0;;)if(h<e)Qd(f,function(){var b=G.b(d,h);return a.a?a.a(b):a.call(null,b)}()),h+=1;else break;return Pd(f.za(),Bd.b(a,Mb(c)))}return N(function(){var b=K(c);return a.a?a.a(b):a.call(null,b)}(),Bd.b(a,oc(c)))}return null},null,null)};
Bd.c=function(a,b,c){return new Ld(null,function(){var d=J(b),e=J(c);if(d&&e){var f=N,h;h=K(d);var k=K(e);h=a.b?a.b(h,k):a.call(null,h,k);d=f(h,Bd.c(a,oc(d),oc(e)))}else d=null;return d},null,null)};Bd.o=function(a,b,c,d){return new Ld(null,function(){var e=J(b),f=J(c),h=J(d);if(e&&f&&h){var k=N,l;l=K(e);var m=K(f),n=K(h);l=a.c?a.c(l,m,n):a.call(null,l,m,n);e=k(l,Bd.o(a,oc(e),oc(f),oc(h)))}else e=null;return e},null,null)};
Bd.m=function(a,b,c,d,e){var f=function k(a){return new Ld(null,function(){var b=Bd.b(J,a);return be(rd,b)?N(Bd.b(K,b),k(Bd.b(oc,b))):null},null,null)};return Bd.b(function(){return function(b){return Pa.b(a,b)}}(f),f(Rc.m(e,d,mc([c,b],0))))};Bd.G=function(a){var b=K(a),c=L(a);a=K(c);var d=L(c),c=K(d),e=L(d),d=K(e),e=L(e);return Bd.m(b,a,c,d,e)};Bd.A=4;
function oe(a,b){if("number"!==typeof a)throw Error([E("Assert failed: "),E(function(){var a=bc(pe,qe);return ie.a?ie.a(a):ie.call(null,a)}())].join(""));return new Ld(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=J(b);if(0<a&&e){var f=a-1,e=oc(e);a=f;b=e}else return e}}),null,null)}function re(a,b){return Bd.c(function(a){return a},b,oe(a,b))}function se(a,b){for(var c=J(b),d=J(oe(a,b));;)if(d)c=L(c),d=L(d);else return c}te;
function ue(a,b){return new Ld(null,function(){var c=J(b);if(c){if(hd(c)){for(var d=Lb(c),e=P(d),f=new Od(Array(e),0),h=0;;)if(h<e){var k;k=G.b(d,h);k=a.a?a.a(k):a.call(null,k);y(k)&&(k=G.b(d,h),f.add(k));h+=1}else break;return Pd(f.za(),ue(a,Mb(c)))}d=K(c);c=oc(c);return y(a.a?a.a(d):a.call(null,d))?N(d,ue(a,c)):ue(a,c)}return null},null,null)}
function we(a){return function c(a){return new Ld(null,function(){var e=N,f;y(ld.a?ld.a(a):ld.call(null,a))?(f=mc([J.a?J.a(a):J.call(null,a)],0),f=Pa.b(Td,Pa.c(Bd,c,f))):f=null;return e(a,f)},null,null)}(a)}function xe(a,b){this.K=a;this.f=b}function ye(a){return new xe(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function ze(a){a=a.j;return 32>a?0:a-1>>>5<<5}
function Ae(a,b,c){for(;;){if(0===b)return c;var d=ye(a);d.f[0]=c;c=d;b-=5}}var Be=function Be(b,c,d,e){var f=new xe(d.K,Oa(d.f)),h=b.j-1>>>c&31;5===c?f.f[h]=e:(d=d.f[h],b=null!=d?Be(b,c-5,d,e):Ae(null,c-5,e),f.f[h]=b);return f};function Ce(a,b){throw Error([E("No item "),E(a),E(" in vector of length "),E(b)].join(""));}function De(a,b){if(b>=ze(a))return a.I;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}function Ee(a,b){return 0<=b&&b<a.j?De(a,b):Ce(b,a.j)}
var Fe=function Fe(b,c,d,e,f){var h=new xe(d.K,Oa(d.f));if(0===c)h.f[e&31]=f;else{var k=e>>>c&31;b=Fe(b,c-5,d.f[k],e,f);h.f[k]=b}return h};function Ge(a,b,c,d,e,f){this.l=a;this.vb=b;this.f=c;this.Ga=d;this.start=e;this.end=f}Ge.prototype.ua=function(){return this.l<this.end};Ge.prototype.next=function(){32===this.l-this.vb&&(this.f=De(this.Ga,this.l),this.vb+=32);var a=this.f[this.l&31];this.l+=1;return a};He;Ie;Je;M;Ke;Le;Me;
function V(a,b,c,d,e,f){this.w=a;this.j=b;this.shift=c;this.root=d;this.I=e;this.s=f;this.i=167668511;this.B=8196}g=V.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.J=function(a,b){return bb.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};g.W=function(a,b){return Ee(this,b)[b&31]};g.ta=function(a,b,c){return 0<=b&&b<this.j?De(this,b)[b&31]:c};
g.Oa=function(a,b,c){if(0<=b&&b<this.j)return ze(this)<=b?(a=Oa(this.I),a[b&31]=c,new V(this.w,this.j,this.shift,this.root,a,null)):new V(this.w,this.j,this.shift,Fe(this,this.shift,this.root,b,c),this.I,null);if(b===this.j)return Va(this,c);throw Error([E("Index "),E(b),E(" out of bounds  [0,"),E(this.j),E("]")].join(""));};g.Ha=function(){var a=this.j;return new Ge(0,0,0<P(this)?De(this,0):null,this,0,a)};g.O=function(){return this.w};g.X=function(){return this.j};
g.eb=function(){return G.b(this,0)};g.fb=function(){return G.b(this,1)};g.N=function(){var a=this.s;return null!=a?a:this.s=a=wc(this)};g.v=function(a,b){if(b instanceof V)if(this.j===P(b))for(var c=Tb(this),d=Tb(b);;)if(y(c.ua())){var e=c.next(),f=d.next();if(!cc.b(e,f))return!1}else return!0;else return!1;else return Bc(this,b)};g.Ua=function(){return new Je(this.j,this.shift,He.a?He.a(this.root):He.call(null,this.root),Ie.a?Ie.a(this.I):Ie.call(null,this.I))};g.Z=function(a,b){return Fc(this,b)};
g.$=function(a,b,c){a=0;for(var d=c;;)if(a<this.j){var e=De(this,a);c=e.length;a:for(var f=0;;)if(f<c){var h=e[f],d=b.b?b.b(d,h):b.call(null,d,h);if(Ec(d)){e=d;break a}f+=1}else{e=d;break a}if(Ec(e))return M.a?M.a(e):M.call(null,e);a+=c;d=e}else return d};g.Na=function(a,b,c){if("number"===typeof b)return lb(this,b,c);throw Error("Vector's key for assoc must be a number.");};
g.S=function(){if(0===this.j)return null;if(32>=this.j)return new I(this.I,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return Me.o?Me.o(this,a,0,0):Me.call(null,this,a,0,0)};g.R=function(a,b){return new V(b,this.j,this.shift,this.root,this.I,this.s)};
g.T=function(a,b){if(32>this.j-ze(this)){for(var c=this.I.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.I[e],e+=1;else break;d[c]=b;return new V(this.w,this.j+1,this.shift,this.root,d,null)}c=(d=this.j>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=ye(null),d.f[0]=this.root,e=Ae(null,this.shift,new xe(null,this.I)),d.f[1]=e):d=Be(this,this.shift,this.root,new xe(null,this.I));return new V(this.w,this.j+1,c,d,[b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.W(null,c);case 3:return this.ta(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.W(null,c)};a.c=function(a,c,d){return this.ta(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.W(null,a)};g.b=function(a,b){return this.ta(null,a,b)};
var X=new xe(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),Sc=new V(null,0,5,X,[],xc);V.prototype[Na]=function(){return sc(this)};function qd(a){if(Ja(a))a:{var b=a.length;if(32>b)a=new V(null,b,5,X,a,null);else for(var c=32,d=(new V(null,32,5,X,a.slice(0,32),null)).Ua(null);;)if(c<b)var e=c+1,d=Ud.b(d,a[c]),c=e;else{a=Fb(d);break a}}else a=Fb(Qa.c(Eb,Db(Sc),a));return a}Ne;
function gd(a,b,c,d,e,f){this.xa=a;this.node=b;this.l=c;this.ba=d;this.w=e;this.s=f;this.i=32375020;this.B=1536}g=gd.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.w};g.qa=function(){if(this.ba+1<this.node.length){var a;a=this.xa;var b=this.node,c=this.l,d=this.ba+1;a=Me.o?Me.o(a,b,c,d):Me.call(null,a,b,c,d);return null==a?null:a}return Nb(this)};g.N=function(){var a=this.s;return null!=a?a:this.s=a=wc(this)};
g.v=function(a,b){return Bc(this,b)};g.Z=function(a,b){var c;c=this.xa;var d=this.l+this.ba,e=P(this.xa);c=Ne.c?Ne.c(c,d,e):Ne.call(null,c,d,e);return Fc(c,b)};g.$=function(a,b,c){a=this.xa;var d=this.l+this.ba,e=P(this.xa);a=Ne.c?Ne.c(a,d,e):Ne.call(null,a,d,e);return Gc(a,b,c)};g.aa=function(){return this.node[this.ba]};g.ra=function(){if(this.ba+1<this.node.length){var a;a=this.xa;var b=this.node,c=this.l,d=this.ba+1;a=Me.o?Me.o(a,b,c,d):Me.call(null,a,b,c,d);return null==a?pc:a}return Mb(this)};
g.S=function(){return this};g.zb=function(){var a=this.node;return new Nd(a,this.ba,a.length)};g.Ab=function(){var a=this.l+this.node.length;if(a<Sa(this.xa)){var b=this.xa,c=De(this.xa,a);return Me.o?Me.o(b,c,a,0):Me.call(null,b,c,a,0)}return pc};g.R=function(a,b){return Me.C?Me.C(this.xa,this.node,this.l,this.ba,b):Me.call(null,this.xa,this.node,this.l,this.ba,b)};g.T=function(a,b){return N(b,this)};
g.yb=function(){var a=this.l+this.node.length;if(a<Sa(this.xa)){var b=this.xa,c=De(this.xa,a);return Me.o?Me.o(b,c,a,0):Me.call(null,b,c,a,0)}return null};gd.prototype[Na]=function(){return sc(this)};
var Me=function Me(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Me.c(arguments[0],arguments[1],arguments[2]);case 4:return Me.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Me.C(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Me.c=function(a,b,c){return new gd(a,Ee(a,b),b,c,null,null)};
Me.o=function(a,b,c,d){return new gd(a,b,c,d,null,null)};Me.C=function(a,b,c,d,e){return new gd(a,b,c,d,e,null)};Me.A=5;Oe;function Pe(a,b,c,d,e){this.w=a;this.Ga=b;this.start=c;this.end=d;this.s=e;this.i=167666463;this.B=8192}g=Pe.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.J=function(a,b){return bb.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};
g.W=function(a,b){return 0>b||this.end<=this.start+b?Ce(b,this.end-this.start):G.b(this.Ga,this.start+b)};g.ta=function(a,b,c){return 0>b||this.end<=this.start+b?c:G.c(this.Ga,this.start+b,c)};g.Oa=function(a,b,c){var d=this.start+b;a=this.w;c=Wc.c(this.Ga,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return Oe.C?Oe.C(a,c,b,d,null):Oe.call(null,a,c,b,d,null)};g.O=function(){return this.w};g.X=function(){return this.end-this.start};g.N=function(){var a=this.s;return null!=a?a:this.s=a=wc(this)};
g.v=function(a,b){return Bc(this,b)};g.Z=function(a,b){return Fc(this,b)};g.$=function(a,b,c){return Gc(this,b,c)};g.Na=function(a,b,c){if("number"===typeof b)return lb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};g.S=function(){var a=this;return function(b){return function d(e){return e===a.end?null:N(G.b(a.Ga,e),new Ld(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};
g.R=function(a,b){return Oe.C?Oe.C(b,this.Ga,this.start,this.end,this.s):Oe.call(null,b,this.Ga,this.start,this.end,this.s)};g.T=function(a,b){var c=this.w,d=lb(this.Ga,this.end,b),e=this.start,f=this.end+1;return Oe.C?Oe.C(c,d,e,f,null):Oe.call(null,c,d,e,f,null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.W(null,c);case 3:return this.ta(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.W(null,c)};a.c=function(a,c,d){return this.ta(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.W(null,a)};g.b=function(a,b){return this.ta(null,a,b)};Pe.prototype[Na]=function(){return sc(this)};
function Oe(a,b,c,d,e){for(;;)if(b instanceof Pe)c=b.start+c,d=b.start+d,b=b.Ga;else{var f=P(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new Pe(a,b,c,d,e)}}var Ne=function Ne(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ne.b(arguments[0],arguments[1]);case 3:return Ne.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
Ne.b=function(a,b){return Ne.c(a,b,P(a))};Ne.c=function(a,b,c){return Oe(null,a,b,c,null)};Ne.A=3;function Qe(a,b){return a===b.K?b:new xe(a,Oa(b.f))}function He(a){return new xe({},Oa(a.f))}function Ie(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];jd(a,0,b,0,a.length);return b}
var Re=function Re(b,c,d,e){d=Qe(b.root.K,d);var f=b.j-1>>>c&31;if(5===c)b=e;else{var h=d.f[f];b=null!=h?Re(b,c-5,h,e):Ae(b.root.K,c-5,e)}d.f[f]=b;return d};function Je(a,b,c,d){this.j=a;this.shift=b;this.root=c;this.I=d;this.B=88;this.i=275}g=Je.prototype;
g.jb=function(a,b){if(this.root.K){if(32>this.j-ze(this))this.I[this.j&31]=b;else{var c=new xe(this.root.K,this.I),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.I=d;if(this.j>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=Ae(this.root.K,this.shift,c);this.root=new xe(this.root.K,d);this.shift=e}else this.root=Re(this,this.shift,this.root,c)}this.j+=1;return this}throw Error("conj! after persistent!");};g.kb=function(){if(this.root.K){this.root.K=null;var a=this.j-ze(this),b=Array(a);jd(this.I,0,b,0,a);return new V(null,this.j,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
g.ib=function(a,b,c){if("number"===typeof b)return Hb(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
g.Hb=function(a,b,c){var d=this;if(d.root.K){if(0<=b&&b<d.j)return ze(this)<=b?d.I[b&31]=c:(a=function(){return function f(a,k){var l=Qe(d.root.K,k);if(0===a)l.f[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.j)return Eb(this,c);throw Error([E("Index "),E(b),E(" out of bounds for TransientVector of length"),E(d.j)].join(""));}throw Error("assoc! after persistent!");};
g.X=function(){if(this.root.K)return this.j;throw Error("count after persistent!");};g.W=function(a,b){if(this.root.K)return Ee(this,b)[b&31];throw Error("nth after persistent!");};g.ta=function(a,b,c){return 0<=b&&b<this.j?G.b(this,b):c};g.J=function(a,b){return bb.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};function Se(){this.i=2097152;this.B=0}
Se.prototype.equiv=function(a){return this.v(null,a)};Se.prototype.v=function(){return!1};var Te=new Se;function Ue(a,b){return md(dd(b)?P(a)===P(b)?be(rd,Bd.b(function(a){return cc.b(kc.c(b,K(a),Te),K(L(a)))},a)):null:null)}function Ve(a){this.D=a}Ve.prototype.next=function(){if(null!=this.D){var a=K(this.D),b=T(a,0),a=T(a,1);this.D=L(this.D);return{value:[b,a],done:!1}}return{value:null,done:!0}};function We(a){return new Ve(J(a))}function Xe(a){this.D=a}
Xe.prototype.next=function(){if(null!=this.D){var a=K(this.D);this.D=L(this.D);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function Ye(a,b){var c;if(b instanceof A)a:{c=a.length;for(var d=b.Da,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof A&&d===a[e].Da){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof H)a:for(c=a.length,d=b.Fa,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof H&&d===a[e].Fa){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(cc.b(b,a[d])){c=d;break a}d+=2}return c}Ze;function $e(a,b,c){this.f=a;this.l=b;this.ya=c;this.i=32374990;this.B=0}g=$e.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.ya};g.qa=function(){return this.l<this.f.length-2?new $e(this.f,this.l+2,this.ya):null};g.X=function(){return(this.f.length-this.l)/2};g.N=function(){return wc(this)};g.v=function(a,b){return Bc(this,b)};
g.Z=function(a,b){return O.b(b,this)};g.$=function(a,b,c){return O.c(b,c,this)};g.aa=function(){return new V(null,2,5,X,[this.f[this.l],this.f[this.l+1]],null)};g.ra=function(){return this.l<this.f.length-2?new $e(this.f,this.l+2,this.ya):pc};g.S=function(){return this};g.R=function(a,b){return new $e(this.f,this.l,b)};g.T=function(a,b){return N(b,this)};$e.prototype[Na]=function(){return sc(this)};af;bf;function cf(a,b,c){this.f=a;this.l=b;this.j=c}cf.prototype.ua=function(){return this.l<this.j};
cf.prototype.next=function(){var a=new V(null,2,5,X,[this.f[this.l],this.f[this.l+1]],null);this.l+=2;return a};function xa(a,b,c,d){this.w=a;this.j=b;this.f=c;this.s=d;this.i=16647951;this.B=8196}g=xa.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.keys=function(){return sc(af.a?af.a(this):af.call(null,this))};g.entries=function(){return We(J(this))};g.values=function(){return sc(bf.a?bf.a(this):bf.call(null,this))};g.has=function(a){return nd(this,a)};
g.get=function(a,b){return this.H(null,a,b)};g.forEach=function(a){for(var b=J(this),c=null,d=0,e=0;;)if(e<d){var f=c.W(null,e),h=T(f,0),f=T(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=J(b))hd(b)?(c=Lb(b),b=Mb(b),h=c,d=P(c),c=h):(c=K(b),h=T(c,0),f=T(c,1),a.b?a.b(f,h):a.call(null,f,h),b=L(b),c=null,d=0),e=0;else return null};g.J=function(a,b){return bb.c(this,b,null)};g.H=function(a,b,c){a=Ye(this.f,b);return-1===a?c:this.f[a+1]};g.Ha=function(){return new cf(this.f,0,2*this.j)};g.O=function(){return this.w};
g.X=function(){return this.j};g.N=function(){var a=this.s;return null!=a?a:this.s=a=yc(this)};g.v=function(a,b){if(null!=b&&(b.i&1024||b.Sb)){var c=this.f.length;if(this.j===b.X(null))for(var d=0;;)if(d<c){var e=b.H(null,this.f[d],kd);if(e!==kd)if(cc.b(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return Ue(this,b)};g.Ua=function(){return new Ze({},this.f.length,Oa(this.f))};g.Z=function(a,b){return O.b(b,this)};g.$=function(a,b,c){return O.c(b,c,this)};
g.Na=function(a,b,c){a=Ye(this.f,b);if(-1===a){if(this.j<df){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new xa(this.w,this.j+1,e,null)}a=ef;null!=a?null!=a&&(a.B&4||a.oc)?(d=Qa.c(Eb,Db(a),this),d=Fb(d),a=Cc(d,Zc(a))):a=Qa.c(Va,a,this):a=Qa.c(Rc,pc,this);return pb(db(a,b,c),this.w)}if(c===this.f[a+1])return this;b=Oa(this.f);b[a+1]=c;return new xa(this.w,this.j,b,null)};g.xb=function(a,b){return-1!==Ye(this.f,b)};
g.S=function(){var a=this.f;return 0<=a.length-2?new $e(a,0,null):null};g.R=function(a,b){return new xa(b,this.j,this.f,this.s)};g.T=function(a,b){if(ed(b))return db(this,G.b(b,0),G.b(b,1));for(var c=this,d=J(b);;){if(null==d)return c;var e=K(d);if(ed(e))c=db(c,G.b(e,0),G.b(e,1)),d=L(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};var $d=new xa(null,0,[],zc),df=8;xa.prototype[Na]=function(){return sc(this)};
ff;function Ze(a,b,c){this.Wa=a;this.Ra=b;this.f=c;this.i=258;this.B=56}g=Ze.prototype;g.X=function(){if(y(this.Wa))return xd(this.Ra);throw Error("count after persistent!");};g.J=function(a,b){return bb.c(this,b,null)};g.H=function(a,b,c){if(y(this.Wa))return a=Ye(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
g.jb=function(a,b){if(y(this.Wa)){if(null!=b?b.i&2048||b.Tb||(b.i?0:B(fb,b)):B(fb,b))return Gb(this,Dd.a?Dd.a(b):Dd.call(null,b),Ed.a?Ed.a(b):Ed.call(null,b));for(var c=J(b),d=this;;){var e=K(c);if(y(e))c=L(c),d=Gb(d,Dd.a?Dd.a(e):Dd.call(null,e),Ed.a?Ed.a(e):Ed.call(null,e));else return d}}else throw Error("conj! after persistent!");};g.kb=function(){if(y(this.Wa))return this.Wa=!1,new xa(null,xd(this.Ra),this.f,null);throw Error("persistent! called twice");};
g.ib=function(a,b,c){if(y(this.Wa)){a=Ye(this.f,b);if(-1===a){if(this.Ra+2<=2*df)return this.Ra+=2,this.f.push(b),this.f.push(c),this;a=ff.b?ff.b(this.Ra,this.f):ff.call(null,this.Ra,this.f);return Gb(a,b,c)}c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};gf;Vc;function ff(a,b){for(var c=Db(ef),d=0;;)if(d<a)c=Gb(c,b[d],b[d+1]),d+=2;else return c}function hf(){this.L=!1}jf;kf;je;lf;ge;M;
function mf(a,b){return a===b?!0:a===b||a instanceof A&&b instanceof A&&a.Da===b.Da?!0:cc.b(a,b)}function nf(a,b,c){a=Oa(a);a[b]=c;return a}function of(a,b,c,d){a=a.Pa(b);a.f[c]=d;return a}pf;function qf(a,b,c,d){this.f=a;this.l=b;this.pb=c;this.Ca=d}qf.prototype.advance=function(){for(var a=this.f.length;;)if(this.l<a){var b=this.f[this.l],c=this.f[this.l+1];null!=b?b=this.pb=new V(null,2,5,X,[b,c],null):null!=c?(b=Tb(c),b=b.ua()?this.Ca=b:!1):b=!1;this.l+=2;if(b)return!0}else return!1};
qf.prototype.ua=function(){var a=null!=this.pb;return a?a:(a=null!=this.Ca)?a:this.advance()};qf.prototype.next=function(){if(null!=this.pb){var a=this.pb;this.pb=null;return a}if(null!=this.Ca)return a=this.Ca.next(),this.Ca.ua()||(this.Ca=null),a;if(this.advance())return this.next();throw Error("No such element");};qf.prototype.remove=function(){return Error("Unsupported operation")};function rf(a,b,c){this.K=a;this.Y=b;this.f=c}g=rf.prototype;
g.Pa=function(a){if(a===this.K)return this;var b=yd(this.Y),c=Array(0>b?4:2*(b+1));jd(this.f,0,c,0,2*b);return new rf(a,this.Y,c)};g.nb=function(){return jf.a?jf.a(this.f):jf.call(null,this.f)};g.Ka=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.Y&e))return d;var f=yd(this.Y&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.Ka(a+5,b,c,d):mf(c,e)?f:d};
g.Ba=function(a,b,c,d,e,f){var h=1<<(c>>>b&31),k=yd(this.Y&h-1);if(0===(this.Y&h)){var l=yd(this.Y);if(2*l<this.f.length){a=this.Pa(a);b=a.f;f.L=!0;a:for(c=2*(l-k),f=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*k]=d;b[2*k+1]=e;a.Y|=h;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=sf.Ba(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.Y>>>d&1)&&(k[d]=null!=this.f[e]?sf.Ba(a,b+5,hc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new pf(a,l+1,k)}b=Array(2*(l+4));jd(this.f,0,b,0,2*k);b[2*k]=d;b[2*k+1]=e;jd(this.f,2*k,b,2*(k+1),2*(l-k));f.L=!0;a=this.Pa(a);a.f=b;a.Y|=h;return a}l=this.f[2*k];h=this.f[2*k+1];if(null==l)return l=h.Ba(a,b+5,c,d,e,f),l===h?this:of(this,a,2*k+1,l);if(mf(d,l))return e===h?this:of(this,a,2*k+1,e);f.L=!0;f=b+5;d=lf.V?lf.V(a,f,l,h,c,d,e):lf.call(null,a,f,l,h,c,d,e);e=2*k;
k=2*k+1;a=this.Pa(a);a.f[e]=null;a.f[k]=d;return a};
g.Aa=function(a,b,c,d,e){var f=1<<(b>>>a&31),h=yd(this.Y&f-1);if(0===(this.Y&f)){var k=yd(this.Y);if(16<=k){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[b>>>a&31]=sf.Aa(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.Y>>>c&1)&&(h[c]=null!=this.f[d]?sf.Aa(a+5,hc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new pf(null,k+1,h)}a=Array(2*(k+1));jd(this.f,
0,a,0,2*h);a[2*h]=c;a[2*h+1]=d;jd(this.f,2*h,a,2*(h+1),2*(k-h));e.L=!0;return new rf(null,this.Y|f,a)}var l=this.f[2*h],f=this.f[2*h+1];if(null==l)return k=f.Aa(a+5,b,c,d,e),k===f?this:new rf(null,this.Y,nf(this.f,2*h+1,k));if(mf(c,l))return d===f?this:new rf(null,this.Y,nf(this.f,2*h+1,d));e.L=!0;e=this.Y;k=this.f;a+=5;a=lf.U?lf.U(a,l,f,b,c,d):lf.call(null,a,l,f,b,c,d);c=2*h;h=2*h+1;d=Oa(k);d[c]=null;d[h]=a;return new rf(null,e,d)};g.Ha=function(){return new qf(this.f,0,null,null)};
var sf=new rf(null,0,[]);function tf(a,b,c){this.f=a;this.l=b;this.Ca=c}tf.prototype.ua=function(){for(var a=this.f.length;;){if(null!=this.Ca&&this.Ca.ua())return!0;if(this.l<a){var b=this.f[this.l];this.l+=1;null!=b&&(this.Ca=Tb(b))}else return!1}};tf.prototype.next=function(){if(this.ua())return this.Ca.next();throw Error("No such element");};tf.prototype.remove=function(){return Error("Unsupported operation")};function pf(a,b,c){this.K=a;this.j=b;this.f=c}g=pf.prototype;
g.Pa=function(a){return a===this.K?this:new pf(a,this.j,Oa(this.f))};g.nb=function(){return kf.a?kf.a(this.f):kf.call(null,this.f)};g.Ka=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.Ka(a+5,b,c,d):d};g.Ba=function(a,b,c,d,e,f){var h=c>>>b&31,k=this.f[h];if(null==k)return a=of(this,a,h,sf.Ba(a,b+5,c,d,e,f)),a.j+=1,a;b=k.Ba(a,b+5,c,d,e,f);return b===k?this:of(this,a,h,b)};
g.Aa=function(a,b,c,d,e){var f=b>>>a&31,h=this.f[f];if(null==h)return new pf(null,this.j+1,nf(this.f,f,sf.Aa(a+5,b,c,d,e)));a=h.Aa(a+5,b,c,d,e);return a===h?this:new pf(null,this.j,nf(this.f,f,a))};g.Ha=function(){return new tf(this.f,0,null)};function uf(a,b,c){b*=2;for(var d=0;;)if(d<b){if(mf(c,a[d]))return d;d+=2}else return-1}function vf(a,b,c,d){this.K=a;this.Ja=b;this.j=c;this.f=d}g=vf.prototype;
g.Pa=function(a){if(a===this.K)return this;var b=Array(2*(this.j+1));jd(this.f,0,b,0,2*this.j);return new vf(a,this.Ja,this.j,b)};g.nb=function(){return jf.a?jf.a(this.f):jf.call(null,this.f)};g.Ka=function(a,b,c,d){a=uf(this.f,this.j,c);return 0>a?d:mf(c,this.f[a])?this.f[a+1]:d};
g.Ba=function(a,b,c,d,e,f){if(c===this.Ja){b=uf(this.f,this.j,d);if(-1===b){if(this.f.length>2*this.j)return b=2*this.j,c=2*this.j+1,a=this.Pa(a),a.f[b]=d,a.f[c]=e,f.L=!0,a.j+=1,a;c=this.f.length;b=Array(c+2);jd(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.L=!0;d=this.j+1;a===this.K?(this.f=b,this.j=d,a=this):a=new vf(this.K,this.Ja,d,b);return a}return this.f[b+1]===e?this:of(this,a,b+1,e)}return(new rf(a,1<<(this.Ja>>>b&31),[null,this,null,null])).Ba(a,b,c,d,e,f)};
g.Aa=function(a,b,c,d,e){return b===this.Ja?(a=uf(this.f,this.j,c),-1===a?(a=2*this.j,b=Array(a+2),jd(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.L=!0,new vf(null,this.Ja,this.j+1,b)):cc.b(this.f[a],d)?this:new vf(null,this.Ja,this.j,nf(this.f,a+1,d))):(new rf(null,1<<(this.Ja>>>a&31),[null,this])).Aa(a,b,c,d,e)};g.Ha=function(){return new qf(this.f,0,null,null)};
var lf=function lf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return lf.U(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return lf.V(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
lf.U=function(a,b,c,d,e,f){var h=hc(b);if(h===d)return new vf(null,h,2,[b,c,e,f]);var k=new hf;return sf.Aa(a,h,b,c,k).Aa(a,d,e,f,k)};lf.V=function(a,b,c,d,e,f,h){var k=hc(c);if(k===e)return new vf(null,k,2,[c,d,f,h]);var l=new hf;return sf.Ba(a,b,k,c,d,l).Ba(a,b,e,f,h,l)};lf.A=7;function wf(a,b,c,d,e){this.w=a;this.La=b;this.l=c;this.D=d;this.s=e;this.i=32374860;this.B=0}g=wf.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.w};
g.N=function(){var a=this.s;return null!=a?a:this.s=a=wc(this)};g.v=function(a,b){return Bc(this,b)};g.Z=function(a,b){return O.b(b,this)};g.$=function(a,b,c){return O.c(b,c,this)};g.aa=function(){return null==this.D?new V(null,2,5,X,[this.La[this.l],this.La[this.l+1]],null):K(this.D)};g.ra=function(){if(null==this.D){var a=this.La,b=this.l+2;return jf.c?jf.c(a,b,null):jf.call(null,a,b,null)}var a=this.La,b=this.l,c=L(this.D);return jf.c?jf.c(a,b,c):jf.call(null,a,b,c)};g.S=function(){return this};
g.R=function(a,b){return new wf(b,this.La,this.l,this.D,this.s)};g.T=function(a,b){return N(b,this)};wf.prototype[Na]=function(){return sc(this)};var jf=function jf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return jf.a(arguments[0]);case 3:return jf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};jf.a=function(a){return jf.c(a,0,null)};
jf.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new wf(null,a,b,null,null);var d=a[b+1];if(y(d)&&(d=d.nb(),y(d)))return new wf(null,a,b+2,d,null);b+=2}else return null;else return new wf(null,a,b,c,null)};jf.A=3;function xf(a,b,c,d,e){this.w=a;this.La=b;this.l=c;this.D=d;this.s=e;this.i=32374860;this.B=0}g=xf.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.w};
g.N=function(){var a=this.s;return null!=a?a:this.s=a=wc(this)};g.v=function(a,b){return Bc(this,b)};g.Z=function(a,b){return O.b(b,this)};g.$=function(a,b,c){return O.c(b,c,this)};g.aa=function(){return K(this.D)};g.ra=function(){var a=this.La,b=this.l,c=L(this.D);return kf.o?kf.o(null,a,b,c):kf.call(null,null,a,b,c)};g.S=function(){return this};g.R=function(a,b){return new xf(b,this.La,this.l,this.D,this.s)};g.T=function(a,b){return N(b,this)};xf.prototype[Na]=function(){return sc(this)};
var kf=function kf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return kf.a(arguments[0]);case 4:return kf.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};kf.a=function(a){return kf.o(null,a,0,null)};
kf.o=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(y(e)&&(e=e.nb(),y(e)))return new xf(a,b,c+1,e,null);c+=1}else return null;else return new xf(a,b,c,d,null)};kf.A=4;gf;function yf(a,b,c){this.wa=a;this.Mb=b;this.Db=c}yf.prototype.ua=function(){return this.Db&&this.Mb.ua()};yf.prototype.next=function(){if(this.Db)return this.Mb.next();this.Db=!0;return this.wa};yf.prototype.remove=function(){return Error("Unsupported operation")};
function Vc(a,b,c,d,e,f){this.w=a;this.j=b;this.root=c;this.va=d;this.wa=e;this.s=f;this.i=16123663;this.B=8196}g=Vc.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.keys=function(){return sc(af.a?af.a(this):af.call(null,this))};g.entries=function(){return We(J(this))};g.values=function(){return sc(bf.a?bf.a(this):bf.call(null,this))};g.has=function(a){return nd(this,a)};g.get=function(a,b){return this.H(null,a,b)};
g.forEach=function(a){for(var b=J(this),c=null,d=0,e=0;;)if(e<d){var f=c.W(null,e),h=T(f,0),f=T(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=J(b))hd(b)?(c=Lb(b),b=Mb(b),h=c,d=P(c),c=h):(c=K(b),h=T(c,0),f=T(c,1),a.b?a.b(f,h):a.call(null,f,h),b=L(b),c=null,d=0),e=0;else return null};g.J=function(a,b){return bb.c(this,b,null)};g.H=function(a,b,c){return null==b?this.va?this.wa:c:null==this.root?c:this.root.Ka(0,hc(b),b,c)};
g.Ha=function(){var a=this.root?Tb(this.root):Wd;return this.va?new yf(this.wa,a,!1):a};g.O=function(){return this.w};g.X=function(){return this.j};g.N=function(){var a=this.s;return null!=a?a:this.s=a=yc(this)};g.v=function(a,b){return Ue(this,b)};g.Ua=function(){return new gf({},this.root,this.j,this.va,this.wa)};
g.Na=function(a,b,c){if(null==b)return this.va&&c===this.wa?this:new Vc(this.w,this.va?this.j:this.j+1,this.root,!0,c,null);a=new hf;b=(null==this.root?sf:this.root).Aa(0,hc(b),b,c,a);return b===this.root?this:new Vc(this.w,a.L?this.j+1:this.j,b,this.va,this.wa,null)};g.xb=function(a,b){return null==b?this.va:null==this.root?!1:this.root.Ka(0,hc(b),b,kd)!==kd};g.S=function(){if(0<this.j){var a=null!=this.root?this.root.nb():null;return this.va?N(new V(null,2,5,X,[null,this.wa],null),a):a}return null};
g.R=function(a,b){return new Vc(b,this.j,this.root,this.va,this.wa,this.s)};g.T=function(a,b){if(ed(b))return db(this,G.b(b,0),G.b(b,1));for(var c=this,d=J(b);;){if(null==d)return c;var e=K(d);if(ed(e))c=db(c,G.b(e,0),G.b(e,1)),d=L(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};var ef=new Vc(null,0,null,!1,null,zc);
function Xc(a,b){for(var c=a.length,d=0,e=Db(ef);;)if(d<c)var f=d+1,e=e.ib(null,a[d],b[d]),d=f;else return Fb(e)}Vc.prototype[Na]=function(){return sc(this)};function gf(a,b,c,d,e){this.K=a;this.root=b;this.count=c;this.va=d;this.wa=e;this.i=258;this.B=56}function zf(a,b,c){if(a.K){if(null==b)a.wa!==c&&(a.wa=c),a.va||(a.count+=1,a.va=!0);else{var d=new hf;b=(null==a.root?sf:a.root).Ba(a.K,0,hc(b),b,c,d);b!==a.root&&(a.root=b);d.L&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}g=gf.prototype;
g.X=function(){if(this.K)return this.count;throw Error("count after persistent!");};g.J=function(a,b){return null==b?this.va?this.wa:null:null==this.root?null:this.root.Ka(0,hc(b),b)};g.H=function(a,b,c){return null==b?this.va?this.wa:c:null==this.root?c:this.root.Ka(0,hc(b),b,c)};
g.jb=function(a,b){var c;a:if(this.K)if(null!=b?b.i&2048||b.Tb||(b.i?0:B(fb,b)):B(fb,b))c=zf(this,Dd.a?Dd.a(b):Dd.call(null,b),Ed.a?Ed.a(b):Ed.call(null,b));else{c=J(b);for(var d=this;;){var e=K(c);if(y(e))c=L(c),d=zf(d,Dd.a?Dd.a(e):Dd.call(null,e),Ed.a?Ed.a(e):Ed.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};g.kb=function(){var a;if(this.K)this.K=null,a=new Vc(null,this.count,this.root,this.va,this.wa,null);else throw Error("persistent! called twice");return a};
g.ib=function(a,b,c){return zf(this,b,c)};Af;Bf;function Bf(a,b,c,d,e){this.key=a;this.L=b;this.left=c;this.right=d;this.s=e;this.i=32402207;this.B=0}g=Bf.prototype;g.replace=function(a,b,c,d){return new Bf(a,b,c,d,null)};g.J=function(a,b){return G.c(this,b,null)};g.H=function(a,b,c){return G.c(this,b,c)};g.W=function(a,b){return 0===b?this.key:1===b?this.L:null};g.ta=function(a,b,c){return 0===b?this.key:1===b?this.L:c};
g.Oa=function(a,b,c){return(new V(null,2,5,X,[this.key,this.L],null)).Oa(null,b,c)};g.O=function(){return null};g.X=function(){return 2};g.eb=function(){return this.key};g.fb=function(){return this.L};g.N=function(){var a=this.s;return null!=a?a:this.s=a=wc(this)};g.v=function(a,b){return Bc(this,b)};g.Z=function(a,b){return Fc(this,b)};g.$=function(a,b,c){return Gc(this,b,c)};g.Na=function(a,b,c){return Wc.c(new V(null,2,5,X,[this.key,this.L],null),b,c)};g.S=function(){return Va(Va(pc,this.L),this.key)};
g.R=function(a,b){return Cc(new V(null,2,5,X,[this.key,this.L],null),b)};g.T=function(a,b){return new V(null,3,5,X,[this.key,this.L,b],null)};g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};
g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};Bf.prototype[Na]=function(){return sc(this)};function Af(a,b,c,d,e){this.key=a;this.L=b;this.left=c;this.right=d;this.s=e;this.i=32402207;this.B=0}g=Af.prototype;g.replace=function(a,b,c,d){return new Af(a,b,c,d,null)};g.J=function(a,b){return G.c(this,b,null)};g.H=function(a,b,c){return G.c(this,b,c)};g.W=function(a,b){return 0===b?this.key:1===b?this.L:null};
g.ta=function(a,b,c){return 0===b?this.key:1===b?this.L:c};g.Oa=function(a,b,c){return(new V(null,2,5,X,[this.key,this.L],null)).Oa(null,b,c)};g.O=function(){return null};g.X=function(){return 2};g.eb=function(){return this.key};g.fb=function(){return this.L};g.N=function(){var a=this.s;return null!=a?a:this.s=a=wc(this)};g.v=function(a,b){return Bc(this,b)};g.Z=function(a,b){return Fc(this,b)};g.$=function(a,b,c){return Gc(this,b,c)};
g.Na=function(a,b,c){return Wc.c(new V(null,2,5,X,[this.key,this.L],null),b,c)};g.S=function(){return Va(Va(pc,this.L),this.key)};g.R=function(a,b){return Cc(new V(null,2,5,X,[this.key,this.L],null),b)};g.T=function(a,b){return new V(null,3,5,X,[this.key,this.L,b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};Af.prototype[Na]=function(){return sc(this)};Dd;
var Ac=function Ac(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Ac.m(0<c.length?new I(c.slice(0),0):null)};Ac.m=function(a){for(var b=J(a),c=Db(ef);;)if(b){a=L(L(b));var d=K(b),b=K(L(b)),c=Gb(c,d,b),b=a}else return Fb(c)};Ac.A=0;Ac.G=function(a){return Ac.m(J(a))};function Cf(a,b){this.F=a;this.ya=b;this.i=32374988;this.B=0}g=Cf.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.ya};
g.qa=function(){var a=(null!=this.F?this.F.i&128||this.F.sb||(this.F.i?0:B($a,this.F)):B($a,this.F))?this.F.qa(null):L(this.F);return null==a?null:new Cf(a,this.ya)};g.N=function(){return wc(this)};g.v=function(a,b){return Bc(this,b)};g.Z=function(a,b){return O.b(b,this)};g.$=function(a,b,c){return O.c(b,c,this)};g.aa=function(){return this.F.aa(null).eb(null)};
g.ra=function(){var a=(null!=this.F?this.F.i&128||this.F.sb||(this.F.i?0:B($a,this.F)):B($a,this.F))?this.F.qa(null):L(this.F);return null!=a?new Cf(a,this.ya):pc};g.S=function(){return this};g.R=function(a,b){return new Cf(this.F,b)};g.T=function(a,b){return N(b,this)};Cf.prototype[Na]=function(){return sc(this)};function af(a){return(a=J(a))?new Cf(a,null):null}function Dd(a){return hb(a)}function Df(a,b){this.F=a;this.ya=b;this.i=32374988;this.B=0}g=Df.prototype;g.toString=function(){return Vb(this)};
g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.ya};g.qa=function(){var a=(null!=this.F?this.F.i&128||this.F.sb||(this.F.i?0:B($a,this.F)):B($a,this.F))?this.F.qa(null):L(this.F);return null==a?null:new Df(a,this.ya)};g.N=function(){return wc(this)};g.v=function(a,b){return Bc(this,b)};g.Z=function(a,b){return O.b(b,this)};g.$=function(a,b,c){return O.c(b,c,this)};g.aa=function(){return this.F.aa(null).fb(null)};
g.ra=function(){var a=(null!=this.F?this.F.i&128||this.F.sb||(this.F.i?0:B($a,this.F)):B($a,this.F))?this.F.qa(null):L(this.F);return null!=a?new Df(a,this.ya):pc};g.S=function(){return this};g.R=function(a,b){return new Df(this.F,b)};g.T=function(a,b){return N(b,this)};Df.prototype[Na]=function(){return sc(this)};function bf(a){return(a=J(a))?new Df(a,null):null}function Ed(a){return ib(a)}
var Ef=function Ef(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Ef.m(0<c.length?new I(c.slice(0),0):null)};Ef.m=function(a){return y(ce(a))?Qa.b(function(a,c){return Rc.b(y(a)?a:$d,c)},a):null};Ef.A=0;Ef.G=function(a){return Ef.m(J(a))};Ff;function Gf(a){this.Ya=a}Gf.prototype.ua=function(){return this.Ya.ua()};Gf.prototype.next=function(){if(this.Ya.ua())return this.Ya.next().I[0];throw Error("No such element");};Gf.prototype.remove=function(){return Error("Unsupported operation")};
function Hf(a,b,c){this.w=a;this.Qa=b;this.s=c;this.i=15077647;this.B=8196}g=Hf.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.keys=function(){return sc(J(this))};g.entries=function(){var a=J(this);return new Xe(J(a))};g.values=function(){return sc(J(this))};g.has=function(a){return nd(this,a)};
g.forEach=function(a){for(var b=J(this),c=null,d=0,e=0;;)if(e<d){var f=c.W(null,e),h=T(f,0),f=T(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=J(b))hd(b)?(c=Lb(b),b=Mb(b),h=c,d=P(c),c=h):(c=K(b),h=T(c,0),f=T(c,1),a.b?a.b(f,h):a.call(null,f,h),b=L(b),c=null,d=0),e=0;else return null};g.J=function(a,b){return bb.c(this,b,null)};g.H=function(a,b,c){return cb(this.Qa,b)?b:c};g.Ha=function(){return new Gf(Tb(this.Qa))};g.O=function(){return this.w};g.X=function(){return Sa(this.Qa)};
g.N=function(){var a=this.s;return null!=a?a:this.s=a=yc(this)};g.v=function(a,b){return ad(b)&&P(this)===P(b)&&be(function(a){return function(b){return nd(a,b)}}(this),b)};g.Ua=function(){return new Ff(Db(this.Qa))};g.S=function(){return af(this.Qa)};g.R=function(a,b){return new Hf(b,this.Qa,this.s)};g.T=function(a,b){return new Hf(this.w,Wc.c(this.Qa,b,null),null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};Hf.prototype[Na]=function(){return sc(this)};
function Ff(a){this.Ia=a;this.B=136;this.i=259}g=Ff.prototype;g.jb=function(a,b){this.Ia=Gb(this.Ia,b,null);return this};g.kb=function(){return new Hf(null,Fb(this.Ia),null)};g.X=function(){return P(this.Ia)};g.J=function(a,b){return bb.c(this,b,null)};g.H=function(a,b,c){return bb.c(this.Ia,b,kd)===kd?c:b};
g.call=function(){function a(a,b,c){return bb.c(this.Ia,b,kd)===kd?c:b}function b(a,b){return bb.c(this.Ia,b,kd)===kd?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return bb.c(this.Ia,a,kd)===kd?null:a};g.b=function(a,b){return bb.c(this.Ia,a,kd)===kd?b:a};
function Cd(a){if(null!=a&&(a.B&4096||a.Vb))return a.gb(null);if("string"===typeof a)return a;throw Error([E("Doesn't support name: "),E(a)].join(""));}function If(a,b){if("string"===typeof b){var c=a.exec(b);return cc.b(K(c),b)?1===P(c)?K(c):qd(c):null}throw new TypeError("re-matches must match against a string.");}function Jf(a,b){if("string"===typeof b){var c=a.exec(b);return null==c?null:1===P(c)?K(c):qd(c)}throw new TypeError("re-find must match against a string.");}
var Kf=function Kf(b,c){var d=Jf(b,c),e=c.search(b),f=$c(d)?K(d):d,h=Ad(c,e+P(f));return y(d)?new Ld(null,function(c,d,e,f){return function(){return N(c,J(f)?Kf(b,f):null)}}(d,e,f,h),null,null):null};
function Ke(a,b,c,d,e,f,h){var k=ua;ua=null==ua?null:ua-1;try{if(null!=ua&&0>ua)return zb(a,"#");zb(a,c);if(0===Ea.a(f))J(h)&&zb(a,function(){var a=Lf.a(f);return y(a)?a:"..."}());else{if(J(h)){var l=K(h);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var m=L(h),n=Ea.a(f)-1;;)if(!m||null!=n&&0===n){J(m)&&0===n&&(zb(a,d),zb(a,function(){var a=Lf.a(f);return y(a)?a:"..."}()));break}else{zb(a,d);var p=K(m);c=a;h=f;b.c?b.c(p,c,h):b.call(null,p,c,h);var q=L(m);c=n-1;m=q;n=c}}return zb(a,e)}finally{ua=k}}
function Mf(a,b){for(var c=J(b),d=null,e=0,f=0;;)if(f<e){var h=d.W(null,f);zb(a,h);f+=1}else if(c=J(c))d=c,hd(d)?(c=Lb(d),e=Mb(d),d=c,h=P(c),c=e,e=h):(h=K(d),zb(a,h),c=L(d),d=null,e=0),f=0;else return null}var Nf={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Of(a){return[E('"'),E(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Nf[a]})),E('"')].join("")}Pf;
function Qf(a,b){var c=md(kc.b(a,Ba));return c?(c=null!=b?b.i&131072||b.Ub?!0:!1:!1)?null!=Zc(b):c:c}
function Rf(a,b,c){if(null==a)return zb(b,"nil");if(Qf(c,a)){zb(b,"^");var d=Zc(a);Le.c?Le.c(d,b,c):Le.call(null,d,b,c);zb(b," ")}if(a.Cb)return a.Lb(a,b,c);if(null!=a&&(a.i&2147483648||a.P))return a.M(null,b,c);if(!0===a||!1===a||"number"===typeof a)return zb(b,""+E(a));if(null!=a&&a.constructor===Object)return zb(b,"#js "),d=Bd.b(function(b){return new V(null,2,5,X,[Kd.a(b),a[b]],null)},id(a)),Pf.o?Pf.o(d,Le,b,c):Pf.call(null,d,Le,b,c);if(Ja(a))return Ke(b,Le,"#js ["," ","]",c,a);if("string"==typeof a)return y(Aa.a(c))?
zb(b,Of(a)):zb(b,a);if("function"==u(a)){var e=a.name;c=y(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Mf(b,mc(["#object[",c,' "',""+E(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+E(a);;)if(P(c)<b)c=[E("0"),E(c)].join("");else return c},Mf(b,mc(['#inst "',""+E(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),
3),"-",'00:00"'],0));if(a instanceof RegExp)return Mf(b,mc(['#"',a.source,'"'],0));if(null!=a&&(a.i&2147483648||a.P))return Ab(a,b,c);if(y(a.constructor.lb))return Mf(b,mc(["#object[",a.constructor.lb.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=y(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Mf(b,mc(["#object[",c," ",""+E(a),"]"],0))}function Le(a,b,c){var d=Sf.a(c);return y(d)?(c=Wc.c(c,Tf,Rf),d.c?d.c(a,b,c):d.call(null,a,b,c)):Rf(a,b,c)}
var ie=function ie(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return ie.m(0<c.length?new I(c.slice(0),0):null)};ie.m=function(a){var b=wa();if(null==a||La(J(a)))b="";else{var c=E,d=new ja;a:{var e=new Ub(d);Le(K(a),e,b);a=J(L(a));for(var f=null,h=0,k=0;;)if(k<h){var l=f.W(null,k);zb(e," ");Le(l,e,b);k+=1}else if(a=J(a))f=a,hd(f)?(a=Lb(f),h=Mb(f),f=a,l=P(a),a=h,h=l):(l=K(f),zb(e," "),Le(l,e,b),a=L(f),f=null,h=0),k=0;else break a}b=""+c(d)}return b};ie.A=0;
ie.G=function(a){return ie.m(J(a))};function Pf(a,b,c,d){return Ke(c,function(a,c,d){var k=hb(a);b.c?b.c(k,c,d):b.call(null,k,c,d);zb(c," ");a=ib(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,J(a))}ne.prototype.P=!0;ne.prototype.M=function(a,b,c){zb(b,"#object [cljs.core.Volatile ");Le(new xa(null,1,[Uf,this.state],null),b,c);return zb(b,"]")};I.prototype.P=!0;I.prototype.M=function(a,b,c){return Ke(b,Le,"("," ",")",c,this)};Ld.prototype.P=!0;
Ld.prototype.M=function(a,b,c){return Ke(b,Le,"("," ",")",c,this)};wf.prototype.P=!0;wf.prototype.M=function(a,b,c){return Ke(b,Le,"("," ",")",c,this)};Bf.prototype.P=!0;Bf.prototype.M=function(a,b,c){return Ke(b,Le,"["," ","]",c,this)};$e.prototype.P=!0;$e.prototype.M=function(a,b,c){return Ke(b,Le,"("," ",")",c,this)};uc.prototype.P=!0;uc.prototype.M=function(a,b,c){return Ke(b,Le,"("," ",")",c,this)};gd.prototype.P=!0;gd.prototype.M=function(a,b,c){return Ke(b,Le,"("," ",")",c,this)};
Id.prototype.P=!0;Id.prototype.M=function(a,b,c){return Ke(b,Le,"("," ",")",c,this)};Lc.prototype.P=!0;Lc.prototype.M=function(a,b,c){return Ke(b,Le,"("," ",")",c,this)};Vc.prototype.P=!0;Vc.prototype.M=function(a,b,c){return Pf(this,Le,b,c)};xf.prototype.P=!0;xf.prototype.M=function(a,b,c){return Ke(b,Le,"("," ",")",c,this)};Pe.prototype.P=!0;Pe.prototype.M=function(a,b,c){return Ke(b,Le,"["," ","]",c,this)};Hf.prototype.P=!0;Hf.prototype.M=function(a,b,c){return Ke(b,Le,"#{"," ","}",c,this)};
fd.prototype.P=!0;fd.prototype.M=function(a,b,c){return Ke(b,Le,"("," ",")",c,this)};fe.prototype.P=!0;fe.prototype.M=function(a,b,c){zb(b,"#object [cljs.core.Atom ");Le(new xa(null,1,[Uf,this.state],null),b,c);return zb(b,"]")};Df.prototype.P=!0;Df.prototype.M=function(a,b,c){return Ke(b,Le,"("," ",")",c,this)};Af.prototype.P=!0;Af.prototype.M=function(a,b,c){return Ke(b,Le,"["," ","]",c,this)};V.prototype.P=!0;V.prototype.M=function(a,b,c){return Ke(b,Le,"["," ","]",c,this)};Hd.prototype.P=!0;
Hd.prototype.M=function(a,b){return zb(b,"()")};ae.prototype.P=!0;ae.prototype.M=function(a,b,c){return Ke(b,Le,"("," ",")",c,this)};xa.prototype.P=!0;xa.prototype.M=function(a,b,c){return Pf(this,Le,b,c)};Cf.prototype.P=!0;Cf.prototype.M=function(a,b,c){return Ke(b,Le,"("," ",")",c,this)};Mc.prototype.P=!0;Mc.prototype.M=function(a,b,c){return Ke(b,Le,"("," ",")",c,this)};H.prototype.bb=!0;
H.prototype.Ta=function(a,b){if(b instanceof H)return jc(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};A.prototype.bb=!0;A.prototype.Ta=function(a,b){if(b instanceof A)return Jd(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};Pe.prototype.bb=!0;Pe.prototype.Ta=function(a,b){if(ed(b))return od(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};V.prototype.bb=!0;
V.prototype.Ta=function(a,b){if(ed(b))return od(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};function Vf(a){return function(b,c){var d=a.b?a.b(b,c):a.call(null,b,c);return Ec(d)?new Dc(d):d}}
function te(a){return function(b){return function(){function c(a,c){return Qa.c(b,a,c)}function d(b){return a.a?a.a(b):a.call(null,b)}function e(){return a.u?a.u():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.u=e;f.a=d;f.b=c;return f}()}(Vf(a))}Wf;function Xf(){}
var Yf=function Yf(b){if(null!=b&&null!=b.Qb)return b.Qb(b);var c=Yf[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Yf._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IEncodeJS.-clj-\x3ejs",b);};Zf;function $f(a){return(null!=a?a.Pb||(a.cc?0:B(Xf,a)):B(Xf,a))?Yf(a):"string"===typeof a||"number"===typeof a||a instanceof A||a instanceof H?Zf.a?Zf.a(a):Zf.call(null,a):ie.m(mc([a],0))}
var Zf=function Zf(b){if(null==b)return null;if(null!=b?b.Pb||(b.cc?0:B(Xf,b)):B(Xf,b))return Yf(b);if(b instanceof A)return Cd(b);if(b instanceof H)return""+E(b);if(dd(b)){var c={};b=J(b);for(var d=null,e=0,f=0;;)if(f<e){var h=d.W(null,f),k=T(h,0),h=T(h,1);c[$f(k)]=Zf(h);f+=1}else if(b=J(b))hd(b)?(e=Lb(b),b=Mb(b),d=e,e=P(e)):(e=K(b),d=T(e,0),e=T(e,1),c[$f(d)]=Zf(e),b=L(b),d=null,e=0),f=0;else break;return c}if($c(b)){c=[];b=J(Bd.b(Zf,b));d=null;for(f=e=0;;)if(f<e)k=d.W(null,f),c.push(k),f+=1;else if(b=
J(b))d=b,hd(d)?(b=Lb(d),f=Mb(d),d=b,e=P(b),b=f):(b=K(d),c.push(b),b=L(d),d=null,e=0),f=0;else break;return c}return b},Wf=function Wf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Wf.u();case 1:return Wf.a(arguments[0]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Wf.u=function(){return Wf.a(1)};Wf.a=function(a){return Math.random()*a};Wf.A=1;var ag=null;
function bg(){if(null==ag){var a=new xa(null,3,[cg,$d,dg,$d,eg,$d],null);ag=ge.a?ge.a(a):ge.call(null,a)}return ag}function fg(a,b,c){var d=cc.b(b,c);if(!d&&!(d=nd(eg.a(a).call(null,b),c))&&(d=ed(c))&&(d=ed(b)))if(d=P(c)===P(b))for(var d=!0,e=0;;)if(d&&e!==P(c))d=fg(a,b.a?b.a(e):b.call(null,e),c.a?c.a(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function hg(a){var b;b=bg();b=M.a?M.a(b):M.call(null,b);a=kc.b(cg.a(b),a);return J(a)?a:null}
function ig(a,b,c,d){me.b(a,function(){return M.a?M.a(b):M.call(null,b)});me.b(c,function(){return M.a?M.a(d):M.call(null,d)})}var jg=function jg(b,c,d){var e=(M.a?M.a(d):M.call(null,d)).call(null,b),e=y(y(e)?e.a?e.a(c):e.call(null,c):e)?!0:null;if(y(e))return e;e=function(){for(var e=hg(c);;)if(0<P(e))jg(b,K(e),d),e=oc(e);else return null}();if(y(e))return e;e=function(){for(var e=hg(b);;)if(0<P(e))jg(K(e),c,d),e=oc(e);else return null}();return y(e)?e:!1};
function kg(a,b,c){c=jg(a,b,c);if(y(c))a=c;else{c=fg;var d;d=bg();d=M.a?M.a(d):M.call(null,d);a=c(d,a,b)}return a}
var lg=function lg(b,c,d,e,f,h,k){var l=Qa.c(function(e,h){var k=T(h,0);T(h,1);if(fg(M.a?M.a(d):M.call(null,d),c,k)){var l;l=(l=null==e)?l:kg(k,K(e),f);l=y(l)?h:e;if(!y(kg(K(l),k,f)))throw Error([E("Multiple methods in multimethod '"),E(b),E("' match dispatch value: "),E(c),E(" -\x3e "),E(k),E(" and "),E(K(l)),E(", and neither is preferred")].join(""));return l}return e},null,M.a?M.a(e):M.call(null,e));if(y(l)){if(cc.b(M.a?M.a(k):M.call(null,k),M.a?M.a(d):M.call(null,d)))return me.o(h,Wc,c,K(L(l))),
K(L(l));ig(h,e,k,d);return lg(b,c,d,e,f,h,k)}return null};function Y(a,b){throw Error([E("No method in multimethod '"),E(a),E("' for dispatch value: "),E(b)].join(""));}function mg(a,b,c,d,e,f,h,k){this.name=a;this.h=b;this.dc=c;this.mb=d;this.Za=e;this.jc=f;this.ob=h;this.ab=k;this.i=4194305;this.B=4352}g=mg.prototype;
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,F,R){a=this;var pa=Pa.m(a.h,b,c,d,e,mc([f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,F,R],0)),gg=Z(this,pa);y(gg)||Y(a.name,pa);return Pa.m(gg,b,c,d,e,mc([f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,F,R],0))}function b(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,F){a=this;var R=a.h.ma?a.h.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,F):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,F),pa=Z(this,R);y(pa)||Y(a.name,R);return pa.ma?pa.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,
t,v,w,z,x,D,F):pa.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,F)}function c(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D){a=this;var F=a.h.la?a.h.la(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D),R=Z(this,F);y(R)||Y(a.name,F);return R.la?R.la(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D):R.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D)}function d(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x){a=this;var D=a.h.ka?a.h.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x):a.h.call(null,
b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x),F=Z(this,D);y(F)||Y(a.name,D);return F.ka?F.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x):F.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x)}function e(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){a=this;var x=a.h.ja?a.h.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z),D=Z(this,x);y(D)||Y(a.name,x);return D.ja?D.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):D.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)}function f(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,
w){a=this;var z=a.h.ia?a.h.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w),x=Z(this,z);y(x)||Y(a.name,z);return x.ia?x.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):x.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)}function h(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){a=this;var w=a.h.ha?a.h.ha(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v),z=Z(this,w);y(z)||Y(a.name,w);return z.ha?z.ha(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):z.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)}
function k(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){a=this;var v=a.h.ga?a.h.ga(b,c,d,e,f,h,k,l,m,n,p,q,r,t):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t),w=Z(this,v);y(w)||Y(a.name,v);return w.ga?w.ga(b,c,d,e,f,h,k,l,m,n,p,q,r,t):w.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,h,k,l,m,n,p,q,r){a=this;var t=a.h.fa?a.h.fa(b,c,d,e,f,h,k,l,m,n,p,q,r):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r),v=Z(this,t);y(v)||Y(a.name,t);return v.fa?v.fa(b,c,d,e,f,h,k,l,m,n,p,q,r):v.call(null,b,c,d,e,f,h,k,l,m,n,p,
q,r)}function m(a,b,c,d,e,f,h,k,l,m,n,p,q){a=this;var r=a.h.ea?a.h.ea(b,c,d,e,f,h,k,l,m,n,p,q):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q),t=Z(this,r);y(t)||Y(a.name,r);return t.ea?t.ea(b,c,d,e,f,h,k,l,m,n,p,q):t.call(null,b,c,d,e,f,h,k,l,m,n,p,q)}function n(a,b,c,d,e,f,h,k,l,m,n,p){a=this;var q=a.h.da?a.h.da(b,c,d,e,f,h,k,l,m,n,p):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p),r=Z(this,q);y(r)||Y(a.name,q);return r.da?r.da(b,c,d,e,f,h,k,l,m,n,p):r.call(null,b,c,d,e,f,h,k,l,m,n,p)}function p(a,b,c,d,e,f,h,k,l,m,
n){a=this;var p=a.h.ca?a.h.ca(b,c,d,e,f,h,k,l,m,n):a.h.call(null,b,c,d,e,f,h,k,l,m,n),q=Z(this,p);y(q)||Y(a.name,p);return q.ca?q.ca(b,c,d,e,f,h,k,l,m,n):q.call(null,b,c,d,e,f,h,k,l,m,n)}function q(a,b,c,d,e,f,h,k,l,m){a=this;var n=a.h.oa?a.h.oa(b,c,d,e,f,h,k,l,m):a.h.call(null,b,c,d,e,f,h,k,l,m),p=Z(this,n);y(p)||Y(a.name,n);return p.oa?p.oa(b,c,d,e,f,h,k,l,m):p.call(null,b,c,d,e,f,h,k,l,m)}function r(a,b,c,d,e,f,h,k,l){a=this;var m=a.h.na?a.h.na(b,c,d,e,f,h,k,l):a.h.call(null,b,c,d,e,f,h,k,l),n=
Z(this,m);y(n)||Y(a.name,m);return n.na?n.na(b,c,d,e,f,h,k,l):n.call(null,b,c,d,e,f,h,k,l)}function t(a,b,c,d,e,f,h,k){a=this;var l=a.h.V?a.h.V(b,c,d,e,f,h,k):a.h.call(null,b,c,d,e,f,h,k),m=Z(this,l);y(m)||Y(a.name,l);return m.V?m.V(b,c,d,e,f,h,k):m.call(null,b,c,d,e,f,h,k)}function v(a,b,c,d,e,f,h){a=this;var k=a.h.U?a.h.U(b,c,d,e,f,h):a.h.call(null,b,c,d,e,f,h),l=Z(this,k);y(l)||Y(a.name,k);return l.U?l.U(b,c,d,e,f,h):l.call(null,b,c,d,e,f,h)}function w(a,b,c,d,e,f){a=this;var h=a.h.C?a.h.C(b,c,
d,e,f):a.h.call(null,b,c,d,e,f),k=Z(this,h);y(k)||Y(a.name,h);return k.C?k.C(b,c,d,e,f):k.call(null,b,c,d,e,f)}function z(a,b,c,d,e){a=this;var f=a.h.o?a.h.o(b,c,d,e):a.h.call(null,b,c,d,e),h=Z(this,f);y(h)||Y(a.name,f);return h.o?h.o(b,c,d,e):h.call(null,b,c,d,e)}function D(a,b,c,d){a=this;var e=a.h.c?a.h.c(b,c,d):a.h.call(null,b,c,d),f=Z(this,e);y(f)||Y(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function F(a,b,c){a=this;var d=a.h.b?a.h.b(b,c):a.h.call(null,b,c),e=Z(this,d);y(e)||Y(a.name,
d);return e.b?e.b(b,c):e.call(null,b,c)}function R(a,b){a=this;var c=a.h.a?a.h.a(b):a.h.call(null,b),d=Z(this,c);y(d)||Y(a.name,c);return d.a?d.a(b):d.call(null,b)}function pa(a){a=this;var b=a.h.u?a.h.u():a.h.call(null),c=Z(this,b);y(c)||Y(a.name,b);return c.u?c.u():c.call(null)}var x=null,x=function(x,Q,S,U,W,aa,da,ka,ma,oa,ta,ya,Fa,Ka,$b,Ta,gb,vb,Ob,rc,cd,ve){switch(arguments.length){case 1:return pa.call(this,x);case 2:return R.call(this,x,Q);case 3:return F.call(this,x,Q,S);case 4:return D.call(this,
x,Q,S,U);case 5:return z.call(this,x,Q,S,U,W);case 6:return w.call(this,x,Q,S,U,W,aa);case 7:return v.call(this,x,Q,S,U,W,aa,da);case 8:return t.call(this,x,Q,S,U,W,aa,da,ka);case 9:return r.call(this,x,Q,S,U,W,aa,da,ka,ma);case 10:return q.call(this,x,Q,S,U,W,aa,da,ka,ma,oa);case 11:return p.call(this,x,Q,S,U,W,aa,da,ka,ma,oa,ta);case 12:return n.call(this,x,Q,S,U,W,aa,da,ka,ma,oa,ta,ya);case 13:return m.call(this,x,Q,S,U,W,aa,da,ka,ma,oa,ta,ya,Fa);case 14:return l.call(this,x,Q,S,U,W,aa,da,ka,ma,
oa,ta,ya,Fa,Ka);case 15:return k.call(this,x,Q,S,U,W,aa,da,ka,ma,oa,ta,ya,Fa,Ka,$b);case 16:return h.call(this,x,Q,S,U,W,aa,da,ka,ma,oa,ta,ya,Fa,Ka,$b,Ta);case 17:return f.call(this,x,Q,S,U,W,aa,da,ka,ma,oa,ta,ya,Fa,Ka,$b,Ta,gb);case 18:return e.call(this,x,Q,S,U,W,aa,da,ka,ma,oa,ta,ya,Fa,Ka,$b,Ta,gb,vb);case 19:return d.call(this,x,Q,S,U,W,aa,da,ka,ma,oa,ta,ya,Fa,Ka,$b,Ta,gb,vb,Ob);case 20:return c.call(this,x,Q,S,U,W,aa,da,ka,ma,oa,ta,ya,Fa,Ka,$b,Ta,gb,vb,Ob,rc);case 21:return b.call(this,x,Q,S,
U,W,aa,da,ka,ma,oa,ta,ya,Fa,Ka,$b,Ta,gb,vb,Ob,rc,cd);case 22:return a.call(this,x,Q,S,U,W,aa,da,ka,ma,oa,ta,ya,Fa,Ka,$b,Ta,gb,vb,Ob,rc,cd,ve)}throw Error("Invalid arity: "+arguments.length);};x.a=pa;x.b=R;x.c=F;x.o=D;x.C=z;x.U=w;x.V=v;x.na=t;x.oa=r;x.ca=q;x.da=p;x.ea=n;x.fa=m;x.ga=l;x.ha=k;x.ia=h;x.ja=f;x.ka=e;x.la=d;x.ma=c;x.Bb=b;x.cb=a;return x}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};
g.u=function(){var a=this.h.u?this.h.u():this.h.call(null),b=Z(this,a);y(b)||Y(this.name,a);return b.u?b.u():b.call(null)};g.a=function(a){var b=this.h.a?this.h.a(a):this.h.call(null,a),c=Z(this,b);y(c)||Y(this.name,b);return c.a?c.a(a):c.call(null,a)};g.b=function(a,b){var c=this.h.b?this.h.b(a,b):this.h.call(null,a,b),d=Z(this,c);y(d)||Y(this.name,c);return d.b?d.b(a,b):d.call(null,a,b)};
g.c=function(a,b,c){var d=this.h.c?this.h.c(a,b,c):this.h.call(null,a,b,c),e=Z(this,d);y(e)||Y(this.name,d);return e.c?e.c(a,b,c):e.call(null,a,b,c)};g.o=function(a,b,c,d){var e=this.h.o?this.h.o(a,b,c,d):this.h.call(null,a,b,c,d),f=Z(this,e);y(f)||Y(this.name,e);return f.o?f.o(a,b,c,d):f.call(null,a,b,c,d)};g.C=function(a,b,c,d,e){var f=this.h.C?this.h.C(a,b,c,d,e):this.h.call(null,a,b,c,d,e),h=Z(this,f);y(h)||Y(this.name,f);return h.C?h.C(a,b,c,d,e):h.call(null,a,b,c,d,e)};
g.U=function(a,b,c,d,e,f){var h=this.h.U?this.h.U(a,b,c,d,e,f):this.h.call(null,a,b,c,d,e,f),k=Z(this,h);y(k)||Y(this.name,h);return k.U?k.U(a,b,c,d,e,f):k.call(null,a,b,c,d,e,f)};g.V=function(a,b,c,d,e,f,h){var k=this.h.V?this.h.V(a,b,c,d,e,f,h):this.h.call(null,a,b,c,d,e,f,h),l=Z(this,k);y(l)||Y(this.name,k);return l.V?l.V(a,b,c,d,e,f,h):l.call(null,a,b,c,d,e,f,h)};
g.na=function(a,b,c,d,e,f,h,k){var l=this.h.na?this.h.na(a,b,c,d,e,f,h,k):this.h.call(null,a,b,c,d,e,f,h,k),m=Z(this,l);y(m)||Y(this.name,l);return m.na?m.na(a,b,c,d,e,f,h,k):m.call(null,a,b,c,d,e,f,h,k)};g.oa=function(a,b,c,d,e,f,h,k,l){var m=this.h.oa?this.h.oa(a,b,c,d,e,f,h,k,l):this.h.call(null,a,b,c,d,e,f,h,k,l),n=Z(this,m);y(n)||Y(this.name,m);return n.oa?n.oa(a,b,c,d,e,f,h,k,l):n.call(null,a,b,c,d,e,f,h,k,l)};
g.ca=function(a,b,c,d,e,f,h,k,l,m){var n=this.h.ca?this.h.ca(a,b,c,d,e,f,h,k,l,m):this.h.call(null,a,b,c,d,e,f,h,k,l,m),p=Z(this,n);y(p)||Y(this.name,n);return p.ca?p.ca(a,b,c,d,e,f,h,k,l,m):p.call(null,a,b,c,d,e,f,h,k,l,m)};g.da=function(a,b,c,d,e,f,h,k,l,m,n){var p=this.h.da?this.h.da(a,b,c,d,e,f,h,k,l,m,n):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n),q=Z(this,p);y(q)||Y(this.name,p);return q.da?q.da(a,b,c,d,e,f,h,k,l,m,n):q.call(null,a,b,c,d,e,f,h,k,l,m,n)};
g.ea=function(a,b,c,d,e,f,h,k,l,m,n,p){var q=this.h.ea?this.h.ea(a,b,c,d,e,f,h,k,l,m,n,p):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p),r=Z(this,q);y(r)||Y(this.name,q);return r.ea?r.ea(a,b,c,d,e,f,h,k,l,m,n,p):r.call(null,a,b,c,d,e,f,h,k,l,m,n,p)};g.fa=function(a,b,c,d,e,f,h,k,l,m,n,p,q){var r=this.h.fa?this.h.fa(a,b,c,d,e,f,h,k,l,m,n,p,q):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q),t=Z(this,r);y(t)||Y(this.name,r);return t.fa?t.fa(a,b,c,d,e,f,h,k,l,m,n,p,q):t.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q)};
g.ga=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r){var t=this.h.ga?this.h.ga(a,b,c,d,e,f,h,k,l,m,n,p,q,r):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r),v=Z(this,t);y(v)||Y(this.name,t);return v.ga?v.ga(a,b,c,d,e,f,h,k,l,m,n,p,q,r):v.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r)};
g.ha=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){var v=this.h.ha?this.h.ha(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t),w=Z(this,v);y(w)||Y(this.name,v);return w.ha?w.ha(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t):w.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t)};
g.ia=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){var w=this.h.ia?this.h.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v),z=Z(this,w);y(z)||Y(this.name,w);return z.ia?z.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):z.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)};
g.ja=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w){var z=this.h.ja?this.h.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w),D=Z(this,z);y(D)||Y(this.name,z);return D.ja?D.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):D.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)};
g.ka=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){var D=this.h.ka?this.h.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z),F=Z(this,D);y(F)||Y(this.name,D);return F.ka?F.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):F.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)};
g.la=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D){var F=this.h.la?this.h.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D),R=Z(this,F);y(R)||Y(this.name,F);return R.la?R.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):R.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D)};
g.ma=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F){var R=this.h.ma?this.h.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F),pa=Z(this,R);y(pa)||Y(this.name,R);return pa.ma?pa.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F):pa.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F)};
g.Bb=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F,R){var pa=Pa.m(this.h,a,b,c,d,mc([e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F,R],0)),x=Z(this,pa);y(x)||Y(this.name,pa);return Pa.m(x,a,b,c,d,mc([e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,F,R],0))};
function Z(a,b){cc.b(M.a?M.a(a.ab):M.call(null,a.ab),M.a?M.a(a.mb):M.call(null,a.mb))||ig(a.ob,a.Za,a.ab,a.mb);var c=(M.a?M.a(a.ob):M.call(null,a.ob)).call(null,b);if(y(c))return c;c=lg(a.name,b,a.mb,a.Za,a.jc,a.ob,a.ab);return y(c)?c:(M.a?M.a(a.Za):M.call(null,a.Za)).call(null,a.dc)}g.gb=function(){return Pb(this.name)};g.hb=function(){return Qb(this.name)};g.N=function(){return this[ca]||(this[ca]=++ea)};var ng=new A(null,"javascript","javascript",-45283711),og=new H(null,"floor","floor",-772394748,null),pg=new A(null,"algorithm","algorithm",739262820),Ba=new A(null,"meta","meta",1499536964),qg=new A(null,"table","table",-564943036),rg=new H(null,"blockable","blockable",-28395259,null),Da=new A(null,"dup","dup",556298533),sg=new H(null,"divmod","divmod",811386629,null),tg=new A(null,"number","number",1570378438),ug=new A(null,"button","button",1456579943),le=new H(null,"new-value","new-value",-1567397401,
null),vg=new H(null,"century-and-year","century-and-year",-681394297,null),he=new A(null,"validator","validator",-1966190681),wg=new A(null,"default","default",-1987822328),xg=new H(null,"closest-perfect-cube","closest-perfect-cube",1220545609,null),yg=new A(null,"td","td",1479933353),zg=new H(null,"*","*",345799209,null),Ag=new A(null,"value","value",305978217),Bg=new A(null,"tr","tr",-1424774646),Cg=new A(null,"onclick","onclick",1297553739),Uf=new A(null,"val","val",128701612),Dg=new A(null,"type",
"type",1174270348),Eg=new A(null,"classname","classname",777390796),ke=new H(null,"validate","validate",1439230700,null),Fg=new H(null,"dup","dup",-2098137236,null),Tf=new A(null,"fallback-impl","fallback-impl",-1501286995),Gg=new H(null,"century-anchor","century-anchor",1137235565,null),za=new A(null,"flush-on-newline","flush-on-newline",-151457939),Hg=new H(null,"sqrt","sqrt",370479598,null),Ig=new H(null,"dip","dip",-323933490,null),Jg=new H(null,"%","%",-950237169,null),Kg=new A(null,"className",
"className",-1983287057),dg=new A(null,"descendants","descendants",1824886031),eg=new A(null,"ancestors","ancestors",-776045424),Lg=new H(null,"-","-",-471816912,null),Mg=new A(null,"textarea","textarea",-650375824),qe=new H(null,"n","n",-2092305744,null),Ng=new A(null,"div","div",1057191632),Aa=new A(null,"readably","readably",1129599760),Lf=new A(null,"more-marker","more-marker",-14717935),Og=new H("eval","all","eval/all",-1769564175,null),Pg=new A(null,"lacket","lacket",-808519309),Qg=new A(null,
"word","word",-420123725),Ea=new A(null,"print-length","print-length",1931866356),Rg=new A(null,"id","id",-1388402092),cg=new A(null,"parents","parents",-2027538891),Sg=new A(null,"svg","svg",856789142),Tg=new A(null,"code","code",1586293142),Ug=new A(null,"initial","initial",1854648214),Vg=new A(null,"rerender","rerender",-1601192263),Wg=new A(null,"input","input",556931961),Xg=new H(null,"+","+",-740910886,null),Zd=new H(null,"quote","quote",1377916282,null),Yd=new A(null,"arglists","arglists",
1661989754),Xd=new H(null,"nil-iter","nil-iter",1101030523,null),Yg=new A(null,"main","main",-2117802661),Zg=new A(null,"hierarchy","hierarchy",-1053470341),Sf=new A(null,"alt-impl","alt-impl",670969595),$g=new A(null,"racket","racket",781983516),ah=new H(null,"closest-perfect-square","closest-perfect-square",1449996605,null),pe=new H(null,"number?","number?",-1747282210,null),bh=new A(null,"foreignObject","foreignObject",25502111),ch=new A(null,"text","text",-1790561697),dh=new A(null,"span","span",
1394872991),eh=new H(null,"f","f",43394975,null);var fh;function gh(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function hh(a,b,c,d){this.head=a;this.I=b;this.length=c;this.f=d}hh.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.I];this.f[this.I]=null;this.I=(this.I+1)%this.f.length;--this.length;return a};hh.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};
hh.prototype.resize=function(){var a=Array(2*this.f.length);return this.I<this.head?(gh(this.f,this.I,a,0,this.length),this.I=0,this.head=this.length,this.f=a):this.I>this.head?(gh(this.f,this.I,a,0,this.f.length-this.I),gh(this.f,0,a,this.f.length-this.I,this.head),this.I=0,this.head=this.length,this.f=a):this.I===this.head?(this.head=this.I=0,this.f=a):null};if("undefined"===typeof ih)var ih={};var jh;a:{var kh=ba.navigator;if(kh){var lh=kh.userAgent;if(lh){jh=lh;break a}}jh=""};var mh;
function nh(){var a=ba.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==jh.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ha(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==jh.indexOf("Trident")&&-1==jh.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.Eb;c.Eb=null;a()}};return function(a){d.next={Eb:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){ba.setTimeout(a,0)}};var oh;oh=new hh(0,0,0,Array(32));var ph=!1,qh=!1;rh;function sh(){ph=!0;qh=!1;for(var a=0;;){var b=oh.pop();if(null!=b&&(b.u?b.u():b.call(null),1024>a)){a+=1;continue}break}ph=!1;return 0<oh.length?rh.u?rh.u():rh.call(null):null}function rh(){var a=qh;if(y(y(a)?ph:a))return null;qh=!0;"function"!=u(ba.setImmediate)||ba.Window&&ba.Window.prototype&&ba.Window.prototype.setImmediate==ba.setImmediate?(mh||(mh=nh()),mh(sh)):ba.setImmediate(sh)};for(var th=Array(1),uh=0;;)if(uh<th.length)th[uh]=null,uh+=1;else break;(function(a){"undefined"===typeof fh&&(fh=function(a,c,d){this.ec=a;this.Nb=c;this.gc=d;this.i=393216;this.B=0},fh.prototype.R=function(a,c){return new fh(this.ec,this.Nb,c)},fh.prototype.O=function(){return this.gc},fh.fc=function(){return new V(null,3,5,X,[eh,rg,na.uc],null)},fh.Cb=!0,fh.lb="cljs.core.async/t_cljs$core$async10693",fh.Lb=function(a,c){return zb(c,"cljs.core.async/t_cljs$core$async10693")});return new fh(a,!0,$d)})(function(){return null});var vh=VDOM.diff,wh=VDOM.patch,xh=VDOM.create;function yh(a){return ue(de(Ia),ue(de(ld),we(a)))}function zh(a,b,c){return new VDOM.VHtml(Cd(a),Zf(b),Zf(c))}function Ah(a,b,c){return new VDOM.VSvg(Cd(a),Zf(b),Zf(c))}Bh;
var Ch=function Ch(b){if(null==b)return new VDOM.VText("");if(ld(b))return zh(Ng,$d,Bd.b(Ch,yh(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(cc.b(Sg,K(b)))return Bh.a?Bh.a(b):Bh.call(null,b);var c=T(b,0),d=T(b,1);b=zd(b,2);return zh(c,d,Bd.b(Ch,yh(b)))},Bh=function Bh(b){if(null==b)return new VDOM.VText("");if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(cc.b(bh,K(b))){var c=T(b,0),d=T(b,1);b=zd(b,2);return Ah(c,d,Bd.b(Ch,yh(b)))}c=T(b,0);d=T(b,
1);b=zd(b,2);return Ah(c,d,Bd.b(Bh,yh(b)))};
function Dh(){var a=document.getElementById("app"),b=function(){var a=new VDOM.VText("");return ge.a?ge.a(a):ge.call(null,a)}(),c=function(){var a;a=M.a?M.a(b):M.call(null,b);a=xh.a?xh.a(a):xh.call(null,a);return ge.a?ge.a(a):ge.call(null,a)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.u?a.u():a.call(null)}}(b,c):function(){return function(a){return window.requestAnimationFrame(a)}}(b,c);a.appendChild(M.a?M.a(c):M.call(null,c));return function(a,b,c){return function(d){var l=
Ch(d);d=function(){var b=M.a?M.a(a):M.call(null,a);return vh.b?vh.b(b,l):vh.call(null,b,l)}();je.b?je.b(a,l):je.call(null,a,l);d=function(a,b,c,d){return function(){return me.c(d,wh,b)}}(l,d,a,b,c);return c.a?c.a(d):c.call(null,d)}}(b,c,d)};function Eh(a){return Bd.b(function(a){return new xa(null,2,[Ag,a,Dg,y(If.b?If.b(/\[/,a):If.call(null,/\[/,a))?Pg:y(If.b?If.b(/\]/,a):If.call(null,/\]/,a))?$g:y(If.b?If.b(/[0-9]+/,a):If.call(null,/[0-9]+/,a))?tg:Qg],null)},Kf(/\[|\]|[0-9]+|[^ \[\]]+/,a))}function Fh(a){return cc.b(tg,a.a?a.a(Dg):a.call(null,Dg))?(a=a.a?a.a(Ag):a.call(null,Ag),parseFloat(a)):cc.b(Qg,a.a?a.a(Dg):a.call(null,Dg))?lc.a(a.a?a.a(Ag):a.call(null,Ag)):null}
function Gh(a){var b=a;for(a=Sc;;)if(J(b)){var c=b,b=T(c,0),c=zd(c,1),d=cc,e=b.a?b.a(Dg):b.call(null,Dg);if(y(d.b?d.b(Pg,e):d.call(null,Pg,e))){a:for(b=$g,d=c,c=Sc;;)if(J(d)){e=d;d=T(e,0);e=zd(e,1);if(cc.b(b,d.a?d.a(Dg):d.call(null,Dg))){c=new V(null,2,5,X,[e,c],null);break a}c=Rc.b(c,Fh(d));d=e}else throw Error("Unexpected end of input, expected ",b);b=T(c,0);c=T(c,1);a=Rc.b(a,c)}else a=Rc.b(a,Fh(b)),b=c}else return a};function Hh(a){var b=new ja;for(a=J(a);;)if(null!=a)b.append(""+E(K(a))),a=L(a),null!=a&&b.append(" ");else return b.toString()};function Ih(a,b){return function(c){return new V(null,1,5,X,[Rc.b(qd(re(a,c)),Pa.b(b,se(a,c)))],null)}}function Jh(a){return function(b){return new V(null,1,5,X,[qd(Td.b(re(2,b),Pa.b(a,se(2,b))))],null)}}
var Kh=Xc([Gg,ah,Ig,sg,lc.a("\u221a3"),lc.a("\u221a"),Fg,Xg,zg,lc.a("/"),og,Lg,xg,lc.a("^"),Hg,vg,Jg],[Ih(1,function(a){return wd(5*wd(a,4)+2,7)}),Ih(1,function(a){return Math.pow(Math.round(Math.sqrt(a)),2)}),function(a){var b=se(2,a),c=T(b,0),b=T(b,1);return new V(null,2,5,X,[qd(re(2,a)),qd(Td.b(b,new V(null,1,5,X,[c],null)))],null)},Jh(function(a,b){return new V(null,2,5,X,[Math.floor(a/b),wd(a,b)],null)}),Ih(1,function(a){return Math.pow(a,1/3)}),Ih(1,function(a){return Math.sqrt(a)}),function(a){return new V(null,
1,5,X,[Rc.b(a,Qc(a))],null)},Ih(2,sd),Ih(2,ud),Ih(2,vd),Ih(1,Math.floor),Ih(2,td),Ih(1,function(a){return Math.pow(Math.round(Math.pow(a,1/3)),3)}),Ih(2,function(a,b){return Math.pow(a,b)}),Ih(1,function(a){return Math.sqrt(a)}),Jh(function(a){var b=Math.floor(a/100);return new V(null,2,5,X,[b,a-100*b],null)}),Ih(2,wd)]);
function Lh(a,b){if(ed(b)||"number"===typeof b)return new V(null,1,5,X,[Rc.b(a,b)],null);if(b instanceof H){var c=Kh.a?Kh.a(b):Kh.call(null,b);if(y(c))return c.a?c.a(a):c.call(null,a);throw Error([E("Unknown word `"),E(b),E("`")].join(""));}throw Error([E("Unknown value `"),E(b),E("`")].join(""));};function Mh(a,b){var c=Qa.c(Lh,Sc,Gh(Eh(a))),d=T(c,0),c=Gh(Eh(b));a:for(var e=c,c=new V(null,1,5,X,[new V(null,2,5,X,[d,e],null)],null);;)if(J(e))var f=T(e,0),e=zd(e,1),f=Lh(d,f),d=T(f,0),f=T(f,1),h=qd(Td.b(f,e)),f=d,e=h,c=Rc.b(c,new V(null,2,5,X,[d,h],null)),d=f;else break a;return c}function Nh(a,b){return cc.b(a,b)?0:Math.abs((a-b)/a)}function Oh(a,b){return b*Math.round(a/b)}
function Ph(a){return new V(null,3,5,X,[qg,$d,function(){return function c(a){return new Ld(null,function(){for(;;){var e=J(a);if(e){if(hd(e)){var f=Lb(e),h=P(f),k=new Od(Array(h),0);a:for(var l=0;;)if(l<h){var m=G.b(f,l),n=T(m,0),m=T(m,1),n=new V(null,5,5,X,[Bg,$d,new V(null,3,5,X,[yg,new xa(null,1,[Kg,"t-right"],null),Hh(n)],null),new V(null,3,5,X,[yg,new xa(null,1,[Kg,"t-muted"],null)," \u25c6 "],null),new V(null,3,5,X,[yg,$d,Hh(m)],null)],null);k.add(n);l+=1}else{f=!0;break a}return f?Pd(k.za(),
c(Mb(e))):Pd(k.za(),null)}f=K(e);k=T(f,0);f=T(f,1);return N(new V(null,5,5,X,[Bg,$d,new V(null,3,5,X,[yg,new xa(null,1,[Kg,"t-right"],null),Hh(k)],null),new V(null,3,5,X,[yg,new xa(null,1,[Kg,"t-muted"],null)," \u25c6 "],null),new V(null,3,5,X,[yg,$d,Hh(f)],null)],null),c(oc(e)))}return null}},null,null)}(a)}()],null)}
function Qh(){var a=Rh,b=M.a?M.a(Sh):M.call(null,Sh),c;try{c=Mh(b.a?b.a(Ug):b.call(null,Ug),b.a?b.a(pg):b.call(null,pg))}catch(d){if(d instanceof Error)c=d.message;else throw d;}var e=J(b.a?b.a(ng):b.call(null,ng))?function(){var a=[E("var x\x3d"),E(b.a?b.a(Ug):b.call(null,Ug)),E(";"),E(b.a?b.a(ng):b.call(null,ng))].join("");return eval(a)}():null,f=Qc(K(Qc(c)));return new V(null,4,5,X,[Yg,new xa(null,1,[Kg,"l-diptych"],null),new V(null,6,5,X,[Ng,new xa(null,1,[Kg,"l-vspaced"],null),new V(null,5,
5,X,[Ng,new xa(null,1,[Eg,"l-width-full"],null),"JavaScript expression of ",new V(null,3,5,X,[Tg,$d,"x"],null),new V(null,3,5,X,[Ng,$d,new V(null,2,5,X,[Wg,new xa(null,3,[Rg,"input-js",Kg,"l-width-full",Ag,b.a?b.a(ng):b.call(null,ng)],null)],null)],null)],null),new V(null,4,5,X,[Ng,$d,"Stack algorithm",new V(null,3,5,X,[Ng,$d,new V(null,2,5,X,[Mg,new xa(null,3,[Rg,"input-algorithm",Kg,"l-width-full",Ag,b.a?b.a(pg):b.call(null,pg)],null)],null)],null)],null),new V(null,4,5,X,[Ng,$d,"Initial stack",
new V(null,3,5,X,[Ng,$d,new V(null,2,5,X,[Wg,new xa(null,3,[Rg,"input-init",Kg,"l-width-full",Ag,b.a?b.a(Ug):b.call(null,Ug)],null)],null)],null)],null),new V(null,3,5,X,[Ng,$d,new V(null,3,5,X,[ug,new xa(null,1,[Cg,function(){return function(){var b=document.getElementById("input-js").value,c=document.getElementById("input-algorithm").value,d=document.getElementById("input-init").value;return a.o?a.o(Og,b,c,d):a.call(null,Og,b,c,d)}}(c,e,f)],null),"Evaluate"],null)],null)],null),new V(null,5,5,X,
[Ng,new xa(null,1,[Kg,"l-vspaced"],null),y(e)?new V(null,4,5,X,[Ng,$d,new V(null,3,5,X,[dh,new xa(null,1,[Kg,"t-muted"],null),"JavaScript result "],null),Oh(e,1E-4)],null):null,null!=K(K(c))?new V(null,4,5,X,[Ng,$d,new V(null,3,5,X,[dh,new xa(null,1,[Kg,"t-muted"],null),"Stack evaluation "],null),"string"===typeof c?new V(null,3,5,X,[ch,new xa(null,1,[Kg,"t-error"],null),c],null):Ph(c)],null):null,J(b.a?b.a(ng):b.call(null,ng))&&"string"!==typeof c?new V(null,5,5,X,[Ng,$d,new V(null,3,5,X,[dh,new xa(null,
1,[Kg,"t-muted"],null),"Error "],null),Oh(100*Nh(e,f),.1),"%"],null):null],null)],null)};ra=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new I(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Ga.a?Ga.a(a):Ga.call(null,a))}a.A=0;a.G=function(a){a=J(a);return b(a)};a.m=b;return a}();
sa=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new I(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,Ga.a?Ga.a(a):Ga.call(null,a))}a.A=0;a.G=function(a){a=J(a);return b(a)};a.m=b;return a}();if("undefined"===typeof Sh){var Sh,Th=new xa(null,3,[ng,"",pg,"",Ug,""],null);Sh=ge.a?ge.a(Th):ge.call(null,Th)}
if("undefined"===typeof Rh)var Rh=function(){var a=ge.a?ge.a($d):ge.call(null,$d),b=ge.a?ge.a($d):ge.call(null,$d),c=ge.a?ge.a($d):ge.call(null,$d),d=ge.a?ge.a($d):ge.call(null,$d),e=kc.c($d,Zg,bg());return new mg(lc.b("mmh.core","emit"),function(){return function(){function a(b,c){if(1<arguments.length)for(var d=0,e=Array(arguments.length-1);d<e.length;)e[d]=arguments[d+1],++d;return b}a.A=1;a.G=function(a){var b=K(a);oc(a);return b};a.m=function(a){return a};return a}()}(a,b,c,d,e),wg,e,a,b,c,d)}();
var Uh=Rh;me.o(Uh.Za,Wc,Og,function(a,b,c,d){return me.c(Sh,Ef,new xa(null,3,[ng,b,pg,c,Ug,d],null))});ig(Uh.ob,Uh.Za,Uh.ab,Uh.mb);if("undefined"===typeof Vh)var Vh=function(a){return function(){var b=Qh();return a.a?a.a(b):a.call(null,b)}}(Dh());if("undefined"===typeof Wh){var Wh,Xh=Sh;Cb(Xh,Vg,function(a,b,c,d){return Vh.a?Vh.a(d):Vh.call(null,d)});Wh=Xh}var Yh=M.a?M.a(Sh):M.call(null,Sh);Vh.a?Vh.a(Yh):Vh.call(null,Yh);