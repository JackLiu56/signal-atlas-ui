import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Brand } from '../../models/brand';
import { BrandRequest } from '../../models/brand-request';
import { RadioApiService } from '../../services/radio-api.service';

@Component({
  selector: 'app-brand-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './brand-management.html',
  styleUrl: './brand-management.css',
})
export class BrandManagement implements OnInit {
  brands: Brand[] = [];

  brandForm: BrandRequest = {
    name: '',
    country: '',
    foundedYear: null,
    websiteUrl: '',
    logoUrl: '',
    description: '',
  };

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private radioApiService: RadioApiService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.loading = true;
    this.errorMessage = '';

    this.radioApiService.getBrands().subscribe({
      next: (response: Brand[]) => {
        this.brands = response.sort((a,b) =>
          a.name.localeCompare(b.name)
        );

        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Brand API error:', error);
        this.errorMessage = 'Unable to load brands.';
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }
    })
  }

  submitBrandForm(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.brandForm.name.trim()) {
      this.errorMessage = 'Brand name is required.';
      return;
    }

    const request: BrandRequest = {
      name: this.brandForm.name.trim(),
      country: this.brandForm.country.trim(),
      foundedYear: this.brandForm.foundedYear,
      websiteUrl: this.brandForm.websiteUrl.trim(),
      logoUrl: this.brandForm.logoUrl.trim(),
      description: this.brandForm.description.trim(),
    };

    this.saving = true;

    this.radioApiService.createBrand(request).subscribe({
      next: (createBrand: Brand) => {
        this.successMessage = `Brand "${createBrand.name}" created successfully.`;

        this.brands = [...this.brands, createBrand].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        this.resetForm();
        this.saving = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Create brand API error:', error);

        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Unable to create brand.';
        }

        this.saving = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  resetForm(): void {
    this.brandForm = {
      name: '',
      country: '',
      foundedYear: null,
      websiteUrl: '',
      logoUrl: '',
      description: '',
    };
  }
}
