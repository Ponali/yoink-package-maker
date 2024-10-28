# Introduction
yoink-package-maker is a script made in Node.js that takes in a project folder and converts it into a [Yoink](https://github.com/Ponali/w93-yoink) package.
It supports having multiple JavaScript files, and minifying them.

*This README is in work-in-progress! Please wait for when new information comes up.*

# Making a project folder
A project folder must have the following files:
- properties.json (Defines metadata and how the package must be made)
- "boot" folder (contains the main code that runs when Windows93 boots up)
- "lib" folder (contains library code)
- app folder(s) (Every app on properties.json must be defined here. contains the app's main code.)

## properties.json
The file "properties.json" is a JSON file that contains how the package maker should find your code and handle it.

This file must be an Object with the following properties:
- `id` (String): The ID of the package. This will need to be typed by the user when they want to install it, so keep it simple.
- `version` (String): The version of the package.
- `name` (String): The name of the package. Isn't limited to any character set, nor length.
- `description` (String): The description of the package. Isn't limited to any character set, nor length.
- `author` (String): The owner (author) of the package. Isn't limited to any character set, nor length.
- `dependencies` (Array): A list of all package IDs of the required dependencies for your package.
- `apps` (Array): A list of all the apps that are inside of the project folder.
- `source` (Boolean): Whether to leave the source code as-is (`true`), or minify it (`false`).

## "boot" folder
The "boot" folder has all the JavaScript code files that make up a boot script.

All files will be concatenated before being processed, so there is no requirement for any `import` or `require` statements.

There will be a library variable containing built-in APIs and installed libraries, see the "Library variable" category.

## "lib" folder
The "lib" folder has all the JavaScript code files that make up a library.
The main difference between the "boot" folder and the "lib" folder is that the library contents will always be ran first.

It is required to have a `return` statement somewhere at the root of your code. The outputted value of your JavaScript code will be put in the library variable, at `library[packID]`.

Using the "library" variable at this stage must only be done if you are using built-in APIs: there is a chance that a required library may not be defined.

## Apps
Apps are a program that doesn't run automatically, but only when the user decides to run it. When in V2, any app is put in the "Programs" section of the Start menu.

### App Metadata
Any app you make must have a folder with the same name as the app's ID, and you must add the app ID into properties.json.

An app can have an icon by adding a file called `icon.png`. The resolution doesn't matter, but 16x16 is mostly reccomended.

An app can have a `metadata.json` file. It is currently unknown how this is handled.

### App code
Coding any app will have a similar experience to coding a boot script. There is currently no such difference between those except from the nature of an App.

## Built-in APIs
These are the built-in APIs given by Yoink that can be used to make your app more easily cross-version with V2 and V3.

### JSZip
JSZip is included in Yoink, and can be used without needing an external package to handle the job.
The current way to include JSZip is to get it from `library.JSZip`.

### GUI
A GUI can be easily made by using built-in methods and properties from `library.yoinkgui`.
Here are all of the properties directly provided:
- `GUIWindow` (Class): Makes a new window when created. Will make a new property called `element` being the HTML element of the content of the window.
- `displayMessage` (Function): Displays a message box. Arguments: `input` (String, message to show), `callback` (Function, function that gets ran once the user clicks the OK button.)
- `displayQuestion`
- `displayPrompt`

### Save Manager


# Using the program
