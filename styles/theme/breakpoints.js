const breakpoints = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};
const { xs, sm, md, lg, xl, xxl } = breakpoints;
const screen = "@media screen and";
const max = (bp) => `(max-width: ${bp - 0.02}px)`;
const min = (bp) => `(min-width: ${bp}px)`;
const media = {
  mediaXs: `${screen} ${max(xs)}`,
  mediaXsUp: `${screen} ${min(xs)}`,
  mediaSm: `${screen} ${max(sm)}`,
  mediaSmUp: `${screen} ${min(sm)}`,
  mediaMd: `${screen} ${max(md)}`,
  mediaMdUp: `${screen} ${min(md)}`,
  mediaLg: `${screen} ${max(lg)}`,
  mediaLgUp: `${screen} ${min(lg)}`,
  mediaXl: `${screen} ${max(xl)}`,
  mediaXlUp: `${screen} ${min(xl)}`,
  mediaXxl: `${screen} ${max(xxl)}`,
  mediaXxlUp: `${screen} ${min(xxl)}`,
};

export const {
  mediaXs,
  mediaXsUp,
  mediaSm,
  mediaSmUp,
  mediaMd,
  mediaMdUp,
  mediaLg,
  mediaLgUp,
  mediaXl,
  mediaXlUp,
  mediaXxl,
  mediaXxlUp,
} = media;
export default breakpoints;
