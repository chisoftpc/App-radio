let numItems = 10;

$(document).ready(() => {
  $(".ui-listview, li").slice(numItems).hide();

  $(window).scroll(() => {
    if ($(window).scrollTop() + $(window).height() >= $(document).height() - 20) {
      $(".ui-listview, li").slice(numItems, (numItems * 2)).fadeIn(420);
      numItems = numItems + numItems;
    }
  });
});



$(document).ready(function () {
  var counter = 0;
  var c = 0;
  var i = setInterval(function () {

    $(".loading-page .counter h1").html(c + "%");

    $(".loading-page .counter hr").css("width", c + "%");

    counter++;
    c++;

    if (counter == 101) {
      clearInterval(i);
      document.getElementById('cargando').style.display = "none";
      document.getElementById('nointernet').style.display = "block";

    }
  }, 100);
});

var images = $(".musicq");

$(images).on("error", function (event) {
  $(event.target).attr("src", "./icon.png");
});

var valorcokie = getCookie("galleta");
var valorselect;

$("#buscar").on("keyup", function () {
  var patron = $(this).val().toUpperCase();

  // si el campo está vacío
  if (patron == "") {

    document.getElementById("mt").style.display = "none";


    // mostrar todos los elementos
    $(".music-card-list").css("display", "flex");

    // si tiene valores, realizar la búsqueda
  } else {
    // atravesar la lista
    $(".music-card-list").each(function () {

      if ($(this).text().indexOf(patron) < 0) {
        // si el texto NO contiene el patrón de búsqueda, esconde el elemento

        document.getElementById("mt").style.display = "block";


        $(this).css("display", "none");
      } else {
        // si el texto SÍ contiene el patrón de búsqueda, muestra el elemento

        document.getElementById("mt").style.display = "block";


        $(this).css("display", "flex");
      }
    });
  }
});


function mt() {

  $(".music-card-list").css("display", "flex");

  document.getElementById("mt").style.display = "none";

  document.getElementById("buscar").style.display = "none";
  document.getElementById("sin").style.display = "none";
}

$(document).ready(function () {
  $("body").keypress(function (e) {

    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) {
      document.getElementById('buscar').style.display = "none";
      //document.getElementById('buscar').value = "";
    }
  });
});

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 6000 * 6000 * 1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  valorcokie = getCookie("galleta");
  if (valorselect == valorcokie) {
    document.querySelector("ii").style.color = 'red'
  } else {

    document.querySelector("ii").style.color = 'white'
  }
}

function en(id) {
  valorselect = id;
  if (valorselect !== undefined) {

    document.querySelector("ii").style.color = 'red'
  } else {
    document.querySelector("ii").style.color = 'white'
  }
  setCookie("galleta", valorselect, 30);
}

function deleteCookie(galleta) {
  setCookie(galleta, "", -1);
}

var mainContainer = document.getElementById("main-container");
var musicPlayer = document.getElementById("music-player")
var musicPlayList = document.getElementById("music-playlist")
var responceData;
var xhttp = new XMLHttpRequest();
xhttp.open('GET', "https://chisoftpc.es/gear/radios/show2.php", true);

xhttp.onreadystatechange = function () {

  if (this.readyState === 4) {
    responceData = JSON.parse(this.responseText)

    for (var i = 0; i < responceData.length; i++) {
   musicPlayList.appendChild(createMusicCardList(responceData[i], i))
    }
    musicPlayer.appendChild(createMusicPlayer(responceData[0], 0))

    document.getElementById('loading-page').style.display = "none";
    document.getElementById(valorcokie).click();
    document.getElementById('pause-btn-id').click();
  }
}
xhttp.send()

