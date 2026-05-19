import { initUploadDropZone } from "./upload.js";
import { initTrashDropZone } from "./delete.js";
import { initFolderDropTargets } from "./move.js";

export function initDragDrop(initial, getCurrentPath, onRefresh) {
    if (initial) {
        initUploadDropZone(getCurrentPath, onRefresh);
        initTrashDropZone(onRefresh);
    }
    initFolderDropTargets(onRefresh);
}
