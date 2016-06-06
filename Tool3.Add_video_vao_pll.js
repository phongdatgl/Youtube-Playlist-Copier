var str = '';
str += '<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">';
str += '<div class="container"><div class="row"><div class="col-sm-6 col-sm-offset-3">';
str += '<h1 class="text-center">Add Video vào #1 Playlist</h1><form action="" method="POST" class="form-horizontal" role="form">'+
	'<div class="form-group">'+
		'<label for="inputVideos" class="col-sm-4 control-label">ID video của bạn:</label>'+
		'<div class="col-sm-8">'+
			'<input type="text" name="idvideos" id="inputVideos" class="form-control" value="" required="required" placeholder="ID video, cách nhau bằng dấu phẩy">'+
		'</div>'+
	'</div>'+
	'<div class="form-group">'+
		'<div class="col-sm-12">'+
			'<textarea class="form-control" rows="10" name="playlists" id="playlists" placeholder="Danh sách Playlist"></textarea>'+
		'</div>'+
	'</div>'+
	'<div class="form-group">'+
		'<label for="inputVideos" class="col-sm-4 control-label">Loại:</label>'+
		'<div class="col-sm-8">'+
			'<div class="radio">'+
				'<label>'+
					'<input type="radio" name="types" id="inputType1" value="1" checked="checked">'+
					'Add từng video vào từng playlist'+
				'</label>'+
				'<label>'+
					'<input type="radio" name="types" id="inputType2" value="2">'+
					'Add toàn bộ video vào từng playlist'+
				'</label>'+
			'</div>'+
		'</div>'+
	'</div>'+
	'<div class="form-group">'+
		'<div class="col-sm-8 col-sm-offset-4">'+
			'<button type="button" id="add_now" onclick="addNow()" class="btn btn-primary">Thêm !!!</button>'+
		'</div>'+
	'</div>'+
'</form>'+
'</div></div>'+
'<div class="row"><div class="col-sm-6 col-sm-offset-3" id="result_text"></div></div>'+
'<div class="row"><div class="col-sm-6 col-sm-offset-3" id="result_area"></div></div>'+
'</div>'
;

var all_videos = '';
var videos = [];
var all_pll = [];
var add_type = 1;
var i_video = 0;
function addNow()
{
	all_videos = document.getElementById('inputVideos').value;
	all_pll = document.getElementById('playlists').value.split("\n");
	videos = all_videos.split(',');
	radios = document.getElementsByName('types');
	for (var i = 0, length = radios.length; i < length; i++) {
	    if (radios[i].checked) {
	    	add_type = radios[i].value;
	        break;
	    }
	}
	console.log(add_type);
	
	document.getElementById("add_now").classList.add("disabled");
	document.getElementById("add_now").innerHTML = "Đang thêm ...";
	//document.getElementById("create_now").setAttribute("class", "disabled");
	//search(keyword, page_times);
	addVideoToPlaylist();
}
RegExp.prototype.execAll = function(string) {
	var matches = [];
	var match = null;
	while ( (match = this.exec(string)) != null ) {
		var matchArray = [];
		for (var i in match) {
			if (parseInt(i) == i) {
				matchArray.push(match[i]);
			}
		}
		matches.push(matchArray);
	}
	return matches;
}
function getStringBetween(string, firstS, lastS)
{
	str1 = string.split(firstS);
	if(str1.length < 1) return '';
	str2 = str1[1].split(lastS);
	if(str2.length < 1) return '';
	return str2[0];
	//return string.substring(string.lastIndexOf(firstS)+1,string.lastIndexOf(lastS));
}
function sendPostRq(url, postVar)
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		
	};
	xhttp.open("POST", url, false);
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	xhttp.send(postVar);
	if (xhttp.readyState == 4 && xhttp.status == 200) {
		return (xhttp.responseText);
	}
}
function addVideoToPlaylist()
{
	if( (i_video + 1) > all_videos.length ) {
		i_video = 0;
	}
	videoid = all_videos[i_video];
	current_video_id = videoid;
	i_video += 1;
	var url = 'https://www.youtube.com/playlist_edit_service_ajax?action_add_video=1';
	var postVar = 'video_id='+videoid+'&playlist_id='+plid+'&session_token='+security_token;
	var req = sendPostRq(url, postVar);
	return req;
}
function search(keyword, page)
{
	var key_encode = encodeURI(keyword);
	var filter_param = '&sp='+order_by;
	var page_param = '&page=' + page;
	var url = 'https://www.youtube.com/results?search_query='+key_encode+filter_param+page_param;
	var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	    if (xhttp.readyState == 4 && xhttp.status == 200) {
				filterAllVideos(xhttp.responseText);
			total_times += 1;
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

function filterAllVideos(page_string)
{
	var content_string = '';
	content_string = getStringBetween(page_string, 'class="item-section">','class="yt-uix-pager');
	var regex = /data-context-item-id="([A-Za-z0-9-_]{10,12})"/g;
	match = regex.execAll(content_string);
	for(var i = 0; i < match.length; i++)
	{
		if(videos.length >= total_video_to) break;
		if(videos.indexOf(match[i][1]) == -1)
		{
			videos.push(match[i][1]);
		}
	}
	if(videos.length >= total_video_to) {
		var url = 'https://www.youtube.com/playlist?list=' + videos[0];
		var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200) {
					content = getStringBetween(xhttp.responseText, 'href="//support.google.com/youtube/?hl=vi"', "FEEDBACK_LOCALE_EXTRAS");
					var regex = /\'XSRF_TOKEN\':\s\'(.*)\'/;
					match = content.match(regex);
					security_token = match[1].replace('=', '%3D');
					createPlaylist();
				}
			};
		xhttp.open("GET", url, true);
		xhttp.send();
		
	} else {
		page_times += 1;
		search(keyword, page_times);
	}
	
}

