var cardTemplate = `<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-4 animated--grow-in"><div data-link="id{:id}" class="card shadow-sm">
  <div class="card-body">
    <h5 class="card-title">` + "{^{:name}}" + `</h5>
    <a data-link="
      class{merge:!completed toggle='btn-primary'}
      class{merge:completed toggle='btn-success'}
      href{:'/project-overview?id=' + id}
      " class="btn btn-primary">Open
    </a>
  </div>
</div></div>`

var cardTemplate2 = `<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-4 animated--grow-in"><div data-link="id{:id}" class="card shadow-sm">
  <div class="card-body">
    <h5 class="card-title">` + "{^{:name}}" + `</h5>
    <a data-link="
      class{merge:!completed toggle='btn-primary'}
      class{merge:completed toggle='btn-success'}
      href{:'/course?id=' + id}
      " class="btn btn-primary">Open
    </a>
  </div>
</div></div>`

var tmpl = $.templates(cardTemplate);
var tmpl2 = $.templates(cardTemplate2);

//empty arrays for template data
//used to store cards
var favorites = []
var completed = []
var working = []
var courses = []

$(function(){
  //check user is authenticated
  firebase.auth().onAuthStateChanged(function(user) {


    if (user) {
      // User is signed in.
      db.collection("users").doc(user.email).collection("projects").onSnapshot(function(userPref){
        //resets local arrays before loading from snapshot
        favorites = []
        completed = []
        working = []

        //counter for dertermining end of for each loop
        var i = 0
        userPref.forEach(function(userProject){
          db.collection("projects").doc(userProject.id).get().then(function(doc) {
            if(doc.exists){
              var project = {
                id : doc.id, 
                name : doc.data().name, 
                desc : doc.data().description, 
                completed: userProject.data().projectSubmitted,
                favorite: userProject.data().favorite,
                working: userProject.data().working,
              };

              //show/hide 'nothing to see here' message
              if(userProject.data().working == true){
                working.push(project)
              }

              if(userProject.data().favorite == true){
                favorites.push(project)
              }

              if(userProject.data().projectSubmitted == true){
                completed.push(project)
              }
            }
            if(i == userPref.size - 1){
              $(".scroll-box").empty()
              tmpl.link("#favorites", favorites);
              tmpl.link("#completed", completed);
              tmpl.link("#working", working);
              
              if(favorites.length > 0) {
                $("#favorites-empty").hide()
              }else{
                $("#favorites-empty").show()
              }
              if(completed.length > 0) {
                $("#completed-empty").hide()
              }else{
                $("#completed-empty").show()
              }
              if(working.length > 0) {
                $("#working-empty").hide()
                
              }else{
                $("#working-empty").show()
              }

              i = 0
            }else{
              i++
            }

          })
        })
        
      })



      db.collection("users").doc(user.email).collection("courses").onSnapshot(function(userPref){
        //resets local arrays before loading from snapshot
        courses = []

        //counter for dertermining end of for each loop
        var j = 0
        userPref.forEach(function(userProject){
          db.collection("courses").doc(userProject.id).get().then(function(doc) {
            if(doc.exists){
              var course = {
                id : doc.id, 
                name : doc.data().name, 
                desc : doc.data().description, 
                completed: userProject.data().complteted,
                favorite: userProject.data().favorite,
                working: userProject.data().working,
              };

              //show/hide 'nothing to see here' message
              if(userProject.data().favorite == true){
                courses.push(course)
              }

            }
            if(j == userPref.size - 1){
              tmpl2.link("#courses", courses);
              
              if(courses.length > 0) {
                $("#courses-empty").hide()
              }else{
                $("#courses-empty").show()
              }
              j = 0
            }else{
              j++
            }

          })
        })
        
      })


    } else {
      // No user is signed in.
    }
  });
})

