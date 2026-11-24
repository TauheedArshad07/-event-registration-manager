
const form = document.getElementById("attendeeForm");
const attendeeList = document.getElementById("attendeeList");
const revenueDisplay = document.getElementById("revenue");

// Load attendees from API
async function loadAttendees() {
    const response = await fetch("/attendees");
    const attendees = await response.json();

    displayAttendees(attendees);
}

// Display attendees
function displayAttendees(attendees) {
    attendeeList.innerHTML = "";

    attendees.forEach(({ id, name, event, ticketType, ticketPrice }) => {
        attendeeList.innerHTML += `
            <tr>
                <td>${name}</td>
                <td>${event}</td>
                <td>${ticketType}</td>
                <td>PKR ${ticketPrice}</td>
                <td>
                    <button class="btn btn-danger btn-sm"
                        onclick="removeAttendee(${id})">
                        Remove
                    </button>
                </td>
            </tr>
        `;
    });

    const totalRevenue = attendees.reduce(
        (total, attendee) => total + attendee.ticketPrice, 0
    );

    revenueDisplay.textContent = totalRevenue;
}

// Add attendee
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const event = document.getElementById("event").value;
    const ticketType = document.getElementById("ticketType").value;
    const ticketPrice = document.getElementById("ticketPrice").value;

    if (!name || !event || !ticketType || !ticketPrice ||
        Number(ticketPrice) <= 0) {
        alert("Please fill all fields with valid values!");
        return;
    }

    const newAttendee = {
        name,
        event,
        ticketType,
        ticketPrice: Number(ticketPrice)
    };

    // Spread operator
    const attendeeData = { ...newAttendee };

    const response = await fetch("/attendees", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(attendeeData)
    });

    if (response.ok) {
        alert("Attendee registered successfully!");
        form.reset();
        loadAttendees();
    } else {
        alert("Registration failed!");
    }
});

// Remove attendee
async function removeAttendee(id) {
    const response = await fetch(`/attendees/${id}`, {
        method: "DELETE"
    });

    if (response.ok) {
        loadAttendees();
    } else {
        alert("Attendee not found!");
    }
}

// Initial loading
loadAttendees();
