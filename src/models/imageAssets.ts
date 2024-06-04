// export type ImageAssetsSize = 'thumb' | 'small' | 'medium' | 'large';
export type ImageAssetsSize = 'thumb' | 'small' | 'medium' | 'large' | 'xlarge';
export interface ImageAssets {
  size: ImageAssetsSize;
  url: string;
}
