const connection = require('./config/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');


connection.connect((error) => {
  if (error) throw error;
  console.log(`===========================`);
  console.log(`Welcome To Employee Manager`);
  console.log(`===========================`);
  commitPrompt();
});


//array for questions
const promptQuestions = [
    {
    name: 'action',
    type: 'list',
    message: 'Choose an option you want to commit',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee\'s role',
      'Exit'
    ]
    }
  ];

  const commitPrompt = () => {

  inquirer.prompt(promptQuestions)
  .then((answers) => {

    if (answers.action == 'View all departments') {
      viewAllDepartments();
    }
    else if (answers.action == 'View all roles') {
      viewAllRoles();
    }
    else if (answers.action == 'View all employees') {
      viewAllEmployees();
    }
    else if (answers.action == 'Add a department') {
      addingDepartment();
    }
    else if (answers.action == 'Add a role') {
      addARole();
    }
    else if (answers.action == 'Add an employee') {
      addAnEmployee();
    }
    else if (answers.action == 'Update an employee\'s role') {
      updateEmployeeRole();
    }
    else if (answers.action == 'Exit'){
      connection.end();
    }
  });
};

const viewAllDepartments = () => {
  const sql =  "SELECT departments.id AS id, departments.depname AS departments FROM departments;"; 
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.log(`================`);
    console.log(`Departments List`);
    console.log(`================`);
    console.table(res);
    commitPrompt();
  });
};

const viewAllRoles = () => {
    const sql = `SELECT roles.id, roles.title, roles.salary, departments.depname AS departments FROM roles
    INNER JOIN departments ON departments.id = roles.department_id;`;
    connection.query(sql, (err, res) => {
      if (err) throw err;
      console.log(`==========`);
      console.log(`Roles List`);
      console.log(`==========`);
      console.table(res);
      commitPrompt();
    })
  }
