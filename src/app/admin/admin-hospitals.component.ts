import { Component } from '@angular/core';
import { OrganizationListComponent } from '../features/admin/organization-list.component';

@Component({ standalone: true, imports: [OrganizationListComponent], template: '<app-organization-workspace role="hospital" />' })
export class AdminHospitalsComponent {}
