from flask import Flask, render_template, request, jsonify, redirect, url_for, make_response
from flask_wtf import CSRFProtect
import bcrypt
import uuid
import hashlib

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'
csrf = CSRFProtect(app)

# Mock database of users (replace this with an actual database in production)
users = {}

def generate_session_token(email):
    """Generate a secure session token."""
    random_uuid = uuid.uuid4().hex
    token = hashlib.sha256(f'{email}{random_uuid}'.encode()).hexdigest()
    return token

@app.route('/')
def entry():
    if request.cookies.get('session_token'):
        return redirect(url_for('index'))
    return render_template('login.html')

@app.route('/register', methods=['POST'])
@csrf.exempt
def handle_register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # Check if the email is already registered
    if email in users:
        return jsonify({"message": "Email is already registered"}), 400

    # Hash the password before storing it
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Register the user with hashed password
    users[email] = {'name': name, 'password': hashed_password}
    session_token = generate_session_token(email)
    response = make_response(jsonify({"message": "Registration successful", "redirect_url": url_for('index'), "success": True }))
    response.set_cookie('session_token', session_token, httponly=True, secure=True, samesite='Strict')
    return response

@app.route('/login', methods=['POST'])
@csrf.exempt
def handle_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = users.get(email)
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        session_token = generate_session_token(email)
        response = make_response(jsonify({"message": "Login successful", "redirect_url": url_for('index'), "success": True }))
        response.set_cookie('session_token', session_token, httponly=True, secure=True, samesite='Strict')
        return response
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route('/index')
def index():
    return "Welcome to the Index Page!"

@app.route('/logout')
def logout():
    response = make_response(redirect(url_for('entry')))
    response.delete_cookie('session_token')
    return response

if __name__ == '__main__':
    app.run(host='localhost', port=8192, debug=True)