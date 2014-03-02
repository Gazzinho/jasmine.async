/*globals runs, waitsFor, xit */
this.AsyncSpec = (function(global){
    'use strict';

    // Private Methods
    // ---------------

  function runAsync(block, waitsForMessage, timeout){
    return function(){
      var done = false;
      var complete = function(){ done = true; };
      waitsForMessage = waitsForMessage || 'jasmine.async block to run';
      timeout = timeout || 5000;

      runs(function(){
        try{
          block(complete);
        }catch(error){
          complete();
          throw error;
        }
      });

      waitsFor(function(){
        return done;
      }, waitsForMessage, timeout);
    };
  }

  // Constructor Function
  // --------------------

  function AsyncSpec(spec){
    this.spec = spec;
  }

  // Public API
  // ----------

  AsyncSpec.prototype.beforeEach = function(block, waitsForMessage, timeout){
    this.spec.beforeEach(runAsync(block, waitsForMessage, timeout));
  };

  AsyncSpec.prototype.afterEach = function(block, waitsForMessage, timeout){
    this.spec.afterEach(runAsync(block, waitsForMessage, timeout));
  };

  AsyncSpec.prototype.it = function(description, block, waitsForMessage, timeout){
    // For some reason, `it` is not attached to the current
    // test suite, so it has to be called from the global
    // context.
    global.it(description, runAsync(block, waitsForMessage, timeout));
  };

  AsyncSpec.prototype.xit = xit;

  return AsyncSpec;
})(this);