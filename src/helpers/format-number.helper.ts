export const formatNumber = (n: number) =>
  n.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
