import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';

type Role = 'Designer' | 'Checker' | 'Admin';
type Status = 'DRAFT' | 'PENDING' | 'APPROVED' | 'PUBLISHED';
type TabKey = 'Designer' | 'DataMapping' | 'Preview' | 'Inbox';
type BindingMode = 'path' | 'expr';
type ElementType = 'TEXT' | 'FIELD' | 'IMAGE' | 'SIGNATURE' | 'BOX' | 'TABLE';

interface ReportElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  w: number;
  h: number;
  text?: string;
  bindingMode?: BindingMode;
  bindingPath?: string;
  expr?: string;
  fontSize?: number;
  fontWeight?: 'Normal' | 'Medium' | 'Bold';
  src?: string;
  columns?: string[];
  dataPath?: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  version: string;
  status: Status;
  elements: ReportElement[];
  createdBy: string;
  createdAt: string;
}

interface UserOption {
  id: string;
  label: string;
  role: Role;
}

@Component({
  selector: 'app-loms-report-builder-page',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, NgClass, FormsModule, LomsLayoutComponent],
  templateUrl: './report-builder.page.html',
})
export class LomsReportBuilderPageComponent {
  private readonly STORAGE_KEY = 'loms_report_builder_templates';
  private readonly INBOX_KEY = 'loms_report_inbox';
  private readonly SCALE = 3.78;

  scale = this.SCALE;

  role: Role = 'Designer';
  currentUserId = 'farhan';
  users: UserOption[] = [
    { id: 'farhan', label: 'Md. Farhan Rahman (Designer)', role: 'Designer' },
    { id: 'sajid', label: 'Sajid Ahmed (Checker)', role: 'Checker' },
    { id: 'nusrat', label: 'Nusrat Jahan (Admin)', role: 'Admin' },
  ];

  tabs: TabKey[] = ['Designer', 'DataMapping', 'Preview', 'Inbox'];

  activeTab: TabKey = 'Designer';

  templates: ReportTemplate[] = [];
  inbox: ReportTemplate[] = [];

  selectedTemplateId: string | null = null;
  showCreateInput = false;
  newTemplateName = '';
  searchTerm = '';

  draggingId: string | null = null;
  dragOffsetX = 0;
  dragOffsetY = 0;
  dragStartClientX = 0;
  dragStartClientY = 0;
  dragStartElX = 0;
  dragStartElY = 0;

  selectedElementId: string | null = null;

  showGrid = true;

  previewDataKey = 'Retail Home Loan';
  dataPaths: string[] = [];

  history: ReportTemplate[][] = [];
  historyIndex = -1;

  editingElementId: string | null = null;
  editingValue = '';

  dataSources: Record<string, any> = {
    name: 'Retail Sanction Letter',
    application: {
      id: 'APP-2026-001',
      product: 'Home Loan',
      amountRequested: 5000000,
      tenure: 120,
      createdAt: new Date().toLocaleDateString('bn-BD'),
    },
    customer: {
      name: 'Md. Arafat Hossain',
      address: 'Dhanmondi, Dhaka',
      nid: '1990123456',
    },
    charges: {
      processingFee: 15000,
      total: 5015000,
    },
    facilities: [
      { name: 'Term Loan', amount: 5000000, currency: 'BDT' },
      { name: 'Processing Fee', amount: 15000, currency: 'BDT' },
    ],
  };

  previewSets = [
    { label: 'Retail Home Loan', key: 'Retail Home Loan' },
    { label: 'SME Loan', key: 'SME Loan' },
  ];

  constructor() {
    this.load();
    if (this.templates.length === 0) {
      this.createInitialTemplates();
    }
    this.initHistory();
    this.updateDataPaths();
  }

  get selectedTemplate(): ReportTemplate | undefined {
    return this.templates.find(t => t.id === this.selectedTemplateId);
  }

  get elements(): ReportElement[] {
    return this.selectedTemplate?.elements || [];
  }

  get selectedElement(): ReportElement | undefined {
    return this.elements.find(e => e.id === this.selectedElementId);
  }

