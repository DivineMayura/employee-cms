const mysql = require('mysql2');
const inquirer = require("inquirer");


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'ems_db'
    },
    console.log("Connection to employee management system database established.\n\n"),
    console.log(
    `     **************************************\n
     * * * Employee Management System * * *\n
     ______________________________________\n
    `)
);

const navMenu = ["View All Employees",
                    "Add Employee", "Update Employee Role",
                    "View All Roles", "Add Role",
                    "View All Departments","Add Department","Quit"];
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
        console.log(data)

    })
    .catch(err => console.log(err))
}













bootSequence()