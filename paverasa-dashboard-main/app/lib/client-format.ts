export function formatCurrency(value: number | string | null | undefined): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const safeValue = Number(numValue || 0);
  
  if (isNaN(safeValue)) {
    return '₹0';
  }
  
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(safeValue);
}

export function formatPercent(value: number | string | null | undefined): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const safeValue = Number(numValue || 0);
  
  if (isNaN(safeValue)) {
    return '0.0%';
  }
  
  return `${safeValue.toFixed(1)}%`;
}

export function formatNumber(value: number | string | null | undefined): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const safeValue = Number(numValue || 0);
  
  if (isNaN(safeValue)) {
    return '0';
  }
  
  return new Intl.NumberFormat("en-IN").format(safeValue);
}

export function safeNumber(value: number | string | null | undefined): number {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const safeValue = Number(numValue || 0);
  
  return isNaN(safeValue) ? 0 : safeValue;
}
