INSERT INTO department
  (name)
VALUES
  ('Sales'),
  ('Finance'),
  ('Engineering'),
  ('Legal'),
  ('Human Resources'),
  ('Marketing'),
  ('Production'),
  ('Reserch'),
  ('Management');
  
INSERT INTO role
  (title, salary, department_id)
VALUES
  ('Chairman', 9000.00, 1),
  ('CEO', 8000.00, 1),
  ('CFO', 8000.00, 1),
  ('CMO', 8000.00, 1),
  ('CHRO', 8000.00, 1),
  ('Senior VP', 7000.00, 2),
  ('VP', 7000.00, 2),
  ('Assistant VP', 6000.00, 2),
  ('Accountant', 6000.00, 2),
  ('Attorney', 6000.00, 2),
  ('Senior Researcher', 6000.00, 2),
  ('Director', 6000.00, 2),
  ('Manager', 6000.00, 2),
  ('Senior Manager', 6000.00, 3),
  ('Assistant Manager', 5000.00, 3),
  ('Associate Scientist', 5000.00, 3),
  ('Legal Assistant', 5000.00, 3),
  ('Executive', 5000.00, 3),
  ('Admin', 5000.00, 4),
  ('Clerk', 4000.00, 4),
  ('Intern', 4000.00, 4);

INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ('Ronald', 'Firbank', 1, NULL),
  ('Virginia', 'Woolf', 2, 1),
  ('Piers', 'Gaveston', 3, 1),
  ('Charles', 'Chen', 4, 1),
  ('Katherine', 'Mansfield', 5, 1),
  ('Dora', 'Carrington', 6, 4),
  ('Edward', 'Singh', 7, 6),
  ('Montague', 'Summers', 8, 7),
  ('Octavia', 'Butler', 9, 3),
  ('Unica', 'Zurn', 10, 9),
  ('Matthew', 'Chang', 11, 2),
  ('Anna', 'Davis', 12, 4),
  ('Luke', 'Tailor', 13, 8),
  ('Ted', 'Hopkins', 14, 13),
  ('Catherine', 'Anderson', 15, 14),
  ('Merry', 'Williams', 16, 11),
  ('Olivia', 'Lam', 17, 10),
  ('Liam', 'Johnson', 18, 15),
  ('Noah', 'Garcia', 19, 18),
  ('Charlotte', 'Smith', 20, 9),
  ('George', 'Brown', 21, 16);
  