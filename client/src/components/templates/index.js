// src/components/templates/index.js
import ClassicTemplate from "./ClassicTemplate";
import VibesTemplate from "./VibesTemplate";
import ModernTwoColumnTemplate from "./ModernTwoColumnTemplate";
import MinimalSidebarTemplate from "./MinimalSidebarTemplate";
import CompactProfessionalTemplate from "./CompactProfessionalTemplate";
// later ikkadey inka templates import chestam
// import VibesTemplate from "./VibesTemplate";
// import CascadeTemplate from "./CascadeTemplate"; ... etc

export const TEMPLATE_LIST = [
  {
    id: "classic",
    name: "Classic",
    component: ClassicTemplate,
  },
  {
    id: "vibes",
    name: "Vibes",
    component: VibesTemplate,
  },
  {
    id: "modern-two-column",
    name: "Modern Two Column",
    component: ModernTwoColumnTemplate,
  },
  {
    id: "minimal-sidebar",
    name: "Minimal Sidebar",
    component: MinimalSidebarTemplate,
  },
  {
    id: "compact-professional",
    name: "Compact Professional",
    component: CompactProfessionalTemplate,
  },
  // next templates ni ikkada add cheyyali:
  // { id: "vibes", name: "Vibes", component: VibesTemplate },
  // { id: "cascade", name: "Cascade", component: CascadeTemplate },
];
