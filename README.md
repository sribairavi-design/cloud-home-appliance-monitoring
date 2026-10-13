# Cloud-Based Home Appliance Monitoring System

## About the Project
The Cloud-Based Home Appliance Monitoring System is a web-based project that provides a dashboard to monitor and control home appliances. Users can view appliance status, estimated power consumption, and sample temperature readings.

This project uses a local simulation to demonstrate how an appliance monitoring dashboard can work.

## Features
- View home appliances on a dashboard
- Turn appliances ON or OFF
- View appliance status
- Display estimated power consumption
- Display sample temperature readings
- Store appliance information using SQLite

## Technologies Used
- Python
- Flask
- HTML
- CSS
- JavaScript
- SQLite

## Project Structure
```text
cloud-home-appliance-monitoring/
├── app.py
├── requirements.txt
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
```

## How to Run Locally
1. Install Python.
2. Open a terminal in the project folder.
3. Install the dependencies:

   `pip install -r requirements.txt`

4. Start the application:

   `python app.py`

5. Open `http://127.0.0.1:5000` in your browser.

## Note
This is a local simulation. It does not connect to real appliances or cloud-based IoT hardware.
