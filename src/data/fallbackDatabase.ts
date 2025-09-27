import charlottesWebCover from '@/assets/book-covers/charlottes-web.jpg';
import wonderCover from '@/assets/book-covers/wonder.jpg';
import bfgCover from '@/assets/book-covers/bfg.jpg';

export const fallbackDatabase = {
  'bfg': {
    id: 'bfg-fallback',
    title: 'The BFG',
    author: 'Roald Dahl',
    summary: 'Sophie meets the Big Friendly Giant who, unlike other giants, refuses to eat children and instead catches dreams. Together they embark on an adventure to stop the mean giants from eating human beans.',
    coverImage: bfgCover,
    arLevel: '4.8',
    gradeLevel: '3-7',
    pageCount: 208,
    year: 1982,
    bannedBook: false,
    vocabulary: ['whizzpopping', 'snozzcumber', 'frobscottle', 'human beans', 'trogglehumper'],
    comprehensionSkill: 'Making Inferences',
    strategyTip: 'The BFG speaks in a funny, mixed-up way. Practice making inferences about what he really means!',
    questions: [
      '🔵 What makes the BFG different from other giants?',
      '🟢 Why do you think Sophie trusts the BFG even though he\'s a giant?',
      '🟢 What clues tell you the BFG is actually friendly?'
    ],
    predictions: [
      'Based on the title, what do you think BFG stands for?',
      'Why might Sophie need to meet a giant?'
    ],
    activities: [
      '🎨 Create your own made-up BFG words like "whizzpopper"',
      '📝 Draw what you think a dream looks like',
      '🎭 Act out the scene where Sophie first meets the BFG'
    ]
  },
  'charlotte': {
    id: 'charlotte-fallback',
    title: 'Charlotte\'s Web',
    author: 'E.B. White',
    summary: 'Wilbur the pig is saved from being slaughtered when a clever spider named Charlotte weaves words into her web, declaring Wilbur to be "Some Pig" and other remarkable things.',
    coverImage: charlottesWebCover,
    arLevel: '4.4',
    gradeLevel: '3-5',
    pageCount: 192,
    year: 1952,
    bannedBook: false,
    vocabulary: ['salutations', 'versatile', 'humble', 'sedentary', 'gullible'],
    comprehensionSkill: 'Theme & Main Idea',
    strategyTip: 'Think about what Charlotte does for Wilbur. What does this story teach us about friendship?',
    questions: [
      '🔵 How does Charlotte save Wilbur?',
      '🟢 Why do you think Charlotte helps Wilbur even though she\'s just a spider?',
      '🟢 What is the main message about friendship in this story?'
    ],
    predictions: [
      'What do you think a spider and a pig could have in common?',
      'How might a spider\'s web be important to the story?'
    ],
    activities: [
      '🕸️ Make your own web design with words about a friend',
      '📖 Write a letter from Wilbur to Charlotte',
      '🎨 Draw your favorite scene from the barnyard'
    ]
  },
  'wonder': {
    id: 'wonder-fallback',
    title: 'Wonder',
    author: 'R.J. Palacio',
    summary: 'August Pullman was born with facial differences that have prevented him from going to a mainstream school. Now he\'s starting 5th grade at Beecher Prep, and he just wants to be treated like an ordinary kid.',
    coverImage: wonderCover,
    arLevel: '4.8',
    gradeLevel: '3-7',
    pageCount: 310,
    year: 2012,
    bannedBook: false,
    vocabulary: ['ordinary', 'precept', 'augment', 'kindness', 'perspective'],
    comprehensionSkill: 'Point of View',
    strategyTip: 'This book is told from different characters\' perspectives. Notice how each person sees Auggie differently!',
    questions: [
      '🔵 Why hasn\'t Auggie been to regular school before?',
      '🟢 How do you think Auggie feels on his first day? What clues tell you this?',
      '🟢 Why is it important that we hear from different characters?'
    ],
    predictions: [
      'What challenges might Auggie face at his new school?',
      'How might other kids react when they first see Auggie?'
    ],
    activities: [
      '🎭 Role-play meeting someone new at school',
      '📝 Write your own precept (rule to live by)',
      '💭 Draw how you think different characters see Auggie'
    ]
  },
  'harry': {
    id: 'harry-fallback',
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J.K. Rowling',
    summary: 'Harry Potter discovers he\'s a wizard on his 11th birthday and attends Hogwarts School of Witchcraft and Wizardry, where he learns about his past and confronts the dark wizard who killed his parents.',
    coverImage: undefined, // Will use placeholder
    arLevel: '5.5',
    gradeLevel: '4-6',
    pageCount: 309,
    year: 1997,
    bannedBook: true,
    vocabulary: ['sorcerer', 'muggle', 'transfiguration', 'quidditch', 'persecution'],
    comprehensionSkill: 'Character Development',
    strategyTip: 'Watch how Harry changes from the beginning to the end. What experiences help him grow?',
    questions: [
      '🔵 What makes Harry special in the wizarding world?',
      '🟢 How does Harry\'s life with the Dursleys affect who he becomes?',
      '🟢 What does the story teach us about friendship and bravery?'
    ],
    predictions: [
      'What do you think will happen when Harry discovers he\'s a wizard?',
      'What challenges might Harry face at his new school?'
    ],
    activities: [
      '🎨 Design your own house crest for Hogwarts',
      '✍️ Write a letter like the ones Harry receives',
      '🎭 Act out your favorite magical scene'
    ]
  },
  'holes': {
    id: 'holes-fallback',
    title: 'Holes',
    author: 'Louis Sachar',
    summary: 'Stanley Yelnats is sent to Camp Green Lake, a detention center where boys dig holes all day. As Stanley digs, he uncovers the truth about the camp and his family\'s curse.',
    coverImage: undefined, // Will use placeholder
    arLevel: '4.6',
    gradeLevel: '5-8',
    pageCount: 233,
    year: 1998,
    bannedBook: false,
    vocabulary: ['desolate', 'excavate', 'destiny', 'generation', 'persistent'],
    comprehensionSkill: 'Plot Structure',
    strategyTip: 'Notice how past and present stories connect. Pay attention to how different plot lines come together!',
    questions: [
      '🔵 Why are the boys really digging holes?',
      '🟢 How are Stanley\'s story and his great-grandfather\'s story connected?',
      '🟢 What does the book teach about justice and fairness?'
    ],
    predictions: [
      'Why might a camp be called "Green Lake" when there\'s no lake?',
      'What do you think the boys are really looking for?'
    ],
    activities: [
      '🗺️ Create a map of Camp Green Lake',
      '📝 Write a diary entry as Stanley',
      '🎨 Draw what you think is buried in the desert'
    ]
  }
};