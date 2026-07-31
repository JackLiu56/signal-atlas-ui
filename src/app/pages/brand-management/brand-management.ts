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

  editingBrandId: number | null = null;
  updating = false;

  editBrandForm: BrandRequest = {
    name: '',
    country: '',
    foundedYear: null,
    websiteUrl: '',
    logoUrl: '',
    description: '',
  };

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
        this.brands = response.sort((a, b) => a.name.localeCompare(b.name));

        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Brand API error:', error);
        this.errorMessage = 'Unable to load brands.';
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
    });
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

        this.brands = [...this.brands, createBrand].sort((a, b) => a.name.localeCompare(b.name));

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
      },
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

  startEditBrand(brand: Brand): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.editingBrandId = brand.id;

    this.editBrandForm = {
      name: brand.name ?? '',
      country: brand.country ?? '',
      foundedYear: brand.foundedYear ?? null,
      websiteUrl: brand.websiteUrl ?? '',
      logoUrl: brand.logoUrl ?? '',
      description: brand.description ?? '',
    };

    this.changeDetectorRef.detectChanges();
  }

  cancelEditBrand(): void {
    this.editingBrandId = null;
    this.updating = false;

    this.editBrandForm = {
      name: '',
      country: '',
      foundedYear: null,
      websiteUrl: '',
      logoUrl: '',
      description: '',
    };

    this.changeDetectorRef.detectChanges();
  }

  submitEditBrand(brandId: number): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.editBrandForm.name.trim()) {
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

    this.updating = true;

    this.radioApiService.updateBrand(brandId, request).subscribe({
      next: (updatedBrand: Brand) => {
        this.successMessage = `Brand "${updatedBrand.name}" updated successfully.`;

        this.brands = this.brands
          .map((brand) => (brand.id === brandId ? updatedBrand : brand))
          .sort((a, b) => a.name.localeCompare(b.name));

        this.editingBrandId = null;
        this.updating = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Update brand API error:', error);

        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Unable to update brand.';
        }

        this.updating = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }
}
