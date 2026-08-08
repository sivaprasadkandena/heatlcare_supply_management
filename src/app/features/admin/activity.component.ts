import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { DataService } from '../../core/data.service';

@Component({ selector: 'app-activity-workspace', standalone: true, imports: [CommonModule], templateUrl: './activity.component.html' })
export class ActivityComponent {
  private readonly data = inject(DataService);
  protected readonly activities = computed(() => this.data.activities());
  protected icon(kind: string): string { return kind === 'approval' ? '◈' : kind === 'inventory' ? '▤' : kind === 'account' ? '✚' : '▱'; }
}
