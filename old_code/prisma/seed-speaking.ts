/**
 * Speaking Room Full Data Seed - 24 Scenarios
 * 
 * Tạo đầy đủ 24 speaking scenarios theo 6 categories
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const scenarios = [
  // DAILY LIFE (4)
  {
    title: 'Ordering Specialty Coffee and Snacks at a Busy Café',
    description: 'Master the art of navigating a complex café menu, customizing your beverage orders to your specific taste, and handling payment transactions smoothly.',
    category: 'Daily Life',
    subcategory: 'Dining',
    difficulty: 'A2',
    goal: 'Order confidently at cafés',
    context: 'You are standing at the counter of a popular coffee shop with a long line behind you',
    objectives: [
      'Greet the barista politely and inquire about the daily specials',
      'Place a complex drink order with specific customizations',
      'Ask detailed questions about dairy-free or allergy-friendly food options',
      'Confirm the total amount and complete the payment process via card or cash'
    ],
    keyExpressions: [
      { en: "I was wondering if I could order a large cappuccino with oat milk and a pump of vanilla syrup, please.", vi: 'Tôi tự hỏi liệu tôi có thể gọi một ly cappuccino cỡ lớn với sữa yến mạch và thêm một chút siro vani không.' },
      { en: 'Could you please let me know if you have any gluten-free or dairy-free pastry options available today?', vi: 'Bạn có thể cho tôi biết liệu hôm nay bạn có loại bánh ngọt nào không chứa gluten hoặc không chứa sữa không?' }
    ]
  },
  {
    title: 'Browsing for Fashion and Interacting with Store Staff',
    description: 'Learn how to effectively communicate with retail assistants regarding clothing fit, fabric materials, and available inventory stocks while shopping.',
    category: 'Daily Life',
    subcategory: 'Shopping',
    difficulty: 'A2',
    goal: 'Master retail vocabulary',
    context: 'You are inside a large department store looking for a specific outfit',
    objectives: [
      'Politely ask the staff to check for specific sizes in the inventory',
      'Inquire about available color variations for a specific item',
      'Request permission to use the fitting room to try on multiple garments',
      'Proceed to the checkout counter and inquire about return policies'
    ],
    keyExpressions: [
      { en: 'I really like this design, but do you happen to have this particular shirt available in a medium size?', vi: 'Tôi rất thích thiết kế này, nhưng bạn có tình cờ còn chiếc áo này ở size trung bình không?' },
      { en: 'Would it be possible for me to take these items to the fitting room to see how they fit?', vi: 'Liệu tôi có thể mang những món đồ này vào phòng thử đồ để xem chúng có vừa không?' }
    ]
  },
  {
    title: 'Describing Medical Symptoms and Discussing Treatment',
    description: 'Develop the vocabulary needed to clearly explain your health condition to a professional and understand the medical advice or prescriptions given.',
    category: 'Daily Life',
    subcategory: 'Healthcare',
    difficulty: 'A2',
    goal: 'Communicate health issues',
    context: 'You are sitting in the examination room at a doctor\'s clinic',
    objectives: [
      'Describe the duration and severity of your specific symptoms',
      'Answer the doctor\'s inquiries regarding your medical history',
      'Comprehend the doctor\'s advice regarding rest and diet',
      'Ask for detailed instructions on how and when to take the prescribed medication'
    ],
    keyExpressions: [
      { en: 'For the past few days, I have been experiencing a persistent headache accompanied by a high fever.', vi: 'Trong vài ngày qua, tôi đã bị đau đầu dai dẳng kèm theo sốt cao.' },
      { en: 'Could you please clarify how often I should take this medication and if it should be taken with food?', vi: 'Bác sĩ có thể làm rõ tôi nên uống thuốc này bao lâu một lần và có cần uống kèm với thức ăn không?' }
    ]
  },
  {
    title: 'Hailing a Taxi and Giving Specific Route Directions',
    description: 'Practice the essential phrases needed to secure transportation, communicate your exact destination, and handle fare negotiations with the driver.',
    category: 'Daily Life',
    subcategory: 'Transportation',
    difficulty: 'A1',
    goal: 'Navigate transportation',
    context: 'You have just entered a taxi and need to go to a specific location',
    objectives: [
      'Clearly state your intended destination to the driver',
      'Inquire about the estimated fare or the usage of the taximeter',
      'Engage in polite small talk about the traffic or city route',
      'Pay the final fare and ask for a receipt if necessary'
    ],
    keyExpressions: [
      { en: 'Could you please take me directly to the international terminal at the airport as quickly as possible?', vi: 'Bạn có thể vui lòng đưa tôi trực tiếp đến ga quốc tế tại sân bay nhanh nhất có thể không?' },
      { en: 'Do you have an idea of roughly how much the total fare will cost to get to the city center?', vi: 'Bạn có ước lượng được khoảng bao nhiêu tiền cước để đi đến trung tâm thành phố không?' }
    ]
  },

  // PROFESSIONAL ENGLISH (4)
  {
    title: 'Participating in Strategy Meetings and Brainstorming',
    description: 'Enhance your ability to contribute valuable ideas, ask for clarifications, and professionally express agreement or disagreement in a corporate setting.',
    category: 'Professional English',
    subcategory: 'Meetings',
    difficulty: 'B2',
    goal: 'Contribute effectively in meetings',
    context: 'You are seated at a conference table with your project team',
    objectives: [
      'Present your progress updates clearly to the rest of the team',
      'Ask insightful questions to understand the proposed strategies',
      'Express your professional opinion on the matters being discussed',
      'Politely disagree with a colleague while maintaining a constructive tone'
    ],
    keyExpressions: [
      { en: 'If I may interject for a moment, I would like to add an important point regarding the timeline.', vi: 'Nếu tôi có thể xen vào một chút, tôi muốn bổ sung một điểm quan trọng về mốc thời gian.' },
      { en: 'I am not sure I fully understood that last part; could you please clarify the main objective?', vi: 'Tôi không chắc mình đã hiểu hết phần vừa rồi; bạn có thể vui lòng làm rõ mục tiêu chính được không?' }
    ]
  },
  {
    title: 'Delivering a Compelling Product Demonstration to Clients',
    description: 'Learn the advanced language required to showcase a product\'s value proposition, highlight unique selling points, and persuade potential investors or clients.',
    category: 'Professional English',
    subcategory: 'Presentations',
    difficulty: 'C1',
    goal: 'Deliver persuasive presentations',
    context: 'You are standing in front of a screen presenting to a group of potential clients',
    objectives: [
      'Introduce the product with a captivating opening statement',
      'Highlight the innovative features that distinguish your product',
      'Professionally handle difficult questions from the audience',
      'Conclude the presentation with a strong call to action'
    ],
    keyExpressions: [
      { en: 'Allow me to demonstrate the key features that make this solution unique in the current market.', vi: 'Cho phép tôi trình bày các tính năng chính khiến giải pháp này trở nên độc đáo trên thị trường hiện nay.' },
      { en: 'Implementing this system will significantly improve your operational efficiency by more than thirty percent.', vi: 'Việc triển khai hệ thống này sẽ cải thiện đáng kể hiệu quả hoạt động của bạn hơn ba mươi phần trăm.' }
    ]
  },
  {
    title: 'Navigating a Competency-Based Job Interview',
    description: 'Prepare to answer complex behavioral questions, discuss your professional track record in detail, and advocate for your suitability for the role.',
    category: 'Professional English',
    subcategory: 'Interviews',
    difficulty: 'B1',
    goal: 'Succeed in job interviews',
    context: 'You are sitting across from a hiring manager in a formal interview',
    objectives: [
      'Introduce yourself professionally highlighting key achievements',
      'Discuss your previous work experience and relevant skills',
      'Answer behavioral questions using the STAR method effectively',
      'Ask thoughtful questions about the company culture and role'
    ],
    keyExpressions: [
      { en: 'I have over three years of hands-on experience in project management within the technology sector.', vi: 'Tôi có hơn ba năm kinh nghiệm thực tế trong quản lý dự án thuộc lĩnh vực công nghệ.' },
      { en: 'Could you please elaborate on what the potential growth opportunities are for someone in this position?', vi: 'Bạn có thể nói rõ hơn về những cơ hội phát triển tiềm năng cho vị trí này là gì không?' }
    ]
  },
  {
    title: 'Negotiating Compensation Packages and Benefits',
    description: 'Acquire the diplomatic language necessary to discuss salary expectations, justify your worth, and reach a mutually beneficial employment agreement.',
    category: 'Professional English',
    subcategory: 'Negotiations',
    difficulty: 'C1',
    goal: 'Negotiate effectively',
    context: 'You are in a private meeting discussing the terms of your employment offer',
    objectives: [
      'Clearly state your salary expectations based on market research',
      'Justify your request by referencing your skills and experience',
      'Handle counter-offers or objections with professional composure',
      'Reach a final agreement that satisfies both parties involved'
    ],
    keyExpressions: [
      { en: 'Based on my extensive experience and current market rates, I was expecting a salary in the range of...', vi: 'Dựa trên kinh nghiệm dày dặn của tôi và mức giá thị trường hiện tại, tôi đã mong đợi mức lương trong khoảng...' },
      { en: 'I am very interested in this role, but is there any flexibility regarding the base salary or sign-on bonus?', vi: 'Tôi rất quan tâm đến vai trò này, nhưng liệu có sự linh hoạt nào về mức lương cơ bản hoặc tiền thưởng khi ký hợp đồng không?' }
    ]
  },

  // ACADEMIC (4)
  {
    title: 'Seeking Clarification and Engaging in Lecture Discussions',
    description: 'Learn how to actively participate in university lectures by asking intelligent questions, requesting examples, and verifying your understanding of complex topics.',
    category: 'Academic',
    subcategory: 'Lectures',
    difficulty: 'B1',
    goal: 'Engage in academic discussions',
    context: 'You are sitting in a university lecture hall listening to a professor',
    objectives: [
      'Ask the professor to clarify a complex concept or theory',
      'Request concrete examples to better understand abstract ideas',
      'Politely challenge or question an idea presented in the lecture',
      'Summarize your understanding to confirm accuracy with the lecturer'
    ],
    keyExpressions: [
      { en: 'I apologize for the interruption, but could you please explain that specific concept once more?', vi: 'Tôi xin lỗi vì đã ngắt lời, nhưng thầy/cô có thể vui lòng giải thích lại khái niệm cụ thể đó một lần nữa không?' },
      { en: 'Would it be possible for you to provide a real-world example to illustrate this theoretical point?', vi: 'Liệu thầy/cô có thể cung cấp một ví dụ thực tế để minh họa cho điểm lý thuyết này không?' }
    ]
  },
  {
    title: 'Collaborating on Group Projects and Resolving Conflicts',
    description: 'Practice the language needed for effective teamwork, including sharing ideas, building upon the contributions of others, and managing disagreements constructively.',
    category: 'Academic',
    subcategory: 'Discussions',
    difficulty: 'B1',
    goal: 'Work effectively in groups',
    context: 'You are sitting in a library discussion room with your study group',
    objectives: [
      'Share your initial ideas and proposals with the group members',
      'Build upon points made by others to develop a stronger argument',
      'Resolve disagreements diplomatically to keep the project moving',
      'Reach a consensus on the final direction of the assignment'
    ],
    keyExpressions: [
      { en: 'I completely agree with your point about the methodology, and I think we should expand on it further.', vi: 'Tôi hoàn toàn đồng ý với quan điểm của bạn về phương pháp luận, và tôi nghĩ chúng ta nên mở rộng nó thêm.' },
      { en: 'Have we considered the possibility that the data might be interpreted in a completely different way?', vi: 'Chúng ta đã xem xét khả năng dữ liệu có thể được diễn giải theo một cách hoàn toàn khác chưa?' }
    ]
  },
  {
    title: 'Presenting Quantitative Research Findings to an Audience',
    description: 'Master the formal academic language required to introduce research topics, explain methodologies, present data analysis, and discuss the implications of your results.',
    category: 'Academic',
    subcategory: 'Research',
    difficulty: 'C1',
    goal: 'Present research professionally',
    context: 'You are standing at a podium presenting your research findings',
    objectives: [
      'Introduce the research topic and the significance of the study',
      'Explain the methodology used to collect and analyze the data',
      'Present the key findings clearly using charts or visual aids',
      'Discuss the broader implications and limitations of the research'
    ],
    keyExpressions: [
      { en: 'Our comprehensive research indicates a strong correlation between these two distinct variables.', vi: 'Nghiên cứu toàn diện của chúng tôi chỉ ra một mối tương quan mạnh mẽ giữa hai biến số riêng biệt này.' },
      { en: 'The data collected from the survey suggests that there is a significant shift in consumer behavior.', vi: 'Dữ liệu thu thập được từ cuộc khảo sát cho thấy có một sự thay đổi đáng kể trong hành vi người tiêu dùng.' }
    ]
  },
  {
    title: 'Defending the Thesis Methodology and Conclusions',
    description: 'Prepare for the rigorous process of a thesis defense by learning how to articulate your arguments, justify your methods, and respond to critical academic inquiry.',
    category: 'Academic',
    subcategory: 'Presentations',
    difficulty: 'C2',
    goal: 'Successfully defend thesis',
    context: 'You are standing before a panel of professors defending your thesis',
    objectives: [
      'Present the core argument and contributions of your thesis',
      'Answer probing questions from the committee members confidently',
      'Defend the choice of methodology against potential criticisms',
      'Address limitations and suggest directions for future research'
    ],
    keyExpressions: [
      { en: 'My thesis primarily argues that the current theoretical framework is insufficient to explain this phenomenon.', vi: 'Luận án của tôi chủ yếu lập luận rằng khung lý thuyết hiện tại không đủ để giải thích hiện tượng này.' },
      { en: 'That is an excellent question, and I believe the answer lies in the secondary data analysis we conducted.', vi: 'Đó là một câu hỏi xuất sắc, và tôi tin rằng câu trả lời nằm ở phần phân tích dữ liệu thứ cấp mà chúng tôi đã thực hiện.' }
    ]
  },

  // BUSINESS (4)
  {
    title: 'Conducting a Consultative Sales Call with a Client',
    description: 'Develop the skills to build rapport over the phone, identify client pain points, present tailored solutions, and overcome resistance to close the deal.',
    category: 'Business',
    subcategory: 'Sales',
    difficulty: 'B2',
    goal: 'Close sales effectively',
    context: 'You are on a phone call with a potential enterprise client',
    objectives: [
      'Build immediate rapport and set a positive tone for the call',
      'Identify the specific needs and challenges the client is facing',
      'Present a solution that directly addresses the client\'s problems',
      'Handle objections regarding price or implementation effectively'
    ],
    keyExpressions: [
      { en: 'How can I help you today, and what are the main challenges your team is currently facing?', vi: 'Tôi có thể giúp gì cho bạn hôm nay, và những thách thức chính mà nhóm của bạn đang phải đối mặt là gì?' },
      { en: 'I believe this specific solution perfectly addresses your need for a more streamlined workflow process.', vi: 'Tôi tin rằng giải pháp cụ thể này giải quyết hoàn hảo nhu cầu của bạn về một quy trình làm việc hợp lý hơn.' }
    ]
  },
  {
    title: 'Proposing a Comprehensive Marketing Strategy to Stakeholders',
    description: 'Learn to pitch creative marketing campaigns by outlining target demographics, projecting return on investment (ROI), and addressing stakeholder concerns.',
    category: 'Business',
    subcategory: 'Marketing',
    difficulty: 'B2',
    goal: 'Pitch campaigns convincingly',
    context: 'You are in a boardroom presenting to the marketing director and stakeholders',
    objectives: [
      'Present the overall strategy and the target audience demographics',
      'Demonstrate the projected Return on Investment (ROI) for the campaign',
      'Address any concerns regarding budget or brand alignment',
      'Secure final approval to proceed with the campaign launch'
    ],
    keyExpressions: [
      { en: 'Our proposed campaign specifically targets the millennial demographic through social media channels.', vi: 'Chiến dịch đề xuất của chúng tôi nhắm mục tiêu cụ thể đến nhân khẩu học thế hệ thiên niên kỷ thông qua các kênh truyền thông xã hội.' },
      { en: 'Based on our projections, we expect a twenty percent increase in user engagement within the first quarter.', vi: 'Dựa trên dự báo của chúng tôi, chúng tôi kỳ vọng mức độ tương tác của người dùng sẽ tăng hai mươi phần trăm trong quý đầu tiên.' }
    ]
  },
  {
    title: 'Analyzing Financial Reports and Negotiating Budget Allocations',
    description: 'Navigate complex financial discussions involving budget planning, expense justification, cost-cutting negotiations, and strategic investment decisions.',
    category: 'Business',
    subcategory: 'Finance',
    difficulty: 'B2',
    goal: 'Manage budget discussions',
    context: 'You are in a quarterly budget review meeting with department heads',
    objectives: [
      'Present the proposed budget plan for the upcoming fiscal year',
      'Justify the necessity of specific operational expenses',
      'Negotiate cuts in other areas to balance the overall budget',
      'Reach an agreement on the final financial distribution'
    ],
    keyExpressions: [
      { en: 'We urgently need to allocate additional funds for the R&D department to maintain our competitive edge.', vi: 'Chúng ta cần khẩn cấp phân bổ thêm vốn cho bộ phận R&D để duy trì lợi thế cạnh tranh của mình.' },
      { en: 'Although the initial cost is high, this investment will pay off significantly in the long run through efficiency.', vi: 'Mặc dù chi phí ban đầu cao, khoản đầu tư này sẽ mang lại lợi nhuận đáng kể về lâu dài thông qua hiệu quả.' }
    ]
  },
  {
    title: 'Facilitating Team Building Workshops and Activities',
    description: 'Learn how to lead group activities that foster team cohesion, encourage participation from all members, and debrief on the lessons learned from the exercises.',
    category: 'Business',
    subcategory: 'Management',
    difficulty: 'B1',
    goal: 'Build team cohesion',
    context: 'You are standing in front of your team leading a workshop',
    objectives: [
      'Introduce the team-building activities and explain the rules clearly',
      'Encourage active participation from quieter team members',
      'Facilitate a group discussion about the outcome of the activity',
      'Summarize the key learnings and how they apply to work'
    ],
    keyExpressions: [
      { en: 'Let\'s start the session with a fun icebreaker activity to help everyone get to know each other better.', vi: 'Hãy bắt đầu buổi học với một hoạt động làm quen thú vị để giúp mọi người hiểu nhau hơn.' },
      { en: 'What valuable insights did you learn from this exercise regarding communication and teamwork?', vi: 'Bạn đã học được những hiểu biết giá trị nào từ bài tập này liên quan đến giao tiếp và làm việc nhóm?' }
    ]
  },

  // TRAVEL (4)
  {
    title: 'Managing Hotel Check-in Procedures and Inquiries',
    description: 'Master the dialogue for a smooth hotel experience, including verifying reservations, asking about facilities, resolving room issues, and understanding policies.',
    category: 'Travel',
    subcategory: 'Hotels',
    difficulty: 'A2',
    goal: 'Handle hotel procedures',
    context: 'You are standing at the reception desk of a hotel with your luggage',
    objectives: [
      'Provide your booking confirmation details to the receptionist',
      'Ask detailed questions about hotel amenities like the pool or gym',
      'Request a room change if the current one does not meet expectations',
      'Receive the room key and ask for directions to the elevators'
    ],
    keyExpressions: [
      { en: 'Good afternoon, I have a reservation for a deluxe room under the name of Smith for three nights.', vi: 'Chào buổi chiều, tôi có đặt trước một phòng hạng sang dưới tên Smith trong ba đêm.' },
      { en: 'Could you please tell me what time breakfast is served and where the dining hall is located?', vi: 'Bạn có thể vui lòng cho tôi biết bữa sáng được phục vụ lúc mấy giờ và phòng ăn nằm ở đâu không?' }
    ]
  },
  {
    title: 'Navigating International Airport Check-in Protocols',
    description: 'Learn the essential vocabulary for air travel, from presenting identification and checking luggage to selecting seats and obtaining your boarding pass.',
    category: 'Travel',
    subcategory: 'Airports',
    difficulty: 'A2',
    goal: 'Check in for flights',
    context: 'You are at the airline counter at the airport preparing to fly',
    objectives: [
      'Present your passport and travel documents to the agent',
      'Check in your luggage and inquire about weight limits',
      'Request a specific seating preference such as window or aisle',
      'Receive your boarding pass and ask for gate information'
    ],
    keyExpressions: [
      { en: 'I would prefer a window seat near the front of the plane if one is still available, please.', vi: 'Tôi muốn một chỗ ngồi cạnh cửa sổ gần phía trước máy bay nếu vẫn còn chỗ, làm ơn.' },
      { en: 'Could you tell me how many bags I am allowed to check in and what the weight limit is?', vi: 'Bạn có thể cho tôi biết tôi được phép ký gửi bao nhiêu túi và giới hạn trọng lượng là bao nhiêu không?' }
    ]
  },
  {
    title: 'Purchasing Admission Tickets for Tourist Attractions',
    description: 'Practice the interactions needed to buy entry tickets for museums or sites, including asking about prices, categories, student discounts, and payment methods.',
    category: 'Travel',
    subcategory: 'Tourist Sites',
    difficulty: 'A1',
    goal: 'Buy tickets confidently',
    context: 'You are standing at the ticket booth of a famous museum',
    objectives: [
      'Ask about the ticket prices for adults and children',
      'Request a specific number of tickets for your group',
      'Inquire if there are any discounts for students or seniors',
      'Complete the payment transaction and receive your tickets'
    ],
    keyExpressions: [
      { en: 'I would like to purchase two adult tickets and one child ticket for the exhibition, please.', vi: 'Tôi muốn mua hai vé người lớn và một vé trẻ em cho buổi triển lãm, làm ơn.' },
      { en: 'Do you happen to offer any special discounts for university students with valid identification?', vi: 'Bạn có tình cờ cung cấp bất kỳ giảm giá đặc biệt nào cho sinh viên đại học có thẻ căn cước hợp lệ không?' }
    ]
  },
  {
    title: 'Reporting and Tracking Delayed or Lost Luggage',
    description: 'Learn how to handle the stressful situation of lost baggage by describing your items in detail, filling out official forms, and arranging for delivery.',
    category: 'Travel',
    subcategory: 'Emergency',
    difficulty: 'B1',
    goal: 'Handle travel emergencies',
    context: 'You are at the lost and found desk in the baggage claim area',
    objectives: [
      'Explain clearly that your luggage did not arrive on the carousel',
      'Fill out the property irregularity form with your details',
      'Obtain a tracking number to monitor the status of your bag',
      'Arrange for the luggage to be delivered to your hotel address'
    ],
    keyExpressions: [
      { en: 'I waited at the carousel, but unfortunately, my checked luggage did not arrive with my flight.', vi: 'Tôi đã đợi ở băng chuyền, nhưng thật không may, hành lý ký gửi của tôi đã không đến cùng chuyến bay.' },
      { en: 'It is a large black hard-shell suitcase with a red ribbon tied to the handle for identification.', vi: 'Đó là một chiếc vali vỏ cứng màu đen lớn có buộc một dải ruy băng đỏ ở tay cầm để nhận diện.' }
    ]
  },

  // SOCIAL SITUATIONS (4)
  {
    title: 'Socializing and Networking at a Birthday Celebration',
    description: 'Enhance your social skills by learning how to greet hosts warmly, engage in light conversation with strangers, offer compliments, and exit gracefully.',
    category: 'Social Situations',
    subcategory: 'Parties',
    difficulty: 'A2',
    goal: 'Enjoy social gatherings',
    context: 'You are at a lively birthday party filled with friends and new faces',
    objectives: [
      'Greet the host enthusiastically and thank them for the invitation',
      'Make small talk with other guests you haven\'t met before',
      'Give sincere compliments about the party, food, or decorations',
      'Say a polite goodbye to the host before leaving the event'
    ],
    keyExpressions: [
      { en: 'Happy birthday! Thank you so much for inviting me to join this wonderful celebration tonight.', vi: 'Chúc mừng sinh nhật! Cảm ơn bạn rất nhiều vì đã mời tôi tham gia buổi lễ tuyệt vời tối nay.' },
      { en: 'The party is absolutely wonderful, and the decorations you chose look incredibly beautiful!', vi: 'Bữa tiệc thực sự tuyệt vời, và những đồ trang trí bạn chọn trông vô cùng đẹp mắt!' }
    ]
  },
  {
    title: 'Engaging in Casual Conversation about Weather and Plans',
    description: 'Master the art of small talk to break the silence, discussing universal topics like the weather or weekend activities to keep conversations flowing naturally.',
    category: 'Social Situations',
    subcategory: 'Small Talk',
    difficulty: 'A1',
    goal: 'Start conversations easily',
    context: 'You are standing next to a colleague waiting for the elevator',
    objectives: [
      'Make a casual comment on the current weather conditions',
      'Ask polite questions about the other person\'s weekend plans',
      'Share a brief personal experience related to the topic',
      'Use transition phrases to keep the conversation going smoothly'
    ],
    keyExpressions: [
      { en: 'It is such nice weather today, don\'t you think it\'s perfect for spending time outdoors?', vi: 'Thời tiết hôm nay đẹp quá, bạn có nghĩ là rất hoàn hảo để dành thời gian ở ngoài trời không?' },
      { en: 'Do you have any exciting plans for the upcoming weekend, or will you just be relaxing at home?', vi: 'Bạn có kế hoạch thú vị nào cho cuối tuần sắp tới không, hay bạn sẽ chỉ thư giãn ở nhà?' }
    ]
  },
  {
    title: 'Making a Memorable First Impression on New Acquaintances',
    description: 'Learn the standard etiquette for self-introduction, sharing personal background information, showing interest in others, and exchanging contact details.',
    category: 'Social Situations',
    subcategory: 'Making Friends',
    difficulty: 'A1',
    goal: 'Introduce yourself confidently',
    context: 'You are at a networking event meeting someone for the first time',
    objectives: [
      'State your name clearly and express pleasure in meeting them',
      'Share a brief background about your work or origin',
      'Ask open-ended questions to learn more about the other person',
      'Exchange phone numbers or social media handles for future contact'
    ],
    keyExpressions: [
      { en: 'Hi there, my name is John, and it is a real pleasure to finally meet you in person.', vi: 'Xin chào, tên tôi là John, và thật vinh hạnh khi cuối cùng cũng được gặp bạn trực tiếp.' },
      { en: 'That sounds fascinating; what exactly do you do in your role at the technology company?', vi: 'Nghe có vẻ hấp dẫn đấy; chính xác thì bạn làm gì trong vai trò của mình tại công ty công nghệ?' }
    ]
  },
  {
    title: 'Conversing and Building Rapport during a First Date',
    description: 'Navigate the delicate conversations of a first date by learning how to break the ice, discover shared interests, express enjoyment, and propose future meetings.',
    category: 'Social Situations',
    subcategory: 'Dating',
    difficulty: 'B1',
    goal: 'Have enjoyable first dates',
    context: 'You are sitting at a nice restaurant having dinner on a first date',
    objectives: [
      'Break the ice with light-hearted questions to reduce nervousness',
      'Find common interests or hobbies to deepen the connection',
      'Show genuine interest in listening to their stories and opinions',
      'Suggest meeting again if the date has gone well'
    ],
    keyExpressions: [
      { en: 'So, I would love to hear more about your hobbies; tell me a little bit about yourself.', vi: 'Vậy, tôi rất muốn nghe thêm về sở thích của bạn; hãy kể cho tôi nghe một chút về bản thân bạn đi.' },
      { en: 'I really enjoyed our time tonight and the conversation was great; I would love to see you again.', vi: 'Tôi thực sự thích thời gian tối nay và cuộc trò chuyện rất tuyệt; tôi rất muốn gặp lại bạn.' }
    ]
  },
]

async function main() {
  console.log('🎤 Seeding 24 Speaking Scenarios...\n')

  let count = 0
  for (const s of scenarios) {
    await prisma.speakingScenario.create({
      data: {
        title: s.title,
        description: s.description,
        category: s.category,
        subcategory: s.subcategory,
        difficulty: s.difficulty as any,
        goal: s.goal,
        context: s.context,
        objectives: JSON.stringify(s.objectives),
        keyExpressions: JSON.stringify(s.keyExpressions),
        duration: 15,
      },
    })
    count++
    console.log(`✅ ${count}/24 - ${s.title}`)
  }

  console.log('\n🎉 All 24 scenarios created!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
