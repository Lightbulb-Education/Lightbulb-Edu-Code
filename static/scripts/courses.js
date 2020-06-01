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
          <a data-link="
              class{merge:!completed toggle='btn-primary'}
              class{merge:completed toggle='btn-success'}
              href{:'/course?id=' + id}
              " class="btn btn-primary">Open
          </a>
        </div>
			</div>
		</div>`;

var tmpl = $.templates(cardTemplate);

//retrieves courses from database
function getCourses(){
  db.collection("courses").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} sl;kfjalsdf ${doc.data()}`);
    });
  });
}

var courses = []
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

    db.collection("courses").where("published", "==", true).onSnapshot(function(querySnapshot) {
      $("#courses").addClass("hidden")
      $("#spinner").fadeIn("hidden")
      
      //sets counter for determining end of loop
      var i = 0;

      //clears loaded courses for user whenever database is updated
      courses = []

      querySnapshot.forEach(function(doc) {
        var tags = doc.data().tags
          courses.push({
            id : doc.id,
            name : doc.data().name, 
            desc : doc.data().description, 
            tags : tags, beginner : tags.includes("beginner"), 
            intermediate : tags.includes("intermediate"), 
            advanced : tags.includes("advanced")
          });
          //$.tmpl(cardTemplate, { "name" : doc.data().name, "desc" : doc.data().description }).appendTo("#courses");
          //runs on last document load
          if(i == querySnapshot.size - 1){
            tmpl.link("#courses", courses);
            
            //toggle favorites already selected        
            db.collection("users").doc(user.email).collection("courses").onSnapshot(function(userPref){
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
                favoriteCourse(id, true)
              else
                favoriteCourse(id, false)
            })

            $('[data-toggle="tooltip"]').tooltip()
            $("#spinner").fadeOut("hidden")

            setTimeout(function(){
              $("#courses").removeClass("hidden")
            }, 400)

            i = 0
          }else{
            i++
          }
      });
      
    });

  } else{
    //No user is signed in
  }
})


