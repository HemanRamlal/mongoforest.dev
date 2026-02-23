export default function slugify(str) {
  return str
    .trim()
    .replaceAll(/[^A-Za-z0-9 ]/g, "")
    .replaceAll(/\s+/g, " ")
    .replaceAll(" ", "-")
    .toLowerCase();
}
