
import SpeakingSessionClient from "@/components/page/SpeakingSessionClient";
import type {
  ScenarioData,
  InitialTurn,
  DetailedFeedbackData,
} from "@/components/page/SpeakingSessionClient";

// Mock scenarios data - will be replaced with actual data fetching from DB/API later
const mockScenarios: ScenarioData[] = [
  {
    id: "scenario-1",
    title: "Coffee Shop Ordering",
    description: "Practice ordering drinks and snacks at a coffee shop",
    context:
      "You are at a busy coffee shop during morning rush hour. The barista is ready to take your order.",
    goal: "Successfully order your preferred coffee drink with any customizations",
    objectives: [
      "Greet the barista appropriately",
      "Order a drink with specific customizations (size, milk type, extras)",
      "Ask about available pastries or snacks",
      "Complete the payment process",
    ],
    userRole: "Customer",
    botRole: "Barista",
    openingLine:
      "Good morning! Welcome to Daily Brew. What can I get started for you today?",
  },
  {
    id: "scenario-2",
    title: "Job Interview",
    description: "Practice answering common interview questions",
    context:
      "You are in a job interview for a position you really want. The interviewer is professional but friendly.",
    goal: "Make a great impression and answer interview questions confidently",
    objectives: [
      "Introduce yourself professionally",
      "Describe your relevant experience",
      "Explain why you want this position",
      "Ask thoughtful questions about the role",
    ],
    userRole: "Job Applicant",
    botRole: "HR Interviewer",
    openingLine:
      "Hello! Thank you for coming in today. Please, have a seat. I'm excited to learn more about you. Let's start - could you tell me a bit about yourself?",
  },
  {
    id: "scenario-3",
    title: "Hotel Check-in",
    description: "Practice checking into a hotel",
    context:
      "You have just arrived at a hotel after a long journey. The receptionist is waiting to help you.",
    goal: "Complete the check-in process and get information about the hotel",
    objectives: [
      "Provide your reservation details",
      "Request any room preferences",
      "Ask about hotel amenities and services",
      "Get directions to your room",
    ],
    userRole: "Hotel Guest",
    botRole: "Hotel Receptionist",
    openingLine:
      "Good evening! Welcome to The Grand Hotel. How may I assist you today?",
  },
  {
    id: "scenario-4",
    title: "Restaurant Reservation",
    description: "Practice making a restaurant reservation by phone",
    context:
      "You want to make a dinner reservation at a popular restaurant for a special occasion.",
    goal: "Successfully book a table for your party",
    objectives: [
      "Ask about availability for your preferred date and time",
      "Specify the number of guests",
      "Mention any special requirements or occasions",
      "Confirm the reservation details",
    ],
    userRole: "Customer calling to make a reservation",
    botRole: "Restaurant Host",
    openingLine:
      "Good afternoon, thank you for calling Bella Italia. This is Maria speaking. How may I help you today?",
  },
  {
    id: "scenario-5",
    title: "Doctor's Appointment",
    description: "Practice describing symptoms to a doctor",
    context:
      "You are visiting a doctor because you haven't been feeling well lately.",
    goal: "Clearly describe your symptoms and understand the doctor's advice",
    objectives: [
      "Describe your symptoms accurately",
      "Answer the doctor's questions about your health history",
      "Understand the diagnosis and treatment options",
      "Ask questions about medication or follow-up care",
    ],
    userRole: "Patient",
    botRole: "Doctor",
    openingLine:
      "Hello! Please come in and have a seat. I'm Dr. Smith. I see from your chart that you've been feeling unwell. Can you tell me what's been bothering you?",
  },
];

// Mock data for fallback or initial props
const mockDetailedFeedback: DetailedFeedbackData = {
  scores: [
    { label: "Relevance", value: 0 },
    { label: "Pronunciation", value: 0 },
    { label: "Intonation & Stress", value: 0 },
    { label: "Fluency", value: 0 },
    { label: "Grammar", value: 0 },
  ],
  errorCategories: [],
  conversation: [],
  overallRating: "N/A",
  tip: "Start speaking to get feedback!",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SpeakingSessionPage({ params }: PageProps) {
  const { id } = await params;

  // Mock data - will be replaced with actual data fetching from DB/API later
  // Find scenario by ID from mock data
  const scenario = mockScenarios.find((s) => s.id === id) || null;
  const initialTurns: InitialTurn[] = [];

  // If still null, we'll let the client handle null scenario

  return (
    <SpeakingSessionClient
      // Pass the resolved scenario.id as the "scenarioId" prop to client
      scenario={scenario}
      initialTurns={initialTurns}
      learningRecords={[]} // TODO: Fetch real records if needed
      detailedFeedback={mockDetailedFeedback}
      scenarioId={scenario ? scenario.id : id}
    />
  );
}
