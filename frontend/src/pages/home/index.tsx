import { Button, Card, Layout, Space } from "antd";
import { Link } from "react-router-dom";
import { URL_CONFIG } from "../../config/url.config";
import { useAuth } from "../../context/AuthContext";

const HomePage = () => {
  const { auth } = useAuth();
  return (
    <Layout
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Card style={{ width: 560 }}>
        {auth && (
          <Space direction="horizontal" style={{ width: "100%" }}>
            <Button type="primary" size="large">
              <Link to={URL_CONFIG.ACCOUNT}>Account</Link>
            </Button>
            <Button type="primary" size="large">
              <Link to={URL_CONFIG.TRANSACTION}>Transaction</Link>
            </Button>
          </Space>
        )}
        {!auth && (
          <Button type="primary" size="large">
            <Link to={URL_CONFIG.LOGIN}>Login</Link>
          </Button>
        )}
      </Card>
    </Layout>
  );
};

export default HomePage;
