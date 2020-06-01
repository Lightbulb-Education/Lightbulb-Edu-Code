//template html for course preview card
var listItemTemplate = `
<a class="list-group-item list-group-item-action h3" data-link="
      href{:'/project-overview?id=' + id}
      class{merge:completed toggle='list-group-item-success'}" 
>
<span data-link="
  class{merge:!completed toggle='badge-primary'}
  class{merge:completed toggle='badge-success'}" 
  class="badge badge-primary badge-pill">` + "{^{:order}}" + `</span> 
  <span class="h3">{{:name}}</span>
  <h6 class="show-later mt-2">` + "{^{:desc}}" + `</h6>
</a>`


var tmplCard = $.templates(listItemTemplate);

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

    var courseId = getUrlVars()["id"]
    //db.collection("")
    db.collection("courses").doc(courseId).onSnapshot(function(querySnapshot) {
      var data = querySnapshot.data()
      if(data){
        $("#course-name").text(data.name)
        document.title = data.name + " - Lightbulb Education Code"

        $("#course").addClass("hidden")
        $("#spinner").removeClass("hidden")

        //sets counter for determining end of loop
        var i = 0;

        //clears projects array before loading new snapshot
        projects = []

        data.projects.forEach(function(projectId){
          //check if user has finished the project
          var projectRef = db.collection('projects').doc(projectId);
          projectRef.get().then(function(project) {
            var userRef = db.collection('users').doc(user.email).collection("projects").doc(projectId);
            userRef.get().then(function(userData){
              var projectInfo = project.data()

              var tags = projectInfo.tags
              var completed = userData.exists ? userData.data().projectSubmitted : false
              projects.push({
                id : project.id, 
                anchor : "#" + project.id, 
                name : projectInfo.name, 
                desc : projectInfo.description,
                tags : tags, 
                order : i, 
                beginner : tags.includes("beginner"), 
                intermediate : tags.includes("intermediate"), 
                advanced : tags.includes("advanced"),
                completed: completed
              });

              //runs on last document load
              if(i == data.projects.length - 1){
                tmplCard.link("#listgroup", projects);

                $("#listgroup > li").not(".list-group-item-success").first().click()

                fixPadding()
                $("#spinner").addClass("hidden")
                $("#course").removeClass("hidden")

                i = 0
              }else{
                i++
              }
            })
          })
        })
      }else{
        window.location.replace = "/404"
      }
    })
  } else {
    // No user is signed in.
  }
});