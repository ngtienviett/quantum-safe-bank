import { LockOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Layout,
  Select,
  notification,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { camelizeKeys, decamelizeKeys } from "humps";
import { Link, useNavigate } from "react-router-dom";
import { URL_CONFIG } from "../../config/url.config";
import { useAuth } from "../../context/AuthContext";
import countriesData from "../../data/countries.json";
import { REFRESH_TOKEN, TOKEN } from "../../http";
import { IAuth, ILogin, login } from "../../services/auth.service";

type FieldType = {
  phoneNumber: string;
  password: string;
  // remember?: string;
};

const LoginPage = () => {
  const { setAuth } = useAuth();
  const [form] = useForm();
  const navigate = useNavigate();
  const onFinish = async (values: FieldType) => {
    try {
      const res = await login(decamelizeKeys(values) as ILogin);
      const data = camelizeKeys<IAuth>(res);
      sessionStorage.setItem(TOKEN, data.accessToken);
      sessionStorage.setItem(REFRESH_TOKEN, data.refreshToken);
      setAuth(data);
      notification.success({
        message: "Login success",
      });
      navigate(URL_CONFIG.ACCOUNT);
    } catch (error: any) {
      if (error.status === 404) {
        form.setFields([
          {
            name: "phoneNumber",
            value: values.phoneNumber,
            errors: [error.data.message],
          },
        ]);
      } else if (error.status === 403) {
        form.setFields([
          {
            name: "phoneNumber",
            value: values.phoneNumber,
          },
          {
            name: "password",
            value: "",
            errors: ["Password is not correct"],
          },
        ]);
      } else {
        // console.log("Error when login: ", error);
      }
    }
  };

  const prefixSelector = (
    <Form.Item
      name="countryCode"
      noStyle
      rules={[{ required: true, message: "Select area code" }]}
    >
      <Select style={{ width: 100 }} showSearch>
        {countriesData.map((country) => (
          <Select.Option key={country.code} value={country.dial_code}>
            {country.dial_code}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );

  return (
    <Layout
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Card
        style={{ width: 560 }}
        title={<h3 style={{ textAlign: "center" }}>Login</h3>}
      >
        <Form
          form={form}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <div>
            <Form.Item<FieldType>
              name="phoneNumber"
              rules={[{ required: true, message: "Enter phone number" }]}
            >
              <InputNumber
                addonBefore={prefixSelector}
                placeholder="Phone number"
                size="large"
                controls={false}
              />
            </Form.Item>

            <Form.Item<FieldType>
              name="password"
              rules={[{ required: true, message: "Enter password" }]}
            >
              <Input.Password
                addonBefore={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>
          </div>

          <Form.Item<FieldType>>
            <Button type="primary" htmlType="submit" size="large">
              Login
            </Button>
          </Form.Item>
          <Link to={URL_CONFIG.REGISTER}>Register</Link>
        </Form>
      </Card>
    </Layout>
  );
};

export default LoginPage;
