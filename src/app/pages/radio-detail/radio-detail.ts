import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RadioModelDetail } from '../../models/radio-detail';
import { HttpClient } from '@angular/common/http';
import { RadioApiService } from '../../services/radio-api.service';
import { FormsModule } from '@angular/forms';
import { RadioSpecRequest } from '../../models/spec-request';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-radio-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './radio-detail.html',
  styleUrl: './radio-detail.css',
})
export class RadioDetail implements OnInit {
  radio: RadioModelDetail | null = null;

  radioId: number | null = null;

  specForm: RadioSpecRequest = {
    specName: '',
    specValue: '',
    unit: '',
    category: '',
    displayOrder: null,
  };

  savingSpec = false;
  specErrorMessage = '';
  specSuccessMessage = '';

  loading = false;
  errorMessage = '';

  deletingSpecId: number | null = null;
  deletingRadio = false;

  editingSpecId: number | null = null;
  updatingSpec = false;

  editSpecForm: RadioSpecRequest = {
    specName: '',
    specValue: '',
    unit: '',
    category: '',
    displayOrder: null,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private radioApiService: RadioApiService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadRadioDetails();
  }

  loadRadioDetails(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.errorMessage = 'Radio model id is missing.';
      return;
    }

    const parsedId = Number(idParam);

    if (Number.isNaN(parsedId)) {
      this.errorMessage = 'Invalid radio model id.';
      return;
    }

    this.radioId = parsedId;
    this.loading = true;
    this.errorMessage = '';

    this.radioApiService.getRadioDetails(parsedId).subscribe({
      next: (response: RadioModelDetail) => {
        this.radio = response;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Radio detail API error:', error);
        this.errorMessage = 'Unable to load radio details.';
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  submitSpecForm(): void {
    this.specErrorMessage = '';
    this.specSuccessMessage = '';

    if (!this.radioId) {
      this.specErrorMessage = 'Radio model id is missing.';
      return;
    }

    if (!this.specForm.specName.trim()) {
      this.specErrorMessage = 'Specification name is required.';
      return;
    }

    if (!this.specForm.specValue.trim()) {
      this.specErrorMessage = 'Specification value is required.';
      return;
    }

    const request: RadioSpecRequest = {
      specName: this.specForm.specName.trim(),
      specValue: this.specForm.specValue.trim(),
      unit: this.specForm.unit.trim(),
      category: this.specForm.category.trim(),
      displayOrder: this.specForm.displayOrder,
    };

    this.savingSpec = true;

    this.radioApiService.addRadioSpec(this.radioId, request).subscribe({
      next: () => {
        this.specSuccessMessage = 'Technical specification added successfully.';
        this.savingSpec = false;

        this.specForm = {
          specName: '',
          specValue: '',
          unit: '',
          category: '',
          displayOrder: null,
        };

        this.loadRadioDetails();
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Add spec API error:', error);

        if (error.error && error.error.message) {
          this.specErrorMessage = error.error.message;
        } else {
          this.specErrorMessage = 'Unable to add technical specification.';
        }

        this.savingSpec = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  deleteSpec(specId: number): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this technical specification?',
    );

    if (!confirmed) {
      return;
    }

    this.specErrorMessage = '';
    this.specSuccessMessage = '';
    this.deletingSpecId = specId;

    this.radioApiService
      .deleteRadioSpec(specId)
      .pipe(
        finalize(() => {
          this.deletingSpecId = null;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.specSuccessMessage = 'Technical specification deleted successfully.';

          if (!this.radio) {
            return;
          }

          this.radio = {
            ...this.radio,
            specs: this.radio.specs.filter((spec) => spec.id !== specId),
          };

          this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
          console.error('Delete spec API error:', error);

          if (error.error && error.error.message) {
            this.specErrorMessage = error.error.message;
          } else {
            this.specErrorMessage = 'Unable to delete technical specification.';
          }

          this.changeDetectorRef.detectChanges();
        },
      });
  }

  deleteRadioModel(): void {
    if (!this.radio) {
      this.errorMessage = 'Radio model information is missing.';
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${this.radio.brandName} ${this.radio.modelName}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.specErrorMessage = '';
    this.specSuccessMessage = '';
    this.deletingRadio = true;

    this.radioApiService.deleteRadioModel(this.radio.id).subscribe({
      next: () => {
        this.deletingRadio = false;
        this.changeDetectorRef.detectChanges();

        this.router.navigate(['/radios']);
      },
      error: (error) => {
        console.error('Delete radio API error:', error);

        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Unable to delete radio model.';
        }

        this.deletingRadio = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  startEditSpec(spec: any): void {
    this.specErrorMessage = '';
    this.specSuccessMessage = '';

    this.editingSpecId = spec.id;

    this.editSpecForm = {
      specName: spec.specName ?? '',
      specValue: spec.specValue ?? '',
      unit: spec.unit ?? '',
      category: spec.category ?? '',
      displayOrder: spec.displayOrder ?? null,
    };

    this.changeDetectorRef.detectChanges();
  }

  cancelEditSpec(): void {
    this.editingSpecId = null;
    this.updatingSpec = false;

    this.editSpecForm = {
      specName: '',
      specValue: '',
      unit: '',
      category: '',
      displayOrder: null
    };

    this.changeDetectorRef.detectChanges();
  };

  submitEditSpec(specId: number): void {
    this.specErrorMessage = '';
    this.specSuccessMessage = '';

    if (!this.editSpecForm.specName.trim()) {
      this.specErrorMessage = 'Specification name is required.';
      return;
    }

    if (!this.editSpecForm.specValue.trim()) {
      this.specErrorMessage = 'Specification value is required.';
      return;
    }

    const request: RadioSpecRequest = {
      specName: this.editSpecForm.specName.trim(),
      specValue: this.editSpecForm.specValue.trim(),
      unit: this.editSpecForm.unit.trim(),
      category: this.editSpecForm.category.trim(),
      displayOrder: this.editSpecForm.displayOrder,
    };

    this.updatingSpec = true;

    this.radioApiService.updateRadioSpec(specId, request).subscribe({
      next: (updatedSpec) => {
        this.specSuccessMessage = 'Technical specification updated successfully.';

        if (!this.radio) {
          return;
        }

        this.radio = {
          ...this.radio,
          specs: this.radio.specs.map((spec) =>
            spec.id === specId
              ? {
                  ...spec,
                  specName: request.specName,
                  specValue: request.specValue,
                  unit: request.unit,
                  category: request.category,
                  displayOrder: request.displayOrder ?? 0,
                }
              : spec,
          ),
        };

        this.editingSpecId = null;
        this.updatingSpec = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Update spec API error:', error);

        if (error.error && error.error.message) {
          this.specErrorMessage = error.error.message;
        } else {
          this.specErrorMessage = 'Unable to update technical specification.';
        }

        this.updatingSpec = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }
}
