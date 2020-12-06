var express = require('express');
var app = express();
const sqlite3 = require('sqlite3').verbose();

var datetime = require('node-datetime');
var dt = datetime.create(); //dt.now()

var cors = require('cors');
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
app.use(cors());
app.use(express.json());

// Use the UUID package to generate UUIDs properly
const { v4: uuidv4 } = require('uuid');

// Connect to the database
var db = new sqlite3.Database('datacollection.db');

// Handle a database error
function handleSQLError(error) {
    if (error) {
        console.error("[ERROR] Error while handling an SQL request!");
        console.error(error);
    }
}

// Helper function to insert a new user
async function insertUser(name, contact_email, callback) {
    if (name === undefined || name === null ||
        contact_email === undefined || contact_email === null) {
            throw new Error("Was given undefined or null while creating a user!");
        }

    // Generate a UUID for the user
    const uuid = uuidv4();

    // Insert into the DB
    db.run("INSERT INTO users (uid, uuid, name, contact_email) VALUES (NULL, ?, ?, ?);", [
        uuid,
        name,
        contact_email
    ], handleSQLError);

    // Get the generated UID
    db.get("SELECT last_insert_rowid();", [], (err, row) => {
        if (err) {
            throw err;
        }
        
        // Return the user ID generated through a callback
        callback(row['last_insert_rowid()']);
    });
}

// Helper function to insert a new simulation run
async function insertSimRun(uid, dashbaordLayout, callback) {
    // Insert into the DB
    db.run("INSERT INTO simulation_runs (runID, uid, dashboard_layout) VALUES (NULL, ?, ?);", [
        uid,
        dashbaordLayout
    ], handleSQLError);

    // Get the generated runID
    db.get("SELECT last_insert_rowid();", [], (err, row) => {
        if (err) {
            throw err;
        }
        
        // Return the runID generated through a callback
        callback(row['last_insert_rowid()']);
    });
}

app.get("/", (req, res) => {
    res.send({
        "status": "success",
        "data": "Hello world!"
    });
});

// Handle POST requests
app.post("/", async (req, res) => {
    // Figure out what type of request this is
    if (req.body.type == "insertUser") {
        // Attempt to insert a user into the DB
        await insertUser(req.body.name, req.body.email, (uid) => {
            res.send({
                "status": "success",
                "user_id": uid
            });
        });
    }

    else if (req.body.type == "insertSimRun") {
        // Outline required elements
        const associatedUID = req.body.uid;
        const dashboardLayout = req.body.dashbaordLayout;
        const instructions = req.body.instructionList;
        const simulationEvents = req.body.simulationEvents;

        // Attempt to insert a sim run into the DB
        await insertSimRun(associatedUID, dashboardLayout, (runID) => {
            res.send({
                "status": "success",
                "runID": runID
            });
        });

        // [TODO] Insert all the instructions into the DB

        // [TODO] Insert all the simulation events into the DB
    }

});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
