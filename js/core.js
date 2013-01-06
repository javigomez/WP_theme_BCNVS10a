var bcn = bcn || {};
(function (bcn, context) {
    var queue = {
        js: [],
        css: []
    }, headEl = context.document.getElementsByTagName("head")[0],
        base_uri = "assets";
    var register = {
        twitter: {
            "1.0.0": {
                alias: ["last", "1.0"],
                uri: ["/twitter/1.0.0/javascripts/twitter.js"]
            }
        },
        mobile: {
            "1.0.0": {
                alias: ["last", "1.0"],
                uri: ["/mobile/1.0.0/javascripts/mobile.js"]
            }
        },
        common: {
            "1.0.0": {
                alias: ["1.0"],
                uri: ["/common/1.0.0/javascripts/common.js", ],
                variants: ["min"]
            },
            "1.1.0": {
                alias: ["1.1"],
                uri: ["/common/1.1.0/javascripts/common.js", ],
                variants: ["min"]
            },
            "1.2.0": {
                alias: ["last", "1", "1.2"],
                uri: ["/common/1.2.0/javascripts/common.js", ],
                variants: ["min"]
            }
        },
        jquery: {
            "1.2.6": {
                uri: "/vendor/jquery/1.2.6/jquery-1.2.6.min.js",
                variants: ["min"]
            },
            "1.5.2": {
                uri: "/vendor/jquery/1.5.2/jquery-1.5.2.min.js",
                variants: ["min"]
            },
            "1.7.1": {
                uri: "/vendor/jquery/1.7.1/jquery-1.7.1.min.js",
                variants: ["min"]
            }
        },
        jow: {
            "1.0.0": {
                alias: ["1", "1.0"],
                uri: "/jow/1.0.0/javascripts/jow.js",
                dependences: [{
                    jquery: "1.5.2"
                }, "http://example.org"]
            },
            "2.0.0": {
                alias: ["last", "2", "2.0"],
                uri: "/jow/2.0.0/javascripts/jow.js",
                dependences: [{
                    jquery: "1.5.2"
                }]
            }
        },
        jir: {
            "2.0.0": {
                alias: ["last", "2", "2.0"],
                uri: "/jir/2.0.0/javascripts/jir.js",
                dependences: [{
                    jquery: "1.5.2"
                }]
            }
        },
        modal: {
            "1.0.0": {
                alias: ["last", "1", "1.0"],
                uri: "/modal/1.0.0/javascripts/modal.js",
                dependences: [{
                    jquery: "1.5.2"
                }],
                variants: ["min"]
            }
        },
        object: {
            "1.0.0": {
                alias: ["last", "1", "1.0"],
                uri: "/object/1.0.0/javascripts/object.js",
                dependences: [{
                    jquery: "1.5.2"
                }],
                variants: ["min"]
            }
        }
    };
    bcn.baseURI = ((context.document.location === "https:") ? "https://w9.bcn.cat/" : "http://www.bcn.cat/") + base_uri;
    bcn.merge = function (original, other) {
        var hasOwn = Object.prototype.hasOwnProperty;
        for (var i in other) {
            if (hasOwn.call(other, i)) {
                original[i] = other[i]
            }
        }
        return original
    };
    bcn.i18n = (function () {
        var repository = {};
        load = function (collection) {
            for (var i in collection) {
                if (i in repository) {
                    repository[i] = bcn.merge(repository[i], collection[i])
                } else {
                    repository[i] = collection[i]
                }
            }
            return bcn.i18n
        }, translate = function (text, o, lang) {
            var lang = lang || bcn.lang,
                o = o || {}, literal = (lang === "en") ? text : (repository[lang][text] || text),
                result = bcn.interpolation(literal, o);
            return result
        };
        return {
            load: load,
            t: translate
        }
    }());
    bcn.interpolation = function (string, collection) {
        return string.replace(/#{([^{}]*)}/g, function (a, b) {
            var r = collection[b];
            return typeof r === "string" || typeof r === "number" ? r : a
        })
    };
    bcn.load = function (id, version, variant) {
        var registeredVariant, variants, uri, hasOwn = Object.prototype.hasOwnProperty;
        if (register[id] === undefined) {
            if (version !== undefined) {
                throw id + " is not a known identifier and the version parámeter is not allowed in an HTTP URI."
            }
            if (variant !== undefined) {
                throw "The version parámeter is not allowed in an HTTP URI."
            }
            joinQueue(id)
        } else {
            version = versionChecker(id, version);
            if (register[id][version] === undefined) {
                throw "Unknown asset version: " + id + ", " + version + "."
            }
            if (variant !== undefined && variant != "min") {
                throw variant + " is not a valid value for a variant asset."
            }
            if (variant !== undefined) {
                registeredVariant = false;
                variants = register[id][version]["variants"];
                for (var i = 0, max = variants.length; i < max; i++) {
                    if (hasOwn.call(variants, i)) {
                        if (variants[i] === variant) {
                            registeredVariant = true;
                            break
                        }
                    }
                }
                if (!registeredVariant) {
                    throw "The " + id + " asset doesn't have the variant " + variant
                }
            }
            uri = register[id][version]["uri"];
            if (uri.constructor === Array) {
                for (var i = 0, max = uri.length; i < max; i++) {
                    joinQueue(uri[i], variant)
                }
            } else {
                joinQueue(uri, variant)
            }
        }
        return bcn
    };

    function joinQueue(uri, variant) {
        var newURI;
        if (uri !== undefined) {
            variant = (variant === undefined) ? "" : "." + variant;
            newURI = uri.replace(/\.([^\.]+)$/, variant + ".$1");
            if (newURI.match(/^\/[^\/]/)) {
                newURI = bcn.baseURI + newURI
            }
            t = newURI.match(/\.(js|css)\b/);
            if (t === null) {
                throw "Unknown extension file for " + uri
            }
            queue[t[1]].push(newURI)
        }
    }
    function versionChecker(id, version) {
        version = version || "1.0.0";
        return version
    }
    function commonChecker() {
        var common = false,
            links = headEl.getElementsByTagName("link"),
            common_css = "",
            common_css_ie7ie8, common_uris = [register.common["1.0.0"]["uri"][1], register.common["1.1.0"]["uri"][1]];
        for (var i = 0, maxLinks = links.length; i < maxLinks; i++) {
            for (var j = 0, maxURIs = common_uris.length; j < maxURIs; j++) {
                if (bcn.baseURI + common_uris[j] === links[i].href) {
                    common_css = bcn.baseURI + common_uris[j];
                    common = true;
                    break
                }
            }
        }
        if (common) {
            common_css_ie7ie8 = common_css.replace(/(\.css)/, ".ie7ie8$1");
            queue.css.push({
                href: common_css_ie7ie8,
                iecondition: "(IE 7)|(IE 8)"
            });
            for (var i = 0, maxQueue = queue.css.length; i < maxQueue; i++) {
                for (var j = 0, maxURIs = common_uris.length; j < maxURIs; j++) {
                    if (queue.css[i] === bcn.baseURI + common_uris[j]) {
                        queue.css.splice(i, 1);
                        break
                    }
                }
            }
        }
    }
    bcn.ready = function (callback) {
        var js = queue.js,
            css = queue.css;
        queue.js = [];
        queue.css = [];
        commonChecker();
        enhance({
            loadScripts: js,
            loadStyles: css,
            appendToggleLink: false,
            onScriptsLoaded: callback
        })
    };
    bcn.cookie = {
        create: function (name, value, days, path) {
            var date, expires, path = path || "/";
            if (days) {
                date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString()
            } else {
                expires = ""
            }
            context.document.cookie = name + "=" + value + expires + "; path=" + path
        },
        read: function (name) {
            var nameEQ = name + "=",
                cookies = context.document.cookie.split(";"),
                cookiesLength = cookies.length;
            for (var i = 0; i < cookiesLength; i++) {
                var cookie = cookies[i];
                while (cookie.charAt(0) === " ") {
                    cookie = cookie.substring(1, cookie.length)
                }
                if (cookie.indexOf(nameEQ) === 0) {
                    return cookie.substring(nameEQ.length, cookie.length)
                }
            }
            return null
        },
        erase: function (name, path) {
            bcn.cookie.create(name, "", - 1, path)
        }
    };
    bcn.publisher = {
        subscribers: {
            any: []
        },
        on: function (type, fn, context) {
            var type = type || "any",
                fn = (typeof fn === "function") ? fn : context[fn];
            if (typeof this.subscribers[type] === "undefined") {
                this.subscribers[type] = []
            }
            this.subscribers[type].push({
                fn: fn,
                context: context || this
            })
        },
        off: function (type, fn, context) {
            this.visitSubscribers("unsubscribe", type, fn, context)
        },
        fire: function (type, publication) {
            this.visitSubscribers("publish", type, publication)
        },
        visitSubscribers: function (action, type, arg, context) {
            var pubtype = type || "any",
                subscribers = this.subscribers[pubtype],
                i, max = subscribers ? subscribers.length : 0;
            for (i = 0; i < max; i++) {
                if (action === "publish") {
                    subscribers[i].fn.call(subscribers[i].context, arg)
                } else {
                    if (subscribers[i].fn === arg && subscribers[i].context === context) {
                        subscribers.splice(i, 1)
                    }
                }
            }
        }
    };
    bcn.makePublisher = function (o) {
        var i, publisher = context.bcn.publisher;
        for (i in publisher) {
            if (publisher.hasOwnProperty(i) && typeof publisher[i] === "function") {
                o[i] = publisher[i]
            }
        }
        o.subscribers = {
            any: []
        }
    };
    bcn.statistics = function (params) {
        var that = this,
            location = context.document.location,
            host = location.hostname.match(/(bcn\.(?:cat|es))$/),
            protocol = location.protocol,
            repository = {
                global: "UA-29621470-1",
                test: "UA-29621470-2"
            }, params = params || {}, is_array = function (value) {
                return value && typeof value === "object" && value.constructor === Array
            }, ga_uri = ("https:" == protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js",
            start = function () {
                var letter = function (i) {
                    return String.fromCharCode(65 + i)
                        .toLowerCase()
                }, keys = params.keys || [];
                if (params.test === true) {
                    keys.push(repository.test)
                } else {
                    keys.push(repository.global)
                }
                for (var i = 0, m = keys.length, j; i < m; i++) {
                    j = (i == 0) ? "" : letter(i) + ".";
                    _gaq.push([j + "_setAccount", keys[i]], [j + "_trackPageview"]);
                    if (host) {
                        for (var k in repository) {
                            if (repository[k] === keys[i]) {
                                _gaq.push([j + "_setDomainName", host[1]])
                            }
                        }
                    }
                }
                return false
            }, track_event = function (params) {
                var url = params[0],
                    type = params[1],
                    label = params[2];
                if (!is_array(context._gaq)) {
                    context._gaq.push(["_trackEvent", type, label, url])
                } else {
                    context.setTimeout(function () {
                        track_event(params)
                    }, 1)
                }
            };
        context._gaq = context._gaq || [];
        bcn.load(ga_uri)
            .ready();
        if (params.length === 0 || params.test === true || params.keys !== undefined) {
            start()
        }
        if (params.track !== undefined) {
            track_event(params.track)
        }
        return false
    };
    /*!
     * Qwery - A Blazing Fast query selector engine
     * https://github.com/ded/qwery
     * copyright Dustin Diaz & Jacob Thornton 2012
     * MIT License
     */ (function (name, definition, context) {
        if (typeof module != "undefined" && module.exports) {
            module.exports = definition()
        } else {
            if (typeof context.define != "undefined" && context.define == "function" && context.define["amd"]) {
                define(name, definition)
            } else {
                context[name] = definition()
            }
        }
    })("qwery", function () {
        var doc = document,
            html = doc.documentElement,
            byClass = "getElementsByClassName",
            byTag = "getElementsByTagName",
            qSA = "querySelectorAll",
            useNativeQSA = "useNativeQSA",
            tagName = "tagName",
            nodeType = "nodeType",
            select, id = /#([\w\-]+)/,
            clas = /\.[\w\-]+/g,
            idOnly = /^#([\w\-]+)$/,
            classOnly = /^\.([\w\-]+)$/,
            tagOnly = /^([\w\-]+)$/,
            tagAndOrClass = /^([\w]+)?\.([\w\-]+)$/,
            splittable = /(^|,)\s*[>~+]/,
            normalizr = /^\s+|\s*([,\s\+\~>]|$)\s*/g,
            splitters = /[\s\>\+\~]/,
            splittersMore = /(?![\s\w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^'"]*\]|[\s\w\+\-]*\))/,
            specialChars = /([.*+?\^=!:${}()|\[\]\/\\])/g,
            simple = /^(\*|[a-z0-9]+)?(?:([\.\#]+[\w\-\.#]+)?)/,
            attr = /\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\]/,
            pseudo = /:([\w\-]+)(\(['"]?([^()]+)['"]?\))?/,
            easy = new RegExp(idOnly.source + "|" + tagOnly.source + "|" + classOnly.source),
            dividers = new RegExp("(" + splitters.source + ")" + splittersMore.source, "g"),
            tokenizr = new RegExp(splitters.source + splittersMore.source),
            chunker = new RegExp(simple.source + "(" + attr.source + ")?(" + pseudo.source + ")?"),
            walker = {
                " ": function (node) {
                    return node && node !== html && node.parentNode
                },
                ">": function (node, contestant) {
                    return node && node.parentNode == contestant.parentNode && node.parentNode
                },
                "~": function (node) {
                    return node && node.previousSibling
                },
                "+": function (node, contestant, p1, p2) {
                    if (!node) {
                        return false
                    }
                    return (p1 = previous(node)) && (p2 = previous(contestant)) && p1 == p2 && p1
                }
            };

        function cache() {
            this.c = {}
        }
        cache.prototype = {
            g: function (k) {
                return this.c[k] || undefined
            },
            s: function (k, v, r) {
                v = r ? new RegExp(v) : v;
                return (this.c[k] = v)
            }
        };
        var classCache = new cache(),
            cleanCache = new cache(),
            attrCache = new cache(),
            tokenCache = new cache();

        function classRegex(c) {
            return classCache.g(c) || classCache.s(c, "(^|\\s+)" + c + "(\\s+|$)", 1)
        }
        function each(a, fn) {
            var i = 0,
                l = a.length;
            for (; i < l; i++) {
                fn(a[i])
            }
        }
        function flatten(ar) {
            for (var r = [], i = 0, l = ar.length; i < l; ++i) {
                arrayLike(ar[i]) ? (r = r.concat(ar[i])) : (r[r.length] = ar[i])
            }
            return r
        }
        function arrayify(ar) {
            var i = 0,
                l = ar.length,
                r = [];
            for (; i < l; i++) {
                r[i] = ar[i]
            }
            return r
        }
        function previous(n) {
            while (n = n.previousSibling) {
                if (n[nodeType] == 1) {
                    break
                }
            }
            return n
        }
        function q(query) {
            return query.match(chunker)
        }
        function interpret(whole, tag, idsAndClasses, wholeAttribute, attribute, qualifier, value, wholePseudo, pseudo, wholePseudoVal, pseudoVal) {
            var i, m, k, o, classes;
            if (this[nodeType] !== 1) {
                return false
            }
            if (tag && tag !== "*" && this[tagName] && this[tagName].toLowerCase() !== tag) {
                return false
            }
            if (idsAndClasses && (m = idsAndClasses.match(id)) && m[1] !== this.id) {
                return false
            }
            if (idsAndClasses && (classes = idsAndClasses.match(clas))) {
                for (i = classes.length; i--;) {
                    if (!classRegex(classes[i].slice(1))
                        .test(this.className)) {
                        return false
                    }
                }
            }
            if (pseudo && qwery.pseudos[pseudo] && !qwery.pseudos[pseudo](this, pseudoVal)) {
                return false
            }
            if (wholeAttribute && !value) {
                o = this.attributes;
                for (k in o) {
                    if (Object.prototype.hasOwnProperty.call(o, k) && (o[k].name || k) == attribute) {
                        return this
                    }
                }
            }
            if (wholeAttribute && !checkAttr(qualifier, getAttr(this, attribute) || "", value)) {
                return false
            }
            return this
        }
        function clean(s) {
            return cleanCache.g(s) || cleanCache.s(s, s.replace(specialChars, "\\$1"))
        }
        function checkAttr(qualify, actual, val) {
            switch (qualify) {
                case "=":
                    return actual == val;
                case "^=":
                    return actual.match(attrCache.g("^=" + val) || attrCache.s("^=" + val, "^" + clean(val), 1));
                case "$=":
                    return actual.match(attrCache.g("$=" + val) || attrCache.s("$=" + val, clean(val) + "$", 1));
                case "*=":
                    return actual.match(attrCache.g(val) || attrCache.s(val, clean(val), 1));
                case "~=":
                    return actual.match(attrCache.g("~=" + val) || attrCache.s("~=" + val, "(?:^|\\s+)" + clean(val) + "(?:\\s+|$)", 1));
                case "|=":
                    return actual.match(attrCache.g("|=" + val) || attrCache.s("|=" + val, "^" + clean(val) + "(-|$)", 1))
            }
            return 0
        }
        function _qwery(selector, _root) {
            var r = [],
                ret = [],
                i, l, m, token, tag, els, intr, item, root = _root,
                tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr)),
                dividedTokens = selector.match(dividers);
            if (!tokens.length) {
                return r
            }
            token = (tokens = tokens.slice(0))
                .pop();
            if (tokens.length && (m = tokens[tokens.length - 1].match(idOnly))) {
                root = byId(_root, m[1])
            }
            if (!root) {
                return r
            }
            intr = q(token);
            els = root !== _root && root[nodeType] !== 9 && dividedTokens && /^[+~]$/.test(dividedTokens[dividedTokens.length - 1]) ? function (r) {
                while (root = root.nextSibling) {
                    root[nodeType] == 1 && (intr[1] ? intr[1] == root[tagName].toLowerCase() : 1) && (r[r.length] = root)
                }
                return r
            }([]) : root[byTag](intr[1] || "*");
            for (i = 0, l = els.length; i < l; i++) {
                if (item = interpret.apply(els[i], intr)) {
                    r[r.length] = item
                }
            }
            if (!tokens.length) {
                return r
            }
            each(r, function (e) {
                if (ancestorMatch(e, tokens, dividedTokens)) {
                    ret[ret.length] = e
                }
            });
            return ret
        }
        function is(el, selector, root) {
            if (isNode(selector)) {
                return el == selector
            }
            if (arrayLike(selector)) {
                return !!~flatten(selector)
                    .indexOf(el)
            }
            var selectors = selector.split(","),
                tokens, dividedTokens;
            while (selector = selectors.pop()) {
                tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr));
                dividedTokens = selector.match(dividers);
                tokens = tokens.slice(0);
                if (interpret.apply(el, q(tokens.pop())) && (!tokens.length || ancestorMatch(el, tokens, dividedTokens, root))) {
                    return true
                }
            }
            return false
        }
        function ancestorMatch(el, tokens, dividedTokens, root) {
            var cand;

            function crawl(e, i, p) {
                while (p = walker[dividedTokens[i]](p, e)) {
                    if (isNode(p) && (interpret.apply(p, q(tokens[i])))) {
                        if (i) {
                            if (cand = crawl(p, i - 1, p)) {
                                return cand
                            }
                        } else {
                            return p
                        }
                    }
                }
            }
            return (cand = crawl(el, tokens.length - 1, el)) && (!root || isAncestor(cand, root))
        }
        function isNode(el, t) {
            return el && typeof el === "object" && (t = el[nodeType]) && (t == 1 || t == 9)
        }
        function uniq(ar) {
            var a = [],
                i, j;
            o: for (i = 0; i < ar.length; ++i) {
                for (j = 0; j < a.length; ++j) {
                    if (a[j] == ar[i]) {
                        continue o
                    }
                }
                a[a.length] = ar[i]
            }
            return a
        }
        function arrayLike(o) {
            return (typeof o === "object" && isFinite(o.length))
        }
        function normalizeRoot(root) {
            if (!root) {
                return doc
            }
            if (typeof root == "string") {
                return qwery(root)[0]
            }
            if (!root[nodeType] && arrayLike(root)) {
                return root[0]
            }
            return root
        }
        function byId(root, id, el) {
            return root[nodeType] === 9 ? root.getElementById(id) : root.ownerDocument && (((el = root.ownerDocument.getElementById(id)) && isAncestor(el, root) && el) || (!isAncestor(root, root.ownerDocument) && select('[id="' + id + '"]', root)[0]))
        }
        function qwery(selector, _root) {
            var m, el, root = normalizeRoot(_root);
            if (!root || !selector) {
                return []
            }
            if (selector === window || isNode(selector)) {
                return !_root || (selector !== window && isNode(root) && isAncestor(selector, root)) ? [selector] : []
            }
            if (selector && arrayLike(selector)) {
                return flatten(selector)
            }
            if (m = selector.match(easy)) {
                if (m[1]) {
                    return (el = byId(root, m[1])) ? [el] : []
                }
                if (m[2]) {
                    return arrayify(root[byTag](m[2]))
                }
                if (hasByClass && m[3]) {
                    return arrayify(root[byClass](m[3]))
                }
            }
            return select(selector, root)
        }
        function collectSelector(root, collector) {
            return function (s) {
                var oid, nid;
                if (splittable.test(s)) {
                    if (root[nodeType] !== 9) {
                        if (!(nid = oid = root.getAttribute("id"))) {
                            root.setAttribute("id", nid = "__qwerymeupscotty")
                        }
                        s = '[id="' + nid + '"]' + s;
                        collector(root.parentNode || root, s, true);
                        oid || root.removeAttribute("id")
                    }
                    return
                }
                s.length && collector(root, s, false)
            }
        }
        var isAncestor = "compareDocumentPosition" in html ? function (element, container) {
                return (container.compareDocumentPosition(element) & 16) == 16
            } : "contains" in html ? function (element, container) {
                container = container[nodeType] === 9 || container == window ? html : container;
                return container !== element && container.contains(element)
            } : function (element, container) {
                while (element = element.parentNode) {
                    if (element === container) {
                        return 1
                    }
                }
                return 0
            }, getAttr = function () {
                var e = doc.createElement("p");
                return ((e.innerHTML = '<a href="#x">x</a>') && e.firstChild.getAttribute("href") != "#x") ? function (e, a) {
                    return a === "class" ? e.className : (a === "href" || a === "src") ? e.getAttribute(a, 2) : e.getAttribute(a)
                } : function (e, a) {
                    return e.getAttribute(a)
                }
            }(),
            hasByClass = !! doc[byClass],
            hasQSA = doc.querySelector && doc[qSA],
            selectQSA = function (selector, root) {
                var result = [],
                    ss, e;
                try {
                    if (root[nodeType] === 9 || !splittable.test(selector)) {
                        return arrayify(root[qSA](selector))
                    }
                    each(ss = selector.split(","), collectSelector(root, function (ctx, s) {
                        e = ctx[qSA](s);
                        if (e.length == 1) {
                            result[result.length] = e.item(0)
                        } else {
                            if (e.length) {
                                result = result.concat(arrayify(e))
                            }
                        }
                    }));
                    return ss.length > 1 && result.length > 1 ? uniq(result) : result
                } catch (ex) {}
                return selectNonNative(selector, root)
            }, selectNonNative = function (selector, root) {
                var result = [],
                    items, m, i, l, r, ss;
                selector = selector.replace(normalizr, "$1");
                if (m = selector.match(tagAndOrClass)) {
                    r = classRegex(m[2]);
                    items = root[byTag](m[1] || "*");
                    for (i = 0, l = items.length; i < l; i++) {
                        if (r.test(items[i].className)) {
                            result[result.length] = items[i]
                        }
                    }
                    return result
                }
                each(ss = selector.split(","), collectSelector(root, function (ctx, s, rewrite) {
                    r = _qwery(s, ctx);
                    for (i = 0, l = r.length; i < l; i++) {
                        if (ctx[nodeType] === 9 || rewrite || isAncestor(r[i], root)) {
                            result[result.length] = r[i]
                        }
                    }
                }));
                return ss.length > 1 && result.length > 1 ? uniq(result) : result
            }, configure = function (options) {
                if (typeof options[useNativeQSA] !== "undefined") {
                    select = !options[useNativeQSA] ? selectNonNative : hasQSA ? selectQSA : selectNonNative
                }
            };
        configure({
            useNativeQSA: true
        });
        qwery.configure = configure;
        qwery.uniq = uniq;
        qwery.is = is;
        qwery.pseudos = {};
        return qwery
    }, this);
    bcn.query = context.qwery;
    context.qwery = null;
    /*!
     * Bonzo: DOM Utility (c) Dustin Diaz 2012
     * https://github.com/ded/bonzo
     * License MIT
     */ (function (name, definition, context) {
        if (typeof module != "undefined" && module.exports) {
            module.exports = definition()
        } else {
            if (typeof context.define == "function" && context.define["amd"]) {
                define(name, definition)
            } else {
                context[name] = definition()
            }
        }
    })("bonzo", function () {
        var context = this,
            win = window,
            doc = win.document,
            html = doc.documentElement,
            parentNode = "parentNode",
            query = null,
            specialAttributes = /^(checked|value|selected)$/i,
            specialTags = /^(select|fieldset|table|tbody|tfoot|td|tr|colgroup)$/i,
            table = ["<table>", "</table>", 1],
            td = ["<table><tbody><tr>", "</tr></tbody></table>", 3],
            option = ["<select>", "</select>", 1],
            noscope = ["_", "", 0, 1],
            tagMap = {
                thead: table,
                tbody: table,
                tfoot: table,
                colgroup: table,
                caption: table,
                tr: ["<table><tbody>", "</tbody></table>", 2],
                th: td,
                td: td,
                col: ["<table><colgroup>", "</colgroup></table>", 2],
                fieldset: ["<form>", "</form>", 1],
                legend: ["<form><fieldset>", "</fieldset></form>", 2],
                option: option,
                optgroup: option,
                script: noscope,
                style: noscope,
                link: noscope,
                param: noscope,
                base: noscope
            }, stateAttributes = /^(checked|selected)$/,
            ie = /msie/i.test(navigator.userAgent),
            hasClass, addClass, removeClass, uidMap = {}, uuids = 0,
            digit = /^-?[\d\.]+$/,
            dattr = /^data-(.+)$/,
            px = "px",
            setAttribute = "setAttribute",
            getAttribute = "getAttribute",
            byTag = "getElementsByTagName",
            features = function () {
                var e = doc.createElement("p");
                e.innerHTML = '<a href="#x">x</a><table style="float:left;"></table>';
                return {
                    hrefExtended: e[byTag]("a")[0][getAttribute]("href") != "#x",
                    autoTbody: e[byTag]("tbody")
                        .length !== 0,
                    computedStyle: doc.defaultView && doc.defaultView.getComputedStyle,
                    cssFloat: e[byTag]("table")[0].style.styleFloat ? "styleFloat" : "cssFloat",
                    transform: function () {
                        var props = ["webkitTransform", "MozTransform", "OTransform", "msTransform", "Transform"],
                            i;
                        for (i = 0; i < props.length; i++) {
                            if (props[i] in e.style) {
                                return props[i]
                            }
                        }
                    }(),
                    classList: "classList" in e
                }
            }(),
            trimReplace = /(^\s*|\s*$)/g,
            whitespaceRegex = /\s+/,
            toString = String.prototype.toString,
            unitless = {
                lineHeight: 1,
                zoom: 1,
                zIndex: 1,
                opacity: 1,
                boxFlex: 1,
                WebkitBoxFlex: 1,
                MozBoxFlex: 1
            }, trim = String.prototype.trim ? function (s) {
                return s.trim()
            } : function (s) {
                return s.replace(trimReplace, "")
            };

        function classReg(c) {
            return new RegExp("(^|\\s+)" + c + "(\\s+|$)")
        }
        function each(ar, fn, scope) {
            for (var i = 0, l = ar.length; i < l; i++) {
                fn.call(scope || ar[i], ar[i], i, ar)
            }
            return ar
        }
        function deepEach(ar, fn, scope) {
            for (var i = 0, l = ar.length; i < l; i++) {
                if (isNode(ar[i])) {
                    deepEach(ar[i].childNodes, fn, scope);
                    fn.call(scope || ar[i], ar[i], i, ar)
                }
            }
            return ar
        }
        function camelize(s) {
            return s.replace(/-(.)/g, function (m, m1) {
                return m1.toUpperCase()
            })
        }
        function decamelize(s) {
            return s ? s.replace(/([a-z])([A-Z])/g, "$1-$2")
                .toLowerCase() : s
        }
        function data(el) {
            el[getAttribute]("data-node-uid") || el[setAttribute]("data-node-uid", ++uuids);
            var uid = el[getAttribute]("data-node-uid");
            return uidMap[uid] || (uidMap[uid] = {})
        }
        function clearData(el) {
            var uid = el[getAttribute]("data-node-uid");
            if (uid) {
                delete uidMap[uid]
            }
        }
        function dataValue(d, f) {
            try {
                return (d === null || d === undefined) ? undefined : d === "true" ? true : d === "false" ? false : d === "null" ? null : (f = parseFloat(d)) == d ? f : d
            } catch (e) {}
            return undefined
        }
        function isNode(node) {
            return node && node.nodeName && (node.nodeType == 1 || node.nodeType == 11)
        }
        function some(ar, fn, scope, i, j) {
            for (i = 0, j = ar.length; i < j; ++i) {
                if (fn.call(scope, ar[i], i, ar)) {
                    return true
                }
            }
            return false
        }
        function styleProperty(p) {
            (p == "transform" && (p = features.transform)) || (/^transform-?[Oo]rigin$/.test(p) && (p = features.transform + "Origin")) || (p == "float" && (p = features.cssFloat));
            return p ? camelize(p) : null
        }
        var getStyle = features.computedStyle ? function (el, property) {
                var value = null,
                    computed = doc.defaultView.getComputedStyle(el, "");
                computed && (value = computed[property]);
                return el.style[property] || value
            } : (ie && html.currentStyle) ? function (el, property) {
                if (property == "opacity") {
                    var val = 100;
                    try {
                        val = el.filters["DXImageTransform.Microsoft.Alpha"].opacity
                    } catch (e1) {
                        try {
                            val = el.filters("alpha")
                                .opacity
                        } catch (e2) {}
                    }
                    return val / 100
                }
                var value = el.currentStyle ? el.currentStyle[property] : null;
                return el.style[property] || value
            } : function (el, property) {
                return el.style[property]
            };

        function insert(target, host, fn) {
            var i = 0,
                self = host || this,
                r = [],
                nodes = query && typeof target == "string" && target.charAt(0) != "<" ? query(target) : target;
            each(normalize(nodes), function (t) {
                each(self, function (el) {
                    var n = !el[parentNode] || (el[parentNode] && !el[parentNode][parentNode]) ? function () {
                            var c = el.cloneNode(true),
                                cloneElems, elElems;
                            if (self.$ && self.cloneEvents) {
                                self.$(c)
                                    .cloneEvents(el);
                                cloneElems = self.$(c)
                                    .find("*");
                                elElems = self.$(el)
                                    .find("*");
                                for (var i = 0; i < elElems.length; i++) {
                                    self.$(cloneElems[i])
                                        .cloneEvents(elElems[i])
                                }
                            }
                            return c
                        }() : el;
                    fn(t, n);
                    r[i] = n;
                    i++
                })
            }, this);
            each(r, function (e, i) {
                self[i] = e
            });
            self.length = i;
            return self
        }
        function xy(el, x, y) {
            var $el = bonzo(el),
                style = $el.css("position"),
                offset = $el.offset(),
                rel = "relative",
                isRel = style == rel,
                delta = [parseInt($el.css("left"), 10), parseInt($el.css("top"), 10)];
            if (style == "static") {
                $el.css("position", rel);
                style = rel
            }
            isNaN(delta[0]) && (delta[0] = isRel ? 0 : el.offsetLeft);
            isNaN(delta[1]) && (delta[1] = isRel ? 0 : el.offsetTop);
            x != null && (el.style.left = x - offset.left + delta[0] + px);
            y != null && (el.style.top = y - offset.top + delta[1] + px)
        }
        if (features.classList) {
            hasClass = function (el, c) {
                return el.classList.contains(c)
            };
            addClass = function (el, c) {
                el.classList.add(c)
            };
            removeClass = function (el, c) {
                el.classList.remove(c)
            }
        } else {
            hasClass = function (el, c) {
                return classReg(c)
                    .test(el.className)
            };
            addClass = function (el, c) {
                el.className = trim(el.className + " " + c)
            };
            removeClass = function (el, c) {
                el.className = trim(el.className.replace(classReg(c), " "))
            }
        }
        function setter(el, v) {
            return typeof v == "function" ? v(el) : v
        }
        function Bonzo(elements) {
            this.length = 0;
            if (elements) {
                elements = typeof elements !== "string" && !elements.nodeType && typeof elements.length !== "undefined" ? elements : [elements];
                this.length = elements.length;
                for (var i = 0; i < elements.length; i++) {
                    this[i] = elements[i]
                }
            }
        }
        Bonzo.prototype = {
            get: function (index) {
                return this[index] || null
            },
            each: function (fn, scope) {
                return each(this, fn, scope)
            },
            deepEach: function (fn, scope) {
                return deepEach(this, fn, scope)
            },
            map: function (fn, reject) {
                var m = [],
                    n, i;
                for (i = 0; i < this.length; i++) {
                    n = fn.call(this, this[i], i);
                    reject ? (reject(n) && m.push(n)) : m.push(n)
                }
                return m
            },
            html: function (h, text) {
                var method = text ? html.textContent === undefined ? "innerText" : "textContent" : "innerHTML";

                function append(el) {
                    each(normalize(h), function (node) {
                        el.appendChild(node)
                    })
                }
                return typeof h !== "undefined" ? this.empty()
                    .each(function (el) {
                    !text && specialTags.test(el.tagName) ? append(el) : (function () {
                        try {
                            (el[method] = h)
                        } catch (e) {
                            append(el)
                        }
                    }())
                }) : this[0] ? this[0][method] : ""
            },
            text: function (text) {
                return this.html(text, 1)
            },
            append: function (node) {
                return this.each(function (el) {
                    each(normalize(node), function (i) {
                        el.appendChild(i)
                    })
                })
            },
            prepend: function (node) {
                return this.each(function (el) {
                    var first = el.firstChild;
                    each(normalize(node), function (i) {
                        el.insertBefore(i, first)
                    })
                })
            },
            appendTo: function (target, host) {
                return insert.call(this, target, host, function (t, el) {
                    t.appendChild(el)
                })
            },
            prependTo: function (target, host) {
                return insert.call(this, target, host, function (t, el) {
                    t.insertBefore(el, t.firstChild)
                })
            },
            before: function (node) {
                return this.each(function (el) {
                    each(bonzo.create(node), function (i) {
                        el[parentNode].insertBefore(i, el)
                    })
                })
            },
            after: function (node) {
                return this.each(function (el) {
                    each(bonzo.create(node), function (i) {
                        el[parentNode].insertBefore(i, el.nextSibling)
                    })
                })
            },
            insertBefore: function (target, host) {
                return insert.call(this, target, host, function (t, el) {
                    t[parentNode].insertBefore(el, t)
                })
            },
            insertAfter: function (target, host) {
                return insert.call(this, target, host, function (t, el) {
                    var sibling = t.nextSibling;
                    if (sibling) {
                        t[parentNode].insertBefore(el, sibling)
                    } else {
                        t[parentNode].appendChild(el)
                    }
                })
            },
            replaceWith: function (html) {
                this.deepEach(clearData);
                return this.each(function (el) {
                    el.parentNode.replaceChild(bonzo.create(html)[0], el)
                })
            },
            addClass: function (c) {
                c = toString.call(c)
                    .split(whitespaceRegex);
                return this.each(function (el) {
                    each(c, function (c) {
                        if (c && !hasClass(el, setter(el, c))) {
                            addClass(el, setter(el, c))
                        }
                    })
                })
            },
            removeClass: function (c) {
                c = toString.call(c)
                    .split(whitespaceRegex);
                return this.each(function (el) {
                    each(c, function (c) {
                        if (c && hasClass(el, setter(el, c))) {
                            removeClass(el, setter(el, c))
                        }
                    })
                })
            },
            hasClass: function (c) {
                c = toString.call(c)
                    .split(whitespaceRegex);
                return some(this, function (el) {
                    return some(c, function (c) {
                        return c && hasClass(el, c)
                    })
                })
            },
            toggleClass: function (c, condition) {
                c = toString.call(c)
                    .split(whitespaceRegex);
                return this.each(function (el) {
                    each(c, function (c) {
                        if (c) {
                            typeof condition !== "undefined" ? condition ? addClass(el, c) : removeClass(el, c) : hasClass(el, c) ? removeClass(el, c) : addClass(el, c)
                        }
                    })
                })
            },
            show: function (type) {
                return this.each(function (el) {
                    el.style.display = type || ""
                })
            },
            hide: function () {
                return this.each(function (el) {
                    el.style.display = "none"
                })
            },
            toggle: function (callback, type) {
                this.each(function (el) {
                    el.style.display = (el.offsetWidth || el.offsetHeight) ? "none" : type || ""
                });
                callback && callback();
                return this
            },
            first: function () {
                return bonzo(this.length ? this[0] : [])
            },
            last: function () {
                return bonzo(this.length ? this[this.length - 1] : [])
            },
            next: function () {
                return this.related("nextSibling")
            },
            previous: function () {
                return this.related("previousSibling")
            },
            parent: function () {
                return this.related(parentNode)
            },
            related: function (method) {
                return this.map(function (el) {
                    el = el[method];
                    while (el && el.nodeType !== 1) {
                        el = el[method]
                    }
                    return el || 0
                }, function (el) {
                    return el
                })
            },
            focus: function () {
                this.length && this[0].focus();
                return this
            },
            blur: function () {
                return this.each(function (el) {
                    el.blur()
                })
            },
            css: function (o, v, p) {
                if (v === undefined && typeof o == "string") {
                    v = this[0];
                    if (!v) {
                        return null
                    }
                    if (v === doc || v === win) {
                        p = (v === doc) ? bonzo.doc() : bonzo.viewport();
                        return o == "width" ? p.width : o == "height" ? p.height : ""
                    }
                    return (o = styleProperty(o)) ? getStyle(v, o) : null
                }
                var iter = o;
                if (typeof o == "string") {
                    iter = {};
                    iter[o] = v
                }
                if (ie && iter.opacity) {
                    iter.filter = "alpha(opacity=" + (iter.opacity * 100) + ")";
                    iter.zoom = o.zoom || 1;
                    delete iter.opacity
                }
                function fn(el, p, v) {
                    for (var k in iter) {
                        if (iter.hasOwnProperty(k)) {
                            v = iter[k];
                            (p = styleProperty(k)) && digit.test(v) && !(p in unitless) && (v += px);
                            el.style[p] = setter(el, v)
                        }
                    }
                }
                return this.each(fn)
            },
            offset: function (x, y) {
                if (typeof x == "number" || typeof y == "number") {
                    return this.each(function (el) {
                        xy(el, x, y)
                    })
                }
                if (!this[0]) {
                    return {
                        top: 0,
                        left: 0,
                        height: 0,
                        width: 0
                    }
                }
                var el = this[0],
                    width = el.offsetWidth,
                    height = el.offsetHeight,
                    top = el.offsetTop,
                    left = el.offsetLeft;
                while (el = el.offsetParent) {
                    top = top + el.offsetTop;
                    left = left + el.offsetLeft;
                    if (el != document.body) {
                        top -= el.scrollTop;
                        left -= el.scrollLeft
                    }
                }
                return {
                    top: top,
                    left: left,
                    height: height,
                    width: width
                }
            },
            dim: function () {
                if (!this.length) {
                    return {
                        height: 0,
                        width: 0
                    }
                }
                var el = this[0],
                    orig = !el.offsetWidth && !el.offsetHeight ? function (t, s) {
                        s = {
                            position: el.style.position || "",
                            visibility: el.style.visibility || "",
                            display: el.style.display || ""
                        };
                        t.first()
                            .css({
                            position: "absolute",
                            visibility: "hidden",
                            display: "block"
                        });
                        return s
                    }(this) : null,
                    width = el.offsetWidth,
                    height = el.offsetHeight;
                orig && this.first()
                    .css(orig);
                return {
                    height: height,
                    width: width
                }
            },
            attr: function (k, v) {
                var el = this[0];
                if (typeof k != "string" && !(k instanceof String)) {
                    for (var n in k) {
                        k.hasOwnProperty(n) && this.attr(n, k[n])
                    }
                    return this
                }
                return typeof v == "undefined" ? !el ? null : specialAttributes.test(k) ? stateAttributes.test(k) && typeof el[k] == "string" ? true : el[k] : (k == "href" || k == "src") && features.hrefExtended ? el[getAttribute](k, 2) : el[getAttribute](k) : this.each(function (el) {
                    specialAttributes.test(k) ? (el[k] = setter(el, v)) : el[setAttribute](k, setter(el, v))
                })
            },
            removeAttr: function (k) {
                return this.each(function (el) {
                    stateAttributes.test(k) ? (el[k] = false) : el.removeAttribute(k)
                })
            },
            val: function (s) {
                return (typeof s == "string") ? this.attr("value", s) : this.length ? this[0].value : null
            },
            data: function (k, v) {
                var el = this[0],
                    uid, o, m;
                if (typeof v === "undefined") {
                    if (!el) {
                        return null
                    }
                    o = data(el);
                    if (typeof k === "undefined") {
                        each(el.attributes, function (a) {
                            (m = ("" + a.name)
                                .match(dattr)) && (o[camelize(m[1])] = dataValue(a.value))
                        });
                        return o
                    } else {
                        if (typeof o[k] === "undefined") {
                            o[k] = dataValue(this.attr("data-" + decamelize(k)))
                        }
                        return o[k]
                    }
                } else {
                    return this.each(function (el) {
                        data(el)[k] = v
                    })
                }
            },
            remove: function () {
                this.deepEach(clearData);
                return this.each(function (el) {
                    el[parentNode] && el[parentNode].removeChild(el)
                })
            },
            empty: function () {
                return this.each(function (el) {
                    deepEach(el.childNodes, clearData);
                    while (el.firstChild) {
                        el.removeChild(el.firstChild)
                    }
                })
            },
            detach: function () {
                return this.each(function (el) {
                    el[parentNode].removeChild(el)
                })
            },
            scrollTop: function (y) {
                return scroll.call(this, null, y, "y")
            },
            scrollLeft: function (x) {
                return scroll.call(this, x, null, "x")
            }
        };

        function normalize(node) {
            return typeof node == "string" ? bonzo.create(node) : isNode(node) ? [node] : node
        }
        function scroll(x, y, type) {
            var el = this[0];
            if (!el) {
                return this
            }
            if (x == null && y == null) {
                return (isBody(el) ? getWindowScroll() : {
                    x: el.scrollLeft,
                    y: el.scrollTop
                })[type]
            }
            if (isBody(el)) {
                win.scrollTo(x, y)
            } else {
                x != null && (el.scrollLeft = x);
                y != null && (el.scrollTop = y)
            }
            return this
        }
        function isBody(element) {
            return element === win || (/^(?:body|html)$/i)
                .test(element.tagName)
        }
        function getWindowScroll() {
            return {
                x: win.pageXOffset || html.scrollLeft,
                y: win.pageYOffset || html.scrollTop
            }
        }
        function bonzo(els, host) {
            return new Bonzo(els, host)
        }
        bonzo.setQueryEngine = function (q) {
            query = q;
            delete bonzo.setQueryEngine
        };
        bonzo.aug = function (o, target) {
            for (var k in o) {
                o.hasOwnProperty(k) && ((target || Bonzo.prototype)[k] = o[k])
            }
        };
        bonzo.create = function (node) {
            return typeof node == "string" && node !== "" ? function () {
                var tag = /^\s*<([^\s>]+)/.exec(node),
                    el = doc.createElement("div"),
                    els = [],
                    p = tag ? tagMap[tag[1].toLowerCase()] : null,
                    dep = p ? p[2] + 1 : 1,
                    ns = p && p[3],
                    pn = parentNode,
                    tb = features.autoTbody && p && p[0] == "<table>" && !(/<tbody/i)
                        .test(node);
                el.innerHTML = p ? (p[0] + node + p[1]) : node;
                while (dep--) {
                    el = el.firstChild
                }
                if (ns && el && el.nodeType !== 1) {
                    el = el.nextSibling
                }
                do {
                    if ((!tag || el.nodeType == 1) && (!tb || el.tagName.toLowerCase() != "tbody")) {
                        els.push(el)
                    }
                } while (el = el.nextSibling);
                each(els, function (el) {
                    el[pn] && el[pn].removeChild(el)
                });
                return els
            }() : isNode(node) ? [node.cloneNode(true)] : []
        };
        bonzo.doc = function () {
            var vp = bonzo.viewport();
            return {
                width: Math.max(doc.body.scrollWidth, html.scrollWidth, vp.width),
                height: Math.max(doc.body.scrollHeight, html.scrollHeight, vp.height)
            }
        };
        bonzo.firstChild = function (el) {
            for (var c = el.childNodes, i = 0, j = (c && c.length) || 0, e; i < j; i++) {
                if (c[i].nodeType === 1) {
                    e = c[j = i]
                }
            }
            return e
        };
        bonzo.viewport = function () {
            return {
                width: ie ? html.clientWidth : self.innerWidth,
                height: ie ? html.clientHeight : self.innerHeight
            }
        };
        bonzo.isAncestor = "compareDocumentPosition" in html ? function (container, element) {
            return (container.compareDocumentPosition(element) & 16) == 16
        } : "contains" in html ? function (container, element) {
            return container !== element && container.contains(element)
        } : function (container, element) {
            while (element = element[parentNode]) {
                if (element === container) {
                    return true
                }
            }
            return false
        };
        return bonzo
    }, this);
    bcn.bonzo = context.bonzo;
    bcn.$ = function (selector) {
        return bcn.bonzo(bcn.query(selector))
    };
    bcn.bonzo.setQueryEngine(bcn.query);
    context.bonzo = null;
    bcn.bonzo.aug({
        children: function () {
            var i, el, r = [];
            uniq = function (ar) {
                var r = [],
                    i = 0,
                    j = 0,
                    k, item, inIt;
                for (; item = ar[i]; ++i) {
                    inIt = false;
                    for (k = 0; k < r.length; ++k) {
                        if (r[k] === item) {
                            inIt = true;
                            break
                        }
                    }
                    if (!inIt) {
                        r[j++] = item
                    }
                }
                return r
            };
            for (i = 0, l = this.length; i < l; i++) {
                if (!(el = bcn.bonzo.firstChild(this[i]))) {
                    continue
                }
                r.push(el);
                while (el = el.nextSibling) {
                    el.nodeType == 1 && r.push(el)
                }
            }
            return bcn.$(uniq(r))
        }
    });
    /*!
     * Reqwest! A general purpose XHR connection manager
     * (c) Dustin Diaz 2011
     * https://github.com/ded/reqwest
     * license MIT
     */! function (name, definition) {
        if (typeof module != "undefined") {
            module.exports = definition()
        } else {
            if (typeof define == "function" && define.amd) {
                define(name, definition)
            } else {
                this[name] = definition()
            }
        }
    }("reqwest", function () {
        var win = window,
            doc = document,
            twoHundo = /^20\d$/,
            byTag = "getElementsByTagName",
            readyState = "readyState",
            contentType = "Content-Type",
            requestedWith = "X-Requested-With",
            head = doc[byTag]("head")[0],
            uniqid = 0,
            lastValue, xmlHttpRequest = "XMLHttpRequest",
            isArray = typeof Array.isArray == "function" ? Array.isArray : function (a) {
                return a instanceof Array
            }, defaultHeaders = {
                contentType: "application/x-www-form-urlencoded",
                accept: {
                    "*": "text/javascript, text/html, application/xml, text/xml, */*",
                    xml: "application/xml, text/xml",
                    html: "text/html",
                    text: "text/plain",
                    json: "application/json, text/javascript",
                    js: "application/javascript, text/javascript"
                },
                requestedWith: xmlHttpRequest
            }, xhr = win[xmlHttpRequest] ? function () {
                return new XMLHttpRequest()
            } : function () {
                return new ActiveXObject("Microsoft.XMLHTTP")
            };

        function handleReadyState(o, success, error) {
            return function () {
                if (o && o[readyState] == 4) {
                    if (twoHundo.test(o.status)) {
                        success(o)
                    } else {
                        error(o)
                    }
                }
            }
        }
        function setHeaders(http, o) {
            var headers = o.headers || {}, h;
            headers.Accept = headers.Accept || defaultHeaders.accept[o.type] || defaultHeaders.accept["*"];
            if (!o.crossOrigin && !headers[requestedWith]) {
                headers[requestedWith] = defaultHeaders.requestedWith
            }
            if (!headers[contentType]) {
                headers[contentType] = o.contentType || defaultHeaders.contentType
            }
            for (h in headers) {
                headers.hasOwnProperty(h) && http.setRequestHeader(h, headers[h])
            }
        }
        function generalCallback(data) {
            lastValue = data
        }
        function urlappend(url, s) {
            return url + (/\?/.test(url) ? "&" : "?") + s
        }
        function handleJsonp(o, fn, err, url) {
            var reqId = uniqid++,
                cbkey = o.jsonpCallback || "callback",
                cbval = o.jsonpCallbackName || ("reqwest_" + reqId),
                cbreg = new RegExp("((^|\\?|&)" + cbkey + ")=([^&]+)"),
                match = url.match(cbreg),
                script = doc.createElement("script"),
                loaded = 0;
            if (match) {
                if (match[3] === "?") {
                    url = url.replace(cbreg, "$1=" + cbval)
                } else {
                    cbval = match[3]
                }
            } else {
                url = urlappend(url, cbkey + "=" + cbval)
            }
            win[cbval] = generalCallback;
            script.type = "text/javascript";
            script.src = url;
            script.async = true;
            if (typeof script.onreadystatechange !== "undefined") {
                script.event = "onclick";
                script.htmlFor = script.id = "_reqwest_" + reqId
            }
            script.onload = script.onreadystatechange = function () {
                if ((script[readyState] && script[readyState] !== "complete" && script[readyState] !== "loaded") || loaded) {
                    return false
                }
                script.onload = script.onreadystatechange = null;
                script.onclick && script.onclick();
                o.success && o.success(lastValue);
                lastValue = undefined;
                head.removeChild(script);
                loaded = 1
            };
            head.appendChild(script)
        }
        function getRequest(o, fn, err) {
            var method = (o.method || "GET")
                .toUpperCase(),
                url = typeof o === "string" ? o : o.url,
                data = (o.processData !== false && o.data && typeof o.data !== "string") ? reqwest.toQueryString(o.data) : (o.data || null),
                http;
            if ((o.type == "jsonp" || method == "GET") && data) {
                url = urlappend(url, data);
                data = null
            }
            if (o.type == "jsonp") {
                return handleJsonp(o, fn, err, url)
            }
            http = xhr();
            http.open(method, url, true);
            setHeaders(http, o);
            http.onreadystatechange = handleReadyState(http, fn, err);
            o.before && o.before(http);
            http.send(data);
            return http
        }
        function Reqwest(o, fn) {
            this.o = o;
            this.fn = fn;
            init.apply(this, arguments)
        }
        function setType(url) {
            var m = url.match(/\.(json|jsonp|html|xml)(\?|$)/);
            return m ? m[1] : "js"
        }
        function init(o, fn) {
            this.url = typeof o == "string" ? o : o.url;
            this.timeout = null;
            var type = o.type || setType(this.url),
                self = this;
            fn = fn || function () {};
            if (o.timeout) {
                this.timeout = setTimeout(function () {
                    self.abort()
                }, o.timeout)
            }
            function complete(resp) {
                o.timeout && clearTimeout(self.timeout);
                self.timeout = null;
                o.complete && o.complete(resp)
            }
            function success(resp) {
                var r = resp.responseText;
                if (r) {
                    switch (type) {
                        case "json":
                            try {
                                resp = win.JSON ? win.JSON.parse(r) : eval("(" + r + ")")
                            } catch (err) {
                                return error(resp, "Could not parse JSON in response", err)
                            }
                            break;
                        case "js":
                            resp = eval(r);
                            break;
                        case "html":
                            resp = r;
                            break
                    }
                }
                fn(resp);
                o.success && o.success(resp);
                complete(resp)
            }
            function error(resp, msg, t) {
                o.error && o.error(resp, msg, t);
                complete(resp)
            }
            this.request = getRequest(o, success, error)
        }
        Reqwest.prototype = {
            abort: function () {
                this.request.abort()
            },
            retry: function () {
                init.call(this, this.o, this.fn)
            }
        };

        function reqwest(o, fn) {
            return new Reqwest(o, fn)
        }
        function normalize(s) {
            return s ? s.replace(/\r?\n/g, "\r\n") : ""
        }
        function serial(el, cb) {
            var n = el.name,
                t = el.tagName.toLowerCase(),
                optCb = function (o) {
                    if (o && !o.disabled) {
                        cb(n, normalize(o.attributes.value && o.attributes.value.specified ? o.value : o.text))
                    }
                };
            if (el.disabled || !n) {
                return
            }
            switch (t) {
                case "input":
                    if (!/reset|button|image|file/i.test(el.type)) {
                        var ch = /checkbox/i.test(el.type),
                            ra = /radio/i.test(el.type),
                            val = el.value;
                        (!(ch || ra) || el.checked) && cb(n, normalize(ch && val === "" ? "on" : val))
                    }
                    break;
                case "textarea":
                    cb(n, normalize(el.value));
                    break;
                case "select":
                    if (el.type.toLowerCase() === "select-one") {
                        optCb(el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null)
                    } else {
                        for (var i = 0; el.length && i < el.length; i++) {
                            el.options[i].selected && optCb(el.options[i])
                        }
                    }
                    break
            }
        }
        function eachFormElement() {
            var cb = this,
                e, i, j, serializeSubtags = function (e, tags) {
                    for (var i = 0; i < tags.length; i++) {
                        var fa = e[byTag](tags[i]);
                        for (j = 0; j < fa.length; j++) {
                            serial(fa[j], cb)
                        }
                    }
                };
            for (i = 0; i < arguments.length; i++) {
                e = arguments[i];
                if (/input|select|textarea/i.test(e.tagName)) {
                    serial(e, cb)
                }
                serializeSubtags(e, ["input", "select", "textarea"])
            }
        }
        function serializeQueryString() {
            return reqwest.toQueryString(reqwest.serializeArray.apply(null, arguments))
        }
        function serializeHash() {
            var hash = {};
            eachFormElement.apply(function (name, value) {
                if (name in hash) {
                    hash[name] && !isArray(hash[name]) && (hash[name] = [hash[name]]);
                    hash[name].push(value)
                } else {
                    hash[name] = value
                }
            }, arguments);
            return hash
        }
        reqwest.serializeArray = function () {
            var arr = [];
            eachFormElement.apply(function (name, value) {
                arr.push({
                    name: name,
                    value: value
                })
            }, arguments);
            return arr
        };
        reqwest.serialize = function () {
            if (arguments.length === 0) {
                return ""
            }
            var opt, fn, args = Array.prototype.slice.call(arguments, 0);
            opt = args.pop();
            opt && opt.nodeType && args.push(opt) && (opt = null);
            opt && (opt = opt.type);
            if (opt == "map") {
                fn = serializeHash
            } else {
                if (opt == "array") {
                    fn = reqwest.serializeArray
                } else {
                    fn = serializeQueryString
                }
            }
            return fn.apply(null, args)
        };
        reqwest.toQueryString = function (o) {
            var qs = "",
                i, enc = encodeURIComponent,
                push = function (k, v) {
                    qs += enc(k) + "=" + enc(v) + "&"
                };
            if (isArray(o)) {
                for (i = 0; o && i < o.length; i++) {
                    push(o[i].name, o[i].value)
                }
            } else {
                for (var k in o) {
                    if (!Object.hasOwnProperty.call(o, k)) {
                        continue
                    }
                    var v = o[k];
                    if (isArray(v)) {
                        for (i = 0; i < v.length; i++) {
                            push(k, v[i])
                        }
                    } else {
                        push(k, o[k])
                    }
                }
            }
            return qs.replace(/&$/, "")
                .replace(/%20/g, "+")
        };
        reqwest.compat = function (o, fn) {
            if (o) {
                o.type && (o.method = o.type) && delete o.type;
                o.dataType && (o.type = o.dataType);
                o.jsonpCallback && (o.jsonpCallbackName = o.jsonpCallback) && delete o.jsonpCallback;
                o.jsonp && (o.jsonpCallback = o.jsonp)
            }
            return new Reqwest(o, fn)
        };
        return reqwest
    });
    bcn.ajax = context.reqwest;
    context.reqwest = null;
    /*!
     * bean.js - copyright Jacob Thornton 2011
     * https://github.com/fat/bean
     * MIT License
     * special thanks to:
     * dean edwards: http://dean.edwards.name/
     * dperini: https://github.com/dperini/nwevents
     * the entire mootools team: github.com/mootools/mootools-core
     */! function (name, context, definition) {
        if (typeof module !== "undefined") {
            module.exports = definition(name, context)
        } else {
            if (typeof define === "function" && typeof define.amd === "object") {
                define(definition)
            } else {
                context[name] = definition(name, context)
            }
        }
    }("bean", this, function (name, context) {
        var win = window,
            old = context[name],
            overOut = /over|out/,
            namespaceRegex = /[^\.]*(?=\..*)\.|.*/,
            nameRegex = /\..*/,
            addEvent = "addEventListener",
            attachEvent = "attachEvent",
            removeEvent = "removeEventListener",
            detachEvent = "detachEvent",
            ownerDocument = "ownerDocument",
            targetS = "target",
            qSA = "querySelectorAll",
            doc = document || {}, root = doc.documentElement || {}, W3C_MODEL = root[addEvent],
            eventSupport = W3C_MODEL ? addEvent : attachEvent,
            slice = Array.prototype.slice,
            mouseTypeRegex = /click|mouse(?!(.*wheel|scroll))|menu|drag|drop/i,
            mouseWheelTypeRegex = /mouse.*(wheel|scroll)/i,
            textTypeRegex = /^text/i,
            touchTypeRegex = /^touch|^gesture/i,
            ONE = {}, nativeEvents = (function (hash, events, i) {
                for (i = 0; i < events.length; i++) {
                    hash[events[i]] = 1
                }
                return hash
            }({}, ("click dblclick mouseup mousedown contextmenu mousewheel mousemultiwheel DOMMouseScroll mouseover mouseout mousemove selectstart selectend keydown keypress keyup orientationchange focus blur change reset select submit load unload beforeunload resize move DOMContentLoaded readystatechange message error abort scroll " + (W3C_MODEL ? "show input invalid touchstart touchmove touchend touchcancel gesturestart gesturechange gestureend readystatechange pageshow pagehide popstate hashchange offline online afterprint beforeprint dragstart dragenter dragover dragleave drag drop dragend loadstart progress suspend emptied stalled loadmetadata loadeddata canplay canplaythrough playing waiting seeking seeked ended durationchange timeupdate play pause ratechange volumechange cuechange checking noupdate downloading cached updateready obsolete " : ""))
                .split(" "))),
            customEvents = (function () {
                var cdp = "compareDocumentPosition",
                    isAncestor = cdp in root ? function (element, container) {
                        return container[cdp] && (container[cdp](element) & 16) === 16
                    } : "contains" in root ? function (element, container) {
                        container = container.nodeType === 9 || container === window ? root : container;
                        return container !== element && container.contains(element)
                    } : function (element, container) {
                        while (element = element.parentNode) {
                            if (element === container) {
                                return 1
                            }
                        }
                        return 0
                    };

                function check(event) {
                    var related = event.relatedTarget;
                    return !related ? related === null : (related !== this && related.prefix !== "xul" && !/document/.test(this.toString()) && !isAncestor(related, this))
                }
                return {
                    mouseenter: {
                        base: "mouseover",
                        condition: check
                    },
                    mouseleave: {
                        base: "mouseout",
                        condition: check
                    },
                    mousewheel: {
                        base: /Firefox/.test(navigator.userAgent) ? "DOMMouseScroll" : "mousewheel"
                    }
                }
            }()),
            fixEvent = (function () {
                var commonProps = "altKey attrChange attrName bubbles cancelable ctrlKey currentTarget detail eventPhase getModifierState isTrusted metaKey relatedNode relatedTarget shiftKey srcElement target timeStamp type view which".split(" "),
                    mouseProps = commonProps.concat("button buttons clientX clientY dataTransfer fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" ")),
                    mouseWheelProps = mouseProps.concat("wheelDelta wheelDeltaX wheelDeltaY wheelDeltaZ axis".split(" ")),
                    keyProps = commonProps.concat("char charCode key keyCode keyIdentifier keyLocation".split(" ")),
                    textProps = commonProps.concat(["data"]),
                    touchProps = commonProps.concat("touches targetTouches changedTouches scale rotation".split(" ")),
                    messageProps = commonProps.concat(["data", "origin", "source"]),
                    preventDefault = "preventDefault",
                    createPreventDefault = function (event) {
                        return function () {
                            if (event[preventDefault]) {
                                event[preventDefault]()
                            } else {
                                event.returnValue = false
                            }
                        }
                    }, stopPropagation = "stopPropagation",
                    createStopPropagation = function (event) {
                        return function () {
                            if (event[stopPropagation]) {
                                event[stopPropagation]()
                            } else {
                                event.cancelBubble = true
                            }
                        }
                    }, createStop = function (synEvent) {
                        return function () {
                            synEvent[preventDefault]();
                            synEvent[stopPropagation]();
                            synEvent.stopped = true
                        }
                    }, copyProps = function (event, result, props) {
                        var i, p;
                        for (i = props.length; i--;) {
                            p = props[i];
                            if (!(p in result) && p in event) {
                                result[p] = event[p]
                            }
                        }
                    };
                return function (event, isNative) {
                    var result = {
                        originalEvent: event,
                        isNative: isNative
                    };
                    if (!event) {
                        return result
                    }
                    var props, type = event.type,
                        target = event[targetS] || event.srcElement;
                    result[preventDefault] = createPreventDefault(event);
                    result[stopPropagation] = createStopPropagation(event);
                    result.stop = createStop(result);
                    result[targetS] = target && target.nodeType === 3 ? target.parentNode : target;
                    if (isNative) {
                        if (type.indexOf("key") !== -1) {
                            props = keyProps;
                            result.keyCode = event.keyCode || event.which
                        } else {
                            if (mouseTypeRegex.test(type)) {
                                props = mouseProps;
                                result.rightClick = event.which === 3 || event.button === 2;
                                result.pos = {
                                    x: 0,
                                    y: 0
                                };
                                if (event.pageX || event.pageY) {
                                    result.clientX = event.pageX;
                                    result.clientY = event.pageY
                                } else {
                                    if (event.clientX || event.clientY) {
                                        result.clientX = event.clientX + doc.body.scrollLeft + root.scrollLeft;
                                        result.clientY = event.clientY + doc.body.scrollTop + root.scrollTop
                                    }
                                }
                                if (overOut.test(type)) {
                                    result.relatedTarget = event.relatedTarget || event[(type === "mouseover" ? "from" : "to") + "Element"]
                                }
                            } else {
                                if (touchTypeRegex.test(type)) {
                                    props = touchProps
                                } else {
                                    if (mouseWheelTypeRegex.test(type)) {
                                        props = mouseWheelProps
                                    } else {
                                        if (textTypeRegex.test(type)) {
                                            props = textProps
                                        } else {
                                            if (type === "message") {
                                                props = messageProps
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        copyProps(event, result, props || commonProps)
                    }
                    return result
                }
            }()),
            targetElement = function (element, isNative) {
                return !W3C_MODEL && !isNative && (element === doc || element === win) ? root : element
            }, RegEntry = (function () {
                function entry(element, type, handler, original, namespaces) {
                    var isNative = this.isNative = nativeEvents[type] && element[eventSupport];
                    this.element = element;
                    this.type = type;
                    this.handler = handler;
                    this.original = original;
                    this.namespaces = namespaces;
                    this.custom = customEvents[type];
                    this.eventType = W3C_MODEL || isNative ? type : "propertychange";
                    this.customType = !W3C_MODEL && !isNative && type;
                    this[targetS] = targetElement(element, isNative);
                    this[eventSupport] = this[targetS][eventSupport]
                }
                entry.prototype = {
                    inNamespaces: function (checkNamespaces) {
                        var i, j;
                        if (!checkNamespaces) {
                            return true
                        }
                        if (!this.namespaces) {
                            return false
                        }
                        for (i = checkNamespaces.length; i--;) {
                            for (j = this.namespaces.length; j--;) {
                                if (checkNamespaces[i] === this.namespaces[j]) {
                                    return true
                                }
                            }
                        }
                        return false
                    },
                    matches: function (checkElement, checkOriginal, checkHandler) {
                        return this.element === checkElement && (!checkOriginal || this.original === checkOriginal) && (!checkHandler || this.handler === checkHandler)
                    }
                };
                return entry
            }()),
            registry = (function () {
                var map = {}, forAll = function (element, type, original, handler, fn) {
                    if (!type || type === "*") {
                        for (var t in map) {
                            if (t.charAt(0) === "$") {
                                forAll(element, t.substr(1), original, handler, fn)
                            }
                        }
                    } else {
                        var i = 0,
                            l, list = map["$" + type],
                            all = element === "*";
                        if (!list) {
                            return
                        }
                        for (l = list.length; i < l; i++) {
                            if (all || list[i].matches(element, original, handler)) {
                                if (!fn(list[i], list, i, type)) {
                                    return
                                }
                            }
                        }
                    }
                }, has = function (element, type, original) {
                    var i, list = map["$" + type];
                    if (list) {
                        for (i = list.length; i--;) {
                            if (list[i].matches(element, original, null)) {
                                return true
                            }
                        }
                    }
                    return false
                }, get = function (element, type, original) {
                    var entries = [];
                    forAll(element, type, original, null, function (entry) {
                        return entries.push(entry)
                    });
                    return entries
                }, put = function (entry) {
                    (map["$" + entry.type] || (map["$" + entry.type] = []))
                        .push(entry);
                    return entry
                }, del = function (entry) {
                    forAll(entry.element, entry.type, null, entry.handler, function (entry, list, i) {
                        list.splice(i, 1);
                        if (list.length === 0) {
                            delete map["$" + entry.type]
                        }
                        return false
                    })
                }, entries = function () {
                    var t, entries = [];
                    for (t in map) {
                        if (t.charAt(0) === "$") {
                            entries = entries.concat(map[t])
                        }
                    }
                    return entries
                };
                return {
                    has: has,
                    get: get,
                    put: put,
                    del: del,
                    entries: entries
                }
            }()),
            selectorEngine = doc[qSA] ? function (s, r) {
                return r[qSA](s)
            } : function () {
                throw new Error("Bean: No selector engine installed")
            }, setSelectorEngine = function (e) {
                selectorEngine = e
            }, listener = W3C_MODEL ? function (element, type, fn, add) {
                element[add ? addEvent : removeEvent](type, fn, false)
            } : function (element, type, fn, add, custom) {
                if (custom && add && element["_on" + custom] === null) {
                    element["_on" + custom] = 0
                }
                element[add ? attachEvent : detachEvent]("on" + type, fn)
            }, nativeHandler = function (element, fn, args) {
                var beanDel = fn.__beanDel,
                    handler = function (event) {
                        event = fixEvent(event || ((this[ownerDocument] || this.document || this)
                            .parentWindow || win)
                            .event, true);
                        if (beanDel) {
                            event.currentTarget = beanDel.ft(event[targetS], element)
                        }
                        return fn.apply(element, [event].concat(args))
                    };
                handler.__beanDel = beanDel;
                return handler
            }, customHandler = function (element, fn, type, condition, args, isNative) {
                var beanDel = fn.__beanDel,
                    handler = function (event) {
                        var target = beanDel ? beanDel.ft(event[targetS], element) : this;
                        if (condition ? condition.apply(target, arguments) : W3C_MODEL ? true : event && event.propertyName === "_on" + type || !event) {
                            if (event) {
                                event = fixEvent(event || ((this[ownerDocument] || this.document || this)
                                    .parentWindow || win)
                                    .event, isNative);
                                event.currentTarget = target
                            }
                            fn.apply(element, event && (!args || args.length === 0) ? arguments : slice.call(arguments, event ? 0 : 1)
                                .concat(args))
                        }
                    };
                handler.__beanDel = beanDel;
                return handler
            }, once = function (rm, element, type, fn, originalFn) {
                return function () {
                    rm(element, type, originalFn);
                    fn.apply(this, arguments)
                }
            }, removeListener = function (element, orgType, handler, namespaces) {
                var i, l, entry, type = (orgType && orgType.replace(nameRegex, "")),
                    handlers = registry.get(element, type, handler);
                for (i = 0, l = handlers.length; i < l; i++) {
                    if (handlers[i].inNamespaces(namespaces)) {
                        if ((entry = handlers[i])[eventSupport]) {
                            listener(entry[targetS], entry.eventType, entry.handler, false, entry.type)
                        }
                        registry.del(entry)
                    }
                }
            }, addListener = function (element, orgType, fn, originalFn, args) {
                var entry, type = orgType.replace(nameRegex, ""),
                    namespaces = orgType.replace(namespaceRegex, "")
                        .split(".");
                if (registry.has(element, type, fn)) {
                    return element
                }
                if (type === "unload") {
                    fn = once(removeListener, element, type, fn, originalFn)
                }
                if (customEvents[type]) {
                    if (customEvents[type].condition) {
                        fn = customHandler(element, fn, type, customEvents[type].condition, args, true)
                    }
                    type = customEvents[type].base || type
                }
                entry = registry.put(new RegEntry(element, type, fn, originalFn, namespaces[0] && namespaces));
                entry.handler = entry.isNative ? nativeHandler(element, entry.handler, args) : customHandler(element, entry.handler, type, false, args, false);
                if (entry[eventSupport]) {
                    listener(entry[targetS], entry.eventType, entry.handler, true, entry.customType)
                }
            }, del = function (selector, fn, $) {
                var findTarget = function (target, root) {
                    var i, array = typeof selector === "string" ? $(selector, root) : selector;
                    for (; target && target !== root; target = target.parentNode) {
                        for (i = array.length; i--;) {
                            if (array[i] === target) {
                                return target
                            }
                        }
                    }
                }, handler = function (e) {
                    var match = findTarget(e[targetS], this);
                    match && fn.apply(match, arguments)
                };
                handler.__beanDel = {
                    ft: findTarget,
                    selector: selector,
                    $: $
                };
                return handler
            }, remove = function (element, typeSpec, fn) {
                var k, type, namespaces, i, rm = removeListener,
                    isString = typeSpec && typeof typeSpec === "string";
                if (isString && typeSpec.indexOf(" ") > 0) {
                    typeSpec = typeSpec.split(" ");
                    for (i = typeSpec.length; i--;) {
                        remove(element, typeSpec[i], fn)
                    }
                    return element
                }
                type = isString && typeSpec.replace(nameRegex, "");
                if (type && customEvents[type]) {
                    type = customEvents[type].type
                }
                if (!typeSpec || isString) {
                    if (namespaces = isString && typeSpec.replace(namespaceRegex, "")) {
                        namespaces = namespaces.split(".")
                    }
                    rm(element, type, fn, namespaces)
                } else {
                    if (typeof typeSpec === "function") {
                        rm(element, null, typeSpec)
                    } else {
                        for (k in typeSpec) {
                            if (typeSpec.hasOwnProperty(k)) {
                                remove(element, k, typeSpec[k])
                            }
                        }
                    }
                }
                return element
            }, add = function (element, events, fn, delfn, $) {
                var type, types, i, args, originalFn = fn,
                    isDel = fn && typeof fn === "string";
                if (events && !fn && typeof events === "object") {
                    for (type in events) {
                        if (events.hasOwnProperty(type)) {
                            add.apply(this, [element, type, events[type]])
                        }
                    }
                } else {
                    args = arguments.length > 3 ? slice.call(arguments, 3) : [];
                    types = (isDel ? fn : events)
                        .split(" ");
                    isDel && (fn = del(events, (originalFn = delfn), $ || selectorEngine)) && (args = slice.call(args, 1));
                    this === ONE && (fn = once(remove, element, events, fn, originalFn));
                    for (i = types.length; i--;) {
                        addListener(element, types[i], fn, originalFn, args)
                    }
                }
                return element
            }, one = function () {
                return add.apply(ONE, arguments)
            }, fireListener = W3C_MODEL ? function (isNative, type, element) {
                var evt = doc.createEvent(isNative ? "HTMLEvents" : "UIEvents");
                evt[isNative ? "initEvent" : "initUIEvent"](type, true, true, win, 1);
                element.dispatchEvent(evt)
            } : function (isNative, type, element) {
                element = targetElement(element, isNative);
                isNative ? element.fireEvent("on" + type, doc.createEventObject()) : element["_on" + type]++
            }, fire = function (element, type, args) {
                var i, j, l, names, handlers, types = type.split(" ");
                for (i = types.length; i--;) {
                    type = types[i].replace(nameRegex, "");
                    if (names = types[i].replace(namespaceRegex, "")) {
                        names = names.split(".")
                    }
                    if (!names && !args && element[eventSupport]) {
                        fireListener(nativeEvents[type], type, element)
                    } else {
                        handlers = registry.get(element, type);
                        args = [false].concat(args);
                        for (j = 0, l = handlers.length; j < l; j++) {
                            if (handlers[j].inNamespaces(names)) {
                                handlers[j].handler.apply(element, args)
                            }
                        }
                    }
                }
                return element
            }, clone = function (element, from, type) {
                var i = 0,
                    handlers = registry.get(from, type),
                    l = handlers.length,
                    args, beanDel;
                for (; i < l; i++) {
                    if (handlers[i].original) {
                        beanDel = handlers[i].handler.__beanDel;
                        if (beanDel) {
                            args = [element, beanDel.selector, handlers[i].type, handlers[i].original, beanDel.$]
                        } else {
                            args = [element, handlers[i].type, handlers[i].original]
                        }
                        add.apply(null, args)
                    }
                }
                return element
            }, bean = {
                add: add,
                one: one,
                remove: remove,
                clone: clone,
                fire: fire,
                setSelectorEngine: setSelectorEngine,
                noConflict: function () {
                    context[name] = old;
                    return this
                }
            };
        if (win[attachEvent]) {
            var cleanup = function () {
                var i, entries = registry.entries();
                for (i in entries) {
                    if (entries[i].type && entries[i].type !== "unload") {
                        remove(entries[i].element, entries[i].type)
                    }
                }
                win[detachEvent]("onunload", cleanup);
                win.CollectGarbage && win.CollectGarbage()
            };
            win[attachEvent]("onunload", cleanup)
        }
        return bean
    });
    bcn.bean = context.bean;
    bcn.bean.setSelectorEngine(bcn.qwery);
    context.bean = null;
    bcn.lang = bcn.$("html")
        .attr("lang") || bcn.$("html")
        .attr("xml:lang") || "ca";
    bcn.onload = function (fn) {
        var old = context.onload;
        if (typeof window.onload !== "function") {
            context.onload = fn
        } else {
            context.onload = function () {
                if (old) {
                    try {
                        old()
                    } catch (e) {}
                }
                fn()
            }
        }
    };
    bcn.brand = function () {
        var background = false,
            a_more = '<a href="#">#{text}</a>',
            banner = function () {
                var body = bcn.$("body"),
                    brand_box = bcn.$("#brand"),
                    logotype = bcn.$("#brand .logotype a"),
                    social = bcn.$("#brand .social a"),
                    languages = bcn.$("#brand .languages a"),
                    main_box = bcn.$("#brand .main"),
                    search = bcn.$("#brand #brand-search")
                        .first(),
                    llima = {
                        show: function (index) {
                            var index = index || parseInt(main_box.css("background-position")
                                .match(/^(-?\d+)p/)[1], 10),
                                factor = 5;
                            if (index < 0) {
                                index = 0
                            }
                            if (index < 100) {
                                main_box.css("background-position", (index + factor) + "px 0");
                                context.setTimeout(function () {
                                    llima.show(index + factor)
                                }, 1)
                            }
                        },
                        hide: function (index) {
                            var index = index || parseInt(main_box.css("background-position")
                                .match(/^(-?\d+)p/)[1], 10),
                                factor = 5;
                            if (index > -268) {
                                main_box.css("background-position", (index - factor) + "px 0");
                                context.setTimeout(function () {
                                    llima.hide(index - factor)
                                }, 1)
                            }
                        }
                    }, title = (function () {
                        var enhance = function (title) {
                            var template = '<span class="title"><span class="arrow"></span><span>#{title}</span></span>';
                            return bcn.interpolation(template, {
                                title: title
                            })
                        }, node, child, title, width;
                        return {
                            show: function (node, deviation, last) {
                                var deviation = deviation || 0;
                                child = node.children()
                                    .last();
                                if (child.hasClass("title")) {
                                    child.show()
                                } else {
                                    title = node.attr("title");
                                    node.attr("title", "");
                                    node.append(enhance(title));
                                    child = node.children()
                                        .last();
                                    width = child.children()
                                        .last()
                                        .css("width");
                                    width = (width === "auto") ? "84" : width;
                                    if (last) {
                                        child.css("right", "0px");
                                        child.children()
                                            .first()
                                            .css("margin-right", "14px")
                                    } else {
                                        child.css("left", "-" + (parseInt(width, 10) - deviation) / 2 + "px")
                                    }
                                }
                            },
                            hide: function (node) {
                                child = node.children()
                                    .last();
                                if (child.hasClass("title")) {
                                    child.hide()
                                }
                            }
                        }
                    }());
                if (brand_box.length !== 0) {
                    main_box.css("background-position", "-268px 0")
                }
                logotype.first()
                    .each(function () {
                    bcn.bean.add(logotype[0], {
                        "mouseover focus": function (e) {
                            llima.show();
                            e.stop()
                        },
                        "mouseout blur": function (e) {
                            llima.hide();
                            e.stop()
                        },
                        click: function (e) {
                            llima.hide(-200)
                        }
                    })
                });
                search.each(function () {
                    var that = this;
                    bcn.bean.add(this, {
                        focus: function (e) {
                            var current = bcn.$(that);
                            bcn.$(current.previous()[0])
                                .css("top", "-500px");
                            e.stop()
                        },
                        blur: function (e) {
                            var current = bcn.$(that);
                            if (current.attr("value") === "") {
                                bcn.$(current.previous()[0])
                                    .css("top", "0")
                            }
                            e.stop()
                        }
                    })
                });
                social.each(function () {
                    var that = this;
                    bcn.bean.add(this, {
                        "mouseover focus": function (e) {
                            var e = e || context.event,
                                current = bcn.$(that),
                                img = current.children()
                                    .first(),
                                img_src = img.attr("src")
                                    .replace(/-bw/, "");
                            img.attr("src", img_src);
                            title.show(current, 8);
                            e.stop()
                        },
                        "mouseout blur": function (e) {
                            var e = e || context.event,
                                current = bcn.$(that),
                                img = current.children()
                                    .first(),
                                img_src = img.attr("src")
                                    .replace(/([^w])(\.png)$/, "$1-bw$2");
                            img.attr("src", img_src);
                            title.hide(current);
                            e.stop()
                        }
                    })
                });
                languages.each(function () {
                    var that = this;
                    bcn.bean.add(this, {
                        "mouseover focus": function (e) {
                            var e = e || context.event,
                                current = bcn.$(that),
                                last = (languages.last()
                                    .attr("href") === current.attr("href") && main_box.hasClass("fullscreen"));
                            if (bcn.$(current.parent())
                                .next()
                                .length === 0 && current.offset()
                                .left < 995) {
                                last = true
                            }
                            title.show(current, 16, last);
                            e.stop()
                        },
                        "mouseout blur": function (e) {
                            var e = e || context.event,
                                current = bcn.$(that);
                            title.hide(current);
                            e.stop()
                        }
                    })
                })
            };
        bcn.bean.add(document, "click", function (e) {
            var e = e || window.event,
                src = e.target || e.srcElement,
                more = bcn.$("#brand .options .more a")
                    .first();
            if (src === more[0]) {
                var body = bcn.$("body"),
                    brand_box = bcn.$("#brand"),
                    background_position = function () {
                        var y = body.css("background-position-y");
                        if (y === undefined) {
                            return body.css("background-position")
                        } else {
                            y = (y === "top") ? "0px" : y;
                            return body.css("background-position-x") + " " + y
                        }
                    }, change_position = function (n) {
                        var position = background_position()
                            .replace(/^(.+?)(0(?:%|em)|-?\d+(?:px|pt))$/, function (a, b, c) {
                            return b + " " + (parseInt(c.match(/\d+/)[0], 10) + n) + "px"
                        });
                        return position
                    };
                brand_box.toggleClass("collapsed");
                if (body.css("background-position") !== undefined || body.css("background-position-y") !== undefined) {
                    background = true
                }
                if (background && brand_box.hasClass("collapsed")) {
                    body.css("background-position", change_position(-28))
                } else {
                    if (background) {
                        body.css("background-position", change_position(28))
                    }
                }
                e.stop()
            }
        });
        bcn.onload(banner)
    };
    bcn.brand()
}(bcn, this));
(function (win, doc, undefined) {
    var settings, body, fakeBody, windowLoaded, head, docElem = doc.documentElement,
        testPass = false,
        mediaCookieA, mediaCookieB, toggledMedia = [];
    if (doc.getElementsByTagName) {
        head = doc.getElementsByTagName("head")[0] || docElem
    } else {
        head = docElem
    }
    win.enhance = function (options) {
        options = options || {};
        settings = {};
        for (var name in enhance.defaultSettings) {
            var option = options[name];
            settings[name] = option !== undefined ? option : enhance.defaultSettings[name]
        }
        for (var test in options.addTests) {
            settings.tests[test] = options.addTests[test]
        }
        if (docElem.className.indexOf(settings.testName) === -1) {
            docElem.className += " " + settings.testName
        }
        mediaCookieA = settings.testName + "-toggledmediaA";
        mediaCookieB = settings.testName + "-toggledmediaB";
        toggledMedia = [readCookie(mediaCookieA), readCookie(mediaCookieB)];
        setTimeout(function () {
            if (!testPass) {
                removeHTMLClass()
            }
        }, 3000);
        runTests();
        applyDocReadyHack();
        windowLoad(function () {
            windowLoaded = true
        })
    };
    enhance.defaultTests = {
        getById: function () {
            return !!doc.getElementById
        },
        getByTagName: function () {
            return !!doc.getElementsByTagName
        },
        createEl: function () {
            return !!doc.createElement
        },
        boxmodel: function () {
            var newDiv = doc.createElement("div");
            newDiv.style.cssText = "width: 1px; padding: 1px;";
            body.appendChild(newDiv);
            var divWidth = newDiv.offsetWidth;
            body.removeChild(newDiv);
            return divWidth === 3
        },
        position: function () {
            var newDiv = doc.createElement("div");
            newDiv.style.cssText = "position: absolute; left: 10px;";
            body.appendChild(newDiv);
            var divLeft = newDiv.offsetLeft;
            body.removeChild(newDiv);
            return divLeft === 10
        },
        floatClear: function () {
            var pass = false,
                newDiv = doc.createElement("div"),
                style = 'style="width: 5px; height: 5px; float: left;"';
            newDiv.innerHTML = "<div " + style + "></div><div " + style + "></div>";
            body.appendChild(newDiv);
            var childNodes = newDiv.childNodes,
                topA = childNodes[0].offsetTop,
                divB = childNodes[1],
                topB = divB.offsetTop;
            if (topA === topB) {
                divB.style.clear = "left";
                topB = divB.offsetTop;
                if (topA !== topB) {
                    pass = true
                }
            }
            body.removeChild(newDiv);
            return pass
        },
        heightOverflow: function () {
            var newDiv = doc.createElement("div");
            newDiv.innerHTML = '<div style="height: 10px;"></div>';
            newDiv.style.cssText = "overflow: hidden; height: 0;";
            body.appendChild(newDiv);
            var divHeight = newDiv.offsetHeight;
            body.removeChild(newDiv);
            return divHeight === 0
        },
        ajax: function () {
            var xmlhttp = false,
                index = -1,
                factory, XMLHttpFactories = [function () {
                    return new XMLHttpRequest()
                }, function () {
                    return new ActiveXObject("Msxml2.XMLHTTP")
                }, function () {
                    return new ActiveXObject("Msxml3.XMLHTTP")
                }, function () {
                    return new ActiveXObject("Microsoft.XMLHTTP")
                }];
            while ((factory = XMLHttpFactories[++index])) {
                try {
                    xmlhttp = factory()
                } catch (e) {
                    continue
                }
                break
            }
            return !!xmlhttp
        },
        resize: function () {
            return win.onresize != false
        },
        print: function () {
            return !!win.print
        }
    };
    enhance.defaultSettings = {
        testName: "enhanced",
        loadScripts: [],
        loadStyles: [],
        queueLoading: true,
        appendToggleLink: true,
        forcePassText: "View high-bandwidth version",
        forceFailText: "View low-bandwidth version",
        tests: enhance.defaultTests,
        addTests: {},
        alertOnFailure: false,
        onPass: function () {},
        onFail: function () {},
        onLoadError: addIncompleteClass,
        onScriptsLoaded: function () {}
    };

    function cookiesSupported() {
        return !!doc.cookie
    }
    enhance.cookiesSupported = cookiesSupported();

    function forceFail() {
        createCookie(settings.testName, "fail");
        win.location.reload()
    }
    if (enhance.cookiesSupported) {
        enhance.forceFail = forceFail
    }
    function forcePass() {
        createCookie(settings.testName, "pass");
        win.location.reload()
    }
    if (enhance.cookiesSupported) {
        enhance.forcePass = forcePass
    }
    function reTest() {
        eraseCookie(settings.testName);
        win.location.reload()
    }
    if (enhance.cookiesSupported) {
        enhance.reTest = reTest
    }
    function addFakeBody() {
        fakeBody = doc.createElement("body");
        docElem.insertBefore(fakeBody, docElem.firstChild);
        body = fakeBody
    }
    function removeFakeBody() {
        docElem.removeChild(fakeBody);
        body = doc.body
    }
    function runTests() {
        var result = readCookie(settings.testName);
        if (result) {
            if (result === "pass") {
                enhancePage();
                settings.onPass()
            } else {
                settings.onFail();
                removeHTMLClass()
            }
            if (settings.appendToggleLink) {
                windowLoad(function () {
                    appendToggleLinks(result)
                })
            }
        } else {
            var pass = true;
            addFakeBody();
            for (var name in settings.tests) {
                pass = settings.tests[name]();
                if (!pass) {
                    if (settings.alertOnFailure) {
                        alert(name + " failed")
                    }
                    break
                }
            }
            removeFakeBody();
            result = pass ? "pass" : "fail";
            createCookie(settings.testName, result);
            if (pass) {
                enhancePage();
                settings.onPass()
            } else {
                settings.onFail();
                removeHTMLClass()
            }
            if (settings.appendToggleLink) {
                windowLoad(function () {
                    appendToggleLinks(result)
                })
            }
        }
    }
    function windowLoad(callback) {
        if (windowLoaded) {
            callback()
        } else {
            var oldonload = win.onload;
            win.onload = function () {
                if (oldonload) {
                    oldonload()
                }
                callback()
            }
        }
    }
    function appendToggleLinks(result) {
        if (!settings.appendToggleLink || !enhance.cookiesSupported) {
            return
        }
        if (result) {
            var a = doc.createElement("a");
            a.href = "#";
            a.className = settings.testName + "_toggleResult";
            a.innerHTML = result === "pass" ? settings.forceFailText : settings.forcePassText;
            a.onclick = result === "pass" ? enhance.forceFail : enhance.forcePass;
            doc.getElementsByTagName("body")[0].appendChild(a)
        }
    }
    function removeHTMLClass() {
        docElem.className = docElem.className.replace(settings.testName, "")
    }
    function enhancePage() {
        testPass = true;
        if (settings.loadStyles.length) {
            appendStyles()
        }
        if (settings.loadScripts.length) {
            appendScripts()
        } else {
            settings.onScriptsLoaded()
        }
    }
    function toggleMedia(mediaA, mediaB) {
        if (readCookie(mediaCookieA) && readCookie(mediaCookieB)) {
            eraseCookie(mediaCookieA);
            eraseCookie(mediaCookieB)
        } else {
            createCookie(mediaCookieA, mediaA);
            createCookie(mediaCookieB, mediaB)
        }
        win.location.reload()
    }
    enhance.toggleMedia = toggleMedia;

    function mediaSwitch(q) {
        if (toggledMedia.length == 2) {
            if (q == toggledMedia[0]) {
                q = toggledMedia[1]
            } else {
                if (q == toggledMedia[1]) {
                    q = toggledMedia[0]
                }
            }
        }
        return q
    }
    function addIncompleteClass() {
        var errorClass = settings.testName + "-incomplete";
        if (docElem.className.indexOf(errorClass) === -1) {
            docElem.className += " " + errorClass
        }
    }
    function appendStyles() {
        var index = -1,
            item;
        while ((item = settings.loadStyles[++index])) {
            var link = doc.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.onerror = settings.onLoadError;
            if (typeof item === "string") {
                link.href = item;
                head.appendChild(link)
            } else {
                if (item.media) {
                    item.media = mediaSwitch(item.media)
                }
                if (item.excludemedia) {
                    item.excludemedia = mediaSwitch(item.excludemedia)
                }
                for (var attr in item) {
                    if (attr !== "iecondition" && attr !== "excludemedia") {
                        link.setAttribute(attr, item[attr])
                    }
                }
                var applies = true;
                if (item.media && item.media !== "print" && item.media !== "projection" && item.media !== "speech" && item.media !== "aural" && item.media !== "braille") {
                    applies = mediaquery(item.media)
                }
                if (item.excludemedia) {
                    applies = !mediaquery(item.excludemedia)
                }
                if (item.iecondition) {
                    applies = isIE(item.iecondition)
                }
                if (applies) {
                    head.appendChild(link)
                }
            }
        }
    }
    var isIE = (function () {
        var cache = {}, b;
        return function (condition) {
            if (
            /*@cc_on!@*/
            true) {
                return false
            }
            var cc = "IE";
            if (condition) {
                if (condition !== "all") {
                    if (!isNaN(parseFloat(condition))) {
                        cc += " " + condition
                    } else {
                        cc = condition
                    }
                }
            }
            if (cache[cc] === undefined) {
                b = b || doc.createElement("B");
                b.innerHTML = "<!--[if " + cc + "]><b></b><![endif]-->";
                cache[cc] = !! b.getElementsByTagName("b")
                    .length
            }
            return cache[cc]
        }
    })();
    var mediaquery = (function () {
        var cache = {}, testDiv = doc.createElement("div");
        testDiv.setAttribute("id", "ejs-qtest");
        return function (q) {
            if (cache[q] === undefined) {
                addFakeBody();
                var styleBlock = doc.createElement("style");
                styleBlock.type = "text/css";
                var cssrule = "@media " + q + " { #ejs-qtest { position: absolute; width: 10px; } }";
                if (styleBlock.styleSheet) {
                    styleBlock.styleSheet.cssText = cssrule
                } else {
                    styleBlock.appendChild(doc.createTextNode(cssrule))
                }
                head.appendChild(styleBlock);
                body.appendChild(testDiv);
                var divWidth = testDiv.offsetWidth;
                body.removeChild(testDiv);
                head.removeChild(styleBlock);
                removeFakeBody();
                cache[q] = (divWidth == 10)
            }
            return cache[q]
        }
    })();
    enhance.mediaquery = mediaquery;

    function appendScripts() {
        settings.queueLoading ? appendScriptsSync() : appendScriptsAsync()
    }
    function appendScriptsSync() {
        var queue = [].concat(settings.loadScripts);

        function next() {
            if (queue.length === 0) {
                return false
            }
            var item = queue.shift(),
                script = createScriptTag(item),
                done = false;
            if (script) {
                script.onload = script.onreadystatechange = function () {
                    if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                        done = true;
                        if (next() === false) {
                            settings.onScriptsLoaded()
                        }
                        this.onload = this.onreadystatechange = null
                    }
                };
                head.insertBefore(script, head.firstChild)
            } else {
                return next()
            }
        }
        next()
    }
    function appendScriptsAsync() {
        var index = -1,
            item;
        while ((item = settings.loadScripts[++index])) {
            var script = createScriptTag(item);
            if (script) {
                head.insertBefore(script, head.firstChild)
            }
        }
        settings.onScriptsLoaded()
    }
    function createScriptTag(item) {
        var script = doc.createElement("script");
        script.type = "text/javascript";
        script.onerror = settings.onLoadError;
        if (typeof item === "string") {
            script.src = item;
            return script
        } else {
            if (item.media) {
                item.media = mediaSwitch(item.media)
            }
            if (item.excludemedia) {
                item.excludemedia = mediaSwitch(item.excludemedia)
            }
            for (var attr in item) {
                if (attr !== "iecondition" && attr !== "media" && attr !== "excludemedia") {
                    script.setAttribute(attr, item[attr])
                }
            }
            var applies = true;
            if (item.media) {
                applies = mediaquery(item.media)
            }
            if (item.excludemedia) {
                applies = !mediaquery(item.excludemedia)
            }
            if (item.iecondition) {
                applies = isIE(item.iecondition)
            }
            return applies ? script : false
        }
    }
    function createCookie(name, value, days) {
        days = days || 90;
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
        doc.cookie = name + "=" + value + expires + "; path=/"
    }
    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = doc.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") {
                c = c.substring(1, c.length)
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length, c.length)
            }
        }
        return null
    }
    function eraseCookie(name) {
        createCookie(name, "", - 1)
    }
    function applyDocReadyHack() {
        if (doc.readyState == null && doc.addEventListener) {
            doc.addEventListener("DOMContentLoaded", function DOMContentLoaded() {
                doc.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
                doc.readyState = "complete"
            }, false);
            doc.readyState = "loading"
        }
    }
})(window, document);