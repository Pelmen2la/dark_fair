module.exports = function (app) {
    require("./mongoose")(app);
    require("./express")(app);
    require("./passport")(app);
};