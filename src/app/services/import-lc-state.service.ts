import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ImportLcRequest {
  requestType: string;
  lcType: string;
  purposeOfImport: string;
  applicantName: string;
  accountNumber: string;
  contactEmail: string;
  contactPhone: string;
  beneficiaryName: string;
  beneficiaryCountry: string;
  beneficiaryBankName: string;
  beneficiaryBankCountry: string;
  poReference: string;
  poReferenceFileName?: string;
  invoiceDate: string;
  invoiceAmount: string;
  currency: string;
  goodsDescription: string;
  quantity: string;
  shipmentPeriod: string;
  portOfLoading: string;
  portOfDischarge: string;
  incoterm: string;
  partialShipmentAllowed: 'yes' | 'no' | '';
  transshipmentAllowed: 'yes' | 'no' | '';
  preferredIssuingBranch: string;
  preferredAdvisingBank: string;
  remarks: string;
  confirm: boolean;
  poReferenceFile?: File | null;
  lcReference: string;
  lcReferences: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ImportLcStateService {
  private initialState: ImportLcRequest = {
    requestType: 'Initiate Import Letter of Credit',
    lcType: '',
    purposeOfImport: '',
    applicantName: '',
    accountNumber: '',
    contactEmail: '',
    contactPhone: '',
    beneficiaryName: '',
    beneficiaryCountry: '',
    beneficiaryBankName: '',
    beneficiaryBankCountry: '',
    poReference: '',
    invoiceDate: '',
    invoiceAmount: '',
    currency: '',
    goodsDescription: '',
    quantity: '',
    shipmentPeriod: '',
    portOfLoading: '',
    portOfDischarge: '',
    incoterm: '',
    partialShipmentAllowed: '',
    transshipmentAllowed: '',
    preferredIssuingBranch: '',
    preferredAdvisingBank: '',
    remarks: '',
    confirm: false,
    poReferenceFile: null,
    lcReference: '',
    lcReferences: []
  };

  private stateSubject = new BehaviorSubject<ImportLcRequest>(this.initialState);
  state$ = this.stateSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  updateState(newState: Partial<ImportLcRequest>) {
    const currentState = this.stateSubject.getValue();
    const updatedState = { ...currentState, ...newState };
    this.stateSubject.next(updatedState);
    this.saveToStorage(updatedState);
  }

  getState(): ImportLcRequest {
    return this.stateSubject.getValue();
  }

  resetState() {
    this.stateSubject.next(this.initialState);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('importLcState');
    }
  }

  private saveToStorage(state: ImportLcRequest) {
    if (typeof window !== 'undefined') {
      // Exclude File object from localStorage
      const { poReferenceFile, ...stateToSave } = state;
      localStorage.setItem('importLcState', JSON.stringify(stateToSave));
    }
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('importLcState');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          this.stateSubject.next({ ...this.initialState, ...parsed });
        } catch (e) {
          console.error('Failed to load state', e);
        }
      }
    }
  }
}
