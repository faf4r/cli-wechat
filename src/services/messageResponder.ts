import os from 'node:os'
import type { Room } from 'wechaty'

async function state(room: Room) {
  const mem = os.freemem() / os.totalmem()
  await room.say(`cpu: ${os.cpus()}\nmem: ${mem}\nloadavg: ${os.loadavg()}\nuptime: ${os.uptime()}`)
}

async function act_for(msg: string, room: Room) {
  if (!msg.includes('@零'))
    return
  msg = msg.replaceAll('@零', '').trim()
  switch (msg) {
    case 'test': {
      await room.say('fine')
      break
    }
    default: break
  }
}

export async function messageHandle(msg: string, room: Room) {
  switch (msg) {
    case 'ping': {
      await room.say('pong!')
      break
    }
    case 'ding': {
      await room.say('pong!')
      break
    }
    case '/state': {
      state(room)
      break
    }
    default: {
      await act_for(msg, room)
      break
    }
  }
}
