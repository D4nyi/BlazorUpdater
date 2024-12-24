# Blazor Updater [![NuGet Package](https://img.shields.io/nuget/v/BlazorUpdater)](https://www.nuget.org/packages/BlazorUpdater/)

## Framework support
- .NET 6 or later version

## Summary
This page makes sure that the users are notified if we deployed a new version of our site

## How it works (brief)
- PWAs will always fetch and update themselves, but they do not use the updated content and Service Worker (SW)
- PWAs only use their new SW when the user navigates away or the page gets closed
- Page refresh does not activate the new SW
- A small script listens for the SW state change and as soon as a new SW is installed, and it is in the wait state
a small notification bar is displayed - that can be customized - in which the user can skip waiting on the new SW and make installed the current one
- *NOTE* it will make the page reload
- *NOTE* When your site deployed first with this package, the update mechanism and the component styling might not work, but the second time all the scripts and styles will be available and it will work as intended

## Usage

### Replace the Service Worker registration
- Replace the line below in the wwwroot\index.html
```html
<!-- Remove this line -->
<script>navigator.serviceWorker.register('service-worker.js');</script>

<!-- And add the following -->
<script src="_content/BlazorUpdater/updater.min.js"></script>

<!-- Optionally add the "worker" attribute to specify the service-worker.js path -->
<script src="_content/BlazorUpdater/updater.min.js" worker="path/to/service-worker.js"></script>
```

### Use the component in your app
- The top of your `MainLayout.razor` component is a good place for it
```razor
@inherits LayoutComponentBase

<BlazorUpdater.Updater />
```

### Modify your service worker
- Add an event listener to it
```js
// in service-worker.published.js
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
```