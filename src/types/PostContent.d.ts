interface PostContent {
  collector: string;
  photoTitle: string;
  photoId: string;
  albums: PostContentAlbum[];
  dateTaken: string;
  url: string;
}

interface PostContentAlbum {
  id: string;
  title: string;
}
