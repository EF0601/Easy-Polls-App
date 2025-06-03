// recognize query parameters
const currentUrl = window.location.href;
const url = new URL(currentUrl);
const queryString = url.search;

// Create a URLSearchParams object to easily access individual parameters
const params = new URLSearchParams(queryString);

// Check if a specific parameter exists
if (params.has('id')) {
     // Get the value of the 'id' parameter
     const pollId = params.get('id').toUpperCase();

     if(pollId.length === 6){
          document.getElementById('accessCode').value = pollId;
          setTimeout(() => {
               document.getElementById('findPollBtn').click();
          }, 50);
     }
}

//poll finding
const accessCodeError = document.getElementById('accessCodeError');

let pollData = {
     title: '',
     id: '',
     option1: ["", 0],
     option2: ["", 0],
     option3: ["", 0],
     option4: ["", 0],
     version: 2,
     publicPoll: false,
};

function displayError(message){
     document.getElementById('errorInfo').textContent = message;
     document.getElementById('error').style.display = 'block';
     document.getElementById('loader1').style.display = 'none';
     document.getElementById('loader2').style.display = 'none';
}

document.getElementById('findPollBtn').addEventListener('click', () => {
     document.getElementById('loader1').style.display = 'block';

     const pollId = document.getElementById('accessCode').value.toUpperCase();
     if (pollId) {
          fetch(`https://getdocument-ldhb2q24ra-uc.a.run.app?id=poll_${pollId}`)
               .then(response => {
                    if (!response.ok) {
                         throw new Error(response.status);
                    }
                    document.getElementById('loader1').style.display = 'none';
                    return response.json();
               })
               .then(data => {
                    document.getElementById('loader1').style.display = 'none';
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
                         pollData.version = data.version;
                         pollData.publicPoll = data.publicPoll;

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
     document.getElementById('loader1').style.display = 'block';

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
          document.getElementById('loader1').style.display = 'none';
          document.getElementById('resultsTab').style.display = 'block';
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
     document.getElementById('loader2').style.display = 'block';
     if(document.getElementById('option1Input').value != "" && document.getElementById('option2Input').value != "" && document.getElementById('question').value != ""){
          const pollData = {
               title: document.getElementById('question').value,
               id: generateID(),
               option1: [document.getElementById('option1Input').value, 0],
               option2: [document.getElementById('option2Input').value, 0],
               option3: [document.getElementById('option3Input').value, 0],
               option4: [document.getElementById('option4Input').value, 0],
               version: 2,
               publicPoll: document.getElementById('allowPublic').checked,
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

               document.getElementById('loader2').style.display = 'none';
               document.getElementById('shareLink').value = `https://ef0601.github.io/Easy-Polls-App?id=${pollData.id}`;
               document.getElementById('shareTab').style.display = 'block';
          })
          .catch(err => {
               console.error(err);
               displayError(err);
          });
     }
}

const shareLink = document.getElementById('shareLink');
shareLink.addEventListener('click', () => {
     const oldText = shareLink.value;
     navigator.clipboard.writeText(oldText);
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
               }, 2000);
          }
     })
     .catch(err => {
          displayError(err);
     });

}

function getPublicPolls(){
     document.getElementById('loader3').style.display = 'block';

     fetch(`https://getpublicpolls-ldhb2q24ra-uc.a.run.app`, {
          method: 'GET',
          headers: {
               'Content-Type': 'application/json'
          }
     })
     .then(response => {
          if (!response.ok) {
               throw new Error(response.status);
          }
          return response.json();
     })
     .then(data => {
          document.getElementById('loader3').style.display = 'none';
          const publicPollsList = document.getElementById('publicPollsList');
          const publicPolls = data.documents || [];
          publicPollsList.innerHTML = ''; // Clear previous list

          if (publicPolls.length === 0) {
               publicPollsList.innerHTML = '<li>No public polls available.</li>';
          } else {
               publicPolls.forEach(poll => {
                    const listItem = document.createElement('tr');
                    listItem.innerHTML = `
                         <td>${poll.data.title}</td>
                         <td>${poll.data.id}</td>
                    `;
                    listItem.addEventListener('click', () => {
                         document.getElementById('accessCode').value = poll.data.id;
                         document.getElementById('findPollBtn').click();

                         document.getElementById('moreTab').style.display = 'none';
                         document.getElementById('accessTab').style.display = 'block';
                         document.getElementById('makeTab').style.display = 'none';
                    });
                    publicPollsList.appendChild(listItem);
               });
          }
     })
     .catch(err => {
          document.getElementById('loader3').style.display = 'none';
          displayError(err);
     });
}

// search public polls table
function searchPublicPolls(){
     const searchInput = document.getElementById('publicPollsSearch').value.toLowerCase();
     const publicPollsList = document.getElementById('publicPollsList');
     const listItems = publicPollsList.getElementsByTagName('tr');

     for (let i = 0; i < listItems.length; i++) {
          const itemText = listItems[i].textContent.toLowerCase();
          if (itemText.includes(searchInput)) {
               listItems[i].style.display = '';
          } else {
               listItems[i].style.display = 'none';
          }
     }
     if (searchInput === '') {
          for (let i = 0; i < listItems.length; i++) {
               listItems[i].style.display = '';
          }
     }
}
