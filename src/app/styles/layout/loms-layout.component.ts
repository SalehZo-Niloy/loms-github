import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { CommonFooterComponent } from '../../components/common/common-footer.component';
import { UserMenuComponent } from '../../components/common/user-menu.component';
import { tradeTheme } from '../theme';

interface LomsMenuChild {
  label: string;
  route?: any[];
  children?: LomsMenuChild[];
}

interface LomsMenuItem {
  label: string;
  route?: any[];
  children?: LomsMenuChild[];
}

@Component({
  selector: 'app-loms-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CommonFooterComponent,
    UserMenuComponent,
    ...HlmSidebarImports,
  ],
  template: `
    <div
      class="flex h-screen flex-col overflow-hidden text-slate-900"
      [ngClass]="theme.page.background"
    >
      <div hlmSidebarWrapper class="flex flex-1 overflow-hidden">
        <hlm-sidebar>
          <div
            class="flex h-full flex-col border-r overflow-hidden bg-white transition-all duration-300 ease-in-out"
            [ngClass]="[theme.border.default, theme.surface.card]"
          >
            <div
              class="flex h-16 items-center gap-3 border-b px-4"
              [ngClass]="theme.border.default"
            >
              <img src="era_logo.svg" alt="ERA InfoTech Limited" class="h-8 w-auto" />
              <div class="flex flex-col">
                <span class="text-sm font-semibold">LOMS</span>
              </div>
            </div>

            <nav class="flex-1 overflow-y-auto space-y-6 px-3 py-4 text-sm">
              <div>
                <div class="px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {{ primarySectionLabel }}
                </div>
                <div class="mt-2 space-y-1">
                  <ng-container *ngFor="let item of mainMenuItems">
                    <ng-container *ngIf="!item.children || item.children.length === 0">
                      <a
                        [routerLink]="item.route"
                        class="flex items-center justify-between rounded-md border border-transparent px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-200 hover:bg-slate-50"
                        [ngClass]="getActiveClassForRoute(item.route)"
                      >
                        <span class="flex items-center gap-2">
                          <span
                            class="flex h-4 w-4 items-center justify-center text-slate-400"
                            *ngIf="item.label === 'Dashboard'"
                          >
                            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none">
                              <path
                                d="M4 9.5 10 4l6 5.5V16a1 1 0 0 1-1 1h-3.5v-4H8.5v4H5a1 1 0 0 1-1-1V9.5Z"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </span>
                          <span
                            class="flex h-4 w-4 items-center justify-center text-slate-400"
                            *ngIf="item.label === 'Submission'"
                          >
                            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none">
                              <path
                                d="M5 11v4a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-4"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M10 4v8"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                              />
                              <path
                                d="M7.5 7.5 10 5l2.5 2.5"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </span>
                          <span
                            class="flex h-4 w-4 items-center justify-center text-slate-400"
                            *ngIf="item.label === 'Report Builder'"
                          >
                            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none">
                              <rect
                                x="3.5"
                                y="4"
                                width="13"
                                height="12"
                                rx="2"
                                stroke="currentColor"
                                stroke-width="1.4"
                              />
                              <path
                                d="M7 11.5 9 9.5l2 2 2-3"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </span>
                          <span
                            class="flex h-4 w-4 items-center justify-center text-slate-400"
                            *ngIf="item.label === 'Appeal/Re-open'"
                          >
                            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none">
                              <path
                                d="M5 10a5 5 0 0 1 8-3.5"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M11.5 5H14v2.5"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M15 10a5 5 0 0 1-8 3.5"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M8.5 15H6v-2.5"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </span>
                          <span
                            class="flex h-4 w-4 items-center justify-center text-slate-400"
                            *ngIf="item.label === 'Manual Re-Assignment'"
                          >
                            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none">
                              <circle
                                cx="7"
                                cy="7"
                                r="2.2"
                                stroke="currentColor"
                                stroke-width="1.4"
                              />
                              <circle
                                cx="13"
                                cy="7"
                                r="2.2"
                                stroke="currentColor"
                                stroke-width="1.4"
                              />
                              <path
                                d="M4.5 13c.7-1.6 2.1-2.5 3.5-2.5s2.8.9 3.5 2.5"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                              />
                              <path
                                d="M10 13h2.5"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                              />
                            </svg>
                          </span>
                          <span
                            class="flex h-4 w-4 items-center justify-center text-slate-400"
                            *ngIf="item.label === 'Self Defined Form Builder'"
                          >
                            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none">
                              <rect
                                x="4"
                                y="3.5"
                                width="12"
                                height="13"
                                rx="2"
                                stroke="currentColor"
                                stroke-width="1.4"
                              />
                              <path
                                d="M7 7h6"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                              />
                              <path
                                d="M7 10h6"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                              />
                              <path
                                d="M7 13h3.5"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                              />
                            </svg>
                          </span>
                          <span class="text-sm font-medium text-slate-700">
                            {{ item.label }}
                          </span>
                        </span>
                      </a>
                    </ng-container>
                    <ng-container *ngIf="item.children && item.children.length > 0">
                      <button
                        type="button"
                        class="flex w-full items-center justify-between rounded-md border border-transparent px-3 py-2 text-left text-slate-700 hover:border-slate-200 hover:bg-slate-50"
                        (click)="toggleGroup(item.label)"
                      >
                        <span class="flex items-center gap-2">
                          <span
                            class="flex h-4 w-4 items-center justify-center text-slate-400"
                            *ngIf="item.label === 'De Duplication'"
                          >
                            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none">
                              <rect
                                x="4"
                                y="5"
                                width="7"
                                height="7"
                                rx="1.5"
                                stroke="currentColor"
                                stroke-width="1.4"
                              />
                              <rect
                                x="9"
                                y="8"
                                width="7"
                                height="7"
                                rx="1.5"
                                stroke="currentColor"
                                stroke-width="1.4"
                              />
                            </svg>
                          </span>
                          <span
                            class="flex h-4 w-4 items-center justify-center text-slate-400"
                            *ngIf="item.label === 'Loan'"
                          >
                            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none">
                              <rect
                                x="4"
                                y="3.5"
                                width="9"
                                height="13"
                                rx="1.5"
                                stroke="currentColor"
                                stroke-width="1.4"
                              />
                              <path
                                d="M7 7h5"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                              />
                              <path
                                d="M7 10h3.5"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                              />
                              <path
                                d="M13 4.5 16 7.5v8a1 1 0 0 1-1 1h-3"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </span>
                          <span
                            class="flex h-4 w-4 items-center justify-center text-slate-400"
                            *ngIf="item.label === 'Verification'"
                          >
                            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none">
                              <path
                                d="M10 3.5 5 5.5v4.5c0 3.2 2.4 5.6 5 6.5 2.6-.9 5-3.3 5-6.5V5.5L10 3.5Z"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M7.5 10.2 9.2 11.9 12.5 8.9"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </span>
                          <span
                            class="flex h-4 w-4 items-center justify-center text-slate-400"
                            *ngIf="item.label === 'Vetting & Valuation'"
                          >
                            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none">
                              <rect
                                x="3.5"
                                y="3.5"
                                width="8"
                                height="11"
                                rx="1.5"
                                stroke="currentColor"
                                stroke-width="1.4"
                              />
                              <path
                                d="M6 7h3.5"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                              />
                              <path
                                d="M6 9.5h2.5"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                              />
                              <circle
                                cx="12.5"
                                cy="11.5"
                                r="2"
                                stroke="currentColor"
                                stroke-width="1.4"
                              />
                              <path
                                d="M14 13l1.3 1.3"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                              />
                            </svg>
                          </span>
                          <span
                            class="flex h-4 w-4 items-center justify-center text-slate-400"
                            *ngIf="item.label === 'Card Operation'"
                          >
                            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none">
                              <rect
                                x="3.5"
                                y="5"
                                width="13"
                                height="10"
                                rx="2"
                                stroke="currentColor"
                                stroke-width="1.4"
                              />
                              <rect
                                x="5"
                                y="6.5"
                                width="4.5"
                                height="3"
                                rx="0.8"
                                stroke="currentColor"
                                stroke-width="1.2"
                              />
                              <path
                                d="M5 12.5h10"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                              />
                            </svg>
                          </span>
                          <span
                            class="flex h-4 w-4 items-center justify-center text-slate-400"
                            *ngIf="item.label === 'Product Configuration' || item.label === 'Configuration'"
                          >
                            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none">
                              <circle
                                cx="7"
                                cy="7"
                                r="2"
                                stroke="currentColor"
                                stroke-width="1.4"
                              />
                              <path
                                d="M4 7h-1.5"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                              />
                              <path
                                d="M10.5 7H16"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                              />
                              <circle
                                cx="12.5"
                                cy="13"
                                r="2"
                                stroke="currentColor"
                                stroke-width="1.4"
                              />
                              <path
                                d="M4 13h6.5"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                              />
                              <path
                                d="M15 13h1"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                              />
                            </svg>
                          </span>
                          <span
                            class="flex h-4 w-4 items-center justify-center text-slate-400"
                            *ngIf="item.label === 'Query Management'"
                          >
                            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none">
                              <path
                                d="M4.5 4.5h11v7.5h-4L8 16l-.5-4H4.5v-7.5Z"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M9 7.5a2 2 0 0 1 3.5 1.2c0 1.3-1.5 1.5-1.5 2.3"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <circle cx="11" cy="12.5" r="0.6" fill="currentColor" />
                            </svg>
                          </span>
                          <span
                            class="flex h-4 w-4 items-center justify-center text-slate-400"
                            *ngIf="item.label === 'KYC Management'"
                          >
                            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none">
                              <circle
                                cx="10"
                                cy="7"
                                r="2.5"
                                stroke="currentColor"
                                stroke-width="1.4"
                              />
                              <path
                                d="M5.5 15.5c.7-2 2.3-3.2 4.5-3.2s3.8 1.2 4.5 3.2"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </span>
                          <span
                            class="flex h-4 w-4 items-center justify-center text-slate-400"
                            *ngIf="item.label === 'CIB'"
                          >
                            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none">
                              <rect
                                x="4"
                                y="4"
                                width="12"
                                height="12"
                                rx="2"
                                stroke="currentColor"
                                stroke-width="1.4"
                              />
                              <path
                                d="M7 8h6"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                              />
                              <path
                                d="M7 11h4"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                              />
                              <circle cx="8" cy="13.5" r="0.9" fill="currentColor" />
                            </svg>
                          </span>
                          <span
                            class="flex h-4 w-4 items-center justify-center text-slate-400"
                            *ngIf="item.label === 'CPV'"
                          >
                            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none">
                              <rect
                                x="4"
                                y="4"
                                width="12"
                                height="12"
                                rx="2"
                                stroke="currentColor"
                                stroke-width="1.4"
                              />
                              <path
                                d="M7 8.5 8.5 10l3-3"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M7 12.5h5"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                              />
                            </svg>
                          </span>
                          <span
                            class="flex h-4 w-4 items-center justify-center text-slate-400"
                            *ngIf="item.label === 'Credit Risk Scoring'"
                          >
                            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none">
                              <path
                                d="M10 3.5 15 5.5v4.5c0 3.2-2.4 5.6-5 6.5-2.6-.9-5-3.3-5-6.5V5.5L10 3.5Z"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M7.5 9.8 9.2 11.5 12.5 8.5"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </span>
                          <span class="text-sm font-medium text-slate-700">
                            {{ item.label }}
                          </span>
                        </span>
                        <span class="flex h-4 w-4 items-center justify-center text-slate-400">
                          <svg
                            viewBox="0 0 20 20"
                            class="h-3.5 w-3.5"
                            [style.transform]="
                              isGroupExpanded(item.label) ? 'rotate(90deg)' : 'rotate(0deg)'
                            "
                          >
                            <path
                              d="M7 5l5 5-5 5"
                              stroke="currentColor"
                              stroke-width="1.7"
                              fill="none"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </span>
                      </button>
                      <div
                        *ngIf="isGroupExpanded(item.label)"
                        class="space-y-1 pl-4 ml-1 border-l border-slate-200"
                      >
                        <ng-container *ngFor="let child of item.children">
                          <ng-container
                            *ngIf="!child.children || child.children.length === 0; else childGroup"
                          >
                            <a
                              [routerLink]="child.route"
                              class="flex items-center rounded-lg border border-transparent px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                              [ngClass]="getActiveClassForRoute(child.route)"
                            >
                              <span>{{ child.label }}</span>
                            </a>
                          </ng-container>
                          <ng-template #childGroup>
                            <button
                              type="button"
                              class="flex w-full items-center justify-between rounded-md border border-transparent px-3 py-1.5 text-left text-slate-700 hover:border-slate-200 hover:bg-slate-50"
                              (click)="toggleGroup(child.label)"
                            >
                              <span class="text-[11px] font-semibold uppercase tracking-wide">
                                {{ child.label }}
                              </span>
                              <span class="flex h-4 w-4 items-center justify-center text-slate-400">
                                <svg
                                  viewBox="0 0 20 20"
                                  class="h-3.5 w-3.5"
                                  [style.transform]="
                                    isGroupExpanded(child.label) ? 'rotate(90deg)' : 'rotate(0deg)'
                                  "
                                >
                                  <path
                                    d="M7 5l5 5-5 5"
                                    stroke="currentColor"
                                    stroke-width="1.7"
                                    fill="none"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              </span>
                            </button>
                            <div
                              *ngIf="isGroupExpanded(child.label)"
                              class="space-y-1 pl-4 ml-4 border-l border-slate-200"
                            >
                              <a
                                *ngFor="let grand of child.children"
                                [routerLink]="grand.route"
                                class="flex items-center rounded-lg border border-transparent px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                                [ngClass]="getActiveClassForRoute(grand.route)"
                              >
                                <span>{{ grand.label }}</span>
                              </a>
                            </div>
                          </ng-template>
                        </ng-container>
                      </div>
                    </ng-container>
                  </ng-container>
                </div>
              </div>

              <!-- <div>
                  <div class="px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Other Solutions
                  </div>
                  <div class="mt-2 space-y-1">
                    <button
                      type="button"
                      class="flex w-full items-center justify-between rounded-md border border-dashed border-slate-200 px-3 py-2 text-left text-slate-400"
                    >
                      <span>Corporate Internet Banking</span>
                      <span class="text-[10px] uppercase tracking-wide">Soon</span>
                    </button>
                  </div>
                </div> -->
            </nav>
          </div>
        </hlm-sidebar>

        <section class="flex flex-1 flex-col">
          <header
            class="flex h-16 items-center justify-between border-b px-6"
            [ngClass]="[theme.border.default, theme.surface.card]"
          >
            <div class="flex items-center gap-3">
              <button
                hlmSidebarTrigger
                type="button"
                class="flex h-8 w-8 items-center justify-center rounded-md border text-sm text-slate-700 shadow-sm hover:bg-slate-50"
                [ngClass]="[theme.border.default, theme.surface.card]"
              ></button>
              <div class="flex flex-col">
                <span class="text-sm font-semibold text-blue-700">
                  {{ breadcrumb }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <app-user-menu></app-user-menu>
            </div>
          </header>

          <main class="flex-1 min-h-0 w-full overflow-y-auto px-6 py-6">
            <div class="mb-4 flex justify-end">
              <button
                hlmBtn
                variant="outline"
                size="xs"
                type="button"
                class="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium text-blue-700 shadow-sm hover:bg-blue-50"
                [ngClass]="theme.border.accent"
                (click)="goBack()"
              >
                <span>←</span>
                <span>Back to main dashboard</span>
              </button>
            </div>
            <ng-content></ng-content>
          </main>
        </section>
      </div>
      <app-common-footer></app-common-footer>
    </div>
  `,
})
export class LomsLayoutComponent implements OnInit {
  @Input() organisationName = 'Loan Origination and Management System';
  @Input() solutionName = 'LOMS';
  @Input() breadcrumb = 'Dashboard';
  @Input() basePath = '/loms';
  @Input() primarySectionLabel = 'LOMS';

