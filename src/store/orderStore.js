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
  setLocation: (lat, lng) => set({ latitude: lat, longitude: lng }),

  reset: () => set({
    theme: '', guestCount: 0, budget: 0,
    allergies: [], avoidSpicy: false, selectedMenus: [],
    deliveryTime: '', deliveryAddress: '',
    communityType: '', matchedRestaurant: null,
    latitude: null, longitude: null,
  }),
}));

export default useOrderStore;
