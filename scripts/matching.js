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
        const newSelectNode = select.cloneNode(true);
        let randomIndex = Math.floor(Math.random() * statementList.length - 1);
        const randomStatement = statementList.splice(randomIndex, 1);
        const textNode = document.createTextNode(randomStatement);

        li.appendChild(newSelectNode);
        li.appendChild(textNode);
        ul.appendChild(li)
    }
}

getMatchingData().then(data => displayMatchData(data));