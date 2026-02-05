export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'warning';

export type SurfaceLevel =
  | 'page'
  | 'card'
  | 'muted'
  | 'accent';

export type BorderTone =
  | 'default'
  | 'subtle'
  | 'strong'
  | 'accent'
  | 'danger';

export type InputState =
  | 'default'
  | 'filled'
  | 'disabled'
  | 'invalid';

export type TableArea =
  | 'header'
  | 'row'
  | 'rowHover'
  | 'border';

export type StatusVariant =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

export interface TradeTheme {
  page: {
    background: string;
  };
  surface: Record<SurfaceLevel, string>;
  border: Record<BorderTone, string>;
  button: Record<ButtonVariant, string>;
  input: {
    background: Record<InputState, string>;
    border: Record<InputState, string>;
  };
  table: Record<TableArea, string>;
  status: Record<StatusVariant, string>;
  text: {
    primary: string;
    secondary: string;
    muted: string;
    onPrimary: string;
    onDanger: string;
    onSuccess: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
}

export const tradeTheme: TradeTheme = {
  page: {
    background: 'bg-white'
  },
  surface: {
    page: 'bg-white',
    card: 'bg-white',
    muted: 'bg-white',
    accent: 'bg-blue-50'
  },
  border: {
    default: 'border-blue-100',
    subtle: 'border-blue-50',
    strong: 'border-blue-200',
    accent: 'border-blue-300',
    danger: 'border-blue-400'
  },
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-white border border-blue-300 text-blue-700 hover:bg-blue-50',
    ghost: 'bg-transparent text-blue-700 hover:bg-blue-50',
    danger: 'bg-blue-800 hover:bg-blue-900 text-white',
    success: 'bg-blue-500 hover:bg-blue-600 text-white',
    warning: 'bg-blue-400 hover:bg-blue-500 text-white'
  },
  input: {
    background: {
      default: 'bg-white',
      filled: 'bg-blue-50',
      disabled: 'bg-blue-50',
      invalid: 'bg-blue-50'
    },
    border: {
      default: 'border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
      filled: 'border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
      disabled: 'border-blue-100',
      invalid: 'border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
    }
  },
  table: {
    header: 'bg-blue-50',
    row: 'bg-white',
    rowHover: 'hover:bg-blue-50',
    border: 'border-blue-100'
  },
  status: {
    neutral: 'bg-blue-50 text-blue-700',
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-blue-100 text-blue-800',
    warning: 'bg-blue-100 text-blue-800',
    danger: 'bg-blue-200 text-blue-900'
  },
  text: {
    primary: 'text-slate-900',
    secondary: 'text-slate-700',
    muted: 'text-slate-500',
    onPrimary: 'text-white',
    onDanger: 'text-white',
    onSuccess: 'text-white',
    success: 'text-blue-700',
    warning: 'text-blue-700',
    danger: 'text-blue-700',
    info: 'text-blue-700'
  }
};
