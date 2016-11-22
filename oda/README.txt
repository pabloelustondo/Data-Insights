ODA stands for our Output Data Adapter; a module to be used by our Data Analytics Dashboard.

Technology

NodeJS v7.0.0
ExpressJS v4.14.0
TypeScript v2.0.6


to install and run do:

npm install
npm start

Last Update November 16, 2016

This DAD module is responsible for getting data from Cloud Storage to be used by the DAD Dashboard.
This module will, initially, get data from AWS using a REST API.
The idea is to be able to handle streams so probably will use sockets.
Also, in the future will read from other data sources.


To develop use th gulp task that will transpile typescript and move files to distribution.
