var id = "";
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    db.collection("projects").doc(getUrlVars()["id"].split("#")[0]).onSnapshot(function(querySnapshot) {
      //prep formatting
      $("#article").addClass("hidden")
      $("#breadcrumb").addClass("hidden")
      $("#spinner").removeClass("hidden")
      $("#actual-navbar").addClass("mb-2")

      //attempts to load data and fill in page values
      var data = querySnapshot.data()
      if(data){
        $("#title").text(data.name)
        $("#description").text(data.description)

        var options = {
          SAFE_FOR_JQUERY: true, 
          ALLOWED_TAGS: ['h2', 'h3', 'p', "pre", 'code', 'span', 'ol', 'ul', 'li', 'a', 'img', 'blockquote', 'math', 'semantics', 'mrow', 'mi', 'mo', 's', 'sup', 'sub', 'iframe', 'div', 'strong', 'em', 'u'], 
          ALLOWED_ATTR: ['style', 'class', 'id', 'src', 'spellcheck', 'data-value', 'xmnls', 'encoding', 'src', 'href', 'frameborder', 'allowfullscreen']
        };

        var overview = DOMPurify.sanitize(data.overview, options);
        $("#overview-content").html(overview)

        $("#continue").attr("href", "/project?id=" + querySnapshot.id)

        var userRef = db.collection('users').doc(user.email)
        userRef.get().then(function(doc){
          if(doc.exists){
            if(doc.data().admin){
              $("#edit").attr("href", "/editor?id=" + querySnapshot.id)
              $("#edit").removeClass("hidden")
            }
          }
        })

        id = querySnapshot.id
        
        //check if user has finished the project        
        var projectRef = db.collection('users').doc(user.email).collection("projects").doc(id);
        projectRef.get().then(function(doc) {
          if (doc.exists) {
              if(doc.data().projectSubmitted){
                $("#submit").addClass("btn-success")
                $("#submit").removeClass("btn-primary")
                $("#submit").text("Update Link")
                $("#url").val(doc.data().url)
              }
            }
          }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        
      }else{
        window.location.href = "/404"
      }

      $("#spinner").fadeOut("hidden")

      //wait for spinner fade out
      setTimeout(function(){

        //remove padding of actual nav
        $("#actual-navbar").removeClass("mb-4")

        //code highlighting
        $(".ql-syntax").addClass("hljs")

        //center text
        $(".ql-align-center").addClass("text-center")
        $('.ql-align-right').addClass("text-right")
        $('.ql-align-justify').addClass("text-justify")

        //indent lists
        $('.ql-indent-1').addClass("ml-3")
        $('.ql-indent-2').addClass("ml-4")
        $('.ql-indent-3').addClass("ml-5")

        //video sizing
        $(".ql-video").height(0.5*$(this).width())
        
        //show article
        $("#article").removeClass("hidden")
        fixPadding()
        
        //change padding based on screen size
        if(window.location.hash)
          $(window.location.hash)[0].scrollIntoView();     
      }, 400)

    });
  } else {
    // No user is signed in.
  }
});


function submitProject(){
  var user = firebase.auth().currentUser;
  var projectRef = db.collection('users').doc(user.email).collection("projects").doc(id);
  var url = $("#url").val();
  if(!validURL(url)){
    alert("Invalid URL")
    return -1;
  }

  var setWithMerge = projectRef.set({
      projectSubmitted: true,
      url: url,
      working: false
    }, { 
      merge: true 
    }).then(function() {
      console.log("Project successfully submitted!");

      var duration = 5
      
      celebrate(duration)
      setTimeout(function(){
        location.reload();
      }, duration * 1000)
     
    })
    .catch(function(error) {
      console.error("Error submitting project: ", error);
    });
}



function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function celebrate(duration){
  var duration = duration * 1000;
  var animationEnd = Date.now() + duration;
  var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  var interval = setInterval(function() {
    var timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    var particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
  }, 100);
}