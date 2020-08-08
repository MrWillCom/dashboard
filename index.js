var stdin = process.openStdin();
stdin.setRawMode(true);
stdin.resume()
stdin.setEncoding('utf8')

const align = require('./components/align')

const cons = {
    clear: () => { console.clear() },
    log: (data) => { process.stdout.write(data) },
    width: () => { return process.stdout.columns },
    height: () => { return process.stdout.rows },
}

cons.clear()

var navHeight = 1
var commandBarHeight = 0
var commandBarShow = false

function display() {
    cons.clear()
    cons.log('Dashboard')
    for (let i = 0; i < cons.height() - navHeight - commandBarHeight; i++) {
        cons.log('\n')
    }
    if (commandBarShow) {
        cons.log('> ')
    }
}

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

function runCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0)
            break;
        default:
            setCommandBarShow(false)
    }
}

var inputStream = ''

stdin.on('data', function (key) {
    if (key == '\u0003') {
        process.exit();
    }
    if (key == '\r\n' || key == '\r' || key == '\n') {
        runCommand(inputStream)
    }
    if (commandBarShow) {
        process.stdout.write(key);

        inputStream = inputStream + key
    }
    if (key == '>') {
        setCommandBarShow(true)
    }
    if (key == '<') {
        setCommandBarShow(false)
    }
})

display()