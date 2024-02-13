const para = [
    " Business meetings, and professional recordings can contain sensitive data, so security is something a transcription company should not overlook when providing services. Companies should therefore follow the various laws and industry best practice, especially so when serving law firms, government agencies or courts. Medical Transcription specifically is governed by HIPAA, which elaborates data security practices and compliance measures to be strictly followed, failure of which leads to legal action and penalties. Transcription security includes maintaining confidentiality of the data through information security practices including limiting access with passwords and ensuring a secure environment for data and appropriate methods of disposal of all materials and deletion of files. Personnel may be required to sign non-dis"
 ]


let div2=document.querySelector(".typeing p");
let inputtext=document.querySelector(".inputtext");
let mistaketag=document.querySelector(".mistke span");
let timerTag=document.querySelector(".timer span")
let wpmtag=document.querySelector(".mod span")
let tryagainbtn=document.querySelector(".tryagainbtn")

 
let charindex=0;
let mistake=0;
let istyping=0;
let maxtime=60;
let timer;


let timeleft=maxtime;

function modeFunction(){
 
 div2.innerHTML=" ";
   let randindex=Math.floor(Math.random()*para.length)
 para[randindex].split("").forEach(span=>{
   let spanTag=`<span>${span}</span>`;
   div2.innerHTML+=spanTag;
   

 });

 
  
 div2.querySelectorAll("span")[0].classList.add("active")
  
document.addEventListener("keydown",()=>inputtext.focus());
div2.addEventListener("click",()=>inputtext.focus());
}
function inittyping(){
   
   const character=div2.querySelectorAll("span")
let typedchar=inputtext.value.split("")[charindex];
if (charindex<character.length-1 && timeleft>0){
   if(!istyping){
  timer =setInterval(initTimer,1000);
  istyping=true;
}
if(typedchar==null){
   charindex--;
   if(character[charindex].classList.contains("incorrect")){
       mistake--;

   }
   character[charindex].classList.remove("correct","incorrect")

}else{
   if(character[charindex].innerText===typedchar){
      character[charindex].classList.add("correct")
      
   }else{
       mistake++;
       character[charindex].classList.add("incorrect")
     
   }
   charindex++;

}character.forEach(span=>span.classList.remove("active"))
character[charindex].classList.add("active")

  let man=Math.round((((charindex-mistake)/5)/(maxtime-timeleft))*60);
   man=man<0||!man||man===Infinity?0:man;
  
   mistaketag.innerText=mistake;
   wpmtag.innerText=man;
}else{
   inputtext.value="";
  clearInterval(timer);
 
   
}

}

function initTimer(){
   if(timeleft>0){
       timeleft--;
       timerTag.innerText=timeleft;
      
   }else{
       clearInterval(timer);
     
      

      
   }

}
function reset(){
    modeFunction();
    charindex=mistake=istyping=0;
 timeleft=maxtime;
 wpmtag.innerText=0;
 mistaketag.innerText=mistake;
}

modeFunction();
inputtext.addEventListener("input",inittyping)
tryagainbtn.addEventListener("click",reset);
  
