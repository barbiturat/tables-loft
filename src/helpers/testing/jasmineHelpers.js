/* global beforeEach:true, jsc:true */
/* eslint strict:[2,"function"] */
beforeEach(function() {
  'use strict';

  this.addMatchers({
    // eslint-disable-line no-invalid-this
    // Expects that property is synchronous
    toHold: function() {
      var actual = this.actual;
      var notText = this.isNot ? ' not' : '';

      /* global window */
      var quiet = window && !/verbose=true/.test(window.location.search);

      var r = jsc.check(actual, { quiet: quiet });

      var counterExampleText =
        r === true ? '' : 'Counterexample found: ' + r.counterexamplestr;

      this.message = function() {
        return (
          'Expected property to' + notText + ' hold. ' + counterExampleText
        );
      };

      return r === true;
    }
  });
});
