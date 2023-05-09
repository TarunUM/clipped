/* If we need any methods on types we can go with classes */
// export default class IUser {
//   email?: string;
//   name?: string;
//   password?: string;
//   age?: number;
//   phoneNumber?: string;
// }

export default interface IUser {
  email: string;
  name: string;
  password?: string;
  age: number;
  phoneNumber: string;
}
