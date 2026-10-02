// Plates per dish for a catering order -- MUST match
// billtable-backend/utils/portions.js (the server recomputes this from the
// DB and is what actually gets charged; this copy is only for showing the
// customer the right numbers before they confirm).
// The restaurant sets how many people one plate feeds (serving_size).
// Guests are split evenly across dishes, rounded UP to whole plates.
export function platesNeeded(guestCount, dishCount, servingSize) {
  const guests = parseInt(guestCount, 10)
  const dishes = parseInt(dishCount, 10)
  if (!Number.isFinite(guests) || guests < 1 || !Number.isFinite(dishes) || dishes < 1) return 1
  const feeds = Math.max(1, parseInt(servingSize, 10) || 1)
  return Math.max(1, Math.ceil(Math.ceil(guests / dishes) / feeds))
}