function getToken(plid) {
	var url = 'https://www.youtube.com/playlist?list=' + plls[0];
	var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			
		};
	xhttp.open("GET", url, true);
	xhttp.send();
	if (xhttp.readyState == 4 && xhttp.status == 200) {
			security_token = getStringBetween(xhttp.responseText, 'data-playlist-edit-xsrf-token="', '=" data-');
			security_token = security_token.replace('ata-playlist-edit-xsrf-token="', '');
			security_token += '%3D';
			
		}
}

function sendPostRq(url, postVar)
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		
	};
	xhttp.open("POST", url, false);
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	xhttp.send(postVar);
	if (xhttp.readyState == 4 && xhttp.status == 200) {
		return (xhttp.responseText);
	}
}
function sendGetRq(url)
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		
	};
	xhttp.open("POST", url, false);
	xhttp.send();
	if (xhttp.readyState == 4 && xhttp.status == 200) {
		return (xhttp.responseText);
	}
}
function setDescription(plid, desc)
{
	urls = 'https://www.youtube.com/playlist_edit_service_ajax?action_set_playlist_description=1';
	postVars = 'playlist_id='+plid+'&playlist_description='+encodeURI(desc)+'&session_token='+security_token;
	str = sendPostRq(urls, postVars);
}
function tSleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
			break;
		}
	}
}
function randomArr(from_num, to_num)
{
	randomNum = Math.floor(Math.random() * (to_num - from_num + 1)) + from_num;
	newArr = [];
	for(i = 0; i < randomNum; i++)
	{
		try {
			newArr.push(videos[i]);
		} catch(e) {}
	}
	return newArr;
}
function createPlaylist()
{
	document.getElementById('result_area').innerHTML = '<h2 class="text-center">Playlist Done</h2><textarea id="result_area_id" class="form-control" rows="10"></textarea>';
	postVar = '';
	url = 'https://www.youtube.com/playlist_ajax?action_create_playlist=1';
	for(var i = 1; i <= total_pll; i++) {
		new_arr = randomArr(total_video_from, total_video_to);
		new_arr = shuffle(new_arr);
		new_arr = new_arr.join(',');
		if(i_video >= all_videos.length) i_video = 0;
		if(all_videos.length > 0) {
			new_arr = all_videos[i_video] + ',' + new_arr;
		}
		i_video += 1;
		postVar = 'video_ids='+new_arr+'&source_playlist_id=&n='+encodeURI(playlist_title)+'&p=public&session_token='+security_token;
		res = sendPostRq(url, postVar);
		try {
			pJson = JSON.parse(res);
			plid = pJson['result']['playlistId'];
			setDescription(plid, playlist_desc);
			document.getElementById('result_text').innerHTML = "<p class='text-success'>Done: https://www.youtube.com/playlist?list="+plid+"</p>";
			document.getElementById('result_area_id').value += plid + "\r\n";
		} catch(e) {}
	}
	document.getElementById("create_now").classList.remove("disabled");
	document.getElementById("create_now").innerHTML = "Đã xong !";
	window.setTimeout(function() {document.getElementById("create_now").innerHTML = "Tạo ngay và luôn";}, 2000);
}

document.body.innerHTML = str;