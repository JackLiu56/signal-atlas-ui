import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Brand } from '../../models/brand';
import { RadioModelRequest } from '../../models/radio-request';
import { RadioApiService } from '../../services/radio-api.service';
import { RadioModelDetail } from '../../models/radio-detail';

@Component({
  selector: 'app-radio-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './radio-edit.html',
  styleUrl: './radio-edit.css',
})
export class RadioEdit implements OnInit {
  radioId: number | null = null;
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
    imageUrl: '',
  };

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private radioApiService: RadioApiService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadPageData();
  }

  loadPageData(): void {
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

    this.radioApiService.getBrands().subscribe({
      next: (brandResponse: Brand[]) => {
        this.brands = brandResponse;
        this.loadRadioDetails(parsedId);
      },
      error: (error) => {
        console.error('Brand API error:', error);
        this.errorMessage = 'Unable to load brands.';
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  loadRadioDetails(id: number): void {
    this.radioApiService.getRadioDetails(id).subscribe({
      next: (radio: RadioModelDetail) => {
        this.form = {
          brandId: radio.brandId,
          modelName: radio.modelName ?? '',
          modelNumber: radio.modelNumber ?? '',
          category: radio.category ?? 'HANDHELD',
          frequencyBand: radio.frequencyBand ?? 'UNKNOWN',
          frequencyRange: radio.frequencyRange ?? '',
          modulation: radio.modulation ?? '',
          digitalProtocol: radio.digitalProtocol ?? '',
          releaseYear: radio.releaseYear ?? null,
          discontinuedYear: radio.discontinuedYear ?? null,
          estimatedMarketLow: radio.estimatedMarketLow ?? null,
          estimatedMarketHigh: radio.estimatedMarketHigh ?? null,
          description: radio.description ?? '',
          imageUrl: radio.imageUrl ?? '',
        };

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

  submitForm(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.radioId) {
      this.errorMessage = 'Radio model id is missing.';
      return;
    }

    if (!this.form.brandId) {
      this.errorMessage = 'Please select a brand.';
      return;
    }

    if (!this.form.modelName.trim()) {
      this.errorMessage = 'Model name is required.';
      return;
    }

    const request: RadioModelRequest = {
      brandId: this.form.brandId,
      modelName: this.form.modelName.trim(),
      modelNumber: this.form.modelNumber.trim(),
      category: this.form.category,
      frequencyBand: this.form.frequencyBand,
      frequencyRange: this.form.frequencyRange.trim(),
      modulation: this.form.modulation.trim(),
      digitalProtocol: this.form.digitalProtocol.trim(),
      releaseYear: this.form.releaseYear,
      discontinuedYear: this.form.discontinuedYear,
      estimatedMarketLow: this.form.estimatedMarketLow,
      estimatedMarketHigh: this.form.estimatedMarketHigh,
      description: this.form.description.trim(),
      imageUrl: this.form.imageUrl.trim(),
    };

    this.saving = true;

    this.radioApiService.updateRadioModel(this.radioId, request).subscribe({
      next: () => {
        this.successMessage = 'Radio model updated successfully.';
        this.saving = false;
        this.changeDetectorRef.detectChanges();

        this.router.navigate(['/radios', this.radioId]);
      },
      error: (error) => {
        console.error('Update radio API error:', error);

        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Unable to update radio model.';
        }

        this.saving = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }
}
