let score = 0;
let isSubmitted = false;
const numberOfQuestions = 10;
const multipleChoiceContainer = document.querySelector('.multiple-choice-container');
const multipleChoiceQuestion = multipleChoiceContainer.querySelector('.multiple-choice-question');
const multipleChoicePossibleAnswer = multipleChoiceContainer.querySelector('.multiple-choice-possible-answer');
const multipleChoiceAnswer = multipleChoiceContainer.querySelector('.multiple-choice-answer');
const multipleChoiceSubmitButton = document.querySelector('.multiple-choice-submit-button');

function getRandomObject(dataArr) {
    const index = Math.floor(Math.random() * dataArr.length);
    return dataArr[index];
}

// An array of object
async function getData() {
    try {
        let response = await fetch('/data/choice.json');
        let data = await response.json();
        return data;
    } catch (err) {
        console.error('Error:', err)
    }
}

async function displayQuestionAndPossibleAnswer() {
    let multipleData = await getData();
    let randomObject = getRandomObject(multipleData);;

    multipleChoiceQuestion.textContent = randomObject.question;

    for (const key in randomObject.choice) {
        const possibleAnswerP = document.createElement('p');
        possibleAnswerP.textContent = `${key}) ${randomObject.choice[key]}`;
        
        possibleAnswerP.addEventListener('click', function(e) {
            const multipleChoicePossibleAnswerP = multipleChoiceContainer.querySelectorAll('.multiple-choice-possible-answer p');
            
            multipleChoicePossibleAnswerP.forEach(pNode => {
                if (pNode.classList.contains('multiple-choice-possible-answer_active')) {
                    pNode.classList.remove('multiple-choice-possible-answer_active');
                }
            })

            e.target.classList.add('multiple-choice-possible-answer_active');
        });

        multipleChoicePossibleAnswer.appendChild(possibleAnswerP);   
    }
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
        }
        
        isSubmitted = true;
    }
});

displayQuestionAndPossibleAnswer();

// if (location.href.indexOf('/choice') !== -1) {
//     window.addEventListener('beforeunload', function(e) {
//         var confirmationMessage = "\o/";
//         (e || window.event).returnValue = confirmationMessage;
//         return confirmationMessage;
//     });
// }