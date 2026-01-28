import HomePage from "pages.home";
import { blog, links } from "#content";

export default function Page() {
  return <HomePage posts={blog} links={links} />;
}
