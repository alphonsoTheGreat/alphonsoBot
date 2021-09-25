const { consts, logger } = require('./utils');
const LOG_PLACEHOLDER = "init file";

(async function () {
    try {
        // if we running the devserver () local mode then we need to load the env vars first
        if (process.env.NODE_ENV === consts.env.development) {
            const devinit = require('./utils/devinit');
            await devinit()
        }

        require('./server')

    } catch (e) {
        logger.ERROR(LOG_PLACEHOLDER, e)
        process.exit(1)
    }

})()
