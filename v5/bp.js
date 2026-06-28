// very thin wrapper to establish bp namespace and ability to load apps dynamically
const bp = {};

if (typeof window !== 'undefined') {
    window.bp = bp;
}

bp.version = '7.2.4';
bp.log = console.log;
bp.log = function noop() { }
bp.error = console.error;
bp.reportError = function noop() { }
bp.mode = 'dev';

// check if current url is buddypond or has ?prod=true
if (window.location.href.includes('buddypond') || window.location.href.includes('?prod=true')) {
    bp.mode = 'prod';
}

bp.config = { host: "" };

const localIp = window.location.origin;

// Endpoint Constants
const ENDPOINTS = {
  host: 'https://buddypond.com',
  api: 'https://buddypond.com/api/buddylist',
  cdn: 'https://files.buddypond.com',
  admin: 'https://buddypond.com/api/admin',
  apiKeys: 'https://buddypond.com/api/api-keys',
  apps: 'https://buddypond.com/api/apps',
  coin: 'https://buddypond.com/api/coin',
  gamblor: 'https://gamblor.buddypond.com/api/v6',
  imageSearch: 'https://buddypond.com/api/image-search',
  portfolio: 'https://buddypond.com/api/portfolio',
  orderbook: 'https://buddypond.com/api/orderbook',
  messagesApi: 'https://buddypond.com/api/messages',
  uploads: 'https://buddypond.com/api/uploads',
  errors: 'https://buddypond.com/api/errors',
  randolph: 'https://buddypond.com/api/randolph',
  buddyProxy: 'https://buddypond.com/api/proxy',
  buddylistWs: 'wss://buddypond.com/api/buddylist/ws/buddylist',
  fishing: 'https://buddypond.com/api/fishing',
  chessWs: 'wss://buddypond.com/api/chess/ws/chess',
  messagesWs: 'wss://buddypond.com/api/messages/ws/messages',
  pondsWs: 'wss://buddypond.com/api/messages/ws/ponds',
  tweetsWs: 'wss://tweets.buddypond.com/api/tweets/ws/tweets',
  videoChat: 'wss://videochat.buddypond.com/api/videochat/ws'
};

const DEV_ENDPOINTS = {
  host: localIp,
  admin: `${localIp}:8789/api/admin`,
  api: `${localIp}:8787/api/buddylist`,
  apps: `${localIp}:9008/api/apps`,
  apiKeys: `${localIp}:9009/api/api-keys`,
  buddyProxy: `${localIp}:9007/api/proxy`,
  coin: `${localIp}:9001/api/coin`,
  errors: `${localIp}:9010/api/errors`,
  gamblor: `${localIp}:9012/api/gamblor`,
  imageSearch: `${localIp}:9005/api/image-search`,
  messagesApi: `${localIp}:8788/api/messages`,
  orderbook: `${localIp}:9003/api/orderbook`,
  portfolio: `${localIp}:9002/api/portfolio`,
  randolph: `${localIp}:8889/api/randolph`,
  uploads: `${localIp}:9004/api/uploads`,
  fishing: `${localIp}:9999/api/fishing`,
  videoChat: 'wss://192.168.200.59:8001/videochat/ws',
  buddylistWs: `${localIp.replace('http://', 'ws://')}:8787/api/buddylist/ws/buddylist`,
  chessWs: `${localIp.replace('http://', 'ws://')}:5556/api/chess/ws/chess`,
  messagesWs: `${localIp.replace('http://', 'ws://')}:8788/api/messages/ws/messages`,
  pondsWs: `${localIp.replace('http://', 'ws://')}:8788/api/messages/ws/ponds`,
  tweetsWs: `${localIp.replace('http://', 'ws://')}:9020/api/tweets/ws/tweets`,
}

// Initialize application configuration based on environment
function configureEnvironment(env = 'prod') {
  if (env === 'prod') {
    return ENDPOINTS;
  }
  return DEV_ENDPOINTS
}

