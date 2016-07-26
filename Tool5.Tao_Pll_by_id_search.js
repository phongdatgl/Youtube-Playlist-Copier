var str = '';
str += '<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">';
str += '<div class="container"><div class="row"><div class="col-sm-6 col-sm-offset-3">';
str += '<h1 class="text-center">Tool tạo playlist từ video</h1><form action="" method="POST" class="form-horizontal" role="form">'+
	'<div class="form-group">'+
		'<label for="inputTotalpll" class="col-sm-4 control-label">Số lượng Pll:</label>'+
		'<div class="col-sm-8">'+
			'<input type="number" name="total_pll" id="inputTotalpll" class="form-control" value="10" required="required" title="">'+
		'</div>'+
	'</div>'+
	'<div class="form-group">'+
		'<label for="inputVideos" class="col-sm-4 control-label">ID video của bạn:</label>'+
		'<div class="col-sm-8">'+
			'<input type="text" name="idvideos" id="inputVideos" class="form-control" value="" required="required" placeholder="ID video, cách nhau bằng dấu phẩy">'+
		'</div>'+
	'</div>'+
	'<div class="form-group">'+
		'<label for="inputVideos" class="col-sm-4 control-label">Danh sách từ khóa:</label>'+
		'<div class="col-sm-8">'+
			'<textarea rows="10" id="keywords" class="form-control" placeholder="Nhập từ khóa vào đây, cách nhau bằng dấu phẩy"></textarea>'+
		'</div>'+
	'</div>'+
	'<div class="form-group">'+
		'<div class="col-sm-8 col-sm-offset-4">'+
			'<button type="button" id="create_now" onclick="createPlaylists()" class="btn btn-primary">Tạo ngay và luôn</button>'+
		'</div>'+
	'</div>'+
'</form>'+
'</div></div>'+
'<p class="text-center text-primary"><strong>Tool tạo playlist với số lượng video tự nhập, tiêu đề và mô tả copy từ các playlist đã có trên youtube bằng việc tìm kiếm qua từ khóa</strong></p>'+
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
var plls = [];
var ikw = 0;
var keyword_ex = [];
//total_pll -= 1;
function createPlaylists()
{
	keywords = document.getElementById('keywords').value;
	//order_by = document.getElementById('inputOrderby').value;
	total_pll = document.getElementById('inputTotalpll').value;
	total_videos = document.getElementById('inputVideos').value;
	document.getElementById("create_now").classList.add("disabled");
	document.getElementById("create_now").innerHTML = "Đang tạo ...";
	keyword_ex = keywords.split(',');
	getToken();
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
function getToken()
{
		url = 'https://www.youtube.com/playlist?list=PLFWKTnmnhwU7DC6KpvMpB4Sq7sqDG_wbn';
		xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200) {
					content = getStringBetween(xhttp.responseText, 'FEEDBACK_LOCALE_EXTRAS', "XSRF_FIELD_NAME");
					var regex = /\'XSRF_TOKEN\':\s[\'\"](.*)[\'\"]/;
					match = content.match(regex); console.log(content);
					security_token = match[1].replace('=', '%3D');

					getPlaylists();
				}
			};
		xhttp.open("GET", url, true);
		xhttp.send();
}
function filterAllPlaylist(page_string)
{
	
	var content_string = '';
	content_string = getStringBetween(page_string, 'class="item-section">','class="branded-page-box');
	var regex = /&amp;list=([A-Za-z0-9-_]{30,40})/g;
	match = regex.execAll(content_string);
	for(var i = 0; i < match.length; i++)
	{
		if(plls.length > total_pll) break;
		if(plls.indexOf(match[i][1]) == -1)
		{
			plls.push(match[i][1]);
		}
	}
	if(ikw >= keyword_ex.length) {
		console.log(plls.length);
	} else {
		ikw += 1;
		getPlaylists();
	}
}
function getPlaylistInfo(id)
{
	
	//get data
	var url = 'https://www.googleapis.com/youtube/v3/playlists?key=' + api_key + '&id=' + id + '&part=id,snippet';
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var arr = JSON.parse(xhttp.responseText);
			var res = [];
			try {
				res['title'] = arr['items'][0]['snippet']['title'];
				res['des'] = arr['items'][0]['snippet']['description'];
			} catch(e) {}
			return res;
		} else return [];
	};
	xhttp.open("GET", url, false);
	xhttp.send();
	
}
function search(kw)
{
	var key_encode = encodeURI(kw);
	var pll_param = '&sp=EgIQAw%253D%253D';
	var page_param = '&page=1';
	var url = 'https://www.youtube.com/results?search_query='+key_encode+pll_param+page_param;
	var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	    if (xhttp.readyState == 4 && xhttp.status == 200) {
			filterAllPlaylist(xhttp.responseText);
		}
	};
	xhttp.open("GET", url, false);
	xhttp.send();
	
}
function getPlaylists()
{console.log(keyword_ex[ikw]);
	search(keyword_ex[ikw]);
}
function createPlaylist()
{
	getPlaylists();
	console.log(plls);return false;
	document.getElementById('result_area').innerHTML = '<h2 class="text-center">Playlist Done</h2><textarea id="result_area_id" class="form-control" rows="10"></textarea>';
	postVar = '';
	url = 'https://www.youtube.com/playlist_ajax?action_create_playlist=1';
	for(var i = 1; i <= total_pll; i++) {
		new_arr = total_videos;
		i_video += 1;
		postVar = 'video_ids='+new_arr+'&source_playlist_id=&n='+encodeURI(playlist_title)+'&p=public&session_token='+security_token;
		//console.log(postVar);
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