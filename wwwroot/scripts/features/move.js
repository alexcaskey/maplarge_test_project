import { fsApi } from "../api/fsApi.js";

export function initFolderDropTargets(onRefresh) {
    const tree = document.getElementById("tree");
    if (!tree) return;

    const lis = tree.querySelectorAll("li[data-folder-path]");
    lis.forEach(li => {
        const folderPath = li.dataset.folderPath;

        li.addEventListener("dragover", e => {
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

        li.addEventListener("drop", async e => {
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
