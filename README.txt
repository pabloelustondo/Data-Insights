Data Analytics Dashboard (DAD) preliminary code & experiments.

This project is written using modern javascript and organized in modules that can be built, run and test independently. 
Key technologies are: Node.js (7), Angular.js 2, Typescript 2 and nv23.js / D3.js (for charts). 

To get and run this project 

install git (I have version 2.9 ) 
install node.js (version 7)

Stop all the MobiControl services (MS, DS, Elastic Search Proxy Server(if you have it))
Ensure Port in TSOA.json and Appconfig.json match.

open a commend prompt
git clone http://taipan:8080/tfs/SOTITFS/_git/CustomerBI
cd CustomerBI
cd oda
npm install
npm start  
check out data adapter (ODA) at http://localhost:3001/

open another command prompt
cd CustomerBI
cd dad
npm install
npm start  
check Data Analytics Dashboard(DAD) at http://localhost:3000/

Note: Data Analytics Dashboard(DAD) is only the client side for now, server side coming soon
Note: We recommend using WebStorm as IDE but this is not necessary.

If using WebStorm, after npm install is done, our suggestion is to right click on the package.json and execute the 'start' task from there.
In the case of DAD the start takes care of everything (builds and runs). In case of ODA you need to build.

Warning: If using WebStorm,  please remove indexing from 'dist' folders as well as node_modules,as this is going to be slow.
(Settings/Directories   exclude button)

Glossary:

    Tools:
    1) WS - WebStorm
    2) TS - TypeScript

    Components:
    1) DAD - Data Analytics Dashboard
    2) ODA - Checkout Data Adapter
