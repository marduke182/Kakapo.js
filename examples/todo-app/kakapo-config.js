((global) => {
  const server = new global.Kakapo.Server();
  const router = new global.Kakapo.Router();
  const db = new global.Kakapo.Database();

  db.register('todo', (faker) => ({
    title: faker.company.companyName,
    done: faker.random.boolean,
  }));
  db.create('todo', 10);

  router.get('/todos', () => db.all('todo'));

  router.post('/todos', (request) => {
    const todo = JSON.parse(request.body);
    return db.push('todo', todo);
  });

  router.put('/todos/:todo_id', (request) => {
    const updatedTodo = JSON.parse(request.body);
    const id = parseInt(request.params.todo_id, 10);
    const todo = db.findOne('todo', { id });

    Object.keys(updatedTodo).forEach(k => { todo[k] = updatedTodo[k]; });
    todo.save();
    return todo;
  });

  router.delete('/todos/:todo_id', (request) => {
    const id = parseInt(request.params.todo_id, 10);
    const todo = db.findOne('todo', { id });

    todo.delete();
    return db.all('todo');
  });

  server.use(router);
  server.use(db);
})(this);
