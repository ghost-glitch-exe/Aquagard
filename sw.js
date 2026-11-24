/* AQUA GUARD Service Worker */
'use strict';

const SW_VERSION = '1.0.0';

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

function showAlert(payload) {
  if (!payload || !payload.title) {
    return Promise.reject(new Error('Invalid notification payload'));
  }

  const options = Object.assign(
    {
      tag: 'aquaguard-alert',
      renotify: true,
      requireInteraction: false,
      data: {}
    },
    payload.options || {}
  );

  options.data = Object.assign(
    { url: self.registration.scope },
    options.data
  );

  return self.registration.showNotification(payload.title, options);
}

self.addEventListener('message', function (event) {
  const msg = event.data || {};
  const port = event.ports && event.ports[0];

  const reply = function (data) {
    if (port) port.postMessage(data);
  };

  if (msg.type === 'PING') {
    reply({ ok: true, version: SW_VERSION });
    return;
  }

  if (msg.type === 'SHOW_NOTIFICATION') {
    event.waitUntil(
      showAlert(msg.payload)
        .then(function () {
          reply({ ok: true });
        })
        .catch(function (err) {
          reply({
            ok: false,
            error: String((err && err.message) || err)
          });
        })
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  const notification = event.notification;
  const data = notification.data || {};

  notification.close();

  if (event.action === 'dismiss') return;

  const target = new URL(
    data.url || self.registration.scope,
    self.registration.scope
  ).href;

  event.waitUntil((async function () {
    const windowClients = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });

    let client = null;

    for (const c of windowClients) {
      if (c.url.indexOf(self.registration.scope) === 0) {
        client = c;
        break;
      }
    }

    if (client) {
      try {
        await client.focus();
      } catch (e) {}

      client.postMessage({
        type: 'NOTIFICATION_CLICKED',
        data: data
      });
    } else if (self.clients.openWindow) {
      await self.clients.openWindow(target);
    }
  })());
});

self.addEventListener('push', function (event) {
  let d = {};

  try {
    d = event.data ? event.data.json() : {};
  } catch (e) {
    d = {
      title: 'AQUA GUARD',
      body: event.data ? event.data.text() : ''
    };
  }

  event.waitUntil(showAlert({
    title: d.title || 'AQUA GUARD alert',
    options: {
      body: d.body || '',
      tag: d.tag || 'aquaguard-push',
      data: d.data || {}
    }
  }));
});/* AQUA GUARD Service Worker */
'use strict';

const SW_VERSION = '1.0.0';

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

function showAlert(payload) {
  if (!payload || !payload.title) {
    return Promise.reject(new Error('Invalid notification payload'));
  }

  const options = Object.assign(
    {
      tag: 'aquaguard-alert',
      renotify: true,
      requireInteraction: false,
      data: {}
    },
    payload.options || {}
  );

  options.data = Object.assign(
    { url: self.registration.scope },
    options.data
  );

  return self.registration.showNotification(payload.title, options);
}

self.addEventListener('message', function (event) {
  const msg = event.data || {};
  const port = event.ports && event.ports[0];

  const reply = function (data) {
    if (port) port.postMessage(data);
  };

  if (msg.type === 'PING') {
    reply({ ok: true, version: SW_VERSION });
    return;
  }

  if (msg.type === 'SHOW_NOTIFICATION') {
    event.waitUntil(
      showAlert(msg.payload)
        .then(function () {
          reply({ ok: true });
        })
        .catch(function (err) {
          reply({
            ok: false,
            error: String((err && err.message) || err)
          });
        })
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  const notification = event.notification;
  const data = notification.data || {};

  notification.close();

  if (event.action === 'dismiss') return;

  const target = new URL(
    data.url || self.registration.scope,
    self.registration.scope
  ).href;

  event.waitUntil((async function () {
    const windowClients = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });

    let client = null;

    for (const c of windowClients) {
      if (c.url.indexOf(self.registration.scope) === 0) {
        client = c;
        break;
      }
    }

    if (client) {
      try {
        await client.focus();
      } catch (e) {}

      client.postMessage({
        type: 'NOTIFICATION_CLICKED',
        data: data
      });
    } else if (self.clients.openWindow) {
      await self.clients.openWindow(target);
    }
  })());
});

self.addEventListener('push', function (event) {
  let d = {};

  try {
    d = event.data ? event.data.json() : {};
  } catch (e) {
    d = {
      title: 'AQUA GUARD',
      body: event.data ? event.data.text() : ''
    };
  }

  event.waitUntil(showAlert({
    title: d.title || 'AQUA GUARD alert',
    options: {
      body: d.body || '',
      tag: d.tag || 'aquaguard-push',
      data: d.data || {}
    }
  }));
});
