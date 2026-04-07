import FileExplorerClass from "./FileExplorer.js";
import getCloudFiles from "./lib/getCloudFiles.js";
import PadEditor from "../pad/PadEditor.js";
import buildJsTreeData from "./lib/buildJsTreeData.js";

export default class FileExplorer {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        this.isPolling = false;
        return this;
    }

    async init() {

        await this.bp.load('droparea');
        let mime = await this.bp.importModule('/v5/apps/based/file-explorer/lib/mime.js', {}, false);
        this.mime = mime.default;

        // load jstree from CDN ( for now )
        // TODO: vendor
        //await this.bp.appendScript('https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/jstree.min.js');
        await this.bp.appendScript('/v5/apps/based/file-explorer/vendor/jstree.min.js');

        this.bp.log('Hello from File Explorer');
        //await this.bp.load('/v5/apps/based/file-explorer/FileTree/jsTree.css');
        //await this.bp.load('https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/themes/default/style.min.css');
        await this.bp.appendCSS('/v5/apps/based/file-explorer/vendor/style.min.css', false, true);

        this.fileExplorerInstance = new FileExplorerClass(this.bp, {
            fileTree: {
                onFileSelect: (filePath, target) => {
                    $('.bp-file-explorer-drag-upload').hide();
                },
                onFolderToggle: async (folderPath, isExpanded) => {
                    $('.bp-file-explorer-drag-upload').hide();
                    // display the contents of the folder in the main window
                    return;
                },
                onFolderSelect: async (folderPath, target) => {
                    $('.bp-file-explorer-drag-upload').hide();
                }
            }
        });
        await this.fileExplorerInstance.init();


        return 'loaded File Explorer';
    }

    async create() {

        if (!this.fileExplorer) {
            this.fileExplorer = this.fileExplorerInstance.create({
                onUploadComplete: this.options.onUploadComplete
            });
            this.fileExplorer.getCloudFiles = this.getCloudFiles.bind(this);
            this.fileExplorer.refreshFileTree = this.refreshFileTree.bind(this);
            this.handleDrop = this.fileExplorer.handleDrop.bind(this.fileExplorer);
            this.handleUpload = this.fileExplorer.handleUpload.bind(this.fileExplorer);
        }
        // TODO: move all this code to inside FileExplorer class
        // keep file-explorer app very minimal and just wrapper to FileExplorer class + optional windowing

        let defaultFileContent = {};

        let padEditorHolder = document.createElement('div');
        padEditorHolder.className = 'pad-editor-holder';
        $('.bp-file-explorer-file-viewer-editor', this.fileExplorer.content).append(padEditorHolder);

        this.fileExplorer.getUsage();
        const editor = new PadEditor(padEditorHolder, {
            bp: this.bp,
            // fileTree: fileTreeComponent, // Your file tree implementation
            files: [],
            getFileContent: (filePath) => {
                // Your logic to get file content
                return defaultFileContent[filePath];
            },
            onEdit: (content) => {
                // hide the preview and show the code editor
                $('.editor-content').flexShow();
                //$('.myProfile').flexHide();

                // show the Update and Cancel buttons
                $('.pad-editor-button-update').show();
                $('.pad-editor-button-cancel').show();

            },

            onDelete: async (filePath) => {
                let relativePath = filePath.replace('https://files.buddypond.com/' + this.bp.me + '/', '');
                // console.log('relativePath', relativePath);
                try {
                    await this.bp.apps.client.api.removeFile(relativePath);
                    // at this point we have confirmd with server that file is being deleted
                    // we should immediately remove the file from the file tree
                    let tree = $('#jtree').jstree(true);
                    // let localPath = filePath.replace('https://files.buddypond.com/', '');
                    // console.log('looking for node with path', relativePath);
                    let node = tree.get_node(relativePath);
                    // console.log('found node', node);
                    tree.delete_node(node);

                } catch (err) {
                    console.error('Error deleting file:', err);
                }
            },

            onUpdate: async (filePath, content) => {

                // show "updating" overlay
                $('.bp-file-explorer-update-overlay').flexShow();

                let relativePath = filePath.replace('https://files.buddypond.com/' + this.bp.me + '/', '');

                let mimeType = this.mime.getType(relativePath);

                // Assuming 'content' is a string, we need to convert it to a Blob, then to a File
                const blob = new Blob([content], { type: mimeType });  // Adjust the MIME type as necessary

                // Creating a File object from the Blob
                const file = new File([blob], relativePath.split('/').pop(), {
                    type: blob.type,
                    lastModified: new Date()  // You might need to adjust this if you have specific requirements
                });
                file.filePath = relativePath;

                // Assuming uploadFile() expects a standard File type object
                try {
                    let files = await this.bp.apps.client.api.uploadFile(file);
                    // TODO: take all files add them to jsTree... is there easier better way?
                    //        we could re-render and wait...might be best as they are 404 until they are ready
                } catch (err) {
                    alert('Error uploading file: ' + err.message);
                }

                this.fileExplorer.getUsage();

                this.bp.emit('file-explorer::update', {
                    path: relativePath,
                });

                $('.bp-file-explorer-update-overlay').flexHide();

            },

            onPreview: (content) => {
                // hide the code editor and show the preview .myProfile
                // what is handling this now? directly calling into browser app?
                // check and ensure that we don't need to move that logic here
                // console.log("onPreview", content);
            },
            onCancel: () => {
                // console.log('Cancel clicked');
                // hide the Update and Cancel buttons
                $('.pad-editor-button-update').hide();
                $('.pad-editor-button-cancel').hide();
                // hide the code editor and show the preview
                $('.pad-editor-button-preview').click();

            }
        });

        this.editor = editor;

        await editor.init();

        // set the editor in the file explorer
        this.fileExplorer.editor = editor;

        // load the content of the first file
        //editor.loadFile('/myprofile/index.html');

        // set the height of the editor
        editor.editorContainer.style.height = '600px';
        // this.editor.previewFrame.setContent(buddyProfilePad.content);


        // get the latest cloud files to populate the file explorer
        let cloudFiles = await this.getCloudFiles('', 6); // hard-coded to 6 ( for now )
        const treeData = buildJsTreeData(this.bp.me, cloudFiles.files);
        // console.log(JSON.stringify(treeData, true, 2));
        this.fileExplorer.cloudFiles = cloudFiles;

        // TODO: connect tree to AJAX backend for granular loading ( not just loading the whole tree at once )
        $('#jtree').jstree({
            'core': {
                'data': treeData,
                // This option ensures that when a node is selected by clicking it won't be opened/closed
                'multiple': true,  // This allows single selection of nodes
                'check_callback': true  // This allows certain operations in the tree
            },
            'plugins': ['contextmenu'],  // Add 'contextmenu' to the list of plugins
            'contextmenu': {
                'items': function (node) {
                    // console.log(node)
                    var tree = $('#jtree').jstree(true);

                    return {
                        /* TODO: create and delete
                        "Create": {
                            "separator_before": false,
                            "separator_after": false,
                            "label": "Create",
                            "action": function (obj) {
                                tree.create_node(node);
                            }
                        },
                        "Rename": {
                            "separator_before": false,
                            "separator_after": false,
                            "label": "Rename",
                            "action": function (obj) {
                                tree.edit(node);
                            }
                        },
                        */
                        "Delete": {
                            "separator_before": false,
                            "separator_after": true,
                            "label": "Delete",
                            "action": function (obj) {
                                tree.delete_node(node);
                            }
                        }
                    }
                }
            }
        }).on('ready.jstree', (e, data) => {
            // console.log('Tree is now ready');
            // render the root folder contents
            //let jsTree = $('#jtree').jstree(true);

            if (this.options.context) {
                if (this.options.context === 'default') { // TODO: why is default value here?
                    this.fileExplorer.renderPathContents('/');

                } else {
                    this.fileExplorer.renderPathContents(this.options.context);
                }

            } else {
                this.fileExplorer.renderPathContents('/');
            }

        }).on("select_node.jstree", (e, data) => {
            // Get the reference to the jsTree instance
            var instance = data.instance;
            var node = data.node;
            console.log('select_node.jstree', data);

            if (node.children.length > 0) {  // Check if the node has children, indicating it's a folder
                // Prevent the default select action to toggle on first click
                e.preventDefault();
                // Toggle open/close on single click
                console.log('Selected node:', node.id);
                this.fileExplorer.currentSelectedNode = node;
                instance.toggle_node(node);
            }
            $('.bp-file-explorer-drag-upload').hide();

        });

        $('.bp-file-explorer-drag-upload').flexShow();

        this.fileExplorer.setPreviewAddressBar('/');
        // $('.bp-file-explorer-address-input').val('/');

        // TODO: move as much of this logic to the FileExplorer class as possible

        $('#jtree').on("delete_node.jstree", (e, data) => {
            // delete the file or directory from CDN
            // console.log("delete_node.jstree", e, data);
            let node = data.node;
            // let path = node.id.replace(this.bp.me + '/', ''); // remove the /me/ part from the path
            let path = node.id;
            // console.log('jstree request to delete', path);

            // delete the file from the CDN
            // not needed?
            //let relativePath = path.replace('https://files.buddypond.com/' + this.bp.me + '/', '');
            let relativePath = path;
            // console.log('relativePath', relativePath);

            this.bp.apps.client.api.removeFile(relativePath).then(() => {
                // console.log('file removed from CDN', relativePath);
                // console.log('this.fileExplorer.cloudFiles.files', this.fileExplorer.cloudFiles.files);

                this.fileExplorer.cloudFiles.files = this.fileExplorer.cloudFiles.files.filter(file => file !== relativePath);
                // console.log('this.fileExplorer.cloudFiles.files', this.fileExplorer.cloudFiles.files);

            });

        });

        $('#jtree').on("changed.jstree", (e, data) => {
            // console.log('changed.jstree', e, data.selected);

            // determine if the selected node is a file or folder
            let node = data.instance.get_node(data.selected[0]);
            // console.log('attempted to get node with id', data.selected[0]);
            // renderNodeContents(data, node);
            if (node) {
                this.fileExplorer.renderPathContents('/' + node.id);
            } else {
                console.log('node not found', data.selected[0]);
            }

        });

        // when click .upload-files, dynamically create input with directory support and click it
        // take the results and send them to handleDrop
        $('.upload-files').on('click', async (e) => {
            // console.log('upload files clicked');
            let input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.webkitdirectory = false;
            input.directory = false;
            input.click();

            input.onchange = async (e) => {
                // console.log('files selected', e.target.files);
                let items = e.target.files;
                await this.handleUpload(e);
            };
        });

        $('.upload-directory').on('click', async (e) => {
            // console.log('upload directory clicked');
            let input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.webkitdirectory = true;
            input.directory = true;
            input.click();

            input.onchange = async (e) => {
                // console.log('files selected', e.target.files);
                let items = e.target.files;
                await this.handleUpload(e);
            };
        });

        $('.refresh-files').on('click', async (e) => {

            await this.refreshFileTree();


        });


        this.sidebar = document.querySelector('.bp-file-explorer-sidebar', this.fileExplorer.content);
        const toggleButton = document.querySelector('.toggle-tree', this.fileExplorer.content);

        if (this.bp.isMobile()) {
        toggleButton.addEventListener('click', () => {
            console.log('Toggle button clicked');
            this.sidebar.classList.toggle('active');
        });

        } else {
            toggleButton.remove();
        }


        // console.log('got the cloud files', cloudFiles.files);
        return this;

    }

    async refreshFileTree() {

        if (this.isPolling) {
            console.log('Already polling for changes, please wait...');
            return;
        }

        this.isPolling = true;

        // console.log('previous cloud files', this.fileExplorer.cloudFiles.files);
        let attempts = 0;
        const maxAttempts = 10; // You can adjust the maximum number of polling attempts

        const pollForChanges = async () => {
            let cloudFiles = await this.getCloudFiles('', 6); // hard-coded to 6 (for now)

            // Compare current cloud files with previous ones
            if (!this.areFilesSame(this.fileExplorer.cloudFiles.files, cloudFiles.files)) {
                // console.log('Cloud files have changed, updating tree...');
                const treeData = buildJsTreeData(this.bp.me, cloudFiles.files);
                this.fileExplorer.cloudFiles = cloudFiles;

                // get the jsTree instance
                let jsTree = $('#jtree').jstree(true);
                // re-render the tree contents, we don't wish to destroy our previous configuration
                jsTree.settings.core.data = treeData;
                jsTree.refresh();
                this.isPolling = false;
                this.fileExplorer.getUsage();
            } else if (attempts < maxAttempts) {
                // console.log('No changes detected, trying again...');
                attempts++;
                setTimeout(pollForChanges, 1000); // Try again each second
            }

            if (attempts >= maxAttempts) {
                // console.log('Max attempts reached, stopping polling...');
                this.isPolling = false;
            }

        };

        pollForChanges();
    }

    // Helper function to compare two arrays of files
    areFilesSame(oldFiles, newFiles) {

        const oldSet = new Set(oldFiles.map(file => file)); // Assuming each file has a unique 'id'
        const newSet = new Set(newFiles.map(file => file));

        if (oldSet.size !== newSet.size) {
            return false;
        }

        for (let id of newSet) {
            if (!oldSet.has(id)) {
                return false;
            }
        }

        return true;
    }

    async remove() {
        // Clean up the file explorer instance and its event handlers
        if (this.fileExplorer) {
            // Remove the drag/drop handler
            if (this.handleDrop) {
                // Assuming handleDrop was bound to some element, remove it
                $('.bp-file-explorer-drag-upload').off('drop', this.handleDrop);
            }

            // Clean up the jstree events and instance
            $('#jtree').off('ready.jstree changed.jstree delete_node.jstree');
            $('#jtree').jstree('destroy');

            // Clean up the editor if it exists
            if (this.editor) {
                // Remove the editor instance
                this.editor.destroy?.();
                this.editor = null;
            }

            // Remove DOM elements created by the component
            $('.bp-file-explorer-file-viewer-editor .pad-editor-holder').remove();
            $('.bp-file-explorer-drag-upload').remove();
            $('.bp-file-explorer-address-input').remove();

            // Clear the file explorer instance
            this.fileExplorer.destroy?.();
            this.fileExplorer = null;
            this.handleDrop = null;
            this.handleUpload = null;
        }
    }

    async open(options = {}) {
        // console.log(`Opening file explorer with context ${context}`);
        this.options.context = options.context;
        //alert('context is set to ' + this.options.context);

        this.onUploadComplete = this.options.onUploadComplete || (() => { });

        if (!this.fileExplorer) {
            this.fileExplorer = this.fileExplorerInstance.create();
            this.fileExplorer.onUploadComplete = this.onUploadComplete;
            this.fileExplorer.getCloudFiles = this.getCloudFiles.bind(this);
            this.fileExplorer.refreshFileTree = this.refreshFileTree.bind(this);
            this.handleDrop = this.fileExplorer.handleDrop.bind(this.fileExplorer);
            this.handleUpload = this.fileExplorer.handleUpload.bind(this.fileExplorer);
        }

        // console.log('created explorer', this.fileExplorer);


        if (!this.fileExplorerWindow) {
            this.fileExplorerWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'file-explorer',
                title: 'Buddy Files',
                app: 'file-explorer',
                icon: 'desktop/assets/images/icons/icon_file-explorer_64.webp',
                x: 100,
                y: 30,
                width: 1000,
                height: 600,
                minWidth: 200,
                minHeight: 200,
                panel: options.panel || false,
                parent: options.parent || $('#desktop')[0],
                content: this.fileExplorer.container,
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: async () => {
                    // delete the local reference to the file explorer

                    await this.remove();

                    this.fileExplorerWindow = null;
                }
            });

            this.fileExplorerWindow.container.classList.add('has-droparea');

            // this window should have no selectable text
            this.fileExplorerWindow.container.style.userSelect = 'none';
            this.create();

            this.bp.on('auth::qtoken', 'reload-file-explorer', async (data) => {
                // console.log('auth::qtoken event received, reloading file explorer');
                // reload the file explorer
                // just close and re-open the file explorer window ( for now )
                // TODO: make it easier to refresh the file explorer session without closing it
                if (this.fileExplorerWindow) {
                    await this.remove();
                    this.fileExplorerWindow.close();
                }
                this.fileExplorerWindow = null;
                this.fileExplorer = null;
                this.open();

            });

        } else {
            // jsTree should be ready at this point ( as file-explorer was already created )
            // this could have race condition if spammed opened on first load
            if (this.options.context) {
                this.fileExplorer.renderPathContents(this.options.context);

            } else {
                this.fileExplorer.renderPathContents('/');

            }

        }
        this.fileExplorerWindow.maximize();

        if (this.bp.me === "Guest") {
            $('.upload-message', '.bp-file-explorer-drag-upload').html('Guest account files are read-only.<br/>Please  <button class="open-app action-button" data-app="buddylist">log in</button> to BuddyPond.');
            $('.storage-used', '.bp-file-explorer-drag-upload').remove();

        }


        return this.fileExplorerWindow;
    }

    async close() {
        if (this.fileExplorerWindow) {
            await this.remove();
            this.fileExplorerWindow.close();
            this.fileExplorerWindow = null;
        }
    }

}

FileExplorer.prototype.getCloudFiles = getCloudFiles;
FileExplorer.prototype.buildJsTreeData = buildJsTreeData;