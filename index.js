var stdin = process.openStdin();
stdin.setRawMode(true);
stdin.resume()
stdin.setEncoding('utf8')

const { time } = require('console');
const fs = require('fs')

const cons = {
    clear: () => { console.clear() },
    log: (data) => { process.stdout.write(data) },
    width: () => { return process.stdout.columns },
    height: () => { return process.stdout.rows },
}

cons.clear()

// Nav

var navHeight = 1
var navIndex = 0
var navItems = ['Dashboard', 'Todo', 'Settings', 'About']
function setNavIndex(value) {
    if (!(value >= navItems.length) && !(value < 0)) {
        navIndex = value
        display()
    }
}
function navBuild() {
    var navLength = 0
    for (const i in navItems) {
        navLength = navLength + navItems[i].length
    }
    navLength = navLength + navItems.length - 1
    var padding = (cons.width() - navLength) / 2 - 1
    for (let i = 0; i < padding; i++) {
        cons.log(' ')
    }
    for (const i in navItems) {
        if (i == navIndex) {
            cons.log(`\x1B[37m${navItems[i]}\x1B[39m`)
        } else {
            cons.log(`\x1B[90m${navItems[i]}\x1B[39m`)
        }
        if (i != (navItems.length - 1)) {
            cons.log(' ')
        }
    }
    for (let i = 0; i < padding; i++) {
        cons.log(' ')
    }
}

// Content
function approximateRow(num) {
    if (num > Math.floor(num)) {
        num = Math.floor(num) + 1
    }
    return num
}
function contentBuild() {
    var height = 0
    var builders = [
        () => {
            cons.log('\n')
            height++

            var date = new Date()
            var monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec"]
            var dateOutput = `Hello, Today is ${monthName[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}.`
            var textHeight = approximateRow(dateOutput.length / cons.width())

            var todoCount = 16
            var todoOutput = ''
            if (todoCount) {
                var thing
                if (todoCount == 1) {
                    thing = 'thing'
                } else {
                    thing = 'things'
                }
                todoOutput = `You have ${todoCount} ${thing} to do.`
                textHeight = textHeight + approximateRow(todoOutput.length / cons.width())
            }

            var timeOutput = `Current Time: ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
            textHeight = textHeight + approximateRow(timeOutput.length / cons.width())

            height = textHeight + 3

            cons.log(`${dateOutput}\n${todoOutput}\n\n${timeOutput}`)

            setTimeout(() => {
                display()
            }, 1000);
        },
        () => { },
        () => { },
        () => { },
    ]
    builders[navIndex]()
    return height
}

// Command Bar

var commandBarHeight = 0
var commandBarShow = false
function setCommandBarShow(value) {
    if (value == true) {
        commandBarHeight = 1
        commandBarShow = true
    }
    else {
        commandBarHeight = 0
        commandBarShow = false
    }
    display()
}
function commandBarBuild() {
    if (commandBarShow) {
        cons.log('> ')
    }
}
function runCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0)
            break;
        default:
            setCommandBarShow(false)
    }
}

// Main display builder

function display() {
    cons.clear()
    navBuild()
    const contentHeight = contentBuild()
    for (let i = 0; i < cons.height() - navHeight - contentHeight - commandBarHeight; i++) {
        cons.log('\n')
    }
    commandBarBuild()
}

var inputStream = ''

stdin.on('data', function (key) {
    if (key == '\u0003') {
        process.exit();
    }
    if (key == '\r\n' || key == '\r' || key == '\n') {
        runCommand(inputStream)
    } else if (commandBarShow && key != '\u001b[D' && key != '\u001b[C') {
        process.stdout.write(key)
        inputStream = inputStream + key
    }
    if (key == '\u001b[D') {
        setNavIndex(navIndex - 1)
    }
    if (key == '\u001b[C') {
        setNavIndex(navIndex + 1)
    }
    if (key == '>') {
        setCommandBarShow(true)
    }
    if (key == '<') {
        inputStream = ''
        setCommandBarShow(false)
    }
})

display()
