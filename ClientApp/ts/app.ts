import { fsApi } from "./api/fsApi.js";
import { createLayout } from "./ui/layout.js";
import { renderFolderTree } from "./ui/tree.js";
import { renderListing } from "./ui/listing.js";
import { initDragDrop } from "./features/dragDrop.js";
import { getCurrentPathFromHash, setCurrentPathInHash } from "./utils/pathUtils.js";
import { renderSearch } from "./ui/search.js";
import { handleLogout } from "./utils/authHandler.js";

class App {

    constructor() {
        createLayout();

        window.addEventListener("hashchange", () => this.loadAView());
        window.addEventListener("load", () => this.loadAView());

        initDragDrop(true, () => this.loadAView());

        const searchbtn = document.querySelector<HTMLButtonElement>("#search-btn");
        if (searchbtn) {
            searchbtn.addEventListener("click", () => {
                this.searchFiles();
            });
        }

        const resetBtn = document.querySelector<HTMLButtonElement>("#search-reset");
        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                this.resetSearch();
            });
        }

        handleLogout();
    }

    async resetSearch(): Promise<void> {
        const currentPath = getCurrentPathFromHash() || "#";
        setCurrentPathInHash(currentPath.substring(0, currentPath.indexOf("?search=")));
    }

    async searchFiles(): Promise<void> {
        let query = (document.getElementById("search-input") as HTMLInputElement).value.trim();
        if (!query) return;
        setCurrentPathInHash(`${getCurrentPathFromHash()}?search=${encodeURIComponent(query)}`);
    };

    async loadAView(): Promise<void> {
        const hash = getCurrentPathFromHash();
        const searchMatch = hash.match(/^(.*)\?search=(.*)$/);

        if (searchMatch) {
            const path = searchMatch[1];
            const query = decodeURIComponent(searchMatch[2]);
            (document.getElementById("search-input") as HTMLInputElement).value = query;
            document.body.classList.add("search-mode"); 
            this.loadSearchQuery();
        } else {
            (document.getElementById("search-input") as HTMLInputElement).value = "";
            document.body.classList.remove("search-mode"); 
            this.loadDirectory();
        }
    }

    async loadSearchQuery(): Promise<void> {
        let query = (document.getElementById("search-input") as HTMLInputElement).value.trim();
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

    async loadDirectory(): Promise<void> {
        let data;
        try {
            data = await fsApi.list(getCurrentPathFromHash());
        } catch (err) {
            console.error(err);
            return;
        }

        renderFolderTree(data.path || "", data);
        renderListing(data);

        // Re‑wire folder drop targets after tree re-render
        initDragDrop(false, () => this.loadDirectory());
    }
}

new App();
