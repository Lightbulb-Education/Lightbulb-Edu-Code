from flask import Flask, render_template, request
from flask_bootstrap import Bootstrap

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

@app.errorhandler(404)
def not_found(e):
  return render_template("404.html"), 404

app.run(host='0.0.0.0', port=8080, debug=True)