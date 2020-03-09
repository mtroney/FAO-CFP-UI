import { Component, OnInit } from '@angular/core';
import { WorksheetDataService } from './worksheet.data.service';
import { Observable } from 'rxjs';
import { ShoppingSheetModel } from './shoppingSheet.model';
import { AppConstants } from '../../src/app.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  today: Date;                        // Date of Initialization
  accademicYear: string;              // In future hopefully this will come from SIS
  title = 'College Financing Plan';   // Persuant to Executive Order 13607
  studentName: string;                // Name of Student
  studentNumber: string;              // Student USC Number
  worksheet: ShoppingSheetModel;
  isLoading: boolean;
  basedOnFAFSA = 0;
  basedOnInstitution?: number;
  tuitionandFeesCosts?: number;
  onCampusHousingCosts?: number;
  offCampusHousingCosts?: number;
  bookCosts?: number;
  transportationCosts?: number;
  otherCosts?: number;
  totalEstimatedOnCampus?: number;
  totalEstimatedOffCampus?: number;
  schoolScholarship?: number;
  stateScholarship?: number;
  otherScholarship?: number;
  employerPaidScholarship?: number;
  totalScholarship?: number;
  federalGrants?: number;
  institutionalGrants?: number;
  stateGrants?: number;
  otherGrants?: number;
  totalGrants?: number;
  totalNetCost?: number;
  directSubsidizedLoan?: number;
  directUnsubsidizedLoan?: number;
  privateLoan?: number;
  institutionLoan?: number;
  otherAid?: number;
  parentPlusLoan = 0;
  totalloanOptions = 0;
  workStudy = 0;
  workStudyHoursPerWeek = 0;
  otherCampusJob = 0;
  totalWorkOptions = 0;
  message1?: string;
  message2?: string;
  uscId?: string;
  // Get Student specific information from the NgRx cache
  constructor(public worksheetData: WorksheetDataService) {
    this.today = new Date();
    this.studentNumber = AppConstants.USCID;
    this.accademicYear = AppConstants.accademicYear;
    this.tuitionandFeesCosts=0;
    // this.worksheetData.getWorksheetDataForStudent(this.studentNumber, this.accademicYear)
    // .subscribe(data => {this.worksheet = data; console.log(data); },   error => {
    //   console.log(error);
    //   this.calculateTotals();
  // });
  }

  //  Check NgRx cache for Worksheet Data.  If it's empty
  //  Populate Data from service, inject it into the Cache
  ngOnInit() {
    this.isLoading = true;
    this.worksheetData
    .getWorksheetDataForStudent(this.studentNumber, this.accademicYear)
    .subscribe(data => {
      this.worksheet = data;this.calculateTotals();
      console.log(data); },
        error => {
      console.log(error);
    });
    
    this.isLoading = false;
  }

  //  Calculate the totals from the provided data. We should only
  //  need to call this when the cache is empty.
  calculateTotals() {
// Off Campus Costs
 this.totalEstimatedOffCampus =
   this.worksheet.tuitionAndFees +
 + this.worksheet.housingAndMeals +
 + this.worksheet.booksAndSupplies
 + this.worksheet.transportation
 + this.worksheet.otherEducationCosts;

// // On Campus Costs
 this.totalEstimatedOnCampus =
 this.worksheet.tuitionAndFees +
 + this.worksheet.housingAndMeals +
 + this.worksheet.booksAndSupplies
 + this.worksheet.transportation
 + this.worksheet.otherEducationCosts;

// // Grants
 this.totalGrants =
  this.worksheet.pellGrant
  + this.worksheet.universityGrants
  + this.worksheet.stateGrants
  + 0 ; // Other Grants

// // Scholarships
 this.totalScholarship =
  this.schoolScholarship
  + 0 // School Scholarship
  + this.worksheet.otherScholarships
  + 0; // this.worksheet.employerPaidScholarship;

// // Loan Options
 this.totalloanOptions =
  this.worksheet.subStafford +
  this.worksheet.unsubStafford +
  0 + // this.worksheet.institutionLoan +
  0 + // this.worksheet.otherAid +
  0; // this.worksheet.parentPlusLoan;

// // Work Options
 this.workStudyHoursPerWeek = 20; // Fixed Value
 this.totalWorkOptions =
   this.worksheet.workStudy +
   0; // this.worksheet.otherCampusJob;

// //  Total Net cost = cost of Attendence - (Scholarships + Grants )
 this.totalNetCost = this.totalEstimatedOnCampus - (this.totalScholarship +  this.totalGrants);
  }

  //  Respond to the download button by displaying the XML on screen, and downloading
  //  to Student's computer.
  generateXML() {
    const fileContents = this.populateXML();
    const filename = 'USC College Finance Planning.xml';
    const filetype = 'text/xml';
    const a = document.createElement('a');
    const dataURI = 'data:' + filetype + ';base64,' + btoa(fileContents);
    a.href = dataURI;
    a.download = filename;
    const e = document.createEvent('MouseEvents');
    e.initMouseEvent('click', true, false, document.defaultView, 0, 0, 0, 0, 0,  false, false, false, false, 0, null);
    a.dispatchEvent(e);
  }

  //  Fill the XML based on the values displayed on the page.
  populateXML(): string {
    const textPage = window.open();
    textPage.document.open('text/html');
    let output = '';
    output += '<shopping_sheet>';
    output += '';
    output += '\n<expected_family_contribution>';
    output += '\n<based_on_fafsa>$' + document.getElementById('family-fafsa-cost').innerHTML + '</based_on_fafsa>';
    output += '\n<based_on_institution_methodology>$';
    output += document.getElementById('family-institution-cost').innerHTML + '</based_on_institution_methodology>';
    output += '\n</expected_family_contribution>';
    output += '\n<total_cost_of_attendance>';
    output += '\n<tuition_and_fees>$';
    output += document.getElementById('costs-tuition-and-fees').innerHTML + '</tuition_and_fees>';
    output += '\n<housing_and_meals_on_campus>$';
    output += document.getElementById('costs-housing-and-meals-on-campus').innerHTML + '</housing_and_meals_on_campus>';
    output += '\n<housing_and_meals_off_campus>$';
    output += document.getElementById('costs-housing-and-meals-off-campus').innerHTML + '</housing_and_meals_off_campus>';
    output += '\n<books_and_supplies>$' + document.getElementById('costs-books-and-supplies').innerHTML + '</books_and_supplies>';
    output += '\n<transportation>$' + document.getElementById('costs-transportation').innerHTML + '</transportation>';
    output += '\n<other_education_costs>$';
    output += document.getElementById('costs-other-education-costs').innerHTML + '</other_education_costs>';
    output += '\n<total_costs_on_campus>$';
    output += document.getElementById('costs-total-estimated-cost-on-campus').innerHTML + '</total_costs_on_campus>';
    output += '\n<total_costs_off_campus>$';
    output += document.getElementById('costs-total-estimated-cost-off-campus').innerHTML + '</total_costs_off_campus>';
    output += '\n</total_cost_of_attendance>';
    output += '\n<scholarships>';
    output += '\n<scholarships_from_your_school>$';
    output += document.getElementById('aid-scholarships-school').innerHTML + '</scholarships_from_your_school>';
    output += '\n<scholarships_from_your_state>$';
    output += document.getElementById('aid-scholarships-state').innerHTML + '</scholarships_from_your_state>';
    output += '\n<other_scholarships>$';
    output +=     document.getElementById('aid-scholarships-other').innerHTML + '</other_scholarships>';
    output += '\n<employer_paid_tuition_benefits>$';
    output += document.getElementById('employer-paid-tuition-benefits').innerHTML + '</employer_paid_tuition_benefits>';
    output += '\n<total_scholarships>$';
    output += document.getElementById('aid-total-scholarships').innerHTML + '</total_scholarships>';
    output += '\n</scholarships>';
    output += '\n<grants>';
    output += '\n<federal_pell_grants>$';
    output += document.getElementById('aid-grants-federal-pell').innerHTML + '</federal_pell_grants>';
    output += '\n<institutional_grants>$';
    output += document.getElementById('aid-grants-institution').innerHTML + '</institutional_grants>';
    output += '\n<state_grants>$';
    output += document.getElementById('aid-grants-state').innerHTML + '</state_grants>';
    output += '\n<other_aid>$';
    output += document.getElementById('aid-grants-other').innerHTML + '</other_aid>';
    output += '\n<total_grants>$';
    output += document.getElementById('aid-total-grants').innerHTML + '</total_grants>';
    output += '\n</grants>';
    output += '\n<net_costs>$';
    output += document.getElementById('net-costs-total').innerHTML + '</net_costs>';
    output += '\n<loan_options>';
    output += '\n<federal_direct_subsidized_loan>$';
    output += document.getElementById('loan-options-federal-direct-subsidized').innerHTML;
    output += '</federal_direct_subsidized_loan>';
    output += '\n<federal_direct_subsidized_loan_interest_rate>';
    output += document.getElementById('loan-options-federal-direct-subsidized-rate').innerHTML;
    output += '</federal_direct_subsidized_loan_interest_rate>';
    output += '\n<federal_direct_unsubsidized_loan>$';
    output += document.getElementById('loan-options-federal-direct-unsubsidized').innerHTML;
    output += '</federal_direct_unsubsidized_loan>';
    output += '\n<federal_direct_unsubsidized_loan_interest_rate>';
    output += document.getElementById('loan-options-federal-direct-unsubsidized-rate').innerHTML;
    output += '</federal_direct_unsubsidized_loan_interest_rate>';
    output += '\n<parent_plus_federal_loan>$';
    output += document.getElementById('loan-options-parent-plus-federal-loan').innerHTML + '</parent_plus_federal_loan>';
    output += '\n<parent_plus_federal_loan_interest_rate>';
    output += document.getElementById('loan-options-parent-plus-federal-loan-rate').innerHTML + '</parent_plus_federal_loan_interest_rate>';
    output += '\n<private_loan>$';
    output += document.getElementById('loan-options-private-loan').innerHTML + '</private_loan>';
    output += '\n<private_loan_interest_rate>';
    output += document.getElementById('loan-options-private-loan-rate').innerHTML + '</private_loan_interest_rate>';
    output += '\n<institutional_loan>$';
    output += document.getElementById('loan-options-institutional-loan').innerHTML + '</institutional_loan>';
    output += '\n<institutional_loan_interest_rate>';
    output += document.getElementById('loan-options-institutional-loan-rate').innerHTML + '</institutional_loan_interest_rate>';
    output += '\n<other_aid>$';
    output += document.getElementById('loan-options-other-aid-that-must-be-repaid').innerHTML + '</other_aid>';
    output += '\n<parent_plus>$';
    output += document.getElementById('loan-options-parent-plus-federal-loan').innerHTML + '</parent_plus>';
    output += '\n<parent_plus_rate>';
    output += document.getElementById('loan-options-parent-plus-federal-loan-rate').innerHTML + '</parent_plus_rate>';
    output += '\n<total_loan_options>';
    output += document.getElementById('loan-options-total').innerHTML + '</total_loan_options>';
    output += '\n</loan_options>';
    output += '\n<work_options>';
    output += '\n<work_study>$';
    output += document.getElementById('work-options-work-study').innerHTML + '</work_study>';
    output += '\n<work_study_hours>';
    output += document.getElementById('work-options-hours-per-week').innerHTML + ' /wk</work_study_hours>';
    output += '\n<other_campus_job>$';
    output += document.getElementById('work-options-other-campus-job').innerHTML + '</other_campus_job>';
    output += '\n<total_work_options>$';
    output += document.getElementById('work-options-total').innerHTML + '</total_work_options>';
    output += '\n</work_options>';
    output += '\n</shopping_sheet>';
    textPage.document.write('<textarea style="height:900px;width:700px;">' + output + '</textarea>');
    return output;

  }
}
