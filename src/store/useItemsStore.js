import { create } from "zustand";

const useItemsStore = create((set) => ({
  items : [],
  error : null,

  fetchItems : async (schoolName) => {
    set({ error: null});
    try{
      const response = await fetch(`http://localhost:3000/schools/${encodeURIComponent(schoolName)}/lost-items`);
      if(!response.ok) throw new Error("데이터 없음...💀💀💀💀");
      const data = await response.json();

      set({ items: data });

    }catch(err){
      set({ error: err.message });
    }
  },

  addItem: (newItem) => set((state) => ({ items: [newItem, ...state.items]})),
}));

export default useItemsStore;