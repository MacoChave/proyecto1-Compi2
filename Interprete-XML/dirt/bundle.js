(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.load = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error = void 0;
class Error {
    constructor(descripcion) {
        this.descripcion = descripcion;
    }
}
exports.Error = Error;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Atributo = exports.Comilla = void 0;
var Comilla;
(function (Comilla) {
    Comilla[Comilla["SIMPLE"] = 0] = "SIMPLE";
    Comilla[Comilla["DOBLE"] = 1] = "DOBLE";
})(Comilla = exports.Comilla || (exports.Comilla = {}));
class Atributo {
    constructor(id, valor, linea, columna, comilla) {
        this.identificador = id;
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
        this.comilla = comilla;
        this.textWithoutSpecial = this.setCaracteresEspeciales(valor);
    }
    setCaracteresEspeciales(valor) {
        let value = valor.split("&lt;").join("<");
        value = value.split("&gt;").join(">");
        value = value.split("&amp;").join("&");
        value = value.split("&apos;").join("'");
        value = value.split("&quot;").join('"');
        return value;
    }
}
exports.Atributo = Atributo;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Objeto = exports.Etiqueta = void 0;
var Etiqueta;
(function (Etiqueta) {
    Etiqueta[Etiqueta["UNICA"] = 0] = "UNICA";
    Etiqueta[Etiqueta["DOBLE"] = 1] = "DOBLE";
    Etiqueta[Etiqueta["HEADER"] = 2] = "HEADER";
})(Etiqueta = exports.Etiqueta || (exports.Etiqueta = {}));
class Objeto {
    constructor(id, texto, linea, columna, listaAtributos, listaO, etiqueta) {
        this.identificador = id;
        this.texto = texto;
        this.linea = linea;
        this.columna = columna;
        this.listaAtributos = listaAtributos;
        this.listaObjetos = listaO;
        this.etiqueta = etiqueta;
        this.textWithoutSpecial = this.setCaracteresEspeciales(texto);
    }
    setCaracteresEspeciales(valor) {
        let value = valor.split("&lt;").join("<");
        value = value.split("&gt;").join(">");
        value = value.split("&amp;").join("&");
        value = value.split("&apos;").join("'");
        value = value.split("&quot;").join('"');
        return value;
    }
}
exports.Objeto = Objeto;

},{}],7:[function(require,module,exports){
(function (process){(function (){
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var gramatica_XML_ASC = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,10],$V1=[2,12],$V2=[1,15],$V3=[9,12,13,15],$V4=[1,37],$V5=[1,38],$V6=[1,33],$V7=[1,30],$V8=[1,32],$V9=[1,34],$Va=[1,28],$Vb=[1,29],$Vc=[1,31],$Vd=[1,35],$Ve=[1,36],$Vf=[1,39],$Vg=[1,40],$Vh=[8,9,10,12,13,15,19,21,23,31,32,33,34,35],$Vi=[5,8],$Vj=[1,55],$Vk=[1,56],$Vl=[1,61],$Vm=[1,62];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"START":3,"RAIZ":4,"EOF":5,"HEAD":6,"OBJETO":7,"lt":8,"qst":9,"xml":10,"LATRIBUTOS":11,"gt":12,"identifier":13,"OBJETOS":14,"div":15,"CONTENIDO_OBJ":16,"ATRIBUTOS":17,"ATRIBUTO":18,"asig":19,"FIN_ATRIBUTO":20,"qmrk":21,"CONTENIDO_ATRB":22,"apost":23,"CONTENIDO_ATRB_SMPL":24,"VALUES_CONT_OBJ":25,"VALUE":26,"LISTA_CONT_ATRB":27,"VALUES_CONT_ATRB":28,"LISTA_CONT_ATRB_SMPL":29,"VALUES_CONT_ATRB_SMPL":30,"contentH":31,"double":32,"integer":33,"minus":34,"Escape":35,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"lt",9:"qst",10:"xml",12:"gt",13:"identifier",15:"div",19:"asig",21:"qmrk",23:"apost",31:"contentH",32:"double",33:"integer",34:"minus",35:"Escape"},
productions_: [0,[3,2],[4,2],[4,1],[6,6],[7,9],[7,8],[7,9],[7,5],[14,2],[14,1],[11,1],[11,0],[17,2],[17,1],[18,3],[20,3],[20,3],[16,2],[16,1],[25,1],[25,1],[25,1],[22,1],[22,0],[27,2],[27,1],[28,1],[28,1],[28,1],[24,1],[24,0],[29,2],[29,1],[30,1],[30,1],[30,1],[26,1],[26,1],[26,1],[26,1],[26,1],[26,1],[26,1],[26,1],[26,1],[26,1],[26,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 
                                                                                    this.$ = { objeto: $$[$0-1],
                                                                                        erroresSemanticos: erroresSemanticos,
                                                                                        erroresLexicos: erroresLexicos
                                                                                        };
                                                                                    erroresLexicos = [];
                                                                                    erroresSemanticos = [];
                                                                                    return this.$;
                                                                               
break;
case 2:
 this.$ = [$$[$0-1],$$[$0]]; 
break;
case 3: case 10: case 14:
 this.$ = [$$[$0]]; 
break;
case 4:
 this.$ = new Objeto($$[$0-3],'',_$[$0-5].first_line, _$[$0-5].first_column,$$[$0-2],[],Etiqueta.HEADER); 
break;
case 5:

                                                                                    this.$ = new Objeto($$[$0-7],'',_$[$0-8].first_line, _$[$0-8].first_column,$$[$0-6],$$[$0-4],Etiqueta.DOBLE);
                                                                                    if($$[$0-7] !== $$[$0-1]){
                                                                                        erroresSemanticos.push(new Error('Error Semantico en linea ' + _$[$0-8].first_line + ' y columna: ' + _$[$0-8].first_column + ':  No coinciden las etiquetas de apertura y final. ' + $$[$0-7] + ' y ' + $$[$0-1] ));
                                                                                    }
                                                                               
break;
case 6:
 
                                                                                    this.$ = new Objeto($$[$0-6],'',_$[$0-7].first_line, _$[$0-7].first_column,$$[$0-5],[],Etiqueta.DOBLE);
                                                                                    if($$[$0-6] !== $$[$0-1]){
                                                                                        erroresSemanticos.push(new Error('Error Semantico en linea ' + _$[$0-7].first_line + ' y columna: ' + _$[$0-7].first_column + ':  No coinciden las etiquetas de apertura y final. ' + $$[$0-6] + ' y ' + $$[$0-1] ));
                                                                                    }
                                                                               
break;
case 7:
 
                                                                                    this.$ = new Objeto($$[$0-7],$$[$0-4],_$[$0-8].first_line, _$[$0-8].first_column,$$[$0-6],[],Etiqueta.DOBLE); 
                                                                                    if($$[$0-7] !== $$[$0-1]){
                                                                                        erroresSemanticos.push(new Error('Error Semantico en linea ' + _$[$0-8].first_line + ' y columna: ' + _$[$0-8].first_column + ':  No coinciden las etiquetas de apertura y final. ' + $$[$0-7] + ' y ' + $$[$0-1] ));
                                                                                    }
                                                                               
break;
case 8:
 this.$ = new Objeto($$[$0-3],'',_$[$0-4].first_line, _$[$0-4].first_column,$$[$0-2],[],Etiqueta.UNICA); 
break;
case 9: case 13:
 $$[$0-1].push($$[$0]); this.$ = $$[$0-1];
break;
case 11:
 this.$ = $$[$0]; 
break;
case 12:
 this.$ = []; 
break;
case 15:
 this.$ = new Atributo($$[$0-2], $$[$0].valor, _$[$0-2].first_line, _$[$0-2].first_column, $$[$0].comilla); 
break;
case 16:
 this.$ = new Atributo($$[$0-2], $$[$0-1], _$[$0-2].first_line, _$[$0-2].first_column, Comilla.DOBLE); 
break;
case 17:
 this.$ = new Atributo($$[$0-2], $$[$0-1], _$[$0-2].first_line, _$[$0-2].first_column, Comilla.SIMPLE); 
break;
case 18: case 25: case 32:

                                                                                        if(_$[$0-1].last_line == _$[$0].first_line){ 
                                                                                            if(_$[$0-1].last_column < _$[$0].first_column ){
                                                                                                for(let i = 0, size = _$[$0].first_column - _$[$0-1].last_column; i < size; i++ ){
                                                                                                    $$[$0-1] = $$[$0-1] + ' ';
                                                                                                }
                                                                                            }
                                                                                        } else {
                                                                                            for(let i = 0, size = _$[$0].first_line - _$[$0-1].last_line; i < size; i++ ){
                                                                                                $$[$0-1] = $$[$0-1] + '\n';
                                                                                            }
                                                                                        }
                                                                                        $$[$0-1] = $$[$0-1] + $$[$0];
                                                                                        this.$ = $$[$0-1];
                                                                               
break;
case 19: case 20: case 21: case 22: case 26: case 27: case 28: case 29: case 33: case 34: case 35: case 36: case 37: case 38: case 39: case 40: case 41: case 42: case 43: case 44: case 45: case 46: case 47:
 this.$ = $$[$0] 
break;
case 23: case 30:
this.$ = $$[$0]
break;
case 24: case 31:
this.$ = ''
break;
}
},
table: [{3:1,4:2,6:3,7:4,8:[1,5]},{1:[3]},{5:[1,6]},{7:7,8:[1,8]},{5:[2,3]},{9:[1,9],13:$V0},{1:[2,1]},{5:[2,2]},{13:$V0},{10:[1,11]},o([12,15],$V1,{11:12,17:13,18:14,13:$V2}),{9:$V1,11:16,13:$V2,17:13,18:14},{12:[1,17],15:[1,18]},o([9,12,15],[2,11],{18:19,13:$V2}),o($V3,[2,14]),{19:[1,20]},{9:[1,21]},{7:25,8:[1,23],9:$V4,10:$V5,12:$V6,13:$V7,14:22,15:$V8,16:24,19:$V9,21:$Va,23:$Vb,25:26,26:27,31:$Vc,32:$Vd,33:$Ve,34:$Vf,35:$Vg},{12:[1,41]},o($V3,[2,13]),{20:42,21:[1,43],23:[1,44]},{12:[1,45]},{7:47,8:[1,46]},{13:$V0,15:[1,48]},{8:[1,49],9:$V4,10:$V5,12:$V6,13:$V7,15:$V8,19:$V9,21:$Va,23:$Vb,25:50,26:27,31:$Vc,32:$Vd,33:$Ve,34:$Vf,35:$Vg},{8:[2,10]},o($Vh,[2,19]),o($Vh,[2,20]),o($Vh,[2,21]),o($Vh,[2,22]),o($Vh,[2,37]),o($Vh,[2,38]),o($Vh,[2,39]),o($Vh,[2,40]),o($Vh,[2,41]),o($Vh,[2,42]),o($Vh,[2,43]),o($Vh,[2,44]),o($Vh,[2,45]),o($Vh,[2,46]),o($Vh,[2,47]),o($Vi,[2,8]),o($V3,[2,15]),{8:$Vj,9:$V4,10:$V5,12:$V6,13:$V7,15:$V8,19:$V9,21:[2,24],22:51,23:$Vk,26:54,27:52,28:53,31:$Vc,32:$Vd,33:$Ve,34:$Vf,35:$Vg},{8:$Vl,9:$V4,10:$V5,12:$V6,13:$V7,15:$V8,19:$V9,21:$Vm,23:[2,31],24:57,26:60,29:58,30:59,31:$Vc,32:$Vd,33:$Ve,34:$Vf,35:$Vg},{8:[2,4]},{13:$V0,15:[1,63]},{8:[2,9]},{13:[1,64]},{15:[1,65]},o($Vh,[2,18]),{21:[1,66]},{8:$Vj,9:$V4,10:$V5,12:$V6,13:$V7,15:$V8,19:$V9,21:[2,23],23:$Vk,26:54,28:67,31:$Vc,32:$Vd,33:$Ve,34:$Vf,35:$Vg},o($Vh,[2,26]),o($Vh,[2,27]),o($Vh,[2,28]),o($Vh,[2,29]),{23:[1,68]},{8:$Vl,9:$V4,10:$V5,12:$V6,13:$V7,15:$V8,19:$V9,21:$Vm,23:[2,30],26:60,30:69,31:$Vc,32:$Vd,33:$Ve,34:$Vf,35:$Vg},o($Vh,[2,33]),o($Vh,[2,34]),o($Vh,[2,35]),o($Vh,[2,36]),{13:[1,70]},{12:[1,71]},{13:[1,72]},o($V3,[2,16]),o($Vh,[2,25]),o($V3,[2,17]),o($Vh,[2,32]),{12:[1,73]},o($Vi,[2,6]),{12:[1,74]},o($Vi,[2,5]),o($Vi,[2,7])],
defaultActions: {4:[2,3],6:[2,1],7:[2,2],25:[2,10],45:[2,4],47:[2,9]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

    const {Error} = require("../Errores/Error");
    const {Objeto, Etiqueta} = require("../Expresiones/Objeto");
    const {Atributo, Comilla} = require("../Expresiones/Atributo");

    var erroresSemanticos = [];
    var erroresLexicos = [];
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-insensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:this.begin('comment');
break;
case 1:this.popState();
break;
case 2:/* skip comment content*/
break;
case 3:/* skip whitespace */
break;
case 4:return 15;
break;
case 5:return 8;
break;
case 6:return 12;
break;
case 7:return 19;
break;
case 8:return 9;
break;
case 9:return 34;
break;
case 10:return 10;
break;
case 11:return 21;
break;
case 12:return 23;
break;
case 13:return 31;
break;
case 14:return 13;
break;
case 15:return 32;
break;
case 16:return 33;
break;
case 17:return 35;
break;
case 18:
                                        erroresLexicos.push(new Error('Error Lexico en linea ' + yy_.yylloc.first_line + ' y columna: ' + yy_.yylloc.first_column + ': ' + yy_.yytext));
                                        //console.error('Este es un error léxico: ' + yy_.yytext + ', en la linea: ' + yy_.yylloc.first_line + ', en la columna: ' + yy_.yylloc.first_column);
                                    
break;
case 19:return 5;
break;
}
},
rules: [/^(?:<!--)/i,/^(?:-->)/i,/^(?:.)/i,/^(?:\s+)/i,/^(?:\/)/i,/^(?:<)/i,/^(?:>)/i,/^(?:=)/i,/^(?:\?)/i,/^(?:-)/i,/^(?:xml\b)/i,/^(?:")/i,/^(?:')/i,/^(?:[^a-zA-Z_0-9ñÑ\-<\/>=\"?'~@#]+)/i,/^(?:[a-zA-Z_][a-zA-Z0-9_ñÑ\-]*)/i,/^(?:(([0-9]+\.[0-9]*)|(\.[0-9]+)))/i,/^(?:[0-9]+)/i,/^(?:(\\([\'\"\\bfnrtv])))/i,/^(?:.)/i,/^(?:$)/i],
conditions: {"comment":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],"inclusive":true},"Etiqueta":{"rules":[],"inclusive":false},"INITIAL":{"rules":[0,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = gramatica_XML_ASC;
exports.Parser = gramatica_XML_ASC.Parser;
exports.parse = function () { return gramatica_XML_ASC.parse.apply(gramatica_XML_ASC, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this)}).call(this,require('_process'))
},{"../Errores/Error":4,"../Expresiones/Atributo":5,"../Expresiones/Objeto":6,"_process":3,"fs":1,"path":2}],8:[function(require,module,exports){
(function (process){(function (){
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var xpathAsc = (function () {
    var o = function (k, v, o, l) { for (o = o || {}, l = k.length; l--; o[k[l]] = v); return o }, $V0 = [12, 14, 16], $V1 = [2, 9], $V2 = [1, 6], $V3 = [5, 6], $V4 = [2, 4], $V5 = [1, 11], $V6 = [1, 12], $V7 = [1, 14], $V8 = [5, 6, 11, 12, 14, 16], $V9 = [1, 28], $Va = [1, 24], $Vb = [1, 25], $Vc = [1, 26], $Vd = [1, 27], $Ve = [1, 29], $Vf = [1, 30], $Vg = [5, 6, 11, 12, 14, 16, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 33], $Vh = [1, 36], $Vi = [1, 35], $Vj = [1, 33], $Vk = [1, 34], $Vl = [1, 37], $Vm = [1, 38], $Vn = [1, 39], $Vo = [1, 40], $Vp = [1, 41], $Vq = [1, 42], $Vr = [1, 43], $Vs = [1, 44], $Vt = [1, 45], $Vu = [11, 14, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 33], $Vv = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 33], $Vw = [20, 23, 24, 25, 26, 27, 28, 29, 30, 33];
    var parser = {
        trace: function trace() { },
        yy: {},
        symbols_: { "error": 2, "START": 3, "PATHS": 4, "EOF": 5, "|": 6, "PATH": 7, "NODES": 8, "SLASH": 9, "EL": 10, "div": 11, "id": 12, "PRE": 13, "*": 14, "ATTR": 15, "@": 16, "ATTR_P": 17, "[": 18, "E": 19, "]": 20, "+": 21, "-": 22, "=": 23, "!=": 24, "<": 25, ">": 26, "<=": 27, ">=": 28, "or": 29, "and": 30, "mod": 31, "(": 32, ")": 33, "double": 34, "integer": 35, "StringLiteral": 36, "last": 37, "position": 38, "$accept": 0, "$end": 1 },
        terminals_: { 2: "error", 5: "EOF", 6: "|", 11: "div", 12: "id", 14: "*", 16: "@", 18: "[", 20: "]", 21: "+", 22: "-", 23: "=", 24: "!=", 25: "<", 26: ">", 27: "<=", 28: ">=", 29: "or", 30: "and", 31: "mod", 32: "(", 33: ")", 34: "double", 35: "integer", 36: "StringLiteral", 37: "last", 38: "position" },
        productions_: [0, [3, 2], [4, 3], [4, 1], [7, 1], [8, 3], [8, 2], [9, 2], [9, 1], [9, 0], [10, 2], [10, 1], [10, 1], [15, 2], [17, 1], [17, 1], [13, 3], [13, 0], [19, 3], [19, 3], [19, 3], [19, 3], [19, 3], [19, 3], [19, 3], [19, 3], [19, 3], [19, 3], [19, 3], [19, 3], [19, 3], [19, 3], [19, 1], [19, 1], [19, 1], [19, 1], [19, 3], [19, 3], [19, 1]],
        performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
            /* this == yyval */

            var $0 = $$.length - 1;
            switch (yystate) {
                case 1:

                    this.$ = {
                        objeto: $$[$0 - 1],
                        erroresSemanticos: erroresSemanticos,
                        erroresLexicos: erroresLexicos
                    };

                    erroresLexicos = [];
                    erroresSemanticos = [];

                    return this.$;

                    break;
                case 2:
                    this.$ = $$[$0 - 2].push($$[$0])
                    break;
                case 3:
                    this.$ = [$$[$0]]
                    break;
                case 4: case 12: case 13:
                    this.$ = $$[$0]
                    break;
                case 5:

                    if ($$[$0 - 1] >= 1) {
                        $$[$0].recursive = true
                    }
                    $$[$0 - 2].push($$[$0])
                    this.$ = $$[$0 - 2]

                    break;
                case 6:

                    if ($$[$0 - 1] == 2) {
                        $$[$0].recursive = true
                        $$[$0].fromRoot = true
                    }
                    else if ($$[$0 - 1] == 1) {
                        $$[$0].fromRoot = true
                    }
                    this.$ = [$$[$0]]

                    break;
                case 7:
                    this.$ = 2
                    break;
                case 8:
                    this.$ = 1
                    break;
                case 9:
                    this.$ = 0
                    break;
                case 10:
                    this.$ = new Element($$[$0 - 1], TypeElement.NODO, $$[$0], _$[$0 - 1].first_line, _$[$0 - 1].first_column)
                    break;
                case 11:
                    this.$ = new Element('', TypeElement.ALL, $$[$01], _$[$0].first_line, _$[$0].first_column)
                    break;
                case 14:
                    this.$ = new Element($$[$0], TypeElement.NODO, $$[$01], _$[$0].first_line, _$[$0].first_column)
                    break;
                case 15:
                    this.$ = new Element($$[$0], TypeElement.ALL, $$[$01], _$[$0].first_line, _$[$0].first_column)
                    break;
                case 16: case 31:
                    this.$ = $$[$0 - 1]
                    break;
                case 17:
                    this.$ = []
                    break;
                case 18:

                    var op = new Operation($$[$0 - 2].first_line, _$[$0 - 2].first_column, TypeOperation.SUMA)
                    op.saveBinaryOp($$[$0 - 2], $$[$0])
                    this.$ = op

                    break;
                case 19:

                    var op = new Operation($$[$0 - 2].first_line, _$[$0 - 2].first_column, TypeOperation.RESTA)
                    op.saveBinaryOp($$[$0 - 2], $$[$0])
                    this.$ = op

                    break;
                case 20:

                    var op = new Operation($$[$0 - 2].first_line, _$[$0 - 2].first_column, TypeOperation.MULTIPLICACION)
                    op.saveBinaryOp($$[$0 - 2], $$[$0])
                    this.$ = op

                    break;
                case 21:

                    var op = new Operation($$[$0 - 2].first_line, _$[$0 - 2].first_column, TypeOperation.DIVISION)
                    op.saveBinaryOp($$[$0 - 2], $$[$0])
                    this.$ = op

                    break;
                case 22:

                    var op = new Operation($$[$0 - 2].first_line, _$[$0 - 2].first_column, TypeOperation.IGUAL)
                    op.saveBinaryOp($$[$0 - 2], $$[$0])
                    this.$ = op

                    break;
                case 23:

                    var op = new Operation($$[$0 - 2].first_line, _$[$0 - 2].first_column, TypeOperation.DIFERENTE)
                    op.saveBinaryOp($$[$0 - 2], $$[$0])
                    this.$ = op

                    break;
                case 24:

                    var op = new Operation($$[$0 - 2].first_line, _$[$0 - 2].first_column, TypeOperation.MENOR)
                    op.saveBinaryOp($$[$0 - 2], $$[$0])
                    this.$ = op

                    break;
                case 25:

                    var op = new Operation($$[$0 - 2].first_line, _$[$0 - 2].first_column, TypeOperation.MAYOR)
                    op.saveBinaryOp($$[$0 - 2], $$[$0])
                    this.$ = op

                    break;
                case 26:

                    var op = new Operation($$[$0 - 2].first_line, _$[$0 - 2].first_column, TypeOperation.MENOR_IGUAL)
                    op.saveBinaryOp($$[$0 - 2], $$[$0])
                    this.$ = op

                    break;
                case 27:

                    var op = new Operation($$[$0 - 2].first_line, _$[$0 - 2].first_column, TypeOperation.MAYOR_IGUAL)
                    op.saveBinaryOp($$[$0 - 2], $$[$0])
                    this.$ = op

                    break;
                case 28:

                    var op = new Operation($$[$0 - 2].first_line, _$[$0 - 2].first_column, TypeOperation.OR)
                    op.saveBinaryOp($$[$0 - 2], $$[$0])
                    this.$ = op

                    break;
                case 29:

                    var op = new Operation($$[$0 - 2].first_line, _$[$0 - 2].first_column, TypeOperation.AND)
                    op.saveBinaryOp($$[$0 - 2], $$[$0])
                    this.$ = op

                    break;
                case 30:

                    var op = new Operation($$[$0 - 2].first_line, _$[$0 - 2].first_column, TypeOperation.MOD)
                    op.saveBinaryOp($$[$0 - 2], $$[$0])
                    this.$ = op

                    break;
                case 32:

                    var op = new Operation($$[$0].first_line, _$[$0].first_column, TypeOperation.DOUBLE)
                    op.savePrimitiveOp($$[$0])
                    this.$ = op

                    break;
                case 33:

                    var op = new Operation($$[$0].first_line, _$[$0].first_column, TypeOperation.INTEGER)
                    op.savePrimitiveOp($$[$0])
                    this.$ = op

                    break;
                case 34:

                    var op = new Operation($$[$0].first_line, _$[$0].first_column, TypeOperation.STRING)
                    op.savePrimitiveOp($$[$0])
                    this.$ = op

                    break;
                case 35:

                    var op = new Operation($$[$0].first_line, _$[$0].first_column, TypeOperation.ID)
                    op.savePrimitiveOp($$[$0])
                    this.$ = op

                    break;
                case 36:
                    this.$ = new Operation('LAST'.first_line, _$[$0 - 2].first_column, TypeOperation.LAST)
                    break;
                case 37:
                    this.$ = new Operation('POSITION'.first_line, _$[$0 - 2].first_column, TypeOperation.POSITION)
                    break;
                case 38:
                    this.$ = new Operation($$[$0].name, $$[$0].linea, $$[$0].columna, TypeOperation.ATRIBUTO)
                    break;
            }
        },
        table: [o($V0, $V1, { 3: 1, 4: 2, 7: 3, 8: 4, 9: 5, 11: $V2 }), { 1: [3] }, { 5: [1, 7], 6: [1, 8] }, o($V3, [2, 3]), o($V0, $V1, { 9: 9, 5: $V4, 6: $V4, 11: $V2 }), { 10: 10, 12: $V5, 14: $V6, 15: 13, 16: $V7 }, o($V0, [2, 8], { 11: [1, 15] }), { 1: [2, 1] }, o($V0, $V1, { 8: 4, 9: 5, 7: 16, 11: $V2 }), { 10: 17, 12: $V5, 14: $V6, 15: 13, 16: $V7 }, o($V8, [2, 6]), o($V8, [2, 17], { 13: 18, 18: [1, 19] }), o($V8, [2, 11]), o($V8, [2, 12]), { 12: [1, 21], 14: [1, 22], 17: 20 }, o($V0, [2, 7]), o($V3, [2, 2]), o($V8, [2, 5]), o($V8, [2, 10]), { 12: $V9, 15: 31, 16: $V7, 19: 23, 32: $Va, 34: $Vb, 35: $Vc, 36: $Vd, 37: $Ve, 38: $Vf }, o($Vg, [2, 13]), o($Vg, [2, 14]), o($Vg, [2, 15]), { 11: $Vh, 14: $Vi, 20: [1, 32], 21: $Vj, 22: $Vk, 23: $Vl, 24: $Vm, 25: $Vn, 26: $Vo, 27: $Vp, 28: $Vq, 29: $Vr, 30: $Vs, 31: $Vt }, { 12: $V9, 15: 31, 16: $V7, 19: 46, 32: $Va, 34: $Vb, 35: $Vc, 36: $Vd, 37: $Ve, 38: $Vf }, o($Vu, [2, 32]), o($Vu, [2, 33]), o($Vu, [2, 34]), o($Vu, [2, 35]), { 32: [1, 47] }, { 32: [1, 48] }, o($Vu, [2, 38]), o($V8, [2, 16]), { 12: $V9, 15: 31, 16: $V7, 19: 49, 32: $Va, 34: $Vb, 35: $Vc, 36: $Vd, 37: $Ve, 38: $Vf }, { 12: $V9, 15: 31, 16: $V7, 19: 50, 32: $Va, 34: $Vb, 35: $Vc, 36: $Vd, 37: $Ve, 38: $Vf }, { 12: $V9, 15: 31, 16: $V7, 19: 51, 32: $Va, 34: $Vb, 35: $Vc, 36: $Vd, 37: $Ve, 38: $Vf }, { 12: $V9, 15: 31, 16: $V7, 19: 52, 32: $Va, 34: $Vb, 35: $Vc, 36: $Vd, 37: $Ve, 38: $Vf }, { 12: $V9, 15: 31, 16: $V7, 19: 53, 32: $Va, 34: $Vb, 35: $Vc, 36: $Vd, 37: $Ve, 38: $Vf }, { 12: $V9, 15: 31, 16: $V7, 19: 54, 32: $Va, 34: $Vb, 35: $Vc, 36: $Vd, 37: $Ve, 38: $Vf }, { 12: $V9, 15: 31, 16: $V7, 19: 55, 32: $Va, 34: $Vb, 35: $Vc, 36: $Vd, 37: $Ve, 38: $Vf }, { 12: $V9, 15: 31, 16: $V7, 19: 56, 32: $Va, 34: $Vb, 35: $Vc, 36: $Vd, 37: $Ve, 38: $Vf }, { 12: $V9, 15: 31, 16: $V7, 19: 57, 32: $Va, 34: $Vb, 35: $Vc, 36: $Vd, 37: $Ve, 38: $Vf }, { 12: $V9, 15: 31, 16: $V7, 19: 58, 32: $Va, 34: $Vb, 35: $Vc, 36: $Vd, 37: $Ve, 38: $Vf }, { 12: $V9, 15: 31, 16: $V7, 19: 59, 32: $Va, 34: $Vb, 35: $Vc, 36: $Vd, 37: $Ve, 38: $Vf }, { 12: $V9, 15: 31, 16: $V7, 19: 60, 32: $Va, 34: $Vb, 35: $Vc, 36: $Vd, 37: $Ve, 38: $Vf }, { 12: $V9, 15: 31, 16: $V7, 19: 61, 32: $Va, 34: $Vb, 35: $Vc, 36: $Vd, 37: $Ve, 38: $Vf }, { 11: $Vh, 14: $Vi, 21: $Vj, 22: $Vk, 23: $Vl, 24: $Vm, 25: $Vn, 26: $Vo, 27: $Vp, 28: $Vq, 29: $Vr, 30: $Vs, 31: $Vt, 33: [1, 62] }, { 33: [1, 63] }, { 33: [1, 64] }, o($Vv, [2, 18], { 11: $Vh, 14: $Vi, 31: $Vt }), o($Vv, [2, 19], { 11: $Vh, 14: $Vi, 31: $Vt }), o($Vu, [2, 20]), o($Vu, [2, 21]), o($Vw, [2, 22], { 11: $Vh, 14: $Vi, 21: $Vj, 22: $Vk, 31: $Vt }), o($Vw, [2, 23], { 11: $Vh, 14: $Vi, 21: $Vj, 22: $Vk, 31: $Vt }), o($Vw, [2, 24], { 11: $Vh, 14: $Vi, 21: $Vj, 22: $Vk, 31: $Vt }), o($Vw, [2, 25], { 11: $Vh, 14: $Vi, 21: $Vj, 22: $Vk, 31: $Vt }), o($Vw, [2, 26], { 11: $Vh, 14: $Vi, 21: $Vj, 22: $Vk, 31: $Vt }), o($Vw, [2, 27], { 11: $Vh, 14: $Vi, 21: $Vj, 22: $Vk, 31: $Vt }), o([20, 29, 33], [2, 28], { 11: $Vh, 14: $Vi, 21: $Vj, 22: $Vk, 23: $Vl, 24: $Vm, 25: $Vn, 26: $Vo, 27: $Vp, 28: $Vq, 30: $Vs, 31: $Vt }), o([20, 29, 30, 33], [2, 29], { 11: $Vh, 14: $Vi, 21: $Vj, 22: $Vk, 23: $Vl, 24: $Vm, 25: $Vn, 26: $Vo, 27: $Vp, 28: $Vq, 31: $Vt }), o($Vu, [2, 30]), o($Vu, [2, 31]), o($Vu, [2, 36]), o($Vu, [2, 37])],
        defaultActions: { 7: [2, 1] },
        parseError: function parseError(str, hash) {
            if (hash.recoverable) {
                this.trace(str);
            } else {
                var error = new Error(str);
                error.hash = hash;
                throw error;
            }
        },
        parse: function parse(input) {
            var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
            var args = lstack.slice.call(arguments, 1);
            var lexer = Object.create(this.lexer);
            var sharedState = { yy: {} };
            for (var k in this.yy) {
                if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
                    sharedState.yy[k] = this.yy[k];
                }
            }
            lexer.setInput(input, sharedState.yy);
            sharedState.yy.lexer = lexer;
            sharedState.yy.parser = this;
            if (typeof lexer.yylloc == 'undefined') {
                lexer.yylloc = {};
            }
            var yyloc = lexer.yylloc;
            lstack.push(yyloc);
            var ranges = lexer.options && lexer.options.ranges;
            if (typeof sharedState.yy.parseError === 'function') {
                this.parseError = sharedState.yy.parseError;
            } else {
                this.parseError = Object.getPrototypeOf(this).parseError;
            }
            function popStack(n) {
                stack.length = stack.length - 2 * n;
                vstack.length = vstack.length - n;
                lstack.length = lstack.length - n;
            }
            _token_stack:
            var lex = function () {
                var token;
                token = lexer.lex() || EOF;
                if (typeof token !== 'number') {
                    token = self.symbols_[token] || token;
                }
                return token;
            };
            var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
            while (true) {
                state = stack[stack.length - 1];
                if (this.defaultActions[state]) {
                    action = this.defaultActions[state];
                } else {
                    if (symbol === null || typeof symbol == 'undefined') {
                        symbol = lex();
                    }
                    action = table[state] && table[state][symbol];
                }
                if (typeof action === 'undefined' || !action.length || !action[0]) {
                    var errStr = '';
                    expected = [];
                    for (p in table[state]) {
                        if (this.terminals_[p] && p > TERROR) {
                            expected.push('\'' + this.terminals_[p] + '\'');
                        }
                    }
                    if (lexer.showPosition) {
                        errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                    } else {
                        errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                    }
                    this.parseError(errStr, {
                        text: lexer.match,
                        token: this.terminals_[symbol] || symbol,
                        line: lexer.yylineno,
                        loc: yyloc,
                        expected: expected
                    });
                }
                if (action[0] instanceof Array && action.length > 1) {
                    throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
                }
                switch (action[0]) {
                    case 1:
                        stack.push(symbol);
                        vstack.push(lexer.yytext);
                        lstack.push(lexer.yylloc);
                        stack.push(action[1]);
                        symbol = null;
                        if (!preErrorSymbol) {
                            yyleng = lexer.yyleng;
                            yytext = lexer.yytext;
                            yylineno = lexer.yylineno;
                            yyloc = lexer.yylloc;
                            if (recovering > 0) {
                                recovering--;
                            }
                        } else {
                            symbol = preErrorSymbol;
                            preErrorSymbol = null;
                        }
                        break;
                    case 2:
                        len = this.productions_[action[1]][1];
                        yyval.$ = vstack[vstack.length - len];
                        yyval._$ = {
                            first_line: lstack[lstack.length - (len || 1)].first_line,
                            last_line: lstack[lstack.length - 1].last_line,
                            first_column: lstack[lstack.length - (len || 1)].first_column,
                            last_column: lstack[lstack.length - 1].last_column
                        };
                        if (ranges) {
                            yyval._$.range = [
                                lstack[lstack.length - (len || 1)].range[0],
                                lstack[lstack.length - 1].range[1]
                            ];
                        }
                        r = this.performAction.apply(yyval, [
                            yytext,
                            yyleng,
                            yylineno,
                            sharedState.yy,
                            action[1],
                            vstack,
                            lstack
                        ].concat(args));
                        if (typeof r !== 'undefined') {
                            return r;
                        }
                        if (len) {
                            stack = stack.slice(0, -1 * len * 2);
                            vstack = vstack.slice(0, -1 * len);
                            lstack = lstack.slice(0, -1 * len);
                        }
                        stack.push(this.productions_[action[1]][0]);
                        vstack.push(yyval.$);
                        lstack.push(yyval._$);
                        newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                        stack.push(newState);
                        break;
                    case 3:
                        return true;
                }
            }
            return true;
        }
    };

    const { Error } = require('../Errores/Error')
    const { Element, Filter, Operation, TypeElement, TypeOperation } = require('../Instrucciones/Element/Element')

    var erroresSemanticos = [];
    var erroresLexicos = [];
    /* generated by jison-lex 0.3.4 */
    var lexer = (function () {
        var lexer = ({

            EOF: 1,

            parseError: function parseError(str, hash) {
                if (this.yy.parser) {
                    this.yy.parser.parseError(str, hash);
                } else {
                    throw new Error(str);
                }
            },

            // resets the lexer, sets new input
            setInput: function (input, yy) {
                this.yy = yy || this.yy || {};
                this._input = input;
                this._more = this._backtrack = this.done = false;
                this.yylineno = this.yyleng = 0;
                this.yytext = this.matched = this.match = '';
                this.conditionStack = ['INITIAL'];
                this.yylloc = {
                    first_line: 1,
                    first_column: 0,
                    last_line: 1,
                    last_column: 0
                };
                if (this.options.ranges) {
                    this.yylloc.range = [0, 0];
                }
                this.offset = 0;
                return this;
            },

            // consumes and returns one char from the input
            input: function () {
                var ch = this._input[0];
                this.yytext += ch;
                this.yyleng++;
                this.offset++;
                this.match += ch;
                this.matched += ch;
                var lines = ch.match(/(?:\r\n?|\n).*/g);
                if (lines) {
                    this.yylineno++;
                    this.yylloc.last_line++;
                } else {
                    this.yylloc.last_column++;
                }
                if (this.options.ranges) {
                    this.yylloc.range[1]++;
                }

                this._input = this._input.slice(1);
                return ch;
            },

            // unshifts one char (or a string) into the input
            unput: function (ch) {
                var len = ch.length;
                var lines = ch.split(/(?:\r\n?|\n)/g);

                this._input = ch + this._input;
                this.yytext = this.yytext.substr(0, this.yytext.length - len);
                //this.yyleng -= len;
                this.offset -= len;
                var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                this.match = this.match.substr(0, this.match.length - 1);
                this.matched = this.matched.substr(0, this.matched.length - 1);

                if (lines.length - 1) {
                    this.yylineno -= lines.length - 1;
                }
                var r = this.yylloc.range;

                this.yylloc = {
                    first_line: this.yylloc.first_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.first_column,
                    last_column: lines ?
                        (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                        + oldLines[oldLines.length - lines.length].length - lines[0].length :
                        this.yylloc.first_column - len
                };

                if (this.options.ranges) {
                    this.yylloc.range = [r[0], r[0] + this.yyleng - len];
                }
                this.yyleng = this.yytext.length;
                return this;
            },

            // When called from action, caches matched text and appends it on next action
            more: function () {
                this._more = true;
                return this;
            },

            // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
            reject: function () {
                if (this.options.backtrack_lexer) {
                    this._backtrack = true;
                } else {
                    return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                        text: "",
                        token: null,
                        line: this.yylineno
                    });

                }
                return this;
            },

            // retain first n characters of the match
            less: function (n) {
                this.unput(this.match.slice(n));
            },

            // displays already matched input, i.e. for error messages
            pastInput: function () {
                var past = this.matched.substr(0, this.matched.length - this.match.length);
                return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, "");
            },

            // displays upcoming input, i.e. for error messages
            upcomingInput: function () {
                var next = this.match;
                if (next.length < 20) {
                    next += this._input.substr(0, 20 - next.length);
                }
                return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
            },

            // displays the character position where the lexing error occurred, i.e. for error messages
            showPosition: function () {
                var pre = this.pastInput();
                var c = new Array(pre.length + 1).join("-");
                return pre + this.upcomingInput() + "\n" + c + "^";
            },

            // test the lexed token: return FALSE when not a match, otherwise return token
            test_match: function (match, indexed_rule) {
                var token,
                    lines,
                    backup;

                if (this.options.backtrack_lexer) {
                    // save context
                    backup = {
                        yylineno: this.yylineno,
                        yylloc: {
                            first_line: this.yylloc.first_line,
                            last_line: this.last_line,
                            first_column: this.yylloc.first_column,
                            last_column: this.yylloc.last_column
                        },
                        yytext: this.yytext,
                        match: this.match,
                        matches: this.matches,
                        matched: this.matched,
                        yyleng: this.yyleng,
                        offset: this.offset,
                        _more: this._more,
                        _input: this._input,
                        yy: this.yy,
                        conditionStack: this.conditionStack.slice(0),
                        done: this.done
                    };
                    if (this.options.ranges) {
                        backup.yylloc.range = this.yylloc.range.slice(0);
                    }
                }

                lines = match[0].match(/(?:\r\n?|\n).*/g);
                if (lines) {
                    this.yylineno += lines.length;
                }
                this.yylloc = {
                    first_line: this.yylloc.last_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.last_column,
                    last_column: lines ?
                        lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                        this.yylloc.last_column + match[0].length
                };
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                if (this.options.ranges) {
                    this.yylloc.range = [this.offset, this.offset += this.yyleng];
                }
                this._more = false;
                this._backtrack = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
                if (this.done && this._input) {
                    this.done = false;
                }
                if (token) {
                    return token;
                } else if (this._backtrack) {
                    // recover context
                    for (var k in backup) {
                        this[k] = backup[k];
                    }
                    return false; // rule action called reject() implying the next rule should be tested instead.
                }
                return false;
            },

            // return next match in input
            next: function () {
                if (this.done) {
                    return this.EOF;
                }
                if (!this._input) {
                    this.done = true;
                }

                var token,
                    match,
                    tempMatch,
                    index;
                if (!this._more) {
                    this.yytext = '';
                    this.match = '';
                }
                var rules = this._currentRules();
                for (var i = 0; i < rules.length; i++) {
                    tempMatch = this._input.match(this.rules[rules[i]]);
                    if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                        match = tempMatch;
                        index = i;
                        if (this.options.backtrack_lexer) {
                            token = this.test_match(tempMatch, rules[i]);
                            if (token !== false) {
                                return token;
                            } else if (this._backtrack) {
                                match = false;
                                continue; // rule action called reject() implying a rule MISmatch.
                            } else {
                                // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                                return false;
                            }
                        } else if (!this.options.flex) {
                            break;
                        }
                    }
                }
                if (match) {
                    token = this.test_match(match, rules[index]);
                    if (token !== false) {
                        return token;
                    }
                    // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                    return false;
                }
                if (this._input === "") {
                    return this.EOF;
                } else {
                    return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                        text: "",
                        token: null,
                        line: this.yylineno
                    });
                }
            },

            // return next match that has a token
            lex: function lex() {
                var r = this.next();
                if (r) {
                    return r;
                } else {
                    return this.lex();
                }
            },

            // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
            begin: function begin(condition) {
                this.conditionStack.push(condition);
            },

            // pop the previously active lexer condition state off the condition stack
            popState: function popState() {
                var n = this.conditionStack.length - 1;
                if (n > 0) {
                    return this.conditionStack.pop();
                } else {
                    return this.conditionStack[0];
                }
            },

            // produce the lexer rule set which is active for the currently active lexer condition state
            _currentRules: function _currentRules() {
                if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
                    return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
                } else {
                    return this.conditions["INITIAL"].rules;
                }
            },

            // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
            topState: function topState(n) {
                n = this.conditionStack.length - 1 - Math.abs(n || 0);
                if (n >= 0) {
                    return this.conditionStack[n];
                } else {
                    return "INITIAL";
                }
            },

            // alias for begin(condition)
            pushState: function pushState(condition) {
                this.begin(condition);
            },

            // return the number of states currently on the stack
            stateStackSize: function stateStackSize() {
                return this.conditionStack.length;
            },
            options: { "case-insensitive": true },
            performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
                var YYSTATE = YY_START;
                switch ($avoiding_name_collisions) {
                    case 0:/* skip whitespace */
                        break;
                    case 1: return 'resLast'
                        break;
                    case 2: return 'resAttr'
                        break;
                    case 3: return 'resNode'
                        break;
                    case 4: return 'resText'
                        break;
                    case 5: return 'resChild'
                        break;
                    case 6: return 'resAttribute'
                        break;
                    case 7: return 'resDescendant'
                        break;
                    case 8: return 'resAncestor'
                        break;
                    case 9: return 'resAncestorSelf'
                        break;
                    case 10: return 11
                        break;
                    case 11: return 31
                        break;
                    case 12: return 29
                        break;
                    case 13: return 30
                        break;
                    case 14: return 21
                        break;
                    case 15: return 22
                        break;
                    case 16: return 14
                        break;
                    case 17: return 23
                        break;
                    case 18: return 24
                        break;
                    case 19: return 25
                        break;
                    case 20: return 26
                        break;
                    case 21: return 27
                        break;
                    case 22: return 28
                        break;
                    case 23: return 11
                        break;
                    case 24: return 6
                        break;
                    case 25: return '.'
                        break;
                    case 26: return 16
                        break;
                    case 27: return 18
                        break;
                    case 28: return 20
                        break;
                    case 29: return 32
                        break;
                    case 30: return 33
                        break;
                    case 31: return 34;
                        break;
                    case 32: return 35;
                        break;
                    case 33: return 'string';
                        break;
                    case 34: return 12;
                        break;
                    case 35: return 36
                        break;
                    case 36: return 5
                        break;
                    case 37:
                        console.error('Error léxico: ' + yy_.yytext + ', en la linea: ' + yy_.yylloc.first_line + ', en la columna: ' + yy_.yylloc.first_column);

                        break;
                }
            },
            rules: [/^(?:\s+)/i, /^(?:last\b)/i, /^(?:attr\b)/i, /^(?:node\b)/i, /^(?:text\b)/i, /^(?:child\b)/i, /^(?:attribute\b)/i, /^(?:descendant\b)/i, /^(?:ancestor\b)/i, /^(?:ancestor-or-self\b)/i, /^(?:div\b)/i, /^(?:mod\b)/i, /^(?:or\b)/i, /^(?:and\b)/i, /^(?:\+)/i, /^(?:-)/i, /^(?:\*)/i, /^(?:=)/i, /^(?:!=)/i, /^(?:<)/i, /^(?:>)/i, /^(?:<=)/i, /^(?:>=)/i, /^(?:\/)/i, /^(?:\|)/i, /^(?:\.)/i, /^(?:@)/i, /^(?:\[)/i, /^(?:\])/i, /^(?:\()/i, /^(?:\))/i, /^(?:(([0-9]+\.[0-9]*)|(\.[0-9]+)))/i, /^(?:[0-9]+)/i, /^(?:"[^\"]*")/i, /^(?:([a-zA-Z])[a-zA-Z0-9_]*)/i, /^(?:("((\\([\'\"\\bfnrtv]))|([^\"\\]+))*"))/i, /^(?:$)/i, /^(?:.)/i],
            conditions: { "INITIAL": { "rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37], "inclusive": true } }
        });
        return lexer;
    })();
    parser.lexer = lexer;
    function Parser() {
        this.yy = {};
    }
    Parser.prototype = parser; parser.Parser = Parser;
    return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
    exports.parser = xpathAsc;
    exports.Parser = xpathAsc.Parser;
    exports.parse = function () { return xpathAsc.parse.apply(xpathAsc, arguments); };
    exports.main = function commonjsMain(args) {
        if (!args[1]) {
            console.log('Usage: ' + args[0] + ' FILE');
            process.exit(1);
        }
        var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
        return exports.parser.parse(source);
    };
    if (typeof module !== 'undefined' && require.main === module) {
        exports.main(process.argv.slice(1));
    }
}
}).call(this)}).call(this,require('_process'))
},{"../Errores/Error":4,"../Instrucciones/Element/Element":9,"_process":3,"fs":1,"path":2}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Element = exports.Filter = exports.Operation = exports.TypeElement = exports.TypeOperation = void 0;
var TypeOperation;
(function (TypeOperation) {
    TypeOperation[TypeOperation["SUMA"] = 0] = "SUMA";
    TypeOperation[TypeOperation["RESTA"] = 1] = "RESTA";
    TypeOperation[TypeOperation["MULTIPLICACION"] = 2] = "MULTIPLICACION";
    TypeOperation[TypeOperation["DIVISION"] = 3] = "DIVISION";
    TypeOperation[TypeOperation["IGUAL"] = 4] = "IGUAL";
    TypeOperation[TypeOperation["DIFERENTE"] = 5] = "DIFERENTE";
    TypeOperation[TypeOperation["MENOR"] = 6] = "MENOR";
    TypeOperation[TypeOperation["MAYOR"] = 7] = "MAYOR";
    TypeOperation[TypeOperation["MENOR_IGUAL"] = 8] = "MENOR_IGUAL";
    TypeOperation[TypeOperation["MAYOR_IGUAL"] = 9] = "MAYOR_IGUAL";
    TypeOperation[TypeOperation["OR"] = 10] = "OR";
    TypeOperation[TypeOperation["AND"] = 11] = "AND";
    TypeOperation[TypeOperation["MOD"] = 12] = "MOD";
    TypeOperation[TypeOperation["DOUBLE"] = 13] = "DOUBLE";
    TypeOperation[TypeOperation["INTEGER"] = 14] = "INTEGER";
    TypeOperation[TypeOperation["STRING"] = 15] = "STRING";
    TypeOperation[TypeOperation["ID"] = 16] = "ID";
    TypeOperation[TypeOperation["LAST"] = 17] = "LAST";
    TypeOperation[TypeOperation["POSITION"] = 18] = "POSITION";
    TypeOperation[TypeOperation["ATRIBUTO"] = 19] = "ATRIBUTO";
})(TypeOperation = exports.TypeOperation || (exports.TypeOperation = {}));
var TypeElement;
(function (TypeElement) {
    TypeElement[TypeElement["ATRIBUTO"] = 0] = "ATRIBUTO";
    TypeElement[TypeElement["NODO"] = 1] = "NODO";
    TypeElement[TypeElement["ALL"] = 2] = "ALL";
})(TypeElement = exports.TypeElement || (exports.TypeElement = {}));
class Operation {
    constructor(line, column, type) {
        this.linea = line;
        this.columna = column;
        this.typeOp = type;
    }
    /* OPERACION BINARIA */
    saveBinaryOp(left, right) {
        this.leftOp = left;
        this.rightOp = right;
    }
    /* OPERACION UNARIA */
    saveUnaryOp(left) {
        this.leftOp = left;
    }
    /* OPERACION PRIMITIVA */
    savePrimitiveOp(value) {
        this.value = value;
    }
    ejecutar(ent, arbol) {
        throw new Error('Method not implemented.');
    }
}
exports.Operation = Operation;
class Filter {
    constructor(line, column, name, operation) {
        this.linea = line;
        this.columna = column;
        this.name = name;
        this.operation = operation;
    }
    ejecutar(ent, arbol) {
        throw new Error('Method not implemented.');
    }
}
exports.Filter = Filter;
class Element {
    constructor(name, type, filters, line, column) {
        this.linea = line;
        this.columna = column;
        this.name = name;
        this.type = type;
        this.recursive = false;
        this.fromRoot = false;
        this.filters = filters;
    }
    ejecutar(ent, arbol) {
        throw new Error('Method not implemented.');
    }
}
exports.Element = Element;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
const xmlAsc = require('./Gramatica/gramatica_XML_ASC');
const xpathAsc = require('./Gramatica/xpathAsc');
class Main {
    constructor() {
        this.lexicos = [];
    }
    ejecutarCodigoXmlAsc(entrada) {
        console.log('ejecutando xmlAsc ...');
        const objetos = xmlAsc.parse(entrada);
        console.log(objetos);
        window.localStorage.setItem('lexicos', JSON.stringify(objetos.erroresLexicos));
        //this.Errsemantico = objetos.erroresSemanticos;
        //console.log(this.Errsemantico);
        //console.log(objetos);
    }
    ejecutarCodigoXpathAsc(entrada) {
        console.log('ejecutando xpathAsc ...');
        const objetos = xpathAsc.parse(entrada);
        console.log(objetos);
    }
    readFile(e) {
        console.log('read file ...');
        var file = e.target.files[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (e) => {
            let target = e.target;
            if (target !== undefined && target !== null) {
                console.log('load text ...');
                var contents = target.result;
                var element = document.getElementById('codeBlock');
                if (element !== undefined && element !== null) {
                    element.textContent = contents;
                }
                else {
                    console.log('Error set content');
                }
            }
            else {
                console.log('Error read file');
            }
        };
        reader.readAsText(file);
    }
    prueba() {
        console.log("hola mundo");
    }
    getErroresLexicos() {
        let lex = window.localStorage.getItem('lexicos');
        if (lex) {
            this.lexicos = JSON.parse(lex);
            console.log(this.lexicos);
            var tbodyRef = document.getElementById('keywords');
            let i = 1;
            this.lexicos.forEach((element) => {
                let newRow = tbodyRef.insertRow();
                let newCell = newRow.insertCell();
                let newText2 = document.createTextNode(element.descripcion);
                newCell.appendChild(newText2);
            });
        }
        //setup our table array
    }
    setListener() {
        let inputFile = document.getElementById('open-file');
        if (inputFile !== undefined && inputFile !== null) {
            inputFile.addEventListener('change', this.readFile, false);
            console.log("inputFile activo");
        }
        let analizeXmlAsc = document.getElementById('analizeXmlAsc');
        if (analizeXmlAsc !== undefined && analizeXmlAsc !== null) {
            console.log("btn xmlAsc activo");
            analizeXmlAsc.addEventListener('click', () => {
                // ANALIZAR XML
                let codeBlock = document.getElementById('codeBlock');
                let content = codeBlock !== undefined && codeBlock !== null ? codeBlock.value : '';
                this.ejecutarCodigoXmlAsc(content);
            });
        }
        let analizeXPathAsc = document.getElementById('analizeXPathAsc');
        if (analizeXPathAsc !== undefined && analizeXPathAsc !== null) {
            console.log("btn xpathAsc activo");
            analizeXPathAsc.addEventListener('click', () => {
                // ANALIZAR XML
                let input = document.getElementById('codeXPath');
                let content = input !== undefined && input !== null ? input.value : '';
                this.ejecutarCodigoXpathAsc(content);
            });
        }
        let clean = document.getElementById('clean');
        if (clean !== undefined && clean !== null) {
            console.log("btn clean activo");
            clean.addEventListener('click', () => {
                let codeBlock = document.getElementById('codeBlock');
                if (codeBlock !== undefined && codeBlock !== null) {
                    codeBlock.value = '';
                }
                ;
            });
        }
        let tablaErrores = document.getElementById('tablaErrores');
        if (tablaErrores !== undefined && tablaErrores !== null) {
            console.log("btn Tabla Errores Activo");
            tablaErrores.addEventListener('click', () => {
                this.getErroresLexicos();
            });
        }
    }
}
exports.Main = Main;

},{"./Gramatica/gramatica_XML_ASC":7,"./Gramatica/xpathAsc":8}]},{},[10])(10)
});
