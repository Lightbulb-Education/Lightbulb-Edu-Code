//retrieves projects from database
function getProjects(){
  var allProjects = [];
  db.collection("projects").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id}  ${doc.data()}`);
    });
    return allProjects;
  });
}

// function simulateClick(id) {
//   var evt = document.createEvent("MouseEvents");
//   evt.initMouseEvent("click", true, true, window,
//     0, 0, 0, 0, 0, false, false, false, false, 0, null);
//   var a = ('a.nav-link[href="'+window.location.hash+'"]').first()
//   a.dispatchEvent(evt);      
// }

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

try{
  db.collection("projects").doc(getUrlVars()["id"].split("#")[0]).onSnapshot(function(querySnapshot) {
    $("#article").addClass("hidden")
    $("#spinner").removeClass("hidden")

    var data = querySnapshot.data()
    if(data){
      $("#title").html(querySnapshot.data().name)
      $("#description").html(querySnapshot.data().description)
      $("#page-content").html(querySnapshot.data().html)
    }else{
      window.location.href = "/404"
    }
    

    setTimeout(function(){
     $('#scroller').DynamicScrollspy({
        affix: true, //affix by default, doesn't work on Bootstrap 4
        //tH: 2, //lowest-level header to be included (H2)
        //bH: 6, //highest-level header to be included (H6)
        exclude: false, //exclude from the tree/outline any H tags matching this jquery selector
        genIDs: true, //generate random IDs for headers?
        offset: 100, //offset from viewport top for scrollspy
        ulClassNames: 'nav-pills flex-nowrap', //add this class to top-most UL
        activeClass: 'bg-primary', //active class (besides .active) to add to LI
        testing: false //if testing, append heading tagName and ID to each heading
      })
      
      $("#actual-navbar").removeClass("mb-4")


      $("#article").removeClass("hidden")

      // var offset = 6000;

      // $('.navbar li a').click(function(event) {
      //     //window.location.href = $(this).attr('href')
      //     //event.preventDefault();
      //     $($(this).attr('href'))[0].scrollIntoView();
      //     $($(this).attr('href'))[0].scrollBy(0, -offset);
      // });

      $('a.nav-link[href="'+window.location.hash+'"]').first().trigger("click");
      
    }, 300)
    
    $("#spinner").fadeOut("hidden")

  });
}catch(e){
  console.log(e)
  //window.location.href = "/404"
}

//changes padding based on screen size
function fixPadding(){
  if (document.body.clientWidth > 1200) {
      $('#article').addClass('shadow-lg p-5');
      $('#article').removeClass('p-2');
  } else {
      $('#article').removeClass('shadow-lg p-5');
      $('#article').addClass('p-2');
  }
}
fixPadding()
$( window ).resize(fixPadding);