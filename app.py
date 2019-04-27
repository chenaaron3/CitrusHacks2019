from flask import Flask, render_template, url_for, request  

app = Flask(__name__)

@app.route('/', methods=["GET", "POST"])
def index():
    return render_template("index.html")

@app.route('/map', methods=["GET", "POST"])
def map():
    if request.method == "POST":
        for x in request.form.items():
            print(x)
    return render_template("map.html")

if __name__ == "__main__":
    app.run()