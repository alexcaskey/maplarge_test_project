import { fsApi } from "../api/fsApi.js";

export function initTrashDropZone(onRefresh: () => void): void {
    const trash = document.getElementById("trash-wrapper");
    if (!(trash instanceof HTMLElement)) return;

    trash.addEventListener("dragover", (e: DragEvent) => {
        if (!e.dataTransfer) return;

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

    trash.addEventListener("drop", async (e: DragEvent) => {
        if (!e.dataTransfer) return;
        
        e.preventDefault();
        trash.classList.remove("drag-over");
        trash.classList.remove("wrong-zone");

        const filePath = e.dataTransfer.getData("text/plain");
        if (!filePath) return;

        // if (!confirm(`Delete "${filePath}"?`)) return;

        await fsApi.delete(filePath);
        await onRefresh();
    });
}
