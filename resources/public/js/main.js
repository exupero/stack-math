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
function ia(a,b,c){ia=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?fa:ha;return ia.apply(null,arguments)};function ja(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function la(a,b){null!=a&&this.append.apply(this,arguments)}g=la.prototype;g.Ma="";g.set=function(a){this.Ma=""+a};g.append=function(a,b,c){this.Ma+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.Ma+=arguments[d];return this};g.clear=function(){this.Ma=""};g.toString=function(){return this.Ma};function ma(a,b){return a>b?1:a<b?-1:0};var oa={},sa;if("undefined"===typeof ta)var ta=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof ua)var ua=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var va=null;if("undefined"===typeof wa)var wa=null;function ya(){return new za(null,5,[Aa,!0,Ba,!0,Ca,!1,Da,!1,Ea,null],null)}Fa;function w(a){return null!=a&&!1!==a}Ha;z;function Ka(a){return null==a}function La(a){return a instanceof Array}
function Ma(a){return null==a?!0:!1===a?!0:!1}function B(a,b){return a[t(null==b?null:b)]?!0:a._?!0:!1}function C(a,b){var c=null==b?null:b.constructor,c=w(w(c)?c.Ib:c)?c.qb:t(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Na(a){var b=a.qb;return w(b)?b:""+E(a)}var Oa="undefined"!==typeof Symbol&&"function"===t(Symbol)?Symbol.iterator:"@@iterator";function Pa(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}F;Qa;
var Fa=function Fa(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Fa.a(arguments[0]);case 2:return Fa.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Fa.a=function(a){return Fa.b(null,a)};Fa.b=function(a,b){function c(a,b){a.push(b);return a}var d=[];return Qa.c?Qa.c(c,d,b):Qa.call(null,c,d,b)};Fa.A=2;function Sa(){}
var Ta=function Ta(b){if(null!=b&&null!=b.Z)return b.Z(b);var c=Ta[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ta._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ICounted.-count",b);},Ua=function Ua(b){if(null!=b&&null!=b.V)return b.V(b);var c=Ua[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ua._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IEmptyableCollection.-empty",b);};function Va(){}
var Wa=function Wa(b,c){if(null!=b&&null!=b.T)return b.T(b,c);var d=Wa[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Wa._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("ICollection.-conj",b);};function Xa(){}
var G=function G(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return G.b(arguments[0],arguments[1]);case 3:return G.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
G.b=function(a,b){if(null!=a&&null!=a.U)return a.U(a,b);var c=G[t(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=G._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("IIndexed.-nth",a);};G.c=function(a,b,c){if(null!=a&&null!=a.wa)return a.wa(a,b,c);var d=G[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=G._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("IIndexed.-nth",a);};G.A=3;function Ya(){}
var Za=function Za(b){if(null!=b&&null!=b.Y)return b.Y(b);var c=Za[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Za._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeq.-first",b);},ab=function ab(b){if(null!=b&&null!=b.qa)return b.qa(b);var c=ab[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=ab._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeq.-rest",b);};function bb(){}function cb(){}
var db=function db(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return db.b(arguments[0],arguments[1]);case 3:return db.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
db.b=function(a,b){if(null!=a&&null!=a.K)return a.K(a,b);var c=db[t(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=db._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("ILookup.-lookup",a);};db.c=function(a,b,c){if(null!=a&&null!=a.H)return a.H(a,b,c);var d=db[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=db._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("ILookup.-lookup",a);};db.A=3;
var eb=function eb(b,c){if(null!=b&&null!=b.Db)return b.Db(b,c);var d=eb[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=eb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IAssociative.-contains-key?",b);},fb=function fb(b,c,d){if(null!=b&&null!=b.Qa)return b.Qa(b,c,d);var e=fb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=fb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IAssociative.-assoc",b);};function gb(){}
function hb(){}var ib=function ib(b){if(null!=b&&null!=b.lb)return b.lb(b);var c=ib[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=ib._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMapEntry.-key",b);},jb=function jb(b){if(null!=b&&null!=b.mb)return b.mb(b);var c=jb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=jb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMapEntry.-val",b);};function kb(){}function lb(){}
var mb=function mb(b,c,d){if(null!=b&&null!=b.Ta)return b.Ta(b,c,d);var e=mb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=mb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IVector.-assoc-n",b);},nb=function nb(b){if(null!=b&&null!=b.xb)return b.xb(b);var c=nb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=nb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IDeref.-deref",b);};function ob(){}
var pb=function pb(b){if(null!=b&&null!=b.O)return b.O(b);var c=pb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=pb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMeta.-meta",b);};function qb(){}var rb=function rb(b,c){if(null!=b&&null!=b.R)return b.R(b,c);var d=rb[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=rb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IWithMeta.-with-meta",b);};function sb(){}
var ub=function ub(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return ub.b(arguments[0],arguments[1]);case 3:return ub.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
ub.b=function(a,b){if(null!=a&&null!=a.aa)return a.aa(a,b);var c=ub[t(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=ub._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("IReduce.-reduce",a);};ub.c=function(a,b,c){if(null!=a&&null!=a.ba)return a.ba(a,b,c);var d=ub[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=ub._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("IReduce.-reduce",a);};ub.A=3;
var vb=function vb(b,c){if(null!=b&&null!=b.v)return b.v(b,c);var d=vb[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=vb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IEquiv.-equiv",b);},wb=function wb(b){if(null!=b&&null!=b.L)return b.L(b);var c=wb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=wb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IHash.-hash",b);};function xb(){}
var yb=function yb(b){if(null!=b&&null!=b.S)return b.S(b);var c=yb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=yb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeqable.-seq",b);};function zb(){}function Ab(){}
var Bb=function Bb(b,c){if(null!=b&&null!=b.Rb)return b.Rb(0,c);var d=Bb[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Bb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IWriter.-write",b);},Cb=function Cb(b,c,d){if(null!=b&&null!=b.J)return b.J(b,c,d);var e=Cb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Cb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IPrintWithWriter.-pr-writer",b);},Db=function Db(b,c,d){if(null!=b&&
null!=b.Qb)return b.Qb(0,c,d);var e=Db[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Db._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IWatchable.-notify-watches",b);},Eb=function Eb(b,c,d){if(null!=b&&null!=b.Pb)return b.Pb(0,c,d);var e=Eb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Eb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IWatchable.-add-watch",b);},Fb=function Fb(b){if(null!=b&&null!=b.Za)return b.Za(b);
var c=Fb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Fb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IEditableCollection.-as-transient",b);},Gb=function Gb(b,c){if(null!=b&&null!=b.Sa)return b.Sa(b,c);var d=Gb[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Gb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("ITransientCollection.-conj!",b);},Ib=function Ib(b){if(null!=b&&null!=b.ab)return b.ab(b);var c=Ib[t(null==b?null:b)];if(null!=c)return c.a?
c.a(b):c.call(null,b);c=Ib._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ITransientCollection.-persistent!",b);},Jb=function Jb(b,c,d){if(null!=b&&null!=b.pb)return b.pb(b,c,d);var e=Jb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Jb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("ITransientAssociative.-assoc!",b);},Kb=function Kb(b,c,d){if(null!=b&&null!=b.Ob)return b.Ob(0,c,d);var e=Kb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,
b,c,d);e=Kb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("ITransientVector.-assoc-n!",b);};function Lb(){}
var Mb=function Mb(b,c){if(null!=b&&null!=b.Ra)return b.Ra(b,c);var d=Mb[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Mb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IComparable.-compare",b);},Nb=function Nb(b){if(null!=b&&null!=b.Mb)return b.Mb();var c=Nb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Nb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunk.-drop-first",b);},Ob=function Ob(b){if(null!=b&&null!=b.Fb)return b.Fb(b);var c=
Ob[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ob._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedSeq.-chunked-first",b);},Pb=function Pb(b){if(null!=b&&null!=b.Gb)return b.Gb(b);var c=Pb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Pb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedSeq.-chunked-rest",b);},Qb=function Qb(b){if(null!=b&&null!=b.Eb)return b.Eb(b);var c=Qb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,
b);c=Qb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedNext.-chunked-next",b);},Rb=function Rb(b){if(null!=b&&null!=b.nb)return b.nb(b);var c=Rb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Rb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("INamed.-name",b);},Sb=function Sb(b){if(null!=b&&null!=b.ob)return b.ob(b);var c=Sb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Sb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("INamed.-namespace",
b);},Tb=function Tb(b,c){if(null!=b&&null!=b.fc)return b.fc(b,c);var d=Tb[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Tb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IReset.-reset!",b);},Ub=function Ub(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ub.b(arguments[0],arguments[1]);case 3:return Ub.c(arguments[0],arguments[1],arguments[2]);case 4:return Ub.o(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return Ub.D(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Ub.b=function(a,b){if(null!=a&&null!=a.hc)return a.hc(a,b);var c=Ub[t(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=Ub._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("ISwap.-swap!",a);};
Ub.c=function(a,b,c){if(null!=a&&null!=a.ic)return a.ic(a,b,c);var d=Ub[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Ub._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("ISwap.-swap!",a);};Ub.o=function(a,b,c,d){if(null!=a&&null!=a.jc)return a.jc(a,b,c,d);var e=Ub[t(null==a?null:a)];if(null!=e)return e.o?e.o(a,b,c,d):e.call(null,a,b,c,d);e=Ub._;if(null!=e)return e.o?e.o(a,b,c,d):e.call(null,a,b,c,d);throw C("ISwap.-swap!",a);};
Ub.D=function(a,b,c,d,e){if(null!=a&&null!=a.kc)return a.kc(a,b,c,d,e);var f=Ub[t(null==a?null:a)];if(null!=f)return f.D?f.D(a,b,c,d,e):f.call(null,a,b,c,d,e);f=Ub._;if(null!=f)return f.D?f.D(a,b,c,d,e):f.call(null,a,b,c,d,e);throw C("ISwap.-swap!",a);};Ub.A=5;var Vb=function Vb(b){if(null!=b&&null!=b.Fa)return b.Fa(b);var c=Vb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Vb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IIterable.-iterator",b);};
function Wb(a){this.tc=a;this.i=1073741824;this.B=0}Wb.prototype.Rb=function(a,b){return this.tc.append(b)};function Xb(a){var b=new la;a.J(null,new Wb(b),ya());return""+E(b)}var Yb="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function Zb(a){a=Yb(a|0,-862048943);return Yb(a<<15|a>>>-15,461845907)}
function $b(a,b){var c=(a|0)^(b|0);return Yb(c<<13|c>>>-13,5)+-430675100|0}function bc(a,b){var c=(a|0)^b,c=Yb(c^c>>>16,-2048144789),c=Yb(c^c>>>13,-1028477387);return c^c>>>16}function cc(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=$b(c,Zb(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^Zb(a.charCodeAt(a.length-1)):b;return bc(b,Yb(2,a.length))}dc;H;ec;fc;var gc={},hc=0;
function ic(a){if(null!=a){var b=a.length;if(0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=Yb(31,d)+a.charCodeAt(c),c=e;else return d;else return 0}else return 0}function jc(a){255<hc&&(gc={},hc=0);var b=gc[a];"number"!==typeof b&&(b=ic(a),gc[a]=b,hc+=1);return a=b}
function kc(a){null!=a&&(a.i&4194304||a.yc)?a=a.L(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=jc(a),0!==a&&(a=Zb(a),a=$b(0,a),a=bc(a,4))):a=a instanceof Date?a.valueOf():null==a?0:wb(a);return a}function lc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function Ha(a,b){return b instanceof a}
function mc(a,b){if(a.Ia===b.Ia)return 0;var c=Ma(a.sa);if(w(c?b.sa:c))return-1;if(w(a.sa)){if(Ma(b.sa))return 1;c=ma(a.sa,b.sa);return 0===c?ma(a.name,b.name):c}return ma(a.name,b.name)}nc;function H(a,b,c,d,e){this.sa=a;this.name=b;this.Ia=c;this.Ya=d;this.va=e;this.i=2154168321;this.B=4096}g=H.prototype;g.toString=function(){return this.Ia};g.equiv=function(a){return this.v(null,a)};g.v=function(a,b){return b instanceof H?this.Ia===b.Ia:!1};
g.call=function(){function a(a,b,c){return nc.c?nc.c(b,this,c):nc.call(null,b,this,c)}function b(a,b){return nc.b?nc.b(b,this):nc.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.a=function(a){return nc.b?nc.b(a,this):nc.call(null,a,this)};
g.b=function(a,b){return nc.c?nc.c(a,this,b):nc.call(null,a,this,b)};g.O=function(){return this.va};g.R=function(a,b){return new H(this.sa,this.name,this.Ia,this.Ya,b)};g.L=function(){var a=this.Ya;return null!=a?a:this.Ya=a=lc(cc(this.name),jc(this.sa))};g.nb=function(){return this.name};g.ob=function(){return this.sa};g.J=function(a,b){return Bb(b,this.Ia)};
var oc=function oc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return oc.a(arguments[0]);case 2:return oc.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};oc.a=function(a){if(a instanceof H)return a;var b=a.indexOf("/");return-1===b?oc.b(null,a):oc.b(a.substring(0,b),a.substring(b+1,a.length))};oc.b=function(a,b){var c=null!=a?[E(a),E("/"),E(b)].join(""):b;return new H(a,b,c,null,null)};
oc.A=2;I;qc;rc;function K(a){if(null==a)return null;if(null!=a&&(a.i&8388608||a.gc))return a.S(null);if(La(a)||"string"===typeof a)return 0===a.length?null:new rc(a,0);if(B(xb,a))return yb(a);throw Error([E(a),E(" is not ISeqable")].join(""));}function L(a){if(null==a)return null;if(null!=a&&(a.i&64||a.$a))return a.Y(null);a=K(a);return null==a?null:Za(a)}function sc(a){return null!=a?null!=a&&(a.i&64||a.$a)?a.qa(null):(a=K(a))?ab(a):tc:tc}
function M(a){return null==a?null:null!=a&&(a.i&128||a.yb)?a.ta(null):K(sc(a))}var ec=function ec(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ec.a(arguments[0]);case 2:return ec.b(arguments[0],arguments[1]);default:return ec.m(arguments[0],arguments[1],new rc(c.slice(2),0))}};ec.a=function(){return!0};ec.b=function(a,b){return null==a?null==b:a===b||vb(a,b)};
ec.m=function(a,b,c){for(;;)if(ec.b(a,b))if(M(c))a=b,b=L(c),c=M(c);else return ec.b(b,L(c));else return!1};ec.F=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return ec.m(b,a,c)};ec.A=2;function uc(a){this.C=a}uc.prototype.next=function(){if(null!=this.C){var a=L(this.C);this.C=M(this.C);return{value:a,done:!1}}return{value:null,done:!0}};function vc(a){return new uc(K(a))}wc;function xc(a,b,c){this.value=a;this.fb=b;this.Ab=c;this.i=8388672;this.B=0}xc.prototype.S=function(){return this};
xc.prototype.Y=function(){return this.value};xc.prototype.qa=function(){null==this.Ab&&(this.Ab=wc.a?wc.a(this.fb):wc.call(null,this.fb));return this.Ab};function wc(a){var b=a.next();return w(b.done)?tc:new xc(b.value,a,null)}function yc(a,b){var c=Zb(a),c=$b(0,c);return bc(c,b)}function zc(a){var b=0,c=1;for(a=K(a);;)if(null!=a)b+=1,c=Yb(31,c)+kc(L(a))|0,a=M(a);else return yc(c,b)}var Ac=yc(1,0);function Bc(a){var b=0,c=0;for(a=K(a);;)if(null!=a)b+=1,c=c+kc(L(a))|0,a=M(a);else return yc(c,b)}
var Cc=yc(0,0);Dc;dc;Ec;Sa["null"]=!0;Ta["null"]=function(){return 0};Date.prototype.v=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.jb=!0;Date.prototype.Ra=function(a,b){if(b instanceof Date)return ma(this.valueOf(),b.valueOf());throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};vb.number=function(a,b){return a===b};Fc;ob["function"]=!0;pb["function"]=function(){return null};wb._=function(a){return a[ca]||(a[ca]=++ea)};N;
function Gc(a){this.N=a;this.i=32768;this.B=0}Gc.prototype.xb=function(){return this.N};function Hc(a){return a instanceof Gc}function N(a){return nb(a)}function Ic(a,b){var c=Ta(a);if(0===c)return b.w?b.w():b.call(null);for(var d=G.b(a,0),e=1;;)if(e<c){var f=G.b(a,e),d=b.b?b.b(d,f):b.call(null,d,f);if(Hc(d))return nb(d);e+=1}else return d}function Kc(a,b,c){var d=Ta(a),e=c;for(c=0;;)if(c<d){var f=G.b(a,c),e=b.b?b.b(e,f):b.call(null,e,f);if(Hc(e))return nb(e);c+=1}else return e}
function Lc(a,b){var c=a.length;if(0===a.length)return b.w?b.w():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.b?b.b(d,f):b.call(null,d,f);if(Hc(d))return nb(d);e+=1}else return d}function Mc(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.b?b.b(e,f):b.call(null,e,f);if(Hc(e))return nb(e);c+=1}else return e}function Nc(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.b?b.b(c,f):b.call(null,c,f);if(Hc(c))return nb(c);d+=1}else return c}Oc;O;Pc;Qc;
function Rc(a){return null!=a?a.i&2||a.Xb?!0:a.i?!1:B(Sa,a):B(Sa,a)}function Sc(a){return null!=a?a.i&16||a.Nb?!0:a.i?!1:B(Xa,a):B(Xa,a)}function Tc(a,b){this.f=a;this.j=b}Tc.prototype.ra=function(){return this.j<this.f.length};Tc.prototype.next=function(){var a=this.f[this.j];this.j+=1;return a};function rc(a,b){this.f=a;this.j=b;this.i=166199550;this.B=8192}g=rc.prototype;g.toString=function(){return Xb(this)};g.equiv=function(a){return this.v(null,a)};
g.U=function(a,b){var c=b+this.j;return c<this.f.length?this.f[c]:null};g.wa=function(a,b,c){a=b+this.j;return a<this.f.length?this.f[a]:c};g.Fa=function(){return new Tc(this.f,this.j)};g.ta=function(){return this.j+1<this.f.length?new rc(this.f,this.j+1):null};g.Z=function(){var a=this.f.length-this.j;return 0>a?0:a};g.L=function(){return zc(this)};g.v=function(a,b){return Ec.b?Ec.b(this,b):Ec.call(null,this,b)};g.V=function(){return tc};
g.aa=function(a,b){return Nc(this.f,b,this.f[this.j],this.j+1)};g.ba=function(a,b,c){return Nc(this.f,b,c,this.j)};g.Y=function(){return this.f[this.j]};g.qa=function(){return this.j+1<this.f.length?new rc(this.f,this.j+1):tc};g.S=function(){return this.j<this.f.length?this:null};g.T=function(a,b){return O.b?O.b(b,this):O.call(null,b,this)};rc.prototype[Oa]=function(){return vc(this)};
var qc=function qc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return qc.a(arguments[0]);case 2:return qc.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};qc.a=function(a){return qc.b(a,0)};qc.b=function(a,b){return b<a.length?new rc(a,b):null};qc.A=2;
var I=function I(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return I.a(arguments[0]);case 2:return I.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};I.a=function(a){return qc.b(a,0)};I.b=function(a,b){return qc.b(a,b)};I.A=2;Fc;Uc;function Pc(a,b,c){this.wb=a;this.j=b;this.s=c;this.i=32374990;this.B=8192}g=Pc.prototype;g.toString=function(){return Xb(this)};
g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.s};g.ta=function(){return 0<this.j?new Pc(this.wb,this.j-1,null):null};g.Z=function(){return this.j+1};g.L=function(){return zc(this)};g.v=function(a,b){return Ec.b?Ec.b(this,b):Ec.call(null,this,b)};g.V=function(){var a=tc,b=this.s;return Fc.b?Fc.b(a,b):Fc.call(null,a,b)};g.aa=function(a,b){return Uc.b?Uc.b(b,this):Uc.call(null,b,this)};g.ba=function(a,b,c){return Uc.c?Uc.c(b,c,this):Uc.call(null,b,c,this)};
g.Y=function(){return G.b(this.wb,this.j)};g.qa=function(){return 0<this.j?new Pc(this.wb,this.j-1,null):tc};g.S=function(){return this};g.R=function(a,b){return new Pc(this.wb,this.j,b)};g.T=function(a,b){return O.b?O.b(b,this):O.call(null,b,this)};Pc.prototype[Oa]=function(){return vc(this)};function Vc(a){for(;;){var b=M(a);if(null!=b)a=b;else return L(a)}}vb._=function(a,b){return a===b};
var Wc=function Wc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Wc.w();case 1:return Wc.a(arguments[0]);case 2:return Wc.b(arguments[0],arguments[1]);default:return Wc.m(arguments[0],arguments[1],new rc(c.slice(2),0))}};Wc.w=function(){return Xc};Wc.a=function(a){return a};Wc.b=function(a,b){return null!=a?Wa(a,b):Wa(tc,b)};Wc.m=function(a,b,c){for(;;)if(w(c))a=Wc.b(a,b),b=L(c),c=M(c);else return Wc.b(a,b)};
Wc.F=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return Wc.m(b,a,c)};Wc.A=2;function P(a){if(null!=a)if(null!=a&&(a.i&2||a.Xb))a=a.Z(null);else if(La(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.i&8388608||a.gc))a:{a=K(a);for(var b=0;;){if(Rc(a)){a=b+Ta(a);break a}a=M(a);b+=1}}else a=Ta(a);else a=0;return a}function Yc(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return K(a)?L(a):c;if(Sc(a))return G.c(a,b,c);if(K(a)){var d=M(a),e=b-1;a=d;b=e}else return c}}
function Zc(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.i&16||a.Nb))return a.U(null,b);if(La(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.$a)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(K(c)){c=L(c);break a}throw Error("Index out of bounds");}if(Sc(c)){c=G.b(c,d);break a}if(K(c))c=M(c),--d;else throw Error("Index out of bounds");
}}return c}if(B(Xa,a))return G.b(a,b);throw Error([E("nth not supported on this type "),E(Na(null==a?null:a.constructor))].join(""));}
function Q(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.i&16||a.Nb))return a.wa(null,b,null);if(La(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.$a))return Yc(a,b);if(B(Xa,a))return G.b(a,b);throw Error([E("nth not supported on this type "),E(Na(null==a?null:a.constructor))].join(""));}
var nc=function nc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return nc.b(arguments[0],arguments[1]);case 3:return nc.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};nc.b=function(a,b){return null==a?null:null!=a&&(a.i&256||a.$b)?a.K(null,b):La(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:B(cb,a)?db.b(a,b):null};
nc.c=function(a,b,c){return null!=a?null!=a&&(a.i&256||a.$b)?a.H(null,b,c):La(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:B(cb,a)?db.c(a,b,c):c:c};nc.A=3;$c;var ad=function ad(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return ad.c(arguments[0],arguments[1],arguments[2]);default:return ad.m(arguments[0],arguments[1],arguments[2],new rc(c.slice(3),0))}};ad.c=function(a,b,c){return null!=a?fb(a,b,c):bd([b],[c])};
ad.m=function(a,b,c,d){for(;;)if(a=ad.c(a,b,c),w(d))b=L(d),c=L(M(d)),d=M(M(d));else return a};ad.F=function(a){var b=L(a),c=M(a);a=L(c);var d=M(c),c=L(d),d=M(d);return ad.m(b,a,c,d)};ad.A=3;function cd(a,b){this.g=a;this.s=b;this.i=393217;this.B=0}g=cd.prototype;g.O=function(){return this.s};g.R=function(a,b){return new cd(this.g,b)};
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y,D,J,S){a=this;return F.kb?F.kb(a.g,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y,D,J,S):F.call(null,a.g,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y,D,J,S)}function b(a,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y,D,J){a=this;return a.g.na?a.g.na(b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y,D,J):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y,D,J)}function c(a,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y,D){a=this;return a.g.ma?a.g.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y,D):
a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y,D)}function d(a,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y){a=this;return a.g.la?a.g.la(b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A,y)}function e(a,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A){a=this;return a.g.ka?a.g.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x,A)}function f(a,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x){a=this;return a.g.ja?a.g.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,v,u,x):a.g.call(null,b,
c,d,e,f,h,k,l,m,n,p,q,r,v,u,x)}function h(a,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u){a=this;return a.g.ia?a.g.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,v,u):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,v,u)}function k(a,b,c,d,e,f,h,k,l,m,n,p,q,r,v){a=this;return a.g.ha?a.g.ha(b,c,d,e,f,h,k,l,m,n,p,q,r,v):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,v)}function l(a,b,c,d,e,f,h,k,l,m,n,p,q,r){a=this;return a.g.ga?a.g.ga(b,c,d,e,f,h,k,l,m,n,p,q,r):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r)}function m(a,b,c,d,e,f,h,k,l,m,n,p,q){a=this;
return a.g.fa?a.g.fa(b,c,d,e,f,h,k,l,m,n,p,q):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q)}function n(a,b,c,d,e,f,h,k,l,m,n,p){a=this;return a.g.ea?a.g.ea(b,c,d,e,f,h,k,l,m,n,p):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p)}function p(a,b,c,d,e,f,h,k,l,m,n){a=this;return a.g.da?a.g.da(b,c,d,e,f,h,k,l,m,n):a.g.call(null,b,c,d,e,f,h,k,l,m,n)}function q(a,b,c,d,e,f,h,k,l,m){a=this;return a.g.pa?a.g.pa(b,c,d,e,f,h,k,l,m):a.g.call(null,b,c,d,e,f,h,k,l,m)}function r(a,b,c,d,e,f,h,k,l){a=this;return a.g.oa?a.g.oa(b,c,
d,e,f,h,k,l):a.g.call(null,b,c,d,e,f,h,k,l)}function u(a,b,c,d,e,f,h,k){a=this;return a.g.X?a.g.X(b,c,d,e,f,h,k):a.g.call(null,b,c,d,e,f,h,k)}function x(a,b,c,d,e,f,h){a=this;return a.g.W?a.g.W(b,c,d,e,f,h):a.g.call(null,b,c,d,e,f,h)}function v(a,b,c,d,e,f){a=this;return a.g.D?a.g.D(b,c,d,e,f):a.g.call(null,b,c,d,e,f)}function A(a,b,c,d,e){a=this;return a.g.o?a.g.o(b,c,d,e):a.g.call(null,b,c,d,e)}function D(a,b,c,d){a=this;return a.g.c?a.g.c(b,c,d):a.g.call(null,b,c,d)}function J(a,b,c){a=this;return a.g.b?
a.g.b(b,c):a.g.call(null,b,c)}function S(a,b){a=this;return a.g.a?a.g.a(b):a.g.call(null,b)}function ra(a){a=this;return a.g.w?a.g.w():a.g.call(null)}var y=null,y=function(Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,y,$a,tb,Hb,ac,Jc,vd,gf){switch(arguments.length){case 1:return ra.call(this,Ia);case 2:return S.call(this,Ia,R);case 3:return J.call(this,Ia,R,U);case 4:return D.call(this,Ia,R,U,Y);case 5:return A.call(this,Ia,R,U,Y,da);case 6:return v.call(this,Ia,R,U,Y,da,ga);case 7:return x.call(this,Ia,
R,U,Y,da,ga,ka);case 8:return u.call(this,Ia,R,U,Y,da,ga,ka,na);case 9:return r.call(this,Ia,R,U,Y,da,ga,ka,na,pa);case 10:return q.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa);case 11:return p.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa,xa);case 12:return n.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga);case 13:return m.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja);case 14:return l.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra);case 15:return k.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,y);case 16:return h.call(this,
Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,y,$a);case 17:return f.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,y,$a,tb);case 18:return e.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,y,$a,tb,Hb);case 19:return d.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,y,$a,tb,Hb,ac);case 20:return c.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,y,$a,tb,Hb,ac,Jc);case 21:return b.call(this,Ia,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,y,$a,tb,Hb,ac,Jc,vd);case 22:return a.call(this,Ia,R,U,Y,da,ga,ka,na,pa,
qa,xa,Ga,Ja,Ra,y,$a,tb,Hb,ac,Jc,vd,gf)}throw Error("Invalid arity: "+arguments.length);};y.a=ra;y.b=S;y.c=J;y.o=D;y.D=A;y.W=v;y.X=x;y.oa=u;y.pa=r;y.da=q;y.ea=p;y.fa=n;y.ga=m;y.ha=l;y.ia=k;y.ja=h;y.ka=f;y.la=e;y.ma=d;y.na=c;y.Hb=b;y.kb=a;return y}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.w=function(){return this.g.w?this.g.w():this.g.call(null)};g.a=function(a){return this.g.a?this.g.a(a):this.g.call(null,a)};
g.b=function(a,b){return this.g.b?this.g.b(a,b):this.g.call(null,a,b)};g.c=function(a,b,c){return this.g.c?this.g.c(a,b,c):this.g.call(null,a,b,c)};g.o=function(a,b,c,d){return this.g.o?this.g.o(a,b,c,d):this.g.call(null,a,b,c,d)};g.D=function(a,b,c,d,e){return this.g.D?this.g.D(a,b,c,d,e):this.g.call(null,a,b,c,d,e)};g.W=function(a,b,c,d,e,f){return this.g.W?this.g.W(a,b,c,d,e,f):this.g.call(null,a,b,c,d,e,f)};
g.X=function(a,b,c,d,e,f,h){return this.g.X?this.g.X(a,b,c,d,e,f,h):this.g.call(null,a,b,c,d,e,f,h)};g.oa=function(a,b,c,d,e,f,h,k){return this.g.oa?this.g.oa(a,b,c,d,e,f,h,k):this.g.call(null,a,b,c,d,e,f,h,k)};g.pa=function(a,b,c,d,e,f,h,k,l){return this.g.pa?this.g.pa(a,b,c,d,e,f,h,k,l):this.g.call(null,a,b,c,d,e,f,h,k,l)};g.da=function(a,b,c,d,e,f,h,k,l,m){return this.g.da?this.g.da(a,b,c,d,e,f,h,k,l,m):this.g.call(null,a,b,c,d,e,f,h,k,l,m)};
g.ea=function(a,b,c,d,e,f,h,k,l,m,n){return this.g.ea?this.g.ea(a,b,c,d,e,f,h,k,l,m,n):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n)};g.fa=function(a,b,c,d,e,f,h,k,l,m,n,p){return this.g.fa?this.g.fa(a,b,c,d,e,f,h,k,l,m,n,p):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p)};g.ga=function(a,b,c,d,e,f,h,k,l,m,n,p,q){return this.g.ga?this.g.ga(a,b,c,d,e,f,h,k,l,m,n,p,q):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q)};
g.ha=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r){return this.g.ha?this.g.ha(a,b,c,d,e,f,h,k,l,m,n,p,q,r):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r)};g.ia=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u){return this.g.ia?this.g.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u)};g.ja=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x){return this.g.ja?this.g.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x)};
g.ka=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v){return this.g.ka?this.g.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v)};g.la=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A){return this.g.la?this.g.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A)};
g.ma=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D){return this.g.ma?this.g.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D)};g.na=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J){return this.g.na?this.g.na(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J)};
g.Hb=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J,S){return F.kb?F.kb(this.g,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J,S):F.call(null,this.g,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J,S)};function Fc(a,b){return ba(a)?new cd(a,b):null==a?null:rb(a,b)}function dd(a){var b=null!=a;return(b?null!=a?a.i&131072||a.cc||(a.i?0:B(ob,a)):B(ob,a):b)?pb(a):null}function ed(a){return null==a?!1:null!=a?a.i&8||a.wc?!0:a.i?!1:B(Va,a):B(Va,a)}
function fd(a){return null==a?!1:null!=a?a.i&4096||a.Bc?!0:a.i?!1:B(kb,a):B(kb,a)}function gd(a){return null!=a?a.i&16777216||a.Ac?!0:a.i?!1:B(zb,a):B(zb,a)}function hd(a){return null==a?!1:null!=a?a.i&1024||a.ac?!0:a.i?!1:B(gb,a):B(gb,a)}function id(a){return null!=a?a.i&16384||a.Cc?!0:a.i?!1:B(lb,a):B(lb,a)}jd;kd;function ld(a){return null!=a?a.B&512||a.vc?!0:!1:!1}function md(a){var b=[];ja(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}
function nd(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var od={};function pd(a){return null==a?!1:null!=a?a.i&64||a.$a?!0:a.i?!1:B(Ya,a):B(Ya,a)}function qd(a){return null==a?!1:!1===a?!1:!0}function rd(a,b){return nc.c(a,b,od)===od?!1:!0}
function fc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return ma(a,b);throw Error([E("Cannot compare "),E(a),E(" to "),E(b)].join(""));}if(null!=a?a.B&2048||a.jb||(a.B?0:B(Lb,a)):B(Lb,a))return Mb(a,b);if("string"!==typeof a&&!La(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([E("Cannot compare "),E(a),E(" to "),E(b)].join(""));return ma(a,b)}
function sd(a,b){var c=P(a),d=P(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=fc(Zc(a,d),Zc(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}td;var Uc=function Uc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Uc.b(arguments[0],arguments[1]);case 3:return Uc.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
Uc.b=function(a,b){var c=K(b);if(c){var d=L(c),c=M(c);return Qa.c?Qa.c(a,d,c):Qa.call(null,a,d,c)}return a.w?a.w():a.call(null)};Uc.c=function(a,b,c){for(c=K(c);;)if(c){var d=L(c);b=a.b?a.b(b,d):a.call(null,b,d);if(Hc(b))return nb(b);c=M(c)}else return b};Uc.A=3;ud;
var Qa=function Qa(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Qa.b(arguments[0],arguments[1]);case 3:return Qa.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Qa.b=function(a,b){return null!=b&&(b.i&524288||b.ec)?b.aa(null,a):La(b)?Lc(b,a):"string"===typeof b?Lc(b,a):B(sb,b)?ub.b(b,a):Uc.b(a,b)};
Qa.c=function(a,b,c){return null!=c&&(c.i&524288||c.ec)?c.ba(null,a,b):La(c)?Mc(c,a,b):"string"===typeof c?Mc(c,a,b):B(sb,c)?ub.c(c,a,b):Uc.c(a,b,c)};Qa.A=3;function wd(a){return a}var xd=function xd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return xd.w();case 1:return xd.a(arguments[0]);case 2:return xd.b(arguments[0],arguments[1]);default:return xd.m(arguments[0],arguments[1],new rc(c.slice(2),0))}};xd.w=function(){return 0};
xd.a=function(a){return a};xd.b=function(a,b){return a+b};xd.m=function(a,b,c){return Qa.c(xd,a+b,c)};xd.F=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return xd.m(b,a,c)};xd.A=2;var yd=function yd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return yd.a(arguments[0]);case 2:return yd.b(arguments[0],arguments[1]);default:return yd.m(arguments[0],arguments[1],new rc(c.slice(2),0))}};yd.a=function(a){return-a};
yd.b=function(a,b){return a-b};yd.m=function(a,b,c){return Qa.c(yd,a-b,c)};yd.F=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return yd.m(b,a,c)};yd.A=2;var zd=function zd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return zd.w();case 1:return zd.a(arguments[0]);case 2:return zd.b(arguments[0],arguments[1]);default:return zd.m(arguments[0],arguments[1],new rc(c.slice(2),0))}};zd.w=function(){return 1};zd.a=function(a){return a};
zd.b=function(a,b){return a*b};zd.m=function(a,b,c){return Qa.c(zd,a*b,c)};zd.F=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return zd.m(b,a,c)};zd.A=2;oa.Gc;var Ad=function Ad(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ad.a(arguments[0]);case 2:return Ad.b(arguments[0],arguments[1]);default:return Ad.m(arguments[0],arguments[1],new rc(c.slice(2),0))}};Ad.a=function(a){return 1/a};Ad.b=function(a,b){return a/b};
Ad.m=function(a,b,c){return Qa.c(Ad,a/b,c)};Ad.F=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return Ad.m(b,a,c)};Ad.A=2;Bd;function Bd(a,b){return(a%b+b)%b}function Cd(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function Dd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function Ed(a,b){for(var c=b,d=K(a);;)if(d&&0<c)--c,d=M(d);else return d}
var E=function E(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return E.w();case 1:return E.a(arguments[0]);default:return E.m(arguments[0],new rc(c.slice(1),0))}};E.w=function(){return""};E.a=function(a){return null==a?"":""+a};E.m=function(a,b){for(var c=new la(""+E(a)),d=b;;)if(w(d))c=c.append(""+E(L(d))),d=M(d);else return c.toString()};E.F=function(a){var b=L(a);a=M(a);return E.m(b,a)};E.A=1;
function Fd(a,b){return a.substring(b)}Gd;Hd;function Ec(a,b){var c;if(gd(b))if(Rc(a)&&Rc(b)&&P(a)!==P(b))c=!1;else a:{c=K(a);for(var d=K(b);;){if(null==c){c=null==d;break a}if(null!=d&&ec.b(L(c),L(d)))c=M(c),d=M(d);else{c=!1;break a}}}else c=null;return qd(c)}function Oc(a){if(K(a)){var b=kc(L(a));for(a=M(a);;){if(null==a)return b;b=lc(b,kc(L(a)));a=M(a)}}else return 0}Id;Jd;Hd;Kd;Ld;function Qc(a,b,c,d,e){this.s=a;this.first=b;this.ua=c;this.count=d;this.u=e;this.i=65937646;this.B=8192}g=Qc.prototype;
g.toString=function(){return Xb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.s};g.ta=function(){return 1===this.count?null:this.ua};g.Z=function(){return this.count};g.L=function(){var a=this.u;return null!=a?a:this.u=a=zc(this)};g.v=function(a,b){return Ec(this,b)};g.V=function(){return rb(tc,this.s)};g.aa=function(a,b){return Uc.b(b,this)};g.ba=function(a,b,c){return Uc.c(b,c,this)};g.Y=function(){return this.first};g.qa=function(){return 1===this.count?tc:this.ua};
g.S=function(){return this};g.R=function(a,b){return new Qc(b,this.first,this.ua,this.count,this.u)};g.T=function(a,b){return new Qc(this.s,b,this,this.count+1,null)};Qc.prototype[Oa]=function(){return vc(this)};function Md(a){this.s=a;this.i=65937614;this.B=8192}g=Md.prototype;g.toString=function(){return Xb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.s};g.ta=function(){return null};g.Z=function(){return 0};g.L=function(){return Ac};
g.v=function(a,b){return(null!=b?b.i&33554432||b.zc||(b.i?0:B(Ab,b)):B(Ab,b))||gd(b)?null==K(b):!1};g.V=function(){return this};g.aa=function(a,b){return Uc.b(b,this)};g.ba=function(a,b,c){return Uc.c(b,c,this)};g.Y=function(){return null};g.qa=function(){return tc};g.S=function(){return null};g.R=function(a,b){return new Md(b)};g.T=function(a,b){return new Qc(this.s,b,null,1,null)};var tc=new Md(null);Md.prototype[Oa]=function(){return vc(this)};
var dc=function dc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return dc.m(0<c.length?new rc(c.slice(0),0):null)};dc.m=function(a){var b;if(a instanceof rc&&0===a.j)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.Y(null)),a=a.ta(null);else break a;a=b.length;for(var c=tc;;)if(0<a){var d=a-1,c=c.T(null,b[a-1]);a=d}else return c};dc.A=0;dc.F=function(a){return dc.m(K(a))};function Nd(a,b,c,d){this.s=a;this.first=b;this.ua=c;this.u=d;this.i=65929452;this.B=8192}
g=Nd.prototype;g.toString=function(){return Xb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.s};g.ta=function(){return null==this.ua?null:K(this.ua)};g.L=function(){var a=this.u;return null!=a?a:this.u=a=zc(this)};g.v=function(a,b){return Ec(this,b)};g.V=function(){return Fc(tc,this.s)};g.aa=function(a,b){return Uc.b(b,this)};g.ba=function(a,b,c){return Uc.c(b,c,this)};g.Y=function(){return this.first};g.qa=function(){return null==this.ua?tc:this.ua};g.S=function(){return this};
g.R=function(a,b){return new Nd(b,this.first,this.ua,this.u)};g.T=function(a,b){return new Nd(null,b,this,this.u)};Nd.prototype[Oa]=function(){return vc(this)};function O(a,b){var c=null==b;return(c?c:null!=b&&(b.i&64||b.$a))?new Nd(null,a,b,null):new Nd(null,a,K(b),null)}function Od(a,b){if(a.Ga===b.Ga)return 0;var c=Ma(a.sa);if(w(c?b.sa:c))return-1;if(w(a.sa)){if(Ma(b.sa))return 1;c=ma(a.sa,b.sa);return 0===c?ma(a.name,b.name):c}return ma(a.name,b.name)}
function z(a,b,c,d){this.sa=a;this.name=b;this.Ga=c;this.Ya=d;this.i=2153775105;this.B=4096}g=z.prototype;g.toString=function(){return[E(":"),E(this.Ga)].join("")};g.equiv=function(a){return this.v(null,a)};g.v=function(a,b){return b instanceof z?this.Ga===b.Ga:!1};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return nc.b(c,this);case 3:return nc.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return nc.b(c,this)};a.c=function(a,c,d){return nc.c(c,this,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.a=function(a){return nc.b(a,this)};g.b=function(a,b){return nc.c(a,this,b)};
g.L=function(){var a=this.Ya;return null!=a?a:this.Ya=a=lc(cc(this.name),jc(this.sa))+2654435769|0};g.nb=function(){return this.name};g.ob=function(){return this.sa};g.J=function(a,b){return Bb(b,[E(":"),E(this.Ga)].join(""))};var Pd=function Pd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Pd.a(arguments[0]);case 2:return Pd.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
Pd.a=function(a){if(a instanceof z)return a;if(a instanceof H){var b;if(null!=a&&(a.B&4096||a.dc))b=a.ob(null);else throw Error([E("Doesn't support namespace: "),E(a)].join(""));return new z(b,Hd.a?Hd.a(a):Hd.call(null,a),a.Ia,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new z(b[0],b[1],a,null):new z(null,b[0],a,null)):null};Pd.b=function(a,b){return new z(a,b,[E(w(a)?[E(a),E("/")].join(""):null),E(b)].join(""),null)};Pd.A=2;
function Qd(a,b,c,d){this.s=a;this.cb=b;this.C=c;this.u=d;this.i=32374988;this.B=0}g=Qd.prototype;g.toString=function(){return Xb(this)};g.equiv=function(a){return this.v(null,a)};function Rd(a){null!=a.cb&&(a.C=a.cb.w?a.cb.w():a.cb.call(null),a.cb=null);return a.C}g.O=function(){return this.s};g.ta=function(){yb(this);return null==this.C?null:M(this.C)};g.L=function(){var a=this.u;return null!=a?a:this.u=a=zc(this)};g.v=function(a,b){return Ec(this,b)};g.V=function(){return Fc(tc,this.s)};
g.aa=function(a,b){return Uc.b(b,this)};g.ba=function(a,b,c){return Uc.c(b,c,this)};g.Y=function(){yb(this);return null==this.C?null:L(this.C)};g.qa=function(){yb(this);return null!=this.C?sc(this.C):tc};g.S=function(){Rd(this);if(null==this.C)return null;for(var a=this.C;;)if(a instanceof Qd)a=Rd(a);else return this.C=a,K(this.C)};g.R=function(a,b){return new Qd(b,this.cb,this.C,this.u)};g.T=function(a,b){return O(b,this)};Qd.prototype[Oa]=function(){return vc(this)};Sd;
function Td(a,b){this.Cb=a;this.end=b;this.i=2;this.B=0}Td.prototype.add=function(a){this.Cb[this.end]=a;return this.end+=1};Td.prototype.Aa=function(){var a=new Sd(this.Cb,0,this.end);this.Cb=null;return a};Td.prototype.Z=function(){return this.end};function Sd(a,b,c){this.f=a;this.ca=b;this.end=c;this.i=524306;this.B=0}g=Sd.prototype;g.Z=function(){return this.end-this.ca};g.U=function(a,b){return this.f[this.ca+b]};g.wa=function(a,b,c){return 0<=b&&b<this.end-this.ca?this.f[this.ca+b]:c};
g.Mb=function(){if(this.ca===this.end)throw Error("-drop-first of empty chunk");return new Sd(this.f,this.ca+1,this.end)};g.aa=function(a,b){return Nc(this.f,b,this.f[this.ca],this.ca+1)};g.ba=function(a,b,c){return Nc(this.f,b,c,this.ca)};function jd(a,b,c,d){this.Aa=a;this.Ha=b;this.s=c;this.u=d;this.i=31850732;this.B=1536}g=jd.prototype;g.toString=function(){return Xb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.s};
g.ta=function(){if(1<Ta(this.Aa))return new jd(Nb(this.Aa),this.Ha,this.s,null);var a=yb(this.Ha);return null==a?null:a};g.L=function(){var a=this.u;return null!=a?a:this.u=a=zc(this)};g.v=function(a,b){return Ec(this,b)};g.V=function(){return Fc(tc,this.s)};g.Y=function(){return G.b(this.Aa,0)};g.qa=function(){return 1<Ta(this.Aa)?new jd(Nb(this.Aa),this.Ha,this.s,null):null==this.Ha?tc:this.Ha};g.S=function(){return this};g.Fb=function(){return this.Aa};g.Gb=function(){return null==this.Ha?tc:this.Ha};
g.R=function(a,b){return new jd(this.Aa,this.Ha,b,this.u)};g.T=function(a,b){return O(b,this)};g.Eb=function(){return null==this.Ha?null:this.Ha};jd.prototype[Oa]=function(){return vc(this)};function Ud(a,b){return 0===Ta(a)?b:new jd(a,b,null,null)}function Vd(a,b){a.add(b)}function Kd(a){return Ob(a)}function Ld(a){return Pb(a)}function td(a){for(var b=[];;)if(K(a))b.push(L(a)),a=M(a);else return b}
function Wd(a,b){if(Rc(a))return P(a);for(var c=a,d=b,e=0;;)if(0<d&&K(c))c=M(c),--d,e+=1;else return e}var Xd=function Xd(b){return null==b?null:null==M(b)?K(L(b)):O(L(b),Xd(M(b)))},Yd=function Yd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Yd.w();case 1:return Yd.a(arguments[0]);case 2:return Yd.b(arguments[0],arguments[1]);default:return Yd.m(arguments[0],arguments[1],new rc(c.slice(2),0))}};
Yd.w=function(){return new Qd(null,function(){return null},null,null)};Yd.a=function(a){return new Qd(null,function(){return a},null,null)};Yd.b=function(a,b){return new Qd(null,function(){var c=K(a);return c?ld(c)?Ud(Ob(c),Yd.b(Pb(c),b)):O(L(c),Yd.b(sc(c),b)):b},null,null)};Yd.m=function(a,b,c){return function e(a,b){return new Qd(null,function(){var c=K(a);return c?ld(c)?Ud(Ob(c),e(Pb(c),b)):O(L(c),e(sc(c),b)):w(b)?e(L(b),M(b)):null},null,null)}(Yd.b(a,b),c)};
Yd.F=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return Yd.m(b,a,c)};Yd.A=2;var Zd=function Zd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Zd.w();case 1:return Zd.a(arguments[0]);case 2:return Zd.b(arguments[0],arguments[1]);default:return Zd.m(arguments[0],arguments[1],new rc(c.slice(2),0))}};Zd.w=function(){return Fb(Xc)};Zd.a=function(a){return a};Zd.b=function(a,b){return Gb(a,b)};
Zd.m=function(a,b,c){for(;;)if(a=Gb(a,b),w(c))b=L(c),c=M(c);else return a};Zd.F=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return Zd.m(b,a,c)};Zd.A=2;
function $d(a,b,c){var d=K(c);if(0===b)return a.w?a.w():a.call(null);c=Za(d);var e=ab(d);if(1===b)return a.a?a.a(c):a.a?a.a(c):a.call(null,c);var d=Za(e),f=ab(e);if(2===b)return a.b?a.b(c,d):a.b?a.b(c,d):a.call(null,c,d);var e=Za(f),h=ab(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=Za(h),k=ab(h);if(4===b)return a.o?a.o(c,d,e,f):a.o?a.o(c,d,e,f):a.call(null,c,d,e,f);var h=Za(k),l=ab(k);if(5===b)return a.D?a.D(c,d,e,f,h):a.D?a.D(c,d,e,f,h):a.call(null,c,d,e,f,h);var k=Za(l),
m=ab(l);if(6===b)return a.W?a.W(c,d,e,f,h,k):a.W?a.W(c,d,e,f,h,k):a.call(null,c,d,e,f,h,k);var l=Za(m),n=ab(m);if(7===b)return a.X?a.X(c,d,e,f,h,k,l):a.X?a.X(c,d,e,f,h,k,l):a.call(null,c,d,e,f,h,k,l);var m=Za(n),p=ab(n);if(8===b)return a.oa?a.oa(c,d,e,f,h,k,l,m):a.oa?a.oa(c,d,e,f,h,k,l,m):a.call(null,c,d,e,f,h,k,l,m);var n=Za(p),q=ab(p);if(9===b)return a.pa?a.pa(c,d,e,f,h,k,l,m,n):a.pa?a.pa(c,d,e,f,h,k,l,m,n):a.call(null,c,d,e,f,h,k,l,m,n);var p=Za(q),r=ab(q);if(10===b)return a.da?a.da(c,d,e,f,h,
k,l,m,n,p):a.da?a.da(c,d,e,f,h,k,l,m,n,p):a.call(null,c,d,e,f,h,k,l,m,n,p);var q=Za(r),u=ab(r);if(11===b)return a.ea?a.ea(c,d,e,f,h,k,l,m,n,p,q):a.ea?a.ea(c,d,e,f,h,k,l,m,n,p,q):a.call(null,c,d,e,f,h,k,l,m,n,p,q);var r=Za(u),x=ab(u);if(12===b)return a.fa?a.fa(c,d,e,f,h,k,l,m,n,p,q,r):a.fa?a.fa(c,d,e,f,h,k,l,m,n,p,q,r):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r);var u=Za(x),v=ab(x);if(13===b)return a.ga?a.ga(c,d,e,f,h,k,l,m,n,p,q,r,u):a.ga?a.ga(c,d,e,f,h,k,l,m,n,p,q,r,u):a.call(null,c,d,e,f,h,k,l,m,n,p,q,
r,u);var x=Za(v),A=ab(v);if(14===b)return a.ha?a.ha(c,d,e,f,h,k,l,m,n,p,q,r,u,x):a.ha?a.ha(c,d,e,f,h,k,l,m,n,p,q,r,u,x):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,u,x);var v=Za(A),D=ab(A);if(15===b)return a.ia?a.ia(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v):a.ia?a.ia(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v);var A=Za(D),J=ab(D);if(16===b)return a.ja?a.ja(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A):a.ja?a.ja(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A);var D=Za(J),
S=ab(J);if(17===b)return a.ka?a.ka(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D):a.ka?a.ka(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D);var J=Za(S),ra=ab(S);if(18===b)return a.la?a.la(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J):a.la?a.la(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J);S=Za(ra);ra=ab(ra);if(19===b)return a.ma?a.ma(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J,S):a.ma?a.ma(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J,S):a.call(null,c,d,e,f,h,k,
l,m,n,p,q,r,u,x,v,A,D,J,S);var y=Za(ra);ab(ra);if(20===b)return a.na?a.na(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J,S,y):a.na?a.na(c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J,S,y):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,u,x,v,A,D,J,S,y);throw Error("Only up to 20 arguments supported on functions");}
var F=function F(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return F.b(arguments[0],arguments[1]);case 3:return F.c(arguments[0],arguments[1],arguments[2]);case 4:return F.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return F.D(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return F.m(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new rc(c.slice(5),0))}};
F.b=function(a,b){var c=a.A;if(a.F){var d=Wd(b,c+1);return d<=c?$d(a,d,b):a.F(b)}return a.apply(a,td(b))};F.c=function(a,b,c){b=O(b,c);c=a.A;if(a.F){var d=Wd(b,c+1);return d<=c?$d(a,d,b):a.F(b)}return a.apply(a,td(b))};F.o=function(a,b,c,d){b=O(b,O(c,d));c=a.A;return a.F?(d=Wd(b,c+1),d<=c?$d(a,d,b):a.F(b)):a.apply(a,td(b))};F.D=function(a,b,c,d,e){b=O(b,O(c,O(d,e)));c=a.A;return a.F?(d=Wd(b,c+1),d<=c?$d(a,d,b):a.F(b)):a.apply(a,td(b))};
F.m=function(a,b,c,d,e,f){b=O(b,O(c,O(d,O(e,Xd(f)))));c=a.A;return a.F?(d=Wd(b,c+1),d<=c?$d(a,d,b):a.F(b)):a.apply(a,td(b))};F.F=function(a){var b=L(a),c=M(a);a=L(c);var d=M(c),c=L(d),e=M(d),d=L(e),f=M(e),e=L(f),f=M(f);return F.m(b,a,c,d,e,f)};F.A=5;
var ae=function ae(){"undefined"===typeof sa&&(sa=function(b,c){this.rc=b;this.qc=c;this.i=393216;this.B=0},sa.prototype.R=function(b,c){return new sa(this.rc,c)},sa.prototype.O=function(){return this.qc},sa.prototype.ra=function(){return!1},sa.prototype.next=function(){return Error("No such element")},sa.prototype.remove=function(){return Error("Unsupported operation")},sa.oc=function(){return new T(null,2,5,V,[Fc(be,new za(null,1,[ce,dc(de,dc(Xc))],null)),oa.Fc],null)},sa.Ib=!0,sa.qb="cljs.core/t_cljs$core14789",
sa.Sb=function(b,c){return Bb(c,"cljs.core/t_cljs$core14789")});return new sa(ae,ee)};fe;function fe(a,b,c,d){this.hb=a;this.first=b;this.ua=c;this.s=d;this.i=31719628;this.B=0}g=fe.prototype;g.R=function(a,b){return new fe(this.hb,this.first,this.ua,b)};g.T=function(a,b){return O(b,yb(this))};g.V=function(){return tc};g.v=function(a,b){return null!=yb(this)?Ec(this,b):gd(b)&&null==K(b)};g.L=function(){return zc(this)};g.S=function(){null!=this.hb&&this.hb.step(this);return null==this.ua?null:this};
g.Y=function(){null!=this.hb&&yb(this);return null==this.ua?null:this.first};g.qa=function(){null!=this.hb&&yb(this);return null==this.ua?tc:this.ua};g.ta=function(){null!=this.hb&&yb(this);return null==this.ua?null:yb(this.ua)};fe.prototype[Oa]=function(){return vc(this)};function ge(a,b){for(;;){if(null==K(b))return!0;var c;c=L(b);c=a.a?a.a(c):a.call(null,c);if(w(c)){c=a;var d=M(b);a=c;b=d}else return!1}}
function he(a){for(var b=wd;;)if(K(a)){var c;c=L(a);c=b.a?b.a(c):b.call(null,c);if(w(c))return c;a=M(a)}else return null}
function ie(a){return function(){function b(b,c){return Ma(a.b?a.b(b,c):a.call(null,b,c))}function c(b){return Ma(a.a?a.a(b):a.call(null,b))}function d(){return Ma(a.w?a.w():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new rc(h,0)}return c.call(this,a,d,f)}function c(b,d,e){return Ma(F.o(a,b,d,e))}b.A=2;b.F=function(a){var b=L(a);a=M(a);var d=L(a);a=sc(a);return c(b,d,a)};b.m=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new rc(n,0)}return f.m(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.A=2;e.F=f.F;e.w=d;e.a=c;e.b=b;e.m=f.m;return e}()}
function je(){return function(){function a(a){if(0<arguments.length)for(var c=0,d=Array(arguments.length-0);c<d.length;)d[c]=arguments[c+0],++c;return null}a.A=0;a.F=function(a){K(a);return null};a.m=function(){return null};return a}()}ke;function le(a,b,c,d){this.state=a;this.s=b;this.uc=c;this.zb=d;this.B=16386;this.i=6455296}g=le.prototype;g.equiv=function(a){return this.v(null,a)};g.v=function(a,b){return this===b};g.xb=function(){return this.state};g.O=function(){return this.s};
g.Qb=function(a,b,c){a=K(this.zb);for(var d=null,e=0,f=0;;)if(f<e){var h=d.U(null,f),k=Q(h,0),h=Q(h,1);h.o?h.o(k,this,b,c):h.call(null,k,this,b,c);f+=1}else if(a=K(a))ld(a)?(d=Ob(a),a=Pb(a),k=d,e=P(d),d=k):(d=L(a),k=Q(d,0),h=Q(d,1),h.o?h.o(k,this,b,c):h.call(null,k,this,b,c),a=M(a),d=null,e=0),f=0;else return null};g.Pb=function(a,b,c){this.zb=ad.c(this.zb,b,c);return this};g.L=function(){return this[ca]||(this[ca]=++ea)};
var W=function W(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return W.a(arguments[0]);default:return W.m(arguments[0],new rc(c.slice(1),0))}};W.a=function(a){return new le(a,null,null,null)};W.m=function(a,b){var c=null!=b&&(b.i&64||b.$a)?F.b(Dc,b):b,d=nc.b(c,Ca),c=nc.b(c,me);return new le(a,d,c,null)};W.F=function(a){var b=L(a);a=M(a);return W.m(b,a)};W.A=1;ne;
function oe(a,b){if(a instanceof le){var c=a.uc;if(null!=c&&!w(c.a?c.a(b):c.call(null,b)))throw Error([E("Assert failed: "),E("Validator rejected reference state"),E("\n"),E(function(){var a=dc(pe,qe);return ne.a?ne.a(a):ne.call(null,a)}())].join(""));c=a.state;a.state=b;null!=a.zb&&Db(a,c,b);return b}return Tb(a,b)}
var re=function re(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return re.b(arguments[0],arguments[1]);case 3:return re.c(arguments[0],arguments[1],arguments[2]);case 4:return re.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:return re.m(arguments[0],arguments[1],arguments[2],arguments[3],new rc(c.slice(4),0))}};re.b=function(a,b){var c;a instanceof le?(c=a.state,c=b.a?b.a(c):b.call(null,c),c=oe(a,c)):c=Ub.b(a,b);return c};
re.c=function(a,b,c){if(a instanceof le){var d=a.state;b=b.b?b.b(d,c):b.call(null,d,c);a=oe(a,b)}else a=Ub.c(a,b,c);return a};re.o=function(a,b,c,d){if(a instanceof le){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=oe(a,b)}else a=Ub.o(a,b,c,d);return a};re.m=function(a,b,c,d,e){return a instanceof le?oe(a,F.D(b,a.state,c,d,e)):Ub.D(a,b,c,d,e)};re.F=function(a){var b=L(a),c=M(a);a=L(c);var d=M(c),c=L(d),e=M(d),d=L(e),e=M(e);return re.m(b,a,c,d,e)};re.A=4;
function se(a){this.state=a;this.i=32768;this.B=0}se.prototype.xb=function(){return this.state};function ke(a){return new se(a)}
var Gd=function Gd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Gd.a(arguments[0]);case 2:return Gd.b(arguments[0],arguments[1]);case 3:return Gd.c(arguments[0],arguments[1],arguments[2]);case 4:return Gd.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Gd.m(arguments[0],arguments[1],arguments[2],arguments[3],new rc(c.slice(4),0))}};
Gd.a=function(a){return function(b){return function(){function c(c,d){var e=a.a?a.a(d):a.call(null,d);return b.b?b.b(c,e):b.call(null,c,e)}function d(a){return b.a?b.a(a):b.call(null,a)}function e(){return b.w?b.w():b.call(null)}var f=null,h=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new rc(h,0)}return d.call(this,a,b,f)}function d(c,e,f){e=F.c(a,e,f);return b.b?b.b(c,e):b.call(null,c,e)}c.A=2;c.F=function(a){var b=
L(a);a=M(a);var c=L(a);a=sc(a);return d(b,c,a)};c.m=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new rc(p,0)}return h.m(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.A=2;f.F=h.F;f.w=e;f.a=d;f.b=c;f.m=h.m;return f}()}};
Gd.b=function(a,b){return new Qd(null,function(){var c=K(b);if(c){if(ld(c)){for(var d=Ob(c),e=P(d),f=new Td(Array(e),0),h=0;;)if(h<e)Vd(f,function(){var b=G.b(d,h);return a.a?a.a(b):a.call(null,b)}()),h+=1;else break;return Ud(f.Aa(),Gd.b(a,Pb(c)))}return O(function(){var b=L(c);return a.a?a.a(b):a.call(null,b)}(),Gd.b(a,sc(c)))}return null},null,null)};
Gd.c=function(a,b,c){return new Qd(null,function(){var d=K(b),e=K(c);if(d&&e){var f=O,h;h=L(d);var k=L(e);h=a.b?a.b(h,k):a.call(null,h,k);d=f(h,Gd.c(a,sc(d),sc(e)))}else d=null;return d},null,null)};Gd.o=function(a,b,c,d){return new Qd(null,function(){var e=K(b),f=K(c),h=K(d);if(e&&f&&h){var k=O,l;l=L(e);var m=L(f),n=L(h);l=a.c?a.c(l,m,n):a.call(null,l,m,n);e=k(l,Gd.o(a,sc(e),sc(f),sc(h)))}else e=null;return e},null,null)};
Gd.m=function(a,b,c,d,e){var f=function k(a){return new Qd(null,function(){var b=Gd.b(K,a);return ge(wd,b)?O(Gd.b(L,b),k(Gd.b(sc,b))):null},null,null)};return Gd.b(function(){return function(b){return F.b(a,b)}}(f),f(Wc.m(e,d,I([c,b],0))))};Gd.F=function(a){var b=L(a),c=M(a);a=L(c);var d=M(c),c=L(d),e=M(d),d=L(e),e=M(e);return Gd.m(b,a,c,d,e)};Gd.A=4;
function te(a,b){if("number"!==typeof a)throw Error([E("Assert failed: "),E(function(){var a=dc(ue,ve);return ne.a?ne.a(a):ne.call(null,a)}())].join(""));return new Qd(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=K(b);if(0<a&&e){var f=a-1,e=sc(e);a=f;b=e}else return e}}),null,null)}function we(a,b){return Gd.c(function(a){return a},b,te(a,b))}function xe(a,b){for(var c=K(b),d=K(te(a,b));;)if(d)c=M(c),d=M(d);else return c}ye;
function ze(a,b){return new Qd(null,function(){var c=K(b);if(c){if(ld(c)){for(var d=Ob(c),e=P(d),f=new Td(Array(e),0),h=0;;)if(h<e){var k;k=G.b(d,h);k=a.a?a.a(k):a.call(null,k);w(k)&&(k=G.b(d,h),f.add(k));h+=1}else break;return Ud(f.Aa(),ze(a,Pb(c)))}d=L(c);c=sc(c);return w(a.a?a.a(d):a.call(null,d))?O(d,ze(a,c)):ze(a,c)}return null},null,null)}
function Ae(a){return function c(a){return new Qd(null,function(){var e=O,f;w(pd.a?pd.a(a):pd.call(null,a))?(f=I([K.a?K.a(a):K.call(null,a)],0),f=F.b(Yd,F.c(Gd,c,f))):f=null;return e(a,f)},null,null)}(a)}function Be(a,b){var c;null!=a?null!=a&&(a.B&4||a.xc)?(c=Qa.c(Gb,Fb(a),b),c=Ib(c),c=Fc(c,dd(a))):c=Qa.c(Wa,a,b):c=Qa.c(Wc,tc,b);return c}function Ce(a,b){this.M=a;this.f=b}
function De(a){return new Ce(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function Ee(a){a=a.l;return 32>a?0:a-1>>>5<<5}function Fe(a,b,c){for(;;){if(0===b)return c;var d=De(a);d.f[0]=c;c=d;b-=5}}var Ge=function Ge(b,c,d,e){var f=new Ce(d.M,Pa(d.f)),h=b.l-1>>>c&31;5===c?f.f[h]=e:(d=d.f[h],b=null!=d?Ge(b,c-5,d,e):Fe(null,c-5,e),f.f[h]=b);return f};
function He(a,b){throw Error([E("No item "),E(a),E(" in vector of length "),E(b)].join(""));}function Ie(a,b){if(b>=Ee(a))return a.I;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}function Je(a,b){return 0<=b&&b<a.l?Ie(a,b):He(b,a.l)}var Ke=function Ke(b,c,d,e,f){var h=new Ce(d.M,Pa(d.f));if(0===c)h.f[e&31]=f;else{var k=e>>>c&31;b=Ke(b,c-5,d.f[k],e,f);h.f[k]=b}return h};function Le(a,b,c,d,e,f){this.j=a;this.Bb=b;this.f=c;this.Ja=d;this.start=e;this.end=f}
Le.prototype.ra=function(){return this.j<this.end};Le.prototype.next=function(){32===this.j-this.Bb&&(this.f=Ie(this.Ja,this.j),this.Bb+=32);var a=this.f[this.j&31];this.j+=1;return a};Me;Ne;Oe;N;Pe;Qe;Re;function T(a,b,c,d,e,f){this.s=a;this.l=b;this.shift=c;this.root=d;this.I=e;this.u=f;this.i=167668511;this.B=8196}g=T.prototype;g.toString=function(){return Xb(this)};g.equiv=function(a){return this.v(null,a)};g.K=function(a,b){return db.c(this,b,null)};
g.H=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};g.U=function(a,b){return Je(this,b)[b&31]};g.wa=function(a,b,c){return 0<=b&&b<this.l?Ie(this,b)[b&31]:c};g.Ta=function(a,b,c){if(0<=b&&b<this.l)return Ee(this)<=b?(a=Pa(this.I),a[b&31]=c,new T(this.s,this.l,this.shift,this.root,a,null)):new T(this.s,this.l,this.shift,Ke(this,this.shift,this.root,b,c),this.I,null);if(b===this.l)return Wa(this,c);throw Error([E("Index "),E(b),E(" out of bounds  [0,"),E(this.l),E("]")].join(""));};
g.Fa=function(){var a=this.l;return new Le(0,0,0<P(this)?Ie(this,0):null,this,0,a)};g.O=function(){return this.s};g.Z=function(){return this.l};g.lb=function(){return G.b(this,0)};g.mb=function(){return G.b(this,1)};g.L=function(){var a=this.u;return null!=a?a:this.u=a=zc(this)};g.v=function(a,b){if(b instanceof T)if(this.l===P(b))for(var c=Vb(this),d=Vb(b);;)if(w(c.ra())){var e=c.next(),f=d.next();if(!ec.b(e,f))return!1}else return!0;else return!1;else return Ec(this,b)};
g.Za=function(){return new Oe(this.l,this.shift,Me.a?Me.a(this.root):Me.call(null,this.root),Ne.a?Ne.a(this.I):Ne.call(null,this.I))};g.V=function(){return Fc(Xc,this.s)};g.aa=function(a,b){return Ic(this,b)};g.ba=function(a,b,c){a=0;for(var d=c;;)if(a<this.l){var e=Ie(this,a);c=e.length;a:for(var f=0;;)if(f<c){var h=e[f],d=b.b?b.b(d,h):b.call(null,d,h);if(Hc(d)){e=d;break a}f+=1}else{e=d;break a}if(Hc(e))return N.a?N.a(e):N.call(null,e);a+=c;d=e}else return d};
g.Qa=function(a,b,c){if("number"===typeof b)return mb(this,b,c);throw Error("Vector's key for assoc must be a number.");};g.S=function(){if(0===this.l)return null;if(32>=this.l)return new rc(this.I,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return Re.o?Re.o(this,a,0,0):Re.call(null,this,a,0,0)};g.R=function(a,b){return new T(b,this.l,this.shift,this.root,this.I,this.u)};
g.T=function(a,b){if(32>this.l-Ee(this)){for(var c=this.I.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.I[e],e+=1;else break;d[c]=b;return new T(this.s,this.l+1,this.shift,this.root,d,null)}c=(d=this.l>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=De(null),d.f[0]=this.root,e=Fe(null,this.shift,new Ce(null,this.I)),d.f[1]=e):d=Ge(this,this.shift,this.root,new Ce(null,this.I));return new T(this.s,this.l+1,c,d,[b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.U(null,c);case 3:return this.wa(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.U(null,c)};a.c=function(a,c,d){return this.wa(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.a=function(a){return this.U(null,a)};g.b=function(a,b){return this.wa(null,a,b)};
var V=new Ce(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),Xc=new T(null,0,5,V,[],Ac);T.prototype[Oa]=function(){return vc(this)};function ud(a){if(La(a))a:{var b=a.length;if(32>b)a=new T(null,b,5,V,a,null);else for(var c=32,d=(new T(null,32,5,V,a.slice(0,32),null)).Za(null);;)if(c<b)var e=c+1,d=Zd.b(d,a[c]),c=e;else{a=Ib(d);break a}}else a=Ib(Qa.c(Gb,Fb(Xc),a));return a}Se;
function kd(a,b,c,d,e,f){this.za=a;this.node=b;this.j=c;this.ca=d;this.s=e;this.u=f;this.i=32375020;this.B=1536}g=kd.prototype;g.toString=function(){return Xb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.s};g.ta=function(){if(this.ca+1<this.node.length){var a;a=this.za;var b=this.node,c=this.j,d=this.ca+1;a=Re.o?Re.o(a,b,c,d):Re.call(null,a,b,c,d);return null==a?null:a}return Qb(this)};g.L=function(){var a=this.u;return null!=a?a:this.u=a=zc(this)};
g.v=function(a,b){return Ec(this,b)};g.V=function(){return Fc(Xc,this.s)};g.aa=function(a,b){var c;c=this.za;var d=this.j+this.ca,e=P(this.za);c=Se.c?Se.c(c,d,e):Se.call(null,c,d,e);return Ic(c,b)};g.ba=function(a,b,c){a=this.za;var d=this.j+this.ca,e=P(this.za);a=Se.c?Se.c(a,d,e):Se.call(null,a,d,e);return Kc(a,b,c)};g.Y=function(){return this.node[this.ca]};
g.qa=function(){if(this.ca+1<this.node.length){var a;a=this.za;var b=this.node,c=this.j,d=this.ca+1;a=Re.o?Re.o(a,b,c,d):Re.call(null,a,b,c,d);return null==a?tc:a}return Pb(this)};g.S=function(){return this};g.Fb=function(){var a=this.node;return new Sd(a,this.ca,a.length)};g.Gb=function(){var a=this.j+this.node.length;if(a<Ta(this.za)){var b=this.za,c=Ie(this.za,a);return Re.o?Re.o(b,c,a,0):Re.call(null,b,c,a,0)}return tc};
g.R=function(a,b){return Re.D?Re.D(this.za,this.node,this.j,this.ca,b):Re.call(null,this.za,this.node,this.j,this.ca,b)};g.T=function(a,b){return O(b,this)};g.Eb=function(){var a=this.j+this.node.length;if(a<Ta(this.za)){var b=this.za,c=Ie(this.za,a);return Re.o?Re.o(b,c,a,0):Re.call(null,b,c,a,0)}return null};kd.prototype[Oa]=function(){return vc(this)};
var Re=function Re(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Re.c(arguments[0],arguments[1],arguments[2]);case 4:return Re.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Re.D(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Re.c=function(a,b,c){return new kd(a,Je(a,b),b,c,null,null)};
Re.o=function(a,b,c,d){return new kd(a,b,c,d,null,null)};Re.D=function(a,b,c,d,e){return new kd(a,b,c,d,e,null)};Re.A=5;Te;function Ue(a,b,c,d,e){this.s=a;this.Ja=b;this.start=c;this.end=d;this.u=e;this.i=167666463;this.B=8192}g=Ue.prototype;g.toString=function(){return Xb(this)};g.equiv=function(a){return this.v(null,a)};g.K=function(a,b){return db.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};
g.U=function(a,b){return 0>b||this.end<=this.start+b?He(b,this.end-this.start):G.b(this.Ja,this.start+b)};g.wa=function(a,b,c){return 0>b||this.end<=this.start+b?c:G.c(this.Ja,this.start+b,c)};g.Ta=function(a,b,c){var d=this.start+b;a=this.s;c=ad.c(this.Ja,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return Te.D?Te.D(a,c,b,d,null):Te.call(null,a,c,b,d,null)};g.O=function(){return this.s};g.Z=function(){return this.end-this.start};g.L=function(){var a=this.u;return null!=a?a:this.u=a=zc(this)};
g.v=function(a,b){return Ec(this,b)};g.V=function(){return Fc(Xc,this.s)};g.aa=function(a,b){return Ic(this,b)};g.ba=function(a,b,c){return Kc(this,b,c)};g.Qa=function(a,b,c){if("number"===typeof b)return mb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};g.S=function(){var a=this;return function(b){return function d(e){return e===a.end?null:O(G.b(a.Ja,e),new Qd(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};
g.R=function(a,b){return Te.D?Te.D(b,this.Ja,this.start,this.end,this.u):Te.call(null,b,this.Ja,this.start,this.end,this.u)};g.T=function(a,b){var c=this.s,d=mb(this.Ja,this.end,b),e=this.start,f=this.end+1;return Te.D?Te.D(c,d,e,f,null):Te.call(null,c,d,e,f,null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.U(null,c);case 3:return this.wa(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.U(null,c)};a.c=function(a,c,d){return this.wa(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.a=function(a){return this.U(null,a)};g.b=function(a,b){return this.wa(null,a,b)};Ue.prototype[Oa]=function(){return vc(this)};
function Te(a,b,c,d,e){for(;;)if(b instanceof Ue)c=b.start+c,d=b.start+d,b=b.Ja;else{var f=P(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new Ue(a,b,c,d,e)}}var Se=function Se(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Se.b(arguments[0],arguments[1]);case 3:return Se.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
Se.b=function(a,b){return Se.c(a,b,P(a))};Se.c=function(a,b,c){return Te(null,a,b,c,null)};Se.A=3;function Ve(a,b){return a===b.M?b:new Ce(a,Pa(b.f))}function Me(a){return new Ce({},Pa(a.f))}function Ne(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];nd(a,0,b,0,a.length);return b}
var We=function We(b,c,d,e){d=Ve(b.root.M,d);var f=b.l-1>>>c&31;if(5===c)b=e;else{var h=d.f[f];b=null!=h?We(b,c-5,h,e):Fe(b.root.M,c-5,e)}d.f[f]=b;return d};function Oe(a,b,c,d){this.l=a;this.shift=b;this.root=c;this.I=d;this.B=88;this.i=275}g=Oe.prototype;
g.Sa=function(a,b){if(this.root.M){if(32>this.l-Ee(this))this.I[this.l&31]=b;else{var c=new Ce(this.root.M,this.I),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.I=d;if(this.l>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=Fe(this.root.M,this.shift,c);this.root=new Ce(this.root.M,d);this.shift=e}else this.root=We(this,this.shift,this.root,c)}this.l+=1;return this}throw Error("conj! after persistent!");};g.ab=function(){if(this.root.M){this.root.M=null;var a=this.l-Ee(this),b=Array(a);nd(this.I,0,b,0,a);return new T(null,this.l,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
g.pb=function(a,b,c){if("number"===typeof b)return Kb(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
g.Ob=function(a,b,c){var d=this;if(d.root.M){if(0<=b&&b<d.l)return Ee(this)<=b?d.I[b&31]=c:(a=function(){return function f(a,k){var l=Ve(d.root.M,k);if(0===a)l.f[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.l)return Gb(this,c);throw Error([E("Index "),E(b),E(" out of bounds for TransientVector of length"),E(d.l)].join(""));}throw Error("assoc! after persistent!");};
g.Z=function(){if(this.root.M)return this.l;throw Error("count after persistent!");};g.U=function(a,b){if(this.root.M)return Je(this,b)[b&31];throw Error("nth after persistent!");};g.wa=function(a,b,c){return 0<=b&&b<this.l?G.b(this,b):c};g.K=function(a,b){return db.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};function Xe(a,b){this.eb=a;this.vb=b}
Xe.prototype.ra=function(){var a=null!=this.eb&&K(this.eb);return a?a:(a=null!=this.vb)?this.vb.ra():a};Xe.prototype.next=function(){if(null!=this.eb){var a=L(this.eb);this.eb=M(this.eb);return a}if(null!=this.vb&&this.vb.ra())return this.vb.next();throw Error("No such element");};Xe.prototype.remove=function(){return Error("Unsupported operation")};function Ye(a,b,c,d){this.s=a;this.Ba=b;this.Ka=c;this.u=d;this.i=31850572;this.B=0}g=Ye.prototype;g.toString=function(){return Xb(this)};
g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.s};g.L=function(){var a=this.u;return null!=a?a:this.u=a=zc(this)};g.v=function(a,b){return Ec(this,b)};g.V=function(){return Fc(tc,this.s)};g.Y=function(){return L(this.Ba)};g.qa=function(){var a=M(this.Ba);return a?new Ye(this.s,a,this.Ka,null):null==this.Ka?Ua(this):new Ye(this.s,this.Ka,null,null)};g.S=function(){return this};g.R=function(a,b){return new Ye(b,this.Ba,this.Ka,this.u)};g.T=function(a,b){return O(b,this)};
Ye.prototype[Oa]=function(){return vc(this)};function Ze(a,b,c,d,e){this.s=a;this.count=b;this.Ba=c;this.Ka=d;this.u=e;this.i=31858766;this.B=8192}g=Ze.prototype;g.toString=function(){return Xb(this)};g.equiv=function(a){return this.v(null,a)};g.Fa=function(){return new Xe(this.Ba,Vb(this.Ka))};g.O=function(){return this.s};g.Z=function(){return this.count};g.L=function(){var a=this.u;return null!=a?a:this.u=a=zc(this)};g.v=function(a,b){return Ec(this,b)};g.V=function(){return Fc($e,this.s)};
g.Y=function(){return L(this.Ba)};g.qa=function(){return sc(K(this))};g.S=function(){var a=K(this.Ka),b=this.Ba;return w(w(b)?b:a)?new Ye(null,this.Ba,K(a),null):null};g.R=function(a,b){return new Ze(b,this.count,this.Ba,this.Ka,this.u)};g.T=function(a,b){var c;w(this.Ba)?(c=this.Ka,c=new Ze(this.s,this.count+1,this.Ba,Wc.b(w(c)?c:Xc,b),null)):c=new Ze(this.s,this.count+1,Wc.b(this.Ba,b),Xc,null);return c};var $e=new Ze(null,0,null,Xc,Ac);Ze.prototype[Oa]=function(){return vc(this)};
function af(){this.i=2097152;this.B=0}af.prototype.equiv=function(a){return this.v(null,a)};af.prototype.v=function(){return!1};var bf=new af;function cf(a,b){return qd(hd(b)?P(a)===P(b)?ge(wd,Gd.b(function(a){return ec.b(nc.c(b,L(a),bf),L(M(a)))},a)):null:null)}function df(a){this.C=a}df.prototype.next=function(){if(null!=this.C){var a=L(this.C),b=Q(a,0),a=Q(a,1);this.C=M(this.C);return{value:[b,a],done:!1}}return{value:null,done:!0}};function ef(a){return new df(K(a))}function ff(a){this.C=a}
ff.prototype.next=function(){if(null!=this.C){var a=L(this.C);this.C=M(this.C);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function hf(a,b){var c;if(b instanceof z)a:{c=a.length;for(var d=b.Ga,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof z&&d===a[e].Ga){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof H)a:for(c=a.length,d=b.Ia,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof H&&d===a[e].Ia){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(ec.b(b,a[d])){c=d;break a}d+=2}return c}jf;function kf(a,b,c){this.f=a;this.j=b;this.va=c;this.i=32374990;this.B=0}g=kf.prototype;g.toString=function(){return Xb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.va};g.ta=function(){return this.j<this.f.length-2?new kf(this.f,this.j+2,this.va):null};g.Z=function(){return(this.f.length-this.j)/2};g.L=function(){return zc(this)};g.v=function(a,b){return Ec(this,b)};
g.V=function(){return Fc(tc,this.va)};g.aa=function(a,b){return Uc.b(b,this)};g.ba=function(a,b,c){return Uc.c(b,c,this)};g.Y=function(){return new T(null,2,5,V,[this.f[this.j],this.f[this.j+1]],null)};g.qa=function(){return this.j<this.f.length-2?new kf(this.f,this.j+2,this.va):tc};g.S=function(){return this};g.R=function(a,b){return new kf(this.f,this.j,b)};g.T=function(a,b){return O(b,this)};kf.prototype[Oa]=function(){return vc(this)};lf;mf;function nf(a,b,c){this.f=a;this.j=b;this.l=c}
nf.prototype.ra=function(){return this.j<this.l};nf.prototype.next=function(){var a=new T(null,2,5,V,[this.f[this.j],this.f[this.j+1]],null);this.j+=2;return a};function za(a,b,c,d){this.s=a;this.l=b;this.f=c;this.u=d;this.i=16647951;this.B=8196}g=za.prototype;g.toString=function(){return Xb(this)};g.equiv=function(a){return this.v(null,a)};g.keys=function(){return vc(lf.a?lf.a(this):lf.call(null,this))};g.entries=function(){return ef(K(this))};
g.values=function(){return vc(mf.a?mf.a(this):mf.call(null,this))};g.has=function(a){return rd(this,a)};g.get=function(a,b){return this.H(null,a,b)};g.forEach=function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.U(null,e),h=Q(f,0),f=Q(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=K(b))ld(b)?(c=Ob(b),b=Pb(b),h=c,d=P(c),c=h):(c=L(b),h=Q(c,0),f=Q(c,1),a.b?a.b(f,h):a.call(null,f,h),b=M(b),c=null,d=0),e=0;else return null};g.K=function(a,b){return db.c(this,b,null)};
g.H=function(a,b,c){a=hf(this.f,b);return-1===a?c:this.f[a+1]};g.Fa=function(){return new nf(this.f,0,2*this.l)};g.O=function(){return this.s};g.Z=function(){return this.l};g.L=function(){var a=this.u;return null!=a?a:this.u=a=Bc(this)};g.v=function(a,b){if(null!=b&&(b.i&1024||b.ac)){var c=this.f.length;if(this.l===b.Z(null))for(var d=0;;)if(d<c){var e=b.H(null,this.f[d],od);if(e!==od)if(ec.b(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return cf(this,b)};
g.Za=function(){return new jf({},this.f.length,Pa(this.f))};g.V=function(){return rb(ee,this.s)};g.aa=function(a,b){return Uc.b(b,this)};g.ba=function(a,b,c){return Uc.c(b,c,this)};g.Qa=function(a,b,c){a=hf(this.f,b);if(-1===a){if(this.l<of){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new za(this.s,this.l+1,e,null)}return rb(fb(Be(pf,this),b,c),this.s)}if(c===this.f[a+1])return this;b=Pa(this.f);b[a+1]=c;return new za(this.s,this.l,b,null)};
g.Db=function(a,b){return-1!==hf(this.f,b)};g.S=function(){var a=this.f;return 0<=a.length-2?new kf(a,0,null):null};g.R=function(a,b){return new za(b,this.l,this.f,this.u)};g.T=function(a,b){if(id(b))return fb(this,G.b(b,0),G.b(b,1));for(var c=this,d=K(b);;){if(null==d)return c;var e=L(d);if(id(e))c=fb(c,G.b(e,0),G.b(e,1)),d=M(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};var ee=new za(null,0,[],Cc),of=8;za.prototype[Oa]=function(){return vc(this)};
qf;function jf(a,b,c){this.bb=a;this.Wa=b;this.f=c;this.i=258;this.B=56}g=jf.prototype;g.Z=function(){if(w(this.bb))return Cd(this.Wa);throw Error("count after persistent!");};g.K=function(a,b){return db.c(this,b,null)};g.H=function(a,b,c){if(w(this.bb))return a=hf(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
g.Sa=function(a,b){if(w(this.bb)){if(null!=b?b.i&2048||b.bc||(b.i?0:B(hb,b)):B(hb,b))return Jb(this,Id.a?Id.a(b):Id.call(null,b),Jd.a?Jd.a(b):Jd.call(null,b));for(var c=K(b),d=this;;){var e=L(c);if(w(e))c=M(c),d=Jb(d,Id.a?Id.a(e):Id.call(null,e),Jd.a?Jd.a(e):Jd.call(null,e));else return d}}else throw Error("conj! after persistent!");};g.ab=function(){if(w(this.bb))return this.bb=!1,new za(null,Cd(this.Wa),this.f,null);throw Error("persistent! called twice");};
g.pb=function(a,b,c){if(w(this.bb)){a=hf(this.f,b);if(-1===a){if(this.Wa+2<=2*of)return this.Wa+=2,this.f.push(b),this.f.push(c),this;a=qf.b?qf.b(this.Wa,this.f):qf.call(null,this.Wa,this.f);return Jb(a,b,c)}c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};rf;$c;function qf(a,b){for(var c=Fb(pf),d=0;;)if(d<a)c=Jb(c,b[d],b[d+1]),d+=2;else return c}function sf(){this.N=!1}tf;uf;oe;vf;W;N;
function wf(a,b){return a===b?!0:a===b||a instanceof z&&b instanceof z&&a.Ga===b.Ga?!0:ec.b(a,b)}function xf(a,b,c){a=Pa(a);a[b]=c;return a}function yf(a,b,c,d){a=a.Ua(b);a.f[c]=d;return a}zf;function Af(a,b,c,d){this.f=a;this.j=b;this.ub=c;this.Ea=d}Af.prototype.advance=function(){for(var a=this.f.length;;)if(this.j<a){var b=this.f[this.j],c=this.f[this.j+1];null!=b?b=this.ub=new T(null,2,5,V,[b,c],null):null!=c?(b=Vb(c),b=b.ra()?this.Ea=b:!1):b=!1;this.j+=2;if(b)return!0}else return!1};
Af.prototype.ra=function(){var a=null!=this.ub;return a?a:(a=null!=this.Ea)?a:this.advance()};Af.prototype.next=function(){if(null!=this.ub){var a=this.ub;this.ub=null;return a}if(null!=this.Ea)return a=this.Ea.next(),this.Ea.ra()||(this.Ea=null),a;if(this.advance())return this.next();throw Error("No such element");};Af.prototype.remove=function(){return Error("Unsupported operation")};function Bf(a,b,c){this.M=a;this.$=b;this.f=c}g=Bf.prototype;
g.Ua=function(a){if(a===this.M)return this;var b=Dd(this.$),c=Array(0>b?4:2*(b+1));nd(this.f,0,c,0,2*b);return new Bf(a,this.$,c)};g.sb=function(){return tf.a?tf.a(this.f):tf.call(null,this.f)};g.Oa=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.$&e))return d;var f=Dd(this.$&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.Oa(a+5,b,c,d):wf(c,e)?f:d};
g.Da=function(a,b,c,d,e,f){var h=1<<(c>>>b&31),k=Dd(this.$&h-1);if(0===(this.$&h)){var l=Dd(this.$);if(2*l<this.f.length){a=this.Ua(a);b=a.f;f.N=!0;a:for(c=2*(l-k),f=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*k]=d;b[2*k+1]=e;a.$|=h;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=Cf.Da(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.$>>>d&1)&&(k[d]=null!=this.f[e]?Cf.Da(a,b+5,kc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new zf(a,l+1,k)}b=Array(2*(l+4));nd(this.f,0,b,0,2*k);b[2*k]=d;b[2*k+1]=e;nd(this.f,2*k,b,2*(k+1),2*(l-k));f.N=!0;a=this.Ua(a);a.f=b;a.$|=h;return a}l=this.f[2*k];h=this.f[2*k+1];if(null==l)return l=h.Da(a,b+5,c,d,e,f),l===h?this:yf(this,a,2*k+1,l);if(wf(d,l))return e===h?this:yf(this,a,2*k+1,e);f.N=!0;f=b+5;d=vf.X?vf.X(a,f,l,h,c,d,e):vf.call(null,a,f,l,h,c,d,e);e=2*k;
k=2*k+1;a=this.Ua(a);a.f[e]=null;a.f[k]=d;return a};
g.Ca=function(a,b,c,d,e){var f=1<<(b>>>a&31),h=Dd(this.$&f-1);if(0===(this.$&f)){var k=Dd(this.$);if(16<=k){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[b>>>a&31]=Cf.Ca(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.$>>>c&1)&&(h[c]=null!=this.f[d]?Cf.Ca(a+5,kc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new zf(null,k+1,h)}a=Array(2*(k+1));nd(this.f,
0,a,0,2*h);a[2*h]=c;a[2*h+1]=d;nd(this.f,2*h,a,2*(h+1),2*(k-h));e.N=!0;return new Bf(null,this.$|f,a)}var l=this.f[2*h],f=this.f[2*h+1];if(null==l)return k=f.Ca(a+5,b,c,d,e),k===f?this:new Bf(null,this.$,xf(this.f,2*h+1,k));if(wf(c,l))return d===f?this:new Bf(null,this.$,xf(this.f,2*h+1,d));e.N=!0;e=this.$;k=this.f;a+=5;a=vf.W?vf.W(a,l,f,b,c,d):vf.call(null,a,l,f,b,c,d);c=2*h;h=2*h+1;d=Pa(k);d[c]=null;d[h]=a;return new Bf(null,e,d)};g.Fa=function(){return new Af(this.f,0,null,null)};
var Cf=new Bf(null,0,[]);function Df(a,b,c){this.f=a;this.j=b;this.Ea=c}Df.prototype.ra=function(){for(var a=this.f.length;;){if(null!=this.Ea&&this.Ea.ra())return!0;if(this.j<a){var b=this.f[this.j];this.j+=1;null!=b&&(this.Ea=Vb(b))}else return!1}};Df.prototype.next=function(){if(this.ra())return this.Ea.next();throw Error("No such element");};Df.prototype.remove=function(){return Error("Unsupported operation")};function zf(a,b,c){this.M=a;this.l=b;this.f=c}g=zf.prototype;
g.Ua=function(a){return a===this.M?this:new zf(a,this.l,Pa(this.f))};g.sb=function(){return uf.a?uf.a(this.f):uf.call(null,this.f)};g.Oa=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.Oa(a+5,b,c,d):d};g.Da=function(a,b,c,d,e,f){var h=c>>>b&31,k=this.f[h];if(null==k)return a=yf(this,a,h,Cf.Da(a,b+5,c,d,e,f)),a.l+=1,a;b=k.Da(a,b+5,c,d,e,f);return b===k?this:yf(this,a,h,b)};
g.Ca=function(a,b,c,d,e){var f=b>>>a&31,h=this.f[f];if(null==h)return new zf(null,this.l+1,xf(this.f,f,Cf.Ca(a+5,b,c,d,e)));a=h.Ca(a+5,b,c,d,e);return a===h?this:new zf(null,this.l,xf(this.f,f,a))};g.Fa=function(){return new Df(this.f,0,null)};function Ef(a,b,c){b*=2;for(var d=0;;)if(d<b){if(wf(c,a[d]))return d;d+=2}else return-1}function Ff(a,b,c,d){this.M=a;this.Na=b;this.l=c;this.f=d}g=Ff.prototype;
g.Ua=function(a){if(a===this.M)return this;var b=Array(2*(this.l+1));nd(this.f,0,b,0,2*this.l);return new Ff(a,this.Na,this.l,b)};g.sb=function(){return tf.a?tf.a(this.f):tf.call(null,this.f)};g.Oa=function(a,b,c,d){a=Ef(this.f,this.l,c);return 0>a?d:wf(c,this.f[a])?this.f[a+1]:d};
g.Da=function(a,b,c,d,e,f){if(c===this.Na){b=Ef(this.f,this.l,d);if(-1===b){if(this.f.length>2*this.l)return b=2*this.l,c=2*this.l+1,a=this.Ua(a),a.f[b]=d,a.f[c]=e,f.N=!0,a.l+=1,a;c=this.f.length;b=Array(c+2);nd(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.N=!0;d=this.l+1;a===this.M?(this.f=b,this.l=d,a=this):a=new Ff(this.M,this.Na,d,b);return a}return this.f[b+1]===e?this:yf(this,a,b+1,e)}return(new Bf(a,1<<(this.Na>>>b&31),[null,this,null,null])).Da(a,b,c,d,e,f)};
g.Ca=function(a,b,c,d,e){return b===this.Na?(a=Ef(this.f,this.l,c),-1===a?(a=2*this.l,b=Array(a+2),nd(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.N=!0,new Ff(null,this.Na,this.l+1,b)):ec.b(this.f[a],d)?this:new Ff(null,this.Na,this.l,xf(this.f,a+1,d))):(new Bf(null,1<<(this.Na>>>a&31),[null,this])).Ca(a,b,c,d,e)};g.Fa=function(){return new Af(this.f,0,null,null)};
var vf=function vf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return vf.W(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return vf.X(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
vf.W=function(a,b,c,d,e,f){var h=kc(b);if(h===d)return new Ff(null,h,2,[b,c,e,f]);var k=new sf;return Cf.Ca(a,h,b,c,k).Ca(a,d,e,f,k)};vf.X=function(a,b,c,d,e,f,h){var k=kc(c);if(k===e)return new Ff(null,k,2,[c,d,f,h]);var l=new sf;return Cf.Da(a,b,k,c,d,l).Da(a,b,e,f,h,l)};vf.A=7;function Gf(a,b,c,d,e){this.s=a;this.Pa=b;this.j=c;this.C=d;this.u=e;this.i=32374860;this.B=0}g=Gf.prototype;g.toString=function(){return Xb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.s};
g.L=function(){var a=this.u;return null!=a?a:this.u=a=zc(this)};g.v=function(a,b){return Ec(this,b)};g.V=function(){return Fc(tc,this.s)};g.aa=function(a,b){return Uc.b(b,this)};g.ba=function(a,b,c){return Uc.c(b,c,this)};g.Y=function(){return null==this.C?new T(null,2,5,V,[this.Pa[this.j],this.Pa[this.j+1]],null):L(this.C)};
g.qa=function(){if(null==this.C){var a=this.Pa,b=this.j+2;return tf.c?tf.c(a,b,null):tf.call(null,a,b,null)}var a=this.Pa,b=this.j,c=M(this.C);return tf.c?tf.c(a,b,c):tf.call(null,a,b,c)};g.S=function(){return this};g.R=function(a,b){return new Gf(b,this.Pa,this.j,this.C,this.u)};g.T=function(a,b){return O(b,this)};Gf.prototype[Oa]=function(){return vc(this)};
var tf=function tf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return tf.a(arguments[0]);case 3:return tf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};tf.a=function(a){return tf.c(a,0,null)};
tf.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new Gf(null,a,b,null,null);var d=a[b+1];if(w(d)&&(d=d.sb(),w(d)))return new Gf(null,a,b+2,d,null);b+=2}else return null;else return new Gf(null,a,b,c,null)};tf.A=3;function Hf(a,b,c,d,e){this.s=a;this.Pa=b;this.j=c;this.C=d;this.u=e;this.i=32374860;this.B=0}g=Hf.prototype;g.toString=function(){return Xb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.s};
g.L=function(){var a=this.u;return null!=a?a:this.u=a=zc(this)};g.v=function(a,b){return Ec(this,b)};g.V=function(){return Fc(tc,this.s)};g.aa=function(a,b){return Uc.b(b,this)};g.ba=function(a,b,c){return Uc.c(b,c,this)};g.Y=function(){return L(this.C)};g.qa=function(){var a=this.Pa,b=this.j,c=M(this.C);return uf.o?uf.o(null,a,b,c):uf.call(null,null,a,b,c)};g.S=function(){return this};g.R=function(a,b){return new Hf(b,this.Pa,this.j,this.C,this.u)};g.T=function(a,b){return O(b,this)};
Hf.prototype[Oa]=function(){return vc(this)};var uf=function uf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return uf.a(arguments[0]);case 4:return uf.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};uf.a=function(a){return uf.o(null,a,0,null)};
uf.o=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(w(e)&&(e=e.sb(),w(e)))return new Hf(a,b,c+1,e,null);c+=1}else return null;else return new Hf(a,b,c,d,null)};uf.A=4;rf;function If(a,b,c){this.ya=a;this.Vb=b;this.Kb=c}If.prototype.ra=function(){return this.Kb&&this.Vb.ra()};If.prototype.next=function(){if(this.Kb)return this.Vb.next();this.Kb=!0;return this.ya};If.prototype.remove=function(){return Error("Unsupported operation")};
function $c(a,b,c,d,e,f){this.s=a;this.l=b;this.root=c;this.xa=d;this.ya=e;this.u=f;this.i=16123663;this.B=8196}g=$c.prototype;g.toString=function(){return Xb(this)};g.equiv=function(a){return this.v(null,a)};g.keys=function(){return vc(lf.a?lf.a(this):lf.call(null,this))};g.entries=function(){return ef(K(this))};g.values=function(){return vc(mf.a?mf.a(this):mf.call(null,this))};g.has=function(a){return rd(this,a)};g.get=function(a,b){return this.H(null,a,b)};
g.forEach=function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.U(null,e),h=Q(f,0),f=Q(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=K(b))ld(b)?(c=Ob(b),b=Pb(b),h=c,d=P(c),c=h):(c=L(b),h=Q(c,0),f=Q(c,1),a.b?a.b(f,h):a.call(null,f,h),b=M(b),c=null,d=0),e=0;else return null};g.K=function(a,b){return db.c(this,b,null)};g.H=function(a,b,c){return null==b?this.xa?this.ya:c:null==this.root?c:this.root.Oa(0,kc(b),b,c)};
g.Fa=function(){var a=this.root?Vb(this.root):ae;return this.xa?new If(this.ya,a,!1):a};g.O=function(){return this.s};g.Z=function(){return this.l};g.L=function(){var a=this.u;return null!=a?a:this.u=a=Bc(this)};g.v=function(a,b){return cf(this,b)};g.Za=function(){return new rf({},this.root,this.l,this.xa,this.ya)};g.V=function(){return rb(pf,this.s)};
g.Qa=function(a,b,c){if(null==b)return this.xa&&c===this.ya?this:new $c(this.s,this.xa?this.l:this.l+1,this.root,!0,c,null);a=new sf;b=(null==this.root?Cf:this.root).Ca(0,kc(b),b,c,a);return b===this.root?this:new $c(this.s,a.N?this.l+1:this.l,b,this.xa,this.ya,null)};g.Db=function(a,b){return null==b?this.xa:null==this.root?!1:this.root.Oa(0,kc(b),b,od)!==od};g.S=function(){if(0<this.l){var a=null!=this.root?this.root.sb():null;return this.xa?O(new T(null,2,5,V,[null,this.ya],null),a):a}return null};
g.R=function(a,b){return new $c(b,this.l,this.root,this.xa,this.ya,this.u)};g.T=function(a,b){if(id(b))return fb(this,G.b(b,0),G.b(b,1));for(var c=this,d=K(b);;){if(null==d)return c;var e=L(d);if(id(e))c=fb(c,G.b(e,0),G.b(e,1)),d=M(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};var pf=new $c(null,0,null,!1,null,Cc);
function bd(a,b){for(var c=a.length,d=0,e=Fb(pf);;)if(d<c)var f=d+1,e=e.pb(null,a[d],b[d]),d=f;else return Ib(e)}$c.prototype[Oa]=function(){return vc(this)};function rf(a,b,c,d,e){this.M=a;this.root=b;this.count=c;this.xa=d;this.ya=e;this.i=258;this.B=56}function Jf(a,b,c){if(a.M){if(null==b)a.ya!==c&&(a.ya=c),a.xa||(a.count+=1,a.xa=!0);else{var d=new sf;b=(null==a.root?Cf:a.root).Da(a.M,0,kc(b),b,c,d);b!==a.root&&(a.root=b);d.N&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}g=rf.prototype;
g.Z=function(){if(this.M)return this.count;throw Error("count after persistent!");};g.K=function(a,b){return null==b?this.xa?this.ya:null:null==this.root?null:this.root.Oa(0,kc(b),b)};g.H=function(a,b,c){return null==b?this.xa?this.ya:c:null==this.root?c:this.root.Oa(0,kc(b),b,c)};
g.Sa=function(a,b){var c;a:if(this.M)if(null!=b?b.i&2048||b.bc||(b.i?0:B(hb,b)):B(hb,b))c=Jf(this,Id.a?Id.a(b):Id.call(null,b),Jd.a?Jd.a(b):Jd.call(null,b));else{c=K(b);for(var d=this;;){var e=L(c);if(w(e))c=M(c),d=Jf(d,Id.a?Id.a(e):Id.call(null,e),Jd.a?Jd.a(e):Jd.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};g.ab=function(){var a;if(this.M)this.M=null,a=new $c(null,this.count,this.root,this.xa,this.ya,null);else throw Error("persistent! called twice");return a};
g.pb=function(a,b,c){return Jf(this,b,c)};Kf;Lf;function Lf(a,b,c,d,e){this.key=a;this.N=b;this.left=c;this.right=d;this.u=e;this.i=32402207;this.B=0}g=Lf.prototype;g.replace=function(a,b,c,d){return new Lf(a,b,c,d,null)};g.K=function(a,b){return G.c(this,b,null)};g.H=function(a,b,c){return G.c(this,b,c)};g.U=function(a,b){return 0===b?this.key:1===b?this.N:null};g.wa=function(a,b,c){return 0===b?this.key:1===b?this.N:c};
g.Ta=function(a,b,c){return(new T(null,2,5,V,[this.key,this.N],null)).Ta(null,b,c)};g.O=function(){return null};g.Z=function(){return 2};g.lb=function(){return this.key};g.mb=function(){return this.N};g.L=function(){var a=this.u;return null!=a?a:this.u=a=zc(this)};g.v=function(a,b){return Ec(this,b)};g.V=function(){return Xc};g.aa=function(a,b){return Ic(this,b)};g.ba=function(a,b,c){return Kc(this,b,c)};g.Qa=function(a,b,c){return ad.c(new T(null,2,5,V,[this.key,this.N],null),b,c)};
g.S=function(){return Wa(Wa(tc,this.N),this.key)};g.R=function(a,b){return Fc(new T(null,2,5,V,[this.key,this.N],null),b)};g.T=function(a,b){return new T(null,3,5,V,[this.key,this.N,b],null)};g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();
g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};Lf.prototype[Oa]=function(){return vc(this)};function Kf(a,b,c,d,e){this.key=a;this.N=b;this.left=c;this.right=d;this.u=e;this.i=32402207;this.B=0}g=Kf.prototype;g.replace=function(a,b,c,d){return new Kf(a,b,c,d,null)};g.K=function(a,b){return G.c(this,b,null)};g.H=function(a,b,c){return G.c(this,b,c)};
g.U=function(a,b){return 0===b?this.key:1===b?this.N:null};g.wa=function(a,b,c){return 0===b?this.key:1===b?this.N:c};g.Ta=function(a,b,c){return(new T(null,2,5,V,[this.key,this.N],null)).Ta(null,b,c)};g.O=function(){return null};g.Z=function(){return 2};g.lb=function(){return this.key};g.mb=function(){return this.N};g.L=function(){var a=this.u;return null!=a?a:this.u=a=zc(this)};g.v=function(a,b){return Ec(this,b)};g.V=function(){return Xc};g.aa=function(a,b){return Ic(this,b)};
g.ba=function(a,b,c){return Kc(this,b,c)};g.Qa=function(a,b,c){return ad.c(new T(null,2,5,V,[this.key,this.N],null),b,c)};g.S=function(){return Wa(Wa(tc,this.N),this.key)};g.R=function(a,b){return Fc(new T(null,2,5,V,[this.key,this.N],null),b)};g.T=function(a,b){return new T(null,3,5,V,[this.key,this.N,b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};Kf.prototype[Oa]=function(){return vc(this)};Id;
var Dc=function Dc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Dc.m(0<c.length?new rc(c.slice(0),0):null)};Dc.m=function(a){for(var b=K(a),c=Fb(pf);;)if(b){a=M(M(b));var d=L(b),b=L(M(b)),c=Jb(c,d,b),b=a}else return Ib(c)};Dc.A=0;Dc.F=function(a){return Dc.m(K(a))};function Mf(a,b){this.G=a;this.va=b;this.i=32374988;this.B=0}g=Mf.prototype;g.toString=function(){return Xb(this)};g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.va};
g.ta=function(){var a=(null!=this.G?this.G.i&128||this.G.yb||(this.G.i?0:B(bb,this.G)):B(bb,this.G))?this.G.ta(null):M(this.G);return null==a?null:new Mf(a,this.va)};g.L=function(){return zc(this)};g.v=function(a,b){return Ec(this,b)};g.V=function(){return Fc(tc,this.va)};g.aa=function(a,b){return Uc.b(b,this)};g.ba=function(a,b,c){return Uc.c(b,c,this)};g.Y=function(){return this.G.Y(null).lb(null)};
g.qa=function(){var a=(null!=this.G?this.G.i&128||this.G.yb||(this.G.i?0:B(bb,this.G)):B(bb,this.G))?this.G.ta(null):M(this.G);return null!=a?new Mf(a,this.va):tc};g.S=function(){return this};g.R=function(a,b){return new Mf(this.G,b)};g.T=function(a,b){return O(b,this)};Mf.prototype[Oa]=function(){return vc(this)};function lf(a){return(a=K(a))?new Mf(a,null):null}function Id(a){return ib(a)}function Nf(a,b){this.G=a;this.va=b;this.i=32374988;this.B=0}g=Nf.prototype;g.toString=function(){return Xb(this)};
g.equiv=function(a){return this.v(null,a)};g.O=function(){return this.va};g.ta=function(){var a=(null!=this.G?this.G.i&128||this.G.yb||(this.G.i?0:B(bb,this.G)):B(bb,this.G))?this.G.ta(null):M(this.G);return null==a?null:new Nf(a,this.va)};g.L=function(){return zc(this)};g.v=function(a,b){return Ec(this,b)};g.V=function(){return Fc(tc,this.va)};g.aa=function(a,b){return Uc.b(b,this)};g.ba=function(a,b,c){return Uc.c(b,c,this)};g.Y=function(){return this.G.Y(null).mb(null)};
g.qa=function(){var a=(null!=this.G?this.G.i&128||this.G.yb||(this.G.i?0:B(bb,this.G)):B(bb,this.G))?this.G.ta(null):M(this.G);return null!=a?new Nf(a,this.va):tc};g.S=function(){return this};g.R=function(a,b){return new Nf(this.G,b)};g.T=function(a,b){return O(b,this)};Nf.prototype[Oa]=function(){return vc(this)};function mf(a){return(a=K(a))?new Nf(a,null):null}function Jd(a){return jb(a)}
var Of=function Of(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Of.m(0<c.length?new rc(c.slice(0),0):null)};Of.m=function(a){return w(he(a))?Qa.b(function(a,c){return Wc.b(w(a)?a:ee,c)},a):null};Of.A=0;Of.F=function(a){return Of.m(K(a))};Pf;function Qf(a){this.fb=a}Qf.prototype.ra=function(){return this.fb.ra()};Qf.prototype.next=function(){if(this.fb.ra())return this.fb.next().I[0];throw Error("No such element");};Qf.prototype.remove=function(){return Error("Unsupported operation")};
function Rf(a,b,c){this.s=a;this.Va=b;this.u=c;this.i=15077647;this.B=8196}g=Rf.prototype;g.toString=function(){return Xb(this)};g.equiv=function(a){return this.v(null,a)};g.keys=function(){return vc(K(this))};g.entries=function(){var a=K(this);return new ff(K(a))};g.values=function(){return vc(K(this))};g.has=function(a){return rd(this,a)};
g.forEach=function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.U(null,e),h=Q(f,0),f=Q(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=K(b))ld(b)?(c=Ob(b),b=Pb(b),h=c,d=P(c),c=h):(c=L(b),h=Q(c,0),f=Q(c,1),a.b?a.b(f,h):a.call(null,f,h),b=M(b),c=null,d=0),e=0;else return null};g.K=function(a,b){return db.c(this,b,null)};g.H=function(a,b,c){return eb(this.Va,b)?b:c};g.Fa=function(){return new Qf(Vb(this.Va))};g.O=function(){return this.s};g.Z=function(){return Ta(this.Va)};
g.L=function(){var a=this.u;return null!=a?a:this.u=a=Bc(this)};g.v=function(a,b){return fd(b)&&P(this)===P(b)&&ge(function(a){return function(b){return rd(a,b)}}(this),b)};g.Za=function(){return new Pf(Fb(this.Va))};g.V=function(){return Fc(Sf,this.s)};g.S=function(){return lf(this.Va)};g.R=function(a,b){return new Rf(b,this.Va,this.u)};g.T=function(a,b){return new Rf(this.s,ad.c(this.Va,b,null),null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};var Sf=new Rf(null,ee,Cc);Rf.prototype[Oa]=function(){return vc(this)};
function Pf(a){this.La=a;this.B=136;this.i=259}g=Pf.prototype;g.Sa=function(a,b){this.La=Jb(this.La,b,null);return this};g.ab=function(){return new Rf(null,Ib(this.La),null)};g.Z=function(){return P(this.La)};g.K=function(a,b){return db.c(this,b,null)};g.H=function(a,b,c){return db.c(this.La,b,od)===od?c:b};
g.call=function(){function a(a,b,c){return db.c(this.La,b,od)===od?c:b}function b(a,b){return db.c(this.La,b,od)===od?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.a=function(a){return db.c(this.La,a,od)===od?null:a};g.b=function(a,b){return db.c(this.La,a,od)===od?b:a};
function Hd(a){if(null!=a&&(a.B&4096||a.dc))return a.nb(null);if("string"===typeof a)return a;throw Error([E("Doesn't support name: "),E(a)].join(""));}function Tf(a,b){if("string"===typeof b){var c=a.exec(b);return ec.b(L(c),b)?1===P(c)?L(c):ud(c):null}throw new TypeError("re-matches must match against a string.");}function Uf(a,b){if("string"===typeof b){var c=a.exec(b);return null==c?null:1===P(c)?L(c):ud(c)}throw new TypeError("re-find must match against a string.");}
var Vf=function Vf(b,c){var d=Uf(b,c),e=c.search(b),f=ed(d)?L(d):d,h=Fd(c,e+P(f));return w(d)?new Qd(null,function(c,d,e,f){return function(){return O(c,K(f)?Vf(b,f):null)}}(d,e,f,h),null,null):null};function Wf(a){if(a instanceof RegExp)return a;var b=Uf(/^\(\?([idmsux]*)\)/,a),c=Q(b,0),b=Q(b,1);a=Fd(a,P(c));return new RegExp(a,w(b)?b:"")}
function Pe(a,b,c,d,e,f,h){var k=va;va=null==va?null:va-1;try{if(null!=va&&0>va)return Bb(a,"#");Bb(a,c);if(0===Ea.a(f))K(h)&&Bb(a,function(){var a=Xf.a(f);return w(a)?a:"..."}());else{if(K(h)){var l=L(h);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var m=M(h),n=Ea.a(f)-1;;)if(!m||null!=n&&0===n){K(m)&&0===n&&(Bb(a,d),Bb(a,function(){var a=Xf.a(f);return w(a)?a:"..."}()));break}else{Bb(a,d);var p=L(m);c=a;h=f;b.c?b.c(p,c,h):b.call(null,p,c,h);var q=M(m);c=n-1;m=q;n=c}}return Bb(a,e)}finally{va=k}}
function Yf(a,b){for(var c=K(b),d=null,e=0,f=0;;)if(f<e){var h=d.U(null,f);Bb(a,h);f+=1}else if(c=K(c))d=c,ld(d)?(c=Ob(d),e=Pb(d),d=c,h=P(c),c=e,e=h):(h=L(d),Bb(a,h),c=M(d),d=null,e=0),f=0;else return null}var Zf={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function $f(a){return[E('"'),E(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Zf[a]})),E('"')].join("")}ag;
function bg(a,b){var c=qd(nc.b(a,Ca));return c?(c=null!=b?b.i&131072||b.cc?!0:!1:!1)?null!=dd(b):c:c}
function cg(a,b,c){if(null==a)return Bb(b,"nil");if(bg(c,a)){Bb(b,"^");var d=dd(a);Qe.c?Qe.c(d,b,c):Qe.call(null,d,b,c);Bb(b," ")}if(a.Ib)return a.Sb(a,b,c);if(null!=a&&(a.i&2147483648||a.P))return a.J(null,b,c);if(!0===a||!1===a||"number"===typeof a)return Bb(b,""+E(a));if(null!=a&&a.constructor===Object)return Bb(b,"#js "),d=Gd.b(function(b){return new T(null,2,5,V,[Pd.a(b),a[b]],null)},md(a)),ag.o?ag.o(d,Qe,b,c):ag.call(null,d,Qe,b,c);if(La(a))return Pe(b,Qe,"#js ["," ","]",c,a);if("string"==typeof a)return w(Ba.a(c))?
Bb(b,$f(a)):Bb(b,a);if(ba(a)){var e=a.name;c=w(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Yf(b,I(["#object[",c,' "',""+E(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+E(a);;)if(P(c)<b)c=[E("0"),E(c)].join("");else return c},Yf(b,I(['#inst "',""+E(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),3),"-",'00:00"'],
0));if(a instanceof RegExp)return Yf(b,I(['#"',a.source,'"'],0));if(null!=a&&(a.i&2147483648||a.P))return Cb(a,b,c);if(w(a.constructor.qb))return Yf(b,I(["#object[",a.constructor.qb.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=w(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Yf(b,I(["#object[",c," ",""+E(a),"]"],0))}function Qe(a,b,c){var d=dg.a(c);return w(d)?(c=ad.c(c,eg,cg),d.c?d.c(a,b,c):d.call(null,a,b,c)):cg(a,b,c)}
var ne=function ne(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return ne.m(0<c.length?new rc(c.slice(0),0):null)};ne.m=function(a){var b=ya();if(null==a||Ma(K(a)))b="";else{var c=E,d=new la;a:{var e=new Wb(d);Qe(L(a),e,b);a=K(M(a));for(var f=null,h=0,k=0;;)if(k<h){var l=f.U(null,k);Bb(e," ");Qe(l,e,b);k+=1}else if(a=K(a))f=a,ld(f)?(a=Ob(f),h=Pb(f),f=a,l=P(a),a=h,h=l):(l=L(f),Bb(e," "),Qe(l,e,b),a=M(f),f=null,h=0),k=0;else break a}b=""+c(d)}return b};ne.A=0;
ne.F=function(a){return ne.m(K(a))};function ag(a,b,c,d){return Pe(c,function(a,c,d){var k=ib(a);b.c?b.c(k,c,d):b.call(null,k,c,d);Bb(c," ");a=jb(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,K(a))}se.prototype.P=!0;se.prototype.J=function(a,b,c){Bb(b,"#object [cljs.core.Volatile ");Qe(new za(null,1,[fg,this.state],null),b,c);return Bb(b,"]")};rc.prototype.P=!0;rc.prototype.J=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};Qd.prototype.P=!0;
Qd.prototype.J=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};Gf.prototype.P=!0;Gf.prototype.J=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};Lf.prototype.P=!0;Lf.prototype.J=function(a,b,c){return Pe(b,Qe,"["," ","]",c,this)};kf.prototype.P=!0;kf.prototype.J=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};xc.prototype.P=!0;xc.prototype.J=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};kd.prototype.P=!0;kd.prototype.J=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};
Nd.prototype.P=!0;Nd.prototype.J=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};Pc.prototype.P=!0;Pc.prototype.J=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};$c.prototype.P=!0;$c.prototype.J=function(a,b,c){return ag(this,Qe,b,c)};Hf.prototype.P=!0;Hf.prototype.J=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};Ue.prototype.P=!0;Ue.prototype.J=function(a,b,c){return Pe(b,Qe,"["," ","]",c,this)};Rf.prototype.P=!0;Rf.prototype.J=function(a,b,c){return Pe(b,Qe,"#{"," ","}",c,this)};
jd.prototype.P=!0;jd.prototype.J=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};le.prototype.P=!0;le.prototype.J=function(a,b,c){Bb(b,"#object [cljs.core.Atom ");Qe(new za(null,1,[fg,this.state],null),b,c);return Bb(b,"]")};Nf.prototype.P=!0;Nf.prototype.J=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};Kf.prototype.P=!0;Kf.prototype.J=function(a,b,c){return Pe(b,Qe,"["," ","]",c,this)};T.prototype.P=!0;T.prototype.J=function(a,b,c){return Pe(b,Qe,"["," ","]",c,this)};Ye.prototype.P=!0;
Ye.prototype.J=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};Md.prototype.P=!0;Md.prototype.J=function(a,b){return Bb(b,"()")};fe.prototype.P=!0;fe.prototype.J=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};Ze.prototype.P=!0;Ze.prototype.J=function(a,b,c){return Pe(b,Qe,"#queue ["," ","]",c,K(this))};za.prototype.P=!0;za.prototype.J=function(a,b,c){return ag(this,Qe,b,c)};Mf.prototype.P=!0;Mf.prototype.J=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};Qc.prototype.P=!0;
Qc.prototype.J=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};H.prototype.jb=!0;H.prototype.Ra=function(a,b){if(b instanceof H)return mc(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};z.prototype.jb=!0;z.prototype.Ra=function(a,b){if(b instanceof z)return Od(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};Ue.prototype.jb=!0;
Ue.prototype.Ra=function(a,b){if(id(b))return sd(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};T.prototype.jb=!0;T.prototype.Ra=function(a,b){if(id(b))return sd(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};function gg(a){return function(b,c){var d=a.b?a.b(b,c):a.call(null,b,c);return Hc(d)?new Gc(d):d}}
function ye(a){return function(b){return function(){function c(a,c){return Qa.c(b,a,c)}function d(b){return a.a?a.a(b):a.call(null,b)}function e(){return a.w?a.w():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.w=e;f.a=d;f.b=c;return f}()}(gg(a))}hg;function ig(){}
var jg=function jg(b){if(null!=b&&null!=b.Zb)return b.Zb(b);var c=jg[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=jg._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IEncodeJS.-clj-\x3ejs",b);};kg;function lg(a){return(null!=a?a.Yb||(a.lc?0:B(ig,a)):B(ig,a))?jg(a):"string"===typeof a||"number"===typeof a||a instanceof z||a instanceof H?kg.a?kg.a(a):kg.call(null,a):ne.m(I([a],0))}
var kg=function kg(b){if(null==b)return null;if(null!=b?b.Yb||(b.lc?0:B(ig,b)):B(ig,b))return jg(b);if(b instanceof z)return Hd(b);if(b instanceof H)return""+E(b);if(hd(b)){var c={};b=K(b);for(var d=null,e=0,f=0;;)if(f<e){var h=d.U(null,f),k=Q(h,0),h=Q(h,1);c[lg(k)]=kg(h);f+=1}else if(b=K(b))ld(b)?(e=Ob(b),b=Pb(b),d=e,e=P(e)):(e=L(b),d=Q(e,0),e=Q(e,1),c[lg(d)]=kg(e),b=M(b),d=null,e=0),f=0;else break;return c}if(ed(b)){c=[];b=K(Gd.b(kg,b));d=null;for(f=e=0;;)if(f<e)k=d.U(null,f),c.push(k),f+=1;else if(b=
K(b))d=b,ld(d)?(b=Ob(d),f=Pb(d),d=b,e=P(b),b=f):(b=L(d),c.push(b),b=M(d),d=null,e=0),f=0;else break;return c}return b},hg=function hg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return hg.w();case 1:return hg.a(arguments[0]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};hg.w=function(){return hg.a(1)};hg.a=function(a){return Math.random()*a};hg.A=1;var mg=null;
function ng(){if(null==mg){var a=new za(null,3,[og,ee,pg,ee,qg,ee],null);mg=W.a?W.a(a):W.call(null,a)}return mg}function rg(a,b,c){var d=ec.b(b,c);if(!d&&!(d=rd(qg.a(a).call(null,b),c))&&(d=id(c))&&(d=id(b)))if(d=P(c)===P(b))for(var d=!0,e=0;;)if(d&&e!==P(c))d=rg(a,b.a?b.a(e):b.call(null,e),c.a?c.a(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function sg(a){var b;b=ng();b=N.a?N.a(b):N.call(null,b);a=nc.b(og.a(b),a);return K(a)?a:null}
function tg(a,b,c,d){re.b(a,function(){return N.a?N.a(b):N.call(null,b)});re.b(c,function(){return N.a?N.a(d):N.call(null,d)})}var ug=function ug(b,c,d){var e=(N.a?N.a(d):N.call(null,d)).call(null,b),e=w(w(e)?e.a?e.a(c):e.call(null,c):e)?!0:null;if(w(e))return e;e=function(){for(var e=sg(c);;)if(0<P(e))ug(b,L(e),d),e=sc(e);else return null}();if(w(e))return e;e=function(){for(var e=sg(b);;)if(0<P(e))ug(L(e),c,d),e=sc(e);else return null}();return w(e)?e:!1};
function vg(a,b,c){c=ug(a,b,c);if(w(c))a=c;else{c=rg;var d;d=ng();d=N.a?N.a(d):N.call(null,d);a=c(d,a,b)}return a}
var wg=function wg(b,c,d,e,f,h,k){var l=Qa.c(function(e,h){var k=Q(h,0);Q(h,1);if(rg(N.a?N.a(d):N.call(null,d),c,k)){var l;l=(l=null==e)?l:vg(k,L(e),f);l=w(l)?h:e;if(!w(vg(L(l),k,f)))throw Error([E("Multiple methods in multimethod '"),E(b),E("' match dispatch value: "),E(c),E(" -\x3e "),E(k),E(" and "),E(L(l)),E(", and neither is preferred")].join(""));return l}return e},null,N.a?N.a(e):N.call(null,e));if(w(l)){if(ec.b(N.a?N.a(k):N.call(null,k),N.a?N.a(d):N.call(null,d)))return re.o(h,ad,c,L(M(l))),
L(M(l));tg(h,e,k,d);return wg(b,c,d,e,f,h,k)}return null};function X(a,b){throw Error([E("No method in multimethod '"),E(a),E("' for dispatch value: "),E(b)].join(""));}function xg(a,b,c,d,e,f,h,k){this.name=a;this.h=b;this.mc=c;this.rb=d;this.gb=e;this.sc=f;this.tb=h;this.ib=k;this.i=4194305;this.B=4352}g=xg.prototype;
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y,D,J,S){a=this;var ra=F.m(a.h,b,c,d,e,I([f,h,k,l,m,n,p,q,v,r,u,x,A,y,D,J,S],0)),mh=Z(this,ra);w(mh)||X(a.name,ra);return F.m(mh,b,c,d,e,I([f,h,k,l,m,n,p,q,v,r,u,x,A,y,D,J,S],0))}function b(a,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y,D,J){a=this;var S=a.h.na?a.h.na(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y,D,J):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y,D,J),ra=Z(this,S);w(ra)||X(a.name,S);return ra.na?ra.na(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,
x,A,y,D,J):ra.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y,D,J)}function c(a,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y,D){a=this;var J=a.h.ma?a.h.ma(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y,D):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y,D),S=Z(this,J);w(S)||X(a.name,J);return S.ma?S.ma(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y,D):S.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y,D)}function d(a,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y){a=this;var D=a.h.la?a.h.la(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y):a.h.call(null,
b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y),J=Z(this,D);w(J)||X(a.name,D);return J.la?J.la(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y):J.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A,y)}function e(a,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A){a=this;var y=a.h.ka?a.h.ka(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A),D=Z(this,y);w(D)||X(a.name,y);return D.ka?D.ka(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A):D.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x,A)}function f(a,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,
x){a=this;var A=a.h.ja?a.h.ja(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x),y=Z(this,A);w(y)||X(a.name,A);return y.ja?y.ja(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x):y.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u,x)}function h(a,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u){a=this;var x=a.h.ia?a.h.ia(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u),A=Z(this,x);w(A)||X(a.name,x);return A.ia?A.ia(b,c,d,e,f,h,k,l,m,n,p,q,v,r,u):A.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r,u)}
function k(a,b,c,d,e,f,h,k,l,m,n,p,q,v,r){a=this;var u=a.h.ha?a.h.ha(b,c,d,e,f,h,k,l,m,n,p,q,v,r):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r),x=Z(this,u);w(x)||X(a.name,u);return x.ha?x.ha(b,c,d,e,f,h,k,l,m,n,p,q,v,r):x.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v,r)}function l(a,b,c,d,e,f,h,k,l,m,n,p,q,v){a=this;var r=a.h.ga?a.h.ga(b,c,d,e,f,h,k,l,m,n,p,q,v):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,v),u=Z(this,r);w(u)||X(a.name,r);return u.ga?u.ga(b,c,d,e,f,h,k,l,m,n,p,q,v):u.call(null,b,c,d,e,f,h,k,l,m,n,p,
q,v)}function m(a,b,c,d,e,f,h,k,l,m,n,p,q){a=this;var v=a.h.fa?a.h.fa(b,c,d,e,f,h,k,l,m,n,p,q):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q),r=Z(this,v);w(r)||X(a.name,v);return r.fa?r.fa(b,c,d,e,f,h,k,l,m,n,p,q):r.call(null,b,c,d,e,f,h,k,l,m,n,p,q)}function n(a,b,c,d,e,f,h,k,l,m,n,p){a=this;var q=a.h.ea?a.h.ea(b,c,d,e,f,h,k,l,m,n,p):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p),v=Z(this,q);w(v)||X(a.name,q);return v.ea?v.ea(b,c,d,e,f,h,k,l,m,n,p):v.call(null,b,c,d,e,f,h,k,l,m,n,p)}function p(a,b,c,d,e,f,h,k,l,m,
n){a=this;var p=a.h.da?a.h.da(b,c,d,e,f,h,k,l,m,n):a.h.call(null,b,c,d,e,f,h,k,l,m,n),q=Z(this,p);w(q)||X(a.name,p);return q.da?q.da(b,c,d,e,f,h,k,l,m,n):q.call(null,b,c,d,e,f,h,k,l,m,n)}function q(a,b,c,d,e,f,h,k,l,m){a=this;var n=a.h.pa?a.h.pa(b,c,d,e,f,h,k,l,m):a.h.call(null,b,c,d,e,f,h,k,l,m),p=Z(this,n);w(p)||X(a.name,n);return p.pa?p.pa(b,c,d,e,f,h,k,l,m):p.call(null,b,c,d,e,f,h,k,l,m)}function r(a,b,c,d,e,f,h,k,l){a=this;var m=a.h.oa?a.h.oa(b,c,d,e,f,h,k,l):a.h.call(null,b,c,d,e,f,h,k,l),n=
Z(this,m);w(n)||X(a.name,m);return n.oa?n.oa(b,c,d,e,f,h,k,l):n.call(null,b,c,d,e,f,h,k,l)}function u(a,b,c,d,e,f,h,k){a=this;var l=a.h.X?a.h.X(b,c,d,e,f,h,k):a.h.call(null,b,c,d,e,f,h,k),m=Z(this,l);w(m)||X(a.name,l);return m.X?m.X(b,c,d,e,f,h,k):m.call(null,b,c,d,e,f,h,k)}function x(a,b,c,d,e,f,h){a=this;var k=a.h.W?a.h.W(b,c,d,e,f,h):a.h.call(null,b,c,d,e,f,h),l=Z(this,k);w(l)||X(a.name,k);return l.W?l.W(b,c,d,e,f,h):l.call(null,b,c,d,e,f,h)}function v(a,b,c,d,e,f){a=this;var h=a.h.D?a.h.D(b,c,
d,e,f):a.h.call(null,b,c,d,e,f),k=Z(this,h);w(k)||X(a.name,h);return k.D?k.D(b,c,d,e,f):k.call(null,b,c,d,e,f)}function A(a,b,c,d,e){a=this;var f=a.h.o?a.h.o(b,c,d,e):a.h.call(null,b,c,d,e),h=Z(this,f);w(h)||X(a.name,f);return h.o?h.o(b,c,d,e):h.call(null,b,c,d,e)}function D(a,b,c,d){a=this;var e=a.h.c?a.h.c(b,c,d):a.h.call(null,b,c,d),f=Z(this,e);w(f)||X(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function J(a,b,c){a=this;var d=a.h.b?a.h.b(b,c):a.h.call(null,b,c),e=Z(this,d);w(e)||X(a.name,
d);return e.b?e.b(b,c):e.call(null,b,c)}function S(a,b){a=this;var c=a.h.a?a.h.a(b):a.h.call(null,b),d=Z(this,c);w(d)||X(a.name,c);return d.a?d.a(b):d.call(null,b)}function ra(a){a=this;var b=a.h.w?a.h.w():a.h.call(null),c=Z(this,b);w(c)||X(a.name,b);return c.w?c.w():c.call(null)}var y=null,y=function(y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,pc,$a,tb,Hb,ac,Jc,vd,gf){switch(arguments.length){case 1:return ra.call(this,y);case 2:return S.call(this,y,R);case 3:return J.call(this,y,R,U);case 4:return D.call(this,
y,R,U,Y);case 5:return A.call(this,y,R,U,Y,da);case 6:return v.call(this,y,R,U,Y,da,ga);case 7:return x.call(this,y,R,U,Y,da,ga,ka);case 8:return u.call(this,y,R,U,Y,da,ga,ka,na);case 9:return r.call(this,y,R,U,Y,da,ga,ka,na,pa);case 10:return q.call(this,y,R,U,Y,da,ga,ka,na,pa,qa);case 11:return p.call(this,y,R,U,Y,da,ga,ka,na,pa,qa,xa);case 12:return n.call(this,y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga);case 13:return m.call(this,y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja);case 14:return l.call(this,y,R,U,Y,da,
ga,ka,na,pa,qa,xa,Ga,Ja,Ra);case 15:return k.call(this,y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,pc);case 16:return h.call(this,y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,pc,$a);case 17:return f.call(this,y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,pc,$a,tb);case 18:return e.call(this,y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,pc,$a,tb,Hb);case 19:return d.call(this,y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,pc,$a,tb,Hb,ac);case 20:return c.call(this,y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,pc,$a,tb,Hb,ac,Jc);case 21:return b.call(this,
y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,pc,$a,tb,Hb,ac,Jc,vd);case 22:return a.call(this,y,R,U,Y,da,ga,ka,na,pa,qa,xa,Ga,Ja,Ra,pc,$a,tb,Hb,ac,Jc,vd,gf)}throw Error("Invalid arity: "+arguments.length);};y.a=ra;y.b=S;y.c=J;y.o=D;y.D=A;y.W=v;y.X=x;y.oa=u;y.pa=r;y.da=q;y.ea=p;y.fa=n;y.ga=m;y.ha=l;y.ia=k;y.ja=h;y.ka=f;y.la=e;y.ma=d;y.na=c;y.Hb=b;y.kb=a;return y}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};
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
function Z(a,b){ec.b(N.a?N.a(a.ib):N.call(null,a.ib),N.a?N.a(a.rb):N.call(null,a.rb))||tg(a.tb,a.gb,a.ib,a.rb);var c=(N.a?N.a(a.tb):N.call(null,a.tb)).call(null,b);if(w(c))return c;c=wg(a.name,b,a.rb,a.gb,a.sc,a.tb,a.ib);return w(c)?c:(N.a?N.a(a.gb):N.call(null,a.gb)).call(null,a.mc)}g.nb=function(){return Rb(this.name)};g.ob=function(){return Sb(this.name)};g.L=function(){return this[ca]||(this[ca]=++ea)};function yg(a,b){this.Xa=a;this.u=b;this.i=2153775104;this.B=2048}g=yg.prototype;
g.toString=function(){return this.Xa};g.equiv=function(a){return this.v(null,a)};g.v=function(a,b){return b instanceof yg&&this.Xa===b.Xa};g.J=function(a,b){return Bb(b,[E('#uuid "'),E(this.Xa),E('"')].join(""))};g.L=function(){null==this.u&&(this.u=ic(this.Xa));return this.u};g.Ra=function(a,b){return ma(this.Xa,b.Xa)};var zg=new z(null,"javascript","javascript",-45283711),Ag=new H(null,"floor","floor",-772394748,null),Bg=new z(null,"algorithm","algorithm",739262820),Ca=new z(null,"meta","meta",1499536964),Cg=new z(null,"table","table",-564943036),Dg=new H(null,"blockable","blockable",-28395259,null),Da=new z(null,"dup","dup",556298533),Eg=new H(null,"divmod","divmod",811386629,null),Fg=new z(null,"number","number",1570378438),Gg=new z(null,"button","button",1456579943),qe=new H(null,"new-value","new-value",-1567397401,
null),Hg=new H(null,"century-and-year","century-and-year",-681394297,null),me=new z(null,"validator","validator",-1966190681),Ig=new z(null,"default","default",-1987822328),Jg=new H(null,"closest-perfect-cube","closest-perfect-cube",1220545609,null),Kg=new z(null,"td","td",1479933353),Lg=new H(null,"*","*",345799209,null),Mg=new z(null,"value","value",305978217),Ng=new z(null,"tr","tr",-1424774646),Og=new z(null,"onclick","onclick",1297553739),fg=new z(null,"val","val",128701612),Pg=new z(null,"persist",
"persist",815289548),Qg=new z(null,"type","type",1174270348),Rg=new z(null,"classname","classname",777390796),pe=new H(null,"validate","validate",1439230700,null),Sg=new H(null,"dup","dup",-2098137236,null),eg=new z(null,"fallback-impl","fallback-impl",-1501286995),Tg=new H(null,"century-anchor","century-anchor",1137235565,null),Aa=new z(null,"flush-on-newline","flush-on-newline",-151457939),Ug=new H(null,"sqrt","sqrt",370479598,null),Vg=new H(null,"dip","dip",-323933490,null),Wg=new H(null,"%","%",
-950237169,null),Xg=new z(null,"className","className",-1983287057),pg=new z(null,"descendants","descendants",1824886031),qg=new z(null,"ancestors","ancestors",-776045424),Yg=new H(null,"-","-",-471816912,null),Zg=new z(null,"textarea","textarea",-650375824),ve=new H(null,"n","n",-2092305744,null),$g=new z(null,"div","div",1057191632),Ba=new z(null,"readably","readably",1129599760),Xf=new z(null,"more-marker","more-marker",-14717935),ah=new H("eval","all","eval/all",-1769564175,null),bh=new z(null,
"lacket","lacket",-808519309),ch=new z(null,"word","word",-420123725),Ea=new z(null,"print-length","print-length",1931866356),dh=new z(null,"id","id",-1388402092),og=new z(null,"parents","parents",-2027538891),eh=new H(null,"/","/",-1371932971,null),fh=new z(null,"svg","svg",856789142),gh=new z(null,"code","code",1586293142),hh=new z(null,"initial","initial",1854648214),ih=new z(null,"tag","tag",-1290361223),jh=new z(null,"rerender","rerender",-1601192263),kh=new z(null,"input","input",556931961),
lh=new H(null,"+","+",-740910886,null),de=new H(null,"quote","quote",1377916282,null),ce=new z(null,"arglists","arglists",1661989754),be=new H(null,"nil-iter","nil-iter",1101030523,null),nh=new z(null,"main","main",-2117802661),oh=new z(null,"hierarchy","hierarchy",-1053470341),dg=new z(null,"alt-impl","alt-impl",670969595),ph=new z(null,"racket","racket",781983516),qh=new H(null,"deref","deref",1494944732,null),rh=new H(null,"closest-perfect-square","closest-perfect-square",1449996605,null),ue=new H(null,
"number?","number?",-1747282210,null),sh=new z(null,"foreignObject","foreignObject",25502111),th=new z(null,"text","text",-1790561697),uh=new z(null,"span","span",1394872991),vh=new H(null,"f","f",43394975,null);var wh;function xh(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function yh(a,b,c,d){this.head=a;this.I=b;this.length=c;this.f=d}yh.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.I];this.f[this.I]=null;this.I=(this.I+1)%this.f.length;--this.length;return a};yh.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};
yh.prototype.resize=function(){var a=Array(2*this.f.length);return this.I<this.head?(xh(this.f,this.I,a,0,this.length),this.I=0,this.head=this.length,this.f=a):this.I>this.head?(xh(this.f,this.I,a,0,this.f.length-this.I),xh(this.f,0,a,this.f.length-this.I,this.head),this.I=0,this.head=this.length,this.f=a):this.I===this.head?(this.head=this.I=0,this.f=a):null};if("undefined"===typeof zh)var zh={};var Ah;a:{var Bh=aa.navigator;if(Bh){var Ch=Bh.userAgent;if(Ch){Ah=Ch;break a}}Ah=""}function Dh(a){return-1!=Ah.indexOf(a)};var Eh;
function Fh(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&!Dh("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ia(function(a){if(("*"==d||a.origin==d)&&a.data==
c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&!Dh("Trident")&&!Dh("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.Lb;c.Lb=null;a()}};return function(a){d.next={Lb:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=document.createElement("SCRIPT");
b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var Gh;Gh=new yh(0,0,0,Array(32));var Hh=!1,Ih=!1;Jh;function Kh(){Hh=!0;Ih=!1;for(var a=0;;){var b=Gh.pop();if(null!=b&&(b.w?b.w():b.call(null),1024>a)){a+=1;continue}break}Hh=!1;return 0<Gh.length?Jh.w?Jh.w():Jh.call(null):null}function Jh(){var a=Ih;if(w(w(a)?Hh:a))return null;Ih=!0;!ba(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(Eh||(Eh=Fh()),Eh(Kh)):aa.setImmediate(Kh)};for(var Lh=Array(1),Mh=0;;)if(Mh<Lh.length)Lh[Mh]=null,Mh+=1;else break;(function(a){"undefined"===typeof wh&&(wh=function(a,c,d){this.nc=a;this.Wb=c;this.pc=d;this.i=393216;this.B=0},wh.prototype.R=function(a,c){return new wh(this.nc,this.Wb,c)},wh.prototype.O=function(){return this.pc},wh.oc=function(){return new T(null,3,5,V,[vh,Dg,oa.Ec],null)},wh.Ib=!0,wh.qb="cljs.core.async/t_cljs$core$async10693",wh.Sb=function(a,c){return Bb(c,"cljs.core.async/t_cljs$core$async10693")});return new wh(a,!0,ee)})(function(){return null});var Nh=VDOM.diff,Oh=VDOM.patch,Ph=VDOM.create;function Qh(a){return ze(ie(Ka),ze(ie(pd),Ae(a)))}function Rh(a,b,c){return new VDOM.VHtml(Hd(a),kg(b),kg(c))}function Sh(a,b,c){return new VDOM.VSvg(Hd(a),kg(b),kg(c))}Th;
var Uh=function Uh(b){if(null==b)return new VDOM.VText("");if(pd(b))return Rh($g,ee,Gd.b(Uh,Qh(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(ec.b(fh,L(b)))return Th.a?Th.a(b):Th.call(null,b);var c=Q(b,0),d=Q(b,1);b=Ed(b,2);return Rh(c,d,Gd.b(Uh,Qh(b)))},Th=function Th(b){if(null==b)return new VDOM.VText("");if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(ec.b(sh,L(b))){var c=Q(b,0),d=Q(b,1);b=Ed(b,2);return Sh(c,d,Gd.b(Uh,Qh(b)))}c=Q(b,0);d=Q(b,
1);b=Ed(b,2);return Sh(c,d,Gd.b(Th,Qh(b)))};
function Vh(){var a=document.getElementById("app"),b=function(){var a=new VDOM.VText("");return W.a?W.a(a):W.call(null,a)}(),c=function(){var a;a=N.a?N.a(b):N.call(null,b);a=Ph.a?Ph.a(a):Ph.call(null,a);return W.a?W.a(a):W.call(null,a)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.w?a.w():a.call(null)}}(b,c):function(){return function(a){return window.requestAnimationFrame(a)}}(b,c);a.appendChild(N.a?N.a(c):N.call(null,c));return function(a,b,c){return function(d){var l=
Uh(d);d=function(){var b=N.a?N.a(a):N.call(null,a);return Nh.b?Nh.b(b,l):Nh.call(null,b,l)}();oe.b?oe.b(a,l):oe.call(null,a,l);d=function(a,b,c,d){return function(){return re.c(d,Oh,b)}}(l,d,a,b,c);return c.a?c.a(d):c.call(null,d)}}(b,c,d)};function Wh(a,b){return ec.b(a,b)?0:Math.abs((a-b)/a)};function Xh(a){return Gd.b(function(a){return new za(null,2,[Mg,a,Qg,w(Tf.b?Tf.b(/\[/,a):Tf.call(null,/\[/,a))?bh:w(Tf.b?Tf.b(/\]/,a):Tf.call(null,/\]/,a))?ph:w(Tf.b?Tf.b(/-?[0-9]+\.[0-9]+/,a):Tf.call(null,/-?[0-9]+\.[0-9]+/,a))?Fg:w(Tf.b?Tf.b(/-?[0-9]+/,a):Tf.call(null,/-?[0-9]+/,a))?Fg:ch],null)},Vf(/\[|\]|-?[0-9]+\.[0-9]+|[0-9]+|[^ \[\]]+/,a))}
function Yh(a){return ec.b(Fg,a.a?a.a(Qg):a.call(null,Qg))?(a=a.a?a.a(Mg):a.call(null,Mg),parseFloat(a)):ec.b(ch,a.a?a.a(Qg):a.call(null,Qg))?oc.a(a.a?a.a(Mg):a.call(null,Mg)):null}
function Zh(a){var b=a;for(a=Xc;;)if(K(b)){var c=b,b=Q(c,0),c=Ed(c,1),d=ec,e=b.a?b.a(Qg):b.call(null,Qg);if(w(d.b?d.b(bh,e):d.call(null,bh,e))){a:for(b=ph,d=c,c=Xc;;)if(K(d)){e=d;d=Q(e,0);e=Ed(e,1);if(ec.b(b,d.a?d.a(Qg):d.call(null,Qg))){c=new T(null,2,5,V,[e,c],null);break a}c=Wc.b(c,Yh(d));d=e}else throw Error("Unexpected end of input, expected ",b);b=Q(c,0);c=Q(c,1);a=Wc.b(a,c)}else a=Wc.b(a,Yh(b)),b=c}else return a};function $h(a){var b=new la;for(a=K(a);;)if(null!=a)b.append(""+E(L(a))),a=M(a),null!=a&&b.append(" ");else return b.toString()};function ai(a,b){return function(c){return new T(null,1,5,V,[Wc.b(ud(we(a,c)),F.b(b,xe(a,c)))],null)}}function bi(a){return function(b){return new T(null,1,5,V,[ud(Yd.b(we(2,b),F.b(a,xe(2,b))))],null)}}
var ci=bd([Tg,rh,Vg,Eg,oc.a("\u221a3"),oc.a("\u221a"),Sg,lh,Lg,oc.a("/"),Ag,Yg,Jg,Ug,Hg,Wg],[ai(1,function(a){return Bd(5*Bd(a,4)+2,7)}),ai(1,function(a){return Math.pow(Math.round(Math.sqrt(a)),2)}),function(a){var b=xe(2,a),c=Q(b,0),b=Q(b,1);return new T(null,2,5,V,[ud(we(2,a)),ud(Yd.b(b,new T(null,1,5,V,[c],null)))],null)},bi(function(a,b){return new T(null,2,5,V,[Math.floor(a/b),Bd(a,b)],null)}),ai(1,function(a){return Math.pow(a,1/3)}),ai(1,function(a){return Math.sqrt(a)}),function(a){return new T(null,
1,5,V,[Wc.b(a,Vc(a))],null)},ai(2,xd),ai(2,zd),ai(2,Ad),ai(1,Math.floor),ai(2,yd),ai(1,function(a){return Math.pow(Math.round(Math.pow(a,1/3)),3)}),ai(1,function(a){return Math.sqrt(a)}),bi(function(a){var b=Math.floor(a/100);return new T(null,2,5,V,[b,a-100*b],null)}),ai(2,Bd)]);
function di(a,b){if(id(b)||"number"===typeof b)return new T(null,1,5,V,[Wc.b(a,b)],null);if(b instanceof H){var c=ci.a?ci.a(b):ci.call(null,b);if(w(c))return c.a?c.a(a):c.call(null,a);throw Error([E("Unknown word `"),E(b),E("`")].join(""));}throw Error([E("Unknown value `"),E(b),E("`")].join(""));}
function ei(a,b){for(var c=a,d=b,e=new T(null,1,5,V,[new T(null,2,5,V,[c,d],null)],null);;)if(K(d))var f=Q(d,0),d=Ed(d,1),f=di(c,f),c=Q(f,0),f=Q(f,1),h=ud(Yd.b(f,d)),f=c,d=h,e=Wc.b(e,new T(null,2,5,V,[c,h],null)),c=f;else return e}function fi(a){a=[E("(function(x){return "),E(a),E(";})")].join("");return eval(a)}
function gi(a){return function(){function b(a){var b=null;if(0<arguments.length){for(var b=0,f=Array(arguments.length-0);b<f.length;)f[b]=arguments[b+0],++b;b=new rc(f,0)}return c.call(this,b)}function c(b){return Vc(L(Vc(ei(ud(b),a))))}b.A=0;b.F=function(a){a=K(a);return c(a)};b.m=c;return b}()};function hi(a,b){return b*Math.round(a/b)}
function ii(a){return new T(null,3,5,V,[Cg,ee,function(){return function c(a){return new Qd(null,function(){for(;;){var e=K(a);if(e){if(ld(e)){var f=Ob(e),h=P(f),k=new Td(Array(h),0);a:for(var l=0;;)if(l<h){var m=G.b(f,l),n=Q(m,0),m=Q(m,1),n=new T(null,5,5,V,[Ng,ee,new T(null,3,5,V,[Kg,new za(null,1,[Xg,"t-right"],null),$h(n)],null),new T(null,3,5,V,[Kg,new za(null,1,[Xg,"t-muted"],null)," \u25c6 "],null),new T(null,3,5,V,[Kg,ee,$h(m)],null)],null);k.add(n);l+=1}else{f=!0;break a}return f?Ud(k.Aa(),
c(Pb(e))):Ud(k.Aa(),null)}f=L(e);k=Q(f,0);f=Q(f,1);return O(new T(null,5,5,V,[Ng,ee,new T(null,3,5,V,[Kg,new za(null,1,[Xg,"t-right"],null),$h(k)],null),new T(null,3,5,V,[Kg,new za(null,1,[Xg,"t-muted"],null)," \u25c6 "],null),new T(null,3,5,V,[Kg,ee,$h(f)],null)],null),c(sc(e)))}return null}},null,null)}(a)}()],null)}
function ji(){var a=ki,b=N.a?N.a(li):N.call(null,li),c=L(Qa.c(di,Xc,Zh(Xh(hh.a(b))))),d;try{d=ei(c,Zh(Xh(Bg.a(b))))}catch(e){if(e instanceof Error)d=e.message;else throw e;}var f=K(b.a?b.a(zg):b.call(null,zg))?fi(b.a?b.a(zg):b.call(null,zg)):je(),h=F.b(f,c),k=K(b.a?b.a(Bg):b.call(null,Bg))?gi(Zh(Xh(Bg.a(b)))):je(),l=F.b(k,c);return new T(null,3,5,V,[nh,ee,new T(null,4,5,V,[$g,new za(null,1,[Xg,"l-diptych"],null),new T(null,6,5,V,[$g,new za(null,1,[Xg,"l-vspaced"],null),new T(null,5,5,V,[$g,new za(null,
1,[Rg,"l-width-full"],null),"JavaScript expression of ",new T(null,3,5,V,[gh,ee,"x"],null),new T(null,3,5,V,[$g,ee,new T(null,2,5,V,[Zg,new za(null,3,[dh,"input-js",Xg,"l-width-full",Mg,b.a?b.a(zg):b.call(null,zg)],null)],null)],null)],null),new T(null,4,5,V,[$g,ee,"Stack algorithm",new T(null,3,5,V,[$g,ee,new T(null,2,5,V,[Zg,new za(null,3,[dh,"input-algorithm",Xg,"l-width-full",Mg,b.a?b.a(Bg):b.call(null,Bg)],null)],null)],null)],null),new T(null,4,5,V,[$g,ee,"Initial stack",new T(null,3,5,V,[$g,
ee,new T(null,2,5,V,[kh,new za(null,3,[dh,"input-init",Xg,"l-width-full",Mg,b.a?b.a(hh):b.call(null,hh)],null)],null)],null)],null),new T(null,3,5,V,[$g,ee,new T(null,3,5,V,[Gg,new za(null,1,[Og,function(){return function(){var b=document.getElementById("input-js").value,c=document.getElementById("input-algorithm").value,d=document.getElementById("input-init").value;return a.o?a.o(ah,b,c,d):a.call(null,ah,b,c,d)}}(c,d,f,h,k,l)],null),"Evaluate"],null)],null)],null),new T(null,5,5,V,[$g,new za(null,
1,[Xg,"l-vspaced"],null),w(h)?new T(null,4,5,V,[$g,ee,new T(null,3,5,V,[uh,new za(null,1,[Xg,"t-muted"],null),"JavaScript result "],null),hi(h,1E-4)],null):null,null!=L(L(d))?new T(null,4,5,V,[$g,ee,new T(null,3,5,V,[uh,new za(null,1,[Xg,"t-muted"],null),"Stack evaluation "],null),"string"===typeof d?new T(null,3,5,V,[th,new za(null,1,[Xg,"t-error"],null),d],null):ii(d)],null):null,K(b.a?b.a(zg):b.call(null,zg))&&"string"!==typeof d?Wa(tc,new T(null,5,5,V,[$g,ee,new T(null,3,5,V,[uh,new za(null,1,
[Xg,"t-muted"],null),"Error "],null),hi(100*Wh(h,l),.1),"%"],null)):null],null)],null)],null)};var mi=Dh("Opera")||Dh("OPR"),ni=Dh("Trident")||Dh("MSIE"),oi=Dh("Edge"),pi=Dh("Gecko")&&!(-1!=Ah.toLowerCase().indexOf("webkit")&&!Dh("Edge"))&&!(Dh("Trident")||Dh("MSIE"))&&!Dh("Edge"),qi=-1!=Ah.toLowerCase().indexOf("webkit")&&!Dh("Edge");function ri(){var a=Ah;if(pi)return/rv\:([^\);]+)(\)|;)/.exec(a);if(oi)return/Edge\/([\d\.]+)/.exec(a);if(ni)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(qi)return/WebKit\/(\S+)/.exec(a)}
(function(){if(mi&&aa.opera){var a=aa.opera.version;return ba(a)?a():a}var a="",b=ri();b&&(a=b?b[1]:"");return ni&&(b=(b=aa.document)?b.documentMode:void 0,b>parseFloat(a))?String(b):a})();var si=null,ti=null,ui=null;function vi(){if(!si){si={};ti={};ui={};for(var a=0;65>a;a++)si[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(a),ti[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(a),ui[ti[a]]=a,62<=a&&(ui["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(a)]=a)}};var wi=function wi(b){if(null!=b&&null!=b.Tb)return b.Tb();var c=wi[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=wi._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("PushbackReader.read-char",b);},xi=function xi(b,c){if(null!=b&&null!=b.Ub)return b.Ub(0,c);var d=xi[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=xi._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("PushbackReader.unread",b);};
function yi(a,b,c){this.C=a;this.buffer=b;this.Jb=c}yi.prototype.Tb=function(){return 0===this.buffer.length?(this.Jb+=1,this.C[this.Jb]):this.buffer.pop()};yi.prototype.Ub=function(a,b){return this.buffer.push(b)};function zi(a){var b=!/[^\t\n\r ]/.test(a);return w(b)?b:","===a}Ai;Bi;Ci;function Di(a){throw Error(F.b(E,a));}
function Ei(a,b){for(var c=new la(b),d=wi(a);;){var e;if(!(e=null==d||zi(d))){e=d;var f="#"!==e;e=f?(f="'"!==e)?(f=":"!==e)?Bi.a?Bi.a(e):Bi.call(null,e):f:f:f}if(e)return xi(a,d),c.toString();c.append(d);d=wi(a)}}function Fi(a){for(;;){var b=wi(a);if("\n"===b||"\r"===b||null==b)return a}}var Gi=Wf("^([-+]?)(?:(0)|([1-9][0-9]*)|0[xX]([0-9A-Fa-f]+)|0([0-7]+)|([1-9][0-9]?)[rR]([0-9A-Za-z]+))(N)?$"),Hi=Wf("^([-+]?[0-9]+)/([0-9]+)$"),Ii=Wf("^([-+]?[0-9]+(\\.[0-9]*)?([eE][-+]?[0-9]+)?)(M)?$"),Ji=Wf("^[:]?([^0-9/].*/)?([^0-9/][^/]*)$");
function Ki(a,b){var c=a.exec(b);return null!=c&&c[0]===b?1===c.length?c[0]:c:null}var Li=Wf("^[0-9A-Fa-f]{2}$"),Mi=Wf("^[0-9A-Fa-f]{4}$");function Ni(a,b,c){return w(Tf(a,c))?c:Di(I(["Unexpected unicode escape \\",b,c],0))}function Oi(a){return String.fromCharCode(parseInt(a,16))}
function Pi(a){var b=wi(a),c="t"===b?"\t":"r"===b?"\r":"n"===b?"\n":"\\"===b?"\\":'"'===b?'"':"b"===b?"\b":"f"===b?"\f":null;w(c)?b=c:"x"===b?(a=(new la(wi(a),wi(a))).toString(),b=Oi(Ni(Li,b,a))):"u"===b?(a=(new la(wi(a),wi(a),wi(a),wi(a))).toString(),b=Oi(Ni(Mi,b,a))):b=/[^0-9]/.test(b)?Di(I(["Unexpected unicode escape \\",b],0)):String.fromCharCode(b);return b}
function Qi(a,b){for(var c=Fb(Xc);;){var d;a:{d=zi;for(var e=b,f=wi(e);;)if(w(d.a?d.a(f):d.call(null,f)))f=wi(e);else{d=f;break a}}w(d)||Di(I(["EOF while reading"],0));if(a===d)return Ib(c);e=Bi.a?Bi.a(d):Bi.call(null,d);w(e)?d=e.b?e.b(b,d):e.call(null,b,d):(xi(b,d),d=Ai.o?Ai.o(b,!0,null,!0):Ai.call(null,b,!0,null));c=d===b?c:Zd.b(c,d)}}function Ri(a,b){return Di(I(["Reader for ",b," not implemented yet"],0))}Si;
function Ti(a,b){var c=wi(a),d=Ci.a?Ci.a(c):Ci.call(null,c);if(w(d))return d.b?d.b(a,b):d.call(null,a,b);d=Si.b?Si.b(a,c):Si.call(null,a,c);return w(d)?d:Di(I(["No dispatch macro for ",c],0))}function Ui(a,b){return Di(I(["Unmatched delimiter ",b],0))}function Vi(a){return F.b(dc,Qi(")",a))}function Wi(a){return Qi("]",a)}
function Xi(a){a=Qi("}",a);var b=P(a);if("number"!==typeof b||isNaN(b)||Infinity===b||parseFloat(b)!==parseInt(b,10))throw Error([E("Argument must be an integer: "),E(b)].join(""));0!==(b&1)&&Di(I(["Map literal must contain an even number of forms"],0));return F.b(Dc,a)}function Yi(a){for(var b=new la,c=wi(a);;){if(null==c)return Di(I(["EOF while reading"],0));if("\\"===c)b.append(Pi(a));else{if('"'===c)return b.toString();b.append(c)}c=wi(a)}}
function Zi(a){for(var b=new la,c=wi(a);;){if(null==c)return Di(I(["EOF while reading"],0));if("\\"===c){b.append(c);var d=wi(a);if(null==d)return Di(I(["EOF while reading"],0));var e=function(){var a=b;a.append(d);return a}(),f=wi(a)}else{if('"'===c)return b.toString();e=function(){var a=b;a.append(c);return a}();f=wi(a)}b=e;c=f}}
function $i(a,b){var c=Ei(a,b),d=-1!=c.indexOf("/");w(w(d)?1!==c.length:d)?c=oc.b(c.substring(0,c.indexOf("/")),c.substring(c.indexOf("/")+1,c.length)):(d=oc.a(c),c="nil"===c?null:"true"===c?!0:"false"===c?!1:"/"===c?eh:d);return c}
function aj(a,b){var c=Ei(a,b),d=c.substring(1);return 1===d.length?d:"tab"===d?"\t":"return"===d?"\r":"newline"===d?"\n":"space"===d?" ":"backspace"===d?"\b":"formfeed"===d?"\f":"u"===d.charAt(0)?Oi(d.substring(1)):"o"===d.charAt(0)?Ri(0,c):Di(I(["Unknown character literal: ",c],0))}
function bj(a){a=Ei(a,wi(a));var b=Ki(Ji,a);a=b[0];var c=b[1],b=b[2];return void 0!==c&&":/"===c.substring(c.length-2,c.length)||":"===b[b.length-1]||-1!==a.indexOf("::",1)?Di(I(["Invalid token: ",a],0)):null!=c&&0<c.length?Pd.b(c.substring(0,c.indexOf("/")),b):Pd.a(a)}function cj(a){return function(b){return Wa(Wa(tc,Ai.o?Ai.o(b,!0,null,!0):Ai.call(null,b,!0,null)),a)}}function dj(){return function(){return Di(I(["Unreadable form"],0))}}
function ej(a){var b;b=Ai.o?Ai.o(a,!0,null,!0):Ai.call(null,a,!0,null);if(b instanceof H)b=new za(null,1,[ih,b],null);else if("string"===typeof b)b=new za(null,1,[ih,b],null);else if(b instanceof z){b=[b,!0];for(var c=[],d=0;;)if(d<b.length){var e=b[d],f=b[d+1];-1===hf(c,e)&&(c.push(e),c.push(f));d+=2}else break;b=new za(null,c.length/2,c,null)}hd(b)||Di(I(["Metadata must be Symbol,Keyword,String or Map"],0));a=Ai.o?Ai.o(a,!0,null,!0):Ai.call(null,a,!0,null);return(null!=a?a.i&262144||a.Dc||(a.i?
0:B(qb,a)):B(qb,a))?Fc(a,Of.m(I([dd(a),b],0))):Di(I(["Metadata can only be applied to IWithMetas"],0))}function fj(a){a:if(a=Qi("}",a),a=K(a),null==a)a=Sf;else if(a instanceof rc&&0===a.j){a=a.f;b:for(var b=0,c=Fb(Sf);;)if(b<a.length)var d=b+1,c=c.Sa(null,a[b]),b=d;else break b;a=c.ab(null)}else for(d=Fb(Sf);;)if(null!=a)b=M(a),d=d.Sa(null,a.Y(null)),a=b;else{a=Ib(d);break a}return a}function gj(a){return Wf(Zi(a))}function hj(a){Ai.o?Ai.o(a,!0,null,!0):Ai.call(null,a,!0,null);return a}
function Bi(a){return'"'===a?Yi:":"===a?bj:";"===a?Fi:"'"===a?cj(de):"@"===a?cj(qh):"^"===a?ej:"`"===a?Ri:"~"===a?Ri:"("===a?Vi:")"===a?Ui:"["===a?Wi:"]"===a?Ui:"{"===a?Xi:"}"===a?Ui:"\\"===a?aj:"#"===a?Ti:null}function Ci(a){return"{"===a?fj:"\x3c"===a?dj():'"'===a?gj:"!"===a?Fi:"_"===a?hj:null}
function Ai(a,b,c){for(;;){var d=wi(a);if(null==d)return w(b)?Di(I(["EOF while reading"],0)):c;if(!zi(d))if(";"===d)a=Fi.b?Fi.b(a,d):Fi.call(null,a);else{var e=Bi(d);if(w(e))e=e.b?e.b(a,d):e.call(null,a,d);else{var e=a,f=void 0;!(f=!/[^0-9]/.test(d))&&(f=void 0,f="+"===d||"-"===d)&&(f=wi(e),xi(e,f),f=!/[^0-9]/.test(f));if(f)a:for(e=a,d=new la(d),f=wi(e);;){var h;h=null==f;h||(h=(h=zi(f))?h:Bi.a?Bi.a(f):Bi.call(null,f));if(w(h)){xi(e,f);d=e=d.toString();f=void 0;w(Ki(Gi,d))?(d=Ki(Gi,d),f=d[2],null!=
(ec.b(f,"")?null:f)?f=0:(f=w(d[3])?[d[3],10]:w(d[4])?[d[4],16]:w(d[5])?[d[5],8]:w(d[6])?[d[7],parseInt(d[6],10)]:[null,null],h=f[0],null==h?f=null:(f=parseInt(h,f[1]),f="-"===d[1]?-f:f))):(f=void 0,w(Ki(Hi,d))?(d=Ki(Hi,d),f=parseInt(d[1],10)/parseInt(d[2],10)):f=w(Ki(Ii,d))?parseFloat(d):null);d=f;e=w(d)?d:Di(I(["Invalid number format [",e,"]"],0));break a}d.append(f);f=wi(e)}else e=$i(a,d)}if(e!==a)return e}}}
var ij=function(a,b){return function(c,d){return nc.b(w(d)?b:a,c)}}(new T(null,13,5,V,[null,31,28,31,30,31,30,31,31,30,31,30,31],null),new T(null,13,5,V,[null,31,29,31,30,31,30,31,31,30,31,30,31],null)),jj=/(\d\d\d\d)(?:-(\d\d)(?:-(\d\d)(?:[T](\d\d)(?::(\d\d)(?::(\d\d)(?:[.](\d+))?)?)?)?)?)?(?:[Z]|([-+])(\d\d):(\d\d))?/;function kj(a){a=parseInt(a,10);return Ma(isNaN(a))?a:null}
function lj(a,b,c,d){a<=b&&b<=c||Di(I([[E(d),E(" Failed:  "),E(a),E("\x3c\x3d"),E(b),E("\x3c\x3d"),E(c)].join("")],0));return b}
function mj(a){var b=Tf(jj,a);Q(b,0);var c=Q(b,1),d=Q(b,2),e=Q(b,3),f=Q(b,4),h=Q(b,5),k=Q(b,6),l=Q(b,7),m=Q(b,8),n=Q(b,9),p=Q(b,10);if(Ma(b))return Di(I([[E("Unrecognized date/time syntax: "),E(a)].join("")],0));var q=kj(c),r=function(){var a=kj(d);return w(a)?a:1}();a=function(){var a=kj(e);return w(a)?a:1}();var b=function(){var a=kj(f);return w(a)?a:0}(),c=function(){var a=kj(h);return w(a)?a:0}(),u=function(){var a=kj(k);return w(a)?a:0}(),x=function(){var a;a:if(ec.b(3,P(l)))a=l;else if(3<P(l))a=
l.substring(0,3);else for(a=new la(l);;)if(3>a.Ma.length)a=a.append("0");else{a=a.toString();break a}a=kj(a);return w(a)?a:0}(),m=(ec.b(m,"-")?-1:1)*(60*function(){var a=kj(n);return w(a)?a:0}()+function(){var a=kj(p);return w(a)?a:0}());return new T(null,8,5,V,[q,lj(1,r,12,"timestamp month field must be in range 1..12"),lj(1,a,function(){var a;a=0===Bd(q,4);w(a)&&(a=Ma(0===Bd(q,100)),a=w(a)?a:0===Bd(q,400));return ij.b?ij.b(r,a):ij.call(null,r,a)}(),"timestamp day field must be in range 1..last day in month"),
lj(0,b,23,"timestamp hour field must be in range 0..23"),lj(0,c,59,"timestamp minute field must be in range 0..59"),lj(0,u,ec.b(c,59)?60:59,"timestamp second field must be in range 0..60"),lj(0,x,999,"timestamp millisecond field must be in range 0..999"),m],null)}
var nj,oj=new za(null,4,["inst",function(a){var b;if("string"===typeof a)if(b=mj(a),w(b)){a=Q(b,0);var c=Q(b,1),d=Q(b,2),e=Q(b,3),f=Q(b,4),h=Q(b,5),k=Q(b,6);b=Q(b,7);b=new Date(Date.UTC(a,c-1,d,e,f,h,k)-6E4*b)}else b=Di(I([[E("Unrecognized date/time syntax: "),E(a)].join("")],0));else b=Di(I(["Instance literal expects a string for its timestamp."],0));return b},"uuid",function(a){return"string"===typeof a?new yg(a,null):Di(I(["UUID literal expects a string as its representation."],0))},"queue",function(a){return id(a)?
Be($e,a):Di(I(["Queue literal expects a vector for its elements."],0))},"js",function(a){if(id(a)){var b=[];a=K(a);for(var c=null,d=0,e=0;;)if(e<d){var f=c.U(null,e);b.push(f);e+=1}else if(a=K(a))c=a,ld(c)?(a=Ob(c),e=Pb(c),c=a,d=P(a),a=e):(a=L(c),b.push(a),a=M(c),c=null,d=0),e=0;else break;return b}if(hd(a)){b={};a=K(a);c=null;for(e=d=0;;)if(e<d){var h=c.U(null,e),f=Q(h,0),h=Q(h,1);b[Hd(f)]=h;e+=1}else if(a=K(a))ld(a)?(d=Ob(a),a=Pb(a),c=d,d=P(d)):(d=L(a),c=Q(d,0),d=Q(d,1),b[Hd(c)]=d,a=M(a),c=null,
d=0),e=0;else break;return b}return Di(I([[E("JS literal expects a vector or map containing "),E("only string or unqualified keyword keys")].join("")],0))}],null);nj=W.a?W.a(oj):W.call(null,oj);var pj=W.a?W.a(null):W.call(null,null);
function Si(a,b){var c=$i(a,b),d=nc.b(N.a?N.a(nj):N.call(null,nj),""+E(c)),e=N.a?N.a(pj):N.call(null,pj);return w(d)?(c=Ai(a,!0,null),d.a?d.a(c):d.call(null,c)):w(e)?(d=Ai(a,!0,null),e.b?e.b(c,d):e.call(null,c,d)):Di(I(["Could not find tag parser for ",""+E(c)," in ",ne.m(I([lf(N.a?N.a(nj):N.call(null,nj))],0))],0))};var ta=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new rc(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Fa.a?Fa.a(a):Fa.call(null,a))}a.A=0;a.F=function(a){a=K(a);return b(a)};a.m=b;return a}(),ua=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new rc(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,
Fa.a?Fa.a(a):Fa.call(null,a))}a.A=0;a.F=function(a){a=K(a);return b(a)};a.m=b;return a}(),qj;
try{var rj;var sj=window.location.hash,tj=/^#\//;if("string"===typeof tj)rj=sj.replace(new RegExp(String(tj).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08"),"g"),"");else if(tj instanceof RegExp)rj=sj.replace(new RegExp(tj.source,"g"),"");else throw[E("Invalid match arg: "),E(tj)].join("");var uj=rj;vi();for(var vj=ui,wj=[],xj=0;xj<uj.length;){var yj=vj[uj.charAt(xj++)],zj=xj<uj.length?vj[uj.charAt(xj)]:0;++xj;var Aj=xj<uj.length?vj[uj.charAt(xj)]:64;++xj;var Bj=xj<uj.length?
vj[uj.charAt(xj)]:64;++xj;if(null==yj||null==zj||null==Aj||null==Bj)throw Error();wj.push(yj<<2|zj>>4);64!=Aj&&(wj.push(zj<<4&240|Aj>>2),64!=Bj&&wj.push(Aj<<6&192|Bj))}for(var Cj,Dj=[],Ej=0,Fj=0;Ej<wj.length;){var Gj=wj[Ej++];if(128>Gj)Dj[Fj++]=String.fromCharCode(Gj);else if(191<Gj&&224>Gj){var Hj=wj[Ej++];Dj[Fj++]=String.fromCharCode((Gj&31)<<6|Hj&63)}else{var Hj=wj[Ej++],Ij=wj[Ej++];Dj[Fj++]=String.fromCharCode((Gj&15)<<12|(Hj&63)<<6|Ij&63)}}Cj=Dj.join("");if("string"!==typeof Cj)throw Error("Cannot read from non-string object.");
qj=Ai(new yi(Cj,[],-1),!1,null)}catch(Jj){if(Jj instanceof Error)qj=null;else throw Jj;}if("undefined"===typeof li){var li,Kj=w(qj)?qj:new za(null,3,[zg,"",Bg,"",hh,""],null);li=W.a?W.a(Kj):W.call(null,Kj)}
if("undefined"===typeof ki)var ki=function(){var a=W.a?W.a(ee):W.call(null,ee),b=W.a?W.a(ee):W.call(null,ee),c=W.a?W.a(ee):W.call(null,ee),d=W.a?W.a(ee):W.call(null,ee),e=nc.c(ee,oh,ng());return new xg(oc.b("mmh.core","emit"),function(){return function(){function a(b,c){if(1<arguments.length)for(var d=0,e=Array(arguments.length-1);d<e.length;)e[d]=arguments[d+1],++d;return b}a.A=1;a.F=function(a){var b=L(a);sc(a);return b};a.m=function(a){return a};return a}()}(a,b,c,d,e),Ig,e,a,b,c,d)}();
var Lj=ki;re.o(Lj.gb,ad,ah,function(a,b,c,d){return re.c(li,Of,new za(null,3,[zg,b,Bg,c,hh,d],null))});tg(Lj.tb,Lj.gb,Lj.ib,Lj.rb);if("undefined"===typeof Mj)var Mj=function(a){return function(){var b=ji();return a.a?a.a(b):a.call(null,b)}}(Vh());if("undefined"===typeof Nj){var Nj,Oj=li;Eb(Oj,jh,function(a,b,c,d){return Mj.a?Mj.a(d):Mj.call(null,d)});Nj=Oj}
if("undefined"===typeof Pj){var Pj,Qj=li;Eb(Qj,Pg,function(a,b,c,d){a=window.location;b=ne.m(I([d],0));d=[];for(var e=c=0;e<b.length;e++){var f=b.charCodeAt(e);128>f?d[c++]=f:(2048>f?d[c++]=f>>6|192:(d[c++]=f>>12|224,d[c++]=f>>6&63|128),d[c++]=f&63|128)}b=t(d);if("array"!=b&&("object"!=b||"number"!=typeof d.length))throw Error("encodeByteArray takes an array as a parameter");vi();b=ti;c=[];for(e=0;e<d.length;e+=3){var h=d[e],k=(f=e+1<d.length)?d[e+1]:0,l=e+2<d.length,m=l?d[e+2]:0,n=h>>2,h=(h&3)<<
4|k>>4,k=(k&15)<<2|m>>6,m=m&63;l||(m=64,f||(k=64));c.push(b[n],b[h],b[k],b[m])}d=c.join("");d=[E("/"),E(d)].join("");return a.hash=d});Pj=Qj}var Rj=N.a?N.a(li):N.call(null,li);Mj.a?Mj.a(Rj):Mj.call(null,Rj);