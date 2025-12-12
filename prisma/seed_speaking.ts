import { PrismaClient, Level, HubType } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================
// TOPIC GROUPS DATA (All 6 from mock data)
// ============================================
const topicGroupsData = [
  {
    name: "daily life",
    order: 0,
    hubType: HubType.speaking,
    subcategories: ["shopping", "dining", "healthcare", "transportation"],
  },
  {
    name: "professional english",
    order: 1,
    hubType: HubType.speaking,
    subcategories: ["meetings", "presentations", "negotiations", "interviews"],
  },
  {
    name: "academic",
    order: 2,
    hubType: HubType.speaking,
    subcategories: ["lectures", "discussions", "research", "presentations"],
  },
  {
    name: "business",
    order: 3,
    hubType: HubType.speaking,
    subcategories: ["marketing", "sales", "finance", "management"],
  },
  {
    name: "travel",
    order: 4,
    hubType: HubType.speaking,
    subcategories: ["hotels", "airports", "tourist sites", "emergency"],
  },
  {
    name: "social situations",
    order: 5,
    hubType: HubType.speaking,
    subcategories: ["parties", "small talk", "making friends", "dating"],
  },
];

// ============================================
// SPEAKING SCENARIOS DATA
// ============================================

interface ScenarioTemplate {
  subcategory: string;
  topicGroupName: string;
  levels: {
    level: Level;
    title: string;
    description: string;
    context: string;
    goal: string;
    objectives: string[];
    userRole: string;
    botRole: string;
    openingLine: string;
  }[];
}

