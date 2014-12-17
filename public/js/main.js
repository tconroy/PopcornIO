$(document).ready(function() {
  console.log('doc.rdy()');

  var pagename = location.pathname.split('/').pop();
  switch(pagename) {
    case "":        homePage.init();     break;
    case "login":   loginPage.init();    break;
    case "signup":  registerPage.init(); break;
    case "contact": contactPage.init();  break;
    case "account": accountPage.init();  break;
  }
});
