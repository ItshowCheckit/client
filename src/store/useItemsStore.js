import { create } from "zustand";

const useItemsStore = create((set) => ({
  DUMMY_ITEMS : [
    { id: 1, name: "갈색 지갑", location: "3학년 3반 교탁 위", time: "1시간 전", status: "received", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80" },
    { id: 2, name: "나이키 검정 신발 한 짝", location: "3학년 3반 교탁 위", time: "1시간 전", status: "received", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" },
    { id: 3, name: "신용 카드", location: "화장실 세면대 위", time: "1일 전", status: "received", image: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=400&q=80" },
    { id: 4, name: "주황색 물통", location: "체육관", time: "3일 전", status: "received", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80" },
    { id: 5, name: "마우스", location: "실습실 5실", time: "7일 전", status: "received", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80" },
    { id: 6, name: "마우스", location: "실습실 5실", time: "7일 전", status: "received", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80" },
    { id: 7, name: "마우스", location: "실습실 5실", time: "7일 전", status: "received", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80" },
    { id: 8, name: "마우스", location: "운동장", time: "7일 전", status: "keeping", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80" },
    { id: 9, name: "우산", location: "1학년 2반 사물함", time: "2일 전", status: "keeping", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80" },
    { id: 10, name: "에어팟", location: "도서관", time: "4일 전", status: "keeping", image: "https://images.unsplash.com/photo-1588423771073-b8903fead85b?w=400&q=80" },
    { id: 11, name: "텀블러", location: "2학년 복도", time: "5일 전", status: "received", image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80" },
    { id: 12, name: "체육복 상의", location: "탈의실", time: "6일 전", status: "keeping", image: "https://images.unsplash.com/photo-1562183241-840b8af0721e?w=400&q=80" },
    { id: 13, name: "필통", location: "3학년 1반", time: "8일 전", status: "keeping", image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&q=80" },
  ],
  //setItems: (item) => set({ item: DUMMY_ITEMS }),
  // addItems: (item) => set( (prev) => {DUMMY_ITEMS : [...prev, {
  //       id: Date.now(), 
  //       ...newItem, 
  //     },]} ),
  // deleteItems : (item) => set(),
  // updateItems : (item) => set({}),
}));

export default useItemsStore;