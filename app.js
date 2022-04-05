//third line

const express = require("express");
const app = express();
//
const fs = require("fs");
const PORT = 8000;

app.set("view engine", "pug");
app.use("/static", express.static("assets"));
app.use(express.urlencoded({ extended: false }));
//
app.get("/", (req, res) => {
  fs.readFile("./data/todos.json", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    res.render("home", { todos: todos });
  });
});

app.post("/add", (req, res) => {
  const formData = req.body;

  if (formData.todo.trim() == "") {
    fs.readFile("./data/todos.json", (err, data) => {
      if (err) throw err;
      const todos = JSON.parse(data);
      res.render("home", { error: true, todos: todos });
    });
  } else {
    fs.readFile("./data/todos.json", (err, data) => {
      if (err) throw err;

      const todos = JSON.parse(data);

      const todo = {
        id: id(),
        description: formData.todo,
        done: false,
      };

      todos.push(todo);
      fs.writeFile("./data/todos.json", JSON.stringify(todos), (err) => {
        if (err) throw err;

        fs.readFile("./data/todos.json", (err, data) => {
          if (err) throw err;
          const todos = JSON.parse(data);
          res.render("home", { success: true, todos: todos });
        });
      });
    });
  }
});
app.get("/:id/delete", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/todos.json", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    const filteredtodos = todos.filter((todo) => todo.id != id);
    fs.writeFile("./data/todos.json", JSON.stringify(filteredtodos), (err) => {
      if (err) throw err;

      res.render("home", { todos: filteredtodos, delete: true });
    });
  });
});

app.get('/:id/update', (req, res) => {
  const id = req.params.id

  fs.readFile('./data/todos.json', (err, data) => {
    if (err) throw err

    const todos = JSON.parse(data)
    const todo = todos.filter(todo => todo.id == id)[0]
    
    const todoIdx = todos.indexOf(todo)
    const splicedTodo = todos.splice(todoIdx, 1)[0]
    
    splicedTodo.done = true

    todos.push(splicedTodo)

    fs.writeFile('./data/todos.json', JSON.stringify(todos), (err) => {
      if (err) throw err

      res.render('home', { todos: todos })
    })
  })
})

app.listen(PORT, (err) => {
  if (err) throw err;

  console.log(`this app is running on port ${PORT}`);
});

function id() {
  return "_" + Math.random().toString(36).substring(2, 9);
}
