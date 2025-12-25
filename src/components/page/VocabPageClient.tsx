"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  X,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Network,
  Edit,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route";
import {
  HubHero,
  TopicGroupsSidebar,
  LevelsSidebar,
  TopicCard,
  SubcategoryPills,
  type TopicGroup,
} from "@/components/hub";
import { VocabMindmap } from "@/components/hub/vocab-mindmap";
import { mockVocab } from "@/lib/mock-data";
import {
  getVocabTopicGroups,
  getVocabTopicsWithProgress,
  searchVocabTopics,
} from "@/actions/vocab";

// Interface for vocab topics from server
interface VocabTopic {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  subcategory: string;
  wordCount: number;
  estimatedTime: number;
  progress: number;
  thumbnail?: string;
}

interface VocabPageClientProps {
  userId: string;
}

// Mock data for Dictionary tab - Expanded with 100 words
const MOCK_DICTIONARY_WORDS = [
  // A
  { id: "1", word: "Abandon", pronunciation: "/əˈbændən/", meaning: "To leave behind or give up completely", partOfSpeech: "Verb", level: "B1" },
  { id: "2", word: "Accomplish", pronunciation: "/əˈkʌmplɪʃ/", meaning: "To complete or achieve something successfully", partOfSpeech: "Verb", level: "B1" },
  { id: "3", word: "Adequate", pronunciation: "/ˈædɪkwət/", meaning: "Sufficient for a specific requirement", partOfSpeech: "Adjective", level: "B2" },
  { id: "4", word: "Adventure", pronunciation: "/ədˈventʃər/", meaning: "An exciting or unusual experience", partOfSpeech: "Noun", level: "A2" },
  { id: "5", word: "Affordable", pronunciation: "/əˈfɔːdəbl/", meaning: "Inexpensive; reasonably priced", partOfSpeech: "Adjective", level: "B1" },
  // B
  { id: "6", word: "Benefit", pronunciation: "/ˈbenɪfɪt/", meaning: "An advantage or profit gained from something", partOfSpeech: "Noun", level: "A2" },
  { id: "7", word: "Brilliant", pronunciation: "/ˈbrɪliənt/", meaning: "Exceptionally clever or talented", partOfSpeech: "Adjective", level: "B1" },
  { id: "8", word: "Bureaucracy", pronunciation: "/bjʊəˈrɒkrəsi/", meaning: "A system of government with many complicated rules", partOfSpeech: "Noun", level: "C1" },
  { id: "9", word: "Beautiful", pronunciation: "/ˈbjuːtɪfl/", meaning: "Pleasing the senses or mind aesthetically", partOfSpeech: "Adjective", level: "A1" },
  { id: "10", word: "Brave", pronunciation: "/breɪv/", meaning: "Ready to face danger or pain", partOfSpeech: "Adjective", level: "A2" },
  // C
  { id: "11", word: "Collaborate", pronunciation: "/kəˈlæbəreɪt/", meaning: "To work together with others on a project", partOfSpeech: "Verb", level: "B2" },
  { id: "12", word: "Comprehensive", pronunciation: "/ˌkɒmprɪˈhensɪv/", meaning: "Including all or nearly all elements or aspects", partOfSpeech: "Adjective", level: "B2" },
  { id: "13", word: "Consequence", pronunciation: "/ˈkɒnsɪkwəns/", meaning: "A result or effect of an action", partOfSpeech: "Noun", level: "B1" },
  { id: "14", word: "Curious", pronunciation: "/ˈkjʊəriəs/", meaning: "Eager to know or learn something", partOfSpeech: "Adjective", level: "A2" },
  { id: "15", word: "Catastrophe", pronunciation: "/kəˈtæstrəfi/", meaning: "A sudden disaster causing great damage", partOfSpeech: "Noun", level: "C1" },
  // D
  { id: "16", word: "Determine", pronunciation: "/dɪˈtɜːmɪn/", meaning: "To decide or establish something precisely", partOfSpeech: "Verb", level: "B1" },
  { id: "17", word: "Diligent", pronunciation: "/ˈdɪlɪdʒənt/", meaning: "Having or showing care in one's work", partOfSpeech: "Adjective", level: "B2" },
  { id: "18", word: "Diverse", pronunciation: "/daɪˈvɜːs/", meaning: "Showing a great deal of variety", partOfSpeech: "Adjective", level: "B2" },
  { id: "19", word: "Delicious", pronunciation: "/dɪˈlɪʃəs/", meaning: "Highly pleasant to the taste", partOfSpeech: "Adjective", level: "A1" },
  { id: "20", word: "Demonstrate", pronunciation: "/ˈdemənstreɪt/", meaning: "To show or prove something clearly", partOfSpeech: "Verb", level: "B1" },
  // E
  { id: "21", word: "Efficient", pronunciation: "/ɪˈfɪʃnt/", meaning: "Working in a well-organized and competent way", partOfSpeech: "Adjective", level: "B2" },
  { id: "22", word: "Elaborate", pronunciation: "/ɪˈlæbərət/", meaning: "Involving many carefully arranged parts", partOfSpeech: "Adjective", level: "C1" },
  { id: "23", word: "Enthusiastic", pronunciation: "/ɪnˌθjuːziˈæstɪk/", meaning: "Having intense and eager enjoyment", partOfSpeech: "Adjective", level: "B1" },
  { id: "24", word: "Essential", pronunciation: "/ɪˈsenʃl/", meaning: "Absolutely necessary; extremely important", partOfSpeech: "Adjective", level: "B1" },
  { id: "25", word: "Exciting", pronunciation: "/ɪkˈsaɪtɪŋ/", meaning: "Causing great enthusiasm and eagerness", partOfSpeech: "Adjective", level: "A1" },
  // F
  { id: "26", word: "Family", pronunciation: "/ˈfæmɪli/", meaning: "A group of people related by blood or marriage", partOfSpeech: "Noun", level: "A1" },
  { id: "27", word: "Fascinating", pronunciation: "/ˈfæsɪneɪtɪŋ/", meaning: "Extremely interesting", partOfSpeech: "Adjective", level: "B1" },
  { id: "28", word: "Flexible", pronunciation: "/ˈfleksəbl/", meaning: "Able to be easily modified", partOfSpeech: "Adjective", level: "B1" },
  { id: "29", word: "Fluent", pronunciation: "/ˈfluːənt/", meaning: "Able to express oneself easily and articulately", partOfSpeech: "Adjective", level: "B2" },
  { id: "30", word: "Fundamental", pronunciation: "/ˌfʌndəˈmentl/", meaning: "Forming a necessary base or core", partOfSpeech: "Adjective", level: "B2" },
  // G
  { id: "31", word: "Generate", pronunciation: "/ˈdʒenəreɪt/", meaning: "To produce or create something", partOfSpeech: "Verb", level: "B2" },
  { id: "32", word: "Genuine", pronunciation: "/ˈdʒenjuɪn/", meaning: "Truly what something is said to be; authentic", partOfSpeech: "Adjective", level: "B1" },
  { id: "33", word: "Grateful", pronunciation: "/ˈɡreɪtfl/", meaning: "Feeling or showing thanks", partOfSpeech: "Adjective", level: "A2" },
  { id: "34", word: "Gorgeous", pronunciation: "/ˈɡɔːdʒəs/", meaning: "Beautiful; very attractive", partOfSpeech: "Adjective", level: "B1" },
  { id: "35", word: "Guarantee", pronunciation: "/ˌɡærənˈtiː/", meaning: "A formal promise or assurance", partOfSpeech: "Noun", level: "B1" },
  // H
  { id: "36", word: "Hypothesis", pronunciation: "/haɪˈpɒθəsɪs/", meaning: "A proposed explanation for a phenomenon", partOfSpeech: "Noun", level: "C1" },
  { id: "37", word: "Hesitate", pronunciation: "/ˈhezɪteɪt/", meaning: "To pause before saying or doing something", partOfSpeech: "Verb", level: "B1" },
  { id: "38", word: "Humble", pronunciation: "/ˈhʌmbl/", meaning: "Having a modest view of one's importance", partOfSpeech: "Adjective", level: "B2" },
  { id: "39", word: "Happy", pronunciation: "/ˈhæpi/", meaning: "Feeling or showing pleasure", partOfSpeech: "Adjective", level: "A1" },
  { id: "40", word: "Harmony", pronunciation: "/ˈhɑːməni/", meaning: "Agreement or concord", partOfSpeech: "Noun", level: "B2" },
  // I
  { id: "41", word: "Implement", pronunciation: "/ˈɪmplɪment/", meaning: "To put a plan or decision into effect", partOfSpeech: "Verb", level: "B2" },
  { id: "42", word: "Inevitable", pronunciation: "/ɪnˈevɪtəbl/", meaning: "Certain to happen; unavoidable", partOfSpeech: "Adjective", level: "B2" },
  { id: "43", word: "Innovative", pronunciation: "/ˈɪnəvətɪv/", meaning: "Introducing new ideas; original", partOfSpeech: "Adjective", level: "B2" },
  { id: "44", word: "Interesting", pronunciation: "/ˈɪntrəstɪŋ/", meaning: "Arousing curiosity or attention", partOfSpeech: "Adjective", level: "A1" },
  { id: "45", word: "Intuitive", pronunciation: "/ɪnˈtjuːɪtɪv/", meaning: "Using or based on what one feels is true", partOfSpeech: "Adjective", level: "C1" },
  // J
  { id: "46", word: "Justify", pronunciation: "/ˈdʒʌstɪfaɪ/", meaning: "To show or prove to be right or reasonable", partOfSpeech: "Verb", level: "B2" },
  { id: "47", word: "Journey", pronunciation: "/ˈdʒɜːni/", meaning: "An act of traveling from one place to another", partOfSpeech: "Noun", level: "A2" },
  { id: "48", word: "Joyful", pronunciation: "/ˈdʒɔɪfl/", meaning: "Feeling or causing great pleasure", partOfSpeech: "Adjective", level: "B1" },
  { id: "49", word: "Judge", pronunciation: "/dʒʌdʒ/", meaning: "To form an opinion or conclusion about", partOfSpeech: "Verb", level: "A2" },
  // K
  { id: "50", word: "Knowledge", pronunciation: "/ˈnɒlɪdʒ/", meaning: "Facts, information, and skills acquired", partOfSpeech: "Noun", level: "A2" },
  { id: "51", word: "Keen", pronunciation: "/kiːn/", meaning: "Having or showing eagerness", partOfSpeech: "Adjective", level: "B1" },
  { id: "52", word: "Kind", pronunciation: "/kaɪnd/", meaning: "Having a friendly, generous nature", partOfSpeech: "Adjective", level: "A1" },
  // L
  { id: "53", word: "Legacy", pronunciation: "/ˈleɡəsi/", meaning: "Something handed down from the past", partOfSpeech: "Noun", level: "C1" },
  { id: "54", word: "Legitimate", pronunciation: "/lɪˈdʒɪtɪmət/", meaning: "Conforming to the law or rules", partOfSpeech: "Adjective", level: "B2" },
  { id: "55", word: "Logical", pronunciation: "/ˈlɒdʒɪkl/", meaning: "Characterized by clear reasoning", partOfSpeech: "Adjective", level: "B1" },
  { id: "56", word: "Lovely", pronunciation: "/ˈlʌvli/", meaning: "Exquisitely beautiful", partOfSpeech: "Adjective", level: "A2" },
  // M
  { id: "57", word: "Magnificent", pronunciation: "/mæɡˈnɪfɪsnt/", meaning: "Impressively beautiful, elaborate, or extravagant", partOfSpeech: "Adjective", level: "B2" },
  { id: "58", word: "Maintain", pronunciation: "/meɪnˈteɪn/", meaning: "To cause or enable to continue", partOfSpeech: "Verb", level: "B1" },
  { id: "59", word: "Meticulous", pronunciation: "/məˈtɪkjələs/", meaning: "Showing great attention to detail", partOfSpeech: "Adjective", level: "C1" },
  { id: "60", word: "Modest", pronunciation: "/ˈmɒdɪst/", meaning: "Unassuming in estimation of one's abilities", partOfSpeech: "Adjective", level: "B1" },
  // N
  { id: "61", word: "Navigate", pronunciation: "/ˈnævɪɡeɪt/", meaning: "To plan and direct the route of a journey", partOfSpeech: "Verb", level: "B1" },
  { id: "62", word: "Negotiate", pronunciation: "/nɪˈɡəʊʃieɪt/", meaning: "To obtain or bring about by discussion", partOfSpeech: "Verb", level: "B2" },
  { id: "63", word: "Notorious", pronunciation: "/nəʊˈtɔːriəs/", meaning: "Famous for some bad quality", partOfSpeech: "Adjective", level: "C1" },
  { id: "64", word: "Nice", pronunciation: "/naɪs/", meaning: "Giving pleasure or satisfaction", partOfSpeech: "Adjective", level: "A1" },
  // O
  { id: "65", word: "Objective", pronunciation: "/əbˈdʒektɪv/", meaning: "Not influenced by personal feelings", partOfSpeech: "Adjective", level: "B2" },
  { id: "66", word: "Obtain", pronunciation: "/əbˈteɪn/", meaning: "To get or acquire", partOfSpeech: "Verb", level: "B1" },
  { id: "67", word: "Obvious", pronunciation: "/ˈɒbviəs/", meaning: "Easily perceived or understood", partOfSpeech: "Adjective", level: "B1" },
  { id: "68", word: "Optimistic", pronunciation: "/ˌɒptɪˈmɪstɪk/", meaning: "Hopeful and confident about the future", partOfSpeech: "Adjective", level: "B1" },
  // P
  { id: "69", word: "Paradox", pronunciation: "/ˈpærədɒks/", meaning: "A seemingly absurd statement that may be true", partOfSpeech: "Noun", level: "C1" },
  { id: "70", word: "Peculiar", pronunciation: "/pɪˈkjuːliər/", meaning: "Strange or unusual", partOfSpeech: "Adjective", level: "B2" },
  { id: "71", word: "Persistent", pronunciation: "/pəˈsɪstənt/", meaning: "Continuing firmly despite opposition", partOfSpeech: "Adjective", level: "B2" },
  { id: "72", word: "Pleasant", pronunciation: "/ˈpleznt/", meaning: "Giving a sense of happy satisfaction", partOfSpeech: "Adjective", level: "A2" },
  { id: "73", word: "Profound", pronunciation: "/prəˈfaʊnd/", meaning: "Very great or intense", partOfSpeech: "Adjective", level: "C1" },
  // Q
  { id: "74", word: "Qualified", pronunciation: "/ˈkwɒlɪfaɪd/", meaning: "Officially recognized as competent", partOfSpeech: "Adjective", level: "B1" },
  { id: "75", word: "Quiet", pronunciation: "/ˈkwaɪət/", meaning: "Making little or no noise", partOfSpeech: "Adjective", level: "A1" },
  { id: "76", word: "Quintessential", pronunciation: "/ˌkwɪntɪˈsenʃl/", meaning: "Representing the most perfect example", partOfSpeech: "Adjective", level: "C2" },
  // R
  { id: "77", word: "Rational", pronunciation: "/ˈræʃənl/", meaning: "Based on reason rather than emotions", partOfSpeech: "Adjective", level: "B2" },
  { id: "78", word: "Reliable", pronunciation: "/rɪˈlaɪəbl/", meaning: "Consistently good in quality", partOfSpeech: "Adjective", level: "B1" },
  { id: "79", word: "Remarkable", pronunciation: "/rɪˈmɑːkəbl/", meaning: "Worthy of attention; striking", partOfSpeech: "Adjective", level: "B1" },
  { id: "80", word: "Resilient", pronunciation: "/rɪˈzɪliənt/", meaning: "Able to recover quickly from difficulties", partOfSpeech: "Adjective", level: "C1" },
  // S
  { id: "81", word: "Significant", pronunciation: "/sɪɡˈnɪfɪkənt/", meaning: "Sufficiently great or important", partOfSpeech: "Adjective", level: "B1" },
  { id: "82", word: "Sophisticated", pronunciation: "/səˈfɪstɪkeɪtɪd/", meaning: "Having worldly knowledge and refinement", partOfSpeech: "Adjective", level: "B2" },
  { id: "83", word: "Spontaneous", pronunciation: "/spɒnˈteɪniəs/", meaning: "Performed without premeditation", partOfSpeech: "Adjective", level: "B2" },
  { id: "84", word: "Subtle", pronunciation: "/ˈsʌtl/", meaning: "Delicate or precise; not obvious", partOfSpeech: "Adjective", level: "B2" },
  { id: "85", word: "Simple", pronunciation: "/ˈsɪmpl/", meaning: "Easily done or understood", partOfSpeech: "Adjective", level: "A1" },
  // T
  { id: "86", word: "Thorough", pronunciation: "/ˈθʌrə/", meaning: "Complete with attention to every detail", partOfSpeech: "Adjective", level: "B2" },
  { id: "87", word: "Tolerant", pronunciation: "/ˈtɒlərənt/", meaning: "Willing to accept views different from one's own", partOfSpeech: "Adjective", level: "B2" },
  { id: "88", word: "Transparent", pronunciation: "/trænsˈpærənt/", meaning: "Easy to perceive or detect; clear", partOfSpeech: "Adjective", level: "B2" },
  { id: "89", word: "Tremendous", pronunciation: "/trəˈmendəs/", meaning: "Very great in amount or intensity", partOfSpeech: "Adjective", level: "B1" },
  // U
  { id: "90", word: "Ultimate", pronunciation: "/ˈʌltɪmət/", meaning: "Being the best or most extreme example", partOfSpeech: "Adjective", level: "B1" },
  { id: "91", word: "Unique", pronunciation: "/juːˈniːk/", meaning: "Being the only one of its kind", partOfSpeech: "Adjective", level: "A2" },
  { id: "92", word: "Unprecedented", pronunciation: "/ʌnˈpresɪdentɪd/", meaning: "Never done or known before", partOfSpeech: "Adjective", level: "C1" },
  { id: "93", word: "Useful", pronunciation: "/ˈjuːsfl/", meaning: "Able to be used for a practical purpose", partOfSpeech: "Adjective", level: "A1" },
  // V
  { id: "94", word: "Valuable", pronunciation: "/ˈvæljuəbl/", meaning: "Worth a great deal of money or importance", partOfSpeech: "Adjective", level: "B1" },
  { id: "95", word: "Versatile", pronunciation: "/ˈvɜːsətaɪl/", meaning: "Able to adapt to many functions", partOfSpeech: "Adjective", level: "B2" },
  { id: "96", word: "Vivid", pronunciation: "/ˈvɪvɪd/", meaning: "Producing strong clear images in the mind", partOfSpeech: "Adjective", level: "B2" },
  // W
  { id: "97", word: "Wonderful", pronunciation: "/ˈwʌndərfl/", meaning: "Inspiring delight or admiration", partOfSpeech: "Adjective", level: "A1" },
  { id: "98", word: "Worthwhile", pronunciation: "/ˌwɜːθˈwaɪl/", meaning: "Worth the time or effort spent", partOfSpeech: "Adjective", level: "B1" },
  // X
  { id: "99", word: "Xenophobia", pronunciation: "/ˌzenəˈfəʊbiə/", meaning: "Dislike or prejudice against foreigners", partOfSpeech: "Noun", level: "C2" },
  // Y
  { id: "100", word: "Yield", pronunciation: "/jiːld/", meaning: "To produce or provide; to give way", partOfSpeech: "Verb", level: "B2" },
  // Z
  { id: "101", word: "Zealous", pronunciation: "/ˈzeləs/", meaning: "Having great energy for a cause", partOfSpeech: "Adjective", level: "C1" },
];

