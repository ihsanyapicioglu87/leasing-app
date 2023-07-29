import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Brand } from '../../models/brand.model';
import { Model } from '../../models/model.model';
import { BrandService } from '../../service/brand.service';
import { ModelService } from '../../service/model.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class ModelComponent implements OnInit {
  brands: Brand[] = [];
  models: Model[] = [];
  selectedModel: Model = new Model();
  displayDialog: boolean = false;
  editMode: boolean = false;
  modelForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private modelService: ModelService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initModelForm();
    this.loadBrands();
    this.loadModels();
  }

  initModelForm(): void {
    this.modelForm = this.fb.group({
      brand: ['', Validators.required],
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

  loadModels(): void {
    this.modelService.getModels().subscribe({
      next: (models: Model[]) => {
        this.models = models;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load models.' + error.message,
        });
      }
    });
  }

  showAddDialog(): void {
    this.selectedModel = new Model();
    this.editMode = false;
    this.displayDialog = true;
    this.modelForm.reset();
  }

  showEditDialog(model: Model): void {
    this.selectedModel = { ...model };
    this.editMode = true;
    this.displayDialog = true;
    this.modelForm.patchValue(model);
  }

  saveModel(): void {
    if (this.modelForm.invalid) {
      Utils.checkForUntouched(this.modelForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields correctly.',
      });
      return;
    }

    this.selectedModel = { ...this.selectedModel, ...this.modelForm.value };

    if (this.editMode) {
      this.modelService.updateModel(this.selectedModel).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Model updated successfully.'
          });
          this.displayDialog = false;
          this.loadModels();
        },
        error: (error: any) => {
          console.error('Error updating model:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update model.' + error.message,
          });
        }
      });

    } else {
      this.modelService.createModel(this.selectedModel).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Model created successfully.',
          });
          this.displayDialog = false;
          this.loadModels();
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create model.' + error.message,
          });
        }
      });
    }
  }

  deleteModel(model: Model): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this model?',
      accept: () => {
        this.modelService.deleteModel(model.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Model deleted successfully.',
            });
            this.loadModels();
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete model.' + error.message,
            });
          }
        });
      },
    });
  }

  cancel(): void {
    this.displayDialog = false;
    this.modelForm.reset();
  }
}
