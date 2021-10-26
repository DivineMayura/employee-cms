const mysql = require('mysql2');
const inquirer = require("inquirer");
const util = require("util");
const consoleTable = require("console.table");
const { Console } = require('console');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'ems_db'
    },
    console.log("Connection to employee management system database established.\n\n"),
    console.log(
        `    ────────────────────────────────────────\n
     * * * Employee Management System * * *\n
    ────────────────────────────────────────\n
    `)
);
const dbquery = util.promisify(db.query).bind(db);



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
            isolator(data)
        })
        .catch(err => console.log(err))
}


function isolator(data) {
    // console.log("data be like:", data)
    // I'm only using a switch because I need more experience with them,
    // And it looks far nicer than like 300 if else statements lol.
    switch (data.navAnswer) {
        case 'View All Employees':
            // console.log("view them employees");
            observeEmployees()
            break;
        case 'Add Employee':
            // console.log("add that employee");
            inquirer
                .prompt(addEmployee)
                .then(data => fabricateEmployee(data))
                .catch(err => console.log(err))
            break;
        case 'Update Employee Role':
            // console.log("update that role");
            modifyExistingHuman()
            break;
        case 'View All Roles':
            // console.log("view them roles");
            percieveRoles()
            break;
        case 'Add Role':
            // console.log("add that role");
            rolesLoop()
            break;
        case 'View All Departments':
            // console.log("view them departments");
            detectDepartments()
            break;
        case 'Add Department':
            // console.log("add that department");


            inquirer
                .prompt(addDepartments)
                .then(data => departmentAggrandizement(data))
                .catch(err => console.log(err))
            break;
        case 'Quit':
            console.log("Let ME OUT of HERE");
            console.log("NOTE TO SELF, find out how to exit aplication.");
            break;
        default:
            console.log("Oh, wow, okay, that's a critical error. Don't know how you got this.")

    }
};

function observeEmployees() {
    db.query(`select * from employe`, (err, result) => {

        if (err) { console.log(err, "Oh, retrieving Employees list errored.") };

        console.table(result);

        bootSequence();
    })
};

function percieveRoles() {
    db.query(`select * from roles`, (err, result) => {

        if (err) { console.log(err, "Oh, retrieving Roles list errored.") };

        console.table(result);

        bootSequence();
    })
};

function detectDepartments() {
    db.query(`select * from departments`, (err, result) => {

        if (err) { console.log(err, "Oh, retrieving Employees list errored.") };

        console.table(result);

        bootSequence();
    })
};

const addDepartments = [
    {
        message: "What is the name of the department?\n",
        name: "adn"
    }
]
function departmentAggrandizement(data) {
    // console.log(data, "this is the data")
    db.query(`insert into departments (department_name) values (?)`, data.adn, (err, result) => {
        if (err) { console.log(err, "Problem with adding new Department...") }
        bootSequence()
    })
};



///////////////////////////
function rolesLoop() {
    // resets departmentlist
    var departmentList = [];

    db.query(`select * from departments`, (err, result) => {
        if (err) { console.log(err, "Error retrieving data.") }


        console.log("Roles loop here.");
        console.log("Let me log those for you1", result, result.length)

        for (i = 0; i < result.length; i++) {
            console.log("Let me log those for you", result[i].department_name)
            departmentList.push(result[i].department_name)
        }
        console.log(departmentList)


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

        ]


        inquirer
            .prompt(addRoles)
            .then(data => roleIntensification(data, result))
            .catch(err => console.log(err))

    })
}



async function roleIntensification(data, result) {
    console.log(data, "this is le role data")
    var currentID;

    for (z = 0; z < result.length; z++) {
        if (data.arBelong == result[z].department_name) {
            currentID = result[z].id;
            console.log(currentID)
        }
    }

    let perameters = [data.arName, parseInt(data.arSalary), currentID]
    console.log(perameters, "this is the perameters")
    db.query(`insert into roles (title, salary, department_id) values (?,?,?)`, perameters, (err, result) => {
        if (err) { console.log(err, "Error creating role.") }
        console.log("Created role!")
        bootSequence()
    })

    
}

function fabricateEmployee(data) {
    console.log(data, "this is the new human data")

}




bootSequence();