  @Input() mainMenuItems: LomsMenuItem[] = [
    {
      label: 'Dashboard',
      route: ['/loms', 'dashboard'],
    },
    {
      label: 'Loan',
      children: [
        {
          label: 'Application',
          route: ['/loms', 'loan-application', 'application'],
        },
      ],
    },
    {
      label: 'Verification',
      children: [
        {
          label: 'CIB',
          children: [
            {
              label: 'CIB Initiation',
              route: ['/loms', 'cib-initiation', 'application'],
            },
            {
              label: 'Officer Assignment',
              route: ['/loms', 'cib-initiation', 'officer-assignment'],
            },
            {
              label: 'CIB Finalization',
              route: ['/loms', 'cib-initiation', 'finalization'],
            },
          ],
        },
        {
          label: 'CPV',
          children: [
            {
              label: 'Dashboard',
              route: ['/loms', 'cpv', 'dashboard'],
            },
            {
              label: 'Finalization',
              route: ['/loms', 'cpv', 'finalization'],
            },
            {
          label: 'DAT File Generation',
          route: ['/loms', 'card-operation', 'dat-file-generation'],
        },
        {
          label: 'Card Disbursement',
          route: ['/loms', 'card-operation', 'card-disbursement'],
        },
      ],
        },
        {
          label: 'Vetting & Valuation',
          children: [
            {
              label: 'Vetting & Valuation',
              route: ['/loms', 'vetting-valuation', 'application'],
            },
          ],
        },
        {
          label: 'KYC Management',
          children: [
            {
              label: 'KYC Dashboard',
              route: ['/loms', 'kyc'],
            },
          ],
        },
        {
          label: 'Credit Risk Management',
          children: [
            {
              label: 'Configurations',
              route: ['/loms', 'credit-risk'],
            },
            {
              label: 'Scoring Worklist',
              route: ['/loms', 'credit-risk', 'scoring'],
            },
          ],
        },
      ],
    },
    {
      label: 'Configuration',
      children: [
        {
          label: 'Dashboard Configuration',
          route: ['/loms', 'dashboard-configuration'],
          children: [
            {
              label: 'Configuration',
              route: ['/loms', 'dashboard-configuration'],
            },
            {
              label: 'Company Profile',
            },
            {
              label: 'Campaign Details',
            },
          ],
        },
        {
          label: 'Product Configuration',
          route: ['/loms', 'product'],
          children: [
            {
              label: 'Design Product',
              route: ['/loms', 'product'],
            },
          ],
        },
        {
          label: 'User Defined Page Builder',
          route: ['/loms', 'form-builder'],
        },
        {
          label: 'Report Builder',
          route: ['/loms', 'report-builder'],
        },
      ],
    },
    // {
    //   label: 'Query Management',
    //   route: ['/loms', 'query'],
    //   children: [
    //     {
    //       label: 'Dashboard',
    //       route: ['/loms', 'query'],
    //     },
    //     {
    //       label: 'Create Query',
    //       route: ['/loms', 'query', 'create'],
    //     },
    //   ],
    // },
    {
      label: 'Appeal/Re-open',
      route: ['/loms', 'appeal-reopen'],
    },
    {
      label: 'Manual Re-Assignment',
      route: ['/loms', 'work-allocation'],
    },
  ];

