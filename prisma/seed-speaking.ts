/**
 * Speaking Room Full Data Seed - 24 Scenarios
 * 
 * Tạo đầy đủ 24 speaking scenarios theo 6 categories
 */

import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

const scenarios = [
  // DAILY LIFE (4)
  { title: 'Ordering at a Café', description: 'Practice ordering coffee and food', category: 'Daily Life', subcategory: 'Dining', level: 'A2', goal: 'Order confidently at cafés', context: 'You are at a café counter', objectives: ['Greet barista', 'Order drinks', 'Ask about options', 'Make payment'], keyExpressions: [{en: "I'd like a cappuccino, please.", vi: 'Tôi muốn một ly cappuccino.'}, {en: 'Do you have dairy-free options?', vi: 'Bạn có lựa chọn không sữa không?'}] },
  { title: 'Shopping for Clothes', description: 'Navigate a clothing store', category: 'Daily Life', subcategory: 'Shopping', level: 'A2', goal: 'Master retail vocabulary', context: 'You are in a clothing store', objectives: ['Ask for sizes', 'Inquire about colors', 'Try on clothes', 'Make purchase'], keyExpressions: [{en: 'Do you have this in medium?', vi: 'Bạn có size M không?'}, {en: 'Can I try this on?', vi: 'Tôi thử được không?'}] },
  { title: 'Visiting the Doctor', description: 'Describe symptoms and get medical advice', category: 'Daily Life', subcategory: 'Healthcare', level: 'A2', goal: 'Communicate health issues', context: 'You are at a doctor\'s office', objectives: ['Describe symptoms', 'Answer questions', 'Understand advice', 'Ask about medication'], keyExpressions: [{en: 'I have a headache and fever.', vi: 'Tôi bị đau đầu và sốt.'}, {en: 'How often should I take this?', vi: 'Tôi nên uống bao lâu một lần?'}] },
  { title: 'Taking a Taxi', description: 'Give directions and communicate with driver', category: 'Daily Life', subcategory: 'Transportation', level: 'A1', goal: 'Navigate transportation', context: 'You are in a taxi', objectives: ['Give destination', 'Ask about fare', 'Make small talk', 'Pay driver'], keyExpressions: [{en: 'Please take me to the airport.', vi: 'Làm ơn đưa tôi đến sân bay.'}, {en: 'How much will it cost?', vi: 'Giá bao nhiêu?'}] },
  
  // PROFESSIONAL ENGLISH (4)
  { title: 'Team Meeting', description: 'Participate in professional discussions', category: 'Professional English', subcategory: 'Meetings', level: 'B2', goal: 'Contribute effectively in meetings', context: 'You are in a team meeting', objectives: ['Present updates', 'Ask questions', 'Give opinions', 'Agree/disagree politely'], keyExpressions: [{en: 'I\'d like to add something.', vi: 'Tôi muốn thêm một điều.'}, {en: 'Could you clarify that point?', vi: 'Bạn có thể làm rõ điểm đó không?'}] },
  { title: 'Product Presentation', description: 'Present a product to clients', category: 'Professional English', subcategory: 'Presentations', level: 'C1', goal: 'Deliver persuasive presentations', context: 'You are presenting to clients', objectives: ['Introduce product', 'Highlight features', 'Handle questions', 'Close effectively'], keyExpressions: [{en: 'Let me show you the key features.', vi: 'Để tôi chỉ cho bạn các tính năng chính.'}, {en: 'This will significantly improve...', vi: 'Điều này sẽ cải thiện đáng kể...'}] },
  { title: 'Job Interview', description: 'Answer interview questions confidently', category: 'Professional English', subcategory: 'Interviews', level: 'B1', goal: 'Succeed in job interviews', context: 'You are being interviewed', objectives: ['Introduce yourself', 'Discuss experience', 'Answer behavioral questions', 'Ask questions'], keyExpressions: [{en: 'I have 3 years of experience in...', vi: 'Tôi có 3 năm kinh nghiệm trong...'}, {en: 'What are the growth opportunities?', vi: 'Cơ hội phát triển là gì?'}] },
  { title: 'Salary Negotiation', description: 'Negotiate compensation professionally', category: 'Professional English', subcategory: 'Negotiations', level: 'C1', goal: 'Negotiate effectively', context: 'You are discussing salary', objectives: ['State expectations', 'Justify request', 'Handle objections', 'Reach agreement'], keyExpressions: [{en: 'Based on my experience, I was expecting...', vi: 'Dựa trên kinh nghiệm, tôi mong đợi...'}, {en: 'Is there flexibility on this?', vi: 'Có thể linh hoạt về điều này không?'}] },
  
  // ACADEMIC (4)
  { title: 'Asking Questions in Class', description: 'Participate actively in lectures', category: 'Academic', subcategory: 'Lectures', level: 'B1', goal: 'Engage in academic discussions', context: 'You are in a university lecture', objectives: ['Ask for clarification', 'Request examples', 'Challenge ideas politely', 'Summarize understanding'], keyExpressions: [{en: 'Could you explain that again?', vi: 'Bạn có thể giải thích lại không?'}, {en: 'Can you give an example?', vi: 'Bạn có thể cho ví dụ không?'}] },
  { title: 'Group Discussion', description: 'Collaborate on academic projects', category: 'Academic', subcategory: 'Discussions', level: 'B1', goal: 'Work effectively in groups', context: 'You are in a study group', objectives: ['Share ideas', 'Build on others\' points', 'Resolve disagreements', 'Reach consensus'], keyExpressions: [{en: 'I agree with your point about...', vi: 'Tôi đồng ý với quan điểm của bạn về...'}, {en: 'Have we considered...?', vi: 'Chúng ta đã xem xét... chưa?'}] },
  { title: 'Research Presentation', description: 'Present research findings', category: 'Academic', subcategory: 'Research', level: 'C1', goal: 'Present research professionally', context: 'You are presenting research', objectives: ['Introduce topic', 'Explain methodology', 'Present findings', 'Discuss implications'], keyExpressions: [{en: 'Our research shows that...', vi: 'Nghiên cứu của chúng tôi cho thấy...'}, {en: 'The data suggests...', vi: 'Dữ liệu gợi ý rằng...'}] },
  { title: 'Thesis Defense', description: 'Defend your thesis to committee', category: 'Academic', subcategory: 'Presentations', level: 'C2', goal: 'Successfully defend thesis', context: 'You are defending your thesis', objectives: ['Present thesis', 'Answer questions', 'Defend methodology', 'Address criticisms'], keyExpressions: [{en: 'My thesis argues that...', vi: 'Luận án của tôi lập luận rằng...'}, {en: 'That\'s an excellent question.', vi: 'Đó là một câu hỏi xuất sắc.'}] },
  
  // BUSINESS (4)
  { title: 'Sales Call', description: 'Pitch products to potential clients', category: 'Business', subcategory: 'Sales', level: 'B2', goal: 'Close sales effectively', context: 'You are on a sales call', objectives: ['Build rapport', 'Identify needs', 'Present solution', 'Handle objections'], keyExpressions: [{en: 'How can I help you today?', vi: 'Tôi có thể giúp gì cho bạn hôm nay?'}, {en: 'This solution addresses your need for...', vi: 'Giải pháp này giải quyết nhu cầu của bạn về...'}] },
  { title: 'Marketing Campaign Pitch', description: 'Present marketing strategies', category: 'Business', subcategory: 'Marketing', level: 'B2', goal: 'Pitch campaigns convincingly', context: 'You are pitching to stakeholders', objectives: ['Present strategy', 'Show ROI', 'Address concerns', 'Get approval'], keyExpressions: [{en: 'Our campaign targets...', vi: 'Chiến dịch của chúng tôi nhắm đến...'}, {en: 'We expect a 20% increase in...', vi: 'Chúng tôi kỳ vọng tăng 20% trong...'}] },
  { title: 'Budget Meeting', description: 'Discuss financial planning', category: 'Business', subcategory: 'Finance', level: 'B2', goal: 'Manage budget discussions', context: 'You are in a budget meeting', objectives: ['Present budget', 'Justify expenses', 'Negotiate cuts', 'Reach agreement'], keyExpressions: [{en: 'We need to allocate funds for...', vi: 'Chúng ta cần phân bổ ngân sách cho...'}, {en: 'This investment will pay off in...', vi: 'Khoản đầu tư này sẽ hoàn vốn trong...'}] },
  { title: 'Team Building', description: 'Lead team building activities', category: 'Business', subcategory: 'Management', level: 'B1', goal: 'Build team cohesion', context: 'You are leading team building', objectives: ['Introduce activities', 'Encourage participation', 'Facilitate discussion', 'Summarize learnings'], keyExpressions: [{en: 'Let\'s start with an icebreaker.', vi: 'Hãy bắt đầu với hoạt động làm quen.'}, {en: 'What did you learn from this?', vi: 'Bạn học được gì từ điều này?'}] },
  
  // TRAVEL (4)
  { title: 'Hotel Check-in', description: 'Check into a hotel smoothly', category: 'Travel', subcategory: 'Hotels', level: 'A2', goal: 'Handle hotel procedures', context: 'You are at hotel reception', objectives: ['Provide booking info', 'Ask about amenities', 'Request room change', 'Get room key'], keyExpressions: [{en: 'I have a reservation under Smith.', vi: 'Tôi có đặt phòng dưới tên Smith.'}, {en: 'What time is breakfast?', vi: 'Bữa sáng lúc mấy giờ?'}] },
  { title: 'Airport Check-in', description: 'Navigate airport procedures', category: 'Travel', subcategory: 'Airports', level: 'A2', goal: 'Check in for flights', context: 'You are at airport counter', objectives: ['Present documents', 'Check luggage', 'Request seat', 'Get boarding pass'], keyExpressions: [{en: 'I\'d like a window seat, please.', vi: 'Tôi muốn chỗ ngồi cạnh cửa sổ.'}, {en: 'How many bags can I check?', vi: 'Tôi có thể ký gửi bao nhiêu túi?'}] },
  { title: 'Buying Tickets', description: 'Purchase tickets for attractions', category: 'Travel', subcategory: 'Tourist Sites', level: 'A1', goal: 'Buy tickets confidently', context: 'You are at ticket counter', objectives: ['Ask about prices', 'Request tickets', 'Ask about discounts', 'Make payment'], keyExpressions: [{en: 'Two adult tickets, please.', vi: 'Hai vé người lớn.'}, {en: 'Do you have student discounts?', vi: 'Có giảm giá sinh viên không?'}] },
  { title: 'Lost Luggage', description: 'Report and track lost luggage', category: 'Travel', subcategory: 'Emergency', level: 'B1', goal: 'Handle travel emergencies', context: 'You are at lost luggage desk', objectives: ['Describe luggage', 'Fill out form', 'Get tracking number', 'Arrange delivery'], keyExpressions: [{en: 'My luggage didn\'t arrive.', vi: 'Hành lý của tôi không đến.'}, {en: 'It\'s a black suitcase with...', vi: 'Đó là vali đen có...'}] },
  
  // SOCIAL SITUATIONS (4)
  { title: 'Birthday Party', description: 'Socialize at celebrations', category: 'Social Situations', subcategory: 'Parties', level: 'A2', goal: 'Enjoy social gatherings', context: 'You are at a birthday party', objectives: ['Greet host', 'Make small talk', 'Give compliments', 'Say goodbye'], keyExpressions: [{en: 'Happy birthday! Thanks for inviting me.', vi: 'Chúc mừng sinh nhật! Cảm ơn đã mời tôi.'}, {en: 'The party is wonderful!', vi: 'Bữa tiệc thật tuyệt vời!'}] },
  { title: 'Weather Chat', description: 'Make small talk about weather', category: 'Social Situations', subcategory: 'Small Talk', level: 'A1', goal: 'Start conversations easily', context: 'You are making small talk', objectives: ['Comment on weather', 'Ask about plans', 'Share experiences', 'Keep conversation going'], keyExpressions: [{en: 'Nice weather today, isn\'t it?', vi: 'Thời tiết hôm nay đẹp nhỉ?'}, {en: 'Do you have plans for the weekend?', vi: 'Bạn có kế hoạch cuối tuần không?'}] },
  { title: 'Introducing Yourself', description: 'Make a good first impression', category: 'Social Situations', subcategory: 'Making Friends', level: 'A1', goal: 'Introduce yourself confidently', context: 'You are meeting someone new', objectives: ['State your name', 'Share background', 'Ask questions', 'Exchange contact'], keyExpressions: [{en: 'Hi, I\'m John. Nice to meet you.', vi: 'Xin chào, tôi là John. Rất vui được gặp bạn.'}, {en: 'What do you do?', vi: 'Bạn làm nghề gì?'}] },
  { title: 'First Date', description: 'Navigate first date conversations', category: 'Social Situations', subcategory: 'Dating', level: 'B1', goal: 'Have enjoyable first dates', context: 'You are on a first date', objectives: ['Break the ice', 'Find common interests', 'Show interest', 'Plan next meeting'], keyExpressions: [{en: 'So, tell me about yourself.', vi: 'Vậy, kể cho tôi nghe về bạn.'}, {en: 'I really enjoyed tonight.', vi: 'Tôi thực sự thích tối nay.'}] },
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
        level: s.level as any,
        goal: s.goal,
        context: s.context,
        objectives: JSON.stringify(s.objectives),
        keyExpressions: JSON.stringify(s.keyExpressions),
        totalSessions: 5,
        estimatedMinutes: 15,
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
