import { authApi } from "../api/authApi.js";
const isOpenClass = "modal-is-open";
const openingClass = "modal-is-opening";
const closingClass = "modal-is-closing";
const scrollbarWidthCssVar = "--pico-scrollbar-width";
const animationDuration = 400;
let visibleModal = null;
export function handleUnauthorized() {
    openModal(document.querySelector('[id="login-modal"]'));
    document.getElementById("modal-login")?.addEventListener("click", (e) => {
        if (e.preventDefault) {
            e.preventDefault();
        }
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        authApi.login(usernameInput?.value || "", passwordInput?.value || "").then(() => {
            closeModal(document.querySelector('[id="login-modal"]'));
            window.location.reload();
        }).catch(() => {
            alert("Login failed. Please try again.");
        });
    });
}
export function handleLogout() {
    document.getElementById("logout-btn")?.addEventListener("click", (e) => {
        if (e.preventDefault) {
            e.preventDefault();
        }
        authApi.logout().then(() => {
            window.location.reload();
        }).catch(() => {
            alert("Logout failed. Please try again.");
        });
    });
}
const openModal = (modal) => {
    debugger;
    if (!modal)
        return;
    const { documentElement: html } = document;
    const scrollbarWidth = getScrollbarWidth();
    if (scrollbarWidth) {
        html.style.setProperty(scrollbarWidthCssVar, `${scrollbarWidth}px`);
    }
    html.classList.add(isOpenClass, openingClass);
    setTimeout(() => {
        visibleModal = modal;
        html.classList.remove(openingClass);
    }, animationDuration);
    modal.showModal();
};
const closeModal = (modal) => {
    if (!modal)
        return;
    visibleModal = null;
    const { documentElement: html } = document;
    html.classList.add(closingClass);
    setTimeout(() => {
        html.classList.remove(closingClass, isOpenClass);
        html.style.removeProperty(scrollbarWidthCssVar);
        modal.close();
    }, animationDuration);
};
document.addEventListener("click", (event) => {
    if (visibleModal === null || !(event.target instanceof HTMLElement))
        return;
    const modalContent = visibleModal.querySelector("article");
    if (!modalContent)
        return;
    const isClickInside = modalContent.contains(event.target);
    !isClickInside && closeModal(visibleModal);
});
document.addEventListener("keydown", (event) => {
    if (!(event instanceof KeyboardEvent))
        return;
    if (event.key === "Escape" && visibleModal) {
        closeModal(visibleModal);
    }
});
const getScrollbarWidth = () => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    return scrollbarWidth;
};
const isScrollbarVisible = () => {
    return document.body.scrollHeight > screen.height;
};
