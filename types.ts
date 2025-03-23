// types.ts
export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    LockScreen: undefined;
  };
  
  export interface User {
    id: number;
    email: string;
    password: string;
    dob: string;
    gender: string;
  } 