
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const filePath = path.join(__dirname, "data", "attendees.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readAttendees() {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function saveAttendees(attendees) {
    fs.writeFileSync(filePath, JSON.stringify(attendees, null, 2));
}

// GET all attendees
app.get("/attendees", (req, res) => {
    const attendees = readAttendees();
    res.json(attendees);
});

// POST new attendee
app.post("/attendees", (req, res) => {
    const { name, event, ticketType, ticketPrice } = req.body;

    if (!name || !event || !ticketType || ticketPrice === undefined ||
        ticketPrice === "" || Number(ticketPrice) <= 0) {
        return res.status(400).json({ message: "Invalid attendee details" });
    }

    const attendees = readAttendees();

    const newAttendee = {
        id: Date.now(),
        name,
        event,
        ticketType,
        ticketPrice: Number(ticketPrice)
    };

    attendees.push(newAttendee);
    saveAttendees(attendees);

    res.status(201).json(newAttendee);
});

// DELETE attendee by ID
app.delete("/attendees/:id", (req, res) => {
    const attendees = readAttendees();

    console.log("Requested ID:", req.params.id);
    console.log("Stored attendees:", attendees);

    const id = Number(req.params.id);

    const updatedAttendees = attendees.filter(
        attendee => Number(attendee.id) !== id
    );

    if (updatedAttendees.length === attendees.length) {
        return res.status(404).json({
            message: "Attendee not found",
            requestedId: id
        });
    }

    saveAttendees(updatedAttendees);

    res.json({ message: "Attendee deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
