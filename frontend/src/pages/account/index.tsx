import { Button, Card, Layout, Space, notification } from "antd";
import { Camelized, camelizeKeys } from "humps";
import { useEffect, useState } from "react";
import {
  IBankAccount,
  createSavingAccount,
  getAllBankAccountByUser,
} from "../../services/bank-accout.service";
import { useAuth } from "../../context/AuthContext";
import { URL_CONFIG } from "../../config/url.config";
import { Link, useNavigate } from "react-router-dom";
const AccountPage = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [activeAccountTab, setActiveAccountTab] =
    useState<Camelized<IBankAccount>>();
  const [bankAccounts, setBankAccounts] = useState<Camelized<IBankAccount>[]>(
    []
  );

  const [isLoading, setLoading] = useState(false);

  const onTabChange = (key: string) => {
    setActiveAccountTab(
      bankAccounts.find((bankAccount) => `${bankAccount.id}` === key)
    );
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
        setActiveAccountTab(bankAccounts[0]);
        setBankAccounts(bankAccounts);
      } catch (error) {
        notification.error({
          message: "Get bank account error",
        });
      }
    })();
  }, [isLoading]);
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
        title={
          <Space
            direction="horizontal"
            style={{ justifyContent: "space-between", width: "100%" }}
          >
            Account Information
            <Space direction="horizontal">
              <Button
                size="large"
                type="default"
                onClick={async () => {
                  if (auth) {
                    setLoading(true);
                    await createSavingAccount({
                      user_id: auth.id,
                      is_primary: false,
                    });
                    setLoading(false);
                    notification.success({
                      message: "Create saving account success",
                    });
                  }
                }}
              >
                Create Saving Account
              </Button>
              <Button
                size="large"
                type="primary"
                onClick={() => navigate(URL_CONFIG.TRANSACTION)}
              >
                Tranfer
              </Button>
            </Space>
          </Space>
        }
        tabList={bankAccounts.map((bankAccount) => ({
          key: `${bankAccount.id}`,
          label: bankAccount.isPrimary ? "Current Account" : "Saving Account",
        }))}
        activeTabKey={`${activeAccountTab?.id}`}
        onTabChange={onTabChange}
      >
        <p>Account Number = {activeAccountTab?.accountNumber}</p>
        <p>Account Ballance = {activeAccountTab?.accountBalance}</p>
        <Button type="primary" size="large">
          <Link to={URL_CONFIG.HOME}>Home</Link>
        </Button>
      </Card>
    </Layout>
  );
};

export default AccountPage;
