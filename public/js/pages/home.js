var homePage = (function() {
    // private var declarations
    var $csrfToken, $addFriendForm, $friendFormTxt, $friendFormInput, $friendFilterInput,
        $friendsList;
    // private method declarations
    var cacheReferences, bindEvents, onAddFriendSubmit, setAddStatus,
        onActionBtnClick, onUnfriendBtnClick, configureAjax;


    /**
     * Creates a pre-filter for AJAX requests. Sets the CSRF Token stored in
     * page header meta tag.
     * @return {[type]} [description]
     */
    configureAjax = function() {
      $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        jqXHR.setRequestHeader('X-CSRF-Token', $csrfToken);
      });
    }

    /**
     * Caches DOM references for later use
     * @type {[type]}
     */
    cacheReferences = function() {
        console.log('homePage.cacheReferences()');
        $csrfToken         = $('meta[name="csrf-token"]').attr('content');
        $addFriendForm     = $('#addfriend-form');
        $friendsList       = $('#friends-list');
        $friendFormInput   = $addFriendForm.find(':input[type="email"]');
        $friendFormTxt     = $addFriendForm.find('p.help-block');
        $friendFilterInput = $('#friend-filter');
    };


    /**
     * Binds any external plugins to events
     * @return {[type]} [description]
     */
    bindPlugins = function() {
      $('[title!=""]').qtip({
        style:    { classes: 'qtip-bootstrap' },
        position: { my: 'bottom right', at: 'top left', target: this }
      });
      $('#friends-list').btsListFilter('#friend-filter',{itemChild: 'li.name'});
    };


    /**
     * Attaches handlers to events.
     * @type {[type]}
     */
    bindEvents = function() {
        console.log('homePage.bindEvents()');
        $addFriendForm.on('submit', onAddFriendSubmit);
        $('.actions button').click( onActionBtnClick );
    };


    /**
     * handles whenever an action button is clicked in the Friends list
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    onActionBtnClick = function(e) {
      var actionType = e.target.className; // type of action we're performing
      var targetName = $(this).parent().siblings('li.name').text(); // name of the target in friends list

      if( actionType === 'ion-checkmark-circled' ) {
        // accept friend request clicked.
        addFriend(targetName);
      }
      else if ( actionType === 'ion-minus-circled' ) {
        // reject friend request clicked.
        // confirm.
        swal({
            title: "Turn down friend request from "+targetName+"?",
            text: "You can re-add them later if you change your mind.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yeah, get rid of 'em!",
            closeOnConfirm: false
        }, function() {
            removeFriend(targetName);
            swal("Poof!", "And just like that, your friendship with "+targetName+" is no more.", "success");
        });
      }
    };


    /**
     * Takes in the profile name of a friendship, finds that friendship with active
     * user and removes it.
     * @param  {[type]} targetName [description]
     * @return {[type]}            [description]
     */
    removeFriend = function(targetName) {
      console.log('home:removeFriend()');
      $.post('/account/friends/delete/'+targetName,
        function(data) {
        console.log('data returned from $.post: ');
        console.dir(data);
      });
    };


    /**
     * [onAddFriendSubmit description]
     * @type {[type]}
     */
    onAddFriendSubmit = function(e) {
        e.preventDefault();
        var input = $.trim($friendFormInput.val());
        // on no text entered:
        if (input.length === 0) {
            setAddStatus('You must provide an email address.', 'red', 'shake');
            return;
        }
        // perform ajax search
        $.ajax({
            url: '/api/addFriend/' + input,
            type: 'POST',
            data: $addFriendForm.serialize()
        }).done(function(resp) {
            console.log("success");
            setAddStatus(resp.statusMsg, 'green', 'pulse');
        }).fail(function(resp) {
            console.log("error");
            setAddStatus(resp.responseJSON.statusMsg, 'red', 'shake');
        }).always(function(resp) {
            console.log("complete");
        });
    };


    /**
     * updates the status text of the add-friend form.
     * @type {[type]}
     */
    setAddStatus = function(statusMsg, color, animation) {
        $friendFormTxt.css('color', color).text(statusMsg).addClass('animated ' + animation);
        $friendFormTxt.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $friendFormTxt.empty().removeClass('animated ' + animation);
        });
    };
    return {
        init: function() {
            console.log('homePage.init()');
            cacheReferences();
            configureAjax();
            bindPlugins();
            bindEvents();
        }
    };
})();