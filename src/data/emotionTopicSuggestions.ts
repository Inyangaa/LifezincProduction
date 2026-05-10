export interface Suggestion {
  type: 'breathing' | 'reframe' | 'action';
  title: string;
  description: string;
  content?: string;
}

type EmotionKey = 'happy' | 'calm' | 'neutral' | 'sad' | 'anxious' | 'exhausted' | 'angry' | 'excited' | 'grateful' | 'stressed' | 'overwhelmed';
type TopicKey = 'money' | 'work' | 'school' | 'family' | 'friends' | 'relationships' | 'self_esteem' | 'health' | 'other';

export const emotionTopicSuggestions: Record<EmotionKey, Record<TopicKey, Suggestion[]> & { default: Suggestion[] }> = {
  happy: {
    money: [
      { type: 'action', title: 'Plan a small savings goal', description: 'Channel your positive energy into planning for the future' },
      { type: 'reframe', title: 'Celebrate a money win', description: 'Acknowledge what\'s going well with your finances' },
      { type: 'action', title: 'Share your gratitude', description: 'Express thanks for your financial blessings' },
    ],
    work: [
      { type: 'action', title: 'Set a new work goal', description: 'Use this positive momentum to aim higher' },
      { type: 'reframe', title: 'Recognize your achievements', description: 'Take a moment to appreciate what you\'ve accomplished' },
      { type: 'action', title: 'Share your success', description: 'Let someone know about your work win' },
    ],
    school: [
      { type: 'action', title: 'Plan your next academic milestone', description: 'Channel your enthusiasm into future goals' },
      { type: 'reframe', title: 'Celebrate your learning', description: 'Acknowledge how far you\'ve come' },
      { type: 'action', title: 'Help a classmate', description: 'Share your positive energy with others' },
    ],
    family: [
      { type: 'action', title: 'Express gratitude to family', description: 'Let them know you appreciate them' },
      { type: 'reframe', title: 'Reflect on family blessings', description: 'Think about what makes your family special' },
      { type: 'action', title: 'Plan a family activity', description: 'Build on this positive connection' },
    ],
    friends: [
      { type: 'action', title: 'Reach out to a friend', description: 'Share your positive energy with someone' },
      { type: 'reframe', title: 'Appreciate your friendships', description: 'Reflect on the connections you value' },
      { type: 'action', title: 'Plan a social outing', description: 'Keep the momentum going' },
    ],
    relationships: [
      { type: 'action', title: 'Express affection', description: 'Share your happy feelings with your partner' },
      { type: 'reframe', title: 'Appreciate your connection', description: 'Reflect on what makes this relationship special' },
      { type: 'action', title: 'Plan something special', description: 'Build on this positive moment' },
    ],
    self_esteem: [
      { type: 'action', title: 'Write down your strengths', description: 'Document what makes you proud' },
      { type: 'reframe', title: 'Celebrate your growth', description: 'Acknowledge how far you\'ve come' },
      { type: 'action', title: 'Set a personal goal', description: 'Use this confidence to reach higher' },
    ],
    health: [
      { type: 'action', title: 'Plan a wellness activity', description: 'Build on your positive health momentum' },
      { type: 'reframe', title: 'Appreciate your body', description: 'Reflect on what your body does for you' },
      { type: 'action', title: 'Share your health win', description: 'Inspire someone else' },
    ],
    other: [
      { type: 'action', title: 'Capture this moment', description: 'Write down what\'s making you happy' },
      { type: 'reframe', title: 'Find the lesson', description: 'What can you learn from this positive experience?' },
      { type: 'action', title: 'Spread positivity', description: 'Do something kind for someone' },
    ],
    default: [
      { type: 'action', title: 'Savor this feeling', description: 'Take a moment to fully experience your happiness' },
      { type: 'reframe', title: 'Reflect on gratitude', description: 'Think about what you\'re thankful for right now' },
      { type: 'action', title: 'Share your joy', description: 'Spread positivity to someone else' },
    ],
  },

  sad: {
    money: [
      { type: 'breathing', title: 'Calming breath', description: 'Soothe financial stress with gentle breathing' },
      { type: 'reframe', title: 'One step at a time', description: 'Financial situations are temporary; you can take small steps' },
      { type: 'action', title: 'List one small action', description: 'What\'s ONE tiny thing you could do about this?' },
    ],
    work: [
      { type: 'breathing', title: 'Release work tension', description: 'Let go of work stress with deep breaths' },
      { type: 'reframe', title: 'This too shall pass', description: 'Work challenges are temporary; you have strengths' },
      { type: 'action', title: 'Take a 5-minute break', description: 'Give yourself permission to pause' },
    ],
    school: [
      { type: 'breathing', title: 'Academic stress relief', description: 'Calm your mind before tackling schoolwork' },
      { type: 'reframe', title: 'Learning takes time', description: 'It\'s okay to struggle; growth happens gradually' },
      { type: 'action', title: 'Reach out for help', description: 'Connect with a teacher, counselor, or tutor' },
    ],
    family: [
      { type: 'breathing', title: 'Family stress relief', description: 'Find calm amidst family difficulties' },
      { type: 'reframe', title: 'You\'re not alone', description: 'Family challenges are common; you deserve support' },
      { type: 'action', title: 'Journal your feelings', description: 'Write about what\'s bothering you' },
    ],
    friends: [
      { type: 'breathing', title: 'Social stress relief', description: 'Calm your mind after social difficulties' },
      { type: 'reframe', title: 'Friendships evolve', description: 'It\'s normal for relationships to change' },
      { type: 'action', title: 'Self-compassion moment', description: 'Be kind to yourself about this' },
    ],
    relationships: [
      { type: 'breathing', title: 'Relationship calm', description: 'Soothe your heart with gentle breaths' },
      { type: 'reframe', title: 'You deserve care', description: 'Relationship pain is real and you deserve support' },
      { type: 'action', title: 'Practice self-care', description: 'Do one small thing that nurtures you' },
    ],
    self_esteem: [
      { type: 'breathing', title: 'Self-compassion breath', description: 'Be gentle with yourself right now' },
      { type: 'reframe', title: 'You are enough', description: 'Your worth isn\'t determined by how you feel today' },
      { type: 'action', title: 'List one thing you like about yourself', description: 'Find one small positive' },
    ],
    health: [
      { type: 'breathing', title: 'Healing breath', description: 'Support your body with calming breathwork' },
      { type: 'reframe', title: 'Your body is doing its best', description: 'Health challenges are difficult; be patient' },
      { type: 'action', title: 'One gentle self-care act', description: 'Do something small and nurturing' },
    ],
    other: [
      { type: 'breathing', title: 'Gentle breathing', description: 'Calm your nervous system' },
      { type: 'reframe', title: 'Feelings are temporary', description: 'This sadness won\'t last forever' },
      { type: 'action', title: 'Reach out', description: 'Connect with someone who cares' },
    ],
    default: [
      { type: 'breathing', title: '2-minute breathing break', description: 'Calm your nervous system with gentle breaths' },
      { type: 'reframe', title: 'This feeling will pass', description: 'Sadness is temporary; you will feel better' },
      { type: 'action', title: 'One small act of self-care', description: 'Do something gentle for yourself' },
    ],
  },

  anxious: {
    money: [
      { type: 'breathing', title: 'Financial anxiety relief', description: 'Calm your racing thoughts about money' },
      { type: 'reframe', title: 'Focus on what you can control', description: 'You can only manage one thing at a time' },
      { type: 'action', title: 'Write down one action step', description: 'What\'s ONE thing you can do today?' },
    ],
    work: [
      { type: 'breathing', title: 'Work anxiety calm', description: 'Settle your nervous system before tasks' },
      { type: 'reframe', title: 'Break it down', description: 'You don\'t have to do everything at once' },
      { type: 'action', title: 'Prioritize one task', description: 'Pick just ONE thing to focus on' },
    ],
    school: [
      { type: 'breathing', title: 'Academic anxiety relief', description: 'Calm test or assignment stress' },
      { type: 'reframe', title: 'You\'ve done hard things before', description: 'Remember past successes' },
      { type: 'action', title: 'Study for just 10 minutes', description: 'Start small and see how you feel' },
    ],
    family: [
      { type: 'breathing', title: 'Family stress grounding', description: 'Find your center amidst family tension' },
      { type: 'reframe', title: 'You can only control your responses', description: 'Focus on what you can manage' },
      { type: 'action', title: 'Take space if needed', description: 'It\'s okay to step away briefly' },
    ],
    friends: [
      { type: 'breathing', title: 'Social anxiety relief', description: 'Calm your nerves about social situations' },
      { type: 'reframe', title: 'Most people feel this way', description: 'Social anxiety is very common' },
      { type: 'action', title: 'Practice a grounding technique', description: '5-4-3-2-1 method: name things you sense' },
    ],
    relationships: [
      { type: 'breathing', title: 'Relationship anxiety calm', description: 'Settle worries about your relationship' },
      { type: 'reframe', title: 'Anxiety isn\'t facts', description: 'Worried thoughts aren\'t always true' },
      { type: 'action', title: 'Reach out or journal', description: 'Express your feelings in a healthy way' },
    ],
    self_esteem: [
      { type: 'breathing', title: 'Calm worried thoughts', description: 'Settle your inner critic' },
      { type: 'reframe', title: 'Perfection isn\'t required', description: 'You\'re allowed to be imperfect' },
      { type: 'action', title: 'List what you\'ve accomplished today', description: 'Even tiny things count' },
    ],
    health: [
      { type: 'breathing', title: 'Health anxiety relief', description: 'Calm physical and health worries' },
      { type: 'reframe', title: 'Your body is resilient', description: 'Trust your body\'s ability to cope' },
      { type: 'action', title: 'Ground yourself in the present', description: 'Focus on right now, not what-ifs' },
    ],
    other: [
      { type: 'breathing', title: '4-4-4-4 box breathing', description: 'Activate your calming nervous system' },
      { type: 'reframe', title: 'Anxiety lies', description: 'Worried thoughts aren\'t facts' },
      { type: 'action', title: 'Name the worry', description: 'Write down what specifically worries you' },
    ],
    default: [
      { type: 'breathing', title: 'Box breathing technique', description: 'Calm your racing heart and mind' },
      { type: 'reframe', title: 'You are safe right now', description: 'Ground yourself in this present moment' },
      { type: 'action', title: 'Write down your worries', description: 'Get them out of your head and onto paper' },
    ],
  },

  exhausted: {
    money: [
      { type: 'breathing', title: 'Gentle energy boost', description: 'Restore a bit of calm despite money stress' },
      { type: 'reframe', title: 'Rest is productive', description: 'Taking care of yourself helps you handle finances better' },
      { type: 'action', title: 'One tiny financial step', description: 'Do ONE small thing, then rest' },
    ],
    work: [
      { type: 'breathing', title: 'Work exhaustion relief', description: 'Give yourself permission to breathe' },
      { type: 'reframe', title: 'Rest is not weakness', description: 'You can\'t pour from an empty cup' },
      { type: 'action', title: 'Take a proper break', description: 'Step away from work for at least 5 minutes' },
    ],
    school: [
      { type: 'breathing', title: 'Study fatigue relief', description: 'Calm your tired mind' },
      { type: 'reframe', title: 'Your brain needs rest', description: 'Learning requires recovery time' },
      { type: 'action', title: 'Power nap or rest', description: 'Even 10 minutes can help' },
    ],
    family: [
      { type: 'breathing', title: 'Caregiver fatigue relief', description: 'Restore yourself amid family demands' },
      { type: 'reframe', title: 'You need care too', description: 'Taking care of yourself isn\'t selfish' },
      { type: 'action', title: 'Ask for help', description: 'Delegate one task if possible' },
    ],
    friends: [
      { type: 'breathing', title: 'Social fatigue relief', description: 'It\'s okay to recharge alone' },
      { type: 'reframe', title: 'Introvert time is valid', description: 'You don\'t have to be "on" all the time' },
      { type: 'action', title: 'Decline if needed', description: 'It\'s okay to say no to social plans' },
    ],
    relationships: [
      { type: 'breathing', title: 'Relationship energy restore', description: 'Even loving relationships can be draining' },
      { type: 'reframe', title: 'Communication can wait', description: 'Rest first, then address issues' },
      { type: 'action', title: 'Solo recharge time', description: 'Take space to restore your energy' },
    ],
    self_esteem: [
      { type: 'breathing', title: 'Gentle self-compassion', description: 'Be extra kind to yourself when tired' },
      { type: 'reframe', title: 'Exhaustion affects mood', description: 'You\'ll feel better about yourself after rest' },
      { type: 'action', title: 'Lower your standards today', description: 'Just get through; perfection can wait' },
    ],
    health: [
      { type: 'breathing', title: 'Body fatigue relief', description: 'Honor your body\'s need for rest' },
      { type: 'reframe', title: 'Rest aids healing', description: 'Your body recovers when you rest' },
      { type: 'action', title: 'Lie down for 10 minutes', description: 'Give your body permission to pause' },
    ],
    other: [
      { type: 'breathing', title: 'Energy restoration breath', description: 'Gentle breathing to restore a bit of energy' },
      { type: 'reframe', title: 'This exhaustion is temporary', description: 'You will feel rested again' },
      { type: 'action', title: 'Do the absolute minimum', description: 'What\'s ONE thing that MUST be done? Do only that.' },
    ],
    default: [
      { type: 'breathing', title: '2-minute rest break', description: 'Close your eyes and breathe gently' },
      { type: 'reframe', title: 'Rest is not laziness', description: 'Your body and mind need recovery' },
      { type: 'action', title: 'Do one tiny task only', description: 'Pick the smallest possible thing, then rest' },
    ],
  },

  angry: {
    money: [
      { type: 'breathing', title: 'Release financial anger', description: 'Cool down heated money frustrations' },
      { type: 'reframe', title: 'Anger shows you care', description: 'Your frustration means this matters to you' },
      { type: 'action', title: 'Write an angry letter', description: 'Express your feelings on paper (don\'t send)' },
    ],
    work: [
      { type: 'breathing', title: 'Work anger release', description: 'Calm down before responding' },
      { type: 'reframe', title: 'You have valid concerns', description: 'Your anger is information about boundaries' },
      { type: 'action', title: 'Take a walk', description: 'Move your body to process the anger' },
    ],
    school: [
      { type: 'breathing', title: 'Academic frustration release', description: 'Cool down before tackling schoolwork' },
      { type: 'reframe', title: 'This challenge can teach you', description: 'Frustration means you\'re pushing your limits' },
      { type: 'action', title: 'Physical release', description: 'Do jumping jacks or punch a pillow' },
    ],
    family: [
      { type: 'breathing', title: 'Family anger management', description: 'Prevent saying things you\'ll regret' },
      { type: 'reframe', title: 'Take a timeout', description: 'It\'s okay to step away until you\'re calm' },
      { type: 'action', title: 'Journal your anger', description: 'Write uncensored until you feel calmer' },
    ],
    friends: [
      { type: 'breathing', title: 'Social anger relief', description: 'Process frustration before addressing it' },
      { type: 'reframe', title: 'Boundaries matter', description: 'Your anger may be telling you to set limits' },
      { type: 'action', title: 'Cool down activity', description: 'Do something physical before talking' },
    ],
    relationships: [
      { type: 'breathing', title: 'Relationship anger processing', description: 'Calm down before communicating' },
      { type: 'reframe', title: 'Anger isn\'t the enemy', description: 'Your feelings are valid; expression matters' },
      { type: 'action', title: 'Write before speaking', description: 'Organize your thoughts on paper first' },
    ],
    self_esteem: [
      { type: 'breathing', title: 'Self-directed anger release', description: 'Be gentle with your inner critic' },
      { type: 'reframe', title: 'Anger at yourself is pain', description: 'What do you really need right now?' },
      { type: 'action', title: 'Self-compassion break', description: 'Treat yourself like you would a friend' },
    ],
    health: [
      { type: 'breathing', title: 'Health frustration release', description: 'Process anger about your body or health' },
      { type: 'reframe', title: 'Your anger is understandable', description: 'Health struggles are legitimately hard' },
      { type: 'action', title: 'Safe physical release', description: 'Move or stretch to process the feeling' },
    ],
    other: [
      { type: 'breathing', title: 'Anger cooling breath', description: 'Let the heat of anger dissipate' },
      { type: 'reframe', title: 'Anger is information', description: 'What is this feeling telling you?' },
      { type: 'action', title: 'Physical anger release', description: 'Exercise, dance, or move your body' },
    ],
    default: [
      { type: 'breathing', title: 'Cool-down breathing', description: 'Release the physical tension of anger' },
      { type: 'reframe', title: 'Anger is valid', description: 'Your feelings matter; how you express them matters too' },
      { type: 'action', title: 'Safe anger release', description: 'Journal, exercise, or create art to process this' },
    ],
  },

  calm: {
    money: [
      { type: 'action', title: 'Financial planning moment', description: 'Use this calm to think clearly about money' },
      { type: 'reframe', title: 'Appreciate financial stability', description: 'Notice what\'s going right financially' },
      { type: 'action', title: 'Review your budget', description: 'Make calm, thoughtful money decisions' },
    ],
    work: [
      { type: 'action', title: 'Focused work session', description: 'Use this calm energy for productive work' },
      { type: 'reframe', title: 'Recognize your flow state', description: 'This is a great time for deep work' },
      { type: 'action', title: 'Plan your priorities', description: 'Organize your work tasks mindfully' },
    ],
    school: [
      { type: 'action', title: 'Study session', description: 'Your calm mind is perfect for learning' },
      { type: 'reframe', title: 'Optimize this mental state', description: 'Calm is ideal for absorbing information' },
      { type: 'action', title: 'Review notes or plan', description: 'Use this clarity for academic planning' },
    ],
    family: [
      { type: 'action', title: 'Quality family time', description: 'Enjoy present moment with family' },
      { type: 'reframe', title: 'Savor this peace', description: 'Peaceful family moments are precious' },
      { type: 'action', title: 'Express appreciation', description: 'Tell family members you love them' },
    ],
    friends: [
      { type: 'action', title: 'Reach out to friends', description: 'Your calm energy is great for connection' },
      { type: 'reframe', title: 'Appreciate your friendships', description: 'Reflect on meaningful connections' },
      { type: 'action', title: 'Plan social connection', description: 'Schedule time with friends' },
    ],
    relationships: [
      { type: 'action', title: 'Meaningful conversation', description: 'Have a deep, calm conversation' },
      { type: 'reframe', title: 'Cherish this connection', description: 'Calm moments together are valuable' },
      { type: 'action', title: 'Express your feelings', description: 'Share appreciation with your partner' },
    ],
    self_esteem: [
      { type: 'action', title: 'Self-reflection', description: 'Use this calm to understand yourself better' },
      { type: 'reframe', title: 'You\'ve created this peace', description: 'Recognize your own role in feeling calm' },
      { type: 'action', title: 'Set personal intentions', description: 'Think about who you want to be' },
    ],
    health: [
      { type: 'action', title: 'Mindful movement', description: 'Gentle exercise like yoga or stretching' },
      { type: 'reframe', title: 'Body and mind alignment', description: 'Notice how calm feels physically' },
      { type: 'action', title: 'Healthy habit practice', description: 'Build on this calm with wellness' },
    ],
    other: [
      { type: 'action', title: 'Mindfulness practice', description: 'Deepen your calm with meditation' },
      { type: 'reframe', title: 'This is your baseline', description: 'Remember this feeling for stressful times' },
      { type: 'action', title: 'Creative activity', description: 'Use calm energy for art or hobbies' },
    ],
    default: [
      { type: 'breathing', title: 'Maintain this calm', description: 'Practice breathing to extend this peaceful state' },
      { type: 'reframe', title: 'Anchor this feeling', description: 'Remember what calm feels like' },
      { type: 'action', title: 'Mindful moment', description: 'Sit quietly and simply be present' },
    ],
  },

  neutral: {
    money: [
      { type: 'action', title: 'Financial check-in', description: 'Review your money situation objectively' },
      { type: 'reframe', title: 'Neutral is okay', description: 'Not every moment needs to be intense' },
      { type: 'action', title: 'Small money task', description: 'Pay a bill or review a statement' },
    ],
    work: [
      { type: 'action', title: 'Steady work progress', description: 'Make consistent progress on tasks' },
      { type: 'reframe', title: 'Consistency matters', description: 'Neutral productivity is still productive' },
      { type: 'action', title: 'Organize your workspace', description: 'Create order in your environment' },
    ],
    school: [
      { type: 'action', title: 'Review and organize', description: 'Tidy notes or plan study schedule' },
      { type: 'reframe', title: 'Steady learning', description: 'You don\'t have to feel passionate every day' },
      { type: 'action', title: 'Small study task', description: 'Do one assignment or review session' },
    ],
    family: [
      { type: 'action', title: 'Routine family time', description: 'Be present even in ordinary moments' },
      { type: 'reframe', title: 'Ordinary is valuable', description: 'Not every interaction needs to be special' },
      { type: 'action', title: 'Family task together', description: 'Do a chore or activity together' },
    ],
    friends: [
      { type: 'action', title: 'Simple check-in', description: 'Send a quick message to a friend' },
      { type: 'reframe', title: 'Low-key connection', description: 'Friendships don\'t require constant intensity' },
      { type: 'action', title: 'Make plans', description: 'Schedule future time together' },
    ],
    relationships: [
      { type: 'action', title: 'Everyday connection', description: 'Share a meal or watch something together' },
      { type: 'reframe', title: 'Comfortable companionship', description: 'Contentment is underrated' },
      { type: 'action', title: 'Small gesture', description: 'Do something small and thoughtful' },
    ],
    self_esteem: [
      { type: 'action', title: 'Self-assessment', description: 'Check in with yourself honestly' },
      { type: 'reframe', title: 'You don\'t need to feel amazing', description: 'Neutral is perfectly valid' },
      { type: 'action', title: 'List daily wins', description: 'Note what you accomplished today' },
    ],
    health: [
      { type: 'action', title: 'Basic health maintenance', description: 'Drink water, eat well, move a bit' },
      { type: 'reframe', title: 'Consistency counts', description: 'Small daily habits matter' },
      { type: 'action', title: 'Health check-in', description: 'Notice how your body feels' },
    ],
    other: [
      { type: 'action', title: 'Routine task', description: 'Do something on your to-do list' },
      { type: 'reframe', title: 'Embrace the ordinary', description: 'Most of life is neutral, and that\'s fine' },
      { type: 'action', title: 'Organize something', description: 'Tidy a space or plan your day' },
    ],
    default: [
      { type: 'breathing', title: 'Centering breath', description: 'Ground yourself in the present' },
      { type: 'reframe', title: 'Neutral is productive', description: 'You don\'t need intensity to move forward' },
      { type: 'action', title: 'Pick one task', description: 'Do something small from your list' },
    ],
  },

  excited: {
    money: [
      { type: 'action', title: 'Make a financial goal', description: 'Channel excitement into planning' },
      { type: 'reframe', title: 'Celebrate responsibly', description: 'Enjoy financial wins without overspending' },
      { type: 'action', title: 'Share your money win', description: 'Tell someone about your success' },
    ],
    work: [
      { type: 'action', title: 'Tackle a big project', description: 'Use this energy for ambitious work' },
      { type: 'reframe', title: 'Harness the momentum', description: 'Excitement is fuel for achievement' },
      { type: 'action', title: 'Start something new', description: 'Begin a project you\'ve been putting off' },
    ],
    school: [
      { type: 'action', title: 'Dive into learning', description: 'Use excitement to absorb new material' },
      { type: 'reframe', title: 'Passion for learning', description: 'This enthusiasm is a gift' },
      { type: 'action', title: 'Explore new topics', description: 'Follow your curiosity' },
    ],
    family: [
      { type: 'action', title: 'Plan family fun', description: 'Organize something exciting together' },
      { type: 'reframe', title: 'Share the joy', description: 'Your excitement can lift others' },
      { type: 'action', title: 'Express enthusiasm', description: 'Let family see your passion' },
    ],
    friends: [
      { type: 'action', title: 'Plan an adventure', description: 'Organize something fun with friends' },
      { type: 'reframe', title: 'Excitement is contagious', description: 'Share your energy with others' },
      { type: 'action', title: 'Invite friends along', description: 'Bring others into your excitement' },
    ],
    relationships: [
      { type: 'action', title: 'Plan something special', description: 'Create a memorable experience together' },
      { type: 'reframe', title: 'Cherish this energy', description: 'Excitement keeps relationships alive' },
      { type: 'action', title: 'Express your feelings', description: 'Share your enthusiasm with your partner' },
    ],
    self_esteem: [
      { type: 'action', title: 'Set ambitious goals', description: 'Dream big while you feel confident' },
      { type: 'reframe', title: 'Trust your capability', description: 'You have every reason to be excited' },
      { type: 'action', title: 'Document this feeling', description: 'Write about what\'s exciting you' },
    ],
    health: [
      { type: 'action', title: 'Active challenge', description: 'Try a new physical activity' },
      { type: 'reframe', title: 'Energy is a gift', description: 'Use this vitality wisely' },
      { type: 'action', title: 'Start a wellness goal', description: 'Begin a health habit you\'ve wanted' },
    ],
    other: [
      { type: 'action', title: 'Channel the energy', description: 'Do something creative or active' },
      { type: 'reframe', title: 'Savor the feeling', description: 'Excitement is wonderful' },
      { type: 'action', title: 'Take bold action', description: 'Do something you\'ve been nervous about' },
    ],
    default: [
      { type: 'action', title: 'Pursue your passion', description: 'Do something you absolutely love' },
      { type: 'reframe', title: 'Excitement is motivation', description: 'This feeling can drive you forward' },
      { type: 'action', title: 'Share your enthusiasm', description: 'Tell someone what\'s exciting you' },
    ],
  },

  grateful: {
    money: [
      { type: 'action', title: 'Give back financially', description: 'Donate or help someone with money' },
      { type: 'reframe', title: 'Appreciate abundance', description: 'Recognize what you have' },
      { type: 'action', title: 'Financial gratitude list', description: 'List things you\'re thankful for financially' },
    ],
    work: [
      { type: 'action', title: 'Thank colleagues', description: 'Express appreciation to coworkers' },
      { type: 'reframe', title: 'Recognize work blessings', description: 'Notice what\'s good about your job' },
      { type: 'action', title: 'Contribute extra', description: 'Go above and beyond today' },
    ],
    school: [
      { type: 'action', title: 'Thank a teacher', description: 'Express gratitude to an educator' },
      { type: 'reframe', title: 'Learning is a privilege', description: 'Appreciate the opportunity to learn' },
      { type: 'action', title: 'Help a classmate', description: 'Share your knowledge with others' },
    ],
    family: [
      { type: 'action', title: 'Express family gratitude', description: 'Tell family members you\'re thankful' },
      { type: 'reframe', title: 'Family blessings', description: 'Reflect on what family gives you' },
      { type: 'action', title: 'Quality time', description: 'Spend meaningful moments together' },
    ],
    friends: [
      { type: 'action', title: 'Thank your friends', description: 'Let friends know you appreciate them' },
      { type: 'reframe', title: 'Friendship is precious', description: 'True friends are rare and valuable' },
      { type: 'action', title: 'Be present', description: 'Give friends your full attention' },
    ],
    relationships: [
      { type: 'action', title: 'Express love', description: 'Tell your partner specific things you\'re grateful for' },
      { type: 'reframe', title: 'Relationship appreciation', description: 'Notice small ways they care for you' },
      { type: 'action', title: 'Loving gesture', description: 'Do something thoughtful for them' },
    ],
    self_esteem: [
      { type: 'action', title: 'Self-appreciation', description: 'Write down things you\'re grateful for about yourself' },
      { type: 'reframe', title: 'You are a gift', description: 'Appreciate your own unique qualities' },
      { type: 'action', title: 'Celebrate yourself', description: 'Do something kind for yourself' },
    ],
    health: [
      { type: 'action', title: 'Body gratitude', description: 'Thank your body for what it does' },
      { type: 'reframe', title: 'Health is a blessing', description: 'Appreciate your physical wellbeing' },
      { type: 'action', title: 'Nourish yourself', description: 'Care for your body with love' },
    ],
    other: [
      { type: 'action', title: 'Gratitude journal', description: 'Write about what you\'re thankful for' },
      { type: 'reframe', title: 'Abundance mindset', description: 'Focus on what you have, not what\'s missing' },
      { type: 'action', title: 'Give to others', description: 'Share your blessings with someone' },
    ],
    default: [
      { type: 'action', title: 'Write gratitude list', description: 'List 10 things you\'re thankful for' },
      { type: 'reframe', title: 'Cultivate appreciation', description: 'Gratitude grows with practice' },
      { type: 'action', title: 'Express thanks', description: 'Tell someone you appreciate them' },
    ],
  },

  stressed: {
    money: [
      { type: 'breathing', title: 'Financial stress relief', description: 'Calm your money anxiety' },
      { type: 'reframe', title: 'One step at a time', description: 'You can\'t solve everything today' },
      { type: 'action', title: 'Identify one action', description: 'What\'s ONE thing you can do?' },
    ],
    work: [
      { type: 'breathing', title: 'Work stress reduction', description: 'Lower your stress before tackling tasks' },
      { type: 'reframe', title: 'Prioritize ruthlessly', description: 'Not everything is urgent' },
      { type: 'action', title: 'Make a priority list', description: 'Write down what MUST be done' },
    ],
    school: [
      { type: 'breathing', title: 'Academic stress relief', description: 'Calm your stressed mind' },
      { type: 'reframe', title: 'Break it down', description: 'Divide big tasks into tiny steps' },
      { type: 'action', title: 'Study for 20 minutes only', description: 'Start small and see how you feel' },
    ],
    family: [
      { type: 'breathing', title: 'Family stress management', description: 'Find calm in chaos' },
      { type: 'reframe', title: 'You can\'t control others', description: 'Focus on what you can manage' },
      { type: 'action', title: 'Set a boundary', description: 'It\'s okay to say no or take space' },
    ],
    friends: [
      { type: 'breathing', title: 'Social stress relief', description: 'Calm overwhelm about relationships' },
      { type: 'reframe', title: 'Quality over quantity', description: 'You don\'t have to please everyone' },
      { type: 'action', title: 'Decline if needed', description: 'Protect your energy' },
    ],
    relationships: [
      { type: 'breathing', title: 'Relationship stress calm', description: 'Breathe before addressing issues' },
      { type: 'reframe', title: 'Stress isn\'t the relationship', description: 'Don\'t make big decisions when stressed' },
      { type: 'action', title: 'Communicate needs', description: 'Ask for what you need clearly' },
    ],
    self_esteem: [
      { type: 'breathing', title: 'Self-criticism pause', description: 'Be gentle with yourself' },
      { type: 'reframe', title: 'You\'re doing your best', description: 'Stress makes everything harder' },
      { type: 'action', title: 'Lower expectations', description: 'What can you let go of today?' },
    ],
    health: [
      { type: 'breathing', title: 'Health stress relief', description: 'Calm your body and mind' },
      { type: 'reframe', title: 'Rest aids health', description: 'Taking breaks helps your body cope' },
      { type: 'action', title: 'One self-care act', description: 'Do something nurturing' },
    ],
    other: [
      { type: 'breathing', title: 'General stress reduction', description: 'Activate your calming response' },
      { type: 'reframe', title: 'This feeling will pass', description: 'Stress is temporary' },
      { type: 'action', title: 'Brain dump', description: 'Write down everything stressing you' },
    ],
    default: [
      { type: 'breathing', title: 'Stress-relief breathing', description: 'Calm your nervous system immediately' },
      { type: 'reframe', title: 'You can handle this', description: 'You\'ve survived 100% of your hardest days' },
      { type: 'action', title: 'One task only', description: 'Pick the most important thing and do just that' },
    ],
  },

  overwhelmed: {
    money: [
      { type: 'breathing', title: 'Financial overwhelm relief', description: 'You don\'t have to solve it all now' },
      { type: 'reframe', title: 'Money problems have solutions', description: 'One step at a time is enough' },
      { type: 'action', title: 'Write down your options', description: 'Get it out of your head' },
    ],
    work: [
      { type: 'breathing', title: 'Work overwhelm management', description: 'Breathe before you tackle anything' },
      { type: 'reframe', title: 'Do what you can', description: 'You can\'t do everything; that\'s okay' },
      { type: 'action', title: 'Pick ONE task', description: 'Ignore everything else for now' },
    ],
    school: [
      { type: 'breathing', title: 'Academic overwhelm relief', description: 'Calm your panicked mind' },
      { type: 'reframe', title: 'Ask for help', description: 'You don\'t have to do this alone' },
      { type: 'action', title: 'Break one assignment into steps', description: 'Just one; that\'s all' },
    ],
    family: [
      { type: 'breathing', title: 'Family overwhelm calm', description: 'Find your center amidst chaos' },
      { type: 'reframe', title: 'You can\'t do it all', description: 'It\'s okay to ask for help or say no' },
      { type: 'action', title: 'Delegate one thing', description: 'What can someone else do?' },
    ],
    friends: [
      { type: 'breathing', title: 'Social overwhelm relief', description: 'It\'s okay to need space' },
      { type: 'reframe', title: 'Quality over quantity', description: 'You don\'t owe everyone your time' },
      { type: 'action', title: 'Cancel plans if needed', description: 'Protect your wellbeing' },
    ],
    relationships: [
      { type: 'breathing', title: 'Relationship overwhelm calm', description: 'Take a moment for yourself' },
      { type: 'reframe', title: 'It\'s okay to need space', description: 'You can love someone and need a break' },
      { type: 'action', title: 'Communicate your needs', description: 'Say "I need some time to myself"' },
    ],
    self_esteem: [
      { type: 'breathing', title: 'Overwhelm compassion', description: 'Be extraordinarily kind to yourself' },
      { type: 'reframe', title: 'You\'re not failing', description: 'Overwhelm means you\'re carrying too much' },
      { type: 'action', title: 'Drop one expectation', description: 'What can you let go of?' },
    ],
    health: [
      { type: 'breathing', title: 'Health overwhelm relief', description: 'Your body needs calm' },
      { type: 'reframe', title: 'Health is a marathon', description: 'You don\'t have to fix everything today' },
      { type: 'action', title: 'Rest immediately', description: 'Lie down for 10 minutes minimum' },
    ],
    other: [
      { type: 'breathing', title: 'Overwhelm grounding', description: 'Come back to the present moment' },
      { type: 'reframe', title: 'This feeling will pass', description: 'Overwhelm is temporary' },
      { type: 'action', title: 'Do the easiest thing first', description: 'Build momentum with one tiny win' },
    ],
    default: [
      { type: 'breathing', title: 'Grounding breath', description: 'Bring yourself back to the present' },
      { type: 'reframe', title: 'You only need to do the next thing', description: 'Not everything; just the next small thing' },
      { type: 'action', title: 'Make a list, pick one item', description: 'Get it out of your head, then do ONE thing' },
    ],
  },
};

