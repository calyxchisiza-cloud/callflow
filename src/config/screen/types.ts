export type ScreenAction = { label: string; href: string };

export type BaseScreen = {
  lede: string;
  action?: ScreenAction;
  secondary?: ScreenAction;
};

export type ListScreen = BaseScreen & {
  template: "LST";
  columns: string[];
  filters?: string[];
  emptyTitle: string;
  emptyBody: string;
};

export type FormField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "date" | "time" | "textarea" | "select" | "file";
  placeholder?: string;
  options?: string[];
  required?: boolean;
  full?: boolean;
  hint?: string;
};

export type FormScreen = BaseScreen & {
  template: "FRM";
  sections: { title: string; description?: string; fields: FormField[] }[];
  submit: string;
};

export type DashboardScreen = BaseScreen & {
  template: "DSH";
  kpis: { label: string; unit: string; hint: string }[];
  chartLabel: string;
  tableTitle: string;
  columns: string[];
  tableEmpty: string;
};

export type DetailTab = {
  label: string;
  rows?: { label: string; value: string }[];
  empty?: string;
  columns?: string[];
};

export type DetailScreen = BaseScreen & {
  template: "DTL";
  tabs: DetailTab[];
};

export type SettingRow = {
  label: string;
  description?: string;
  control: "switch" | "select" | "text" | "link";
  value?: string;
  options?: string[];
  href?: string;
  enabled?: boolean;
};

export type SettingsScreen = BaseScreen & {
  template: "SET";
  sections: { title: string; description?: string; rows: SettingRow[] }[];
};

export type MonitorScreen = BaseScreen & {
  template: "MON";
  tiles: { label: string; unit: string; hint: string }[];
};

export type MediaScreen = BaseScreen & {
  template: "MED";
  kind: "recording" | "voicemail";
};

export type LogScreen = BaseScreen & {
  template: "LOG";
  columns: string[];
};

export type BuilderScreen = BaseScreen & {
  template: "BLD";
  canvasTitle: string;
  canvasBody: string;
  palette: { title: string; body: string }[];
};

export type CalendarScreen = BaseScreen & {
  template: "CAL";
  kind: "tasks" | "shifts";
};

export type DocScreen = BaseScreen & {
  template: "DOC";
  sections: { heading: string; paragraphs: string[]; code?: string }[];
};

export type WorkspaceScreen = BaseScreen & {
  template: "WRK";
  kind: "agent" | "softphone" | "dialer" | "click-to-call";
};

export type ScreenConfig =
  | ListScreen
  | FormScreen
  | DashboardScreen
  | DetailScreen
  | SettingsScreen
  | MonitorScreen
  | MediaScreen
  | LogScreen
  | BuilderScreen
  | CalendarScreen
  | DocScreen
  | WorkspaceScreen;
