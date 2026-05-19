import { fsApi } from "../api/fsApi.js";

export function renderListing(data) {
    const listingEl = document.getElementById("listing");
    listingEl.innerHTML = "";

    const path = data.path || "";
    const folders = data.folders || [];
    const files = data.files || [];

    const totalFileCount = data.totalFileCount || 0;
    const totalFolderCount = data.totalFolderCount || 0;
    const totalSize = data.totalSize || 0;

    const fileLabel = `${totalFileCount} File(s)`;
    const folderLabel = `${totalFolderCount} Folder(s)`;
    const sizeLabel = `Total Size: ${totalSize} bytes`;

    const list = document.createElement("ul");
    const tree = document.createElement("ul");

    document.getElementById("folderName").textContent = `Listing for: ${path || "Root"}`;
    document.getElementById("fileCount").textContent = `${fileLabel}, ${folderLabel}`;
    document.getElementById("directorySize").textContent = sizeLabel;

    files.forEach(f => {
        const li = document.createElement("li");
        const filePath = path ? path + "\\" + f.name : f.name;

        li.draggable = true;
        li.dataset.filePath = filePath;

        li.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", filePath);
        });

        const link = document.createElement("a");
        link.href = fsApi.getBase() + "/" + encodeURI(filePath.replace(/\\/g, "/"));
        link.textContent = f.name;
        link.target = "_blank";

        li.appendChild(link);

        if (typeof f.size === "number") {
            const sizeSpan = document.createElement("span");
            sizeSpan.textContent = " (" + f.size + " bytes)";
            li.appendChild(sizeSpan);
        }

        list.appendChild(li);
    });

    listingEl.appendChild(list);
}
