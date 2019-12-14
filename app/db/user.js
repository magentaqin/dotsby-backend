const userModel = `
  id int primary key auto_increment,
  email varchar(255) not null,
  password_hash varchar(255) not null,
  status enum('ACTIVE','INACTIVE') not null,
  created_at datetime not null,
  updated_at datetime not null,
  last_login_at datetime not null
`;

const createUserTable = `create table if not exists users(${userModel})`;

module.exports = createUserTable;
