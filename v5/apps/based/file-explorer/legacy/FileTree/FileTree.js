// FileTree.js
// Remark: 1/6/2025 - Deciding to use jsTree instead of FileTree.js
//                    jsTree is very mature and has all APIs we need for file-explorer v1
// This file is currently not being used
export default class FileTree {
    constructor(bp, options = {}) {
        this.bp = bp;
    }

    async init() {
        await this.bp.appendCSS('/v5/apps/based/file-explorer/FileTree/FileTree.css', false, true);

    }

    create(container, options) {

        this.options = {
            onFileSelect: options.onFileSelect || ((file) => console.log('File selected:', file)),
            onFolderToggle: options.onFolderToggle || ((folder, isExpanded) => console.log('Folder toggled:', folder, isExpanded)),
            indent: options.indent || 20,
        };


        this.container = typeof container === 'string' ? document.querySelector(container) : container;


        // Initialize root container
        this.treeRoot = document.createElement('div');
        this.treeRoot.className = 'bp-filetree-container';
        this.container.appendChild(this.treeRoot);

        // Bind methods
        this.handleClick = this.handleClick.bind(this);
        this.renderItem = this.renderItem.bind(this);

        // Add event listener
        this.treeRoot.addEventListener('click', this.handleClick);
        return this;

    }

    handleClick(event) {
        const target = event.target.closest('.bp-filetree-item');
        if (!target) return;

        const isFolder = target.dataset.type === 'folder';
        const path = target.dataset.path;

        if (isFolder) {
            const isExpanded = target.classList.toggle('bp-filetree-expanded');
            const childContainer = target.nextElementSibling;
            childContainer.style.display = isExpanded ? 'block' : 'none';
            this.options.onFolderToggle(path, isExpanded);
        } else {
            this.options.onFileSelect(path, target);
        }
    }

    getFileIcon(filename) {
        // Basic file type detection based on extension
        const ext = filename.split('.').pop().toLowerCase();
        const iconMap = {
            js: '📄',
            json: '📋',
            html: '🌐',
            css: '🎨',
            png: '🖼️',
            jpg: '🖼️',
            pdf: '📑',
            default: '📄'
        };
        return iconMap[ext] || iconMap.default;
    }

    renderItem(item, level = 0) {
        const itemContainer = document.createElement('div');
        itemContainer.className = 'bp-filetree-item-container';

        const itemElement = document.createElement('div');
        itemElement.className = 'bp-filetree-item';
        itemElement.dataset.path = item.path;
        itemElement.dataset.type = item.type;
        itemElement.style.paddingLeft = `${level * this.options.indent}px`;

        // Create icon element
        const icon = document.createElement('span');
        icon.className = 'bp-filetree-icon';
        icon.textContent = item.type === 'folder' ? '📁' : this.getFileIcon(item.name);

        // Create name element
        const name = document.createElement('span');
        name.className = 'bp-filetree-name';
        name.textContent = item.name;

        itemElement.appendChild(icon);
        itemElement.appendChild(name);
        itemContainer.appendChild(itemElement);

        if (item.type === 'folder' && Array.isArray(item.children)) {
            const childContainer = document.createElement('div');
            childContainer.className = 'bp-filetree-children';
            childContainer.style.display = 'none';

            item.children.forEach(child => {
                childContainer.appendChild(this.renderItem(child, level + 1));
            });

            itemContainer.appendChild(childContainer);
        }

        return itemContainer;
    }

    toggleFolder(path) {
        const folder = this.treeRoot.querySelector(`.bp-filetree-item[data-path="${path}"]`);
        if (!folder) return;

        const isExpanded = folder.classList.toggle('bp-filetree-expanded');
        const childContainer = folder.nextElementSibling;
        childContainer.style.display = isExpanded ? 'block' : 'none';
        this.options.onFolderToggle(path, isExpanded);
    }

    render(files) {
        // Clear existing content
        this.treeRoot.innerHTML = '';
        this.files = files;
        // Render each root item
        files.forEach(file => {
            this.treeRoot.appendChild(this.renderItem(file));
        });
    }

    destroy() {
        this.treeRoot.removeEventListener('click', this.handleClick);
        this.container.removeChild(this.treeRoot);
    }


    buildFileTree(paths) {
        const root = { type: 'folder', name: 'root', path: '', children: [] };

        paths.forEach(path => {
            if (!path) return;
            const parts = path.split('/').filter(part => part.length);
            let current = root;

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const isFile = i === parts.length - 1 && part.includes('.');
                const newPath = '/' + parts.slice(0, i + 1).join('/');

                let node = current.children.find(child => child.name === part);
                if (!node) {
                    node = {
                        type: isFile ? 'file' : 'folder',
                        name: part,
                        path: newPath,
                        children: []
                    };
                    current.children.push(node);
                }

                if (!isFile) {
                    current = node;
                }
            }
        });

        return root.children; // Remove root if you don't want the top-level folder
    }


    // Helper function to find a node based on a path
    findNodeByPath(root, path) {
        const parts = path.split('/').filter(part => part.length);
        let current = root;
        for (let part of parts) {
            let next = current.find(child => child.name === part);
            if (!next) {
                return null; // Node not found
            }
            current = next;
        }
        return current;
    }

    // Function to merge new tree into the target node
    mergeTrees(targetNode, newChildren) {
        const existingNames = targetNode.children.map(child => child.name);
        newChildren.forEach(newChild => {
            if (!existingNames.includes(newChild.name)) {
                targetNode.children.push(newChild); // Add new child if it doesn't exist
            } else {
                // If the child exists and is a folder, merge recursively
                let existingChild = targetNode.children.find(child => child.name === newChild.name);
                if (existingChild.type === 'folder' && newChild.type === 'folder') {
                    mergeTrees(existingChild, newChild.children);
                }
            }
        });
    }


}