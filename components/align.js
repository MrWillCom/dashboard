var align = (str, length) => {
    var spaces = ''
    for (let i = 0; i < (length - str.length); i++) {
        spaces = spaces + ' '
    }
    return `${str}${spaces}`
}

module.exports = align