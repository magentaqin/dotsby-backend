const anchorPageModel = `
  id int primary key auto_increment,
  lv0 varchar(50),
  lv1 varchar(50),
  lv2 varchar(50),
  lv3 varchar(50),
  lv4 varchar(50),
  lv5 varchar(50),
  lv6 varchar(50),
  anchor varchar(50),
  paragraph text not null,
  created_at datetime not null,
  updated_at datetime not null,
  page_id varchar(255) not null,
  section_id varchar(255) not null,
  constraint fk_anchor_pages_sections_section_id foreign key (section_id) references sections(section_id) on update cascade on delete cascade
`;

const createAnchorPageTable = `create table if not exists anchor_pages(${anchorPageModel})`;

module.exports = createAnchorPageTable;
