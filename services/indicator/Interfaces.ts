export interface CreateIndicatorDto {
  title: string;
  value: number;
  type?: "MIN" | "MAX";
}

export interface UpdateIndicatorDto {
  title?: string;
  value?: number;
  type?: "MIN" | "MAX";
}

export interface Indicator {
  id: number;
  title: string;
  value: number;
  type?: "MIN" | "MAX";
  description?: string;
  createdAt: string;
  updatedAt: string;
}
