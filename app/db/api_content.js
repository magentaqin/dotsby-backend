const apiContentModel = `
  id int primary key auto_increment,
  title varchar(50) not null,
  request_url varchar(50) not null,
  method varchar(10) not null,
  request_headers varchar(1000) not null,
  query_params varchar(1000) not null,
  created_at datetime not null,
  updated_at datetime not null,
  page_id int,
  constraint fk_api_contents_pages_id foreign key (page_id) references pages(id) on update cascade on delete cascade
`;

const createApiContentTable = `create table if not exists api_contents(${apiContentModel})`;

module.exports = createApiContentTable;
