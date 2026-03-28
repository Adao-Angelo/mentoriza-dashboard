export interface CreateIndicatorDto {
  title: string;
  value: number;
  type?: 'MIN' | 'MAX';
}

export interface UpdateIndicatorDto {
  title?: string;
  value?: number;
  type?: 'MIN' | 'MAX';
  isActive?: boolean;
}

export interface Indicator {
  id: number;
  title: string;
  value: number;
  type?: 'MIN' | 'MAX';
  description?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}
