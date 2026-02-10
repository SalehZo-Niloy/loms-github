import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ui-side-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex justify-end transition-opacity duration-500 ease-in-out"
      [ngClass]="
        open
          ? 'pointer-events-auto bg-slate-900/40 opacity-100'
          : 'pointer-events-none bg-transparent opacity-0'
      "
      (click)="close.emit()"
    >
      <div
        class="h-full transform bg-white shadow-xl transition-transform duration-500 ease-in-out"
        [ngClass]="[panelClass, open ? 'translate-x-0' : 'translate-x-full']"
        (click)="$event.stopPropagation()"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class UiSideModalComponent {
  @Input() open = false;
  @Input() size: 'md' | 'lg' | 'xl' = 'md';
  @Output() close = new EventEmitter<void>();

  get panelClass(): string {
    if (this.size === 'xl') {
      return 'w-full sm:w-[95%] lg:w-[70%] max-w-5xl';
    }
    if (this.size === 'lg') {
      return 'w-full sm:w-[80%] lg:w-[45%] max-w-3xl';
    }
    return 'w-full sm:w-[90%] md:w-[70%] lg:w-1/3 max-w-xl';
  }
}
