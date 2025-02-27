/**
 * Generates a deterministic gradient background for a board based on its ID
 * @param boardId The unique identifier of the board
 * @returns A CSS linear-gradient string
 */
export function generateGradientForBoard(boardId: string) {
  // Create a deterministic but visually pleasing gradient based on the board ID
  // This ensures the same board always gets the same gradient
  const hash = boardId.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  // Generate three colors for a rich gradient
  const color1 = `hsl(${Math.abs(hash) % 360}, 70%, 20%)`;
  const color2 = `hsl(${(Math.abs(hash) + 40) % 360}, 80%, 30%)`;
  const color3 = `hsl(${(Math.abs(hash) + 80) % 360}, 70%, 25%)`;

  return `linear-gradient(135deg, ${color1}, ${color2}, ${color3})`;
}
