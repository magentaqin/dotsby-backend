const apiItemModel = `
  id int primary key auto_increment,
  displayName varchar(255) not null,
  description varchar(1000) not null,
  type enum('REQUEST_HEADERS','REQUEST_BODY', 'QUERY_PARAMS', 'RESPONSE_HEADERS', 'RESPONSE_DATA') not null,
  created_at datetime not null,
  updated_at datetime not null,
  page_id int not null,
  constraint fk_api_items_pages_id foreign key (page_id) references pages(id) on update cascade on delete cascade
`;

const createApiItemTable = `create table if not exists api_items(${apiItemModel})`;

module.exports = createApiItemTable;
