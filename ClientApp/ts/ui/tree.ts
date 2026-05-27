import { setCurrentPathInHash } from "../utils/pathUtils.js";
import { DirectoryBrowseResult } from "../types/directoryBrowseResult.types.js";

export function renderFolderTree(path: string, data: DirectoryBrowseResult) {
    const treeEl = document.getElementById("tree") as HTMLElement;
    const parts = (path || "").split("\\").filter(p => p.length > 0);
    const folders = data.folders || [];
    const segments = [];
    let current = "";

    const rootLi = buildTreeLi("", "[root]", 0);
    segments.push(rootLi);

    // Build breadcrumb folder tree
    for (let i = 0; i < parts.length; i++) {
        current = current ? current + "\\" + parts[i] : parts[i];
        const li = buildTreeLi(current, parts[i], i+1);
        segments.push(li);
    }

    // Highlight the current folder in the tree
    const lastAnchor = segments[segments.length - 1].querySelector("a");
    if (lastAnchor) {
        lastAnchor.style.fontWeight = "bold";
    }

    // sub-folders of the current folder
    folders.forEach(f => {
        const folderPath = path ? path + "\\" + f.name : f.name;
        const li = buildTreeLi(folderPath, f.name, parts.length + 1);
        segments.push(li);
    });

    treeEl.innerHTML = "";

    const ul = document.createElement("ul");
    segments.forEach(el => ul.appendChild(el));
    treeEl.appendChild(ul);
}

function buildTreeLi(current: string, content: string, i: number): HTMLLIElement {
    const li = document.createElement("li");
    const link = document.createElement("a");

    li.dataset.folderPath = current;

    link.href = "#" + current.replace(/\\/g, "/");
    link.textContent = `${"─".repeat(i)}➤ ${content}`;
    link.onclick = (e) => {
        e.preventDefault();
        const tgt = e.currentTarget as HTMLAnchorElement | null;
        if (!tgt) return;
        setCurrentPathInHash(tgt.href);
    };

    li.appendChild(link);
    return li;
}
