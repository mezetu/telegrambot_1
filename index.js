const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()

const token = process.env.TOKEN
const bot = new TelegramBot(token, {polling: true})

let notes = []
let info = []

    bot.onText(/plan (.+) (.+) (.+)/, (msg, match) => {
        const userId = msg.from.id
        const plan = match[1]
        const date = match[2]
        const time = match[3]
    
        notes.push({ 'uid': userId, 'plan': plan, 'date': date, 'time': time})
        info.push(plan)
        console.log(info);
    
        bot.sendMessage(userId, 'Я обязательно напомню :)')
    })
    
    const curMonth = new Date().getMonth()+1
    let curDate;
    let time
    setInterval(() => {
        for (let i = 0; i < notes.length; i++) {

            if(new Date().getMonth() < 10){
                curDate = new Date().getDate() + '.' + '0' + curMonth
            } else {
                curDate = new Date().getDate() + '.' + curMonth
            }

            if(new Date().getMinutes() < 10 ){
                time = new Date().getHours() + ':' + '0' + new Date().getMinutes()
            } else {
                time = new Date().getHours() + ':' + new Date().getMinutes()
            }

            const curTime = new Date().getHours() + ':' + new Date().getMinutes()
            if(notes[i]['date'] === curDate && notes[i]['time'] === time){
                bot.sendMessage(notes[i]['uid'], 'Напоминаю, что вы должны: '+ notes[i]['plan'] + ' сейчас.')
                notes.splice(i, 1)
                info.splice(i, 1)
            }
        }
    }, 1000)


//schedule()

const start = () => {

    bot.setMyCommands( [
        {command: '/start', description: 'Инструкция по использованию'},
        {command: '/info', description: 'Запланированные задачи'},
        {command: '/plan', description: 'Планирование задач'}
    ])
    
    bot.on('message', async msg => {
        const chatId = msg.chat.id
        const text = msg.text
        const user = `${msg.chat.username}`
    
        if(msg.text === '/start'){
            bot.sendMessage(chatId, 'Привет! Давай запланируем!')
            return bot.sendMessage(chatId,` Что бы запланировать задачу напиши: '/plan *задача* *ДД.ММ* *время(ч:м)*'`)
        }
    
        if(msg.text === '/info'){
               if(info.length - 1 === 0){
                    return bot.sendMessage(chatId, `Вот твоя запалнированная задача: ${info[0]} в ${notes[0]['time']}`)
               }

               await bot.sendMessage(chatId, 'Вот твои запалнированные задачи: ')
               for (let j = 0; j < info.length; j++) {
                    bot.sendMessage(chatId, `${info[j]} в ${notes[0]['time']}`)
               }

        }
        
        if(msg.text === '/plan'){
            return bot.sendMessage(chatId, `Что бы запланировать задачу напиши: '/plan *задача* *ДД.ММ* *время(ч:м)*'`)
        } 
        //return bot.sendMessage(chatId, 'Неизвестная задача')
    })


}

start()