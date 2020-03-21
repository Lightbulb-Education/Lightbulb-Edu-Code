//template html for course preview card
var cardTemplate = 
    `<div class="col-sm-6 mb-4">
      <div class="card shadow-sm" data-link="
        class{merge:beginner toggle='border-left-success'}
        class{merge:intermediate toggle='border-left-warning'}
        class{merge:advanced toggle='border-left-danger'}
      ">
        <div class="card-content">
          <div class="card-header py-3">
            <h5 class="card-title m-0 font-weight-bold text-primary">` + "{^{:name}}" + `</h5>
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
          <a href="#" class="btn btn-primary">Open Course</a>
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
db.collection("courses").onSnapshot(function(querySnapshot) {
  $("#courses").addClass("hidden")
  $("#spinner").fadeIn("hidden")
  //clears loaded courses for user whenever database is updated
  courses = []

  querySnapshot.forEach(function(doc) {
    var tags = doc.data().tags
      courses.push({name : doc.data().name, desc : doc.data().description, tags : tags, beginner : tags.includes("beginner"), intermediate : tags.includes("intermediate"), advanced : tags.includes("advanced")});
      
      //$.tmpl(cardTemplate, { "name" : doc.data().name, "desc" : doc.data().description }).appendTo("#courses");
      
  });
  console.log("Current cities in CA: ", courses.join(", "));
  $("#spinner").fadeOut("hidden")


  tmpl.link("#courses", courses);
  
  setTimeout(function(){
    $("#courses").removeClass("hidden")
  }, 400)
  
  
});