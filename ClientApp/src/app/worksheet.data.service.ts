import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ShoppingSheetModel } from './shoppingSheet.model';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class WorksheetDataService {

  constructor(private http: HttpClient) {

  }
  getWorksheetDataForStudent(uscid: string, academicYear: string): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const uri =  environment.apiUrl + 'CollegeFinancePlanningWorksheet/GetStudentWorksheetData/' + uscid + '/' + academicYear;
    return this.http.get<any>(uri, { headers });
  }
}
