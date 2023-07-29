import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Brand} from '../../models/brand.model';
import {BrandService} from '../../service/brand.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Utils} from '../../utils/utils';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class BrandComponent implements OnInit {
  brands: Brand[] = [];
  selectedBrand: Brand = new Brand();
  displayDialog: boolean = false;
  editMode: boolean = false;
  brandForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
  }

  ngOnInit(): void {
    this.initBrandForm();
    this.loadBrands();
  }

  initBrandForm(): void {
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  loadBrands(): void {
    this.brandService.getBrands().subscribe({
      next: (brands: Brand[]) => {
        this.brands = brands;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load brands.' + error.message,
        });
      }
    });
  }

  showAddDialog(): void {
    this.selectedBrand = new Brand();
    this.editMode = false;
    this.displayDialog = true;
    this.brandForm.reset();
  }

  showEditDialog(brand: Brand): void {
    this.selectedBrand = {...brand};
    this.editMode = true;
    this.displayDialog = true;
    this.brandForm.patchValue(brand);
  }

  saveBrand(): void {
    if (this.brandForm.invalid) {
      Utils.checkForUntouched(this.brandForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields correctly.',
      });
      return;
    }

    this.selectedBrand = {...this.selectedBrand, ...this.brandForm.value};

    if (this.editMode) {
      this.brandService.updateBrand(this.selectedBrand).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Brand updated successfully.',
          });
          this.displayDialog = false;
          this.loadBrands();
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update brand.' + error.message,
          });
        }
      });
    } else {
      this.brandService.createBrand(this.selectedBrand).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Brand created successfully.',
          });
          this.displayDialog = false;
          this.loadBrands();
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create brand.' + error.message,
          });
        }
      });
    }
  }

  deleteBrand(brand: Brand): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this brand?',
      accept: () => {
        this.brandService.deleteBrand(brand.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Brand deleted successfully.',
            });
            this.loadBrands();
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete brand.' + error.message,
            });
          }
        });

      },
    });
  }

  cancel(): void {
    this.displayDialog = false;
    this.brandForm.reset();
  }
}
