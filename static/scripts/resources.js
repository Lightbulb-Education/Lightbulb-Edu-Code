//template html for course preview card
var cardTemplate = 
    `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
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
          <a data-link="href{:url}" target="_blank" class="btn btn-primary">Open</a>
        </div>
			</div>
		</div>`;

var tmpl = $.templates(cardTemplate);

var resources = []
db.collection("resources").onSnapshot(function(querySnapshot) {
  //prep formatting
  $("#resources").addClass("hidden")
  $("#spinner").fadeIn("hidden")

  //clears loaded courses for user whenever database is updated
  resources = []

  //loads all resources from database into array
  querySnapshot.forEach(function(doc) {
    var tags = doc.data().tags
      resources.push({
        name : doc.data().name, 
        desc : doc.data().description, 
        url : doc.data().url, 
        tags : tags, beginner : tags.includes("beginner"), 
        intermediate : tags.includes("intermediate"), 
        advanced : tags.includes("advanced")
      });
  });

  $("#spinner").fadeOut()

  tmpl.link("#resources", resources);

  //wait for spinner fadeout
  setTimeout(function(){
    $("#resources").removeClass("hidden")
  }, 400)
  
});