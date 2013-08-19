# Coverage Render

Combine coverages into one coverage.


## Install

Install it with npm:

    $ npm install mocha-render

## Usage

```js
var coverages = [];
coverages.push(cov1);
coverages.push(cov2);
// ...

var render = require('mocha-render');
var html = render(coverages);
process.stdout.write(html);
```

## API

```
var render = require('mocha-render');
```

### render(coverages)

Render the array of coverage object into html.

### render.parse(coverages)

Combine the array of coverage object into one object.
