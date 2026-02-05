import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TradeLayoutComponent } from '../../../../styles/layout/trade-layout.component';
import { UiInputComponent } from '../../../../components/ui/ui-input.component';

@Component({
  selector: 'app-import-application-page',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, UiInputComponent],
  templateUrl: './import-application.page.html'
})
export class ImportApplicationPageComponent {
  importerName = '';
  country = '';
  hsCode = '';
  amount = '';
}
