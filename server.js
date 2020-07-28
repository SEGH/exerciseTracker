// Dependencies
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();

// Route logger
app.use(logger("dev"));

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets
app.use(express.static("public"));

// Connect database
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

// html routes
app.get("/stats", (req, res) => {
    res.sendFile(__dirname + "/public/stats.html");
});

app.get("/exercise", (req, res) => {
    res.sendFile(__dirname + "/public/exercise.html");
});

// API routes
app.get("/api/workouts", (req, res) => {
    db.Workout.find({})
        .then(workouts => {
            res.json(workouts);
        })
        .catch(err => {
            res.json(err);
        });
});

app.post("/api/workouts", (req, res) => {
    db.Workout.create(req.body)
        .then(workout => {
            res.json(workout);
        })
        .catch(err => {
            res.json(err);
        });
});

app.put("/api/workouts/:id", (req, res) => {
    db.Exercise.create(req.body).then(exercise => {
        let newDuration = exercise.duration;
        db.Workout.findOneAndUpdate({ _id: req.params.id }, { $push: { exercises: exercise.id }, $inc: { totalDuration: newDuration}}, { new: true }).then(workouts => {

            res.json(workouts);
        });
    });
});

// Last seven records
app.get("/api/workouts/range", (req, res) => {
    db.Workout.find({})
    .sort({day: -1})
    .limit(7)
    .populate("exercises")
    .then(workouts => {
        res.json(workouts);
    })
    .catch(err => {
        res.json(err);
    });
});

// Run server
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});