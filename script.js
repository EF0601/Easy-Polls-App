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

document.getElementById('findPollBtn').addEventListener('click', () => {
     const pollId = document.getElementById('accessCode').value;
     if (pollId) {
          fetch(`https://getdocument-ldhb2q24ra-uc.a.run.app?id=${pollId}`)
               .then(response => response.json())
               .then(data => {
                    if (data) {
                         // document.getElementById('pollTitle').innerText = data.title;
                         // document.getElementById('pollDescription').innerText = data.description;
                         // document.getElementById('pollOptions').innerHTML = '';
                         // data.options.forEach(option => {
                         //      const optionElement = document.createElement('div');
                         //      optionElement.className = 'option';
                         //      optionElement.innerHTML = `
                         //           <input type="radio" name="option" value="${option.id}" id="${option.id}">
                         //           <label for="${option.id}">${option.name}</label>
                         //      `;
                         //      document.getElementById('pollOptions').appendChild(optionElement);
                         // });
                         // document.getElementById('pollSubmitBtn').style.display = 'block';
                         console.log(data);
                    } else {
                         // document.getElementById('pollTitle').innerText = 'Poll not found';
                         // document.getElementById('pollDescription').innerText = '';
                         // document.getElementById('pollOptions').innerHTML = '';
                         // document.getElementById('pollSubmitBtn').style.display = 'none';
                    }
               });
     }
});