// Assign endpoints to buddypond object
function assignBuddyPondEndpoints(endpoints) {
  console.log('assignBuddyPondEndpoints', endpoints);
  buddypond.host = endpoints.host;
  buddypond.endpoint = endpoints.api;
  buddypond.messagesWsEndpoint = endpoints.messagesWs;
  buddypond.pondsWsEndpoint = endpoints.pondsWs;
  buddypond.tweetsWsEndpoint = endpoints.tweetsWs;
  buddypond.messagesApiEndpoint = endpoints.messagesApi;
  buddypond.buddylistWsEndpoint = endpoints.buddylistWs;
  buddypond.adminEndpoint = endpoints.admin;
  buddypond.errorsEndpoint = endpoints.errors;
  buddypond.uploadsEndpoint = endpoints.uploads;
  buddypond.portfolioEndpoint = endpoints.portfolio;
  buddypond.coinEndpoint = endpoints.coin;
  buddypond.randolphEndpoint = endpoints.randolph;
  buddypond.imageSearchEndpoint = endpoints.imageSearch;
  buddypond.buddyProxy = endpoints.buddyProxy;
  buddypond.appsEndpoint = endpoints.apps;
  buddypond.apiKeysEndpoint = endpoints.apiKeys;
  buddypond.chessWsEndpoint = endpoints.chessWs;
  buddypond.gamblorEndpoint = endpoints.gamblor;
  buddypond.fishingEndpoint = endpoints.fishing;
  buddypond.videoChatEndpoint = endpoints.videoChat;
}


bp.apps = {};
bp.data = {};     // stores data specific to the bp instance itself ( not yet, stored per app )
bp.settings = {}; // stores app settings for the user ( preferences, defaults, etc )
bp._modules = {};
bp.vendor = {}; // stores vendor specific imported modules 
bp._cache = {};
bp._cache.css = {};
bp._cache.html = {};
bp._cache.js = {};

bp.setConfig = function setConfig(config, softApply = false) {
    // console.log('setConfig', config, softApply);
    if (softApply) {
        bp.config = { ...bp.config, ...config };
    } else {
        bp.config = config;
    }
}

bp.init = async function init(config = {}) {
  // loads the default / required apps and deps for buddypond to function
  // load jQuery from /desktop/assets/js/jquery.min.js
  if (typeof config.host === 'undefined') {
    config.host = 'https://buddypond.com';
  }
  bp.config.host = config.host;
  // buddypond API client
  // TODO: we should be able to remove this, move it to client dep?
  await bp.appendScript('/v5/apps/based/client/lib/api.js', false, true);
  let endpoints = configureEnvironment(config.env);
  // endpoints = configureDiscordMode(endpoints);
  console.log(endpoints)
  // endpoints.host = DEV_ENDPOINTS.host; // manaul override for development
  // console.log(endpoints);
  assignBuddyPondEndpoints(endpoints);

  bp.setConfig(endpoints);
  bp.config.host = config.host; // ensure host is always set

  /* TODO: load scripts in parallel
  await Promise.all([

  ]);
  */
  await bp.appendScript('/desktop/assets/js/jquery.min.js');
  await bp.appendCSS(bp.config.host + '/desktop/assets/css/desktop.css', false, true);
  await bp.start(['ui', 'client', 'localstorage', 'themes', 'buddyscript']);
  await bp.load('apps')
  await bp.appendScript(bp.config.host + '/v5/vendor/flexHide.js');
  await bp.appendScript(bp.config.host + '/desktop/assets/js/jquery-ui.min.js');
  await bp.appendCSS(bp.config.host + '/desktop/assets/css/jquery-ui.min.css', false, true);

}

// Remark: Start may be better off removed, just use Promise.all() instead
bp.start = async function start(apps = []) {
    for (let app of apps) {
        await bp.importModule(app);
    }
}

// Allows lookup of apps by name or alias
bp.findApp = function findApp(appName) {
  // searches bp.apps.list for appName directly or in alias array
  let result = null;
  if (bp.apps.list) {
      let appList = bp.apps.list;
      // iterate through all entries in appList and see if appName matches any entries in alias array
      for (let key in appList) {
          let appData = bp.apps.list[key];
          if (key === appName) {
              result = key;
              break;
          }
          if (appData && appData.alias && Array.isArray(appData.alias) && appData.alias.includes(appName)) {
              result = key; // found an alias
              break;
          }
      }
  }
  return result;
}

// example usage: bp.open(['buddylist', { name: 'clock' }, 'entity']);
bp.open = async function open(app, config = { context: 'default' }) {
    // console.log('bp.open', app, config)
    let appName = app;
    if (typeof app === 'string') {

        // allows app lookup by id or alias
        let result = bp.findApp(appName);

        if (result) {
            appName = result;
        }

        /*
        // See if the requested app is an alias in the desktop appList
        // This allows for loading apps by their alias names
        if (this.apps.list && this.apps.list) {
            let appList = this.apps.list;
            // iterate through all entries in appList and see if appName matches any entries in alias array
            for (let key in appList) {
                let appData = this.apps.list[key];
                if (appData && appData.alias && Array.isArray(appData.alias) && appData.alias.includes(appName)) {
                    appName = key; // found an alias
                    break;
                }
            }
        }
        */

        // console.log('string loading async import app', appName);
        try {
            await bp.importModule(appName, {}, true);
        } catch (error) {
            console.log('Failed to load app:', appName, error);
        }

    }
    if (typeof app === 'object') {
        appName = app.name;
        config = app;
        // console.log('object loading async import app', appName, config);
        await bp.importModule(appName, config, true);
    }

    if (bp.apps[appName] && typeof bp.apps[appName].open === 'function') {
        // console.log('open', appName, config)
        let _window = await bp.apps[appName].open(config);
        if (_window && typeof _window.focus === 'function') { // focus the window if it was created
            // TODO: This may be causing focus issues for some windows overriding custom focus logic in onOpen() handlers
            _window.focus();
        }
        return _window;
    }
}

