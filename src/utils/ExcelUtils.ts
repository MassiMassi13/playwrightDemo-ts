import * as XLSX from 'xlsx';
import { LoginData } from '../interfaces/LoginData';
import { EmployeeData } from '../interfaces/EmployeeData';

export default class ExcelUtils {
  static getSheetData<T>(sheetName: string, filePath = './src/test-data/data.xlsx'): T[] {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      throw new Error(`Sheet ${sheetName} not found in ${filePath}`);
    }
    const jsonData = XLSX.utils.sheet_to_json<T>(sheet);
    return jsonData;
  }

  static getLoginData(filePath = './src/test-data/data.xlsx'): LoginData[] {
    return this.getSheetData<LoginData>('Login', filePath);
  }

  static getEmployeeData(filePath = './src/test-data/data.xlsx'): EmployeeData[] {
    return this.getSheetData<EmployeeData>('Employees', filePath);
  }
}