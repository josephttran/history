let submitted = false;
let numberCorrect = 0;
const numberOfMatch = 10;
const matchSubmitButton = document.querySelector('.match-submit');

function getMatchingData() {
    return fetch('data/match.json')
    .then(response => response.json())
    .catch((error) => console.error('Error:', error));
}

// display 10 random statement to match
function displayMatchData(matchingData) {
    const matchingStatement = document.querySelector('.matching-statement');
    const select = document.createElement('select');
    const statementList = [];
    const answerList = [];

    for (let i = 0; i < numberOfMatch; i++)
    {
        let contain = false;

        while (!contain)
        {
            const keys = Object.keys(matchingData);
            let prop = keys[Math.floor(Math.random() * keys.length)];

            if (answerList.indexOf(prop) == -1)
            {
                statementList.push(matchingData[prop]);
                answerList.push(prop);
                contain = true;  
            }
        }
    }

    answerList.forEach(answer => {
        const option = document.createElement('option');
        option.text = answer;
        option.value = answer;
        select.add(option)   
    });

    const ol = document.createElement('ol');
    matchingStatement.appendChild(ol);

    for (let i = 1; i <= numberOfMatch; i++)
    {
        const questionId = `question${i}`;
        const li = document.createElement('li');
        const newSelectNode = select.cloneNode(true);
        const label = document.createElement('label');
        let randomIndex = Math.floor(Math.random() * statementList.length - 1);
        const randomStatement = statementList.splice(randomIndex, 1);
        
        newSelectNode.id = questionId;
        newSelectNode.className = 'matching-statement-choice';
        label.htmlFor = questionId;
        
        label.textContent = randomStatement;
        label.className = 'statement';

        li.appendChild(newSelectNode);
        li.appendChild(label);
        ol.appendChild(li)
    }
}

matchSubmitButton.addEventListener('click', async function() {
    if (!submitted) {
        const data = await getMatchingData();
        const matchingStatementList = document.querySelectorAll('.matching-statement li');
    
        matchingStatementList.forEach (li => {
            const statement = li.querySelector('label');
            const select = li.querySelector('select');
            const selectedAnswer = select.options[select.selectedIndex].value;
    
            if (data[selectedAnswer] === statement.textContent) {
                numberCorrect++;
            }
            else
            {
                const correctAnswer = Object.keys(data).find(key => data[key] === statement.textContent);
                const correctAnswerP = document.createElement('p');
                const correctAnswerTextNode = document.createTextNode(`${correctAnswer}`);
    
                correctAnswerP.appendChild(correctAnswerTextNode);
                correctAnswerP.className = 'correct-answer';
                li.appendChild(correctAnswerP);
            }
        });
    
        const main = document.querySelector('main');
        const resultElement = document.createElement('p');
        const resultText = document.createTextNode(`Your score is ${numberCorrect}/10`);

        resultElement.className = 'result';
        resultElement.appendChild(resultText);
        main.insertBefore(resultElement, matchSubmitButton);

        submitted = true;
    }
});

getMatchingData().then(data => displayMatchData(data));