bp.close = async function close(appName) {
    if (bp.apps[appName] && typeof bp.apps[appName].close === 'function') {
        await bp.apps[appName].close();
    }
}

// bp.load will delegate to correct provider based on resource type
// in most cases this will be by file extension or object shape
bp.load = async function load(resource, config = {}) {
    // check to see if resource is a string
    if (typeof resource === 'string') {
        if (resource.endsWith('.css')) {
            return bp.appendCSS(resource);
        }
        if (resource.endsWith('.html')) {
            return bp.fetchHTMLFragment(resource);
        }
        if (resource.endsWith('.js')) {
            return bp.appendScript(resource);
        }
        if (resource.endsWith('.json')) {
            return bp.fetchJSON(resource);
        }
        // check to see if there is no file extension
        if (!resource.includes('.')) {
            return bp.importModule(resource, config);
        }
    }

    console.log('Cannot load unknown resource type', resource);

}

bp.importModule = async function importModule(app, config, buddypond = true, cb) {
    // console.log('importModule', app, config, buddypond);
    // console.log('host', bp.config.host, 'version', bp.version);
    let modulePath = bp.config.host + `/v5/apps/based/${app}/${app}.js`;

    let appName = app;

    if (typeof app === 'object') {
        config = app;
        appName = app.name;
        app = appName;
    }

    if (bp.mode === 'prod') {
        if (modulePath.includes('/card/cards')) {
            modulePath = bp.config.host + `/v5/dist/apps/based/${app}`;
            modulePath = modulePath.replace('apps/based/v5', '');
        } else {
            modulePath = bp.config.host + `/v5/dist/apps/based/${app}.js`;
        }
    } else {
        // in dev mode, we use the local path directly
        modulePath = bp.config.host + `/v5/apps/based/${app}/${app}.js`;
    }

    if (window.discordMode) {
        modulePath = bp.config.host + `/.proxy/v5/apps/based/${app}/${app}.js`;
    }

    if (!buddypond) {
        modulePath = bp.config.host + app;
    }

    modulePath += '?v=' + bp.version; // append version to URL to prevent caching issues
    // console.log('importModule modulePath', modulePath, app, config, buddypond);

    // Check if the module has already been loaded
    if (bp._modules[modulePath]) {
        // console.log('module already loaded', app);
        return bp._modules[modulePath];
    }

    // The app is not cached / has not yet been loaded, so we will attempt to load it
    if (buddypond) { // only show loading if we are loading a buddypond app ( not all remote apps )
        bp.emit('bp::loading', appName);
    }

    try {
        // console.log('attempting to load module', modulePath);
        let module = await import(/* @vite-ignore */modulePath);
        if (buddypond) {
            // console.log(JSON.stringify(config));
            bp.apps[appName] = new module.default(bp, config);
            if (typeof bp.apps[appName].init === 'function') {
                await bp.apps[appName].init(config);
                bp.log('init complete', appName);
                //console.log('addCommand', appName);
                /* TODO: we could have default commands ( help etc ) for all apps
                bp.apps.buddyscript.addCommand(appName, (context) => {
                    console.log('show appName', appName);
                    return `Echo: ${context}`;
                });
                */

            } else {
                bp.log('no init function found', appName);
            }
            if (cb) {
                bp.emit('bp::loaded', appName, module);
                cb(bp.apps[appName]);
            }

        }
        bp._modules[modulePath] = module;
        // console.log('module loaded', module);
        return module;
    } catch (error) {
        bp.error('Failed to load module:', appName, error);
        delete bp.apps[appName]; // just in case
    }

}


