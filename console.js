var keyword = prompt('Nhập vào keyword thím ơi:');
//var total_pll = prompt('Nhập vào tổng pll muốn tạo: ');
var total_pll = 10;
var plls = [];
var total_times = 0;
var page_times = 1;

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
function search(keyword, page = 1)
{//https://www.youtube.com/results?sp=EgIQAw%253D%253D&search_query=animation+movies&page=1
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
	content_string = page_string.substring(page_string.lastIndexOf('class="item-section">')+1,page_string.lastIndexOf('class="yt-uix-pager'));
	var regex = /&amp;list=([A-Za-z0-9]{30,40})/g;
	match = regex.execAll(content_string);
	for(var i = 0; i < match.length; i++)
	{
		if(plls.indexOf(match[i][1]) == -1)
		{
			plls.push(match[i][1]);
		}
		if(plls.length >= total_pll) break;
	}
	if(total_times >= 4 && (plls.length >= total_pll)) {
		console.log(plls);
	} else {
		//console.log(plls.length);
		page_times += 1;
		search(keyword, page_times);
	}
	
}