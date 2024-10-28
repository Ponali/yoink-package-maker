function makeHTMLButton(title, onclick){
    let btn=document.createElement("button");
    btn.innerText=title;
    btn.addEventListener("click",onclick);
    return btn;
}