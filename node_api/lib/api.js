var {
	iz
} = require("./axios.js");
var {
	replace
} = require("./file.js")
const cheerio = require('cheerio');
const ProgressBar = require("./slog.js")
var getDataByTime = async function(time,file_name,line_count) {
	var url = "/search?f%5B0%5D=created%3A" + time + "&f%5B1%5D=type%3Avideo";
	var gl_data = [];
	//console.log("获取页数中。。。。")
	var iz_result = await iz.get(url);
	if (!iz_result || !iz_result.data) {
		//console.log("请求失败,请检查网络");
		return;
	}
	var $ = cheerio.load(iz_result.data);
	var last_page = $('.pager-last.last').find("a").attr("href");
    var pageinit = last_page?parseInt(last_page.split("=").pop()):0;
	//console.log("页数为" + pageinit)
    var pb = new ProgressBar("查找日期："+file_name, pageinit+1,line_count   );
	for (var page = 0; page <= pageinit; page++) {
		//console.log("第" + page + "页处理中")
         pb.render({ completed: page, total: pageinit+1 });
		try {
			iz_result = await iz.get(url + "&page=" + page);
		} catch (e) {
			if (e.code != 'ECONNABORTED') {
				//console.log(e);
			}
		}

		if (!iz_result || !iz_result.data) {
			//console.log("请求失败,请检查网络");
			return;
		}
		$ = cheerio.load(iz_result.data);
		$('.views-column').each(function() {
			var title = $(this).find(".title").find("a").text();
			var auth = $(this).find(".username").text()
			var time = $(this).find(".submitted").contents().eq(2).text().replace(" 作成日:","");
			var view = $(this).find(".video-info").contents().eq(2).text().replace(",", "");
            var attr_src =  $(this).find(".field-item.even").find("img").attr("src")
            if(attr_src){
                var img_url = attr_src.replace("//i.iwara.tv/sites/default/files/styles/thumbnail/public/videos/thumbnails","")
            }else{
                var img_url = ""
            }
			//console.log(time + "  " + view);
			gl_data.push({
				"title":title,
				'auth':auth,
				'url': $(this).find(".title").find("a").attr("href"),
				"img_url":img_url,
				'time': time,
				"view": parseInt(view)
			});
		});
		pb.render({ completed: page+1, total: pageinit+1 });
		//console.log("第" + page + "页处理完成");
	}
	replace(file_name,gl_data);
	return gl_data;
}
module.exports = {
	getDataByTime
}
