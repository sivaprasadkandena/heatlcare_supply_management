import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';
import { Medicine } from '../../core/models';

type MedicineForm = Pick<Medicine, 'name' | 'category' | 'quantity' | 'unit' | 'manufacturer' | 'manufactureDate' | 'expiryDate'>;

@Component({ selector: 'app-inventory-workspace', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './inventory.component.html' })
export class InventoryComponent {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  protected readonly user = computed(() => this.auth.currentUser()!);
  protected readonly search = signal('');
  protected readonly category = signal('All');
  protected readonly showModal = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected form: MedicineForm = this.blankForm();
  protected readonly medicines = computed(() => {
    const search = this.search().toLowerCase().trim();
    const category = this.category();
    return this.data.medicinesFor(this.user().id).filter((medicine) => (category === 'All' || medicine.category === category) && (!search || `${medicine.id} ${medicine.name} ${medicine.manufacturer}`.toLowerCase().includes(search)));
  });
  protected readonly allMedicines = computed(() => this.data.medicinesFor(this.user().id));
  protected readonly lowStockCount = computed(() => this.allMedicines().filter((medicine) => medicine.status === 'Low stock').length);
  protected readonly expiringCount = computed(() => this.allMedicines().filter((medicine) => medicine.status === 'Expiring soon').length);

  protected openCreate(): void { this.editingId.set(null); this.form = this.blankForm(); this.showModal.set(true); }
  protected openEdit(medicine: Medicine): void { this.editingId.set(medicine.id); this.form = { name: medicine.name, category: medicine.category, quantity: medicine.quantity, unit: medicine.unit, manufacturer: medicine.manufacturer, manufactureDate: medicine.manufactureDate, expiryDate: medicine.expiryDate }; this.showModal.set(true); }
  protected save(): void {
    if (!this.form.name || !this.form.quantity || !this.form.manufacturer || !this.form.manufactureDate || !this.form.expiryDate) return;
    const id = this.editingId();
    if (id) this.data.updateMedicine(id, this.form);
    else this.data.addMedicine({ ...this.form, ownerId: this.user().id });
    this.showModal.set(false);
  }
  protected remove(medicine: Medicine): void { this.data.deleteMedicine(medicine.id); }
  private blankForm(): MedicineForm { return { name: '', category: 'Antibiotics', quantity: 0, unit: 'tablets', manufacturer: '', manufactureDate: '', expiryDate: '' }; }
}
