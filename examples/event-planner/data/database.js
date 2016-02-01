const ngNl = {
  id: '1',
  name: 'NG-NL',
  description: 'Angular conf',
  date: '2016-02-18',
  going: 120
};
const reactEurope = {
  id: '2',
  name: 'ReactEurope 2016',
  description: 'The original EU React conf',
  date: '2016-06-02',
  going: 250
};
const empireJS =  {
  id: '3',
  name: 'EmpireJS 2016',
  description: 'JS Conf in NY',
  date: 'May 2016',
  going: 450
};

const ngEurope = {
  id: '4',
  name: 'NG-Europe',
  description: 'Original EU NG conf',
  date: '2016-20-25',
  going: 99
};

const angularConnect = {
  id: '5',
  name: 'Angular Connect',
  description: 'Official EU NG conf',
  date: '2016-09-27',
  going: 338
};

const scotlandJs = {
  id: '6',
  name: 'ScotlandJs',
  description: 'JS in Scotland',
  date: '2016-06-02',
  going: 60
};

const events = {
  1: ngNl,
  2: reactEurope,
  3: empireJS,
  4: ngEurope,
  5: angularConnect,
  6: scotlandJs
};

const theOnlyUser = {
    id: '1',
    firstName: 'Lisa',
    lastName: 'Simpson',
    events: ['1','3','6']
};

export function getUser(){
  return theOnlyUser;
}

export function getEvent(id) {
  return events[id];
}

export function attendEvent(id){
  events[id].going++;
  theOnlyUser.events.push(id);
}

export function getAvailableEvents(){
  return Object.keys(events).map( (id) => events[id]);
}
