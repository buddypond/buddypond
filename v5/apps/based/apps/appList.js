export default {
  "admin": {
    name: 'admin',
    icon: `desktop/assets/images/icons/icon_admin_64.webp`,
    label: 'Admin',
    "onClick": "bp.open('admin')",
    adminOnly: true,
  },
  "profile": {
    "icon": "desktop/assets/images/icons/icon_myprofile_64.webp",
    "label": "My Profile",
    "description": "Manage your profile and settings",
    "onClick": "bp.open('profile')",
    "categories": ["social", "productivity"]
  },
  "buddylist": {
    "icon": "desktop/assets/images/icons/icon_profile_64.webp",
    "label": "BuddyList",
    "description": "View and manage your contacts",
    "onClick": "bp.open('buddylist')",
    "categories": ["social", "community"]
  },
  "buddybux": {
    "icon": "desktop/assets/images/icons/icon_buddybux_64.webp",
    "label": "BuddyBux",
    "description": "Manage your BuddyBux currency",
    "onClick": "bp.open('buddybux')",
    "categories": ["finance", "community"],
    "enumerable": false
  },
  "crafting": {
    "icon": "desktop/assets/images/icons/icon_crafting_64.webp",
    "label": "Crafting",
    "description": "Create and manage crafted items",
    "onClick": "bp.open('crafting')",
    "categories": ["creative", "community"]
  },
  "market": {
    "icon": "desktop/assets/images/icons/icon_market_64.webp",
    "label": "Market",
    "adminOnly": true,
    "description": "Buy and sell items in the marketplace",
    "onClick": "bp.open('market')",
    "categories": ["finance", "community"]
  },
  "pad": {
    "icon": "desktop/assets/images/icons/icon_pad_64.webp",
    "label": "Buddy Apps",
    "description": "Create hosted Apps for Buddy Pond",
    "onClick": "bp.open('pad')",
    "categories": ["productivity", "creative", "community"],
    "alias": ["buddy-apps", "apps"]
  },
  "pond": {
    "icon": "desktop/assets/images/icons/icon_pond_64.webp",
    "label": "Ponds",
    "description": "Explore shared content or communities",
    "onClick": "bp.open('pond')",
    "categories": ["community", "social"]
  },
  "tweets": {
    "icon": "desktop/assets/images/icons/icon_tweets_64.webp",
    "label": "Tweets",
    "description": "View and post tweets",
    "categories": ["social", "community"],
    "author": "BuddyPond",
  },
  "file-explorer": {
    "icon": "desktop/assets/images/icons/icon_file-explorer_64.webp",
    "label": "Buddy Files",
    "description": "Browse and manage your files",
    "onClick": "bp.open('file-explorer')",
    "desktopOnly": true,
    "categories": ["files", "productivity"],
    "alias": ["buddy-files", "files"]
  },
  "plays-doodle-jump-extra": {
    "icon": "desktop/assets/images/icons/icon_doodle-jump-extra_64.webp",
    "label": "Doodle Jump",
    "description": "Play Doodle Jump Extra game",
    "onClick": "bp.open('doodle-jump-extra')",
    "categories": ["games", "entertainment"],
    "author": "Plays.org",
    "alias": ["doodle-jump"],
  },
  "plays-malpek": {
    "icon": "desktop/assets/images/icons/icon_plays-malpek_64.webp",
    "label": "Malpek",
    "description": "Play Malpek game",
    "onClick": "bp.open('plays-malpek')",
    "categories": ["games", "entertainment"],
    "author": "Plays.org",
    "alias": ["malpek"],
  },
  "emojipop": {
    "icon": "desktop/assets/images/icons/icon_emojipop_64.webp",
    "label": "Emoji Pop",
    "description": "Play Emoji Pop game",
    "onClick": "bp.open('emojipop')",
    "categories": ["games", "entertainment"],
    "author": "GameBoss",
    "alias": ["emojipop", "emoji-pop"]
  },
  "frvr-kittenforce": {
    "icon": "desktop/assets/images/icons/icon_kittenforce-frvr_64.webp",
    "label": "Kitten Force",
    "description": "Play Kitten Force FRVR game",
    "onClick": "bp.open('frvr-kittenforce')",
    "categories": ["games", "entertainment"],
    "author": "FRVR Games",
    "alias": ["kittenforce"]
  },
  "marbleblast": {
    "icon": "desktop/assets/images/icons/icon_marbleblast_64.webp",
    "label": "Marble Blast",
    "description": "Play the Marble Blast game",
    "onClick": "bp.open('marbleblast')",
    "categories": ["games", "entertainment"],
    "author": "Vanilagy",
    "alias": ["marble-blast"]
  },
  "frvr-greed": {
    "icon": "desktop/assets/images/icons/icon_frvr-greed_64.webp",
    "label": "Greed",
    "description": "Play Greedy FRVR game",
    "onClick": "bp.open('frvr-greed')",
    "categories": ["games", "entertainment"],
    "author": "FRVR Games",
    "alias": ["greed"]
  },
  'jutsu-caster': {
    "icon": "desktop/assets/images/icons/icon_jutsu_64.webp",
    "label": "Jutsu Caster",
    "description": "Cast Jutsu spells using hand gestures",
    "onClick": "bp.open('jutsu-caster')",
    "categories": ["tools", "creative", "computer-vision"],
    "author": "BuddyPond",
    "alias": ["jutsu"]
  },
  "editor-monaco": {
    "icon": "desktop/assets/images/icons/icon_vscode_64.webp",
    "label": "Monaco Editor",
    "description": "A powerful code editor",
    "onClick": "bp.open('editor-monaco')",
    "categories": ["productivity", "development"],
    "alias": ["monaco", "editor"]
  },
  "minipaint": {
    "icon": "desktop/assets/images/icons/icon_minipaint_64.webp",
    "label": "miniPaint",
    "author": "ViliusL",
    "description": "Advanced image editor to create and edit images",
    "onClick": "bp.open('minipaint')",
    "categories": ["art", "creative"]
  },

  "patatap": {
    "icon": "desktop/assets/images/icons/icon_patatap_64.webp",
    "label": "Patatap",
    "description": "Create music and animations with touch and keyboard input",
    "onClick": "bp.open('patatap')",
    "categories": ["audio", "music", "creative"],
    "author": "Jono Brandel"
  },
  /*,
  "sequencer": {
    "icon": "desktop/assets/images/icons/icon_sequencer_64.webp",
    "label": "Sequencer",
    "description": "Create and edit music sequences",
    "onClick": "bp.open('sequencer')",
    "categories": ["audio", "music", "creative"],
    "author": "BuddyPond",
  },
  */

  /*
  "sandspiel": {
    "icon": "desktop/assets/images/icons/icon_sandspiel_64.webp",
    "label": "Sandspiel",
    "description": "A creative sandbox game with sand and physics",
    "onClick": "bp.open('sandspiel')",
    "categories": ["games", "creative"]
  },
  */
  "vision-harp": {
    "icon": "desktop/assets/images/icons/icon_vision-harp_64.webp",
    "label": "Vision Harp",
    "description": "Play music using hand gestures",
    "onClick": "bp.open('vision-harp')",
    "categories": ["audio", "computer-vision", "music", "creative"],
    "author": "BuddyPond",
    "alias": ["harp"]
  },
  /*
  "fingerpaint": {
    "icon": "desktop/assets/images/icons/icon_finger-paint_64.webp",
    "label": "Finger Paint",
    "description": "Create art using hand gestures",
    "onClick": "bp.open('fingerpaint')",
    "categories": ["art", "creative", "computer-vision"],
    "author": "BuddyPond",
    "alias": ["hand-paint", "hand-art"]
  },
  */
  "soundrecorder": {
    "icon": "desktop/assets/images/icons/icon_soundrecorder_64.webp",
    "label": "Sound Recorder",
    "author": "Isaiah Odhner",
    "description": "Record and save audio clips",
    "onClick": "bp.open('soundrecorder')",
    "desktopOnly": true,
    "categories": ["audio", "creative"],
    "alias": ["recorder"]
  },
  "youtube": {
    "icon": "desktop/assets/images/icons/icon_interdimensionalcable_64.webp",
    "label": "IDC Cable",
    "description": "Watch and browse YouTube videos",
    "onClick": "bp.open('youtube')",
    "categories": ["entertainment", "media"],
    "alias": ["idc"]
  },
  "camera": {
    "icon": "desktop/assets/images/icons/icon_camera_64.webp",
    "label": "Camera",
    "description": "Capture photos or videos",
    "onClick": "bp.open('camera')",
    "categories": ["media", "creative"]
  },
  "coin": {
    "icon": "desktop/assets/images/icons/icon_coin_64.webp",
    "label": "Buddy Coins",
    "description": "Manage your virtual currency",
    "onClick": "bp.open('coin')",
    "categories": ["finance"]
  },
  "fluid-simulation": {
    "icon": "desktop/assets/images/icons/icon_fluidsimulation_64.webp",
    "author": "Pavel Dobryakov",
    "label": "Fluid Simulation",
    "description": "Interact with a fluid dynamics simulation",
    "onClick": "bp.open('fluid-simulation')",
    "categories": ["creative", "entertainment"],
    "alias": ["fluids"]
  },
  "sampler": {
    "icon": "desktop/assets/images/icons/icon_midifighter_64.webp",
    "label": "Sampler",
    "description": "Create and mix audio samples",
    "onClick": "bp.open('sampler')",
    "categories": ["audio", "music", "creative"]
  },
  "audio-visual": {
    "icon": "desktop/assets/images/icons/icon_visuals_64.webp",
    "author": "lachlanmaclean",
    "label": "Audio Visuals",
    "description": "Experience audio-responsive visuals",
    "onClick": "bp.open('audio-visual')",
    "categories": ["creative", "entertainment", "audio"],
    "alias": ["av"]
  },
  "chalkboard": {
    "icon": "desktop/assets/images/icons/icon_chalkboard_64.webp",
    "label": "Chalkboard",
    "description": "Draw and write on a virtual chalkboard",
    "onClick": "bp.open('chalkboard')",
    "categories": ["art", "creative"],
    "chatWindowButton": ['buddy', 'pond'], // adds this app as a button in the chat window, array is types of windows to add it to
    "chatButton": {
      text: 'Chalkboard',
      image: 'desktop/assets/images/icons/icon_chalkboard_64.webp',
      onclick: async (ev) => {
        let context = ev.target.dataset.context;
        let type = ev.target.dataset.type;
        // Open the image search window
        bp.open('chalkboard', {
          output: type || 'buddy',
          context: context,
        });
        return false;
      }
    }
  },
  "piano": {
    "icon": "desktop/assets/images/icons/icon_piano_64.webp",
    "label": "Piano",
    "description": "Play a virtual piano keyboard",
    "onClick": "bp.open('piano')",
    "desktopOnly": true,
    "categories": ["music", "creative"]
  },
  "bubblepop": {
    "icon": "desktop/assets/images/icons/icon_bubblepop_64.webp",
    "label": "Bubble Pop",
    "description": "Pop bubbles and enjoy the visuals",
    "onClick": "bp.open('bubblepop')",
    "categories": ["games", "entertainment", "computer-vision"],
    "author": "BuddyPond",
    "alias": ["bubblepop"]
  },

  "portfolio": {
    "icon": "desktop/assets/images/icons/icon_portfolio_64.webp",
    "label": "Portfolio",
    "description": "Track your investments and assets",
    "onClick": "bp.open('portfolio')",
    "categories": ["finance"]
  },
  "orderbook": {
    "icon": "desktop/assets/images/icons/icon_orderbook_64.webp",
    "label": "Order Book",
    "description": "Manage your trading orders",
    "onClick": "bp.open('orderbook')",
    "categories": ["finance"],
    "enumerable": false
  },
  "audio-player": {
    "icon": "desktop/assets/images/icons/icon_audio-player_64.webp",
    "label": "Audio Player",
    "description": "Play and manage audio files",
    "onClick": "bp.open('audio-player')",
    "categories": ["media", "audio"]
  },
  /*
  "gifstudio": {
    "icon": "desktop/assets/images/icons/icon_gifstudio_64.webp",
    "label": "Gif Studio",
    "description": "Create and edit GIFs",
    "onClick": "bp.open('gifstudio')",
    "categories": ["media", "creative"]
  },
  */
  "paint": {
    "icon": "desktop/assets/images/icons/icon_paint_64.webp",
    "label": "Paint",
    "author": "Isaiah Odhner",
    "description": "A Classic Retro Style Image Editor",
    "onClick": "bp.open('paint')",
    "categories": ["art", "creative"],
    "chatWindowButton": ['buddy', 'pond'] // adds this app as a button in the chat window, array is types of windows to add it to
  },
  "painterro": {
    "icon": "desktop/assets/images/icons/icon_painterro_64.webp",
    "label": "Painterro",
    "author": "Ivan Borshchov",
    "description": "Easy to use image editing tool",
    "onClick": "bp.open('painterro')",
    "categories": ["art", "creative"]
  },
  /* FRVR Games */
  "frvr-basketball": {
    "icon": "desktop/assets/images/icons/icon_basketball-frvr_64.webp",
    "label": "BasketBall",
    "description": "Play Basketball game",
    "onClick": "bp.open('frvr-basketball')",
    "categories": ["games", "entertainment"],
    "author": "FRVR Games",
    "alias": ["basketball"]
  },
  "frvr-bowlingo": {
    "icon": "desktop/assets/images/icons/icon_frvr-bowlingo_64.webp",
    "label": "Bowlingo",
    "description": "Play Bowlingo game",
    "onClick": "bp.open('frvr-bowlingo')",
    "categories": ["games", "entertainment"],
    "author": "FRVR Games",
    "alias": ["bowling"]
  },
  "mantra": {
    "icon": "desktop/assets/images/icons/icon_mantra_64.webp",
    "label": "Mantra",
    "description": "Play the Mantra game",
    "categories": ["games"]
  },
  "minesweeper": {
    "icon": "desktop/assets/images/icons/icon_minesweeper_64.webp",
    "label": "Minesweeper",
    "description": "Classic Minesweeper puzzle game",
    "categories": ["games"]
  },
  "emulator-nes": {
    "icon": "desktop/assets/images/icons/icon_nes_64.webp",
    "app": "emulator",
    "context": 'nes',
    "label": "NES",
    "description": "Play Nintendo Entertainment System games",
    "options": { "context": "nes" },
    "categories": ["games", "emulators"],
    "author": "LarryD"
  },
  "emulator-sega": {
    "icon": "desktop/assets/images/icons/icon_sega_64.webp",
    "app": "emulator",
    "context": 'sega',
    "label": "Sega",
    "description": "Play Sega console games",
    "options": { "context": "sega" },
    "categories": ["games", "emulators"],
    "author": "LarryD"
  },
  "emulator-snes": {
    "icon": "desktop/assets/images/icons/icon_snes_64.webp",
    "app": "emulator",
    "context": 'snes',
    "label": "SNES",
    "description": "Play Super Nintendo games",
    "options": { "context": "snes" },
    "categories": ["games", "emulators"],
    "author": "LarryD"
  },
  "emulator-atari2600": {
    "icon": "desktop/assets/images/icons/icon_atari2600_64.webp",
    "app": "emulator",
    "context": 'atari2600',
    "label": "Atari 2600",
    "description": "Play Atari 2600 games",
    "options": { "context": "atari2600" },
    "categories": ["games", "emulators"],
    "author": "LarryD"
  },
  "emulator-n64": {
    "icon": "desktop/assets/images/icons/icon_n64_64.webp",
    "app": "emulator",
    "context": 'n64',
    "label": "n64",
    "description": "Play Nintendo 64 games",
    "options": { "context": "n64" },
    "categories": ["games", "emulators"],
    "desktopOnly": true,
    "author": "LarryD"
  },
  "solitaire": {
    "icon": "desktop/assets/images/icons/icon_solitaire_64.webp",
    "label": "Solitaire",
    "description": "Classic Solitaire card game",
    "categories": ["games"]
  },
  "stickman": {
    "icon": "desktop/assets/images/icons/icon_stickman_64.webp",
    "label": "Stickman",
    "description": "Control a stickman using body poses",
    "onClick": "bp.open('stickman')",
    "categories": ["creative", "computer-vision", "entertainment"],
    "author": "BuddyPond",
    "alias": ["stickman"]
  },

  "spellbook": {
    "icon": "desktop/assets/images/icons/icon_spellbook_64.webp",
    "label": "Spellbook",
    "description": "Manage scripts or commands",
    "categories": ["tools", "productivity"]
  },

  "globe": {
    "icon": "desktop/assets/images/icons/icon_globe_64.webp",
    "label": "Globe",
    "description": "Visualize global network data",
    "categories": ["tools"]
  },
  "file-viewer": {
    "icon": "desktop/assets/images/icons/icon_file-viewer_64.webp",
    "label": "File Viewer",
    "description": "View files in various formats",
    "onClick": "bp.open('file-viewer')",
    "categories": ["files", "productivity"]
  },
  "hacker-typer": {
    "icon": "desktop/assets/images/icons/icon_hacker-typer_64.webp",
    "label": "Hack Typer",
    "description": "Simulate hacking with a typing game",
    "categories": ["tools", "games"]
  },
  "hex-editor": {
    "icon": "desktop/assets/images/icons/icon_hex-editor_64.webp",
    "label": "Hex Editor",
    "description": "Edit files in hexadecimal format",
    "categories": ["tools", "productivity"]
  },
  "maps": {
    "icon": "desktop/assets/images/icons/icon_maps_64.webp",
    "label": "Maps",
    "description": "Access mapping and navigation tools",
    "categories": ["tools"]
  },
 
  "screen-recorder": {
    "icon": "desktop/assets/images/icons/icon_screen-recorder_64.webp",
    "label": "Screen Recorder",
    "description": "Record your screen activity",
    "onClick": "bp.open('screen-recorder')",
    "categories": ["tools", "productivity"],
    "desktopOnly": true,
    "author": "BuddyPond"
  },
 
  /*
  */
  "chess": {
    "icon": "desktop/assets/images/icons/icon_chess_64.webp",
    "label": "Chess",
    "description": "Play chess online with friends",
    "onClick": "bp.open('chess')",
    "categories": ["games", "entertainment"],
    "author": "BuddyPond",
    "chatWindowButton": ['buddy'],
    // adds this app as a button in the chat window, array is types of windows to add it to
    "chatButton": {
      text: 'Chalkboard',
      image: 'desktop/assets/images/icons/icon_chess_64.webp',
      onclick: async (ev) => {
        let context = ev.target.dataset.context;
        let type = ev.target.dataset.type;
        // Open the image search window
        await bp.load('chess', {
          output: type || 'buddy',
          context: context,
        });
        bp.apps.chess.sendGameInvite(context);
        return false;
      }
    }
    // "alias": ["buddy-chess"]
  },
  /*
  "virtual-machines": {
    "icon": "desktop/assets/images/icons/icon_virtual-machines_64.webp",
    "label": "Virtual Machines",
    "description": "Run virtual machines in the cloud",
    "onClick": "bp.open('virtual-machines')",
    "categories": ["tools", "productivity"],
    "author": "BuddyPond",
    // "alias": ["vm"]
  },
  */
 /*
  "webllm": {
    "icon": "desktop/assets/images/icons/icon_web_llm_64.webp",
    "label": "Web LLM",
    "description": "Interact with large language models",
    "onClick": "bp.open('webllm')",
    "categories": ["tools", "productivity", "ai"],
    "author": "BuddyPond",
    // "alias": ["llm"]
  },
  */

  "aero-player": {
    "icon": "desktop/assets/images/icons/icon_aero-player_64.webp",
    "label": "Aero Player",
    "description": "Play music with Aero Player",
    "onClick": "bp.open('aero-player')",
    "categories": ["audio", "music", "entertainment"],
    "author": "Swayam",
    "authorUrl": "https://github.com/swayam25/Aero",
     adminOnly: true
  },
  
  "motd": {
    "icon": "desktop/assets/images/icons/icon_console_64.webp",
    "label": "MOTD",
    "description": "Message of the Day",
    "onClick": "bp.open('motd')",
    "categories": ["social", "community"],
    "chatWindowButton": ['buddy', 'pond'] // adds this app as a button in the chat window, array is types of windows to add it to
  },

  "welcome": {
    "icon": "desktop/assets/images/icons/icon_buddy-frog_64.webp",
    "label": "Welcome",
    "description": "Welcome to BuddyPond",
    "onClick": "bp.open('welcome')",
    "categories": ["social", "community"],
    "enumerable": false, // do not show in the app list
  },

  "fishing": {
    "icon": 'desktop/assets/images/icons/icon_fishing_64.webp',
    "author": "BuddyPond",
    "label": "Fishing",
    "description": "Catch fish in a virtual pond",
    "onClick": "bp.open('fishing')",
    "categories": ["creative", "entertainment", "games"],
    "alias": ["fish"],
    "enumerable": true, // do not show in the app list
  },

  "casino": {
    "icon": "desktop/assets/images/icons/icon_casino_64.webp",
    "label": "Casino",
    "onClick": "bp.open('casino')",
    "description": "Flip a coin and get a random result",
    "categories": ["games", "entertainment"],
    "author": "BuddyPond",
    "authorUrl": "https://github.com/BuddyPond",
    "alias": ["casino"],
    "enumerable": false, // do not show in the app list
  },
  "casino-coinflip": {
    "icon": "desktop/assets/images/icons/icon_coinflip_64.webp",
    "label": "Coin Flip",
    "alias": "coinflip",
    "onClick": "bp.open('casino-coinflip')",
    "description": "Flip a coin and get a random result",
    "categories": ["games", "entertainment"],
    "author": "BuddyPond",
    "authorUrl": "https://github.com/BuddyPond",
    "alias": ["coinflip"],
    "enumerable": false, // do not show in the app list
  },
  'imagegen': {
    "icon": "desktop/assets/images/icons/icon_imagegen_64.webp",
    "label": "ImageGen",
    "description": "Generate images using AI",
    "onClick": "bp.open('imagegen')",
    "categories": ["art", "creative", "ai"],
    "author": "BuddyPond",
    "alias": ["imggen", "image-gen"],
    adminOnly: true
  },
  'game-doom': {
    "icon": "desktop/assets/images/icons/icon_game-doom_64.webp",
    "label": "Doom",
    "description": "Play the classic Doom game",
    "onClick": "bp.open('game-doom')",
    "categories": ["games", "entertainment"],
    "author": "id Software",
    "alias": ["doom"]
  },
  'inventory': {
    "icon": "desktop/assets/images/icons/icon_inventory_64.webp",
    "label": "Inventory",
    "description": "Manage your items and gear",
    "onClick": "bp.open('inventory')",
    "categories": ["tools", "productivity"],
    "author": "BuddyPond",
    "alias": ["items", "gear"],
  },
  'inventory-admin': {
    "icon": "desktop/assets/images/icons/icon_inventory-admin_64.webp",
    "label": "Inventory Admin",
    "description": "Administer inventory items and definitions",
    "onClick": "bp.open('inventory-admin')",
    "categories": ["admin", "tools", "productivity"],
    "adminOnly": true,
    "author": "BuddyPond",
    "alias": ["items-admin", "gear-admin"],
    "enumerable": false, // do not show in the app list
  },
  'bots': {
    icon: 'desktop/assets/images/icons/icon_buddy-frog_64.webp',
    label: 'Bots',
    description: 'Manage your bots and AI assistants',
    onClick: "bp.open('bots')",
    categories: ['tools', 'productivity', 'ai'],
    "enumerable": false
  },
  'eyes': {
    icon: 'desktop/assets/images/icons/icon_buddy-frog_64.webp',
    label: 'Eyes',
    description: 'CV Eyes',
    onClick: "bp.open('eyes')",
    categories: ['tools', 'productivity', 'cv'],
    "enumerable": false
  },
}