// eslint-disable-next-line
import { Knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string;
      name: string;
      email: string;
      age: number;
      active: boolean;
      created_at: string;
    };

    meals: {
      id: string;
      user_id: string;
      name: string;
      description: string;
      date: string;
      time: string;
      is_diet: boolean;
      created_at: string;
      updated_at: string;
    };
  }
}
