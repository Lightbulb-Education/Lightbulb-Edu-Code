//load project by url attribute 'id'
db.collection("projects").doc(getUrlVars()["id"].split("#")[0]).onSnapshot(function(querySnapshot) {
  //prepare formatting of page
  $("#article").addClass("hidden")
  $("#scroller").addClass("hidden")
  $("#spinner").removeClass("hidden")
  $("#actual-navbar").addClass("mb-2")

  //attempts to fill in html with data
  var data = querySnapshot.data()
  if(data){
    $("#title").text(data.name)
    $("#description").text(data.description)

    var html = DOMPurify.sanitize(data.html, {
      SAFE_FOR_JQUERY: true, 
      ALLOWED_TAGS: ['h2', 'h3', 'p', "pre", 'code', 'span', 'ol', 'ul', 'li', 'a', 'img', 'blockquote', 'math', 'semantics', 'mrow', 'mi', 'mo', 's', 'sup', 'sub', 'iframe', 'div', 'strong', 'em', 'u'], 
      ALLOWED_ATTR: ['style', 'class', 'id', 'src', 'spellcheck', 'data-value', 'xmnls', 'encoding', 'src', 'href', 'frameborder', 'allowfullscreen']
    });

    $("#page-content").html(html)

    $("#back").attr("href", "/project-overview?id=" + querySnapshot.id)
  }else{
    window.location.href = "/404"
  }

  $("#spinner").fadeOut()
  //wait for loading fadeout animation
  setTimeout(function(){
    $('#scroller').empty()
    
    $('#scroller').DynamicScrollspy({
      affix: true, //affix by default, doesn't work on Bootstrap 4
      tH: 2, //lowest-level header to be included (H2)
      bH: 2, //highest-level header to be included (H6)
      exclude: false, //exclude from the tree/outline any H tags matching this jquery selector
      genIDs: true, //generate random IDs for headers?
      offset: 100, //offset from viewport top for scrollspy
      ulClassNames: 'nav-pills flex-nowrap', //add this class to top-most UL
      activeClass: 'bg-primary', //active class (besides .active) to add to LI
      testing: false //if testing, append heading tagName and ID to each heading
    })
    
    //remove padding of actual nav after scrollspy loaded
    $("#actual-navbar").removeClass("mb-4")

    //code highlighting
    $(".ql-syntax").addClass("hljs")

    //center text
    $(".ql-align-center").addClass("text-center")
    $('.ql-align-right').addClass("text-right")
    $('.ql-align-justify').addClass("text-justify")

    //indent lists
    $('.ql-indent-1').addClass("ml-2")
    $('.ql-indent-2').addClass("ml-4")
    $('.ql-indent-3').addClass("ml-5")

    //video sizing
    $(".ql-video").height(0.5*$(this).width())

    //show content
    $("#article").removeClass("hidden")
    $("#scroller").removeClass("hidden")
    
    //changes padding based on screen size
    fixPadding()

    //scrolls to anchor link
    if(window.location.hash){
      $(window.location.hash)[0].scrollIntoView();
    }
  }, 400)
 
});
