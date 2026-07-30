import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RadioApiService } from '../../services/radio-api.service';
import { PagedResponse, RadioModelSummary } from '../../models/radio-catalog';
import { RouterLink } from '@angular/router';
import { Brand } from '../../models/brand';

@Component({
  selector: 'app-radio-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './radio-catalog.html',
  styleUrl: './radio-catalog.css',
})
export class RadioCatalog implements OnInit {
  radios: RadioModelSummary[] = [];

  pageNumber = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  first = true;
  last = true;

  q = '';
  category = '';
  frequencyBand = '';
  digitalProtocol = '';
  releaseYearFrom: number | null = null;
  releaseYearTo: number | null = null;

  sortBy = 'modelName';
  direction = 'asc';

  loading = false;
  errorMessage = '';

  brands: Brand[] = [];
  selectedBrandId: number | null = null;

  constructor(
    private radioApiService: RadioApiService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadBrands();
    this.loadCatalog();
  }

  loadBrands(): void {
    this.radioApiService.getBrands().subscribe({
      next: (response: Brand[]) => {
        this.brands = response;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Brand API error:', error);
      },
    });
  }

  loadCatalog() {
    this.loading = true;
    this.errorMessage = '';

    this.radioApiService
      .getCatalog({
        q: this.q,
        brandId: this.selectedBrandId ?? undefined,
        category: this.category,
        frequencyBand: this.frequencyBand,
        digitalProtocol: this.digitalProtocol,
        releaseYearFrom: this.releaseYearFrom ?? undefined,
        releaseYearTo: this.releaseYearTo ?? undefined,
        page: this.pageNumber,
        size: this.pageSize,
        sortBy: this.sortBy,
        direction: this.direction,
      })
      .subscribe({
        next: (response: PagedResponse<RadioModelSummary>) => {
          this.radios = response.content;
          this.pageNumber = response.pageNumber;
          this.pageSize = response.pageSize;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.first = response.first;
          this.last = response.last;
          this.loading = false;

          this.changeDetectorRef.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Unable to load radio catalog.';
          this.loading = false;

          this.changeDetectorRef.detectChanges();
        },
      });
  }

  search(): void {
    this.pageNumber = 0;
    this.loadCatalog();
  }

  clearFilters(): void {
    this.q = '';
    this.selectedBrandId = null;
    this.category = '';
    this.frequencyBand = '';
    this.digitalProtocol = '';
    this.releaseYearFrom = null;
    this.releaseYearTo = null;
    this.sortBy = 'modelName';
    this.direction = 'asc';
    this.pageNumber = 0;
    this.loadCatalog();
  }

  previousPage(): void {
    if (!this.first) {
      this.pageNumber--;
      this.loadCatalog();
    }
  }

  nextPage(): void {
    if (!this.last) {
      this.pageNumber++;
      this.loadCatalog();
    }
  }
}
