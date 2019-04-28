from flask import Flask, render_template, url_for, request, redirect
import time

app = Flask(__name__)

username = None
id = None

@app.route('/', methods=["GET", "POST"])
def index():
    if request.method == 'GET' and len(request.args) > 0:
        email = request.args.get('email')
        id_token = request.args.get('id_token')
        response = redirect(url_for('map', email=email, id_token=id_token))
        data = "{'email':" + email + ", 'id_token':" + id_token + "}"
        print(response)
        return response
    else:
        return render_template("index.html")

@app.route('/map', methods=["GET", "POST"])
def map():
    print("I AM INSIDE MAPPPPPPPPPP")
    print("hi from app", request.args.get('email'), request.args.get('id_token'))
    if request.args.get("email") != None:
        global username, id
        username = request.args.get("email")
        id = request.args.get("id_token")
        print("sending: ", username, id)
        return render_template("map.html", email=request.args.get('email'), id_token=request.args.get('id_token'))


if __name__ == "__main__":
    app.run(debug=True)    
