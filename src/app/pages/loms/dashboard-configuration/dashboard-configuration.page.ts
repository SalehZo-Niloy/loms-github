import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';

type PermissionLevel = 'View' | 'Edit' | 'Hide';

interface SectionItem {
  key: string;
  label: string;
}

interface TokenRule {
  id: string;
  field: string;
  operator: string;
}

interface FilterConfig {
  id: string;
  group: string;
  fieldName: string;
  controlType: string;
  dataSource: string;
  allowMultiSelect: boolean;
  visibleByDefault: boolean;
}

interface FilterModalState {
  group: string;
  fieldName: string;
  controlType: string;
  dataSource: string;
  allowMultiSelect: boolean;
  visibleByDefault: boolean;
}

interface ColumnConfig {
  id: string;
  name: string;
  field: string;
  visible: boolean;
  width: number;
  sticky: boolean;
  clickable: boolean;
  order: number;
}

interface PreviewRow {
  [key: string]: string;
}

interface SavedView {
  id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-loms-dashboard-configuration-page',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, NgClass, FormsModule, LomsLayoutComponent],
  templateUrl: './dashboard-configuration.page.html',
})
export class LomsDashboardConfigurationPageComponent {
  sections: SectionItem[] = [
    { key: 'metadata', label: 'Dashboard Metadata' },
    { key: 'search', label: 'Search Configuration' },
    { key: 'filter', label: 'Filter Configuration' },
    { key: 'sort', label: 'Sort Configuration' },
    { key: 'columns', label: 'Column & View' },
    { key: 'roles', label: 'Role & Permission' },
    // { key: 'saved', label: 'Saved Views & Defaults' },
    { key: 'preview', label: 'Preview Dashboard' },
  ];
  activeSection = 'metadata';

