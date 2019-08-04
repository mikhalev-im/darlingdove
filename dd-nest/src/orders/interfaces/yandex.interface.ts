export enum PaymentRequestStatus {
  Success = 'success',
  Refused = 'refused',
}

export interface PaymentRequest {
  readonly status: PaymentRequestStatus;
  readonly error: string;
  readonly request_id: string;
  readonly title: string;
}

export enum PaymentProcessStatus {
  Success = 'success',
  Refused = 'refused',
  InProgress = 'in_progress',
  ExtAuthRequired = 'ext_auth_required',
}

export interface PaymentProcess {
  readonly status: PaymentProcessStatus;
  readonly error: string;
  readonly acs_uri: string;
  readonly acs_params: any;
  readonly money_source: any;
  readonly next_retry: number;
  readonly invoice_id: string;
}
