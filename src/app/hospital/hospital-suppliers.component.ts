import { Component } from '@angular/core';
import { PartnersComponent } from '../features/partners/partners.component';

@Component({ standalone: true, imports: [PartnersComponent], template: '<app-partners-workspace />' })
export class HospitalSuppliersComponent {}
