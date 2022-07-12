export default class DataManager {
  public sheet: GoogleAppsScript.Spreadsheet.Sheet;
  public constructor() {
    this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      "Database",
    ) as GoogleAppsScript.Spreadsheet.Sheet;
  }

  public getAll(): RowOfRecommendation[] {
    const rowsValue = this.sheet
      .getRange(2, 1, this.sheet.getLastRow() - 1, 7)
      .getDisplayValues();

    const result: RowOfRecommendation[] = rowsValue.map((rowValue, index) => {
      const referrer = rowValue[0];
      const photoId = rowValue[1];
      const url =
        this.sheet
          .getRange(index + 2, 2)
          .getRichTextValues()[0][0]
          ?.getLinkUrl() ?? "";
      const photoTitle = rowValue[2];
      const originalPhotoUrl = rowValue[3];
      const takenDate = rowValue[4];
      const possibleYear = rowValue[5];
      const albums = rowValue[6].split("\n").map(album => {
        const [id, ...title] = album.split(":");
        return { id, title: title.join(":") };
      });

      return {
        referrer,
        photoId,
        photoTitle,
        url,
        originalPhotoUrl,
        takenDate,
        possibleYear,
        albums,
      };
    });

    return result;
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
      albums.map(album => `${album.id}:${album.title}`).join("\n"),
    );
    let currentLength = 0;
    for (const album of albums) {
      const title = `${album.id}:${album.title}`;
      const link = `https://www.flickr.com/photos/sitcon/albums/${album.id}`;
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
