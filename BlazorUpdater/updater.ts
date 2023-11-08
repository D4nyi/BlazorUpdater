const serviceWorker = document.currentScript?.getAttribute("worker") || "service-worker.js";
let updaterElement: HTMLDivElement | null = null;

function invokeServiceWorkerUpdateFlow(registration: ServiceWorkerRegistration) {
    if (updaterElement == null) {
        updaterElement = document.getElementById('updater') as HTMLDivElement;
    }

    updaterElement.classList.add('visible');

    updaterElement.querySelector('span').addEventListener('click', (ev: PointerEvent) => {
        const parent = (ev.target as HTMLElement).parentElement;
        parent.setAttribute('closing', '');

        updaterElement.addEventListener("animationend", () => {
            parent.removeAttribute("closing");
            updaterElement.classList.remove('visible');
        }, { once: true });
    });

    updaterElement.lastChild.addEventListener('click', () => {
        if (registration.waiting) {
            // let the waiting Service Worker know it should became active
            registration.waiting.postMessage('SKIP_WAITING');
        }
    });
}

// check if the browser supports serviceWorker at all
if ('serviceWorker' in navigator) {
    // wait for the page to load
    window.addEventListener('load', async () => {
        // register the service worker from the file specified
        const registration = await navigator.serviceWorker.register(serviceWorker);

        // ensure the case when the updatefound event was missed is also handled
        // by re-invoking the prompt when there's a waiting Service Worker
        if (registration.waiting) {
            invokeServiceWorkerUpdateFlow(registration);
        }

        // detect Service Worker update available and wait for it to become installed
        registration.addEventListener('updatefound', () => {
            if (registration.installing) {
                // wait until the new Service worker is actually installed (ready to take over)
                registration.installing.addEventListener('statechange', () => {
                    if (registration.waiting && navigator.serviceWorker.controller) {
                        // if there's an existing controller (previous Service Worker), show the prompt
                        invokeServiceWorkerUpdateFlow(registration);
                    }
                });
            }
        });

        let refreshing = false;

        // detect controller change and refresh the page
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                window.location.reload();
                refreshing = true;
            }
        });
    });
}

// https://esbuild.egoist.dev/
//esbuild.config.json
/*
{
  "target": ["esnext","edge119","chrome119","firefox119","safari17.1"],
  "format": "iife",
  "loader": { ".ts": "ts" },
  "minify": true,
  "platform": "browser",
  "banner": {
    "js": "\"use strict\";"
  },
  "charset": "utf8"
}
*/