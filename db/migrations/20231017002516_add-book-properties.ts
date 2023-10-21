import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema
  .alterTable("books", (table) => {
    table.text("format");
    table.text("notes");
  });
}


export async function down(knex: Knex) {
  return knex.schema
  .alterTable("books", (table) => {
    table.dropColumns("fomat", "notes");
  })

}

