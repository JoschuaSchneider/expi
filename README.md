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

# Documentation
  
  A small overview over the functionality expi provides

## Expi.Method(options)
Usage:
```javascript
    new Method(options)
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