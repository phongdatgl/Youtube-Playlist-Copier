var str = '';
str += '<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">';
str += '<div class="container"><div class="row"><div class="col-sm-6 col-sm-offset-3">';
str += '<h1 class="text-center">Tool tạo playlist từ video</h1><form action="" method="POST" class="form-horizontal" role="form">'+
	'<div class="form-group">'+
		'<label for="inputKeyw" class="col-sm-4 control-label">Từ khóa:</label>'+
		'<div class="col-sm-8">'+
			'<input type="text" name="keyw" id="inputKeyw" class="form-control" value="" required="required" title="">'+
		'</div>'+
	'</div>'+
	'<div class="form-group">'+
		'<label for="inputOrderby" class="col-sm-4 control-label">Lọc theo:</label>'+
		'<div class="col-sm-8">'+
			'<select name="orderby" id="inputOrderby" class="form-control">'+
				'<option value="">Bình thường</option>'+
				'<option value="CAA%253D">Mức độ liên quan</option>'+
				'<option value="CAI%253D">Ngày tải lên</option>'+
				'<option value="CAM%253D">Lượt xem</option>'+
				'<option value="CAE%253D">Xếp hạng</option>'+
			'</select>'+
		'</div>'+
	'</div>'+
	'<div class="form-group">'+
		'<label for="inputTotalpll" class="col-sm-4 control-label">Số lượng Pll:</label>'+
		'<div class="col-sm-8">'+
			'<input type="number" name="total_pll" id="inputTotalpll" class="form-control" value="10" required="required" title="">'+
		'</div>'+
	'</div>'+
	'<div class="form-group">'+
		'<label for="inputTotalV1" class="col-sm-4 control-label">Số lượng Video:</label>'+
		'<div class="col-sm-1" style="padding:0"><span style="padding:0;display:block;padding-top:7px;text-align:center;">từ</span></div>'+
		'<div class="col-sm-2">'+
			'<input type="number" name="total_video_from" id="inputTotalV1" class="form-control" value="50" required="required">'+
		'</div>'+
		'<div class="col-sm-1" style="padding:0"><span style="padding:0;display:block;padding-top:7px;text-align:center;">đến</span></div>'+
		'<div class="col-sm-2">'+
			'<input type="number" name="total_video_to" id="inputTotalV2" class="form-control" value="200" required="required">'+
		'</div>'+
		'<div class="col-sm-1" style="padding:0"><span style="padding:0;display:block;padding-top:7px;text-align:center;">video</span></div>'+
	'</div>'+
	'<div class="form-group">'+
		'<label for="inputVideos" class="col-sm-4 control-label">ID video của bạn:</label>'+
		'<div class="col-sm-8">'+
			'<input type="text" name="idvideos" id="inputVideos" class="form-control" value="" required="required" placeholder="ID video, cách nhau bằng dấu phẩy">'+
		'</div>'+
	'</div>'+
	'<div class="form-group">'+
		'<label for="playlist_title" class="col-sm-4 control-label">Tiêu đề Playlist:</label>'+
		'<div class="col-sm-8">'+
			'<input type="text" name="playlist_title" id="playlist_title" class="form-control" value="" required="required" placeholder="Tiêu đề cho playlist cần tạo">'+
		'</div>'+
	'</div>'+
	'<div class="form-group">'+
		'<label for="playlist_desc" class="col-sm-4 control-label">Mô tả:</label>'+
		'<div class="col-sm-8">'+
			'<textarea class="form-control" rows="5" name="playlist_desc" id="playlist_desc" placeholder="Mô tả cho playlist"></textarea>'+
		'</div>'+
	'</div>'+
	'<div class="form-group">'+
		'<div class="col-sm-8 col-sm-offset-4">'+
			'<button type="button" id="create_now" onclick="createPlaylists()" class="btn btn-primary">Tạo ngay và luôn</button>'+
		'</div>'+
	'</div>'+
'</form>'+
'</div></div>'+
'<div class="row"><div class="col-sm-6 col-sm-offset-3" id="result_text"></div></div>'+
'<div class="row"><div class="col-sm-6 col-sm-offset-3" id="result_area"></div></div>'+
'</div>'
;

var keyword = '';
var order_by = '';
var total_pll = '';
var total_video_from = 10;
var total_video_to = 50;
var total_videos = '';
var all_videos = [];
var videos = [];
var total_times = 0;
var page_times = 1;
var security_token = '';
var api_key = 'AIzaSyDwC8WgbucSq5uz4Wu_b0rMgnuOHucQVDk';
var i_video = 0;
var current_video_id = '';
var playlist_title = '';
var playlist_desc = '';
//total_pll -= 1;
function createPlaylists()
{
	keyword = document.getElementById('inputKeyw').value;
	order_by = document.getElementById('inputOrderby').value;
	total_pll = document.getElementById('inputTotalpll').value;
	total_videos = document.getElementById('inputVideos').value;
	total_video_from = document.getElementById('inputTotalV1').value;
	total_video_from = parseInt(total_video_from);
	total_video_to = document.getElementById('inputTotalV2').value;
	total_video_to = parseInt(total_video_to);
	playlist_title = document.getElementById('playlist_title').value;
	playlist_desc = document.getElementById('playlist_desc').value;
	total_videos = total_videos.replace(/ /g,'');
	all_videos = total_videos.split(',');
	document.getElementById("create_now").classList.add("disabled");
	document.getElementById("create_now").innerHTML = "Đang tạo ...";
	//document.getElementById("create_now").setAttribute("class", "disabled");
	search(keyword, page_times);
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
	return string.substring(string.lastIndexOf(firstS)+1,string.lastIndexOf(lastS));
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
		new_arr = all_videos[i_video] + ',' + new_arr;
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