![Expi Logo](https://image.ibb.co/gRq45k/expi_logo.png "Expi Logo")

## expi
Modular, Minimalistic API Framework built with [express](https://www.npmjs.com/package/express).

## Installation

  Install expi using 

```bash
$ npm install --save expi
```

## Example

  A working example can be found in the modules root folder.

```bash
$ node node_modules/expi/example/app.js
```
  or
```bash
$ cd node_modules/expi && npm run example
```

## TODO
  - Documentation for:
    - Module
    - Method
    - Route
    - Expi
  - Linting
  - Testing
  - Add new features
    - Dedicated session/authentication hook
    - Custom response schema
    - Extended response functionality
    - Clusterization
    - Extended versioning (Provide versioned modules under special routes for backward compatablility)
    - New layer ontop of route parameters
  - Expose all express functions without interfering with expi functionality
  - Proper releases
  - Build tasks
  - Handling preRoutes middleware while still returning 404 on module path without a route specified
  - Handle default errors, http codes, bad requests etc.


# Documentation
  
  A small overview over the functionality expi provides

## Expi.Module(options)
Usage:
```javascript
    let Module = require('expi').Module
    let module = new Module(options)
```
### Configuration:
 - `options` 
    - `name`: The name of the Module, this gets displayed as `response.meta.name`
    - `version`: The version of the Module, this gets displayed as `response.meta.version`
    - `path`: The base path of the module. This path is relative to the root path of the server.
    - `?middleware`
        - `preRoutes`: Array of functions, these functions are plugged in as middleware before any routes and even before the internal expi-middleware
        - `postRoutes`: Array of functions, these functions are pluggin in as middleware after all routes and even after the internal expi-middleware (Caution: if expi-middleware is active, a response might be sent already!)
    - `routes`: Array of expi.Route instances
    - `?methods`: Array of expi.Method instances

_More documentation coming soon, for details take a look at the example in expi_root/example_

(This module is in an early state, use with caution)