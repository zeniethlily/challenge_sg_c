const router = require("express").Router();
const User = require("../models/user.model");
const Main = require("../models/main.model");

router.get("/", async (req, res) => {
    try {
        let lists = await Main.find();
        
        res.render("main/index", { lists });
    } catch (error) {
        console.log(error);
    }
    
});

router.get("/new", (req, res) => {
    res.render("main/new");
});

router.post("/new", (req, res) => {
    

    let itemlist = new Main(req.body);

    itemlist.save()
    .then(() => {
        res.redirect("/");
    })
    .catch((err) => {
        console.log(err);
    })
});


module.exports = router;