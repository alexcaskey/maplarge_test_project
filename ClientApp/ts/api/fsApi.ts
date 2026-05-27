import { handleUnauthorized } from "../utils/authHandler.js";

const BASE = "/api/fs";

export const fsApi = {
    async list(path = ""): Promise<any> {
        const url = `${BASE}/folders/${encodeURIComponent(path)}`;
        const res = await fetch(url);
        if (res.status === 401) {
            // Session expired or not logged in
            handleUnauthorized(); 
            return null;
        }
        if (!res.ok) throw new Error(await res.text());
        return res.json(); 
    },

    async upload(path: string, file: File): Promise<void> {
        const form = new FormData();
        form.append("file", file);

        const url = `${BASE}/files/${encodeURIComponent(path)}`;
        const res = await fetch(url, { method: "POST", body: form });
        if (!res.ok) throw new Error(await res.text());
    },

    async delete(path: string): Promise<void> {
        const res = await fetch(`${BASE}/files/${encodeURIComponent(path)}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });
        if (!res.ok) throw new Error(await res.text());
    },

    async move(source: string, target: string): Promise<void> {
        const res = await fetch(`${BASE}/files/${encodeURIComponent(source)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ target })
        });
        if (!res.ok) throw new Error(await res.text());
    },

    async search(filter: string): Promise<any> {
        const url = `${BASE}/search?query=${encodeURIComponent(filter)}`;
        const res = await fetch(url, { method: "GET" });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    getBase() {
        return BASE;
    }
};
