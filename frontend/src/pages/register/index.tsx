import { LockOutlined } from "@ant-design/icons";

import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Layout,
  Select,
  Upload,
  notification,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { decamelizeKeys } from "humps";
import { Link, useNavigate } from "react-router-dom";
import { URL_CONFIG } from "../../config/url.config";
import countriesData from "../../data/countries.json";
import { IRegister, register } from "../../services/auth.service";
import { useState } from "react";

type FieldType = {
  phoneNumber: string;
  name: string;
  cardType: boolean;
  cardNumber: number;
  email: string;
  country: string;
  countryCode: string;
  password: string;
  rePassword?: string;
  identity: any;
};

const RegisterPage = () => {
  const [form] = useForm();
  const navigate = useNavigate();

  const [check, setCheck] = useState(true);

  const onFinish = async (values: FieldType) => {
    try {
      delete values.rePassword;
      const formData = {
        ...values,
        cardType: check,
      };

      // console.log(decamelizeKeys(formData) as IRegister);
      await register({
        ...decamelizeKeys(formData),
        identity: formData.identity,
      } as IRegister);
      notification.success({
        message: "Register success",
      });
      navigate(URL_CONFIG.LOGIN);
    } catch (error: any) {
      if (error.data && error.data.message) {
        notification.error({
          message: error.data.message,
        });
      } else {
        // console.log(error);
      }
    }
  };

  const prefixSelector = (
    <Form.Item
      name="countryCode"
      noStyle
      rules={[{ required: true, message: "Select area code" }]}
    >
      <Select
        style={{ width: 100 }}
        onChange={(value: string) => {
          onChangeCountryCode(value);
        }}
        showSearch
      >
        {countriesData.map((country) => (
          <Select.Option key={country.code} value={country.dial_code}>
            {country.dial_code}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );

  const onChangeCountryCode = (value: string) => {
    form.setFields([
      {
        name: "country",
        value: countriesData.find((co) => co.dial_code === value)?.name,
      },
      {
        name: "countryCode",
        value,
      },
    ]);
  };

  const onChangeCountryName = (value: string) => {
    form.setFields([
      {
        name: "countryCode",
        value: countriesData.find((co) => co.name === value)?.dial_code,
      },
      {
        name: "country",
        value,
      },
    ]);
  };

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
        title={<h3 style={{ textAlign: "center" }}>Register</h3>}
      >
        <Form
          form={form}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          // initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div>
            <Form.Item<FieldType>
              name="name"
              rules={[{ required: true, message: "Enter your name" }]}
            >
              <Input placeholder="Full name" size="large" />
            </Form.Item>

            <Form.Item>
              <Checkbox
                checked={check}
                onChange={(e: { target: { checked: boolean } }) => {
                  setCheck(e.target.checked);
                }}
              >
                The type of Unique Identification (checked: Citizen ID /
                unchecked: Passport number)
              </Checkbox>
            </Form.Item>

            <Form.Item<FieldType>
              name="cardNumber"
              rules={[
                {
                  required: true,
                  message: "Enter your Citizen ID/Passport number",
                },
              ]}
            >
              <InputNumber
                min={0}
                placeholder="Citizen ID/Passport number"
                size="large"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item<FieldType>
              name="email"
              rules={[
                { required: true, message: "Enter your email" },
                {
                  validator(rule, value, callback) {
                    const emailRegex =
                      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

                    if (!value || emailRegex.test(value)) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject("Email is not valid");
                    }
                  },
                },
              ]}
            >
              <Input placeholder="example@gmail.com" size="large" />
            </Form.Item>

            <Form.Item<FieldType>
              name="country"
              rules={[{ required: true, message: "Select your country" }]}
            >
              <Select
                placeholder="Country"
                onChange={(value: string) => {
                  onChangeCountryName(value);
                }}
                showSearch
                size="large"
              >
                {countriesData.map((country) => (
                  <Select.Option key={country.code} value={country.name}>
                    {country.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item<FieldType>
              name="phoneNumber"
              rules={[{ required: true, message: "Enter phone number" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                controls={false}
                addonBefore={prefixSelector}
                placeholder="Phone number"
                size="large"
              />
            </Form.Item>

            <Form.Item noStyle shouldUpdate>
              {({ getFieldValue, setFieldsValue }) => {
                const avatar = getFieldValue("identity");
                return (
                  <Form.Item<FieldType>
                    name="identity"
                    rules={[
                      {
                        validator(rule, value, callback) {
                          if (!value || !value?.file?.type) {
                            callback();
                            return;
                          }
                          if (
                            !(value?.file?.type as string).includes("image")
                          ) {
                            callback("Please select image only");
                            return;
                          }
                          callback();
                        },
                        message: "Please select image only",
                      },
                      {
                        required: true,
                        message: "Select your identity",
                      },
                    ]}
                  >
                    <Upload
                      accept="image/*"
                      listType="picture-card"
                      multiple={false}
                      beforeUpload={() => false}
                      // showUploadList={{
                      //   showPreviewIcon: false,
                      // }}
                      fileList={avatar?.fileList || []}
                      onRemove={() => {
                        form.setFieldsValue({ identity: null });
                      }}
                    >
                      {!avatar || avatar?.fileList?.length === 0 ? (
                        <>Identity</>
                      ) : null}
                    </Upload>
                  </Form.Item>
                );
              }}
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

            <Form.Item<FieldType>
              name="rePassword"
              rules={[
                { required: true, message: "Re-enter password" },
                {
                  validator(rule, value, callback) {
                    const password = form.getFieldValue("password");
                    if (value && value !== password) {
                      return Promise.reject("Repassword does not match");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input.Password
                addonBefore={<LockOutlined />}
                placeholder="RePassword"
                size="large"
              />
            </Form.Item>
          </div>

          <Form.Item<FieldType>>
            <Button type="primary" htmlType="submit" size="large">
              Register
            </Button>
          </Form.Item>
          <Link to={URL_CONFIG.LOGIN}>Login</Link>
        </Form>
      </Card>
    </Layout>
  );
};

export default RegisterPage;
