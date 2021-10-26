const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const { Console } = require("console");
const { resolve } = require("path");
const { exit } = require("process");
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "ems_db"
  },
  console.log("Connection to employee management system database established.\n\n"),
  console.log(
    `    ────────────────────────────────────────\n
     * * * Employee Management System * * *\n
    ────────────────────────────────────────\n
    `)
);



const navMenu = ["View All Employees",
  "Add Employee", "Update Employee Role",
  "View All Roles", "Add Role",
  "View All Departments", "Add Department", "Quit"];
const questionsArr = [
  {
    type: "list",
    message: "What would you like to Do?\n",
    choices: navMenu,
    name: "navAnswer"
  }
];


function bootSequence() {
  inquirer
    .prompt(questionsArr)
    .then(data => {
      // console.log(data)
      isolator(data);
    })
    .catch(err => console.log(err));
}


function isolator(data) {
  // console.log("data be like:", data)
  // I'm only using a switch because I need more experience with them,
  // And it looks far nicer than like 300 if else statements lol.
  switch (data.navAnswer) {
  case "View All Employees":
    // console.log("view them employees");
    observeEmployees();
    break;
  case "Add Employee":
    // console.log("add that employee");
    employeesLoop();
    break;
  case "Update Employee Role":
    // console.log("update that role");
    modifyExistingHuman();
    break;
  case "View All Roles":
    // console.log("view them roles");
    percieveRoles();
    break;
  case "Add Role":
    // console.log("add that role");
    rolesLoop();
    break;
  case "View All Departments":
    // console.log("view them departments");
    detectDepartments();
    break;
  case "Add Department":
    // console.log("add that department");
    inquirer
      .prompt(addDepartments)
      .then(data => departmentAggrandizement(data))
      .catch(err => console.log(err));
    break;
  case "Quit":
    exit();
    break;
  default:
    console.log("Oh, wow, okay, that's a critical error. Don't know how you got this.");

  }
}

function observeEmployees() {
  db.query("select employee.id, first_name, last_name, title, salary, manager_id from employee inner join roles on employee.role_id = roles.id", (err, result) => {
    if (err) {
      console.log(err, "Oh, retrieving Employees list errored.");
    }
    console.table(result);
    bootSequence();
  });
}

function percieveRoles() {
  db.query("select * from roles", (err, result) => {
    if (err) {
      console.log(err, "Oh, retrieving Roles list errored.");
    }
    console.table(result);
    bootSequence();
  });
}

function detectDepartments() {
  db.query("select * from departments", (err, result) => {
    if (err) {
      console.log(err, "Oh, retrieving Employees list errored.");
    }
    console.table(result);
    bootSequence();
  });
}

const addDepartments = [
  {
    message: "What is the name of the department?\n",
    name: "adn"
  }
];
function departmentAggrandizement(data) {
  // console.log(data, "this is the data")
  db.query("insert into departments (department_name) values (?)", data.adn, (err) => {
    if (err) {
      console.log(err, "Problem with adding new Department...");
    }
    bootSequence();
  });
}

