import { fsApi } from "../api/fsApi.js";

export function initFolderDropTargets(onRefresh: () => void): void {
    const tree = document.getElementById("tree");
    if (!tree) return;

    document.querySelectorAll<HTMLLIElement>("li").forEach((li: HTMLLIElement) => {
        const folderPath: string | undefined  = li.dataset.folderPath || "";

        li.addEventListener("dragover", (e: DragEvent) => {
            if (!e.dataTransfer) return;

            const types = e.dataTransfer.types;
            const isInternal = types.includes("text/plain");
            const isExternal = types.includes("Files");

            if (isExternal) {
                // Wrong zone
                li.classList.add("wrong-zone");
                e.dataTransfer.dropEffect = "none";
                return; // do NOT call preventDefault()
            }

            if (isInternal) {
                e.preventDefault();
                li.classList.add("drag-over");
                li.classList.remove("wrong-zone");
                e.dataTransfer.dropEffect = "copy";
            }
        });

        li.addEventListener("dragleave", () => {
            li.classList.remove("drag-over");
            li.classList.remove("wrong-zone");
        });

        li.addEventListener("drop", async (e: DragEvent) => {
            if (!e.dataTransfer) return;

            e.preventDefault();
            li.classList.remove("drag-over");
            li.classList.remove("wrong-zone");

            const sourceFile = e.dataTransfer.getData("text/plain");
            if (!sourceFile) return;

            await fsApi.move(sourceFile, folderPath);
            await onRefresh();
        });
    });
}
