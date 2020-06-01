from flask import Flask, render_template, request, make_response, send_from_directory
from flask_bootstrap import Bootstrap
from threading import Thread

# Initialize Flask app
app = Flask(__name__)

bootstrap = Bootstrap(app)

@app.route('/')
def index():
  return render_template("home.html")

@app.route('/login', methods=['GET'])
def login():
  return render_template("login.html")

@app.route('/dashboard-base', methods=['GET'])
def dashboard():
  return render_template("dashboard-base.html")

@app.route('/profile', methods=['GET'])
def profile():
  return render_template("profile.html")

@app.route('/dashboard', methods=['GET'])
def sb():
  return render_template("dashboard-main.html")

@app.route('/courses', methods=['GET'])
def courses():
  return render_template("courses.html") 

@app.route('/course', methods=['GET'])
def course():
  return render_template("course.html") 

@app.route('/projects', methods=['GET'])
def projects():
  if request.args.get('id'):
    return render_template("project.html")
  else:
    return render_template("projects.html") 

@app.route('/resources', methods=['GET'])
def resources():
  return render_template("resources.html") 

@app.route('/project', methods=['GET'])
def project():
  if request.args.get('id'):
    return render_template("project.html")
  else:
    return render_template("404.html"), 404

@app.route('/editor', methods=['GET'])
def editor():
  return render_template("editor.html") 

@app.route('/project-overview', methods=['GET'])
def tutorial():
  return render_template("project-overview.html") 

@app.route('/newuser', methods=['GET'])
def new_user():
  return render_template("newuser.html") 

@app.route('/manifest.json')
def manifest():
    return send_from_directory('static', 'manifest.json')
  
@app.route('/sw.js')
def sw():
  response = make_response(send_from_directory('static', 'sw.js'))
  response.headers['Cache-Control'] = 'no-cache'
  return response


@app.errorhandler(404)
def not_found(e):
  return render_template("404.html"), 404


def run():
  app.run(host='0.0.0.0',port=8080)

def keep_alive():  
  t = Thread(target=run)
  t.start()

if __name__ == "__main__":
 # app.run(debug=True, host='0.0.0.0')
 run()