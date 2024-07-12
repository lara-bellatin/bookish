import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema
  .createTable("authors", (table) => {
    table.text("id").primary();
    table.text("name");
    table.text("website");
    table.text("goodreads_link");
    table.datetime("created_at");
    table.datetime("updated_at");
  })
  .createTable("series", (table) => {
    table.text("id").primary();
    table.text("title");
    table.integer("main_books");
    table.integer("additional_books");
    table.text("goodreads_link");
    table.float("rating");
    table.datetime("created_at");
    table.datetime("updated_at");
  })
  .createTable("books", (table) => {
    table.text("id").primary();
    table.text("title");
    table.text("author_id").references("authors");
    table.text("series_id").references("series");
    table.integer("series_order");
    table.text("cover_image");
    table.date("publish_date");
    table.text("main_genre");
    table.text("goodreads_link");
    table.integer("page_count");
    table.text("status");
    table.boolean("owned");
    table.boolean("favorite");
    table.float("public_rating");
    table.float("my_rating");
    table.date("start_date");
    table.date("finish_date");
    table.datetime("created_at");
    table.datetime("updated_at");
  });
}


export async function down(knex: Knex) {
  return knex.schema
  .dropTableIfExists("books")
  .dropTableIfExists("series")
  .dropTableIfExists("authors");

}

