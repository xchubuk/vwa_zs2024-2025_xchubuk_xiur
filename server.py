from flask import Flask, render_template, request, jsonify, redirect, url_for, make_response, session
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

def fetch_user_role_from_db():
    """Fetch the user's role based on the session token from cookies."""
    session_token = request.cookies.get('session_token')
    if not session_token:
        return None

    conn = sqlite3.connect('bicycle_rental.db')
    cursor = conn.cursor()
    cursor.execute('''
        SELECT roles.name FROM users
        JOIN user_roles ON users.user_id = user_roles.user_id
        JOIN roles ON user_roles.role_id = roles.role_id
        WHERE users.session_token = ?
    ''', (session_token,))
    role = cursor.fetchone()
    conn.close()
    
    return role[0] if role else None

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
        

def fetch_user_role_from_db():
    """Fetch the user's role if the session token is valid and not expired."""
    session_token = session.get('session_token')
    if not session_token:
        return None

    conn = sqlite3.connect('bicycle_rental.db')
    cursor = conn.cursor()
    cursor.execute('''
        SELECT roles.name FROM users
        JOIN user_roles ON users.user_id = user_roles.user_id
        JOIN roles ON user_roles.role_id = roles.role_id
        WHERE users.session_token = ? AND users.session_expiration > ?
    ''', (session_token, datetime.utcnow()))
    role = cursor.fetchone()
    conn.close()
    
    return role[0] if role else None


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

@app.route('/client_dashboard')
def client_dashboard():
    role = fetch_user_role_from_db()
    if role != 'client':
        return "Forbidden", 403
    return render_template('client_dashboard.html')

@app.route('/manager_dashboard')
def manager_dashboard():
    role = fetch_user_role_from_db()
    if role != 'manager':
        return "Forbidden", 403
    return render_template('manager_dashboard.html')

@app.route('/admin_dashboard')
def admin_dashboard():
    role = fetch_user_role_from_db()
    if role != 'admin':
        return "Forbidden", 403
    return render_template('admin_dashboard.html')

@app.route('/')
def entry():
    if request.cookies.get('session_token'):
        return redirect(url_for('index'))
    return render_template('login.html')

@app.route('/api/get_user_role')
def get_user_role():
    role = fetch_user_role_from_db()
    if role:
        return jsonify({"role": role})
    return jsonify({"error": "Role not found"}), 401

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

        # Insert the new user into the database
        cursor.execute('INSERT INTO users (first_name, last_name, email, password, registration_date) VALUES (?, ?, ?, ?, ?)',
                       (first_name, last_name, encrypted_email, hashed_password, registration_time))
        
        user_id = cursor.lastrowid

        # Generate a session token and expiration time
        session_token = generate_session_token(email)
        session_expiration = datetime.utcnow() + timedelta(hours=24)

        # Update the user with the session token and expiration
        cursor.execute('UPDATE users SET session_token = ?, session_expiration = ? WHERE user_id = ?',
                       (session_token, session_expiration, user_id))

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

    session['session_token'] = session_token

    response = make_response(jsonify({"message": "Registration successful", "redirect_url": url_for('index'), "success": True}))
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
    cursor.execute('SELECT user_id, password FROM users WHERE email = ?', (encrypted_email,))
    row = cursor.fetchone()

    if row and bcrypt.checkpw(password.encode('utf-8'), row[1]):
        user_id = row[0]
        session_token = generate_session_token(email)
        session_expiration = datetime.utcnow() + timedelta(hours=24)

        # Update the session token and expiration time in the database
        cursor.execute('UPDATE users SET session_token = ?, session_expiration = ? WHERE user_id = ?',
                       (session_token, session_expiration, user_id))
        conn.commit()
        conn.close()

        # Store the session token in the session
        session['session_token'] = session_token

        response = make_response(jsonify({"message": "Login successful", "redirect_url": url_for('index'), "success": True}))
        return response
    else:
        conn.close()
        return jsonify({"message": "Invalid credentials"}), 401
    
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/logout')
def logout():
    session.clear()  # Clears session data
    response = make_response(redirect(url_for('entry')))
    response.delete_cookie('session_token')  # Deletes the session_token cookie
    return response

if __name__ == '__main__':
    app.run(host=URL, port=PORT, debug=True)