  private expandedGroups: Record<string, boolean> = {};
  private readonly LAST_ACTIVE_STORAGE_KEY = 'loms_last_active_menu';
  private activePath: string | null = null;

  theme = tradeTheme;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const currentUrl = this.router.url;

    let storedPath: string | null = null;
    if (typeof window !== 'undefined') {
      storedPath = window.localStorage.getItem(this.LAST_ACTIVE_STORAGE_KEY);
    }

    const currentMatch = this.findMatchingMenuPath(currentUrl);
    const initialPath = currentMatch || storedPath;

    if (initialPath) {
      this.setActivePath(initialPath);
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects || event.url;
        const match = this.findMatchingMenuPath(url);
        if (match) {
          this.setActivePath(match);
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  isGroupExpanded(label: string): boolean {
    return !!this.expandedGroups[label];
  }

  toggleGroup(label: string): void {
    this.expandedGroups[label] = !this.expandedGroups[label];
  }

  getActiveClassForRoute(route?: any[]): string {
    return this.isRouteActive(route) ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-sm' : '';
  }

  private findMatchingMenuPath(currentUrl: string): string | null {
    let bestMatch: string | null = null;

    const considerRoute = (route?: any[]) => {
      const path = this.getRoutePath(route);
      if (!path) {
        return;
      }
      if (currentUrl.startsWith(path)) {
        if (!bestMatch || path.length > bestMatch.length) {
          bestMatch = path;
        }
      }
    };

    this.mainMenuItems.forEach((item) => {
      considerRoute(item.route);
      item.children?.forEach((child) => {
        considerRoute(child.route);
        child.children?.forEach((grand) => {
          considerRoute(grand.route);
        });
      });
    });

    return bestMatch;
  }

  private setActivePath(path: string): void {
    this.activePath = path;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.LAST_ACTIVE_STORAGE_KEY, path);
    }
    this.updateExpandedGroups(path);
  }

