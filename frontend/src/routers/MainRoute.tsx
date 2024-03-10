import { Button, Result } from "antd";
import { Link, Route, Routes } from "react-router-dom";
import menu, { RouteMenu } from ".";
import { URL_CONFIG } from "../config/url.config";
import { useAuth } from "../context/AuthContext";
import { TOKEN } from "../http";

const getAllRoute = (route: RouteMenu) => {
  let temps: Array<RouteMenu> = [];
  if (route.children.length > 0) {
    route.children.forEach((subItem: RouteMenu) => {
      let menu = getAllRoute(subItem);
      temps = [...temps, ...menu];
    });
  }
  temps.push(route);
  return temps;
};

const listMenu = () => {
  let list: Array<RouteMenu> = [];
  menu.forEach((item) => (list = [...list, ...getAllRoute(item)]));
  return list;
};

const MainRoute = () => {
  const { auth } = useAuth();
  const renderRoute = () =>
    listMenu().map((route, index) => {
      return (
        <Route
          key={index}
          path={route.path}
          element={
            <>
              {route.isNeedPermission &&
              (!auth || !sessionStorage.getItem(TOKEN)) ? (
                <Result
                  status="403"
                  title="403"
                  subTitle="Sorry, you are not authorized to access this page."
                  extra={
                    <Button type="primary">
                      {" "}
                      <Link to={URL_CONFIG.HOME}>Back Home</Link>{" "}
                    </Button>
                  }
                />
              ) : (
                route.element
              )}
            </>
          }
        />
      );
    });
  return (
    <>
      <Routes>{renderRoute()}</Routes>
    </>
  );
};

export default MainRoute;
