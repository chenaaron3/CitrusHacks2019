from flask import Flask, render_template, url_for, request, redirect
import time

app = Flask(__name__)

@app.route('/', methods=["GET", "POST"])
def index():
	if request.method == 'POST':
		email = request.args.get('email')
		id_token = request.args.get('id_token')
		print("hehexd i like pie", email.toString(), id_token.toString())
		return render_template('map.html', email=email, id_token=id_token)
	return render_template("index.html")

@app.route('/map', methods=["GET", "POST"])
def map():
    return render_template("map.html")#, email=request.args.get('email'), id_token=request.args.get('id_token'))

if __name__ == "__main__":
    app.run(debug=True)	