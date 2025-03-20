export default class Icon {
  static render(name) {
    return fetch(`/assets/icons/${name}.svg`)
      .then((response) => response.text())
      .then((svg) => {
        return svg;
      });
  }
}
