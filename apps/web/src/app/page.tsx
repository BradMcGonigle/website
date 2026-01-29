import HomePage from "pages.home";
import { blog, links } from "#content";
import { PersonJsonLd, WebsiteJsonLd } from "@/components/json-ld";

export default function Page() {
  return (
    <>
      <PersonJsonLd />
      <WebsiteJsonLd />
      <HomePage posts={blog} links={links} />
    </>
  );
}
