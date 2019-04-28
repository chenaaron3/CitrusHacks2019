from flask import Flask, render_template, url_for, request, redirect

app = Flask(__name__)

@app.route('/', methods=["GET", "POST"])
def index():
	if request.method == 'POST':
		userp = request.data.user
		app.logger.info('testing info log')
		return redirect(url_for('map', googleUser=userp))
	return render_template("index.html")

@app.route('/map', methods=["GET", "POST"])
def map():
    return render_template("map.html", googleUser=request.args.get('user'))

if __name__ == "__main__":
    app.run(debug=True)	