var argv = require('minimist')(process.argv.slice(2));
//console.log(argv);
function getArg(short,long){
    if(argv[short]) return argv[short];
    return argv[long];
}

let path=argv._[0];
if(!path) path="";
let { join } = require('path');
let fs=require("fs");
const JSZip = require('jszip');
const zip = new JSZip();
var UglifyJS = require("uglify-js");

let properties=JSON.parse(fs.readFileSync(join(path,"properties.json")));

function isValidID(id){
    return id.replace(/[0-9a-z-]/gm,"").length==0;
}

if(!isValidID(properties.id)) throw new Error("Invalid package ID: "+properties.id);

console.log("Inserting metadata...");

let meta={id:properties.id,version:properties.version,name:properties.name,description:properties.description,author:properties.author};
zip.file("meta", JSON.stringify(meta));

console.log("Inserting dependencies...");

let depend=properties.dependencies.join(" ");
zip.file("depend",depend)

function packScriptFolder(folder){
    let fileList=fs.readdirSync(join(path,folder));
    if(fileList.includes("icon.png")) fileList.splice(fileList.indexOf("icon.png"),1);
    if(fileList.includes("metadata.json")) fileList.splice(fileList.indexOf("metadata.json"),1);
    let unknownFiles=fileList.filter(a=>!a.endsWith(".js"));
    if(unknownFiles.length) console.warn(`Unknown file(s) (App ${folder}): ${unknownFiles.join(", ")}\nIf these file(s) are meant to be script(s), use the .js extension.`);
    fileList=fileList.filter(a=>a.endsWith(".js"));
    if(fileList.includes("main.js")){
        fileList.splice(fileList.indexOf("main.js"),1);
        fileList.push("main.js");
    } else {
        console.warn(`main.js missing (App ${folder})`)
    };
    let out=fileList.map(a=>"//"+a+"\n"+fs.readFileSync(join(path,folder+"/"+a))).join("\n");
    if(!properties.source){
        let minified=UglifyJS.minify(out,{parse:{bare_returns:true},compress:{toplevel:true,drop_console:true},mangle:{toplevel:true}});
        if(minified.error) throw minified.error;
        out=minified.code;
    };
    return out;
}

function packApp(app){
    let appFolder=zip.folder(app);

    function exists(file){
        return fs.existsSync(join(path,app+"/"+file));
        //return fs.readFileSync(join(path,app+"/"+file))
    }

    if(exists("metadata.json")){
        appFolder.file("meta",JSON.stringify(JSON.parse(fs.readFileSync(join(path,app+"/metadata.json"))))); // parsing and stringifying afterwards makes it verify if the metadata JSON is correctly typed and can be used for compression
    } else {
        console.warn(app+"/metadata.json does not exist. No information about the app will exist when your package will get installed.");
    };

    if(exists("icon.png")){
        appFolder.file("icon",fs.readFileSync(join(path,app+"/icon.png")));
    } else {
        console.warn(app+"/icon.png does not exist. When installed, the default icon will be used.");
    };

    let out=packScriptFolder(app);
    appFolder.file("code",out);
}

let apps=properties.apps;
for(let i=0;i<apps.length;i++){
    console.log(`Inserting app "${apps[i]}" (${i+1}/${apps.length})...`);
    if(!fs.existsSync(join(path,apps[i]))) throw new Error(apps[i]+" folder does not exist.");
    packApp(apps[i]);
};

if(fs.existsSync(join(path,"library"))){
    console.log("Inserting library script...");
    let out=packScriptFolder("library");
    zip.file("lib",out);
}

if(fs.existsSync(join(path,"boot"))){
    console.log("Inserting boot script...");
    let out=packScriptFolder("boot");
    zip.file("boot",out);
}

console.log("Exporting...")
let outFile=getArg("o","output");
if(!outFile) outFile=properties.id+".ynk";
zip
.generateNodeStream({
    type:'nodebuffer',
    streamFiles:true,
    compression: "DEFLATE",
    compressionOptions: {
        level: 9
    }
})
.pipe(fs.createWriteStream(outFile))
.on("finish",()=>{
    console.log("Done exporting as "+outFile);
})