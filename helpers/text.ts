export const kebabToTitle = (kebab: string) => {
  return kebab
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const processTitle = (title: string) => {
  return title.replace("__anon__:", "");
};
