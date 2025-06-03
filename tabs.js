//tabs
const findPollTabBtn = document.getElementById('accessTabBtn');
const findMakePollTabBtn = document.getElementById('makeTabBtn');
const moreTabBtn = document.getElementById('moreTabBtn');

const findPollTab = document.getElementById('accessTab');
const findMakePollTab = document.getElementById('makeTab');
const moreTab = document.getElementById('moreTab');

findPollTabBtn.addEventListener('click', () => {
     moreTab.style.display = 'none';
     findPollTab.style.display = 'block';
     findMakePollTab.style.display = 'none';
});

findMakePollTabBtn.addEventListener('click', () => {
     moreTab.style.display = 'none';
     findPollTab.style.display = 'none';
     findMakePollTab.style.display = 'block';
});

moreTabBtn.addEventListener('click', () => {
     moreTab.style.display = 'block';
     findPollTab.style.display = 'none';
     findMakePollTab.style.display = 'none';
});

findPollTabBtn.click();

//more tabs

const publicPollsTab = document.getElementById('publicPollsTab');
const helpTab = document.getElementById('helpTab');

const publicPollsTabBtn = document.getElementById('publicPollsTabBtn');
const helpTabBtn = document.getElementById('helpTabBtn');

publicPollsTabBtn.addEventListener('click', () => {
     helpTab.style.display = 'none';
     publicPollsTab.style.display = 'block';
});
helpTabBtn.addEventListener('click', () => {
     publicPollsTab.style.display = 'none';
     helpTab.style.display = 'block';
});

publicPollsTabBtn.click();
