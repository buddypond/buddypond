// import addShortCut from "./lib/shortcuts/addShortCut.js";
import addShortCut from "../../desktop/lib/shortcuts/addShortCut.js";

export default class Folder {
    constructor(data, container) {
        this.data = data;
        this.container = container || document.createElement('div');
        this.container.className = 'folder-holder';
        alert('folder constructor');
    }

    render() {
        const folderElement = document.createElement('div');
        folderElement.className = 'folder';
        folderElement.classList.add('icon', 'shortcut');
        const folderLabel = document.createElement('div');
        folderLabel.className = 'folder-label';
        folderLabel.textContent = this.data.text || 'Unnamed Folder';
        folderElement.appendChild(folderLabel);

        this.data.children.forEach(child => {
            if (child.children && child.children.length > 0) {
                let subFolderContainer = document.createElement('div');
                subFolderContainer.className = 'sub-folder';
                folderElement.appendChild(subFolderContainer);

                let subFolder = new Folder(child, subFolderContainer);
                subFolder.render();
            } else {
                addShortCut(folderElement, child, this.container);
                /*
                if (child.type === 'shortcut') {
                    addShortCut(folderElement, child);
                } else {
                    let fileElement = this.createFileElement(child);
                    folderElement.appendChild(fileElement);
                }*/
            }
        });

        this.container.appendChild(folderElement);
    }

    createFileElement(fileData) {
        const fileElement = document.createElement('div');
        fileElement.className = 'file';
        fileElement.textContent = fileData.text;
        return fileElement;
    }
}
