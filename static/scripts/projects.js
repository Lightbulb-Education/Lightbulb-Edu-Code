//template html for course preview card
var cardTemplate = 
    `<div data-link="id{:id}" class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
      <div class="card shadow-sm" data-link="
        class{merge:beginner toggle='border-left-success'}
        class{merge:intermediate toggle='border-left-warning'}
        class{merge:advanced toggle='border-left-danger'}
      ">
        <div class="card-content">
          <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          
            <h5 class="card-title m-0 font-weight-bold text-primary">` + "{^{:name}}" + `</h5>
            <div class="dropdown no-arrow">
              <i data-toggle="tooltip" data-placement="bottom" title="Mark as favorite" class='far fa-heart favorite-heart-icon ml-2'></i>
                {{if !completed}}
                 <i data-toggle="tooltip" data-placement="bottom" title="Mark as in progess" class='far fa-star favorite-star-icon ml-2 mt-2'></i>
                {{/if}}


            </div>

          </div>
          <div class="card-body">
         
            <p class="card-text">` + "{^{:desc}}" + `</p>
          </div>
        </div>

        <div class="card-body">
          <div class="tags pb-3">
                {^{if beginner}}
                  <span class="badge badge-pill badge-success">Beginner</span>
                {{/if}}
                {^{if intermediate}}
                  <span class="badge badge-pill badge-warning">Intermediate</span>
                {{/if}}
                {^{if advanced}}
                  <span class="badge badge-pill badge-danger">Advanced</span>
                {{/if}}
          </div>
          <div class="d-flex flex-row align-items-center justify-content-between">
            <a data-link="
              class{merge:!completed toggle='btn-primary'}
              class{merge:completed toggle='btn-success'}
              href{:'/project-overview?id=' + id}
              " class="btn btn-primary">Open
            </a>
          </div>
        </div>
			</div>
		</div>`;

var tmpl = $.templates(cardTemplate);


var projects = []
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    db.collection("users").doc(user.email).get().then(function(doc){
      if(doc.exists){
        if(!doc.data().admin){
          $("#add").addClass("hidden")
        }else{
          $("#add").removeClass("hidden")
        }
      }
    })

    db.collection("projects").where("published", "==", true).onSnapshot(function(querySnapshot) {
      $("#projects").addClass("hidden")
      $("#spinner").removeClass("hidden")

      //sets counter for determining end of loop
      var i = 0;

      //clears projects array before loading new snapshot
      projects = []

      querySnapshot.forEach(function(doc) {
      
        //check if user has finished the project
        var projectRef = db.collection('users').doc(user.email).collection("projects").doc(doc.id);
        projectRef.get().then(function(project) {
          var tags = doc.data().tags
          var completed = project.exists ? project.data().projectSubmitted : false
          projects.push({
            id : doc.id, 
            name : doc.data().name, 
            desc : doc.data().description, 
            tags : tags, beginner : tags.includes("beginner"), 
            intermediate : tags.includes("intermediate"), 
            advanced : tags.includes("advanced"),
            completed: completed
          });

          //runs on last document load
          if(i == querySnapshot.size - 1){
            tmpl.link("#projects", projects);
            
            //toggle favorites already selected        
            db.collection("users").doc(user.email).collection("projects").onSnapshot(function(userPref){
              userPref.forEach(function(doc){
                if(doc.data().working == true)
                    $("#"+doc.id+" .favorite-star-icon").addClass("fa");
                  else
                    $("#"+doc.id+" .favorite-star-icon").removeClass("fa");
                if(doc.data().favorite == true)
                  $("#"+doc.id+" .favorite-heart-icon").addClass("fa");
                else
                  $("#"+doc.id+" .favorite-heart-icon").removeClass("fa");
              })
            })

            //toggle favorite icon
            $(".favorite-heart-icon").click(function(){
              $(this).toggleClass("fa");
              var id = $(this).parentsUntil(".col-sm-6").parent().attr("id")

              if($(this).hasClass("fa"))
                favoriteProject(id, true)
              else
                favoriteProject(id, false)
            })

            //toggle star icon
            $(".favorite-star-icon").click(function(){
              $(this).toggleClass("fa");
              var id = $(this).parentsUntil(".col-sm-6").parent().attr("id")

              if($(this).hasClass("fa"))
                workingProject(id, true)
              else
                workingProject(id, false)
            })

            $('[data-toggle="tooltip"]').tooltip()
            $("#spinner").fadeOut("hidden")

            setTimeout(function(){
              $("#projects").removeClass("hidden")
            }, 400)

            i = 0
          }else{
            i++
          }
        }).catch(function(error) {
          console.log("Error getting document:", error);
        });
      });
    });
  } else {
    // No user is signed in.
  }
});