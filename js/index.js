let playBtn,pauseBtn,nextBtn,prevBtn,repeatBtn,repeatOnBtn,shuffleBtn,volumeBtn,muteBtn,autoPlayBtn,playListBtn,seekRange,volumeRange,currentTimeText,audioLengthText,musicNo,artistName,songName,songCover,track,timer,
    autoplay = 0,
    index_no = 0,
    playing_song = false;

    // creating audio element
    track = document.createElement("audio");

    // bring in all the dom elements
    playBtn = document.querySelector(".play");
    pauseBtn = document.querySelector(".pause");
    nextBtn = document.querySelector(".next");
    prevBtn = document.querySelector(".prev");
    repeatBtn = document.querySelector(".no-repeat");
    repeatOnBtn = document.querySelector(".repeat");
    shuffleBtn = document.querySelector(".random");
    volumeBtn = document.querySelector(".off-mute");
    muteBtn = document.querySelector(".on-mute");
    autoPlayBtn = document.querySelector(".auto-play");
    playListBtn = document.querySelector("#viewPlayList");
    seekRange = document.querySelector("#seekBar");
    volumeRange = document.querySelector("#volumeRange");
    currentTimeText = document.querySelector("#currentAudioTime");
    audioLengthText = document.querySelector("#audioLength");
    musicNo = document.querySelector("#musicNo");
    musicTotal = document.querySelector("#musicTotal");
    volStatus = document.querySelector("#vol_status");
    artistName = document.querySelector(".musician");
    songName = document.querySelector(".song");
    songCover = document.querySelector("#artistImage");

    // list of all songs
    let all_songs = [
        {
            name:"KADOGO",
            path:"./music/kadogo.mp3",
            img:"./img/kadogo.jpg",
            artist:"Ali Kiba"
        },
        {
            name:"JEJE",
            path:"./music/jeje.mp3",
            img:"./img/jeje.jpg",
            artist:"Diamond Platnumz"
        },
        {
            name:"AIYANA",
            path:"./music/aiyana.mp3",
            img:"./img/otile.jpg",
            artist:"Otile Brown"
        },
        {
            name:"MAOMBI",
            path:"./music/maombi.mp3",
            img:"./img/nadia.jpg",
            artist:"Nadia Mukami"
        }
    ];


    // events
    repeatOnBtn.addEventListener("click", loop);
    repeatBtn.addEventListener("click", loop);
    shuffleBtn.addEventListener("click", random);
    muteBtn.addEventListener("click", muteSong);
    volumeBtn.addEventListener("click", muteSong);

    // all functions 
    const download = document.querySelector("#downloadBtn");

    // function to load the track
    function load_track(index_no){
        resetSlider();
        track.src = all_songs[index_no].path;
        artistName.innerHTML = all_songs[index_no].artist;
        songName.innerHTML = all_songs[index_no].name;
        songCover.src = all_songs[index_no].img;
        track.load();

        // music length and duration
        musicNo.innerHTML = index_no + 1;
        musicTotal.innerHTML = all_songs.length;

        // seek slider
        timer = setInterval(range_slider, 1000);

        // download the current song
        let download_btn = `<a href=${all_songs[index_no].path} class="light-text" download><i class="fa fa-download"></i></a>`;
        download.innerHTML = download_btn;
    }

    load_track(index_no);

     // reset the slide when song is over
     function resetSlider(){
        seekRange.value = 0;
    }

    // checking if the song is playing

    function play_the_song(){
        if(playing_song == false){
            playSong();
        }else{
            pauseSong();
        }
    }

    // play song func
    function playSong(){
        track.play();
        playing_song = true;
        pauseBtn.classList.remove("lost");
        playBtn.classList.add("lost");
        
    } 
    // pause song func
    function pauseSong(){
        track.pause();
        playing_song = false;
        playBtn.classList.remove("lost");
        pauseBtn.classList.add("lost");
        
    }


    // next song
    function next_song(){
        if(index_no < all_songs.length - 1){
            index_no += 1;
            load_track(index_no);
            playSong();
           
        }else{
            index_no = 0;
            load_track(index_no);
            playSong();
            
        }
    }

     // previous song
     function prev_song(){
        if(index_no > 0){
            index_no -= 1;
            load_track(index_no);
            playSong();
            
        }else{
            index_no = all_songs.length -1;
            load_track(index_no);
            playSong();
           
        }
    }

    // set global volume 
    // volume control
    volumeRange.addEventListener("mousemove", volume_control);
    volStatus.innerHTML = volumeRange.value;
    function volume_control(){
        volStatus.innerHTML = volumeRange.value;
        track.volume = volumeRange.value / 100;
        if (volumeRange.value < 1) {
            muteBtn.classList.remove("lost");
            volumeBtn.classList.add("lost");
            console.log('zeroo');
        }else{
            volumeBtn.classList.remove("lost");
            muteBtn.classList.add("lost");
        }
    }


    // change range slider position
    function change_duration(){
        sliderPosition = track.duration * (seekRange.value / 100);
        track.currentTime = sliderPosition;
    }

    // autoplay func

    function range_slider(){
        let position = 0;

        // update slider position
        if (!isNaN(track.duration)) {
            position = track.currentTime * (100 / track.duration);
            seekRange.value = position;
        }

        if (track.ended) {
            pauseBtn.classList.remove("lost");
            playBtn.classList.add("lost");
            next_song();
        }
    }


    // repeat music func
    function loop(){
        if (track.loop) {
            track.loop = false;
            repeatOnBtn.classList.remove("lost");
            repeatBtn.classList.add("lost");
            
        }else{
            track.loop = true;
            repeatBtn.classList.remove("lost");
            repeatOnBtn.classList.add("lost");
        }
    }

    // random music func
    function getRandomNumber(min, max){
        let step1 = max - min + 1;
        step2 = Math.random() * step1;
        let result = Math.floor(step2)+min;
        return result;
    }

    
    function random(){
	let randomIndex = getRandomNumber(0, all_songs.length - 1);
	index_no = randomIndex;
    load_track(index_no);
    playSong();
}

