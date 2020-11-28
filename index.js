import retrieve from "./api/managed-records";
export { retrieve };

// Testing
const colors = ["red", "brown", "blue", "yellow", ""]; //["green", "blue", "red"];
const options = { page: 1, colors };

retrieve(options).then(
  (data) => console.log("success:", data),
  (error) => console.log("error:", error)
);
