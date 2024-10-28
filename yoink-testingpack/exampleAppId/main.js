let win = new library.yoinkgui.GUIWindow({
    minimizable: true,
    maximizable: true,
    closable: true,
    title: "Testing",
    icon: this.properties.app.icon
});

let savemgr = this.ownSaveManager;

let { displayMessage, displayPrompt, displayQuestion } = library.yoinkgui;

let winBody = win.element;

winBody.innerHTML="Hello, World!<br>";

let btn=makeHTMLButton("Message box test",()=>{
    // make it trigger a message box
    displayMessage("Hello, World!",()=>{
        displayMessage({
            icon:this.properties.app.icon,
            message:"I have an icon!",
            title:"Testing"
        });
        displayMessage({
            message:"But I don't have one",
            title:"Testing"
        });
    });
});
winBody.appendChild(btn);

winBody.appendChild(document.createElement("div"));

let btn2=makeHTMLButton("Question/Prompt test",()=>{
    // make it trigger a question and a prompt
    displayQuestion({
        message:"Would you like to test prompts?",
        yes:"Sure!",
        no:"No, thanks"
    },input=>{
        if(input){
            displayPrompt("Hello, World!","Enter anything here and it will get repeated.",input=>{
                if(input===false){
                    displayMessage("You pressed Cancel. How am I supposed to know?")
                } else if(!input){
                    displayMessage("You haven't entered anything.")
                } else {
                    displayMessage(`You entered: "${input}"`);
                }
            })
        } else {
            displayMessage("Well then.");
        }
    })
});
winBody.appendChild(btn2);

winBody.appendChild(document.createElement("div"));

let btn3=makeHTMLButton("Library test",()=>{
    let testlib = library.testingpack;
    if(!testlib) displayMessage("Library does not exist");
    testlib.testmessage();
});
winBody.appendChild(btn3);

winBody.appendChild(document.createElement("div"));

function count(num){
    displayQuestion("Number: "+num,input=>{
        if(input){
            num++;
            savemgr.save("count",num,()=>{
                count(num);
            });
        }
    })
}

let btn4=makeHTMLButton("User data counting",()=>{
    savemgr.exists("count",exists=>{
        if(!exists){
            count(0)
        } else {
            savemgr.get("count",(content,err)=>{
                if(err) throw err;
                count(+content);
            })
        }
    })
});
winBody.appendChild(btn4);