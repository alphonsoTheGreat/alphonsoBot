module.exports = {
    INFO: (placeHolder, message) => {
        // const date = new Date()

        console.log("[INFO][" + placeHolder + "][" + message + "]")
    },
    ERROR: (placeHolder, error) => {

        // const date = new Date()
        console.log("[ERROR][" + placeHolder + "][" + error + "]")
    },
}