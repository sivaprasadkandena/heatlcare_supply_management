import { Component } from '@angular/core';
import { ReportsComponent } from '../features/reports/reports.component';

@Component({ standalone: true, imports: [ReportsComponent], template: '<app-reports-workspace />' })
export class HospitalReportsComponent {}
