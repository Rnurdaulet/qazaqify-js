/** Formats a list: «Алма, алмұрт және өрік». */
export function join(items: string[]): string {
  return joinWith(items, "және");
}

/** Formats a list: «Алма, алмұрт немесе өрік». */
export function joinOr(items: string[]): string {
  return joinWith(items, "немесе");
}

function joinWith(items: string[], conj: string): string {
  const n = items.length;
  switch (n) {
    case 0:
      return "";
    case 1:
      return items[0] ?? "";
    case 2:
      return `${items[0]} ${conj} ${items[1]}`;
    default:
      return `${items.slice(0, n - 1).join(", ")} ${conj} ${items[n - 1]}`;
  }
}
