export default async function Accordion() {
  Alpine.data("accordion", () => ({
    activeIndex: null,
    toggleAccordionItem(index) {
      this.activeIndex === index
        ? (this.activeIndex = null)
        : (this.activeIndex = index);
    },
  }));
}