const scenariosData: ScenarioTemplate[] = [
  // ========== DAILY LIFE - SHOPPING ==========
  {
    subcategory: "shopping",
    topicGroupName: "daily life",
    levels: [
      {
        level: Level.A1,
        title: "Buying Fruits",
        description: "Practice buying simple items at a fruit stand",
        context:
          "You are at a small fruit stand. You want to buy some apples and bananas. The seller is friendly and speaks slowly.",
        goal: "Buy fruits using basic vocabulary",
        objectives: [
          "Say hello",
          "Ask for apples",
          "Ask the price",
          "Say thank you",
        ],
        userRole: "Customer",
        botRole: "Fruit Seller",
        openingLine: "Hello! Welcome! What do you want today?",
      },
      {
        level: Level.A2,
        title: "Grocery Shopping",
        description: "Practice shopping at a grocery store",
        context:
          "You are at a grocery store looking for items on your shopping list. A store assistant offers to help you find what you need.",
        goal: "Find and purchase multiple grocery items",
        objectives: [
          "Ask where items are located",
          "Compare prices",
          "Ask about quantities",
          "Complete checkout",
        ],
        userRole: "Shopper",
        botRole: "Store Assistant",
        openingLine: "Good afternoon! Can I help you find something today?",
      },
      {
        level: Level.B1,
        title: "Clothing Store",
        description: "Practice trying on and buying clothes",
        context:
          "You are in a clothing store looking for a new outfit for a friend's party. You need help with sizes and want to try some items on.",
        goal: "Successfully select and purchase appropriate clothing",
        objectives: [
          "Describe what you're looking for",
          "Ask about sizes and colors",
          "Request to try items",
          "Negotiate or ask about discounts",
        ],
        userRole: "Customer",
        botRole: "Sales Associate",
        openingLine:
          "Welcome to Fashion Forward! Are you looking for anything special today?",
      },
      {
        level: Level.B2,
        title: "Electronics Purchase",
        description: "Practice buying electronics with detailed specifications",
        context:
          "You're at an electronics store looking for a new laptop. You have specific requirements for performance, battery life, and budget constraints.",
        goal: "Make an informed electronics purchase after comparing options",
        objectives: [
          "Explain your technical requirements",
          "Compare different models",
          "Ask about warranty and support",
          "Negotiate price or request bundle deals",
        ],
        userRole: "Customer",
        botRole: "Electronics Specialist",
        openingLine:
          "Hello! Welcome to TechWorld. I noticed you're looking at our laptop section. What kind of specifications are you looking for?",
      },
      {
        level: Level.C1,
        title: "Antique Negotiation",
        description: "Practice negotiating for antiques and collectibles",
        context:
          "You're at an antique fair interested in a vintage piece. You need to assess authenticity, negotiate price, and discuss provenance while maintaining rapport with the dealer.",
        goal: "Successfully negotiate a fair price while verifying authenticity",
        objectives: [
          "Inquire about the item's history and provenance",
          "Diplomatically question authenticity",
          "Employ negotiation strategies",
          "Discuss payment and delivery terms",
        ],
        userRole: "Collector",
        botRole: "Antique Dealer",
        openingLine:
          "Ah, I see you've got a discerning eye! That Victorian writing desk has quite an interesting history. Would you like to know more about its provenance?",
      },
      {
        level: Level.C2,
        title: "Luxury Brand Experience",
        description: "Navigate a high-end luxury shopping experience",
        context:
          "You're visiting a prestigious luxury boutique for a significant purchase. The experience requires sophisticated communication, understanding of luxury etiquette, and articulate expression of preferences.",
        goal: "Complete a refined luxury shopping experience with cultural sophistication",
        objectives: [
          "Engage in sophisticated small talk",
          "Express nuanced preferences",
          "Discuss craftsmanship and heritage",
          "Handle the purchase with appropriate etiquette",
        ],
        userRole: "Discerning Client",
        botRole: "Luxury Brand Consultant",
        openingLine:
          "Good afternoon, and welcome to Maison Élégance. It's a pleasure to have you with us today. May I offer you some champagne while we discuss what brings you to our atelier?",
      },
    ],
  },

  // ========== DAILY LIFE - DINING ==========
  {
    subcategory: "dining",
    topicGroupName: "daily life",
    levels: [
      {
        level: Level.A1,
        title: "Fast Food Order",
        description: "Order a simple meal at a fast food restaurant",
        context:
          "You are at a fast food counter. You want to order a burger and drink. The cashier is waiting for your order.",
        goal: "Order a simple meal successfully",
        objectives: [
          "Look at the menu",
          "Order food and drink",
          "Answer questions about your order",
          "Pay for your meal",
        ],
        userRole: "Customer",
        botRole: "Cashier",
        openingLine:
          "Hi! Welcome to Burger Town. What would you like to order?",
      },
      {
        level: Level.A2,
        title: "Coffee Shop Ordering",
        description: "Practice ordering drinks and snacks at a coffee shop",
        context:
          "You are at a busy coffee shop during morning rush hour. The barista is ready to take your order and can help with menu questions.",
        goal: "Successfully order your preferred coffee drink with customizations",
        objectives: [
          "Greet the barista",
          "Order a drink with size preference",
          "Ask about available pastries",
          "Complete payment",
        ],
        userRole: "Customer",
        botRole: "Barista",
        openingLine:
          "Good morning! Welcome to Daily Brew. What can I get started for you today?",
      },
      {
        level: Level.B1,
        title: "Restaurant Reservation",
        description: "Make a restaurant reservation by phone",
        context:
          "You want to make a dinner reservation at a nice restaurant for a special occasion. You're calling ahead to book a table.",
        goal: "Successfully book a table with specific requirements",
        objectives: [
          "State the date and time preference",
          "Specify number of guests",
          "Mention special occasion",
          "Confirm reservation details",
        ],
        userRole: "Caller",
        botRole: "Restaurant Host",
        openingLine:
          "Good afternoon, thank you for calling Bella Italia. This is Maria speaking. How may I help you today?",
      },
      {
        level: Level.B2,
        title: "Fine Dining Experience",
        description: "Navigate a full fine dining experience",
        context:
          "You're at an upscale restaurant for a business dinner. You need to order for yourself and make conversation while handling the multi-course meal properly.",
        goal: "Successfully navigate a formal dining experience",
        objectives: [
          "Discuss menu options with the server",
          "Ask about wine pairings",
          "Handle dietary restrictions diplomatically",
          "Manage the bill appropriately",
        ],
        userRole: "Dinner Guest",
        botRole: "Sommelier & Server",
        openingLine:
          "Good evening, and welcome to Le Château. I'll be your server tonight. May I start you off with our wine list, or would you prefer to hear about tonight's specials?",
      },
      {
        level: Level.C1,
        title: "Food Critic Review",
        description: "Discuss a meal as a food critic would",
        context:
          "You're a food blogger visiting a new fusion restaurant. The chef has come out to discuss their creative process and you need to engage meaningfully about culinary techniques.",
        goal: "Conduct an insightful conversation about gastronomy",
        objectives: [
          "Inquire about cooking techniques",
          "Discuss flavor profiles articulately",
          "Ask about ingredient sourcing",
          "Provide constructive feedback",
        ],
        userRole: "Food Blogger",
        botRole: "Executive Chef",
        openingLine:
          "Thank you so much for visiting us! I understand you're writing about our new tasting menu. I'd love to walk you through the inspiration behind each course.",
      },
      {
        level: Level.C2,
        title: "Culinary Business Pitch",
        description: "Pitch a restaurant concept to investors",
        context:
          "You're presenting your innovative restaurant concept to potential investors. You must articulate your vision, address concerns, and demonstrate market understanding.",
        goal: "Deliver a compelling investment pitch for a restaurant venture",
        objectives: [
          "Present unique value proposition",
          "Address market positioning",
          "Discuss financial projections",
          "Handle challenging questions with poise",
        ],
        userRole: "Restaurant Entrepreneur",
        botRole: "Venture Capitalist",
        openingLine:
          "I've reviewed your preliminary materials and I'm intrigued by your farm-to-table concept. Walk me through your vision—what makes this venture different from the dozen other proposals I see each month?",
      },
    ],
  },

  // ========== DAILY LIFE - HEALTHCARE ==========
  {
    subcategory: "healthcare",
    topicGroupName: "daily life",
    levels: [
      {
        level: Level.A1,
        title: "Pharmacy Visit",
        description: "Buy medicine at a pharmacy",
        context:
          "You have a headache and need medicine. You are at a pharmacy and the pharmacist is ready to help you.",
        goal: "Get the right medicine for your headache",
        objectives: [
          "Explain you have a headache",
          "Ask for medicine",
          "Ask how to take it",
          "Pay for the medicine",
        ],
        userRole: "Customer",
        botRole: "Pharmacist",
        openingLine:
          "Hello! How can I help you today? Are you looking for something?",
      },
      {
        level: Level.A2,
        title: "Doctor Appointment Booking",
        description: "Schedule a doctor's appointment",
        context:
          "You need to see a doctor because you haven't been feeling well. You're calling the clinic to make an appointment.",
        goal: "Successfully book a doctor's appointment",
        objectives: [
          "Explain why you need to see a doctor",
          "Ask about available times",
          "Provide your information",
          "Confirm the appointment",
        ],
        userRole: "Patient",
        botRole: "Receptionist",
        openingLine: "Good morning, City Health Clinic. How may I help you?",
      },
      {
        level: Level.B1,
        title: "Doctor's Appointment",
        description: "Describe symptoms to a doctor",
        context:
          "You are visiting a doctor because you haven't been feeling well lately. The doctor will ask questions about your symptoms.",
        goal: "Clearly describe your symptoms and understand advice",
        objectives: [
          "Describe your symptoms accurately",
          "Answer health history questions",
          "Understand the diagnosis",
          "Ask about medication",
        ],
        userRole: "Patient",
        botRole: "Doctor",
        openingLine:
          "Hello! Please have a seat. I'm Dr. Smith. I see you've been feeling unwell. Can you tell me what's been bothering you?",
      },
      {
        level: Level.B2,
        title: "Specialist Consultation",
        description: "Discuss complex health concerns with a specialist",
        context:
          "You've been referred to a specialist for ongoing health issues. You need to provide detailed medical history and understand treatment options.",
        goal: "Have a comprehensive consultation about treatment options",
        objectives: [
          "Provide detailed medical history",
          "Discuss previous treatments",
          "Understand specialist recommendations",
          "Ask about alternative treatments",
        ],
        userRole: "Patient",
        botRole: "Medical Specialist",
        openingLine:
          "I've reviewed the referral from your GP. I'd like to discuss your condition in more detail and explore the treatment options available to you.",
      },
      {
        level: Level.C1,
        title: "Health Insurance Discussion",
        description: "Navigate complex health insurance matters",
        context:
          "You're meeting with a health insurance advisor to understand coverage options, claim procedures, and policy implications for a planned medical procedure.",
        goal: "Make informed decisions about health insurance coverage",
        objectives: [
          "Clarify coverage details",
          "Discuss pre-authorization requirements",
          "Understand out-of-pocket costs",
          "Negotiate coverage terms",
        ],
        userRole: "Policy Holder",
        botRole: "Insurance Advisor",
        openingLine:
          "Thank you for scheduling this consultation. I understand you have questions about coverage for an upcoming procedure. Let's review your policy and options together.",
      },
      {
        level: Level.C2,
        title: "Medical Ethics Discussion",
        description: "Engage in a nuanced medical ethics conversation",
        context:
          "You're participating in a hospital ethics committee meeting discussing a complex case involving patient autonomy, family wishes, and medical recommendations.",
        goal: "Contribute meaningfully to an ethics committee deliberation",
        objectives: [
          "Articulate ethical principles clearly",
          "Balance competing interests",
          "Reference relevant precedents",
          "Propose actionable recommendations",
        ],
        userRole: "Ethics Committee Member",
        botRole: "Committee Chair",
        openingLine:
          "This case raises significant questions about informed consent and patient autonomy. I'd like each member to share their perspective. What are your initial thoughts on the ethical dimensions here?",
      },
    ],
  },

  // ========== DAILY LIFE - TRANSPORTATION ==========
  {
    subcategory: "transportation",
    topicGroupName: "daily life",
    levels: [
      {
        level: Level.A1,
        title: "Taking a Taxi",
        description: "Tell a taxi driver where you want to go",
        context:
          "You need to take a taxi to the train station. The taxi driver is waiting to know your destination.",
        goal: "Tell the driver your destination",
        objectives: [
          "Greet the driver",
          "Say where you want to go",
          "Ask how long it takes",
          "Pay the fare",
        ],
        userRole: "Passenger",
        botRole: "Taxi Driver",
        openingLine: "Hello! Where would you like to go today?",
      },
      {
        level: Level.A2,
        title: "Buying Train Tickets",
        description: "Purchase train tickets at a station",
        context:
          "You are at a train station ticket counter. You want to buy tickets to travel to another city this weekend.",
        goal: "Successfully purchase train tickets",
        objectives: [
          "Ask for tickets to your destination",
          "Specify date and time",
          "Ask about return tickets",
          "Complete the purchase",
        ],
        userRole: "Traveler",
        botRole: "Ticket Agent",
        openingLine:
          "Good morning! How may I help you with your journey today?",
      },
      {
        level: Level.B1,
        title: "Airport Navigation",
        description: "Navigate through an airport",
        context:
          "You're at a busy international airport and need help finding your gate, understanding announcements, and dealing with flight changes.",
        goal: "Successfully navigate the airport and board your flight",
        objectives: [
          "Ask for directions to your gate",
          "Understand flight announcements",
          "Handle check-in procedures",
          "Deal with potential delays",
        ],
        userRole: "Traveler",
        botRole: "Airport Staff",
        openingLine:
          "Hello! You look a bit lost. Can I help you find your way around the terminal?",
      },
      {
        level: Level.B2,
        title: "Car Rental Process",
        description: "Rent a car with specific requirements",
        context:
          "You're at a car rental agency and need a vehicle for a week-long road trip. You have specific requirements and need to understand insurance options.",
        goal: "Rent an appropriate vehicle with proper coverage",
        objectives: [
          "Specify vehicle requirements",
          "Understand insurance options",
          "Discuss mileage and fuel policies",
          "Complete rental agreement",
        ],
        userRole: "Customer",
        botRole: "Rental Agent",
        openingLine:
          "Welcome to DriveAway Rentals! I see you have a reservation. Let me pull up your details and we can discuss your options.",
      },
      {
        level: Level.C1,
        title: "Travel Disruption Management",
        description: "Handle major travel disruptions professionally",
        context:
          "Your flight has been cancelled due to severe weather. You need to rebook, claim compensation, and manage connecting arrangements while maintaining composure.",
        goal: "Resolve complex travel disruptions effectively",
        objectives: [
          "Assert passenger rights diplomatically",
          "Negotiate alternative arrangements",
          "Document issues for claims",
          "Coordinate multiple travel elements",
        ],
        userRole: "Affected Passenger",
        botRole: "Airline Customer Service Manager",
        openingLine:
          "I apologize for the inconvenience caused by the cancellation. I understand this affects your travel plans significantly. Let me see what options I can arrange for you.",
      },
      {
        level: Level.C2,
        title: "Sustainable Transport Policy",
        description: "Discuss urban transport policy implications",
        context:
          "You're participating in a city council working group on sustainable transportation. The discussion involves complex trade-offs between economic, environmental, and social factors.",
        goal: "Contribute substantively to policy development",
        objectives: [
          "Analyze multi-stakeholder impacts",
          "Propose evidence-based solutions",
          "Address counterarguments",
          "Build consensus through dialogue",
        ],
        userRole: "Urban Planning Consultant",
        botRole: "City Council Transport Director",
        openingLine:
          "Our city faces significant challenges in reducing transport emissions while maintaining economic accessibility. I'm interested in your perspective on how we might balance these competing priorities.",
      },
    ],
  },

  // ========== PROFESSIONAL ENGLISH - MEETINGS ==========
  {
    subcategory: "meetings",
    topicGroupName: "professional english",
    levels: [
      {
        level: Level.A1,
        title: "Team Introduction",
        description: "Introduce yourself in a team meeting",
        context:
          "It's your first day at a new job. You are in a meeting and need to introduce yourself to your new team.",
        goal: "Introduce yourself to your new colleagues",
        objectives: [
          "Say your name",
          "Say your job",
          "Say nice to meet everyone",
          "Answer simple questions",
        ],
        userRole: "New Employee",
        botRole: "Team Manager",
        openingLine:
          "Welcome to the team! We're happy to have you here. Please, tell us a little about yourself.",
      },
      {
        level: Level.A2,
        title: "Weekly Team Meeting",
        description: "Participate in a regular team meeting",
        context:
          "You're in your weekly team meeting. You need to share what you worked on this week and ask about the schedule.",
        goal: "Share updates and understand next week's tasks",
        objectives: [
          "Share your weekly progress",
          "Ask questions about tasks",
          "Understand deadlines",
          "Offer to help teammates",
        ],
        userRole: "Team Member",
        botRole: "Team Lead",
        openingLine:
          "Good morning everyone! Let's start our weekly check-in. Who would like to share their updates first?",
      },
      {
        level: Level.B1,
        title: "Project Status Meeting",
        description: "Report on project progress and challenges",
        context:
          "You're presenting your project status to stakeholders. You need to cover progress, challenges, and next steps clearly.",
        goal: "Deliver a clear project status update",
        objectives: [
          "Summarize completed work",
          "Explain current challenges",
          "Propose solutions",
          "Outline next steps",
        ],
        userRole: "Project Team Member",
        botRole: "Project Manager",
        openingLine:
          "Thanks everyone for joining. Let's go around and hear updates on each workstream. Can you start us off with your area?",
      },
      {
        level: Level.B2,
        title: "Cross-functional Meeting",
        description: "Collaborate with different departments",
        context:
          "You're in a meeting with colleagues from different departments to align on a company-wide initiative. Different perspectives and priorities need to be balanced.",
        goal: "Achieve alignment across departments",
        objectives: [
          "Present your department's perspective",
          "Understand others' constraints",
          "Find common ground",
          "Agree on action items",
        ],
        userRole: "Department Representative",
        botRole: "Senior Manager",
        openingLine:
          "Thank you all for making time for this cross-functional sync. We need to align our approaches before the quarterly review. Let's hear each department's perspective.",
      },
      {
        level: Level.C1,
        title: "Strategic Planning Session",
        description: "Contribute to strategic planning discussions",
        context:
          "You're part of a strategic planning session discussing company direction for the next fiscal year. Complex trade-offs and long-term implications need consideration.",
        goal: "Contribute meaningful strategic insights",
        objectives: [
          "Analyze market trends",
          "Evaluate strategic options",
          "Challenge assumptions constructively",
          "Build on others' ideas",
        ],
        userRole: "Strategy Team Member",
        botRole: "Chief Strategy Officer",
        openingLine:
          "Our competitive landscape has shifted considerably. I'd like us to critically examine our current strategic pillars and identify where we need to pivot. What patterns are you seeing in our market?",
      },
      {
        level: Level.C2,
        title: "Board Presentation",
        description: "Present to the board of directors",
        context:
          "You're presenting a major strategic initiative to the board of directors. You must demonstrate executive presence, handle tough questions, and convey complex information concisely.",
        goal: "Secure board approval for a strategic initiative",
        objectives: [
          "Present compelling business case",
          "Demonstrate thorough risk analysis",
          "Handle probing questions with confidence",
          "Navigate board dynamics diplomatically",
        ],
        userRole: "Executive Presenter",
        botRole: "Board Chairperson",
        openingLine:
          "The board has reviewed your preliminary materials. Before you begin, I should mention that there are some concerns about the timeline and capital requirements. Please address those in your presentation.",
      },
    ],
  },

  // ========== PROFESSIONAL ENGLISH - PRESENTATIONS ==========
  {
    subcategory: "presentations",
    topicGroupName: "professional english",
    levels: [
      {
        level: Level.A1,
        title: "Simple Self Presentation",
        description: "Present basic information about yourself",
        context:
          "You need to give a short presentation about yourself to your class or team. Keep it simple with basic information.",
        goal: "Complete a simple self-introduction presentation",
        objectives: [
          "Say your name and where you're from",
          "Talk about your job or studies",
          "Share one hobby",
          "Thank the audience",
        ],
        userRole: "Presenter",
        botRole: "Audience Member",
        openingLine:
          "We're ready to hear your presentation. Please go ahead whenever you're ready!",
      },
      {
        level: Level.A2,
        title: "Product Introduction",
        description: "Present a simple product to an audience",
        context:
          "You need to present a simple product to potential customers. Describe what it is, how it works, and why it's useful.",
        goal: "Successfully introduce a product",
        objectives: [
          "Introduce the product clearly",
          "Explain main features",
          "Describe benefits",
          "Answer basic questions",
        ],
        userRole: "Sales Presenter",
        botRole: "Potential Customer",
        openingLine:
          "I'm interested in learning about your product. Could you tell me more about it?",
      },
      {
        level: Level.B1,
        title: "Project Proposal",
        description: "Present a project proposal to your team",
        context:
          "You need to present a new project idea to your colleagues. You should explain the concept, benefits, and basic plan.",
        goal: "Get approval for your project proposal",
        objectives: [
          "Explain the project concept",
          "Present the benefits",
          "Outline the timeline",
          "Address initial questions",
        ],
        userRole: "Project Proposer",
        botRole: "Team Supervisor",
        openingLine:
          "I've heard you have an interesting project idea. Please walk us through your proposal.",
      },
      {
        level: Level.B2,
        title: "Quarterly Results Presentation",
        description: "Present quarterly business results",
        context:
          "You're presenting your department's quarterly results to senior management. You need to explain the data, trends, and your recommendations.",
        goal: "Deliver a professional results presentation",
        objectives: [
          "Present key metrics clearly",
          "Explain variances and trends",
          "Provide context for results",
          "Recommend next steps",
        ],
        userRole: "Department Lead",
        botRole: "Senior Manager",
        openingLine:
          "Thank you for preparing this review. Please take us through the highlights and any areas of concern.",
      },
      {
        level: Level.C1,
        title: "Technical Conference Talk",
        description: "Deliver a technical presentation at a conference",
        context:
          "You're presenting your research or technical work at a professional conference. The audience includes experts who may challenge your methodology or conclusions.",
        goal: "Deliver an engaging and credible technical presentation",
        objectives: [
          "Present complex concepts accessibly",
          "Demonstrate methodological rigor",
          "Handle expert Q&A with confidence",
          "Engage audience effectively",
        ],
        userRole: "Conference Speaker",
        botRole: "Audience Expert",
        openingLine:
          "Your abstract was quite intriguing. I'm particularly interested in your methodology. Please proceed with your presentation.",
      },
      {
        level: Level.C2,
        title: "Keynote Address",
        description: "Deliver a high-stakes keynote speech",
        context:
          "You're delivering the keynote address at a major industry conference. Your speech should inspire, challenge conventional thinking, and establish thought leadership.",
        goal: "Deliver a memorable and impactful keynote address",
        objectives: [
          "Craft compelling narrative arc",
          "Balance inspiration with substance",
          "Challenge audience assumptions",
          "Create memorable takeaways",
        ],
        userRole: "Keynote Speaker",
        botRole: "Conference Moderator",
        openingLine:
          "We're honored to have you as our keynote speaker. The audience is eager to hear your perspective on the future of our industry. The stage is yours.",
      },
    ],
  },

  // ========== PROFESSIONAL ENGLISH - NEGOTIATIONS ==========
  {
    subcategory: "negotiations",
    topicGroupName: "professional english",
    levels: [
      {
        level: Level.A1,
        title: "Simple Price Discussion",
        description: "Ask for a better price",
        context:
          "You are buying something and want to ask if you can pay less. The seller is friendly.",
        goal: "Ask for a discount politely",
        objectives: [
          "Ask if the price is fixed",
          "Request a discount",
          "Accept or decline the offer",
          "Complete the deal",
        ],
        userRole: "Buyer",
        botRole: "Seller",
        openingLine: "This item is $50. Would you like to buy it?",
      },
      {
        level: Level.A2,
        title: "Salary Discussion",
        description: "Discuss salary expectations in an interview",
        context:
          "You're in a job interview and the interviewer asks about your salary expectations. You need to respond appropriately.",
        goal: "Communicate your salary expectations",
        objectives: [
          "State your expected salary",
          "Explain your reasoning",
          "Ask about benefits",
          "Show flexibility",
        ],
        userRole: "Job Candidate",
        botRole: "Hiring Manager",
        openingLine:
          "Your interview went well. Now I'd like to discuss compensation. What are your salary expectations?",
      },
      {
        level: Level.B1,
        title: "Vendor Negotiation",
        description: "Negotiate terms with a vendor",
        context:
          "You're negotiating a contract with a supplier. You need to discuss pricing, delivery terms, and payment conditions.",
        goal: "Reach a mutually beneficial agreement",
        objectives: [
          "Present your requirements",
          "Discuss pricing",
          "Negotiate delivery terms",
          "Agree on payment terms",
        ],
        userRole: "Procurement Officer",
        botRole: "Sales Representative",
        openingLine:
          "Thank you for considering our company. I understand you're looking for a long-term supplier. Let's discuss how we can work together.",
      },
      {
        level: Level.B2,
        title: "Contract Renegotiation",
        description: "Renegotiate an existing contract",
        context:
          "A longtime client wants to renegotiate their contract due to budget changes. You need to protect your company's interests while maintaining the relationship.",
        goal: "Successfully renegotiate while preserving the relationship",
        objectives: [
          "Understand their new constraints",
          "Present your position clearly",
          "Find creative solutions",
          "Formalize new agreement",
        ],
        userRole: "Account Manager",
        botRole: "Client Representative",
        openingLine:
          "As you know, our budget situation has changed significantly. We value our partnership, but we need to discuss adjusting our current terms.",
      },
      {
        level: Level.C1,
        title: "Partnership Deal",
        description: "Negotiate a strategic partnership",
        context:
          "You're negotiating a strategic partnership that involves shared resources, revenue sharing, and joint market development. Both parties have complex interests to balance.",
        goal: "Structure a win-win partnership agreement",
        objectives: [
          "Explore mutual interests",
          "Structure value sharing equitably",
          "Address risk allocation",
          "Build framework for ongoing collaboration",
        ],
        userRole: "Business Development Director",
        botRole: "Potential Partner Executive",
        openingLine:
          "Our teams have identified interesting synergies. However, the devil is in the details. How do you propose we structure this partnership to ensure both parties are appropriately invested in its success?",
      },
      {
        level: Level.C2,
        title: "M&A Negotiation",
        description: "Negotiate merger and acquisition terms",
        context:
          "You're representing your company in preliminary M&A discussions. The negotiation involves valuation disputes, cultural integration concerns, and complex deal structures.",
        goal: "Navigate sophisticated M&A negotiations",
        objectives: [
          "Justify valuation position",
          "Address integration concerns",
          "Structure deal terms creatively",
          "Manage relationship through tense moments",
        ],
        userRole: "M&A Lead",
        botRole: "Counter-party CFO",
        openingLine:
          "We've reviewed your indicative offer. While we appreciate the interest, there's a significant gap between your valuation and what we believe the company is worth. How do you justify your numbers?",
      },
    ],
  },

  // ========== PROFESSIONAL ENGLISH - INTERVIEWS ==========
  {
    subcategory: "interviews",
    topicGroupName: "professional english",
    levels: [
      {
        level: Level.A1,
        title: "Basic Job Interview",
        description: "Answer simple interview questions",
        context:
          "You're in a job interview for an entry-level position. The interviewer will ask basic questions about you.",
        goal: "Answer basic interview questions",
        objectives: [
          "Tell about yourself",
          "Say why you want the job",
          "Talk about your skills",
          "Ask one question",
        ],
        userRole: "Job Applicant",
        botRole: "Interviewer",
        openingLine:
          "Thank you for coming today. Let's start simply. Can you tell me about yourself?",
      },
      {
        level: Level.A2,
        title: "Job Experience Interview",
        description: "Discuss your work experience",
        context:
          "You're interviewing for a position and need to talk about your previous jobs and what you learned from them.",
        goal: "Describe your work experience clearly",
        objectives: [
          "Describe your previous jobs",
          "Explain your responsibilities",
          "Share what you learned",
          "Connect experience to new role",
        ],
        userRole: "Candidate",
        botRole: "Hiring Manager",
        openingLine:
          "I've read your resume. Could you walk me through your work history and tell me about your main responsibilities in your previous roles?",
      },
      {
        level: Level.B1,
        title: "Behavioral Interview",
        description: "Answer behavioral interview questions",
        context:
          "You're in an interview where the interviewer asks about specific situations from your past. You need to provide detailed examples.",
        goal: "Successfully answer behavioral questions using examples",
        objectives: [
          "Understand the STAR method",
          "Provide specific examples",
          "Highlight your contributions",
          "Connect to the role",
        ],
        userRole: "Candidate",
        botRole: "Senior Recruiter",
        openingLine:
          "I'd like to understand how you handle different situations. Can you tell me about a time when you faced a challenging deadline and how you managed it?",
      },
      {
        level: Level.B2,
        title: "Technical Interview",
        description: "Handle technical and competency questions",
        context:
          "You're in a technical interview where you need to demonstrate your expertise and problem-solving abilities in your field.",
        goal: "Demonstrate technical competence and problem-solving",
        objectives: [
          "Explain technical concepts clearly",
          "Walk through problem-solving approach",
          "Discuss relevant projects",
          "Handle knowledge gap questions gracefully",
        ],
        userRole: "Technical Candidate",
        botRole: "Technical Interviewer",
        openingLine:
          "Let's dive into some technical questions. I'd like to understand your depth of knowledge in your area. Can you walk me through a complex project you've worked on?",
      },
      {
        level: Level.C1,
        title: "Executive Interview",
        description: "Interview for a senior leadership position",
        context:
          "You're interviewing for a senior leadership role. The interview focuses on strategic thinking, leadership philosophy, and vision.",
        goal: "Demonstrate executive-level thinking and leadership",
        objectives: [
          "Articulate leadership philosophy",
          "Demonstrate strategic thinking",
          "Discuss transformation experience",
          "Show cultural and EQ awareness",
        ],
        userRole: "Executive Candidate",
        botRole: "CEO",
        openingLine:
          "This role requires someone who can drive significant organizational change. Tell me about a time when you led transformation that was initially met with resistance. How did you bring people along?",
      },
      {
        level: Level.C2,
        title: "Board-Level Interview",
        description: "Interview for a C-suite or board position",
        context:
          "You're being considered for a C-suite position or board membership. The interview probes your strategic vision, governance experience, and ability to navigate complex stakeholder environments.",
        goal: "Demonstrate readiness for board-level responsibility",
        objectives: [
          "Demonstrate governance sophistication",
          "Articulate strategic vision compellingly",
          "Navigate sensitive topics with discretion",
          "Show gravitas and executive presence",
        ],
        userRole: "Executive Candidate",
        botRole: "Board Chairman",
        openingLine:
          "The board is looking for someone who can help navigate our company through a period of significant disruption. We've faced some governance challenges recently. How would you approach rebuilding stakeholder trust while driving necessary change?",
      },
    ],
  },

  // ========== ACADEMIC - LECTURES ==========
  {
    subcategory: "lectures",
    topicGroupName: "academic",
    levels: [
      {
        level: Level.A1,
        title: "Classroom Questions",
        description: "Ask simple questions in class",
        context:
          "You are in a class and don't understand something. You want to ask the teacher a question.",
        goal: "Ask a question in class",
        objectives: [
          "Get the teacher's attention",
          "Ask your question",
          "Understand the answer",
          "Say thank you",
        ],
        userRole: "Student",
        botRole: "Teacher",
        openingLine:
          "Does everyone understand so far? Any questions before we continue?",
      },
      {
        level: Level.A2,
        title: "Lecture Clarification",
        description: "Ask for clarification during a lecture",
        context:
          "You're in a university lecture and some parts are unclear. You need to ask the lecturer to explain further.",
        goal: "Get clarification on lecture content",
        objectives: [
          "Ask about unclear concepts",
          "Request examples",
          "Take notes on explanations",
          "Confirm understanding",
        ],
        userRole: "Student",
        botRole: "Lecturer",
        openingLine:
          "We've covered the main theories today. I'll take a few questions now if anything needs clarification.",
      },
      {
        level: Level.B1,
        title: "Office Hours Discussion",
        description: "Discuss course material in office hours",
        context:
          "You're visiting your professor during office hours to discuss a topic from the lectures that you find confusing.",
        goal: "Get help understanding course material",
        objectives: [
          "Explain what's confusing you",
          "Ask specific questions",
          "Request additional resources",
          "Plan your study approach",
        ],
        userRole: "Student",
        botRole: "Professor",
        openingLine:
          "Welcome! I'm glad you came by. What topic from the lectures would you like to discuss?",
      },
      {
        level: Level.B2,
        title: "Seminar Participation",
        description: "Actively participate in an academic seminar",
        context:
          "You're in a graduate seminar where active participation is expected. You need to engage with the material and contribute to discussion.",
        goal: "Participate meaningfully in academic discussion",
        objectives: [
          "Present your interpretation of readings",
          "Engage with others' viewpoints",
          "Raise thoughtful questions",
          "Connect concepts across texts",
        ],
        userRole: "Graduate Student",
        botRole: "Seminar Leader",
        openingLine:
          "Based on this week's readings, I'd like us to examine the tension between the two theoretical frameworks. Who would like to start us off with their analysis?",
      },
      {
        level: Level.C1,
        title: "Guest Lecture Q&A",
        description: "Engage with a visiting scholar",
        context:
          "A distinguished visiting scholar has just finished their lecture. You want to ask an insightful question that demonstrates your engagement with their research.",
        goal: "Ask a sophisticated question of a visiting scholar",
        objectives: [
          "Frame a research-level question",
          "Connect to your own work",
          "Engage with methodological choices",
          "Follow up on their response",
        ],
        userRole: "Doctoral Student",
        botRole: "Distinguished Visiting Scholar",
        openingLine:
          "Thank you for your attention during my talk. I'm happy to take questions about the research or any points you'd like me to elaborate on.",
      },
      {
        level: Level.C2,
        title: "Academic Debate",
        description: "Engage in scholarly debate on contested topics",
        context:
          "You're participating in an academic debate on a contested issue in your field. You need to articulate and defend your position against a scholar with opposing views.",
        goal: "Engage in rigorous academic debate",
        objectives: [
          "Articulate a nuanced position",
          "Engage critically with opposing arguments",
          "Use evidence effectively",
          "Maintain scholarly discourse norms",
        ],
        userRole: "Academic Debater",
        botRole: "Opposing Scholar",
        openingLine:
          "I've read your recent publication challenging the established paradigm in our field. I find your evidence selective and your conclusions premature. Perhaps you can defend your methodology?",
      },
    ],
  },

  // ========== ACADEMIC - DISCUSSIONS ==========
  {
    subcategory: "discussions",
    topicGroupName: "academic",
    levels: [
      {
        level: Level.A1,
        title: "Classroom Discussion",
        description: "Share simple opinions in class",
        context:
          "Your teacher asks students to share their opinions about a simple topic. You need to say what you think.",
        goal: "Share your opinion in class",
        objectives: [
          "Say your opinion",
          "Give a reason",
          "Listen to others",
          "Respond simply",
        ],
        userRole: "Student",
        botRole: "Teacher",
        openingLine:
          "Today we're talking about favorite hobbies. What do you like to do in your free time?",
      },
      {
        level: Level.A2,
        title: "Group Project Discussion",
        description: "Discuss ideas for a group project",
        context:
          "You're in a group project meeting with classmates. You need to share ideas and decide on a topic together.",
        goal: "Contribute to group decision-making",
        objectives: [
          "Share your ideas",
          "Listen to others' ideas",
          "Ask questions",
          "Help make a decision",
        ],
        userRole: "Group Member",
        botRole: "Group Leader",
        openingLine:
          "We need to choose a topic for our project. Does anyone have ideas they want to share?",
      },
      {
        level: Level.B1,
        title: "Study Group Session",
        description: "Discuss course material in a study group",
        context:
          "You're in a study group preparing for an exam. You need to explain concepts to friends and learn from their explanations too.",
        goal: "Learn through discussion and explanation",
        objectives: [
          "Explain concepts you understand",
          "Ask about confusing topics",
          "Practice explaining ideas",
          "Help test each other",
        ],
        userRole: "Study Group Member",
        botRole: "Study Partner",
        openingLine:
          "Let's review the main topics for the exam. Which areas do you feel confident about, and which ones should we focus on?",
      },
      {
        level: Level.B2,
        title: "Tutorial Discussion",
        description: "Participate in a university tutorial",
        context:
          "You're in a tutorial session where the tutor facilitates discussion of weekly readings. Students are expected to share prepared analyses.",
        goal: "Demonstrate analytical engagement with readings",
        objectives: [
          "Present your reading analysis",
          "Compare interpretations",
          "Build on others' contributions",
          "Ask probing questions",
        ],
        userRole: "Tutorial Student",
        botRole: "Tutor",
        openingLine:
          "For today's discussion, I'd like us to critically examine the author's methodology. What strengths and limitations did you identify in their approach?",
      },
      {
        level: Level.C1,
        title: "Research Group Meeting",
        description: "Participate in a research group discussion",
        context:
          "You're presenting your work-in-progress to your research group. Colleagues will ask questions and provide feedback on your methodology and findings.",
        goal: "Receive and respond to academic feedback",
        objectives: [
          "Present work clearly and concisely",
          "Receive feedback constructively",
          "Defend methodological choices",
          "Incorporate suggestions appropriately",
        ],
        userRole: "Research Student",
        botRole: "Senior Researcher",
        openingLine:
          "Thank you for presenting your preliminary findings. I have some questions about your sample selection. Can you walk us through your rationale?",
      },
      {
        level: Level.C2,
        title: "Interdisciplinary Roundtable",
        description: "Facilitate interdisciplinary academic discussion",
        context:
          "You're moderating a roundtable bringing together scholars from different disciplines to address a complex contemporary issue. Different methodological approaches and assumptions need bridging.",
        goal: "Facilitate productive interdisciplinary dialogue",
        objectives: [
          "Bridge disciplinary languages",
          "Identify common ground",
          "Surface productive tensions",
          "Synthesize insights across perspectives",
        ],
        userRole: "Discussion Moderator",
        botRole: "Distinguished Panelist",
        openingLine:
          "Your introduction raised fascinating points about translating concepts across disciplines. However, I'm skeptical that our methodological assumptions are commensurable. How do you propose we bridge these fundamental differences?",
      },
    ],
  },

  // ========== ACADEMIC - RESEARCH ==========
  {
    subcategory: "research",
    topicGroupName: "academic",
    levels: [
      {
        level: Level.A1,
        title: "Library Help",
        description: "Ask for help at a library",
        context:
          "You are at a library and need help finding a book. The librarian can help you.",
        goal: "Find a book with help",
        objectives: [
          "Ask where to find books",
          "Say what topic you need",
          "Understand the directions",
          "Thank the librarian",
        ],
        userRole: "Library User",
        botRole: "Librarian",
        openingLine: "Hello! Welcome to the library. How can I help you today?",
      },
      {
        level: Level.A2,
        title: "Research Resources",
        description: "Ask about research resources",
        context:
          "You need to write a research paper and aren't sure how to find good sources. You're asking a librarian for help.",
        goal: "Learn how to find research sources",
        objectives: [
          "Explain your research topic",
          "Ask about databases",
          "Learn how to search",
          "Get recommendations",
        ],
        userRole: "Student Researcher",
        botRole: "Research Librarian",
        openingLine:
          "I understand you're working on a research paper. What's your topic, and what kind of sources are you looking for?",
      },
      {
        level: Level.B1,
        title: "Research Proposal Discussion",
        description: "Discuss your research proposal with an advisor",
        context:
          "You're meeting with your academic advisor to discuss your research proposal. You need to explain your research question and methodology.",
        goal: "Get feedback on your research proposal",
        objectives: [
          "Present your research question",
          "Explain your methodology",
          "Discuss potential challenges",
          "Incorporate advisor's feedback",
        ],
        userRole: "Student",
        botRole: "Academic Advisor",
        openingLine:
          "I've had a chance to look at your proposal outline. Tell me more about what's driving your research question and how you plan to approach it.",
      },
      {
        level: Level.B2,
        title: "Data Collection Discussion",
        description: "Discuss research data collection methods",
        context:
          "You're meeting with your supervisor to discuss challenges with your data collection. You need to explain problems and propose solutions.",
        goal: "Resolve data collection challenges",
        objectives: [
          "Describe data collection issues",
          "Analyze possible causes",
          "Propose solutions",
          "Discuss implications for research",
        ],
        userRole: "Research Student",
        botRole: "Research Supervisor",
        openingLine:
          "Your update mentioned some challenges with data collection. Walk me through what's happening and what you've tried so far.",
      },
      {
        level: Level.C1,
        title: "Thesis Defense Preparation",
        description: "Prepare for thesis defense questions",
        context:
          "You're preparing for your thesis defense with your supervisor playing the role of critical examiner. You need to defend your research decisions and findings.",
        goal: "Successfully defend research decisions",
        objectives: [
          "Articulate research contribution clearly",
          "Defend methodological choices",
          "Address limitations honestly",
          "Respond to challenging questions",
        ],
        userRole: "Thesis Candidate",
        botRole: "Mock Examiner",
        openingLine:
          "Let's do a mock defense. I'll ask you difficult questions your examiners might raise. First, convince me why your research question matters to the field.",
      },
      {
        level: Level.C2,
        title: "Research Ethics Review",
        description: "Navigate complex research ethics discussions",
        context:
          "You're meeting with the research ethics committee to discuss your research involving vulnerable populations. Complex ethical considerations need to be addressed.",
        goal: "Navigate complex research ethics approval",
        objectives: [
          "Demonstrate ethical awareness",
          "Address committee concerns thoroughly",
          "Propose robust safeguards",
          "Balance research value with ethical protection",
        ],
        userRole: "Principal Investigator",
        botRole: "Ethics Committee Chair",
        openingLine:
          "Your proposed research raises significant ethical considerations given the vulnerable population. The committee has concerns about informed consent procedures. How do you propose to ensure participants truly understand what they're consenting to?",
      },
    ],
  },

  // ========== ACADEMIC - PRESENTATIONS ==========
  {
    subcategory: "presentations",
    topicGroupName: "academic",
    levels: [
      {
        level: Level.A1,
        title: "Show and Tell",
        description: "Present something simple to your class",
        context:
          "You need to show something to your class and talk about it. It can be a picture, object, or simple topic.",
        goal: "Present something simple to the class",
        objectives: [
          "Show your item",
          "Describe it simply",
          "Answer one question",
          "Thank the class",
        ],
        userRole: "Presenter",
        botRole: "Teacher",
        openingLine:
          "It's your turn to present. What did you bring to show us today?",
      },
      {
        level: Level.A2,
        title: "Class Presentation",
        description: "Give a short presentation on a topic",
        context:
          "You need to give a 5-minute presentation about a topic you researched. Your classmates and teacher are your audience.",
        goal: "Complete a short class presentation",
        objectives: [
          "Introduce your topic",
          "Share main information",
          "Use visual aids",
          "Answer simple questions",
        ],
        userRole: "Student Presenter",
        botRole: "Classmate",
        openingLine:
          "We're ready to hear your presentation. Please start whenever you're ready!",
      },
      {
        level: Level.B1,
        title: "Group Project Presentation",
        description: "Present group project findings",
        context:
          "Your group has completed a project and you need to present your part of the findings to the class and answer questions.",
        goal: "Successfully present group project work",
        objectives: [
          "Explain your contribution clearly",
          "Connect to overall project",
          "Use evidence effectively",
          "Handle audience questions",
        ],
        userRole: "Group Presenter",
        botRole: "Course Instructor",
        openingLine:
          "Your group has done interesting work. Please present your findings and be prepared for questions.",
      },
      {
        level: Level.B2,
        title: "Literature Review Presentation",
        description: "Present a literature review to your seminar",
        context:
          "You're presenting a critical review of literature on a topic to your graduate seminar. You need to synthesize multiple sources and provide critical analysis.",
        goal: "Deliver a scholarly literature review",
        objectives: [
          "Synthesize multiple sources",
          "Identify themes and gaps",
          "Provide critical analysis",
          "Connect to research questions",
        ],
        userRole: "Graduate Student",
        botRole: "Seminar Professor",
        openingLine:
          "Please proceed with your literature review. The seminar is particularly interested in how you've synthesized the competing perspectives in this area.",
      },
      {
        level: Level.C1,
        title: "Conference Paper Presentation",
        description: "Present research at an academic conference",
        context:
          "You're presenting your research paper at an academic conference. The audience includes experts who will ask challenging questions about your methodology and conclusions.",
        goal: "Successfully present research to academic peers",
        objectives: [
          "Communicate complex ideas accessibly",
          "Demonstrate scholarly rigor",
          "Handle expert questioning",
          "Position contribution to field",
        ],
        userRole: "Conference Presenter",
        botRole: "Session Discussant",
        openingLine:
          "Thank you for that interesting presentation. As the discussant, I have some questions about your theoretical framework and how it shapes your interpretation of the data.",
      },
      {
        level: Level.C2,
        title: "Job Talk Presentation",
        description: "Deliver an academic job talk",
        context:
          "You're giving a job talk as part of a faculty hiring process. You must present your research, demonstrate teaching ability, and convey your vision for future scholarship.",
        goal: "Deliver a compelling academic job talk",
        objectives: [
          "Present research program compellingly",
          "Demonstrate pedagogical vision",
          "Articulate future research directions",
          "Navigate committee dynamics",
        ],
        userRole: "Faculty Candidate",
        botRole: "Search Committee Chair",
        openingLine:
          "Welcome to our department. We're excited to hear about your research. After your presentation, the committee will have questions about both your scholarship and how you see yourself contributing to our department's mission.",
      },
    ],
  },

  // ========== BUSINESS - MARKETING ==========
  {
    subcategory: "marketing",
    topicGroupName: "business",
    levels: [
      {
        level: Level.A1,
        title: "Product Description",
        description: "Describe a simple product",
        context:
          "You need to tell a customer about a product your company sells. Use simple words to describe what it does.",
        goal: "Describe a product simply",
        objectives: [
          "Name the product",
          "Say what it does",
          "Say why it's good",
          "Answer simple questions",
        ],
        userRole: "Sales Person",
        botRole: "Customer",
        openingLine:
          "Hi! I'm interested in your product. Can you tell me about it?",
      },
      {
        level: Level.A2,
        title: "Social Media Post",
        description: "Create content for social media",
        context:
          "You're helping plan a social media post for your company. You need to discuss ideas and what message to share.",
        goal: "Plan a simple social media post",
        objectives: [
          "Suggest post ideas",
          "Choose the best option",
          "Decide on the message",
          "Plan when to post",
        ],
        userRole: "Marketing Assistant",
        botRole: "Marketing Manager",
        openingLine:
          "We need a new post for our company page. What ideas do you have for this week?",
      },
      {
        level: Level.B1,
        title: "Marketing Campaign Brainstorm",
        description: "Brainstorm ideas for a marketing campaign",
        context:
          "Your team is planning a new marketing campaign for a product launch. You need to share ideas and discuss the target audience.",
        goal: "Contribute meaningful ideas to campaign planning",
        objectives: [
          "Propose campaign ideas",
          "Discuss target audience",
          "Consider different channels",
          "Agree on next steps",
        ],
        userRole: "Marketing Team Member",
        botRole: "Marketing Director",
        openingLine:
          "We're launching our new product next month. I'd like to hear your ideas for the marketing campaign. What approaches do you think would work best?",
      },
      {
        level: Level.B2,
        title: "Market Research Presentation",
        description: "Present market research findings",
        context:
          "You've completed market research and need to present your findings to the marketing team. Your insights will guide the marketing strategy.",
        goal: "Deliver actionable market research insights",
        objectives: [
          "Present key findings clearly",
          "Identify market trends",
          "Recommend strategic actions",
          "Defend your methodology",
        ],
        userRole: "Market Researcher",
        botRole: "CMO",
        openingLine:
          "I've been looking forward to seeing your research findings. Please walk us through what you've discovered about our target market.",
      },
      {
        level: Level.C1,
        title: "Brand Repositioning Strategy",
        description: "Develop a brand repositioning strategy",
        context:
          "Your company needs to reposition its brand to stay competitive. You're presenting a comprehensive rebranding strategy to senior leadership.",
        goal: "Propose a compelling brand repositioning strategy",
        objectives: [
          "Analyze current brand perception",
          "Define new brand positioning",
          "Outline implementation roadmap",
          "Address stakeholder concerns",
        ],
        userRole: "Brand Strategist",
        botRole: "CEO",
        openingLine:
          "Our brand has lost relevance with younger demographics. I need to understand your vision for repositioning. What's the core insight driving your strategy?",
      },
      {
        level: Level.C2,
        title: "Global Marketing Integration",
        description: "Coordinate global marketing strategy",
        context:
          "You're leading a discussion to integrate marketing strategies across multiple international markets while respecting local nuances and maintaining brand consistency.",
        goal: "Orchestrate global marketing alignment",
        objectives: [
          "Balance global consistency with local relevance",
          "Navigate cultural sensitivities",
          "Resolve regional resource allocation",
          "Build consensus among regional leads",
        ],
        userRole: "Global Marketing VP",
        botRole: "Regional Marketing Director",
        openingLine:
          "The global brand guidelines don't account for our market's unique consumer behavior. We've seen 30% better engagement when we adapt the messaging locally. How do we reconcile this with headquarters' push for consistency?",
      },
    ],
  },

  // ========== BUSINESS - SALES ==========
  {
    subcategory: "sales",
    topicGroupName: "business",
    levels: [
      {
        level: Level.A1,
        title: "Greeting a Customer",
        description: "Welcome a customer to your store",
        context:
          "A customer walks into your store. You need to greet them and offer help.",
        goal: "Welcome and offer help to a customer",
        objectives: [
          "Say hello",
          "Ask how to help",
          "Listen to their needs",
          "Direct them to products",
        ],
        userRole: "Sales Associate",
        botRole: "Customer",
        openingLine: "Hello! I'm looking for something. Can you help me?",
      },
      {
        level: Level.A2,
        title: "Product Recommendation",
        description: "Recommend products to a customer",
        context:
          "A customer needs help choosing between products. You need to understand what they want and suggest the best option.",
        goal: "Help a customer choose the right product",
        objectives: [
          "Ask about their needs",
          "Explain product options",
          "Make a recommendation",
          "Answer their questions",
        ],
        userRole: "Sales Associate",
        botRole: "Customer",
        openingLine:
          "I need a new phone but I'm not sure which one to get. There are so many options!",
      },
      {
        level: Level.B1,
        title: "Sales Pitch",
        description: "Present a sales pitch to a potential client",
        context:
          "You're meeting with a potential client to pitch your company's services. You need to explain the value and handle their initial questions.",
        goal: "Deliver a convincing sales pitch",
        objectives: [
          "Introduce your company",
          "Explain your services",
          "Highlight benefits",
          "Handle objections",
        ],
        userRole: "Sales Representative",
        botRole: "Potential Client",
        openingLine:
          "Thanks for coming in. I have about 30 minutes. Tell me why I should consider your company.",
      },
      {
        level: Level.B2,
        title: "Solution Selling",
        description: "Conduct a consultative sales conversation",
        context:
          "You're meeting with a prospect to understand their business challenges and propose a customized solution. The sale depends on demonstrating value.",
        goal: "Identify needs and propose tailored solutions",
        objectives: [
          "Conduct discovery questions",
          "Identify pain points",
          "Present customized solutions",
          "Create urgency without pressure",
        ],
        userRole: "Solution Sales Consultant",
        botRole: "Business Decision Maker",
        openingLine:
          "We're evaluating several vendors, but honestly, I'm skeptical that any solution can address our specific challenges. Convince me you understand our situation.",
      },
      {
        level: Level.C1,
        title: "Enterprise Deal Negotiation",
        description: "Negotiate a major enterprise contract",
        context:
          "You're in the final stages of a large enterprise deal. The client is pushing back on price while you need to protect margins. Multiple stakeholders are involved.",
        goal: "Close a profitable enterprise deal",
        objectives: [
          "Navigate multi-stakeholder dynamics",
          "Justify value proposition",
          "Structure creative deal terms",
          "Close with mutual satisfaction",
        ],
        userRole: "Enterprise Sales Director",
        botRole: "VP of Procurement",
        openingLine:
          "Look, I'm going to be direct. Your solution tested well, but your pricing is 40% higher than comparable alternatives. Help me understand how I justify this to my board.",
      },
      {
        level: Level.C2,
        title: "Strategic Partnership Sales",
        description: "Develop a transformational strategic partnership",
        context:
          "You're proposing a strategic partnership that would fundamentally change how both companies go to market. The conversation requires balancing immediate commercial terms with long-term strategic vision.",
        goal: "Establish a transformational strategic partnership",
        objectives: [
          "Articulate compelling joint vision",
          "Navigate executive-level concerns",
          "Structure innovative deal models",
          "Build executive relationship while closing",
        ],
        userRole: "Chief Revenue Officer",
        botRole: "Partner CEO",
        openingLine:
          "I've read your proposal for strategic alignment. It's ambitious—perhaps too ambitious. Our board is skeptical about the execution risk. How do we de-risk this partnership while preserving the upside you've outlined?",
      },
    ],
  },

  // ========== BUSINESS - FINANCE ==========
  {
    subcategory: "finance",
    topicGroupName: "business",
    levels: [
      {
        level: Level.A1,
        title: "Basic Money Talk",
        description: "Talk about prices and payments",
        context:
          "You're at a shop and need to ask about the price and how to pay.",
        goal: "Ask about prices and pay for items",
        objectives: [
          "Ask the price",
          "Understand the amount",
          "Ask about payment methods",
          "Complete payment",
        ],
        userRole: "Customer",
        botRole: "Cashier",
        openingLine:
          "Hello! Would you like to buy this item? It's on sale today!",
      },
      {
        level: Level.A2,
        title: "Bank Account Inquiry",
        description: "Ask about bank account options",
        context:
          "You're at a bank branch asking about opening a new account. The bank representative will explain the options.",
        goal: "Understand bank account options",
        objectives: [
          "Ask about account types",
          "Understand fees and benefits",
          "Ask about requirements",
          "Decide on an account",
        ],
        userRole: "Customer",
        botRole: "Bank Representative",
        openingLine:
          "Welcome to City Bank! I understand you're interested in opening an account. What type of account are you looking for?",
      },
      {
        level: Level.B1,
        title: "Budget Discussion",
        description: "Discuss a project budget",
        context:
          "You're meeting with your manager to discuss the budget for your project. You need to explain your needs and justify your requests.",
        goal: "Get approval for your project budget",
        objectives: [
          "Present budget needs",
          "Explain each cost item",
          "Justify expenses",
          "Negotiate adjustments",
        ],
        userRole: "Project Lead",
        botRole: "Finance Manager",
        openingLine:
          "I've reviewed your budget proposal. Let's go through it together. Can you walk me through your major cost items?",
      },
      {
        level: Level.B2,
        title: "Financial Performance Review",
        description: "Review financial performance with stakeholders",
        context:
          "You're presenting the quarterly financial performance to department heads. You need to explain variances and propose corrective actions.",
        goal: "Communicate financial performance effectively",
        objectives: [
          "Present key financial metrics",
          "Explain variances to budget",
          "Identify cost optimization opportunities",
          "Propose corrective actions",
        ],
        userRole: "Financial Analyst",
        botRole: "Department Director",
        openingLine:
          "I'm concerned about the cost overruns this quarter. Please help me understand what's driving the variance and what we can do about it.",
      },
      {
        level: Level.C1,
        title: "Investment Pitch",
        description: "Pitch for investment funding",
        context:
          "You're presenting to potential investors to secure funding for your business expansion. You need to demonstrate financial viability and growth potential.",
        goal: "Secure investment commitment",
        objectives: [
          "Present compelling financial projections",
          "Explain business model economics",
          "Address investor concerns",
          "Negotiate investment terms",
        ],
        userRole: "CFO",
        botRole: "Private Equity Partner",
        openingLine:
          "Your growth story is interesting, but I've seen many companies with similar trajectories that failed to scale profitably. Walk me through your unit economics and how they improve at scale.",
      },
      {
        level: Level.C2,
        title: "Financial Crisis Management",
        description: "Navigate a financial crisis situation",
        context:
          "Your company is facing a liquidity crisis. You're in urgent discussions with lenders, stakeholders, and the board to restructure finances and maintain operations.",
        goal: "Navigate company through financial crisis",
        objectives: [
          "Present realistic financial assessment",
          "Negotiate with multiple creditor classes",
          "Maintain stakeholder confidence",
          "Structure viable turnaround plan",
        ],
        userRole: "Chief Restructuring Officer",
        botRole: "Lead Creditor Representative",
        openingLine:
          "The creditor committee has reviewed your restructuring proposal. Frankly, we find the timeline aggressive and the assumptions optimistic. Several creditors are pushing for acceleration. What assurances can you provide that this plan is viable?",
      },
    ],
  },

  // ========== BUSINESS - MANAGEMENT ==========
  {
    subcategory: "management",
    topicGroupName: "business",
    levels: [
      {
        level: Level.A1,
        title: "Asking for Help",
        description: "Ask your manager for help",
        context:
          "You have a problem at work and need to ask your manager for help. Keep your request simple.",
        goal: "Get help from your manager",
        objectives: [
          "Get your manager's attention",
          "Explain your problem simply",
          "Listen to advice",
          "Say thank you",
        ],
        userRole: "Employee",
        botRole: "Manager",
        openingLine: "Hello! How can I help you today? Is everything okay?",
      },
      {
        level: Level.A2,
        title: "Task Update",
        description: "Give your manager an update on your tasks",
        context:
          "Your manager wants to know about your progress on your tasks. You need to explain what you've done and what you're working on.",
        goal: "Update your manager on your work",
        objectives: [
          "Explain completed tasks",
          "Share current work",
          "Mention any problems",
          "Ask for guidance if needed",
        ],
        userRole: "Team Member",
        botRole: "Team Manager",
        openingLine:
          "Good morning! I wanted to check in on your progress. How are things going with your current tasks?",
      },
      {
        level: Level.B1,
        title: "Team Coordination",
        description: "Coordinate work with your team",
        context:
          "You're leading a small project and need to coordinate tasks with your team members. You need to assign work and set deadlines.",
        goal: "Effectively coordinate team work",
        objectives: [
          "Explain project goals",
          "Assign tasks fairly",
          "Set clear deadlines",
          "Address team concerns",
        ],
        userRole: "Project Lead",
        botRole: "Team Member",
        openingLine:
          "Thanks for getting us together. I know we have a lot on our plates. What do you need from me to get started on your part of the project?",
      },
      {
        level: Level.B2,
        title: "Performance Review",
        description: "Conduct or participate in a performance review",
        context:
          "You're in an annual performance review discussion. This is an opportunity to discuss achievements, areas for growth, and career development.",
        goal: "Have a productive performance review conversation",
        objectives: [
          "Discuss achievements objectively",
          "Address development areas constructively",
          "Set future goals",
          "Align on career path",
        ],
        userRole: "Employee",
        botRole: "Manager",
        openingLine:
          "Thanks for preparing for our annual review. I've been impressed with several of your contributions this year. Let's discuss your performance and what's next for your career here.",
      },
      {
        level: Level.C1,
        title: "Change Management",
        description: "Lead organizational change initiative",
        context:
          "You're implementing a significant organizational change that affects multiple teams. You need to communicate the change, address resistance, and maintain momentum.",
        goal: "Successfully lead organizational change",
        objectives: [
          "Communicate vision compellingly",
          "Address emotional resistance",
          "Build change advocates",
          "Maintain operational continuity",
        ],
        userRole: "Change Leader",
        botRole: "Skeptical Department Head",
        openingLine:
          "I've read the change proposal. My team is already stretched thin with current projects. Now you're asking us to fundamentally change how we work? I need to understand why this isn't just another corporate initiative that will be abandoned in six months.",
      },
      {
        level: Level.C2,
        title: "Board Governance Challenge",
        description: "Navigate complex board governance issues",
        context:
          "You're dealing with a complex governance situation involving board dynamics, shareholder concerns, and executive decision-making. Multiple stakeholder interests must be balanced.",
        goal: "Navigate complex governance while maintaining trust",
        objectives: [
          "Balance competing stakeholder interests",
          "Maintain fiduciary integrity",
          "Navigate politically sensitive dynamics",
          "Preserve organizational reputation",
        ],
        userRole: "CEO",
        botRole: "Board Chair",
        openingLine:
          "We have a sensitive matter to discuss. Several board members have raised concerns about the strategic direction you've been pursuing. There are also questions from significant shareholders. How do you propose we address these concerns while maintaining confidence in leadership?",
      },
    ],
  },

  // ========== TRAVEL - HOTELS ==========
  {
    subcategory: "hotels",
    topicGroupName: "travel",
    levels: [
      {
        level: Level.A1,
        title: "Hotel Check-in",
        description: "Check into a hotel",
        context:
          "You've arrived at a hotel and need to check in. The receptionist will help you.",
        goal: "Successfully check into the hotel",
        objectives: [
          "Give your name",
          "Show your ID",
          "Get your room key",
          "Ask where your room is",
        ],
        userRole: "Guest",
        botRole: "Receptionist",
        openingLine:
          "Good evening! Welcome to Sunrise Hotel. Do you have a reservation?",
      },
      {
        level: Level.A2,
        title: "Hotel Room Request",
        description: "Request something for your hotel room",
        context:
          "You're staying at a hotel and need to request something for your room, like extra towels or pillows.",
        goal: "Get what you need for your room",
        objectives: [
          "Call the front desk",
          "Explain what you need",
          "Confirm the request",
          "Say thank you",
        ],
        userRole: "Guest",
        botRole: "Front Desk Staff",
        openingLine: "Front desk, how may I assist you?",
      },
      {
        level: Level.B1,
        title: "Hotel Booking",
        description: "Book a hotel room with specific requirements",
        context:
          "You're calling a hotel to book a room for your vacation. You have specific requirements and want to know about amenities.",
        goal: "Book a suitable hotel room",
        objectives: [
          "Specify dates and room type",
          "Ask about amenities",
          "Understand pricing and policies",
          "Confirm the reservation",
        ],
        userRole: "Guest",
        botRole: "Reservations Agent",
        openingLine:
          "Thank you for calling Grand Plaza Hotel. How may I help you with your reservation today?",
      },
      {
        level: Level.B2,
        title: "Hotel Complaint Resolution",
        description: "Resolve a problem with your hotel stay",
        context:
          "You've experienced issues during your hotel stay and need to discuss them with the manager. You want a satisfactory resolution.",
        goal: "Resolve hotel issues professionally",
        objectives: [
          "Describe problems clearly",
          "Express expectations reasonably",
          "Negotiate compensation",
          "Maintain professional tone",
        ],
        userRole: "Guest",
        botRole: "Hotel Manager",
        openingLine:
          "I understand you've asked to speak with me about some concerns with your stay. I apologize for any inconvenience. Please tell me what happened.",
      },
      {
        level: Level.C1,
        title: "Corporate Event Planning",
        description: "Plan a corporate event at a hotel",
        context:
          "You're organizing a major corporate conference at a hotel. You need to negotiate complex arrangements including rooms, catering, AV equipment, and custom requirements.",
        goal: "Successfully negotiate comprehensive event arrangements",
        objectives: [
          "Specify detailed event requirements",
          "Negotiate pricing and packages",
          "Coordinate multiple service elements",
          "Establish contingency plans",
        ],
        userRole: "Event Planner",
        botRole: "Hotel Events Director",
        openingLine:
          "Thank you for considering us for your annual conference. I've reviewed your RFP. Before we discuss specifics, I'd like to understand your vision for the event and what success looks like for your organization.",
      },
      {
        level: Level.C2,
        title: "Luxury Hospitality Partnership",
        description: "Negotiate a luxury hospitality partnership",
        context:
          "You're negotiating a long-term partnership between your company and a luxury hotel group. The arrangement involves exclusive rates, custom services, and brand association considerations.",
        goal: "Establish a mutually beneficial luxury partnership",
        objectives: [
          "Articulate partnership vision",
          "Navigate brand alignment concerns",
          "Structure complex value exchange",
          "Build long-term relationship foundation",
        ],
        userRole: "Corporate Travel Director",
        botRole: "Luxury Hotel Group CEO",
        openingLine:
          "Your company's reputation for excellence aligns with our brand values. However, the exclusivity terms you're proposing concern me. How do we structure an arrangement that serves both our interests without constraining either party's growth?",
      },
    ],
  },

  // ========== TRAVEL - AIRPORTS ==========
  {
    subcategory: "airports",
    topicGroupName: "travel",
    levels: [
      {
        level: Level.A1,
        title: "Finding Your Gate",
        description: "Ask for directions at an airport",
        context:
          "You're at an airport and need to find your gate. You can ask the staff for help.",
        goal: "Find your departure gate",
        objectives: [
          "Ask where your gate is",
          "Understand the directions",
          "Ask how long it takes to walk",
          "Say thank you",
        ],
        userRole: "Traveler",
        botRole: "Airport Staff",
        openingLine:
          "Hello! You look like you might need some help. Can I assist you?",
      },
      {
        level: Level.A2,
        title: "Airport Check-in",
        description: "Check in for your flight at the airport",
        context:
          "You've arrived at the airport and need to check in at the counter. You have your passport and booking confirmation.",
        goal: "Complete airport check-in",
        objectives: [
          "Present your documents",
          "Choose your seat if possible",
          "Check your luggage",
          "Get your boarding pass",
        ],
        userRole: "Passenger",
        botRole: "Check-in Agent",
        openingLine:
          "Good morning! Welcome to Sky Airways. May I see your passport and booking confirmation, please?",
      },
      {
        level: Level.B1,
        title: "Security and Customs",
        description: "Navigate airport security and customs",
        context:
          "You're going through airport security and customs. You need to follow procedures and answer questions from officers.",
        goal: "Pass through security and customs smoothly",
        objectives: [
          "Follow security procedures",
          "Answer officer questions",
          "Declare items if necessary",
          "Collect your belongings",
        ],
        userRole: "Traveler",
        botRole: "Customs Officer",
        openingLine:
          "Welcome back. What was the purpose of your trip abroad, and do you have anything to declare?",
      },
      {
        level: Level.B2,
        title: "Flight Rebooking",
        description: "Rebook a flight due to cancellation",
        context:
          "Your flight has been cancelled and you need to rebook. The airline counter is busy and options may be limited.",
        goal: "Successfully rebook to reach your destination",
        objectives: [
          "Understand cancellation reason",
          "Explore alternative options",
          "Negotiate for better arrangements",
          "Document everything for claims",
        ],
        userRole: "Affected Passenger",
        botRole: "Airline Customer Service",
        openingLine:
          "I'm sorry about the cancellation. We're trying to accommodate all affected passengers. Let me see what options I can find for you.",
      },
      {
        level: Level.C1,
        title: "VIP Airport Services",
        description: "Arrange VIP airport services for executives",
        context:
          "You're coordinating VIP airport handling for a delegation of senior executives visiting multiple countries. Custom protocols and security considerations apply.",
        goal: "Arrange seamless VIP travel experience",
        objectives: [
          "Coordinate multi-airport logistics",
          "Negotiate premium services",
          "Handle security protocols",
          "Manage contingencies across time zones",
        ],
        userRole: "Executive Assistant",
        botRole: "VIP Services Coordinator",
        openingLine:
          "We've reviewed your delegation's itinerary. The requirements are complex, particularly the short connection in Dubai. Let's discuss how we can ensure a seamless experience despite the tight timeline.",
      },
      {
        level: Level.C2,
        title: "Aviation Crisis Communication",
        description: "Handle crisis communication during aviation incident",
        context:
          "There's been a significant aviation incident and you're coordinating communication between the airline, airport authorities, families, and media. Sensitivity and accuracy are paramount.",
        goal: "Manage crisis communication with integrity",
        objectives: [
          "Communicate with appropriate sensitivity",
          "Coordinate multi-stakeholder messaging",
          "Balance transparency with legal constraints",
          "Support affected parties compassionately",
        ],
        userRole: "Crisis Communications Director",
        botRole: "Airport Authority PR Chief",
        openingLine:
          "The media are gathering and families are demanding information. We need to issue a statement within the hour, but we're still confirming details. How do we communicate appropriately without speculating or creating additional distress?",
      },
    ],
  },

  // ========== TRAVEL - TOURIST SITES ==========
  {
    subcategory: "tourist sites",
    topicGroupName: "travel",
    levels: [
      {
        level: Level.A1,
        title: "Buying Tickets",
        description: "Buy tickets at a tourist attraction",
        context:
          "You're at a famous monument and want to buy an entrance ticket. The ticket seller is ready to help you.",
        goal: "Buy an entrance ticket",
        objectives: [
          "Ask for a ticket",
          "Ask the price",
          "Pay for the ticket",
          "Ask about opening hours",
        ],
        userRole: "Tourist",
        botRole: "Ticket Seller",
        openingLine:
          "Hello! Welcome to the National Museum. How can I help you today?",
      },
      {
        level: Level.A2,
        title: "Guided Tour",
        description: "Join a guided tour at a tourist site",
        context:
          "You're at a historic castle and want to join a guided tour. The guide is answering questions.",
        goal: "Get information about and join a tour",
        objectives: [
          "Ask about tour times",
          "Ask about tour length",
          "Ask what you'll see",
          "Join the tour",
        ],
        userRole: "Tourist",
        botRole: "Tour Guide",
        openingLine:
          "Welcome to Castle Highbury! Are you interested in our guided tours? We have one starting soon.",
      },
      {
        level: Level.B1,
        title: "Tourist Information",
        description: "Get travel recommendations from a tourist office",
        context:
          "You're at a tourist information center asking about things to do in the city. You want recommendations based on your interests.",
        goal: "Get useful travel recommendations",
        objectives: [
          "Explain your interests",
          "Ask about top attractions",
          "Get transportation advice",
          "Request a map or brochure",
        ],
        userRole: "Tourist",
        botRole: "Tourism Advisor",
        openingLine:
          "Welcome to Barcelona Tourist Information! How long will you be staying, and what kind of experiences are you looking for?",
      },
      {
        level: Level.B2,
        title: "Cultural Site Photography",
        description: "Negotiate photography access at a cultural site",
        context:
          "You're a photographer wanting special access to photograph a historic site. You need to discuss permission, fees, and restrictions with the site manager.",
        goal: "Secure photography access with appropriate terms",
        objectives: [
          "Explain your photography project",
          "Negotiate access terms",
          "Understand restrictions",
          "Agree on usage rights",
        ],
        userRole: "Photographer",
        botRole: "Site Manager",
        openingLine:
          "I understand you're interested in professional photography at our site. We're selective about who we grant access to. Tell me about your project and what you're hoping to capture.",
      },
      {
        level: Level.C1,
        title: "Heritage Conservation Discussion",
        description: "Discuss heritage site conservation challenges",
        context:
          "You're meeting with heritage conservation officials to discuss balancing tourism access with preservation needs at a UNESCO World Heritage site.",
        goal: "Contribute to heritage conservation planning",
        objectives: [
          "Analyze conservation challenges",
          "Propose sustainable tourism approaches",
          "Balance stakeholder interests",
          "Consider long-term preservation",
        ],
        userRole: "Tourism Consultant",
        botRole: "Conservation Authority Director",
        openingLine:
          "Annual visitor numbers have tripled over the past decade, and we're seeing accelerated degradation. The local economy depends on tourism, but we risk destroying what people come to see. How would you approach this paradox?",
      },
      {
        level: Level.C2,
        title: "Cultural Diplomacy Through Tourism",
        description: "Navigate cultural diplomacy in tourism context",
        context:
          "You're involved in high-level discussions about tourism exchange programs between countries with complex political relationships. Cultural sensitivity and diplomatic awareness are essential.",
        goal: "Advance cultural diplomacy through tourism initiatives",
        objectives: [
          "Navigate politically sensitive terrain",
          "Build bridges through cultural exchange",
          "Balance national interests with cooperation",
          "Create sustainable people-to-people connections",
        ],
        userRole: "Cultural Diplomacy Advisor",
        botRole: "Foreign Affairs Ministry Official",
        openingLine:
          "Tourism exchange has potential to improve bilateral relations, but there are sensitivities on both sides. How do we structure an initiative that creates genuine cultural connection without it becoming politicized or creating tensions?",
      },
    ],
  },

  // ========== TRAVEL - EMERGENCY ==========
  {
    subcategory: "emergency",
    topicGroupName: "travel",
    levels: [
      {
        level: Level.A1,
        title: "Finding Help",
        description: "Ask for help in an emergency",
        context:
          "You've lost your bag and need help. You're asking a police officer for help.",
        goal: "Get help finding your lost bag",
        objectives: [
          "Say you lost your bag",
          "Describe your bag",
          "Say where you were",
          "Ask what to do",
        ],
        userRole: "Tourist",
        botRole: "Police Officer",
        openingLine:
          "Hello, you look worried. Is everything okay? Can I help you?",
      },
      {
        level: Level.A2,
        title: "Medical Emergency",
        description: "Get medical help while traveling",
        context:
          "You're not feeling well while traveling and need to find a pharmacy or doctor. Someone is helping you.",
        goal: "Get medical assistance",
        objectives: [
          "Explain your symptoms",
          "Ask for a pharmacy or hospital",
          "Understand the directions",
          "Follow advice",
        ],
        userRole: "Sick Traveler",
        botRole: "Local Helper",
        openingLine:
          "You don't look well. Are you okay? Do you need help finding a doctor or pharmacy?",
      },
      {
        level: Level.B1,
        title: "Lost Passport",
        description: "Report a lost or stolen passport",
        context:
          "You've lost your passport while traveling abroad. You need to report it and get emergency travel documents.",
        goal: "Start the process to replace your passport",
        objectives: [
          "Report the loss to police",
          "Contact your embassy",
          "Gather required documents",
          "Understand the timeline",
        ],
        userRole: "Traveler in Distress",
        botRole: "Embassy Official",
        openingLine:
          "I'm sorry to hear about your situation. Please have a seat and tell me exactly what happened. We'll help you get emergency travel documents.",
      },
      {
        level: Level.B2,
        title: "Travel Insurance Claim",
        description: "File a travel insurance claim",
        context:
          "You've had a significant travel incident and need to file an insurance claim. You're speaking with a claims representative.",
        goal: "Successfully file an insurance claim",
        objectives: [
          "Document the incident thoroughly",
          "Understand coverage details",
          "Provide required evidence",
          "Follow up appropriately",
        ],
        userRole: "Policy Holder",
        botRole: "Insurance Claims Representative",
        openingLine:
          "I'm sorry to hear about your travel difficulties. I have your policy information here. Please describe what happened, and I'll help you understand what's covered and how to proceed.",
      },
      {
        level: Level.C1,
        title: "Crisis Evacuation Coordination",
        description: "Coordinate emergency evacuation while abroad",
        context:
          "A natural disaster has occurred in a region where your organization has travelers. You're coordinating emergency response and evacuation with local authorities and your home office.",
        goal: "Safely coordinate emergency evacuation",
        objectives: [
          "Assess traveler locations and status",
          "Coordinate with local emergency services",
          "Manage communication across stakeholders",
          "Execute evacuation logistics",
        ],
        userRole: "Corporate Safety Manager",
        botRole: "Embassy Emergency Coordinator",
        openingLine:
          "The situation is evolving rapidly. We've confirmed significant infrastructure damage. Your employees are in the affected area. We need to coordinate extraction routes before conditions worsen. What's your current status on locating all your people?",
      },
      {
        level: Level.C2,
        title: "International Incident Management",
        description: "Handle a serious international incident",
        context:
          "A serious incident involving your nationals has occurred abroad, requiring coordination between multiple governments, international organizations, and families. Media attention is intense.",
        goal: "Navigate international incident with diplomatic sensitivity",
        objectives: [
          "Coordinate multi-government response",
          "Manage media sensitively",
          "Support affected families appropriately",
          "Balance transparency with operational security",
        ],
        userRole: "Consular Affairs Director",
        botRole: "Foreign Ministry Counterpart",
        openingLine:
          "We recognize the gravity of the situation and want to work together toward resolution. However, there are sensitivities regarding jurisdiction and process that we need to navigate carefully. The families are understandably distressed and the media is creating pressure. How do you suggest we proceed in a way that serves everyone's interests?",
      },
    ],
  },

  // ========== SOCIAL SITUATIONS - PARTIES ==========
  {
    subcategory: "parties",
    topicGroupName: "social situations",
    levels: [
      {
        level: Level.A1,
        title: "Party Introduction",
        description: "Introduce yourself at a party",
        context:
          "You're at a birthday party and someone starts talking to you. You need to introduce yourself.",
        goal: "Introduce yourself at a party",
        objectives: [
          "Say hello",
          "Say your name",
          "Ask their name",
          "Make simple conversation",
        ],
        userRole: "Party Guest",
        botRole: "Another Guest",
        openingLine:
          "Hi there! I don't think we've met. Are you a friend of the birthday person?",
      },
      {
        level: Level.A2,
        title: "Party Conversation",
        description: "Have a friendly conversation at a party",
        context:
          "You're at a house party and talking to someone new. You want to learn more about them and share about yourself.",
        goal: "Have an enjoyable party conversation",
        objectives: [
          "Ask about their job or studies",
          "Share about yourself",
          "Find common interests",
          "Keep the conversation going",
        ],
        userRole: "Party Guest",
        botRole: "New Acquaintance",
        openingLine: "Great party, isn't it? So how do you know everyone here?",
      },
      {
        level: Level.B1,
        title: "Dinner Party Host",
        description: "Host a small dinner party",
        context:
          "You're hosting a dinner party for friends. You need to make guests feel welcome, manage conversations, and ensure everyone is having a good time.",
        goal: "Successfully host an enjoyable dinner party",
        objectives: [
          "Welcome guests warmly",
          "Introduce people who don't know each other",
          "Keep conversations flowing",
          "Handle any awkward moments",
        ],
        userRole: "Host",
        botRole: "Guest",
        openingLine:
          "Thank you so much for having us! Your home looks lovely. Can I help with anything?",
      },
      {
        level: Level.B2,
        title: "Networking Event",
        description: "Network effectively at a professional social event",
        context:
          "You're at a professional networking event with potential business contacts. You need to make a positive impression while being genuinely engaging.",
        goal: "Build meaningful professional connections",
        objectives: [
          "Start conversations naturally",
          "Exchange professional information",
          "Identify mutual opportunities",
          "Follow up appropriately",
        ],
        userRole: "Professional",
        botRole: "Industry Contact",
        openingLine:
          "I noticed you seemed to know a lot of people here. I'm relatively new to the industry. What brings you to events like this?",
      },
      {
        level: Level.C1,
        title: "High-Stakes Social Function",
        description: "Navigate a high-profile social event",
        context:
          "You're at an exclusive industry gala where senior leaders and influential figures are present. Social interactions have professional implications.",
        goal: "Navigate high-stakes social situations gracefully",
        objectives: [
          "Make appropriate impressions on VIPs",
          "Navigate status dynamics gracefully",
          "Build strategic relationships naturally",
          "Exit conversations diplomatically",
        ],
        userRole: "Rising Executive",
        botRole: "Industry Leader",
        openingLine:
          "I've heard interesting things about your work. These events can feel somewhat performative, but I find the genuine conversations are worth searching for. What's really exciting you professionally right now?",
      },
      {
        level: Level.C2,
        title: "Diplomatic Reception",
        description: "Navigate a high-level diplomatic or political reception",
        context:
          "You're representing your organization at a diplomatic reception with government officials, ambassadors, and business leaders from multiple countries. Cultural protocols and political sensitivities matter.",
        goal: "Successfully navigate diplomatic social context",
        objectives: [
          "Observe appropriate diplomatic protocols",
          "Navigate cultural differences gracefully",
          "Build bridges while representing interests",
          "Handle sensitive topics with discretion",
        ],
        userRole: "Delegation Member",
        botRole: "Ambassador",
        openingLine:
          "Welcome to our reception. I understand your organization is exploring opportunities in our region. These social occasions offer valuable opportunities for understanding beyond formal negotiations. What aspects of our culture have you found most intriguing?",
      },
    ],
  },

  // ========== SOCIAL SITUATIONS - SMALL TALK ==========
  {
    subcategory: "small talk",
    topicGroupName: "social situations",
    levels: [
      {
        level: Level.A1,
        title: "Weather Talk",
        description: "Talk about the weather",
        context:
          "You're waiting at a bus stop and want to make small talk with someone about the weather.",
        goal: "Make simple small talk about weather",
        objectives: [
          "Comment on the weather",
          "Listen to their response",
          "Add another comment",
          "End the conversation politely",
        ],
        userRole: "Stranger",
        botRole: "Another Stranger",
        openingLine: "It's a nice day today, isn't it?",
      },
      {
        level: Level.A2,
        title: "Office Small Talk",
        description: "Chat with colleagues at work",
        context:
          "You're in the office kitchen making coffee and a colleague joins you. You want to have a friendly chat.",
        goal: "Have a pleasant chat with a colleague",
        objectives: [
          "Ask about their day",
          "Share about your weekend or plans",
          "Find something to talk about",
          "Return to work naturally",
        ],
        userRole: "Employee",
        botRole: "Colleague",
        openingLine:
          "Oh hey! How's your Monday going so far? The coffee here is pretty good today.",
      },
      {
        level: Level.B1,
        title: "Neighbor Conversation",
        description: "Chat with a neighbor you've just met",
        context:
          "You've just moved to a new apartment and meet a neighbor in the hallway. You want to be friendly and learn about the building.",
        goal: "Build a friendly relationship with your new neighbor",
        objectives: [
          "Introduce yourself as new",
          "Ask about the neighborhood",
          "Share a bit about yourself",
          "Express interest in being good neighbors",
        ],
        userRole: "New Resident",
        botRole: "Neighbor",
        openingLine:
          "Oh, you must be new here! I saw the moving truck yesterday. Welcome to the building! I'm in apartment 4B.",
      },
      {
        level: Level.B2,
        title: "Conference Break Chat",
        description: "Network during a conference coffee break",
        context:
          "You're at a professional conference during a break. Someone approaches you for small talk, and it naturally leads to discussing your work.",
        goal: "Turn small talk into meaningful professional exchange",
        objectives: [
          "Engage in appropriate openers",
          "Transition naturally to professional topics",
          "Find points of connection",
          "Exchange contact information naturally",
        ],
        userRole: "Conference Attendee",
        botRole: "Fellow Attendee",
        openingLine:
          "The last presentation was quite thought-provoking, wasn't it? I found myself disagreeing with some points though. What did you think?",
      },
      {
        level: Level.C1,
        title: "Cross-Cultural Small Talk",
        description: "Navigate small talk across cultures",
        context:
          "You're at an international gathering with people from various cultural backgrounds. Small talk norms vary significantly across cultures.",
        goal: "Navigate cross-cultural social interaction skillfully",
        objectives: [
          "Recognize cultural differences in conversation norms",
          "Adapt communication style appropriately",
          "Build bridges across cultural divides",
          "Avoid cultural missteps",
        ],
        userRole: "International Professional",
        botRole: "Professional from Different Culture",
        openingLine:
          "I noticed from your badge that you're based in a different region. I've always been curious about how business culture differs there. What surprises visitors most about working in your context?",
      },
      {
        level: Level.C2,
        title: "Intellectual Salon Discourse",
        description: "Engage in sophisticated intellectual discussion",
        context:
          "You're at a gathering of intellectuals, artists, and thought leaders. Conversation ranges from philosophy to politics to arts, requiring cultural breadth and intellectual agility.",
        goal: "Contribute meaningfully to intellectual discourse",
        objectives: [
          "Engage with ideas across domains",
          "Reference broad cultural knowledge appropriately",
          "Challenge ideas constructively",
          "Express nuanced perspectives elegantly",
        ],
        userRole: "Intellectual Guest",
        botRole: "Renowned Thinker",
        openingLine:
          "I've been contemplating the tension between technological determinism and human agency in shaping our future. The optimists seem naive, but the pessimists paralyzing. Where do you find intellectual ground that allows for meaningful action?",
      },
    ],
  },

  // ========== SOCIAL SITUATIONS - MAKING FRIENDS ==========
  {
    subcategory: "making friends",
    topicGroupName: "social situations",
    levels: [
      {
        level: Level.A1,
        title: "Playground Friends",
        description: "Make friends in a casual setting",
        context:
          "You're at a community event and see someone who looks friendly. You want to start talking to them.",
        goal: "Start a friendly conversation",
        objectives: [
          "Say hello",
          "Ask a simple question",
          "Share something about yourself",
          "Suggest doing something together",
        ],
        userRole: "Person Looking for Friends",
        botRole: "Potential Friend",
        openingLine:
          "Hi! This is a fun event, isn't it? Is this your first time here?",
      },
      {
        level: Level.A2,
        title: "Class Friends",
        description: "Make friends in a class or course",
        context:
          "You're taking an evening class and want to make friends with someone who sits near you. You're on a break.",
        goal: "Start building a friendship with a classmate",
        objectives: [
          "Start a conversation about the class",
          "Find out about their interests",
          "Share about yourself",
          "Suggest meeting outside class",
        ],
        userRole: "Student",
        botRole: "Classmate",
        openingLine:
          "That was an interesting lesson! Do you find the homework difficult too?",
      },
      {
        level: Level.B1,
        title: "Hobby Group Friend",
        description: "Make friends through a shared hobby",
        context:
          "You've joined a new hobby club and want to connect with other members. You share a common interest that brought you here.",
        goal: "Build friendships through shared interests",
        objectives: [
          "Bond over shared interests",
          "Learn about their experience",
          "Share your own journey",
          "Propose meeting up",
        ],
        userRole: "New Club Member",
        botRole: "Experienced Member",
        openingLine:
          "I've noticed you're really skilled! How long have you been doing this? I just started and I'm hooked already.",
      },
      {
        level: Level.B2,
        title: "Expat Friend",
        description: "Making friends as an expat in a new country",
        context:
          "You've recently moved to a new country and are trying to build a social circle. You're at an expat meetup connecting with others in similar situations.",
        goal: "Build meaningful friendships as an expat",
        objectives: [
          "Connect over shared expat experiences",
          "Share adjustment challenges and tips",
          "Find common interests beyond nationality",
          "Plan to stay in touch",
        ],
        userRole: "New Expat",
        botRole: "Established Expat",
        openingLine:
          "How long have you been here? The first few months were really challenging for me. It gets easier, I promise! What's been the hardest part for you so far?",
      },
      {
        level: Level.C1,
        title: "Reconnecting Friendship",
        description: "Rebuild a friendship after time apart",
        context:
          "You've reconnected with an old friend after many years. You're navigating how much you've both changed while honoring your history.",
        goal: "Meaningfully reconnect with an old friend",
        objectives: [
          "Acknowledge shared history",
          "Discover who they've become",
          "Share your own evolution",
          "Establish new connection terms",
        ],
        userRole: "Old Friend",
        botRole: "Reconnected Friend",
        openingLine:
          "I can't believe it's been ten years! You look great, but I imagine so much has changed. I've thought about reaching out so many times. What's life like for you now?",
      },
      {
        level: Level.C2,
        title: "Late-Life Friendship",
        description: "Form deep friendships later in life",
        context:
          "You're forming a new friendship as a mature adult. The conversation involves discussing life perspectives, values, and what matters most at this stage.",
        goal: "Build a meaningful late-life friendship",
        objectives: [
          "Share accumulated life wisdom",
          "Explore compatible values and perspectives",
          "Discuss what friendship means at this stage",
          "Establish authentic connection",
        ],
        userRole: "Person Seeking Connection",
        botRole: "Potential Friend",
        openingLine:
          "I find that friendships formed at our age can be more genuine—we know who we are and what we value. What do you find yourself caring most about these days? What qualities do you seek in the people you choose to spend time with?",
      },
    ],
  },

  // ========== SOCIAL SITUATIONS - DATING ==========
  {
    subcategory: "dating",
    topicGroupName: "social situations",
    levels: [
      {
        level: Level.A1,
        title: "First Meeting",
        description: "Meet someone new you're interested in",
        context:
          "You're at a coffee shop and see someone interesting. You want to say hello and introduce yourself.",
        goal: "Introduce yourself to someone you like",
        objectives: [
          "Say hello nicely",
          "Introduce yourself",
          "Ask a simple question",
          "Get their name",
        ],
        userRole: "Interested Person",
        botRole: "Stranger",
        openingLine:
          "Oh, hello! Is this seat taken? This is a nice coffee shop, isn't it?",
      },
      {
        level: Level.A2,
        title: "Getting to Know You",
        description: "Have a first conversation with someone you like",
        context:
          "You've met someone at an event and you're both interested in talking more. This is your first longer conversation.",
        goal: "Learn more about someone you're interested in",
        objectives: [
          "Ask about their interests",
          "Share about yourself",
          "Find things in common",
          "Suggest meeting again",
        ],
        userRole: "Person on a Date",
        botRole: "Date",
        openingLine:
          "I'm glad we could talk more! So tell me, what do you like to do in your free time?",
      },
      {
        level: Level.B1,
        title: "First Date Conversation",
        description: "Have a successful first date conversation",
        context:
          "You're on a first date at a restaurant. You want to make a good impression and genuinely get to know this person.",
        goal: "Have an engaging first date conversation",
        objectives: [
          "Keep conversation flowing naturally",
          "Share interesting things about yourself",
          "Show genuine interest in them",
          "End on a positive note",
        ],
        userRole: "Person on First Date",
        botRole: "Date",
        openingLine:
          "I'm really glad you suggested this place—the atmosphere is lovely. So, we've texted quite a bit, but I'm curious to learn more about you in person. What should I know?",
      },
      {
        level: Level.B2,
        title: "Deeper Dating Conversation",
        description: "Have meaningful conversations while dating",
        context:
          "You've been on a few dates and want to have deeper conversations about values, life goals, and what you're looking for.",
        goal: "Explore compatibility through meaningful conversation",
        objectives: [
          "Discuss values and priorities",
          "Share relationship expectations",
          "Explore life goals",
          "Navigate any differences",
        ],
        userRole: "Person in Dating",
        botRole: "Dating Partner",
        openingLine:
          "Now that we've gotten past the usual first date topics... I find myself wanting to know what really matters to you. What do you value most in life?",
      },
      {
        level: Level.C1,
        title: "Relationship Discussion",
        description: "Have an important relationship conversation",
        context:
          "Your relationship has reached a point where you need to discuss future directions, commitments, and what both of you want going forward.",
        goal: "Navigate important relationship conversation",
        objectives: [
          "Express your feelings and needs clearly",
          "Listen to partner's perspective",
          "Find common ground on future",
          "Address concerns constructively",
        ],
        userRole: "Partner",
        botRole: "Significant Other",
        openingLine:
          "I feel like we've reached an important point in our relationship. There are things I want to talk about—about us, about the future. I hope we can be honest with each other about where we both are and what we want.",
      },
      {
        level: Level.C2,
        title: "Complex Relationship Navigation",
        description: "Navigate complex relationship dynamics",
        context:
          "Your relationship involves complex considerations—perhaps different cultural backgrounds, life circumstances, or past experiences. Deep understanding and emotional intelligence are required.",
        goal: "Navigate relationship complexity with maturity",
        objectives: [
          "Acknowledge complexity with nuance",
          "Discuss challenging topics with emotional intelligence",
          "Find creative solutions to challenges",
          "Deepen connection through difficulty",
        ],
        userRole: "Partner",
        botRole: "Partner",
        openingLine:
          "We both bring so much to this relationship—including some complicated histories and circumstances. I don't want to pretend things are simple when they're not. Can we talk honestly about how we navigate all of this together? What do we each need to feel truly supported?",
      },
    ],
  },
];

