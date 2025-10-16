from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def calculate_bmi(weight, height):
    # Convert height to meters
    height_m = height / 100
    bmi = weight / (height_m * height_m)
    
    # Determine BMI category
    if bmi < 18.5:
        category = "Underweight"
        color = "#AEC6CF"  # Baby Blue
    elif 18.5 <= bmi < 24.9:
        category = "Normal"
        color = "#B6E6BD"  # Mint Green
    elif 25 <= bmi < 29.9:
        category = "Overweight"
        color = "#FFB7B2"  # Soft Coral
    else:
        category = "Obese"
        color = "#FFCCF9"  # Light Pink
    
    return round(bmi, 2), category, color

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/calculate", methods=["POST"])
def calculate():
    data = request.get_json()
    weight = float(data["weight"])
    height = float(data["height"])
    
    bmi, category, color = calculate_bmi(weight, height)
    
    return jsonify({
        "bmi": bmi,
        "category": category,
        "color": color
    })

if __name__ == "__main__":
    app.run(debug=True)