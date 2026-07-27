import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RadioModelDetail } from '../../models/radio-detail';
import { HttpClient } from '@angular/common/http';
import { RadioApiService } from '../../services/radio-api.service';

@Component({
  selector: 'app-radio-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './radio-detail.html',
  styleUrl: './radio-detail.css'
})
export class RadioDetail implements OnInit {

  radio: RadioModelDetail | null = null;

  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private radioApiService: RadioApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadRadioDetails();
  }

  loadRadioDetails(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.errorMessage = 'Radio Model id is missing.';
      return;
    }

    const radioId = Number(idParam);

    if (Number.isNaN(radioId)) {
      this.errorMessage = 'Invalid radio model id.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.radioApiService.getRadioDetails(radioId).subscribe({
      next: (response: RadioModelDetail) => {
        this.radio = response;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Radio detail API error', error);
        this.errorMessage = 'Unable to load radio detail.';
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
