import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary();
    table.string('user_id').references('users.id').notNullable();
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.string('date').notNullable();
    table.string('time').notNullable();
    table.boolean('is_diet').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals');
}
