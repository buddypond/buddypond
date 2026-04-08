export default function renderPathContents(path) {

    // $('.bp-file-explorer-address-input').val(path); // maybe no slash?

    // let previewPath = path.replace(this.bp.me + '/', ''); // remove the /me/ part from the path
    let previewPath = path;
    this.setPreviewAddressBar(previewPath);

    path = path.replace('/', '');
    let instance = $('#jtree').jstree(true);

    if (path === '') {
        path = this.bp.me;
    }

    // console.log('going to merge metadata from ', this.cloudFiles)
    let node = instance.get_node(path);
    if (node) {

        // Remark: Removed 4/8/26 - no need to select node on rendering path contents?
        // This may not be correct, it may only be if the node is the root node
        // $('#jtree').jstree('select_node', node.id);
        let type = node.children.length > 0 ? 'folder' : 'file';

        if (type === 'file') {
            this.showFile(this.bp.me, path);
            return;
        }

        this.currentSelectedNode = node;

        let contents = node.children;

        // check this.cloudFiles.metadata[node.id] for the contents of the folder
        // it *should* always exist, if not show error

        if (!this.cloudFiles) {
            alert('cloudFiles not loaded cannot show contents');
            return;
        }


        // go through each child and get their node data from jstree
        contents = contents.map(child => {
            let childNode = instance.get_node(child);

            let metadata = {};
            let childPath = childNode.id.replace(this.bp.me + '/', ''); // remove the /me/ part from the path
            childPath = childNode.id;

            if (!this.cloudFiles.metadata[childPath]) {
                // Remark: Folders are not returning metadata?
                // TODO: should server return folder metadata?
                //console.error(`No metadata found for ${childNode.id} cannot show metadata`);
                //console.error(`This should *not* happen and indicates that the metadata and Object Store are out of sync`);
                // console.warn(`No metadata found for ${childPath}, assuming empty folder`);
            } else {
                // we found the metadata ( as expected )
                // console.log('found metadata for', childPath, this.cloudFiles.metadata[childPath]);
                metadata = this.cloudFiles.metadata[childPath];
            }

            return {
                name: childNode.text,
                type: childNode.children.length > 0 ? 'folder' : 'file',
                path: childNode.id,
                size: metadata.size,
                date: metadata.lastModified
            };
        });
        // console.log('5555 showing contents of folder', node.id, contents);
        // update the .bp-file-explorer-address-input with the folder path
        //$('.bp-file-explorer-address-input').val('/' + this.bp.me + '/' + node.id);

        this.renderFolderContents(contents);

    }

}