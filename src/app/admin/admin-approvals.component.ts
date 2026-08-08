import { Component } from '@angular/core';
import { ApprovalsComponent } from '../features/admin/approvals.component';

@Component({ standalone: true, imports: [ApprovalsComponent], template: '<app-approvals-workspace />' })
export class AdminApprovalsComponent {}
