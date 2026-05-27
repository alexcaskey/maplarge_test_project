export function getCurrentPathFromHash(): string {
    const hash = window.location.hash || "";
    if (!hash || hash === "#") return "";
    const raw = decodeURIComponent(hash.substring(1));
    return raw.replace(/\//g, "\\");
}

export function setCurrentPathInHash(path: string): void {
    path = (path || '#').substring((path || '#').indexOf("#") + 1);
    window.location.hash = path;
}
