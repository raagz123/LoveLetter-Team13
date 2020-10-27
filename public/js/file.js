function showclass() {
    var element = document.getElementById("scroll_openid");
    var text1 = document.getElementById("sidetext1id");
    var text2 = document.getElementById("sidetext2id");
    element.classList.remove("hideclass");
    text1.classList.remove("hideclass");
    text2.classList.remove("hideclass");
  }
  
  
  function hideclass() {
    var element = document.getElementById("scroll_openid");
    var text1 = document.getElementById("sidetext1id");
    var text2 = document.getElementById("sidetext2id");
    element.classList.add("hideclass");
    text1.classList.add("hideclass");
    text2.classList.add("hideclass");
  }
  
  
  function togglepicture(id) {
    val = id
    var element = document.getElementById(id);
    element.classList.toggle("d-none");
  }
  
  