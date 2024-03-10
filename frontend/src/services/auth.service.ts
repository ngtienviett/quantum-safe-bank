import axiosInstance from "../http";

export type IAuth = {
  id: number;
  // title: string;
  // imageUrl: string;
  // backLink: string;
  // description: string;
  access_token: string;
  refresh_token: string;
};

type Authority = {
  authority: string;
};

export type TokenType = {
  authorities: Authority[];
  sub: string;
  iat: number;
  exp: number;
};

export interface ILogin {
  country_code: string;
  phone_number: string;
  password: string;
}
export interface IRefreshToken {
  refresh_token: string;
}

export interface IRegister {
  name: string;
  card_type: boolean;
  card_number: number;
  email: string;
  phone_number: string;
  country: string;
  country_code: string;
  password: string;
  identity: any;
}

const AUTH = "auth";

export const login = async (params: ILogin) => {
  const response = await axiosInstance.post<IAuth>(`${AUTH}/login`, params);
  return response.data;
};

export const refreshToken = async (params: IRefreshToken) => {
  const response = await axiosInstance.post<IAuth>(
    `${AUTH}/refresh-token`,
    params
  );
  return response.data;
};

export const register = async (params: any) => {
  const formData = new FormData();
  Object.keys(params).forEach((key) => {
    if (key !== "identity") {
      formData.append(key, params[key]);
    } else if (
      params[key].fileList[0] &&
      params[key].fileList.length > 0 &&
      params[key].fileList[0].originFileObj
    ) {
      formData.append(key, params[key].fileList[0].originFileObj);
    }
  });

  const response = await axiosInstance.post<IAuth>(
    `${AUTH}/register`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