// ============================================
// SEEDING FUNCTION
// ============================================
async function seedSpeaking() {
  console.log("🌱 Starting Speaking seed...\n");

  // Clear existing data
  console.log("🗑️  Clearing existing Speaking data...");
  await prisma.speakingScenario.deleteMany({
    where: {
      topicGroup: {
        hubType: HubType.speaking,
      },
    },
  });
  await prisma.topicGroup.deleteMany({
    where: { hubType: HubType.speaking },
  });
  console.log("✅ Cleared existing data\n");

  // Seed TopicGroups
  console.log("📂 Seeding TopicGroups...");
  const createdGroups: Record<string, string> = {};

  for (const group of topicGroupsData) {
    const created = await prisma.topicGroup.create({
      data: {
        name: group.name,
        order: group.order,
        hubType: group.hubType,
        subcategories: group.subcategories,
      },
    });
    createdGroups[group.name] = created.id;
    console.log(
      `  ✅ Created TopicGroup: "${group.name}" with ${group.subcategories.length} subcategories`
    );
  }
  console.log(
    `\n📂 TopicGroups seeded: ${Object.keys(createdGroups).length}\n`
  );

  // Seed SpeakingScenarios
  console.log("🎭 Seeding SpeakingScenarios...");
  let scenarioCount = 0;

  for (const template of scenariosData) {
    const topicGroupId = createdGroups[template.topicGroupName];

    if (!topicGroupId) {
      console.log(
        `  ⚠️  Skipping scenarios for unknown group: ${template.topicGroupName}`
      );
      continue;
    }

    for (const scenario of template.levels) {
      await prisma.speakingScenario.create({
        data: {
          title: scenario.title,
          description: scenario.description,
          context: scenario.context,
          goal: scenario.goal,
          objectives: scenario.objectives,
          userRole: scenario.userRole,
          botRole: scenario.botRole,
          openingLine: scenario.openingLine,
          difficulty: scenario.level,
          category: template.topicGroupName,
          subcategory: template.subcategory,
          image: "/learning.png",
          isCustom: false,
          topicGroup: {
            connect: { id: topicGroupId },
          },
        },
      });
      scenarioCount++;
    }
    console.log(
      `  ✅ Created 6 scenarios for "${template.topicGroupName}" > "${template.subcategory}"`
    );
  }

  console.log(`\n🎭 SpeakingScenarios seeded: ${scenarioCount}`);
  console.log("\n✨ Speaking seed completed successfully!");
}

// Run the seed
seedSpeaking()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
