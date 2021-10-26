insert into departments (id,department_name)
values  (1, "Water Nation"),
        (2, "Fire Nation"),
        (3, "Earth Nation"),
        (4, "Air Nation");

insert into roles (id, title, salary, department_id)
values  (1,"Goat Tamer", 395478.23, 2),
        (2,"Relaxer", 6241.2, 3),
        (3,"Marketing Slave", 1.01, 1),
        (4,"Modern Shogun", 5793824, 4);

insert into employee (id,first_name,last_name,role_id,manager_id)
values  (1, "bob","bobbins", 1, null),
        (2, "Mike", "Hawk", 4, 1),
        (3, "spooky", "name", 3, null),
        (4, "tom", "drif", 2, 3),
        (5, "ashlyn", "blanch", 3, null),
        (6, "sarah", "thommas", 4, null),
        (7, "saturn", "plannet", 1, 6);



        