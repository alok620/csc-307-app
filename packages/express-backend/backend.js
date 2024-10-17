// backend.js
import express from "express";
import cors from "cors";

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

const IDs = new Set(["xyz789", "abc123", "ppp222",
	"yat999", "zap555"]);

const app = express();
const port = 8000;

app.use(cors());


app.use(express.json());

const generateID = () => {
	return Math.random().toString(36).slice(2)
}

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserByJob = (job) => {
  return users["users_list"].filter(
    (user) => user["job"] === job
  );
};

const findUserByNameJob = (name, job) => {
  return users["users_list"].filter(
    (user) => (user["name"] === name && user["job"] === job)
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

const deleteUser = (id) =>
	users["users_list"].splice(users["users_list"].findIndex((user) => user["id"] === id), 1);
	

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    deleteUser(id);
    res.send();
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  let ID = generateID();
  while(IDs.has(ID)) {
	  ID = generateID();
  }
  IDs.add(ID);
  userToAdd.id = ID;
  addUser(userToAdd);
  res.status(201).send("Content Created");
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  let result = [];
  if (name != undefined && job != undefined) {
    result = findUserByNameJob(name, job); 
  }
  else if (name != undefined && job === undefined) {
    result = findUserByName(name);
   
  } 
  else if (name === undefined && job != undefined){
    result = findUserByJob(job);
  } 
  else {
    res.send(users);
  }
  result = { users_list: result };
  res.send(result);
});


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
	res.send(users);
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

