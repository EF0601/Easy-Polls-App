//tabs
const findPollTabBtn = document.getElementById('accessTabBtn');
const findMakePollTabBtn = document.getElementById('makeTabBtn');
const helpTabBtn = document.getElementById('helpTabBtn');

const findPollTab = document.getElementById('accessTab');
const findMakePollTab = document.getElementById('makeTab');
const helpTab = document.getElementById('helpTab');

findPollTabBtn.addEventListener('click', () => {
     helpTab.style.display = 'none';
     findPollTab.style.display = 'block';
     findMakePollTab.style.display = 'none';
});

findMakePollTabBtn.addEventListener('click', () => {
     helpTab.style.display = 'none';
     findPollTab.style.display = 'none';
     findMakePollTab.style.display = 'block';
});

helpTabBtn.addEventListener('click', () => {
     helpTab.style.display = 'block';
     findPollTab.style.display = 'none';
     findMakePollTab.style.display = 'none';
});

findPollTabBtn.click();

//poll finding
const accessCodeError = document.getElementById('accessCodeError');

let pollData = {
     title: '',
     id: '',
     option1: ["", 0],
     option2: ["", 0],
     option3: ["", 0],
     option4: ["", 0],
};

function displayError(message){
     document.getElementById('errorInfo').textContent = message;
     document.getElementById('error').style.display = 'block';
}

document.getElementById('findPollBtn').addEventListener('click', () => {
     const pollId = document.getElementById('accessCode').value.toUpperCase();
     if (pollId) {
          fetch(`https://getdocument-ldhb2q24ra-uc.a.run.app?id=poll_${pollId}`)
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
                         if(data.option3[0] && data.option3[0] != ''){
                              pollData.option3[0] = data.option3[0];
                              pollData.option3[1] = data.option3[1];
                              document.getElementById('option3').style.display = 'block';
                              document.getElementById('option3Results').style.display = 'block';
                         }
                         else{
                              pollData.option3[0] = '';
                              pollData.option3[1] = 0;
                              document.getElementById('option3').style.display = 'none';
                              document.getElementById('option3Results').style.display = 'none';
                         }
                         if(data.option4[0] && data.option4[0] != ''){
                              pollData.option4[0] = data.option4[0];
                              pollData.option4[1] = data.option4[1];
                              document.getElementById('option4').style.display = 'block';
                              document.getElementById('option4Results').style.display = 'block';
                         }
                         else{
                              pollData.option4[0] = '';
                              pollData.option4[1] = 0;
                              document.getElementById('option4').style.display = 'none';
                              document.getElementById('option4Results').style.display = 'none';
                         }
                         pollData.option1[1] = data.option1[1];
                         pollData.option2[1] = data.option2[1];
                         pollData.id = pollId;

                         document.getElementById('pollTitle').textContent = pollData.title;
                         document.getElementById('option1').textContent = pollData.option1[0];
                         document.getElementById('option2').textContent = pollData.option2[0];
                         document.getElementById('option3').textContent = pollData.option3[0];
                         document.getElementById('option4').textContent = pollData.option4[0];

                         Array.from(document.getElementsByClassName('pollIdDisplay')).forEach(element => {
                              element.textContent = pollData.id;
                         });
                    } else {
                         accessCodeError.textContent = 'Poll not found';
                    }
               })
               .catch(err => {
                    switch (err.message) {
                         case '404':
                              displayError('404: Poll not found. Does the access code match?');
                              break;
                         case '403':
                              displayError('403: Access denied. Are you using an unauthorized client?');
                              break;
                         case '500':
                              displayError('500: An internal server error occurred. Nothing can be done on your end.');
                              break;
                         case '400':
                              displayError('400: Bad request; error occurred');
                              break;
                         default:
                              displayError(`${err.message}: An error occurred`);
                              break;
                    }
               });
     }
});

function vote(num){
     document.getElementById('resultsTab').style.display = 'block';
     document.getElementById('option1').disabled = true;
     document.getElementById('option2').disabled = true;
     document.getElementById('option3').disabled = true;
     document.getElementById('option4').disabled = true;
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
          displayError(err);
     });
     const totalVotes = pollData.option1[1] + pollData.option2[1] + pollData.option3[1] + pollData.option4[1];

     document.getElementById('option1Results').textContent = `${pollData.option1[1]} votes`;
     document.getElementById('option2Results').textContent = `${pollData.option2[1]} votes`;
     document.getElementById('option3Results').textContent = `${pollData.option3[1]} votes`;
     document.getElementById('option4Results').textContent = `${pollData.option4[1]} votes`;

     document.getElementById('option1Results').style.width = `${pollData.option1[1] / totalVotes * 100}%`;
     document.getElementById('option2Results').style.width = `${pollData.option2[1] / totalVotes * 100}%`;
     document.getElementById('option3Results').style.width = `${pollData.option3[1] / totalVotes * 100}%`;
     document.getElementById('option4Results').style.width = `${pollData.option4[1] / totalVotes * 100}%`;
}

