import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface UiStepTimelineItem {
  label: string;
  description: string;
}

type StepStatus = 'completed' | 'upcoming';

@Component({
  selector: 'app-ui-step-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto pb-2">
      <ol
        class="flex min-w-[520px] items-center justify-between gap-4 text-xs"
        aria-label="Step progress"
      >
        <ng-container *ngFor="let step of steps; let i = index">
          <li class="flex flex-1 items-center gap-2">
            <div
              data-testid="step-circle"
              class="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold shadow-sm transition-all duration-200 ease-out"
              [ngClass]="getCircleClasses(i)"
            >
              <ng-container [ngSwitch]="getStepStatus(i)">
                <span *ngSwitchCase="'completed'">✓</span>
                <span *ngSwitchDefault>{{ i + 1 }}</span>
              </ng-container>
            </div>
            <div class="space-y-0.5">
              <div
                class="font-semibold"
                [ngClass]="{
                  'text-emerald-700': getStepStatus(i) === 'completed',
                  'text-slate-900': getStepStatus(i) !== 'completed'
                }"
              >
                {{ step.label }}
              </div>
              <div class="text-[11px] text-slate-500">
                {{ step.description }}
              </div>
            </div>
          </li>
          <div
            *ngIf="i < steps.length - 1"
            data-testid="step-connector"
            class="h-px flex-1 transition-all duration-200 ease-out"
            [ngClass]="getConnectorClasses(i)"
          ></div>
        </ng-container>
      </ol>
    </div>
  `,
})
export class UiStepTimelineComponent {
  @Input() steps: UiStepTimelineItem[] = [];
  @Input() currentStepIndex = 0;

  getStepStatus(index: number): StepStatus {
    return index <= this.currentStepIndex ? 'completed' : 'upcoming';
  }

  getCircleClasses(index: number): string[] {
    const status = this.getStepStatus(index);

    if (status === 'completed') {
      return ['bg-emerald-500', 'text-white'];
    }

    return ['bg-slate-100', 'text-slate-500'];
  }

  getConnectorClasses(index: number): string[] {
    const status = this.getStepStatus(index);

    if (status === 'completed') {
      return ['bg-emerald-500'];
    }

    return ['bg-slate-200'];
  }
}

