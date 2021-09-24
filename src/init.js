const { consts } = require('./utils')
try {

    if (process.env.NODE_ENV === consts.env.development)
        require('./utils/devinit')()
            .then(() => {
                require('./server')
            })
            .catch(e => {
                console.log({ e });
                process.exit(1)
            })
    else
        require('./server')


} catch (e) {
    console.log({ e });
    process.exit(1)
}