  private updateExpandedGroups(activePath: string): void {
    this.expandedGroups = {};

    this.mainMenuItems.forEach((item) => {
      let itemHasActive = false;

      item.children?.forEach((child) => {
        const childPath = this.getRoutePath(child.route);
        let childHasActive = false;

        if (childPath && activePath.startsWith(childPath)) {
          childHasActive = true;
        }

        if (child.children && child.children.length > 0) {
          const hasActiveGrand = child.children.some((grand) => {
            const grandPath = this.getRoutePath(grand.route);
            return !!grandPath && activePath.startsWith(grandPath);
          });

          if (hasActiveGrand) {
            childHasActive = true;
          }
        }

        if (childHasActive) {
          this.expandedGroups[child.label] = true;
          itemHasActive = true;
        }
      });

      if (itemHasActive) {
        this.expandedGroups[item.label] = true;
      }
    });

    // Removed auto-expand all groups on dashboard. Only expand active group.
  }

  private getRoutePath(route?: any[]): string | null {
    if (!route) {
      return null;
    }
    const tree = this.router.createUrlTree(route);
    return this.router.serializeUrl(tree);
  }

  private isRouteActive(route?: any[]): boolean {
    const path = this.getRoutePath(route);
    if (!path) {
      return false;
    }
    const current = this.activePath || this.router.url;
    return current.startsWith(path);
  }
}
