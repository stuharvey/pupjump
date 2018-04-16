/*
--- 
Book schema
---

bookId: {
  title: string.isRequired,
  link: string, // amazon/goodreads link to book
  description: string,
  stars: number,
  status: oneOf(['reading', 'read', 'interested', 'unfinished']),
  year: number, // year book was read
  _id: string,
}
*/

export default [
  {
    id: 'oathbringer',
    title: 'Oathbringer',
    author: 'Brandon Sanderson',
    yearRead: 2017,
    description: '-',
    stars: 4,
    status: 'read',
  },
  {
    id: 'threebody',
    title: 'Three Body Problem',
    author: 'Cixin Liu',
    yearRead: 2018,
    description: 'Excellent Chinese sci-fi',
    stars: 5,
    status: 'read',
  },
  {
    id: 'darkforest',
    title: 'The Dark Forest',
    author: 'Cixin Liu',
    yearRead: 2018,
    description: 'Second in the Three Body Problem Trilogy',
    status: 'reading',
  },
  {
    id: 'nukes',
    title: 'How the End Begins: The Road to Nuclear World War 3',
    author: '?',
    yearRead: 2017,
    description: `
      All too relevant overview of the history of nuclear armament and the
      present-day "flash zones"
    `,
    status: 'unfinished',
    stars: 4,
  },
  
];
