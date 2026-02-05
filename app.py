# Utility to require login for dashboard features
from functools import wraps

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('splash'))
        return f(*args, **kwargs)
    return decorated_function
from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Needed for session

# Temporary storage (in real app, use database)
teachers = []
students = []

@app.route('/')
def splash():
    return render_template('splash.html')

@app.route('/role-selection')
def role_selection():
    return render_template('role_selection.html')

@app.route('/teacher-register', methods=['GET', 'POST'])
def teacher_register():
    if request.method == 'POST':
        # Get form data
        name = request.form['name']
        qualification = request.form['qualification']
        email = request.form['email']
        phone = request.form['phone']
        password = request.form['password']
        
        # Store teacher data
        teacher_data = {
            'name': name,
            'qualification': qualification,
            'email': email,
            'phone': phone,
            'password': password
        }
        teachers.append(teacher_data)
        # Store user in session
        session['user'] = teacher_data
        session['role'] = 'teacher'
        return redirect(url_for('dashboard'))
    return render_template('teacher_register.html')

@app.route('/teacher-login', methods=['GET', 'POST'])
def teacher_login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        # Check if teacher exists
        for teacher in teachers:
            if teacher['email'] == email and teacher['password'] == password:
                session['user'] = teacher.copy()
                session['role'] = 'teacher'
                return redirect(url_for('dashboard'))
        # Invalid login
        return render_template('teacher_login.html', error='Invalid email or password')
    return render_template('teacher_login.html')

@app.route('/student-register', methods=['GET', 'POST'])
def student_register():
    if request.method == 'POST':
        name = request.form['name']
        student_class = request.form['student_class']
        email = request.form['email']
        phone = request.form['phone']
        password = request.form['password']
        student_data = {
            'name': name,
            'class': student_class,
            'email': email,
            'phone': phone,
            'password': password
        }
        students.append(student_data)
        session['user'] = student_data.copy()
        session['role'] = 'student'
        return redirect(url_for('dashboard'))
    return render_template('student_register.html')

@app.route('/student-login', methods=['GET', 'POST'])
def student_login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        for student in students:
            if student['email'] == email and student['password'] == password:
                session['user'] = student.copy()
                session['role'] = 'student'
                return redirect(url_for('dashboard'))
        # Invalid login
        return render_template('student_login.html', error='Invalid email or password')
    return render_template('student_login.html')


# Dashboard route
# Dashboard route
@app.route('/dashboard')
@login_required
def dashboard():
    user = session.get('user')
    if not user:
        return redirect(url_for('splash'))
    # Always pass 'student_class' for students and 'qualification' for teachers
    user = user.copy()
    if session.get('role') == 'student':
        user['student_class'] = user.get('class', user.get('student_class', ''))
    elif session.get('role') == 'teacher':
        user['qualification'] = user.get('qualification', '')
    return render_template('dashboard.html', user=user)

# All dashboard-linked pages (minimal, just render template)
@app.route('/spidro-chat')
@login_required
def spidro_chat():
    user = session.get('user')
    return render_template('spidro_chat.html', user=user)

@app.route('/market')
@login_required
def market():
    user = session.get('user')
    return render_template('homepage.html', user=user)  # Placeholder, update if you have market.html

@app.route('/community')
@login_required
def community():
    user = session.get('user')
    return render_template('homepage.html', user=user)  # Placeholder, update if you have community.html

@app.route('/todo-list')
@login_required
def todo_list():
    user = session.get('user')
    return render_template('todo_list.html', user=user)

@app.route('/study-tracker')
@login_required
def study_tracker():
    user = session.get('user')
    return render_template('study_tracker.html', user=user)

@app.route('/mind-games')
@login_required
def mind_games():
    user = session.get('user')
    return render_template('mind_games.html', user=user)

@app.route('/nutrition-ai')
@login_required
def nutrition_ai():
    user = session.get('user')
    return render_template('nutrition_ai.html', user=user)

@app.route('/health-agent')
@login_required
def health_agent():
    user = session.get('user')
    return render_template('homepage.html', user=user)  # Placeholder, update if you have health_agent.html

@app.route('/homepage')
def homepage():
    return render_template('homepage.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('splash'))

if __name__ == '__main__':
    app.run(debug=True, port=5000)