from flask import Flask, render_template, url_for, request, redirect
import time

app = Flask(__name__)

@app.route('/', methods=["GET", "POST"])
def index():
	if request.method == 'POST':
		userp = request.data.user
		app.logger.info('testing info log')
		time.sleep(10);
		return redirect(url_for('map', googleUser=userp))
	return render_template("index.html")

@app.route('/map', methods=["GET", "POST"])
def map():
    return render_template("map.html", googleUser=request.args.get('user'))

if __name__ == "__main__":
    app.run(debug=True)	