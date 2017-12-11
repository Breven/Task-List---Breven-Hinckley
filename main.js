const electron = require('electron');
const url = require('url');
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

// Listen for the app to be ready
app.on('ready', _=>{
    // Create new window
    mainWindow = new BrowserWindow({
        width: 760,
        height: 580
    });
    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Quit app when closed
    mainWindow.on('closed', _=>{
        app.quit();
    });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert Menu
    Menu.setApplicationMenu(mainMenu);
});

// Handle create add window
function createAddWindow(){
    // Create add window
    addWindow = new BrowserWindow({
        width: 350,
        height: 250,
        title: 'Add Task List Item'
    });
    // Load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Garbage collection handle
    addWindow.on('close', function(){
        addWindow = null;
    });
}

// Catch item:add
ipcMain.on('item:add',function(e, item){
    mainWindow.webContents.send('item:add', item);
});

// Create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    },{
        label: 'Edit',
        submenu: [
            {
                label: 'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            }
        ]
    },{
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    }
];

// If mac, add empty object to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}