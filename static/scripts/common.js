//get url params
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

//signs out user and redirects to home
function signOut(){
  signOutState = true;
  firebase.auth().signOut().then(function() {
    // Simulate an HTTP redirect:
    window.location.replace("/");
  }, function(error) {
    console.error('Sign Out Error', error);
  });
}

//sets active classes on navigation sidebar
$(function(){
  var path = location.pathname
  if(path == "/projects" || path == "/project" || path == "/project-overview"){
    $("#nav-projects").addClass("active")
  }else if(path == "/dashboard"){
    $("#nav-dashboard").addClass("active")
  }else if(path == "/resources"){
    $("#nav-resources").addClass("active")
  }else if(path == "/courses" || path == "/course"){
    $("#nav-courses").addClass("active")
  }
})

//used for URL validation
function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}


//set a course as a favorite
//takes in the course id and favorite status (boolean)
function favoriteCourse(id, favorite){
  var user = firebase.auth().currentUser;

  var courseRef = db.collection('users').doc(user.email).collection("courses").doc(id);
  var favorite = favorite ? true : false

  var setWithMerge = courseRef.set({
      favorite: favorite
    }, { 
      merge: true 
    }).then(function() {
      console.log("Favorite saved");
    })
    .catch(function(error) {
      console.error("Error saving favorite: ", error);
    });
}

//set a project as a favorite
//takes in the project id and favorite status (boolean)
function favoriteProject(id, favorite){
  var user = firebase.auth().currentUser;

  var projectRef = db.collection('users').doc(user.email).collection("projects").doc(id);
  var favorite = favorite ? true : false

  var setWithMerge = projectRef.set({
      favorite: favorite
    }, { 
      merge: true 
    }).then(function() {
      console.log("Favorite saved");
    })
    .catch(function(error) {
      console.error("Error saving favorite: ", error);
    });
}

//set a project as currently working
//takes in the project id and working status (boolean)
function workingProject(id, working){
  var user = firebase.auth().currentUser;

  var projectRef = db.collection('users').doc(user.email).collection("projects").doc(id);
  var working = working ? true : false

  var setWithMerge = projectRef.set({
      working: working
    }, { 
      merge: true 
    }).then(function() {
      console.log("Working saved");
    })
    .catch(function(error) {
      console.error("Error saving working: ", error);
    });
}

//changes padding based on screen size
function fixPadding(){
  if (document.body.clientWidth > 1200) {
      $('#article').addClass('shadow-lg p-5 mt-5');
      $('#article').removeClass('p-2 mt-2');
  } else {
      $('#article').removeClass('shadow-lg p-5 mt-5');
      $('#article').addClass('p-2 mt-2');
  }
}

$(fixPadding)
$( window ).resize(fixPadding);




//service working import
(function() {
  if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
               .then(function(registration) {
               console.log('Service Worker Registered');
               return registration;
      })
      .catch(function(err) {
        console.error('Unable to register service worker.', err);
      });
      navigator.serviceWorker.ready.then(function(registration) {
        console.log('Service Worker Ready');
      });
    });
  }
})();

// let deferredPrompt;
// const btnAdd = document.querySelector('#btnAdd');

// window.addEventListener('beforeinstallprompt', (e) => {
//   console.log('beforeinstallprompt event fired');
//   e.preventDefault();
//   deferredPrompt = e;
//   btnAdd.style.visibility = 'visible';
// });

// btnAdd.addEventListener('click', (e) => {
//   btnAdd.style.visibility = 'hidden';
//   deferredPrompt.prompt();
//   deferredPrompt.userChoice
//     .then((choiceResult) => {
//       if (choiceResult.outcome === 'accepted') {
//         console.log('User accepted the A2HS prompt');
//       } else {
//         console.log('User dismissed the A2HS prompt');
//       }
//       deferredPrompt = null;
//     });
// });

window.addEventListener('appinstalled', (evt) => {
  app.logEvent('app', 'installed');
});