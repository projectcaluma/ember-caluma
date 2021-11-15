import { Factory } from "ember-cli-mirage";
import faker from "faker";

export default Factory.extend({
  createdAt: () => faker.date.past(),
  modifiedAt: () => faker.date.past(),
  createdByUser: () => faker.datatype.uuid(),
  uploadUrl: () => faker.internet.url(),
  downloadUrl: () => faker.internet.url(),

  afterCreate(file) {
    /*
    bucket_name: "caluma-media"
    content_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    etag: "31a7483ee20c44764f6d2b8ea0e28f98"
    is_dir: false
    last_modified: [2019, 4, 24, 13, 3, 25, 2, 114, 0]
    metadata: {Content-Type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
    object_name: "ea7900f5-870c-4a6b-b154-9ed9c3f62a1f_docx-templatedocx"
    size: 5490
    */

    if (!file.metadata) {
      file.update({ metadata: {} });
    }

    if (!file.metadata.object_name) {
      file.update({
        metadata: {
          object_name: faker.helpers.slugify(),
        },
      });
    }
  },
});
