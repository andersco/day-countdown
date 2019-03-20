import moment from 'moment';
import uuid from 'uuid';

const api = __DEV__ ? "10.0.2.2:19003" : 'productionurl.com';
const url = `http://${api}/events`;

export function getEvents() {
    return fetch(url)
        .then(response => response.json())
        .then(events => events.map(e => ({ ...e, date: new Date(e.date) })))
        .catch(err => console.log(err));
}

export function saveEvent({title, date}) {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            title,
            date,
            id: uuid()
        }),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }).then(res => res.json())
    .catch(err => console.log(err));
}

export function formatDate(dateString) {
    const parsed = moment(new Date(dateString));

    if (!parsed.isValid()) {
        return dateString;
    }

    return parsed.format('D MMM YYYY');
}

export function formatDateTime(dateString) {
    const parsed = moment(new Date(dateString));

    if (!parsed.isValid()) {
        return dateString;
    }

    return parsed.format('H A On D MMM YYYY');
}

export function getCountdownParts(eventDate) {
    const duration = moment.duration(moment(new Date(eventDate)).diff(new Date()));
    return {
        days: parseInt(duration.as('days')),
        hours: duration.get('hours'),
        minutes: duration.get('minutes'),
        seconds: duration.get('seconds')
    };
}