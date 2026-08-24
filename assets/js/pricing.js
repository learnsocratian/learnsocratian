export const PRICES = Object.freeze({
  numeration: {
    operations: { level1: 4.95, level2: 5.95, level3: 6.95, assessment: 7.95 },
    "order-of-operations": { level1: 4.95, level2: 5.95, level3: 6.95, assessment: 7.95 },
    exponents: { level1: 4.95, level2: 5.95, level3: 6.95, assessment: 7.95 },
    integers: { level1: 4.95, level2: 5.95, level3: 6.95, assessment: 7.95 },
    divisibility: { level1: 4.95, level2: 5.95, level3: 6.95, assessment: 7.95 },
    fractions: { level1: 4.95, level2: 5.95, level3: 6.95, assessment: 7.95 },
    decimals: { level1: 4.95, level2: 5.95, level3: 6.95, assessment: 7.95 },
    percentages: { level1: 4.95, level2: 5.95, level3: 6.95, assessment: 7.95 },
    proportions: { level1: 4.95, level2: 5.95, level3: 6.95, assessment: 7.95 }
  }
});

export function getNumerationPrice(topicSlug, productKey) {
  return PRICES.numeration?.[topicSlug]?.[productKey] ?? null;
}

export function formatPrice(value) {
  if (typeof value !== "number") return "";
  return `$${value.toFixed(2)}`;
}
