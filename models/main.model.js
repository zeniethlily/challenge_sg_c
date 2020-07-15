const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mainSchema = Schema({
           items:[String],
           deliveryDate: Date,
           status: Number, // 0/ 1 / 2
});

const Main = mongoose.model("Main", mainSchema);

module.exports = Main;