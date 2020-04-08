const express = require("express")
const app = express()
const fs = require("fs")
const nodeExcel = require('excel-export')
const Nightmare = require('nightmare'); // 自动化测试包，处理动态页面
const nightmare = Nightmare({
    show: true,
    waitTimeout: 10000000
}); // show:true  显示内置模拟浏览器

let NAMES = []

NAMES = nightmare
    .goto('https://www.bilibili.com/video/BV1sE411W7PH?p=16')
    .wait("div.list-item.reply-wrap")
    .wait(function () {
        window.names = []
        return true;
    })
    .wait(() => {

        var view_more_button = document.querySelectorAll(".list-item.reply-wrap .con .reply-box .view-more a[class='btn-more']")
        if (view_more_button) {
            for (var i = 0; i < view_more_button.length; i++) {
                view_more_button[i].click();
                return false
            }
        }


        var list = document.querySelectorAll('.list-item.reply-wrap .con .user a[class ^="name "]')
        for (var i = 0; i < list.length; i++) {
            let name = list[i].text
            if (names.indexOf(name) > -1) {
                console.log("skip..")
            } else {
                names.push(name)
            }
        }



        var next_page_button = document.querySelector(".bottom-page.paging-box-big a[class = 'next']");
        if (next_page_button) {
            next_page_button.click();
            return false
        }
        return true
    })
    .evaluate(function () {
        return names
    })
    .end()
    .then(function (res) {
        NAMES = res

        // fs.writeFile('names.txt', res.toString(), (err) => {
        //     if (err) {
        //         console.log("写入文件有错--", err)
        //     } else {
        //         console.log("保存成功")
        //     }
        // })


        console.log("over!")
    })
    .catch(error => {
        console.log(`抓取失败 - ${error}`)
    })


app.get('/', (req, res, next) => {
    res.send(NAMES)
})

app.get('/e', (req, res, next) => {
    var conf = {};
    conf.name = "mysheet";
    conf.cols = [{
        caption: '昵称',
        type: 'string',
    }]
    conf.rows = []
    for (var i = 0; i < NAMES.length; i++) {
        conf.rows.push([
            NAMES[i]
        ])
        console.log(i + 1 + '---' + NAMES[i])
    }

    var result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
    res.end(result, 'binary');
})


var server = app.listen(9000, () => {
    console.log("祝你好运...")
})