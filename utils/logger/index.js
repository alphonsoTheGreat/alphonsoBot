module.exports = {
    INFO: (placeHolder, message) => {
        const date = new Date()

        console.log("[" + date + "][INFO][" + placeHolder + "][" + message + "]")
    },
    ERROR: (placeHolder, error) => {

        const date = new Date()
        console.log("[" + date + "][ERROR][" + placeHolder + "][" + error + "]")
    },
}