let submitted = false;

function getMatchingData() {
    return fetch('/data/match.json')
    .then(response => response.json())
    .catch((error) => console.error('Error:', error));
}

// display 10 random statement to match
function displayMatchData(matchingData) {
    const matchingStatement = document.querySelector('.matching-statement');
    const select = document.createElement('select');
    const statementList = [];
    const answerList = [];

    for (let i = 0; i < 10; i++)
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

    const ul = document.createElement('ul');
    matchingStatement.appendChild(ul);

    for (let i = 0; i < 10; i++)
    {
        const li = document.createElement('li');
        const p = document.createElement('p');
        const newSelectNode = select.cloneNode(true);
        let randomIndex = Math.floor(Math.random() * statementList.length - 1);
        const randomStatement = statementList.splice(randomIndex, 1);
        const textNode = document.createTextNode(randomStatement);

        li.appendChild(newSelectNode);
        p.appendChild(textNode);
        li.appendChild(p);
        ul.appendChild(li)
    }
}

getMatchingData().then(data => displayMatchData(data));

const matchSubmitButton = document.querySelector('.match-submit');

matchSubmitButton.addEventListener('click', async function() {
    if (!submitted) {
        const data = await getMatchingData();
        const matchingStatementList = document.querySelectorAll('.matching-statement li');
        let numberCorrect = 0;
    
        matchingStatementList.forEach (li => {
            const statement = li.querySelector('p');
            const select = li.querySelector('select');
            const selectedAnswer = select.options[select.selectedIndex].value;
    
            if (data[selectedAnswer] === statement.textContent) {
                numberCorrect++;
            }
            else
            {
                const correctAnswer = Object.keys(data).find(key => data[key] === statement.textContent);
                const correctAnswerP = document.createElement('p');
                const correctAnswerTextNode = document.createTextNode(`The correct answer is ${correctAnswer}`);
    
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