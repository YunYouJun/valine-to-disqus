const fs = require("fs");
const path = require("path");
const config = require("./config");

const logger = require("./logger");
const { toDisqusXml } = require("./utils");

const valineComments = require(path.resolve(
  process.cwd(),
  config.path.comment
));
const disqusXml = toDisqusXml(valineComments);

fs.writeFileSync(config.path.disqus, disqusXml);
logger.info("Valine to Disqus 转换成功!");
