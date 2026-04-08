export default function jstreeEvents(treeData) {

  // TODO: connect tree to AJAX backend for granular loading ( not just loading the whole tree at once )
  // Remark: Maybe 15k files is limit without pagination?
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
          */

          "Rename": {
            "separator_before": false,
            "separator_after": false,
            "label": "Rename",
            "action": function (obj) {
              tree.edit(node);
            }
          },
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

  $('#jtree').on("rename_node.jstree", (e, data) => {
    // console.log('edit_node.jstree', e, data);
    let node = data.node;
    let oldPath = node.id;
    let newPath = data.text;
    console.log('Attempting to rename', oldPath, 'to', newPath);

    let me = this.bp.me;
    // check if newPath and oldPath are the same, if so do nothing
    if (oldPath === (me + '/' + newPath)) {
      console.log('Old path and new path are the same, no rename needed');
      return;
    }

    this.fileExplorer.client.renameFile(oldPath, newPath).then(() => {
      // console.log('File renamed successfully');
      // update the node id to the new path
      let tree = $('#jtree').jstree(true);
      tree.set_id(node, newPath);
      // console.log('Updated node id to new path', newPath);
    }).catch(err => {
      console.error('Error renaming file:', err);
      alert('Error renaming file: ' + err.message);
      // refresh the tree to reset the node name back to the old path
      $('#jtree').jstree(true).refresh();
    });
  });



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



}