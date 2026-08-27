import { create } from 'zustand';

const useOrderStore = create((set) => ({
  theme: '',
  guestCount: 0,
  budget: 0,
  allergies: [],
  avoidSpicy: false,
  drinks: '',
  cake: '',
  selectedMenus: [],
  deliveryTime: '',
  deliveryAddress: '',
  communityType: '',
  matchedRestaurant: null,
  latitude: null,
  longitude: null,
  isReorder: false,

  // Table Home (Phase 3) — local-only until Phase 6 wires real Member
  // accounts + a backend table. myName is NOT cleared by reset() because
  // it's the person's own name, not something tied to one table.
  myName: '',
  partyItems: [],   // [{ id, menuItemId, name, price, quantity, addedBy }]
  activities: [],   // [{ id, title, time }]

  setTheme: (v) => set({ theme: v }),
  setGuestCount: (v) => set({ guestCount: v }),
  setBudget: (v) => set({ budget: v }),
  setAllergies: (v) => set({ allergies: v }),
  setAvoidSpicy: (v) => set({ avoidSpicy: v }),
  setDrinks: (v) => set({ drinks: v }),
  setCake: (v) => set({ cake: v }),
  setSelectedMenus: (v) => set({ selectedMenus: v }),
  setDeliveryTime: (v) => set({ deliveryTime: v }),
  setDeliveryAddress: (v) => set({ deliveryAddress: v }),
  setCommunityType: (v) => set({ communityType: v }),
  setMatchedRestaurant: (v) => set({ matchedRestaurant: v }),
  setOrderTotal: (v) => set({ orderTotal: v }),
  setCurrentOrderId: (v) => set({ currentOrderId: v }),
  setBudgetWarningAcknowledged: (v) => set({ budgetWarningAcknowledged: v }),
  setLocation: (lat, lng) => set({ latitude: lat, longitude: lng }),
  setIsReorder: (v) => set({ isReorder: v }),

  setMyName: (v) => set({ myName: v }),

  // Any Member can add an item — if this person already added the same
  // menu item, bump the quantity instead of creating a duplicate row.
  addPartyItem: (item) => set((state) => {
    const idx = state.partyItems.findIndex(
      (p) => p.menuItemId === item.menuItemId && p.addedBy === item.addedBy
    );
    if (idx !== -1) {
      const updated = [...state.partyItems];
      updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
      return { partyItems: updated };
    }
    return {
      partyItems: [
        ...state.partyItems,
        { ...item, id: `pi-${item.menuItemId}-${item.addedBy}-${Date.now()}`, quantity: 1 },
      ],
    };
  }),
  decrementPartyItem: (id) => set((state) => {
    const idx = state.partyItems.findIndex((p) => p.id === id);
    if (idx === -1) return {};
    const updated = [...state.partyItems];
    if (updated[idx].quantity <= 1) {
      updated.splice(idx, 1);
    } else {
      updated[idx] = { ...updated[idx], quantity: updated[idx].quantity - 1 };
    }
    return { partyItems: updated };
  }),

  addActivity: (activity) => set((state) => ({
    activities: [...state.activities, { ...activity, id: `act-${Date.now()}` }],
  })),
  removeActivity: (id) => set((state) => ({
    activities: state.activities.filter((a) => a.id !== id),
  })),

  reset: () => set({
    theme: '', guestCount: 0, budget: 0,
    allergies: [], avoidSpicy: false, drinks: '', cake: '', selectedMenus: [],
    deliveryTime: '', deliveryAddress: '',
    communityType: '', matchedRestaurant: null, orderTotal: 0, currentOrderId: null, budgetWarningAcknowledged: false,
    latitude: null, longitude: null,
    isReorder: false,
    partyItems: [], activities: [],
  }),
}));

export default useOrderStore;