// Mock data for Mindmap tab
const MOCK_MINDMAP_DATA = [
  {
    id: "daily-life",
    name: "Daily Life",
    color: "primary" as const,
    topics: [
      { id: "1", title: "Travel", words: mockVocab["1"] || [] },
      { id: "2", title: "Food & Dining", words: mockVocab["2"] || [] },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    color: "secondary" as const,
    topics: [{ id: "3", title: "Job Interview", words: mockVocab["3"] || [] }],
  },
  {
    id: "academic",
    name: "Academic",
    color: "accent" as const,
    topics: [
      {
        id: "academic-1",
        title: "Science",
        words: mockVocab["1"]?.slice(0, 3) || [],
      },
    ],
  },
];

type TabType = "topics" | "bookmarks" | "mindmap" | "dictionary";

const TOPICS_PER_PAGE = 12;

export default function VocabPageClient({ userId }: VocabPageClientProps) {
  // Loading states
  const [topicGroupsLoading, setTopicGroupsLoading] = useState(true);
  const [topicsLoading, setTopicsLoading] = useState(true);

  // Data states
  const [topicGroups, setTopicGroups] = useState<TopicGroup[]>([]);
  const [topics, setTopics] = useState<VocabTopic[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTopics, setTotalTopics] = useState(0);

  // Filters - defaults: All subcategory, no level filter (All)
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("All");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  // Search & UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<VocabTopic[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("topics");
  const [bookmarkedTopics, setBookmarkedTopics] = useState<string[]>([]);

  // Dictionary state
  const [dictionarySearch, setDictionarySearch] = useState("");
  const [selectedAlphabet, setSelectedAlphabet] = useState<string | null>(null);
  const [selectedDictLevels, setSelectedDictLevels] = useState<string[]>([]);
  const [dictPage, setDictPage] = useState(1);
  const dictItemsPerPage = 50;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const dictLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  // Fetch topic groups on mount
  useEffect(() => {
    getVocabTopicGroups()
      .then((groups) => {
        setTopicGroups(groups);
        // Set first group as selected if available
        if (groups.length > 0 && !selectedGroup) {
          setSelectedGroup(groups[0].name);
        }
      })
      .finally(() => setTopicGroupsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch topics when filters change
  useEffect(() => {
    if (!selectedGroup) return;

    setTopicsLoading(true);
    getVocabTopicsWithProgress(userId || undefined, {
      page: currentPage,
      limit: TOPICS_PER_PAGE,
      category: selectedGroup,
      subcategory: selectedSubcategory,
      levels: selectedLevels.length > 0 ? selectedLevels : undefined,
    })
      .then((result) => {
        setTopics(result.topics);
        setTotalPages(result.totalPages);
        setTotalTopics(result.total);
      })
      .finally(() => setTopicsLoading(false));
  }, [userId, selectedGroup, selectedSubcategory, selectedLevels, currentPage]);

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("vocab-bookmarks");
    if (saved) {
      setBookmarkedTopics(JSON.parse(saved));
    }
  }, []);

  // Search handler with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setIsSearching(true);
      searchVocabTopics(searchQuery, userId || undefined)
        .then(setSearchResults)
        .finally(() => setIsSearching(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, userId]);

  const handleBookmarkToggle = (topicId: string) => {
    setBookmarkedTopics((prev) => {
      const newBookmarks = prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId];
      localStorage.setItem("vocab-bookmarks", JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  const toggleLevel = (level: string) => {
    if (level === "All") {
      // Toggle all levels
      const allLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
      if (selectedLevels.length === allLevels.length) {
        setSelectedLevels([]);
      } else {
        setSelectedLevels(allLevels);
      }
    } else {
      setSelectedLevels((prev) =>
        prev.includes(level)
          ? prev.filter((l) => l !== level)
          : [...prev, level]
      );
    }
    // Reset to page 1 when filter changes
    setCurrentPage(1);
  };

  const handleGroupChange = (name: string) => {
    setSelectedGroup(name);
    setSelectedSubcategory("All");
    setCurrentPage(1);
  };

  const handleSubcategoryChange = (subcat: string) => {
    setSelectedSubcategory(subcat);
    setCurrentPage(1);
  };

  // Get current subcategories for selected group
  const currentSubcategories =
    topicGroups.find((g) => g.name === selectedGroup)?.subcategories || [];

  const isSearchMode = searchQuery.trim().length > 0;
  const displayTopics = isSearchMode ? searchResults : topics;

  // Bookmarked topics (filter from fetched topics or search for more)
  const bookmarkedTopicsList = topics.filter((topic) =>
    bookmarkedTopics.includes(topic.id)
  );

  // Dictionary filtering
  const filteredDictionaryWords = MOCK_DICTIONARY_WORDS.filter((word) => {
    const matchesSearch =
      word.word.toLowerCase().includes(dictionarySearch.toLowerCase()) ||
      word.meaning.toLowerCase().includes(dictionarySearch.toLowerCase());
    const matchesAlphabet =
      !selectedAlphabet || word.word.toUpperCase().startsWith(selectedAlphabet);
    const matchesLevel =
      selectedDictLevels.length === 0 ||
      selectedDictLevels.includes(word.level);
    return matchesSearch && matchesAlphabet && matchesLevel;
  });

  const dictTotalPages = Math.ceil(
    filteredDictionaryWords.length / dictItemsPerPage
  );
  const paginatedWords = filteredDictionaryWords.slice(
    (dictPage - 1) * dictItemsPerPage,
    dictPage * dictItemsPerPage
  );

  const toggleDictLevel = (level: string) => {
    setSelectedDictLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const tabs = [
    { id: "topics", label: "Available Topics" },
    { id: "bookmarks", label: "Bookmarks" },
    { id: "mindmap", label: "Mindmap" },
    { id: "dictionary", label: "Dictionary" },
  ];

  // Skeleton for topic cards
  const TopicCardSkeleton = () => (
    <Card className="p-4 rounded-2xl border-2 border-gray-100">
      <Skeleton className="h-32 w-full rounded-xl mb-4 bg-gray-200" />
      <Skeleton className="h-5 w-3/4 mb-2 bg-gray-200" />
      <Skeleton className="h-4 w-full mb-2 bg-gray-200" />
      <Skeleton className="h-4 w-1/2 mb-4 bg-gray-200" />
      <Skeleton className="h-9 w-full rounded-full bg-gray-200" />
    </Card>
  );

  return (
    <ProtectedRoute
      pageName="Vocabulary Hub"
      pageDescription="Expand your vocabulary with structured topics and interactive flashcards."
      pageIcon={PageIcons.vocabulary}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <HubHero
          title="VOCABULARY HUB"
          description="Expand your vocabulary with structured topics and interactive flashcards."
          imageSrc="/hero-vocabulary.jpg"
          primaryAction={{ label: "View Study Plan" }}
          secondaryAction={{ label: "Browse Topics" }}
          notification={{
            text: "Recommended: Daily Routine",
            actionLabel: "Start",
          }}
          decorativeWords={["lexicon", "fluency", "expression"]}
        />

        {/* Tabs & Search */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 border-b border-gray-200 pb-0">
          {!isSearchMode && (
            <div className="flex gap-8 overflow-x-auto pb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`pb-3 px-2 text-lg font-bold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
          <div className="flex-1" />
          <div className="relative mb-4 sm:mb-0 flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-primary-400" />
            <Input
              placeholder="Search all topics..."
              className={`pl-10 pr-10 h-9 text-sm rounded-full border-2 transition-all ${
                isSearchMode
                  ? "w-80 border-primary-400 shadow-lg bg-white"
                  : "w-64 border-primary-200 hover:border-primary-300"
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isSearchMode && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-primary-100 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4 text-primary-500" />
              </button>
            )}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="mt-6">
          {activeTab === "topics" && (
            <>
              {/* Search Mode */}
              {isSearchMode ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                      {isSearching
                        ? "Searching..."
                        : `Search Results for "${searchQuery}" (${searchResults.length} found)`}
                    </h2>
                  </div>

                  {isSearching ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <TopicCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      {searchResults.map((topic) => (
                        <TopicCard
                          key={topic.id}
                          id={topic.id}
                          title={topic.title}
                          description={topic.description}
                          level={topic.level}
                          wordCount={topic.wordCount}
                          progress={topic.progress}
                          href={`/vocab/${topic.id}`}
                          onNotYet={() => {}}
                          type="vocabulary"
                          isBookmarked={bookmarkedTopics.includes(topic.id)}
                          onBookmarkToggle={handleBookmarkToggle}
                          thumbnail={topic.thumbnail}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 rounded-3xl border-[1.4px] border-primary-200 text-center">
                      <Search className="h-16 w-16 text-primary-200 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        No Results Found
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Try adjusting your search terms or browse topics by
                        category.
                      </p>
                      <Button
                        variant="default"
                        onClick={() => setSearchQuery("")}
                        className="cursor-pointer"
                      >
                        Clear Search
                      </Button>
                    </Card>
                  )}
                </div>
              ) : (
                /* Normal Mode */
                <div className="grid lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-1 space-y-6">
                    <TopicGroupsSidebar
                      groups={topicGroups}
                      selectedGroup={selectedGroup}
                      onGroupChange={handleGroupChange}
                      showViewMore={false}
                      isLoading={topicGroupsLoading}
                    />
                    <LevelsSidebar
                      selectedLevels={selectedLevels}
                      onLevelToggle={toggleLevel}
                    />
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                    <SubcategoryPills
                      subcategories={currentSubcategories}
                      selectedSubcategory={selectedSubcategory}
                      onSubcategoryChange={handleSubcategoryChange}
                      isLoading={topicGroupsLoading}
                    />

                    {topicsLoading ? (
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <TopicCardSkeleton key={i} />
                        ))}
                      </div>
                    ) : displayTopics.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {displayTopics.map((topic) => (
                            <TopicCard
                              key={topic.id}
                              id={topic.id}
                              title={topic.title}
                              description={topic.description}
                              level={topic.level}
                              wordCount={topic.wordCount}
                              progress={topic.progress}
                              href={`/vocab/${topic.id}`}
                              onNotYet={() => {}}
                              type="vocabulary"
                              isBookmarked={bookmarkedTopics.includes(topic.id)}
                              onBookmarkToggle={handleBookmarkToggle}
                              thumbnail={topic.thumbnail}
                            />
                          ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-center gap-2 mt-8">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 w-9 p-0 cursor-pointer"
                              onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                              }
                              disabled={currentPage === 1}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>

                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1
                            ).map((page) => {
                              const showPage =
                                page === 1 ||
                                page === totalPages ||
                                Math.abs(page - currentPage) <= 1;

                              const showEllipsis =
                                (page === 2 && currentPage > 3) ||
                                (page === totalPages - 1 &&
                                  currentPage < totalPages - 2);

                              if (showEllipsis) {
                                return (
                                  <span
                                    key={page}
                                    className="px-2 text-muted-foreground"
                                  >
                                    ...
                                  </span>
                                );
                              }

                              if (!showPage) return null;

                              return (
                                <Button
                                  key={page}
                                  variant={
                                    currentPage === page ? "default" : "outline"
                                  }
                                  size="sm"
                                  className="h-9 w-9 p-0 cursor-pointer"
                                  onClick={() => setCurrentPage(page)}
                                >
                                  {page}
                                </Button>
                              );
                            })}

                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 w-9 p-0 cursor-pointer"
                              onClick={() =>
                                setCurrentPage((p) =>
                                  Math.min(totalPages, p + 1)
                                )
                              }
                              disabled={currentPage === totalPages}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>

                            <span className="ml-4 text-sm text-muted-foreground">
                              {totalTopics} topics
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <Card className="p-12 rounded-3xl border-[1.4px] border-primary-200 text-center">
                        <Search className="h-16 w-16 text-primary-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          No Topics Found
                        </h3>
                        <p className="text-muted-foreground">
                          No vocabulary topics match your current filters. Try
                          selecting different levels or categories.
                        </p>
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "bookmarks" && (
            <div className="space-y-6">
              {bookmarkedTopicsList.length > 0 ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <Bookmark className="h-6 w-6 text-primary-500 fill-primary-500" />
                    <h2 className="text-xl font-bold text-foreground">
                      Your Bookmarked Topics ({bookmarkedTopicsList.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {bookmarkedTopicsList.map((topic) => (
                      <TopicCard
                        key={topic.id}
                        id={topic.id}
                        title={topic.title}
                        description={topic.description}
                        level={topic.level}
                        wordCount={topic.wordCount}
                        progress={topic.progress}
                        href={`/vocab/${topic.id}`}
                        onNotYet={() => {}}
                        type="vocabulary"
                        isBookmarked={true}
                        onBookmarkToggle={handleBookmarkToggle}
                        thumbnail={topic.thumbnail}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <Card className="p-12 rounded-3xl border-[1.4px] border-primary-200 text-center bg-white">
                  <Bookmark className="h-16 w-16 text-primary-200 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    No Bookmarks Yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Click the bookmark icon on any topic card to save it here
                    for quick access.
                  </p>
                  <Button
                    variant="default"
                    onClick={() => setActiveTab("topics")}
                    className="cursor-pointer"
                  >
                    Browse Topics
                  </Button>
                </Card>
              )}
            </div>
          )}

          {activeTab === "mindmap" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Network className="h-6 w-6 text-primary-500" />
                <h2 className="text-xl font-bold text-foreground">
                  Vocabulary Mindmap
                </h2>
                <span className="text-sm text-muted-foreground">
                  Explore words organized by topic groups
                </span>
              </div>
              <VocabMindmap topicGroups={MOCK_MINDMAP_DATA} />
            </div>
          )}

          {activeTab === "dictionary" && (
            <Card className="p-8 rounded-3xl border-2 border-primary-100 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Dictionary</h3>
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Search words..."
                    className="w-64"
                    value={dictionarySearch}
                    onChange={(e) => setDictionarySearch(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap gap-1">
                  <Button
                    variant={selectedAlphabet === null ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-10 text-xs font-semibold cursor-pointer"
                    onClick={() => setSelectedAlphabet(null)}
                  >
                    All
                  </Button>
                  {alphabet.map((letter) => (
                    <Button
                      key={letter}
                      variant={
                        selectedAlphabet === letter ? "default" : "outline"
                      }
                      size="sm"
                      className="h-8 w-8 text-xs font-semibold cursor-pointer"
                      onClick={() => setSelectedAlphabet(letter)}
                    >
                      {letter}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-6 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Level:
                  </span>
                  {dictLevels.map((level) => (
                    <Button
                      key={level}
                      variant={
                        selectedDictLevels.includes(level)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className="h-8 px-3 text-xs font-semibold cursor-pointer"
                      onClick={() => toggleDictLevel(level)}
                    >
                      {level}
                    </Button>
                  ))}
                  {selectedDictLevels.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-muted-foreground cursor-pointer"
                      onClick={() => setSelectedDictLevels([])}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              <div className="mb-4 text-sm text-muted-foreground">
                Showing {paginatedWords.length} of{" "}
                {filteredDictionaryWords.length} words
                {selectedAlphabet && ` starting with "${selectedAlphabet}"`}
                {selectedDictLevels.length > 0 &&
                  ` at level ${selectedDictLevels.join(", ")}`}
              </div>

              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-bold">Word</TableHead>
                      <TableHead className="font-bold">Pronunciation</TableHead>
                      <TableHead className="font-bold">Meaning</TableHead>
                      <TableHead className="font-bold">Type</TableHead>
                      <TableHead className="font-bold">Level</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedWords.length > 0 ? (
                      paginatedWords.map((word) => (
                        <TableRow
                          key={word.id}
                          className="hover:bg-primary-50/50 transition-colors"
                        >
                          <TableCell className="font-semibold text-primary-600">
                            {word.word}
                          </TableCell>
                          <TableCell className="text-slate-500 font-mono text-sm">
                            {word.pronunciation}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {word.meaning}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {word.partOfSpeech}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-primary-100 text-primary-700 text-xs">
                              {word.level}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No words found matching your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {dictTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0 cursor-pointer bg-transparent"
                    onClick={() => setDictPage((p) => Math.max(1, p - 1))}
                    disabled={dictPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: dictTotalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={dictPage === page ? "default" : "outline"}
                        size="sm"
                        className="h-9 w-9 p-0 cursor-pointer"
                        onClick={() => setDictPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0 cursor-pointer bg-transparent"
                    onClick={() =>
                      setDictPage((p) => Math.min(dictTotalPages, p + 1))
                    }
                    disabled={dictPage === dictTotalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
