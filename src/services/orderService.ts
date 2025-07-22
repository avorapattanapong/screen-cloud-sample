export const verifyOrder = async (quantity: number, shippingLat: number, shippingLng: number):  => {
  return {
    quantity,
    shippingLat,
    shippingLng
  };
}
