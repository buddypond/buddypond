import handleDrop from "./lib/handleDrop.js";
import handleUpload from "./lib/handleUpload.js";
import renderFolderContents from "./lib/renderFolderContents.js";
import renderPathContents from "./lib/renderPathContents.js";
import open from "./lib/open.js";
import create from "./lib/create.js";
import getUsage from "./lib/getUsage.js";
import onClick from "./lib/onClick.js";
import showFile from "./lib/showFile.js";

import Client from "./client/BuddyFilesClient.js";

export default class FileExplorer {
  constructor(bp, options = {}) {
    this.bp = bp;

    if (!options.fileTree) {
      options.fileTree = {};
    }

    this.options = options;

    // root path
    this.currentSelectedNode = {
      id: ""
    };

    // creates new BuddyFiles API client
    this.client = new Client(bp, options.client);
    // this.client.syncWithR2();

  }

  async init() {

    this.html = await this.bp.load('/v5/apps/based/file-explorer/file-explorer.html');

    await this.bp.load('/v5/apps/based/file-explorer/file-explorer.css');

    let bytes = await this.bp.importModule('/v5/apps/based/file-explorer/lib/bytes.js', {}, false);
    this.bytes = bytes.default;

    // async import import mime from 'mime';
    // is most likely already loaded and cached at this point
    let mime = await this.bp.importModule('/v5/apps/based/file-explorer/lib/mime.js', {}, false);
    this.mime = mime.default;

    this.onClick();

    return 'loaded file explorer';
  }

  setPreviewAddressBar(path) {
    $('.bp-file-explorer-address-input').val(path);
    let host = this.bp.config.host;
    // this.bp.emit('browser::setAddressBar', host + path);
    this.bp.emit('browser::setAddressBar', host + '/' + this.bp.me + path);
  }

}

FileExplorer.prototype.handleDrop = handleDrop;
FileExplorer.prototype.handleUpload = handleUpload;
FileExplorer.prototype.open = open;
FileExplorer.prototype.create = create;
FileExplorer.prototype.onClick = onClick;
FileExplorer.prototype.renderFolderContents = renderFolderContents;
FileExplorer.prototype.renderPathContents = renderPathContents;
FileExplorer.prototype.getUsage = getUsage;
FileExplorer.prototype.showFile = showFile;