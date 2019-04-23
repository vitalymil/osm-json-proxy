
module.exports = {
    write: (level, message, data) => {
        console.log(JSON.stringify({
            level,
            message,
            ...data
        }));
    }
}