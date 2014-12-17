var loginPage = (function () {

  // private var declarations
  var lForm, rForm, rFormShowBtn;
  // private method declarations
  var cacheReferences, bindEvents, showRegForm, hideLoginForm;

  cacheReferences = function() {
    console.log('loginPage.cacheReferences()');
    lForm = $('#signin-form');
    rForm = $('#signup-form');
    rFormShowBtn = $('#registerBrn');
  };

  bindEvents = function() {
    console.log('loginPage.bindEvents()');
  };

  return {

    init: function() {
      console.log('loginPage.init()');
      cacheReferences();
      bindEvents();
    }
  };

})();