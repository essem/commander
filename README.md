# Commander

Electron app to run predefined commands

## Screenshot

![screenshot](/docs/screenshot.png?raw=true)

## Run

Install node modules.

Example with docker.

```bash
docker run -it --rm -v ${PWD}:/src node:5.1.1 sh -c "cd /src && npm install"
```
For production mode, build bundle.

Example with docker.

```bash
docker run -it --rm -v ${PWD}:/src -e NODE_ENV=production node:5.1.1 sh -c "cd /src && npm run build"
```

Run with electron in project root directory.

```bash
${ELECTRON_PATH}/electron .
```