function createMusicPlayer(data, i) {

  var musicCard = document.createElement("div")
  musicCard.className = "music-card"
  musicPlayer.appendChild(musicCard)
  var audioTrack = document.createElement("audio")
  //audioTrack.muted = "muted"
  audioTrack.id = "play-audio"
  audioTrack.src = data.file;
  musicCard.appendChild(audioTrack)
  var playerImage = document.createElement("img");
  playerImage.className = "player-image";
  playerImage.src = data.albumCover;

  document.getElementById("musicq").src = data.albumCover;

  musicCard.appendChild(playerImage)

  var musicIcons = document.createElement("div")
  musicIcons.className = "play-btn"
  musicCard.appendChild(musicIcons)

  var favoritoPlayBtn = document.createElement("i")

  favoritoPlayBtn.innerHTML = ' <ii class="fa fa-heart" id=' + data.id + ' onClick="en(id)"></ii>';

  favoritoPlayBtn.classList.add("player-icon")
  favoritoPlayBtn.onclick = function () {

  }

  musicIcons.appendChild(favoritoPlayBtn)
  var backwordPlayBtn = document.createElement("i")
  backwordPlayBtn.className = "fa fa-step-backward";

  backwordPlayBtn.id = data.id;

  backwordPlayBtn.innerHTML = ' <ii id=' + data.id + ' onClick="en(id)"></ii>'


  backwordPlayBtn.classList.add("player-icon")
  backwordPlayBtn.onclick = function () {
    if (valorcokie == "") {


    }

    checkCookie()

    if (i > 0 && i < responceData.length - 1) {
      i--
      handleForwardBackwordList([i])
    } else {
      i = responceData.length - 1
      handleForwardBackwordList([i])
    }


  }
  musicIcons.appendChild(backwordPlayBtn)
  var playBtn = document.createElement("i")
  playBtn.className = "fa fa-play-circle"
  playBtn.classList.add("player-icon")
  playBtn.classList.add("play-icon-btn")
  playBtn.id = "play-btn-id"
  playBtn.onclick = function () {
    pauseBtn.style.display = "inline-block"
    playBtn.style.display = "none"

    audioTrack.play()
    audioTrack.ontimeupdate = function () {

    }
  }
  var pauseBtn = document.createElement("i")
  pauseBtn.className = "fa fa-pause"
  pauseBtn.classList.add("player-icon")
  pauseBtn.classList.add("play-icon-btn")
  pauseBtn.style.display = "none"
  pauseBtn.id = "pause-btn-id"
  musicIcons.appendChild(playBtn)
  pauseBtn.onclick = function () {
    pauseBtn.style.display = "none"
    playBtn.style.display = "inline-block"
    audioTrack.pause();
  }
  musicIcons.appendChild(pauseBtn)
  var forwardPlayBtn = document.createElement("i")

  forwardPlayBtn.className = "fa fa-step-forward"

  forwardPlayBtn.classList.add("player-icon")

  forwardPlayBtn.id = data.id;

  forwardPlayBtn.innerHTML = ' <ii id=' + data.id + ' onClick="en(id)"></ii>'


  forwardPlayBtn.onclick = function () {


    if (i < responceData.length - 1) {
      i++;
      handleForwardBackwordList([i])
    } else {
      i = 0;
      handleForwardBackwordList([i])
    }

  }

  musicIcons.appendChild(forwardPlayBtn)
  var restartMusicBtn = document.createElement("i")
  restartMusicBtn.className = "fa fa-search"
  restartMusicBtn.classList.add("player-icon")
  restartMusicBtn.onclick = function () {
    document.getElementById('buscar').style.display = "block";


  }
  musicIcons.appendChild(restartMusicBtn)
  var musicDetails = document.createElement("div")
  musicCard.appendChild(musicDetails)
  var musicName = document.createElement("h3")
  musicName.className = "song-name"

  musicName.innerHTML = data.track.toUpperCase();

  musicDetails.appendChild(musicName)

  function handleForwardBackwordList() {
    audioTrack.id = responceData[i].id
    audioTrack.src = ""
    audioTrack.src = responceData[i].file
    audioTrack.currentTime = 0
    playerImage.src = ''
    playerImage.src =
      responceData[i].albumCover
    musicName.innerHTML = ''
    musicName.innerHTML = responceData[i].track
    musicSinger.innerHTML = ''
    pauseBtn.style.display = "inline-block"
    playBtn.style.display = "none"
    audioTrack.play()


    document.getElementById("musicq").src = $('.player-image').attr('src');


    document.querySelector("ii").id = $('audio').attr('id');

    valorselect = $('audio').attr('id');
    checkCookie()
  }

  return musicCard;

}

function createMusicCardList(data, i) {
 
  var musicCardlist = document.createElement("li")

  musicCardlist.className = "music-card-list item li-has-3line";

  musicCardlist.id = data.id;

  musicCardlist.onclick = function () {

    document.getElementById("buscar").style.display = "none";

    elScroller.scrollTop = 0;

    musicPlayer.innerHTML = '';
    musicPlayer.appendChild(createMusicPlayer(responceData[i], i))
    var playAudio = document.getElementById("play-audio")
    playAudio.play();
    var musicPauseBtn = document.getElementById("pause-btn-id")
    musicPauseBtn.style.display = "inline-block"
    var musicPlayBtn = document.getElementById("play-btn-id")
    musicPlayBtn.style.display = "none"

    valorselect = musicCardlist.id = data.id;

    checkCookie()

  }
  var imagesb = $(".music-image");

  $(imagesb).on("error", function (event) {
    $(event.target).attr("src", "./icon.png");
  });

  var musicImage = document.createElement("img")
  musicImage.src = data.albumCover;
  musicImage.className = "lazy music-image"
  musicImage.loading = "lazy";
  musicCardlist.appendChild(musicImage)
  var musicDetails = document.createElement("div")
  musicDetails.className = "music-details"
  musicCardlist.appendChild(musicDetails)
  var musicName = document.createElement("h5")
  musicName.className = "music-name"
  musicName.innerHTML = data.track.toUpperCase().substr(0, 23);
  musicDetails.appendChild(musicName)


  return musicCardlist;
}
(function () {
  window.addEventListener('tizenhwkey', function (ev) {
    document.getElementById('buscar').style.display = "none";

    if (ev.keyName === 'back') {
      document.getElementById('buscar').style.display = "none";
      tizen.application.getCurrentApplication().exit();

      window.history.back();
    }
  });
}());
(function () {
  var SCROLL_STEP = 80;
  document.addEventListener("pagebeforeshow", function pageScrollHandler(e) {
    var page = e.target;
    elScroller = page.querySelector(".ui-scroller");

    // rotary event handler
    rotaryEventHandler = function (e) {
      if (elScroller) {
        if (e.detail.direction === "CW") {
          elScroller.scrollTop += SCROLL_STEP;
        } else if (e.detail.direction === "CCW") {
          elScroller.scrollTop -= SCROLL_STEP;
        }
      }
    };
    document.addEventListener("rotarydetent", rotaryEventHandler, false);
    page.addEventListener("pagebeforehide", function pageHideHanlder() {
      page.removeEventListener("pagebeforehide", pageHideHanlder, false);
      document.removeEventListener("rotarydetent", rotaryEventHandler, false);
    }, false);
  }, false);
}());





