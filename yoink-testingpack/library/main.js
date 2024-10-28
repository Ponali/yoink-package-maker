let { displayMessage } = library.yoinkgui;
let teststring="Hello, World!";
return {
    teststring,
    testmessage:(()=>{
        if(!library){
            displayMessage("Library variable does not exist.");
        } else if(!library.testingpack){
            displayMessage("Library variable does not update, or self library is unexistant.");
        } else if(!library.testingpack.teststring){
            displayMessage("Cannot get self library element.")
        } else if(library.testingpack.teststring!=teststring){
            displayMessage(`Self library element is incorrect. Expected "${teststring}", Got "${library.testingpack.teststring}"`);
        } else {
            displayMessage(teststring+" - Everything seems to be fine!")
        }
    })
};