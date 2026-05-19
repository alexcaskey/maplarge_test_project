import { fsApi } from "../api/fsApi.js";

export function initTrashDropZone(onRefresh) {
    const trash = document.getElementById("trash-wrapper");
    if (!trash) return;

    trash.addEventListener("dragover", e => {
        const types = e.dataTransfer.types;
        const isInternal = types.includes("text/plain");
        const isExternal = types.includes("Files");

        if (isExternal) {
            // Wrong zone
            trash.classList.add("wrong-zone");
            e.dataTransfer.dropEffect = "none";
            return; // do NOT call preventDefault()
        }

        if (isInternal) {
            e.preventDefault();
            trash.classList.add("drag-over");
            trash.classList.remove("wrong-zone");
            e.dataTransfer.dropEffect = "copy";
        }
    });

    trash.addEventListener("dragleave", () => {
        trash.classList.remove("drag-over");
        trash.classList.remove("wrong-zone");
    });

    trash.addEventListener("drop", async e => {
        e.preventDefault();
        trash.classList.remove("drag-over");
        trash.classList.remove("wrong-zone");

        const filePath = e.dataTransfer.getData("text/plain");
        if (!filePath) return;

         if (!confirm(`Delete "${filePath}"?`)) return;

        await fsApi.delete(filePath);
        await onRefresh();
    });
}
