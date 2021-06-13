
// ---------------------------------------------------------------------------------
									// music actions--------//
//----------------------------------------------------------------------------------

//variable declarations

let audio,playImg,pauseImg,title,poster,artists,muteBtn,nextBtn,prevBtn,seekSlider,volumeSlider,seeking=false,seekTo,currTime,durrTime,playlistStatus,dir,playlist,ext,agent,playlistAgent,repeat,noRepeat,randomSong;

// array initialization of music,title,poster,artists
dir = "music/";
playlist = ["aiyana","jeje","kadogo","maombi",];
title = ["aiyana","Jeje","Kadogo","Maombi",];
artists = ["Otile Brown","Diamond Platnumz","Ali Kiba","Nadia Mukami",];
poster = ["img/otile.jpg","img/jeje.jpg","img/kadogo.jpg","img/nadia.jpg",];

ext = ".mp3";

// set object refferences
nextBtn = document.querySelector(".next");
prevBtn = document.querySelector(".prev");
muteBtn = document.querySelector(".on-mute");
demuteBtn = document.querySelector(".off-mute");
seekSlider = document.querySelector(".seeker");
volumeSlider = document.querySelector(".vol");
currTime = document.querySelector(".current-time");
durrTime = document.querySelector(".music-length");
repeat = document.querySelector(".repeat");
noRepeat = document.querySelector(".no-repeat");
playlistStatus = document.querySelector(".song");
playlistArtist = document.querySelector(".musician");
randomSong = document.querySelector(".random");
pauseImg = document.querySelector(".pause");
playImg = document.querySelector(".play");

playlist_index = 0;


// audio object
audio = new Audio();
audio.src = dir+playlist[0]+ext;
audio.loop = false;
// audio.crossOrigin = "anonymous";


// first song title and artist
playlistArtist.innerHTML = artists[playlist_index];
playlistStatus.innerHTML = title[playlist_index];


// Add event listeners
pauseImg.addEventListener("click", playPause);
playImg.addEventListener("click", playPause);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);
muteBtn.addEventListener("click", muteSong);
demuteBtn.addEventListener("click", muteSong);
repeat.addEventListener("click", loop);
noRepeat.addEventListener("click", loop);
randomSong.addEventListener("click", random);

//seek slider
seekSlider.addEventListener("mousedown", function(event){
	seeking = true;
	seek(event);
});
seekSlider.addEventListener("mousemove", function(event){
	seek(event);
});
seekSlider.addEventListener("mouseup", function(){
	seeking =false;
});

// volume slider
volumeSlider.addEventListener("mousemove", setvolume);
audio.addEventListener("timeupdate", function(){
	seektimeupdate();
})

audio.addEventListener("ended", function(){
	switchTrack();
})

// functions or methods
function fetchMusicDetails(){
	// poster img and pause/play img
	$(".cardImage img").attr("src", poster[playlist_index]);

	 // title and artist
	 playlistStatus.innerHTML = title[playlist_index];
	 playlistArtist.innerHTML = artists[playlist_index];


	 // audio
	 audio.src = dir+playlist[playlist_index]+ext;
	 audio.play();
}

function playPause(){
	if (audio.paused) {
		audio.play();
		pauseImg.classList.remove("lost");
		playImg.classList.add("lost");

		console.log('audio playing...');
	}else{
		audio.pause();
		playImg.classList.remove("lost");
		pauseImg.classList.add("lost");

		console.log('audio paused !');
	}
}

function nextSong(){
	playlist_index ++;
	if (playlist_index > playlist.length - 1) {
		playlist_index = 0;
	}
	fetchMusicDetails();
}

function prevSong(){
	playlist_index --;
	if (playlist_index < 0) {
		playlist_index = playlist.length - 1;
	}
	fetchMusicDetails();
}

function muteSong(){
	if (audio.muted) {
		audio.muted = false;
		demuteBtn.classList.remove("lost");
		muteBtn.classList.add("lost");
	}else{
		audio.muted = true;
		muteBtn.classList.remove("lost");
		demuteBtn.classList.add("lost");
		
	}
}

function seek(event){
	if (audio.duration == 0) {
		null;
	}else{
		if (!isNaN(seeking)) {
			seekSlider.value = event.clientX-seekSlider.offsetLeft;
			seekTo = audio.duration * (seekSlider.value / 100);
			audio.currentTime = seekTo;
		}
	}
}

function setvolume(){
	audio.volume = volumeSlider.value / 100;
	if (volumeSlider.value < 1) {
		muteBtn.classList.remove("lost");
		demuteBtn.classList.add("lost");
		console.log('zeroo');
	}else{
		demuteBtn.classList.remove("lost");
		muteBtn.classList.add("lost");
	}
}

function seektimeupdate(){
	if (audio.duration) {
		let nt = audio.currentTime * (100 / audio.duration);
		seekSlider.value = nt;
		var curmins = Math.floor(audio.currentTime / 60);
		var cursecs = Math.floor(audio.currentTime - curmins * 60);
		var durmins = Math.floor(audio.duration / 60);
		var dursecs = Math.floor(audio.duration - durmins * 60);

		if (cursecs < 10) {
			cursecs = "0" + cursecs;
		}
		if (dursecs < 10) {
			dursecs = "0" + dursecs;
		}
		if (durmins < 10) {
			durmins = "0" + durmins;
		}

		currTime.innerHTML = curmins+":"+cursecs;
		durrTime.innerHTML = durmins+":"+dursecs;
	}else{
		currTime.innerHTML = "00"+":"+"00";
		durrTime.innerHTML = "00"+":"+"00";
	}
}

function switchTrack(){
	if (playlist_index == (playlist.length - 1)) {
		playlist_index = 0;
	}else{
		playlist_index ++;
	}
	fetchMusicDetails();
}

function loop(){
	if (audio.loop) {
		audio.loop = false;
		repeat.classList.remove("lost");
		noRepeat.classList.add("lost");
		
	}else{
		audio.loop = true;
		noRepeat.classList.remove("lost");
		repeat.classList.add("lost");
	}
}

function getRandomNumber(min, max){
	let step1 = max - min + 1;
	step2 = Math.random() * step1;
	let result = Math.floor(step2)+min;
	return result;
}

function random(){
	let randomIndex = getRandomNumber(0, playlist.length - 1);
	playlist_index = randomIndex;
	fetchMusicDetails();
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

    source = context.createMediaElementSource(audio);
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


// ---------------------------------------------------------------------------------
									//play list
//----------------------------------------------------------------------------------

// the play list toggler
const viewPlayList = document.querySelector('#viewPlayList');
const playListLayout = document.querySelector('.play-list-layout');
const cancelBtn = document.querySelector('.cancel');

viewPlayList.addEventListener('click', openPlayList);
cancelBtn.addEventListener('click', closePlayList);

function openPlayList(){
	playListLayout.classList.remove('hide');
}

function closePlayList(){
	playListLayout.classList.add('hide');
}
//-----------------------------------------
//-----------------------------------------




















