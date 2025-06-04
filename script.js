console.log("starting javascript");
let currentsong = new Audio();
let songs;
function convertDecimalSecondsToMinutes(seconds) {
    // Ensure seconds is a non-negative number
    if (isNaN(seconds) || seconds < 0 ){
        return "00:00";
    }

    // Calculate whole minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds with leading zeros if necessary
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// // Example usage:
// console.log(convertSecondsToMinutes(72));  // Output: "01:12"
// console.log(convertSecondsToMinutes(366)); // Output: "06:06"
// console.log(convertSecondsToMinutes(45));  // Output: "00:45"


async function getsongs(){
    let a= await fetch("http://127.0.0.1:3000/songs/")
    let response= await a.text();
    console.log(response);

    let div= document.createElement("div")
    div.innerHTML=response;

    let as=div.getElementsByTagName("a")
    
    let songs=[];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

const playmusic =(track, pause=false)=>{
    // var audio = new Audio("/songs/"+ track);
    currentsong.src= ("/songs/"+ track);
    if(!pause){
         currentsong.play();
        play.src="/svgs/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML= decodeURI(track)
    document.querySelector(".songtime").innerHTML=""
}

async function main(){
    // get song list
    songs = await getsongs();
    console.log(songs);

    playmusic(songs[0],true)

    let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML=songul.innerHTML + `<li> 
              <img src="/svgs/music.svg" alt="music" class="invert">
              <div class="info">
                <div>${song.replaceAll("%20"," ")}</div>
                <div>Ayush</div>
              </div>
              <div class="playnow">
                <img src="/svgs/playsong.svg" alt="playsong" class="invert">
              </div>
        </li>`;
    }

    // attaching event listners to each songs
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);   
            playmusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })


    // attaching evengt listners to play,next and previous
    play.addEventListener("click", ()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src="/svgs/pause.svg";
        }
        else{
            currentsong.pause()
            play.src="/svgs/playsong.svg";
        }
    })

    // listing for time update events
    currentsong.addEventListener("timeupdate" ,()=>{
        console.log(currentsong.currentTime,currentsong.duration);
        document.querySelector(".songtime").innerHTML=`${convertDecimalSecondsToMinutes(currentsong.currentTime)}/${convertDecimalSecondsToMinutes(currentsong.duration)}`
        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100 + "%";
    })

        // addingb event to listner seekbar
        document.querySelector(".seekbar").addEventListener("click",e=>{
            let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
            document.querySelector(".circle").style.left= percent + "%";
            currentsong.currentTime=(currentsong.duration)*percent/100
        
    })

    // adding eventlistner for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })

    // adding eventlistner for closebutton
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-100%"
    })

    // add event lister to perv and next
    previous.addEventListener("click",()=>{
        currentsong.pause()
        console.log("previous clicked");
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(songs,index);
        if((index-1) >= 0){
            playmusic(songs[index-1])
        }
    })


    next.addEventListener("click",()=>{
        currentsong.pause()
        console.log("next clicked");
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(songs,index);
        if((index+1) < songs.length){
            playmusic(songs[index+1])
        }
    })
}

main();

