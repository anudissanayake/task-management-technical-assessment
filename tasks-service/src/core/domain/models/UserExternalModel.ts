export class User {
    constructor(
      public id: number,
      public name: string,
      public username: string,
      public email: string,
      public address: string,
      public phone: string,
      public website: string,
      public company: string,
      public cachekey: string,
      public TTL: string
    ) {}
  }