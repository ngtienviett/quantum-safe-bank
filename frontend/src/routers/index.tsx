import { URL_CONFIG } from "../config/url.config";
import AccountPage from "../pages/account";
import HomePage from "../pages/home";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import TractionPage from "../pages/transaction";

export interface RouteMenu {
  label: React.ReactNode;
  element: React.ReactNode;
  key: React.Key;
  path: string;
  icon?: React.ReactNode;
  children: RouteMenu[];
  isNeedPermission?: boolean;
}

const menu: RouteMenu[] = [
  {
    label: "",
    element: <HomePage />,
    key: URL_CONFIG.HOME,
    path: URL_CONFIG.HOME,
    children: [],
  },
  {
    label: "",
    element: <RegisterPage />,
    key: URL_CONFIG.REGISTER,
    path: URL_CONFIG.REGISTER,
    children: [],
  },
  {
    label: "",
    element: <LoginPage />,
    key: URL_CONFIG.LOGIN,
    path: URL_CONFIG.LOGIN,
    children: [],
  },
  {
    label: "",
    element: <AccountPage />,
    key: URL_CONFIG.ACCOUNT,
    path: URL_CONFIG.ACCOUNT,
    children: [],
    isNeedPermission: true,
  },
  {
    label: "",
    element: <TractionPage />,
    key: URL_CONFIG.TRANSACTION,
    path: URL_CONFIG.TRANSACTION,
    children: [],
    isNeedPermission: true,
  },
];

export default menu;