bp.fetchHTMLFragment = async function fetchHTMLFragment(url) {
    // TOOD: only use absolute urls here, host should not be needed at this stage
    // TODO: might be best to default to host if no protocol is present
    // TODO: cache request, do not reload unless forced
    let fullUrl = `${url}`;
    if (window.discordMode) {
        // discord mode requires we proxy the request
        fullUrl = `/.proxy/${url}`;
    }
    fullUrl = bp.config.host + fullUrl;
    fullUrl += '?v=' + bp.version; // append version to URL to prevent caching issues
    // console.log('fetchHTMLFragment', fullUrl);
    if (bp._cache.html[fullUrl]) {
        return bp._cache.html[fullUrl];
    }
    bp._cache.html[fullUrl] = await fetch(fullUrl).then(response => response.text());
    return bp._cache.html[fullUrl];
}

bp.fetchJSON = async function fetchJSON(url) {
    // no caching for JSON ( by default )
    // absolute url by default
    return fetch(url).then(response => response.json());
}

bp.appendCSS = async function appendCSS(url, forceReload = false, forceRemote = false) {

    let fullUrl = url;
    // If it's not absolute or blob, it's local
    if (!url.startsWith('http') && !url.startsWith('blob:')) {
        if (bp.mode === 'prod' && forceRemote !== true) {
            const trimmedUrl = url.replace(/^\.\//, '').replace(/\.css$/, '');
            let cssPath = trimmedUrl;
            // TODO: will need map of other nested-style apps ( currently only cards )
            if (trimmedUrl.includes('/card/')) {
                cssPath = `${trimmedUrl}`;
            } else {
                // If it doesn't include /card/, assume it's a regular app
                const lastSlashIndex = trimmedUrl.lastIndexOf('/');
                if (lastSlashIndex !== -1) {
                    cssPath = trimmedUrl.substring(0, lastSlashIndex);
                }
            }
            cssPath = cssPath.replace('/v5', ''); // remove v5 from the path if present
            fullUrl = `${bp.config.host}/v5/dist/${cssPath}.css`;
        } else {
            // in dev mode, we use the local path directly
            fullUrl = `${bp.config.host}${url}`;
        }
    }

    fullUrl += '?v=' + bp.version; // append version to URL to prevent caching issues
    // console.log('appendCSS fullUrl', fullUrl);  
    if (bp._cache.css[fullUrl]) {
        if (!forceReload) {
            return 'cached';
        }
    }

    bp._cache.css[fullUrl] = new Date().getTime();
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fullUrl;

    // Don't return the promise until the CSS is loaded or fails
    return new Promise((resolve, reject) => {
        // Handle successful load
        link.onload = () => {
            resolve('loaded');
        };
        // Handle load failure
        link.onerror = () => {
            reject(new Error(`Failed to load CSS from ${fullUrl}`));
        };
        document.head.appendChild(link);
    });

}

bp.appendScript = async function appendScript(url) {
    let fullUrl = url;
    if (!url.includes('http') && !url.includes('blob')) {
        fullUrl = `${bp.config.host}${url}`;
    }

    // check cache if script was already loaded
    fullUrl += '?v=' + bp.version; // append version to URL to prevent caching issues
    if (bp._cache.js[fullUrl]) {
        return 'cached';
    }
    bp._cache.js[fullUrl] = new Date().getTime();

    // fetching JS should immediately apply to the document
    // Remark: We could check for duplicates here based on the URL
    // Better in dev mode to always fetch the JS and write it to the document
    // if (!document.querySelector(`script[src="${url}"]`)) {
    let script = document.createElement('script');
    script.src = fullUrl;
    // console.log('appendScript', fullUrl);
    document.head.appendChild(script);
    // on load resolve promise
    return new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
    });
}

bp.createWorker = async function createWorker(url, config = {}) {
    let fullUrl = `${bp.config.host}/v5${url}`;

    bp.log('createWorker', fullUrl);
    try {
        const response = await fetch(fullUrl);
        const blob = await response.blob();
        const workerScriptUrl = URL.createObjectURL(blob);
        let workerConfig = config || {};
        const worker = new Worker(workerScriptUrl, workerConfig);
        bp.log('Local Worker created from:', url);
        return worker;
    } catch (error) {
        console.error('Failed to load worker script:', url, error);
        return null; // Return null if the worker failed to load
    }
}

// Create a simple event emitter on bp
bp._emitters = {};

bp.emit = function emit(event, ...args) {
    // Log the emission of the event with all its arguments
    bp.log('emit', event, ...args);

    // Check if there are any registered emitters for the event
    if (bp._emitters[event]) {
        // Call each registered callback with the provided arguments
        bp._emitters[event].forEach(emitter => {
            if (emitter.callback) {
                emitter.callback(...args);
            }
        });
    }
}

