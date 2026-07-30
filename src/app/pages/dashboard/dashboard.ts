import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PagedResponse, RadioModelSummary } from '../../models/radio-catalog';
import { RadioApiService } from '../../services/radio-api.service';
import { forkJoin } from 'rxjs';
import { Brand } from '../../models/brand';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalRadios = 0;
  totalBrands = 0;

  p25Count = 0;
  analogCount = 0;
  nxdnCount = 0;
  dmrCount = 0;

  featuredRadios: RadioModelSummary[] = [];

  loading = false;
  errorMessage = '';

  constructor(
    private radioApiService: RadioApiService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      brands: this.radioApiService.getBrands(),
      catalog: this.radioApiService.getCatalog({
        page: 0,
        size: 100,
        sortBy: 'brandName',
        direction: 'asc',
      }),
    }).subscribe({
      next: (response: { brands: Brand[]; catalog: PagedResponse<RadioModelSummary> }) => {
        const radios = response.catalog.content;

        this.totalBrands = response.brands.length;
        this.totalRadios = response.catalog.totalElements;

        this.p25Count = radios.filter((radio) =>
          this.containsText(radio.digitalProtocol, 'P25'),
        ).length;

        this.analogCount = radios.filter((radio) =>
          this.containsText(radio.digitalProtocol, 'Analog'),
        ).length;

        this.nxdnCount = radios.filter((radio) =>
          this.containsText(radio.digitalProtocol, 'NXDN'),
        ).length;

        this.dmrCount = radios.filter((radio) =>
          this.containsText(radio.digitalProtocol, 'DMR'),
        ).length;

        this.featuredRadios = radios.slice(0, 5);

        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Dashboard API error:', error);
        this.errorMessage = 'Unable to load dashboard data.';
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  private containsText(value: string | null | undefined, keyword: string): boolean {
    if (!value) {
      return false;
    }

    return value.toLowerCase().includes(keyword.toLowerCase());
  }
}