// timer
track.addEventListener("timeupdate", function(){
	seektimeupdate();
});

function seektimeupdate(){
	if (track.duration) {
		let countTime = track.currentTime * (100 / track.duration);
		seekRange.value = countTime;
		var curmins = Math.floor(track.currentTime / 60);
		var cursecs = Math.floor(track.currentTime - curmins * 60);
		var durmins = Math.floor(track.duration / 60);
		var dursecs = Math.floor(track.duration - durmins * 60);

		if (cursecs < 10) {
			cursecs = "0" + cursecs;
		}
		if (dursecs < 10) {
			dursecs = "0" + dursecs;
		}
		if (durmins < 10) {
			durmins = "0" + durmins;
		}

		currentTimeText.innerHTML = curmins+":"+cursecs;
		audioLengthText.innerHTML = durmins+":"+dursecs;
	}else{
		currentTimeText.innerHTML = "00"+":"+"00";
		audioLengthText.innerHTML = "00"+":"+"00";
	}
}

// muting
function muteSong(){
	if (track.muted) {
		track.muted = false;
		volumeBtn.classList.remove("lost");
		muteBtn.classList.add("lost");
	}else{
		track.muted = true;
		muteBtn.classList.remove("lost");
		volumeBtn.classList.add("lost");
		
	}
}


// pop up the play list
const viewPlayList = document.querySelector('#viewPlayList');
const playListLayout = document.querySelector('.play-list-layout');
const cancelBtn = document.querySelector('.cancel');

// loop through all music
let myMusicList = document.querySelector("#musicList");
for(i = 0; i < all_songs.length; i++){
    let li = document.createElement("li");
    myMusicList.appendChild(li);
 
    li.innerHTML = `<a href=${all_songs[i].path} class="musicLink"">${all_songs[i].name} <strong>BY</strong> ${all_songs[i].artist}</a>`;

    document.querySelector(".musicLink").addEventListener("click", playIt)
    if (all_songs[i].path === all_songs[i].path) {
        console.log(all_songs[i].path)
    }
}


function playIt(e){
    e.preventDefault();
    console.log(all_songs.path)
}

viewPlayList.addEventListener('click', openPlayList);
cancelBtn.addEventListener('click', closePlayList);

function openPlayList(){
	playListLayout.classList.remove('hide');
}

function closePlayList(){
	playListLayout.classList.add('hide');
}



// ---------------------------------------------------------------------------------
									//analyser
//----------------------------------------------------------------------------------

// variable declarations
let canvas, ctx, source, context, analyzer, fbc_array, bars, bar_x, bar_width, bar_height;

window.addEventListener("load", initPlayer, false);

function initPlayer(){
    context = new AudioContext();
    analyzer = context.createAnalyser();
    canvas = document.getElementById("analizer-bar");
    ctx = canvas.getContext("2d");

    source = context.createMediaElementSource(track);
    source.connect(analyzer);
    analyzer.connect(context.destination);

    frameLoop();
}

// frameloop func will animate any style
function frameLoop(){
    window.requestAnimationFrame(frameLoop);
    fbc_array = new Uint8Array(analyzer.frequencyBinCount);
    analyzer.getByteFrequencyData(fbc_array);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ff8c00ad';

    bars = 1200;

    for(let i = 0; i < bars; i++){
        bar_x = i * 10;
        bar_width = 1;
        bar_height = -(fbc_array[i] / 2 - (39));

        ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
    }
}