  dashboardName = '';
  dashboardCode = `DSH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  description = '';
  status: 'Active' | 'Inactive' = 'Active';
  modules = ['Loan', 'Credit Card', 'SME'];
  selectedModules: string[] = ['Loan'];

  globalSearchEnabled = true;
  searchableFields = [
    'Application ID',
    'Customer Name',
    'CIF',
    'Product',
    'Mobile',
    'Amount',
    'Status',
    'Date',
  ];
  selectedSearchFields: string[] = ['Application ID', 'Customer Name', 'Product', 'Status'];
  searchFieldMap: Record<string, string> = {
    'Application ID': 'app_id',
    'Customer Name': 'customer_name',
    CIF: 'cif',
    Product: 'product',
    Mobile: 'mobile',
    Amount: 'amount',
    Status: 'status',
    Date: 'date',
  };
  sortFieldMap: Record<string, string> = {
    'Application ID': 'app_id',
    'Customer Name': 'customer_name',
    Product: 'product',
    Amount: 'amount',
    Date: 'date',
    Status: 'status',
  };
  filterFieldMap: Record<string, string> = {
    'Loan Type': 'product',
    'Application Status': 'status',
    Stage: 'stage',
    Assignee: 'assignee',
    Branch: 'branch',
    Amount: 'amount',
    Product: 'product',
  };
  tokenRules: TokenRule[] = [
    { id: this.createId(), field: 'Customer Name', operator: 'Contains' },
  ];
  ruleOperators = ['Contains', 'Equals', 'Starts With', 'Ends With'];
  smartSearchEnabled = false;

  filterGroups = ['Product', 'Status', 'Filter', 'Stages', 'Role'];
  filterFields = ['Loan Type', 'Application Status', 'Stage', 'Assignee', 'Branch', 'Amount', 'Product'];
  controlTypes = ['Checkbox', 'Dropdown', 'Multi-select', 'Date', 'Text'];
  dataSources = ['Static', 'Master', 'API'];
  filters: FilterConfig[] = [
    {
      id: this.createId(),
      group: 'Product',
      fieldName: 'Loan Type',
      controlType: 'Dropdown',
      dataSource: 'Master',
      allowMultiSelect: true,
      visibleByDefault: true,
    },
    {
      id: this.createId(),
      group: 'Status',
      fieldName: 'Application Status',
      controlType: 'Dropdown',
      dataSource: 'Static',
      allowMultiSelect: true,
      visibleByDefault: true,
    },
  ];

  showFilterModal = false;
  filterModalMode: 'add' | 'edit' = 'add';
  editingFilterId: string | null = null;
  filterModal: FilterModalState = this.createEmptyFilterModal();

  sortFields = ['Application ID', 'Customer Name', 'Product', 'Amount', 'Date', 'Status'];
  defaultSortField = 'Date';
  defaultSortOrder: 'Ascending' | 'Descending' = 'Descending';
  allowUserSortOverride = true;
  maxSortFieldsAllowed = 1;

  allowColumnVisibility = true;
  allowColumnReordering = true;
  columns: ColumnConfig[] = [
    { id: this.createId(), name: 'Application ID', field: 'app_id', visible: true, width: 120, sticky: false, clickable: true, order: 1 },
    { id: this.createId(), name: 'Customer Name', field: 'customer_name', visible: true, width: 200, sticky: false, clickable: true, order: 2 },
    { id: this.createId(), name: 'Product', field: 'product', visible: true, width: 150, sticky: false, clickable: false, order: 3 },
    { id: this.createId(), name: 'Amount', field: 'amount', visible: true, width: 120, sticky: false, clickable: false, order: 4 },
    { id: this.createId(), name: 'Date', field: 'date', visible: true, width: 120, sticky: false, clickable: false, order: 5 },
    { id: this.createId(), name: 'Status', field: 'status', visible: true, width: 120, sticky: false, clickable: false, order: 6 },
  ];

  roles = ['Agent', 'Branch Officer', 'Risk Officer', 'Ops', 'Manager'];
  roleComponents = ['Search Bar', 'Filters', 'Sort Controls', 'Export Button', 'Column Selector', 'Saved Views', 'Row Actions'];
  permissionOptions: PermissionLevel[] = ['View', 'Edit', 'Hide'];
  rolePermissions: Record<string, Record<string, PermissionLevel>> = {
    'Search Bar': this.mapRolePermissions('View'),
    Filters: { Agent: 'View', 'Branch Officer': 'View', 'Risk Officer': 'View', Ops: 'View', Manager: 'Edit' },
    'Sort Controls': this.mapRolePermissions('View'),
    'Export Button': { Agent: 'Hide', 'Branch Officer': 'View', 'Risk Officer': 'View', Ops: 'Edit', Manager: 'Edit' },
    'Column Selector': { Agent: 'View', 'Branch Officer': 'View', 'Risk Officer': 'View', Ops: 'View', Manager: 'Edit' },
    'Saved Views': { Agent: 'View', 'Branch Officer': 'View', 'Risk Officer': 'View', Ops: 'View', Manager: 'Edit' },
    'Row Actions': { Agent: 'View', 'Branch Officer': 'Edit', 'Risk Officer': 'Edit', Ops: 'Edit', Manager: 'Edit' },
  };

  savedViews: SavedView[] = [
    { id: this.createId(), name: 'Default Worklist', description: 'Standard view for daily processing.' },
    { id: this.createId(), name: 'High Risk Review', description: 'Risk officer focus view with stricter filters.' },
  ];
  defaultViewByRole: Record<string, string> = {
    Agent: 'Default Worklist',
    'Branch Officer': 'Default Worklist',
    'Risk Officer': 'High Risk Review',
    Ops: 'Default Worklist',
    Manager: 'Default Worklist',
  };

  previewRole = 'Agent';
  previewSearchTerm = '';
  previewFilterSelections: Record<string, string> = {};
  previewSortField = this.defaultSortField;
  previewSortOrder: 'Ascending' | 'Descending' = this.defaultSortOrder;
  previewViewSelection = this.defaultViewByRole[this.previewRole];
  showColumnSelector = false;
  previewData: PreviewRow[] = [
    { app_id: 'APP-001', customer_name: 'Rahim Uddin', product: 'SME Loan', amount: 'BDT 1,250,000', date: '2023-10-01', status: 'Pending', stage: 'Application', assignee: 'Sadia Rahman', branch: 'Gulshan' },
    { app_id: 'APP-002', customer_name: 'Farzana Akter', product: 'Retail Loan', amount: 'BDT 2,000,000', date: '2023-10-02', status: 'Approved', stage: 'Approval', assignee: 'Mizanur Rahman', branch: 'Banani' },
    { app_id: 'APP-003', customer_name: 'Mahmud Hasan', product: 'Agri Loan', amount: 'BDT 3,500,000', date: '2023-10-03', status: 'Rejected', stage: 'Review', assignee: 'Sadia Rahman', branch: 'Dhanmondi' },
  ];

  setActiveSection(section: SectionItem): void {
    this.activeSection = section.key;
  }

  isActive(section: SectionItem): boolean {
    return this.activeSection === section.key;
  }

  onPreviewRoleChange(role: string): void {
    this.previewRole = role;
    this.previewViewSelection = this.defaultViewByRole[role] || this.savedViews[0]?.name || '';
  }

  toggleColumnSelector(): void {
    this.showColumnSelector = !this.showColumnSelector;
  }

  toggleModule(module: string): void {
    const index = this.selectedModules.indexOf(module);
    if (index >= 0) {
      this.selectedModules.splice(index, 1);
    } else {
      this.selectedModules.push(module);
    }
  }

  openFilterModal(mode: 'add' | 'edit', filter?: FilterConfig): void {
    this.filterModalMode = mode;
    if (filter) {
      this.editingFilterId = filter.id;
      this.filterModal = {
        group: filter.group,
        fieldName: filter.fieldName,
        controlType: filter.controlType,
        dataSource: filter.dataSource,
        allowMultiSelect: filter.allowMultiSelect,
        visibleByDefault: filter.visibleByDefault,
      };
    } else {
      this.editingFilterId = null;
      this.filterModal = this.createEmptyFilterModal();
    }
    this.showFilterModal = true;
  }

  closeFilterModal(): void {
    this.showFilterModal = false;
  }

  saveFilter(): void {
    if (!this.filterModal.group || !this.filterModal.fieldName || !this.filterModal.controlType || !this.filterModal.dataSource) {
      return;
    }
    if (this.filterModalMode === 'add') {
      this.filters = [
        ...this.filters,
        {
          id: this.createId(),
          group: this.filterModal.group,
          fieldName: this.filterModal.fieldName,
          controlType: this.filterModal.controlType,
          dataSource: this.filterModal.dataSource,
          allowMultiSelect: this.filterModal.allowMultiSelect,
          visibleByDefault: this.filterModal.visibleByDefault,
        },
      ];
    } else if (this.editingFilterId) {
      this.filters = this.filters.map(filter =>
        filter.id === this.editingFilterId
          ? {
              ...filter,
              group: this.filterModal.group,
              fieldName: this.filterModal.fieldName,
              controlType: this.filterModal.controlType,
              dataSource: this.filterModal.dataSource,
              allowMultiSelect: this.filterModal.allowMultiSelect,
              visibleByDefault: this.filterModal.visibleByDefault,
            }
          : filter
      );
    }
    this.showFilterModal = false;
  }

  removeFilter(id: string): void {
    this.filters = this.filters.filter(filter => filter.id !== id);
  }

  addTokenRule(): void {
    this.tokenRules = [
      ...this.tokenRules,
      { id: this.createId(), field: this.searchableFields[0], operator: this.ruleOperators[0] },
    ];
  }

  removeTokenRule(id: string): void {
    this.tokenRules = this.tokenRules.filter(rule => rule.id !== id);
  }

  addColumn(): void {
    const nextOrder = Math.max(...this.columns.map(col => col.order), 0) + 1;
    this.columns = [
      ...this.columns,
      {
        id: this.createId(),
        name: 'New Column',
        field: `field_${nextOrder}`,
        visible: true,
        width: 140,
        sticky: false,
        clickable: false,
        order: nextOrder,
      },
    ];
  }

  moveColumnUp(column: ColumnConfig): void {
    if (!this.allowColumnReordering) return;
    const sorted = this.sortedColumns;
    const index = sorted.findIndex(col => col.id === column.id);
    if (index <= 0) return;
    const target = sorted[index - 1];
    const temp = column.order;
    column.order = target.order;
    target.order = temp;
  }

  moveColumnDown(column: ColumnConfig): void {
    if (!this.allowColumnReordering) return;
    const sorted = this.sortedColumns;
    const index = sorted.findIndex(col => col.id === column.id);
    if (index === -1 || index >= sorted.length - 1) return;
    const target = sorted[index + 1];
    const temp = column.order;
    column.order = target.order;
    target.order = temp;
  }

  addSavedView(): void {
    this.savedViews = [
      ...this.savedViews,
      {
        id: this.createId(),
        name: `View ${this.savedViews.length + 1}`,
        description: 'Custom configuration view.',
      },
    ];
  }

  goToPreview(): void {
    this.activeSection = 'preview';
  }

  resetChanges(): void {
    this.dashboardName = '';
    this.description = '';
    this.selectedModules = ['Loan'];
    this.status = 'Active';
  }

  get sortedColumns(): ColumnConfig[] {
    return [...this.columns].sort((a, b) => a.order - b.order);
  }

  get visibleColumns(): ColumnConfig[] {
    return this.sortedColumns.filter(col => col.visible);
  }

  get previewSearchPlaceholder(): string {
    if (!this.selectedSearchFields.length) {
      return 'Search...';
    }
    return `Search by ${this.selectedSearchFields.join(', ')}...`;
  }

  get previewFilters(): FilterConfig[] {
    return this.filters.filter(filter => filter.visibleByDefault);
  }

  get previewViewName(): string {
    return this.previewViewSelection || this.defaultViewByRole[this.previewRole] || '';
  }

  getFilterOptions(filter: FilterConfig): string[] {
    const key = this.filterFieldMap[filter.fieldName];
    if (!key) {
      return ['All'];
    }
    const values = Array.from(
      new Set(
        this.previewData
          .map(row => row[key])
          .filter(value => !!value)
      )
    ).sort();
    return ['All', ...values];
  }

  get filteredPreviewData(): PreviewRow[] {
    let data = [...this.previewData];
    this.previewFilters.forEach(filter => {
      const key = this.filterFieldMap[filter.fieldName];
      const selected = this.previewFilterSelections[filter.id] || 'All';
      if (!key || selected === 'All') {
        return;
      }
      const selectedValue = selected.toLowerCase();
      data = data.filter(row => (row[key] || '').toLowerCase() === selectedValue);
    });
    if (this.globalSearchEnabled && this.previewSearchTerm.trim()) {
      const term = this.previewSearchTerm.trim().toLowerCase();
      const fields = this.selectedSearchFields.length
        ? this.selectedSearchFields
        : this.searchableFields;
      const keys = fields
        .map(field => this.searchFieldMap[field] || '')
        .filter(Boolean);
      if (keys.length) {
        data = data.filter(row =>
          keys.some(key => (row[key] || '').toLowerCase().includes(term))
        );
      }
    }
    const activeSortField = this.allowUserSortOverride
      ? this.previewSortField || this.defaultSortField
      : this.defaultSortField;
    const activeSortOrder = this.allowUserSortOverride
      ? this.previewSortOrder || this.defaultSortOrder
      : this.defaultSortOrder;
    const sortKey = this.sortFieldMap[activeSortField] || '';
    if (!sortKey) {
      return data;
    }
    const direction = activeSortOrder === 'Ascending' ? 1 : -1;
    return [...data].sort((a, b) => {
      const left = a[sortKey] || '';
      const right = b[sortKey] || '';
      const leftNumber = Number(String(left).replace(/[^0-9.-]/g, ''));
      const rightNumber = Number(String(right).replace(/[^0-9.-]/g, ''));
      if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber)) {
        return (leftNumber - rightNumber) * direction;
      }
      if (left < right) return -1 * direction;
      if (left > right) return 1 * direction;
      return 0;
    });
  }

  getPreviewPermission(component: string): PermissionLevel {
    return this.rolePermissions[component]?.[this.previewRole] || 'View';
  }

  canView(component: string): boolean {
    return this.getPreviewPermission(component) !== 'Hide';
  }

  isEditable(component: string): boolean {
    return this.getPreviewPermission(component) === 'Edit';
  }

  getPreviewCell(row: PreviewRow, field: string): string {
    return row[field] || '—';
  }

  private mapRolePermissions(value: PermissionLevel): Record<string, PermissionLevel> {
    return this.roles.reduce((acc, role) => {
      acc[role] = value;
      return acc;
    }, {} as Record<string, PermissionLevel>);
  }

  private createId(): string {
    return Math.random().toString(36).slice(2, 10);
  }

  private createEmptyFilterModal(): FilterModalState {
    return {
      group: '',
      fieldName: '',
      controlType: '',
      dataSource: '',
      allowMultiSelect: false,
      visibleByDefault: true,
    };
  }
}
