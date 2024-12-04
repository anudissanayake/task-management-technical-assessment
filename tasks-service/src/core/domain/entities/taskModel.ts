export class Task {
    constructor(
      public id: string,
      public title: string,
      public description: string,
      public status: 'pending' | 'in-progress' | 'completed' = 'pending',
      public createdAt: string = new Date().toISOString(),
      public updatedAt: string = new Date().toISOString()
    ) {}
  }  