export default function toUpperCase(value) {
  return typeof value === 'string'
    ? value.toUpperCase()
    : value;
}
