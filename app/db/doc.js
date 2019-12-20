const docModel = `
  id int primary key auto_increment,
  document_id varchar(100) not null,
  version varchar(20) not null,
  title varchar(50) not null,
  created_at datetime not null,
  updated_at datetime not null,
  user_id int,
  constraint user_id foreign key (user_id) references users(id) on update cascade on delete cascade
`;

const createDocTable = `create table if not exists docs(${docModel})`;

module.exports = createDocTable;
