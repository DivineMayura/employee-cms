const mysql = require('mysql2');
const inquirer = require("inquirer");
const util = require("util");

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
            console.log("view them employees");
            observeEmployees()
            break;
        case 'Add Employee':
            console.log("add that employee");
            fabricateEmployee()
            break;
        case 'Update Employee Role':
            console.log("update that role");
            modifyExistingHuman()
            break;
        case 'View All Roles':
            console.log("view them roles");
            percieveRoles()
            break;
        case 'Add Role':
            console.log("add that role");
            roleIntensification()
            break;
        case 'View All Departments':
            console.log("view them departments");
            detectDepartments()
            break;
        case 'Add Department':
            console.log("add that department");
            departmentAggrandizement()
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
    db.query(`select * from employee`, (err, result) => {

        if (err) { console.log(err, "Oh, retrieving Employees list errored.") };

        console.table(result);

        bootSequence();
    })
};

function percieveRoles() {
    db.query(`select * from roles`, (err, result) => {

        if (err) { console.log(err, "Oh, retrieving Employees list errored.") };

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
// async function detectDepartments() {
//     db.query
// }







bootSequence()