export type HelpTopic = {
  id: string;
  title: string;
  summary: string;
  icon: 'help' | 'document' | 'person' | 'clock' | 'mail';
  body: { heading?: string; paragraphs: string[] }[];
};

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: 'faq',
    title: 'Frequently asked questions',
    summary: 'Find answers to common questions',
    icon: 'help',
    body: [
      {
        heading: 'How does matching work?',
        paragraphs: [
          'Scholarship Connect compares the profile you save with the catalogue on this device. A scholarship is listed for you when its country is one you selected and your current degree fits the level it asks for.',
          'Doctoral awards stay out of the match until your profile includes a master’s degree.',
        ],
      },
      {
        heading: 'Does this send the whole application?',
        paragraphs: [
          'The app sends the initial application using the profile, academic history, and countries you saved. If an institution asks for interviews or extra documents, you finish those on the official scholarship page.',
        ],
      },
      {
        heading: 'Where is my information kept?',
        paragraphs: [
          'In this preview, your account, profile, and applications stay on this device. They are not sent to a Scholarship Connect server.',
        ],
      },
    ],
  },
  {
    id: 'apply',
    title: 'How to apply',
    summary: 'Step-by-step application guide',
    icon: 'document',
    body: [
      {
        heading: 'From profile to submission',
        paragraphs: [
          '1. Create an account and agree to the privacy note.',
          '2. Add your photo, identity, academic history, languages, test scores, and CV if you have one.',
          '3. Choose the countries where you want to study.',
          '4. Open Scholarships for you and read a match, or tap Apply to all eligible.',
          '5. Confirm the list. The app submits each initial application and shows the result on Application progress.',
          '6. Track every file from the Applications tab.',
        ],
      },
    ],
  },
  {
    id: 'profile',
    title: 'Managing your profile',
    summary: 'Update your information',
    icon: 'person',
    body: [
      {
        heading: 'What to keep current',
        paragraphs: [
          'Your degree, institution, grades, graduation year, nationality, and country list decide which scholarships appear. Edit them from Profile & settings.',
          'Test scores and a CV are optional. They are stored with your profile so a later application can include them.',
          'Changing countries and saving runs the match again.',
        ],
      },
    ],
  },
  {
    id: 'status',
    title: 'Application status',
    summary: 'Understanding your application status',
    icon: 'clock',
    body: [
      {
        heading: 'What each status means',
        paragraphs: [
          'Pending means the application is queued on this device.',
          'Submitting means Scholarship Connect is sending it now.',
          'Submitted means the initial application was sent.',
          'In review means the institution has the file.',
          'Accepted and Rejected are final decisions recorded on the application.',
          'Failed means the send did not finish. Open the application and retry.',
        ],
      },
    ],
  },
  {
    id: 'contact',
    title: 'Contact support',
    summary: 'Get in touch with our team',
    icon: 'mail',
    body: [
      {
        heading: 'Chat with the team',
        paragraphs: [
          'Open Chat to ask about a country, a deadline, or an application status. Replies in this preview are handled in the app.',
          'For the official rules of a scholarship, use the link on its detail page.',
        ],
      },
    ],
  },
];