bp.on = function on(event, label, callback) {
    if (!event || !label || !callback) {
        throw new Error('Missing required parameters for on(). Try: bp.on(event, label, callback). All Event Emitter require a label');
    }
    // Listen for events with a label
    if (!bp._emitters[event]) {
        bp._emitters[event] = [];
    }
    bp._emitters[event].push({ label: label, callback: callback });
    bp.log('on', event, label);
}

bp.off = function off(event, label) {
    // Stop listening for events with a specific label
    bp.log('off', event, label);
    if (bp._emitters[event]) {
        bp._emitters[event] = bp._emitters[event].filter(emitter => emitter.label !== label);
    }
}

bp.set = function set(key, value) {
    const keys = key.split('.');
    let current = bp.settings;
    let path = '';

    // Process each key in the path except for the last one
    keys.slice(0, -1).forEach((key, index) => {
        // Only add a dot if it's not the first iteration
        path += (index > 0 ? '.' : '') + key;
        if (!current[key]) {
            current[key] = {}; // Initialize a new object if the key does not exist
        }
        current = current[key];
        // Emit a change event for each part of the path being traversed
        bp.emit(`settings::${path}`, current);
    });

    const finalKey = keys[keys.length - 1];

    // Only append a dot if path is not empty (meaning there are multiple keys)
    path += (path ? '.' : '') + finalKey;
    current[finalKey] = value;

    // Emit event for the final key change
    bp.emit(`settings`, key, value);
    bp.emit(`settings::${path}`, value);
};

bp.get = function get(key) {
    const keys = key.split('.');
    let current = bp.settings;
    for (const k of keys) {
        if (current[k] === undefined) {
            return undefined; // If the key doesn't exist, return undefined
        }
        current = current[k];
    }
    return current;
};


// bp.play is implemented in user-space
bp.play = async function lazyLoadPlayModule() {
    // will lazy load 'play' module and override this function with play logic
    await bp.importModule('play');
    // now immediately call play again with same arguments
    bp.play.call(this, ...arguments);
};

bp.focus = function noop() { };

bp.isMobile = function isTouchDevice() {
    if (window.discordView) {
        // return true;
    }
    const maxMobileWidth = 767; // Common mobile breakpoint (in pixels)
    return (
        (window.innerWidth <= maxMobileWidth) &&
        (
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
        )
    );
}

// Identify the current user
bp.me = 'Guest'; // Guest user by default // TODO: auth / login

export default bp;


//bp.apps.ui.loadDocumentBody();


/*

Example:

await bp.start(['game', 'system', 'entity']);

let ent = bp.apps.entity.createEntity(config)
also
let ent = bp.createEntity(config);
bp.removeEntity(ent.id)

  bp.make = function() {
    return new game.EntityBuilder(game);
  };


let ent = bp.make()
    .type('MY_TYPE') // Example entity type
    .name('a-thing')
    .kind('Warrior')
    .position(0, 50)
    .startingPosition(0, 0)
    .body(true)
    .velocity(0, -15)
    .rotation(Math.PI / 2) // in Radians
    .angle(45)  // in Degrees
    .mass(10)
    .density(1.2)
    .health(100)
    .score(0)
    .size(32, 32, 32) // Example for 3D game; omit depth for 2D
    .radius(8) // If applicable, for circular entities
    .shape('rectangle') // 'circle', 'polygon', etc.
    .color('red')
    .texture({
      sheet: 'blackMage',
      sprite: 'playerRight',
    })
    .style({ border: '1px solid red' }) // CSS-like style object
    .maxSpeed(10)
    //.owner('player1')
    .hasInventory(false)
    .isSensor(false)
    .isStatic(false)
    .pointerdown(() => updateCounter('pointerdown'))
    .collisionStart(() => updateCounter('collisionStart'))
    .collisionActive(() => updateCounter('collisionActive'))
    .collisionEnd(() => updateCounter('collisionEnd'))
    .onUpdate(() => updateCounter('onUpdate'))
    .meta({ level: 1, faction: 'allies' })
    .text('Hello World')
    .clone(33) // Create 11 clones of the entity with the specified configuration
    
    
  entityConfig.createEntity();

  console.log(bp.data.ents)...



BP.apps.buddylist.sendBuddyRequest('buddy1');
BP.apps.buddylist.acceptBuddyRequest('buddy1');
BP.apps.buddylist.sendMessage('buddy1', 'hello');

BP.apps.buddylist.on('message', (data) => {
    console.log('message', data);
});

BP.apps.buddylist.on('buddyrequest', (data) => {
    console.log('buddyrequest', data);
});

BP.apps.buddylist.on('buddyaccept', (data) => {
    console.log('buddyaccept', data);
});


*/