function generateID(){
     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
     let id = '';
     for(let i = 0; i < 6; i++){
          id += chars.charAt(Math.floor(Math.random() * chars.length));
     }
     return id;
}

function makePoll(){
     if(document.getElementById('option1Input').value != "" && document.getElementById('option2Input').value != "" && document.getElementById('question').value != ""){
          const pollData = {
               title: document.getElementById('question').value,
               id: generateID(),
               option1: [document.getElementById('option1Input').value, 0],
               option2: [document.getElementById('option2Input').value, 0],
               option3: [document.getElementById('option3Input').value, 0],
               option4: [document.getElementById('option4Input').value, 0]
          };
          if(document.getElementById('option3Input').value){
               pollData.option3[0] = document.getElementById('option3Input').value;
          }
          if(document.getElementById('option4Input').value){
               pollData.option4[0] = document.getElementById('option4Input').value;
          }
          fetch(`https://adddocument-ldhb2q24ra-uc.a.run.app?id=poll_${pollData.id}`, {
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
               displayError(err);
          });
          document.getElementById('shareLink').value = `Vote for my poll on https://ef0601.github.io/Easy-Polls-App, with ID ${pollData.id}`;
          document.getElementById('shareTab').style.display = 'block';
     }
}

const shareLink = document.getElementById('shareLink');
shareLink.addEventListener('click', () => {
     const oldText = shareLink.value;
     navigator.clipboard.writeText(shareLink.value);
     shareLink.value = 'Copied to clipboard!';
     setTimeout(() => {
          shareLink.value = oldText;
     }, 2000);
});

function resetVoting(){
     document.getElementById('voteTab').style.display = 'none';
     document.getElementById('accessCode').disabled = false;
     document.getElementById('accessCode').value = '';
     document.getElementById('option1').disabled = false;
     document.getElementById('option2').disabled = false;
     document.getElementById('option3').disabled = false;
     document.getElementById('option4').disabled = false;
     document.getElementById('resultsTab').style.display = 'none';
     document.getElementById('option1Results').style.width = '0%';
     document.getElementById('option2Results').style.width = '0%';
     document.getElementById('option3Results').style.width = '0%';
     document.getElementById('option4Results').style.width = '0%';
     document.getElementById('option1Results').textContent = '';
     document.getElementById('option2Results').textContent = '';
     document.getElementById('option3Results').textContent = '';
     document.getElementById('option4Results').textContent = '';
     document.getElementById('pollTitle').textContent = '';
     document.getElementById('option1').textContent = '';
     document.getElementById('option2').textContent = '';
     document.getElementById('option3').textContent = '';
     document.getElementById('option4').textContent = '';

     pollData = {
          title: '',
          id: '',
          option1: ["", 0],
          option2: ["", 0],
          option3: ["", 0],
          option4: ["", 0],
     };
}

function resetMake(){
     document.getElementById('question').value = '';
     document.getElementById('option1Input').value = '';
     document.getElementById('option2Input').value = '';
     document.getElementById('option3Input').value = '';
     document.getElementById('option4Input').value = '';
     document.getElementById('shareLink').value = '';
     document.getElementById('shareTab').style.display = 'none';
}

function reportPoll() {
     const pollId = document.getElementById('accessCode').value.toUpperCase();
     const reason = document.getElementById('reportPollText').value;

     const data = {
          message: reason,
     };

     fetch(`https://reportpoll-ldhb2q24ra-uc.a.run.app?id=${pollId}`,{
          method: 'POST',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
     })
     .then(response => {
          if (!response.ok) {
               throw new Error(response.status);
          }
          else{
               document.getElementById('reportPollText').value = 'Successfully reported poll. Thank you for your feedback!';
               setTimeout(() => {
                    document.getElementById('reportPollText').value = '';
                    document.getElementById('reportPoll').style.display = 'none';
               }
               , 2000);
          }
     })
     .catch(err => {
          displayError(err);
     });

}
