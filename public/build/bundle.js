
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined' ? window : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.19.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var fetchJsonp = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
      {
        factory(exports, module);
      }
    })(commonjsGlobal, function (exports, module) {

      var defaultOptions = {
        timeout: 5000,
        jsonpCallback: 'callback',
        jsonpCallbackFunction: null
      };

      function generateCallbackFunction() {
        return 'jsonp_' + Date.now() + '_' + Math.ceil(Math.random() * 100000);
      }

      function clearFunction(functionName) {
        // IE8 throws an exception when you try to delete a property on window
        // http://stackoverflow.com/a/1824228/751089
        try {
          delete window[functionName];
        } catch (e) {
          window[functionName] = undefined;
        }
      }

      function removeScript(scriptId) {
        var script = document.getElementById(scriptId);
        if (script) {
          document.getElementsByTagName('head')[0].removeChild(script);
        }
      }

      function fetchJsonp(_url) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        // to avoid param reassign
        var url = _url;
        var timeout = options.timeout || defaultOptions.timeout;
        var jsonpCallback = options.jsonpCallback || defaultOptions.jsonpCallback;

        var timeoutId = undefined;

        return new Promise(function (resolve, reject) {
          var callbackFunction = options.jsonpCallbackFunction || generateCallbackFunction();
          var scriptId = jsonpCallback + '_' + callbackFunction;

          window[callbackFunction] = function (response) {
            resolve({
              ok: true,
              // keep consistent with fetch API
              json: function json() {
                return Promise.resolve(response);
              }
            });

            if (timeoutId) clearTimeout(timeoutId);

            removeScript(scriptId);

            clearFunction(callbackFunction);
          };

          // Check if the user set their own params, and if not add a ? to start a list of params
          url += url.indexOf('?') === -1 ? '?' : '&';

          var jsonpScript = document.createElement('script');
          jsonpScript.setAttribute('src', '' + url + jsonpCallback + '=' + callbackFunction);
          if (options.charset) {
            jsonpScript.setAttribute('charset', options.charset);
          }
          jsonpScript.id = scriptId;
          document.getElementsByTagName('head')[0].appendChild(jsonpScript);

          timeoutId = setTimeout(function () {
            reject(new Error('JSONP request to ' + _url + ' timed out'));

            clearFunction(callbackFunction);
            removeScript(scriptId);
            window[callbackFunction] = function () {
              clearFunction(callbackFunction);
            };
          }, timeout);

          // Caught if got 404/500
          jsonpScript.onerror = function () {
            reject(new Error('JSONP request to ' + _url + ' failed'));

            clearFunction(callbackFunction);
            removeScript(scriptId);
            if (timeoutId) clearTimeout(timeoutId);
          };
        });
      }

      // export as global function
      /*
      let local;
      if (typeof global !== 'undefined') {
        local = global;
      } else if (typeof self !== 'undefined') {
        local = self;
      } else {
        try {
          local = Function('return this')();
        } catch (e) {
          throw new Error('polyfill failed because global object is unavailable in this environment');
        }
      }
      local.fetchJsonp = fetchJsonp;
      */

      module.exports = fetchJsonp;
    });
    });

    /*
      At minimum each entry requires `url` & `keys` properties.
      If you want it to show in the 
      `url` must be a string
      `keys` must be an array, even if it's a single entry
     */

    const config = {
      user: "roly",
      sites: [
        {
          name: "Google",
          keys: "*",
          url: "https://google.com",
          search: "https://google.com/search?q={}"
        },
        // Me
        {
          category: "Me",
          name: "About",
          keys: ["about"],
          url: "https://about.rolyreyes.com",
          hidden: true
        },
        {
          category: "Me",
          name: "Blog",
          keys: ["blog"],
          url: "https://rolyreyes.com"
        },
        {
          category: "Me",
          name: "Dotfiles",
          keys: ["dot"],
          url: "https://github.com/ylor/dotfiles"
        },
        {
          category: "Me",
          name: "Github",
          keys: ["github", "git"],
          url: "https://github.com/",
          search: "https://github.com/search?q={}"
        },
        {
          category: "Me",
          name: "Start",
          keys: ["start"],
          url: "https://start.rolyreyes.com"
        },

        // Server
        {
          category: "Server",
          name: "Pi-hole",
          keys: ["pihole", "pi"],
          url: "http://pi.hole/admin"
        },
        {
          category: "Server",

          name: "Homebridge",
          keys: ["homebridge", "hb"],
          url: "http://docker.local:8181"
        },
        {
          category: "Server",

          name: "Plex",
          keys: ["plex"],
          url: "http://server.local:32400/web"
        },
        {
          category: "Server",

          name: "Portainer",
          keys: ["portainer", "port"],
          url: "http://docker.local:9000"
        },
        {
          category: "Server",

          name: "Radarr",
          keys: ["radarr", "movies"],
          url: "http://docker.local:7878"
        },
        {
          category: "Server",

          name: "Sonarr",
          keys: ["sonarr", "tv"],
          url: "http://docker.local:8989"
        },
        {
          category: "Server",

          name: "Transmission",
          keys: ["transmission", "bt", "bit"],
          url: "http://docker.local:9091"
        },
        {
          category: "Server",
          name: "UniFi Controller",
          keys: ["unifi"],
          url: "http://docker.local:8080"
        },
        //Work
        {
          category: "MDC",
          name: "Apple School Manager",
          keys: ["apple school manager", "asm"],
          url: "http://school.apple.com"
        },
        {
          category: "MDC",
          name: "CNS Service Requests",
          keys: ["sr"],
          url: "http://k353077/"
        },
        {
          category: "MDC",
          name: "CNS Sharepoint",
          keys: ["cns", "sharepoint"],
          url:
            "https://miamidadecollegeprod.sharepoint.com/teams/MDC_Kendall_CampusNetworkServices/SitePages/CNS%20Department%20Policies%20and%20Procedures.aspx"
        },
        {
          category: "MDC",
          name: "CNS Sharepoint-old",
          keys: ["cns-old", "sharepoint-old"],
          url:
            "https://sharepoint.mdc.edu/kendall/departments/cns/SitePages/CNS%20Department%20Policies%20and%20Procedures.aspx"
        },
        {
          category: "MDC",
          name: "CNS Forms",
          keys: ["form", "forms"],
          url:
            "https://forms.office.com/Pages/ResponsePage.aspx?id=BmhisP_Ok0OCHvmj5maJOxTM7A6YzXlAmKCvVMMrgsFUMzJaTFhGOEY0STlLWkVMR1JKMU4zMThFTC4u"
        },
        {
          category: "MDC",
          name: "Fusion",
          keys: ["fusion", "kfusion"],
          url:
            "http://kfusion1.kendall.mdcc.edu/Fusion/WebClient/monitoring/pages/Default.html?sp=&rr=15"
        },
        {
          category: "MDC",
          name: "CNS Kaseya",
          keys: ["kaseya"],
          url: "https://kaseya.mdc.edu/"
        },
        {
          category: "MDC",
          name: "JAMF",
          keys: ["jamf"],
          url: "https://kmacdep.kendall.mdcc.edu:8443"
        },
        {
          category: "MDC",
          name: "Miami Dade College",
          keys: ["mdc"],
          url: "http://www.mdc.edu"
        },
        {
          category: "MDC",
          name: "Miami Dade College - NTAuth",
          keys: ["ntauth"],
          url: "http://ntauth.mdc.edu"
        },
        {
          category: "MDC",
          name: "MDC - Employee",
          keys: ["emp"],
          url: "https://wapi.mdc.edu/NTAuth/account_admin.asp",
          search: "https://wapi.mdc.edu/NTAuth/user_data.asp?UserID={}"
        },
        {
          category: "MDC",
          name: "MDC - Student",
          keys: ["stu"],
          url: "https://mdcwapi.mdc.edu:8001/ntauthstudent",
          search:
            "https://mdcwapi.mdc.edu:8001/ntauthstudent/StudentData.aspx?AcctNm={}"
        },
        {
          category: "MDC",
          name: "Timeclock",
          keys: ["timeclock", "tc"],
          url: "https://timeclock.mdc.edu"
        },
        // Internet
        {
          name: "1Password Password Generator",
          keys: ["pw"],
          url: "https://1password.com/password-generator"
        },
        {
          name: "Amazon",
          keys: ["amazon", "a"],
          url: "https://www.amazon.com",
          search: "https://www.amazon.com/s?k={}"
        },
        {
          name: "Bitwarden",
          keys: ["bitwarden", "bw"],
          url: "https://vault.bitwarden.com"
        },
        {
          name: "CamelCamelCamel",
          keys: ["camelcamelcamel", "ccc"],
          url: "https://camelcamelcamel.com/",
          search: "https://camelcamelcamel.com/search?sq={}"
        },
        {
          name: "Discord",
          keys: ["discord"],
          url: "https://discordapp.com/activity"
        },
        {
          name: "Drive",
          keys: ["drive", "gdrive"],
          url: "https://drive.google.com"
        },
        {
          name: "Epic Game Store",
          keys: ["epic game store", "egs"],
          url: "https://www.epicgames.com/store",
          search: "https://www.epicgames.com/store/store-search/?q={}"
        },
        {
          name: "Giant Bomb",
          keys: ["giant bomb", "gb"],
          url: "https://www.giantbomb.com/",
          search: "https://www.giantbomb.com/search/?i=&q={}"
        },
        {
          name: "Giant Bomb Infinite",
          keys: ["giant bomb infinite", "gb8"],
          url: "https://www.giantbomb.com/infinite"
        },
        {
          name: "Giphy",
          keys: ["giphy", "gif"],
          url: "https://giphy.com",
          search: "https://giphy.com/search/{}"
        },
        {
          name: "Guess My Word",
          keys: ["guessmyword", "gmw"],
          url: "https://hryanjones.com/guess-my-word/"
        },
        {
          name: "Hacker News",
          keys: ["hacker news", "hn"],
          url: "https://news.ycombinator.com",
          search: "https://hn.algolia.com/?&query={}"
        },
        {
          name: "How Long to Beat",
          keys: ["how lont to beat", "hltb"],
          url: "https://howlongtobeat.com",
          search: "https://howlongtobeat.com/?q={}"
        },
        {
          name: "iCloud",
          keys: ["icloud"],
          url: "https://www.icloud.com"
        },
        {
          name: "iCloud Mail",
          keys: ["mail"],
          url: "https://www.icloud.com/#mail"
        },
        {
          name: "Instagram",
          keys: ["instagram", "insta", "ig"],
          url: "https://www.instagram.com"
        },
        {
          name: "JSFiddle",
          keys: ["jsfiddle", "fiddle"],
          url: "https://jsfiddle.net"
        },
        {
          name: "MyAnimeList",
          keys: ["myanimelist", "mal"],
          url: "https://myanimelist.net",
          search: "https://myanimelist.net/search/all?q={}"
        },
        {
          name: "Netflix",
          keys: ["netflix"],
          url: "https://www.netflix.com",
          search: "https://www.netflix.com/search?q={}"
        },
        {
          name: "Node Package Manager",
          keys: ["npm"],
          url: "https://www.npmjs.com",
          search: "https://www.npmjs.com/search?q={}"
        },
        {
          name: "Nyaa",
          keys: ["nyaa"],
          url: "https://nyaa.si",
          search: "https://nyaa.si/?f=0&c=0_0&q={}"
        },
        {
          name: "OneDrive",
          keys: ["onedrive", "od"],
          url: "https://onedrive.live.com"
        },
        {
          name: "Plex.tv",
          keys: ["plexapp", "plextv", "plex.app", "plex.tv"],
          url: "https://app.plex.tv/desktop"
        },
        {
          name: "RARBG",
          keys: ["rarbg"],
          url: "https://rarbg.to/torrents",
          search: "https://rarbg.to/torrents?search={}"
        },
        {
          name: "Reddit",
          keys: ["reddit", "r"],
          url: "https://www.reddit.com/r",
          search: "https://www.reddit.com/r/search?q={}"
        },
        {
          name: "Simplenote",
          keys: ["simplenote", "sn"],
          url: "https://app.simplenote.com"
        },
        {
          name: "Spotify",
          keys: ["spotify"],
          url: "https://open.spotify.com"
        },
        {
          name: "ResetERA",
          keys: ["resetera", "reset", "era", "re"],
          url: "https://www.resetera.com"
        },

        {
          name: "Steam",
          keys: ["steam"],
          url: "https://store.steampowered.com",
          search: "https://store.steampowered.com/search/?term={}"
        },
        {
          name: "Tumblr",
          keys: ["tumblr"],
          url: "https://tumblr.com"
        },
        {
          name: "The Movie Database",
          keys: ["tmdb"],
          url: "https://www.themoviedb.org",
          search: "https://www.themoviedb.org/search?query={}&language=en-US"
        },
        {
          name: "The TVDB",
          keys: ["tvdb"],
          url: "https://thetvdb.com",
          search: "https://thetvdb.com/search?query={}"
        },
        {
          name: "Twitch",
          keys: ["twitch"],
          url: "https://twitch.tv/directory"
        },
        {
          name: "Twitter",
          keys: ["twitter"],
          url: "https://twitter.com",
          search: "https://twitter.com/search?q={}"
        },
        {
          name: "WhatsApp",
          keys: ["whatsapp", "wa"],
          url: "https://web.whatsapp.com/"
        },
        {
          name: "Wirecutter",
          keys: ["wirecutter", "wc"],
          url: "https://thewirecutter.com/"
        },
        {
          name: "Yarn",
          keys: ["yarn"],
          url: "https://yarnpkg.com",
          search: "https://yarnpkg.com//en/packages?q={}"
        },
        {
          name: "YouTube",
          keys: ["youtube", "yt"],
          url: "https://youtube.com",
          search: "https://youtube.com/results?search_query={}"
        },
        // Destiny
        {
          category: "Destiny",
          name: "Braytech",
          keys: ["braytech"],
          url: "https://braytech.org"
        },
        {
          category: "Destiny",
          name: "D2Checklist",
          keys: ["d2checklist", "d2c"],
          url: "https://www.d2checklist.com"
        },
        {
          category: "Destiny",
          name: "Destiny Item Manager",
          keys: ["destiny item manager", "dim"],
          url: "https://app.destinyitemmanager.com"
        },
        {
          category: "Destiny",
          name: "Guardian.gg",
          keys: ["guardian", "ggg"],
          url: "https://guardian.gg"
        },
        {
          category: "Destiny",
          name: "Destiny Sets",
          keys: ["destiny sets", "sets"],
          url: "https://destinysets.com"
        },
        {
          category: "Destiny",
          name: "Light.gg",
          keys: ["lightgg", "light"],
          url: "https://light.gg"
        },
        // Reddit
        {
          category: "Reddit",
          name: "/r/DestinyTheGame",
          keys: ["r/destinythegame", "r/dtg", "dtg"],
          url: "https://www.reddit.com/r/destinythegame",
          search:
            "https://www.reddit.com/r/destinythegame/search?q={}&restrict_sr=1"
        },
        {
          category: "Reddit",
          name: "/r/HipHopHeads",
          keys: ["r/hiphopheads", "r/hhh"],
          url: "https://www.reddit.com/r/hiphopheads",
          search: "https://www.reddit.com/r/hiphopheads/search?q={}&restrict_sr=1"
        },
        // Ugh
        {
          name: "/g/ - Technology",
          keys: ["g"],
          url: "https://boards.4chan.org/g/catalog"
        },
        {
          name: "/w/ - Wallpapers",
          keys: ["w"],
          url: "https://boards.4chan.org/w/catalog"
        },
        {
          name: "/wg/ - Wallpapers General",
          keys: ["wg"],
          url: "https://boards.4chan.org/wg/catalog"
        }
      ]
    };

    const changeFocus = element => document.getElementById(element).focus();

    function keyHandler(event) {
      //console.log(event.key);
      const searchInput = document.getElementById("search-input");
      const suggestionClass = document.getElementsByClassName("search-suggestion");
      // Change focus as if ArrowUp === Shitf+Tab & Change focus as if ArrowDown === Tab
      if (event.key === "ArrowUp") {
        if (document.activeElement === searchInput) {
          suggestionClass[suggestionClass.length - 1].focus();
        } else {
          document.activeElement.previousElementSibling
            ? document.activeElement.previousElementSibling.focus()
            : searchInput.focus();
        }
      } else if (event.key === "ArrowDown") {
        if (document.activeElement === searchInput) {
          suggestionClass[0].focus();
        } else {
          document.activeElement.nextElementSibling
            ? document.activeElement.nextElementSibling.focus()
            : searchInput.focus();
        }
      }

      // listen for equals key to do some math inline
      //   else if (event.key === "=") {
      //     if (searchInput.value.match(mathPattern)) {
      //       try {
      //         event.preventDefault();
      //         const expression = searchInput.value;
      //         // disabling eslint for line containing `eval` because I'm prevalidating the input with mathPattern
      //         // eslint-disable-next-line
      //         const answer = eval(searchInput.value);
      //         searchInput.value = expression + "=" + answer.toString();
      //       } catch {
      //         // Cases where this fails includes incomplete expressions like `2+=`
      //       }
      //     }
      //   }

      // Listen for space
      // In Safari on macOS there doesn't seem to be an equivalent for event.key === "Spacebar" so I had to use event.code
      else if (event.key === "Spacebar" || event.code === "Space") {
        if (document.activeElement.id !== "search-input") {
          setSearch(document.activeElement.textContent);
          changeFocus("search-input");
        }
      }

      // Listen for backspace
      else if (event.key === "Backspace") {
        if (document.activeElement.id !== "search-input") {
          changeFocus("search-input");
        }
      }

      // Listen for esc
      //   else if (event.key === "Escape") {
      //     // If search-input is focused then clear the input
      //     if (document.activeElement !== searchInput) {
      //       changeFocus("search-input");
      //     }
      //     // If search-input is focused and has a value, zero it out
      //     else if (searchInput.value.length > 0) {
      //       searchInput.value = "";
      //     }
      //   }

      // Allow tabbing but anything else focuses search
      else if (
        event.key !== "Enter" &&
        event.key !== "Shift" &&
        event.key !== "Tab"
      ) {
        changeFocus("search-input");
      }
    }

    function parseInput(rawInput) {
      const { sites } = config;

      const input = rawInput.toLowerCase();
      const keysList = sites.map(site => site.keys).flat();
      const ipPattern = new RegExp(/^((2(?!5?[6-9])|1|(?!0\B))\d\d?\.?\b){4}$/g);
      const urlPattern = new RegExp(
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/gi
      );

      // begin conditionals for the parser
      // handle match to key in config
      if (keysList.includes(input)) {
        return sites.find(v => v.keys.includes(input)).url;
      }

      // handle urls
      if (
        input.match(urlPattern) ||
        input.match(ipPattern) ||
        input.includes("localhost")
      ) {
        if (
          input.match(ipPattern) ||
          input.includes(".local") ||
          input.includes("localhost")
        ) {
          return input.startsWith("http") ? rawInput : "http://" + rawInput;
        } else {
          return input.startsWith("http") ? rawInput : "https://" + rawInput;
        }
      }

      // handle search with a matched key
      if (input.includes(":") && keysList.includes(input.split(":")[0])) {
        const key = input.split(":")[0];
        const query = rawInput.split(":")[1].trimStart();
        console.log(sites.find(site => site.keys.includes(key)).search);

        if (sites.find(site => site.keys.includes(key)).search) {
          return sites
            .find(site => site.keys.includes(key))
            .search.replace("{}", query);
        }
      }

      // handle paths with a matched key
      if (input.includes("/") && keysList.includes(input.split("/")[0])) {
        const key = input.split("/")[0];
        const path = rawInput.split("/")[1];
        return (
          sites.find(site => site.keys.includes(key)).url.replace(/\/$/, "") +
          "/" +
          path
        );
      }

      // search google
      else
        return sites
          .find(site => site.keys === "*")
          .search.replace("{}", encodeURIComponent(rawInput));
    }

    /* src\components\Prompt.svelte generated by Svelte v3.19.1 */

    const file = "src\\components\\Prompt.svelte";

    function create_fragment(ctx) {
    	let section;
    	let t0;
    	let span0;
    	let t2;
    	let span1;
    	let t4;
    	let br;

    	const block = {
    		c: function create() {
    			section = element("section");
    			t0 = text("[\n  ");
    			span0 = element("span");
    			span0.textContent = "roly";
    			t2 = text("\n  @\n  ");
    			span1 = element("span");
    			span1.textContent = `${/*location*/ ctx[0]}`;
    			t4 = text("\n  ]\n  ");
    			br = element("br");
    			set_style(span0, "color", "cyan");
    			add_location(span0, file, 13, 2, 212);
    			set_style(span1, "color", "cyan");
    			add_location(span1, file, 15, 2, 256);
    			add_location(br, file, 17, 2, 306);
    			attr_dev(section, "class", "svelte-mb6bct");
    			add_location(section, file, 11, 0, 196);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, t0);
    			append_dev(section, span0);
    			append_dev(section, t2);
    			append_dev(section, span1);
    			append_dev(section, t4);
    			append_dev(section, br);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	const location = window.location.hostname.includes("work")
    	? "work"
    	: "home";

    	const command = "";
    	$$self.$capture_state = () => ({ location, command, window });
    	return [location, command];
    }

    class Prompt extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { command: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Prompt",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get command() {
    		return this.$$.ctx[1];
    	}

    	set command(value) {
    		throw new Error("<Prompt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.19.1 */

    const { window: window_1 } = globals;
    const file$1 = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	child_ctx[16] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    // (221:14) {#each sites.filter(command => command.category === category && command.hidden !== true) as site}
    function create_each_block_2(ctx) {
    	let li;
    	let a;
    	let t0_value = /*site*/ ctx[20].name + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let li_title_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = /*site*/ ctx[20].url);
    			attr_dev(a, "class", "svelte-nd0pwg");
    			add_location(a, file$1, 222, 18, 4506);
    			attr_dev(li, "title", li_title_value = /*site*/ ctx[20].keys.toString().replace(",", ", "));
    			attr_dev(li, "class", "svelte-nd0pwg");
    			add_location(li, file$1, 221, 16, 4435);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(221:14) {#each sites.filter(command => command.category === category && command.hidden !== true) as site}",
    		ctx
    	});

    	return block;
    }

    // (214:8) {#each distinctCategories as category}
    function create_each_block_1(ctx) {
    	let li;
    	let h1;
    	let t0_value = /*category*/ ctx[17] + "";
    	let t0;
    	let t1;
    	let ul;
    	let t2;
    	let dispose;

    	function func(...args) {
    		return /*func*/ ctx[10](/*category*/ ctx[17], ...args);
    	}

    	let each_value_2 = /*sites*/ ctx[2].filter(func);
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			attr_dev(h1, "class", "svelte-nd0pwg");
    			add_location(h1, file$1, 215, 12, 4159);
    			attr_dev(ul, "class", "svelte-nd0pwg");
    			add_location(ul, file$1, 219, 12, 4302);
    			attr_dev(li, "class", "hideChildren svelte-nd0pwg");
    			add_location(li, file$1, 214, 10, 4121);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, h1);
    			append_dev(h1, t0);
    			append_dev(li, t1);
    			append_dev(li, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(li, t2);
    			dispose = listen_dev(h1, "click", click_handler, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*sites, distinctCategories*/ 12) {
    				each_value_2 = /*sites*/ ctx[2].filter(func);
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_each(each_blocks, detaching);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(214:8) {#each distinctCategories as category}",
    		ctx
    	});

    	return block;
    }

    // (250:4) {#if suggestions.length > 0}
    function create_if_block(ctx) {
    	let aside;
    	let ul;
    	let each_value = /*suggestions*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "id", "list");
    			attr_dev(ul, "class", "svelte-nd0pwg");
    			add_location(ul, file$1, 251, 8, 5230);
    			attr_dev(aside, "class", "tree svelte-nd0pwg");
    			add_location(aside, file$1, 250, 6, 5201);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			append_dev(aside, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*parseInput, suggestions, search*/ 3) {
    				each_value = /*suggestions*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(250:4) {#if suggestions.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (253:10) {#each suggestions as suggestion, i}
    function create_each_block(ctx) {
    	let li;
    	let a;
    	let raw_value = /*suggestion*/ ctx[14].replace(/*search*/ ctx[0].match(/\b.+\b/), `<b style='text-decoration:underline';>${/*search*/ ctx[0].trimEnd()}</b>`) + "";
    	let a_href_value;
    	let t;
    	let li_id_value;
    	let dispose;

    	function focus_handler(...args) {
    		return /*focus_handler*/ ctx[13](/*suggestion*/ ctx[14], ...args);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = space();
    			attr_dev(a, "href", a_href_value = parseInput(/*suggestion*/ ctx[14]));
    			attr_dev(a, "class", "svelte-nd0pwg");
    			add_location(a, file$1, 254, 14, 5379);
    			attr_dev(li, "id", li_id_value = "search-suggestion-" + /*i*/ ctx[16]);
    			attr_dev(li, "class", "search-suggestion svelte-nd0pwg");
    			add_location(li, file$1, 253, 12, 5304);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			a.innerHTML = raw_value;
    			append_dev(li, t);

    			dispose = [
    				listen_dev(a, "focus", focus_handler, false, false, false),
    				listen_dev(a, "mouseover", mouseover_handler, false, false, false)
    			];
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*suggestions, search*/ 3 && raw_value !== (raw_value = /*suggestion*/ ctx[14].replace(/*search*/ ctx[0].match(/\b.+\b/), `<b style='text-decoration:underline';>${/*search*/ ctx[0].trimEnd()}</b>`) + "")) a.innerHTML = raw_value;
    			if (dirty & /*suggestions*/ 2 && a_href_value !== (a_href_value = parseInput(/*suggestion*/ ctx[14]))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(253:10) {#each suggestions as suggestion, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let section0;
    	let t0;
    	let span0;
    	let t2;
    	let aside;
    	let h1;
    	let t4;
    	let ul;
    	let t5;
    	let section1;
    	let t6;
    	let span1;
    	let t8;
    	let form;
    	let input;
    	let t9;
    	let current;
    	let dispose;
    	const prompt0 = new Prompt({ $$inline: true });
    	let each_value_1 = /*distinctCategories*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const prompt1 = new Prompt({ $$inline: true });
    	let if_block = /*suggestions*/ ctx[1].length > 0 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			section0 = element("section");
    			create_component(prompt0.$$.fragment);
    			t0 = space();
    			span0 = element("span");
    			span0.textContent = "➜";
    			t2 = text("\n    tree\n    ");
    			aside = element("aside");
    			h1 = element("h1");
    			h1.textContent = ".";
    			t4 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			section1 = element("section");
    			create_component(prompt1.$$.fragment);
    			t6 = space();
    			span1 = element("span");
    			span1.textContent = "➜";
    			t8 = text("\n    find \n    ");
    			form = element("form");
    			input = element("input");
    			t9 = space();
    			if (if_block) if_block.c();
    			set_style(span0, "color", "green");
    			attr_dev(span0, "class", "svelte-nd0pwg");
    			add_location(span0, file$1, 208, 4, 3956);
    			attr_dev(h1, "class", "svelte-nd0pwg");
    			add_location(h1, file$1, 211, 6, 4032);
    			attr_dev(ul, "id", "list");
    			attr_dev(ul, "class", "svelte-nd0pwg");
    			add_location(ul, file$1, 212, 6, 4049);
    			attr_dev(aside, "class", "tree svelte-nd0pwg");
    			add_location(aside, file$1, 210, 4, 4005);
    			attr_dev(section0, "class", "svelte-nd0pwg");
    			add_location(section0, file$1, 206, 2, 3927);
    			set_style(span1, "color", "green");
    			attr_dev(span1, "class", "svelte-nd0pwg");
    			add_location(span1, file$1, 234, 4, 4705);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "autocapitalize", "none");
    			attr_dev(input, "autocomplete", "off");
    			attr_dev(input, "autocorrect", "off");
    			attr_dev(input, "spellcheck", "false");
    			attr_dev(input, "id", "search-input");
    			attr_dev(input, "class", "svelte-nd0pwg");
    			add_location(input, file$1, 239, 6, 4920);
    			attr_dev(form, "autocomplete", "off");
    			attr_dev(form, "class", "svelte-nd0pwg");
    			add_location(form, file$1, 236, 4, 4760);
    			attr_dev(section1, "class", "svelte-nd0pwg");
    			add_location(section1, file$1, 232, 2, 4676);
    			attr_dev(main, "class", "svelte-nd0pwg");
    			add_location(main, file$1, 205, 0, 3918);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, section0);
    			mount_component(prompt0, section0, null);
    			append_dev(section0, t0);
    			append_dev(section0, span0);
    			append_dev(section0, t2);
    			append_dev(section0, aside);
    			append_dev(aside, h1);
    			append_dev(aside, t4);
    			append_dev(aside, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(main, t5);
    			append_dev(main, section1);
    			mount_component(prompt1, section1, null);
    			append_dev(section1, t6);
    			append_dev(section1, span1);
    			append_dev(section1, t8);
    			append_dev(section1, form);
    			append_dev(form, input);
    			set_input_value(input, /*search*/ ctx[0]);
    			append_dev(section1, t9);
    			if (if_block) if_block.m(section1, null);
    			current = true;

    			dispose = [
    				listen_dev(window_1, "keydown", keyHandler, false, false, false),
    				listen_dev(window_1, "keydown", /*escHandler*/ ctx[5], false, false, false),
    				listen_dev(input, "keyup", /*fetchSuggestions*/ ctx[4], false, false, false),
    				listen_dev(input, "input", /*input_input_handler*/ ctx[11]),
    				listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[12]), false, true, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*sites, distinctCategories*/ 12) {
    				each_value_1 = /*distinctCategories*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*search*/ 1 && input.value !== /*search*/ ctx[0]) {
    				set_input_value(input, /*search*/ ctx[0]);
    			}

    			if (/*suggestions*/ ctx[1].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(section1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prompt0.$$.fragment, local);
    			transition_in(prompt1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prompt0.$$.fragment, local);
    			transition_out(prompt1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(prompt0);
    			destroy_each(each_blocks, detaching);
    			destroy_component(prompt1);
    			if (if_block) if_block.d();
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const click_handler = e => e.target.parentNode.classList.toggle("hideChildren");
    const mouseover_handler = event => event.target.addEventListener("mousemove", event => event.target.focus());

    function instance$1($$self, $$props, $$invalidate) {
    	const { user, sites } = config;
    	console.log(user);
    	console.log(sites);
    	const categoriesRaw = sites.map(command => command.category).filter(Boolean);
    	const distinctCategories = [...new Set(categoriesRaw)];
    	console.log(distinctCategories);

    	const categories = window.location.hostname.includes("work")
    	? distinctCategories.filter(category => category !== "Server")
    	: distinctCategories.filter(category => category !== "MDC");

    	console.log(categories);
    	let search = "";
    	let apiURL = "http://suggestqueries.google.com/complete/search?client=firefox&q=";
    	let suggestions = [];

    	async function fetchSuggestions() {
    		const query = () => search.includes(":") ? search.split(":")[1] : search;

    		if (search.length < 1) {
    			$$invalidate(1, suggestions = []);
    		} else if (search.length > 0) {
    			const response = await fetchJsonp(apiURL + query());
    			const json = await response.json();
    			$$invalidate(1, suggestions = json[1].slice(0, 6));
    		}

    		console.log(search.match(/\b.+\b/gi));
    	}

    	function escHandler(event) {
    		// Listen for esc
    		if (event.key === "Escape") {
    			// If search-input is focused and has a value, zero it out
    			if (search.length > 0) {
    				$$invalidate(0, search = "");
    			}
    		}
    	}

    	const func = (category, command) => command.category === category && command.hidden !== true;

    	function input_input_handler() {
    		search = this.value;
    		$$invalidate(0, search);
    	}

    	const submit_handler = () => window.location.href = parseInput(document.getElementById("search-input").value);
    	const focus_handler = suggestion => $$invalidate(0, search = suggestion);

    	$$self.$capture_state = () => ({
    		fetchJsonp,
    		config,
    		keyHandler,
    		parseInput,
    		Prompt,
    		user,
    		sites,
    		categoriesRaw,
    		distinctCategories,
    		categories,
    		search,
    		apiURL,
    		suggestions,
    		fetchSuggestions,
    		escHandler,
    		console,
    		Boolean,
    		Set,
    		window
    	});

    	$$self.$inject_state = $$props => {
    		if ("search" in $$props) $$invalidate(0, search = $$props.search);
    		if ("apiURL" in $$props) apiURL = $$props.apiURL;
    		if ("suggestions" in $$props) $$invalidate(1, suggestions = $$props.suggestions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		search,
    		suggestions,
    		sites,
    		distinctCategories,
    		fetchSuggestions,
    		escHandler,
    		user,
    		categoriesRaw,
    		categories,
    		apiURL,
    		func,
    		input_input_handler,
    		submit_handler,
    		focus_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
