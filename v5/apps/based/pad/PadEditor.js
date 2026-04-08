import BrowserWindow from '../browser/BrowserWindow.js';

export default class PadEditor {
  constructor(parentElement, options = {}) {
    if (!parentElement) {
      throw new Error('PadEditor requires a parent element');
    }
    options.files = options.files || [];
    this.bp = options.bp;
    this.options = options;
    this.files = options.files;

    this.parentElement = parentElement;
    this.options = options;
    this.editor = null;
    this.currentContent = '';
    this.previewMode = false;

    // Create main container
    this.container = document.createElement('div');
    this.container.className = 'pad-editor';
    this.container.style.display = 'flex';
    this.container.style.flexDirection = 'column';
    this.parentElement.appendChild(this.container);

    // Create controls
    this.controls = document.createElement('div');
    this.controls.className = 'editor-controls';
    // Create main content area
    this.contentArea = document.createElement('div');
    this.contentArea.className = 'editor-content';
    this.contentArea.style.display = 'flex';
    this.contentArea.style.flex = '1';

    // Create editor container
    this.editorContainer = document.createElement('div');
    this.editorContainer.className = 'editor-container';
    this.editorContainer.style.flex = '1';

    // Create preview iframe
    /*
    this.previewFrame = document.createElement('iframe');
    this.previewFrame.className = 'preview-frame';
    this.previewFrame.style.flex = '1';
    this.previewFrame.style.display = 'none';
    this.previewFrame.style.border = 'none';
    this.previewFrame.src = 'about:blank';
    */

    let liveLink = this.bp.config.host + '/' + this.bp.me


    // TODO: replace all this.previewFrame with this.browserPreview
    // we now have the BrowserWindow ( which has its own iframe )
    // console.log('this.previewFrame', this.previewFrame);
    // Assemble the DOM structure
    this.container.appendChild(this.controls);
    this.container.appendChild(this.contentArea);
    this.previewFrame = new BrowserWindow(this.bp, this.container, liveLink);
    this.previewFrame.setContent('loading...');
    // set the base url to this.bp.config.host + '/' + this.bp.me
    this.previewFrame.setBaseUrl(this.bp.config.cdn + '/' + this.bp.me + '/');
    this.contentArea.appendChild(this.editorContainer);

    this.setupControls();

    return this;
  }

  setupControls() {
    const buttons = [
      { text: 'Preview', action: () => this.onPreview() },
      { text: 'Edit', action: () => this.onEdit() },
      { text: 'Update', action: () => this.onUpdate() },
      { text: 'Delete', action: () => this.onDelete() },
      { text: 'Clear', action: () => this.setContent('') }

      // { text: 'Cancel', action: () => this.onCancel() }
    ];

    buttons.forEach(({ text, action }) => {
      const button = document.createElement('button');
      button.className = 'desktopButton';
      button.classList.add('pad-editor-button-' + text.toLowerCase());
      button.textContent = text;
      button.onclick = action;
      this.controls.appendChild(button);
    });
  }

  async init() {
    await this.loadMonaco();
    await this.initializeEditor();
    await this.initializeFileTree(this.files);
    await this.bp.load('browser');

    // hide the update and cancel buttons
    // this.controls.children[2].style.display = 'none';
    // this.controls.children[3].style.display = 'none';

    return this;
  }

  async loadMonaco() {
    if (!window.require) {
      await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/loader.js');
    }

    return new Promise((resolve) => {
      require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs' } });
      require(['vs/editor/editor.main'], resolve);
    });
  }

  loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async initializeEditor() {
    this.editor = monaco.editor.create(this.editorContainer, {
      value: this.currentContent,
      language: 'html',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false }
    });
  }

  changeEditorLanguage(newLanguage) {
    const model = this.editor.getModel();
    monaco.editor.setModelLanguage(model, newLanguage);
  }

  async initializeFileTree(files = []) {
    if (this.options.fileTree) {
      this.fileTreeComponent = this.options.fileTree.create(this.fileTree, {
        onFileSelect: (filePath, target) => {
          this.loadFile(filePath);
        },
        onFolderToggle: (folderPath, isExpanded) => {
          // console.log('Folder toggled:', folderPath, isExpanded);
        }
      });

      this.fileTreeComponent.render(files);
    }
  }

  loadFile(filePath) {
    const content = this.options.getFileContent?.(filePath) || '';
    // this.filePath = filePath;
    this.setContent(content);
  }

  getContent() {
    return this.editor ? this.editor.getValue() : this.currentContent;
  }

  setContent(content) {
    this.currentContent = content;
    if (this.editor) {
      this.editor.setValue(content);
    }
  }

  togglePreview(show) {
    this.previewMode = show;
    this.editorContainer.style.display = show ? 'none' : 'block';
    //this.previewFrame.style.display = show ? 'block' : 'none';
    // hide tree
    //this.fileTree.style.display = 'none';

  }

  updatePreview(content) {

    // we need to get all three files content (index.html, style.css, script.js)
    // and write all of them to the iframe

    if (!content) {
      content = this.getContent();
    }
    // console.log('setting preview content', content);
    this.previewFrame.setContent(content);
  }

  onEdit() {
    this.togglePreview(false);
    if (this.options.onEdit) {
      this.options.onEdit(this.getContent());
    }
  }

  onUpdate() {
    if (this.options.onUpdate) {
      this.options.onUpdate(this.filePath, this.getContent());
    }
    if (this.previewMode) {
      this.updatePreview();
    }
  }

  onDelete() {
    if (this.options.onDelete) {
      this.options.onDelete(this.filePath);
    }
  }

  onPreview() {
    this.togglePreview(true);
    if (this.options.onPreview) {
      this.options.onPreview(this.getContent());
    }

    // TODO: reload the preview from this.currentContent
    // Needs to reset the iframe between about:blank type and iframe.src remote type    
    this.updatePreview();

  }

  onCancel() {
    this.togglePreview(false);
    if (this.options.onCancel) {
      this.options.onCancel();
    }
  }

  dispose() {
    if (this.editor) {
      this.editor.dispose();
    }
    this.container.remove();
  }
}