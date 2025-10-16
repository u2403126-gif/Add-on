from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__)

# Store tasks in memory (you can replace this with a database in production)
tasks = []

@app.route("/")
def home():
    return render_template("index.html", tasks=tasks)

@app.route("/add", methods=["POST"])
def add_task():
    data = request.get_json()
    task = {
        "id": len(tasks) + 1,
        "title": data["title"],
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "completed": False
    }
    tasks.append(task)
    return jsonify(task)

@app.route("/toggle/<int:task_id>", methods=["POST"])
def toggle_task(task_id):
    task = next((task for task in tasks if task["id"] == task_id), None)
    if task:
        task["completed"] = not task["completed"]
        return jsonify({"success": True})
    return jsonify({"success": False}), 404

@app.route("/delete/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task["id"] != task_id]
    return jsonify({"success": True})

if __name__ == "__main__":
    app.run(debug=True)