let score = 0;
let isSubmitted = false;
let questionNumber = 1;
const numberOfQuestions = 10;
const progress = document.querySelector('.progress');
const multipleChoiceContainer = document.querySelector('.multiple-choice-container');
const multipleChoiceQuestion = multipleChoiceContainer.querySelector('.multiple-choice-question');
const multipleChoicePossibleAnswer = multipleChoiceContainer.querySelector('.multiple-choice-possible-answer');
const multipleChoiceAnswer = multipleChoiceContainer.querySelector('.multiple-choice-answer');
const multipleChoiceSubmitButton = document.querySelector('.multiple-choice-submit-button');
const nextQuestionButton = document.querySelector('.next-question-button');

let objectPicked = [];
function getRandomObject(dataArr) {
    let index = Math.floor(Math.random() * dataArr.length);

    while (objectPicked.indexOf(index) !== -1) {
        index = Math.floor(Math.random() * dataArr.length);
    }

    objectPicked.push(index);

    return dataArr[index];
}

// An array of object
async function getData() {
    try {
        let response = await fetch('data/choice.json');
        let data = await response.json();
        return data;
    } catch (err) {
        console.error('Error:', err)
    }
}

async function displayQuestionAndPossibleAnswer() {
    displayProgress();

    let multipleData = await getData();
    let randomObject = getRandomObject(multipleData);

    multipleChoiceQuestion.textContent = randomObject.question;

    for (const key in randomObject.choice) {
        const possibleAnswerP = document.createElement('p');
        possibleAnswerP.textContent = `${key}) ${randomObject.choice[key]}`;
        
        possibleAnswerP.addEventListener('click', function(e) {
            if (!isSubmitted) {
                const multipleChoicePossibleAnswerP = multipleChoiceContainer.querySelectorAll('.multiple-choice-possible-answer p');
                
                multipleChoicePossibleAnswerP.forEach(pNode => {
                    if (pNode.classList.contains('multiple-choice-possible-answer_active')) {
                        pNode.classList.remove('multiple-choice-possible-answer_active');
                    }
                })

                e.target.classList.add('multiple-choice-possible-answer_active');                
            }
        });

        multipleChoicePossibleAnswer.appendChild(possibleAnswerP);   
    }
}

function displayProgress() {
    progress.textContent = `Question ${questionNumber} of ${numberOfQuestions}`;
}

multipleChoiceSubmitButton.addEventListener('click', async function() {
    if (!isSubmitted) {
        let multipleData = await getData();
        const multipleChoiceQuestion = multipleChoiceContainer.querySelector('.multiple-choice-question');
        const selectedAnswerNode = multipleChoiceContainer.querySelector('.multiple-choice-possible-answer p.multiple-choice-possible-answer_active');

        if (selectedAnswerNode === null) {
            alert("Please select an answer");
        } else {
            const selectedAnswer = selectedAnswerNode.textContent.slice(3);
            const obj = multipleData.find(obj => obj.question == multipleChoiceQuestion.textContent);

            multipleChoiceAnswer.textContent = 'The answer is ' + obj.answer;
            multipleChoiceAnswer.style.display = 'block';

            if (selectedAnswer === obj.answer) {
                score++;
                multipleChoiceAnswer.style.color = 'blue';
            } else {
                multipleChoiceAnswer.style.color = 'darkred';
            }

            isSubmitted = true;

            if (questionNumber === numberOfQuestions) {
                const main = document.querySelector('main');
                const result = document.createElement('p');

                result.textContent = `Your total score is ${(score/numberOfQuestions).toFixed(2) * 100}%`;
                result.className = 'choice-result';
                main.insertBefore(result, multipleChoiceSubmitButton);
            } else {
                nextQuestionButton.style.display = 'block';
            }

            questionNumber++;
        }
    }
});

nextQuestionButton.addEventListener('click', function(e) {
    if (isSubmitted) {
        const multipleChoicePossibleAnswer = multipleChoiceContainer.querySelector('.multiple-choice-possible-answer');
        
        e.target.style.display = 'none';
        multipleChoiceAnswer.style.display = 'none';
        
        while (multipleChoicePossibleAnswer.firstChild) {
            multipleChoicePossibleAnswer.removeChild(multipleChoicePossibleAnswer.firstChild);
        }
        
        isSubmitted = false;
        displayQuestionAndPossibleAnswer();
    }
})

displayQuestionAndPossibleAnswer();

if (location.href.indexOf('/choice') !== -1) {
    window.addEventListener('beforeunload', function(e) {
        if (questionNumber <= numberOfQuestions) {
            var confirmationMessage = "\o/";
            (e || window.event).returnValue = confirmationMessage;
            return confirmationMessage;
        }
    });
}