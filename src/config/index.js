const Store = require('electron-store');
import { sysConfig as config } from '../config/sysConfig';
const sysConfigStore = new Store({
    name: 'sysConfig',
    defaults: config,
});
export { sysConfigStore };
