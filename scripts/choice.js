let score = 0;
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

displayQuestionAndPossibleAnswer();
