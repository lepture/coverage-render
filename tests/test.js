var data = require('./data');
var render = require('../');

var html = render(data);

if (html.indexOf('part') === -1) {
  throw new Error('render failed');
} else {
  console.log('Test success.');
}
