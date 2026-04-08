export default class BrowserWindow {
  constructor(bp, container, initialUrl = 'https://example.com') {
    this.bp = bp;
    this.container = container;
    this.currentUrl = initialUrl;
    this.iframe = null; // Reference to the iframe
    this.history = [initialUrl]; // Store visited URLs
    this.currentIndex = 0; // Current position in history
    this.baseUrl = ''; // Base URL for relative links
    this.init();
    return this;
  }

  init() {
    // Create and inject HTML
    let html = `
            <div class="bp-browserwindow-container">
                <div class="bp-browserwindow-toolbar">
                    <div class="bp-browserwindow-navigation">
                        <button class="bp-browserwindow-nav-btn back" disabled>←</button>
                        <button class="bp-browserwindow-nav-btn forward" disabled>→</button>
                        <button class="bp-browserwindow-nav-btn reload">↻</button>
                    </div>
                    <div class="bp-browserwindow-addressbar">
                        <span class="ssl-indicator">🔒</span>
                        <input type="text" class="bp-browserwindow-url" value="${this.currentUrl}">
                    </div>
                </div>
                <div class="bp-browserwindow-content">
                    <iframe src="about:blank" style="width:100%; height:100%; border:none;"></iframe>
                </div>
            </div>
        `
    let el = document.createElement('div');
    el.className = 'bp-browserwindow';
    el.innerHTML = html;
    this.container.append(el);

    // Reference the iframe
    this.iframe = this.container.querySelector('iframe');
    // Set up event listeners
    this.setupEventListeners();

    // Initialize with the first URL
    this.navigate(this.currentUrl);

    this.bp.on('browser::setAddressBar', 'update-address-bar-value', (url) => {
      this.setAddressBar(url);
    })

  }

  setBaseUrl(url) {
    this.baseUrl = url;
  }

  setContent(htmlContent, attempts = 1) {
    try {
      const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
      doc.open();
      // Set the base URL before writing the content
      const baseTag = `<base href="${this.baseUrl}" target="_blank">`;
      // set the base of the current document
      // doc.write(baseTag);
      const contentWithBase = baseTag + htmlContent;
      //console.log('writing', contentWithBase)
      doc.write(contentWithBase);
      doc.close();

    } catch (e) {
      console.log('Error setting content:', e);
      // clear out the iframe and reload it with about:blank
      // this could be due to previous page being remote url / cross-domain
      this.iframe.src = 'about:blank';
      // console.error('Error setting content:', e);
      if (attempts < 9001) {
        setTimeout(() => {
          this.setContent(htmlContent, attempts + 1);
        }, 100);
      } else {
        console.error('Failed to set content after 2 attempts');
      }
    }
  }

  setupEventListeners() {
    const urlInput = this.container.querySelector('.bp-browserwindow-url');
    const backBtn = this.container.querySelector('.bp-browserwindow-nav-btn.back');
    const forwardBtn = this.container.querySelector('.bp-browserwindow-nav-btn.forward');
    const reloadBtn = this.container.querySelector('.bp-browserwindow-nav-btn.reload');

    urlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.navigate(urlInput.value);
      }
    });

    backBtn.addEventListener('click', () => this.goBack());
    forwardBtn.addEventListener('click', () => this.goForward());
    reloadBtn.addEventListener('click', () => this.reload());
  }

  navigate(url) {

    // console.log('navigating to', url);

    // lets' check url for http or https
    // if either are missing, add https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // If we're not at the end of the history, remove all entries after current position
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    // Add new URL to history and update current index
    this.history.push(url);
    this.currentIndex = this.history.length - 1;

    // Update current URL and UI
    this.currentUrl = url;
    this.updateAddressBar();
    this.updateNavigationButtons();
  }

  goBack() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentUrl = this.history[this.currentIndex];
      this.updateAddressBar();
      this.updateNavigationButtons();
    }
  }

  goForward() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      this.currentUrl = this.history[this.currentIndex];
      this.updateAddressBar();
      this.updateNavigationButtons();
    }
  }

  reload() {
    // Reload the current URL
    this.iframe.src = this.currentUrl;
  }

  setAddressBar(url) {
    const urlInput = this.container.querySelector('.bp-browserwindow-url');
    urlInput.value = url;
  }

  updateAddressBar() {
    // console.log('updating address bar', this.currentUrl);
    const urlInput = this.container.querySelector('.bp-browserwindow-url');
    urlInput.value = this.currentUrl;
    // set the src of the iframe to the currentUrl
    this.iframe.src = this.currentUrl;
  }

  updateNavigationButtons() {
    const backBtn = this.container.querySelector('.bp-browserwindow-nav-btn.back');
    const forwardBtn = this.container.querySelector('.bp-browserwindow-nav-btn.forward');

    // Enable/disable back button
    backBtn.disabled = this.currentIndex <= 0;

    // Enable/disable forward button
    forwardBtn.disabled = this.currentIndex >= this.history.length - 1;
  }

  // Helper method to get navigation history
  getHistory() {
    return {
      history: this.history,
      currentIndex: this.currentIndex,
      currentUrl: this.currentUrl
    };
  }
}