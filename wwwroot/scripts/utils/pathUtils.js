export function getCurrentPathFromHash() {
    const hash = window.location.hash || "";
    if (!hash || hash === "#") return "";
    const raw = decodeURIComponent(hash.substring(1));
    return raw.replace(/\//g, "\\");
}

export function setCurrentPathInHash(path) {
    path = (path || '#').substring((path || '#').indexOf("#") + 1);
    window.location.hash = path;
}
