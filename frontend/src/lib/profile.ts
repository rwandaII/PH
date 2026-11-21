/**
 * Organisational profile text from "Expression of interest for partnership with WaterAid Rwanda"
 * (Hydraulic Programme of Ruhengeri Diocese, November 2026). Kept word for word, with only
 * spelling and typing slips corrected. Used by the About, Partners and Team pages.
 */

/** 1.5 Target groups and beneficiaries. */
export const TARGET_GROUPS_INTRO =
  "The project will primarily target vulnerable households living in the programme’s targeted intervention areas, particularly those exposed to the effects of climate change, limited access to safe water, and inadequate hygiene and sanitation conditions.";

export type TargetIcon = "committee" | "cooperative" | "hygiene" | "school" | "health" | "savings" | "tree" | "people";

/** Table 1: Target groups of hydraulic programme. */
export const TARGET_GROUPS: { name: string; icon: TargetIcon }[] = [
  { name: "Water user committees", icon: "committee" },
  { name: "Cooperatives of water services provision", icon: "cooperative" },
  { name: "Clubs for hygiene and sanitation", icon: "hygiene" },
  { name: "Schools", icon: "school" },
  { name: "Health centres", icon: "health" },
  { name: "SILC groups", icon: "savings" },
  { name: "Environmental protection clubs", icon: "tree" },
  { name: "Marginalised group of people", icon: "people" },
];

/** 2.1 Technical expertise and areas of competence. */
export const TECHNICAL_EXPERTISE =
  "The Programme has extensive technical experience in designing, implementing and coordinating rural development interventions, particularly in water supply, hygiene and sanitation, environmental protection and community development. Through its long-standing collaboration with international and local development partners, including MISEREOR, Medicus Mundi and Manos Unidas, it has strengthened its technical expertise and project implementation capacity. It also has substantial experience working in coordination with district authorities, local leaders, community organizations and other stakeholders to ensure effective implementation, community ownership and sustainability of interventions. The Programme has a competent multidisciplinary technical team with the expertise and capacity to perform a wide range of tasks across the Water, Sanitation and Hygiene (WASH) domains.";

/** Table 2, last row: the field extensionists, a group rather than one person. */
export const EXTENSIONISTS = {
  name: "Different extensionists",
  washYears: "+ 10 years",
  expertise: "Various background",
  competence: "Mobilisation",
  award: "A2 / A1",
};

/** Key achievements. */
export const ACHIEVEMENTS = {
  water: {
    title: "Access to safe water",
    text: "48 projects of Water Supply System (WSS) were constructed and have reduced water and hygiene related diseases, and improved life conditions of more than 54,223 population, learners, teachers and other staff in 18 schools and 6 health institutions.",
    numbers: [
      { value: 48, label: "Water Supply System projects constructed" },
      { value: 54223, label: "People whose life conditions improved", plus: true },
      { value: 18, label: "Schools" },
      { value: 6, label: "Health institutions" },
    ],
  },
  hygiene: {
    title: "Hygiene and Sanitation",
    text: "75 hygiene clubs were established to promote hygiene awareness and improve hygiene practices and sanitary conditions within the communities. In addition, beneficiaries constructed 417 household latrines, 1,443 handwashing facilities and 1,553 compost pits, contributing to improved household sanitation and environmental health.",
    numbers: [
      { value: 75, label: "Hygiene clubs established" },
      { value: 417, label: "Household latrines" },
      { value: 1443, label: "Handwashing facilities" },
      { value: 1553, label: "Compost pits" },
    ],
  },
  capacity: {
    title: "Capacity Building",
    text: [
      "The Hydraulic Program places strong emphasis on capacity building through training, workshops, meetings and community mobilization to strengthen beneficiaries’ knowledge, skills and ability to bring about positive changes in their communities.",
      "Beneficiaries are trained and organized into various community-based structures, including water users’ committees, water point management committees, hygiene clubs, water service cooperatives and savings and internal lending communities. These structures play an active role in promoting good hygiene and sanitation practices, managing and maintaining water infrastructure, strengthening community participation and improving household livelihoods.",
      "Working closely with the Program’s field extensionists, their activities are adapted to local needs and living conditions, thereby fostering community ownership, self-reliance and the sustainability of project interventions.",
    ],
    structures: [
      "Water users’ committees",
      "Water point management committees",
      "Hygiene clubs",
      "Water service cooperatives",
      "Savings and internal lending communities",
    ],
  },
};

