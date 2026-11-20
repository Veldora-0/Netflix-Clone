import { QuizQuestionInternal, QuizQuestionPublic } from '../types';

export const quizQuestions: QuizQuestionInternal[] = [
  {
    id: 'q-1',
    question: 'In the movie "Inception", what spinning object serves as Cobb’s totem to determine if he is in reality or a dream?',
    options: [
      { id: 'opt-a', text: 'A loaded die' },
      { id: 'opt-b', text: 'A small pewter spinning top' },
      { id: 'opt-c', text: 'A poker chip' },
      { id: 'opt-d', text: 'A silver coin' },
    ],
    correctOptionId: 'opt-b',
    explanation: 'Cobb uses a small brass/pewter spinning top that belonged to his late wife Mal to test if he is in a dream.',
  },
  {
    id: 'q-2',
    question: 'Which film won the Academy Award for Best Picture at the 92nd Academy Awards (2020), becoming the first non-English language film to do so?',
    options: [
      { id: 'opt-a', text: '1917' },
      { id: 'opt-b', text: 'Roma' },
      { id: 'opt-c', text: 'Parasite' },
      { id: 'opt-d', text: 'The Irishman' },
    ],
    correctOptionId: 'opt-c',
    explanation: 'Bong Joon-ho’s South Korean masterpiece "Parasite" made Oscars history by winning both International Feature and Best Picture.',
  },
  {
    id: 'q-3',
    question: 'Who composed the iconic, heart-pounding score for Christopher Nolan’s space epic "Interstellar"?',
    options: [
      { id: 'opt-a', text: 'Hans Zimmer' },
      { id: 'opt-b', text: 'John Williams' },
      { id: 'opt-c', text: 'Ennio Morricone' },
      { id: 'opt-d', text: 'Ludwig Göransson' },
    ],
    correctOptionId: 'opt-a',
    explanation: 'Hans Zimmer composed the iconic organ-heavy score, recorded primarily at Temple Church in London.',
  },
  {
    id: 'q-4',
    question: 'What is the highest-grossing film of all time globally at the worldwide box office (unadjusted for inflation)?',
    options: [
      { id: 'opt-a', text: 'Avengers: Endgame' },
      { id: 'opt-b', text: 'Avatar' },
      { id: 'opt-c', text: 'Titanic' },
      { id: 'opt-d', text: 'Star Wars: The Force Awakens' },
    ],
    correctOptionId: 'opt-b',
    explanation: 'James Cameron’s "Avatar" (2009) remains the highest-grossing film with over $2.9 billion worldwide.',
  },
  {
    id: 'q-5',
    question: 'Which actor portrayed the unforgettable character Tyler Durden in David Fincher’s 1999 cult classic "Fight Club"?',
    options: [
      { id: 'opt-a', text: 'Edward Norton' },
      { id: 'opt-b', text: 'Brad Pitt' },
      { id: 'opt-c', text: 'Christian Bale' },
      { id: 'opt-d', text: 'Keanu Reeves' },
    ],
    correctOptionId: 'opt-b',
    explanation: 'Brad Pitt played soap salesman Tyler Durden opposite Edward Norton’s unnamed Narrator.',
  },
  {
    id: 'q-6',
    question: 'In the Matrix franchise, what color pill must Neo swallow to awaken into the desert of the real world?',
    options: [
      { id: 'opt-a', text: 'The Red Pill' },
      { id: 'opt-b', text: 'The Blue Pill' },
      { id: 'opt-c', text: 'The Green Pill' },
      { id: 'opt-d', text: 'The Yellow Pill' },
    ],
    correctOptionId: 'opt-a',
    explanation: 'Morpheus offers Neo the choice: take the blue pill and wake up in bed believing whatever he wants, or take the red pill and see how deep the rabbit hole goes.',
  },
  {
    id: 'q-7',
    question: 'Which director is renowned for masterminding "Pulp Fiction", "Kill Bill", and "Inglourious Basterds"?',
    options: [
      { id: 'opt-a', text: 'Martin Scorsese' },
      { id: 'opt-b', text: 'Stanley Kubrick' },
      { id: 'opt-c', text: 'Quentin Tarantino' },
      { id: 'opt-d', text: 'Denis Villeneuve' },
    ],
    correctOptionId: 'opt-c',
    explanation: 'Quentin Tarantino wrote and directed all three celebrated nonlinear cinema benchmarks.',
  },
  {
    id: 'q-8',
    question: 'In Ridley Scott’s sci-fi masterpiece "Blade Runner" (1982), what are the genetically engineered synthetic humans called?',
    options: [
      { id: 'opt-a', text: 'Cylons' },
      { id: 'opt-b', text: 'Synthetics' },
      { id: 'opt-c', text: 'Replicants' },
      { id: 'opt-d', text: 'Androids' },
    ],
    correctOptionId: 'opt-c',
    explanation: 'The Tyrell Corporation manufactures synthetic humans known as "Replicants", such as Roy Batty and Rachael.',
  },
  {
    id: 'q-9',
    question: 'What is the name of the fictional African kingdom ruled by T’Challa in Marvel Studios’ "Black Panther"?',
    options: [
      { id: 'opt-a', text: 'Genosha' },
      { id: 'opt-b', text: 'Wakanda' },
      { id: 'opt-c', text: 'Latveria' },
      { id: 'opt-d', text: 'Themyscira' },
    ],
    correctOptionId: 'opt-b',
    explanation: 'Wakanda is an isolationist, technologically advanced nation powered by Vibranium.',
  },
  {
    id: 'q-10',
    question: 'Which animated classic features the memorable song "Hakuna Matata" produced by Elton John and Tim Rice?',
    options: [
      { id: 'opt-a', text: 'Aladdin' },
      { id: 'opt-b', text: 'The Lion King' },
      { id: 'opt-c', text: 'Tarzan' },
      { id: 'opt-d', text: 'Beauty and the Beast' },
    ],
    correctOptionId: 'opt-b',
    explanation: '"Hakuna Matata" ("no worries" in Swahili) was sung by Timon, Pumbaa, and Simba in Disney’s 1994 "The Lion King".',
  },
];

export function getPublicQuizQuestions(): QuizQuestionPublic[] {
  return quizQuestions.map(({ id, question, options }) => ({
    id,
    question,
    options,
  }));
}
