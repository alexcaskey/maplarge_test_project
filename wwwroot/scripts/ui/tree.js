import { setCurrentPathInHash } from "../utils/pathUtils.js";
import { fsApi } from "../api/fsApi.js";

export function renderFolderTree(path, data) {
    const treeEl = document.getElementById("tree");
    const breadcrumbEl = document.getElementById("breadcrumb");
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

    segments[segments.length - 1].querySelector("a").style.fontWeight = "bold";

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

function buildTreeLi(current, content, i) {
    const li = document.createElement("li");
    const link = document.createElement("a");

    li.dataset.folderPath = current;

    link.href = "#" + current.replace(/\\/g, "/");
    link.textContent = `${"─".repeat(i)}➤ ${content}`;
    link.onclick = (e) => {
        e.preventDefault();
        setCurrentPathInHash(e.currentTarget.href);
    };

    li.appendChild(link);
    return li;
}
