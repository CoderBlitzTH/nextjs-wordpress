export type ImgSize = {
  name: string;
  sourceUrl: string;
  width: string;
  height: string;
};

export type ImgData = {
  thumbnail?: ImgSize;
  medium?: ImgSize;
  large?: ImgSize;
  full?: ImgSize;
} & Record<string, ImgSize | undefined>;
