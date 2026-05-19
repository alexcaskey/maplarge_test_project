// /scripts/api/fsApi.js
const BASE = "/api/fs";

export const fsApi = {
    async list(path = "") {
        const url = `${BASE}/${encodeURIComponent(path)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(await res.text());
        return res.json(); // expected: { path, parentPath, folders, files }
    },

    async upload(path, file) {
        const form = new FormData();
        form.append("file", file);

        const url = `${BASE}/upload?path=${encodeURIComponent(path)}`;
        const res = await fetch(url, { method: "POST", body: form });
        if (!res.ok) throw new Error(await res.text());
    },

    async delete(path) {
        const res = await fetch(`${BASE}/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path })
        });
        if (!res.ok) throw new Error(await res.text());
    },

    async move(source, target) {
        const res = await fetch(`${BASE}/move`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ source, target })
        });
        if (!res.ok) throw new Error(await res.text());
    },

    async search(filter) {
        const url = `${BASE}/search?query=${encodeURIComponent(filter)}`;
        const res = await fetch(url, { method: "GET" });
        if (!res.ok) throw new Error(await res.text());
        return res.json(); 
    },

    getBase() {
        return BASE;
    }
};
