import { fsApi } from "../api/fsApi.js";

export function renderSearch(data) {
    const searchListing = document.getElementById("search-listing");
    searchListing.innerHTML = "";

    const files = data.matches || [];
    const list = document.createElement("ul");
    let totalSize = 0;

    files.forEach(f => {
        const li = document.createElement("li");
        const filePath = f.name;

        const link = document.createElement("a");
        link.href = fsApi.getBase() + "/" + encodeURI(filePath.replace(/\\/g, "/"));
        link.textContent = f.name;
        link.target = "_blank";

        li.appendChild(link);

        if (typeof f.size === "number") {
            const sizeSpan = document.createElement("span");
            sizeSpan.textContent = " (" + f.size + " bytes)";
            totalSize += f.size;
            li.appendChild(sizeSpan);
        }

        list.appendChild(li);
    });

    const fileLabel = `${files.length} File(s)`;
    const sizeLabel = `Total Size: ${totalSize} bytes`;

    document.getElementById("searchFileCount").textContent = fileLabel;
    document.getElementById("searchFileSize").textContent = sizeLabel;

    searchListing.appendChild(list);
}
