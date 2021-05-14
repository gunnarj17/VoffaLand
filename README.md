# Final project VoffaLand
Authors: Gunnar Már Jónsson, María Hrafnsdóttir and Garðar Hrafn Steingrímsson

## Requirements:

For this project to run you will require some tools to be installed on your computer.

**Node.js**
You can install the latest Node on this website: https://nodejs.org/en/

**Code Editor**
We recommend VSCode Editor, you can download the latest VSCode editor here: https://code.visualstudio.com/

**Terminal**
You will need to use a terminal to install dependencies the project has. Most computer machines should have a terminal already installed. Window users can use the cmd to access it on their machines and Mac users can search for terminal to access it on their machines.

But I highly recommend if you are windows user to install Bash and use that.
You can get latest Bash here: https://sourceforge.net/projects/win-bash/

**NPM**
NPM is required to install package dependencies the project needs.
Type ```npm -v``` in your terminal window to check if you have npm already installed on your machine and which version. If not then simply type ```npm install npm@latest -g``` in the terminal window to install it globally on your machine.

**The Project VoffaLand**

You will need the project stored in your computer. You can download the project going to our Github where it is stored. Link: https://github.com/gunnarj17/VoffaLand
Simply press the green Code button and you should have an option to download the zip folder. Unzip the folder somewhere on you machine. 

**Expo Go**
You will need a smartphone since Expo Go is an app you will need to download on your phone. Here is a link to Expo Go: https://expo.io/tools 
You should be able to find the app in Android and iOS app stores as well.

## Installation:

Open up your desired terminal.
Open up the VoffaLand project with your desired code editor.

**Expo**
You need to access your terminal and install expo on you machine by typing ```npm install --global expo-cli```
This will install Expo globally on you machine.

**Install all libraries/dependencies**

In your terminal make sure that you are located at the root of the project folder. Then you need to type in your terminal ```npm install```.
This will install all the dependencies the project has.

## Running the Project

Make sure you are in the root of the project folder inside your terminal.
Type ```expo start```.

This will open up a new window on you browser. Open up your Expo Go app on your phone and choose the option on the top "Scan QR Code". 
Scan the code that appeared on the browser window and the project should start building and then running on your phone.

Sometimes you will need to scan the QR code couple of times for it to work properly.
Sometimes there are some dependencies that were not installed in the installation process but the expo client should let you know what dependancies are missing with an error message.

To install a missing dependency you will need to stop the expo from running first by pressing ```ctrl c``` in terminal.
**Example missing dependancy:**
Lets say the error message is not finding firebase dependancy
In terminal write ```npm install firebase``` and the dependancy should be installed in the project.