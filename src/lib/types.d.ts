interface FormInput {
  name: string;
  email: string;
  number: number;
  company: string;
  position: string;
  linkedin: string;
  message: string;
}

export interface Position {
  id: number;
  name: string;
  company: {
    bs: string;
  };
  overview: string;
  description: string;
  active: boolean;
  internal: boolean;
}
