/* -------------------------------- */
/* Author: ToVinhKhang 				*/
/* https://tovinhkhang.netlify.app/ */
/* -------------------------------- */

// ----------
// Fetch API 
// ----------

let List; const API = "https://tinyurl.com/7frz2rdw";
window.addEventListener('load',() => {
	List = document.getElementById("song-list");
	loadByFetch();
});

// Check Zero 
function Zero(num) {return (num >= 0 && num < 10) ? "0" + num : num + "";}

// Display Data
function displayData(jsonData){
	Data = jsonData.songs.top100_VN[0].songs;
	let count = 0;
	let countSong = document.getElementById("countSong");

	Data.forEach(u => {
		var div = document.createElement("div");
		div.innerHTML = `
			<div class="song row" data-index="`+count+`">
			  <span class="song-index">`+Zero(count)+`</span>
			  <img
				src="`+u.avatar+`"
				alt=""
				class="song-image"
			  />
			  <i class="fa fa-play song-play"></i>
			  <h4 class="song-title col-md-4">`+u.title+`</h4>
			  <h5 class="song-album col-md-4">`+u.creator+`</h5>
			  <label for="love3" class="song-love">
				<input type="checkbox" name="love" id="love3" />
				<i class="fa fa-heart song-heart"></i>
			  </label>
			</div>
		`;
		count+=1;
		countSong.innerHTML = count + " Songs";
		List.appendChild(div)
	});
	// Hide Loading after display success
	document.getElementById("loader").style.display = "none";
	document.getElementById("now-playing").style.display = "block";
}

// Load Data
function loadByFetch(){
	fetch(API) /* [Promise] Method */
		.then(data => data.json())
		.then(jsonData => {displayData(jsonData);})
		.catch(e => console.log(e));
}


/* ----------- */
/* NOW PLAYING */
/* ----------- */

// Init
let playing = true;
let random = false;
const playButton = document.querySelector(".player-play");
const nextButton = document.querySelector(".player-next");
const prevButton = document.querySelector(".player-prev");
const thumbnail = document.querySelector(".player-image");
const song = document.querySelector("#song");
let songList = document.querySelectorAll(".song");
const songArtist = document.querySelector(".player-author");
const songTitle = document.querySelector(".player-title");
const progressBar = document.querySelector("#progress-bar");

let songIndex = 0;
let songs = [];
let thumbnails = [];
let songArtists = [];
let songTitles = [];

fetch(API)
	.then(data => data.json())
	.then(jsonData => {
		Data = jsonData.songs.top100_VN[0].songs;
		Data.forEach(u => {
			songs.push(u.music)
			thumbnails.push(u.avatar)
			songArtists.push(u.creator)
			songTitles.push(u.title)
		});
	})
	.catch(e => console.log(e));

// Functions
function handleClickEachSong(e) {
	const index = parseInt(e.target.dataset.index);
	nextSong(index);
}

function playPause() {
	if (playing){
		const song = document.querySelector("#song");
		song.play();
		thumbnail.classList.add("is-playing");
		playButton.classList.add("fa-pause");
		playing = false;
	}
	else{
		thumbnail.classList.remove("is-playing");
		playButton.classList.remove("fa-pause");
		song.pause();
		playing = true;
	}
}

function nextSong(index = -1) {
	if (index >= 0) {songIndex = index;} else {songIndex++;}
	if (songIndex > songs.length - 1) {songIndex = 0;}
	song.src = songs[songIndex];
	thumbnail.src = thumbnails[songIndex];
	songArtist.innerHTML = songArtists[songIndex];
	songTitle.innerHTML = songTitles[songIndex];
	playing = true;
	playPause();
}

function previousSong() {
	songIndex--;
	if (songIndex < 0) {songIndex = 1;}
	song.src = songs[songIndex];
	thumbnail.src = thumbnails[songIndex];
	songArtist.innerHTML = songArtists[songIndex];
	songTitle.innerHTML = songTitles[songIndex];
	playing = true;
	playPause();
}

function updateProgressValue() {
	progressBar.max = song.duration;
	progressBar.value = song.currentTime;
	document.querySelector(".player-remaining").innerHTML = formatTime(Math.floor(song.currentTime));
	if (document.querySelector(".player-duration").innerHTML === "NaN:NaN"){
		document.querySelector(".player-duration").innerHTML = "0:00";}
	else{document.querySelector(".player-duration").innerHTML = formatTime(Math.floor(song.duration));}
}

function formatTime(seconds){
  let min = Math.floor(seconds / 60);
  let sec = Math.floor(seconds - min * 60);
  if (sec < 10) {sec = `0${sec}`;}
  return `${min}:${sec}`;
}

// Progess Bar
setInterval(updateProgressValue, 500);
function changeProgressBar(){song.currentTime = progressBar.value;}
progressBar.addEventListener("change", changeProgressBar);
playButton.addEventListener("click", playPause);
nextButton.addEventListener("click", nextSong);
prevButton.addEventListener("click", previousSong);
song.addEventListener("ended", function () {nextSong();});

function HandleClickEachSongAfterFetch(){
	songList = document.querySelectorAll(".song");
	songList.forEach((el) => el.addEventListener("click", handleClickEachSong));
}
setInterval(HandleClickEachSongAfterFetch,2000)


// ----------
// END 
// ----------


