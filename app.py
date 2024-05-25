from flask import Flask, request, jsonify, render_template, send_from_directory
import requests
import ollama


app = Flask(__name__)

jobs = [
  "Chiropractor",
  "Dentist",
  "Dietitian or Nutritionist",
  "Optometrist",
  "Pharmacist",
  "Physician",
  "Physician Assistant",
  "Podiatrist",
  "Registered Nurse",
  "Therapist",
  "Veterinarian",
  "Health Technologist or Technician",
  "Other Healthcare Practitioners and Technical Occupation",
  "Nursing, Psychiatric, or Home Health Aide",
  "Occupational and Physical Therapist Assistant or Aide",
  "Other Healthcare Support Occupation",
  "Chief Executive",
  "General and Operations Manager",
  "Advertising, Marketing, Promotions, Public Relations, and Sales Manager",
  "Operations Specialties Manager (e.g., IT or HR Manager)",
  "Construction Manager",
  "Engineering Manager",
  "Accountant, Auditor",
  "Business Operations or Financial Specialist",
  "Business Owner",
  "Other Business, Executive, Management, Financial Occupation",
  "Architect, Surveyor, or Cartographer",
  "Engineer",
  "Other Architecture and Engineering Occupation",
  "Postsecondary Teacher (e.g., College Professor)",
  "Primary, Secondary, or Special Education School Teacher",
  "Other Teacher or Instructor",
  "Other Education, Training, and Library Occupation",
  "Arts, Design, Entertainment, Sports, and Media Occupations",
  "Computer Specialist, Mathematical Science",
  "Counselor, Social Worker, or Other Community and Social Service Specialist",
  "Lawyer, Judge",
  "Life Scientist (e.g., Animal, Food, Soil, or Biological Scientist, Zoologist)",
  "Physical Scientist (e.g., Astronomer, Physicist, Chemist, Hydrologist)",
  "Religious Worker (e.g., Clergy, Director of Religious Activities or Education)",
  "Social Scientist and Related Worker",
  "Other Professional Occupation",
  "Supervisor of Administrative Support Workers",
  "Financial Clerk",
  "Secretary or Administrative Assistant",
  "Material Recording, Scheduling, and Dispatching Worker",
  "Other Office and Administrative Support Occupation",
  "Protective Service (e.g., Fire Fighting, Police Officer, Correctional Officer)",
  "Chef or Head Cook",
  "Cook or Food Preparation Worker",
  "Food and Beverage Serving Worker (e.g., Bartender, Waiter, Waitress)",
  "Building and Grounds Cleaning and Maintenance",
  "Personal Care and Service (e.g., Hairdresser, Flight Attendant, Concierge)",
  "Sales Supervisor, Retail Sales",
  "Retail Sales Worker",
  "Insurance Sales Agent",
  "Sales Representative",
  "Real Estate Sales Agent",
  "Other Services Occupation",
  "Construction and Extraction (e.g., Construction Laborer, Electrician)",
  "Farming, Fishing, and Forestry",
  "Installation, Maintenance, and Repair",
  "Production Occupations",
  "Other Agriculture, Maintenance, Repair, and Skilled Crafts Occupation",
  "Aircraft Pilot or Flight Engineer",
  "Motor Vehicle Operator (e.g., Ambulance, Bus, Taxi, or Truck Driver)",
  "Other Transportation Occupation",
  "Military",
  "Homemaker",
  "Other Occupation",
  "Don't Know",
  "Not Applicable"
]


def generate(occupation):
    prompt = f"Generate a single question for the occupation: {occupation}. Provide the question in the first line and multiple choice answers with one answer per line, and the correct answer should be prefixed with a - with no leading space. Do not indicate the correct answer in any other way. Do not prefix answers with letters or numbers. Determine the correct answer based on actual objective facts instead of morality or subjectivity. Do not make the questions too generic, make them specialized for that certain kind of work. Do not write any disclaimers or notes. Make sure the wrong answers are funny, silly but obviously wrong. Ask unique questions, not just 'main purposes' 'primary method' 'typical' and such. The answers should be formatted similarly, so if one answer is a number the rest shouldnt be sentences."

    response = ollama.chat(model='llama3', messages=[
    {
        "role": "system", 
        "content": "Do not write any disclaimers or notes."
        },
    {
        'role': 'user',
        'content': prompt,
    },
    ])

    quiz_string = response["message"]["content"]
    quiz_lines = quiz_string.splitlines()
    question = quiz_lines[0]
    answers = []
    correct_answer = None
    for line in quiz_lines[1:]:
        if line.startswith("-"):
            correct_answer = line[1:].strip()
            answers.append(line[1:].strip())
            continue
        if line == '':
            continue
        if "note" in line.lower():
            continue
        if "disclaimer" in line.lower():
            continue
        answers.append(line.strip())

    if not correct_answer:
        generate(occupation)
        
    return question, answers, correct_answer


@app.route('/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/api/quiz', methods=['GET'])
def get_quiz():
    occupation = request.args.get('occupation')
    if not occupation:
        return jsonify({'error': 'Occupation is required'}), 400
    if occupation not in jobs:
        return jsonify[{"error": "Invalid occupation"}], 400
    question, answers, correct_answer = generate(occupation)
    try:
        quiz_data = {"question": question, "answers": answers, "correct_answer_index": answers.index(correct_answer)}
    except: 
        quiz_data = {"question": question, "answers": answers, "correct_answer_index": 0}
    return jsonify(quiz_data)

@app.route('/')
def main_page():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
