import { Component } from '@angular/core';
import { OrganizationListComponent } from '../features/admin/organization-list.component';

@Component({ standalone: true, imports: [OrganizationListComponent], template: '<app-organization-workspace role="pharmacy" />' })
export class AdminPharmaciesComponent {}
