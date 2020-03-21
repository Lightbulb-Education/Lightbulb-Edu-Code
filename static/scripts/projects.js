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
          <a data-link="href{:'/projects?id=' + id}" class="btn btn-primary">Open Project</a>
        </div>
			</div>
		</div>`;

var tmpl = $.templates(cardTemplate);

//retrieves projects from database
function getProjects(){
  db.collection("projects").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id}  ${doc.data()}`);
    });
  });
}


var projects = []
db.collection("projects").onSnapshot(function(querySnapshot) {
  $("#projects").addClass("hidden")
  $("#spinner").removeClass("hidden")
  //clears loaded projects for user whenever database is updated
  projects = []

  querySnapshot.forEach(function(doc) {
    var tags = doc.data().tags
      projects.push({id : doc.id, name : doc.data().name, desc : doc.data().description, tags : tags, beginner : tags.includes("beginner"), intermediate : tags.includes("intermediate"), advanced : tags.includes("advanced")});
      
  });
  console.log("Current cities in CA: ", projects.join(", "));

  $("#spinner").fadeOut("hidden")

  tmpl.link("#projects", projects);
  
  setTimeout(function(){
    $("#projects").removeClass("hidden")
  }, 400)
  
  
});