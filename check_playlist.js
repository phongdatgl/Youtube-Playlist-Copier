var str = '';
str += '<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">';
str += '<div class="container"><div class="row"><div class="col-sm-6 col-sm-offset-3">';
str += '<h1 class="text-center">Check Playlist Views</h1><form action="" method="POST" class="form-horizontal" role="form">'+
	'<div class="form-group">'+
		'<div class="col-sm-12">'+
			'<textarea class="form-control" rows="10" name="playlist_list" id="playlist_list" placeholder="Danh sách ID playlist (1 ID 1 dòng)">PLOUBdFCl4DJL0rU5esaPEdNI8jwhZX8UZ\r\nPLFWKTnmnhwU5EmFZDCKHKYUG3lKGizq99\r\nnPLFWKTnmnhwU5EmFZDCKHKYUG3lKGizq991</textarea>'+
		'</div>'+
	'</div>'+
	'<div class="form-group">'+
		'<div class="col-sm-8 col-sm-offset-4">'+
			'<button type="button" id="create_now" onclick="checkPlaylist()" class="btn btn-primary">Check View</button>'+
		'</div>'+
	'</div>'+
'</form>'+
'</div></div>'+
'<div class="row"><div class="col-sm-6 col-sm-offset-3" id="result_text"></div></div>'+
'<div class="row"><div class="col-sm-6 col-sm-offset-3" id="result_area"></div></div>'+
'</div>'
;

var playlist_list = '';
var playlist_list_arr = [];
var api_key = 'AIzaSyDwC8WgbucSq5uz4Wu_b0rMgnuOHucQVDk';
var result_list = [];
function checkPlaylist()
{
	document.getElementById("create_now").classList.add("disabled");
	document.getElementById("create_now").innerHTML = "Đang check ...";
	document.getElementById('result_area').innerHTML = '<h2 class="text-center">Checked list</h2><textarea id="result_area_id" class="form-control" rows="10"></textarea>';
	checkNow();
}

function checkNow()
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			playlist_list = document.getElementById('playlist_list').value;
			regex = /(\r\n)|(\n)|(\r)/gm;
			tmp = playlist_list.split('\n');
			for(var i = 0; i < tmp.length; i++) {
				if(tmp[i].length > 10) {
					playlist_list_arr.push(tmp[i]);
				}
			}
			for(i = 0; i < playlist_list_arr.length; i++) {
				pllViews = checkPll(playlist_list_arr[i]); console.log(playlist_list_arr[i]);
				if(pllViews == -1) pllViews = 'die';
				result_list.push(pllViews + '|' + playlist_list_arr[i]);
				//result_list = sortArr(result_list);
				document.getElementById('result_area_id').value = result_list.join("\r\n");
			}
			
			document.getElementById("create_now").classList.remove("disabled");
			document.getElementById("create_now").innerHTML = "Đã xong !";
		}
	};
	xhttp.open("GET", 'https://www.youtube.com', true);
	xhttp.send();
	
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
function sortArr(arr)
{
	for(i = 0; i < arr.length; i++) {
		line = arr[i].split('|');
		plv = trimStr(line[0]);
		for(j = i+1; j < arr.length; j++) {
			line1 = arr[j].split('|');
			plv1 = trimStr(line1[0]);
			if(plv1 > plv) {
				tmp = arr[i];
				arr[i] = arr[j];
				arr[j] = tmp;
			}
		}
		
	}
	return arr;
}
function trimStr(str)
{
	str = str.replace(',', '');
	str = str.replace('.', '');
	str = str.replace(' ', '');
	return str;
}
function sendGetRq(url)
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		
	};
	xhttp.open("GET", url, false);
	xhttp.send();
	if (xhttp.readyState == 4 && xhttp.status == 200) {
		return (xhttp.responseText);
	}
}
function checkPll(plid)
{
	//video[a-z]{0,1}<\/li><li>([0-9.,]{1,15})\s.*<\/li><li>
	url = 'https://www.youtube.com/playlist?list=' + plid;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			str = (xhttp.responseText);
			if(str.indexOf('pl-header-title') <= 0) {
				return -1;
			} else {
				regex = /video[a-z]{0,1}<\/li><li>([0-9.,]{1,15})\s.*<\/li><li>/g;
				match = regex.exec(str);
				try {
					if(match.length >= 2) { console.log("11 "+match[1]);
						return match[1];
					} else {
						return 0;
					}
				} catch(e) {return 0;}
				
			}
		}
	};
	xhttp.open("GET", url, false);
	xhttp.send();
	
	
}

document.body.innerHTML = str;