import iz from "./axios.js";
const cheerio = require('cheerio');

export const get = async function(string) {
    var page = 0;
    var key = true;
    var iz_result;
    var gl_data =[];
    while (key) {
        console.log("第" + page + "页处理中")
       /* try { */
            iz_result = await iz.get("/search?f%5B0%5D=type%3Avideo&page=" + page);
    /*    } catch (e) {
            if (e.code != 'ECONNABORTED') {
                console.log(e);
            }
        } */

        if (!iz_result || !iz_result.data) {
            console.log("请求失败,请检查网络");
            return;
        }
        let $ = cheerio.load(iz_result.data);
        $('.views-column').each(function() {
            if (!key) {
                return;
            }
            var time = $(this).find(".submitted").contents().eq(2).text()
            var view = $(this).find(".video-info").contents().eq(2).text().replace(",", "");

            if (time.match(string)) {
                console.log("第" + page + "页结束匹配")
                key = false;
                return;
            }
            console.log(time + "  " + view);
/*            gl_data.view.push(parseInt(view));
            gl_data.time.push(time.replace(" 作成日:","")); */
            //replace(string,gl_data);
             gl_data.push({
                'url': $(this).find(".title").find("a").attr("href"),
                'time': time,
                "view": parseInt(view)
            });
        });
        iz_result = null;
        console.log("第" + page + "页处理完成")
        page++;

    }
    //replace(string,gl_data);
    console.log(gl_data);
    return gl_data;
}
