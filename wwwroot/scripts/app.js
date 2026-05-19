import { fsApi } from "./api/fsApi.js";
import { createLayout } from "./ui/layout.js";
import { renderFolderTree } from "./ui/tree.js";
import { renderListing } from "./ui/listing.js";
import { initDragDrop } from "./features/dragDrop.js";
import { getCurrentPathFromHash, setCurrentPathInHash } from "./utils/pathUtils.js";
import { renderSearch } from "./ui/search.js";

class App {
    constructor() {
        createLayout();

        window.addEventListener("hashchange", () => this.loadAView());
        window.addEventListener("load", () => this.loadAView());

        console.log(this.currentPath)
        initDragDrop(true, () => this.currentPath, () => this.loadAView());

        document.getElementById("search-btn").addEventListener("click", () => {
            this.searchFiles();
        });

        document.getElementById("search-reset").addEventListener("click", () => {
            this.resetSearch();
        });
    }

    async resetSearch() {
        const currentPath = getCurrentPathFromHash() || "#";
        setCurrentPathInHash(currentPath.substring(0, currentPath.indexOf("?search=")));
    }

    async searchFiles() {
        let query = document.getElementById("search-input").value.trim();
        if (!query) return;
        setCurrentPathInHash(`${getCurrentPathFromHash()}?search=${encodeURIComponent(query)}`);
    };

    async loadAView() {
        const hash = getCurrentPathFromHash();
        const searchMatch = hash.match(/^(.*)\?search=(.*)$/);

        if (searchMatch) {
            const path = searchMatch[1];
            const query = decodeURIComponent(searchMatch[2]);
            document.getElementById("search-input").value = query;
            document.body.classList.add("search-mode"); 
            this.loadSearchQuery();
        } else {
            document.getElementById("search-input").value = "";
            document.body.classList.remove("search-mode"); 
            this.loadDirectory();
        }
    }

    async loadSearchQuery() {
        let query = document.getElementById("search-input").value.trim();
        if (!query) return;

        let data;
        try {
            data = await fsApi.search(query);
        } catch (err) {
            console.error(err);
            return;
        }

        renderSearch(data);
    };

    async loadDirectory() {
        this.currentPath = getCurrentPathFromHash();

        let data;
        try {
            data = await fsApi.list(this.currentPath);
        } catch (err) {
            console.error(err);
            return;
        }

        renderFolderTree(data.path || "", data);
        renderListing(data);
    }
}

new App();