const viewAllEmployees = () => {
    const sql =   `SELECT employees.id, 
                  employees.first_name, 
                  employees.last_name, 
                  roles.title, 
                  departments.depname AS 'departments', 
                  roles.salary
                  FROM employees, roles, departments
                  WHERE departments.id = roles.department_id 
                  AND roles.id = employees.role_id
                  ORDER BY employees.id ASC`;
    connection.query(sql, (err, res) => {
      if (err) throw err;
      console.log(`==============`);
      console.log(`Employees List`);
      console.log(`==============`);
      console.table(res);
      commitPrompt();
    })
  };
  const addADepartment =
    [
      {
        name: 'newDepartment',
        type: 'input',
        message: 'Enter new department name',
      }
    ]

  const addingDepartment = () => {
    inquirer.prompt(addADepartment)
    .then((answer) => {
      let sql = `INSERT INTO departments(depname) VALUES (?)`;
      connection.query(sql, answer.newDepartment, (err, response) => {
        if (err) throw err;
        console.log(`===============================`);
        console.log(`You just added a new department`);
        console.log(`===============================`);
        viewAllDepartments();
      })
    })
  };
  const addARole = () => {
    const sql = 'SELECT * FROM departments';
    connection.query(sql, (error, response) => {
      if (error) throw error;
      let departmentArray = [];
      response.forEach((departments) => {departmentArray.push(departments.depname)});
      departmentArray.push('Choose your department');
      inquirer.prompt([
        {
          name: 'yourDepartment',
          type: 'list',
          message: 'Choose your department',
          choices: departmentArray
        }
      ])
      .then((answer) => {
        if (answer.yourDepartment === 'Choose department') {
          this.addADepartment();
        } else {
          keepAddingrole(answer);
        }});
        const keepAddingrole = (departmentData) => {
          inquirer.prompt([{
            name: 'newRole',
            type: 'input',
            messsage: 'Enter new role name',
            //validate: validate.validateString
          },
        {
          name: 'salary',
          type: 'input',
          message: 'Enter your salary',
          //validate: validate.validateSalary
        }
      ])
      .then((answer) => {
        let aNewRole = answer.newRole;
        let departmentId;
        response.forEach((departments) => {
          if (departmentData.yourDepartment === departments.depname) {departmentId = departments.id;}
        });
        let sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
        let roleArray = [aNewRole, answer.salary, departmentId];

        connection.query(sql, roleArray, (error) => {
          if (error) throw error;
          console.log(`=======================`);
          console.log(`You just add a new role`);
          console.log(`=======================`);
          viewAllRoles();
        })
      })
        }
      })
    };
    const addAnEmployee = () => {
      inquirer.prompt([{
        type: 'input',
        name: 'firstName',
        message: 'Enter employee\'s first name',
        validate: addFirstName => {
          if (addFirstName) {
            return true;
          } else {
            console.log('First name is required');
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Enter employee\'s last name',
        validate: addLastName => {
          if (addLastName) {
            return true;
          } else {
            console.log('Last name is required');
            return false;
          }
          }
        }
    ])
    .then(answer => {
      const addEmployee = [answer.firstName, answer.lastName];
      const roleSql = `SELECT roles.id, roles.title FROM roles`;
      connection.query(roleSql, (error, data) => {
        if (error) throw error;
        const roleList = data.map(({ id, title }) => ({ name: title, value: id}));
        inquirer.prompt([
          {
            type: 'list',
            name: 'roleList',
            message: 'Enter employee\'s role',
            choices: roleList
          }
        ])
        .then(chosenRole => {
          const aRole = chosenRole.roles;
          addEmployee.push(aRole);
          const managerSql = `SELECT * FROM employees`;
          connection.query(managerSql, (error, data) => {
            if (error) throw error;
            const managerList = data.map(({ id, first_name, last_name}) => ({ name: first_name + "" + last_name, value: id}));
            inquirer.prompt([
              {
                type: 'list',
                name: 'managerList',
                message: 'Enter employee\'s manager',
                choices: managerList
              }
            ])
            .then(chooseManager => {
              const manager = chooseManager.manager;
              addEmployee.push(manager);
              const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
              connection.query(sql, addEmployee, (error) => {
                if (error) throw error;
                console.log('You just added an employee');
                viewAllEmployees();
              });
            });
          })
        });
      });
    });
    };
    const updateEmployeeRole = () => {
      let sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.id AS "role_id"
      FROM employees, roles, departments WHERE departments.id = roles.department_id AND roles.id = employees.role_id`;
      connection.query(sql, (error, response) => {
        if (error) throw error;
        let employeeArray = [];
        response.forEach((employees) => {employeeArray.push(`${employees.first_name} ${employees.last_name}`)});
        let sql = `SELECT roles.id, roles.title FROM roles`;
        connection.query(sql, (error, response) => {
          if (error) throw error;
        let rolesArray = [];
        response.forEach((roles) => {
          rolesArray.push(roles.title)});
          inquirer.prompt([
            {
              name: 'chooseEmployee',
              type: 'list',
              message: 'Choose an employee who will have a new role',
              choices: employeeArray
            },
            {
              name: 'chooseRole',
              type: 'list',
              message: 'Enter a new role',
              choices: rolesArray
            }
          ])
          .then((answer) => {
            let newId, employeeId;
            response.forEach((roles) => {
              if (answer.chooseRole === roles.title)
              {newId = roles.id;
              }
            });
            response.forEach((employees) => {
              if (answer.chooseEmployee === `${employees.first_name} ${employees.last_name}`) 
            {
              employeeId = employees.id;
            }
          });

          let sqls = `UPDATE employees SET employees.role_id = ? WHERE employees.id =?`;
          connection.query(sqls,
            [newId, employeeId],
            (error) => {
              if (error) throw error;
              console.log(`=================================`);
              console.log(`You just updated employee\'s role`);
              console.log(`=================================`);
              viewAllEmployees();
              commitPrompt();
            }
          );
        });
      });
    });
  };