///////////////////////////
function rolesLoop() {
  // resets departmentlist
  var departmentList = [];
  db.query("select * from departments", (err, result) => {
    if (err) {
      console.log(err, "Error retrieving data.");
    }
    // console.log("Roles loop here.");
    // console.log("Let me log those for you1", result, result.length)
    for (i = 0; i < result.length; i++) {
      // console.log("Let me log those for you", result[i].department_name)
      departmentList.push(result[i].department_name);
    }
    // console.log(departmentList)
    const addRoles = [
      {
        message: "What is the name of the role?\n",
        name: "arName"
      },
      {
        message: "What is the salary of the role?\n",
        name: "arSalary"
      },
      {
        type: "list",
        message: "Which department does the role belong to?\n",
        choices: departmentList,
        name: "arBelong"
      },
    ];
    inquirer
      .prompt(addRoles)
      .then(data => roleIntensification(data, result))
      .catch(err => console.log(err));
  });
}
function roleIntensification(data, result) {
  // console.log(data, "this is le role data")
  var currentID;

  for (z = 0; z < result.length; z++) {
    if (data.arBelong === result[z].department_name) {
      currentID = result[z].id;
      // console.log(currentID)
    }
  }
  let perameters = [data.arName, parseInt(data.arSalary), currentID];
  // console.log(perameters, "this is the perameters")
  db.query("insert into roles (title, salary, department_id) values (?,?,?)", perameters, (err) => {
    if (err) {
      console.log(err, "Error creating role.");
    }
    console.log("Created role!");
    bootSequence();
  });
}
// ////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////
var rolesList = [];
var rolesListDetailed = [];
function retrieveRoles() {
  // Wipes the roles list clean, so it doesn't continually add roles
  rolesList = [];
  rolesListDetailed = [];
  // return new Promise(resolve => {
  db.query("select * from roles", (err, result) => {
    if (err) {
      console.log(err, "Error retrieving Roles list.");
    }

    for (v = 0; v < result.length; v++) {
      // console.log("Let me log those roles for you", result[i].title)
      rolesList.push(result[v].title);
    }
    rolesListDetailed.push(result);
    // console.log(rolesList)
    // resolve("resolved")
  });
  // });
}
function employeesLoop() {
  var employeeList = [];
  var employeeListDetailed = [];
  retrieveRoles();
  db.query("select * from employee", (err, result) => {
    if (err) {
      console.log(err, "Error retrieving data.");
    }
    // console.log("Employees loop here.");
    // console.log("Let me log those for you1", result, result.length)
    for (w = 0; w < result.length; w++) {
      // console.log("Let me log those for you", result[i].first_name)
      employeeList.push(result[w].first_name);
      // employeeListDetailed.push(result[i].first_name, result[i].id)
    }
    employeeListDetailed.push(result);
    employeeList.push("No Manager");
    // employeeListDetailed.push("No Manager")
    // console.log(employeeList)
    // console.log(rolesList, "checking roles List inside employees Loop")
    const addEmployees = [
      {
        message: "What is the employee's first name?\n",
        name: "aeFirstname"
      },
      {
        message: "What is the employee's last name?\n",
        name: "aeLastName"
      },
      {
        type: "list",
        message: "What is the employee's role?\n",
        choices: rolesList,
        name: "aeRoleBelong"
      },
      {
        type: "list",
        message: "What is the employee's manager?\n",
        choices: employeeList,
        name: "aeManager"
      }
    ];
    inquirer
      .prompt(addEmployees)
      .then(data => fabricateEmployee(data))
      .catch(err => console.log(err));
  });
  function fabricateEmployee(data) {
    // console.log(data, "this is the new human data")
    var roleID;
    var managerID;
    // for loop for the employees
    // console.log(data.aeManager);
    // console.log(employeeListDetailed);
    for (x = 0; x < employeeListDetailed[0].length; x++) {
      // console.log("this is the one in the loop", employeeListDetailed[0][x].id, employeeListDetailed[0][x].first_name, data.aeManager);
      if (data.aeManager !== "No Manager") {
        if (data.aeManager === employeeListDetailed[0][x].first_name) {
          managerID = employeeListDetailed[0][x].id;
        }
      } else {
        managerID = null;
      }
    }
    // console.log("manager ID:", managerID)
    // for loop for the roles.
    // console.log(data)
    //
    // This was a mess, I really should have just made it async it would have been 200x easier.
    // The amount of trial and error was pretty extreme because of several unexpected problems..
    //
    // console.log("role Belong:", data.aeRoleBelong)
    // console.log("detailed role list:", rolesListDetailed[0][y].title)
    for (y = 0; y < rolesListDetailed[0].length; y++) {
      // console.log("detailed role listsss:", rolesListDetailed[0][y].title)
      if (data.aeRoleBelong === rolesListDetailed[0][y].title) {
        roleID = rolesListDetailed[0][y].id;
      }
      //  console.log("didn't work", rolesListDetailed.length)
    }
    // console.log("role ID:", roleID)
    let perammies = [data.aeFirstname, data.aeLastName, roleID, managerID];
    // console.log(perammies, "this is the perameters")
    db.query("insert into employee (first_name, last_name, role_id, manager_id) values (?,?,?,?)", perammies, (err) => {
      if (err) {
        console.log(err, "Error adding Human.");
      }
      console.log("Added Human!");
      bootSequence();
    });
  }
}


