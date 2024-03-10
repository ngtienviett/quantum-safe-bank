import {
  Button,
  Card,
  Form,
  InputNumber,
  Layout,
  Select,
  Space,
  notification,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { Camelized, camelizeKeys, decamelizeKeys } from "humps";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { URL_CONFIG } from "../../config/url.config";
import {
  IBankAccount,
  ITransaction,
  getAllBankAccountByUser,
  transfer,
} from "../../services/bank-accout.service";

type FieldType = {
  targetAccount: string;
  sourceAccount: string;
  amount: string;
  // remember?: string;
};

const TractionPage = () => {
  // const { setAuth } = useAuth();
  const [form] = useForm();
  const navigate = useNavigate();

  const [bankAccounts, setBankAccounts] = useState<Camelized<IBankAccount>[]>(
    []
  );
  const onFinish = async (values: FieldType) => {
    try {
      await transfer(
        decamelizeKeys({
          ...values,
          targetAccount: values.targetAccount.toString(),
        }) as ITransaction
      );
      notification.success({ message: "Transaction success" });
      navigate(URL_CONFIG.ACCOUNT);
    } catch (error: any) {
      if (error && error.data) {
        notification.error({ message: error.data.message });
      } else {
        // console.log(error);
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllBankAccountByUser();
        if (!res || res.length === 0) return;

        const bankAccounts = camelizeKeys(
          res.sort(
            (a, b) =>
              (b.is_primary === true ? 1 : 0) - (a.is_primary === true ? 1 : 0)
          )
        ) as Camelized<IBankAccount>[];
        setBankAccounts(bankAccounts);
      } catch (error) {
        notification.error({
          message: "Get bank account error",
        });
      }
    })();
  }, []);

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
        title={<h3 style={{ textAlign: "center" }}>Transaction</h3>}
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
          <div style={{ width: "300px" }}>
            <Form.Item<FieldType>
              name="sourceAccount"
              rules={[{ required: true, message: "Select your bank account" }]}
            >
              <Select
                placeholder="Your bank account"
                // onChange={(value: string) => {
                //   // onChangeCountryName(value);
                // }}
                showSearch
                size="large"
              >
                {bankAccounts.map((bankAccount) => (
                  <Select.Option value={bankAccount.accountNumber}>
                    {bankAccount.accountNumber}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item<FieldType>
              name="targetAccount"
              rules={[
                { required: true, message: "Enter target bank account number" },
              ]}
            >
              <InputNumber
                placeholder="Target bank account number"
                size="large"
                controls={false}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item<FieldType>
              name="amount"
              rules={[
                {
                  required: true,
                  message: "Enter amount",
                },
              ]}
            >
              <InputNumber
                min={0}
                placeholder="Amount"
                size="large"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>

          <Form.Item<FieldType>>
            <Space direction="horizontal">
              <Button type="primary" size="large">
                Tranfer
              </Button>
              <Button type="primary" size="large">
                <Link to={URL_CONFIG.HOME}>Home</Link>
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default TractionPage;
