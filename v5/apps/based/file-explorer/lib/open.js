export default async function open({ context }) {
        // console.log(`Opening file explorer with context ${context}`);
        this.options.context = context;
        if (!this.fileExplorer) {
            this.fileExplorer = this.fileExplorerInstance.create();
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
                parent: $('#desktop')[0],
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

        } else {
            // jsTree should be ready at this point ( as file-explorer was already created )
            // this could have race condition if spammed opened on first load
            /*
            if (this.options.context) {
                this.fileExplorer.renderPathContents(this.options.context);

            } else {
                this.fileExplorer.renderPathContents('/');

            }
            */

        }

    }
