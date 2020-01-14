export interface ProductMatch {
  tags?: {
    $all?: string[];
    $in?: string[];
  };
  qty?: {
    $gt?: number;
  };
  category?: string;
  sku?: string;
  $or?: [{ name: RegExp }, { sku: RegExp }];
}
