const anchorPageModel = `
  id int auto_increment,
  title varchar(50) not null,
  anchor varchar(50),
  paragraph text not null,
  created_at datetime not null,
  updated_at datetime not null,
  page_id varchar(255) not null,
  section_id varchar(255) not null,
  unique key(id),
  primary key(page_id),
  constraint fk_anchor_pages_sections_section_id foreign key (section_id) references sections(section_id) on update cascade on delete cascade
`;

const createAnchorPageTable = `create table if not exists anchor_pages(${anchorPageModel})`;

module.exports = createAnchorPageTable;
