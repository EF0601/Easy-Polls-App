//tabs
const findPollTabBtn = document.getElementById('accessTabBtn');
const findMakePollTabBtn = document.getElementById('makeTabBtn');

const findPollTab = document.getElementById('accessTab');
const findMakePollTab = document.getElementById('makeTab');

findPollTabBtn.addEventListener('click', () => {
     findPollTab.style.display = 'block';
     findMakePollTab.style.display = 'none';
});

findMakePollTabBtn.addEventListener('click', () => {
     findPollTab.style.display = 'none';
     findMakePollTab.style.display = 'block';
});

//poll finding
const accessCodeError = document.getElementById('accessCodeError');

let pollData = {
     title: '',
     id: '',
     option1: ["", 0],
     option2: ["", 0],
     option3: ["", 0],
     option4: ["", 0],
}

document.getElementById('findPollBtn').addEventListener('click', () => {
     const pollId = document.getElementById('accessCode').value.toUpperCase();
     if (pollId) {
          fetch(`https://getdocument-ldhb2q24ra-uc.a.run.app?id=${pollId}`)
               .then(response => {
                    if (!response.ok) {
                         throw new Error(response.status);
                    }
                    return response.json();
               })
               .then(data => {
                    if (data) {
                         document.getElementById('voteTab').style.display = 'block';
                         document.getElementById('accessCode').disabled = true;
                         pollData.title = data.title;
                         pollData.option1[0] = data.option1[0];
                         pollData.option2[0] = data.option2[0];
                         pollData.option3[0] = data.option3[0];
                         pollData.option4[0] = data.option4[0];
                         pollData.option1[1] = data.option1[1];
                         pollData.option2[1] = data.option2[1];
                         pollData.option3[1] = data.option3[1];
                         pollData.option4[1] = data.option4[1];
                         pollData.id = pollId;
                         
                         document.getElementById('pollTitle').textContent = pollData.title;
                         document.getElementById('option1').textContent = pollData.option1[0];
                         document.getElementById('option2').textContent = pollData.option2[0];
                         document.getElementById('option3').textContent = pollData.option3[0];
                         document.getElementById('option4').textContent = pollData.option4[0];
                    } else {
                         accessCodeError.textContent = 'Poll not found';
                    }
               })
               .catch(err => {
                    switch (err.message) {
                         case '404':
                              accessCodeError.textContent = '404: Poll not found. Does the poll ID match?';
                              break;
                         case '403':
                              accessCodeError.textContent = '403: Access denied. Are you using an unauthorized client?';
                              break;
                         case '500':
                              accessCodeError.textContent = '500: An internal server error occurred';
                              break;
                         case '400':
                              accessCodeError.textContent = '400: Bad request; error occurred';
                              break;
                         default:
                              accessCodeError.textContent = `${err.message}: An error occurred`;
                              break;
                    }
               });
     }
});

function vote(num){
     switch(num){
          case 1:
               pollData.option1[1]++;
               break;
          case 2:
               pollData.option2[1]++;
               break;
          case 3:
               pollData.option3[1]++;
               break;
          case 4:
               pollData.option4[1]++;
               break;
     }
     fetch(`https://updatedocument-ldhb2q24ra-uc.a.run.app?id=poll_${pollData.id}`, {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(pollData)
     })
     .then(response => {
          if (!response.ok) {
               throw new Error(response.status);
          }
     })
     .catch(err => {
          console.error(err);
     });
     
}
