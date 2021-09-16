import { google } from 'googleapis';
import { Route } from '../../types/http';
import { ListMailsRequest, ListMailsResponse } from './types';

const list: Route<ListMailsRequest, ListMailsResponse> = async (req, res) => {
  try {
    const auth = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    });

    const { 'google-access-token': accessToken, 'google-refresh-token': refreshToken } = req.query;

    if (
      typeof accessToken !== 'string'
      || !accessToken.length
      || (!!refreshToken && typeof refreshToken !== 'string')
    ) throw new Error('Token não informado.');

    if (refreshToken?.length) {
      auth.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
        scope: process.env.GOOGLE_SCOPES,
      });

      const headers = await auth.getRequestHeaders();

      if (headers.Authorization) {
        auth.setCredentials({ access_token: headers.Authorization.split(' ')[1] });
      }
    } else {
      auth.setCredentials({
        access_token: accessToken,
        scope: process.env.GOOGLE_SCOPES,
      });
    }

    const result = await google
      .gmail({ version: 'v1', auth })
      .users.messages.list({ userId: 'me', maxResults: 5 });

    if (result.data.resultSizeEstimate === 0) return res.json({ success: true, data: [] });

    const promises = result.data.messages?.map((message) => google
      .gmail({ version: 'v1', auth })
      .users.messages.get({ id: message.id as string, userId: 'me' }));

    if (!promises) throw new Error('Erro inesperado.');

    const promisesResult = await Promise.all(promises);

    const messages = promisesResult.map((item) => {
      function getHeader(header: string) {
        return item.data.payload?.headers?.find((_header) => _header.name === header)?.value;
      }

      const date = (() => {
        const { internalDate } = item.data;
        if (!internalDate) return null;
        return new Date(parseInt(internalDate, 10));
      })();

      const unread = item.data.labelIds?.includes('UNREAD');

      const message = {
        subject: getHeader('Subject'),
        date,
        from: getHeader('From'),
        unread,
      };

      return message;
    });

    return res.json({ success: true, data: messages });
  } catch (err) {
    if (!(err instanceof Error)) {
      return res
        .status(500)
        .json({ success: false, error: 'Internal server error', message: 'Erro interno.' });
    }

    return res.status(400).json({
      success: false,
      message: 'Não foi possível obter os e-mails.',
      error: err.message,
    });
  }
};

export default {
  list,
};
