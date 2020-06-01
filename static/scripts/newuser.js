$(function(){
  // Add a new user in collection "users"
  function addUser(name, username, role){

    // Get a new write batch
    var batch = db.batch();

    var user = db.collection("users").doc(email)
    batch.set(user, {
        name: name,
        username: username,
        role: role,
        public: db.doc('users/' + username),
        photourl: photoURL
    });

    var publicUser = db.collection("users-public").doc(username)
    batch.set(publicUser, {
      username: username,
      photourl: photoURL
    });  

    var placeholder = db.collection("users").doc(email).collection("projects").doc("placeholder")

    batch.set(placeholder, {
      note: "Placeholder project document"
    });

    var placeholder2 = db.collection("users").doc(email).collection("courses").doc("placeholder")

    batch.set(placeholder2, {
      note: "Placeholder courses document"
    });

    batch.commit().then(function() {
        console.log("User successfully created!");
        window.location.replace("/dashboard")
    })
    .catch(function(error) {
        console.error("Error creating user: ", error);
    });
  }


  //Create a query against the collection.
    
  $("#newuser-form").on("submit", function(e){
    e.preventDefault();
    $.get("https://www.purgomalum.com/service/containsprofanity?text=" + $('#username').val(), function(response1){
      if(response1 == "true"){
        alert("Try again buddy")
      }else{
        var name = $("#fname").val()
        var username = $("#username").val()
        var role = $("#Role option:selected").val()

        // if(usersRef.where("username", "==", username) != null){
        //   $("#usernameHelp").html("username already exists");
        //   return;
        // }
        addUser(name, username, role)
      }
    })
  });

  var validUsername = false;

  $('#username').popover({
    container: 'body',
    trigger: 'manual'
  })
  $('#username').popover('hide')


  $('#username').on('input',function(e){
    if(!$(this).val()) return 0
    // Create a reference to the public users collection
    var usersRef = db.collection('users-public').doc($(this).val())
    usersRef.get().then((docSnapshot) => {
      
      //check if username is taken
      if (docSnapshot.exists) {
        usersRef.onSnapshot((doc) => {
          //username is taken
          $(this).popover('show');
          $(this).addClass('is-invalid')

          validUsername = false;
          checkValidationSubmit()
        });
      } else {
        //username is not taken
        $(this).popover('hide');
        $(this).removeClass('is-invalid')
        validUsername = true;
        checkValidationSubmit()
      }
    })
  });
  
  $('*').on('input', checkValidationSubmit);

  $("#username").alphanum({
      allow              : '',
      disallow           : '',
      allowSpace         : false,
      allowNumeric       : true,
      allowUpper         : true,
      allowLower         : true,
      allowCaseless      : true,
      allowLatin         : true,
      allowOtherCharSets : false,
      forceUpper         : false,
      forceLower         : false,
      maxLength          : 20
  });

  $("#fname").alphanum({
      allow              : '&-()',
      disallow           : '',
      allowSpace         : true,
      allowNumeric       : false,
      allowUpper         : true,
      allowLower         : true,
      allowCaseless      : true,
      allowLatin         : true,
      allowOtherCharSets : true,
      forceUpper         : false,
      forceLower         : false,
  });

  function checkValidationSubmit(){
    if($('#username').val() && $('#fname').val() && $('#Role').val() && validUsername){
      $('#submitForm').attr('disabled', false)
    }else{
      $('#submitForm').attr('disabled', true)
    } 
  }
  
})
