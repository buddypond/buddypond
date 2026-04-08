export default class FileUploadOverlay {
  constructor({
    parent,
    fileExplorer,
    onUploadComplete = () => { }
  }, uploadFn) {
    this.parent = parent;
    this.fileExplorer = fileExplorer;
    this.files = [];
    this.initializeElements();
    this.bindEvents();
    this.onUploadComplete = onUploadComplete;
    this.uploadFn = uploadFn;
    this.bp = fileExplorer.bp;
  }

  initializeElements() {
    this.overlay = this.parent.querySelector('.bp-file-explorer-upload-overlay');
    this.filesList = this.parent.querySelector('.bp-file-explorer-upload-files-list');
    this.totalSize = this.parent.querySelector('.bp-file-explorer-total-size');
    this.uploadButton = this.parent.querySelector('.bp-file-explorer-upload-start');
    this.cancelButton = this.parent.querySelector('.bp-file-explorer-upload-cancel');
    this.progressContainer = this.parent.querySelector('.bp-file-explorer-upload-progress-container');
    this.progressBar = this.parent.querySelector('.bp-file-explorer-upload-progress-bar');
    this.progressPercentage = this.parent.querySelector('.bp-file-explorer-upload-progress-percentage');
    this.currentFile = this.parent.querySelector('.bp-file-explorer-current-file');
    this.fileCount = this.parent.querySelector('.bp-file-explorer-file-count');
  }

  bindEvents() {
    this.uploadButton.addEventListener('click', () => this.startUpload(this.onUploadComplete));
    this.cancelButton.addEventListener('click', () => this.hide());
  }

  show(files) {
    this.files = Array.from(files);
    this.overlay.style.display = 'flex';
    this.renderFiles();
    this.updateTotalSize();
    if (this.bp.me === "Guest") {
      $('.bp-file-explorer-upload-controls').html('<h2>Guest account may not upload files.</hr><br/>Please  <button class="open-app action-button" data-app="buddylist">log in</button> to BuddyPond.');
    }

  }

  hide() {
    this.overlay.style.display = 'none';
    this.progressContainer.style.display = 'none';
    this.files = [];
    this.filesList.innerHTML = '';
  }

  formatSize(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  }

  renderFiles() {
    // TODO: clone this from HTML template instead of duplicating string
    this.filesList.innerHTML = this.files.map((file, index) => `
        <div class="bp-file-explorer-upload-file-item" data-file-id="${index}">
          <div class="bp-file-explorer-upload-column-name">${file.path}</div>
          <div class="bp-file-explorer-upload-column-size">${this.formatSize(file.file.size)}</div>
          <div class="bp-file-explorer-upload-column-status">Pending</div>
        </div>
      `).join('');
  }

  updateTotalSize() {
    const totalBytes = this.files.reduce((acc, file) => acc + file.file.size, 0);
    this.totalSize.textContent = this.formatSize(totalBytes);

    // TODO: better scope, us localstorage or another class
    if (typeof this.fileExplorer.currentStorageRemaining === 'number') {
      // console.log("comparing", totalBytes, this.fileExplorer.currentStorageRemaining);
      if (totalBytes > this.fileExplorer.currentStorageRemaining) {
        // this.totalSize.textContent = `${this.totalSize.textContent} (Not enough space)`;
        $('.bp-file-explorer-storage-warning').show();
        this.uploadButton.disabled = true;
        this.uploadButton.classList.add('disabled');
      }
    }

  }

  async startUpload(onUploadComplete = () => { }) {
    this.uploadButton.disabled = true;
    this.progressContainer.style.display = 'block';

    let uploadedFiles = 0;
    let uploadedAllFiles = true;
    let errors = [];
    for (const file of this.files) {
      uploadedFiles++;
      this.currentFile.textContent = file.name;
      this.fileCount.textContent = `(File ${uploadedFiles} of ${this.files.length})`;
      $(`.bp-file-explorer-upload-file-item[data-file-id="${uploadedFiles - 1}"] .bp-file-explorer-upload-column-status`).text('Uploading...');

      try {
        await this.uploadFn(file, (progress) => {
          const totalProgress = progress * 100;
          this.updateProgress(totalProgress);
        });
        $(`.bp-file-explorer-upload-file-item[data-file-id="${uploadedFiles - 1}"] .bp-file-explorer-upload-column-status`).text('Completed');
        this.uploadButton.disabled = false;

      } catch (error) {
        uploadedAllFiles = false;
        errors.push(error);
        console.error('Upload failed:', error);
        // console.log("trying to find element", `.bp-file-explorer-upload-file-item[data-file-id="${uploadedFiles - 1}"] .bp-file-explorer-upload-column-error`);
        //$(`.bp-file-explorer-upload-file-item[data-file-id="${uploadedFiles - 1}"] .bp-file-explorer-upload-column-error`).text(error.message).show();
        $('.bp-file-explorer-upload-errors').append(`<div class="bp-file-explorer-upload-error">${error.message}</div>`).show();
        $(`.bp-file-explorer-upload-file-item[data-file-id="${uploadedFiles - 1}"] .bp-file-explorer-upload-column-status`).text('Failed').addClass('error');
      }
    }

    if (uploadedAllFiles) {
      setTimeout(() => {
        // should show final status
        $('.bp-file-explorer-upload-status').text('Upload completed');
        this.hide();
        onUploadComplete();
      }, 2200);

      // wait just a moment until attempting to get files
      this.fileExplorer.refreshFileTree();



      setTimeout(() => {
        // takes a moment for durable objects to update
        // probably want to poll this?
        this.fileExplorer.getUsage();
      }, 1000)



    } else {
      // throw new Error(`Failed to upload ${errors.length} files`);
      console.error(`Failed to upload ${errors.length} files`, errors);
    }
  }

  // TODO: is this no longer being called/
  // Remark: Remove this FN?  
  async uploadFile(file, onProgress) {
    // This is a placeholder for your actual upload implementation
    // Replace this with your actual upload logic

    try {
      await this.uploadFn(file, onProgress);
    } catch (error) {
      // show the error in the UI, could be out of space, etc
      alert(error.message)
      //$('.bp-file-explorer-upload-column-status').textContent = 'Failed'; // should be more specific
    }

    /*
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.1;
        onProgress(progress);
        if (progress >= 1) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
    */
  }

  updateProgress(percentage) {
    const roundedPercentage = Math.min(100, Math.round(percentage));
    this.progressBar.style.width = `${roundedPercentage}%`;
    this.progressPercentage.textContent = `${roundedPercentage}%`;
  }
}
