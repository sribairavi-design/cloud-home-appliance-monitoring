
const grid = document.getElementById("appliance-grid");
const message = document.getElementById("message");

const icons = {
    "Light": "💡",
    "Fan": "🌀",
    "Air Conditioner": "❄️",
    "Television": "📺"
};

async function loadDashboard() {
    message.textContent = "";

    try {
        const response = await fetch("/api/appliances");

        if (!response.ok) {
            throw new Error("Could not load appliances");
        }

        const appliances = await response.json();
        renderAppliances(appliances);
        await loadSummary();
    } catch (error) {
        message.textContent =
            "Unable to load dashboard. Check that Flask is running.";
        grid.innerHTML = "";
    }
}

function renderAppliances(appliances) {
    grid.innerHTML = "";

    appliances.forEach(device => {
        const isOn = device.is_on === 1;
        const card = document.createElement("article");

        card.className = "appliance-card";

        card.innerHTML = `
            <div class="device-top">
                <div class="device-icon">
                    ${icons[device.name] || "🔌"}
                </div>
                <div>
                    <h3>${device.name}</h3>
                    <p>${device.room}</p>
                </div>
                <span class="state ${isOn ? "on" : ""}">
                    ${isOn ? "● ONLINE" : "○ OFF"}
                </span>
            </div>

            <div class="device-info">
                <div>
                    Rated power
                    <strong>${device.power} W</strong>
                </div>
                <div>
                    Sample temperature
                    <strong>${device.temperature}°C</strong>
                </div>
            </div>

            <div class="device-bottom">
                <span>
                    ${isOn ? "Appliance is running" : "Appliance is off"}
                </span>
                <button
                    class="toggle ${isOn ? "is-on" : ""}"
                    data-id="${device.id}"
                    data-state="${isOn ? 1 : 0}">
                    ${isOn ? "Turn OFF" : "Turn ON"}
                </button>
            </div>
        `;

        grid.appendChild(card);
    });
}

async function loadSummary() {
    const response = await fetch("/api/summary");

    if (!response.ok) {
        throw new Error("Could not load summary");
    }

    const summary = await response.json();

    document.getElementById("total-count").textContent =
        summary.total_appliances;

    document.getElementById("active-count").textContent =
        summary.active_appliances;

    document.getElementById("power-count").textContent =
        summary.total_power + " W";
}

grid.addEventListener("click", async event => {
    const button = event.target.closest(".toggle");

    if (!button) return;

    button.disabled = true;
    message.textContent = "";

    try {
        const response = await fetch(
            `/api/appliances/${button.dataset.id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    is_on: button.dataset.state !== "1"
                })
            }
        );

        if (!response.ok) {
            throw new Error("Could not update appliance");
        }

        await loadDashboard();
    } catch (error) {
        message.textContent =
            "Could not update appliance. Please try again.";
        button.disabled = false;
    }
});

document.getElementById("refresh-button")
    .addEventListener("click", loadDashboard);

loadDashboard();
