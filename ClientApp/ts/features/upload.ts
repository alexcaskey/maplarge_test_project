import { fsApi } from "../api/fsApi.js";
import { getCurrentPathFromHash, setCurrentPathInHash } from "../utils/pathUtils.js";

export function initUploadDropZone(onRefresh: () => void): void {
    const zone = document.getElementById("upload-wrapper");
    if (!zone) return;

    zone.addEventListener("dragover", (e: DragEvent) => {
        if (!e.dataTransfer) return;

        const types = e.dataTransfer.types;
        const isInternal = types.includes("text/plain");
        const isExternal = types.includes("Files");

        if (isInternal) {
            // Wrong zone
            zone.classList.add("wrong-zone");
            e.dataTransfer.dropEffect = "none";
            return; // do NOT call preventDefault()
        }

        if (isExternal) {
            e.preventDefault();
            zone.classList.add("drag-over");
            zone.classList.remove("wrong-zone");
            e.dataTransfer.dropEffect = "copy";
        }
    });

    zone.addEventListener("dragleave", () => {
        zone.classList.remove("drag-over");
        zone.classList.remove("wrong-zone");
    });

    zone.addEventListener("drop", async (e: DragEvent) => {
        if (!e.dataTransfer) return;

        e.preventDefault();
        zone.classList.remove("drag-over");
        zone.classList.remove("wrong-zone");

        // If this drag came from inside your app (move/delete), ignore it
        const internalPath = e.dataTransfer.getData("text/plain");
        if (internalPath) {
            // This was a file dragged from your listing — NOT an OS file
            e.dataTransfer.dropEffect = "none";
            return;
        }

        const files = e.dataTransfer.files;
        if (!files || files.length === 0) return;

        const path = getCurrentPathFromHash() || "";

        for (const file of files) {
            await fsApi.upload(path, file);
        }

        await onRefresh();
    });

    window.addEventListener("dragover", (e: DragEvent) => {
        if (!e.dataTransfer) return;

        const target = e.target;
        if (!(target instanceof Element)) return;

        // Used to prevent droping a OS file on the page and replacing the page
        if (
            !target.closest("#upload-wrapper") &&
            !target.closest("#trash-wrapper") &&
            !target.closest("#tree")
        ) {
            e.dataTransfer.dropEffect = "none";
            e.preventDefault();
        }
    });

    window.addEventListener("drop", e => {
        if (!e.dataTransfer) return;

        const target = e.target;
        if (!(target instanceof Element)) return;

        // Used to prevent droping a OS file on the page and replacing the page
        // If outside all zones, intercept

        if (
            !target.closest("#upload-wrapper") &&
            !target.closest("#trash-wrapper") &&
            !target.closest("#tree")
        ) {
            e.dataTransfer.dropEffect = "none";
            e.preventDefault();
        }
    });
}
