/**
 * Created by IvanP on 20.09.2016.
 */

/**
 * `HTMLImports` is a polyfill for HTML imports that inject HTML into document
 * @external HTMLImports
 * @see {@link https://github.com/webcomponents/webcomponentsjs/}
 * */
/**
 * `VisualFixtureTest` allows to test fixtures visually by dynamically injecting them into document's body (on `HTMLImportsLoaded` event) and executing a provided generic or fixture-specific callback on the fixture.
 * @listens module:HTMLImports~event:HTMLImportsLoaded
 * @namespace VisualFixtureTest
 * */
/**
 * An object that contains contains all callbacks, which names are keys in the object. Might contain a `default` function if a callback was passed nameless
 * */
window.fixtureExecutionStack = {};

// initilaize process on `HTMLImportsLoaded` after all fixture imports have loaded into the document
window.addEventListener("HTMLImportsLoaded",function(e){
  var imports = [].slice.call(e.detail.allImports);
  createSelector(imports);
});

/**
 * Creates a select with imports names in it, listens to its changes and loads the selected fixtures into DOM
 * @param {Array} imports - array of import elements
 * @memberOf VisualFixtureTest
 * */
function createSelector(imports){
  var selector = document.createElement('select');
  selector.id = "fixtureSelector";
  selector.addEventListener("change",function(e){
    extractImport(getImportByName(e.target.value));
  });
  selector.setAttribute('style','padding: 8px;');
  // add imports as options to select
  imports.forEach(function(imp){
    var name = extractImportFilename(imp.href);
    imp.setAttribute('id',name.link);
    var option = document.createElement('option');
    option.value = name.link;
    option.text =  name.name;
    selector.appendChild(option);
  });

  document.querySelector('body').appendChild(selector);

  extractImport(imports[0]); //launch the first import one as a default one
}

/**
 * Gets the name of an import from a filename
 * @param {String} src - the path with a file-name of the fixture
 * @return {{link:String,name:String}} Returns an object with `link` (a dash-concatenated fixture file-name without extension) and a `name` (same as link, but space-separated)
 * @memberOf VisualFixtureTest
 * */
function extractImportFilename(src){
  var link = src.substring(src.lastIndexOf('/') + 1).split('.')[0];
  var name = link.replace(/-/g,' ');
  return {link:link, name:name};
}
/**
 * Returns an import that matches a name from the imports array
 * @param {String} id - id of the import
 * @return {HTMLLinkElement} Returns the element of a `<link rel="import">`
 * @memberOf VisualFixtureTest
 * */
function getImportByName(id){
  return document.querySelector('#'+id);
}
/**
 * Extracts import into documentd and executes a named/default callback on it
 * @param {HTMLLinkElement} imp - `<link rel="import">` element
 * @memberOf VisualFixtureTest
 * */
function extractImport(imp){
  var container = document.querySelector('#fixtureContainer');
  container.setAttribute('style','margin-top:8px;border-top: 1px solid #f2f2f2; padding-top:8px');
  if(!container){
    container = document.createElement('div');
    container.id='fixtureContainer';
    document.querySelector('body').appendChild(container);
  }
  container.innerHTML = imp.import.querySelector('body').innerHTML;
  document.querySelector('title').textContent = 'Visual test for "'+ imp.id.replace(/-/g,' ')+'"'; // update page title with the fixture name
  executeFixtureCallback(imp.id);
}
/**
 * Adds a fixture processing callback to the execution chain. You may pass several fixtures and several callbacks that will be executed on those.
 * Passing a `name` argument helps avoid fixture callback collision and makes the callback fixture-specific.
 *
 * ```
 *
 * // will executed on all fixtures in the document every time the fixture is loaded.
 * // it's assumed this callback will be executed for all fixtures that don't have a fixture-specific code. There can be only one default (nameless) fixture callback on a page
 * testFixture(function(){
   *    // fixture processing code
   * });
 *
 * //////////////////////////////////////////////////////////////////////////////////
 *
 * // functions will be executed per named fixture
 *
 * testFixture('my-awesome-fixture', function(){
   *    //code executed only for `my-awesome-fixture.html`
   * });
 * testFixture('my-super-awesome-fixture', function(){
   *    //code executed only for `my-super-awesome-fixture.html`
   * });
 *
 * ```
 *
 * @param {String} [name] - A dash(`-`)-concatenated name of the fixture that corresponds to the fixture filename without `.html` extension.
 * If fixture is along path `../__tests__/fixtures/my-awesome-fixture.html`, the name would be `my-awesome-fixture`. Providing a name makes the fixture execution code be fixture-specific.
 * Pass this argument only if you need a fixture-specific execution configuration. If this option is omitted, it's assumed that the callback function is to be executed for all fixtures imported into the document.
 * @param {Function} callback - a callback function that will be executed every time the fixture is loaded
 * @memberOf VisualFixtureTest
 * */
function testFixture(){
  if(arguments && arguments.length>0){
    if(typeof arguments[0] == 'string' && typeof arguments[1] == 'function'){ // first argument is a name and second is a function
      // argument name must contain no spaces
      if(arguments[0].indexOf(' ')!=-1){throw new TypeError('`name` argument mustn\'t contain any spaces, it\'s must be a dash-separated string, the same as fixture filename without `.html` extension')}
      fixtureExecutionStack[arguments[0]] = arguments[1];
    } else if(typeof arguments[0] == 'function'){
      fixtureExecutionStack['default'] = arguments[0];
    } else {
      throw new TypeError('`callback` must be a function, not a '+ typeof arguments[0]);
    }
  } else {
    throw new Error('You need to pass arguments to the testFixture function');
  }
}

/**
 * Executes a named fixture callback if it exists, if not looks up for a default one and executes it
 * @param {String} name - a dash-concatenated fixture file-name without extension
 * @memberOf VisualFixtureTest
 * */
function executeFixtureCallback(name){
  if(name){
    if(typeof fixtureExecutionStack[name]=='function'){
      fixtureExecutionStack[name]();
    } else if(typeof fixtureExecutionStack['default']=='function'){
      fixtureExecutionStack['default']();
    } else {
      throw new TypeError('callbacks '+JSON.stringify(Object.keys(fixtureExecutionStack))+' do not match the "'+ name+'" fixture. Besides there\'s no default callback specified');
    }
  } else {
    throw new TypeError('executionFixtureCallback needs a fixture name')
  }
}
