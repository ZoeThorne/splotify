// Old version

function search(){
	$('.artist-search').submit(function(event){
		$('.js-artist-list').empty();
		event.preventDefault();
		var artist = $('#artist').val();
		getArtistsFromAjax(artist);	
		$('input').val('');
	});
};

function getArtistsFromAjax(artist){
	$.ajax({
		type: "GET", 
		url: "https://api.spotify.com/v1/search?type=artist&query="+artist,
		success: showArtists, 
		error: handleError
	});
};

function showArtists(response){
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

function handleError(error){
	console.log("Error");
	console.log(error.responseText); 
}

function getAlbums(){
	$(document).on('click', '.get-albums', function (event){
		event.preventDefault();
		var id = this.id;
		getAlbumsFromAjax(id);
	});
}

function getAlbumsFromAjax(id){
	$.ajax({
		type: "GET", 
		url: "https://api.spotify.com/v1/artists/"+id+"/albums",
		success: showAlbums, 
		error: handleError
	});
};

function showAlbums(response){
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
		
	});
};

function getTracks(){
	$(document).on('click', '.get-tracks', function (event){
		event.preventDefault();
		var trackId = this.id;
		getTracksFromAjax(trackId);
	});
}

function getTracksFromAjax(trackId){
	$.ajax({
		type: "GET", 
		url: "https://api.spotify.com/v1/albums/"+trackId+"/tracks",
		success: showTracks, 
		error: handleError
	});
};

function showTracks(response){
	var trackArray = response;
	$('.js-track-list').empty();
	$('#myModal').modal()
		$.each(trackArray.items,function (index, track){
		var html = ` 
				<li>
					<a href="${track.preview_url}" target="_blank">${track.name}</a>
										
				</li><br>
				`;
		
			$('.js-track-list').append(html);
		
	});

};



$(document).on('ready', function () {
	search();
	getAlbums();
	getTracks();
});