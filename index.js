const align = require('./components/align')

const cons = {
    clear: () => { console.clear() },
    log: (data) => { process.stdout.write(data) },
    input: (input, listener) => {
        process.stdin.on('data', (data) => {
            // For different platforms: CRLF, CR, LF
            if (data.toString() == `${input}\r\n` || data.toString() == `${input}\r` || data.toString() == `${input}\n`) { listener(data) }
        })
    },
    width: () => { return process.stdout.columns },
    height: () => { return process.stdout.rows },
}

cons.clear()

cons.log('Dashboard')
for (let i = 0; i < cons.height() - 2; i++) {
    cons.log('\n')
}
cons.log('> ')

cons.input('exit', () => { process.exit(0) })
