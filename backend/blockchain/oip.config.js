const config = {
    title: "Test OIP post",
    myMainAddress: "RFxV2tPTwCGH9jWgrx7hcwHPm4h8q8DJoQEe8yE5CsSs4bXrMZkB",
    floExplorer: {
      url: "https://livenet.flocha.in/"
    },
    oip: {
      daemonApiUrl: "https://api.oip.io/oip/o5/",
      privateKey: "RFxV2tPTwCGH9jWgrx7hcwHPm4h8q8DJoQEe8yE5CsSs4bXrMZkB",
    },
    youtubeTmpls: {
      basic: {
        tmpl: "tmpl_66089C48",
        name: "Basic",
        payload: {
          title: 'Test OIP transactions',
          description: 'Testing OIP transaction for video meta info',
          year: '2020',
        }
      },
      basicVideo: {
        tmpl: "tmpl_4769368E",
        name: "Basic Video",
        payload: {
          publishDate: Date.now(),
          addressDirectory: 'addressDirectory',
          filename: 'testVideo.mp4',
          displayName: 'Test Video',
          thumbnailFilename: 'testThumbnail.jpg',
          network: 1,
        }
      },
      associatedUrl: {
        tmpl: "tmpl_834772F4",
        name: "Associated URL on Youtube",
        payload: {
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          youTubeId: 'test video',
          wif: 'RFxV2tPTwCGH9jWgrx7hcwHPm4h8q8DJoQEe8yE5CsSs4bXrMZkB',
          contentPlatform: 1,
        }
      },
    }
  };
  
  module.exports = { config };