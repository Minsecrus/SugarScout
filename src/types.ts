export interface Beverage {
  id?: string;
  name: string;
  brand: string;
  sugarPer100ml: number;
  volume_ml: number;
  type: string;
  created_at?: string;
}
