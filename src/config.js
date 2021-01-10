require("dotenv").config();

module.exports = {
  path: {
    comment: process.env.PATH_COMMENT || "./data/valine-comment.json",
    counter: process.env.PATH_COUNTER || "./data/valine-counter.json",
    disqus: process.env.PATH_DISQUS || "./converted/disqus-comment.xml",
  },
  encode: false,
  site: "https://www.yunyoujun.cn",
  sso: process.env.ENABLE_SSO === "true" || false,
};
