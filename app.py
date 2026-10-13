
from flask import Flask, render_template, jsonify, request
import sqlite3
from pathlib import Path

app = Flask(__name__)
DB_PATH = Path(__file__).parent / "appliances.db"


def get_db():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_db():
    connection = get_db()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS appliances (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            room TEXT NOT NULL,
            power INTEGER NOT NULL,
            temperature INTEGER NOT NULL,
            is_on INTEGER NOT NULL DEFAULT 0
        )
    """)

    count = connection.execute(
        "SELECT COUNT(*) FROM appliances"
    ).fetchone()[0]

    if count == 0:
        sample_appliances = [
            ("Light", "Living Room", 12, 27, 1),
            ("Fan", "Bedroom", 75, 29, 1),
            ("Air Conditioner", "Living Room", 1200, 25, 0),
            ("Television", "Hall", 100, 28, 0),
        ]

        connection.executemany("""
            INSERT INTO appliances
            (name, room, power, temperature, is_on)
            VALUES (?, ?, ?, ?, ?)
        """, sample_appliances)

    connection.commit()
    connection.close()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/appliances", methods=["GET"])
def get_appliances():
    connection = get_db()
    rows = connection.execute(
        "SELECT * FROM appliances ORDER BY id"
    ).fetchall()
    connection.close()

    return jsonify([dict(row) for row in rows])


@app.route("/api/appliances/<int:appliance_id>", methods=["PATCH"])
def update_appliance(appliance_id):
    data = request.get_json(silent=True) or {}
    is_on = data.get("is_on")

    if not isinstance(is_on, bool):
        return jsonify({"error": "is_on must be true or false"}), 400

    connection = get_db()
    cursor = connection.execute(
        "UPDATE appliances SET is_on = ? WHERE id = ?",
        (int(is_on), appliance_id)
    )
    connection.commit()
    connection.close()

    if cursor.rowcount == 0:
        return jsonify({"error": "Appliance not found"}), 404

    return jsonify({
        "message": "Appliance updated",
        "id": appliance_id,
        "is_on": is_on
    })


@app.route("/api/summary", methods=["GET"])
def get_summary():
    connection = get_db()
    summary = connection.execute("""
        SELECT
            COUNT(*) AS total_appliances,
            COALESCE(SUM(is_on), 0) AS active_appliances,
            COALESCE(SUM(power * is_on), 0) AS total_power
        FROM appliances
    """).fetchone()
    connection.close()

    return jsonify(dict(summary))


initialize_db()

if __name__ == "__main__":
    app.run(debug=True)
