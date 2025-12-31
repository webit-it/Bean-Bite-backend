export const calculateFinalPrice = (
  price: number,
  discountType?: "percentage" | "fixed",
  discountValue?: number
): number => {
  if (!discountType || !discountValue) {
    return price;
  }

  if (discountType === "percentage") {
    return Math.max(price - (price * discountValue) / 100, 0);
  }

  if (discountType === "fixed") {
    return Math.max(price - discountValue, 0);
  }

  return price;
};
