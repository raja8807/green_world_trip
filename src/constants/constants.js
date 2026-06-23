// SERVICES

// CLIENTS

// CAREERS

// TERMS AND CONDITION

// BOOK ONLINE

// CONTACT

// CAR RENTAL

// EMPLOYEE TRANPORTATION

// EVENT MANAGEMENT

// INBOUND AND OUTBOUND TOURS

export const PAGES = [
  { title: "Home", href: "/" },
  {
    title: "Company",
    href: "/company",
  },
  {
    title: "Tours",

    dropdown: [
      {
        title: "Domestic",
        href: "/domestic",
      },
      {
        title: "International",
        href: "/international",
      },
    ],
  },
  {
    title: "Honey Moon",
    href: "/honeymoon",
  },
  {
    title: "Group Tours",
    href: "/group-tours",
  },

  { title: "India", href: "/india" },
  { title: "Contact", href: "/contact" },
];

export const POPULAR_DESTINATIONS = [
  { name: "Kerala", href: "/domestic" },
  { name: "Goa", href: "/domestic" },
  { name: "Himachal Pradesh", href: "/domestic" },
  { name: "Dubai", href: "/international" },
  { name: "Singapore", href: "/international" },
  { name: "Maldives", href: "/international" },
];

export const BLOG_POSTS = [
  {
    id: 1,
    title: "Top 10 Essential Travel Tips for First-Time Travelers",
    author: "touriza",
    tags: ["Ocean", "Railway"],
    image: "/blog/blog-1.jpg",
    highlightTitle: false,
  },
  {
    id: 2,
    title: "International Travel Checklist What You Must Not Forget",
    author: "touriza",
    tags: ["Mountain", "Travel"],
    image: "/blog/blog-2.jpg",
    highlightTitle: false,
  },
  {
    id: 3,
    title: "Budget Travel Tips How to Explore More by Spending Less",
    author: "touriza",
    tags: ["Ocean", "River"],
    image: "/blog/blog-3.jpg",
    highlightTitle: true,
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Mr. Samuel Surrender",
    location: "Chennai – Flight Ticketing",
    text: "Amigos Business Solutions handled my international flight bookings with exceptional care. Their team provided timely updates and ensured I had the best options available. I felt valued and supported throughout my journey.",
  },
  {
    id: 2,
    name: "Mr. Damodharan",
    location: "Chennai – Tour Package",
    text: "I chose their Europe tour package, and it exceeded my expectations. The itinerary was thoughtfully curated, accommodations were top-notch, and every detail was handled with professionalism and warmth.",
  },
  {
    id: 3,
    name: "Mr. Manoharan",
    location: "Chennai – Visa Processing",
    text: "Visa formalities can be daunting, but Amigos Business Solutions made the entire process seamless. Their guidance, attention to detail, and quick documentation helped me obtain my visa stress-free.",
  },
  {
    id: 4,
    name: "Mr. Micheal",
    location: "Chennai – Flight Ticketing",
    text: "I was impressed with their swift response and personalized service while booking my business-class flights. Their team understands the nuances of premium travel and delivers exactly what is needed.",
  },
  {
    id: 5,
    name: "Mrs. Mercy Ravindaran",
    location: "Chennai – Tour Package",
    text: "Traveling with Amigos Business Solutions was an experience filled with comfort and elegance. From airport transfers to hotel stays, everything was perfectly arranged, making it a truly memorable holiday.",
  },
  {
    id: 6,
    name: "Mrs. Celina Jani",
    location: "Coimbatore – Visa Processing",
    text: "Thanks to the expert team at Amigos Business Solutions, my visa paperwork for a European trip was processed quickly and without hassle. Their professionalism and support made all the difference.",
  },
  {
    id: 7,
    name: "Mr. Ranjith",
    location: "Australia – Tour Package",
    text: "Exploring Australia through Amigos Business Solutions was an absolute delight. The curated experiences, expert guides, and seamless arrangements made it a luxurious and enriching journey I’ll always cherish.",
  },
  {
    id: 8,
    name: "Dr. Ramesh",
    location: "Kariakudi – Tour Package (Japan Tour)",
    text: "The Japan tour package was organized impeccably. Amigos Business Solutions ensured I had cultural insights, smooth travel arrangements, and excellent hospitality at every stage of the trip.",
  },
  {
    id: 9,
    name: "Dr. Veeramani",
    location: "Karaikal – Tour Package",
    text: "From start to finish, my experience with Amigos Business Solutions was flawless. Every hotel, tour spot, and transfer was well-planned, allowing me to fully enjoy the sights without any worries.",
  },
  {
    id: 10,
    name: "Mrs. Sridevi",
    location: "Chennai – Visa Processing (Canada Visa)",
    text: "Applying for a Canada visa felt effortless thanks to the Amigos Business Solutions team. They handled everything with precision and care, guiding me through the complex process and ensuring all requirements were met.",
  },
];

