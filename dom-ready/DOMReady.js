/**
 * @file Simple promised based way to await for the DOM content to be loaded.
 *
 * @since March 2026
 */

const domReady = new Promise((resolve) => {
    const resolver = () => {
        resolve();
    };

    document.addEventListener("DOMContentLoaded", resolver, {once: true});

    if (document.readyState == "complete") {
        resolver();
        document.removeEventListener("DOMContentLoaded", resolver, {once: true});
    }
});

export default domReady;