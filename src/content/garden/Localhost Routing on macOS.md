+++
title = "Localhost Routing on macOS"
slug = "localhost-routing"
created = 2026-09-17
tags = ["tech", "localhost"]
aliases = ["Localhost Routing"]
description = "How to setup Caddy as a local router for *.localhost domains."
+++

When you have several local projects running on different ports, URLs like this get annoying quickly:

```text
http://localhost:5173
http://localhost:5990
http://localhost:8787
```

A simple local Caddy reverse proxy lets you replace them with memorable URLs:

```text
http://my-app.localhost
http://admin.localhost
http://docs.localhost
```

For this use case, Caddy is a great fit: the configuration is tiny, WebSockets generally work without extra setup, and Homebrew can run it automatically as a macOS service.

## Install Caddy

If you already have Homebrew:

```sh
brew install caddy
```

The Homebrew Caddyfile lives at:

```sh
$(brew --prefix)/etc/Caddyfile
```

You can print the exact path with:

```sh
echo "$(brew --prefix)/etc/Caddyfile"
```

## Add a local route

Suppose your dev server runs at:

```text
http://localhost:5173
```

Add this to the Caddyfile:

```caddyfile
http://my-app.localhost {
    reverse_proxy 127.0.0.1:5173
}
```

Now visit:

```text
http://my-app.localhost
```

Your application still runs on port `5173`; Caddy simply provides a friendlier address in front of it.

You normally do **not** need to edit `/etc/hosts`. Names under `.localhost` are intended for local loopback use.

## Add more projects

Just add another block for each application:

```caddyfile
http://my-app.localhost {
    reverse_proxy 127.0.0.1:5173
}

http://admin.localhost {
    reverse_proxy 127.0.0.1:5174
}

http://docs.localhost {
    reverse_proxy 127.0.0.1:8787
}
```

Caddy's reverse proxy handles WebSockets, so development features such as Vite HMR usually work without additional configuration.

<div class="border border-orange-500 px-5 rounded-lg">

**TIP:** Have each project run on a specific port by adding it to the appropriate script in the `package.json` file: `vite dev --port 5999`

</div>

## Run Caddy automatically

Start Caddy through Homebrew:

```sh
brew services start caddy
```

This starts it immediately and registers it as a macOS service that runs when you log in.

Useful commands:

```sh
brew services list
brew services restart caddy
brew services stop caddy
```

There is generally no reason to create your own `launchd` configuration when using the Homebrew package.

## Reload after editing the Caddyfile

Validate the configuration first:

```sh
caddy validate --config "$(brew --prefix)/etc/Caddyfile"
```

Then reload it:

```sh
caddy reload --config "$(brew --prefix)/etc/Caddyfile"
```

Or, for a development machine, simply restart the service:

```sh
brew services restart caddy
```

## Optional: one file per project

If you accumulate a lot of routes, you can split them out into separate files. The main Caddyfile becomes simply:

```caddyfile
import caddy-sites/*.caddy
```

Create the directory:

```sh
mkdir -p "$(brew --prefix)/etc/caddy-sites"
```

Then give each project its own file, for example:

```text
$(brew --prefix)/etc/caddy-sites/my-app.caddy
```

containing:

```caddyfile
http://my-app.localhost {
    reverse_proxy 127.0.0.1:5173
}
```

This makes adding and removing new routes easy. You could probably whip up a simple shell script to add a new one in a single step.

## HTTP is usually enough

For normal local development, I prefer explicitly using HTTP:

```caddyfile
http://my-app.localhost {
    reverse_proxy 127.0.0.1:5173
}
```

It avoids local certificate management and is enough for most applications.

If you specifically need to test TLS, secure-cookie behavior, HTTPS-only APIs, or similar production behavior, remove the `http://` prefix:

```caddyfile
my-app.localhost {
    reverse_proxy 127.0.0.1:5173
}
```

Caddy can then use its local certificate authority for HTTPS.

## Troubleshooting

First make sure the application works directly:

```text
http://localhost:5173
```

Then check Caddy:

```sh
brew services list
caddy validate --config "$(brew --prefix)/etc/Caddyfile"
```

If the application works on `localhost` but not through the friendly hostname, the development server may restrict allowed hostnames. Look for settings named things like `allowedHosts`, `trustedHosts`, or `host`.

If Caddy says port 80 is already in use:

```sh
lsof -nP -iTCP:80 -sTCP:LISTEN
```

That will show what is already listening there.

That's the whole setup: keep your existing dev servers on their normal ports and let Caddy provide memorable `.localhost` names in front of them.
