declare module "expo-music-info-2" {
  export class MusicInfoOptions {
    title?: boolean;
    artist?: boolean;
    album?: boolean;
    genre?: boolean;
    picture?: boolean;
  }

  export class Picture {
    description: string;
    pictureData: string;
  }

  export class MusicInfoResponse {
    title?: string;
    artist?: string;
    album?: string;
    genre?: string;
    picture?: Picture;
  }

  class MusicInfo {
    static getMusicInfoAsync(
      fileUri: string,
      options?: MusicInfoOptions
    ): Promise<MusicInfoResponse | null>;
  }

  export default MusicInfo;
}
