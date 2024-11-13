from flask import Flask, render_template, request, jsonify, redirect, url_for, make_response
from flask_wtf import CSRFProtect
import bcrypt
import hashlib
import sqlite3
import uuid
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')
URL = os.getenv("URL")
PORT = os.getenv("PORT")

app = Flask(__name__)
app.secret_key = SECRET_KEY
csrf = CSRFProtect(app)

def init_db():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            registrationTime TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

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
    registration_time = data.get('registrationTime')
    role = data.get('role')

    encrypted_email = hashlib.sha256(email.encode()).hexdigest()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (name, email, password, registrationTime) VALUES (?, ?, ?)',
                       (name, encrypted_email, hashed_password, registration_time))
        conn.commit()
        conn.close()
    except sqlite3.IntegrityError:
        return jsonify({"message": "Email is already registered"}), 400

    session_token = generate_session_token(email)
    response = make_response(jsonify({"message": "Registration successful", "redirect_url": url_for('index'), "success": True}))

    expires_at = datetime.utcnow() + timedelta(hours=24)
    response.set_cookie('session_token', session_token, httponly=True, secure=True, samesite='Strict', expires=expires_at)
    return response

@app.route('/login', methods=['POST'])
@csrf.exempt
def handle_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    encrypted_email = hashlib.sha256(email.encode()).hexdigest()

    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('SELECT password FROM users WHERE email = ?', (encrypted_email,))
    row = cursor.fetchone()
    conn.close()

    if row and bcrypt.checkpw(password.encode('utf-8'), row[0]):
        session_token = generate_session_token(email)
        response = make_response(jsonify({"message": "Login successful", "redirect_url": url_for('index'), "success": True}))

        expires_at = datetime.utcnow() + timedelta(hours=24)
        response.set_cookie('session_token', session_token, httponly=True, secure=True, samesite='Strict', expires=expires_at)
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
    app.run(host=URL, port=PORT, debug=True)