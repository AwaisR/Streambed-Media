const company_posts = require("../models/companyPosts");
const companyPosts = async (id, post, platform) => {
  try {
    const company = await company_posts.findOne({ comapny_id: id });
    if (company) {
      company.posts.push(post);
      company.save();
    } else {
      const newpost = new company_posts({
        comapny_id: id,
        posts: post,
      });
      newpost.save();
    }
  } catch (error) {
    console.log("error in add company posts:", error.message);
  }
};
module.exports = companyPosts;
