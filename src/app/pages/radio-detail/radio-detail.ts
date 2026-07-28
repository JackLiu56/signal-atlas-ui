import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RadioModelDetail } from '../../models/radio-detail';
import { HttpClient } from '@angular/common/http';
import { RadioApiService } from '../../services/radio-api.service';
import { FormsModule } from '@angular/forms';
import { RadioSpecRequest } from '../../models/spec-request';

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

  constructor(
    private route: ActivatedRoute,
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
}
