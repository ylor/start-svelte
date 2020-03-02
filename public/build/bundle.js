
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if (typeof $$scope.dirty === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
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
    	let t5;
    	let span2;
    	let t7;
    	let t8;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			section = element("section");
    			t0 = text("[\n  ");
    			span0 = element("span");
    			span0.textContent = "roly";
    			t2 = text("\n  @\n  ");
    			span1 = element("span");
    			span1.textContent = `${browser()}`;
    			t4 = text("\n  ]\n  ");
    			br = element("br");
    			t5 = space();
    			span2 = element("span");
    			span2.textContent = "➜";
    			t7 = space();

    			if (!default_slot) {
    				t8 = text("command");
    			}

    			if (default_slot) default_slot.c();
    			set_style(span0, "color", "cyan");
    			add_location(span0, file, 42, 2, 987);
    			set_style(span1, "color", "cyan");
    			add_location(span1, file, 44, 2, 1031);
    			add_location(br, file, 46, 2, 1082);
    			set_style(span2, "color", "green");
    			add_location(span2, file, 47, 2, 1091);
    			attr_dev(section, "class", "svelte-mb6bct");
    			add_location(section, file, 40, 0, 971);
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
    			append_dev(section, t5);
    			append_dev(section, span2);
    			append_dev(section, t7);

    			if (!default_slot) {
    				append_dev(section, t8);
    			}

    			if (default_slot) {
    				default_slot.m(section, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 1) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[0], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (default_slot) default_slot.d(detaching);
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

    function browser() {
    	if (navigator.userAgent.includes("Edg")) {
    		return "edge";
    	} else if (navigator.userAgent.includes("Chrome")) {
    		return "chrome";
    	} else if (navigator.userAgent.includes("Safari")) {
    		return "safari";
    	} else if (navigator.userAgent.includes("Firefox")) {
    		return "firefox";
    	} else {
    		return "internet";
    	}
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ browser, navigator });
    	return [$$scope, $$slots];
    }

    class Prompt extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Prompt",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

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
          search: "https://google.com/search?q={}",
          hidden: true
        },
        // Me
        {
          category: "👨🏽‍🦲 Me",
          name: "About",
          keys: ["about"],
          url: "https://about.rolyreyes.com",
          hidden: true
        },
        {
          category: "👨🏽‍🦲 Me",
          name: "Blog",
          keys: ["blog"],
          url: "https://rolyreyes.com"
        },
        {
          category: "👨🏽‍🦲 Me",
          name: "Dotfiles",
          keys: ["dot"],
          url: "https://github.com/ylor/dotfiles"
        },
        {
          category: "👨🏽‍🦲 Me",
          name: "Github",
          keys: ["github", "git"],
          url: "https://github.com/",
          search: "https://github.com/search?q={}"
        },
        {
          category: "👨🏽‍🦲 Me",
          name: "Start",
          keys: ["start"],
          url: "https://start.rolyreyes.com"
        },

        // Server
        {
          category: "👨🏽‍💻 Server",
          name: "Pi-hole",
          keys: ["pihole", "pi"],
          url: "http://pi.hole/admin"
        },
        {
          category: "👨🏽‍💻 Server",

          name: "Homebridge",
          keys: ["homebridge", "hb"],
          url: "http://docker.local:8181"
        },
        {
          category: "👨🏽‍💻 Server",

          name: "Plex",
          keys: ["plex"],
          url: "http://server.local:32400/web"
        },
        {
          category: "👨🏽‍💻 Server",

          name: "Portainer",
          keys: ["portainer", "port"],
          url: "http://docker.local:9000"
        },
        {
          category: "👨🏽‍💻 Server",

          name: "Radarr",
          keys: ["radarr", "movies"],
          url: "http://docker.local:7878"
        },
        {
          category: "👨🏽‍💻 Server",

          name: "Sonarr",
          keys: ["sonarr", "tv"],
          url: "http://docker.local:8989"
        },
        {
          category: "👨🏽‍💻 Server",

          name: "Transmission",
          keys: ["transmission", "bt", "bit"],
          url: "http://docker.local:9091"
        },
        {
          category: "👨🏽‍💻 Server",
          name: "UniFi Controller",
          keys: ["unifi"],
          url: "http://docker.local:8080"
        },
        //Work
        {
          category: "🎓 MDC",
          name: "Apple School Manager",
          keys: ["apple school manager", "asm"],
          url: "http://school.apple.com"
        },
        {
          category: "🎓 MDC",
          name: "CNS Service Requests",
          keys: ["sr"],
          url: "http://k353077/"
        },
        {
          category: "🎓 MDC",
          name: "CNS Sharepoint",
          keys: ["cns", "sharepoint"],
          url:
            "https://miamidadecollegeprod.sharepoint.com/teams/MDC_Kendall_CampusNetworkServices/SitePages/CNS%20Department%20Policies%20and%20Procedures.aspx"
        },
        {
          category: "🎓 MDC",
          name: "CNS Sharepoint-old",
          keys: ["cns-old", "sharepoint-old"],
          url:
            "https://sharepoint.mdc.edu/kendall/departments/cns/SitePages/CNS%20Department%20Policies%20and%20Procedures.aspx"
        },
        {
          category: "🎓 MDC",
          name: "CNS Forms",
          keys: ["form", "forms"],
          url:
            "https://forms.office.com/Pages/ResponsePage.aspx?id=BmhisP_Ok0OCHvmj5maJOxTM7A6YzXlAmKCvVMMrgsFUMzJaTFhGOEY0STlLWkVMR1JKMU4zMThFTC4u"
        },
        {
          category: "🎓 MDC",
          name: "Fusion",
          keys: ["fusion", "kfusion"],
          url:
            "http://kfusion1.kendall.mdcc.edu/Fusion/WebClient/monitoring/pages/Default.html?sp=&rr=15"
        },
        {
          category: "🎓 MDC",
          name: "CNS Kaseya",
          keys: ["kaseya"],
          url: "https://kaseya.mdc.edu/"
        },
        {
          category: "🎓 MDC",
          name: "JAMF",
          keys: ["jamf"],
          url: "https://kmacdep.kendall.mdcc.edu:8443"
        },
        {
          category: "🎓 MDC",
          name: "Miami Dade College",
          keys: ["🎓 MDC"],
          url: "http://www.mdc.edu"
        },
        {
          category: "🎓 MDC",
          name: "Miami Dade College - NTAuth",
          keys: ["ntauth"],
          url: "http://ntauth.mdc.edu"
        },
        {
          category: "🎓 MDC",
          name: "MDC - Employee",
          keys: ["emp"],
          url: "https://wapi.mdc.edu/NTAuth/account_admin.asp",
          search: "https://wapi.mdc.edu/NTAuth/user_data.asp?UserID={}"
        },
        {
          category: "🎓 MDC",
          name: "MDC - Student",
          keys: ["stu"],
          url: "https://mdcwapi.mdc.edu:8001/ntauthstudent",
          search:
            "https://mdcwapi.mdc.edu:8001/ntauthstudent/StudentData.aspx?AcctNm={}"
        },
        {
          category: "🎓 MDC",
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
          name: "Netlify",
          keys: ["netlify"],
          url: "https://www.netlify.com"
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
          category: "🎮 Destiny",
          name: "Braytech",
          keys: ["braytech"],
          url: "https://braytech.org"
        },
        {
          category: "🎮 Destiny",
          name: "D2Checklist",
          keys: ["d2checklist", "d2c"],
          url: "https://www.d2checklist.com"
        },
        {
          category: "🎮 Destiny",
          name: "Destiny Item Manager",
          keys: ["destiny item manager", "dim"],
          url: "https://app.destinyitemmanager.com"
        },
        {
          category: "🎮 Destiny",
          name: "Guardian.gg",
          keys: ["guardian", "ggg"],
          url: "https://guardian.gg"
        },
        {
          category: "🎮 Destiny",
          name: "Destiny Sets",
          keys: ["destiny sets", "sets"],
          url: "https://destinysets.com"
        },
        {
          category: "🎮 Destiny",
          name: "Light.gg",
          keys: ["lightgg", "light"],
          url: "https://light.gg"
        },
        // Reddit
        {
          category: "💩 Reddit",
          name: "/r/DestinyTheGame",
          keys: ["r/destinythegame", "r/dtg", "dtg"],
          url: "https://www.reddit.com/r/destinythegame",
          search:
            "https://www.reddit.com/r/destinythegame/search?q={}&restrict_sr=1"
        },
        {
          category: "💩 Reddit",
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

    /* src\components\List.svelte generated by Svelte v3.19.1 */
    const file$1 = "src\\components\\List.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (29:14) {#each sites.filter(site => site.category === category && site.hidden !== true) as site}
    function create_each_block_1(ctx) {
    	let li;
    	let a;
    	let t0_value = /*site*/ ctx[8].name + "";
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
    			attr_dev(a, "href", a_href_value = /*site*/ ctx[8].url);
    			add_location(a, file$1, 30, 18, 907);
    			attr_dev(li, "title", li_title_value = /*site*/ ctx[8].keys.toString().replace(",", ", "));
    			add_location(li, file$1, 29, 16, 835);
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
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(29:14) {#each sites.filter(site => site.category === category && site.hidden !== true) as site}",
    		ctx
    	});

    	return block;
    }

    // (22:8) {#each categories as category}
    function create_each_block(ctx) {
    	let li;
    	let h1;
    	let t0_value = /*category*/ ctx[5] + "";
    	let t0;
    	let t1;
    	let ul;
    	let t2;
    	let dispose;

    	function func(...args) {
    		return /*func*/ ctx[4](/*category*/ ctx[5], ...args);
    	}

    	let each_value_1 = /*sites*/ ctx[0].filter(func);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
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
    			add_location(h1, file$1, 23, 12, 562);
    			add_location(ul, file$1, 27, 12, 709);
    			attr_dev(li, "class", "hideChildren");
    			add_location(li, file$1, 22, 10, 523);
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

    			if (dirty & /*sites, categories*/ 3) {
    				each_value_1 = /*sites*/ ctx[0].filter(func);
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
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_each(each_blocks, detaching);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(22:8) {#each categories as category}",
    		ctx
    	});

    	return block;
    }

    // (17:2) <Prompt>
    function create_default_slot(ctx) {
    	let t0;
    	let aside;
    	let h1;
    	let t2;
    	let ul;
    	let each_value = /*categories*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			t0 = text("tree\r\n    ");
    			aside = element("aside");
    			h1 = element("h1");
    			h1.textContent = ".";
    			t2 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h1, file$1, 19, 6, 436);
    			attr_dev(ul, "class", "list");
    			add_location(ul, file$1, 20, 6, 454);
    			attr_dev(aside, "class", "tree");
    			add_location(aside, file$1, 18, 4, 408);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, aside, anchor);
    			append_dev(aside, h1);
    			append_dev(aside, t2);
    			append_dev(aside, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sites, categories*/ 3) {
    				each_value = /*categories*/ ctx[1];
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
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(aside);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(17:2) <Prompt>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let section;
    	let current;

    	const prompt = new Prompt({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(prompt.$$.fragment);
    			add_location(section, file$1, 15, 0, 371);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(prompt, section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const prompt_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				prompt_changes.$$scope = { dirty, ctx };
    			}

    			prompt.$set(prompt_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prompt.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prompt.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(prompt);
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

    function instance$1($$self, $$props, $$invalidate) {
    	const { sites } = config;
    	const categoriesRaw = sites.map(site => site.category);
    	const distinctCategories = [...new Set(categoriesRaw)];

    	//console.log(distinctCategories);
    	const categories = distinctCategories;

    	const func = (category, site) => site.category === category && site.hidden !== true;

    	$$self.$capture_state = () => ({
    		Prompt,
    		config,
    		sites,
    		categoriesRaw,
    		distinctCategories,
    		categories,
    		Set
    	});

    	return [sites, categories, categoriesRaw, distinctCategories, func];
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$1.name
    		});
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

    /* src\components\Suggestions.svelte generated by Svelte v3.19.1 */
    const file$2 = "src\\components\\Suggestions.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (14:4) {#each suggestions as suggestion, i}
    function create_each_block$1(ctx) {
    	let li;
    	let a;
    	let raw_value = /*suggestion*/ ctx[3].replace(/*search*/ ctx[0].match(/\b.+\b/), `<b style='text-decoration:underline';>${/*search*/ ctx[0].trimEnd()}</b>`) + "";
    	let a_href_value;
    	let t;
    	let li_id_value;
    	let dispose;

    	function focus_handler(...args) {
    		return /*focus_handler*/ ctx[2](/*suggestion*/ ctx[3], ...args);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = space();
    			attr_dev(a, "href", a_href_value = parseInput(/*suggestion*/ ctx[3]));
    			add_location(a, file$2, 15, 8, 304);
    			attr_dev(li, "id", li_id_value = "search-suggestion-" + /*i*/ ctx[5]);
    			attr_dev(li, "class", "search-suggestion");
    			add_location(li, file$2, 14, 6, 234);
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
    			if (dirty & /*suggestions, search*/ 3 && raw_value !== (raw_value = /*suggestion*/ ctx[3].replace(/*search*/ ctx[0].match(/\b.+\b/), `<b style='text-decoration:underline';>${/*search*/ ctx[0].trimEnd()}</b>`) + "")) a.innerHTML = raw_value;
    			if (dirty & /*suggestions*/ 2 && a_href_value !== (a_href_value = parseInput(/*suggestion*/ ctx[3]))) {
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
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(14:4) {#each suggestions as suggestion, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let aside;
    	let ul;
    	let each_value = /*suggestions*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "id", "list");
    			add_location(ul, file$2, 12, 2, 170);
    			attr_dev(aside, "class", "tree");
    			add_location(aside, file$2, 11, 0, 146);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			append_dev(aside, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*parseInput, suggestions, search*/ 3) {
    				each_value = /*suggestions*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
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
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const mouseover_handler = event => event.target.addEventListener("mousemove", event => event.target.focus());

    function instance$2($$self, $$props, $$invalidate) {
    	let { search } = $$props;
    	let { suggestions } = $$props;
    	const writable_props = ["search", "suggestions"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Suggestions> was created with unknown prop '${key}'`);
    	});

    	const focus_handler = suggestion => $$invalidate(0, search = suggestion);

    	$$self.$set = $$props => {
    		if ("search" in $$props) $$invalidate(0, search = $$props.search);
    		if ("suggestions" in $$props) $$invalidate(1, suggestions = $$props.suggestions);
    	};

    	$$self.$capture_state = () => ({ parseInput, search, suggestions });

    	$$self.$inject_state = $$props => {
    		if ("search" in $$props) $$invalidate(0, search = $$props.search);
    		if ("suggestions" in $$props) $$invalidate(1, suggestions = $$props.suggestions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [search, suggestions, focus_handler];
    }

    class Suggestions extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { search: 0, suggestions: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Suggestions",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*search*/ ctx[0] === undefined && !("search" in props)) {
    			console.warn("<Suggestions> was created without expected prop 'search'");
    		}

    		if (/*suggestions*/ ctx[1] === undefined && !("suggestions" in props)) {
    			console.warn("<Suggestions> was created without expected prop 'suggestions'");
    		}
    	}

    	get search() {
    		throw new Error("<Suggestions>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set search(value) {
    		throw new Error("<Suggestions>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get suggestions() {
    		throw new Error("<Suggestions>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set suggestions(value) {
    		throw new Error("<Suggestions>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const changeFocus = element => document.getElementById(element).focus();

    function keyHandler(event) {
      //console.log(event.key);
      const searchInput = document.getElementById("search-input");
      const suggestionClass = document.getElementsByClassName("search-suggestion");
      // Change focus as if ArrowUp === Shitf+Tab & Change focus as if ArrowDown === Tab
      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (document.activeElement === searchInput) {
          suggestionClass[suggestionClass.length - 1].firstElementChild.focus();
        } else {
          document.activeElement.parentElement.previousElementSibling
            ? document.activeElement.parentElement.previousElementSibling.firstElementChild.focus()
            : searchInput.focus();
        }
      } else if (event.key === "ArrowDown") {
        if (document.activeElement === searchInput) {
          suggestionClass[0].firstElementChild.focus();
        } else {
          document.activeElement.parentElement.nextElementSibling
            ? document.activeElement.parentElement.nextElementSibling.firstElementChild.focus()
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
      // else if (event.key === "Spacebar" || event.code === "Space") {
      //   if (document.activeElement.id !== "search-input") {
      //     setSearch(document.activeElement.textContent);
      //     changeFocus("search-input");
      //   }
      // }

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

    /* src\components\Search.svelte generated by Svelte v3.19.1 */

    const { window: window_1 } = globals;
    const file$3 = "src\\components\\Search.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (56:2) <Prompt>
    function create_default_slot$1(ctx) {
    	let form;
    	let input;
    	let dispose;

    	const block = {
    		c: function create() {
    			form = element("form");
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "search-input");
    			attr_dev(input, "class", "svelte-5ay4fv");
    			add_location(input, file$3, 62, 6, 1508);
    			attr_dev(form, "autocapitalize", "none");
    			attr_dev(form, "autocomplete", "off");
    			attr_dev(form, "autocorrect", "off");
    			attr_dev(form, "spellcheck", "false");
    			attr_dev(form, "class", "svelte-5ay4fv");
    			add_location(form, file$3, 56, 4, 1265);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, input);
    			set_input_value(input, /*search*/ ctx[0]);

    			dispose = [
    				listen_dev(input, "keyup", /*fetchSuggestions*/ ctx[2], false, false, false),
    				listen_dev(input, "input", /*input_input_handler*/ ctx[4]),
    				listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[5]), false, true, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*search*/ 1 && input.value !== /*search*/ ctx[0]) {
    				set_input_value(input, /*search*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(56:2) <Prompt>",
    		ctx
    	});

    	return block;
    }

    // (70:2) {#if suggestions.length > 0}
    function create_if_block(ctx) {
    	let aside;
    	let ul;
    	let each_value = /*suggestions*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "id", "search-suggestions");
    			add_location(ul, file$3, 71, 6, 1723);
    			attr_dev(aside, "class", "tree");
    			add_location(aside, file$3, 70, 4, 1695);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			append_dev(aside, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*parseInput, suggestions, document, search*/ 3) {
    				each_value = /*suggestions*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
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
    		source: "(70:2) {#if suggestions.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (73:8) {#each suggestions as suggestion}
    function create_each_block$2(ctx) {
    	let li;
    	let a;
    	let raw_value = /*suggestion*/ ctx[6].replace(/*search*/ ctx[0].match(/\b.+\b/), `<b style="text-decoration:underline;">${/*search*/ ctx[0].trim()}</b>`) + "";
    	let a_href_value;
    	let t;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = space();
    			attr_dev(a, "href", a_href_value = parseInput(/*suggestion*/ ctx[6]));
    			add_location(a, file$3, 74, 12, 1850);
    			attr_dev(li, "class", "search-suggestion");
    			add_location(li, file$3, 73, 10, 1806);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			a.innerHTML = raw_value;
    			append_dev(li, t);

    			dispose = [
    				listen_dev(
    					a,
    					"focus",
    					function () {
    						if (is_function(document.getElementById("search-input").value = /*suggestion*/ ctx[6])) (document.getElementById("search-input").value = /*suggestion*/ ctx[6]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				),
    				listen_dev(a, "mouseover", mouseover_handler$1, false, false, false)
    			];
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*suggestions, search*/ 3 && raw_value !== (raw_value = /*suggestion*/ ctx[6].replace(/*search*/ ctx[0].match(/\b.+\b/), `<b style="text-decoration:underline;">${/*search*/ ctx[0].trim()}</b>`) + "")) a.innerHTML = raw_value;
    			if (dirty & /*suggestions*/ 2 && a_href_value !== (a_href_value = parseInput(/*suggestion*/ ctx[6]))) {
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
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(73:8) {#each suggestions as suggestion}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let section;
    	let t;
    	let current;
    	let dispose;

    	const prompt = new Prompt({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*suggestions*/ ctx[1].length > 0 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(prompt.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			add_location(section, file$3, 54, 0, 1238);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(prompt, section, null);
    			append_dev(section, t);
    			if (if_block) if_block.m(section, null);
    			current = true;
    			dispose = listen_dev(window_1, "keydown", /*escHandler*/ ctx[3], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			const prompt_changes = {};

    			if (dirty & /*$$scope, search*/ 513) {
    				prompt_changes.$$scope = { dirty, ctx };
    			}

    			prompt.$set(prompt_changes);

    			if (/*suggestions*/ ctx[1].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(section, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prompt.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prompt.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(prompt);
    			if (if_block) if_block.d();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const mouseover_handler$1 = event => event.target.addEventListener("mousemove", event => event.target.focus());

    function instance$3($$self, $$props, $$invalidate) {
    	let search = "";
    	let suggestions = [];

    	async function fetchSuggestions() {
    		const query = search.includes(":") ? search.split(":")[1] : search;

    		if (search.length === 0) {
    			$$invalidate(1, suggestions = []);
    		} else {
    			const response = await fetchJsonp("https://suggestqueries.google.com/complete/search?client=firefox&q=" + query);
    			const json = await response.json();
    			$$invalidate(1, suggestions = json[1].slice(0, 8));
    		}
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

    	function input_input_handler() {
    		search = this.value;
    		$$invalidate(0, search);
    	}

    	const submit_handler = () => window.location.href = parseInput(document.getElementById("search-input").value);

    	$$self.$capture_state = () => ({
    		fetchJsonp,
    		Prompt,
    		Suggestions,
    		keyHandler,
    		parseInput,
    		search,
    		suggestions,
    		fetchSuggestions,
    		escHandler
    	});

    	$$self.$inject_state = $$props => {
    		if ("search" in $$props) $$invalidate(0, search = $$props.search);
    		if ("suggestions" in $$props) $$invalidate(1, suggestions = $$props.suggestions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		search,
    		suggestions,
    		fetchSuggestions,
    		escHandler,
    		input_input_handler,
    		submit_handler
    	];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.19.1 */
    const file$4 = "src\\App.svelte";

    function create_fragment$4(ctx) {
    	let main;
    	let t;
    	let current;
    	let dispose;
    	const list = new List({ $$inline: true });
    	const search_1 = new Search({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(list.$$.fragment);
    			t = space();
    			create_component(search_1.$$.fragment);
    			attr_dev(main, "class", "svelte-ds4x0b");
    			add_location(main, file$4, 124, 0, 2280);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(list, main, null);
    			append_dev(main, t);
    			mount_component(search_1, main, null);
    			current = true;
    			dispose = listen_dev(window, "keydown", keyHandler, false, false, false);
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(list.$$.fragment, local);
    			transition_in(search_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(list.$$.fragment, local);
    			transition_out(search_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(list);
    			destroy_component(search_1);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function escHandler(event) {
    	// Listen for esc
    	if (event.key === "Escape") {
    		// If search-input is focused and has a value, zero it out
    		if (search.length > 0) {
    			search = "";
    		}
    	}
    }

    function instance$4($$self, $$props, $$invalidate) {
    	$$self.$capture_state = () => ({
    		fetchJsonp,
    		List,
    		Search,
    		keyHandler,
    		escHandler,
    		search
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$4.name
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
