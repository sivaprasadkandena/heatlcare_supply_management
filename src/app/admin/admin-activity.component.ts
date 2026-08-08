import { Component } from '@angular/core';
import { ActivityComponent } from '../features/admin/activity.component';

@Component({ standalone: true, imports: [ActivityComponent], template: '<app-activity-workspace />' })
export class AdminActivityComponent {}
