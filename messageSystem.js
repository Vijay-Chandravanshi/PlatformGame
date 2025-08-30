const text = 'Super jumb Adventure - Apna TOON';
const gameUrl = 'https://apna-toon.blogspot.com/2025/05/super-jumb-adventure.html';
let mobileDevice = false;

let messagePage = document.createElement('div');
messagePage.classList.add('message-page');


let messageBox = document.createElement('div');
messageBox.classList.add('message-box');
messagePage.appendChild(messageBox);

let closeMessage = document.createElement('button');
closeMessage.innerHTML = 'X';
closeMessage.classList.add('close-message');
closeMessage.addEventListener('click',function(){document.body.removeChild(messagePage);});
messageBox.appendChild(closeMessage);
let message = document.createElement('p');
//message.innerHTML = 'Hello';
message.classList.add('message');
messageBox.appendChild(message);

let btnBox = document.createElement('div');
messageBox.classList.add('button-box');
messageBox.appendChild(btnBox);

let figureHome = document.createElement('figure');
btnBox.appendChild(figureHome);
let captionHome = document.createElement('figcaption');
captionHome.textContent = 'Home';
figureHome.appendChild(captionHome);
let figureReload = document.createElement('figure');
let captionReload = document.createElement('figcaption');
captionReload.textContent = 'Reload';
figureReload.appendChild(captionReload);
let figureShare = document.createElement('figure');
btnBox.appendChild(figureShare);
let captionShare = document.createElement('figcaption');
captionShare.textContent = 'Share';
figureShare.appendChild(captionShare);
let figureNextLevel = document.createElement('figure');

let captionNextLevel = document.createElement('figcaption');
captionNextLevel.textContent = 'Next Level';
figureNextLevel.appendChild(captionNextLevel);

let homeButton = document.createElement('img');
homeButton.src = './images/homeBtn.png';
homeButton.classList.add('home-Btn');
figureHome.appendChild(homeButton);
homeButton.addEventListener('click',function(){
console.log('home');
window.location.href = 'https://apna-toon.blogspot.com';
});


let reloadButton = document.createElement('img');
reloadButton.src = './images/reloadBtn.png';
reloadButton.classList.add('reload-Btn');
figureReload.appendChild(reloadButton);
reloadButton.addEventListener('click',function(){
console.log('reload');
location.reload();
});

let shareButton = document.createElement('img');
shareButton.src = './images/shareBtn.png';
shareButton.classList.add('share-Btn');
figureShare.appendChild(shareButton);
shareButton.addEventListener('click',function(){
console.log('share');
if(mobileDevice){
navigator.share({
      title: "Super Jump Adventure",
      url: gameUrl
      // You can also add files (images/screenshots) if supported
    })} else {
window.location.href = `https://wa.me/?text=${text}%20${gameUrl}`;
}
});

let nextLevelButton = document.createElement('img');
nextLevelButton.src = './images/nextLevelBtn.png';
nextLevelButton.classList.add('nextLevel-Btn');
figureNextLevel.appendChild(nextLevelButton);
nextLevelButton.addEventListener('click',function(){
console.log('next level');
});


function isMobileDevice() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

  if (isMobileDevice()) {
    //  Mobile share
    console.log('This is Mobile device');
mobileDevice = true;
  } else {
    //  Desktop fallback
    console.log('This is Desktop device');
mobileDevice = false;
  }
