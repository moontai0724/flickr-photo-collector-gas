export default class DataManager {
  public sheet: GoogleAppsScript.Spreadsheet.Sheet;
  public constructor() {
    this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      "Database",
    ) as GoogleAppsScript.Spreadsheet.Sheet;
  }

  public isPhotoExists(photoId: string): boolean {
    const result = this.sheet
      .getRange(2, 2, this.sheet.getLastRow(), 1)
      .createTextFinder(photoId)
      .findNext();

    return !!result;
  }

  public appendPhoto(
    collector: string,
    photoId: string,
    photoTitle: string,
    originalImageUrl: string,
    albums: PostContentAlbum[],
    dateTaken: string,
    possibleYear: string,
    url: string,
  ): void {
    const data = [
      collector,
      photoId,
      photoTitle,
      originalImageUrl,
      dateTaken,
      possibleYear,
    ];
    const last = this.sheet.appendRow(data).getLastRow();

    const photoRichText = SpreadsheetApp.newRichTextValue()
      .setText(photoId)
      .setLinkUrl(url);
    this.sheet.getRange(last, 2, 1, 1).setRichTextValue(photoRichText.build());

    if (albums.length == 0) return;

    const albumRichText = SpreadsheetApp.newRichTextValue().setText(
      albums.map(album => `${album.title}(${album.id})`).join("\n"),
    );
    let currentLength = 0;
    for (const album of albums) {
      const title = `${album.title}(${album.id})`;
      const link = `https://www.flickr.com/photos/sitcon/albums/${album.id}`;
      Logger.log(
        "Set link from %s for length %s, text: %s,link: %s",
        currentLength,
        title.length,
        title,
        link,
      );
      albumRichText.setLinkUrl(
        currentLength,
        currentLength + title.length,
        link,
      );
      currentLength += title.length;
    }

    this.sheet.getRange(last, 7).setRichTextValue(albumRichText.build());
  }
}
