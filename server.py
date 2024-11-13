from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

@app.route('/')
def entry():
    return render_template('login.html')

@app.route('/register', methods=['POST'])
def handle_reg():
    data = request.get_json()
    print(data)

if __name__ == '__main__':
    app.run(host='localhost', 
            port=8192, 
            debug=True)