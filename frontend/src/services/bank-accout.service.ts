import axiosInstance from "../http";

export interface IBankAccount {
  id: number;
  user_id: number;
  is_primary: boolean;
  account_balance: number;
  account_number: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateBankAccount {
  is_primary: boolean;
  user_id: number;
}

export interface ITransaction {
  source_account: string;
  target_account: string;
  amount: number;
}

const BANK_ACCOUNT = "bank-account";

export const getAllBankAccountByUser = async () => {
  const response = await axiosInstance.get<IBankAccount[]>(`${BANK_ACCOUNT}`);
  return response.data;
};

export const createSavingAccount = async (params: ICreateBankAccount) => {
  const response = await axiosInstance.post<IBankAccount[]>(
    `${BANK_ACCOUNT}`,
    params
  );
  return response.data;
};

export const transfer = async (params: ITransaction) => {
  const response = await axiosInstance.post(`${BANK_ACCOUNT}/transfer`, params);
  return response.data;
};
