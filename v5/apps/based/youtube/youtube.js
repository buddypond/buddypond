export default class Youtube {
  constructor(bp, options = {}) {
    this.bp = bp;
    this.youtubeWindow = null;
    this.player = null;
    // default video static to start rZhbnty03U4
    return this;
  }

  async init() {
    this.html = await this.bp.load('/v5/apps/based/youtube/youtube.html');
    // is importModule not using the correct host path here?
    let playlistModule = await this.bp.importModule('/v5/apps/based/youtube/data/playlist.js', {}, false);
    this.playlist = playlistModule.default;

    if (!window.YT) {
      await this.bp.appendScript('https://www.youtube.com/iframe_api');
      window.onYouTubeIframeAPIReady = () => {
        this.apiReady = true;
      };
    } else {
      this.apiReady = true;
    }
  }

  async close() {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
    if (this.youtubeWindow) {
      this.youtubeWindow = null;
    }
  }

  async open(options = {}) {
    // alert(options.context);
    this.context = options.context;
    if (this.youtubeWindow) {
      if (this.player && options.context) {
        this.player.loadVideoById(options.context);
      }
      return this.youtubeWindow;
    }

    this.youtubeWindow = this.bp.apps.ui.windowManager.createWindow({
      id: 'youtube',
      title: 'Interdimensional Cable',
      x: 50,
      y: 100,
      width: 600,
      height: 480,
      minWidth: 200,
      minHeight: 200,
      parent: $('#desktop')[0],
      icon: '/desktop/assets/images/icons/icon_interdimensionalcable_64.webp',
      content: this.html,
      resizable: true,
      minimizable: true,
      maximizable: true,
      panel: options.panel || false,
      closable: true,
      focusable: true,
      maximized: true,
      minimized: false,
      onClose: () => this.close()
    });

    // this.youtubeWindow.maximize();

    // Wait for YouTube API to be ready
    while (!this.apiReady) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    $('.orb-holder', this.youtubeWindow.content).on('click', () => {
      this.playRandomVideo();
    });

    let startingVideo = options.context || this.playlist[Math.floor(Math.random() * this.playlist.length)];

    if (!startingVideo || startingVideo === 'default') {
      startingVideo = 'rZhbnty03U4'; // Default video if none provided
    }

    this.player = new YT.Player('youtube-player', {
      height: '390',
      width: '640',
      videoId: startingVideo,
      playerVars: { autoplay: 1, controls: 1 },
      events: {
        'onReady': this.onPlayerReady,
        'onStateChange': (event) => this.onPlayerStateChange(event),
        'onError': (event) => this.onPlayerError(event)
      },
      origin: window.location.origin
    });
    return this.youtubeWindow;
  }

  onPlayerReady(event) {
    console.log('YouTube Player Ready', event);
  }

  onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
      this.playRandomVideo();
    }
  }

  onPlayerError(event) {
    console.warn('YouTube Player Error:', event);
    console.log("context", this.context);
    // Handle different error types
    const errorCodes = [100, 101, 150]; // Common unavailable video errors
    // error 100 is - video not found (removed or private)
    // error 101 and 150 are - \embedding not allowed by owner
    // TODO: better UX on 150 embed errors, the video id is valid, just cannot be played with the iframe API
    if (event.data === 150) {
      console.warn('Video embedding not allowed, selecting a new one...');
      this.playRandomVideo();
      return;
    }
    if (errorCodes.includes(event.data) || event.data === 2) {
      console.warn('Video unavailable, selecting a new one...');
      this.playRandomVideo();
    }
  }

  playRandomVideo() {
    if (!this.player || !this.playlist) return;
    let randomVideo = this.playlist[Math.floor(Math.random() * this.playlist.length)];
    // TODO: have timer here that will send broadcast message to indicate the video actually
    // played ( 2 seconds ) and then send the actvity to `bp-buddylist/activity`
    // so that the backend can send the watching event to the `pond/television` channel
    // console.log(this.bp.me, 'is watching', randomVideo);
    this.player.loadVideoById(randomVideo);
  }
}