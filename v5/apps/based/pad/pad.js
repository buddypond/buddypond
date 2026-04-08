/* pad.js - Marak Squires 2024 - BuddyPond Pads */
// TODO: clean-up this file
import renderPadRows from './lib/renderPadRows.js';
import savePad from './lib/savePad.js';
import buildPad from './lib/buildPad.js';
import renderAppList from './lib/renderAppList.js';

export default class Pad {
  constructor(bp, options = {}) {
    this.bp = bp;
    this.icon = '/desktop/assets/images/icons/icon_pad_64.webp';
    this.data = {};
    return this;
  }

  // TODO: move to file
  async help() {
    return `Pads are a fun way to create and share content with others.

        You may create pads here and such...etc.

        Enjoy!

        `
  }

  async init() {
    this.bp.log('Hello from Pad');

    let html = await this.bp.load('/v5/apps/based/pad/pad.html');
    let css = await this.bp.load('/v5/apps/based/pad/pad.css');

    let slugify = await this.bp.importModule('/v5/apps/based/pad/vendor/slugify.min.js', {}, false);
    this.slugify = slugify.slugifyDefault;

    // TODO: put an abort timeout on this so it won't block the app if not available
    try {
      this.data.appStats = await this.bp.apps.desktop.client.getAppsStats();
    } catch (err) {
      this.data.appStats = {};
    }
    if (!this.data.appStats) {
      this.data.appStats = {};
    }
    // console.log('appStats', this.data.appStats);

    this.html = html;

    return 'loaded Pad';
  }

  // TODO: common function to bind UI
  // this will *usually* be called inside an open() mutex with window
  // if app is running headless mode than this is *expected* to be called after init()
  // TODO: decouple all .bindUI() from .open()...
  async bindUI() {

  }

  async open() {

    if (!this.padWindow) {
      this.padWindow = this.bp.apps.ui.windowManager.createWindow({
        id: 'pad',
        title: 'Buddy Apps',
        x: 50,
        y: 60,
        width: 1000,
        height: 600,
        minWidth: 200,
        minHeight: 200,
        icon: this.icon,
        parent: $('#desktop')[0],
        content: this.html,
        resizable: true,
        minimizable: true,
        maximizable: true,
        closable: true,
        focusable: true,
        maximized: false,
        minimized: false,
        onClose: () => {
          this.padWindow = null;
        }
      });

      this.tabs = new this.bp.apps.ui.Tabs('.tabs-container', this.padWindow.content);

      this.tabs.onTab(async (tabId) => {
        // TODO: on tab if tabId = "pads-home", 
        // we do need to re-run getPads();....
        if (tabId === '#pads-home') {
          this.myPads = await updateMyPads.call(this);
        }
        if (tabId === '#buddy-pads') {
          // console.log('appStats', this.data.appStats);
          this.renderAppList(this.data.appStats);
          $('.bp-pads-search-input', this.padWindow.content).focus();
        }

      });

      $('.bp-pads-search-input', this.padWindow.content).on('input', (e) => {
        // TODO: search for apps
      });


    }

    async function updateMyPads() {

      // TODO: refactor this to separate function
      // will show myPads by default

      // ensure that user is logged in before fetching pads from API
      if (!this.bp.me || this.bp.me === 'Guest') {
        return;
      }
      this.myPads = await this.bp.apps.client.api.getPads();
      console.log('myPadsmyPads', this.myPads)
      this.renderPadRows(this.myPads.results);

    }

    // show the first .tab-content
    //$('.tab-content').show();
    $('.tab-content:first', this.padWindow.content).show();

    console.log(this.myPads);
    if (this.bp.me && this.bp.me !== 'Guest') {
      $('.loggedOut', this.padWindow.content).flexHide();
      $('.loggedIn', this.padWindow.content).flexShow();
    } else {
      $('.loggedOut', this.padWindow.content).flexShow();
      $('.loggedIn', this.padWindow.content).flexHide();
    }

    let userFilesCDN = 'https://files.buddypond.com' + '/' + this.bp.me;
    let userFilesHome = this.bp.config.host + '/' + this.bp.me;

    $('.userFilesHome', this.padWindow.content).html(userFilesHome);
    $('.userFilesHome', this.padWindow.content).attr('href', userFilesHome);

    $('.userFilesCDN', this.padWindow.content).html(userFilesCDN);
    $('.userFilesCDN', this.padWindow.content).attr('href', userFilesCDN);

    let that = this;
    // Function to update slug and URL preview
    function updateSlug(value) {

      // Remark, TODO: figure out why "-" was not working? Would be nice to have "-" in urls?
      const slugOptions = {
        lower: true,
        replacement: '-',
        remove: /[^A-Za-z0-9_\-]/g,
        strict: false
      };

      // First replace spaces with hyphens in your input
      let preSlug = value.replace(/\s+/g, '-');

      // Replace any hypens with underscores
      preSlug = preSlug.replace(/-+/g, '_');

      let slug = that.slugify(preSlug, slugOptions);
      //let slug = slugify(value);

      $('.padTitle', that.padWindow.content).val(slug);
      $('.padUrl', that.padWindow.content).val(`${userFilesCDN}/pads/${slug}`);
    }

    // Debounce function to limit how often a function can fire
    const debounce = (func, delay) => {
      let debounceTimer;
      return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
      };
    };

