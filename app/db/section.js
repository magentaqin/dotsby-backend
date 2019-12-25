const sectionModel = `
  id int primary key auto_increment,
  section_id varchar(255) primary key,
  title varchar(50) not null,
  order_index int not null,
  page_info text not null,
  created_at datetime not null,
  updated_at datetime not null,
  doc_id int not null,
  constraint fk_sections_docs_id foreign key (doc_id) references docs(id) on update cascade on delete cascade
`;

const createSectionTable = `create table if not exists sections(${sectionModel})`;

module.exports = createSectionTable;
