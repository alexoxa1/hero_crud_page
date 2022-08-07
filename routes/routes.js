const express = require("express");
const router = express.Router();
const Hero = require("../models/heroes");
const multer = require("multer");
const fs = require("fs");

// image upload
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
});

let upload = multer({
    storage: storage,
}).single("image");

// insert an hero into the database route
router.post("/add", upload, (req, res) => {
    const hero = new Hero({
        nickname: req.body.nickname,
        real_name: req.body.real_name,
        origin_description: req.body.origin_description,
        superpowers: req.body.superpowers,
        catch_phrase: req.body.catch_phrase,
        image: req.file.filename,
    });
    hero.save((err) => {
        if(err) {
            res.json({message: err.message, type: "danger"});
        } else {
            req.session.message = {
                type: "success",
                message: "Hero added successfully"
            };
            res.redirect("/");
        }
    });
});

// get all heroes from the database route
router.get("/", (req, res) => {
    Hero.find().exec((err, heroes) => {
        if(err){
            res.json({ message: err.message, type: "danger" });
        } else {
            res.render("index", {
                tittle: "Heroes", 
                heroes: heroes,
            });
        }
    })
});

router.get("/add", (req, res) => {
    res.render("add_heroes", { tittle: "Add Heroes" });
});

// Edit an hero route
router.get("/edit/:id", (req, res) => {
    let id = req.params.id;
    Hero.findById(id, (err, hero) => {
        if(err){
            res.redirect("/");
        } else {
            if(hero === null){
                res.redirect("/");
            } else {
                res.render("edit_heroes", {
                    tittle: "Edit Heroes",
                    hero: hero,
                });
            }
        }
    })
});

// update an hero route
router.post("/update/:id", upload, (req, res) => {
    let id = req.params.id;
    let new_image = "";

    if(req.file){
        new_image = req.file.filename;
    } else {
        new_image = req.body.old_image;
    }

    Hero.findByIdAndUpdate(id, {
        nickname: req.body.nickname,
        real_name: req.body.real_name,
        origin_description: req.body.origin_description,
        superpowers: req.body.superpowers,
        catch_phrase: req.body.catch_phrase,
        image: new_image,
    }, (err, result) => {
        if(result.image != req.body.old_image){
            try{
                fs.unlinkSync("./uploads/"+result.image);
            } catch(err){
                console.log(err);
            }
        }

        if(err){
            res.json({ message: err.message, type: "danger" });
        } else {
            req.session.message = {
                type: "success",
                message: "Hero updated successfully"
            };
            res.redirect("/");
        }
    })
});

// delete an hero route
router.get("/delete/:id", (req, res) => {
    let id = req.params.id;
    Hero.findByIdAndDelete(id, (err, result) => {
        if(result.image != ""){
            try{
                fs.unlinkSync("./uploads/"+result.image);
            } catch(err){
                console.log(err);
            }
        }

        if(err){
            res.json({ message: err.message });
        } else {
            req.session.message = {
                type: "info",
                message: "Hero deleted successfully"
            };
            res.redirect("/");
        }
    });
});

//Hero detail route

router.get("/heroesDescription/:id", (req, res) => {
    let id = req.params.id;
    Hero.findById(id, (err, hero) => {
        if(err){
            res.redirect("/");
        } else {
            if(hero === null){
                res.redirect("/");
            } else {
                res.render("heroes_description", {
                    tittle: "Description",
                    hero: hero,
                });
            }
        }
    })
});

module.exports = router;