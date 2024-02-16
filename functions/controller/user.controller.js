const { error } = require("firebase-functions/logger");
const {
  getUserDetailByUsername,
  getUserFeedsByUserId,
  uploadImageToFirestore,
} = require("../service/user.service");

/**
 *
 * @param {*} body
 * @returns user instagram profile
 */
const getUserInfo = async (body) => {
  try {
    //Get user details by username
    const response = await getUserDetailByUsername(body.username);

    if (response) {
      const fetchUserFeeds = await getUserFeedsByUserId(response?.pk);
      const flattenArrayOfFetchUserFeeds = fetchUserFeeds.flat();

      const updateProfileFeeds = await Promise.all(
        flattenArrayOfFetchUserFeeds.map(async (item) => {
          const resource =
            item?.resources?.length > 0 && item?.resources[0]
              ? item?.resources[0]
              : [];
          let getResourceUrl = "";
          if (resource?.video_url)
            getResourceUrl = resource?.video_url
              ? await uploadImageToFirestore(resource?.video_url, "video/mp4")
              : "";
          else
            getResourceUrl = resource?.thumbnail_url
              ? await uploadImageToFirestore(resource?.thumbnail_url)
              : "";

          return {
            number_of_likes: item?.like_count || 0,
            number_of_comments: item?.comment_count || 0,
            number_of_views: item?.view_count || 0,
            post_type: item?.product_type || "",
            mediaURL: getResourceUrl,
          };
        })
      );

      return {
        profile_picture: await uploadImageToFirestore(
          response?.profile_pic_url
        ),
        username: response.username,
        number_of_followers: response.follower_count,
        number_of_following: response.following_count,
        number_of_posts: response.media_count,
        profile_feeds: updateProfileFeeds ? updateProfileFeeds : [],
      };
    } else throw error("User not found");
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  getUserInfo,
};
