import { fsApi } from "../api/fsApi.js";
import { SearchData, SearchMatch } from "../types/directorySearchResult.types.js";

export function renderSearch(data: SearchData): void {
    const searchListing = document.getElementById("search-listing") as HTMLElement;
    searchListing.innerHTML = "";

    const files: SearchMatch[] = data.matches || [];
    const list = document.createElement("ul");
    let totalSize = 0;

    files.forEach((f: SearchMatch) => {
        const li = document.createElement("li");
        const filePath: string = f.name;

        const link = document.createElement("a");
        link.href = fsApi.getBase() + "/files/" + encodeURI(filePath.replace(/\\/g, "/"));
        link.textContent = f.name;
        link.target = "_blank";

        li.appendChild(link);

        if (typeof f.size === "number") {
            const sizeSpan = document.createElement("span");
            sizeSpan.textContent = ` (${f.size.toLocaleString()} bytes)`;
            totalSize += f.size;
            li.appendChild(sizeSpan);
        }

        list.appendChild(li);
    });

    const fileLabel = `${files.length} File(s)`;
    const sizeLabel = `Total Size: ${totalSize.toLocaleString()} bytes`;

    (document.getElementById("searchFileCount") as HTMLElement).textContent = fileLabel;
    (document.getElementById("searchFileSize") as HTMLElement).textContent = sizeLabel;

    searchListing.appendChild(list);
}
