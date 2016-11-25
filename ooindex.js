// Object-oriented version

function Artist(){};
function Album(){};
function Track(){};

function Splotify(){
	this.artist = new Artist();
	this.album = new Album();
	this.track = new Track();
}

// Page functions

Splotify.prototype.handleError = function(error){
	console.log("Error");
	console.log(error.responseText); 
}

Splotify.prototype.printTime = function() {
  var current = $('audio').prop('currentTime');
  $("progress").attr("value", current);
}

Splotify.prototype.playTrack = function(){
	$('.btn-play').click(function() {
		if ($('.btn-play').hasClass("disabled")){
			$('audio').trigger('play');
			$('.btn-play').removeClass("disabled");
			$('.btn-play').addClass("playing");
		} else {
			$('audio').trigger('pause');
			$('.btn-play').removeClass("playing");
			$('.btn-play').addClass("disabled");
		}
		
		$('audio').on('timeupdate', splotify.printTime);

  		
	});
}



// Artist functions

Artist.prototype.search = function(){
	var self = this
	$('.artist-search').submit(function(event){
		$('.js-artist-list').empty();
		$('.js-album-list').empty();
		event.preventDefault();
		var artist = $('#artist').val();
		self.getArtistsFromAjax(artist);	
		$('input').val('');
	});
};


Artist.prototype.getArtistsFromAjax = function(artist){
	$.ajax({
		type: "GET", 
		url: "https://api.spotify.com/v1/search?type=artist&query="+artist,
		success: this.showArtists, 
		error: splotify.handleError
	});
};

Artist.prototype.showArtists = function(response){
	var artistArray = response ;
	$.each(artistArray.artists.items,function (index, artist){
		if (artist.images.length > 0) {
		var html = ` 
				<li class="artist-display">
					<h2>${artist.name}</h2>
					<img src="${artist.images[0].url}" id="${artist.id}" class="get-albums">
				</li><br>
				`;
		
			$('.js-artist-list').append(html);
		}
	});
};


// Album functions

Album.prototype.getAlbums = function(){
	var self = this
	$(document).on('click', '.get-albums', function (event){
		event.preventDefault();
		var id = this.id;
		self.getAlbumsFromAjax(id);
	});
}

Album.prototype.getAlbumsFromAjax = function(id){
	$.ajax({
		type: "GET", 
		url: "https://api.spotify.com/v1/artists/"+id+"/albums",
		success: this.showAlbums, 
		error: splotify.handleError
	});
};

Album.prototype.showAlbums = function(response){
	var albumArray = response;
	$('.js-album-list').empty();
	$.each(albumArray.items,function (index, album){
		var html = ` 
				<span class="album-display">
					<h3>${album.name}</h3>
					<img src="${album.images[0].url}" id="${album.id}" class="get-tracks" data-toggle="modal" data-target="#myModal">
					
				</span>
				`;
		
			$('.js-album-list').append(html);
			$('.js-album-list span:last').hide().fadeIn(500);
		
	});
	$('.js-album-list').prepend("<h2>Albums</h2>");
};


// Track functions

Track.prototype.getTracks = function(){
	var self = this
	$(document).on('click', '.get-tracks', function (event){
		event.preventDefault();
		var trackId = this.id;
		self.getTracksFromAjax(trackId);
	});
}

Track.prototype.getTracksFromAjax = function(trackId){
	$.ajax({
		type: "GET", 
		url: "https://api.spotify.com/v1/albums/"+trackId+"/tracks",
		success: this.showTracks, 
		error: splotify.handleError
	});
};

Track.prototype.showTracks = function(response){
	var trackArray = response;
	$('.js-track-list').empty();
	$('#myModal').modal()
		$.each(trackArray.items,function (index, track){

		var html = ` 
				<li class="track-player" id="${track.preview_url}/${track.name}">${track.name}
										
				</li><br>
				`;
		
			$('.js-track-list').append(html);
		
	});
		
		var firstTrack = trackArray.items[0]
		$("audio").attr("src", firstTrack.preview_url);
		$(".title").html(firstTrack.name);
		$(".author").html(firstTrack.artists[0].name);
};


Track.prototype.changeTrack = function(){
	var self = this
	$(document).on('click', '.track-player', function (event){
		event.preventDefault();
		var info = this.id;
		var trackUrl = info.substring(0, info.lastIndexOf("/") + 1).slice(0,-1);
		var trackTitle = info.substring(info.lastIndexOf("/") + 1, info.length);
		console.log(trackUrl);
		console.log(trackTitle);
		$("audio").attr("src", trackUrl);
		$(".title").html(trackTitle);
	});
}





// Calls

var splotify = new Splotify();
splotify.artist.search();
splotify.album.getAlbums();
splotify.track.getTracks();
splotify.track.changeTrack();
splotify.playTrack();

