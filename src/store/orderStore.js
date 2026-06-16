import { create } from 'zustand';

const useOrderStore = create((set) => ({
  theme: '',
  guestCount: 0,
  budget: 0,
  allergies: [],
  avoidSpicy: false,
  selectedMenus: [],
  deliveryTime: '',
  deliveryAddress: '',
  communityType: '',
  matchedRestaurant: null,
  latitude: null,
  longitude: null,
  isReorder: false,

  setTheme: (v) => set({ theme: v }),
  setGuestCount: (v) => set({ guestCount: v }),
  setBudget: (v) => set({ budget: v }),
  setAllergies: (v) => set({ allergies: v }),
  setAvoidSpicy: (v) => set({ avoidSpicy: v }),
  setSelectedMenus: (v) => set({ selectedMenus: v }),
  setDeliveryTime: (v) => set({ deliveryTime: v }),
  setDeliveryAddress: (v) => set({ deliveryAddress: v }),
  setCommunityType: (v) => set({ communityType: v }),
  setMatchedRestaurant: (v) => set({ matchedRestaurant: v }),
  setOrderTotal: (v) => set({ orderTotal: v }),
  setBudgetWarningAcknowledged: (v) => set({ budgetWarningAcknowledged: v }),
  setLocation: (lat, lng) => set({ latitude: lat, longitude: lng }),
  setIsReorder: (v) => set({ isReorder: v }),

  reset: () => set({
    theme: '', guestCount: 0, budget: 0,
    allergies: [], avoidSpicy: false, selectedMenus: [],
    deliveryTime: '', deliveryAddress: '',
    communityType: '', matchedRestaurant: null, orderTotal: 0, budgetWarningAcknowledged: false,
    latitude: null, longitude: null,
    isReorder: false,
  }),
}));

export default useOrderStore;
