import MegaMenu from "./MegaMenu";
import Cart from "./Cart";
import Process from "./Process";
import CardReveal from "./CardReveal";
import Accordion from "./Accordion";
import Conditions from "./Conditions";
import BlogFilter from "./BlogFilter";
import Pagination from "./Pagination";
import Product from "./Product";
export default function AlpineData() {
  Promise.all([
    MegaMenu(),
    Cart(),
    Process(),
    CardReveal(),
    Accordion(),
    Conditions(),
    BlogFilter(),
    Pagination(),
    Product(),
  ]).catch((error) => {
    console.error("Error initializing Alpine components:", error);
  });
}
