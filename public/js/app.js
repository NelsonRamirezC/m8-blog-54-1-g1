const API_URL = "";

export function getToken() {
    return localStorage.getItem("blog_token");
}

export function setToken(token) {
    localStorage.setItem("blog_token", token);
}

export function logout() {
    localStorage.removeItem("blog_token");
    window.location.href = "/index.html";
}

export function getUser() {
    const token = getToken();
    if (!token) return null;
    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    } catch {
        localStorage.removeItem("blog_token");
        return null;
    }
}

export async function apiFetch(path, options = {}) {
    const headers = new Headers(options.headers || {});
    if (options.body && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }
    if (getToken()) headers.set("Authorization", `Bearer ${getToken()}`);
    const response = await fetch(`${API_URL}${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok)
        throw new Error(data.message || "No se pudo completar la operación.");
    return data;
}

export function escapeHtml(value = "") {
    return String(value).replace(
        /[&<>'"]/g,
        (character) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "'": "&#39;",
                '"': "&quot;",
            })[character],
    );
}

export function formatDate(value) {
    return value
        ? new Intl.DateTimeFormat("es-CL", {
              dateStyle: "medium",
              timeStyle: "short",
          }).format(new Date(value))
        : "";
}

export function setupNav() {
    const user = getUser();
    document
        .querySelectorAll("[data-auth]")
        .forEach((element) => element.classList.toggle("d-none", !user));
    document
        .querySelectorAll("[data-guest]")
        .forEach((element) =>
            element.classList.toggle("d-none", Boolean(user)),
        );
    document.querySelectorAll("[data-user-name]").forEach((element) => {
        element.textContent = user?.nombre || "";
    });
    document
        .querySelectorAll("[data-logout]")
        .forEach((element) => element.addEventListener("click", logout));
}

export function showAlert(message, type = "danger") {
    const alert = document.querySelector("[data-alert]");
    if (!alert) return;
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.classList.remove("d-none");
}

export function canManage(user, ownerId) {
    return Boolean(user && (user.admin || Number(user.id) === Number(ownerId)));
}
