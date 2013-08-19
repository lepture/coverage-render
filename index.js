
/**
 * Parse the given array of cov object to a single cov object.
 */
function parse(data) {

  var files = {};
  data.forEach(function(item) {
    item.files.forEach(function(file) {
      if (!files[file.filename]) {
        files[file.filename] = file;
      }
      Object.keys(file.source).forEach(function(key) {
        var value = file.source[key];
        // not sloc, ignore
        if (value.coverage === '') {
          return;
        }
        if (files[file.filename].source[key].hits === undefined) {
          files[file.filename].source[key].hits = 0;
        }
        if (value.coverage > 0) {
          files[file.filename].source[key].hits += 1;
          files[file.filename].source[key].coverage += value.coverage;
        }
      });
    });
  });

  var cov = {
    instrumentation: "node-jscoverage",
    sloc: 0,
    hits: 0
    times: data.length
  };

  cov.files = Object.keys(files).map(function(key) {
    var file = files[key];
    file.hits = 0;
    Object.keys(file.source).forEach(function(line) {
      var line = file.source[line];
      if (line.hits) {
        file.hits += 1;
      }
    });
    file.misses = file.sloc - file.hits;
    file.coverage = file.hits / file.sloc * 100;
    cov.sloc += file.sloc;
    cov.hits += file.hits;
    return file;
  });

  cov.misses = cov.sloc - cov.hits;
  cov.coverage = cov.hits / cov.sloc * 100;
  return cov;
}

/**
 * Render the array of coverage to a HTML page.
 */
function render(data) {
  var jade = require('jade');
  var path = require('path');
  var fs = require('fs');
  var file = path.join(__dirname, 'templates/coverages.jade');
  var fn = jade.compile(fs.readFileSync(file, 'utf-8'), {filename: file});

  var cov = parse(data);

  return fn({
    cov: cov,
    coverageClass: function(n) {
      if (n >= 85) return 'high';
      if (n >= 70) return 'medium';
      if (n >= 45) return 'low';
      return 'terrible';
    }
  });
}
render.parse = parse;

module.exports = render;
