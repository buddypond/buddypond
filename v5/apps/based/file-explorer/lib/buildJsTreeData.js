export default function buildJsTreeData(id, paths) {
    // Sanitize text to escape special characters
    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/\u00A0/g, " "); // Replace non-breaking spaces
    }

    const root = { id, text: id, state: { opened: true }, children: [] };

    paths.forEach(path => {
        // console.log('Processing path:', path);
        const parts = path.split('/').filter(part => part.length);
        if (parts.length === 0) return; // Skip empty paths

        let current = root;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isFile = i === parts.length - 1 && part.includes('.');
            const newPath = id + '/' + parts.slice(0, i + 1).join('/');
            // console.log('newPath', newPath, 'isFile', isFile);
            // Use id (full path) to find existing node, not text
            let node = current.children.find(child => child.id === newPath);
            if (!node) {
                node = {
                    id: newPath, // Unique identifier based on the full path
                    text: part, // Sanitized display text
                    icon: isFile ? 'jstree-file' : 'jstree-folder',
                    children: isFile ? [] : [],
                    state: {
                        opened: false,
                        selected: false
                    }
                };
                current.children.push(node);
            }

            // Only navigate into non-file nodes
            if (!isFile) {
                current = node;
            }
        }
    });

    function sortTree(nodes) {
        nodes.sort((a, b) => {
            const aIsFolder = a.icon !== 'jstree-file';
            const bIsFolder = b.icon !== 'jstree-file';

            if (aIsFolder !== bIsFolder) {
                return aIsFolder ? -1 : 1;
            }

            return a.text.localeCompare(b.text);
        });

        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].children.length > 0) {
                sortTree(nodes[i].children);
            }
        }
    }

    sortTree(root.children);

    // Optional: Validate tree for circular references
    function validateTree(nodes, seenIds = new Set()) {
        for (const node of nodes) {
            if (seenIds.has(node.id)) {
                console.error(`Duplicate node ID detected: ${node.id}`);
                throw new Error(`Duplicate node ID: ${node.id}`);
            }
            seenIds.add(node.id);
            if (node.children.length > 0) {
                validateTree(node.children, seenIds);
            }
        }
    }
    // console.log("Built jsTree data:", JSON.stringify(root, null, 2));
    try {
        validateTree([root]);
    } catch (e) {
        console.error("Tree validation failed:", e.message);
        return []; // Return empty tree to prevent jsTree crash
    }

    return [root];
}
