export interface Admin {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  admin: Admin;
}
