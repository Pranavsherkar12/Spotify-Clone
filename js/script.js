console.log("Lets start the JavaScript!!!");


let songs;
let currentsong = new Audio();
let currfolder;
let toggleMute;
// let URL = "http://127.0.0.1:5500"
//

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
  currfolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
songUL.innerHTML = ""
for (const song of songs) {
   songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Harry</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`; 
}

Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click", element =>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
})
return songs;
 
}

const playmusic = (track, pause = false) => {
  currentsong.src = `/${currfolder}/` + track
  if (!pause) {
      currentsong.play()
      play.src = "img/pause.svg"
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}


async function displayAlbums(){
  let a = await fetch("/songs/")
  let response = await a.text()
  let div = document.createElement("div")
  div.innerHTML = response
  let anchor = div.getElementsByTagName("a")
  let cardcontainer = document.querySelector(".cardcontainer")
  let array = Array.from(anchor)

    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      
    
    if(e.href.includes("/songs/")){
      let folder = e.href.split("/").slice(-1)[0]
      let a = await fetch(`songs/${folder}/info.json`)
      
      let response = await a.json();
      cardcontainer.innerHTML = cardcontainer.innerHTML + ` <div data-folder="${folder}" class="card">
              <div class="play">
                
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://

                www.w3.org/2000/svg">
                
                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" />
                </svg>
              </div>
              <img
                src="/songs/${folder}/cover.jpg"
                alt=""
              />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`
      

    
    }
  }


  Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click", async item=>{
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
      playmusic(songs[0])
    })
  })


}
  




async function main(){

await getsongs("songs/ncs");
playmusic(songs[0],true)

//
displayAlbums();

//
play.addEventListener("click",()=>{
  if(currentsong.paused){
    currentsong.play()
    play.src = "img/pause.svg"
  }
  else{
    currentsong.pause()
    play.src = "img/play.svg"

  }
})



//
currentsong.addEventListener("timeupdate", () => {
  document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
  document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%";
})

//
document.querySelector(".seekbar").addEventListener("click", e => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".circle").style.left = percent + "%";
  currentsong.currentTime = ((currentsong.duration) * percent) / 100
})

//
document.querySelector(".hamburger").addEventListener("click", ()=>{
  document.querySelector(".left").style.left = "0"
})

//
document.querySelector(".close").addEventListener("click", ()=>{
  document.querySelector(".left").style.left = "-120%"
})


//
previous.addEventListener("click",()=>{
  currentsong.pause()
  let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
  if(index-1 >= 0){
    playmusic(songs[index-1])
  }
})

next.addEventListener("click",()=>{
  currentsong.pause()
  let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
  if(index+1 < songs.length){
    playmusic(songs[index+1])
  }
})

//
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
  console.log(e, e.target, e.target.value)
  let volume = e.target.value
  currentsong.volume = volume/100

})


//
document.querySelector(".volume>img").addEventListener("click", e=>{
if(e.target.src.includes("volume.svg")){
  e.target.src = e.target.src.replace("volume.svg","mute.svg") 
  currentsong.volume = 0
  document.querySelector(".range").getElementsByTagName("input")[0].value = 0
}
else{
  e.target.src = e.target.src.replace("mute.svg","volume.svg") 
  currentsong.volume = 0.1
  document.querySelector(".range").getElementsByTagName("input")[0].value = 10
}
})



}

main()