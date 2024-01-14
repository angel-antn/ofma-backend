export interface StripeCustomertRequestInterface {
  object: string;
  url: string;
  has_more: boolean;
  data: Customer[];
}

export interface Customer {
  id: string;
  object: string;
  address: null;
  balance: number;
  created: number;
  currency: null;
  default_source: null;
  delinquent: boolean;
  description: null;
  discount: null;
  email: string;
  invoice_prefix: string;
  invoice_settings: InvoiceSettings;
  livemode: boolean;
  metadata: Metadata;
  name: string;
  next_invoice_sequence: number;
  phone: null;
  preferred_locales: any[];
  shipping: null;
  tax_exempt: string;
  test_clock: null;
}

export interface InvoiceSettings {
  custom_fields: null;
  default_payment_method: null;
  footer: null;
  rendering_options: null;
}

export interface Metadata {}
