import { CommonModule, NgIf, NgFor, NgClass, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';

type FormProduct = 'Retail Loan' | 'SME Loan' | 'Credit Card';
type FormRole = 'Maker' | 'Checker' | 'Risk Officer' | 'Approver' | 'Branch Manager' | 'Admin';
type FormStatus = 'NONE' | 'DRAFT' | 'ACTIVE';
type FormFieldType = 'text' | 'number' | 'date' | 'dropdown' | 'radio';

interface FormFieldCondition {
  fieldKey: string;
  operator: 'equals' | 'notEquals';
  value: string;
}

interface FormField {
  id: string;
  label: string;
  key: string;
  type: FormFieldType;
  section: string;
  placeholder: string;
  defaultValue: string;
  tooltip: string;
  minValue: string;
  maxValue: string;
  visible: boolean;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  optional: boolean;
  validationRule: 'None' | 'Regex' | 'MinMax';
  validationPattern: string;
  condition?: FormFieldCondition;
}

interface FormDefinition {
  id: string;
  name: string;
  version: number;
  product: FormProduct;
  roles: FormRole[];
  status: FormStatus;
  fields: FormField[];
}

interface FieldModalState {
  label: string;
  key: string;
  type: FormFieldType | '';
  section: string;
  validationRule: 'None' | 'Regex' | 'MinMax';
  placeholder: string;
  defaultValue: string;
  tooltip: string;
  minValue: string;
  maxValue: string;
  visible: boolean;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  optional: boolean;
  conditionFieldKey: string;
  conditionOperator: 'equals' | 'notEquals';
  conditionValue: string;
}

@Component({
  selector: 'app-loms-form-builder-page',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    FormsModule,
    LomsLayoutComponent
  ],
  templateUrl: './form-builder.page.html'
})
export class LomsFormBuilderPageComponent {
  private readonly STORAGE_KEY = 'loms_form_builder_forms';

  products: FormProduct[] = ['Retail Loan', 'SME Loan', 'Credit Card'];
  roles: FormRole[] = ['Maker', 'Checker', 'Risk Officer', 'Approver', 'Branch Manager', 'Admin'];

  forms: FormDefinition[] = [];

  selectedProduct: FormProduct | '' = '';
  selectedRoles: FormRole[] = [];
  selectedFormId: string | '' = '';

  sectionFilter = 'All Sections';
  showOnlyChanged = false;
  showOnlyMandatory = false;

  status: FormStatus = 'NONE';

  previewModel: Record<string, any> = {};

  showCreateFormModal = false;
  createFormName = '';
  createFormProduct: FormProduct | '' = '';
  createFormRoles: FormRole[] = [];

  showFieldModal = false;
  fieldModalMode: 'create' | 'edit' = 'create';
  editingFieldId: string | null = null;
  fieldModal: FieldModalState = this.createEmptyFieldModal();

