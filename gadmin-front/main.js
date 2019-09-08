const { app, BrowserWindow, Menu } = require('electron');

let win;

const createWindow = () => {
  win = new BrowserWindow({
    webPreferences: { backgroundThrottling: false },
    icon: __dirname + '/dist/assets/icon.png',
    resizable: false,
    fullscreen: true
  });

  win.loadURL(__dirname + '/dist/index.html');

  win.on('closed', () => {
    win = null;
  });
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);

  //win.webContents.openDevTools();
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;
};

app.on('ready', createWindow);

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

const menuTemplate = [
  {
    label: 'Salir',
    accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
    click() {
      app.quit();
    }
  }
];

if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}
