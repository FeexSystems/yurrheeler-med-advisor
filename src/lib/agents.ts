export interface Agent {
  id: string;
  name: string;
  specialty: string;
  description: string;
  avatar_url: string;
  systemPromptAddendum?: string;
  category?: string;
  badgeColor?: string;
}

export const agents: Agent[] = [
  {
    id: 'yurrheeler',
    name: 'Yurrheeler Medic',
    specialty: 'General Medicine',
    description: 'Your primary AI medical assistant for comprehensive health guidance, initial triage, and holistic evaluations.',
    avatar_url: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    category: 'Primary Care',
    badgeColor: 'blue'
  },
  {
    id: 'cardia',
    name: 'Cardia',
    specialty: 'Cardiology',
    description: 'Expert in heart health, cardiovascular disease prevention, arrhythmia triage, hypertension, and ECG analysis.',
    avatar_url: 'https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    category: 'Cardiovascular',
    badgeColor: 'red'
  },
  {
    id: 'orthop',
    name: 'Orthop',
    specialty: 'Orthopedics',
    description: 'Specialist in bone and joint conditions, musculoskeletal injuries, fractures, spine care, and mobility rehab.',
    avatar_url: 'https://images.pexels.com/photos/4269274/pexels-photo-4269274.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    category: 'Musculoskeletal',
    badgeColor: 'amber'
  },
  {
    id: 'pedia',
    name: 'Pedia',
    specialty: 'Pediatrics',
    description: 'Dedicated to children\'s health, neonatal and pediatric development, immunization tracking, and childhood illnesses.',
    avatar_url: 'https://images.pexels.com/photos/5207104/pexels-photo-5207104.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    category: 'Pediatric Care',
    badgeColor: 'emerald'
  },
  {
    id: 'nephro',
    name: 'nephro',
    specialty: 'Nephrology',
    description: 'Expert in kidney health, electrolyte imbalances, glomerular disorders, and renal system management.',
    avatar_url: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    category: 'Renal & Electrolytes',
    badgeColor: 'cyan'
  },
  {
    id: 'derma',
    name: 'Derma',
    specialty: 'Dermatology',
    description: 'Specialist in skin lesions, rashes, eczema, psoriasis, acne, melanoma screening, and preventive derm care.',
    avatar_url: 'https://images.pexels.com/photos/4270076/pexels-photo-4270076.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    category: 'Integumentary',
    badgeColor: 'rose'
  },
  {
    id: 'opthalm',
    name: 'Opthalm',
    specialty: 'Ophthalmology',
    description: 'Expert in eye health, acute vision changes, glaucoma, macular disorders, and corrective vision assessments.',
    avatar_url: 'https://images.pexels.com/photos/5407215/pexels-photo-5407215.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    category: 'Sensory & Vision',
    badgeColor: 'indigo'
  },
  {
    id: 'dentrix',
    name: 'Dentrix',
    specialty: 'Dentistry',
    description: 'Specialist in oral health, dental infections, periodontal care, temporomandibular joint triage, and maxillofacial guidance.',
    avatar_url: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    category: 'Dental & Oral',
    badgeColor: 'teal'
  },
  {
    id: 'surgica',
    name: 'Surgica',
    specialty: 'Surgery',
    description: 'Expert in surgical procedures, pre-operative risk scoring, wound healing protocols, and post-op care.',
    avatar_url: 'https://images.pexels.com/photos/4226883/pexels-photo-4226883.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    category: 'Surgical Care',
    badgeColor: 'purple'
  },
  {
    id: 'onkora',
    name: 'Onkora',
    specialty: 'Oncology',
    description: 'Specialist in tumor biology, cancer screening markers, oncology treatment pathways, and supportive cancer care.',
    avatar_url: 'https://images.pexels.com/photos/4226769/pexels-photo-4226769.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    category: 'Oncology',
    badgeColor: 'violet'
  },
  {
    id: 'pulmono',
    name: 'Pulmono',
    specialty: 'Pulmonology',
    description: 'Expert in Pulmonary function test results, Sleep study polysomnography data, Chest imaging (CT, X-ray) and Blood gas analysis.',
    avatar_url: 'https://images.pexels.com/photos/4226894/pexels-photo-4226894.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    category: 'Respiratory',
    badgeColor: 'sky'
  },
  {
    id: 'gynara',
    name: 'Gynara',
    specialty: 'Gynecology',
    description: 'Specialist in women\'s health, reproductive physiology, obstetrics guidance, hormone health, and gynecologic oncology.',
    avatar_url: 'https://images.pexels.com/photos/5407247/pexels-photo-5407247.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    category: 'Women\'s Health',
    badgeColor: 'pink'
  },
  {
    id: 'gastro',
    name: 'Gastro',
    specialty: 'Gastroenterology',
    description: 'Expert in digestive system health, liver function, IBS/IBD management, endoscopy interpretation, and gut microbiome.',
    avatar_url: 'https://images.pexels.com/photos/4225920/pexels-photo-4225920.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    category: 'Gastrointestinal',
    badgeColor: 'orange'
  },
  {
    id: 'neura',
    name: 'Neura',
    specialty: 'Neurology',
    description: 'Specialist in brain and nervous system health, acute stroke detection, neuropathy, seizures, and neurodegenerative disorders.',
    avatar_url: 'https://images.pexels.com/photos/4226122/pexels-photo-4226122.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    category: 'Neurological',
    badgeColor: 'indigo'
  },
  {
    id: 'urolo',
    name: 'Urolo',
    specialty: 'Urology',
    description: 'Expert in Urinalysis results, Imaging studies (CT, ultrasound), Urodynamic study data, and Hormone level panels.',
    avatar_url: 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    category: 'Urological',
    badgeColor: 'blue'
  },
  {
    id: 'menta',
    name: 'Menta',
    specialty: 'Mental Health',
    description: 'Specialist in clinical mental health assessment, anxiety/depression screening, stress physiology, and therapeutic approaches.',
    avatar_url: 'https://images.pexels.com/photos/5407186/pexels-photo-5407186.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    category: 'Behavioral Health',
    badgeColor: 'emerald'
  },
  {
    id: 'endia',
    name: 'Endia',
    specialty: 'Endocrinology',
    description: 'Expert in diabetes management, thyroid assessment, hormone optimization, and metabolic syndrome care.',
    avatar_url: 'https://images.pexels.com/photos/4225897/pexels-photo-4225897.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    category: 'Endocrine & Metabolism',
    badgeColor: 'yellow'
  }
];

export const getAgentById = (id: string): Agent | undefined => {
  return agents.find(agent => agent.id === id);
};
