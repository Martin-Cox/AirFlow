# AirFlow 
[![Build Status](https://travis-ci.org/Martin-Cox/AirFlow.svg?branch=master)](https://travis-ci.org/Martin-Cox/AirFlow)

A web app to visualise air flow in a computer case

See www.airflow.martinstephencox.com

### Setting up a development environment

These setup steps should be roughly the same for Windows and Linux.

1.	Install node.js from https://nodejs.org/en/download/
2.  Open the terminal and type the following command to verify node is installed: `npm –v` You should see the node version number displayed in the terminal
3.	Using the terminal, navigate to the AirFlow project directory
4.	In the terminal type the following command to install AirFlow dependencies: `npm install` This may take several minutes, so be patient
5.	After the dependencies have been installed, install gulp by entering the command:`npm install –g gulp` Linux users will need to run this command as root
6.	In the AirFlow project directory, kick off a build by entering the command: `gulp build` This will create a build file build.js in the AirFlow/js/ directory
7.	Then, start the default gulp task by entering: `gulp`
8.	Open up the web page http://localhost:4000 to see your local AirFlow installation
9.	Whilst this command is running, make a change to any AirFlow .js file to automatically trigger a new build. Then refresh the browser to see your changes.
10.	To stop the gulp command, type Ctrl-C in the terminal.
11.	To run the AirFlow test suite, type the following command: `gulp test`
12.	To minify the build, first create a build file, then type the following command: `gulp minify`

This will create a minified build file build.min.js in the AirFlow/js/ directory. To use the build on a server you must rename it to build.js

Note that the Java Runtime Environment must be installed to minify the build.
