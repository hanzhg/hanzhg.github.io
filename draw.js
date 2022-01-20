const canvas=document.querySelector("#canvas");canvas.width=window.innerWidth,canvas.height=window.innerHeight;const context=canvas.getContext("2d");let currentX=window.innerWidth/2,currentY=window.innerHeight/2,mouseX=window.innerWidth/2,mouseY=window.innerHeight/2,nameDrawn="Han Zhang";var i=0,mouseDown=!1;const restartButton=document.querySelector("#restart");restartButton.addEventListener("click",(function(){localStorage.lightMode?context.fillStyle="black":context.fillStyle="white",context.fillRect(0,0,canvas.width,canvas.height)}));const draw=function(){context.font="bold 2em Arial";let text=document.getElementById("textbox").value;""!=text&&(nameDrawn=text),lightMode=localStorage.lightMode,"false"==lightMode?(setBackground("white"),setElements("black"),context.fillStyle="black"):(setElements("white"),setBackground("black"),context.fillStyle="white"),context.textAlign="center",context.save(),context.translate(currentX,currentY-155),context.rotate((-Math.PI+i)/180),mouseDown&&(i+=8,context.fillText(nameDrawn,0,12)),context.restore(),currentX+=.1*(mouseX-currentX),currentY+=.1*(mouseY-currentY),requestAnimationFrame(draw)};document.addEventListener("mousedown",(function(){mouseDown=!mouseDown||!mouseDown}),!1),document.addEventListener("mouseup",(function(){mouseDown=!mouseDown||!mouseDown}),!1),document.addEventListener("mousemove",(function(event){mouseX=event.pageX,mouseY=event.pageY,null===currentX&&(currentX=event.pageX,currentY=event.pageY)})),draw();