  get filteredTemplates(): ReportTemplate[] {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) return this.templates;
    return this.templates.filter(t => t.name.toLowerCase().includes(query));
  }

  setActiveTab(tab: TabKey): void {
    this.activeTab = tab;
  }

  onUserChange(): void {
    const user = this.users.find(u => u.id === this.currentUserId);
    if (user) {
      this.role = user.role;
    }
  }

  createInitialTemplates(): void {
    const t: ReportTemplate = {
      id: 'TMP-001',
      name: 'Retail Sanction Letter v1',
      version: 'v1.0',
      status: 'PUBLISHED',
      elements: [
        { id: 'E-1', type: 'TEXT', x: 80, y: 25, w: 80, h: 12, text: 'SANCTION LETTER', fontSize: 16, fontWeight: 'Bold' },
        { id: 'E-2', type: 'FIELD', x: 60, y: 45, w: 60, h: 10, text: '{application.createdAt}', bindingMode: 'path', bindingPath: 'application.createdAt', fontSize: 12, fontWeight: 'Normal' },
        { id: 'E-3', type: 'FIELD', x: 60, y: 60, w: 80, h: 10, text: '{customer.name}', bindingMode: 'path', bindingPath: 'customer.name', fontSize: 12, fontWeight: 'Bold' },
        { id: 'E-4', type: 'FIELD', x: 60, y: 72, w: 80, h: 10, text: '{customer.address}', bindingMode: 'path', bindingPath: 'customer.address', fontSize: 12, fontWeight: 'Normal' },
      ],
      createdBy: 'Md. Farhan Rahman',
      createdAt: new Date().toLocaleDateString('bn-BD'),
    };
    this.templates = [t];
    this.selectedTemplateId = t.id;
    this.save();
  }

  toggleCreate(): void {
    this.showCreateInput = !this.showCreateInput;
    this.newTemplateName = '';
  }

  createTemplate(): void {
    const name = this.newTemplateName.trim();
    if (!name) return;
    const id = `TMP-${Date.now()}`;
    const t: ReportTemplate = {
      id,
      name,
      version: 'v0.1',
      status: 'DRAFT',
      elements: [],
      createdBy: 'Md. Farhan Rahman',
      createdAt: new Date().toLocaleDateString('bn-BD'),
    };
    this.templates.unshift(t);
    this.selectedTemplateId = id;
    this.showCreateInput = false;
    this.newTemplateName = '';
    this.save();
  }

  setSelectedTemplate(id: string): void {
    this.selectedTemplateId = id;
    this.selectedElementId = null;
  }

  addElement(type: ElementType): void {
    this.addElementAt(type, 30, 30);
  }

  addElementAt(type: ElementType, x: number, y: number): void {
    if (!this.selectedTemplate) return;
    const id = `E-${Date.now()}`;
    const e: ReportElement = { id, type, x, y, w: 40, h: 10, fontSize: 12, fontWeight: 'Normal' };
    if (type === 'TEXT') e.text = 'New TEXT';
    if (type === 'FIELD') {
      e.text = '{field}';
      e.bindingMode = 'path';
      e.bindingPath = '';
    }
    if (type === 'IMAGE') e.src = '';
    if (type === 'SIGNATURE') e.text = 'SIGNATURE';
    if (type === 'BOX') e.text = '';
    if (type === 'TABLE') {
      e.columns = ['Facility', 'Amount', 'Currency'];
      e.dataPath = 'facilities';
      e.w = 80;
      e.h = 30;
    }
    this.selectedTemplate.elements.push(e);
    this.selectedElementId = e.id;
    this.commitHistory();
    this.save();
  }

  onPaletteMouseDown(event: MouseEvent, type: ElementType): void {
    const canvas = document.getElementById('canvas');
    if (!canvas) {
      this.addElement(type);
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / this.SCALE;
    const y = (event.clientY - rect.top) / this.SCALE;
    this.addElementAt(type, Math.max(0, Math.round(x)), Math.max(0, Math.round(y)));
    const created = this.elements[this.elements.length - 1];
    if (created) {
      this.draggingId = created.id;
      this.dragOffsetX = (created.w * this.SCALE) / 2;
      this.dragOffsetY = (created.h * this.SCALE) / 2;
    }
  }

  selectElement(id: string): void {
    this.selectedElementId = id;
  }

  deleteElement(id: string): void {
    if (!this.selectedTemplate) return;
    this.selectedTemplate.elements = this.selectedTemplate.elements.filter(e => e.id !== id);
    if (this.selectedElementId === id) this.selectedElementId = null;
    if (this.editingElementId === id) {
      this.editingElementId = null;
      this.editingValue = '';
    }
    this.commitHistory();
    this.save();
  }

  saveDraft(): void {
    if (!this.selectedTemplate) return;
    this.selectedTemplate.status = 'DRAFT';
    this.commitHistory();
    this.save();
  }

  submitForApproval(): void {
    if (!this.selectedTemplate) return;
    this.selectedTemplate.status = 'PENDING';
    const pending = { ...this.selectedTemplate };
    this.inbox = [pending, ...this.inbox.filter(i => i.id !== pending.id)];
    this.persistInbox();
    this.commitHistory();
    this.save();
  }

  publish(): void {
    if (!this.selectedTemplate) return;
    if (this.selectedTemplate.status !== 'APPROVED') return;
    this.selectedTemplate.status = 'PUBLISHED';
    this.commitHistory();
    this.save();
  }

  get isChecker(): boolean {
    return this.role === 'Checker';
  }

  get inboxItems(): ReportTemplate[] {
    return this.inbox.filter(i => i.status === 'PENDING');
  }

  approve(id: string): void {
    const t = this.templates.find(x => x.id === id);
    if (t) {
      t.status = 'APPROVED';
      this.commitHistory();
      this.save();
    }
    this.inbox = this.inbox.filter(i => i.id !== id);
    this.persistInbox();
  }

  reject(id: string): void {
    const t = this.templates.find(x => x.id === id);
    if (t) {
      t.status = 'DRAFT';
      this.commitHistory();
      this.save();
    }
    this.inbox = this.inbox.filter(i => i.id !== id);
    this.persistInbox();
  }

  getCanvasStyle(): Record<string, string> {
    const bg = this.showGrid
      ? 'repeating-linear-gradient(0deg,#f1f5f9,#f1f5f9 1px,transparent 1px,transparent 12px),repeating-linear-gradient(90deg,#f1f5f9,#f1f5f9 1px,transparent 1px,transparent 12px)'
      : 'white';
    return {
      width: `${210 * this.SCALE}px`,
      height: `${297 * this.SCALE}px`,
      backgroundImage: bg,
    };
  }

  onElementMouseDown(e: MouseEvent, el: ReportElement): void {
    const target = e.target as HTMLElement;
    if (target.getAttribute('data-resize') === 'true') return;
    this.draggingId = el.id;
    this.dragStartClientX = e.clientX;
    this.dragStartClientY = e.clientY;
    this.dragStartElX = el.x;
    this.dragStartElY = el.y;
  }

  onCanvasMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.id !== 'canvas') {
      return;
    }
    this.selectedElementId = null;
    this.finishInlineEdit();
  }

  onCanvasMouseUp(): void {
    this.draggingId = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.commitHistory();
    this.save();
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(e: MouseEvent): void {
    if (!this.draggingId || !this.selectedTemplate) return;
    const el = this.selectedTemplate.elements.find(x => x.id === this.draggingId);
    if (!el) return;
    const dx = (e.clientX - this.dragStartClientX) / this.SCALE;
    const dy = (e.clientY - this.dragStartClientY) / this.SCALE;
    const x = this.dragStartElX + dx;
    const y = this.dragStartElY + dy;
    el.x = Math.max(0, Math.min(210 - el.w, Math.round(x)));
    el.y = Math.max(0, Math.min(297 - el.h, Math.round(y)));
  }

  resize(el: ReportElement, edge: 'right' | 'bottom', px: number): void {
    if (edge === 'right') el.w = Math.max(10, Math.min(210 - el.x, Math.round(px / this.SCALE)));
    if (edge === 'bottom') el.h = Math.max(8, Math.min(297 - el.y, Math.round(px / this.SCALE)));
  }

  setBindingFromPath(path: string): void {
    if (!this.selectedElement) return;
    this.selectedElement.bindingMode = 'path';
    this.selectedElement.bindingPath = path;
    this.selectedElement.text = `{${path}}`;
    this.commitHistory();
    this.save();
  }

  getValue(el: ReportElement): any {
    if (el.type === 'TEXT') return el.text || '';
    if (el.type === 'SIGNATURE') return 'SIGNATURE';
    if (el.type === 'FIELD') {
      if (el.bindingMode === 'path' && el.bindingPath) {
        return this.resolvePath(this.dataSources, el.bindingPath);
      }
      if (el.bindingMode === 'expr' && el.expr) {
        try {
          const fn = new Function('data', `return ${el.expr}`);
          return fn(this.dataSources);
        } catch {
          return '';
        }
      }
      return el.text || '';
    }
    return '';
  }

  resolvePath(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  }

  toggleGrid(): void {
    this.showGrid = !this.showGrid;
  }

  changePreviewSet(key: string): void {
    this.previewDataKey = key;
    if (key === 'SME Loan') {
      this.dataSources = {
        name: 'SME Approval Memo',
        application: {
          id: 'APP-2026-102',
          product: 'SME Loan',
          amountRequested: 12000000,
          tenure: 60,
          createdAt: new Date().toLocaleDateString('bn-BD'),
        },
        customer: {
          name: 'Farzana Islam',
          address: 'Chittagong',
          nid: '1987654321',
        },
        charges: {
          processingFee: 30000,
          total: 12030000,
        },
        facilities: [
          { name: 'Working Capital', amount: 12000000, currency: 'BDT' },
          { name: 'Processing Fee', amount: 30000, currency: 'BDT' },
        ],
      };
    } else {
      this.dataSources = {
        name: 'Retail Sanction Letter',
        application: {
          id: 'APP-2026-001',
          product: 'Home Loan',
          amountRequested: 5000000,
          tenure: 120,
          createdAt: new Date().toLocaleDateString('bn-BD'),
        },
        customer: {
          name: 'Md. Arafat Hossain',
          address: 'Dhanmondi, Dhaka',
          nid: '1990123456',
        },
        charges: {
          processingFee: 15000,
          total: 5015000,
        },
        facilities: [
          { name: 'Term Loan', amount: 5000000, currency: 'BDT' },
          { name: 'Processing Fee', amount: 15000, currency: 'BDT' },
        ],
      };
    }
    this.updateDataPaths();
  }

  getTableRows(el: ReportElement): any[] {
    if (!el.dataPath) return [];
    const rows = this.resolvePath(this.dataSources, el.dataPath);
    return Array.isArray(rows) ? rows : [];
  }

  updateDataPaths(): void {
    const paths: string[] = [];
    const visit = (obj: any, prefix: string) => {
      if (Array.isArray(obj)) return;
      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          const value = obj[key];
          const current = prefix ? `${prefix}.${key}` : key;
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            visit(value, current);
          } else {
            paths.push(current);
          }
        });
      }
    };
    visit(this.dataSources, '');
    this.dataPaths = paths;
  }

  resetDemo(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.INBOX_KEY);
    this.templates = [];
    this.inbox = [];
    this.selectedTemplateId = null;
    this.createInitialTemplates();
    this.initHistory();
    this.updateDataPaths();
  }

  saveAndCommit(): void {
    this.commitHistory();
    this.save();
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (!input?.files || input.files.length === 0) return;
    const file = input.files[0];
    if (!this.selectedElement || this.selectedElement.type !== 'IMAGE') return;
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedElement!.src = typeof reader.result === 'string' ? reader.result : '';
      this.commitHistory();
      this.save();
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  startInlineEdit(el: ReportElement): void {
    if (el.type !== 'TEXT' && el.type !== 'FIELD') return;
    this.editingElementId = el.id;
    this.editingValue = el.text || '';
  }

  finishInlineEdit(): void {
    if (!this.editingElementId) return;
    const el = this.elements.find(e => e.id === this.editingElementId);
    if (el) {
      el.text = this.editingValue;
      this.commitHistory();
      this.save();
    }
    this.editingElementId = null;
    this.editingValue = '';
  }

  isEditing(el: ReportElement): boolean {
    return this.editingElementId === el.id;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      this.undo();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && (event.key.toLowerCase() === 'y' || (event.shiftKey && event.key.toLowerCase() === 'z'))) {
      event.preventDefault();
      this.redo();
      return;
    }
    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (this.selectedElementId) {
        event.preventDefault();
        this.deleteElement(this.selectedElementId);
      }
    }
  }

  canUndo(): boolean {
    return this.historyIndex > 0;
  }

  canRedo(): boolean {
    return this.historyIndex < this.history.length - 1;
  }

  undo(): void {
    if (!this.canUndo()) return;
    this.historyIndex -= 1;
    this.templates = this.cloneTemplates(this.history[this.historyIndex]);
    this.normalizeSelection();
    this.save();
  }

  redo(): void {
    if (!this.canRedo()) return;
    this.historyIndex += 1;
    this.templates = this.cloneTemplates(this.history[this.historyIndex]);
    this.normalizeSelection();
    this.save();
  }

  initHistory(): void {
    this.history = [this.cloneTemplates(this.templates)];
    this.historyIndex = 0;
  }

  commitHistory(): void {
    const snapshot = this.cloneTemplates(this.templates);
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    const last = this.history[this.history.length - 1];
    if (JSON.stringify(last) !== JSON.stringify(snapshot)) {
      this.history.push(snapshot);
      this.historyIndex = this.history.length - 1;
    }
  }

  cloneTemplates(list: ReportTemplate[]): ReportTemplate[] {
    return JSON.parse(JSON.stringify(list)) as ReportTemplate[];
  }

  normalizeSelection(): void {
    if (!this.selectedTemplateId || !this.templates.find(t => t.id === this.selectedTemplateId)) {
      this.selectedTemplateId = this.templates[0]?.id ?? null;
    }
    this.selectedElementId = null;
    this.editingElementId = null;
    this.editingValue = '';
  }

  save(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.templates));
  }

  load(): void {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    const ib = localStorage.getItem(this.INBOX_KEY);
    this.templates = raw ? JSON.parse(raw) : [];
    this.inbox = ib ? JSON.parse(ib) : [];
    if (!this.selectedTemplateId && this.templates.length > 0) {
      this.selectedTemplateId = this.templates[0].id;
    }
  }

  persistInbox(): void {
    localStorage.setItem(this.INBOX_KEY, JSON.stringify(this.inbox));
  }
}

