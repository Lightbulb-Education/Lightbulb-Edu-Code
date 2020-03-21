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

//retrieves resources from database
function getResources(){
  db.collection("resources").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} resources ${doc.data()}`);
    });
  });
}


var resources = []
db.collection("resources").onSnapshot(function(querySnapshot) {
  $("#resources").addClass("hidden")
  $("#spinner").fadeIn("hidden")
  //clears loaded courses for user whenever database is updated
  resources = []

  querySnapshot.forEach(function(doc) {
    var tags = doc.data().tags
      resources.push({name : doc.data().name, desc : doc.data().description, tags : tags, beginner : tags.includes("beginner"), intermediate : tags.includes("intermediate"), advanced : tags.includes("advanced")});
      
      //$.tmpl(cardTemplate, { "name" : doc.data().name, "desc" : doc.data().description }).appendTo("#resources");
      
  });
  console.log("Current cities in CA: ", resources.join(", "));
  $("#spinner").fadeOut("hidden")


  tmpl.link("#resources", resources);
  
  setTimeout(function(){
    $("#resources").removeClass("hidden")
  }, 400)
  
  
});