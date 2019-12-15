const userModel = `
  id int primary key auto_increment,
  email varchar(255) not null,
  password_hash varchar(255) not null,
  status enum('ACTIVE','INACTIVE') not null,
  created_at datetime not null,
  updated_at datetime not null,
  last_login_at datetime not null,
  constraint user_email unique(email)
`;

const createUserTable = `create table if not exists users(${userModel})`;

module.exports = createUserTable;
