var correctAnswerIndex = 0;
var jobs = [
    "Accountant, Auditor",
    "Advertising, Marketing, Promotions, Public Relations, and Sales Manager",
    "Aircraft Pilot or Flight Engineer",
    "Architect, Surveyor, or Cartographer",
    "Arts, Design, Entertainment, Sports, and Media Occupations",
    "Building and Grounds Cleaning and Maintenance",
    "Business Operations or Financial Specialist",
    "Business Owner",
    "Chef or Head Cook",
    "Chief Executive",
    "Chiropractor",
    "Computer Specialist, Mathematical Science",
    "Construction Manager",
    "Construction and Extraction (e.g., Construction Laborer, Electrician)",
    "Cook or Food Preparation Worker",
    "Counselor, Social Worker, or Other Community and Social Service Specialist",
    "Dentist",
    "Dietitian or Nutritionist",
    "Don't Know",
    "Engineer",
    "Engineering Manager",
    "Farming, Fishing, and Forestry",
    "Financial Clerk",
    "Food and Beverage Serving Worker (e.g., Bartender, Waiter, Waitress)",
    "General and Operations Manager",
    "Health Technologist or Technician",
    "Homemaker",
    "Installation, Maintenance, and Repair",
    "Insurance Sales Agent",
    "Lawyer, Judge",
    "Life Scientist (e.g., Animal, Food, Soil, or Biological Scientist, Zoologist)",
    "Material Recording, Scheduling, and Dispatching Worker",
    "Military",
    "Motor Vehicle Operator (e.g., Ambulance, Bus, Taxi, or Truck Driver)",
    "Not Applicable",
    "Nursing, Psychiatric, or Home Health Aide",
    "Occupational and Physical Therapist Assistant or Aide",
    "Operations Specialties Manager (e.g., IT or HR Manager)",
    "Optometrist",
    "Other Agriculture, Maintenance, Repair, and Skilled Crafts Occupation",
    "Other Architecture and Engineering Occupation",
    "Other Business, Executive, Management, Financial Occupation",
    "Other Education, Training, and Library Occupation",
    "Other Healthcare Practitioners and Technical Occupation",
    "Other Healthcare Support Occupation",
    "Other Occupation",
    "Other Office and Administrative Support Occupation",
    "Other Professional Occupation",
    "Other Services Occupation",
    "Other Teacher or Instructor",
    "Other Transportation Occupation",
    "Personal Care and Service (e.g., Hairdresser, Flight Attendant, Concierge)",
    "Pharmacist",
    "Physical Scientist (e.g., Astronomer, Physicist, Chemist, Hydrologist)",
    "Physician Assistant",
    "Physician",
    "Podiatrist",
    "Postsecondary Teacher (e.g., College Professor)",
    "Primary, Secondary, or Special Education School Teacher",
    "Production Occupations",
    "Protective Service (e.g., Fire Fighting, Police Officer, Correctional Officer)",
    "Real Estate Sales Agent",
    "Registered Nurse",
    "Religious Worker (e.g., Clergy, Director of Religious Activities or Education)",
    "Retail Sales Worker",
    "Sales Representative",
    "Sales Supervisor, Retail Sales",
    "Secretary or Administrative Assistant",
    "Social Scientist and Related Worker",
    "Supervisor of Administrative Support Workers",
    "Therapist",
    "Veterinarian"
];
  
  
function addOptionToSelect(selectId, optionText, optionValue) {
    var selectElement = document.getElementById(selectId); 
    var option = document.createElement("option"); 
    option.text = optionText; 
    option.value = optionValue; 
    selectElement.appendChild(option);
}

jobs.forEach((job,index) => {
    addOptionToSelect("occupation", job, job)

})

document.getElementById('start-quiz-btn').addEventListener('click', function () {
    const occupation = document.getElementById('occupation').value;
    fetchQuiz(occupation);
});

document.getElementById('submit-quiz-btn').addEventListener('click', function () {
    const selectedAnswer = document.querySelector('input[name="quiz"]:checked');
    if (selectedAnswer) {
        checkAnswers(selectedAnswer.value);
    } else {
        showPopup('Please select an answer.');
    }
});

document.getElementById('close-popup').addEventListener('click', function () {
    closePopup();
});

function fetchQuiz(occupation) {
    fetch(`/api/quiz?occupation=${occupation}`)
        .then(response => response.json())
        .then(data => {
            displayQuiz(data);
            document.getElementById('sign-up-form').classList.add('hidden');
            document.getElementById('quiz-container').classList.remove('hidden');
        })
        .catch(error => console.error('Error fetching quiz:', error));
}

function displayQuiz(quiz) {
    const quizContainer = document.getElementById('quiz-questions');
    quizContainer.innerHTML = '';

    const questionElement = document.createElement('div');
    questionElement.classList.add('question');

    const questionText = document.createElement('p');
    questionText.textContent = quiz.question;
    questionElement.appendChild(questionText);

    quiz.answers.forEach((answer, index) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'quiz';
        input.value = index;
        label.appendChild(input);
        label.appendChild(document.createTextNode(answer));
        questionElement.appendChild(label);
    });
    correctAnswerIndex = quiz.correct_answer_index;
    quizContainer.appendChild(questionElement);
}

function checkAnswers(selectedAnswer) {
    if (parseInt(selectedAnswer) === correctAnswerIndex) {
        showPopupNoClose('Correct! You may now proceed');
    } else {
        showPopupNoClose('Incorrect, please do not lie again.');
    }
    redirectToSignUp();
}

function showPopup(message) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    popupMessage.textContent = message;
    popup.classList.remove('hidden');
}

function showPopupNoClose(message) {
    const popup = document.getElementById('popup-noclose');
    const popupMessage = document.getElementById('popup-message-noclose');
    popupMessage.textContent = message;
    popup.classList.remove('hidden');
}

function closePopup() {
    const popup = document.getElementById('popup');
    popup.classList.add('hidden');
}

function redirectToSignUp() {
    setTimeout(function () {
        window.location.href = "/"; 
     }, 2000); 
}
