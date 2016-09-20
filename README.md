
# Visual Fixture Test

This micro-library that gives opportunity to visually test fixtures in your project that have been used for unit-testing your components.

# Setup

### Installation

To install it execute the following command in Terminal for your project directory, if this library is not included into your `package.json` yet

```
npm install --save-dev confirmitasa/r-visual-fixture-test
```

### Test page

Grab this code to create your test page. Make sure you provide a correct path to the `visual-fixture-test.js` and `HTMLImports.js` (installed with this bundle) in your file:

``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Visual test</title>
  <!-- Make sure the filepath is correct -->
  <script src="../../node_modules/webcomponents.js/src/HTMLImports/HTMLImports.js"></script>
  <!-- This script loads your module code that you want to visually test on your fixtures-->
  <script src="../../dist/r-sort-table.bundle.js"></script>

  <!-- Make sure the filepath is correct -->
  <script src="../../node_modules/r-visual-fixture-test/src/visual-fixture-test.js"></script>

  <script>
    // use the visual-fixture-test's `testFixture` to create your module's execution context for a fixture
    testFixture('table-nested-headers',function(){
      var tableTest = new Reportal.SortTable({
        source: document.querySelector('table'),
        data: [['foo','bar']]
      });
    });
  </script>

  <!-- Import necessary fixtures, they'll be automatically added to a dropdown on that page for selection. The first fixture in this import list will load on pageload. Make sure the path is correct-->
  <link rel="import" href="../__tests__/fixtures/table-nested-headers.html">

</head>
<!-- Body tag can be left empty, there's nothing you'd need to load here -->
<body></body>
</html>
```

# `testFixture()`

`testFixture()` is a function that lets you load contexts for your module execution on a per-fixture or a global basis. This is the only function you need to use to setup the process.

### Named (fixture-specific) context

`testFixture('fixture-name', function(){ /* fixture modification is here */ })`: You may pass up to two attributes to the function:

* `name` - A dash(`-`)-concatenated name of the fixture that corresponds to the fixture filename without `.html` extension.  If fixture is along path `../__tests__/fixtures/my-awesome-fixture.html`, the name would be `my-awesome-fixture`. Providing a name makes the fixture execution code be fixture-specific. Pass this argument only if you need a fixture-specific execution configuration. If this option is omitted, it's assumed that the callback function is to be executed for all fixtures imported into the document.
* `callback` - a callback function that will be executed every time the fixture is loaded

``` javascript

 // functions will be executed per named fixture

 testFixture('my-awesome-fixture', function(){
    //code executed only for `my-awesome-fixture.html`
 });
 
 testFixture('my-super-awesome-fixture', function(){
    //code executed only for `my-super-awesome-fixture.html`
 });

 ```

### Nameless (global) context

`testFixture(function(){ ... })` - if you pass only a function callback that does something to the fixture, without providing a name, it will be a default callback for all fixtures (except for those that have named callbacks)


``` javascript

 // will executed on all fixtures in the document every time the fixture is loaded.
 // It's assumed this callback will be executed for all fixtures that don't have a fixture-specific code. 
 // There can be only one default (nameless) fixture callback on a page
 testFixture(function(){
    // fixture processing code
 });

 ```

## Browser Support

This lobrary is intended to work in the latest versions of evergreen browsers. See below
for our complete browser support matrix:

| Polyfill   | IE10 | IE11+ | Chrome* | Firefox* | Safari 7+* | Chrome Android* | Mobile Safari* |
| ---------- |:----:|:-----:|:-------:|:--------:|:----------:|:---------------:|:--------------:|
| HTML Imports | ~ | ✓ | ✓ | ✓ | ✓| ✓| ✓ |

*Indicates the current version of the browser

~Indicates support may be flaky.


### Commands (configured in package.json)

- `npm install` installs all dependencies of the project
- `npm run docs` generates documentation for your project `.js` files that use JSDoc3 comments and puls them into `docs` folder
- `npm run docs-commit`  publishes documentation to `http://ConfirmitASA.github.io/[RepoName]/` where `[RepoName]` is name of your repository as well as name specified in `package.json -> name` AND `[version]` is the version in your `package.json`. 
Please make sure you have the `npm run docs-commit` command configured properly with the correct name of repo to be used there.
