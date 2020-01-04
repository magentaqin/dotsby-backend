const pageModel = `
  id int auto_increment,
  page_id varchar(255),
  title varchar(50) not null,
  is_root_path boolean default false,
  path varchar(100) not null,
  content text not null,
  api_content text not null,
  request_url varchar(100),
  subtitles varchar(1000),
  created_at datetime not null,
  updated_at datetime not null,
  section_id varchar(255) not null,
  unique key(id),
  primary key(page_id),
  constraint fk_pages_sections_section_id foreign key (section_id) references sections(section_id) on update cascade on delete cascade
`;

const createPageTable = `create table if not exists pages(${pageModel})`;

module.exports = createPageTable;
