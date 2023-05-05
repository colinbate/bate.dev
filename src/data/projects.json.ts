export interface Template {
  url: string;
  description: string;
  title: string;
  image: string;
};
const projectOne: Template = {
  url: "https://yahtzee.bate.dev",
  title: "Yahtzee",
  description: "Fun two player game of Yahtzee. Roll some dice!",
  image: "/images/yahtzee.svg",
};
export const byName = {
  projectOne,
};
export const projects = Object.values(byName);