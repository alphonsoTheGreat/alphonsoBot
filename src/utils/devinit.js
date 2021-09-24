const dotenv = require("dotenv");
module.exports = async () => await dotenv.config({ path: "./src/utils/dev.env" });