/** 2.5 Community engagement and outreach. */
export const ENGAGEMENT = {
  intro:
    "The Hydraulic Program’s interventions integrate participatory and self-promotion approaches, behaviour change education, active community engagement and outreach, and local institutional handover mechanisms. Through continuous community mobilization, awareness-raising, dialogue, and capacity-building, the Programme encourages beneficiaries to actively participate in the planning, implementation, management, and monitoring of water and sanitation activities. These approaches strengthen local ownership, accountability, and collective responsibility, ensuring that rural water and sanitation infrastructure remains functional, well-managed, and self-sustaining over the long term.",
  items: [
    {
      title: "Community participation and ownership",
      text: [
        "Rather than adopting a purely charitable donor approach, the Programme encourages beneficiary households and communities to actively participate in every intervention they receive support for, through the provision of labor and locally available materials. Such contributions include excavating latrine pits, supplying roofing timber, and providing doors, among others.",
        "This approach promotes active community engagement and gradually nurtures a sense of ownership, responsibility, and self-reliance among beneficiaries. Through their direct involvement and contributions, communities increasingly understand that development is a shared responsibility rather than something that depends entirely on external funding and support. This helps them develop the capacity and commitment to maintain, manage, and sustain the facilities and achievements acquired beyond the Program’s financial and technical support.",
      ],
    },
    {
      title: "Behavior change and sanitation sensitization",
      text: [
        "The Program’s field team conducts community dialogues and sensitization sessions to discourage open defecation, prevent waterborne diseases, and promote proper use, cleaning, and maintenance of shared sanitation facilities.",
        "Beneficiaries are also encouraged to take personal responsibility for adopting good hygiene and sanitation practices and to act as role models gathered in hygienic clubs as WASH champions within their households and communities. By sharing their knowledge, experiences, and positive practices with others, they become agents of behavior change, helping to spread good hygiene and sanitation practices across communities and ensuring that everyone is encouraged and empowered to access and maintain a clean, safe, and healthy environment.",
      ],
    },
    {
      title: "Local governance and community handovers",
      text: [
        "Through the Diocese network and local government structures, the Programme strengthens local governance by training water users’ committees in the management, operation, and routine maintenance of water supply systems.",
        "Upon completion of construction works, the infrastructure is formally handed over to the beneficiary communities through their representatives and local leaders, who assume responsibility for its management, operation, and regular maintenance. Formal handover agreements are established to clarify roles and responsibilities and reinforce community accountability. This approach empowers beneficiaries to manage their water infrastructure independently, safeguard the investments made, and ensure the long-term functionality and sustainability of the water supply systems.",
      ],
    },
  ],
};

/** 4.1 Technical approaches and implementation strategy. */
export const APPROACHES: { short?: string; title: string; text: string }[] = [
  {
    title: "Community based approach",
    text: "This approach promotes dialogue, community consultation and contextual analysis to identify local needs and priorities. It strengthens beneficiaries’ capacities to develop sustainable solutions through inclusive decision-making and mutual respect. It will guide the planning and implementation of water supply infrastructure, community-based water management, WASH capacity-building and climate-resilient interventions.",
  },
  {
    title: "Self-Promotion approach",
    text: "This approach encourages beneficiaries to take ownership of project activities through active participation and contributions in cash and kind. Contributions may include voluntary land provision, community labor, trench excavation, transportation of construction materials and participation in pipe installation. SILC groups will also be strengthened to promote household financial self-reliance and the capacity to address basic family needs.",
  },
  {
    short: "PHAST",
    title: "Participatory Hygiene and Sanitation Transformation",
    text: "This approach empowers communities to analyze their hygiene and sanitation practices, understand their links to health and the environment, identify context-specific solutions and plan collective actions. It will promote sustainable behavioral change, community ownership and improved management of WASH facilities, including solid waste management.",
  },
  {
    short: "CLTS",
    title: "Community Led Total Sanitation",
    text: "This approach mobilizes communities to eliminate open defecation by raising awareness of associated health risks and encouraging collective commitment to constructing and using adequate household latrines without direct subsidies. It will be complemented by the KAP (Knowledge, Attitudes and Practices) approach to address behavioral barriers and promote lasting improvements in hygiene and sanitation practices.",
  },
  {
    title: "Agro-ecological and Nature Based Solutions approach",
    text: "This approach promotes integrated interventions that consider the interactions between environmental, social and economic systems. It will support water resource protection, climate change adaptation, biodiversity conservation, ecosystem restoration and community resilience, particularly through improved waste management and environmental protection.",
  },
  {
    title: "Zero-Waste approach",
    text: "This approach aims to prevent and minimize waste generation at source through responsible consumption and production, waste segregation, reuse, recycling and composting. It will contribute to reducing pollution, conserving natural resources, improving environmental health and promoting sustainable waste management practices.",
  },
];

