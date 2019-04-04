const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// importing files
var Campground = require("./models/campground.js"); // ./ - references the current directory
var seedDB = require("./seeds.js");


mongoose.connect("mongodb://localhost/yelp_camp_v3", { useNewUrlParser: true }); // connected to yelp_camp_v3 database
app.use(bodyParser.urlencoded({extended: true}));
seedDB();


app.get("/", (req, res) => { // replace function with => arrow function in es6
    res.render("landing.ejs");
});


// INDEX route - show all campgrounds
app.get("/campgrounds", (req, res) => {
    // get all campgrounds from database
    Campground.find({}, (err, allCampgrounds) => { // {} finds everything
        if(err) {
            console.log(err);
        }
        else {
            res.render("index.ejs", {campgrounds: allCampgrounds}); // {campgrounds: allCampgrounds} the contents of allCampgrounds is sent to campgrounds which is furthur used in index.ejs 
        }
    });
});


// CREATE route - add to campground to database
app.post("/campgrounds", (req, res) => {
    // getting data from the form and adding to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCamp = {name: name, image: image, description: description}
    
    // create new campground and save to database
    Campground.create(newCamp, (err, newlyCreated) => {
        if(err) {
            console.log(err);
        }
        else {
            res.redirect("/campgrounds"); // redirecting back to campgrounds page
        }
    });
});


// NEW route - show form to create new campground
app.get("/campgrounds/new", (req, res) => { // campgrounds/new will then send the data to the post route
    res.render("new.ejs");
});


// SHOW route - displays additional info for a specific campground
app.get("/campgrounds/:id", (req, res) => {
    // find campground with given ID
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => { // findById - finds the collection by unique ID, populate - populates the comments field, find the correct data, and stick it in comments array, exec - starts the query
        if(err) {
            console.log(err);
        }
        else {
            console.log(foundCampground);
            res.render("show.ejs", {campground: foundCampground}); // render show.ejs with found Campground
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){ // process.env.PORT, process.env.IP  - environmental viriables set up for cloud9 which we access
    console.log("Server started");
});