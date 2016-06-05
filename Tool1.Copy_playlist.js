var keyword = prompt('Nhập vào keyword thím ơi:');
var total_pll = prompt('Nhập vào tổng pll muốn tạo: ');
var total_videos = prompt('Nhập vào ID video muốn chèn, cách nhau bằng dấu , : ');
//var total_videos = 'AVVbZzMhJHU';
total_videos = total_videos.replace(/ /g,'');
var all_videos = [];
all_videos = total_videos.split(',');
//var total_pll = 2;
var plls = [];
var total_times = 0;
var page_times = 1;
var security_token = '';
var api_key = 'AIzaSyAsD0yc-a0-Jaaj2YySRMVXmfOwXj9wmAQ';
var i_video = 0;
var current_video_id = '';
total_pll -= 1;
if(keyword == '')
{
   alert('Keyword trống !');
} else {
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
	var pll_param = '&sp=EgIQAw%253D%253D';
	var page_param = '&page=' + page;
	var url = 'https://www.youtube.com/results?search_query='+key_encode+pll_param+page_param;
	var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	    if (xhttp.readyState == 4 && xhttp.status == 200) {
				filterAllPlaylist(xhttp.responseText);
			total_times += 1;
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

function filterAllPlaylist(page_string)
{
	var content_string = '';
	content_string = getStringBetween(page_string, 'class="item-section">','class="yt-uix-pager');
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
	if(plls.length >= total_pll) {
		console.log('Total playlist has been got: ' + plls.length);
		var url = 'https://www.youtube.com/playlist?list=' + plls[0];
		var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200) {
					security_token = getStringBetween(xhttp.responseText, 'data-playlist-edit-xsrf-token="', '=" data-');
					security_token = security_token.replace('ata-playlist-edit-xsrf-token="', '');
					security_token += '%3D';
					autoCreate();
				}
			};
		xhttp.open("GET", url, true);
		xhttp.send();
		
	} else {
		//console.log(plls.length);
		page_times += 1;
		search(keyword, page_times);
	}
	
}

function getPlaylistInfo(id)
{
	
	//get data
	var url = 'https://www.googleapis.com/youtube/v3/playlists?key=' + api_key + '&id=' + id + '&part=id,snippet';
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		
	};
	xhttp.open("GET", url, false);
	xhttp.send();
	if (xhttp.readyState == 4 && xhttp.status == 200) {
		var arr = JSON.parse(xhttp.responseText);
		var res = [];
		try {
			res['title'] = arr['items'][0]['snippet']['title'];
			res['des'] = arr['items'][0]['snippet']['description'];
		} catch(e) {}
		return res;
	} else return [];
}

function sendRq(postVar)
{
	var url = 'https://www.youtube.com/playlist_ajax?action_create_playlist=1';
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

function autoCreate()
{
	var url = '';
	var postVar = '';
	var page = '';
	var tmp = [];
	var plid = '';
	var doneList = [];
	for(var i = 0; i < plls.length; i++)
	{
		tmp = getPlaylistInfo(plls[i]);
		var postVar = 'video_ids&source_playlist_id='+plls[i]+'&n='+encodeURI(tmp["title"])+'&p=public&session_token='+security_token;
		page = sendRq(postVar);
		try {
			pJson = JSON.parse(page);
			plid = pJson['result']['playlistId'];
			if(total_videos.length > 0) {
				addVideoToPlaylist(plid);
				moveVideoOnTop(plid);
			}
			setDescription(plid, tmp['des']);
			console.log('Done: https://www.youtube.com/playlist?list=' + plid);
			doneList.push(plid);
		} catch(e) {}
		
		//break;
	}
	document.body.innerHTML += '<textarea cols="50" rows="10">'+doneList.join("\r\n")+'</textarea>';
	console.log('Done !!!');
	return;
}

function addVideoToPlaylist(plid)
{
	if( (i_video+1) > all_videos.length ) {
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

function moveVideoOnTop(plid)
{
	url = 'https://www.youtube.com/playlist?list=' + plid;
	page_str = sendGetRq(url);
	//data-set-video-id="
	var regex = /data-set-video-id=\"([A-F0-9]{15,20})/g;
	match = regex.execAll(page_str);
	first_video = match[0][1];
	last_video = match[match.length-1][1];
	url = 'https://www.youtube.com/playlist_edit_service_ajax/?action_move_video_before=1';
	postVar = 'playlist_id='+plid+'&set_video_id='+last_video+'&moved_set_video_id_successor='+first_video+'&session_token='+security_token;
	str = sendPostRq(url, postVar);
}
function setDescription(plid, desc)
{
	url = 'https://www.youtube.com/playlist_edit_service_ajax?action_set_playlist_description=1';
	postVar = 'playlist_id='+plid+'&playlist_description='+encodeURI(desc)+'&session_token='+security_token;
	str = sendPostRq(url, postVar);
}