export type ConfigValueType = "STRING" | "BOOLEAN" | "NUMBER";
export type ConfigCategory = "GENERAL" | "AUTH" | "SUPPORT" | "RECEIPTS" | "UPLOADS";

export interface ConfigSetting {
  key: string;
  value: string;
  valueType: ConfigValueType;
  category: ConfigCategory;
  description: string | null;
  editable: boolean;
}

export interface ConfigResponse {
  items: ConfigSetting[];
}

export interface ConfigUpdateRequest {
  value: string;
}
