const express = require("express")
const notifier = require('node-notifier')
const fs = require("fs")
const cheerio = require("cheerio")
const Nightmare = require('nightmare'); // 自动化测试包，处理动态页面
const nightmare = Nightmare({
    show: false
}); // show:true  显示内置模拟浏览器
const app = express()

let video = [] //存储

main() //运行

function main() {
    getPage()
    setInterval(function () { //每30秒刷新
        getPage()
    }, 30000);
}

function fresh(video) {
    
    let fd0 = fs.openSync('bilibili.txt', 'r')
    let title = fs.readFileSync('bilibili.txt').toString()
    fs.closeSync(fd0)
    if (video[0].title != title) {
        let fd1 = fs.openSync('bilibili.txt', 'w')
        fs.writeFileSync(fd1, video[0].title)
        fs.closeSync(fd1)
        notifier.notify({
            title: "更新啦",
            message: video[0].title
        })
    }
}

function getPage() {
    nightmare
        .goto('https://space.bilibili.com/286631646')
        .wait("div#app")
        .evaluate(() => document.querySelector("div#app").innerHTML)
        .then(htmlStr => {
            video = getvideo(htmlStr)
        })
        .catch(error => {
            console.log(`抓取失败 - ${error}`);
        })
}

let getvideo = (htmlStr) => {
    let video = [];
    let $ = cheerio.load(htmlStr);

    // 本地新闻
    $(`.small-item.fakeDanmu-item.new a[class='title']`).each((idx, ele) => {
        let news = {
            title: $(ele).text(),
            href: $(ele).attr('href'),
        };
        video.push(news)
        fresh(video)
    });
    return video
}