# Blazor Updater [![NuGet Package](https://img.shields.io/nuget/v/BlazorUpdater)](https://www.nuget.org/packages/BlazorUpdater/)

## Framwork support
- NET 6 or later

## Summary
This page makes sure that the users are notified if we deployed a new version of pur site

## How it works (brief)
- PWAs will always fetch and update themselvs but they does not use the updated content and Service Worker (SW)
- PWA's only use their new SW's when the the user navigates away or the page was closed, if the page refresh does not triggers the new SW to be activated
- A small scripts listens for the SW state changes and as soon as a new SW is installed and it is in the wait state
a small notification bar displayed - that can be customized - in which the user can skip waiting on the new SW and make it the installed current one.
- *NOTE* it will make the page reload!

## Usage

### Relpace the Service Worker registration
- Relpace the line below in the wwwroot\index.html
```html
<!-- Remove this line -->
<script>navigator.serviceWorker.register('service-worker.js');</script>

<!-- And add the following -->
<script src="_content/BlazorUpdater/updater.min.js"></script>

<!-- Optionally add the "worker" attribute to specify the service-worker.js path -->
<script src="_content/BlazorUpdater/updater.min.js" worker="path/to/service-worker.js"></script>
```

### Use the component in your app
- A good place would be at the top of your `MainLayout.razor` component
```razor
@inherits LayoutComponentBase

<BlazorUpdater.Updater />
```

### Modify your service worker
- Add an eventlistener to it
```js
// in service-worker.published.js
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
```