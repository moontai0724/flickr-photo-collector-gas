import ENVIRONMENT from "../config";
import DataManager from "./DataManager";
import FlickrApiPhoto from "./FlickrApiPhoto";

global.test = function (): void {
  const postContent1: PostContent = {
    collector: "測試 test",
    photoTitle: "月太-0173",
    photoId: "52170229822",
    albums: [
      {
        id: "72177720300070232",
        title: "2022 SITCON x OSCVPass Workshop",
      },
    ],
    dateTaken: "2022-06-12",
    url: "https://www.flickr.com/photos/sitcon/52170229822/in/dateposted/",
  };

  doPost({
    postData: { contents: JSON.stringify(postContent1) },
  } as GoogleAppsScript.Events.DoPost);

  const postContent2: PostContent = {
    collector: "測試 test",
    photoTitle: "raynor-0388",
    photoId: "44113652012",
    albums: [
      {
        id: "72157694606743870",
        title: "SITCON camp 同學會",
      },
    ],
    dateTaken: "2018-08-18",
    url: "https://www.flickr.com/photos/sitcon/44113652012/in/album-72157694606743870/",
  };

  doPost({
    postData: { contents: JSON.stringify(postContent2) },
  } as GoogleAppsScript.Events.DoPost);
};

global.doGet = function (): void {
  return;
};

global.doPost = function (
  request: GoogleAppsScript.Events.DoPost,
): GoogleAppsScript.Content.TextOutput {
  const data = JSON.parse(request.postData.contents) as PostContent;
  const database = new DataManager();
  if (database.isPhotoExists(data.photoId)) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "EXISTS" }),
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const api = new FlickrApiPhoto(ENVIRONMENT.API_KEY, data.photoId);
  const originalImageUrl = api.getOriginalImageUrl();
  if (!originalImageUrl) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "APPENDED_WITHOUT_ORIGINAL_IMAGE",
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
  const albumYear = /\d{4}/.exec(data.albums.map(a => a.title).join(""));
  const possibleYear = albumYear?.[0] || "";

  database.appendPhoto(
    data.collector,
    data.photoId,
    data.photoTitle,
    originalImageUrl,
    data.albums,
    data.dateTaken,
    possibleYear,
    data.url,
  );

  return ContentService.createTextOutput(
    JSON.stringify({ success: true, message: "APPENDED" }),
  ).setMimeType(ContentService.MimeType.JSON);
};
