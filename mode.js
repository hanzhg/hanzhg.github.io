const button=document.querySelector("#button");let element=document.getElementById("canvas");function setBackground(color){document.body.style.backgroundColor=color,element&&(element.style.backgroundColor=color)}function setElements(color){document.getElementById("button").style.color=color,document.getElementById("name").style.color=color,null!=document.getElementById("content")&&(document.getElementById("content").style.color=color);for(let e of document.getElementsByClassName("icon"))e.style.color=color;for(let e of document.getElementsByClassName("text"))e.style.color=color}function init(){"false"!=localStorage.lightMode?(document.getElementById("button").classList.replace("fa-sun","fa-moon"),setBackground("black"),setElements("white")):(document.getElementById("button").classList.replace("fa-moon","fa-sun"),setBackground("white"),setElements("black"))}void 0===localStorage.lightMode&&(localStorage.lightMode="false"),button.addEventListener("click",(function(){"false"==localStorage.lightMode?(document.getElementById("button").classList.replace("fa-sun","fa-moon"),localStorage.lightMode="true",setBackground("black"),setElements("white")):(localStorage.lightMode="false",document.getElementById("button").classList.replace("fa-moon","fa-sun"),setBackground("white"),setElements("black"))})),window.onload=init;