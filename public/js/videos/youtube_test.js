//video_id指定でyoutubeの動画詳細を取得するテスト

$(function() {
	console.log("youtubeのテストです");
	//Jリーグの動画
	var url = "http://gdata.youtube.com/feeds/api/videos/v6kEtyvau_k?alt=json"; 
	$.ajax({
		type:"GET",
		dataType:"json",
		url:url,
		success: function(json) {
			console.log(json);
			alert("JSONデータの処理: " + json.entry.content.$t); 
			$("#video_list").append(json.entry.content.$t);
		}
	});
});
