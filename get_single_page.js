const express = require("express")
const app = express()
// const superagent = require("superagent")
const cheerio = require("cheerio")
const Nightmare = require('nightmare'); // 自动化测试包，处理动态页面
const nightmare = Nightmare({
    show: true,
    waitTimeout: 70000
}); // show:true  显示内置模拟浏览器

let NAMES = []
let test = ""

main()

function main() {
    load("https://www.bilibili.com/video/BV1qk4y197tE")
}

function load(url) {
    nightmare
        .goto(url)
        .wait("div.list-item.reply-wrap")
        .evaluate(() => document.querySelector("div.comment-list").innerHTML)
        .then(htmlStr => {
            NAMES = getName(htmlStr)
            test = htmlStr
        })
        .catch(error => {
            console.log(`抓取失败 - ${error}`);
        })
}

function getName(res) {
    let names = []
    let $ = cheerio.load(res)
    $('div.list-item.reply-wrap .con .user a[class ^="name "]').each((idx, ele) => {
        let name = $(ele).text()
        if (names.indexOf(name) > -1) {
            console.log("skip..")
        } else {
            names.push(name)
            console.log(idx + "---" + name)
        }
    })
    return names
}

app.get('/', (req, res, next) => {
    res.send(NAMES)
})


var server = app.listen(9000, () => {
    console.log("祝你好运...")
})