var username = ""

firebase.auth().onAuthStateChanged(function(user) {
  if(user){
    db.collection("users").doc(user.email).get().then(function(doc){
      if(doc.exists){
        username = doc.data().username
      }
    })
  }else{
    console.log("User is not logged in")
  }
})

$(function(){

var quill = new Quill('#editor-container', {
  bounds: "#editor-container",
  modules: {
    syntax: true,   
    formula: true,              
    toolbar: [
      [{ header: [2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'code'],        // toggled buttons
      ['link', 'formula', 'blockquote', 'code-block'],
      ['image', 'video'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'align': [] }],
      ['clean']                                         // remove formatting button
    ]
  },
  placeholder: 'def writeProject():',  
  theme: 'snow'  // or 'bubble'
  
});

var quillOverview = new Quill('#overview-container', {
  bounds: "#overview-container",
  modules: {
    syntax: true,   
    formula: true,              
    toolbar: [
      [{ header: [2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'code'],        // toggled buttons
      ['link', 'formula', 'blockquote', 'code-block'],
      ['image', 'video'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'align': [] }],
      ['clean']                                         // remove formatting button
    ]
  },
  placeholder: 'def writeOverview():',  
  theme: 'snow'  // or 'bubble'
  

});

  var id = getUrlVars()["id"]
  var options = {
    SAFE_FOR_JQUERY: true, 
    ALLOWED_TAGS: ['h2', 'h3', 'p', "pre", 'code', 'span', 'ol', 'ul', 'li', 'a', 'img', 'blockquote', 'math', 'semantics', 'mrow', 'mi', 'mo', 's', 'sup', 'sub', 'iframe', 'div', 'strong', 'em', 'u'], 
    ALLOWED_ATTR: ['style', 'class', 'id', 'src', 'spellcheck', 'data-value', 'xmnls', 'encoding', 'src', 'href', 'frameborder', 'allowfullscreen']
  };
  
  if(id){
    db.collection("projects").doc(id).get().then(function(doc){
      if(doc.exists){
        var data = doc.data()
        $("#fname").val(data.name)
        $("#description").val(data.description)
        
        $.each(data.tags, function(i, val){
          $("input[value='" + val + "']").prop('checked', true);
        });

        if(data.overview)
          quillOverview.root.innerHTML = (DOMPurify.sanitize(data.overview, options))

        if(data.html)
          quill.root.innerHTML = (DOMPurify.sanitize(data.html, options))

        console.log("Prefilled data")
      }
    })
  }


function addProject(name, description, overview, html, tags){
  var collection = db.collection('projects');
  if(id)
    return collection.doc(id).set(
    {
      name: name,
      description: description,
      overview: overview,
      html: html,
      tags: tags,
      published: true
    });
  else
    return collection.add(
    {
      name: name,
      description: description,
      overview: overview,
      html: html,
      tags: tags,
      author: username,
      published: true
    });
}

$("#project-form").on("submit", function(e){
  e.preventDefault();
  var name = $("#fname").val()
  var description = $("#description").val()
  var overview = quillOverview.root.innerHTML;
  var html = quill.root.innerHTML;

  
  //sanitize html with DOMPurify
  overview = DOMPurify.sanitize(overview, options);
  html = DOMPurify.sanitize(html, options);

  var tags = $("#skill-levels input:checkbox:checked").map(function(){
    return $(this).val();
  }).get();

  addProject(name, description, overview, html, tags).then(e => {window.location.href="/projects"})
})

//save changes without reload
$("#commit").click(function(){
  $(this).attr("disabled", true)
  var name = $("#fname").val()
  var description = $("#description").val()
  var overview = quillOverview.root.innerHTML;
  var html = quill.root.innerHTML;

  //sanitize html with DOMPurify
  overview = DOMPurify.sanitize(overview, options);
  html = DOMPurify.sanitize(html, options);

  var tags = $("#skill-levels input:checkbox:checked").map(function(){
    return $(this).val();
  }).get();

  addProject(name, description, overview, html, tags).then(e => {$(this).attr("disabled", false)})
})

function unloadPage(){ 
  return "You sure?"
}

window.onbeforeunload = unloadPage;


})