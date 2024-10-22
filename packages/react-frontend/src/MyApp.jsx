// src/MyApp.jsx

import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
	// src/MyApp.jsx (empty state)
	const [characters, setCharacters] = useState([]); 

  function removeOneCharacter(index) {
     const removedChar = characters.filter((character, i) => {
	     return i === index;
     });
     const _id = removedChar[0]._id;
     const promise = fetch(`Http://localhost:8000/users/${_id}`, {
	     method: "DELETE"
     });
	promise.then((res) => {
	     if(res.status === 204) {
		const updated = characters.filter((character, i) => {
			return i !== index;
		});
		     setCharacters(updated);

	     } else {
		     return undefined;
	     }
    });
  }
	useEffect(() => {
	  fetchUsers()
	    .then((res) => res.json())
	    .then((json) => setCharacters(json["users_list"]))
	    .catch((error) => {
	      console.log(error);
	    });
	}, []);

	function postUser(person) {
	  const promise = fetch("Http://localhost:8000/users", {
	    method: "POST",
	    headers: {
	      "Content-Type": "application/json"
	    },
	    body: JSON.stringify(person)
	  });

	  return promise;
	}

	function fetchUsers() {
	  const promise = fetch("http://localhost:8000/users");
	  return promise;
	}

	function updateList(person) {
	  postUser(person)
	    .then((res) => res.status === 201 
		    ? res.json()
		    : undefined)
		    .then((json) => {
			    if(json) {
			    	person._id = json["_id"];
			    	setCharacters([...characters, person]);
			    }
		    })
	    .catch((error) => {
	      console.log(error);
	    });
	}
	
  return (
    <div className="container">
      <Table 
	  characterData={characters}
	  removeCharacter={removeOneCharacter} 
	  />
      <Form handleSubmit={updateList} />
    </div>
  );
}
export default MyApp;

