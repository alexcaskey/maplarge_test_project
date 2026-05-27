const BASE = "/api/auth";

export const authApi = {
    async login(username: string, password: string): Promise<any> {
        const res = await fetch(`${BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    async logout(): Promise<void> {
        const res = await fetch(`${BASE}/logout`, {
            method: "POST"
        });
        if (!res.ok) throw new Error(await res.text());
    }
};