    // Event listener for title input
    $('.padTitle', this.padWindow.content).on('input', debounce(function (e) {
      $(this).removeClass('error');

      console.log('Input changed:', e.target.value);
      updateSlug(e.target.value);
    }, 250)); // Adjust debounce time as needed

    // Optional: Display slugification in action (UX feedback)
    $('.padTitle', this.padWindow.content).on('input', () => {
      // Optionally, show some kind of indicator that slug is being generated
      $('.status-indicator', this.padWindow.content).addClass('active').text('Generating URL...');
    }).on('input', debounce(() => {
      $('.status-indicator', this.padWindow.content).removeClass('active').text(''); // Clear indicator when done
      // update url
      $('.padUrl', this.padWindow.content).val(`${userFilesHome}/pads/${that.slugify($('.padTitle', that.padWindow.content).val())}`);
    }, 250));


    $('.bp-pad-form', this.padWindow.content).on('submit', async (e) => {
      e.preventDefault();
      console.log(`Save pad button clicked`);


      // check that     let padTitle = $('#padTitle').val() is not empty
      let padTitle = $('.padTitle', this.padWindow.content).val();
      if (!padTitle) {
        $('.padTitle', this.padWindow.content).addClass('error').attr('placeholder', 'Please enter a name...');
        return;
      }

      // disable the save-pad-button to prevent double clicks
      $('.save-pad-button', this.padWindow.content).prop('disabled', true);
      // add disabled class to button
      $('.save-pad-button', this.padWindow.content).addClass('disabled');

      let padSaved = false;
      let padError;
      let newPad;

      try {
        newPad = await this.savePad();
        padSaved = true;
      } catch (err) {
        console.error(err);
        padError = err;
      }

      if (padSaved) {
        console.log('the new pad is ', newPad)

        try {
          await this.buildPad(newPad.title);

        } catch (err) {
          // alert(`Error building pad: ${err.message}`);
          console.error('Error building pad', err);
          return;
        }

        // if not success, show the error

        // now that the pad is created we will need to upload files
        // show the #pads-upload-files div, which will move user to file-explorer
        $('#pads-upload-files', this.padWindow.content).show();
        $('#pads-editor', this.padWindow.content).flexHide();

        // Reloads the My Pads list
        this.myPads = await this.bp.apps.client.api.getPads();
        this.renderPadRows(this.myPads);
        // set the .bp-pad-container to visible
        $('.bp-pad-container', this.padWindow.content).flexShow();

        let padTitle = $('#padTitle').val();

        $('.openPadButton', this.padWindow.content).attr('data-context', '/' + this.bp.me + `/pads/${padTitle}/index.html`);
        //alert('set')


      } else {
        console.log('Pad not saved', padError);
        if (padError.message === 'Pad already exists') {
          // highlight the title input
          $('.padTitle', this.padWindow.content).addClass('error');
          $('.status-indicator', this.padWindow.content).addClass('error').text('Pad already exists');
        }
      }

      // re-enable the save-pad-button to prevent double clicks
      $('.save-pad-button', this.padWindow.content).prop('disabled', false);
      // remove disabled class to button
      $('.save-pad-button', this.padWindow.content).removeClass('disabled');


      return false;

    });

    $('.create-pad-button', this.padWindow.content).on('click', () => {
      this.tabs.navigateToTab('#pads-editor');
    });

    this.tabs.showTab('#buddy-pads');
    this.padWindow.maximize();
    return this.padWindow;

  }

  editPad(pad) {
    $('.tab-content', this.padWindow.content).flexHide();
    $('.pad-code-editor', this.padWindow.content).flexShow();
  }


}

Pad.prototype.renderPadRows = renderPadRows;
Pad.prototype.savePad = savePad;
Pad.prototype.buildPad = buildPad;
Pad.prototype.renderAppList = renderAppList;