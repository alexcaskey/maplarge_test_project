import { initUploadDropZone } from "./upload.js";
import { initTrashDropZone } from "./delete.js";
import { initFolderDropTargets } from "./move.js";

export function initDragDrop(initial: boolean, onRefresh: () => void): void {
    if (initial) {
        initUploadDropZone(onRefresh);
        initTrashDropZone(onRefresh);
    }
    initFolderDropTargets(onRefresh);
}
