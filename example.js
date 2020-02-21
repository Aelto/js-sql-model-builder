const { model_builder, field } = require('./src');

class User extends model_builder({
  table: 'users',
  model: {
    id: field.integer.primary_key.autoincrement,
    email: field.text.not_null,
    password: field.text.not_null,
    role: field.integer.not_null
  },

  // a custom connection getter
  connection_getter: async () => {
    console.log(`should return conncetion :)`);
    return {};
  },

  // a custom query runner
  query_runner: async (query, data) => {
    console.log(`running: ${query} with ${data}`);
    return [];
  }
}) {
  
  log() {
    console.log(`${this.id}: ${this.email}`);
  }
};



const a = new User({
  id: 0,
  email: 'foo@bar.com',
  password: 'BlueStapleHorse1',
  role: 100
});

a.add();
a.remove();
a.log();

User.get_all();