export function getSuggestions(emotion: string, topic: string): { suggestions: Suggestion[]; isFallback: boolean } {
  const normalizedEmotion = normalizeEmotion(emotion);
  const normalizedTopic = normalizeTopic(topic);

  if (emotionTopicSuggestions[normalizedEmotion]?.[normalizedTopic]) {
    return {
      suggestions: emotionTopicSuggestions[normalizedEmotion][normalizedTopic],
      isFallback: false,
    };
  }

  if (emotionTopicSuggestions[normalizedEmotion]?.default) {
    return {
      suggestions: emotionTopicSuggestions[normalizedEmotion].default,
      isFallback: true,
    };
  }

  return {
    suggestions: emotionTopicSuggestions.neutral.default,
    isFallback: true,
  };
}

function normalizeEmotion(emotion: string): EmotionKey {
  const emotionLower = emotion.toLowerCase();

  const emotionMap: Record<string, EmotionKey> = {
    happy: 'happy',
    joyful: 'happy',
    content: 'happy',
    pleased: 'happy',
    calm: 'calm',
    peaceful: 'calm',
    relaxed: 'calm',
    neutral: 'neutral',
    okay: 'neutral',
    fine: 'neutral',
    sad: 'sad',
    down: 'sad',
    unhappy: 'sad',
    depressed: 'sad',
    anxious: 'anxious',
    worried: 'anxious',
    nervous: 'anxious',
    fearful: 'anxious',
    exhausted: 'exhausted',
    tired: 'exhausted',
    fatigued: 'exhausted',
    drained: 'exhausted',
    angry: 'angry',
    mad: 'angry',
    frustrated: 'angry',
    irritated: 'angry',
    excited: 'excited',
    enthusiastic: 'excited',
    energized: 'excited',
    grateful: 'grateful',
    thankful: 'grateful',
    appreciative: 'grateful',
    stressed: 'stressed',
    tense: 'stressed',
    pressured: 'stressed',
    overwhelmed: 'overwhelmed',
    swamped: 'overwhelmed',
    overburdened: 'overwhelmed',
  };

  return emotionMap[emotionLower] || 'neutral';
}

function normalizeTopic(topic: string): TopicKey {
  const topicLower = topic.toLowerCase();

  const topicMap: Record<string, TopicKey> = {
    money: 'money',
    finances: 'money',
    financial: 'money',
    work: 'work',
    job: 'work',
    career: 'work',
    school: 'school',
    academics: 'school',
    education: 'school',
    family: 'family',
    parents: 'family',
    siblings: 'family',
    friends: 'friends',
    social: 'friends',
    friendships: 'friends',
    relationships: 'relationships',
    relationship: 'relationships',
    dating: 'relationships',
    romance: 'relationships',
    self_esteem: 'self_esteem',
    confidence: 'self_esteem',
    'self-esteem': 'self_esteem',
    health: 'health',
    wellness: 'health',
    physical: 'health',
    other: 'other',
  };

  return topicMap[topicLower] || 'other';
}
