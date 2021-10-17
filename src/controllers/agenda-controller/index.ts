import { google } from 'googleapis';
import { Route } from '../../types/http';
import { BadRequest, createController, Handlers } from '../controller';
import { ListMailsRequest, ListMailsResponse } from './types';

const list: Route<ListMailsRequest, ListMailsResponse> = async (req, res) => {
  const auth = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_ID,
  });

  const { 'google-refresh-token': refreshToken } = req.query;

  if (typeof refreshToken !== 'string') throw new BadRequest('Refresh token não informado.');

  auth.setCredentials({
    refresh_token: refreshToken,
    scope: process.env.GOOGLE_SCOPES,
  });

  const result = await google.calendar({ version: 'v3', auth }).events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 3,
    singleEvents: true,
    orderBy: 'startTime',
  });

  if (!result.data.items) throw new BadRequest('Não foi possível obter os compromissos.');

  const events = result.data.items?.map((item) => ({
    summary: item.summary,
    start: item.start,
    end: item.end,
  }));

  return res.json({ success: true, data: events || [] });
};

const handlers: Handlers = {
  list: async (req, res) => createController(list, req, res),
};

export default handlers;
