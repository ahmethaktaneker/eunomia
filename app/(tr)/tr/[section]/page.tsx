import { sectionRoute } from "@/lib/routes";
const route = sectionRoute("tr");
export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
