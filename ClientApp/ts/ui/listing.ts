import { fsApi } from "../api/fsApi.js";
import { DirectoryBrowseResult } from "../types/directoryBrowseResult.types.js";

export function renderListing(data: DirectoryBrowseResult) {
    const listingElement = document.getElementById("listing") as HTMLElement;
    listingElement.innerHTML = "";

    const path = data.path || "";
    const files = data.files || [];

    const totalFileCount = data.totalFileCount || 0;
    const totalFolderCount = data.totalFolderCount || 0;
    const totalSize = data.totalSize || 0;

    const fileLabel = `${totalFileCount.toLocaleString()} File(s)`;
    const folderLabel = `${totalFolderCount.toLocaleString()} Folder(s)`;
    const sizeLabel = `Total Size: ${totalSize.toLocaleString()} bytes`;

    const list = document.createElement("ul");

    const folderNameEl = document.getElementById("folderName");
    if (folderNameEl instanceof HTMLElement) {
        folderNameEl.textContent = `Listing for: ${path || "Root"}`;
    }

    const fileCountEl = document.getElementById("fileCount");
    if (fileCountEl instanceof HTMLElement) {
        fileCountEl.textContent = `${fileLabel}, ${folderLabel}`;
    }

    const directorySizeEl = document.getElementById("directorySize");
    if (directorySizeEl instanceof HTMLElement) {
        directorySizeEl.textContent = sizeLabel;
    }

    files.forEach(f => {
        const li = document.createElement("li");
        const filePath = path ? path + "\\" + f.name : f.name;

        li.draggable = true;
        li.dataset.filePath = filePath;

        li.addEventListener("dragstart", (e: DragEvent) => {
            if (!e.dataTransfer) return;
            e.dataTransfer.setData("text/plain", filePath);
        });

        const link = document.createElement("a");
        link.href = fsApi.getBase() + "/files/" + encodeURI(filePath.replace(/\\/g, "/"));
        link.textContent = f.name;
        link.target = "_blank";

        li.appendChild(link);

        if (typeof f.size === "number") {
            const sizeSpan = document.createElement("span");
            sizeSpan.textContent = ` (${f.size.toLocaleString()} bytes)`;
            li.appendChild(sizeSpan);
        }

        list.appendChild(li);
    });

    listingElement.appendChild(list);
}
