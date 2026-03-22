export interface MenuItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  calories: number;
  description: string;
  rating: number;
  tags: string[];
  category: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface BookingData {
  date: string;
  time: string;
  partySize: number;
  seating: string;
  name: string;
  phone: string;
  email: string;
  occasion?: string;
  dietary?: string;
  requests?: string;
}
