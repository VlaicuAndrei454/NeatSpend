import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuLogOut,
  LuRepeat,
  LuTrendingUpDown,
} from "react-icons/lu";

import { FaBitcoin } from "react-icons/fa";


export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Income",
    icon: LuWalletMinimal,
    path: "/income",
  },
  {
    id: "03",
    label: "Expense",
    icon: LuHandCoins,
    path: "/expense",
  },

  {
        id: "04",
        label: "Subscriptions",
        icon: LuRepeat,
        path: "/subscriptions",
  },

  {
        id: "05",
        label: "Stocks",
        icon: LuTrendingUpDown,
        path: "/stocks",
    },

    {id:"06" , label: "Crypto",    path: "/crypto",    icon: FaBitcoin },

  
  
];
