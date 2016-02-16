const ngNl = {
  id: '1',
  name: 'NG-NL',
  description: 'Angular conf',
  date: '2016-02-18',
  attendance: 120,
  userIsAttending: true,
  location: 'Amsterdam',
};
const reactEurope = {
  id: '2',
  name: 'ReactEurope 2016',
  description: 'The original EU React conf',
  date: '2016-06-02',
  attendance: 250,
  userIsAttending: false,
  location: 'Paris',
};
const empireJS = {
  id: '3',
  name: 'EmpireJS 2016',
  description: 'JS Conf in NY',
  date: '2016-06-25',
  attendance: 450,
  userIsAttending: true,
  location: 'New York',
};

const ngEurope = {
  id: '4',
  name: 'NG-Europe',
  description: 'Original EU NG conf',
  date: '2016-10-25',
  attendance: 99,
  userIsAttending: false,
  location: 'Paris',
};

const angularConnect = {
  id: '5',
  name: 'Angular Connect',
  description: 'Official EU NG conf',
  date: '2016-09-27',
  attendance: 338,
  userIsAttending: false,
  location: 'London',
};

const scotlandJs = {
  id: '6',
  name: 'ScotlandJs',
  description: 'JS in Scotland',
  date: '2016-06-02',
  attendance: 60,
  userIsAttending: true,
  location: 'Edinburgh',
};

const conferences = {
  1: ngNl,
  2: reactEurope,
  3: empireJS,
  4: ngEurope,
  5: angularConnect,
  6: scotlandJs,
};

const theOnlyUser = {
  id: '1',
  firstName: 'Lisa',
  lastName: 'Simpson',
  dob: '19-04-1987',
  attendingConferences: ['1', '3', '6'],
};

export function getUser() {
  return theOnlyUser;
}

export function getConference(id) {
  return conferences[id];
}

export function leaveConference(id) {
  conferences[id].attendance--;
  conferences[id].userIsAttending = false;
  const index = theOnlyUser.attendingConferences.indexOf(id);
  theOnlyUser.attendingConferences.splice(index, 1);
}
export function attendConference(id) {
  conferences[id].attendance++;
  conferences[id].userIsAttending = true;
  theOnlyUser.attendingConferences.push(id);
}

export function getAvailableConferences() {
  return Object.keys(conferences).map((id) => conferences[id]);
}
