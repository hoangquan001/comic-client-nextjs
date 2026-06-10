/* eslint-disable @typescript-eslint/no-require-imports */
const { Pool } = require("pg");

class DataSource {
  constructor(
    host = "localhost",
    port = 5432,
    user = "postgres",
    password = "",
    database = "your_database_name"
  ) {
    this.pool = new Pool({
      host,
      port,
      user,
      password,
      database,
    });
  }

  async allComics() {
    const columns = await this.tableColumns("comic");
    const imageColumn = this.firstExistingColumn(columns, [
      "coverImage",
      "coverimage",
      "cover_image",
      "thumbnail",
      "thumbnailUrl",
      "thumbnailurl",
      "thumb",
      "image",
    ]);
    const titleColumn = this.firstExistingColumn(columns, ["title", "name"]);
    const imageSelect = imageColumn
      ? `${this.quoteIdentifier(imageColumn)} AS "coverImage"`
      : `NULL AS "coverImage"`;
    const titleSelect = titleColumn
      ? `${this.quoteIdentifier(titleColumn)} AS title`
      : "NULL AS title";
    const query = `SELECT id, url, ${imageSelect}, ${titleSelect} FROM Comic`;
    const { rows } = await this.pool.query(query);
    return rows;
  }

  async tableColumns(tableName) {
    const query = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND lower(table_name) = lower($1)
    `;
    const { rows } = await this.pool.query(query, [tableName]);
    return rows.map((row) => row.column_name);
  }

  firstExistingColumn(columns, candidates) {
    const byLowerName = new Map(
      columns.map((column) => [column.toLowerCase(), column])
    );

    for (const candidate of candidates) {
      const column = byLowerName.get(candidate.toLowerCase());
      if (column) return column;
    }

    return null;
  }

  quoteIdentifier(identifier) {
    return `"${identifier.replace(/"/g, '""')}"`;
  }

  async allGenres() {
    const query = "SELECT id, slug FROM Genre";
    const { rows } = await this.pool.query(query);
    return rows;
  }

  async allChapters(fields = "*", offset = 0, limit = 10000) {
    const query = `SELECT ${fields} FROM chapter ORDER BY id LIMIT $1 OFFSET $2`;
    const values = [limit, offset];
    const { rows } = await this.pool.query(query, values);
    return rows;
  }

  async countChapters() {
    const query = "SELECT COUNT(*)::int AS total FROM chapter";
    const { rows } = await this.pool.query(query);
    return rows[0]?.total || 0;
  }

  async close() {
    await this.pool.end();
  }
}
module.exports = { DataSource };
