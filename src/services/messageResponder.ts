import os from 'node:os'
import type { Room } from 'wechaty'

function getCpuUsage(): number {
  const cpus = os.cpus()

  // 计算每个CPU核心的使用率
  const total = cpus.reduce((acc, cpu) => {
    const total = Object.values(cpu.times).reduce((total, time) => total + time, 0)
    const idle = cpu.times.idle

    return acc + (1 - idle / total)
  }, 0)

  // 计算平均CPU使用率
  const avgCpuUsage = total / cpus.length

  return avgCpuUsage
}

async function state(room: Room) {
  const cpu = (getCpuUsage() * 100).toPrecision(3)
  const mem = (100 - os.freemem() / os.totalmem() * 100).toPrecision(4)
  await room.say(`cpu usage: ${cpu}%\nmem used: ${mem}%\nloadavg: ${os.loadavg()}`)
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
      await room.say('dong!')
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
