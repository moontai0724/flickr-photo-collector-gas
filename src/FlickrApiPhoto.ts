export default class FlickrApiPhoto {
  public sizes: ImageSize[];
  public constructor(public apiKey: string, public photoId: string) {
    this.sizes = this.getImageSizes();
  }

  public getImageSizes(): ImageSize[] {
    const urlBase = "https://www.flickr.com/services/rest/?";
    const params = [
      `method=flickr.photos.getSizes`,
      `api_key=${this.apiKey}`,
      `photo_id=${this.photoId}`,
      `format=json`,
      `nojsoncallback=1`,
    ];
    const url = urlBase + params.join("&");
    const response = UrlFetchApp.fetch(url).getContentText();
    const parsed = JSON.parse(response);

    return parsed.sizes.size;
  }

  public getOriginalImageUrl(): string | undefined {
    const originalImage = this.sizes.find(size => size.label === "Original");

    return originalImage?.source;
  }
}
