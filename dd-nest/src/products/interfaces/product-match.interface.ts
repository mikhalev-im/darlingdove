export interface ProductMatch {
  tags?: {
    $all?: string[];
    $in?: string[];
  };
  qty?: {
    $gt?: number;
  };
  category?: string;
}
