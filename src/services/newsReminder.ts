import { log } from 'wechaty'
import type { Wechaty } from 'wechaty'
import axios from 'axios'
import { load } from 'cheerio'
import { sleep } from '../utils/sleep.ts'

const receiver = 'test'

/**
 bug:
 如果学校把最近的那条消息删了，就会导致匹配不到，于是整个消息都给输出了
 遂将news.length全部遍历改为只便利5条（一般不会一次性发超过5条消息），防止bug消息爆炸
 */

const jwc_url = 'http://jwc.swjtu.edu.cn/vatuu/WebAction?setAction=newsList'
const xg_url = 'http://xg.swjtu.edu.cn/web/Home/PushNewsList?Lmk7LJw34Jmu=010j.shtml'
let jwc_news = []
let xg_news = []

export async function news_loop(bot: Wechaty) {
  while (true) {
    // jwc
    axios.get(jwc_url)
      .then(async (response) => {
        const $ = load(response.data)
        const news = $('.littleResultDiv')
        for (let i = 0; i < 5; i++) {
          const ele = $(news[i]).find('h3').find('a')
          const jwc_href = `http://jwc.swjtu.edu.cn/vatuu${ele.attr('href').replace('../vatuu', '')}`
          if (jwc_news.length === 0) {
            jwc_news.push(jwc_href)
            jwc_news.push(jwc_href)
            break
          }
          else if (jwc_href === jwc_news[0]) {
            jwc_news.push(jwc_href)
            break
          }
          jwc_news.push(jwc_href)
          try {
            const room = await bot.Room.find(receiver)
            if (room)
              room.say(`【jwc】\n${ele.text()}\n${jwc_href}`)
          }
          catch (error) {
            log.error('发送群信息错误')
          }
          // console.log(`【jwc】\n${ele.text()}`)
          // await sleep(1000)
        }
      })
      .catch((error) => {
        log.error(error)
      })
    jwc_news = jwc_news.slice(1, 2)
    // console.log(jwc_news)

    // xg
    axios.get(xg_url)
      .then(async (response) => {
        const $ = load(response.data)
        const news = $('.block-ctxlist').find('li')
        for (let i = 0; i < 5; i++) {
          const ele = $(news[i]).find('h4').find('a')
          const xg_href = `http://xg.swjtu.edu.cn${ele.attr('href')}`
          if (xg_news.length === 0) {
            xg_news.push(xg_href)
            xg_news.push(xg_href)
            break
          }
          else if (xg_href === xg_news[0]) {
            xg_news.push(xg_href)
            break
          }
          xg_news.push(xg_href)
          try {
            const room = await bot.Room.find(receiver)
            if (room)
              await room.say(`【xg】\n${ele.text()}\n${xg_href}`)
          }
          catch (error) {
            log.error('发送群信息错误')
          }
          // console.log(`【xg】\n${ele.text()}`)
        }
      })
      .catch((error) => {
        log.error(error)
      })
    xg_news = xg_news.slice(1, 2)
    // console.log(xg_news)

    await sleep(60000)
  }
}
