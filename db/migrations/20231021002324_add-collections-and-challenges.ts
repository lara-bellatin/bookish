import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema
  .createTable("collections", (table) => {
    table.text("id").primary();
    table.text("name");
    table.text("description");
    table.date("created_at");
    table.date("updated_at");
  })
  .createTable("collection_memberships", (table) => {
    table.text("id").primary();
    table.text("collection_id").references("collections");
    table.text("book_id").references("books");
    table.date("created_at");
    table.date("updated_at");
  })
  .createTable("challenges", (table) => {
    table.text("id").primary();
    table.text("description");
    table.text("name");
    table.integer("goal");
    table.integer("total");
    table.date("start_date");
    table.date("end_date");
    table.date("created_at");
    table.date("updated_at");
  })
  .createTable("challenge_parameters", (table) => {
    table.text("id").primary();
    table.text("type");
    table.text("property");
    table.text("value");
    table.date("created_at");
    table.date("updated_at");
  })
}


export async function down(knex: Knex) {
  return knex.schema
  .dropTableIfExists("collections")
  .dropTableIfExists("collection_memberships")
  .dropTableIfExists("challenges")
  .dropTableIfExists("challenge_parameters");

}

