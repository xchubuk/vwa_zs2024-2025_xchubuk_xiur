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

def generate_session_token(email):
    """Generate a secure session token."""
    random_uuid = uuid.uuid4().hex
    token = hashlib.sha256(f'{email}{random_uuid}'.encode()).hexdigest()
    return token

def fetch_bicycles():
    """Fetch bicycles with type information from the database."""
    try:
        conn = sqlite3.connect('bicycle_rental.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT b.bicycle_id, b.inventory_number, b.type, b.status, t.name as type_name, t.description 
            FROM bicycles b
            JOIN bicycle_types t ON b.type_id = t.type_id
        ''')
        
        rows = cursor.fetchall()

        if not rows:
            print("No bicycles found in the database.")

        bicycles = []
        for row in rows:
            bicycles.append({
                "bicycle_id": row[0],
                "inventory_number": row[1],
                "type": row[2],
                "status": row[3],
                "type_name": row[4],
                "description": row[5]
            })
        
        conn.close()
        
        return bicycles
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return []
    except Exception as e:
        print(f"Error: {e}")
        return []

@app.route('/api/types', methods=['GET'])
def get_types():
    """API endpoint to get distinct bicycle types."""
    try:
        conn = sqlite3.connect('bicycle_rental.db')
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT type FROM bicycle_types")
        
        types = [row[0] for row in cursor.fetchall()]
        conn.close()
        
        return jsonify(types)
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return jsonify([]), 500

@app.route('/api/bicycles', methods=['GET'])
def get_bicycles():
    """API endpoint to get the list of bicycles."""
    bicycles = fetch_bicycles()
    return jsonify(bicycles)

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
    registration_time = datetime.fromtimestamp(data.get('registrationTime') / 1000).strftime('%Y-%m-%d %H:%M:%S')

    names = name.split()
    first_name = names[0] if len(names) > 0 else ""
    last_name = names[1] if len(names) > 1 else ""
    
    encrypted_email = hashlib.sha256(email.encode()).hexdigest()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        conn = sqlite3.connect('bicycle_rental.db')
        cursor = conn.cursor()

        cursor.execute('INSERT INTO users (first_name, last_name, email, password, registration_date) VALUES (?, ?, ?, ?, ?)',
                       (first_name, last_name, encrypted_email, hashed_password, registration_time))
        
        user_id = cursor.lastrowid

        role_name = "client"
        cursor.execute('SELECT role_id FROM roles WHERE name = ?', (role_name,))
        role = cursor.fetchone()

        if role:
            role_id = role[0]
            start_date = registration_time
            end_date = None
            cursor.execute('INSERT INTO user_roles (user_id, role_id, start_date, end_date) VALUES (?, ?, ?, ?)',
                           (user_id, role_id, start_date, end_date))

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

    conn = sqlite3.connect('bicycle_rental.db')
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
    return render_template('index.html')

@app.route('/logout')
def logout():
    response = make_response(redirect(url_for('entry')))
    response.delete_cookie('session_token')
    return response

if __name__ == '__main__':
    app.run(host=URL, port=PORT, debug=True)