export const COMPANY_STATS = [
  { id: 1, value: "100+", label: "packages" },
  { id: 2, value: "2k+", label: "destination" },
  { id: 3, value: "300+", label: "destinations" },
  { id: 4, value: "40k+", label: "booking" },
];

export const LEADERSHIP_TEAM = [
  {
    id: 1,
    name: "David Allen",
    role: "CEO",
    image: "/assets/placeholder-avatar.jpg",
  },
  {
    id: 2,
    name: "David Parker",
    role: "COO",
    image: "/assets/placeholder-avatar.jpg",
  },
  {
    id: 3,
    name: "Sarah Neil",
    role: "General Manager",
    image: "/assets/placeholder-avatar.jpg",
  },
  {
    id: 4,
    name: "Charles Longton",
    role: "Sales Target",
    image: "/assets/placeholder-avatar.jpg",
  },
];

export const TOUR_CATEGORIES = [
  {
    id: 1,
    title: "Domestic Tours",
    subtitle: "BOOK TODAY",
    offer: "Save Up to 30% on Next Adventure!",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
    colLg: 4,
    colMd: 6,
    delay: 0,
    href: "/domestic",
  },
  {
    id: 2,
    title: "International Tours",
    subtitle: "BOOK TODAY",
    offer: "Save Up to 30% on Next Adventure!",
    image:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1420&q=80",
    colLg: 4,
    colMd: 6,
    delay: 100,
    href: "/international",
  },
  {
    id: 3,
    title: "Honeymoon ",
    subtitle: "BOOK TODAY",
    offer: "Save Up to 30% on Next Adventure!",
    image:
      "https://images.unsplash.com/photo-1504681869696-d977211a5f4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1452&q=80",
    colLg: 4,
    colMd: 12,
    delay: 200,
    href: "/honeymoon",
  },
];

export const DOMESTIC_REGIONS = [
  {
    region: "North India",
    states: [
      "Agra",
      "Amritsar",
      "Ayodhya",
      "Chandigarh",
      "Delhi",
      "Gulmarg",
      "Haridwar & Rishikesh",
      "Himachal Pradesh",
      "Jaipur",
      "Jaisalmer",
      "Jammu and Kashmir",
      "Ladakh",
      "Lucknow",
      "Manali",
      "Mussoorie",
      "Nainital",
      "Pahalgam",
      "Shimla",
      "Srinagar",
      "Uttarakhand",
      "Varanasi",
      "Vrindavan",
    ],
  },
  {
    region: "South India",
    states: [
      "Alleppey",
      "Araku Valley",
      "Bangalore",
      "Chennai",
      "Chettinad",
      "Coorg",
      "Hyderabad",
      "Kanyakumari",
      "Karnataka",
      "Kerala",
      "Kochi",
      "Madurai",
      "Munnar",
      "Mysore",
      "Ooty",
      "Rameswaram",
      "Tamil Nadu",
      "Thekkady",
      "Tirupati",
      "Vizag",
      "Wayanad",
    ],
  },
  {
    region: "East India",
    states: [
      "Bihar",
      "Darjeeling",
      "Jharkhand",
      "Kolkata",
      "Odisha",
      "Puri",
      "West Bengal",
    ],
  },
  {
    region: "West India",
    states: [
      "Ahmedabad",
      "Goa",
      "Gujarat",
      "Jodhpur",
      "Mahabaleshwar",
      "Maharashtra",
      "Mumbai",
      "Nashik",
      "Pune",
      "Rajasthan",
      "Shirdi",
      "Udaipur",
    ],
  },
  {
    region: "North East",
    states: [
      "Arunachal Pradesh",
      "Assam",
      "Gangtok",
      "Guwahati",
      "Manipur",
      "Meghalaya",
      "Pelling",
      "Shillong",
      "Sikkim",
      "Tawang",
    ],
  },
  {
    region: "Central India",
    states: [
      "Bhopal",
      "Chhattisgarh",
      "Gwalior",
      "Indore",
      "Madhya Pradesh",
      "Pachmarhi",
      "Ujjain",
    ],
  },
  {
    region: "Spiritual",
    states: ["Ayodhya", "kasi"],
  },
];