// Globalized for stuff below.
var grabThemRoles = [];
// var grabThemRolesButInsteadTheseAreVerySlightlyMoreDetailed = [];
// Global variables to everything below
var grabEmployees = [];
// var grabEmployeesDetailed = [];

function grabThoseEmployees() {
  // resets the variables so I don't keep adding to them endlessly.
  var grabEmployees = [];
  var grabEmployeesDetailed = [];

  db.query("select * from employee", (err, result) => {
    if (err) {
      console.log(err, "Error retrieving data.");
    }
    for (u = 0; u < result.length; u++) {
      // 800IQ play of just using a string literal here.
      grabEmployees.push(`${result[u].first_name} ${result[u].last_name}`);
    }
    grabEmployeesDetailed.push(result);
    // console.log("4", grabThemRoles, grabEmployees);

    // I hate that I had to make this nested due to time constraints
    // note to self, fix this later.


    function grabThoseRoles() {
      // resets the variables so I don't keep adding them; add infinitum.
      var grabThemRoles = [];
      var grabThemRolesButInsteadTheseAreVerySlightlyMoreDetailed = [];


      db.query("select * from roles", (err, result) => {
        if (err) {
          console.log(err, "Error retrieving data.");
        }
        for (v = 0; v < result.length; v++) {

          grabThemRoles.push(result[v].title);
        //   console.log(grabThemRoles);
        }
        grabThemRolesButInsteadTheseAreVerySlightlyMoreDetailed.push(result);

        // console.log("5", grabThemRoles, grabEmployees);

        const modifyPrompt = [
          {
            type: "list",
            message: "Select the Employee you wish to change the role of.\n",
            choices: grabEmployees,
            name: "chosenOne"
          },
          {
            type: "list",
            message: "Select the role.\n",
            choices: grabThemRoles,
            name: "chosenRole"
          }
        ];

        // like, actually eww, grossly nested

        inquirer
          .prompt(modifyPrompt)
          .then(data => roleReplacer(data))
          .catch(err => console.log(err));

        var newRoleID;
        var employeeID;

        function roleReplacer(data) {
          // console.log(data)

          for (s = 0; s < grabEmployeesDetailed[0].length; s++) {
            // console.log(`${grabEmployeesDetailed[0][s].first_name} ${grabEmployeesDetailed[0][s].last_name}`, data.chosenOne)
            if (data.chosenOne === `${grabEmployeesDetailed[0][s].first_name} ${grabEmployeesDetailed[0][s].last_name}`) {
              employeeID = grabEmployeesDetailed[0][s].id;
            }
          }

          for (t = 0; t < grabThemRolesButInsteadTheseAreVerySlightlyMoreDetailed[0].length; t++) {
            // console.log(grabThemRolesButInsteadTheseAreVerySlightlyMoreDetailed[0][t].title + data.chosenRole)
            if (data.chosenRole === grabThemRolesButInsteadTheseAreVerySlightlyMoreDetailed[0][t].title) {
              newRoleID = grabThemRolesButInsteadTheseAreVerySlightlyMoreDetailed[0][t].id;
            }
          }

          var status = [newRoleID, employeeID];

          db.query("update employee set role_id = (?) where id = (?)", status, (err, result) => {
            if (err) {
              console.log(err, "Error retrieving data.");
            }
            console.log("DID IT OKAY");
            bootSequence();
            // fix disgusting neted functions later.
          });
        }
      });
    }
    grabThoseRoles();
  });
}
// Like, omg, way too nested.
// Technically it does work though...

function modifyExistingHuman() {
  // I can fix this later, rn it should all be separated.
//   console.log("1", grabThemRoles, grabEmployees);
  grabThoseEmployees();
// I need to refractor-
}




bootSequence();