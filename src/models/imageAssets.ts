// export type ImageAssetsSize = 'thumb' | 'small' | 'medium' | 'large';
export type ImageAssetsSize = 'thumb' | 'medium' | 'large';
export interface ImageAssets {
  size: ImageAssetsSize;
  url: string;
}
