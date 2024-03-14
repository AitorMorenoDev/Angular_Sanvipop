export interface UserLogin {
  email: string;
  password: string;
  lat?: number;
  lng?: number;
}

export interface UserLoginRRSS {
  token: string | undefined;
  lat?: number;
  lng?: number;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  photo: string;
  lat: number;
  lng: number;
  me?: boolean;
}
