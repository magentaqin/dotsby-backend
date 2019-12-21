const sectionModel = `
  id int primary key auto_increment,
  title varchar(50) not null,
  created_at datetime not null,
  updated_at datetime not null,
  doc_id int,
  constraint fk_sections_docs_id foreign key (doc_id) references docs(id) on update cascade on delete cascade
`;

const createSectionTable = `create table if not exists sections(${sectionModel})`;

module.exports = createSectionTable;
