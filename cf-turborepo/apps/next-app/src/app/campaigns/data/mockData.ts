// Категории базирани на хаштаговете от системата
export const campaignCategories = [
  {
    id: 'treatment',
    title: 'Медицински',
    image: '/images/categories/medical.jpg',
    link: '/campaigns/all?category=treatment',
    tags: ['treatment', 'therapy', 'rehabilitation', 'medicalequipment', 'medicalsupplies']
  },
  {
    id: 'education',
    title: 'Образование',
    image: '/images/categories/education.jpg',
    link: '/campaigns/all?category=education',
    tags: ['education', 'educationalinitiative', 'educationalmeetings', 'educationalcontent']
  },
  {
    id: 'events',
    title: 'Събития',
    image: '/images/categories/events.jpg',
    link: '/campaigns/all?category=events',
    tags: ['event', 'charityevent', 'sportsevent', 'communityevents']
  },
  {
    id: 'research',
    title: 'Научни изследвания',
    image: '/images/categories/research.jpg',
    link: '/campaigns/all?category=research',
    tags: ['research', 'clinicaltrials', 'scientificresults', 'medicaldiscoveries']
  },
  {
    id: 'support',
    title: 'Подкрепа',
    image: '/images/categories/support.jpg',
    link: '/campaigns/all?category=support',
    tags: ['support']
  },
  {
    id: 'donate',
    title: 'Дарения',
    image: '/images/categories/donate.jpg',
    link: '/campaigns/all?category=donate',
    tags: ['donate']
  },
  {
    id: 'charity',
    title: 'Благотворителност',
    image: '/images/categories/charity.jpg',
    link: '/campaigns/all?category=charity',
    tags: ['charity']
  },
  {
    id: 'volunteer',
    title: 'Доброволчество',
    image: '/images/categories/volunteer.jpg',
    link: '/campaigns/all?category=volunteer',
    tags: ['volunteer']
  },
  {
    id: 'fundraising',
    title: 'Набиране на средства',
    image: '/images/categories/fundraising.jpg',
    link: '/campaigns/all?category=fundraising',
    tags: ['fundraising']
  },
  {
    id: 'cysticfibrosis',
    title: 'Кистична фиброза',
    image: '/images/categories/cysticfibrosis.jpg',
    link: '/campaigns/all?category=cysticfibrosis',
    tags: ['cysticfibrosis', '65roses']
  },
  {
    id: 'physiotherapy',
    title: 'Физиотерапия',
    image: '/images/categories/physiotherapy.jpg',
    link: '/campaigns/all?category=physiotherapy',
    tags: ['physiotherapy', 'breathingexercises']
  },
  {
    id: 'qualityoflife',
    title: 'Качество на живот',
    image: '/images/categories/qualityoflife.jpg',
    link: '/campaigns/all?category=qualityoflife',
    tags: ['qualityoflife', 'lunghealth']
  },
  {
    id: 'emergencyhelp',
    title: 'Спешна помощ',
    image: '/images/categories/emergencyhelp.jpg',
    link: '/campaigns/all?category=emergencyhelp',
    tags: ['emergencyhelp']
  },
  {
    id: 'financialsupport',
    title: 'Финансова подкрепа',
    image: '/images/categories/financialsupport.jpg',
    link: '/campaigns/all?category=financialsupport',
    tags: ['financialsupport', 'medicalexpenses']
  },
  {
    id: 'transparency',
    title: 'Прозрачност',
    image: '/images/categories/transparency.jpg',
    link: '/campaigns/all?category=transparency',
    tags: ['transparency', 'accountability']
  }
];

// Примерни отзиви
export const testimonials = [
  {
    id: '1',
    name: 'Иван Петров',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    rating: 5,
    text: 'Невероятна кауза! Радвам се, че мога да допринеса за подобряването на живота на децата с кистична фиброза. Процесът на даряване беше много лесен и удобен.',
    date: '12.03.2023'
  },
  {
    id: '2',
    name: 'Мария Иванова',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    rating: 5,
    text: 'Много съм впечатлена от работата на асоциацията и от прозрачността при използването на даренията. Продължавайте да помагате на хората с кистична фиброза!',
    date: '05.05.2023'
  },
  {
    id: '3',
    name: 'Георги Димитров',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    rating: 4,
    text: 'Чудесна организация с ясна мисия. Хареса ми, че мога да видя точно за какво отиват средствата и как се използват. Бих препоръчал на всеки да подкрепи тези кампании.',
    date: '21.07.2023'
  }
]; 