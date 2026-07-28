import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Brand } from '../../models/brand';
import { RadioModelRequest } from '../../models/radio-request';
import { RadioApiService } from '../../services/radio-api.service';

@Component({
  selector: 'app-radio-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './radio-create.html',
  styleUrl: './radio-create.css',
})
export class RadioCreate implements OnInit {
  brands: Brand[] = [];

  form: RadioModelRequest = {
    brandId: null,
    modelName: '',
    modelNumber: '',
    category: 'HANDHELD',
    frequencyBand: 'UNKNOWN',
    frequencyRange: '',
    modulation: '',
    digitalProtocol: '',
    releaseYear: null,
    discontinuedYear: null,
    estimatedMarketLow: null,
    estimatedMarketHigh: null,
    description: '',
    imageUrl: ''
  };

  loadingBrands = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private radioApiService: RadioApiService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.loadingBrands = true;
    this.errorMessage = '';

    this.radioApiService.getBrand().subscribe({
      next: (response: Brand[]) => {
        this.brands = response;

        if (this.brands.length > 0 && this.form.brandId === null) {
          this.form.brandId = this.brands[0].id;
        }

        this.loadingBrands = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Brand API error:', error);
        this.errorMessage = 'Unable to load brands.';
        this.loadingBrands = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  submitForm(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.form.brandId) {
      this.errorMessage = 'Please select a brand.';
      return;
    }

    if(!this.form.modelName.trim()) {
      this.errorMessage = 'Model name is required';
      return;
    }

    this.saving = true;

    this.radioApiService.createRadioModel(this.form).subscribe({
      next: (response) => {
        this.successMessage = 'Radio model created successfully.';
        this.saving = false;
        this.changeDetectorRef.detectChanges();

        this.router.navigate(['/radios', response.id]);
      },
      error: (error) => {
        console.error('Create radio API error:', error);

        if(error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Unable to create radio model';
        }

        this.saving = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