/** 3.3 Monitoring, Evaluation, Accountability and Learning. */
export const MEAL =
  "The Catholic Diocese of Ruhengeri, through its Hydraulic Programme, applies an integrated Monitoring, Evaluation, Accountability and Learning (MEAL) system to ensure effective project implementation, performance measurement, transparency, evidence-based decision-making, and continuous improvement. The MEAL framework is aligned with approved project objectives, the logical framework, performance indicators, implementation work plans, and partners’ monitoring and reporting requirements. Monitoring is conducted continuously by field extensionists and technical staff (field technicians, engineers and supervisors) through regular field visits, supervision, data collection, verification of achievements, and follow up with beneficiary communities and local structures. Progress is measured against planned activities, targets, indicators, timelines, and allocated resources.";

/** 3.4 Risks management. */
export const RISKS = {
  text: [
    "The Hydraulic Programme of the Catholic Diocese of Ruhengeri adopts a systematic, proactive, and participatory risk management approach throughout the project implementation cycle. This approach aims to identify potential risks early, assess their likelihood and possible impact, establish appropriate preventive and mitigation measures, and monitor emerging challenges that could affect project performance, financial accountability, the quality and sustainability of WASH services, safeguarding, and institutional compliance.",
    "Risk management is always integrated into all key project management processes, including planning, budgeting, procurement, implementation, monitoring, and reporting. The Programme Coordinator, with the different directors of units, oversees the overall risk management process in collaboration with technical staff, finance and administration staff, local authorities, community structures and partners.",
    "Regular supervision, field monitoring, internal reviews, and consultations with beneficiaries and local stakeholders help identify new risks and assess the effectiveness of mitigation measures. Where necessary, corrective actions and adjustments to implementation plans are undertaken in a timely manner. Through this approach, the Hydraulic Programme tries to minimize potential losses and disruptions, protect project resources and beneficiaries, strengthen institutional accountability, and ensure the effective delivery and long-term sustainability of WASH interventions.",
  ],
  /** "Particular attention is given to…" */
  focus: [
    "Financial and procurement risks",
    "Implementation delays",
    "Infrastructure quality and functionality",
    "Environmental and climate related challenges",
    "Community participation",
    "Safeguarding",
    "Institutional and operational risks",
  ],
};

/** 2.4 Partnerships and collaboration experience. */
export const PARTNERSHIPS_INTRO =
  "The Hydraulic Program collaborates with various stakeholders in the water, hygiene and sanitation sector, including public institutions, local authorities, technical partners and other relevant organizations. This cooperation promotes complementary interventions, the sharing of information and experiences, and the mobilization of resources and expertise necessary for the effective implementation of the Program’s projects.";

/** The highlighted sentence under Table 4. */
export const KEY_DONORS =
  "Among these partners, the key recent donors include MISEREOR (Germany) as the principal donor, followed by MEDICUS MUNDI NAVARRA (Spain) and MANOS UNIDAS (Madrid, Spain).";

/** 5. Partnership (highlighted in the document). */
export const PARTNERSHIP_GOAL = [
  "The Hydraulic Program of the Catholic Diocese of Ruhengeri hereby expresses its strong interest in becoming an implementing partner of WaterAid in the delivery of WASH programmes and field interventions. With more than 15 years of experience in implementing water, sanitation and hygiene projects, the Programme has developed solid technical expertise, strong community engagement mechanisms and a proven capacity to work closely with local communities, grassroots structures and relevant stakeholders to deliver sustainable WASH services. Its participatory approach, commitment to transparency, accountability and responsible resource management, as well as its established presence and knowledge of local communities, make it a well-positioned and reliable partner for WaterAid.",
  "The Programme is committed to contributing its experience, institutional capacity and field-level expertise to expanding access to safe water, improved sanitation and good hygiene practices, while strengthening community ownership and resilience. Through this partnership, the Programme aims to contribute to lasting improvements in people’s well-being, public health and overall living conditions, particularly among vulnerable rural communities.",
];
