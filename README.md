# Pool-loft-app #

## Running a server locally ##
1. Install all packages: `yarn`
1. Run server: `npm run build-and-run-server`
1. Run fake api-server: `npm run build-and-run-fake-api-server`
1. Build static files:
    * Build files for production: `npm run build-prod`
    * Build files for development: `npm run build-dev`
    * Build files for development with watching: `npm run build-dev-watch`
1. Go to [http://localhost:5000/](http://localhost:5000/)
1. Use `name` as username and `password` as password
1. Enjoy

## Changing app's settings ##
All necessary settings are placed in the `appSettings/envVarStubs` section of the package.json

* API server's port: `API_PORT`
* Assets server's port: `ASSETS_PORT`
