const fs = require("fs");
const config = require("./config");
const md5 = require("md5");
const dayjs = require("dayjs");
const logger = require("./logger");

let valineCounters = "";

try {
  const counterText = fs.readFileSync(config.path.counter, "utf-8");
  valineCounters = JSON.parse(counterText);
} catch (error) {
  logger.error(error.message);
  logger.warn("不放 Counter 数据的话，就用 url 作为标题了！");
}

/**
 * 根据 url 从 Counter 中获取文章对象
 * @param {string} url
 */
function getPostByUrl(url) {
  let post = {
    url: "",
    createdAt: "",
  };
  if (valineCounters) {
    valineCounters["results"].some((counter) => {
      if (counter.url === url) {
        post = counter;
        return true;
      }
    });
  }
  return post;
}

/**
 * 转换为 disqus xml 格式
 * @param {*} valineComments JSON 格式
 */
function toDisqusXml(valineComments) {
  const xmlHead = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dsq="http://www.disqus.com/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:wp="http://wordpress.org/export/1.0/"
>
  <channel>
`;
  const xmlTail = `
  </channel>
</rss>  
`;
  let items = "";
  valineComments.results.forEach((comment) => {
    const post = getPostByUrl(comment.url);
    if (config.encode) comment.url = encodeURI(comment.url);
    comment.comment = comment.comment
      .replace(/<a class="at" href="#.*?">@.*?<\/a>( , |)/, "")
      .replace(
        /<img alt=".*?" referrerPolicy="no-referrer" class="vemoji" src="(.*?)" \/>/,
        "https:$1 "
      );

    const ssoContent = `
        <!-- sso only; see docs -->
        <dsq:remote>
          <!-- unique internal identifier; username, user id, etc. -->
          <dsq:id>${comment.mail}</dsq:id>
          <!-- avatar -->
          <dsq:avatar>${
            "https://www.gravatar.com/avatar/" + md5(comment.mail)
          }</dsq:avatar>
        </dsq:remote>`;

    const item = `
    <item>
      <title>${post.url || comment.url}</title>
      <link>${config.site + comment.url}</link>
      <content:encoded><![CDATA[${comment.url}]]></content:encoded>
      <dsq:thread_identifier>${comment.url}</dsq:thread_identifier>
      <wp:post_date_gmt>${dayjs(post.createdAt).format(
        "YYYY-MM-DD HH:mm:ss"
      )}</wp:post_date_gmt>
      <wp:comment_status>open</wp:comment_status>
      <wp:comment>${config.sso ? ssoContent : ""}
        <wp:comment_id>${comment.objectId}</wp:comment_id>
        <wp:comment_author>${comment.nick}</wp:comment_author>
        <wp:comment_author_email>${comment.mail}</wp:comment_author_email>
        <wp:comment_author_url>${comment.link}</wp:comment_author_url>
        <wp:comment_author_IP>${
          comment.ip ? comment.ip : ""
        }</wp:comment_author_IP>
        <!-- comment datetime, in GMT. Must be YYYY-MM-DD HH:MM:SS 24-hour format. -->
        <wp:comment_date_gmt>${dayjs(comment.createdAt).format(
          "YYYY-MM-DD HH:mm:ss"
        )}</wp:comment_date_gmt>
        <wp:comment_content><![CDATA[${comment.comment}]]></wp:comment_content>
        <!-- is this comment approved? 0/1 -->
        <wp:comment_approved>${Number(!comment.isSpam)}</wp:comment_approved>
        <wp:comment_parent>${comment.pid ? comment.pid : ""}</wp:comment_parent>
      </wp:comment>
    </item>
`;
    items += item;
  });

  const disqusXml = xmlHead + items + xmlTail;
  return disqusXml;
}

module.exports = {
  getPostByUrl,
  toDisqusXml,
};
