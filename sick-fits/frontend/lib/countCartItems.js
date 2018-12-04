export default function countCartItems({ cart }) {
  return cart.reduce((tally, item) => tally + item.quantity, 0);
}
