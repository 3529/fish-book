import path from 'path';
import { sysConfigStore } from '../config/index';

// books的文件夹路径
const FOLDER_PATH = path.join(__dirname, '../books');
sysConfigStore.set('books_folder_path', FOLDER_PATH);
console.log(FOLDER_PATH);
export { FOLDER_PATH };