  changedFieldIds = new Set<string>();

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        try {
          this.forms = JSON.parse(stored) as FormDefinition[];
        } catch {
          this.forms = this.createSeedForms();
          this.persist();
        }
      } else {
        this.forms = this.createSeedForms();
        this.persist();
      }
    } else {
      this.forms = this.createSeedForms();
    }
  }

  get availableForms(): FormDefinition[] {
    if (!this.selectedProduct) {
      return this.forms;
    }
    return this.forms.filter(f => f.product === this.selectedProduct);
  }

  get currentForm(): FormDefinition | undefined {
    if (!this.selectedFormId) {
      return undefined;
    }
    return this.forms.find(f => f.id === this.selectedFormId);
  }

  get sectionOptions(): string[] {
    const form = this.currentForm;
    if (!form) {
      return [];
    }
    const sections = new Set<string>();
    form.fields.forEach(f => {
      if (f.section.trim()) {
        sections.add(f.section.trim());
      }
    });
    return Array.from(sections.values());
  }

  get filteredFields(): FormField[] {
    const form = this.currentForm;
    if (!form) {
      return [];
    }
    return form.fields.filter(f => {
      if (this.sectionFilter !== 'All Sections' && f.section !== this.sectionFilter) {
        return false;
      }
      if (this.showOnlyMandatory && !f.required) {
        return false;
      }
      if (this.showOnlyChanged && !this.changedFieldIds.has(f.id)) {
        return false;
      }
      return true;
    });
  }

  onSelectProduct(product: FormProduct | ''): void {
    this.selectedProduct = product;
    const forms = this.availableForms;
    if (forms.length) {
      this.selectForm(forms[0].id);
    } else {
      this.selectedFormId = '';
      this.status = 'NONE';
    }
  }

  toggleRole(role: FormRole): void {
    const index = this.selectedRoles.indexOf(role);
    if (index >= 0) {
      this.selectedRoles.splice(index, 1);
    } else {
      this.selectedRoles.push(role);
    }
    const form = this.currentForm;
    if (form) {
      form.roles = [...this.selectedRoles];
      this.persist();
    }
  }

  selectForm(formId: string): void {
    this.selectedFormId = formId;
    const form = this.currentForm;
    if (!form) {
      this.status = 'NONE';
      this.selectedRoles = [];
      this.previewModel = {};
      this.sectionFilter = 'All Sections';
      this.changedFieldIds.clear();
      return;
    }
    this.status = form.status;
    this.selectedProduct = form.product;
    this.selectedRoles = [...form.roles];
    this.previewModel = {};
    form.fields.forEach(f => {
      if (f.defaultValue !== undefined) {
        this.previewModel[f.key] = f.defaultValue;
      }
    });
    this.sectionFilter = 'All Sections';
    this.changedFieldIds.clear();
  }

  openCreateForm(): void {
    this.showCreateFormModal = true;
    this.createFormName = '';
    this.createFormProduct = this.selectedProduct || '';
    this.createFormRoles = this.selectedRoles.length ? [...this.selectedRoles] : [];
  }

  toggleCreateFormRole(role: FormRole): void {
    const index = this.createFormRoles.indexOf(role);
    if (index >= 0) {
      this.createFormRoles.splice(index, 1);
    } else {
      this.createFormRoles.push(role);
    }
  }

  cancelCreateForm(): void {
    this.showCreateFormModal = false;
    this.createFormName = '';
    this.createFormProduct = '';
    this.createFormRoles = [];
  }

  confirmCreateForm(): void {
    const name = this.createFormName.trim();
    if (!name || !this.createFormProduct || !this.createFormRoles.length) {
      return;
    }
    const newForm: FormDefinition = {
      id: this.generateId(),
      name,
      version: 1,
      product: this.createFormProduct,
      roles: [...this.createFormRoles],
      status: 'DRAFT',
      fields: []
    };
    this.forms.push(newForm);
    this.persist();
    this.selectForm(newForm.id);
    this.selectedProduct = newForm.product;
    this.selectedRoles = [...newForm.roles];
    this.cancelCreateForm();
  }

  cloneForm(): void {
    const form = this.currentForm;
    if (!form) {
      return;
    }
    const cloned: FormDefinition = {
      id: this.generateId(),
      name: `${form.name} (Clone)`,
      version: form.version + 1,
      product: form.product,
      roles: [...form.roles],
      status: 'DRAFT',
      fields: form.fields.map(f => ({
        ...f,
        id: this.generateId()
      }))
    };
    this.forms.push(cloned);
    this.persist();
    this.selectForm(cloned.id);
  }

  resetForm(): void {
    const form = this.currentForm;
    if (!form) {
      return;
    }
    const seedForms = this.createSeedForms();
    const seed = seedForms.find(f => f.product === form.product && f.name === form.name);
    if (!seed) {
      return;
    }
    form.fields = seed.fields.map(f => ({ ...f, id: this.generateId() }));
    form.status = 'DRAFT';
    this.status = 'DRAFT';
    this.changedFieldIds.clear();
    this.previewModel = {};
    form.fields.forEach(f => {
      if (f.defaultValue !== undefined) {
        this.previewModel[f.key] = f.defaultValue;
      }
    });
    this.persist();
  }

  saveDraft(): void {
    const form = this.currentForm;
    if (!form) {
      return;
    }
    form.status = 'DRAFT';
    this.status = 'DRAFT';
    this.persist();
  }

  publish(): void {
    const form = this.currentForm;
    if (!form) {
      return;
    }
    if (!form.fields.length) {
      return;
    }
    form.status = 'ACTIVE';
    this.status = 'ACTIVE';
    this.persist();
  }

  openAddField(): void {
    if (!this.currentForm) {
      return;
    }
    this.fieldModalMode = 'create';
    this.editingFieldId = null;
    this.fieldModal = this.createEmptyFieldModal();
    this.showFieldModal = true;
  }

  openEditField(field: FormField): void {
    this.fieldModalMode = 'edit';
    this.editingFieldId = field.id;
    this.fieldModal = {
      label: field.label,
      key: field.key,
      type: field.type,
      section: field.section,
      validationRule: field.validationRule,
      placeholder: field.placeholder,
      defaultValue: field.defaultValue,
      tooltip: field.tooltip,
      minValue: field.minValue,
      maxValue: field.maxValue,
      visible: field.visible,
      disabled: field.disabled,
      readOnly: field.readOnly,
      required: field.required,
      optional: field.optional,
      conditionFieldKey: field.condition?.fieldKey || '',
      conditionOperator: field.condition?.operator || 'equals',
      conditionValue: field.condition?.value || ''
    };
    this.showFieldModal = true;
  }

  closeFieldModal(): void {
    this.showFieldModal = false;
    this.editingFieldId = null;
  }

  saveField(): void {
    const form = this.currentForm;
    if (!form) {
      return;
    }
    const modal = this.fieldModal;
    if (!modal.label.trim() || !modal.key.trim() || !modal.type) {
      return;
    }
    const condition =
      modal.conditionFieldKey && modal.conditionValue
        ? {
            fieldKey: modal.conditionFieldKey,
            operator: modal.conditionOperator,
            value: modal.conditionValue
          }
        : undefined;
    if (this.fieldModalMode === 'create') {
      const newField: FormField = {
        id: this.generateId(),
        label: modal.label.trim(),
        key: modal.key.trim(),
        type: modal.type,
        section: modal.section.trim(),
        placeholder: modal.placeholder,
        defaultValue: modal.defaultValue,
        tooltip: modal.tooltip,
        minValue: modal.minValue,
        maxValue: modal.maxValue,
        visible: modal.visible,
        disabled: modal.disabled,
        readOnly: modal.readOnly,
        required: modal.required,
        optional: modal.optional,
        validationRule: modal.validationRule,
        validationPattern: modal.validationRule === 'Regex' ? modal.minValue : '',
        condition
      };
      form.fields.push(newField);
      this.changedFieldIds.add(newField.id);
    } else if (this.editingFieldId) {
      const index = form.fields.findIndex(f => f.id === this.editingFieldId);
      if (index >= 0) {
        const existing = form.fields[index];
        const updated: FormField = {
          ...existing,
          label: modal.label.trim(),
          key: modal.key.trim(),
          type: modal.type,
          section: modal.section.trim(),
          placeholder: modal.placeholder,
          defaultValue: modal.defaultValue,
          tooltip: modal.tooltip,
          minValue: modal.minValue,
          maxValue: modal.maxValue,
          visible: modal.visible,
          disabled: modal.disabled,
          readOnly: modal.readOnly,
          required: modal.required,
          optional: modal.optional,
          validationRule: modal.validationRule,
          validationPattern: modal.validationRule === 'Regex' ? modal.minValue : '',
          condition
        };
        form.fields[index] = updated;
        this.changedFieldIds.add(updated.id);
      }
    }
    this.persist();
    this.showFieldModal = false;
    this.editingFieldId = null;
  }

  toggleFieldFlag(field: FormField, flag: 'visible' | 'disabled' | 'readOnly' | 'required' | 'optional'): void {
    field[flag] = !field[flag];
    this.changedFieldIds.add(field.id);
    this.persist();
  }

  removeField(field: FormField): void {
    const form = this.currentForm;
    if (!form) {
      return;
    }
    const index = form.fields.findIndex(f => f.id === field.id);
    if (index >= 0) {
      form.fields.splice(index, 1);
      this.changedFieldIds.delete(field.id);
      this.persist();
    }
  }

  onPreviewValueChange(field: FormField, value: any): void {
    this.previewModel[field.key] = value;
  }

  shouldShowField(field: FormField): boolean {
    if (!field.condition) {
      return field.visible;
    }
    const baseVisible = field.visible;
    const otherValue = this.previewModel[field.condition.fieldKey];
    if (field.condition.operator === 'equals') {
      return baseVisible && otherValue === field.condition.value;
    }
    return baseVisible && otherValue !== field.condition.value;
  }

  getFieldTypeLabel(field: FormField): string {
    if (field.type === 'dropdown') {
      return 'dropdown';
    }
    if (field.type === 'number') {
      return 'number';
    }
    if (field.type === 'date') {
      return 'date';
    }
    if (field.type === 'radio') {
      return 'radio';
    }
    return 'text';
  }

  get validationLabel(): string {
    const form = this.currentForm;
    if (!form) {
      return '';
    }
    const hasRegex = form.fields.some(f => f.validationRule === 'Regex');
    if (hasRegex) {
      return 'Regex';
    }
    return 'None';
  }

  private createEmptyFieldModal(): FieldModalState {
    return {
      label: '',
      key: '',
      type: '',
      section: '',
      validationRule: 'None',
      placeholder: '',
      defaultValue: '',
      tooltip: '',
      minValue: '',
      maxValue: '',
      visible: true,
      disabled: false,
      readOnly: false,
      required: false,
      optional: false,
      conditionFieldKey: '',
      conditionOperator: 'equals',
      conditionValue: ''
    };
  }

  private createSeedForms(): FormDefinition[] {
    const addressForm: FormDefinition = {
      id: this.generateId(),
      name: 'Address (Standard)',
      version: 1,
      product: 'Retail Loan',
      roles: ['Maker', 'Checker'],
      status: 'ACTIVE',
      fields: [
        {
          id: this.generateId(),
          label: 'Street Address',
          key: 'street_addr',
          type: 'text',
          section: 'ADDRESS',
          placeholder: '',
          defaultValue: '',
          tooltip: '',
          minValue: '',
          maxValue: '',
          visible: true,
          disabled: false,
          readOnly: false,
          required: true,
          optional: false,
          validationRule: 'None',
          validationPattern: ''
        },
        {
          id: this.generateId(),
          label: 'City',
          key: 'city',
          type: 'text',
          section: 'ADDRESS',
          placeholder: '',
          defaultValue: '',
          tooltip: '',
          minValue: '',
          maxValue: '',
          visible: true,
          disabled: false,
          readOnly: false,
          required: true,
          optional: false,
          validationRule: 'None',
          validationPattern: ''
        },
        {
          id: this.generateId(),
          label: 'Zip Code',
          key: 'zip',
          type: 'number',
          section: 'ADDRESS',
          placeholder: '',
          defaultValue: '',
          tooltip: '',
          minValue: '',
          maxValue: '',
          visible: true,
          disabled: false,
          readOnly: false,
          required: true,
          optional: false,
          validationRule: 'Regex',
          validationPattern: '^[0-9]{4,6}$'
        },
        {
          id: this.generateId(),
          label: 'Country',
          key: 'country',
          type: 'dropdown',
          section: 'ADDRESS',
          placeholder: '',
          defaultValue: '',
          tooltip: '',
          minValue: '',
          maxValue: '',
          visible: true,
          disabled: false,
          readOnly: false,
          required: true,
          optional: false,
          validationRule: 'None',
          validationPattern: ''
        }
      ]
    };

    const kycForm: FormDefinition = {
      id: this.generateId(),
      name: 'KYC Basic',
      version: 1,
      product: 'SME Loan',
      roles: ['Maker', 'Risk Officer'],
      status: 'DRAFT',
      fields: [
        {
          id: this.generateId(),
          label: 'Full Name',
          key: 'full_name',
          type: 'text',
          section: 'PERSONAL INFO',
          placeholder: '',
          defaultValue: '',
          tooltip: '',
          minValue: '',
          maxValue: '',
          visible: true,
          disabled: false,
          readOnly: false,
          required: true,
          optional: false,
          validationRule: 'None',
          validationPattern: ''
        },
        {
          id: this.generateId(),
          label: 'Date of Birth',
          key: 'dob',
          type: 'date',
          section: 'PERSONAL INFO',
          placeholder: '',
          defaultValue: '',
          tooltip: '',
          minValue: '',
          maxValue: '',
          visible: true,
          disabled: false,
          readOnly: false,
          required: true,
          optional: false,
          validationRule: 'None',
          validationPattern: ''
        },
        {
          id: this.generateId(),
          label: 'National ID',
          key: 'nid',
          type: 'text',
          section: 'IDENTITY',
          placeholder: '',
          defaultValue: '',
          tooltip: '',
          minValue: '',
          maxValue: '',
          visible: true,
          disabled: false,
          readOnly: false,
          required: true,
          optional: false,
          validationRule: 'Regex',
          validationPattern: '^[0-9]{10}$'
        },
        {
          id: this.generateId(),
          label: 'Has Passport?',
          key: 'has_passport',
          type: 'radio',
          section: 'IDENTITY',
          placeholder: '',
          defaultValue: '',
          tooltip: '',
          minValue: '',
          maxValue: '',
          visible: true,
          disabled: false,
          readOnly: false,
          required: false,
          optional: true,
          validationRule: 'None',
          validationPattern: ''
        },
        {
          id: this.generateId(),
          label: 'Passport Number',
          key: 'passport_no',
          type: 'text',
          section: 'IDENTITY',
          placeholder: '',
          defaultValue: '',
          tooltip: '',
          minValue: '',
          maxValue: '',
          visible: true,
          disabled: false,
          readOnly: false,
          required: true,
          optional: false,
          validationRule: 'None',
          validationPattern: '',
          condition: {
            fieldKey: 'has_passport',
            operator: 'equals',
            value: 'Yes'
          }
        }
      ]
    };

    return [addressForm, kycForm];
  }

  private generateId(): string {
    return Math.random().toString(36).slice(2, 10);
  }

  private persist(): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.forms));
  }
}
