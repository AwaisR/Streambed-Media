/**
 * Used to extract link of video posted alongwith tweet
 */
const getMediaLink = (tweetObj) => {
  const { extended_entities } = tweetObj;
  if (
    extended_entities &&
    extended_entities.media &&
    extended_entities.media.length
  ) {
    const { video_info } = extended_entities.media[0];
    if (video_info && video_info.variants && video_info.variants.length) {
      return video_info.variants[0].url;
    }
  }
  return "";
};

module.exports = {
  getMediaLink,
};
