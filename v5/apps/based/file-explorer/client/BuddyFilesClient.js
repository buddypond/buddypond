function BuddyFilesClient(bp, options = {}) {
  this.bp = bp;
  this.options = options;
  this.endpoint = options.endpoint || null;
}

BuddyFilesClient.prototype.getMe = function () {
  return this.options.me || this.bp?.me || globalThis.buddypond?.me || localStorage.getItem('me') || 'Guest';
};

BuddyFilesClient.prototype.getToken = function () {
  return this.options.qtokenid || this.bp?.qtokenid || globalThis.buddypond?.qtokenid || localStorage.getItem('qtokenid') || '';
};

BuddyFilesClient.prototype.getEndpoint = function () {
  return this.endpoint
    || this.options.uploadsEndpoint
    || this.bp?.apps?.client?.api?.uploadsEndpoint
    || this.bp?.uploadsEndpoint
    || globalThis.buddypond?.uploadsEndpoint
    || 'https://buddypond.com/api/uploads';
};

BuddyFilesClient.prototype.buildUrl = function (path, params = {}) {
  const url = new URL(`${this.getEndpoint()}${path}`);
  const me = this.getMe();
  const qtokenid = this.getToken();

  url.searchParams.set('v', '6');

  if (me) {
    url.searchParams.set('me', me);
  }

  if (qtokenid) {
    url.searchParams.set('qtokenid', qtokenid);
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

BuddyFilesClient.prototype.fetchJson = async function (path, params = {}, fetchOptions = {}, errorPrefix = 'Request failed') {
  const response = await fetch(this.buildUrl(path, params), fetchOptions);

  if (!response.ok) {
    throw new Error(`${errorPrefix}: ${await response.text()}`);
  }

  return await response.json();
};

BuddyFilesClient.prototype.getUsage = async function () {
  return await this.fetchJson('/getUsage', {}, {}, 'Failed to get file usage');
};

BuddyFilesClient.prototype.getFileUsage = async function () {
  return await this.getUsage();
};

BuddyFilesClient.prototype.syncWithR2 = async function (prefix = '', depth = 6) {
  const me = this.getMe();
  return await this.fetchJson(
    '/syncWithR2',
    {
      userFolder: me,
      prefix,
      depth
    },
    {},
    'Failed to sync with R2'
  );
};

BuddyFilesClient.prototype.listFiles = async function (prefix = '', depth = 1) {
  const me = this.getMe();
  return await this.fetchJson(
    '/getFileList',
    {
      userFolder: me,
      prefix,
      depth
    },
    {},
    'Failed to list files'
  );
};

BuddyFilesClient.prototype.getFileMetadata = async function (fileName) {
  const me = this.getMe();
  return await this.fetchJson(
    '/get-metadata',
    {
      fileName,
      userFolder: me
    },
    {},
    'Failed to get metadata'
  );
};

BuddyFilesClient.prototype.renameFile = async function (oldFileName, newFileName) {
  const me = this.getMe();
  return await this.fetchJson(`/renameFile?userFolder=${me}&oldKey=${oldFileName}&newKey=${newFileName}`, {}, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, 'Failed to rename file');
};

// TODO: go through entire app and replace usage of buddypond.uploadFile with this call
// Remark: this will require we import the new BuddyFilesClient into the `desktop` app
BuddyFilesClient.prototype.uploadFile = async function (file, onProgress) {
  onProgress = onProgress || function noop() {};

  let filePath = file.filePath || file.webkitRelativePath || file.name;
  if (filePath.startsWith('/')) {
    filePath = filePath.substring(1);
  }

  const me = this.getMe();
  const signedUrlResponse = await this.fetchJson(
    '/generate-signed-url',
    {
      fileName: filePath,
      fileSize: file.size,
      userFolder: me
    },
    {},
    'Failed to get signed URL'
  );

  const uploadResponse = await fetch(signedUrlResponse.signedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type || 'application/octet-stream'
    },
    body: file
  });

  if (!uploadResponse.ok) {
    throw new Error(`HTTP error during file upload: ${await uploadResponse.text()}`);
  }

  onProgress({
    loaded: file.size,
    total: file.size,
    percent: 100,
    file
  });

  return `https://files.buddypond.com/${me}/${filePath}`;
};

BuddyFilesClient.prototype.uploadFiles = async function (files, onProgress) {
  const uploads = [];

  for (const file of files) {
    uploads.push(await this.uploadFile(file, onProgress));
  }

  return uploads;
};

BuddyFilesClient.prototype.removeFile = async function (fileName) {
  const me = this.getMe();

  await this.fetchJson(
    '/deleteFiles',
    {
      prefix: fileName,
      userFolder: me,
      depth: 6
    },
    {},
    'Failed to delete file'
  );

  return fileName;
};

export default BuddyFilesClient;