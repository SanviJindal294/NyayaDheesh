const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");

const fs = require("node:fs");

const directory = path.resolve(__dirname, "..");
const file = process.env.ND_LOCAL_DB || path.join(directory, "local.sqlite");
if (file !== ":memory:") fs.mkdirSync(path.dirname(file), { recursive: true });
const db = new DatabaseSync(file);
db.exec(`CREATE TABLE IF NOT EXISTS records (
  kind TEXT NOT NULL, id TEXT NOT NULL, body TEXT NOT NULL,
  PRIMARY KEY (kind, id)
);
CREATE UNIQUE INDEX IF NOT EXISTS user_email ON records(json_extract(body,'$.email')) WHERE kind='User';
CREATE UNIQUE INDEX IF NOT EXISTS lawyer_email ON records(json_extract(body,'$.contact.email')) WHERE kind='Lawyer';`);

module.exports = function localModel(Model) {
  const kind = Model.modelName;
  return class LocalRecord extends Model {
    async save() {
      await this.validate();
      const now = new Date();
      if (Model.schema.options.timestamps) {
        this.createdAt ||= now;
        this.updatedAt = now;
      }
      try {
        db.prepare("INSERT INTO records VALUES (?, ?, ?) ON CONFLICT(kind,id) DO UPDATE SET body=excluded.body")
          .run(kind, String(this._id), JSON.stringify(this));
      } catch (error) {
        if (error.errcode === 2067) error.code = 11000;
        throw error;
      }
      return this;
    }
    static create(data) { return new this(data).save(); }
    static find(filter = {}) {
      return db.prepare("SELECT body FROM records WHERE kind=?").all(kind)
        .map(row => JSON.parse(row.body))
        .filter(record => Object.entries(filter).every(([key, value]) => {
          if (value?.$in) return [].concat(record[key]).some(item => value.$in.includes(item));
          if (value?.$gte !== undefined) return record[key] >= value.$gte;
          return String(record[key]) === String(value);
        })).map(record => new this(record));
    }
    static findOne(filter) { return this.find(filter)[0] || null; }
    static findById(id) { return this.findOne({ _id: id }); }
    static findByIdAndUpdate(id, update) {
      const record = this.findById(id);
      if (!record) return null;
      record.set(update);
      return record.save();
    }
    static findByIdAndDelete(id) {
      const record = this.findById(id);
      db.prepare("DELETE FROM records WHERE kind=? AND id=?").run(kind, String(id));
      return record;
    }
    static findOneAndUpdate(filter, update, options = {}) {
      const record = this.findOne(filter) || (options.upsert && new this(filter));
      if (!record) return null;
      record.set(update);
      return record.save();
    }
  };
};
