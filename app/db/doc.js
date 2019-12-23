const docModel = `
  id int primary key auto_increment,
  document_id varchar(100) not null,
  version varchar(20) not null,
  title varchar(50) not null,
  is_private boolean default false,
  is_published boolean default false,
  created_at datetime not null,
  updated_at datetime not null,
  user_id int not null,
  email varchar(255) not null,
  constraint fk_docs_users_id foreign key (user_id) references users(id) on update cascade on delete cascade,
  constraint fk_docs_users_email foreign key (email) references users(email) on update cascade on delete cascade
`;

const createDocTable = `create table if not exists docs(${docModel})`;

module.exports = createDocTable;
