const pageModel = `
  id int primary key auto_increment,
  page_id varchar(255) primary key,
  title varchar(50) not null,
  is_root_path boolean default false,
  path varchar(100) not null,
  content text not null,
  api_content text not null,
  request_url varchar(100),
  subtitles varchar(1000) not null,
  created_at datetime not null,
  updated_at datetime not null,
  section_id int not null,
  constraint fk_pages_sections_id foreign key (section_id) references sections(id) on update cascade on delete cascade
`;

const createPageTable = `create table if not exists pages(${pageModel})`;

module.exports = createPageTable;
