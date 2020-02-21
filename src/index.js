
function model_builder({ table, model, connection_getter, query_runner }) {
  const fields_names = Object.keys(model);
  
  return class {
    constructor (data = {}) {
      for (const field_name of fields_names) {
        this[field_name] = data[field_name];
      }
    }

    add() {
      const fields = fields_names.filter(f => f !== 'id');
      const query = `
        inser into ${table}
        (${fields.join(', ')})
        values
        (${fields.map(() => '?').join(', ')})
      `;

      return query_runner(query, fields.map(f => this[f]));
    }

    async remove() {
      const fields = fields_names;
      const query = `
        delete from ${table}
        where
          ${fields.map(f => 
              `${f} = ?`
            ).join(' and ')
          }
      `;

      return query_runner(query, fields.map(f => this[f]));
    }

    static async get_all() {
      const set = await query_runner(`select * from ${table}`, []);

      return set.map(u => new this(u));
    }

    static async create_table() {
      const query = `
        create table if not exists ${table} (
          ${
            fields_names.map(f => 
            `${f} ${model[f].__ok__.descriptions.join(' ')}`
            ).join(', ')
          }
        )
      `;

      return query_runner(query);
    }
  };
}

const field_handler = {
  get: (obj, description) => {
    if (description === "__ok__") {
      return obj;
    }

    const new_descriptions = description.split('_');
    
    return new Proxy({
      ...obj,
      descriptions: [
        ...(obj.descriptions || []),
        ...new_descriptions
      ]
    }, field_handler);
  }
}

const field = new Proxy({}, field_handler);

module.exports = {
  model_builder,
  field
};