const connection = require('./config/connection')
const inquirer = require('inquirer');
const cTable = require('console.table');

connection.connect(err => {
  if (err) throw err;
  console.log(`===========================`);
  console.log(`Welcome To Employee Manager`);
  console.log(`===========================`);
  promptQuestions();
});

//array for questions
const promptQuestions = () => {
  inquirer.prompt([
    {
    name: 'choices',
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
  ])
  .then((answers) => {
    const { options } = answers;

    if (options === "View all departments") {
      viewAllDepartments();
    }
    if (options === "View all roles") {
      viewAllRoles();
    }
    if (options === "View all employees") {
      viewAllEmployees();
    }
    if (options === "Add a department") {
      addADepartment();
    }
    if (options === "Add a role") {
      addARole();
    }
    if (options === "Add an employee") {
      addAnEmployee();
    }
    if (options === "Update an employee\'s role") {
      updateEmployeeRole();
    }
    if (options === "Exit") {
      connection.end();
    }
  });
};

const viewAllDepartments = () => {
  const sql =   `SELECT department.id AS id, department.department_name AS department FROM department`; 
  connection.promise().query(sql, (err, res) => {
    if (err) throw err;
    console.log(`================`);
    console.log(`Departments List`);
    consolg.log(`================`);
    console.table(res);
    promptQuestions();
  });
};

  viewAllRoles = () => {
    console.log(`==========`);
    consolg.log(`Roles List`);
    console.log(`==========`);
    const sql = `SELECT role.id, role.title, department.department_name AS department
    FROM role
    INNER JOIN department ON role.department_id = department.id`;
    connection.promise().query(sql, (err, res) => {
      if (err) throw err;
      res.forEach((roles) => {console.log(roles.title);});
      promptQuestions();
    })
  }
  viewAllEmployees = () => {
    let sql =     `SELECT employee.id, 
                  employee.first_name, 
                  employee.last_name, 
                  role.title, 
                  department.name AS 'department', 
                  role.salary
                  FROM employee, role, department
                  WHERE department.id = role.department_id 
                  AND role.id = employee.role_id
                  ORDER BY employee.id ASC`;
    connection.promise().query(sql, (err, response) => {
      if (err) throw error;
      console.log(`==============`);
      console.log(`Employees List`);
      consolg.log(`==============`);
      consolg.loe(response);
      promptQuestions();
    })
  };
  addADepartment = () => {
    inquirer.prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'Enter new department name',
      }
    ])
    .then((answer) => {
      let sql = `INSERT INTO departments (name) VALUES (?)`;
      connection.query(sql, answer.newDepartment, (err, response) => {
        if (err) throw err;
        console.log(`===============================`);
        console.log(`You just added a new department`);
        console.log(`===============================`);
        viewAllDepartments();
      })
    })
  };
  addARole = () => {
    const sql = 'SELECT * FROM department';
    connection.promise().query(sql, (error, response) => {
      if (error) throw error;
      let departmentArray = [];
      response.forEach((department) => {departmentArray.push(department.name)});
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
        response.forEach((department) => {
          if (departmentData.yourDepartment === department.name) {departmentId = department.id;}
        });
        let sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
        let roleArray = [aNewRole, answer.salary, departmentId];

        connection.promise().query(sql, roleArray, (error) => {
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
    addAnEmployee = () => {
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
            console.log( 'Last name is required');
            return false;
          }
          }
        }
    ])
    .then(answer => {
      const addEmployee = [answer.firstName, answer.lastName];
      const roleSql = `SELECT roles.id, roles.title FROM roles`;
      connsction.promise().query(roleSql, (error, data) => {
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
          connsction.promise().query(managerSql, (error, data) => {
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
    updateEmployeeRole = () => {
      let sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.id AS "role_id"
      FROM employees, roles, departments WHERE departments.id = roles.department_id AND rolds.id = employees.role_id`;
      connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        let employeeArray = [];
        response.forEach((employees) => {employeeArray.push(`${employees.first_name} ${employees.last_name}`)});
        let sql = `SELECT roles.id, roles.title FROM roles`;
        connection.promise().query(sql, (error, response) => {
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
              choices: rolesArrau
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
          connection.query(
            sqls,
            [newId, employeeId],
            (error) => {
              if (error) throw error;
              console.log(`=================================`);
              console.log(`You just updated employee\'s role`);
              console.log(`=================================`);
              promptQuestions();
            }
          );
        });
      });
    });
  };

