import config from '../config.js';

let timmer;

const MUSIC_LIST = [];
let music_position = 0;
let audio = document.createElement('audio');
let htmlMusicArtist = document.getElementById("artist");
let htmlMusicTitle = document.getElementById("title");
let htmlMusicAlbum = document.getElementById("album");
let imgMusicAlbumArt = document.getElementById("album_art");
let inputSeek = document.getElementById("seek");
let player = document.getElementById("player");
let playlist = document.getElementById("playlist");


// Controls
// -------------------------
document.getElementById("play").onclick = () => { audio.play() }
document.getElementById("pause").onclick = () => { audio.pause() }
document.getElementById("next").onclick = () => {
    if (!(music_position == MUSIC_LIST.length - 1)) {
        music_position += 1;
        loadSong();
    }
}
document.getElementById("prev").onclick = () => {
    if (!(music_position == 0)) {
        music_position -= 1;
        loadSong();
    }
}
document.getElementById("seek").onchange = () => {
    let time = audio.duration * (inputSeek.value / 100);
	audio.currentTime = time;
}
document.getElementById("showpl").onclick = () => {
    playlist.style.height = player.offsetHeight + "px";
    playlist.style.marginTop = `-${player.offsetHeight}px`;
    player.style.visibility = "hidden";
    playlist.style.visibility = "visible";
}
document.getElementById("hiddepl").onclick = () => {
    playlist.style.visibility = "hidden";
    player.style.visibility = "visible";
}
// -------------------------

class MusicFile {
    constructor (title, artist, album, file, album_art) {
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.file = file;
        this.album_art = album_art;
    }
}

function getMusicList () {
    fetch(config.api)
        .then(response => response.json())
        .then(data => {
            for(let i = 0; i < data.documents.length; i++) {
                const document = data.documents[i];
                let music = new MusicFile(
                    document.fields.title.stringValue,
                    document.fields.artist.stringValue,
                    document.fields.album.stringValue,
                    document.fields.file.stringValue,
                    document.fields.album_art.stringValue
                );
                MUSIC_LIST.push(music);
            }
            loadSong();
        })
}

function loadSong() {
    htmlMusicTitle.textContent = MUSIC_LIST[music_position].title;
    htmlMusicArtist.textContent = MUSIC_LIST[music_position].artist;
    htmlMusicAlbum.textContent = MUSIC_LIST[music_position].album;
    imgMusicAlbumArt.src = MUSIC_LIST[music_position].album_art;
    audio.src = MUSIC_LIST[music_position].file;
    timmer = setInterval(seekUpdate, 500);
    audio.load();   
}

function seekUpdate () {
    let position = 0;
	
	if(!isNaN(audio.duration)){
		position = audio.currentTime * (100 / audio.duration);
		inputSeek.value = position;
		if(position !=0) {
			
		}
	}
}

audio.addEventListener("ended", () => {
    if (!(music_position == MUSIC_LIST.length - 1)) {
        music_position += 1;
        loadSong();
        audio.play();
    }
});
  

getMusicList();