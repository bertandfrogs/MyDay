// Modified from Kubessandra's react-google-calendar npm package
// https://www.npmjs.com/package/react-google-calendar-api?activeTab=code

import { googleClientId, googleApiKey, googleApiScope } from "../../google.config";

const scriptSrcGoogle = "https://accounts.google.com/gsi/client";
const scriptSrcGapi = "https://apis.google.com/js/api.js";

export interface TimeCalendarType {
  dateTime?: string;
}

class GoogleCalendarManager {
  onLoadCallback: any = null;
  calendar: string = "primary";
  config = {
    clientId: googleClientId,
    apiKey: googleApiKey,
    scope: googleApiScope,
    discoveryDocs: [
      "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    ],
  };
  access_token: string | undefined;

  constructor(access_token: string | undefined) {
    try {
      this.access_token = access_token;
      this.initGapiClient = this.initGapiClient.bind(this);
      this.createEvent = this.createEvent.bind(this);
      this.listUpcomingEvents = this.listUpcomingEvents.bind(this);
      this.listEvents = this.listEvents.bind(this);
      this.createEventFromNow = this.createEventFromNow.bind(this);
      this.setCalendar = this.setCalendar.bind(this);
      this.updateEvent = this.updateEvent.bind(this);
      this.deleteEvent = this.deleteEvent.bind(this);
      this.getEvent = this.getEvent.bind(this);
      this.handleClientLoad();
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Auth to the google Api.
   */
  private initGapiClient(): void {
    gapi.client
      .init({
        apiKey: this.config.apiKey,
        discoveryDocs: this.config.discoveryDocs
      })
      .then((): void => {
        if (this.access_token) {
          gapi.client.setToken({ access_token: this.access_token });
        }
      })
      .catch((e: any): void => {
        console.log(e);
      });
  }

  /**
   * Init Google Api
   * And create gapi in global
   */
  private handleClientLoad(): void {
    const scriptGoogle = document.createElement("script");
    const scriptGapi = document.createElement("script");
    scriptGoogle.src = scriptSrcGoogle;
    scriptGoogle.async = true;
    scriptGoogle.defer = true;
    scriptGapi.src = scriptSrcGapi;
    scriptGapi.async = true;
    scriptGapi.defer = true;
    document.body.appendChild(scriptGapi);
    document.body.appendChild(scriptGoogle);
    scriptGapi.onload = (): void => {
      gapi.load("client", this.initGapiClient);
    };
  }

  public setAccessToken(access_token: string | undefined) {
    this.access_token = access_token;
    if (this.access_token) {
      gapi.client.setToken({ access_token: this.access_token });
    }
  }

  /**
   * Set the default attribute calendar
   * @param {string} newCalendar
   */
  public setCalendar(newCalendar: string): void {
    this.calendar = newCalendar;
  }

  /**
   * List today's events in the calendar
   * @param {number} maxResults to see
   * @param {string} calendarId to see by default use the calendar attribute
   * @returns {any}
   */
  public listTodayEvents(
    calendarId: string = this.calendar
  ): gapi.client.calendar.Event[] | undefined {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    // Start of tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Convert to ISO string with timezone offset
    const timeMin = today.toISOString();
    const timeMax = tomorrow.toISOString();

    if (gapi) {
      gapi.client.calendar.events.list({
        calendarId: calendarId,
        timeMin: timeMin,
        timeMax: timeMax,
        showDeleted: false,
        singleEvents: true,
        orderBy: "startTime",
      }).then((response: { result: gapi.client.calendar.Events }) => {
        return response.result.items;
      });
    } else {
      console.error("Error: this.gapi not loaded");
      return []
    }
  }

  /**
   * List all events in the calendar
   * @param {number} maxResults to see
   * @param {string} calendarId to see by default use the calendar attribute
   * @returns {any}
   */
  public listUpcomingEvents(
    maxResults: number,
    calendarId: string = this.calendar
  ): any {
    if (gapi) {
      return gapi.client.calendar.events.list({
        calendarId: calendarId,
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: maxResults,
        orderBy: "startTime",
      });
    } else {
      console.error("Error: this.gapi not loaded");
      return false;
    }
  }

  /**
   * List all events in the calendar queried by custom query options
   * See all available options here https://developers.google.com/calendar/v3/reference/events/list
   * @param {object} queryOptions to see
   * @param {string} calendarId to see by default use the calendar attribute
   * @returns {any}
   */
  public listEvents(
    queryOptions: object,
    calendarId: string = this.calendar
  ): any {
    if (gapi) {
      return gapi.client.calendar.events.list({
        calendarId,
        ...queryOptions,
      });
    } else {
      console.error("Error: gapi not loaded");
      return false;
    }
  }

  /**
   * Create an event from the current time for a certain period
   * @param {number} time in minutes for the event
   * @param {string} summary of the event
   * @param {string} description of the event
   * @param {string} calendarId
   * @returns {any}
   */
  public createEventFromNow(
    { time, summary, description = "" }: any,
    calendarId: string = this.calendar
  ): any {
    const event = {
      summary,
      description,
      start: {
        dateTime: new Date().toISOString(),
      },
      end: {
        dateTime: new Date(new Date().getTime() + time * 60000).toISOString(),
      },
    };

    return this.createEvent(event, calendarId);
  }

  /**
   * Create Calendar event
   * @param {string} calendarId for the event.
   * @param {object} event with start and end dateTime
   * @param {string} sendUpdates Acceptable values are: "all", "externalOnly", "none"
   * @returns {any}
   */
  public createEvent(
    event: { end: TimeCalendarType; start: TimeCalendarType },
    calendarId: string = this.calendar,
    sendUpdates: "all" | "externalOnly" | "none" = "none"
  ): any {
    if (gapi.client.getToken()) {
      return gapi.client.calendar.events.insert({
        calendarId: calendarId,
        resource: event,
        //@ts-ignore the @types/gapi.calendar package is not up to date(https://developers.google.com/calendar/api/v3/reference/events/insert)
        sendUpdates,
        conferenceDataVersion: 1,
      });
    } else {
      console.error("Error: this.gapi not loaded");
      return false;
    }
  }

  /**
   * Create Calendar event with video conference
   * @param {string} calendarId for the event.
   * @param {object} event with start and end dateTime
   * @param {string} sendUpdates Acceptable values are: "all", "externalOnly", "none"
   * @returns {any}
   */
  public createEventWithVideoConference(
    event: any,
    calendarId: string = this.calendar,
    sendUpdates: "all" | "externalOnly" | "none" = "none"
  ): any {
    return this.createEvent(
      {
        ...event,
        conferenceData: {
          createRequest: {
            requestId: crypto.randomUUID(),
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      },
      calendarId,
      sendUpdates
    );
  }

  /**
   * Delete an event in the calendar.
   * @param {string} eventId of the event to delete.
   * @param {string} calendarId where the event is.
   * @returns {any} Promise resolved when the event is deleted.
   */
  deleteEvent(eventId: string, calendarId: string = this.calendar): any {
    if (gapi) {
      return gapi.client.calendar.events.delete({
        calendarId: calendarId,
        eventId: eventId,
      });
    } else {
      console.error("Error: gapi is not loaded (use onLoad)");
      return null;
    }
  }

  /**
   * Update Calendar event
   * @param {string} calendarId for the event.
   * @param {string} eventId of the event.
   * @param {object} event with details to update, e.g. summary
   * @param {string} sendUpdates Acceptable values are: "all", "externalOnly", "none"
   * @returns {any}
   */
  updateEvent(
    event: object,
    eventId: string,
    calendarId: string = this.calendar,
    sendUpdates: string = "none"
  ): any {
    if (gapi) {
      //@ts-ignore the @types/gapi.calendar package is not up to date(https://developers.google.com/calendar/api/v3/reference/events/patch)
      return gapi.client.calendar.events.patch({
        calendarId: calendarId,
        eventId: eventId,
        resource: event,
        sendUpdates: sendUpdates,
      });
    } else {
      console.error("Error: gapi is not loaded (use onLoad)");
      return null;
    }
  }

  /**
   * Get Calendar event
   * @param {string} calendarId for the event.
   * @param {string} eventId specifies individual event
   * @returns {any}
   */

  getEvent(eventId: string, calendarId: string = this.calendar): any {
    if (gapi) {
      return gapi.client.calendar.events.get({
        calendarId: calendarId,
        eventId: eventId,
      });
    } else {
      console.error("Error: gapi is not loaded (use onLoad)");
      return null;
    }
  }

  /**
   * Get Calendar List
   * @returns {any}
   */
  listCalendars(): any {
    if (gapi) {
      return gapi.client.calendar.calendarList.list();
    } else {
      console.error("Error: gapi is not loaded (use onLoad)");
      return null;
    }
  }

  /**
   * Create Calendar
   * @param {string} summary, title of the calendar.
   * @returns {any}
   */
  createCalendar(summary: string): any {
    if (gapi) {
      return gapi.client.calendar.calendars.insert({ summary: summary });
    } else {
      console.error("Error: gapi is not loaded (use onLoad)");
      return null;
    }
  }
}

export default GoogleCalendarManager;
